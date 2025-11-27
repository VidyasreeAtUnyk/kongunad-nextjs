'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Container,
  Typography,
  Breadcrumbs,
  Link,
  Button,
  Card,
  CardContent,
} from '@mui/material'
import WorkIcon from '@mui/icons-material/Work'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import AssignmentIcon from '@mui/icons-material/Assignment'
import DescriptionIcon from '@mui/icons-material/Description'

export const JobVacanciesClient: React.FC = () => {
  const router = useRouter()

  const handleViewOpenings = () => {
    router.push('/job-vacancies/current-openings')
  }

  const handleApplyNow = () => {
    router.push('/job-vacancies/apply')
  }

  return (
    <Box sx={{ minHeight: '60vh', py: 8, backgroundColor: 'background.default' }}>
      <Container maxWidth="lg">
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link href="/" color="inherit">
            Home
          </Link>
          <Typography color="text.primary">Job Vacancies</Typography>
        </Breadcrumbs>

        {/* Hero Section */}
        <Box sx={{ mb: 6, textAlign: { xs: 'left' } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
            <WorkIcon sx={{ fontSize: { xs: 36, md: 48 }, color: 'primary.main' }} />
            <Typography 
              variant="h1" 
              color="primary" 
              sx={{ 
                fontWeight: 800,
              }}
            >
              Job Vacancies
            </Typography>
          </Box>
          <Typography 
            variant="h5" 
            color="text.secondary" 
            sx={{ mb: 2, fontWeight: 300 }}
          >
            Join Our Team
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '800px', mb: 4 }}>
            Kongunad Hospital is one of the clinical expertise through nurturing talent and providing 
            world class infrastructure and medical & Surgical technology. We believe that our employees 
            are the pillars of Our Hospitals. We would like to have talented employees. Also we will 
            motivate our employees to provide best patient care. We provide an environment that 
            encourages the professional and personal growth.
          </Typography>
        </Box>

        {/* Action Cards */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(3, 1fr)',
            },
            gap: 3,
            mb: 6,
          }}
        >
          <Card
            sx={{
              p: 0,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid',
              borderColor: 'divider',
              overflow: 'hidden',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                borderColor: 'primary.main',
              },
              transition: 'all 0.3s ease-in-out',
            }}
          >
            {/* Icon Header */}
            <Box
              sx={{
                background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.15) 0%, rgba(25, 118, 210, 0.08) 100%)',
                p: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
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
                <AssignmentIcon sx={{ fontSize: 32 }} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Current Job Vacancies
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Explore available positions
                </Typography>
              </Box>
            </Box>

            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, flexGrow: 1 }}>
                View all currently available positions and find the perfect opportunity for you. 
                Browse through our open roles and discover where you can make a difference.
              </Typography>
              <Button
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                onClick={handleViewOpenings}
                fullWidth
                sx={{
                  py: 1.5,
                  fontWeight: 600,
                  textTransform: 'none',
                }}
              >
                View Openings
              </Button>
            </CardContent>
          </Card>

          <Card
            sx={{
              p: 0,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid',
              borderColor: 'divider',
              overflow: 'hidden',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                borderColor: 'primary.main',
              },
              transition: 'all 0.3s ease-in-out',
            }}
          >
            {/* Icon Header */}
            <Box
              sx={{
                background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.15) 0%, rgba(25, 118, 210, 0.08) 100%)',
                p: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
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
                <DescriptionIcon sx={{ fontSize: 32 }} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Job Application Form
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Submit your application
                </Typography>
              </Box>
            </Box>

            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, flexGrow: 1 }}>
                Apply for a position by filling out our job application form. 
                Share your details, experience, and resume to get started.
              </Typography>
              <Button
                variant="outlined"
                endIcon={<ArrowForwardIcon />}
                onClick={handleApplyNow}
                fullWidth
                sx={{
                  py: 1.5,
                  fontWeight: 600,
                  textTransform: 'none',
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                  },
                }}
              >
                Apply Now
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  )
}

