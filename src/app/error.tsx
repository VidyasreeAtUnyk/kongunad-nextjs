'use client'

import React, { useEffect } from 'react'
import { Box, Container, Typography, Button } from '@mui/material'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error('App Error:', error)
  }, [error])

  return (
    <html>
      <body>
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', bgcolor: 'background.default' }}>
          <Container maxWidth="md" sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h2" color="primary" sx={{ fontWeight: 800, mb: 2 }}>
              Something went wrong
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              We’re working on it. Please try again or go back to the homepage.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button variant="contained" onClick={() => reset()}>Try again</Button>
              <Button variant="outlined" href="/">Go home</Button>
            </Box>
          </Container>
        </Box>
      </body>
    </html>
  )
}


