import React from 'react'
import { Box, Container, Typography, Skeleton } from '@mui/material'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import type { Document } from '@contentful/rich-text-types'
import { Doctor, Leadership } from '@/types/contentful'
import MultiItemCarousel from '@/components/ui/MultiItemCarousel'
import { DoctorTileCard } from '@/components/content/DoctorTileCard'

interface DoctorsSectionProps {
  doctors: Doctor[]
  leadership?: Leadership | null
  mdPhotoUrlOverride?: string | null
}

export const DoctorsSection: React.FC<DoctorsSectionProps> = ({ doctors, leadership, mdPhotoUrlOverride }) => {
  // Helper to render a bio block with safe fallbacks
  const BioBlock = ({ 
    title, 
    name,
    bio,
    photoUrl,
    bgUrl,
  }: { title: string; name: string; bio: any; photoUrl?: string; bgUrl?: string }) => {
    const img = photoUrl

    return (
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, alignItems: 'stretch' }}>
        <Box sx={{ 
          flex: { xs: '1 1 auto', md: '0 0 36%' },
          minWidth: 0, // Prevent flex item from overflowing
          // Constrain portrait on mid-range screens to avoid oversized rendering
          '@media (min-width:627px) and (max-width:899px)': {
            maxWidth: 360,
            mx: 'auto',
            width: '100%',
          },
        }}>
          {img ? (
            <Box
              aria-label={`${name} portrait over background`}
              sx={{
                width: '100%',
                minHeight: 200, // Ensure minimum visibility
                aspectRatio: '3 / 4',
                borderRadius: 2,
                overflow: 'hidden',
                backgroundImage: bgUrl ? `url(${img}), url(${bgUrl})` : `url(${img})`,
                // Ensure portrait hugs the bottom edge and respects rounding
                backgroundSize: bgUrl ? 'auto 100%, cover' : 'cover',
                backgroundPosition: bgUrl ? 'center bottom, center' : 'center',
                backgroundRepeat: 'no-repeat, no-repeat',
              }}
            />
          ) : (
            <Skeleton variant="rectangular" animation="wave" sx={{ width: '100%', height: 'auto', aspectRatio: '3 / 4', borderRadius: 2 }} />
          )}
        </Box>
        <Box sx={{ flex: { xs: '1 1 auto', md: '1 1 0' }, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="overline" sx={{ letterSpacing: 1.5, color: 'text.secondary' }}>{title}</Typography>
          <Typography variant="h3" color="primary" sx={{ fontWeight: 800 }}>{name}</Typography>
          <Box sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
            {bio && typeof bio === 'object' && (bio as Document).nodeType ? (
              documentToReactComponents(bio as Document)
            ) : (
              (typeof bio === 'string' ? bio.split(/\n\n+/) : [String(bio || '')]).map((para, idx) => (
                <Typography key={idx} variant="body1" sx={{ mb: 1.5 }}>
                  {para}
                </Typography>
              ))
            )}
          </Box>
        </Box>
      </Box>
    )
  }

  // Fallback bios (from provided previous version)
  const mdFallbackName = 'Dr. P Raju'
  const mdFallback = 'Dr. P. Raju Ms., who is the founder of Kongunad Group Of Medical institutions hailed from a small village Bramadesam in Anthiyur, Erode District...'
  const medDirFallbackName = 'Dr. Karthikeyan Raju'
  const medDirFallback = 'Son of our MD - Dr.P.Raju born in 1986 after finishing his schooling did Undergraduation from the famous PSG Medical College...'

  return (
    <Box component="section" sx={{ py: 8 }}>
      <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <Typography variant="h2" color="primary">Our Doctors</Typography>

        <BioBlock 
          title="Managing Director" 
          name={leadership?.fields.managingDirector || mdFallbackName}
          bio={leadership?.fields.mdBio || mdFallback}
          photoUrl={mdPhotoUrlOverride || (leadership?.fields.mdPhoto?.fields?.file?.url ? `https:${leadership.fields.mdPhoto.fields.file.url}` : undefined)}
          bgUrl={leadership?.fields.mdBackgroundPhoto?.fields?.file?.url ? `https:${leadership.fields.mdBackgroundPhoto.fields.file.url}` : undefined}
        />
        <BioBlock 
          title="Medical Director" 
          name={leadership?.fields.medicalDirector || medDirFallbackName}
          bio={leadership?.fields.medicalDirectorBio || medDirFallback}
          photoUrl={leadership?.fields.medicalDirectorPhoto?.fields?.file?.url ? `https:${leadership.fields.medicalDirectorPhoto.fields.file.url}` : undefined}
        />

        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h3" color="primary">Meet our Specialists</Typography>
            <Typography component="a" href="/find-a-doctor" sx={{ textDecoration: 'none', fontWeight: 600, color: 'primary.main' }}>View All</Typography>
          </Box>
          {doctors && doctors.length > 0 ? (
            <MultiItemCarousel autoplay itemGap={16} sidePadding={16} prevAriaLabel="Previous doctors" nextAriaLabel="Next doctors">
              {doctors.map((doc) => (
                <DoctorTileCard key={doc.sys.id} doctor={doc} />
              ))}
            </MultiItemCarousel>
          ) : (
            <Box sx={{ display: 'flex', gap: 2 }}>
              {[1,2,3,4].map((i) => (
                <Skeleton 
                  key={i}
                  variant="rounded" 
                  animation="wave" 
                  sx={{ 
                    flex: '0 0 auto',
                    width: {
                      xs: `calc((100% - ${2 * 1}px) / 1)`,
                      sm: `calc((100% - ${2 * 2}px) / 2)`,
                      md: `calc((100% - ${2 * 3}px) / 3)`,
                      lg: `calc((100% - ${2 * 4}px) / 4)`,
                    },
                    height: { xs: 220, sm: 240, md: 260 }, 
                    borderRadius: 2 
                  }} 
                />
              ))}
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  )
}

export default DoctorsSection


