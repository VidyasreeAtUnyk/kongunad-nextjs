import React from 'react'
import { Box, Container, Skeleton, Paper, Breadcrumbs } from '@mui/material'

export default function FacilityDetailLoading() {
  return (
    <Box sx={{ minHeight: '60vh', backgroundColor: 'background.default' }}>
      <Container maxWidth="lg" sx={{ width: '100%', maxWidth: '100%', py: 4, px: { xs: 2, sm: 3, md: 4 } }}>
        {/* Breadcrumbs Skeleton */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <Skeleton variant="text" width={60} height={20} />
          <Skeleton variant="text" width={80} height={20} />
          <Skeleton variant="text" width={100} height={20} />
          <Skeleton variant="text" width={120} height={20} />
        </Breadcrumbs>

        <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', lg: 'row' } }}>
          {/* Main Content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Facility Name Skeleton */}
            <Skeleton 
              variant="text" 
              width="60%" 
              height={60} 
              sx={{ mb: 4, fontSize: { xs: '2rem', md: '2.5rem' } }} 
            />

            {/* Facility Image and Facilities of Department */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  md: 'repeat(2, 1fr)',
                },
                gap: 4,
                mb: 6,
              }}
            >
              {/* Facility Image Skeleton */}
              <Skeleton
                variant="rectangular"
                height={400}
                sx={{ 
                  borderRadius: 3,
                  height: { xs: 300, md: 400 },
                }}
              />

              {/* Facilities of Department Skeleton */}
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(25, 118, 210, 0.02) 100%)',
                }}
              >
                <Skeleton variant="text" width="100%" height={24} sx={{ mb: 2 }} />
                <Skeleton variant="text" width="100%" height={24} sx={{ mb: 2 }} />
                <Skeleton variant="text" width="90%" height={24} sx={{ mb: 2 }} />
                <Skeleton variant="text" width="95%" height={24} />
              </Paper>
            </Box>

            {/* Services Section Skeleton */}
            <Paper
              elevation={0}
              sx={{
                p: 4,
                mb: 6,
                borderRadius: 3,
                background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(25, 118, 210, 0.02) 100%)',
              }}
            >
              <Skeleton variant="text" width="40%" height={32} sx={{ mb: 3 }} />
              <Skeleton variant="rectangular" width="100%" height={250} sx={{ borderRadius: 2, mb: 2 }} />
              <Skeleton variant="text" width="100%" height={24} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="95%" height={24} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="90%" height={24} />
            </Paper>

            {/* Gallery Skeleton */}
            <Box sx={{ mb: 6 }}>
              <Skeleton variant="text" width={150} height={32} sx={{ mb: 3 }} />
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                  },
                  gap: 2,
                }}
              >
                {[1, 2, 3].map((i) => (
                  <Skeleton
                    key={i}
                    variant="rectangular"
                    height={200}
                    sx={{ borderRadius: 2 }}
                  />
                ))}
              </Box>
            </Box>

            {/* Doctors Section Skeleton */}
            <Box sx={{ mb: 6 }}>
              <Skeleton variant="text" width={200} height={32} sx={{ mb: 3 }} />
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                    lg: 'repeat(4, 1fr)',
                  },
                  gap: 3,
                }}
              >
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton
                    key={i}
                    variant="rectangular"
                    height={350}
                    sx={{ borderRadius: 2 }}
                  />
                ))}
              </Box>
            </Box>

            {/* Health Packages Section Skeleton */}
            <Box sx={{ mb: 6 }}>
              <Skeleton variant="text" width={250} height={32} sx={{ mb: 3 }} />
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
                {[1, 2, 3].map((i) => (
                  <Skeleton
                    key={i}
                    variant="rectangular"
                    height={300}
                    sx={{ borderRadius: 2 }}
                  />
                ))}
              </Box>
            </Box>
          </Box>

          {/* Sidebar */}
          <Box 
            sx={{ 
              width: { xs: '100%', lg: 320 },
              flexShrink: 0,
            }}
          >
            {/* Other Facilities Skeleton */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 3,
                backgroundColor: 'grey.50',
                border: '1px solid',
                borderColor: 'grey.200',
              }}
            >
              <Skeleton variant="text" width={180} height={24} sx={{ mb: 2 }} />
              <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="80%" height={20} />
            </Paper>

            {/* Category Switcher Skeleton */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                backgroundColor: 'grey.50',
                border: '1px solid',
                borderColor: 'grey.200',
                position: { lg: 'sticky' },
                top: 100,
              }}
            >
              <Skeleton variant="text" width={180} height={24} sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton
                    key={i}
                    variant="rectangular"
                    height={40}
                    sx={{ borderRadius: 1 }}
                  />
                ))}
              </Box>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

