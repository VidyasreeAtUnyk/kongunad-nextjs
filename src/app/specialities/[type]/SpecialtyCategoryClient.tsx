'use client'

import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Paper,
  Chip,
  Link,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { SpecialtyCard } from '@/components/content/SpecialtyCard'
import { Specialty } from '@/types/contentful'

interface SpecialtyCategoryClientProps {
  specialties: Specialty[]
  typeName: string
  typeSlug: string
  allTypes: Array<{ name: string; slug: string }>
}

// Map type slugs to display names
const TYPE_NAMES: Record<string, string> = {
  'medical-specialties': 'Medical Specialties',
  'surgical-specialties': 'Surgical Specialties',
}

export const SpecialtyCategoryClient: React.FC<SpecialtyCategoryClientProps> = ({
  specialties,
  typeName,
  typeSlug,
  allTypes,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const router = useRouter()

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Filter specialties
  const filteredSpecialties = useMemo(() => {
    if (!debouncedSearchQuery.trim()) {
      return specialties
    }

    const query = debouncedSearchQuery.toLowerCase()
    return specialties.filter((specialty) => {
      const nameMatch = specialty.fields.name.toLowerCase().includes(query)
      const descMatch = specialty.fields.description?.toLowerCase().includes(query)
      return nameMatch || descMatch
    })
  }, [specialties, debouncedSearchQuery])

  const handleTypeChange = useCallback((newTypeSlug: string) => {
    router.push(`/specialities/${newTypeSlug}`)
  }, [router])

  return (
    <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', lg: 'row' } }}>
      {/* Main Content */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {/* Search Bar */}
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            placeholder="Search specialties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              backgroundColor: 'white',
              borderRadius: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Results Count */}
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Showing {filteredSpecialties.length} {filteredSpecialties.length === 1 ? 'specialty' : 'specialties'}
          {debouncedSearchQuery && ` for "${debouncedSearchQuery}"`}
        </Typography>

        {/* Specialties Grid - 3 columns */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(3, 1fr)',
            },
            gap: 3,
            mb: 6,
            width: '100%',
            maxWidth: '100%',
            overflow: 'hidden',
          }}
        >
          {filteredSpecialties.map((specialty) => (
            <SpecialtyCard key={specialty.sys.id} specialty={specialty} />
          ))}
        </Box>

        {filteredSpecialties.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No specialties found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search criteria
            </Typography>
          </Box>
        )}
      </Box>

      {/* Sidebar - Type Switcher & Info */}
      <Box 
        sx={{ 
          width: { xs: '100%', lg: 320 },
          flexShrink: 0,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            backgroundColor: 'grey.50',
            border: '1px solid',
            borderColor: 'grey.200',
            position: { lg: 'sticky' },
            top: 100,
          }}
        >
          <Typography variant="h6" fontWeight={600} gutterBottom color="primary">
            Browse Types
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Quickly switch between specialty types
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {allTypes.map((type) => {
              const isActive = type.slug === typeSlug
              return (
                <Link
                  key={type.slug}
                  href={`/specialities/${type.slug}`}
                  onClick={(e) => {
                    e.preventDefault()
                    handleTypeChange(type.slug)
                  }}
                  sx={{
                    textDecoration: 'none',
                    display: 'block',
                  }}
                >
                  <Chip
                    label={type.name}
                    clickable
                    color={isActive ? 'primary' : 'default'}
                    variant={isActive ? 'filled' : 'outlined'}
                    sx={{
                      width: '100%',
                      justifyContent: 'flex-start',
                      height: 40,
                      '&:hover': {
                        backgroundColor: isActive ? 'primary.dark' : 'action.hover',
                      },
                    }}
                  />
                </Link>
              )
            })}
          </Box>

          {/* Quick Stats */}
          <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'grey.300' }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              Total Specialties
            </Typography>
            <Typography variant="h4" fontWeight={700} color="primary">
              {specialties.length}
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}

