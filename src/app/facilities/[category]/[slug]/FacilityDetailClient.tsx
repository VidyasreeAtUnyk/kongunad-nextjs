'use client'

import React, { useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Link,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from '@mui/material'
import { Facility, Doctor, HealthPackage } from '@/types/contentful'
import { DoctorCard } from '@/components/content/DoctorCard'
import { HealthPackageCard } from '@/components/content/HealthPackageCard'
import { useAppDispatch } from '@/store/hooks'
import { openModal } from '@/store/modalSlice'
import { openBottomSheet } from '@/store/bottomSheetSlice'

interface FacilityDetailClientProps {
  facility: Facility
  categoryName: string
  categorySlug: string
  allCategories: Array<{ name: string; slug: string }>
  otherFacilities: Facility[] // Other facilities in the same category
  relatedDoctors: Doctor[]
  relatedHealthPackages: HealthPackage[]
  hodWithDoctors: Array<{
    name: string
    doctor: Doctor | null
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

const FacilityDetailClientComponent: React.FC<FacilityDetailClientProps> = ({
  facility,
  categoryName,
  categorySlug,
  allCategories,
  otherFacilities,
  relatedDoctors,
  relatedHealthPackages,
  hodWithDoctors,
}) => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const handleCategoryChange = useCallback((newCategorySlug: string) => {
    router.push(`/facilities/${newCategorySlug}`)
  }, [router])

  const handleFacilityClick = useCallback((facilitySlug: string) => {
    router.push(`/facilities/${categorySlug}/${facilitySlug}`)
  }, [router, categorySlug])

  const handleViewDoctorProfile = useCallback((doctor: Doctor) => {
    dispatch(openModal({ type: 'doctor', id: doctor.sys.id }))
  }, [dispatch])

  const handleBookAppointment = useCallback((doctor?: Doctor) => {
    if (doctor) {
      router.push(`/book-appointment?doctor=${encodeURIComponent(doctor.fields.doctorName)}&department=${encodeURIComponent(doctor.fields.department || '')}`)
    } else {
      router.push('/book-appointment')
    }
  }, [router])

  const handleViewPackage = useCallback((pkg: HealthPackage) => {
    dispatch(openModal({ type: 'package', id: pkg.sys.id }))
  }, [dispatch])

  const handleBookPackage = useCallback((pkg: HealthPackage) => {
    dispatch(openBottomSheet({ type: 'healthCheckup', packageName: pkg.fields.title }))
  }, [dispatch])

  // Memoize filtered services to avoid re-computation
  const validServices = useMemo(() => {
    if (!facility.fields.services || facility.fields.services.length === 0) return []
    
    return facility.fields.services.filter((item) => {
      const isObject = typeof item === 'object' && item !== null
      const service = isObject 
        ? item as { title?: string; images?: Array<{ fields: { file: { url: string }; title?: string } }>; content?: string | string[] }
        : { content: item as string }
      
      const hasImages = service.images && Array.isArray(service.images) && service.images.length > 0
      return !!(service.title || service.content || hasImages)
    })
  }, [facility.fields.services])

  // Memoize combined doctors list
  const allDoctorsList = useMemo(() => {
    const hodDoctors = hodWithDoctors
      .filter(hod => hod.doctor !== null)
      .map(hod => hod.doctor!)
    
    return [...hodDoctors, ...relatedDoctors]
  }, [hodWithDoctors, relatedDoctors])

  return (
    <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', lg: 'row' } }}>
      {/* Main Content */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {/* Facility Name */}
        <Typography variant="h1" gutterBottom color="primary" sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, mb: 4 }}>
          {facility.fields.name}
        </Typography>

        {/* Facility Image and Facilities of Department */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(2, 1fr)',
            },
            gap: 4,
            mb: 6,
          }}
        >
          {/* Facility Image */}
          <Card
            sx={{
              overflow: 'hidden',
              borderRadius: 3,
            }}
          >
            <Box
              component="img"
              src={`https:${facility.fields.icon.fields.file.url}`}
              alt={`${facility.fields.name} - Facility image`}
              loading="eager"
              sx={{
                width: '100%',
                height: { xs: 300, md: 400 },
                objectFit: 'cover',
              }}
            />
          </Card>

          {/* Facilities of Department - No Title */}
          {facility.fields.facilities && facility.fields.facilities.length > 0 && (
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(25, 118, 210, 0.02) 100%)',
              }}
            >
              {facility.fields.facilities.map((item, index) => (
                <Typography
                  key={index}
                  variant="body1"
                  sx={{
                    mb: 2,
                    lineHeight: 1.8,
                    color: 'text.secondary',
                    '&:last-child': {
                      mb: 0,
                    },
                  }}
                >
                  {item}
                </Typography>
              ))}
            </Paper>
          )}
        </Box>

        {/* Services Section - No Title, Different Layout */}
        {validServices.length > 0 && (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              mb: 6,
              borderRadius: 3,
              background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(25, 118, 210, 0.02) 100%)',
            }}
          >
            {validServices.map((item, index) => {
              // Handle both old format (string) and new format (object)
              const isObject = typeof item === 'object' && item !== null;
              const service = isObject 
                ? item as { title?: string; images?: Array<{ fields: { file: { url: string }; title?: string } }>; content?: string | string[] }
                : { content: item as string };

              // Skip if no title, content, or images
              const hasImages = service.images && Array.isArray(service.images) && service.images.length > 0;
              if (!service.title && !service.content && !hasImages) {
                return null;
              }

              return (
                <Box key={index} sx={{ mb: 4, '&:last-child': { mb: 0 } }}>
                  {/* Service Title */}
                  {service.title && (
                    <Typography 
                      variant="h6" 
                      fontWeight={600} 
                      color="primary"
                      gutterBottom={!!service.content || hasImages}
                      sx={{ mb: 2 }}
                    >
                      {service.title}
                    </Typography>
                  )}

                  {/* Service Images */}
                  {hasImages && (
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                          xs: '1fr',
                          sm: service.images!.length === 1 ? '1fr' : 'repeat(2, 1fr)',
                        },
                        gap: 2,
                        mb: service.content ? 2 : 0,
                      }}
                    >
                      {service.images!.map((image, imgIndex) => (
                        <Box
                          key={imgIndex}
                          component="img"
                          src={`https:${image.fields.file.url}`}
                          alt={image.fields.title || service.title || `Service image ${imgIndex + 1}`}
                          loading="lazy"
                          sx={{
                            width: '100%',
                            height: { xs: 250, sm: service.images!.length === 1 ? 400 : 250 },
                            objectFit: 'cover',
                            borderRadius: 2,
                            boxShadow: 2,
                          }}
                        />
                      ))}
                    </Box>
                  )}

                  {/* Service Content */}
                  {service.content && (
                    Array.isArray(service.content) ? (
                      <List sx={{ py: 0, pl: 2 }}>
                        {service.content.map((item, idx) => (
                          <ListItem key={idx} disablePadding sx={{ py: 0.5 }}>
                            <Typography 
                              variant="body1" 
                              component="span"
                              sx={{ 
                                color: 'text.secondary',
                                lineHeight: 1.8,
                                '&::before': {
                                  content: '"• "',
                                  color: 'primary.main',
                                  fontWeight: 'bold',
                                  marginRight: 1,
                                },
                              }}
                            >
                              {item}
                            </Typography>
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: 'text.secondary',
                          lineHeight: 1.8,
                          whiteSpace: 'pre-line',
                        }}
                      >
                        {service.content}
                      </Typography>
                    )
                  )}
                </Box>
              );
            })}
          </Paper>
        )}

        {/* Additional Images Gallery */}
        {facility.fields.images && facility.fields.images.length > 0 && (
          <Box sx={{ mb: 6 }}>
            <Typography variant="h5" gutterBottom color="primary" fontWeight={600} sx={{ mb: 3 }}>
              Gallery
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                },
                gap: 2,
              }}
            >
              {facility.fields.images.map((image, index) => (
                <Card key={index}>
                  <CardContent sx={{ p: 0 }}>
                    <Box
                      component="img"
                      src={`https:${image.fields.file.url}`}
                      alt={image.fields.title || `${facility.fields.name} - Gallery image ${index + 1}`}
                      loading="lazy"
                      sx={{
                        width: '100%',
                        height: 200,
                        objectFit: 'cover',
                        borderRadius: 2,
                      }}
                    />
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        )}

        {/* Our Doctors Section (including HOD) */}
        {allDoctorsList.length > 0 && (
          <Box sx={{ mb: 6 }}>
            <Typography variant="h5" gutterBottom color="primary" fontWeight={600} sx={{ mb: 3 }}>
              Our Doctors
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                  lg: 'repeat(4, 1fr)',
                },
                gap: 3,
              }}
            >
              {allDoctorsList.map((doctor) => {
                const isHod = hodWithDoctors.some(hod => hod.doctor?.sys.id === doctor.sys.id)
                
                return (
                  <Box 
                    key={doctor.sys.id} 
                    sx={{ 
                      position: 'relative',
                      overflow: 'visible',
                    }}
                  >
                    {isHod && (
                      <Chip
                        label="Head of Department"
                        color="primary"
                        size="small"
                        aria-label="Head of Department"
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          zIndex: 10,
                          fontWeight: 600,
                          fontSize: '0.7rem',
                          boxShadow: 3,
                          pointerEvents: 'auto',
                        }}
                      />
                    )}
                    <DoctorCard
                      doctor={doctor}
                      onViewProfile={() => handleViewDoctorProfile(doctor)}
                      onBookAppointment={() => handleBookAppointment(doctor)}
                    />
                  </Box>
                )
              })}
            </Box>
          </Box>
        )}

        {/* Related Health Packages Section */}
        {relatedHealthPackages.length > 0 && (
          <Box sx={{ mb: 6 }}>
            <Typography variant="h5" gutterBottom color="primary" fontWeight={600} sx={{ mb: 3 }}>
              Health Checkup Packages
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                },
                gap: 3,
              }}
            >
              {relatedHealthPackages.map((pkg) => (
                <HealthPackageCard
                  key={pkg.sys.id}
                  healthPackage={pkg}
                  onKnowMore={() => handleViewPackage(pkg)}
                  onBookNow={() => handleBookPackage(pkg)}
                />
              ))}
            </Box>
          </Box>
        )}
      </Box>

      {/* Sidebar */}
      <Box 
        sx={{ 
          width: { xs: '100%', lg: 320 },
          flexShrink: 0,
        }}
      >
        {/* Other Facilities in Category */}
        {otherFacilities.length > 0 && (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3,
              backgroundColor: 'grey.50',
              border: '1px solid',
              borderColor: 'grey.200',
            }}
          >
            <Typography variant="h6" fontWeight={600} gutterBottom color="primary">
              Other {categoryName}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Explore more facilities in this category
            </Typography>
            <List sx={{ p: 0 }}>
              {otherFacilities.slice(0, 5).map((fac, index) => (
                <React.Fragment key={fac.sys.id}>
                  <ListItemButton
                    onClick={() => handleFacilityClick(fac.fields.slug)}
                    sx={{
                      px: 0,
                      py: 1,
                      borderRadius: 1,
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                  >
                    <ListItemText
                      primary={fac.fields.name}
                      primaryTypographyProps={{
                        variant: 'body2',
                        fontWeight: 500,
                      }}
                    />
                  </ListItemButton>
                  {index < Math.min(otherFacilities.length, 5) - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            {otherFacilities.length > 5 && (
              <Link
                href={`/facilities/${categorySlug}`}
                sx={{
                  mt: 2,
                  display: 'block',
                  textAlign: 'center',
                  textDecoration: 'none',
                }}
              >
                <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
                  View All ({otherFacilities.length})
                </Typography>
              </Link>
            )}
          </Paper>
        )}

        {/* Category Switcher */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            backgroundColor: 'grey.50',
            border: '1px solid',
            borderColor: 'grey.200',
            position: { lg: 'sticky' },
            top: 100,
          }}
        >
          <Typography variant="h6" fontWeight={600} gutterBottom color="primary">
            Browse Categories
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Switch to other facility categories
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {allCategories.map((cat) => {
              const isActive = cat.slug === categorySlug
              return (
                <Link
                  key={cat.slug}
                  href={`/facilities/${cat.slug}`}
                  onClick={(e) => {
                    e.preventDefault()
                    handleCategoryChange(cat.slug)
                  }}
                  sx={{
                    textDecoration: 'none',
                    display: 'block',
                  }}
                >
                  <Chip
                    label={cat.name}
                    clickable
                    color={isActive ? 'primary' : 'default'}
                    variant={isActive ? 'filled' : 'outlined'}
                    sx={{
                      width: '100%',
                      justifyContent: 'flex-start',
                      height: 40,
                      '&:hover': {
                        backgroundColor: isActive ? 'primary.dark' : 'action.hover',
                      },
                    }}
                  />
                </Link>
              )
            })}
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}

// Memoize component to prevent unnecessary re-renders
export const FacilityDetailClient = React.memo(FacilityDetailClientComponent, (prevProps, nextProps) => {
  // Only re-render if props actually change
  return (
    prevProps.facility.sys.id === nextProps.facility.sys.id &&
    prevProps.categorySlug === nextProps.categorySlug &&
    prevProps.relatedDoctors.length === nextProps.relatedDoctors.length &&
    prevProps.relatedHealthPackages.length === nextProps.relatedHealthPackages.length &&
    prevProps.hodWithDoctors.length === nextProps.hodWithDoctors.length &&
    prevProps.otherFacilities.length === nextProps.otherFacilities.length
  )
})

