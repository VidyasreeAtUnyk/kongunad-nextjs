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
import { FacilityCategoryClient } from './FacilityCategoryClient'
import { getFacilitiesByCategoryCached, getFacilityCategories } from '@/lib/contentful'
import { Facility } from '@/types/contentful'

interface FacilityCategoryPageProps {
  params: Promise<{
    category: string
  }>
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

export async function generateMetadata({ params }: FacilityCategoryPageProps): Promise<Metadata> {
  const { category } = await params
  const categoryName = CATEGORY_NAMES[category] || category

  return {
    title: `${categoryName} - Kongunad Hospital`,
    description: `Explore ${categoryName} facilities at Kongunad Hospital.`,
  }
}

export async function generateStaticParams() {
  try {
    const categories = await getFacilityCategories()
    return categories.map((category) => ({
      category: category.slug,
    }))
  } catch (error) {
    return []
  }
}

export const revalidate = 300

export default async function FacilityCategoryPage({ params }: FacilityCategoryPageProps) {
  try {
    const { category } = await params
    const facilities = await getFacilitiesByCategoryCached(category) as unknown as Facility[]
    const categories = await getFacilityCategories()
    const categoryName = CATEGORY_NAMES[category] || category

    if (facilities.length === 0) {
      notFound()
    }

    // Map categories to include names
    const allCategories = categories.map(cat => ({
      name: CATEGORY_NAMES[cat.slug] || cat.name,
      slug: cat.slug,
    }))

    return (
      <Box sx={{ minHeight: '60vh', backgroundColor: 'background.default' }}>
        <Container maxWidth="xl">
          <Breadcrumbs sx={{ py: 3 }}>
            <Link href="/" color="inherit">Home</Link>
            <Link href="/facilities" color="inherit">Facilities</Link>
            <Typography color="text.primary">{categoryName}</Typography>
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
                {categoryName}
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
                Explore our {categoryName.toLowerCase()} facilities and services.
              </Typography>
            </Box>
          </Paper>

          {/* Main Content with Sidebar */}
          <FacilityCategoryClient
            facilities={facilities}
            categoryName={categoryName}
            categorySlug={category}
            allCategories={allCategories}
          />
        </Container>
      </Box>
    )
  } catch (error) {
    notFound()
  }
}

