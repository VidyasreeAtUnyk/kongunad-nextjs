import React from 'react'
import { Box, Container, Skeleton, Paper, Card, CardContent } from '@mui/material'

export default function SpecialitiesLoading() {
  return (
    <Box sx={{ minHeight: '60vh', backgroundColor: 'background.default' }}>
      <Container maxWidth="lg">
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
          <Skeleton variant="text" width="70%" height={48} sx={{ mb: 2 }} />
          <Skeleton variant="text" width="90%" height={32} />
        </Paper>

        <Box sx={{ mb: 6 }}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Skeleton variant="text" width="40%" height={40} sx={{ mb: 2 }} />
              <Skeleton variant="text" width="80%" height={24} sx={{ mb: 2 }} />
              <Skeleton variant="text" width="30%" height={20} />
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ mb: 6 }}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Skeleton variant="text" width="40%" height={40} sx={{ mb: 2 }} />
              <Skeleton variant="text" width="80%" height={24} sx={{ mb: 2 }} />
              <Skeleton variant="text" width="30%" height={20} />
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  )
}

