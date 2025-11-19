'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Skeleton,
} from '@mui/material'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import ScheduleIcon from '@mui/icons-material/Schedule'
import { BuildingImage } from '@/types/contentful'
import { ImageCarousel } from '@/components/ui/ImageCarousel'
import { SearchBarWithDropdown } from '@/components/ui/SearchBarWithDropdown'

interface HeroSectionProps {
  buildingImages: BuildingImage[]
}

export const HeroSection: React.FC<HeroSectionProps> = ({ buildingImages }) => {
  const router = useRouter()
  
  // Extract image URLs
  const imageUrls = buildingImages?.map(img => 
    `https:${img.fields.image.fields.file.url}`
  ) || []

  return (
    <Box
      sx={{
        background: 'transparent',
        color: 'text.primary',
        py: { xs: 3, md: 5 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Two Column Layout */}
        <Box sx={{ 
          display: 'flex', 
          gap: { xs: 3, md: 4 },
          flexDirection: { xs: 'column', lg: 'row' },
          alignItems: 'stretch',
        }}>
          {/* Left Column: Welcome, Search, Carousel */}
          <Box sx={{ 
            flex: { xs: 1, lg: 1.4 },
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            justifyContent: 'center',
          }}>
            {/* Welcome Section */}
            <Box sx={{ mb: { xs: 1, md: 1.5 } }}>
                <Typography 
                  variant="h1" 
                  sx={{
                    fontWeight: 800,
                    lineHeight: 1.1,
                    mb: 1.5,
                    color: 'primary.main',
                  }}
                >
                  Welcome to Kongunad{'\u00A0'}Hospital
                </Typography>
                
                <Typography 
                  variant="h5" 
                  sx={{ 
                    mb: 2, 
                    fontWeight: 300,
                    opacity: 0.9,
                  }}
                >
                  35 years of confidence to Coimbatore in Healthcare
                </Typography>

                    {/* Search Bar */}
                    <SearchBarWithDropdown
                      maxWidth={520}
                      borderRadius="50px"
                      textFieldSx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'background.paper',
                        },
                      }}
                    />
            </Box>

            {/* Image Carousel or Skeleton */}
            <Box>
              {imageUrls && imageUrls.length > 0 ? (
                <ImageCarousel
                  images={imageUrls}
                  autoplay={true}
                  autoplayInterval={4000}
                  height={{ xs: '260px', md: '320px' }}
                  fit="cover"
                />
              ) : (
                <Skeleton variant="rectangular" animation="wave" sx={{ width: '100%', height: { xs: 260, md: 320 }, borderRadius: 3 }} />
              )}
            </Box>
          </Box>

          {/* Right Column: Action Cards */}
          <Box sx={{ 
            flex: { xs: 1, lg: 0.8 },
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
            justifyContent: 'center',
          }}>
              {/* Primary Action Card */}
              <Card sx={{ 
                background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: 4,
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-8px) scale(1.02)',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                },
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocalHospitalIcon sx={{ color: 'primary.main', mr: 2, fontSize: 32 }} />
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        fontWeight: 700, 
                        color: 'primary.main',
                      }}
                    >
                      Book Your Appointment
                    </Typography>
                  </Box>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      mb: 2, 
                      color: 'text.secondary',
                    }}
                  >
                    Schedule with our expert doctors and receive personalized medical care tailored to your needs.
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={() => router.push('/book-appointment')}
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      py: 1.25,
                      borderRadius: 3,
                      fontWeight: 600,
                      boxShadow: '0 4px 15px rgba(25, 118, 210, 0.3)',
                      '&:hover': {
                        bgcolor: 'primary.dark',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
                      },
                    }}
                  >
                    Book Appointment Now
                  </Button>
                </CardContent>
              </Card>

              {/* Secondary Action Card */}
              <Card sx={{ 
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.85) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: 4,
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-8px) scale(1.02)',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                },
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <ScheduleIcon sx={{ color: 'primary.main', mr: 2, fontSize: 32 }} />
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        fontWeight: 700, 
                        color: 'primary.main',
                      }}
                    >
                      Book Checkup
                    </Typography>
                  </Box>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      mb: 2, 
                      color: 'text.secondary',
                    }}
                  >
                    Choose from our comprehensive health screening packages designed for your wellness.
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={() => router.push('/book-a-health-checkup')}
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      py: 1.25,
                      borderRadius: 3,
                      fontWeight: 600,
                      boxShadow: '0 4px 15px rgba(25, 118, 210, 0.3)',
                      '&:hover': {
                        bgcolor: 'primary.dark',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
                      },
                    }}
                  >
                    Book Checkup Now
                  </Button>
                </CardContent>
              </Card>
            </Box>
        </Box>

        {/* Stats Section */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: { xs: 3, md: 6 }, 
          mt: 4,
          flexWrap: 'wrap',
        }}>
            {[
              { label: 'Expert Doctors', value: '100+' },
              { label: 'Years Experience', value: '35+' },
              { label: 'Specialties', value: '25+' },
              { label: 'Patients Served', value: '50K+' },
            ].map((stat, index) => (
              <Box key={index} sx={{ textAlign: 'center' }}>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontWeight: 800,
                    color: 'primary.main',
                    mb: 0.5,
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'primary.main',
                    opacity: 0.9,
                    fontWeight: 600,
                  }}
                >
                  {stat.label}
                </Typography>
              </Box>
            ))}
        </Box>
      </Container>
    </Box>
  )
}




