'use client'

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Box, TextField, InputAdornment, Alert } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { useSearch, SearchResult } from '@/hooks/useSearch'
import { SearchDropdown } from './SearchDropdown'
import { useAppDispatch } from '@/store/hooks'
import { openModal } from '@/store/modalSlice'
import { ErrorBoundary } from './ErrorBoundary'

interface SearchBarWithDropdownProps {
  placeholder?: string
  initialQuery?: string
  onQueryChange?: (query: string) => void
  onViewAll?: (query: string) => void
  onSelect?: (result: SearchResult) => void
  textFieldSx?: object
  containerSx?: object
  variant?: 'outlined' | 'filled' | 'standard'
  borderRadius?: string | number
  maxWidth?: string | number
}

export const SearchBarWithDropdown: React.FC<SearchBarWithDropdownProps> = ({
  placeholder = 'Search for doctors, facilities, services...',
  initialQuery = '',
  onQueryChange,
  onViewAll,
  onSelect,
  textFieldSx = {},
  containerSx = {},
  variant = 'outlined',
  borderRadius,
  maxWidth,
}) => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { query, setQuery, results, loading, error, clearSearch } = useSearch()
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const initialQueryRef = useRef<string | undefined>(undefined)
  const isSyncingFromInitialRef = useRef(false)
  const onQueryChangeRef = useRef(onQueryChange)
  const onViewAllRef = useRef(onViewAll)
  const onSelectRef = useRef(onSelect)

  // Keep refs in sync with props
  useEffect(() => {
    onQueryChangeRef.current = onQueryChange
    onViewAllRef.current = onViewAll
    onSelectRef.current = onSelect
  }, [onQueryChange, onViewAll, onSelect])

  // Initialize query from prop if provided (only on mount or when initialQuery changes externally)
  useEffect(() => {
    // Only sync if initialQuery is provided and different from current query
    // And only if it's a new initialQuery value (not from user typing)
    if (initialQuery !== undefined && initialQuery !== initialQueryRef.current) {
      initialQueryRef.current = initialQuery
      if (initialQuery !== query) {
        isSyncingFromInitialRef.current = true
        setQuery(initialQuery)
        // Don't auto-open dropdown when initialQuery is set from external source (e.g., URL params)
        // The dropdown should only open when user is actively typing
        setDropdownOpen(false)
        // Reset the flag after a brief moment to allow user input detection
        setTimeout(() => {
          isSyncingFromInitialRef.current = false
        }, 0)
      }
    }
  }, [initialQuery]) // eslint-disable-line react-hooks/exhaustive-deps

  // Update dropdown open state based on query (only when user is typing, not from initialQuery)
  useEffect(() => {
    // Don't auto-open if we're currently syncing from initialQuery
    if (isSyncingFromInitialRef.current) {
      return
    }
    
    // Auto-open dropdown when user types (query length >= 2)
    if (query.length >= 2 && !error) {
      setDropdownOpen(true)
    } else if (query.length < 2) {
      setDropdownOpen(false)
    }
  }, [query, error])

  // Notify parent of query changes (using ref to avoid dependency issues)
  useEffect(() => {
    if (onQueryChangeRef.current) {
      onQueryChangeRef.current(query)
    }
  }, [query])

  const handleSelect = useCallback(
    (result: SearchResult) => {
      setDropdownOpen(false)
      clearSearch()

      // Use custom handler if provided, otherwise use default behavior
      if (onSelectRef.current) {
        onSelectRef.current(result)
        return
      }

      // Default behavior
      if (result.action === 'navigate' && result.url) {
        router.push(result.url)
      } else if (result.action === 'modal' && (result.type === 'doctor' || result.type === 'package')) {
        dispatch(
          openModal({
            type: result.type as 'doctor' | 'package',
            id: result.id,
          })
        )
      }
    },
    [clearSearch, router, dispatch]
  )

  const handleViewAll = useCallback(
    (searchQuery: string) => {
      setDropdownOpen(false)
      clearSearch()

      // Use custom handler if provided, otherwise use default behavior
      if (onViewAllRef.current) {
        onViewAllRef.current(searchQuery)
        return
      }

      // Default behavior: navigate to search page
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    },
    [clearSearch, router]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && query.trim().length >= 2) {
        e.preventDefault()
        handleViewAll(query)
      } else if (e.key === 'Escape') {
        setDropdownOpen(false)
      }
    },
    [query, handleViewAll]
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value)
    },
    [setQuery]
  )

  // Handle click outside to close dropdown (but keep query text)
  useEffect(() => {
    if (!dropdownOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false)
      }
    }

    // Use capture phase for better performance
    document.addEventListener('mousedown', handleClickOutside, true)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true)
    }
  }, [dropdownOpen])

  return (
    <ErrorBoundary
      fallback={
        <Alert severity="error" sx={{ mb: 2 }}>
          Search functionality is temporarily unavailable. Please refresh the page.
        </Alert>
      }
    >
      <Box
        ref={searchContainerRef}
        sx={{
          position: 'relative',
          ...(maxWidth && { maxWidth }),
          ...containerSx,
        }}
      >
        <TextField
          fullWidth
          placeholder={placeholder}
          variant={variant}
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          error={!!error}
          helperText={error ? (
            <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {error}
              {error.includes('network') || error.includes('fetch') ? (
                <Box component="span" sx={{ fontSize: '0.75rem', opacity: 0.8 }}>
                  - Check your connection
                </Box>
              ) : null}
            </Box>
          ) : undefined}
          sx={{
            '& .MuiOutlinedInput-root': {
              ...(borderRadius && { borderRadius }),
            },
            ...textFieldSx,
          }}
          InputProps={useMemo(
            () => ({
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }),
            []
          )}
        />
        <ErrorBoundary
          fallback={null} // Silently fail dropdown if it errors
        >
          <SearchDropdown
            results={results}
            loading={loading}
            open={dropdownOpen}
            onSelect={handleSelect}
            onViewAll={handleViewAll}
            query={query}
          />
        </ErrorBoundary>
      </Box>
    </ErrorBoundary>
  )
}

