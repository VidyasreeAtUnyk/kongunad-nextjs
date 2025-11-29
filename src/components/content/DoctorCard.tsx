'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
  Card,
  CardMedia,
  Typography,
  Box,
  Button,
  Skeleton,
} from '@mui/material'
import { Doctor } from '@/types/contentful'

interface DoctorCardProps {
  doctor: Doctor
  onClick?: () => void
  onViewProfile?: () => void
  onBookAppointment?: () => void
}

const DoctorCardComponent: React.FC<DoctorCardProps> = ({ 
  doctor, 
  onClick,
  onViewProfile,
  onBookAppointment
}) => {
  const { fields } = doctor
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  // Check if image is already loaded (e.g., from cache) after mount
  useEffect(() => {
    if (!fields.photo?.fields?.file?.url) {
      setImageLoading(false)
      setImageError(true)
      return
    }

    const checkImageLoaded = () => {
      if (imgRef.current) {
        // If image is complete and has dimensions, it loaded successfully
        if (imgRef.current.complete && imgRef.current.naturalHeight > 0) {
          setImageLoading(false)
          setImageError(false)
        }
        // Only mark as error if image is complete but has no dimensions (actual error)
        // Don't mark as error if image is still loading (complete === false)
        else if (imgRef.current.complete && imgRef.current.naturalHeight === 0 && imgRef.current.naturalWidth === 0) {
          setImageLoading(false)
          setImageError(true)
        }
      }
    }
    
    // Check after a short delay to allow image to start loading
    const timeout = setTimeout(checkImageLoaded, 200)
    return () => clearTimeout(timeout)
  }, [fields.photo?.fields?.file?.url])
  
  return (
    <Card 
      sx={{ 
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        },
        transition: 'all 0.3s ease-in-out',
      }}
      onClick={onClick}
    >
      {/* Doctor Photo with Overlay Content */}
      <Box sx={{ position: 'relative', width: '100%', height: 280, overflow: 'hidden' }}>
        {imageLoading && (
          <Skeleton
            variant="rectangular"
            width="100%"
            height="100%"
            sx={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }}
          />
        )}
        {!imageError && fields.photo?.fields?.file?.url && (
          <CardMedia
            component="img"
            ref={imgRef}
            image={fields.photo.fields.file.url.startsWith('//') 
              ? `https:${fields.photo.fields.file.url}` 
              : fields.photo.fields.file.url.startsWith('http')
              ? fields.photo.fields.file.url
              : `https:${fields.photo.fields.file.url}`}
            alt={fields.doctorName}
            loading="lazy"
            sx={{
              objectFit: 'cover',
              objectPosition: 'top',
              width: '100%',
              height: '100%',
              opacity: imageLoading ? 0 : 1,
              transition: 'opacity 0.3s ease-in-out',
              position: 'relative',
              zIndex: 1,
            }}
            onLoad={() => {
              setImageLoading(false)
              setImageError(false)
            }}
            onError={() => {
              setImageLoading(false)
              setImageError(true)
            }}
          />
        )}
        {!fields.photo?.fields?.file?.url && (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'grey.200',
              color: 'text.secondary',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <Typography variant="caption">No Image</Typography>
          </Box>
        )}
        {imageError && fields.photo?.fields?.file?.url && (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'grey.200',
              color: 'text.secondary',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <Typography variant="caption">No Image</Typography>
          </Box>
        )}

        {/* Gradient Overlay - Always on top */}
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            p: 1.5,
            pt: 4,
            background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.7) 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            zIndex: 2,
          }}
        >
          <Box sx={{ mb: 1 }}>
            <Typography 
              variant="h6" 
              component="div" 
              fontWeight={600} 
              sx={{ 
                mb: 0.25, 
                fontSize: '1rem', 
                lineHeight: 1.3,
                color: 'white',
                textShadow: '0 2px 8px rgba(0,0,0,0.6)',
              }}
            >
              {fields.doctorName}
            </Typography>
            
            <Typography 
              variant="body2" 
              sx={{ 
                fontSize: '0.875rem',
                color: 'white',
                textShadow: '0 2px 6px rgba(0,0,0,0.6)',
                opacity: 0.95,
              }}
            >
              {fields.department}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 0.75 }}>
            {onViewProfile && (
              <Button 
                variant="outlined" 
                fullWidth
                size="small"
                onClick={(e) => {
                  e.stopPropagation()
                  if (onViewProfile) onViewProfile()
                }}
                sx={{ 
                  py: 0.4,
                  px: 0.75,
                  fontSize: '0.7rem',
                  minWidth: 'auto',
                  whiteSpace: 'nowrap',
                  borderColor: 'rgba(255,255,255,0.5)',
                  color: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(4px)',
                  '&:hover': {
                    borderColor: 'rgba(255,255,255,0.8)',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                  },
                }}
              >
                Profile
              </Button>
            )}
            {onBookAppointment && (
              <Button 
                variant="contained" 
                fullWidth
                size="small"
                onClick={(e) => {
                  e.stopPropagation()
                  if (onBookAppointment) onBookAppointment()
                }}
                sx={{ 
                  py: 0.4,
                  px: 0.75,
                  fontSize: '0.7rem',
                  minWidth: 'auto',
                  whiteSpace: 'nowrap',
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                }}
              >
                Book Now
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Card>
  )
}

// Memoize component to prevent unnecessary re-renders
export const DoctorCard = React.memo(DoctorCardComponent, (prevProps, nextProps) => {
  // Only re-render if doctor data or callbacks change
  return (
    prevProps.doctor.sys.id === nextProps.doctor.sys.id &&
    prevProps.doctor.fields.doctorName === nextProps.doctor.fields.doctorName &&
    prevProps.doctor.fields.department === nextProps.doctor.fields.department &&
    prevProps.onViewProfile === nextProps.onViewProfile &&
    prevProps.onBookAppointment === nextProps.onBookAppointment &&
    prevProps.onClick === nextProps.onClick
  )
})
