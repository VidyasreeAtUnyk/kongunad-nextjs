import React from 'react'
import { Metadata } from 'next'
import {
  Box,
  Container,
  Typography,
  Breadcrumbs,
  Link,
  Paper,
  Card,
  CardContent,
} from '@mui/material'
import { getFacilitiesCached, getFacilityCategories } from '@/lib/contentful'
import { Facility } from '@/types/contentful'

export const metadata: Metadata = {
  title: 'Our Facilities - Kongunad Hospital',
  description: 'Explore our state-of-the-art medical facilities and equipment at Kongunad Hospital.',
}

export const revalidate = 300

// Category metadata mapping (descriptions and icons not stored in Contentful)
const CATEGORY_METADATA: Record<string, { description: string; icon: string }> = {
  'out-patient-services': {
    description: 'Comprehensive outpatient care services',
    icon: '🏥',
  },
  'inpatient-services': {
    description: 'Complete inpatient care and room services',
    icon: '🛏️',
  },
  'supportive-medical-departments': {
    description: 'Essential support services for patient care',
    icon: '💊',
  },
  'other-diagnostic-facilities': {
    description: 'Advanced diagnostic and testing services',
    icon: '🔬',
  },
  'radiology-imaging-services': {
    description: 'State-of-the-art imaging and radiology',
    icon: '📷',
  },
  'laboratory-services': {
    description: 'Comprehensive laboratory testing',
    icon: '🧪',
  },
  'endoscopy-services': {
    description: 'Advanced endoscopic procedures',
    icon: '🔍',
  },
  'non-medical-supportive-departments': {
    description: 'Administrative and support services',
    icon: '📋',
  },
}

export default async function FacilitiesPage() {
  try {
    const facilities = await getFacilitiesCached() as unknown as Facility[]
    const categories = await getFacilityCategories()
    
    // Get facility counts per category
    const categoryCounts = new Map<string, number>()
    facilities.forEach((facility) => {
      if (facility.fields.categorySlug) {
        const count = categoryCounts.get(facility.fields.categorySlug) || 0
        categoryCounts.set(facility.fields.categorySlug, count + 1)
      }
    })

    // Enrich categories with metadata and filter to only show categories that exist in data
    const enrichedCategories = categories
      .map((category) => {
        const metadata = CATEGORY_METADATA[category.slug]
        if (!metadata) return null // Skip categories without metadata
        
        return {
          ...category,
          description: metadata.description,
          icon: metadata.icon,
        }
      })
      .filter((cat): cat is NonNullable<typeof cat> => cat !== null)

    return (
      <Box sx={{ minHeight: '60vh', backgroundColor: 'background.default' }}>
        <Container maxWidth="lg">
          <Breadcrumbs sx={{ py: 3 }}>
            <Link href="/" color="inherit">Home</Link>
            <Typography color="text.primary">Facilities</Typography>
          </Breadcrumbs>

          {/* Hero Section */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 4, md: 6 },
              mb: { xs: 4, md: 4 },
              borderRadius: { xs: 2, md: 4 },
              background: 'linear-gradient(135deg, #ebf5ff 0%, #f0f7ff 100%)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: { xs: -30, md: -50 },
                right: { xs: -30, md: -50 },
                width: { xs: 120, md: 200 },
                height: { xs: 120, md: 200 },
                borderRadius: '50%',
                background: 'rgba(25, 118, 210, 0.1)',
                zIndex: 0,
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: { xs: -20, md: -30 },
                left: { xs: -20, md: -30 },
                width: { xs: 100, md: 150 },
                height: { xs: 100, md: 150 },
                borderRadius: '50%',
                background: 'rgba(25, 118, 210, 0.08)',
                zIndex: 0,
              },
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography 
                variant="h1" 
                color="primary" 
                sx={{ 
                  fontWeight: 700, 
                  mb: { xs: 1.5, md: 2 },
                  fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' }
                }}
              >
                Our Facilities
              </Typography>
              <Typography 
                variant="h6" 
                color="text.secondary" 
                sx={{ 
                  fontSize: { xs: '0.95rem', sm: '1.125rem', md: '1.25rem' },
                  lineHeight: 1.6,
                  maxWidth: 800,
                  mx: 'auto',
                }}
              >
                State-of-the-art medical facilities and equipment designed to provide the best healthcare services.
              </Typography>
            </Box>
          </Paper>

          {/* Categories Grid - 4 cards per row */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(4, 1fr)',
              },
              gap: 3,
              mb: 6,
            }}
          >
            {enrichedCategories.map((category) => {
              const count = categoryCounts.get(category.slug) || 0
              return (
                <Link 
                  key={category.slug}
                  href={`/facilities/${category.slug}`}
                  style={{ textDecoration: 'none' }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      minHeight: 280,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                      },
                    }}
                  >
                    <CardContent 
                      sx={{ 
                        p: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1,
                        justifyContent: 'space-between',
                      }}
                    >
                      <Box>
                        <Box
                          sx={{
                            fontSize: '3rem',
                            mb: 2,
                            textAlign: 'center',
                          }}
                        >
                          {category.icon}
                        </Box>
                        <Typography 
                          variant="h6" 
                          fontWeight={600} 
                          gutterBottom
                          color="primary"
                          sx={{
                            textAlign: 'center',
                            mb: 1,
                          }}
                        >
                          {category.name}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          sx={{ 
                            mb: 2,
                            textAlign: 'center',
                            minHeight: 40,
                          }}
                        >
                          {category.description}
                        </Typography>
                      </Box>
                      <Typography 
                        variant="caption" 
                        color="primary"
                        sx={{ 
                          fontWeight: 600,
                          textAlign: 'center',
                        }}
                      >
                        {count} {count === 1 ? 'facility' : 'facilities'} available
                      </Typography>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </Box>
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
