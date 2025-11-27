import { NextRequest, NextResponse } from 'next/server'
import { supabase, CreateSubmissionInput } from '@/lib/supabase'
import { sendEmailNotification } from '@/lib/notifications'
import { checkRateLimit, getClientIdentifier } from '@/lib/rate-limit'
import {
  validateFileSize,
  validateFileType,
  sanitizeFileName,
  validateFormData,
  sanitizeString,
} from '@/lib/validation'
import '@/lib/env-validation' // Validate environment on import

export const runtime = 'nodejs'

/**
 * Upload file to Supabase Storage
 */
async function uploadFileToStorage(
  fileName: string,
  fileType: string,
  base64Data: string,
  fileSize: number,
  submissionId: string
): Promise<string | null> {
  try {
    // Validate file size
    const sizeValidation = validateFileSize(fileSize)
    if (!sizeValidation.valid) {
      console.error(`[File Upload] File size validation failed: ${sizeValidation.error}`)
      return null
    }

    // Validate file type
    const typeValidation = validateFileType(fileType, fileName)
    if (!typeValidation.valid) {
      console.error(`[File Upload] File type validation failed: ${typeValidation.error}`)
      return null
    }

    // Convert base64 to buffer
    const buffer = Buffer.from(base64Data, 'base64')
    
    // Validate buffer size matches expected size
    if (buffer.length !== fileSize) {
      console.error(`[File Upload] Buffer size mismatch: expected ${fileSize}, got ${buffer.length}`)
      return null
    }
    
    // Sanitize file name to prevent path traversal
    const sanitizedFileName = sanitizeFileName(fileName)
    
    // Create unique file path: form-submissions/{submissionId}/{timestamp}-{fileName}
    const timestamp = Date.now()
    const filePath = `form-submissions/${submissionId}/${timestamp}-${sanitizedFileName}`
    
    // Upload to Supabase Storage (private bucket)
    const { data, error } = await supabase.storage
      .from('form-attachments')
      .upload(filePath, buffer, {
        contentType: fileType,
        upsert: false, // Don't overwrite existing files
      })
    
    if (error) {
      console.error('Error uploading file to storage:', error)
      return null
    }
    
    // Return the file path (not public URL - we'll use signed URLs)
    return filePath
  } catch (error) {
    console.error('Error in uploadFileToStorage:', error)
    return null
  }
}

/**
 * Process file uploads and replace base64 with storage URLs
 */
async function processFileUploads(
  data: Record<string, any>,
  submissionId: string
): Promise<Record<string, any>> {
  const processed = { ...data }
  
  for (const [key, value] of Object.entries(processed)) {
    if (value && typeof value === 'object' && value._isFile && value.base64) {
      // Validate file before upload
      if (!value.fileSize || value.fileSize <= 0) {
        console.error(`[File Upload] Invalid file size for ${value.fileName}`)
        const { base64, ...metadata } = value
        processed[key] = metadata
        continue
      }

      // Upload file to storage
      const fileUrl = await uploadFileToStorage(
        value.fileName,
        value.fileType,
        value.base64,
        value.fileSize,
        submissionId
      )
      
      if (fileUrl) {
        // Replace with file path and metadata (not public URL - use signed URLs)
        processed[key] = {
          fileName: value.fileName,
          fileSize: value.fileSize,
          fileType: value.fileType,
          filePath: fileUrl, // Store the file path (not public URL)
          _isFile: true,
        }
      } else {
        // Keep metadata even if upload fails
        const { base64, ...metadata } = value
        processed[key] = metadata
      }
    } else if (value && typeof value === 'object' && !Array.isArray(value) && value.constructor === Object) {
      // Recursively process nested objects
      processed[key] = await processFileUploads(value, submissionId)
    }
  }
  
  return processed
}

/**
 * Sanitize form data strings
 */
