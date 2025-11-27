import React from 'react'
import {
  Box,
  Container,
  Skeleton,
  Card,
  CardContent,
} from '@mui/material'

export const JobVacanciesSkeleton: React.FC = () => {
  return (
    <Box sx={{ minHeight: '60vh', py: 8, backgroundColor: 'background.default' }}>
      <Container maxWidth="lg">
        {/* Breadcrumbs skeleton */}
        <Box sx={{ mb: 3, display: 'flex', gap: 1 }}>
          <Skeleton variant="text" width={60} height={24} />
          <Skeleton variant="text" width={20} height={24} />
          <Skeleton variant="text" width={120} height={24} />
        </Box>

        {/* Hero Section skeleton */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Skeleton variant="circular" width={48} height={48} />
            <Skeleton variant="text" width={300} height={48} />
          </Box>
          <Skeleton variant="text" width="40%" height={32} sx={{ mb: 2 }} />
          <Skeleton variant="text" width="90%" height={24} />
          <Skeleton variant="text" width="80%" height={24} />
          <Skeleton variant="text" width="85%" height={24} />
        </Box>

        {/* Action Cards skeleton */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(3, 1fr)',
            },
            gap: 3,
          }}
        >
          {Array.from({ length: 2 }).map((_, index) => (
            <Card key={index} sx={{ p: 0, border: '1px solid', borderColor: 'divider' }}>
              {/* Icon Header skeleton */}
              <Box
                sx={{
                  background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.15) 0%, rgba(25, 118, 210, 0.08) 100%)',
                  p: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Skeleton variant="rectangular" width={64} height={64} sx={{ borderRadius: 2 }} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width={180} height={28} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width={120} height={20} />
                </Box>
              </Box>
              <CardContent sx={{ p: 3 }}>
                <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="90%" height={20} sx={{ mb: 3 }} />
                <Skeleton variant="rectangular" width="100%" height={44} sx={{ borderRadius: 1 }} />
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  )
}

