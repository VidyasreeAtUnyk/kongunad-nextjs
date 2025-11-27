/**
 * Job Vacancy Form Component V2 - Using React Hook Form + Zod
 */

'use client'

import React from 'react'
import { FormBuilderV2, FormFieldConfig } from '@/components/ui/FormBuilderV2'
import { jobVacancyConfig } from '@/lib/formConfigsV2'
import { z } from 'zod'

interface JobVacancyFormProps {
  onSubmit: (data: any) => Promise<void> | void
  onSubmitSuccess?: () => void
  onSubmitError?: (error: Error) => void
  initialValues?: any
  title?: string
  description?: string
  designationOptions?: readonly string[] // Array of designation names for the dropdown
}

export const JobVacancyForm: React.FC<JobVacancyFormProps> = ({
  onSubmit,
  onSubmitSuccess,
  onSubmitError,
  initialValues,
  title,
  description,
  designationOptions,
}) => {
  // Update designation field with dynamic options and create dynamic schema
  const { fieldsWithDesignation, schema } = React.useMemo(() => {
    // Validate designationOptions
    const validOptions = Array.isArray(designationOptions) && designationOptions.length > 0
      ? designationOptions.filter((opt): opt is string => typeof opt === 'string' && opt.trim().length > 0)
      : []

    // If no valid dynamic options provided, use default config
    if (validOptions.length === 0) {
      return {
        fieldsWithDesignation: jobVacancyConfig.fields,
        schema: jobVacancyConfig.schema,
      }
    }

    // Update fields with dynamic designation options
    const updatedFields = jobVacancyConfig.fields.map(field => {
      if (field.name === 'designation') {
        return {
          ...field,
          options: validOptions,
        } as FormFieldConfig
      }
      return field
    })

    // Create dynamic schema with designation options
    // Use omit to remove the old designation field, then extend with new one
    const baseSchema = jobVacancyConfig.schema.omit({ designation: true })
    const dynamicSchema = baseSchema.extend({
      designation: z.enum(validOptions as unknown as [string, ...string[]], {
        errorMap: () => ({ message: 'Please select a designation' }),
      } as any),
    })

    return {
      fieldsWithDesignation: updatedFields,
      schema: dynamicSchema,
    }
  }, [designationOptions])

  return (
    <FormBuilderV2
      schema={schema}
      fields={fieldsWithDesignation}
      title={title || 'Job Application Form'}
      description={description || 'Fill in the details below to apply for the position.'}
      submitLabel="Submit Application"
      onSubmit={onSubmit}
      onSubmitSuccess={onSubmitSuccess}
      onSubmitError={onSubmitError}
      initialValues={initialValues}
    />
  )
}

