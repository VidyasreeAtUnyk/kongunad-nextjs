import React from 'react'
import { Metadata } from 'next'
import {
  Box,
  Container,
  Typography,
  Breadcrumbs,
  Link,
} from '@mui/material'
import { FacilityCard } from '@/components/content/FacilityCard'
import { getFacilities } from '@/lib/contentful'
import { Facility } from '@/types/contentful'

interface FacilitiesPageProps {
  searchParams: Promise<{
    category?: string
  }>
}

export const metadata: Metadata = {
  title: 'Our Facilities - Kongunad Hospital',
  description: 'Explore our state-of-the-art medical facilities and equipment at Kongunad Hospital.',
}

export default async function FacilitiesPage({ searchParams }: FacilitiesPageProps) {
  try {
    const { category } = await searchParams
    const facilities = await getFacilities() as unknown as Facility[]
    const selectedCategory = category

    // Filter facilities by category if specified
    const filteredFacilities = selectedCategory 
      ? facilities.filter(facility => 
          facility.fields.category.toLowerCase() === selectedCategory.toLowerCase()
        )
      : facilities

    // Get unique categories for filtering
    const categories = Array.from(new Set(facilities.map(f => f.fields.category)))

    return (
      <Box>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Breadcrumbs */}
          <Breadcrumbs sx={{ mb: 3 }}>
            <Link href="/" color="inherit">
              Home
            </Link>
            <Typography color="text.primary">Facilities</Typography>
          </Breadcrumbs>

          {/* Page Header */}
          <Typography variant="h1" gutterBottom color="primary">
            Our Facilities
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
            State-of-the-art medical facilities and equipment designed to provide the best healthcare services.
          </Typography>

          {/* Category Filter */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Filter by Category:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Link 
                href="/facilities" 
                sx={{ 
                  textDecoration: 'none',
                  px: 2, 
                  py: 1, 
                  borderRadius: 1,
                  bgcolor: !selectedCategory ? 'primary.main' : 'grey.200',
                  color: !selectedCategory ? 'white' : 'text.primary',
                  '&:hover': {
                    bgcolor: !selectedCategory ? 'primary.dark' : 'grey.300',
                  }
                }}
              >
                All Facilities
              </Link>
              {categories.map((category) => (
                <Link 
                  key={category}
                  href={`/facilities?category=${encodeURIComponent(category)}`}
                  sx={{ 
                    textDecoration: 'none',
                    px: 2, 
                    py: 1, 
                    borderRadius: 1,
                    bgcolor: selectedCategory === category ? 'primary.main' : 'grey.200',
                    color: selectedCategory === category ? 'white' : 'text.primary',
                    '&:hover': {
                      bgcolor: selectedCategory === category ? 'primary.dark' : 'grey.300',
                    }
                  }}
                >
                  {category}
                </Link>
              ))}
            </Box>
          </Box>

          {/* Facilities Grid */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
            {filteredFacilities.map((facility) => (
              <Box key={facility.sys.id} sx={{ width: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(33.333% - 22px)' } }}>
                <FacilityCard facility={facility} />
              </Box>
            ))}
          </Box>

          {filteredFacilities.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                No facilities found for the selected category.
              </Typography>
            </Box>
          )}
        </Container>
      </Box>
    )
  } catch (error) {
    return (
      <Box>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Typography variant="h1" gutterBottom color="primary">
            Our Facilities
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
            State-of-the-art medical facilities and equipment designed to provide the best healthcare services.
          </Typography>
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              Facilities will be available once Contentful is configured.
            </Typography>
          </Box>
        </Container>
      </Box>
    )
  }
}
