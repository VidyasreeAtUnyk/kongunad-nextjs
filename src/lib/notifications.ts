/**
 * Notification Service
 * Handles email and WhatsApp notifications for form submissions
 */

import { Resend } from 'resend'

const resendApiKey = process.env.RESEND_API_KEY

// Initialize Resend client
const resend = resendApiKey ? new Resend(resendApiKey) : null

// Email configuration
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL
const TO_EMAIL = process.env.RESEND_TO_EMAIL

export interface NotificationOptions {
  formType: 'appointment' | 'checkup' | 'research' | 'job'
  formData: Record<string, any>
  submissionId: string
  siteUrl?: string // Optional site URL for generating dashboard links
}

/**
 * Send email notification for form submission
 */
export async function sendEmailNotification(options: NotificationOptions): Promise<boolean> {
  if (!resend) {
    return false
  }

  if (!FROM_EMAIL || !TO_EMAIL) {
    return false
  }

  try {
    const { formType, formData, submissionId, siteUrl } = options
    
    let subject: string
    let htmlContent: string
    let textContent: string
    
    try {
      subject = getEmailSubject(formType)
      htmlContent = generateEmailHTML(formType, formData, submissionId, siteUrl)
      textContent = generateEmailText(formType, formData, submissionId)
    } catch (genError) {
      console.error('[Email] Error generating email content:', genError)
      throw genError
    }
    
    const result = await resend.emails.send({
      from: FROM_EMAIL as string,
      to: TO_EMAIL as string,
      subject,
      html: htmlContent,
      text: textContent,
    })

    return true
  } catch (error) {
    console.error('[Email] Failed to send email notification:', error)
    if (error instanceof Error) {
      console.error('[Email] Error details:', {
        message: error.message,
        stack: error.stack,
      })
    }
    // Log Resend API errors if available
    if (error && typeof error === 'object' && 'message' in error) {
      console.error('[Email] Resend API error:', error)
    }
    return false
  }
}

/**
 * Get email subject based on form type
 */
function getEmailSubject(formType: string): string {
  const subjects = {
    appointment: 'New Appointment Request - Kongunad Hospital',
    checkup: 'New Health Checkup Booking - Kongunad Hospital',
    research: 'New Research Program Application - Kongunad Hospital',
    job: 'New Job Application - Kongunad Hospital',
  }
  return subjects[formType as keyof typeof subjects] || 'New Form Submission'
}

/**
 * Generate HTML email content
 */
