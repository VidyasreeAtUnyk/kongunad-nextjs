import React from 'react'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Skeleton,
} from '@mui/material'
import { Specialty } from '@/types/contentful'

interface SpecialtyCardProps {
  specialty: Specialty
  onClick?: () => void
  loadingPriority?: 'eager' | 'lazy' | 'auto'
}

export const SpecialtyCard: React.FC<SpecialtyCardProps> = ({ specialty, onClick, loadingPriority = 'auto' }) => {
  const { fields } = specialty
  
  // Convert type to URL slug
  const typeSlug = fields.type === 'medical' ? 'medical-specialties' : 'surgical-specialties'
  const slug = fields.slug || fields.name.toLowerCase().replace(/\s+/g, '-')
  
  return (
    <Link href={`/specialities/${typeSlug}/${slug}`} style={{ textDecoration: 'none' }}>
      <Card 
        sx={{ 
          width: '100%',
          cursor: 'pointer',
          height: '100%',
          minHeight: 280,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
          borderRadius: 2,
          '&:hover': {
            boxShadow: '0 12px 38px rgba(0,0,0,0.25)',
            transform: 'translateY(-4px)',
          },
          transition: 'box-shadow 0.3s ease, transform 0.3s ease',
          willChange: 'transform',
          transform: 'translateZ(0)',
          outline: 'none',
          '&:focus-visible': {
            boxShadow: '0 0 0 3px rgba(25,118,210,0.35), 0 12px 38px rgba(0,0,0,0.25)'
          }
        }}
        onClick={onClick}
      >
        <Box sx={{ position: 'relative', width: '100%', height: 280 }}>
          {fields.icon?.fields?.file?.url ? (
            <CardMedia
              component="img"
              image={`https:${fields.icon.fields.file.url}`}
              alt={fields.name}
              sx={{ 
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                transition: 'transform 0.4s ease',
                willChange: 'transform',
                backfaceVisibility: 'hidden',
                '.MuiCard-root:hover &': {
                  transform: 'scale(1.06)'
                }
              }}
              loading={loadingPriority}
              decoding="async"
              {...({ fetchPriority: loadingPriority === 'eager' ? 'high' : 'auto' } as any)}
            />
          ) : (
            <Skeleton variant="rounded" animation="wave" sx={{ width: '100%', height: '100%', borderRadius: 2 }} />
          )}
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              p: 2,
              pt: 6,
              background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 55%, rgba(0,0,0,0.78) 100%)',
              color: 'white',
              transition: 'background 0.3s ease',
              '.MuiCard-root:hover &': {
                background: 'linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.6) 55%, rgba(0,0,0,0.85) 100%)'
              }
            }}
          >
            <Box 
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                backgroundColor: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(4px)',
                mb: 1.5,
              }}
            >
              <Typography 
                variant="caption" 
                sx={{ 
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  fontSize: '0.7rem',
                }}
              >
                {fields.type === 'medical' ? 'Medical' : 'Surgical'}
              </Typography>
            </Box>
            <Typography 
              variant="h6" 
              component="div"
              sx={{ 
                fontWeight: 600,
                mb: 0.5,
                textShadow: '0 2px 8px rgba(0,0,0,0.6)',
                lineHeight: 1.3,
              }}
            >
              {fields.name}
            </Typography>
            {fields.description && (
              <Typography 
                variant="body2" 
                sx={{ 
                  opacity: 0.95,
                  textShadow: '0 2px 6px rgba(0,0,0,0.6)',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {fields.description}
              </Typography>
            )}
          </Box>
        </Box>
      </Card>
    </Link>
  )
}

