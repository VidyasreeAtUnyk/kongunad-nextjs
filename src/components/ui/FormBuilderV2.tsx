'use client'

import React, { useEffect } from 'react'
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Grid,
} from '@mui/material'
import { useForm, Controller, FieldValues } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { GoogleReCaptcha } from './GoogleReCaptcha'

/**
 * Form Builder V2 - Using React Hook Form + Zod for validation
 */

export interface FormFieldConfig {
  name: string
  label: string
  type: FieldType
  required?: boolean
  placeholder?: string
  helperText?: string
  options?: readonly string[]
  minDate?: string // For date fields: minimum selectable date (ISO format)
  maxDate?: string // For date fields: maximum selectable date (ISO format)
  gridProps?: {
    xs?: number
    sm?: number
    md?: number
    lg?: number
  }
}

type FieldType = 
  | 'text'
  | 'email'
  | 'tel'
  | 'number'
  | 'date'
  | 'select'
  | 'textarea'
  | 'file'
  | 'captcha'

interface FormBuilderV2Props {
  schema: z.ZodType<any>
  fields: FormFieldConfig[]
  title?: string
  description?: string
  submitLabel?: string
  onSubmit: (data: any) => Promise<void> | void
  onSubmitSuccess?: () => void
  onSubmitError?: (error: Error) => void
  initialValues?: any
}

