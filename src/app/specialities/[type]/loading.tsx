import React from 'react'
import { Box, Container, Skeleton, Paper } from '@mui/material'

export default function SpecialtyTypeLoading() {
  return (
    <Box sx={{ minHeight: '60vh', backgroundColor: 'background.default' }}>
      <Container maxWidth="xl">
        <Box sx={{ py: 3 }}>
          <Skeleton variant="text" width={300} height={24} />
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 6 },
            mb: 4,
            borderRadius: 4,
            background: 'linear-gradient(135deg, #ebf5ff 0%, #f0f7ff 100%)',
          }}
        >
          <Skeleton variant="text" width="60%" height={48} sx={{ mb: 2 }} />
          <Skeleton variant="text" width="80%" height={32} />
        </Paper>

        <Skeleton variant="text" width={200} height={24} sx={{ mb: 3 }} />

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
            mb: 6,
          }}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Skeleton key={i} variant="rectangular" height={350} sx={{ borderRadius: 2 }} />
          ))}
        </Box>
      </Container>
    </Box>
  )
}

