'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  Box,
  Container,
  Typography,
  Breadcrumbs,
  Link,
  Paper,
  Chip,
  Divider,
  Card,
  CardContent,
  Button,
  Alert,
} from '@mui/material'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import BusinessIcon from '@mui/icons-material/Business'
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety'
import { DoctorTileCard } from '@/components/content/DoctorTileCard'
import { FacilityCard } from '@/components/content/FacilityCard'
import { HealthPackageCard } from '@/components/content/HealthPackageCard'
import { useAppDispatch } from '@/store/hooks'
import { openModal } from '@/store/modalSlice'
import { openBottomSheet } from '@/store/bottomSheetSlice'
import { Doctor, Facility, HealthPackage } from '@/types/contentful'
import { SearchBarWithDropdown } from '@/components/ui/SearchBarWithDropdown'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { SearchResultSkeleton } from '@/components/ui/SearchResultSkeleton'
import RefreshIcon from '@mui/icons-material/Refresh'

interface SearchResult {
  id: string
  type: 'doctor' | 'facility' | 'package'
  title: string
  subtitle?: string
  action: 'modal' | 'navigate'
  url: string | null
}

interface SearchResults {
  doctors: Doctor[]
  facilities: Facility[]
  packages: HealthPackage[]
  searchResults: SearchResult[]
}

function SearchResultsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [results, setResults] = useState<SearchResults>({
    doctors: [],
    facilities: [],
    packages: [],
    searchResults: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initialize search query from URL params
  useEffect(() => {
    const urlQuery = searchParams.get('q') || ''

    if (!urlQuery || urlQuery.trim().length < 2) {
      setResults({ doctors: [], facilities: [], packages: [], searchResults: [] })
      setLoading(false)
      return
    }

    const performSearch = async () => {
      setLoading(true)
      setError(null)

      try {
        // Fetch search results with higher limit
        const response = await fetch(`/api/search?q=${encodeURIComponent(urlQuery.trim())}&limit=50`)
        
        if (!response.ok) {
          throw new Error('Failed to search. Please try again.')
        }

        const data = await response.json()
        const searchResults: SearchResult[] = data.results || []

        // Fetch full details only for doctors and packages (for better display)
        // Facilities will be shown as simple cards that navigate
        const doctorIds = searchResults
          .filter((r) => r.type === 'doctor')
          .map((r) => r.id)
        const packageIds = searchResults
          .filter((r) => r.type === 'package')
          .map((r) => r.id)

        // Fetch full details in parallel using API routes
        const [doctorsData, packagesData] = await Promise.all([
          doctorIds.length > 0
            ? Promise.all(
                doctorIds.map((id: string) =>
                  fetch(`/api/doctors/${id}`)
                    .then((r) => r.ok ? r.json() : null)
                    .catch(() => null)
                )
              ).then((items) => items.filter((item): item is Doctor => item !== null))
            : Promise.resolve([]),
          packageIds.length > 0
            ? Promise.all(
                packageIds.map((id: string) =>
                  fetch(`/api/packages/${id}`)
                    .then((r) => r.ok ? r.json() : null)
                    .catch(() => null)
                )
              ).then((items) => items.filter((item): item is HealthPackage => item !== null))
            : Promise.resolve([]),
        ])

        setResults({
          doctors: doctorsData,
          facilities: [], // Facilities will be shown from searchResults
          packages: packagesData,
          searchResults,
        })
      } catch (err: any) {
        console.error('Search error:', err)
        setError(err.message || 'Failed to search. Please try again.')
        setResults({ doctors: [], facilities: [], packages: [], searchResults: [] })
      } finally {
        setLoading(false)
      }
    }

    performSearch()
  }, [searchParams])

  const handleSearchSubmit = (query: string) => {
    if (query.trim().length >= 2) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const handleKnowMore = (packageId: string) => {
    dispatch(openModal({ type: 'package', id: packageId }))
  }

  const handleBookNow = (packageId: string, packageName: string) => {
    dispatch(openBottomSheet({ packageName }))
  }

  const handleResultClick = (result: SearchResult) => {
    if (result.action === 'navigate' && result.url) {
      router.push(result.url)
    } else if (result.action === 'modal' && (result.type === 'doctor' || result.type === 'package')) {
      dispatch(openModal({ 
        type: result.type as 'doctor' | 'package', 
        id: result.id 
      }))
    }
  }

  const totalResults = results.searchResults.length
  const urlQuery = searchParams.get('q') || ''

  return (
    <ErrorBoundary
      fallback={
        <Box sx={{ minHeight: '60vh', py: 8, backgroundColor: 'background.default' }}>
          <Container maxWidth="lg">
            <Alert severity="error" sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Page Error
              </Typography>
              <Typography variant="body2">
                An error occurred while loading search results. Please try refreshing the page.
              </Typography>
            </Alert>
            <Button variant="contained" onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </Container>
        </Box>
      }
    >
      <Box sx={{ minHeight: '60vh', py: 4, backgroundColor: 'background.default' }}>
        <Container maxWidth="lg">
          <Breadcrumbs sx={{ mb: 3 }}>
            <Link href="/" color="inherit">Home</Link>
            <Typography color="text.primary">Search Results</Typography>
          </Breadcrumbs>

          {/* Search Bar */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 2,
              backgroundColor: 'background.paper',
            }}
          >
            <SearchBarWithDropdown
              initialQuery={urlQuery}
              onViewAll={handleSearchSubmit}
              borderRadius={2}
            />
          </Paper>

        {loading ? (
          <Box sx={{ py: 4 }}>
            <SearchResultSkeleton count={6} variant="card" />
          </Box>
        ) : error ? (
          <Alert
            severity="error"
            action={
              <Button
                color="inherit"
                size="small"
                startIcon={<RefreshIcon />}
                onClick={() => {
                  setError(null)
                  setLoading(true)
                  const urlQuery = searchParams.get('q') || ''
                  if (urlQuery.trim().length >= 2) {
                    router.push(`/search?q=${encodeURIComponent(urlQuery.trim())}`)
                  }
                }}
              >
                Retry
              </Button>
            }
            sx={{ mb: 3 }}
          >
            <Typography variant="h6" gutterBottom>
              Search Error
            </Typography>
            <Typography variant="body2">
              {error.includes('network') || error.includes('fetch')
                ? 'Unable to connect to the server. Please check your internet connection and try again.'
                : error.includes('Failed to search')
                ? 'The search service is temporarily unavailable. Please try again in a moment.'
                : error}
            </Typography>
          </Alert>
        ) : totalResults === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No results found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {urlQuery
                ? `No results found for "${urlQuery}". Try adjusting your search terms.`
                : 'Please enter a search query to find doctors, facilities, or health packages.'}
            </Typography>
          </Box>
        ) : (
          <>
            {/* Results Summary */}
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
              Search Results
              {urlQuery && (
                <Typography component="span" variant="body1" color="text.secondary" sx={{ ml: 1 }}>
                  for &quot;{urlQuery}&quot;
                </Typography>
              )}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Found {totalResults} {totalResults === 1 ? 'result' : 'results'}
            </Typography>

            {/* Doctors Section */}
            {results.doctors.length > 0 && (
              <Box sx={{ mb: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <LocalHospitalIcon color="primary" />
                  <Typography variant="h6" color="primary">
                    Doctors ({results.doctors.length})
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr',
                      sm: 'repeat(2, 1fr)',
                      md: 'repeat(3, 1fr)',
                      lg: 'repeat(4, 1fr)',
                    },
                    gap: 3,
                  }}
                >
                  {results.doctors.map((doctor) => (
                    <DoctorTileCard key={doctor.sys.id} doctor={doctor} />
                  ))}
                </Box>
              </Box>
            )}


            {/* Facilities Section */}
            {results.searchResults.filter((r) => r.type === 'facility').length > 0 && (
              <Box sx={{ mb: 6 }}>
                {(results.doctors.length > 0 || results.packages.length > 0) && (
                  <Divider sx={{ mb: 4 }} />
                )}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <BusinessIcon color="secondary" />
                  <Typography variant="h6" color="secondary">
                    Facilities ({results.searchResults.filter((r) => r.type === 'facility').length})
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr',
                      sm: 'repeat(2, 1fr)',
                      md: 'repeat(3, 1fr)',
                    },
                    gap: 3,
                  }}
                >
                  {results.searchResults
                    .filter((r) => r.type === 'facility')
                    .map((result) => (
                      <Card
                        key={`facility-${result.id}`}
                        sx={{
                          cursor: 'pointer',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          '&:hover': {
                            boxShadow: 4,
                            transform: 'translateY(-4px)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                        onClick={() => handleResultClick(result)}
                      >
                        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <BusinessIcon color="secondary" />
                            <Chip
                              label="Facility"
                              size="small"
                              color="secondary"
                              variant="outlined"
                            />
                          </Box>
                          <Typography variant="h6" gutterBottom>
                            {result.title}
                          </Typography>
                          {result.subtitle && (
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              {result.subtitle}
                            </Typography>
                          )}
                          <Button
                            variant="contained"
                            color="secondary"
                            sx={{ mt: 'auto' }}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleResultClick(result)
                            }}
                          >
                            View Details
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                </Box>
              </Box>
            )}

            {/* Packages Section */}
            {results.packages.length > 0 && (
              <Box sx={{ mb: 6 }}>
                {(results.doctors.length > 0 || results.searchResults.filter((r) => r.type === 'facility').length > 0) && (
                  <Divider sx={{ mb: 4 }} />
                )}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <HealthAndSafetyIcon color="success" />
                  <Typography variant="h6" color="success.main">
                    Health Packages ({results.packages.length})
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr',
                      sm: 'repeat(2, 1fr)',
                      md: 'repeat(3, 1fr)',
                    },
                    gap: 3,
                  }}
                >
                  {results.packages.map((pkg) => (
                    <HealthPackageCard
                      key={pkg.sys.id}
                      healthPackage={pkg}
                      onKnowMore={() => handleKnowMore(pkg.sys.id)}
                      onBookNow={() => handleBookNow(pkg.sys.id, pkg.fields.title)}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
    </ErrorBoundary>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <Box sx={{ minHeight: '60vh', py: 4, backgroundColor: 'background.default' }}>
        <Container maxWidth="lg">
          <SearchResultSkeleton count={6} variant="card" />
        </Container>
      </Box>
    }>
      <SearchResultsContent />
    </Suspense>
  )
}


