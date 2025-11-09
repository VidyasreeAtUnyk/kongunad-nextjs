/**
 * Make Appointment Form Component
 * A wrapper component around FormBuilder with appointment-specific configuration
 */

'use client'

import React from 'react'
import { Paper, Typography } from '@mui/material'
import { FormBuilder } from '@/components/ui/FormBuilder'
import { makeAppointmentFormConfig } from '@/lib/formConfigs'

interface MakeAppointmentFormProps {
  onSubmit: (data: Record<string, any>) => Promise<void> | void
  onSubmitSuccess?: () => void
  onSubmitError?: (error: Error) => void
  initialValues?: Record<string, any>
}

export const MakeAppointmentForm: React.FC<MakeAppointmentFormProps> = ({
  onSubmit,
  onSubmitSuccess,
  onSubmitError,
  initialValues,
}) => {
  const config = {
    ...makeAppointmentFormConfig,
    onSubmit,
  }

  return (
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
  )
}

