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
      <Box sx={{ minHeight: '60vh', backgroundColor: 'background.default' }}>
        <Container maxWidth="xl">
          <Breadcrumbs sx={{ py: 3 }}>
            <Link href="/" color="inherit">Home</Link>
            <Link href="/specialities" color="inherit">Specialities</Link>
            <Typography color="text.primary">{typeName}</Typography>
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
              {typeName}
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary" 
              sx={{ 
                fontSize: { xs: '1.1rem', md: '1.25rem' }
              }}
            >
              Comprehensive {typeName.toLowerCase()} delivered by experienced specialists.
            </Typography>
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

