'use client'

import React, { Component, ReactNode } from 'react'
import { Box, Container, Typography, Button } from '@mui/material'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'

interface NavigationErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface NavigationErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class NavigationErrorBoundary extends Component<
  NavigationErrorBoundaryProps,
  NavigationErrorBoundaryState
> {
  constructor(props: NavigationErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): NavigationErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Navigation component error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Minimal fallback navigation that won't break the page
      return (
        <Box
          sx={{
            backgroundColor: 'white',
            borderBottom: '1px solid',
            borderColor: 'divider',
            py: 1,
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                KONGUNAD HOSPITALS
              </Typography>
              <Button
                size="small"
                variant="outlined"
                onClick={this.handleReset}
                sx={{ textTransform: 'none' }}
              >
                Retry Navigation
              </Button>
            </Box>
          </Container>
        </Box>
      )
    }

    return this.props.children
  }
}

