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
              {categoryName}
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary" 
              sx={{ 
                fontSize: { xs: '1.1rem', md: '1.25rem' }
              }}
            >
              Explore our {categoryName.toLowerCase()} facilities and services.
            </Typography>
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

