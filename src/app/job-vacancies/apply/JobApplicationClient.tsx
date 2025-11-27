'use client'

import React, { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Container,
  Typography,
  Breadcrumbs,
  Link,
  Button,
  Alert,
  Paper,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { JobVacancyForm } from '@/components/forms/JobVacancyForm'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'

interface JobApplicationClientProps {
  initialDesignation?: string
  designationOptions?: string[]
}

export const JobApplicationClient: React.FC<JobApplicationClientProps> = ({
  initialDesignation = '',
  designationOptions = [],
}) => {
  const router = useRouter()

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      // TODO: Implement API call to submit job application data
      // For now, simulate API call
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve()
        }, 500)
      })
      // Success will be handled by onSubmitSuccess callback
    } catch (error) {
      throw new Error('Failed to submit application. Please try again.')
    }
  }

  const handleSuccess = useCallback(() => {
    // Show success message before navigation
    router.push('/job-vacancies')
  }, [router])

  const handleBack = useCallback(() => {
    router.push('/job-vacancies/current-openings')
  }, [router])

  return (
    <ErrorBoundary
      fallback={
        <Box sx={{ minHeight: '60vh', py: 8, backgroundColor: 'background.default' }}>
          <Container maxWidth="lg">
            <Alert severity="error">
              <Typography variant="h6" gutterBottom>
                Unable to load application form
              </Typography>
              <Typography variant="body2">
                Please try again later or go back to the job listings.
              </Typography>
            </Alert>
          </Container>
        </Box>
      }
    >
      <Box sx={{ minHeight: '60vh', py: 8, backgroundColor: 'background.default' }}>
        <Container maxWidth="md">
          <Breadcrumbs sx={{ mb: 3 }}>
            <Link href="/" color="inherit">
              Home
            </Link>
            <Link href="/job-vacancies" color="inherit">
              Job Vacancies
            </Link>
            <Typography color="text.primary">Apply</Typography>
          </Breadcrumbs>

          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ mb: 4 }}
          >
            Back to Openings
          </Button>

          <ErrorBoundary
            fallback={
              <Alert severity="error" sx={{ mb: 3 }}>
                The form encountered an error. Please refresh the page and try again.
              </Alert>
            }
          >
            <Paper
              elevation={0}
              sx={{
                p: 4,
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
              }}
            >
              <JobVacancyForm
                onSubmit={handleSubmit}
                initialValues={initialDesignation ? { designation: initialDesignation } : {}}
                designationOptions={designationOptions}
                onSubmitSuccess={handleSuccess}
              />
            </Paper>
          </ErrorBoundary>
        </Container>
      </Box>
    </ErrorBoundary>
  )
}

