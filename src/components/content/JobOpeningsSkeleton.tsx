import React from 'react'
import {
  Box,
  Container,
  Skeleton,
  Card,
  CardContent,
} from '@mui/material'
import { JobVacancyCardSkeleton } from './JobVacancyCardSkeleton'

export const JobOpeningsSkeleton: React.FC = () => {
  return (
    <Box sx={{ minHeight: '60vh', py: 8, backgroundColor: 'background.default' }}>
      <Container maxWidth="lg">
        {/* Breadcrumbs skeleton */}
        <Box sx={{ mb: 3, display: 'flex', gap: 1 }}>
          <Skeleton variant="text" width={60} height={24} />
          <Skeleton variant="text" width={20} height={24} />
          <Skeleton variant="text" width={120} height={24} />
          <Skeleton variant="text" width={20} height={24} />
          <Skeleton variant="text" width={150} height={24} />
        </Box>

        {/* Hero Section skeleton */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Skeleton variant="circular" width={48} height={48} />
            <Skeleton variant="text" width={350} height={48} />
          </Box>
          <Skeleton variant="text" width="70%" height={24} />
        </Box>

        {/* Jobs List skeleton */}
        <Skeleton variant="text" width={200} height={40} sx={{ mb: 4 }} />
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: 3,
          }}
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <JobVacancyCardSkeleton key={index} />
          ))}
        </Box>
      </Container>
    </Box>
  )
}

