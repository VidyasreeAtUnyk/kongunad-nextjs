import React, { Suspense } from 'react'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { JobApplicationClient } from './JobApplicationClient'
import { getJobVacanciesCached } from '@/lib/contentful'
import { JobVacancy } from '@/types/contentful'
import { JobApplicationSkeleton } from '@/components/content/JobApplicationSkeleton'

export const revalidate = 300

interface JobApplicationPageProps {
  searchParams: Promise<{ designation?: string; job?: string }>
}

async function JobApplicationContent({ searchParams }: { searchParams: Promise<{ designation?: string; job?: string }> }) {
  const params = await searchParams
  let designationOptions: string[] = []
  let initialDesignation = params.designation || ''

  try {
    const jobsData = await getJobVacanciesCached(100)
    if (Array.isArray(jobsData)) {
      const jobs = jobsData as unknown as JobVacancy[]
      // Get unique designations from active jobs
      designationOptions = Array.from(
        new Set(
          jobs
            .filter((job) => job?.fields?.designation && job.fields.active !== false)
            .map((job) => job.fields.designation)
        )
      ).sort()
    }
  } catch {
    // If fetching fails, use static designations from form config
    designationOptions = []
  }

  return (
    <JobApplicationClient
      initialDesignation={initialDesignation}
      designationOptions={designationOptions}
    />
  )
}

export default async function JobApplicationPage({ searchParams }: JobApplicationPageProps) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<JobApplicationSkeleton />}>
        <JobApplicationContent searchParams={searchParams} />
      </Suspense>
    </ErrorBoundary>
  )
}

