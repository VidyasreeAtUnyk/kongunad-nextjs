import React from 'react'
import {
  Box,
  Container,
  Skeleton,
  Breadcrumbs,
  Paper,
  Card,
} from '@mui/material'

export default function AboutUsLoading() {
  return (
    <Box sx={{ minHeight: '60vh', backgroundColor: 'background.default' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <Skeleton width={60} height={24} />
          <Skeleton width={80} height={24} />
        </Breadcrumbs>

        {/* Hero Section */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 6 },
            mb: 6,
            borderRadius: 4,
            background: 'linear-gradient(135deg, #ebf5ff 0%, #f0f7ff 100%)',
            textAlign: 'center',
          }}
        >
          <Skeleton variant="text" width="80%" height={60} sx={{ mx: 'auto', mb: 2 }} />
          <Skeleton variant="rectangular" width={300} height={40} sx={{ mx: 'auto', borderRadius: 2 }} />
        </Paper>

        {/* Stats Section */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(3, 1fr)',
            },
            gap: 3,
            mb: 6,
          }}
        >
          {[1, 2, 3].map((i) => (
            <Card key={i} sx={{ p: 3, borderRadius: 3 }}>
              <Skeleton variant="circular" width={48} height={48} sx={{ mx: 'auto', mb: 1 }} />
              <Skeleton variant="text" width="60%" height={40} sx={{ mx: 'auto', mb: 1 }} />
              <Skeleton variant="text" width="80%" height={24} sx={{ mx: 'auto' }} />
            </Card>
          ))}
        </Box>

        {/* Our Founder Section */}
        <Box sx={{ mb: 6 }}>
          <Skeleton variant="text" width="30%" height={40} sx={{ mb: 4 }} />
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: '300px 1fr',
              },
              gap: 4,
            }}
          >
            {/* Founder Image */}
            <Box>
              <Skeleton
                variant="rectangular"
                width="100%"
                height={400}
                sx={{ borderRadius: 3, mb: 2 }}
              />
              <Skeleton variant="text" width="60%" height={32} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="40%" height={24} />
            </Box>
            {/* Timeline */}
            <Box>
              <Skeleton variant="text" width="50%" height={36} sx={{ mb: 3 }} />
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 4 },
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(25, 118, 210, 0.02) 100%)',
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.5,
                    pl: { xs: 0, md: 3 },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: { xs: 20, md: 120 },
                      top: 0,
                      bottom: 0,
                      width: 2,
                      bgcolor: 'primary.main',
                      opacity: 0.3,
                    },
                  }}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                    <Box
                      key={i}
                      sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: 2,
                        alignItems: { xs: 'flex-start', md: 'center' },
                      }}
                    >
                      {/* Year skeleton - left side */}
                      <Box
                        sx={{
                          flex: { xs: '0 0 auto', md: '0 0 120px' },
                          textAlign: { xs: 'left', md: 'right' },
                        }}
                      >
                        <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 1 }} />
                      </Box>
                      {/* Content skeleton - right side */}
                      <Box
                        sx={{
                          flex: 1,
                          pl: { xs: 0, md: 2 },
                        }}
                      >
                        <Skeleton variant="rectangular" width="100%" height={60} sx={{ borderRadius: 2, p: 2 }} />
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Box>
          </Box>
        </Box>

        {/* History Sections */}
        {[1, 2].map((i) => (
          <Box key={i} sx={{ mb: 6 }}>
            <Skeleton variant="text" width="40%" height={40} sx={{ mb: 3 }} />
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 3,
              }}
            >
              {[1, 2, 3, 4, 5].map((j) => (
                <Skeleton key={j} variant="text" width="100%" height={24} sx={{ mb: 2 }} />
              ))}
            </Paper>
          </Box>
        ))}

        {/* Doctors Section */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Skeleton variant="text" width="30%" height={40} />
            <Skeleton variant="text" width="20%" height={24} />
          </Box>
          <Box sx={{ display: 'flex', gap: 2, overflow: 'hidden' }}>
            {[1, 2, 3, 4].map((i) => (
              <Card
                key={i}
                sx={{
                  flex: '0 0 auto',
                  width: { xs: 'calc(100% - 16px)', sm: 'calc((100% - 32px) / 2)', md: 'calc((100% - 48px) / 3)', lg: 'calc((100% - 64px) / 4)' },
                  p: 2,
                  borderRadius: 3,
                }}
              >
                <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: 2, mb: 2 }} />
                <Skeleton variant="text" width="80%" height={24} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="60%" height={20} />
              </Card>
            ))}
          </Box>
        </Box>

        {/* Testimonials Section */}
        <Box sx={{ mb: 6 }}>
          <Skeleton variant="text" width="30%" height={40} sx={{ mb: 3 }} />
          <Box sx={{ py: 1 }}>
            <Box sx={{ display: 'flex', gap: 2, overflow: 'hidden' }}>
              {[1, 2, 3].map((i) => (
                <Box
                  key={i}
                  sx={{
                    pt: 0.5,
                    pb: 1,
                    flex: '0 0 auto',
                    width: { xs: 'calc(100% - 16px)', sm: 'calc((100% - 32px) / 2)', md: 'calc((100% - 48px) / 3)' },
                  }}
                >
                  <Card sx={{ p: 3, borderRadius: 3, height: '100%', minHeight: 220 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Skeleton variant="circular" width={48} height={48} sx={{ mr: 2 }} />
                      <Box sx={{ flex: 1 }}>
                        <Skeleton variant="text" width="60%" height={24} sx={{ mb: 0.5 }} />
                        <Skeleton variant="text" width="40%" height={20} />
                      </Box>
                    </Box>
                    <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="80%" height={20} />
                  </Card>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

