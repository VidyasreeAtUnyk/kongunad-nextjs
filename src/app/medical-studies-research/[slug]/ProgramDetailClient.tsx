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
} from '@mui/material'
import SchoolIcon from '@mui/icons-material/School'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import PhoneIcon from '@mui/icons-material/Phone'
import EmailIcon from '@mui/icons-material/Email'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { ResearchProgram } from '@/types/contentful'
import { useAppDispatch } from '@/store/hooks'
import { openBottomSheet } from '@/store/bottomSheetSlice'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'

interface ProgramDetailClientProps {
  program: ResearchProgram
}

// Helper function to parse phone numbers (handles comma-separated values)
const parsePhoneNumbers = (phoneString: string | undefined): string[] => {
  if (!phoneString || typeof phoneString !== 'string') return []
  try {
  return phoneString
    .split(',')
    .map((phone) => phone.trim())
    .filter((phone) => phone.length > 0)
  } catch {
    return []
  }
}

// Helper function to format phone for tel: link
const formatPhoneForTel = (phone: string): string => {
  if (!phone || typeof phone !== 'string') return ''
  try {
  // Remove spaces, dashes, and parentheses
  const cleaned = phone.replace(/[\s\-()]/g, '')
  // Add + if it doesn't start with + or 0
  if (!cleaned.startsWith('+') && !cleaned.startsWith('0')) {
    return `+91${cleaned}`
  }
  if (cleaned.startsWith('0')) {
    return `+91${cleaned.substring(1)}`
  }
  return cleaned
  } catch {
    return phone
  }
}

