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
import { getSpecialtiesCached, getSpecialtyTypes } from '@/lib/contentful'
import { Specialty } from '@/types/contentful'

export const metadata: Metadata = {
  title: 'Specialities - Kongunad Hospital',
  description: 'Explore our comprehensive medical and surgical specialties at Kongunad Hospital.',
}

export const revalidate = 300

// Type metadata mapping
const TYPE_METADATA: Record<string, { description: string; icon: string }> = {
  'medical-specialties': {
    description: 'Comprehensive medical specialties for diagnosis and treatment',
    icon: '🩺',
  },
  'surgical-specialties': {
    description: 'Advanced surgical specialties and procedures',
    icon: '⚕️',
  },
}

export default async function SpecialitiesPage() {
  try {
    const specialties = await getSpecialtiesCached() as unknown as Specialty[]
    const types = await getSpecialtyTypes()
    
    // Get specialty counts per type
    const typeCounts = new Map<string, number>()
    specialties.forEach((specialty) => {
      if (specialty.fields.type) {
        const typeSlug = specialty.fields.type === 'medical' ? 'medical-specialties' : 'surgical-specialties'
        const count = typeCounts.get(typeSlug) || 0
        typeCounts.set(typeSlug, count + 1)
      }
    })

    // Enrich types with metadata
    const enrichedTypes = types
      .map((type) => {
        const metadata = TYPE_METADATA[type.slug]
        if (!metadata) return null
        
        return {
          ...type,
          description: metadata.description,
          icon: metadata.icon,
        }
      })
      .filter((type): type is NonNullable<typeof type> => type !== null)

    return (
      <Box sx={{ minHeight: '60vh', backgroundColor: 'background.default' }}>
        <Container maxWidth="lg">
          <Breadcrumbs sx={{ py: 3 }}>
            <Link href="/" color="inherit">Home</Link>
            <Typography color="text.primary">Specialities</Typography>
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
                Specialities
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
                Comprehensive medical and surgical specialties delivered by experienced specialists.
              </Typography>
            </Box>
          </Paper>

          {/* Types Grid - 2 cards per row */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
              },
              gap: 3,
              mb: 6,
            }}
          >
            {enrichedTypes.map((type) => {
              const count = typeCounts.get(type.slug) || 0
              return (
                <Link 
                  key={type.slug}
                  href={`/specialities/${type.slug}`}
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
                          {type.icon}
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
                          {type.name}
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
                          {type.description}
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
                        {count} {count === 1 ? 'specialty' : 'specialties'} available
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
            Specialities
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
            Comprehensive medical and surgical specialties delivered by experienced specialists.
          </Typography>
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              Specialities will be available once Contentful is configured.
            </Typography>
          </Box>
        </Container>
      </Box>
    )
  }
}

