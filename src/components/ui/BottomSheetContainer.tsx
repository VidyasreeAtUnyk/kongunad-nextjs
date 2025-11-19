'use client'

import React from 'react'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { closeBottomSheet } from '@/store/bottomSheetSlice'
import { BottomSheet } from './BottomSheet'
import { BookHealthCheckupFormV2 } from '@/components/forms/BookHealthCheckupFormV2'
import { ErrorBoundary } from './ErrorBoundary'
import { Alert, Box } from '@mui/material'

export const BottomSheetContainer: React.FC = () => {
  const { isOpen, packageName } = useAppSelector((state) => state.bottomSheet)
  const dispatch = useAppDispatch()

  const handleClose = () => {
    dispatch(closeBottomSheet())
  }

  const handleFormSuccess = () => {
    dispatch(closeBottomSheet())
  }

  const handleFormSubmit = async (data: Record<string, any>) => {
    // TODO: Implement API call to submit health checkup data
    console.log('Health checkup booking data:', data)
    // Example API call:
    // await fetch('/api/health-checkups', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data),
    // })
    
    // For now, just show success
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        alert('Health checkup booking submitted successfully! We will contact you shortly.')
        handleFormSuccess()
        resolve()
      }, 500)
    })
  }

  // Package options for dropdown - optional, form works without it
  // Can be enhanced later to fetch from API or store in Redux
  const packageOptions: string[] = []

  if (!isOpen) {
    return null
  }

  return (
    <ErrorBoundary
      fallback={
        <BottomSheet
          open={isOpen}
          onClose={handleClose}
          title="Book Health Checkup"
          maxHeight="90vh"
        >
          <Box sx={{ p: 3 }}>
            <Alert severity="error" sx={{ mb: 2 }}>
              Unable to load the booking form. Please try again later.
            </Alert>
            <Alert severity="info">
              You can also book a health checkup by calling us directly or visiting our facility.
            </Alert>
          </Box>
        </BottomSheet>
      }
      onError={(error) => {
        console.error('BottomSheetContainer error:', error)
        // Could send to error tracking service here
      }}
    >
      <BottomSheet
        open={isOpen}
        onClose={handleClose}
        title="Book Health Checkup"
        maxHeight="90vh"
      >
        <ErrorBoundary
          fallback={
            <Box sx={{ p: 3 }}>
              <Alert severity="error">
                The form encountered an error. Please refresh the page and try again.
              </Alert>
            </Box>
          }
        >
          <BookHealthCheckupFormV2
            onSubmit={handleFormSubmit}
            initialValues={packageName ? { packageType: packageName } : {}}
            packageOptions={packageOptions}
            onSubmitSuccess={handleFormSuccess}
          />
        </ErrorBoundary>
      </BottomSheet>
    </ErrorBoundary>
  )
}