function generateEmailHTML(
  formType: string,
  formData: Record<string, any>,
  submissionId: string,
  siteUrl?: string
): string {
  const formTypeLabels = {
    appointment: 'Appointment Request',
    checkup: 'Health Checkup Booking',
    research: 'Research Program Application',
    job: 'Job Application',
  }

  const label = formTypeLabels[formType as keyof typeof formTypeLabels] || 'Form Submission'

  // Format form data as HTML table (exclude security code - it's only for verification)
  const formDataRows = Object.entries(formData)
    .filter(([key]) => key !== 'securityCode') // Exclude security code from email
    .map(([key, value]) => {
      const label = formatFieldLabel(key)
      const displayValue = formatFieldValueHTML(value, submissionId, siteUrl) // Pass submissionId and siteUrl for dashboard links
      return `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: 600; color: #333;">
            ${label}:
          </td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">
            ${displayValue}
          </td>
        </tr>
      `
    })
    .join('')

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">${label}</h1>
        </div>
        <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px;">
          <p style="margin-top: 0;">A new ${label.toLowerCase()} has been submitted:</p>
          <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 4px; overflow: hidden;">
            ${formDataRows}
          </table>
          ${Object.entries(formData).some(([_, value]) => 
            typeof value === 'object' && value && value._isFile
          ) ? `
          <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border-radius: 4px; border-left: 4px solid #ffc107;">
            <p style="margin: 0; font-size: 14px; color: #856404;">
              <strong>Note:</strong> Files attached to this submission can be viewed and downloaded from the admin dashboard.
            </p>
          </div>
          ` : ''}
          <div style="margin-top: 20px; padding: 15px; background: #e3f2fd; border-radius: 4px; border-left: 4px solid #1976d2;">
            <p style="margin: 0; font-size: 12px; color: #666;">
              <strong>Submission ID:</strong> ${submissionId}<br>
              <strong>Submitted:</strong> ${new Date().toLocaleString()}
            </p>
          </div>
        </div>
      </body>
    </html>
  `
}

/**
 * Generate plain text email content
 */
function generateEmailText(
  formType: string,
  formData: Record<string, any>,
  submissionId: string
): string {
  const formTypeLabels = {
    appointment: 'Appointment Request',
    checkup: 'Health Checkup Booking',
    research: 'Research Program Application',
    job: 'Job Application',
  }

  const label = formTypeLabels[formType as keyof typeof formTypeLabels] || 'Form Submission'

  const formDataText = Object.entries(formData)
    .filter(([key]) => key !== 'securityCode') // Exclude security code from email
    .map(([key, value]) => {
      const label = formatFieldLabel(key)
      const displayValue = formatFieldValue(value)
      return `${label}: ${displayValue}`
    })
    .join('\n')

  return `
${label}

A new ${label.toLowerCase()} has been submitted:

${formDataText}

Submission ID: ${submissionId}
Submitted: ${new Date().toLocaleString()}
  `.trim()
}

/**
 * Format field label for display
 */
function formatFieldLabel(key: string): string {
  // Convert camelCase to Title Case
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim()
}

/**
 * Format field value for display
 */
function formatFieldValue(value: any): string {
  if (value === null || value === undefined) {
    return 'N/A'
  }
  
  // Handle file metadata (from serialized File objects)
  if (typeof value === 'object' && value._isFile) {
    const sizeKB = (value.fileSize / 1024).toFixed(2)
    const sizeMB = (value.fileSize / (1024 * 1024)).toFixed(2)
    const size = value.fileSize > 1024 * 1024 ? `${sizeMB} MB` : `${sizeKB} KB`
    return `📎 ${value.fileName} (${size}, ${value.fileType || 'Unknown type'})`
  }
  
  if (typeof value === 'object') {
    // Check if it's a file-like object without the _isFile flag (backward compatibility)
    if (value.fileName || value.name) {
      const fileName = value.fileName || value.name
      const fileSize = value.fileSize || value.size || 0
      const sizeKB = (fileSize / 1024).toFixed(2)
      const sizeMB = (fileSize / (1024 * 1024)).toFixed(2)
      const size = fileSize > 1024 * 1024 ? `${sizeMB} MB` : `${sizeKB} KB`
      return `📎 ${fileName} (${size})`
    }
    return JSON.stringify(value, null, 2)
  }
  
  if (value instanceof File) {
    return `📎 ${value.name} (${(value.size / 1024).toFixed(2)} KB)`
  }
  
  return String(value)
}

/**
 * Format field value for HTML email (with download links)
 * Note: For production, files require admin authentication to download
 * Email shows file info with link to admin dashboard
 */
function formatFieldValueHTML(value: any, submissionId?: string, siteUrl?: string): string {
  if (value === null || value === undefined) {
    return 'N/A'
  }
  
  // Handle file metadata
  if (typeof value === 'object' && value._isFile) {
    const sizeKB = (value.fileSize / 1024).toFixed(2)
    const sizeMB = (value.fileSize / (1024 * 1024)).toFixed(2)
    const size = value.fileSize > 1024 * 1024 ? `${sizeMB} MB` : `${sizeKB} KB`
    
    // For production: Link to admin dashboard instead of direct download
    // Files require authentication to access
    if (submissionId) {
      // Use provided siteUrl or fallback to environment variables
      const baseUrl = siteUrl || process.env.NEXT_PUBLIC_SITE_URL || 
        (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
      const dashboardUrl = `${baseUrl}/admin?submission=${submissionId}`
      
      // Create a more visible link with button-like styling
      return `
        <div style="margin: 8px 0;">
          <strong>📎 ${value.fileName}</strong> (${size}, ${value.fileType || 'Unknown type'})<br>
          <a href="${dashboardUrl}" 
             style="display: inline-block; margin-top: 8px; padding: 10px 20px; background-color: #1976d2; color: white !important; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 14px;">
            View & Download in Dashboard
          </a>
        </div>
      `
    }
    
    return `📎 ${value.fileName} (${size}, ${value.fileType || 'Unknown type'})`
  }
  
  if (typeof value === 'object') {
    if (value.fileName || value.name) {
      const fileName = value.fileName || value.name
      const fileSize = value.fileSize || value.size || 0
      const sizeKB = (fileSize / 1024).toFixed(2)
      const sizeMB = (fileSize / (1024 * 1024)).toFixed(2)
      const size = fileSize > 1024 * 1024 ? `${sizeMB} MB` : `${sizeKB} KB`
      return `📎 ${fileName} (${size})`
    }
    return JSON.stringify(value, null, 2)
  }
  
  return String(value)
}

/**
 * Send WhatsApp notification (optional - requires Twilio setup)
 * TODO: Implement when Twilio is configured
 */
export async function sendWhatsAppNotification(
  options: NotificationOptions
): Promise<boolean> {
  // Placeholder for WhatsApp integration
  // Requires Twilio WhatsApp API setup
  // TODO: Implement when Twilio is configured
  return false
}

