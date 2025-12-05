import React from 'react'
import { Box, Container, Skeleton, Paper, Card, CardContent } from '@mui/material'

export default function SpecialitiesLoading() {
  return (
    <Box sx={{ minHeight: '60vh', backgroundColor: 'background.default' }}>
      <Container maxWidth="lg">
        <Box sx={{ py: 3 }}>
          <Skeleton variant="text" width={200} height={24} />
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

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
            },
            gap: 3,
            mb: 6,
          }}
        >
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardContent sx={{ p: 3 }}>
                <Skeleton variant="rectangular" width={60} height={60} sx={{ mb: 2, mx: 'auto', borderRadius: 1 }} />
                <Skeleton variant="text" width="80%" height={32} sx={{ mb: 1, mx: 'auto' }} />
                <Skeleton variant="text" width="100%" height={24} sx={{ mb: 2 }} />
                <Skeleton variant="text" width="60%" height={20} sx={{ mx: 'auto' }} />
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  )
}

