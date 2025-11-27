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
import WorkIcon from '@mui/icons-material/Work'
import { JobVacancy } from '@/types/contentful'
import { JobVacancyCard } from '@/components/content/JobVacancyCard'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'

interface JobOpeningsClientProps {
  jobVacancies: JobVacancy[]
}

export const JobOpeningsClient: React.FC<JobOpeningsClientProps> = ({
  jobVacancies = [],
}) => {
  const router = useRouter()

  const handleApply = useCallback((job: JobVacancy) => {
    if (!job?.fields?.designation || !job?.fields?.slug) {
      return
    }
    // Navigate to apply page with query params
    const params = new URLSearchParams({
      designation: job.fields.designation,
      job: job.fields.slug,
    })
    router.push(`/job-vacancies/apply?${params.toString()}`)
  }, [router])

  const handleLearnMore = useCallback((job: JobVacancy) => {
    if (!job?.fields?.slug) {
      return
    }
    router.push(`/job-vacancies/${job.fields.slug}`)
  }, [router])

  // Memoize filtered and sorted jobs
  const validJobs = useMemo(() => {
    return jobVacancies
      .filter((job) => job && job.fields && job.sys?.id)
      .sort((a, b) => {
        // Sort by order field if available, then by title
        const orderA = a.fields?.order ?? 999
        const orderB = b.fields?.order ?? 999
        if (orderA !== orderB) {
          return orderA - orderB
        }
        return (a.fields?.title || '').localeCompare(b.fields?.title || '')
      })
  }, [jobVacancies])

  // Memoize card handlers to prevent re-renders
  const getCardHandlers = useCallback((job: JobVacancy) => {
    return {
      onApply: () => handleApply(job),
      onLearnMore: () => handleLearnMore(job),
    }
  }, [handleApply, handleLearnMore])

  return (
    <ErrorBoundary
      fallback={
        <Box sx={{ minHeight: '60vh', py: 8, backgroundColor: 'background.default' }}>
          <Container maxWidth="lg">
            <Alert severity="error" sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Unable to load job openings
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
            <Link href="/job-vacancies" color="inherit">
              Job Vacancies
            </Link>
            <Typography color="text.primary">Current Openings</Typography>
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
                Current Job Openings
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '800px' }}>
              Explore our current job openings and find the perfect opportunity to join our team.
            </Typography>
          </Box>

          {/* Jobs List */}
          {validJobs.length > 0 ? (
            <>
              <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
                Available Positions
              </Typography>
              <ErrorBoundary
                fallback={
                  <Alert severity="error" sx={{ mb: 3 }}>
                    <Typography variant="body2">
                      Some job cards could not be displayed. Please refresh the page.
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
                      md: 'repeat(3, 1fr)',
                    },
                    gap: 3,
                  }}
                >
                  {validJobs.map((job) => {
                    const handlers = getCardHandlers(job)
                    return (
                      <ErrorBoundary
                        key={job.sys.id}
                        fallback={
                          <Card sx={{ p: 2 }}>
                            <Alert severity="warning" sx={{ fontSize: '0.875rem' }}>
                              This job card could not be displayed.
                            </Alert>
                          </Card>
                        }
                      >
                        <JobVacancyCard
                          job={job}
                          onApply={handlers.onApply}
                          onLearnMore={handlers.onLearnMore}
                        />
                      </ErrorBoundary>
                    )
                  })}
                </Box>
              </ErrorBoundary>
            </>
          ) : (
            <Card sx={{ p: 4, textAlign: 'center' }}>
              <CardContent>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No job openings available at this time
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Please check back later or contact us for more information.
                </Typography>
              </CardContent>
            </Card>
          )}
        </Container>
      </Box>
    </ErrorBoundary>
  )
}

