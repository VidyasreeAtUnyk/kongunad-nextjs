import React, { Suspense } from 'react'
import { Box, Container, Typography, Alert } from '@mui/material'
import { getResearchProgramsCached } from '@/lib/contentful'
import { ResearchProgram } from '@/types/contentful'
import { ResearchPageClient } from './ResearchPageClient'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { ResearchPageSkeleton } from '@/components/content/ResearchPageSkeleton'

export const revalidate = 300

async function ResearchProgramsContent() {
  let researchPrograms: ResearchProgram[] = []
  let hasError = false

  try {
    const programsData = await getResearchProgramsCached(100)
    if (Array.isArray(programsData)) {
      researchPrograms = (programsData as unknown as ResearchProgram[])
        .filter(
          (program) =>
            program &&
            program.fields &&
            program.sys?.id &&
            program.fields.active !== false
    )
        .slice(0, 100) // Limit to prevent excessive rendering
    }
  } catch {
    hasError = true
  }

  // If there's an error but we want to show a degraded experience
  if (hasError && researchPrograms.length === 0) {
    return (
      <Box sx={{ minHeight: '60vh', py: 8, backgroundColor: 'background.default' }}>
        <Container maxWidth="lg">
          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Unable to load research programs
            </Typography>
            <Typography variant="body2">
              Please refresh the page or contact us if the problem persists.
            </Typography>
          </Alert>
        </Container>
      </Box>
    )
  }

  return <ResearchPageClient researchPrograms={researchPrograms} />
}

export default function MedicalStudiesResearchPage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<ResearchPageSkeleton />}>
        <ResearchProgramsContent />
      </Suspense>
    </ErrorBoundary>
  )
}

