import React from 'react'
import {
  Box,
  Container,
  Typography,
  Button,
  Skeleton,
} from '@mui/material'
import { ImageCarousel } from '@/components/ui/ImageCarousel'
import { BuildingImage } from '@/types/contentful'

interface AboutSectionProps {
  buildingImages?: BuildingImage[]
  aboutContent?: {
    title?: string
    description?: string
    highlights?: string[]
  }
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  buildingImages = [],
  aboutContent,
}) => {
  const titleId = 'about-section-title'
  const descId = 'about-section-description'
  // Very lightweight HTML sanitizer for CMS content
  const sanitizeHtml = (html: string): string => {
    if (!html) return ''
    // Remove script and style blocks completely
    let out = html.replace(/<\/(?:script|style)>/gi, '')
    out = out.replace(/<(script|style)[\s\S]*?>[\s\S]*?<\/\1>/gi, '')
    // Remove event handler attributes like onClick, onerror, etc.
    out = out.replace(/ on[a-zA-Z]+\s*=\s*"[^"]*"/g, '')
    out = out.replace(/ on[a-zA-Z]+\s*=\s*'[^']*'/g, '')
    out = out.replace(/ on[a-zA-Z]+\s*=\s*[^\s>]+/g, '')
    // Neutralize javascript: in href/src
    out = out.replace(/(href|src)\s*=\s*"javascript:[^"]*"/gi, '$1="#"')
    out = out.replace(/(href|src)\s*=\s*'javascript:[^']*'/gi, '$1="#"')
    return out
  }

  // Extract image URLs with alt text from buildingImages
  const imageUrls = buildingImages?.map((img) => ({
    src: `https:${img.fields.image.fields.file.url}`,
    alt: img.fields.title || 'Hospital image',
  })) || []

  // If no images, we'll render a skeleton instead of placeholders

  // Default content
  const title = aboutContent?.title || 'About the hospital'
  const description = aboutContent?.description || '<strong>Kongunad Hospital</strong> is a modern tertiary care center offering comprehensive medical and surgical services under one roof, supported by a team of highly skilled specialists. Conveniently located in the heart of Coimbatore, in Tatabad, the hospital serves as a key referral center in the region, equipped with state-of-the-art diagnostic and treatment facilities.'
  const highlights = aboutContent?.highlights || [
    'A team of expert doctors and healthcare professionals covering all specialties, from head to toe.',
    'Accreditation under the NABH Quality Certification, with our Clinical Molecular Laboratory also accredited by NABL.',
    'Partnerships with government schemes, including the Chief Minister\'s Scheme, Tamil Nadu Government Employees Scheme, Tamil Nadu Pensioners Scheme, and PMJAY.',
    'Cashless facilities with major private insurers and TPAs; over 40% of patients benefit from cashless treatment.',
    'With over 35 years of service, Kongunad Hospital has become a trusted healthcare provider for the people of Coimbatore.',
  ]

  return (
    <Box
      component="section"
      role="region"
      aria-labelledby={titleId}
      aria-describedby={descId}
      sx={{
        position: 'relative',
        py: { xs: 5, md: 7.5 },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          height: '1px',
          width: '60%',
          bgcolor: 'divider',
        },
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: 2.5, md: 4 },
          }}
        >
          {/* Title */}
          <Typography
            variant="h2"
            id={titleId}
            sx={{
              fontWeight: 600,
              color: 'primary.main',
              textAlign: { xs: 'center', md: 'left' },
            }}
          >
            {title}
          </Typography>

          {/* Main Content: Carousel and Info */}
          <Box
            sx={{
              display: 'flex',
              gap: { xs: 3, md: 4 },
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'stretch', md: 'flex-start' },
            }}
          >
            {/* Image Carousel or Skeleton */}
            <Box
                sx={{
                  flex: { xs: 1, md: '0 0 460px' },
                  width: { xs: '100%', md: '460px' },
                  maxWidth: { xs: '100%', md: '460px' },
                }}
              >
                {imageUrls.length > 0 ? (
                  <ImageCarousel
                    images={imageUrls}
                    autoplay={true}
                    autoplayInterval={4000}
                    height={{ xs: '300px', md: '500px' }}
                    maxWidth="100%"
                    fit="cover"
                  />
                ) : (
                  <Skeleton 
                    variant="rectangular" 
                    animation="wave" 
                    sx={{ width: '100%', height: { xs: 300, md: 500 }, borderRadius: 3 }} 
                  />
                )}
            </Box>

            {/* About Info */}
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              {/* Description */}
              <Typography
                component="div"
                variant="subtitle1"
                id={descId}
                sx={{
                  '& strong': {
                    fontWeight: 700,
                    color: 'primary.main',
                  },
                }}
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(description) }}
              />

              {/* Highlights */}
              <Box component="div">
                <Typography
                  variant="subtitle2"
                  component="p"
                  sx={{
                    mb: 1.5,
                  }}
                >
                  Key highlights include:
                </Typography>
                <Box
                  component="ul"
                  sx={{
                    listStyle: 'circle',
                    pl: { xs: 3, md: 4 },
                    m: 0,
                    '& li': {
                      mb: 1,
                    },
                  }}
                >
                  {highlights.map((highlight, index) => (
                    <Typography key={index} component="li" variant="body1">
                      {highlight}
                    </Typography>
                  ))}
                </Box>
              </Box>

              {/* About Us Button */}
              <Box sx={{ mt: 1 }}>
                <Button
                  variant="outlined"
                  href="/about-us"
                  sx={{
                    width: 'fit-content',
                    px: 3,
                    py: 1.25,
                    borderRadius: 2,
                    borderWidth: 2,
                    '&:hover': {
                      borderWidth: 2,
                    },
                  }}
                >
                  About us
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

