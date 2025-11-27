import React, { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { Box, Container, Alert, Typography } from '@mui/material'
import { getJobVacancyBySlugCached } from '@/lib/contentful'
import { JobVacancy } from '@/types/contentful'
import { JobDetailClient } from './JobDetailClient'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { JobDetailSkeleton } from '@/components/content/JobDetailSkeleton'

export const revalidate = 300

interface JobDetailPageProps {
  params: Promise<{ slug: string }>
}

async function JobDetailContent({ slug }: { slug: string }) {
  let job: JobVacancy | null = null

  try {
    const jobData = await getJobVacancyBySlugCached(slug)
    // Validate job data structure
    if (
      jobData &&
      typeof jobData === 'object' &&
      'fields' in jobData &&
      'sys' in jobData
    ) {
      job = jobData as unknown as JobVacancy
    }
  } catch {
    // Don't show error page immediately, let the client component handle it
  }

  if (!job || !job.fields || !job.sys?.id) {
    notFound()
  }

  return <JobDetailClient job={job} />
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  let slug: string
  try {
    const paramsObj = await params
    slug = paramsObj.slug
    if (!slug || typeof slug !== 'string') {
      notFound()
    }
  } catch {
    notFound()
  }

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
                Please try again later or go back to the job listings.
              </Typography>
            </Alert>
          </Container>
        </Box>
      }
    >
      <Suspense fallback={<JobDetailSkeleton />}>
        <JobDetailContent slug={slug} />
      </Suspense>
    </ErrorBoundary>
  )
}

