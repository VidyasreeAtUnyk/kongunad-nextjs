import React from 'react'
import { Metadata } from 'next'
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
} from '@mui/material'
import { getSpecialtiesCached } from '@/lib/contentful'
import { Specialty } from '@/types/contentful'

export const metadata: Metadata = {
  title: 'Specialities & Super Specialities - Kongunad Hospital',
  description: 'Explore our medical and surgical specialties at Kongunad Hospital.',
}

export const revalidate = 300

export default async function SpecialitiesPage() {
  try {
    const medicalSpecialties = await getSpecialtiesCached('medical') as unknown as Specialty[]
    const surgicalSpecialties = await getSpecialtiesCached('surgical') as unknown as Specialty[]

    return (
      <Box sx={{ minHeight: '60vh', backgroundColor: 'background.default' }}>
        <Container maxWidth="lg">
          <Breadcrumbs sx={{ py: 3 }}>
            <Link href="/" color="inherit">Home</Link>
            <Typography color="text.primary">Specialities & Super Specialities</Typography>
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
              Specialities & Super Specialities
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary" 
              sx={{ 
                fontSize: { xs: '1.1rem', md: '1.25rem' }
              }}
            >
              Comprehensive medical and surgical specialties delivered by our expert team.
            </Typography>
          </Paper>

          {/* Medical Specialties */}
          <Box sx={{ mb: 6 }}>
            <Link 
              href="/specialities-super-specialities/medical-specialties"
              style={{ textDecoration: 'none' }}
            >
              <Card
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography 
                    variant="h3" 
                    fontWeight={600} 
                    gutterBottom
                    color="primary"
                  >
                    Medical Specialties
                  </Typography>
                  <Typography 
                    variant="body1" 
                    color="text.secondary" 
                    sx={{ mb: 2 }}
                  >
                    Comprehensive medical care across various specialties
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="primary"
                    sx={{ fontWeight: 600 }}
                  >
                    {medicalSpecialties.length} {medicalSpecialties.length === 1 ? 'specialty' : 'specialties'} available →
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Box>

          {/* Surgical Specialties */}
          <Box sx={{ mb: 6 }}>
            <Link 
              href="/specialities-super-specialities/surgical-specialties"
              style={{ textDecoration: 'none' }}
            >
              <Card
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography 
                    variant="h3" 
                    fontWeight={600} 
                    gutterBottom
                    color="primary"
                  >
                    Surgical Specialties
                  </Typography>
                  <Typography 
                    variant="body1" 
                    color="text.secondary" 
                    sx={{ mb: 2 }}
                  >
                    Advanced surgical procedures and treatments
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="primary"
                    sx={{ fontWeight: 600 }}
                  >
                    {surgicalSpecialties.length} {surgicalSpecialties.length === 1 ? 'specialty' : 'specialties'} available →
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Box>
        </Container>
      </Box>
    )
  } catch (error) {
    return (
      <Box>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Typography variant="h1" gutterBottom color="primary">
            Specialities & Super Specialities
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
            Comprehensive medical and surgical specialties delivered by our expert team.
          </Typography>
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              Specialties will be available once Contentful is configured.
            </Typography>
          </Box>
        </Container>
      </Box>
    )
  }
}

