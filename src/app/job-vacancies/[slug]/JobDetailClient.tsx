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
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Alert,
  Divider,
} from '@mui/material'
import WorkIcon from '@mui/icons-material/Work'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { JobVacancy } from '@/types/contentful'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'

interface JobDetailClientProps {
  job: JobVacancy
}

export const JobDetailClient: React.FC<JobDetailClientProps> = ({ job }) => {
  const router = useRouter()

  // Validate job data
  if (!job || !job.fields) {
    return (
      <Box sx={{ minHeight: '60vh', py: 8, backgroundColor: 'background.default' }}>
        <Container maxWidth="lg">
          <Alert severity="error">
            <Typography variant="h6" gutterBottom>
              Job data is missing
            </Typography>
            <Typography variant="body2">
              Unable to load job details. Please try again later.
            </Typography>
          </Alert>
        </Container>
      </Box>
    )
  }

  const { fields } = job

  const handleApply = useCallback(() => {
    if (!fields.designation || !fields.slug) {
      return
    }
    // Navigate to apply page with query params
    const params = new URLSearchParams({
      designation: fields.designation,
      job: fields.slug,
    })
    router.push(`/job-vacancies/apply?${params.toString()}`)
  }, [router, fields.designation, fields.slug])

  const handleBack = useCallback(() => {
    router.push('/job-vacancies/current-openings')
  }, [router])

  // Safe title fallback
  const jobTitle = fields.title || 'Job Details'

  // Helper function to safely format dates
  const formatDate = useCallback((dateString: string | undefined): string | null => {
    if (!dateString) return null
    try {
      const date = new Date(dateString)
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString()
      }
    } catch {
      // Invalid date, return null
    }
    return null
  }, [])

  const postedDateFormatted = useMemo(() => formatDate(fields.postedDate), [fields.postedDate, formatDate])
  const closingDateFormatted = useMemo(() => formatDate(fields.closingDate), [fields.closingDate, formatDate])

  return (
    <ErrorBoundary
      fallback={
        <Box sx={{ minHeight: '60vh', py: 8, backgroundColor: 'background.default' }}>
          <Container maxWidth="lg">
            <Alert severity="error">
              <Typography variant="h6" gutterBottom>
                Unable to load job details
              </Typography>
              <Typography variant="body2">
              Please refresh the page or go back to the job listings.
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
            <Link href="/job-vacancies" color="inherit">
              Job Vacancies
            </Link>
            <Link href="/job-vacancies/current-openings" color="inherit">
              Current Openings
            </Link>
            <Typography color="text.primary">{jobTitle}</Typography>
          </Breadcrumbs>

          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ mb: 4 }}
          >
            Back to Openings
          </Button>

          {/* Job Header */}
          <ErrorBoundary
            fallback={
              <Alert severity="warning" sx={{ mb: 4 }}>
                Job header could not be displayed.
              </Alert>
            }
          >
            <Box sx={{ mb: 6 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: 2,
                    backgroundColor: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    flexShrink: 0,
                  }}
                >
                  <WorkIcon sx={{ fontSize: 32 }} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography 
                    variant="h1" 
                    color="primary" 
                    sx={{ 
                      fontWeight: 800,
                      mb: 1,
                    }}
                  >
                    {jobTitle}
                  </Typography>
                  {fields.department && (
                    <Chip label={fields.department} color="primary" variant="outlined" sx={{ mr: 1 }} />
                  )}
                  {fields.active === false && (
                    <Chip
                      label="Position Closed"
                      color="default"
                      sx={{ ml: 1 }}
                    />
                  )}
                </Box>
              </Box>

              {/* Job Quick Info */}
              {(fields.location || fields.experience || fields.employmentType || fields.salaryRange) && (
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 3,
                    p: 3,
                    backgroundColor: 'grey.50',
                    borderRadius: 2,
                    mb: 3,
                  }}
                >
                  {fields.location && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationOnIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                      <Typography variant="body1" color="text.secondary">
                        {fields.location}
                      </Typography>
                    </Box>
                  )}
                  {fields.experience && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccessTimeIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                      <Typography variant="body1" color="text.secondary">
                        {fields.experience}
                      </Typography>
                    </Box>
                  )}
                  {fields.employmentType && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BusinessCenterIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                      <Typography variant="body1" color="text.secondary">
                        {fields.employmentType}
                      </Typography>
                    </Box>
                  )}
                  {fields.salaryRange && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body1" color="primary" sx={{ fontWeight: 600 }}>
                        {fields.salaryRange}
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          </ErrorBoundary>

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
              <ErrorBoundary
                fallback={
                  <Alert severity="error" sx={{ mb: 4 }}>
                    Job content could not be displayed.
                  </Alert>
                }
              >
                <Card sx={{ mb: 4 }}>
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                      Job Description
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ lineHeight: 1.8, whiteSpace: 'pre-line' }}
                    >
                      {fields.description || 'No description available.'}
                    </Typography>
                  </CardContent>
                </Card>

                {fields.requirements && Array.isArray(fields.requirements) && fields.requirements.length > 0 && (
                  <Card sx={{ mb: 4 }}>
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                        Requirements
                      </Typography>
                      <List>
                        {fields.requirements.map((requirement, index) => {
                          if (!requirement) return null
                          return (
                            <ListItem key={`requirement-${index}`} sx={{ px: 0 }}>
                              <ListItemIcon sx={{ minWidth: '40px' }}>
                                <CheckCircleIcon color="primary" />
                              </ListItemIcon>
                              <ListItemText primary={requirement} />
                            </ListItem>
                          )
                        })}
                      </List>
                    </CardContent>
                  </Card>
                )}

                {fields.responsibilities && Array.isArray(fields.responsibilities) && fields.responsibilities.length > 0 && (
                  <Card sx={{ mb: 4 }}>
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                        Key Responsibilities
                      </Typography>
                      <List>
                        {fields.responsibilities.map((responsibility, index) => {
                          if (!responsibility) return null
                          return (
                            <ListItem key={`responsibility-${index}`} sx={{ px: 0 }}>
                              <ListItemIcon sx={{ minWidth: '40px' }}>
                                <CheckCircleIcon color="primary" />
                              </ListItemIcon>
                              <ListItemText primary={responsibility} />
                            </ListItem>
                          )
                        })}
                      </List>
                    </CardContent>
                  </Card>
                )}

                {fields.qualifications && Array.isArray(fields.qualifications) && fields.qualifications.length > 0 && (
                  <Card>
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                        Required Qualifications
                      </Typography>
                      <List>
                        {fields.qualifications.map((qualification, index) => {
                          if (!qualification) return null
                          return (
                            <ListItem key={`qualification-${index}`} sx={{ px: 0 }}>
                              <ListItemIcon sx={{ minWidth: '40px' }}>
                                <CheckCircleIcon color="primary" />
                              </ListItemIcon>
                              <ListItemText primary={qualification} />
                            </ListItem>
                          )
                        })}
                      </List>
                    </CardContent>
                  </Card>
                )}
              </ErrorBoundary>
            </Box>

            {/* Sidebar */}
            <Box>
              <ErrorBoundary
                fallback={
                  <Alert severity="warning" sx={{ mb: 3 }}>
                    Apply section could not be displayed.
                  </Alert>
                }
              >
                {/* Apply Now Card */}
                <Card
                  sx={{
                    position: 'sticky',
                    top: 100,
                    background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.08) 0%, rgba(25, 118, 210, 0.02) 100%)',
                    border: '1px solid',
                    borderColor: 'primary.light',
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                      <Box
                        sx={{
                          width: 64,
                          height: 64,
                          borderRadius: 2,
                          backgroundColor: 'primary.main',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          mx: 'auto',
                          mb: 2,
                        }}
                      >
                        <WorkIcon sx={{ fontSize: 32 }} />
                      </Box>
                      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                        Apply Now
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Ready to join our team? Submit your application today.
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      fullWidth
                      size="large"
                      disabled={fields.active === false}
                      onClick={handleApply}
                      sx={{
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        textTransform: 'none',
                      }}
                    >
                      {fields.active === false ? 'Position Closed' : 'Apply Now'}
                    </Button>
                    {postedDateFormatted && (
                      <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="caption" color="text.secondary">
                          Posted: {postedDateFormatted}
                        </Typography>
                      </Box>
                    )}
                    {closingDateFormatted && (
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                        Closing: {closingDateFormatted}
                      </Typography>
                    )}
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