function sanitizeFormData(data: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {}
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      // Sanitize string values (max 1000 chars for most fields, 5000 for textarea)
      const maxLength = key.toLowerCase().includes('query') || key.toLowerCase().includes('condition') ? 5000 : 1000
      sanitized[key] = sanitizeString(value, maxLength)
    } else if (value instanceof File) {
      // Keep File objects as-is (will be processed separately)
      sanitized[key] = value
    } else if (value && typeof value === 'object' && !Array.isArray(value) && value.constructor === Object) {
      // Recursively sanitize nested objects
      sanitized[key] = sanitizeFormData(value)
    } else if (Array.isArray(value)) {
      // Sanitize array elements
      sanitized[key] = value.map((item) => {
        if (typeof item === 'string') {
          return sanitizeString(item, 500)
        }
        return item
      })
    } else {
      // Keep other types as-is (numbers, booleans, etc.)
      sanitized[key] = value
    }
  }
  
  return sanitized
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientId = getClientIdentifier(request)
    const rateLimit = checkRateLimit(clientId, 10, 60000) // 10 requests per minute
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Too many requests',
          message: 'Please try again later',
          retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rateLimit.resetTime - Date.now()) / 1000)),
            'X-RateLimit-Limit': '10',
            'X-RateLimit-Remaining': String(rateLimit.remaining),
            'X-RateLimit-Reset': String(rateLimit.resetTime),
          },
        }
      )
    }

    // Check request size (basic check - Next.js has built-in limits)
    const contentType = request.headers.get('content-type')
    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        { error: 'Invalid content type. Expected application/json' },
        { status: 400 }
      )
    }

    // Parse and validate request body
    let body: any
    try {
      body = await request.json()
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    const { formType, data } = body

    // Validate request
    if (!formType || !data) {
      return NextResponse.json(
        { error: 'Missing formType or data' },
        { status: 400 }
      )
    }

    // Validate form type
    const validFormTypes = ['appointment', 'checkup', 'research', 'job']
    if (!validFormTypes.includes(formType)) {
      return NextResponse.json(
        { error: 'Invalid form type' },
        { status: 400 }
      )
    }

    // Validate form data structure
    const formDataValidation = validateFormData(data)
    if (!formDataValidation.valid) {
      return NextResponse.json(
        { error: formDataValidation.error || 'Invalid form data' },
        { status: 400 }
      )
    }

    // Remove security code from data before storing (it's only for verification)
    // Create a clean copy without the security code
    const { securityCode, ...cleanData } = data

    // Sanitize string fields in form data (basic sanitization)
    const sanitizedData = sanitizeFormData(cleanData)
    
    // Generate a temporary submission ID for file uploads
    const tempSubmissionId = `temp-${Date.now()}-${Math.random().toString(36).substring(7)}`
    
    // Process file uploads first (before creating submission record)
    const processedData = await processFileUploads(sanitizedData, tempSubmissionId)

    // Extract metadata (IP, user agent, etc.)
    const metadata = {
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      timestamp: new Date().toISOString(),
    }

    // Create submission input (without security code, with processed file URLs)
    const submissionInput: CreateSubmissionInput = {
      form_type: formType,
      form_data: processedData, // Store data with file URLs
      metadata,
    }

    // Insert into database
    const { data: submission, error: dbError } = await supabase
      .from('form_submissions')
      .insert([submissionInput])
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: 'Failed to save submission', details: dbError.message },
        { status: 500 }
      )
    }

    if (!submission) {
      return NextResponse.json(
        { error: 'Failed to create submission' },
        { status: 500 }
      )
    }

    // Get site URL from request headers for email links
    const protocol = request.headers.get('x-forwarded-proto') || 'https'
    const host = request.headers.get('host') || request.headers.get('x-forwarded-host') || 'localhost:3000'
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://${host}`
    
    // Send email notification (non-blocking) - with file URLs
    sendEmailNotification({
      formType,
      formData: processedData, // Send processed data with file URLs
      submissionId: submission.id,
      siteUrl, // Pass site URL for proper link generation
    })
      .catch((error) => {
        console.error('[Form Submit] Error sending email notification:', error)
        // Don't fail the request if email fails
      })

    // Return success response
    return NextResponse.json(
      {
        success: true,
        submissionId: submission.id,
        message: 'Form submitted successfully',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Form submission error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// Rate limiting can be added here if needed
// Consider using a library like @upstash/ratelimit for production

