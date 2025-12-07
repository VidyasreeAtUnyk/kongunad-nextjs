'use client'

import React from 'react'
import { Box, Container, Typography, Button } from '@mui/material'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { useRouter } from 'next/navigation'

export default function FacilityDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  return (
    <Box sx={{ minHeight: '60vh', display: 'flex', alignItems: 'center', py: 8 }}>
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center' }}>
          <ErrorOutlineIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom color="error">
            Something went wrong
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            We encountered an error while loading the facility details. {error?.message && `Error: ${error.message}`} Please try again.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button variant="contained" onClick={reset}>
              Try Again
            </Button>
            <Button variant="outlined" onClick={() => router.push('/facilities')}>
              Back to Facilities
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

