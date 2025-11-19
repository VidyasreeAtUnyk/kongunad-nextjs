'use client'

import React from 'react'
import { Box, Skeleton, Card, CardContent } from '@mui/material'

interface SearchResultSkeletonProps {
  count?: number
  variant?: 'card' | 'list'
}

export const SearchResultSkeleton: React.FC<SearchResultSkeletonProps> = ({
  count = 3,
  variant = 'card',
}) => {
  if (variant === 'list') {
    return (
      <Box>
        {Array.from({ length: count }).map((_, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 1 }} />
          </Box>
        ))}
      </Box>
    )
  }

  return (
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
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} sx={{ height: '100%' }}>
          <CardContent>
            <Skeleton variant="rectangular" height={200} sx={{ mb: 2, borderRadius: 1 }} />
            <Skeleton variant="text" width="60%" height={32} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="40%" height={24} />
            <Box sx={{ mt: 2 }}>
              <Skeleton variant="text" width="100%" height={20} />
              <Skeleton variant="text" width="80%" height={20} />
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  )
}

