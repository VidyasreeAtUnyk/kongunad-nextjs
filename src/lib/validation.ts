/**
 * Production-grade validation utilities
 */

// File upload constraints
export const FILE_CONSTRAINTS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10 MB
  ALLOWED_FILE_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'text/plain',
    'image/jpeg',
    'image/png',
  ],
  ALLOWED_EXTENSIONS: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.txt', '.jpg', '.jpeg', '.png'],
}

/**
 * Validate file size
 */
export function validateFileSize(fileSize: number): { valid: boolean; error?: string } {
  if (fileSize > FILE_CONSTRAINTS.MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds maximum allowed size of ${FILE_CONSTRAINTS.MAX_FILE_SIZE / (1024 * 1024)} MB`,
    }
  }
  return { valid: true }
}

/**
 * Validate file type
 */
export function validateFileType(fileType: string, fileName: string): { valid: boolean; error?: string } {
  // Check MIME type
  if (!FILE_CONSTRAINTS.ALLOWED_FILE_TYPES.includes(fileType)) {
    return {
      valid: false,
      error: `File type ${fileType} is not allowed`,
    }
  }

  // Check file extension as additional validation
  const extension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'))
  if (!FILE_CONSTRAINTS.ALLOWED_EXTENSIONS.includes(extension)) {
    return {
      valid: false,
      error: `File extension ${extension} is not allowed`,
    }
  }

  return { valid: true }
}

/**
 * Sanitize file name to prevent path traversal
 */
export function sanitizeFileName(fileName: string): string {
  // Remove path components
  const sanitized = fileName.replace(/[\/\\]/g, '_')
  // Remove dangerous characters
  return sanitized.replace(/[^a-zA-Z0-9._-]/g, '_')
}

/**
 * Validate and sanitize string input
 */
export function sanitizeString(input: string, maxLength: number = 1000): string {
  if (typeof input !== 'string') {
    return ''
  }
  // Remove null bytes and control characters
  let sanitized = input.replace(/[\x00-\x1F\x7F]/g, '')
  // Trim and limit length
  sanitized = sanitized.trim().substring(0, maxLength)
  return sanitized
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  if (typeof email !== 'string') return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim())
}

/**
 * Validate phone number (basic validation)
 */
export function validatePhone(phone: string): boolean {
  if (typeof phone !== 'string') return false
  // Remove common formatting characters
  const digits = phone.replace(/[\s\-\(\)\+]/g, '')
  // Check if it's all digits and reasonable length (7-15 digits)
  return /^\d{7,15}$/.test(digits)
}

/**
 * Validate form data structure
 */
export function validateFormData(data: Record<string, any>): { valid: boolean; error?: string } {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid form data structure' }
  }

  // Check for excessive nesting (prevent DoS)
  const depth = getObjectDepth(data)
  if (depth > 10) {
    return { valid: false, error: 'Form data structure too deeply nested' }
  }

  // Check for excessive size (prevent DoS)
  const size = JSON.stringify(data).length
  if (size > 1 * 1024 * 1024) { // 1 MB max
    return { valid: false, error: 'Form data too large' }
  }

  return { valid: true }
}

/**
 * Get object depth (recursive)
 */
function getObjectDepth(obj: any, currentDepth: number = 0): number {
  if (currentDepth > 10) return currentDepth // Safety limit
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    return currentDepth
  }
  let maxDepth = currentDepth
  for (const value of Object.values(obj)) {
    if (typeof value === 'object' && value !== null) {
      const depth = getObjectDepth(value, currentDepth + 1)
      maxDepth = Math.max(maxDepth, depth)
    }
  }
  return maxDepth
}

