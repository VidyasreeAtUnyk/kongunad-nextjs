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
import { SpecialtyDetailClient } from './SpecialtyDetailClient'
import { getSpecialtyByTypeAndSlugCached, getSpecialtiesByTypeCached, getSpecialtyTypes, getDoctorsCached, getHealthPackagesCached } from '@/lib/contentful'
import { Specialty, Doctor, HealthPackage } from '@/types/contentful'

interface SpecialtyPageProps {
  params: Promise<{
    type: string
    slug: string
  }>
}

// Map type slugs to display names
const TYPE_NAMES: Record<string, string> = {
  'medical-specialties': 'Medical Specialties',
  'surgical-specialties': 'Surgical Specialties',
}

export async function generateMetadata({ params }: SpecialtyPageProps): Promise<Metadata> {
  try {
    const { type, slug } = await params
    const specialty = await getSpecialtyByTypeAndSlugCached(type, slug) as unknown as Specialty | null

    if (!specialty) {
      return {
        title: 'Specialty Not Found - Kongunad Hospital',
        description: 'The requested specialty could not be found.',
      }
    }

    const typeName = TYPE_NAMES[type] || type
    const description = specialty.fields.description || `Learn more about ${specialty.fields.name} at Kongunad Hospital.`

    return {
      title: `${specialty.fields.name} - ${typeName} | Kongunad Hospital`,
      description,
      openGraph: {
        title: `${specialty.fields.name} - Kongunad Hospital`,
        description,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${specialty.fields.name} - Kongunad Hospital`,
        description,
      },
    }
  } catch (error) {
    console.error('Error generating metadata for specialty:', error)
    return {
      title: 'Specialty - Kongunad Hospital',
      description: 'Hospital specialty information',
    }
  }
}

export async function generateStaticParams() {
  try {
    // This would need to fetch all specialties and generate params
    // For now, return empty array - Next.js will generate on demand
    return []
  } catch (error) {
    return []
  }
}

export const revalidate = 300

export default async function SpecialtyPage({ params }: SpecialtyPageProps) {
  try {
    const { type, slug } = await params
    const specialty = await getSpecialtyByTypeAndSlugCached(type, slug) as unknown as Specialty | null

    if (!specialty) {
      notFound()
    }

    // Fetch all doctors and health packages in parallel with error handling
    const [allDoctors, allHealthPackages, allTypeSpecialties, types] = await Promise.allSettled([
      getDoctorsCached() as unknown as Promise<Doctor[]>,
      getHealthPackagesCached() as unknown as Promise<HealthPackage[]>,
      getSpecialtiesByTypeCached(type) as unknown as Promise<Specialty[]>,
      getSpecialtyTypes(),
    ]).then(results => 
      results.map((result, index) => {
        if (result.status === 'rejected') {
          console.error(`Error fetching data for specialty page (index ${index}):`, result.reason)
          // Return empty arrays/objects as fallback
          if (index === 0) return [] as Doctor[]
          if (index === 1) return [] as HealthPackage[]
          if (index === 2) return [] as Specialty[]
          return [] as Array<{ name: string; slug: string }>
        }
        return result.value
      })
    ) as [Doctor[], HealthPackage[], Specialty[], Array<{ name: string; slug: string }>]

    const specialtySlug = specialty.fields.slug?.toLowerCase().trim()

    // Step 1: Get all doctors that have this specialty in their specialtySlugs
    const allRelatedDoctors = allDoctors.filter(doctor => {
      const doctorSpecialtySlugs =
        doctor.fields.specialtySlugs?.map(slug => slug?.toLowerCase().trim()) || []
      return !!specialtySlug && doctorSpecialtySlugs.includes(specialtySlug)
    })

    // Step 2: Match HOD (string) with doctor and separate HOD doctor from regular doctors
    const hodName = specialty.fields.hod?.toLowerCase().trim()
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
          name: specialty.fields.hod || '',
          doctor: hodDoctor,
        }]
      : []

    // Regular doctors (not HOD)
    const relatedDoctors = regularDoctors

    // Filter health packages by category matching specialty type (case-insensitive)
    const relatedHealthPackages = allHealthPackages.filter(pkg => {
      const pkgCategory = pkg.fields.category?.toLowerCase().trim()
      const specialtyType = specialty.fields.type?.toLowerCase().trim()
      return pkgCategory === specialtyType || pkgCategory?.includes(specialtyType || '') || specialtyType?.includes(pkgCategory || '')
    })

    // Get other specialties in the same type (excluding current)
    const otherSpecialties = allTypeSpecialties.filter(s => s.sys.id !== specialty.sys.id)

    // Get all types for switcher
    const allTypes = types.map(t => ({
      name: TYPE_NAMES[t.slug] || t.name,
      slug: t.slug,
    }))

    const typeName = TYPE_NAMES[type] || type

    return (
      <Box sx={{ minHeight: '60vh', backgroundColor: 'background.default', overflow: 'hidden' }}>
        <Container maxWidth="lg" sx={{ width: '100%', py: 4, px: { xs: 2, sm: 3, md: 4 } }}>
          <Breadcrumbs sx={{ mb: 3 }}>
            <Link href="/" color="inherit">Home</Link>
            <Link href="/specialities" color="inherit">Specialities</Link>
            <Link href={`/specialities/${type}`} color="inherit">{typeName}</Link>
            <Typography color="text.primary">{specialty.fields.name}</Typography>
          </Breadcrumbs>

          <SpecialtyDetailClient
            specialty={specialty}
            typeName={typeName}
            typeSlug={type}
            allTypes={allTypes}
            otherSpecialties={otherSpecialties}
            relatedDoctors={relatedDoctors}
            relatedHealthPackages={relatedHealthPackages}
            hodWithDoctors={hodWithDoctors}
          />
        </Container>
      </Box>
    )
  } catch (error) {
    console.error('Error rendering specialty page:', error)
    // Log error details for debugging in production
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    notFound()
  }
}

