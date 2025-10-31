/**
 * @jest-environment node
 */

/// <reference types="jest" />

import { GET } from '@/app/api/search/route'
import { NextRequest } from 'next/server'
import { getClient } from '@/lib/contentful'

// Mock Contentful client
jest.mock('@/lib/contentful', () => ({
  getClient: jest.fn(),
}))

describe('Search API Route', () => {
  let mockGetEntries: jest.MockedFunction<any>

  beforeEach(() => {
    jest.clearAllMocks()
    mockGetEntries = jest.fn()
    ;(getClient as jest.MockedFunction<typeof getClient>).mockReturnValue({
      getEntries: mockGetEntries,
    } as any)
  })

  it('should return empty results for query less than 2 characters', async () => {
    const request = new NextRequest('http://localhost:3000/api/search?q=a')

    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.results).toEqual([])
    expect(mockGetEntries).not.toHaveBeenCalled()
  })

  it('should return 400 for missing query parameter', async () => {
    const request = new NextRequest('http://localhost:3000/api/search')

    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBeDefined()
  })

  it('should search across all content types', async () => {
    const mockDoctors = {
      items: [
        {
          sys: { id: '1' },
          fields: {
            doctorName: 'Dr. John Doe',
            speciality: 'Cardiology',
            department: 'Cardiology',
          },
        },
      ],
    }

    const mockFacilities = {
      items: [
        {
          sys: { id: '2' },
          fields: {
            name: 'Emergency Department',
            category: 'Emergency Services',
            slug: 'emergency-department',
          },
        },
      ],
    }

    const mockPackages = {
      items: [
        {
          sys: { id: '3' },
          fields: {
            title: 'Health Checkup',
            category: 'General',
          },
        },
      ],
    }

    mockGetEntries
      .mockResolvedValueOnce(mockDoctors)
      .mockResolvedValueOnce(mockFacilities)
      .mockResolvedValueOnce(mockPackages)

    const request = new NextRequest('http://localhost:3000/api/search?q=test')

    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.results).toHaveLength(3)
    expect(data.results[0].type).toBe('doctor')
    expect(data.results[0].title).toBe('Dr. John Doe')
    expect(data.results[1].type).toBe('facility')
    expect(data.results[1].title).toBe('Emergency Department')
    expect(data.results[2].type).toBe('package')
    expect(data.results[2].title).toBe('Health Checkup')

    expect(mockGetEntries).toHaveBeenCalledTimes(3)
  })

  it('should format doctor results correctly', async () => {
    const mockDoctors = {
      items: [
        {
          sys: { id: '1' },
          fields: {
            doctorName: 'Dr. Jane Smith',
            speciality: 'Neurology',
            department: 'Neurology',
          },
        },
      ],
    }

    mockGetEntries
      .mockResolvedValueOnce(mockDoctors)
      .mockResolvedValueOnce({ items: [] })
      .mockResolvedValueOnce({ items: [] })

    const request = new NextRequest('http://localhost:3000/api/search?q=jane')

    const response = await GET(request)
    const data = await response.json()

    expect(data.results[0]).toEqual({
      id: '1',
      type: 'doctor',
      title: 'Dr. Jane Smith',
      subtitle: 'Neurology',
      action: 'modal',
      url: null,
    })
  })

  it('should format facility results correctly', async () => {
    const mockFacilities = {
      items: [
        {
          sys: { id: '2' },
          fields: {
            name: 'Pharmacy',
            category: 'Supportive Medical Departments',
            slug: 'pharmacy',
          },
        },
      ],
    }

    mockGetEntries
      .mockResolvedValueOnce({ items: [] })
      .mockResolvedValueOnce(mockFacilities)
      .mockResolvedValueOnce({ items: [] })

    const request = new NextRequest('http://localhost:3000/api/search?q=pharmacy')

    const response = await GET(request)
    const data = await response.json()

    expect(data.results[0]).toEqual({
      id: '2',
      type: 'facility',
      title: 'Pharmacy',
      subtitle: 'Supportive Medical Departments',
      action: 'navigate',
      url: '/facilities/pharmacy',
    })
  })

  it('should format package results correctly', async () => {
    const mockPackages = {
      items: [
        {
          sys: { id: '3' },
          fields: {
            title: 'Master Health Checkup',
            category: 'General',
          },
        },
      ],
    }

    mockGetEntries
      .mockResolvedValueOnce({ items: [] })
      .mockResolvedValueOnce({ items: [] })
      .mockResolvedValueOnce(mockPackages)

    const request = new NextRequest('http://localhost:3000/api/search?q=checkup')

    const response = await GET(request)
    const data = await response.json()

    expect(data.results[0]).toEqual({
      id: '3',
      type: 'package',
      title: 'Master Health Checkup',
      subtitle: 'General',
      action: 'modal',
      url: null,
    })
  })

  it('should handle Contentful errors gracefully', async () => {
    // Mock getEntries to return a promise that rejects, but wrapped properly
    const mockGetEntriesRejecting = jest.fn().mockRejectedValueOnce(new Error('Contentful error'))
    const mockGetEntriesSuccess = jest.fn().mockResolvedValueOnce({ items: [] })
    
    ;(getClient as jest.MockedFunction<typeof getClient>).mockReturnValue({
      getEntries: jest.fn()
        .mockRejectedValueOnce(new Error('Contentful error'))
        .mockResolvedValueOnce({ items: [] })
        .mockResolvedValueOnce({ items: [] })
    } as any)

    const request = new NextRequest('http://localhost:3000/api/search?q=test')

    const response = await GET(request)
    const data = await response.json()

    // Should still return results from successful calls
    expect(response.status).toBe(200)
    expect(Array.isArray(data.results)).toBe(true)
  })

  it('should sanitize query parameters', async () => {
    mockGetEntries
      .mockResolvedValueOnce({ items: [] })
      .mockResolvedValueOnce({ items: [] })
      .mockResolvedValueOnce({ items: [] })

    const request = new NextRequest('http://localhost:3000/api/search?q=<script>alert("xss")</script>')

    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    // Sanitized query should not contain < or >
    expect(data.query).not.toMatch(/[<>]/)
  })

  it('should limit query length to 100 characters', async () => {
    mockGetEntries
      .mockResolvedValueOnce({ items: [] })
      .mockResolvedValueOnce({ items: [] })
      .mockResolvedValueOnce({ items: [] })

    const longQuery = 'a'.repeat(150)
    const request = new NextRequest(`http://localhost:3000/api/search?q=${longQuery}`)

    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.query.length).toBeLessThanOrEqual(100)
  })

  it('should set cache headers', async () => {
    mockGetEntries
      .mockResolvedValueOnce({ items: [] })
      .mockResolvedValueOnce({ items: [] })
      .mockResolvedValueOnce({ items: [] })

    const request = new NextRequest('http://localhost:3000/api/search?q=test')

    const response = await GET(request)

    expect(response.headers.get('Cache-Control')).toContain('s-maxage')
  })
})

