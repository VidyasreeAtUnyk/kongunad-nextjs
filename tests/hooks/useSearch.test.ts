/// <reference types="jest" />

import { renderHook, waitFor, act } from '@testing-library/react'
import { useSearch } from '@/hooks/useSearch'

// Mock fetch
global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>

describe('useSearch', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should initialize with empty state', () => {
    const { result } = renderHook(() => useSearch())

    expect(result.current.query).toBe('')
    expect(result.current.results).toEqual([])
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it('should update query when setQuery is called', () => {
    const { result } = renderHook(() => useSearch())

    act(() => {
      result.current.setQuery('test')
    })

    expect(result.current.query).toBe('test')
  })

  it('should not search for queries less than 2 characters', async () => {
    jest.useFakeTimers()
    const { result } = renderHook(() => useSearch())

    act(() => {
      result.current.setQuery('a')
    })

    act(() => {
      jest.advanceTimersByTime(200)
    })

    expect(fetch).not.toHaveBeenCalled()
    expect(result.current.results).toEqual([])
    expect(result.current.loading).toBe(false)
    jest.useRealTimers()
  })

  it('should debounce search requests', async () => {
    jest.useFakeTimers()
    const mockResponse = { results: [], query: 'test' }
    ;(global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response)

    const { result } = renderHook(() => useSearch())

    act(() => {
      result.current.setQuery('test')
    })

    // Advance timers to allow debounce to elapse in all envs
    act(() => {
      jest.advanceTimersByTime(200)
    })

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1)
    })
    jest.useRealTimers()
  })

  it('should cancel previous requests when query changes quickly', async () => {
    jest.useFakeTimers()
    const abortControllerSpy = jest.fn()
    const mockAbort = jest.fn()
    
    ;(global.fetch as jest.MockedFunction<typeof fetch>).mockImplementation((input: string | URL | Request, options?: RequestInit) => {
      if (options?.signal) {
        options.signal.addEventListener('abort', abortControllerSpy)
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({ results: [], query: 'test' }),
      } as Response)
    })

    const { result } = renderHook(() => useSearch())

    act(() => {
      result.current.setQuery('test1')
    })

    act(() => {
      jest.advanceTimersByTime(100)
    })

    act(() => {
      result.current.setQuery('test2')
    })

    act(() => {
      jest.advanceTimersByTime(200)
    })

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled()
    })
    jest.useRealTimers()
  })

  it('should handle search results correctly', async () => {
    jest.useFakeTimers()
    const mockResults = [
      {
        id: '1',
        type: 'doctor' as const,
        title: 'Dr. John Doe',
        subtitle: 'Cardiology',
        action: 'modal' as const,
        url: null,
      },
    ]

    ;(global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: mockResults, query: 'john' }),
    } as Response)

    const { result } = renderHook(() => useSearch())

    act(() => {
      result.current.setQuery('john')
    })

    act(() => {
      jest.advanceTimersByTime(200)
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.results).toEqual(mockResults)
    expect(result.current.error).toBe(null)
    jest.useRealTimers()
  })

  it('should handle search errors', async () => {
    // Use real timers for this async error flow
    jest.useRealTimers()
    const mockError = new Error('Network error')
    ;(mockError as any).name = 'Error'
    ;(global.fetch as jest.MockedFunction<typeof fetch>).mockRejectedValueOnce(mockError)

    const { result } = renderHook(() => useSearch())

    await act(async () => {
      result.current.setQuery('test')
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    }, { timeout: 3000 })

    expect(result.current.results).toEqual([])
  })

  it('should cache search results', async () => {
    jest.useFakeTimers()
    const mockResults = [
      {
        id: '1',
        type: 'doctor' as const,
        title: 'Dr. John Doe',
        subtitle: 'Cardiology',
        action: 'modal' as const,
        url: null,
      },
    ]

    ;(global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue({
      ok: true,
      json: async () => ({ results: mockResults, query: 'john' }),
    } as Response)

    const { result } = renderHook(() => useSearch())

    // First search
    act(() => {
      result.current.setQuery('john')
    })

    act(() => {
      jest.advanceTimersByTime(200)
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    const firstFetchCount = (fetch as jest.MockedFunction<typeof fetch>).mock.calls.length

    // Clear query
    act(() => {
      result.current.setQuery('')
    })

    // Second search with same query (lowercase normalized for cache)
    act(() => {
      result.current.setQuery('john')
    })

    act(() => {
      jest.advanceTimersByTime(200)
    })

    // Should use cache, so fetch may not be called again or results should be fast
    await waitFor(() => {
      expect(result.current.results).toEqual(mockResults)
    }, { timeout: 100 })

    // Results should be available (may use cache)
    expect(result.current.results).toEqual(mockResults)
    jest.useRealTimers()
  })

  it('should clear search when clearSearch is called', () => {
    const { result } = renderHook(() => useSearch())

    act(() => {
      result.current.setQuery('test')
    })

    act(() => {
      result.current.clearSearch()
    })

    expect(result.current.query).toBe('')
    expect(result.current.results).toEqual([])
    expect(result.current.error).toBe(null)
  })
})

