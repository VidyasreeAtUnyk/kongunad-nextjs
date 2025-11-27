/**
 * Research Form Component V2 - Using React Hook Form + Zod
 */

'use client'

import React from 'react'
import { FormBuilderV2, FormFieldConfig } from '@/components/ui/FormBuilderV2'
import { researchConfig } from '@/lib/formConfigsV2'

interface ResearchFormProps {
  onSubmit: (data: any) => Promise<void> | void
  onSubmitSuccess?: () => void
  onSubmitError?: (error: Error) => void
  initialValues?: any
  title?: string
  description?: string
  courseOptions?: readonly string[] // Array of course names for the dropdown (if needed in future)
}

export const ResearchForm: React.FC<ResearchFormProps> = ({
  onSubmit,
  onSubmitSuccess,
  onSubmitError,
  initialValues,
  title,
  description,
  courseOptions,
}) => {
  // Update fields if courseOptions are provided (for future use)
  const fields = React.useMemo(() => {
    if (!courseOptions) return researchConfig.fields
    
    return researchConfig.fields.map(field => {
      // If courseName field is added in the future, handle it here
      // For now, just return the field as-is
      return field
    })
  }, [courseOptions])

  return (
    <FormBuilderV2
      schema={researchConfig.schema}
      fields={fields}
      title={title || 'Research Program Application'}
      description={description || 'Fill in the details below to apply for the research program.'}
      submitLabel="Submit Application"
      onSubmit={onSubmit}
      onSubmitSuccess={onSubmitSuccess}
      onSubmitError={onSubmitError}
      initialValues={initialValues}
    />
  )
}

