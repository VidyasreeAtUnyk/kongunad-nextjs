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
} from '@mui/material'
import { SpecialtyCategoryClient } from './SpecialtyCategoryClient'
import { getSpecialtiesByTypeCached, getSpecialtyTypes } from '@/lib/contentful'
import { Specialty } from '@/types/contentful'

interface SpecialtyTypePageProps {
  params: Promise<{
    type: string
  }>
}

// Map type slugs to display names
const TYPE_NAMES: Record<string, string> = {
  'medical-specialties': 'Medical Specialties',
  'surgical-specialties': 'Surgical Specialties',
}

export async function generateMetadata({ params }: SpecialtyTypePageProps): Promise<Metadata> {
  const { type } = await params
  const typeName = TYPE_NAMES[type] || type

  return {
    title: `${typeName} - Kongunad Hospital`,
    description: `Explore ${typeName} at Kongunad Hospital.`,
  }
}

export async function generateStaticParams() {
  try {
    const types = await getSpecialtyTypes()
    return types.map((type) => ({
      type: type.slug,
    }))
  } catch (error) {
    return []
  }
}

export const revalidate = 300

export default async function SpecialtyTypePage({ params }: SpecialtyTypePageProps) {
  try {
    const { type } = await params
    const specialties = await getSpecialtiesByTypeCached(type) as unknown as Specialty[]
    const types = await getSpecialtyTypes()
    const typeName = TYPE_NAMES[type] || type

    if (specialties.length === 0) {
      notFound()
    }

    // Map types to include names
    const allTypes = types.map(t => ({
      name: TYPE_NAMES[t.slug] || t.name,
      slug: t.slug,
    }))

    return (
      <Box sx={{ minHeight: '60vh', backgroundColor: 'background.default', overflow: 'hidden' }}>
        <Container maxWidth="lg" sx={{ width: '100%', maxWidth: '100%', px: { xs: 2, sm: 3, md: 4 } }}>
          <Breadcrumbs sx={{ py: 3 }}>
            <Link href="/" color="inherit">Home</Link>
            <Link href="/specialities" color="inherit">Specialities</Link>
            <Typography color="text.primary">{typeName}</Typography>
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
                {typeName}
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
                Comprehensive {typeName.toLowerCase()} delivered by experienced specialists.
              </Typography>
            </Box>
          </Paper>

          <SpecialtyCategoryClient
            specialties={specialties}
            typeName={typeName}
            typeSlug={type}
            allTypes={allTypes}
          />
        </Container>
      </Box>
    )
  } catch (error) {
    notFound()
  }
}

