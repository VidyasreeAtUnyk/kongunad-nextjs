/**
 * Supabase Client for Server-Side Operations
 * Used in API routes and server components
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file.'
  )
}

// Use service role key for server-side operations (bypasses RLS)
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Type definitions
export interface FormSubmission {
  id: string
  form_type: 'appointment' | 'checkup' | 'research' | 'job'
  form_data: Record<string, any>
  status: 'pending' | 'reviewed' | 'contacted' | 'archived'
  created_at: string
  updated_at: string
  metadata?: Record<string, any>
}

export interface CreateSubmissionInput {
  form_type: 'appointment' | 'checkup' | 'research' | 'job'
  form_data: Record<string, any>
  metadata?: Record<string, any>
}

