'use client'

import React, { useCallback } from 'react'
import { Box, Card, CardMedia, Typography, Skeleton } from '@mui/material'
import { Doctor } from '@/types/contentful'
import { useAppDispatch } from '@/store/hooks'
import { openModal } from '@/store/modalSlice'

interface DoctorTileCardProps {
  doctor: Doctor
  loadingPriority?: 'eager' | 'lazy' | 'auto'
}

export const DoctorTileCard: React.FC<DoctorTileCardProps> = ({ doctor, loadingPriority = 'auto' }) => {
  const dispatch = useAppDispatch()
  const { fields, sys } = doctor
  const photoUrl = fields.photo?.fields?.file?.url ? `https:${fields.photo.fields.file.url}` : undefined

  const handleClick = () => {
    dispatch(openModal({ type: 'doctor', id: sys.id }))
  }

  // Optimize Contentful image URLs (format, quality, width)
  const getOptimizedUrl = useCallback((url: string, width: number = 800, quality: number = 75) => {
    try {
      if (!url) return url
      const u = new URL(url.startsWith('//') ? `https:${url}` : url)
      const isContentful = u.hostname.includes('ctfassets.net')
      if (!isContentful) return u.toString()
      const clampedW = Math.max(400, Math.min(1200, Math.floor(width)))
      const clampedQ = Math.max(50, Math.min(85, Math.floor(quality)))
      if (!u.searchParams.has('fm')) u.searchParams.set('fm', 'webp')
      if (!u.searchParams.has('q')) u.searchParams.set('q', String(clampedQ))
      if (!u.searchParams.has('w')) u.searchParams.set('w', String(clampedW))
      return u.toString()
    } catch {
      return url
    }
  }, [])

  return (
    <Card
      onClick={handleClick}
      sx={{
        width: '100%',
        cursor: 'pointer',
        height: '100%',
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
    >
      <Box sx={{ position: 'relative' }}>
        {photoUrl ? (
          <CardMedia
            component="img"
            image={getOptimizedUrl(photoUrl)}
            alt={fields.doctorName}
            sx={{
              width: '100%',
              aspectRatio: '1 / 1',
              objectFit: 'cover',
              objectPosition: 'top',
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
          <Skeleton variant="rounded" animation="wave" sx={{ width: '100%', height: { xs: 220, sm: 240, md: 260 }, borderRadius: 2 }} />
        )}
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            p: 2,
            pt: 6,
            background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 55%, rgba(0,0,0,0.82) 100%)',
            color: 'white',
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 800,
              lineHeight: 1.2,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textShadow: '0 2px 8px rgba(0,0,0,0.6)'
            }}
          >
            {fields.doctorName}
          </Typography>
          <Typography
            variant="caption"
            sx={{ opacity: 0.9 }}
          >
            {fields.department}
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Box
              role="button"
              onClick={(e: any) => { e.stopPropagation(); handleClick() }}
              tabIndex={0}
              onKeyDown={(e: any) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); handleClick() }}}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                px: 1.5,
                py: 0.5,
                borderRadius: 1.5,
                backgroundColor: 'rgba(255,255,255,0.08)',
                // border: '1px solid rgba(255,255,255,0.18)', // match Facilities if needed
                backdropFilter: 'blur(4px)',
                color: 'white',
                fontSize: 12,
                cursor: 'pointer',
                boxShadow: '0 6px 16px rgba(0,0,0,0.25)',
                transition: 'background-color 0.2s ease, transform 0.2s ease',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.12)' },
                '& .ctaArrow': {
                  transition: 'transform 0.2s ease, opacity 0.2s ease',
                  opacity: 0,
                  transform: 'translateX(-3px)'
                },
                '&:hover .ctaArrow': {
                  transform: 'translateX(3px)',
                  opacity: 1
                },
                '&:focus-visible': { outline: '2px solid rgba(255,255,255,0.6)', outlineOffset: 2 },
              }}
            >
              <Typography component="span" sx={{ fontWeight: 600 }}>View Profile</Typography>
              <Box
                component="span"
                aria-hidden
                className="ctaArrow"
                sx={{ fontSize: 14 }}
              >
                →
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Card>
  )
}

export default DoctorTileCard


