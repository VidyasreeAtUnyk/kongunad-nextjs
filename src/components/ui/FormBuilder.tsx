'use client'

import React, { useState, useCallback } from 'react'
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
} from '@mui/material'
import { Grid } from '@mui/material'
import { FormBuilderProps, FormField, FieldType } from '@/types/forms'
import { SimpleCaptcha } from './SimpleCaptcha'
import { GoogleReCaptcha } from './GoogleReCaptcha'

/**
 * A reusable, configurable form builder that supports multiple field types
 * and validation rules
 */
export const FormBuilder: React.FC<FormBuilderProps> = ({
  config,
  initialValues = {},
  onSubmitSuccess,
  onSubmitError,
}) => {
  const [values, setValues] = useState<Record<string, any>>(() => {
    const defaults: Record<string, any> = {}
    config.fields.forEach(field => {
      defaults[field.name] = field.defaultValue ?? initialValues[field.name] ?? ''
    })
    return defaults
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Validation function
  const validateField = useCallback((field: FormField, value: any): string | null => {
    if (field.required && (!value || value.toString().trim() === '')) {
      return `${field.label} is required`
    }

    if (value && field.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        return field.validationMessage || 'Invalid email address'
      }
    }

    if (value && field.type === 'tel') {
      // Indian phone number validation (10 digits with optional +91)
      const phoneRegex = /^(\+91)?[6-9]\d{9}$/
      const cleanedPhone = value.replace(/[\s-]/g, '')
      if (!phoneRegex.test(cleanedPhone)) {
        return field.validationMessage || 'Invalid phone number'
      }
    }

    if (value && field.minLength && value.length < field.minLength) {
      return field.validationMessage || `${field.label} must be at least ${field.minLength} characters`
    }

    if (value && field.maxLength && value.length > field.maxLength) {
      return field.validationMessage || `${field.label} must be at most ${field.maxLength} characters`
    }

    if (value && field.pattern && !field.pattern.test(value)) {
      return field.validationMessage || `Invalid ${field.label.toLowerCase()}`
    }

    if (value && field.type === 'number') {
      const numValue = Number(value)
      if (isNaN(numValue)) {
        return 'Please enter a valid number'
      }
      if (field.min !== undefined && numValue < field.min) {
        return `${field.label} must be at least ${field.min}`
      }
      if (field.max !== undefined && numValue > field.max) {
        return `${field.label} must be at most ${field.max}`
      }
    }

    return null
  }, [])

  const validateAllFields = useCallback((): boolean => {
    const newErrors: Record<string, string> = {}
    let isValid = true

    config.fields.forEach(field => {
      const error = validateField(field, values[field.name])
      if (error) {
        newErrors[field.name] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }, [config.fields, values, validateField])

  const handleChange = useCallback((name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }))
    
    // Clear error for this field if it was touched
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }, [errors])

  const handleBlur = useCallback((field: FormField) => {
    setTouched(prev => ({ ...prev, [field.name]: true }))
    
    // Validate on blur
    const error = validateField(field, values[field.name])
    if (error) {
      setErrors(prev => ({ ...prev, [field.name]: error }))
    }
  }, [values, validateField])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    
    // Mark all fields as touched
    const allTouched: Record<string, boolean> = {}
    config.fields.forEach(field => {
      allTouched[field.name] = true
    })
    setTouched(allTouched)

    if (!validateAllFields()) {
      return
    }

    setIsSubmitting(true)

    try {
      await config.onSubmit(values)
      
      if (onSubmitSuccess) {
        onSubmitSuccess()
      } else {
        // Default success behavior: show message and reset form
        alert('Form submitted successfully!')
        setValues(prev => {
          const defaults: Record<string, any> = {}
          config.fields.forEach(field => {
            defaults[field.name] = field.defaultValue ?? ''
          })
          return defaults
        })
        setTouched({})
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      setSubmitError(errorMessage)
      if (onSubmitError) {
        onSubmitError(error instanceof Error ? error : new Error(errorMessage))
      }
    } finally {
      setIsSubmitting(false)
    }
  }, [values, config, validateAllFields, onSubmitSuccess, onSubmitError])

  const renderField = useCallback((field: FormField): React.ReactNode => {
    const fieldError = touched[field.name] ? errors[field.name] : ''
    const fieldValue = values[field.name] ?? ''

    // Grid props for layout
    const gridProps = field.gridProps || { xs: 12, sm: 6 }

    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
        return (
          <Grid key={field.name} size={gridProps}>
            <TextField
              name={field.name}
              label={field.label}
              type={field.type}
              required={field.required}
              placeholder={field.placeholder}
              helperText={fieldError || field.helperText}
              error={!!fieldError}
              fullWidth
              value={fieldValue}
              onChange={(e) => handleChange(field.name, e.target.value)}
              onBlur={() => handleBlur(field)}
              disabled={field.disabled || isSubmitting}
              inputProps={{
                minLength: field.minLength,
                maxLength: field.maxLength,
              }}
            />
          </Grid>
        )

      case 'number':
        return (
          <Grid key={field.name} size={gridProps}>
            <TextField
              name={field.name}
              label={field.label}
              type="number"
              required={field.required}
              placeholder={field.placeholder}
              helperText={fieldError || field.helperText}
              error={!!fieldError}
              fullWidth
              value={fieldValue}
              onChange={(e) => handleChange(field.name, e.target.value)}
              onBlur={() => handleBlur(field)}
              disabled={field.disabled || isSubmitting}
              inputProps={{
                min: field.min,
                max: field.max,
              }}
            />
          </Grid>
        )

      case 'date':
        return (
          <Grid key={field.name} size={gridProps}>
            <TextField
              name={field.name}
              label={field.label}
              type="date"
              required={field.required}
              helperText={fieldError || field.helperText}
              error={!!fieldError}
              fullWidth
              value={fieldValue}
              onChange={(e) => handleChange(field.name, e.target.value)}
              onBlur={() => handleBlur(field)}
              disabled={field.disabled || isSubmitting}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        )

      case 'select':
        return (
          <Grid key={field.name} size={gridProps}>
            <FormControl fullWidth required={field.required} error={!!fieldError}>
              <InputLabel id={`${field.name}-label`}>{field.label}</InputLabel>
              <Select
                labelId={`${field.name}-label`}
                name={field.name}
                value={fieldValue}
                label={field.label}
                onChange={(e) => handleChange(field.name, e.target.value)}
                onBlur={() => handleBlur(field)}
                disabled={field.disabled || isSubmitting}
              >
                {field.options?.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
              {(fieldError || field.helperText) && (
                <FormHelperText>{fieldError || field.helperText}</FormHelperText>
              )}
            </FormControl>
          </Grid>
        )

      case 'textarea':
        return (
          <Grid key={field.name} size={gridProps}>
            <TextField
              name={field.name}
              label={field.label}
              multiline={true}
              rows={field.rows || 4}
              required={field.required}
              placeholder={field.placeholder}
              helperText={fieldError || field.helperText}
              error={!!fieldError}
              fullWidth
              value={fieldValue}
              onChange={(e) => handleChange(field.name, e.target.value)}
              onBlur={() => handleBlur(field)}
              disabled={field.disabled || isSubmitting}
              inputProps={{
                minLength: field.minLength,
                maxLength: field.maxLength,
              }}
            />
          </Grid>
        )

      case 'file':
        return (
          <Grid key={field.name} size={gridProps}>
            <FormControl fullWidth required={field.required} error={!!fieldError}>
              <TextField
                name={field.name}
                label={field.label}
                type="file"
                required={field.required}
                helperText={fieldError || field.helperText}
                error={!!fieldError}
                fullWidth
                onChange={(e) => {
                  const file = (e.target as HTMLInputElement).files?.[0]
                  handleChange(field.name, file)
                }}
                onBlur={() => handleBlur(field)}
                disabled={field.disabled || isSubmitting}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  accept: field.accept,
                }}
              />
            </FormControl>
          </Grid>
        )

      case 'captcha':
        // Google reCAPTCHA for production use
        return (
          <Grid key={field.name} size={gridProps}>
            <GoogleReCaptcha
              name={field.name}
              label={field.label}
              required={field.required}
              error={fieldError}
              value={fieldValue}
              onChange={(value) => handleChange(field.name, value)}
              onBlur={() => handleBlur(field)}
              disabled={field.disabled || isSubmitting}
            />
          </Grid>
        )

      default:
        return null
    }
  }, [values, errors, touched, isSubmitting, handleChange, handleBlur])

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {config.description && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {config.description}
        </Typography>
      )}

      {submitError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {submitError}
        </Alert>
      )}

      <Grid container spacing={3}>
        {config.fields.map(field => renderField(field))}
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
          {isSubmitting ? 'Submitting...' : (config.submitLabel || 'Submit')}
        </Button>
      </Box>
    </Box>
  )
}

