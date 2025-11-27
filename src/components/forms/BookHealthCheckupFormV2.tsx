/**
 * Book Health Checkup Form Component V2 - Using React Hook Form + Zod
 */

'use client'

import React from 'react'
import { FormBuilderV2, FormFieldConfig } from '@/components/ui/FormBuilderV2'
import { bookHealthCheckupConfig } from '@/lib/formConfigsV2'

interface BookHealthCheckupFormV2Props {
  onSubmit: (data: any) => Promise<void> | void
  onSubmitSuccess?: () => void
  onSubmitError?: (error: Error) => void
  initialValues?: any
  packageOptions?: readonly string[]
}

export const BookHealthCheckupFormV2: React.FC<BookHealthCheckupFormV2Props> = ({
  onSubmit,
  onSubmitSuccess,
  onSubmitError,
  initialValues,
  packageOptions,
}) => {
  // Update packageType field to be a select with dynamic options
  const fieldsWithPackageSelect = React.useMemo(() => {
    // Only convert to select if we have package options
    if (!packageOptions || packageOptions.length === 0) {
      return bookHealthCheckupConfig.fields
    }
    
    return bookHealthCheckupConfig.fields.map(field => {
      if (field.name === 'packageType') {
        return {
          ...field,
          type: 'select' as const,
          options: packageOptions,
        } as FormFieldConfig
      }
      return field
    })
  }, [packageOptions])

  return (
    <FormBuilderV2
      schema={bookHealthCheckupConfig.schema}
      fields={fieldsWithPackageSelect}
      description="Complete the form below to book your health checkup package."
      submitLabel="Book Checkup"
      onSubmit={onSubmit}
      onSubmitSuccess={onSubmitSuccess}
      onSubmitError={onSubmitError}
      initialValues={initialValues}
    />
  )
}

