import React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  Box,
  Container,
  Typography,
  Breadcrumbs,
  Link,
  Paper,
  Card,
  Chip,
  Avatar,
  Divider,
} from '@mui/material'
import MultiItemCarousel from '@/components/ui/MultiItemCarousel'
import { DoctorTileCard } from '@/components/content/DoctorTileCard'
import { FounderTimeline } from './FounderTimeline'
import { getDoctorsCached, getLeadershipCached, getAboutUsPageCached, getTestimonialsCached } from '@/lib/contentful'
import type { Doctor, Leadership, AboutUsPage, Testimonial } from '@/types/contentful'
import { DoctorCard } from '@/components/content/DoctorCard'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import VerifiedIcon from '@mui/icons-material/Verified'
import PeopleIcon from '@mui/icons-material/People'
import AccessTimeIcon from '@mui/icons-material/AccessTime'

export const metadata: Metadata = {
  title: 'About Us - Kongunad Hospital',
  description: 'Learn about Kongunad Hospital - A specialized hospital with a human touch. NABH certified, serving Coimbatore for over 35 years with 100+ qualified doctors and 2,00,000+ satisfied patients.',
  openGraph: {
    title: 'About Us - Kongunad Hospital',
    description: 'A specialized hospital with a human touch. NABH certified, serving Coimbatore for over 35 years.',
    type: 'website',
    siteName: 'Kongunad Hospital',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us - Kongunad Hospital',
    description: 'A specialized hospital with a human touch. NABH certified, serving Coimbatore for over 35 years.',
  },
}

export const revalidate = 300

