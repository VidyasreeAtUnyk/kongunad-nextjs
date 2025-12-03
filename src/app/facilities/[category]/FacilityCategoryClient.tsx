'use client'

import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Link,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { FacilityCard } from '@/components/content/FacilityCard'
import { Facility } from '@/types/contentful'

interface FacilityCategoryClientProps {
  facilities: Facility[]
  categoryName: string
  categorySlug: string
  allCategories: Array<{ name: string; slug: string }>
}

// Map category slugs to display names
const CATEGORY_NAMES: Record<string, string> = {
  'out-patient-services': 'Out Patient Services',
  'inpatient-services': 'Inpatient Services',
  'supportive-medical-departments': 'Supportive Medical Departments',
  'other-diagnostic-facilities': 'Other Diagnostic Facilities',
  'radiology-imaging-services': 'Radiology & Imaging Services',
  'laboratory-services': 'Laboratory Services',
  'endoscopy-services': 'Endoscopy Services',
  'non-medical-supportive-departments': 'Non Medical Supportive Departments',
}

export const FacilityCategoryClient: React.FC<FacilityCategoryClientProps> = ({
  facilities,
  categoryName,
  categorySlug,
  allCategories,
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

  // Filter facilities
  const filteredFacilities = useMemo(() => {
    if (!debouncedSearchQuery.trim()) {
      return facilities
    }

    const query = debouncedSearchQuery.toLowerCase()
    return facilities.filter((facility) => {
      const nameMatch = facility.fields.name.toLowerCase().includes(query)
      const descMatch = facility.fields.description?.toLowerCase().includes(query)
      return nameMatch || descMatch
    })
  }, [facilities, debouncedSearchQuery])

  const handleCategoryChange = useCallback((newCategorySlug: string) => {
    router.push(`/facilities/${newCategorySlug}`)
  }, [router])

  return (
    <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', lg: 'row' } }}>
      {/* Main Content */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {/* Search Bar */}
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            placeholder="Search facilities..."
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
          Showing {filteredFacilities.length} {filteredFacilities.length === 1 ? 'facility' : 'facilities'}
          {debouncedSearchQuery && ` for "${debouncedSearchQuery}"`}
        </Typography>

        {/* Facilities Grid - 4 columns */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {filteredFacilities.map((facility) => (
            <Grid item xs={12} sm={6} md={3} key={facility.sys.id}>
              <FacilityCard facility={facility} />
            </Grid>
          ))}
        </Grid>

        {filteredFacilities.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No facilities found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search criteria
            </Typography>
          </Box>
        )}
      </Box>

      {/* Sidebar - Category Switcher & Info */}
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
            Browse Categories
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Quickly switch between facility categories
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {allCategories.map((cat) => {
              const isActive = cat.slug === categorySlug
              return (
                <Link
                  key={cat.slug}
                  href={`/facilities/${cat.slug}`}
                  onClick={(e) => {
                    e.preventDefault()
                    handleCategoryChange(cat.slug)
                  }}
                  sx={{
                    textDecoration: 'none',
                    display: 'block',
                  }}
                >
                  <Chip
                    label={cat.name}
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
              Total Facilities
            </Typography>
            <Typography variant="h4" fontWeight={700} color="primary">
              {facilities.length}
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}

