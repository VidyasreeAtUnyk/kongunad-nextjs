import React, { Suspense } from 'react'
import { Box, Container, Typography, Breadcrumbs, Link, Button } from '@mui/material'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { JobVacanciesClient } from './JobVacanciesClient'
import { JobVacanciesSkeleton } from '@/components/content/JobVacanciesSkeleton'

export const revalidate = 300

export default function JobVacanciesPage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<JobVacanciesSkeleton />}>
        <JobVacanciesClient />
      </Suspense>
    </ErrorBoundary>
  )
}

