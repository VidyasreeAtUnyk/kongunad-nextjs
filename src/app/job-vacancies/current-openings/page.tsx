import React, { Suspense } from 'react'
import { Box, Container, Typography, Alert } from '@mui/material'
import { getJobVacanciesCached } from '@/lib/contentful'
import { JobVacancy } from '@/types/contentful'
import { JobOpeningsClient } from './JobOpeningsClient'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { JobOpeningsSkeleton } from '@/components/content/JobOpeningsSkeleton'

export const revalidate = 300

async function JobOpeningsContent() {
  let jobVacancies: JobVacancy[] = []
  let hasError = false

  try {
    const jobsData = await getJobVacanciesCached(100)
    if (Array.isArray(jobsData)) {
      jobVacancies = (jobsData as unknown as JobVacancy[])
        .filter(
          (job) =>
            job &&
            job.fields &&
            job.sys?.id &&
            job.fields.active !== false
        )
        .sort((a, b) => {
          // Sort by order field if available, then by title
          const orderA = a.fields?.order ?? 999
          const orderB = b.fields?.order ?? 999
          if (orderA !== orderB) {
            return orderA - orderB
          }
          return (a.fields?.title || '').localeCompare(b.fields?.title || '')
        })
        .slice(0, 100)
    }
  } catch {
    hasError = true
  }

  if (hasError && jobVacancies.length === 0) {
    return (
      <Box sx={{ minHeight: '60vh', py: 8, backgroundColor: 'background.default' }}>
        <Container maxWidth="lg">
          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Unable to load job vacancies
            </Typography>
            <Typography variant="body2">
              Please refresh the page or contact us if the problem persists.
            </Typography>
          </Alert>
        </Container>
      </Box>
    )
  }

  return <JobOpeningsClient jobVacancies={jobVacancies} />
}

export default function CurrentOpeningsPage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<JobOpeningsSkeleton />}>
        <JobOpeningsContent />
      </Suspense>
    </ErrorBoundary>
  )
}