export const ProgramDetailClient: React.FC<ProgramDetailClientProps> = ({ program }) => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  
  // Validate program data
  if (!program || !program.fields) {
    return (
      <Box sx={{ minHeight: '60vh', py: 8, backgroundColor: 'background.default' }}>
        <Container maxWidth="lg">
          <Alert severity="error">
            <Typography variant="h6" gutterBottom>
              Program data is missing
            </Typography>
            <Typography variant="body2">
              Unable to load program details. Please try again later.
            </Typography>
          </Alert>
        </Container>
      </Box>
    )
  }

  const { fields } = program

  const handleApply = useCallback(() => {
    if (!fields.title) {
      return
    }
    dispatch(
      openBottomSheet({
        type: 'research',
        courseName: fields.title,
      })
    )
  }, [dispatch, fields.title])

  const handleBack = useCallback(() => {
    router.push('/medical-studies-research')
  }, [router])

  // Memoize phone numbers parsing
  const phoneNumbers = useMemo(() => parsePhoneNumbers(fields.contactPhone), [fields.contactPhone])

  // Safe title fallback
  const programTitle = fields.title || 'Program Details'

  return (
    <ErrorBoundary
      fallback={
        <Box sx={{ minHeight: '60vh', py: 8, backgroundColor: 'background.default' }}>
          <Container maxWidth="lg">
            <Alert severity="error">
              <Typography variant="h6" gutterBottom>
                Unable to load program details
              </Typography>
              <Typography variant="body2">
                Please refresh the page or go back to the programs list.
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
          <Link href="/medical-studies-research" color="inherit">
            Medical Studies & Research
          </Link>
            <Typography color="text.primary">{programTitle}</Typography>
        </Breadcrumbs>

        <Button
          startIcon={<ArrowBackIcon />}
            onClick={handleBack}
          sx={{ mb: 4 }}
        >
          Back to Programs
        </Button>

        {/* Program Header */}
          <ErrorBoundary
            fallback={
              <Alert severity="warning" sx={{ mb: 4 }}>
                Program header could not be displayed.
              </Alert>
            }
          >
        <Box sx={{ mb: 6 }}>
              {fields.icon?.fields?.file?.url ? (
            <Box
              sx={{
                width: 'auto',
                height: 120,
                backgroundColor: 'grey.50',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 3,
                mb: 3,
                borderRadius: 2,
              }}
            >
              <Box
                component="img"
                src={`https:${fields.icon.fields.file.url}`}
                    alt={programTitle}
                    loading="lazy"
                    onError={(e) => {
                      // Hide image on error
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                    }}
                sx={{
                  width: 'auto',
                  height: '100%',
                  maxWidth: '100%',
                  objectFit: 'contain',
                }}
              />
            </Box>
              ) : null}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                <SchoolIcon sx={{ fontSize: { xs: 30, md: 40 }, color: 'primary.main' }} />
                <Typography 
                  variant="h1" 
                  color="primary" 
                  sx={{ 
                    fontWeight: 800,
                    fontSize: { xs: '1.5rem', md: '3.5rem' },
                    lineHeight: { xs: 1.2, md: 1.167 },
                  }}
                >
                  {programTitle}
            </Typography>
            {fields.duration && (
              <Chip label={fields.duration} color="primary" variant="outlined" />
            )}
          </Box>
          {fields.active === false && (
            <Chip
              label="Not Currently Accepting Applications"
              color="default"
              sx={{ mb: 2 }}
            />
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
                  Program content could not be displayed.
                </Alert>
              }
            >
            <Card sx={{ mb: 4 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                  Program Overview
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

              {fields.curriculum && Array.isArray(fields.curriculum) && fields.curriculum.length > 0 && (
              <Card>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                    Curriculum
                  </Typography>
                  <List>
                      {fields.curriculum.map((item, index) => {
                        if (!item) return null
                        return (
                          <ListItem key={`curriculum-${index}`} sx={{ px: 0 }}>
                            <ListItemIcon sx={{ minWidth: '40px' }}>
                          <SchoolIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={item} />
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
                  Contact information could not be displayed.
                </Alert>
              }
            >
            {/* Contact Information Card */}
            <Card
              sx={{
                mb: 3,
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

                {fields.contactPerson ? (
                    <Typography variant="body1" sx={{ mb: 2, fontWeight: 600 }}>
                      {fields.contactPerson}
                    </Typography>
                ) : (
                  <>
                    <Typography variant="body1" sx={{ mb: 1, fontWeight: 600 }}>
                      Dr. Karthikeyan Ms.
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Course Director & Medical Director
                    </Typography>
                  </>
                )}

                {/* Phone Numbers */}
                {phoneNumbers.length > 0 ? (
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <PhoneIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Phone:
                      </Typography>
                    </Box>
                    <Box sx={{ pl: 3, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      {phoneNumbers.map((phone, index) => (
                        <Link
                            key={`phone-${index}`}
                          href={`tel:${formatPhoneForTel(phone)}`}
                          color="primary"
                          sx={{
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'underline' },
                          }}
                        >
                          {phone}
                        </Link>
                      ))}
                    </Box>
                  </Box>
                ) : !fields.contactPerson ? (
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
                ) : null}

                {/* Email */}
                {fields.contactEmail ? (
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <EmailIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Email:
                      </Typography>
                    </Box>
                    <Box sx={{ pl: 3 }}>
                      <Link
                        href={`mailto:${fields.contactEmail}`}
                        color="primary"
                        sx={{
                          textDecoration: 'none',
                          '&:hover': { textDecoration: 'underline' },
                        }}
                      >
                        {fields.contactEmail}
                      </Link>
                    </Box>
                  </Box>
                ) : !fields.contactPerson ? (
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
                ) : null}
              </CardContent>
            </Card>
            </ErrorBoundary>

            {/* Apply Now Card */}
            <ErrorBoundary
              fallback={
                <Alert severity="warning">
                  Apply button could not be displayed.
                </Alert>
              }
            >
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
                  <SchoolIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                    Apply Now
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Start your journey with us today
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
                  {fields.active === false ? 'Not Accepting Applications' : 'Apply Now'}
                </Button>
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

