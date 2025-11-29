import React from 'react'
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Button,
  Paper,
} from '@mui/material'
import { DoctorCard } from '@/components/content/DoctorCard'
import { FacilityCard } from '@/components/content/FacilityCard'
import { HealthPackageCard } from '@/components/content/HealthPackageCard'
import { HeroSection } from '@/components/layout/HeroSection'
import { AboutSection } from '@/components/content/AboutSection'
import { FacilitiesSection } from '@/components/content/FacilitiesSection'
import { DoctorsSection } from '@/components/content/DoctorsSection'
import { QuickLinksSection } from '@/components/content/QuickLinksSection'
import { SearchBar } from '@/components/ui/SearchBar'
import { getDoctorsCached, getFacilitiesCached, getHealthPackagesCached, getBuildingImagesCached, getAboutContentCached, getLeadershipCached } from '@/lib/contentful'
import { Doctor, Facility, HealthPackage, BuildingImage, AboutContent, Leadership } from '@/types/contentful'

export const revalidate = 300

export default async function HomePage() {
  // Fetch data from Contentful (with fallback for development)
  let doctors: Doctor[] = [], facilities: Facility[] = [], healthPackages: HealthPackage[] = [], buildingImages: BuildingImage[] = []
  let aboutContent: AboutContent | null = null
  let leadership: Leadership | null = null
  
  try {
    const [doctorsData, facilitiesData, healthPackagesData, buildingImagesData, aboutContentData, leadershipData] = await Promise.all([
      getDoctorsCached(6), // Limit to 6 for homepage
      getFacilitiesCached(6),
      getHealthPackagesCached(6),
      getBuildingImagesCached(),
      getAboutContentCached(),
      getLeadershipCached(),
    ])
    
    doctors = doctorsData as unknown as Doctor[]
    facilities = facilitiesData as unknown as Facility[]
    healthPackages = healthPackagesData as unknown as HealthPackage[]
    buildingImages = buildingImagesData as unknown as BuildingImage[]
    aboutContent = aboutContentData as unknown as AboutContent | null
    leadership = leadershipData as unknown as Leadership | null
  } catch (error) {
    console.log('Contentful not configured, using empty data for development')
    console.error(error);
    // Fallback to empty arrays for development
  }

  return (
    <Box>
      {/* Hero Section */}
      <HeroSection buildingImages={buildingImages} />

      {/* About Section */}
      <AboutSection 
        buildingImages={buildingImages}
        aboutContent={aboutContent ? {
          title: aboutContent.fields.title,
          description: aboutContent.fields.description,
          highlights: aboutContent.fields.highlights,
        } : undefined}
      />

      <FacilitiesSection facilities={facilities} />

      {/* Doctors Section */}
      <DoctorsSection doctors={doctors} leadership={leadership} />

      {/* Quick Links Section - shown only on desktop */}
      <QuickLinksSection
        links={[
          { title: 'Book Appointment', to: '/book-appointment' },
          { title: 'Find a Doctor', to: '/find-a-doctor' },
          { title: 'Health Checkup', to: '/book-a-health-checkup' },
          { title: 'Emergency', to: 'tel:+91-422-1234567' },
        ]}
      />

      {/* Footer */}

      {/* Health Packages Section */}
      {/* <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h2" gutterBottom align="center" color="primary">
            Health Checkup Packages
          </Typography>
          <Typography variant="body1" align="center" sx={{ mb: 6, color: 'text.secondary' }}>
            Comprehensive health checkup packages at affordable prices
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
            {healthPackages.map((healthPackage) => (
              <Box key={healthPackage.sys.id} sx={{ width: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(33.333% - 22px)' } }}>
                <HealthPackageCard healthPackage={healthPackage} />
              </Box>
            ))}
          </Box>
          <Box display="flex" justifyContent="center" mt={4}>
            <Button variant="outlined" size="large" href="/health-packages">
              View All Packages
            </Button>
          </Box>
        </Container>
      </Box> */}

      {/* Quick Actions Section */}
      {/* <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h2" gutterBottom align="center" color="primary">
          Quick Actions
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center', mt: 2 }}>
          <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' } }}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Book Appointment
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Schedule your consultation with our specialists
                </Typography>
                <Button variant="contained" fullWidth href="/appointment">
                  Book Now
                </Button>
              </CardContent>
            </Card>
          </Box>
          <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' } }}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Health Checkup
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Comprehensive health screening packages
                </Typography>
                <Button variant="contained" fullWidth href="/health-checkup">
                  Book Checkup
                </Button>
              </CardContent>
            </Card>
          </Box>
          <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' } }}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Find Doctor
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Search for specialists by department
                </Typography>
                <Button variant="contained" fullWidth href="/find-a-doctor">
                  Search Doctors
                </Button>
              </CardContent>
            </Card>
          </Box>
          <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' } }}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Emergency
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  24/7 emergency services available
                </Typography>
                <Button variant="contained" color="error" fullWidth href="tel:+91-422-1234567">
                  Call Emergency
                </Button>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container> */}
    </Box>
  )
}