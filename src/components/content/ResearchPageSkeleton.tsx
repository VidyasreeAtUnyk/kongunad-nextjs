'use client'

import React from 'react'
import {
  Box,
  Container,
  Skeleton,
  Card,
  CardContent,
} from '@mui/material'
import { ResearchProgramCardSkeleton } from './ResearchProgramCardSkeleton'

export const ResearchPageSkeleton: React.FC = () => {
  return (
    <Box sx={{ minHeight: '60vh', py: 8, backgroundColor: 'background.default' }}>
      <Container maxWidth="lg">
        {/* Breadcrumbs skeleton */}
        <Box sx={{ mb: 3, display: 'flex', gap: 1 }}>
          <Skeleton variant="text" width={60} height={24} />
          <Skeleton variant="text" width={20} height={24} />
          <Skeleton variant="text" width={200} height={24} />
        </Box>

        {/* Hero Section skeleton */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Skeleton variant="circular" width={48} height={48} />
            <Skeleton variant="text" width={400} height={48} />
          </Box>
          <Skeleton variant="text" width="70%" height={32} sx={{ mb: 2 }} />
          <Skeleton variant="text" width="90%" height={24} />
          <Skeleton variant="text" width="80%" height={24} />
        </Box>

        {/* Programs Section with Sidebar skeleton */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: '2fr 1fr',
            },
            gap: 4,
          }}
        >
          {/* Main Content */}
          <Box>
            <Skeleton variant="text" width={200} height={40} sx={{ mb: 4 }} />
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(2, 1fr)',
                },
                gap: 3,
              }}
            >
              {Array.from({ length: 6 }).map((_, index) => (
                <ResearchProgramCardSkeleton key={index} />
              ))}
            </Box>
          </Box>

          {/* Sidebar skeleton */}
          <Box>
            <Card
              sx={{
                background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(25, 118, 210, 0.01) 100%)',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Skeleton variant="circular" width={32} height={32} />
                  <Skeleton variant="text" width={150} height={28} />
                </Box>
                <Skeleton variant="text" width="80%" height={24} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="60%" height={20} sx={{ mb: 2 }} />
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Skeleton variant="circular" width={18} height={18} />
                    <Skeleton variant="text" width={60} height={20} />
                  </Box>
                  <Box sx={{ pl: 3 }}>
                    <Skeleton variant="text" width={120} height={20} sx={{ mb: 0.5 }} />
                    <Skeleton variant="text" width={100} height={20} />
                  </Box>
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Skeleton variant="circular" width={18} height={18} />
                    <Skeleton variant="text" width={60} height={20} />
                  </Box>
                  <Box sx={{ pl: 3 }}>
                    <Skeleton variant="text" width={180} height={20} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

