'use client'

import React, { useEffect, useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { closeBottomSheet } from '@/store/bottomSheetSlice'
import { BottomSheet } from './BottomSheet'
import { BookHealthCheckupFormV2 } from '@/components/forms/BookHealthCheckupFormV2'
import { ResearchForm } from '@/components/forms/ResearchForm'
import { ErrorBoundary } from './ErrorBoundary'
import { Alert, Box, Skeleton, Typography } from '@mui/material'
import { getResearchPrograms } from '@/lib/contentful'
import { ResearchProgram } from '@/types/contentful'

export const BottomSheetContainer: React.FC = () => {
  const { isOpen, type, packageName, courseName } = useAppSelector((state) => state.bottomSheet)
  const dispatch = useAppDispatch()
  const [researchPrograms, setResearchPrograms] = useState<ResearchProgram[]>([])
  const [loadingPrograms, setLoadingPrograms] = useState(false)

  // Fetch research programs when research form is opened
  useEffect(() => {
    if (isOpen && type === 'research') {
      setLoadingPrograms(true)
      getResearchPrograms()
        .then((programs) => {
          setResearchPrograms(programs as unknown as ResearchProgram[])
        })
        .catch(() => {
          // Silently handle error - form will still work with empty options
        })
        .finally(() => {
          setLoadingPrograms(false)
        })
    }
  }, [isOpen, type])

  const handleClose = () => {
    dispatch(closeBottomSheet())
  }

  const handleFormSuccess = () => {
    dispatch(closeBottomSheet())
  }

  const handleHealthCheckupSubmit = async (data: Record<string, any>) => {
    // TODO: Implement API call to submit health checkup data
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        alert('Health checkup booking submitted successfully! We will contact you shortly.')
        handleFormSuccess()
        resolve()
      }, 500)
    })
  }

  const handleResearchSubmit = async (data: Record<string, any>) => {
    // TODO: Implement API call to submit research application data
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        alert('Research application submitted successfully! We will contact you shortly.')
        handleFormSuccess()
        resolve()
      }, 500)
    })
  }

  // Package options for health checkup dropdown
  const packageOptions: string[] = []

  // Course options for research form
  const courseOptions = researchPrograms.map((program) => program.fields.title)

  if (!isOpen) {
    return null
  }

  const isResearchForm = type === 'research'

  return (
    <ErrorBoundary
      fallback={
        <BottomSheet
          open={isOpen}
          onClose={handleClose}
          title={isResearchForm ? 'Research Application' : 'Book Health Checkup'}
          maxHeight="90vh"
        >
          <Box sx={{ p: 3 }}>
            <Alert severity="error" sx={{ mb: 2 }}>
              Unable to load the form. Please try again later.
            </Alert>
            <Alert severity="info">
              {isResearchForm
                ? 'You can also contact us directly for research program inquiries.'
                : 'You can also book a health checkup by calling us directly or visiting our facility.'}
            </Alert>
          </Box>
        </BottomSheet>
      }
    >
      <BottomSheet
        open={isOpen}
        onClose={handleClose}
        title={isResearchForm ? 'Research Application' : 'Book Health Checkup'}
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
          {isResearchForm ? (
            loadingPrograms ? (
              <Box sx={{ p: 4 }}>
                <Skeleton variant="text" width="60%" height={40} sx={{ mb: 2 }} />
                <Skeleton variant="text" width="80%" height={24} sx={{ mb: 4 }} />
                <Skeleton variant="rectangular" width="100%" height={56} sx={{ mb: 2, borderRadius: 1 }} />
                <Skeleton variant="rectangular" width="100%" height={56} sx={{ mb: 2, borderRadius: 1 }} />
                <Skeleton variant="rectangular" width="100%" height={56} sx={{ mb: 2, borderRadius: 1 }} />
                <Skeleton variant="rectangular" width="100%" height={56} sx={{ mb: 2, borderRadius: 1 }} />
                <Skeleton variant="rectangular" width="100%" height={48} sx={{ borderRadius: 1 }} />
              </Box>
            ) : (
              <ResearchForm
                onSubmit={handleResearchSubmit}
                initialValues={courseName ? { courseName } : {}}
                courseOptions={courseOptions}
                onSubmitSuccess={handleFormSuccess}
              />
            )
          ) : (
            <BookHealthCheckupFormV2
              onSubmit={handleHealthCheckupSubmit}
              initialValues={packageName ? { packageType: packageName } : {}}
              packageOptions={packageOptions}
              onSubmitSuccess={handleFormSuccess}
            />
          )}
        </ErrorBoundary>
      </BottomSheet>
    </ErrorBoundary>
  )
}

