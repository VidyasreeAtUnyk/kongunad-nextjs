import React, { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { Box, Container, Alert, Typography } from '@mui/material'
import { getResearchProgramBySlugCached } from '@/lib/contentful'
import { ResearchProgram } from '@/types/contentful'
import { ProgramDetailClient } from './ProgramDetailClient'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { ProgramDetailSkeleton } from '@/components/content/ProgramDetailSkeleton'

export const revalidate = 300

interface ProgramDetailPageProps {
  params: Promise<{ slug: string }>
}

async function ProgramDetailContent({ slug }: { slug: string }) {
  let program: ResearchProgram | null = null

  try {
    const programData = await getResearchProgramBySlugCached(slug)
    // Validate program data structure
    if (
      programData &&
      typeof programData === 'object' &&
      'fields' in programData &&
      'sys' in programData
    ) {
      program = programData as unknown as ResearchProgram
    }
  } catch {
    // Don't show error page immediately, let the client component handle it
  }

  if (!program || !program.fields || !program.sys?.id) {
    notFound()
  }

  return <ProgramDetailClient program={program} />
}

export default async function ProgramDetailPage({ params }: ProgramDetailPageProps) {
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
                Unable to load program details
              </Typography>
              <Typography variant="body2">
                Please try again later or go back to the programs list.
              </Typography>
            </Alert>
          </Container>
        </Box>
      }
    >
      <Suspense fallback={<ProgramDetailSkeleton />}>
        <ProgramDetailContent slug={slug} />
      </Suspense>
    </ErrorBoundary>
  )
}

