'use client'

import React, { useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Container,
  Typography,
  Breadcrumbs,
  Link,
  Card,
  CardContent,
  Alert,
} from '@mui/material'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import SchoolIcon from '@mui/icons-material/School'
import PhoneIcon from '@mui/icons-material/Phone'
import EmailIcon from '@mui/icons-material/Email'
import { ResearchProgram } from '@/types/contentful'
import { ResearchProgramCard } from '@/components/content/ResearchProgramCard'
import { useAppDispatch } from '@/store/hooks'
import { openBottomSheet } from '@/store/bottomSheetSlice'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'

interface ResearchPageClientProps {
  researchPrograms: ResearchProgram[]
}

export const ResearchPageClient: React.FC<ResearchPageClientProps> = ({
  researchPrograms = [],
}) => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  // Memoize handlers to prevent unnecessary re-renders
  const handleApply = useCallback((program: ResearchProgram) => {
    if (!program?.fields?.title) {
      return
    }
    dispatch(
      openBottomSheet({
        type: 'research',
        courseName: program.fields.title,
      })
    )
  }, [dispatch])

  const handleLearnMore = useCallback((program: ResearchProgram) => {
    if (!program?.fields?.slug) {
      return
    }
    router.push(`/medical-studies-research/${program.fields.slug}`)
  }, [router])

  // Memoize filtered programs
  const validPrograms = useMemo(() => {
    return researchPrograms.filter(
      (program) => program && program.fields && program.sys?.id
    )
  }, [researchPrograms])

  return (
    <ErrorBoundary
      fallback={
        <Box sx={{ minHeight: '60vh', py: 8, backgroundColor: 'background.default' }}>
          <Container maxWidth="lg">
            <Alert severity="error" sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Unable to load research programs
              </Typography>
              <Typography variant="body2">
                Please refresh the page or contact us if the problem persists.
              </Typography>
            </Alert>
          </Container>
        </Box>
      }
    >
      <Box sx={{ minHeight: '60vh', py: 8, backgroundColor: 'background.default' }}>
        <Container maxWidth="lg">
          <Breadcrumbs sx={{ mb: 3 }}>
            <Link href="/" color="inherit">
              Home
            </Link>
            <Typography color="text.primary">Medical Studies & Research</Typography>
          </Breadcrumbs>

          {/* Hero Section */}
          <Box sx={{ mb: 6, textAlign: { xs: 'left' } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
              <SchoolIcon sx={{ fontSize: { xs: 36, md: 48 }, color: 'primary.main' }} />
              <Typography 
                variant="h1" 
                color="primary" 
                sx={{ 
                  fontWeight: 800,
                }}
              >
                Medical Studies & Research
              </Typography>
            </Box>
            <Typography 
              variant="h5" 
              color="text.secondary" 
              sx={{ mb: 2, fontWeight: 300 }}
            >
              Kongunad Post Graduate Institute of Medical Studies and Research Centre
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '800px' }}>
              Join our prestigious DNB (Diplomate of National Board) programs and advance your medical
              career with world-class training, expert faculty, and state-of-the-art facilities.
            </Typography>
          </Box>

          {/* Programs Section with Sidebar */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: '2fr 1fr',
              },
              gap: 4,
            }}
          >
            {/* Main Content */}
            <Box>
              {validPrograms.length > 0 ? (
                <>
                  <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
                    Available Programs
                  </Typography>
                  <ErrorBoundary
                    fallback={
                      <Alert severity="error" sx={{ mb: 3 }}>
                        <Typography variant="body2">
                          Some program cards could not be displayed. Please refresh the page.
                        </Typography>
                      </Alert>
                    }
                  >
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                          xs: '1fr',
                          sm: 'repeat(2, 1fr)',
                          md: 'repeat(2, 1fr)',
                        },
                        gap: 3,
                      }}
                    >
                      {validPrograms.map((program) => (
                        <ErrorBoundary
                          key={program.sys.id}
                          fallback={
                            <Card sx={{ p: 2 }}>
                              <Alert severity="warning">
                                This program card could not be displayed.
                              </Alert>
                            </Card>
                          }
                        >
                          <ResearchProgramCard
                            program={program}
                            onApply={() => handleApply(program)}
                            onLearnMore={() => handleLearnMore(program)}
                          />
                        </ErrorBoundary>
                      ))}
                    </Box>
                  </ErrorBoundary>
                </>
              ) : (
                <Card sx={{ p: 4, textAlign: 'center' }}>
                  <CardContent>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No research programs available at this time
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Please check back later or contact us for more information.
                    </Typography>
                  </CardContent>
                </Card>
              )}
            </Box>

            {/* Sidebar */}
            <Box>
              <ErrorBoundary
                fallback={
                  <Alert severity="warning">
                    Contact information could not be displayed.
                  </Alert>
                }
              >
                {/* Contact Information Card */}
                <Card
                  sx={{
                    background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(25, 118, 210, 0.01) 100%)',
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <LocalHospitalIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                      <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                        Contact Information
                      </Typography>
                    </Box>

                    <Typography variant="body1" sx={{ mb: 1, fontWeight: 600 }}>
                      Dr. Karthikeyan Ms.
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Course Director & Medical Director
                    </Typography>

                    {/* Phone Numbers */}
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <PhoneIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                          Phone:
                        </Typography>
                      </Box>
                      <Box sx={{ pl: 3, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Link
                          href="tel:+919585211999"
                          color="primary"
                          sx={{
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'underline' },
                          }}
                        >
                          09585211999
                        </Link>
                        <Link
                          href="tel:+914224316000"
                          color="primary"
                          sx={{
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'underline' },
                          }}
                        >
                          0422 – 4316000
                        </Link>
                      </Box>
                    </Box>

                    {/* Email */}
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <EmailIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                          Email:
                        </Typography>
                      </Box>
                      <Box sx={{ pl: 3 }}>
                        <Link
                          href="mailto:kongunad@gmail.com"
                          color="primary"
                          sx={{
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'underline' },
                          }}
                        >
                          kongunad@gmail.com
                        </Link>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </ErrorBoundary>
            </Box>
          </Box>
        </Container>
      </Box>
    </ErrorBoundary>
  )
}

