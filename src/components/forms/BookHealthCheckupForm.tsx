/**
 * Book Health Checkup Form Component
 * A wrapper component around FormBuilder with health checkup-specific configuration
 */

'use client'

import React from 'react'
import { Paper, Typography, Card, CardContent } from '@mui/material'
import { FormBuilder } from '@/components/ui/FormBuilder'
import { bookHealthCheckupFormConfig } from '@/lib/formConfigs'

interface BookHealthCheckupFormProps {
  onSubmit: (data: Record<string, any>) => Promise<void> | void
  onSubmitSuccess?: () => void
  onSubmitError?: (error: Error) => void
  initialValues?: Record<string, any>
  selectedPackageName?: string
}

export const BookHealthCheckupForm: React.FC<BookHealthCheckupFormProps> = ({
  onSubmit,
  onSubmitSuccess,
  onSubmitError,
  initialValues,
  selectedPackageName,
}) => {
  const config = {
    ...bookHealthCheckupFormConfig,
    onSubmit,
  }

  return (
    <>
      {selectedPackageName && (
        <Card sx={{ mb: 3, backgroundColor: 'info.light', color: 'white' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Selected Package
            </Typography>
            <Typography variant="body1">
              {selectedPackageName}
            </Typography>
          </CardContent>
        </Card>
      )}
      
      <Paper elevation={0} sx={{ p: 4 }}>
        <Typography variant="h1" gutterBottom color="primary" sx={{ fontWeight: 800, mb: 1 }}>
          {config.title}
        </Typography>
        
        {config.description && (
          <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary', lineHeight: 1.8 }}>
            {config.description}
          </Typography>
        )}
        
        <FormBuilder 
          config={config}
          initialValues={initialValues}
          onSubmitSuccess={onSubmitSuccess}
          onSubmitError={onSubmitError}
        />
      </Paper>
    </>
  )
}

