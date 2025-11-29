import { Box, Container, Skeleton, Breadcrumbs } from '@mui/material'

export default function FindADoctorLoading() {
  return (
    <Box sx={{ minHeight: '60vh', backgroundColor: 'background.default' }}>
      <Container maxWidth="lg">
        <Breadcrumbs sx={{ py: 3 }}>
          <Skeleton width={60} height={24} />
          <Skeleton width={100} height={24} />
        </Breadcrumbs>

        {/* Hero Section Skeleton */}
        <Box
          sx={{
            p: { xs: 4, md: 6 },
            mb: 4,
            borderRadius: 4,
            background: 'linear-gradient(135deg, #ebf5ff 0%, #f0f7ff 100%)',
          }}
        >
          <Skeleton variant="text" width="60%" height={60} sx={{ mb: 2 }} />
          <Skeleton variant="text" width="80%" height={32} sx={{ mb: 3 }} />
          <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 2 }} />
        </Box>

        {/* Filters Skeleton */}
        <Box sx={{ mb: 3 }}>
          <Skeleton width={150} height={24} sx={{ mb: 1.5 }} />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} variant="rectangular" width={120} height={36} sx={{ borderRadius: 2 }} />
            ))}
          </Box>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Skeleton width={150} height={24} sx={{ mb: 1.5 }} />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} variant="rectangular" width={140} height={36} sx={{ borderRadius: 2 }} />
            ))}
          </Box>
        </Box>

        {/* Results Count Skeleton */}
        <Skeleton width={200} height={24} sx={{ mb: 3 }} />

        {/* Doctors Grid Skeleton */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(2, 1fr)', 
            md: 'repeat(3, 1fr)' 
          }, 
          gap: 3, 
          mb: 6 
        }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Box key={i}>
              <Skeleton variant="rectangular" width="100%" height={240} sx={{ borderRadius: 2, mb: 2 }} />
              <Skeleton variant="text" width="80%" height={32} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="60%" height={24} sx={{ mb: 1 }} />
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Skeleton variant="rectangular" width={100} height={24} sx={{ borderRadius: 1 }} />
                <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 1 }} />
              </Box>
              <Skeleton variant="text" width="70%" height={20} sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Skeleton variant="rectangular" width="48%" height={36} sx={{ borderRadius: 1 }} />
                <Skeleton variant="rectangular" width="48%" height={36} sx={{ borderRadius: 1 }} />
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  )
}

