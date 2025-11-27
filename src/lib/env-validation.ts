/**
 * Environment variable validation
 * Ensures all required environment variables are set
 */

interface EnvConfig {
  required: string[]
  optional: string[]
}

const envConfig: EnvConfig = {
  required: [
    'NEXT_PUBLIC_SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'RESEND_API_KEY',
    'RESEND_FROM_EMAIL',
    'RESEND_TO_EMAIL',
    'ADMIN_PASSWORD',
  ],
  optional: [
    'NEXT_PUBLIC_SITE_URL',
    'NODE_ENV',
  ],
}

/**
 * Validate environment variables
 * @returns { valid: boolean, missing: string[], errors: string[] }
 */
export function validateEnvironment(): {
  valid: boolean
  missing: string[]
  errors: string[]
} {
  const missing: string[] = []
  const errors: string[] = []

  // Check required variables
  for (const key of envConfig.required) {
    const value = process.env[key]
    if (!value || value.trim() === '') {
      missing.push(key)
    }
  }

  // Validate specific formats
  if (process.env.RESEND_FROM_EMAIL && !process.env.RESEND_FROM_EMAIL.includes('@')) {
    errors.push('RESEND_FROM_EMAIL must be a valid email address')
  }

  if (process.env.RESEND_TO_EMAIL && !process.env.RESEND_TO_EMAIL.includes('@')) {
    errors.push('RESEND_TO_EMAIL must be a valid email address')
  }

  if (process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.length < 8) {
    errors.push('ADMIN_PASSWORD must be at least 8 characters long')
  }

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('https://')) {
    errors.push('NEXT_PUBLIC_SUPABASE_URL must be a valid HTTPS URL')
  }

  return {
    valid: missing.length === 0 && errors.length === 0,
    missing,
    errors,
  }
}

/**
 * Validate environment on module load (for server-side)
 */
if (typeof window === 'undefined') {
  const validation = validateEnvironment()
  if (!validation.valid && process.env.NODE_ENV === 'production') {
    console.error('[Env Validation] Missing or invalid environment variables:')
    if (validation.missing.length > 0) {
      console.error('Missing:', validation.missing.join(', '))
    }
    if (validation.errors.length > 0) {
      console.error('Errors:', validation.errors.join(', '))
    }
    // Don't throw in development to allow easier testing
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Environment validation failed. Please check your .env.local file.')
    }
  }
}

