'use client'

import React, { useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Alert,
  Divider,
  Tabs,
  Tab,
  Stack,
} from '@mui/material'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { SearchResultSkeleton } from '@/components/ui/SearchResultSkeleton'
import RefreshIcon from '@mui/icons-material/Refresh'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'

// Component that throws an error for testing
const ThrowError: React.FC<{ message?: string }> = ({ message = 'Test error message' }) => {
  throw new Error(message)
}

// Safe component for comparison
const SafeComponent: React.FC = () => (
  <Paper sx={{ p: 3, bgcolor: 'success.light', color: 'success.contrastText' }}>
    <Typography variant="h6">This is a safe component</Typography>
    <Typography variant="body2">No errors here!</Typography>
  </Paper>
)

export default function DevPage() {
  const [tabValue, setTabValue] = useState(0)
  const [shouldThrow, setShouldThrow] = useState(false)

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom sx={{ mb: 4 }}>
        UI Component Showcase
      </Typography>

      <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} sx={{ mb: 4 }}>
        <Tab label="Skeletons" />
        <Tab label="Error Boundaries" />
        <Tab label="Alerts" />
      </Tabs>

      {/* Skeletons Tab */}
      {tabValue === 0 && (
        <Box>
          <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
            Search Result Skeletons
          </Typography>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Card Variant (Default - 3 cards)
            </Typography>
            <SearchResultSkeleton />
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Card Variant (5 cards)
            </Typography>
            <SearchResultSkeleton count={5} variant="card" />
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              List Variant (4 items)
            </Typography>
            <SearchResultSkeleton count={4} variant="list" />
          </Box>
        </Box>
      )}

      {/* Error Boundaries Tab */}
      {tabValue === 1 && (
        <Box>
          <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
            Error Boundaries
          </Typography>

          <Stack spacing={4}>
            {/* Default Error Boundary */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Default Error Boundary
              </Typography>
              <ErrorBoundary>
                {shouldThrow ? <ThrowError message="This is a test error" /> : <SafeComponent />}
              </ErrorBoundary>
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={() => setShouldThrow(!shouldThrow)}
                  startIcon={<RefreshIcon />}
                >
                  {shouldThrow ? 'Show Safe Component' : 'Trigger Error'}
                </Button>
              </Box>
            </Box>

            <Divider />

            {/* Error Boundary with Custom Fallback */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Error Boundary with Custom Fallback
              </Typography>
              <ErrorBoundary
                fallback={
                  <Paper sx={{ p: 3, bgcolor: 'error.light', color: 'error.contrastText' }}>
                    <Typography variant="h6">Custom Error Fallback</Typography>
                    <Typography variant="body2">
                      This is a custom fallback UI when an error occurs.
                    </Typography>
                  </Paper>
                }
              >
                <ThrowError message="Error with custom fallback" />
              </ErrorBoundary>
            </Box>

            <Divider />

            {/* Error Boundary with Details */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Error Boundary with Details (showDetails=true)
              </Typography>
              <ErrorBoundary showDetails={true}>
                <ThrowError message="Error with stack trace details" />
              </ErrorBoundary>
            </Box>

            <Divider />

            {/* Nested Error Boundaries */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Nested Error Boundaries
              </Typography>
              <ErrorBoundary>
                <Paper sx={{ p: 2, mb: 2, bgcolor: 'info.light' }}>
                  <Typography variant="body1">Outer boundary content (safe)</Typography>
                </Paper>
                <ErrorBoundary
                  fallback={
                    <Paper sx={{ p: 2, bgcolor: 'warning.light' }}>
                      <Typography variant="body2">Inner boundary caught an error</Typography>
                    </Paper>
                  }
                >
                  <ThrowError message="Inner error" />
                </ErrorBoundary>
              </ErrorBoundary>
            </Box>
          </Stack>
        </Box>
      )}

      {/* Alerts Tab */}
      {tabValue === 2 && (
        <Box>
          <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
            Alert Components
          </Typography>

          <Stack spacing={3}>
            {/* Error Alert */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Error Alert (Default)
              </Typography>
              <Alert severity="error" icon={<ErrorOutlineIcon />}>
                <Typography variant="h6" gutterBottom>
                  Search Error
                </Typography>
                <Typography variant="body2">
                  Failed to search. Please try again.
                </Typography>
              </Alert>
            </Box>

            {/* Network Error Alert */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Network Error Alert (with Retry)
              </Typography>
              <Alert
                severity="error"
                action={
                  <Button color="inherit" size="small" startIcon={<RefreshIcon />}>
                    Retry
                  </Button>
                }
              >
                <Typography variant="h6" gutterBottom>
                  Search Error
                </Typography>
                <Typography variant="body2">
                  Unable to connect to the server. Please check your internet connection and try
                  again.
                </Typography>
              </Alert>
            </Box>

            {/* Service Unavailable Alert */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Service Unavailable Alert
              </Typography>
              <Alert
                severity="error"
                action={
                  <Button color="inherit" size="small" startIcon={<RefreshIcon />}>
                    Retry
                  </Button>
                }
              >
                <Typography variant="h6" gutterBottom>
                  Search Error
                </Typography>
                <Typography variant="body2">
                  The search service is temporarily unavailable. Please try again in a moment.
                </Typography>
              </Alert>
            </Box>

            {/* Warning Alert */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Warning Alert
              </Typography>
              <Alert severity="warning">
                <Typography variant="body2">
                  Network error. Please check your connection and try again. - Check your connection
                </Typography>
              </Alert>
            </Box>

            {/* Info Alert */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Info Alert
              </Typography>
              <Alert severity="info">
                <Typography variant="body2">
                  Searching for results... This may take a moment.
                </Typography>
              </Alert>
            </Box>

            {/* Success Alert */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Success Alert
              </Typography>
              <Alert severity="success">
                <Typography variant="body2">
                  Search completed successfully! Found 5 results.
                </Typography>
              </Alert>
            </Box>
          </Stack>
        </Box>
      )}
    </Container>
  )
}

