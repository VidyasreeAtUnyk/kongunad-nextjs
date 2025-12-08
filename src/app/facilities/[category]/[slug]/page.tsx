import React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  Box,
  Container,
  Typography,
  Breadcrumbs,
  Link,
} from '@mui/material'
import { FacilityDetailClient } from './FacilityDetailClient'
import { getFacilityByCategoryAndSlugCached, getFacilitiesByCategoryCached, getFacilityCategories, getDoctorsCached, getHealthPackagesCached } from '@/lib/contentful'
import { Facility, Doctor, HealthPackage } from '@/types/contentful'

interface FacilityPageProps {
  params: Promise<{
    category: string
    slug: string
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

export async function generateMetadata({ params }: FacilityPageProps): Promise<Metadata> {
  try {
    const { category, slug } = await params
    const facility = await getFacilityByCategoryAndSlugCached(category, slug) as unknown as Facility | null

    if (!facility) {
      return {
        title: 'Facility Not Found - Kongunad Hospital',
        description: 'The requested facility could not be found.',
      }
    }

    const categoryName = CATEGORY_NAMES[category] || category
    const description = facility.fields.description || `Learn more about ${facility.fields.name} at Kongunad Hospital.`

    return {
      title: `${facility.fields.name} - ${categoryName} | Kongunad Hospital`,
      description,
      openGraph: {
        title: `${facility.fields.name} - Kongunad Hospital`,
        description,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${facility.fields.name} - Kongunad Hospital`,
        description,
      },
    }
  } catch (error) {
    console.error('Error generating metadata for facility:', error)
    return {
      title: 'Facility - Kongunad Hospital',
      description: 'Hospital facility information',
    }
  }
}

export async function generateStaticParams() {
  try {
    // This would need to fetch all facilities and generate params
    // For now, return empty array - Next.js will generate on demand
    return []
  } catch (error) {
    return []
  }
}

export const revalidate = 300

export default async function FacilityPage({ params }: FacilityPageProps) {
  try {
    const { category, slug } = await params
    const facility = await getFacilityByCategoryAndSlugCached(category, slug) as unknown as Facility | null

    if (!facility) {
      notFound()
    }

    // Fetch all doctors and health packages in parallel with error handling
    const [allDoctors, allHealthPackages, allCategoryFacilities, categories] = await Promise.allSettled([
      getDoctorsCached() as unknown as Promise<Doctor[]>,
      getHealthPackagesCached() as unknown as Promise<HealthPackage[]>,
      getFacilitiesByCategoryCached(category) as unknown as Promise<Facility[]>,
      getFacilityCategories(),
    ]).then(results => 
      results.map((result, index) => {
        if (result.status === 'rejected') {
          console.error(`Error fetching data for facility page (index ${index}):`, result.reason)
          // Return empty arrays/objects as fallback
          if (index === 0) return [] as Doctor[]
          if (index === 1) return [] as HealthPackage[]
          if (index === 2) return [] as Facility[]
          return [] as Array<{ name: string; slug: string }>
        }
        return result.value
      })
    ) as [Doctor[], HealthPackage[], Facility[], Array<{ name: string; slug: string }>]

    const facilitySlug = facility.fields.slug?.toLowerCase().trim()

    // Step 1: Get all doctors that have this facility in their facilitySlugs
    const allRelatedDoctors = allDoctors.filter(doctor => {
      const doctorFacilitySlugs =
        doctor.fields.facilitySlugs?.map(slug => slug?.toLowerCase().trim()) || []
      return !!facilitySlug && doctorFacilitySlugs.includes(facilitySlug)
    })

    // Step 2: Match HOD (string) with doctor and separate HOD doctor from regular doctors
    const hodName = facility.fields.hod?.toLowerCase().trim()
    let hodDoctor: Doctor | null = null
    const regularDoctors: Doctor[] = []

    // Find the HOD doctor
    if (hodName) {
      hodDoctor = allRelatedDoctors.find(doctor => {
        const doctorName = doctor.fields.doctorName?.toLowerCase().trim()
        return (
          doctorName &&
          (doctorName === hodName ||
            doctorName.includes(hodName) ||
            hodName.includes(doctorName))
        )
      }) || null
    }

    // Separate HOD from regular doctors
    allRelatedDoctors.forEach(doctor => {
      if (hodDoctor && doctor.sys.id === hodDoctor.sys.id) {
        // This is the HOD, skip adding to regular doctors
        return
      }
      regularDoctors.push(doctor)
    })

    // Step 3: Create HOD with doctor (matching the expected format)
    const hodWithDoctors = hodDoctor && hodName
      ? [{
          name: facility.fields.hod || '',
          doctor: hodDoctor,
        }]
      : []

    // Regular doctors (not HOD)
    const relatedDoctors = regularDoctors

    // Filter health packages by category matching facility category (case-insensitive)
    const relatedHealthPackages = allHealthPackages.filter(pkg => {
      const pkgCategory = pkg.fields.category?.toLowerCase().trim()
      const facilityCategory = facility.fields.category?.toLowerCase().trim()
      return pkgCategory === facilityCategory || pkgCategory?.includes(facilityCategory || '') || facilityCategory?.includes(pkgCategory || '')
    })

    // Get other facilities in the same category (excluding current)
    const otherFacilities = allCategoryFacilities.filter(f => f.sys.id !== facility.sys.id)

    // Get all categories for switcher
    const allCategories = categories.map(cat => ({
      name: CATEGORY_NAMES[cat.slug] || cat.name,
      slug: cat.slug,
    }))

    const categoryName = CATEGORY_NAMES[category] || category

    return (
      <Box sx={{ minHeight: '60vh', backgroundColor: 'background.default', overflow: 'hidden' }}>
        <Container maxWidth="lg" sx={{ width: '100%', py: 4, px: { xs: 2, sm: 3, md: 4 } }}>
          <Breadcrumbs sx={{ mb: 3 }}>
            <Link href="/" color="inherit">Home</Link>
            <Link href="/facilities" color="inherit">Facilities</Link>
            <Link href={`/facilities/${category}`} color="inherit">{categoryName}</Link>
            <Typography color="text.primary">{facility.fields.name}</Typography>
          </Breadcrumbs>

          <FacilityDetailClient
            facility={facility}
            categoryName={categoryName}
            categorySlug={category}
            allCategories={allCategories}
            otherFacilities={otherFacilities}
            relatedDoctors={relatedDoctors}
            relatedHealthPackages={relatedHealthPackages}
            hodWithDoctors={hodWithDoctors}
          />
        </Container>
      </Box>
    )
  } catch (error) {
    console.error('Error rendering facility page:', error)
    // Log error details for debugging in production
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    notFound()
  }
}

