'use client'

import React from 'react'
import { Card, CardContent, Box, Skeleton } from '@mui/material'

export const ResearchProgramCardSkeleton: React.FC = () => {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Icon skeleton */}
      <Box
        sx={{
          width: 'auto',
          height: 80,
          backgroundColor: 'grey.50',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          p: 2,
        }}
      >
        <Skeleton variant="rectangular" width={60} height={60} sx={{ borderRadius: 1 }} />
      </Box>

      {/* Content skeleton */}
      <CardContent
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: 3,
          '&:last-child': { pb: 3 },
        }}
      >
        <Box>
          <Skeleton variant="text" width="80%" height={32} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" width={100} height={24} sx={{ borderRadius: 1, mb: 2 }} />
          <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="90%" height={20} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="75%" height={20} />
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <Skeleton variant="rectangular" width="100%" height={36} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" width="100%" height={36} sx={{ borderRadius: 1 }} />
        </Box>
      </CardContent>
    </Card>
  )
}

