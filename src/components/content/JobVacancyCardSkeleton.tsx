import React from 'react'
import { Card, CardContent, Box, Skeleton, Divider } from '@mui/material'

export const JobVacancyCardSkeleton: React.FC = () => {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      {/* Header skeleton */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(25, 118, 210, 0.05) 100%)',
          p: 3,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Skeleton variant="rectangular" width={56} height={56} sx={{ borderRadius: 2 }} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="80%" height={28} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="60%" height={24} />
            <Skeleton variant="rectangular" width={100} height={24} sx={{ borderRadius: 1, mt: 1 }} />
          </Box>
        </Box>
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
          {/* Job Details Grid skeleton */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 1.5,
              mb: 2.5,
              p: 2,
              backgroundColor: 'grey.50',
              borderRadius: 2,
            }}
          >
            <Skeleton variant="text" width="70%" height={20} />
            <Skeleton variant="text" width="65%" height={20} />
            <Skeleton variant="text" width="60%" height={20} />
            <Skeleton variant="text" width="75%" height={20} />
          </Box>

          <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="90%" height={20} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="85%" height={20} />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Skeleton variant="rectangular" width="100%" height={40} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" width="100%" height={40} sx={{ borderRadius: 1 }} />
        </Box>
      </CardContent>
    </Card>
  )
}

