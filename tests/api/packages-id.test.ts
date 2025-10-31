jest.mock('next/server', () => ({
  NextResponse: {
    json: (body: any, init?: any) => {
      const headersObj = (init?.headers as Record<string, string>) || {}
      return {
        status: init?.status ?? 200,
        json: async () => body,
        headers: { get: (k: string) => headersObj[k] ?? null },
      }
    },
  },
}))

jest.mock('@/lib/contentful')

describe('API: /api/packages/[id]', () => {
  test('returns 400 when id is missing', async () => {
    const req = {} as any
    // @ts-expect-error params type in route is Promise
    const { GET } = require('@/app/api/packages/[id]/route')
    const res = await GET(req, { params: Promise.resolve({ id: '' }) })
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body).toEqual({ error: 'Package ID is required' })
  })

  test('returns 200 with entry when found', async () => {
    const req = {} as any
    const { GET } = require('@/app/api/packages/[id]/route')
    const { getClient } = require('@/lib/contentful')
    getClient.mockReturnValue({
      getEntry: jest.fn().mockResolvedValue({ id: 'pack1', fields: { name: 'Gold' } }),
    })

    // @ts-expect-error params type in route is Promise
    const res = await GET(req, { params: Promise.resolve({ id: 'pack1' }) })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual({ id: 'pack1', fields: { name: 'Gold' } })
    expect(res.headers.get('Cache-Control')).toContain('s-maxage')
  })

  test('returns 404 when contentful throws', async () => {
    const req = {} as any
    const { GET } = require('@/app/api/packages/[id]/route')
    const { getClient } = require('@/lib/contentful')
    getClient.mockReturnValue({
      getEntry: jest.fn().mockRejectedValue(new Error('not found')),
    })

    // @ts-expect-error params type in route is Promise
    const res = await GET(req, { params: Promise.resolve({ id: 'oops' }) })
    expect(res.status).toBe(404)
    const body = await res.json()
    expect(body).toEqual({ error: 'Package not found' })
  })
})


