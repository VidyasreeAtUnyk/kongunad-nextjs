import React from 'react'
import {
  Box,
  Container,
  Skeleton,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material'

export const JobDetailSkeleton: React.FC = () => {
  return (
    <Box sx={{ minHeight: '60vh', py: 8, backgroundColor: 'background.default' }}>
      <Container maxWidth="lg">
        {/* Breadcrumbs skeleton */}
        <Box sx={{ mb: 3, display: 'flex', gap: 1 }}>
          <Skeleton variant="text" width={60} height={24} />
          <Skeleton variant="text" width={20} height={24} />
          <Skeleton variant="text" width={120} height={24} />
          <Skeleton variant="text" width={20} height={24} />
          <Skeleton variant="text" width={150} height={24} />
          <Skeleton variant="text" width={20} height={24} />
          <Skeleton variant="text" width={100} height={24} />
        </Box>

        {/* Back button skeleton */}
        <Skeleton variant="rectangular" width={150} height={36} sx={{ borderRadius: 1, mb: 4 }} />

        {/* Job Header skeleton */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Skeleton variant="rectangular" width={64} height={64} sx={{ borderRadius: 2 }} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width={400} height={56} sx={{ mb: 1 }} />
              <Skeleton variant="rectangular" width={120} height={32} sx={{ borderRadius: 1 }} />
            </Box>
          </Box>
          <Skeleton variant="rectangular" width="100%" height={80} sx={{ borderRadius: 2, mb: 3 }} />
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: '2fr 1fr',
            },
            gap: 4,
          }}
        >
          {/* Main Content skeleton */}
          <Box>
            <Card sx={{ mb: 4 }}>
              <CardContent sx={{ p: 4 }}>
                <Skeleton variant="text" width={200} height={32} sx={{ mb: 3 }} />
                <Skeleton variant="text" width="100%" height={24} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="100%" height={24} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="90%" height={24} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="95%" height={24} />
              </CardContent>
            </Card>

            <Card sx={{ mb: 4 }}>
              <CardContent sx={{ p: 4 }}>
                <Skeleton variant="text" width={150} height={32} sx={{ mb: 3 }} />
                <List>
                  {Array.from({ length: 4 }).map((_, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Skeleton variant="circular" width={24} height={24} />
                      </ListItemIcon>
                      <ListItemText>
                        <Skeleton variant="text" width="80%" height={24} />
                      </ListItemText>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>

            <Card>
              <CardContent sx={{ p: 4 }}>
                <Skeleton variant="text" width={200} height={32} sx={{ mb: 3 }} />
                <List>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Skeleton variant="circular" width={24} height={24} />
                      </ListItemIcon>
                      <ListItemText>
                        <Skeleton variant="text" width="75%" height={24} />
                      </ListItemText>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Box>

          {/* Sidebar skeleton */}
          <Box>
            <Card
              sx={{
                position: 'sticky',
                top: 100,
                background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.08) 0%, rgba(25, 118, 210, 0.02) 100%)',
                border: '1px solid',
                borderColor: 'primary.light',
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Skeleton variant="rectangular" width={64} height={64} sx={{ borderRadius: 2, mx: 'auto', mb: 2 }} />
                  <Skeleton variant="text" width={150} height={32} sx={{ mx: 'auto', mb: 1 }} />
                  <Skeleton variant="text" width={200} height={20} sx={{ mx: 'auto', mb: 3 }} />
                </Box>
                <Skeleton variant="rectangular" width="100%" height={48} sx={{ borderRadius: 1 }} />
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