export default async function AboutUsPage() {
  try {
    // Fetch all data with error handling
    const [doctorsData, leadershipData, aboutUsPageData, testimonialsData] = await Promise.allSettled([
      getDoctorsCached(12) as unknown as Promise<Doctor[]>,
      getLeadershipCached() as unknown as Promise<Leadership | null>,
      getAboutUsPageCached() as unknown as Promise<AboutUsPage | null>,
      getTestimonialsCached() as unknown as Promise<Testimonial[]>,
    ]).then(results =>
      results.map((result, index) => {
        if (result.status === 'rejected') {
          console.error(`Error fetching data for about page (index ${index}):`, result.reason)
          // Return safe defaults
          if (index === 0) return [] as Doctor[]
          if (index === 1) return null as Leadership | null
          if (index === 2) return null as AboutUsPage | null
          return [] as Testimonial[]
        }
        return result.value
      })
    ) as [Doctor[], Leadership | null, AboutUsPage | null, Testimonial[]]

    const doctors = doctorsData || []
    const leadership = leadershipData || null
    const aboutUsPage = aboutUsPageData || null
    const testimonials = testimonialsData || []

    // Find founder (Dr. P. Raju) - use managingDirector from leadership or find from doctors
    const founderName = leadership?.fields?.managingDirector || 'Dr. P. Raju'
    const founder = doctors.find(d => {
      if (!d?.fields?.doctorName) return false
      const name = d.fields.doctorName.toLowerCase()
      return name.includes('raju') || name.includes('p. raju') || name === founderName.toLowerCase()
    }) || null

    // Get content from AboutUsPage or use defaults
    const heroTitle = aboutUsPage?.fields?.heroTitle || 'Specialized Hospital with a human touch.'
    const heroBadge = aboutUsPage?.fields?.heroBadge || 'NABH Entry Level Certified Hospital'
    const stats = aboutUsPage?.fields?.stats || [
      { value: '100+', label: 'Qualified Doctors', icon: 'doctors' },
      { value: '2,00,000+', label: 'Satisfied Patients', icon: 'patients' },
      { value: '24 Hours', label: 'Service', icon: 'hours' },
    ]
    const hospitalHistory = aboutUsPage?.fields?.hospitalHistory || []
    const founderTimeline = aboutUsPage?.fields?.founderTimeline || []

    return (
      <Box sx={{ minHeight: '60vh', backgroundColor: 'background.default', overflow: 'hidden' }}>
        <Container maxWidth="lg" sx={{ width: '100%', maxWidth: '100%', py: 4, px: { xs: 2, sm: 3, md: 4 } }}>
          <Breadcrumbs sx={{ mb: 3 }}>
            <Link href="/" color="inherit">Home</Link>
            <Typography color="text.primary">About Us</Typography>
          </Breadcrumbs>

          {/* Hero Section */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 4, md: 6 },
              mb: { xs: 4, md: 6 },
              borderRadius: { xs: 2, md: 4 },
              background: 'linear-gradient(135deg, #ebf5ff 0%, #f0f7ff 100%)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: { xs: -30, md: -50 },
                right: { xs: -30, md: -50 },
                width: { xs: 120, md: 200 },
                height: { xs: 120, md: 200 },
                borderRadius: '50%',
                background: 'rgba(25, 118, 210, 0.1)',
                zIndex: 0,
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: { xs: -20, md: -30 },
                left: { xs: -20, md: -30 },
                width: { xs: 100, md: 150 },
                height: { xs: 100, md: 150 },
                borderRadius: '50%',
                background: 'rgba(25, 118, 210, 0.08)',
                zIndex: 0,
              },
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography
                variant="h1"
                color="primary"
                sx={{
                  fontWeight: 700,
                  mb: { xs: 1.5, md: 2 },
                  fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' },
                }}
              >
                {heroTitle}
              </Typography>
              <Chip
                icon={<VerifiedIcon />}
                label="NABH Entry Level Certified Hospital"
                color="primary"
                sx={{
                  fontSize: { xs: '0.8rem', sm: '0.9rem' },
                  py: { xs: 2, md: 2.5 },
                  px: 1,
                  height: 'auto',
                  fontWeight: 600,
                }}
              />
            </Box>
          </Paper>

          {/* Stats Section */}
          {stats && stats.length > 0 && (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: `repeat(${stats.length}, 1fr)`,
                },
                gap: 3,
                mb: 6,
                width: '100%',
                maxWidth: '100%',
                overflow: 'hidden',
              }}
            >
              {stats.map((stat, index) => {
                const IconComponent = 
                  stat.icon === 'doctors' ? PeopleIcon :
                  stat.icon === 'patients' ? LocalHospitalIcon :
                  AccessTimeIcon

                return (
                  <Card
                    key={index}
                    sx={{
                      textAlign: 'center',
                      p: 3,
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(25, 118, 210, 0.05) 100%)',
                    }}
                  >
                    <IconComponent sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h3" color="primary" fontWeight={700}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </Card>
                )
              })}
            </Box>
          )}

          {/* Our Founder Section */}
          <Box sx={{ mb: 6 }}>
            <Typography variant="h2" color="primary" gutterBottom sx={{ fontSize: { xs: '1.75rem', md: '2.25rem' }, mb: 4 }}>
              Our Founder
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  md: '300px 1fr',
                },
                gap: 4,
                alignItems: 'start',
              }}
            >
              {/* Founder Image */}
              <Box>
                {(() => {
                  const photoUrl = founder?.fields?.photo?.fields?.file?.url
                    ? `https:${founder.fields.photo.fields.file.url}`
                    : leadership?.fields?.mdPhoto?.fields?.file?.url
                    ? `https:${leadership.fields.mdPhoto.fields.file.url}`
                    : null
                  
                  const bgUrl = leadership?.fields?.mdBackgroundPhoto?.fields?.file?.url
                    ? `https:${leadership.fields.mdBackgroundPhoto.fields.file.url}`
                    : null

                  return (
                    <Box
                      role="img"
                      aria-label={founder?.fields?.doctorName ? `${founder.fields.doctorName} - Founder portrait` : 'Founder portrait'}
                      sx={{
                        width: '100%',
                        minHeight: 200,
                        aspectRatio: '3 / 4',
                        borderRadius: 3,
                        overflow: 'hidden',
                        backgroundImage: bgUrl && photoUrl ? `url(${photoUrl}), url(${bgUrl})` : photoUrl ? `url(${photoUrl})` : 'none',
                        backgroundSize: bgUrl && photoUrl ? 'auto 100%, cover' : photoUrl ? 'cover' : 'auto',
                        backgroundPosition: bgUrl && photoUrl ? 'center bottom, center' : photoUrl ? 'center' : 'center',
                        backgroundRepeat: 'no-repeat, no-repeat',
                        bgcolor: photoUrl ? 'transparent' : 'grey.200',
                        display: photoUrl ? 'block' : 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 3,
                      }}
                    >
                      {!photoUrl && (
                        <Typography variant="body2" color="text.secondary" aria-hidden="true">
                          No Image Available
                        </Typography>
                      )}
                    </Box>
                  )
                })()}
                <Typography variant="h5" color="primary" sx={{ mt: 2, fontWeight: 600 }}>
                  {founder?.fields?.doctorName?.toUpperCase() || 'DR. P. RAJU., M.S'}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  Founder of the Hospital
                </Typography>
              </Box>

              {/* Founder History - S-shaped Timeline */}
              <Box>
                <Typography variant="h3" color="primary" gutterBottom sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, mb: 3, fontWeight: 600 }}>
                  History of Founder
                </Typography>
                {founderTimeline && founderTimeline.length > 0 ? (
                  <FounderTimeline items={founderTimeline} />
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Timeline information coming soon.
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>

          {/* History of the Hospital */}
          <Box sx={{ mb: 6 }}>
            <Typography variant="h2" color="primary" gutterBottom sx={{ fontSize: { xs: '1.75rem', md: '2.25rem' }, mb: 3 }}>
              History of the Hospital
            </Typography>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 3,
                background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(25, 118, 210, 0.02) 100%)',
              }}
            >
              {hospitalHistory && hospitalHistory.length > 0 ? (
                <Box
                  component="ul"
                  sx={{
                    listStyle: 'none',
                    pl: 0,
                    m: 0,
                    '& li': {
                      mb: 2,
                      pl: 3,
                      position: 'relative',
                      '&::before': {
                        content: '"•"',
                        position: 'absolute',
                        left: 0,
                        color: 'primary.main',
                        fontSize: '1.5rem',
                        lineHeight: 1,
                      },
                    },
                  }}
                >
                  {hospitalHistory.map((item, index) => (
                    <Typography key={index} component="li" variant="body1" sx={{ lineHeight: 1.8 }}>
                      {item}
                    </Typography>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  History information coming soon.
                </Typography>
              )}
            </Paper>
          </Box>

          {/* Meet our Doctors */}
          {doctors.length > 0 && (
            <Box sx={{ mb: 6 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h2" color="primary" sx={{ fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
                  Meet our Doctors
                </Typography>
                <Link
                  href="/find-a-doctor"
                  sx={{
                    textDecoration: 'none',
                    color: 'primary.main',
                    fontWeight: 600,
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  View All
                </Link>
              </Box>
              <MultiItemCarousel
                autoplay
                itemGap={16}
                sidePadding={16}
                prevAriaLabel="Previous doctors"
                nextAriaLabel="Next doctors"
              >
                {doctors.map((doctor) => (
                  <DoctorTileCard key={doctor.sys.id} doctor={doctor} />
                ))}
              </MultiItemCarousel>
            </Box>
          )}

          {/* Testimonials Section */}
          <Box sx={{ mb: 6 }}>
            <Typography variant="h2" color="primary" gutterBottom sx={{ fontSize: { xs: '1.75rem', md: '2.25rem' }, mb: 3 }}>
              Testimonials
            </Typography>
            <Box sx={{ py: 1 }}>
              <MultiItemCarousel
                autoplay
                itemGap={16}
                sidePadding={16}
                prevAriaLabel="Previous testimonial"
                nextAriaLabel="Next testimonial"
              >
                {testimonials.map((testimonial) => {
                  const name = testimonial.fields.name || 'Anonymous'
                  const role = testimonial.fields.role || 'Patient'
                  const content = testimonial.fields.content || ''
                  const key = testimonial.sys.id

                  return (
                    <Box
                      key={key}
                      sx={{
                        pt: 0.5,
                        pb: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                      }}
                    >
                      <Card
                        sx={{
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          p: 3,
                          borderRadius: 3,
                          border: '2px solid',
                          borderColor: 'primary.light',
                          background: 'linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(240, 247, 255, 0.5) 100%)',
                          transition: 'all 0.3s ease',
                          minHeight: 220,
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 8px 24px rgba(25, 118, 210, 0.2)',
                            borderColor: 'primary.main',
                          },
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar
                            aria-label={`${name} avatar`}
                            sx={{
                              bgcolor: 'primary.main',
                              mr: 2,
                              width: 48,
                              height: 48,
                              fontSize: '1.25rem',
                              fontWeight: 600,
                              boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                            }}
                          >
                            {name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle1" fontWeight={600} color="primary" component="h3">
                              {name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                              {role}
                            </Typography>
                          </Box>
                        </Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          component="blockquote"
                          sx={{
                            lineHeight: 1.8,
                            flex: 1,
                            fontStyle: 'italic',
                            position: 'relative',
                            pl: 2,
                            m: 0,
                            '&::before': {
                              content: '"\\201C"',
                              position: 'absolute',
                              left: 0,
                              top: -4,
                              fontSize: '2rem',
                              color: 'primary.main',
                              fontFamily: 'Georgia, serif',
                              lineHeight: 1,
                            },
                          }}
                        >
                          {content}
                        </Typography>
                      </Card>
                    </Box>
                  )
                })}
              </MultiItemCarousel>
            </Box>
          </Box>
        </Container>
      </Box>
    )
  } catch (error) {
    console.error('Error rendering about us page:', error)
    // Log error details for debugging in production
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    notFound()
  }
}
