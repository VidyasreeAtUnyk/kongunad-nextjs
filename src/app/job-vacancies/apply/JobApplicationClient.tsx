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
import { useToast } from '@/components/ui/Toast'

interface JobApplicationClientProps {
  initialDesignation?: string
  designationOptions?: string[]
}

export const JobApplicationClient: React.FC<JobApplicationClientProps> = ({
  initialDesignation = '',
  designationOptions = [],
}) => {
  const router = useRouter()
  const { showSuccess, showError } = useToast()

  const handleSubmit = async (data: Record<string, any>) => {
    const { submitForm } = await import('@/lib/form-submission')
    const result = await submitForm('job', data)
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to submit application. Please try again.')
    }
  }

  const handleSuccess = useCallback(() => {
    showSuccess('Job application submitted successfully! We will contact you shortly.')
    // Navigate after a short delay to show the toast
    setTimeout(() => {
      router.push('/job-vacancies')
    }, 2000)
  }, [router, showSuccess])

  const handleError = useCallback((error: Error) => {
    showError(error.message || 'Failed to submit application. Please try again.')
  }, [showError])

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
                onSubmitError={handleError}
              />
            </Paper>
          </ErrorBoundary>
        </Container>
      </Box>
    </ErrorBoundary>
  )
}

