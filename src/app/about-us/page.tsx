import React from 'react'
import { Box, Container, Typography, Breadcrumbs, Link } from '@mui/material'

export default function AboutUsPage() {
  return (
    <Box sx={{ minHeight: '60vh', py: 8 }}>
      <Container maxWidth="lg">
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link href="/" color="inherit">Home</Link>
          <Typography color="text.primary">About Us</Typography>
        </Breadcrumbs>
        <Typography variant="h1" gutterBottom color="primary" sx={{ fontWeight: 800 }}>
          About Us
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary', lineHeight: 1.8 }}>
          We're working on it. This page will be available soon.
        </Typography>
      </Container>
    </Box>
  )
}

