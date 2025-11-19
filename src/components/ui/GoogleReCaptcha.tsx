'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Box, Typography } from '@mui/material'

interface GoogleReCaptchaProps {
  name: string
  label: string
  required?: boolean
  error?: string
  value: any
  onChange: (value: any) => void
  onBlur: () => void
  disabled?: boolean
}

declare global {
  interface Window {
    grecaptcha: any
  }
}

export const GoogleReCaptcha: React.FC<GoogleReCaptchaProps> = ({
  name,
  label,
  required = false,
  error,
  value,
  onChange,
  onBlur,
  disabled = false,
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [widgetId, setWidgetId] = useState<number | null>(null)
  const isRenderingRef = useRef(false)
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI' // Google test key

  useEffect(() => {
    // Check if already loaded
    if (window.grecaptcha && window.grecaptcha.ready) {
      setIsLoaded(true)
      return
    }

    // Load reCAPTCHA script
    const script = document.createElement('script')
    script.src = `https://www.google.com/recaptcha/api.js?render=explicit`
    script.async = true
    script.defer = true
    script.onload = () => {
      setIsLoaded(true)
    }
    script.onerror = () => {
      console.error('Failed to load reCAPTCHA script')
    }
    
    if (!document.getElementById('recaptcha-script')) {
      script.id = 'recaptcha-script'
      document.body.appendChild(script)
    } else {
      // Script already exists, check if loaded
      if (window.grecaptcha && window.grecaptcha.ready) {
        setIsLoaded(true)
      }
    }
  }, [])

  useEffect(() => {
    if (isLoaded && !widgetId && !disabled && !isRenderingRef.current) {
      // Initialize reCAPTCHA
      const container = document.getElementById(`recaptcha-${name}`)
      if (container && window.grecaptcha) {
        // Check if already rendered
        const existingWidget = container.querySelector('.g-recaptcha')
        if (existingWidget) {
          console.warn('reCAPTCHA widget already exists in container')
          return
        }
        
        isRenderingRef.current = true
        try {
          const id = window.grecaptcha.render(container, {
            sitekey: siteKey,
            callback: (token: string) => {
              onChange(token)
            },
            'expired-callback': () => {
              onChange('')
            },
            'error-callback': () => {
              onChange('')
            },
          })
          setWidgetId(id)
        } catch (error) {
          console.error('reCAPTCHA initialization error:', error)
          isRenderingRef.current = false
        }
      }
    }
  }, [isLoaded, name, siteKey, disabled, widgetId]) // eslint-disable-line react-hooks/exhaustive-deps

  // Reset if disabled/enabled changes
  useEffect(() => {
    if (widgetId !== null && window.grecaptcha) {
      if (disabled) {
        window.grecaptcha.reset(widgetId)
      }
    }
  }, [disabled, widgetId]) // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (widgetId !== null && window.grecaptcha) {
        try {
          window.grecaptcha.reset(widgetId)
        } catch (error) {
          // Ignore errors during cleanup
        }
      }
    }
  }, [widgetId])

  return (
    <Box>
      <Typography variant="body2" sx={{ mb: 1 }}>
        {required && <span style={{ color: 'red' }}>*</span>} {label}
      </Typography>
      <Box id={`recaptcha-${name}`} sx={{ mb: 1 }} />
      {!isLoaded && (
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
          Loading security verification...
        </Typography>
      )}
      {error && (
        <Typography variant="body2" sx={{ color: 'error.main', mt: 0.5 }}>
          {error}
        </Typography>
      )}
    </Box>
  )
}
