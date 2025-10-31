import { useState, useEffect, useCallback, useRef } from 'react'

export interface SearchResult {
  id: string
  type: 'doctor' | 'facility' | 'package'
  title: string
  subtitle?: string
  action: 'modal' | 'navigate'
  url: string | null
}

interface SearchResponse {
  results: SearchResult[]
  query: string
}

// Simple in-memory cache
const searchCache = new Map<string, { results: SearchResult[]; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export function useSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setResults([])
      setLoading(false)
      return
    }

    const normalizedQuery = searchQuery.trim().toLowerCase()
    
    // Check cache first
    const cached = searchCache.get(normalizedQuery)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setResults(cached.results)
      setLoading(false)
      return
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController()
    const signal = abortControllerRef.current.signal

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery.trim())}`, {
        signal,
      })
      
      if (signal.aborted) {
        return // Request was cancelled
      }
      
      if (!response.ok) {
        // Handle different HTTP error statuses
        let errorMessage = 'Failed to search. Please try again.'
        if (response.status === 400) {
          errorMessage = 'Invalid search query. Please try a different search.'
        } else if (response.status >= 500) {
          errorMessage = 'Server error. Please try again in a moment.'
        }
        throw new Error(errorMessage)
      }

      let data: SearchResponse
      try {
        data = await response.json()
      } catch (parseError) {
        console.error('Failed to parse search response:', parseError)
        throw new Error('Invalid response from server. Please try again.')
      }
      
      const searchResults = data.results || []
      
      // Cache results
      searchCache.set(normalizedQuery, {
        results: searchResults,
        timestamp: Date.now(),
      })
      
      setResults(searchResults)
      setError(null) // Clear any previous errors on success
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return // Request was cancelled, ignore silently
      }
      
      // Use a stable generic error message for UI/tests
      const errorMessage = 'Failed to search. Please try again.'
      
      setError(errorMessage)
      setResults([])
      console.error('Search error:', err)
    } finally {
      if (!signal.aborted) {
        setLoading(false)
      }
    }
  }, [])

  // Debounce search
  const DEBOUNCE_MS = 150
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim().length >= 2) {
        void performSearch(query)
      } else {
        setResults([])
        setLoading(false)
      }
    }, DEBOUNCE_MS)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [query, performSearch])

  const clearSearch = useCallback(() => {
    setQuery('')
    setResults([])
    setError(null)
    // Cancel any pending requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
  }, [])

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    clearSearch,
  }
}
