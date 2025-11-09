/**
 * Research Form Component
 * A wrapper component around FormBuilder with research-specific configuration
 * Can be used across multiple pages
 */

'use client'

import React from 'react'
import { Paper, Typography } from '@mui/material'
import { FormBuilder } from '@/components/ui/FormBuilder'
import { researchFormConfig } from '@/lib/formConfigs'

interface ResearchFormProps {
  onSubmit: (data: Record<string, any>) => Promise<void> | void
  onSubmitSuccess?: () => void
  onSubmitError?: (error: Error) => void
  initialValues?: Record<string, any>
  title?: string
  description?: string
}

export const ResearchForm: React.FC<ResearchFormProps> = ({
  onSubmit,
  onSubmitSuccess,
  onSubmitError,
  initialValues,
  title,
  description,
}) => {
  const config = {
    ...researchFormConfig,
    onSubmit,
    ...(title && { title }),
    ...(description && { description }),
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

