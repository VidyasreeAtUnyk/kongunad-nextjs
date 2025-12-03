'use client'

import React, { useEffect, useState } from 'react'
import {
  Dialog,
  Box,
  Typography,
  IconButton,
  Paper,
  Skeleton,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import SchoolIcon from '@mui/icons-material/School'
import BadgeIcon from '@mui/icons-material/Badge'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import BusinessIcon from '@mui/icons-material/Business'
import { Doctor } from '@/types/contentful'
import { useFacilities } from '@/components/providers/FacilitiesProvider'

interface DoctorDetailModalProps {
  doctorId: string
  open: boolean
  onClose: () => void
}

interface FieldTile {
  icon: React.ReactNode
  title: string
  content: string
  fullWidth?: boolean // For fields that should span full width
}

export const DoctorDetailModal: React.FC<DoctorDetailModalProps> = ({
  doctorId,
  open,
  onClose,
}) => {
  const { facilities } = useFacilities()
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open && doctorId) {
      fetchDoctor()
    } else {
      setDoctor(null)
      setLoading(false)
      setError(null)
    }
  }, [open, doctorId])

  const fetchDoctor = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/doctors/${doctorId}`)
      
      if (!response.ok) {
        throw new Error('Doctor not found')
      }
      
      const entry = await response.json()
      setDoctor(entry as unknown as Doctor)
    } catch (err) {
      console.error('Error fetching doctor:', err)
      setError('Failed to load doctor details')
    } finally {
      setLoading(false)
    }
  }


  const getFieldData = (): FieldTile[] => {
    if (!doctor) return []
    
    const fields: FieldTile[] = [
      {
        icon: <LocalHospitalIcon />,
        title: 'Department',
        content: doctor.fields.department,
      },
      {
        icon: <BadgeIcon />,
        title: 'Speciality',
        content: doctor.fields.speciality,
      },
      {
        icon: <AccessTimeIcon />,
        title: 'Experience',
        content: `${doctor.fields.experience || 0} Years`,
      },
    ]

    if (doctor.fields.degrees) {
      let degreesText = ''
      if (Array.isArray(doctor.fields.degrees) && doctor.fields.degrees.length > 0) {
        degreesText = doctor.fields.degrees.join(', ')
      } else if (typeof doctor.fields.degrees === 'string') {
        degreesText = doctor.fields.degrees
      }
      
      if (degreesText) {
        fields.push({
          icon: <SchoolIcon />,
          title: 'Qualifications',
          content: degreesText,
        })
      }
    }

    if (doctor.fields.availability) {
      fields.push({
        icon: <AccessTimeIcon />,
        title: 'Availability',
        content: doctor.fields.availability,
      })
    }

    // Add facilities if available
    if (doctor.fields.facilitySlugs && doctor.fields.facilitySlugs.length > 0 && facilities.length > 0) {
      const matchedFacilities = facilities.filter(facility => 
        doctor.fields.facilitySlugs?.includes(facility.fields.slug)
      )
      
      if (matchedFacilities.length > 0) {
        const facilitiesText = matchedFacilities.map(f => f.fields.name).join(', ')
        fields.push({
          icon: <BusinessIcon />,
          title: 'Facilities',
          content: facilitiesText,
          fullWidth: true, // Facilities field spans full width
        })
      }
    }

    return fields
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxWidth: { xs: '95vw', md: '800px' },
          height: { xs: '90vh', md: '50vh' },
          maxHeight: { xs: '90vh', md: '50vh' },
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {loading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
          {/* Header Skeleton */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            p: 2, 
            pb: 1, 
            position: 'relative',
            flexShrink: 0,
          }}>
            <Skeleton variant="text" width={200} height={40} sx={{ mx: 'auto' }} />
            <IconButton 
              disabled
              size="small"
              sx={{ position: 'absolute', right: 16 }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Main Content Skeleton */}
          <Box sx={{ 
            p: { xs: 2, md: 4 },
            flex: 1,
            overflow: 'hidden',
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
          }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' },
              gap: 4,
              flex: 1,
              minHeight: 0,
            }}>
              {/* Doctor Photo Skeleton */}
              <Box sx={{ 
                flexShrink: 0,
                width: { xs: '100%', md: '250px' },
                aspectRatio: '3/4',
                borderRadius: 3,
                overflow: 'hidden',
              }}>
                <Skeleton variant="rectangular" width="100%" height="100%" />
              </Box>

              {/* Fields Grid Skeleton */}
              <Box sx={{ 
                flex: 1, 
                minHeight: 0,
                overflowY: 'auto',
                overflowX: 'hidden',
              }}>
                <Box sx={{ 
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                  gap: 2,
                }}>
                  {[1, 2, 3, 4, 5].map((idx) => (
                    <Paper
                      key={idx}
                      elevation={0}
                      sx={{
                        p: 2,
                        height: '100%',
                        border: '1px solid',
                        borderColor: 'grey.200',
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 2,
                      }}
                    >
                      <Skeleton variant="circular" width={24} height={24} sx={{ flexShrink: 0 }} />
                      <Box sx={{ flex: 1 }}>
                        <Skeleton variant="text" width="40%" height={16} sx={{ mb: 0.5 }} />
                        <Skeleton variant="text" width="80%" height={20} />
                      </Box>
                    </Paper>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      ) : error ? (
        <Box sx={{ textAlign: 'center', p: 6 }}>
          <Typography color="error" gutterBottom>{error}</Typography>
        </Box>
        ) : doctor ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
            {/* Header with title and close button */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              p: 2, 
              pb: 1, 
              position: 'relative',
              flexShrink: 0,
            }}>
              <Typography variant="h3" sx={{ fontWeight: 600, textAlign: 'center', color: 'primary.main' }}>
                {doctor.fields.doctorName}
              </Typography>
              <IconButton 
                onClick={onClose} 
                size="small"
                sx={{ position: 'absolute', right: 16 }}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Main Content */}
            <Box sx={{ 
              p: { xs: 2, md: 4 },
              flex: 1,
              overflow: 'hidden',
              minHeight: 0,
              display: 'flex',
              flexDirection: 'column',
            }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' },
              gap: 4,
              flex: 1,
              minHeight: 0,
            }}>
              {/* Doctor Photo */}
              {doctor.fields.photo?.fields?.file?.url && (
                <Box sx={{ 
                  flexShrink: 0,
                  width: { xs: '100%', md: '250px' },
                  aspectRatio: '3/4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'grey.50',
                  borderRadius: 3,
                  overflow: 'hidden',
                }}>
                  <Box
                    component="img"
                    src={`https:${doctor.fields.photo.fields.file.url}`}
                    alt={doctor.fields.doctorName}
                    sx={{ 
                      width: '100%', 
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center top',
                      borderRadius: 2,
                    }}
                  />
                </Box>
              )}

              {/* Fields Grid */}
              <Box sx={{ 
                flex: 1, 
                minHeight: 0,
                overflowY: 'auto',
                overflowX: 'hidden',
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'rgba(0,0,0,0.2)',
                  borderRadius: '4px',
                  '&:hover': {
                    background: 'rgba(0,0,0,0.3)',
                  },
                },
              }}>
                {/* Tile Grid */}
                <Box sx={{ 
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                  gap: 2,
                }}>
                  {getFieldData().map((field, idx) => (
                    <Paper
                      key={idx}
                      elevation={0}
                      sx={{
                        p: 2,
                        height: '100%',
                        border: '1px solid',
                        borderColor: 'grey.200',
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 2,
                        transition: 'all 0.2s',
                        gridColumn: field.fullWidth ? '1 / -1' : 'auto', // Full width for facilities
                        '&:hover': {
                          borderColor: 'primary.main',
                          bgcolor: 'primary.50',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          color: 'primary.main',
                          display: 'flex',
                          alignItems: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {field.icon}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                          {field.title}
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {field.content}
                        </Typography>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      ) : null}
    </Dialog>
  )
}
