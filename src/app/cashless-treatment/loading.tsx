import React from 'react'
import {
  Box,
  Container,
  Skeleton,
  Breadcrumbs,
  Paper,
  Card,
} from '@mui/material'

export default function CashlessTreatmentLoading() {
  return (
    <Box sx={{ minHeight: '60vh', backgroundColor: 'background.default' }}>
      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 }, px: { xs: 2, sm: 3 } }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: { xs: 2, md: 3 } }}>
          <Skeleton width={60} height={24} />
          <Skeleton width={120} height={24} />
        </Breadcrumbs>

        {/* Hero Section */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4, md: 6 },
            mb: { xs: 4, md: 6 },
            borderRadius: { xs: 2, md: 4 },
            background: 'linear-gradient(135deg, #ebf5ff 0%, #f0f7ff 100%)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Skeleton variant="circular" width={64} height={64} sx={{ mx: 'auto', mb: 2 }} />
          <Skeleton variant="text" width="60%" height={60} sx={{ mx: 'auto', mb: 2 }} />
          <Skeleton variant="text" width="80%" height={32} sx={{ mx: 'auto' }} />
        </Paper>

        {/* Required Documents */}
        <Card sx={{ mb: { xs: 3, md: 4 }, p: { xs: 2.5, sm: 3, md: 4 }, borderRadius: { xs: 2, md: 3 } }}>
          <Box sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
            <Skeleton variant="circular" width={28} height={28} />
            <Skeleton variant="text" width="40%" height={32} />
          </Box>
          {[1, 2, 3, 4].map((i) => (
            <Box key={i} sx={{ display: 'flex', gap: 2, mb: 1, alignItems: 'center' }}>
              <Skeleton variant="circular" width={20} height={20} />
              <Skeleton variant="text" width="60%" height={24} />
            </Box>
          ))}
        </Card>

        {/* Chief Minister Scheme */}
        <Card sx={{ mb: { xs: 3, md: 4 }, p: { xs: 2.5, sm: 3, md: 4 }, borderRadius: { xs: 2, md: 3 } }}>
          <Box sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
            <Skeleton variant="circular" width={28} height={28} />
            <Skeleton variant="text" width="35%" height={32} />
          </Box>
          <Skeleton variant="text" width="100%" height={24} sx={{ mb: 2 }} />
          <Skeleton variant="text" width="90%" height={24} />
        </Card>

        {/* Insurance Companies */}
        <Box sx={{ mb: { xs: 3, md: 4 } }}>
          <Skeleton variant="text" width="50%" height={40} sx={{ mb: { xs: 2, md: 3 } }} />
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 2.5, md: 4 },
              borderRadius: { xs: 2, md: 3 },
            }}
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                },
                gap: { xs: 1.5, md: 2 },
              }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                <Skeleton key={i} variant="rectangular" height={60} sx={{ borderRadius: { xs: 1.5, md: 2 } }} />
              ))}
            </Box>
          </Paper>
        </Box>

        {/* Contact Details */}
        <Box sx={{ p: { xs: 2.5, md: 3 }, borderRadius: { xs: 2, md: 3 } }}>
          <Skeleton variant="text" width="30%" height={32} sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
            {[1, 2, 3].map((i) => (
              <Box key={i} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Skeleton variant="circular" width={20} height={20} />
                <Skeleton variant="text" width={120} height={24} />
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