export function FormBuilderV2({
  schema,
  fields,
  title,
  description,
  submitLabel = 'Submit',
  onSubmit,
  onSubmitSuccess,
  onSubmitError,
  initialValues,
}: FormBuilderV2Props) {
  // Build default values from fields to ensure controlled components
  const buildDefaultValues = () => {
    const defaults: Record<string, any> = {}
    fields.forEach(field => {
      if (initialValues && field.name in initialValues) {
        defaults[field.name] = initialValues[field.name]
      } else if (field.type === 'select') {
        defaults[field.name] = ''
      } else if (field.type === 'date') {
        defaults[field.name] = ''
      } else if (field.type === 'number') {
        defaults[field.name] = ''
      } else if (field.type === 'file') {
        defaults[field.name] = null
      } else if (field.type === 'captcha') {
        defaults[field.name] = ''
      } else {
        defaults[field.name] = ''
      }
    })
    return defaults
  }

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm({
    resolver: zodResolver(schema as any),
    defaultValues: buildDefaultValues(),
  })

  // Reset form when initialValues change
  useEffect(() => {
    reset(buildDefaultValues())
  }, [JSON.stringify(initialValues)]) // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmitHandler = async (data: any) => {
    try {
      await onSubmit(data)
      
      // Reset form after successful submission
      reset()
      
      if (onSubmitSuccess) {
        onSubmitSuccess()
      }
      // Note: Success message should be handled by parent component via onSubmitSuccess
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      
      // Set a generic form error
      setError('root', { message: errorMessage })
      
      if (onSubmitError) {
        onSubmitError(error instanceof Error ? error : new Error(errorMessage))
      }
    }
  }

  const getErrorMessage = (fieldName: string): string | undefined => {
    const error = errors[fieldName]
    return error?.message as string | undefined
  }

  const renderField = (field: FormFieldConfig) => {
    const gridProps = field.gridProps || { xs: 12, sm: 6 }
    const errorMessage = getErrorMessage(field.name)

    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
        return (
          <Grid key={field.name} size={gridProps}>
            <Controller
              name={field.name}
              control={control}
              render={({ field: controllerField }) => (
                <TextField
                  {...controllerField}
                  label={field.label}
                  type={field.type}
                  required={field.required}
                  helperText={errorMessage || field.helperText}
                  error={!!errorMessage}
                  fullWidth
                  disabled={isSubmitting}
                />
              )}
            />
          </Grid>
        )

      case 'number':
        return (
          <Grid key={field.name} size={gridProps}>
            <Controller
              name={field.name}
              control={control}
              render={({ field: controllerField }) => (
                <TextField
                  {...controllerField}
                  label={field.label}
                  type="number"
                  required={field.required}
                  helperText={errorMessage || field.helperText}
                  error={!!errorMessage}
                  fullWidth
                  disabled={isSubmitting}
                  onChange={(e) => controllerField.onChange(e.target.value)}
                />
              )}
            />
          </Grid>
        )

      case 'date':
        return (
          <Grid key={field.name} size={gridProps}>
            <Controller
              name={field.name}
              control={control}
              render={({ field: controllerField }) => (
                <TextField
                  {...controllerField}
                  label={field.label}
                  type="date"
                  required={field.required}
                  helperText={errorMessage || field.helperText}
                  error={!!errorMessage}
                  fullWidth
                  disabled={isSubmitting}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    min: field.minDate,
                    max: field.maxDate,
                  }}
                />
              )}
            />
          </Grid>
        )

      case 'select':
        return (
          <Grid key={field.name} size={gridProps}>
            <Controller
              name={field.name}
              control={control}
              render={({ field: controllerField }) => (
                <FormControl fullWidth required={field.required} error={!!errorMessage}>
                  <InputLabel id={`${field.name}-label`}>{field.label}</InputLabel>
                  <Select
                    {...controllerField}
                    labelId={`${field.name}-label`}
                    label={field.label}
                    disabled={isSubmitting}
                  >
                    {field.options?.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                  {(errorMessage || field.helperText) && (
                    <FormHelperText>
                      {errorMessage || field.helperText}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Grid>
        )

      case 'textarea':
        return (
          <Grid key={field.name} size={gridProps}>
            <Controller
              name={field.name}
              control={control}
              render={({ field: controllerField }) => (
                <TextField
                  {...controllerField}
                  label={field.label}
                  multiline
                  rows={4}
                  required={field.required}
                  helperText={errorMessage || field.helperText}
                  error={!!errorMessage}
                  fullWidth
                  disabled={isSubmitting}
                />
              )}
            />
          </Grid>
        )

      case 'file':
        return (
          <Grid key={field.name} size={gridProps}>
            <Controller
              name={field.name}
              control={control}
              render={({ field: controllerField }) => (
                <FormControl fullWidth required={field.required} error={!!errorMessage}>
                  <TextField
                    type="file"
                    label={field.label}
                    required={field.required}
                    helperText={errorMessage || field.helperText}
                    error={!!errorMessage}
                    disabled={isSubmitting}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      accept: '.pdf,.doc,.docx',
                      onChange: (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0]
                        controllerField.onChange(file)
                      },
                    }}
                  />
                </FormControl>
              )}
            />
          </Grid>
        )

      case 'captcha':
        return (
          <Controller
            key={field.name}
            name={field.name}
            control={control}
            render={({ field: controllerField }) => (
              <Grid size={gridProps}>
                <GoogleReCaptcha
                  name={field.name}
                  label={field.label}
                  required={field.required}
                  error={errorMessage}
                  value={controllerField.value}
                  onChange={(value) => controllerField.onChange(value)}
                  onBlur={controllerField.onBlur}
                  disabled={isSubmitting}
                />
              </Grid>
            )}
          />
        )

      default:
        return null
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmitHandler)} sx={{ mt: 2 }}>
      {title && (
        <Typography variant="h1" gutterBottom color="primary" sx={{ fontWeight: 800, mb: 1 }}>
          {title}
        </Typography>
      )}
      
      {description && (
        <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary', lineHeight: 1.8 }}>
          {description}
        </Typography>
      )}

      {errors.root && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {(errors.root as any)?.message}
        </Alert>
      )}

      <Grid container spacing={3}>
        {fields.map(field => renderField(field))}
      </Grid>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          sx={{ minWidth: 150 }}
        >
          {isSubmitting ? 'Submitting...' : submitLabel}
        </Button>
      </Box>
    </Box>
  )
}
