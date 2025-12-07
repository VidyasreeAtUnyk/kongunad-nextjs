'use client'

import React, { Component, ReactNode } from 'react'
import { Box } from '@mui/material'

interface OfferErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface OfferErrorBoundaryState {
  hasError: boolean
}

export class OfferErrorBoundary extends Component<
  OfferErrorBoundaryProps,
  OfferErrorBoundaryState
> {
  constructor(props: OfferErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): OfferErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Offer component error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // Silently fail - don't show offers if there's an error
      return this.props.fallback || null
    }

    return this.props.children
  }
}

