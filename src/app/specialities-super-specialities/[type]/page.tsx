import React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  Box,
  Container,
  Typography,
  Breadcrumbs,
  Link,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
} from '@mui/material'
import { getSpecialtiesCached } from '@/lib/contentful'
import { Specialty } from '@/types/contentful'

interface SpecialtyTypePageProps {
  params: Promise<{
    type: string
  }>
}

const TYPE_NAMES: Record<string, { name: string; description: string }> = {
  'medical-specialties': {
    name: 'Medical Specialties',
    description: 'Comprehensive medical care across various specialties',
  },
  'surgical-specialties': {
    name: 'Surgical Specialties',
    description: 'Advanced surgical procedures and treatments',
  },
}

export async function generateMetadata({ params }: SpecialtyTypePageProps): Promise<Metadata> {
  const { type } = await params
  const typeInfo = TYPE_NAMES[type]

  if (!typeInfo) {
    return {
      title: 'Specialty Type Not Found - Kongunad Hospital',
    }
  }

  return {
    title: `${typeInfo.name} - Kongunad Hospital`,
    description: typeInfo.description,
  }
}

export async function generateStaticParams() {
  return [
    { type: 'medical-specialties' },
    { type: 'surgical-specialties' },
  ]
}

export const revalidate = 300

export default async function SpecialtyTypePage({ params }: SpecialtyTypePageProps) {
  try {
    const { type } = await params
    
    // Map URL type to Contentful type
    const contentType = type === 'medical-specialties' ? 'medical' : 
                       type === 'surgical-specialties' ? 'surgical' : null
    
    if (!contentType) {
      notFound()
    }

    const specialties = await getSpecialtiesCached(contentType) as unknown as Specialty[]
    const typeInfo = TYPE_NAMES[type]

    return (
      <Box sx={{ minHeight: '60vh', backgroundColor: 'background.default' }}>
        <Container maxWidth="lg">
          <Breadcrumbs sx={{ py: 3 }}>
            <Link href="/" color="inherit">Home</Link>
            <Link href="/specialities-super-specialities" color="inherit">Specialities & Super Specialities</Link>
            <Typography color="text.primary">{typeInfo.name}</Typography>
          </Breadcrumbs>

          {/* Hero Section */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, md: 6 },
              mb: 4,
              borderRadius: 4,
              background: 'linear-gradient(135deg, #ebf5ff 0%, #f0f7ff 100%)',
            }}
          >
            <Typography 
              variant="h1" 
              color="primary" 
              sx={{ 
                fontWeight: 700, 
                mb: 2,
                fontSize: { xs: '2rem', md: '2.5rem' }
              }}
            >
              {typeInfo.name}
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary" 
              sx={{ 
                fontSize: { xs: '1.1rem', md: '1.25rem' }
              }}
            >
              {typeInfo.description}
            </Typography>
          </Paper>

          {/* Results Count */}
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Showing {specialties.length} {specialties.length === 1 ? 'specialty' : 'specialties'}
          </Typography>

          {/* Specialties Grid */}
          {specialties.length > 0 ? (
            <Grid container spacing={3} sx={{ mb: 6 }}>
              {specialties.map((specialty) => (
                <Grid item xs={12} sm={6} md={4} key={specialty.sys.id}>
                  <Link 
                    href={`/specialities-super-specialities/${type}/${specialty.fields.slug}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <Card
                      sx={{
                        height: '100%',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                        },
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Typography 
                          variant="h5" 
                          fontWeight={600} 
                          gutterBottom
                          color="primary"
                        >
                          {specialty.fields.name}
                        </Typography>
                        {specialty.fields.shortDescription && (
                          <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            sx={{ mb: 2 }}
                          >
                            {specialty.fields.shortDescription}
                          </Typography>
                        )}
                        <Chip 
                          label={typeInfo.name}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </CardContent>
                    </Card>
                  </Link>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                No specialties available yet. Please check back soon.
              </Typography>
            </Box>
          )}
        </Container>
      </Box>
    )
  } catch (error) {
    notFound()
  }
}

