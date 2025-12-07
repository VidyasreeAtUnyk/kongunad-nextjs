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
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material'
import PhoneIcon from '@mui/icons-material/Phone'
import EmailIcon from '@mui/icons-material/Email'
import DescriptionIcon from '@mui/icons-material/Description'
import BusinessIcon from '@mui/icons-material/Business'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import { getCashlessTreatmentCached } from '@/lib/contentful'
import { CashlessTreatment } from '@/types/contentful'

export async function generateMetadata(): Promise<Metadata> {
  const data = await getCashlessTreatmentCached() as unknown as CashlessTreatment | null

  if (!data) {
    return {
      title: 'Cashless Treatment - Kongunad Hospital',
      description: 'Learn about cashless treatment options, empanelled insurance companies, and TPA services at Kongunad Hospital.',
    }
  }

  const title = data.fields.heroTitle || 'Cashless Treatment'
  const description = data.fields.heroDescription || 'Learn about cashless treatment options, empanelled insurance companies, and TPA services at Kongunad Hospital.'

  return {
    title: `${title} - Kongunad Hospital`,
    description,
    openGraph: {
      title: `${title} - Kongunad Hospital`,
      description,
      type: 'website',
      siteName: 'Kongunad Hospital',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} - Kongunad Hospital`,
      description,
    },
  }
}

export const revalidate = 300

export default async function CashlessTreatmentPage() {
  try {
    const data = await getCashlessTreatmentCached() as unknown as CashlessTreatment | null

    if (!data) {
      notFound()
    }

    const {
      heroTitle,
      heroDescription,
      insuranceCompanies = [],
      requiredDocuments = [],
      chiefMinisterSchemeDescription,
      contactMobile,
      contactPhone,
      contactEmail,
    } = data.fields

    return (
    <Box sx={{ minHeight: '60vh', backgroundColor: 'background.default' }}>
      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 }, px: { xs: 2, sm: 3 } }}>
        <Breadcrumbs sx={{ mb: { xs: 2, md: 3 } }}>
          <Link href="/" color="inherit">
            Home
          </Link>
          <Typography color="text.primary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
            Cashless Treatment
          </Typography>
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
            <LocalHospitalIcon
              sx={{
                fontSize: { xs: 40, sm: 48, md: 64 },
                color: 'primary.main',
                mb: { xs: 1.5, md: 2 },
              }}
              aria-hidden="true"
            />
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
            {heroDescription && (
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{
                  maxWidth: 800,
                  mx: 'auto',
                  lineHeight: 1.6,
                  fontSize: { xs: '0.95rem', sm: '1.125rem', md: '1.25rem' },
                  px: { xs: 1, sm: 0 },
                }}
              >
                {heroDescription}
              </Typography>
            )}
          </Box>
        </Paper>

        {/* Required Documents */}
        {requiredDocuments.length > 0 && (
          <Card
            elevation={0}
            sx={{
              mb: { xs: 3, md: 4 },
              borderRadius: { xs: 2, md: 3 },
              border: '1px solid',
              borderColor: 'divider',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(240, 247, 255, 0.5) 100%)',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 8px 24px rgba(25, 118, 210, 0.15)',
                transform: { xs: 'none', md: 'translateY(-2px)' },
              },
            }}
          >
            <CardContent sx={{ p: { xs: 2.5, sm: 3, md: 4 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 1.5 }, mb: { xs: 2, md: 3 } }}>
                <DescriptionIcon sx={{ fontSize: { xs: 24, md: 28 }, color: 'primary.main', flexShrink: 0 }} />
                <Typography
                  variant="h4"
                  color="primary"
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' },
                  }}
                >
                  Required Documents (Private)
                </Typography>
              </Box>
              <List sx={{ p: 0 }}>
                {requiredDocuments.map((doc, index) => (
                  <React.Fragment key={index}>
                    <ListItem
                      sx={{
                        px: { xs: 1.5, md: 2 },
                        py: { xs: 1.25, md: 1.5 },
                        borderRadius: { xs: 1.5, md: 2 },
                        mb: { xs: 0.75, md: 1 },
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: 'primary.light',
                          borderColor: 'primary.main',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          mr: { xs: 1.5, md: 2 },
                          p: { xs: 0.5, md: 0.75 },
                          borderRadius: 1,
                          bgcolor: 'primary.light',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <VerifiedUserIcon sx={{ fontSize: { xs: 18, md: 20 }, color: 'primary.main' }} />
                      </Box>
                      <ListItemText
                        primary={doc}
                        primaryTypographyProps={{
                          variant: 'body1',
                          fontWeight: 500,
                          color: 'text.primary',
                          sx: { fontSize: { xs: '0.9rem', sm: '1rem' } },
                        }}
                      />
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        )}

        {/* Chief Minister Scheme */}
        {chiefMinisterSchemeDescription && (
          <Card
            elevation={0}
            sx={{
              mb: { xs: 3, md: 4 },
              borderRadius: { xs: 2, md: 3 },
              border: '1px solid',
              borderColor: 'divider',
              background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(25, 118, 210, 0.05) 100%)',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 8px 24px rgba(25, 118, 210, 0.15)',
                transform: { xs: 'none', md: 'translateY(-2px)' },
              },
            }}
          >
            <CardContent sx={{ p: { xs: 2.5, sm: 3, md: 4 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 1.5 }, mb: { xs: 2, md: 3 } }}>
                <VerifiedUserIcon sx={{ fontSize: { xs: 24, md: 28 }, color: 'primary.main', flexShrink: 0 }} />
                <Typography
                  variant="h4"
                  color="primary"
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' },
                  }}
                >
                  Chief Minister Scheme
                </Typography>
              </Box>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  lineHeight: 1.8,
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                }}
              >
                {chiefMinisterSchemeDescription}
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Empanelled Insurance Companies & TPAs */}
        {insuranceCompanies.length > 0 && (
          <Box sx={{ mb: { xs: 3, md: 4 } }}>
            <Typography
              variant="h3"
              color="primary"
              gutterBottom
              sx={{
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.25rem' },
                mb: { xs: 2, md: 3 },
                fontWeight: 600,
              }}
            >
              List of Empanelled TPA's & Insurance Companies
            </Typography>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, sm: 2.5, md: 4 },
                borderRadius: { xs: 2, md: 3 },
                background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(25, 118, 210, 0.02) 100%)',
              }}
            >
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                  },
                  gap: { xs: 1.5, md: 2 },
                  maxHeight: { xs: '400px', sm: 'none' },
                  overflowY: { xs: 'auto', sm: 'visible' },
                  pr: { xs: 1, sm: 0 },
                  '&::-webkit-scrollbar': {
                    width: '6px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: 'transparent',
                    borderRadius: '3px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: 'rgba(25, 118, 210, 0.3)',
                    borderRadius: '3px',
                    '&:hover': {
                      background: 'rgba(25, 118, 210, 0.5)',
                    },
                  },
                }}
              >
                {insuranceCompanies.map((company, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: { xs: 1, md: 1.5 },
                      p: { xs: 1.25, md: 1.5 },
                      borderRadius: { xs: 1.5, md: 2 },
                      bgcolor: 'background.paper',
                      border: '1px solid',
                      borderColor: 'divider',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: 'primary.light',
                        borderColor: 'primary.main',
                        transform: { xs: 'none', md: 'translateY(-2px)' },
                        boxShadow: { xs: 'none', md: '0 4px 12px rgba(25, 118, 210, 0.15)' },
                      },
                    }}
                  >
                    <BusinessIcon
                      sx={{
                        fontSize: { xs: 18, md: 20 },
                        color: 'primary.main',
                        flexShrink: 0,
                        mt: { xs: 0.25, md: 0 },
                      }}
                    />
                    <Typography
                      variant="body1"
                      sx={{
                        color: 'text.primary',
                        fontWeight: 500,
                        fontSize: { xs: '0.875rem', sm: '0.9375rem', md: '1rem' },
                        lineHeight: 1.5,
                      }}
                    >
                      {company}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Box>
        )}

        {/* Contact Details - Simplified at Bottom */}
        {(contactMobile || contactPhone || contactEmail) && (
          <Box
            sx={{
              p: { xs: 2.5, md: 3 },
              borderRadius: { xs: 2, md: 3 },
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography
              variant="h5"
              color="primary"
              gutterBottom
              sx={{
                mb: { xs: 1.5, md: 2 },
                fontWeight: 600,
                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
              }}
            >
              Contact Details
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                flexWrap: 'wrap',
                gap: { xs: 2, sm: 2.5, md: 3 },
              }}
            >
              {contactMobile && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: { xs: 1, md: 1.5 },
                    p: { xs: 1, md: 1.5 },
                    borderRadius: 1.5,
                    bgcolor: { xs: 'transparent', sm: 'grey.50' },
                    width: { xs: '100%', sm: 'auto' },
                  }}
                >
                  <PhoneIcon sx={{ fontSize: { xs: 18, md: 20 }, color: 'primary.main', flexShrink: 0 }} />
                  <Link
                    href={`tel:${contactMobile}`}
                    sx={{
                      color: 'text.primary',
                      textDecoration: 'none',
                      fontSize: { xs: '0.9rem', md: '1rem' },
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    {contactMobile}
                  </Link>
                </Box>
              )}
              {contactPhone && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: { xs: 1, md: 1.5 },
                    p: { xs: 1, md: 1.5 },
                    borderRadius: 1.5,
                    bgcolor: { xs: 'transparent', sm: 'grey.50' },
                    width: { xs: '100%', sm: 'auto' },
                  }}
                >
                  <PhoneIcon sx={{ fontSize: { xs: 18, md: 20 }, color: 'primary.main', flexShrink: 0 }} />
                  <Link
                    href={`tel:${contactPhone.replace(/\s/g, '')}`}
                    sx={{
                      color: 'text.primary',
                      textDecoration: 'none',
                      fontSize: { xs: '0.9rem', md: '1rem' },
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    {contactPhone}
                  </Link>
                </Box>
              )}
              {contactEmail && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: { xs: 1, md: 1.5 },
                    p: { xs: 1, md: 1.5 },
                    borderRadius: 1.5,
                    bgcolor: { xs: 'transparent', sm: 'grey.50' },
                    width: { xs: '100%', sm: 'auto' },
                    wordBreak: 'break-word',
                  }}
                >
                  <EmailIcon sx={{ fontSize: { xs: 18, md: 20 }, color: 'primary.main', flexShrink: 0 }} />
                  <Link
                    href={`mailto:${contactEmail}`}
                    sx={{
                      color: 'text.primary',
                      textDecoration: 'none',
                      fontSize: { xs: '0.9rem', md: '1rem' },
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    {contactEmail}
                  </Link>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Container>
    </Box>
    )
  } catch (error) {
    console.error('Error loading cashless treatment page:', error)
    notFound()
  }
}

