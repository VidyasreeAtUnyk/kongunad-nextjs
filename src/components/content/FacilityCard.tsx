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
import { Facility } from '@/types/contentful'

interface FacilityCardProps {
  facility: Facility
  onClick?: () => void
  loadingPriority?: 'eager' | 'lazy' | 'auto'
}

export const FacilityCard: React.FC<FacilityCardProps> = ({ facility, onClick, loadingPriority = 'auto' }) => {
  const { fields } = facility
  
  // Use categorySlug and slug from Contentful, fallback to generated slug
  const categorySlug = fields.categorySlug || fields.category?.toLowerCase().replace(/\s+/g, '-') || 'facilities'
  const slug = fields.slug || fields.name.toLowerCase().replace(/\s+/g, '-')
  
  return (
    <Link href={`/facilities/${categorySlug}/${slug}`} style={{ textDecoration: 'none' }}>
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
                // Scale image when card hovered
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
                py: 1,
                borderRadius: 1.5,
                backgroundColor: 'rgba(255,255,255,0.08)',
                // border: '1px solid rgba(255,255,255,0.18)',
                backdropFilter: 'blur(4px)',
                boxShadow: '0 6px 16px rgba(0,0,0,0.25)',
                transition: 'transform 0.25s ease, background-color 0.25s ease',
                '.MuiCard-root:hover &': {
                  backgroundColor: 'rgba(255,255,255,0.12)'
                }
              }}
            >
              <Typography 
                variant="subtitle1" 
                component="div"
                sx={{
                  fontWeight: 800,
                  letterSpacing: 0.2,
                  lineHeight: 1.2,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textShadow: '0 2px 8px rgba(0,0,0,0.6)'
                }}
              >
                {fields.name}
              </Typography>
              <Box
                component="span"
                aria-hidden
                sx={{
                  ml: 0.5,
                  fontSize: 18,
                  opacity: 0.0,
                  transform: 'translateX(-4px)',
                  transition: 'opacity 0.25s ease, transform 0.25s ease',
                  '.MuiCard-root:hover &': {
                    opacity: 0.9,
                    transform: 'translateX(0)'
                  }
                }}
              >
                →
              </Box>
            </Box>
          </Box>
        </Box>
      </Card>
    </Link>
  )
}




