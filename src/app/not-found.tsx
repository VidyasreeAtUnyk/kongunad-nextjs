import React from 'react'
import { Box, Container, Typography, Button } from '@mui/material'

export default function NotFoundPage() {
  return (
    <Box sx={{ minHeight: '70vh', display: 'flex', alignItems: 'center', bgcolor: 'background.default' }}>
      <Container maxWidth="md" sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h1" color="primary" sx={{ fontWeight: 900, mb: 1 }}>
          404
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
          We’re working on it
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          The page you’re looking for isn’t available yet. Please check back later or return home.
        </Typography>
        <Button variant="contained" href="/">Go home</Button>
      </Container>
    </Box>
  )
}


