'use client'

import React from 'react'
import {
  Box,
  Container,
  Skeleton,
  Paper,
} from '@mui/material'

export const JobApplicationSkeleton: React.FC = () => {
  return (
    <Box sx={{ minHeight: '60vh', py: 8, backgroundColor: 'background.default' }}>
      <Container maxWidth="md">
        {/* Breadcrumbs skeleton */}
        <Box sx={{ mb: 3, display: 'flex', gap: 1 }}>
          <Skeleton variant="text" width={60} height={24} />
          <Skeleton variant="text" width={20} height={24} />
          <Skeleton variant="text" width={120} height={24} />
          <Skeleton variant="text" width={20} height={24} />
          <Skeleton variant="text" width={60} height={24} />
        </Box>

        {/* Back button skeleton */}
        <Skeleton variant="rectangular" width={150} height={36} sx={{ borderRadius: 1, mb: 4 }} />

        {/* Form skeleton */}
        <Paper elevation={0} sx={{ p: 4 }}>
          {/* Title skeleton */}
          <Skeleton variant="text" width={300} height={48} sx={{ mb: 1 }} />
          
          {/* Description skeleton */}
          <Skeleton variant="text" width="100%" height={24} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="90%" height={24} sx={{ mb: 4 }} />

          {/* Form fields skeleton */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* First row - First Name, Last Name */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 1 }} />
              <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 1 }} />
            </Box>

            {/* Second row - Email, Phone */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 1 }} />
              <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 1 }} />
            </Box>

            {/* Third row - Gender, Designation */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 1 }} />
              <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 1 }} />
            </Box>

            {/* Fourth row - Experience, Current Salary */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 1 }} />
              <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 1 }} />
            </Box>

            {/* Fifth row - Expected Salary */}
            <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 1 }} />

            {/* File upload skeleton */}
            <Box>
              <Skeleton variant="text" width={120} height={20} sx={{ mb: 1 }} />
              <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 1 }} />
              <Skeleton variant="text" width={200} height={16} sx={{ mt: 0.5 }} />
            </Box>

            {/* Captcha skeleton */}
            <Box>
              <Skeleton variant="text" width={120} height={20} sx={{ mb: 1 }} />
              <Skeleton variant="rectangular" width={200} height={56} sx={{ borderRadius: 1 }} />
            </Box>

            {/* Submit button skeleton */}
            <Skeleton variant="rectangular" width="100%" height={48} sx={{ borderRadius: 1, mt: 2 }} />
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

