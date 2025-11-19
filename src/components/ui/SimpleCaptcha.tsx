'use client'

import React, { useState } from 'react'
import { TextField, Grid } from '@mui/material'

interface SimpleCaptchaProps {
  name: string
  label: string
  required?: boolean
  placeholder?: string
  helperText?: string
  error?: string
  value: any
  onChange: (value: any) => void
  onBlur: () => void
  disabled?: boolean
  gridProps?: {
    xs?: number
    sm?: number
    md?: number
    lg?: number
  }
}

export const SimpleCaptcha: React.FC<SimpleCaptchaProps> = ({
  name,
  label,
  required = false,
  placeholder,
  helperText,
  error,
  value,
  onChange,
  onBlur,
  disabled = false,
  gridProps = { xs: 12 },
}) => {
  const [captchaQuestion, setCaptchaQuestion] = useState(() => {
    const num1 = Math.floor(Math.random() * 10) + 1
    const num2 = Math.floor(Math.random() * 10) + 1
    return { num1, num2, answer: num1 + num2 }
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const userAnswer = parseInt(e.target.value, 10)
    if (userAnswer === captchaQuestion.answer) {
      onChange('verified')
    } else {
      onChange('')
    }
  }

  return (
    <Grid size={gridProps}>
      <TextField
        name={name}
        label={label}
        type="number"
        required={required}
        placeholder={placeholder}
        helperText={error || helperText || `Enter the sum: ${captchaQuestion.num1} + ${captchaQuestion.num2}`}
        error={!!error}
        fullWidth
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        disabled={disabled}
      />
    </Grid>
  )
}

