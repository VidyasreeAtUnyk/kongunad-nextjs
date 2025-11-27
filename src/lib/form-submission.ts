/**
 * Form Submission Utility
 * Centralized function to submit forms to the API
 */

export interface FormSubmissionResponse {
  success: boolean
  submissionId?: string
  message?: string
  error?: string
}

/**
 * Convert File to base64 string for upload
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      // Remove data URL prefix (e.g., "data:application/pdf;base64,")
      const base64 = result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Convert File objects to base64 for upload
 */
async function serializeFileData(data: Record<string, any>): Promise<Record<string, any>> {
  const serialized = { ...data }
  
  for (const [key, value] of Object.entries(serialized)) {
    if (value instanceof File) {
      // Validate file before processing
      const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB
      if (value.size > MAX_FILE_SIZE) {
        console.error(`File ${value.name} exceeds maximum size of ${MAX_FILE_SIZE / (1024 * 1024)} MB`)
        throw new Error(`File ${value.name} is too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)} MB`)
      }

      // Convert File to base64 for upload
      try {
        const base64 = await fileToBase64(value)
        serialized[key] = {
          fileName: value.name,
          fileSize: value.size,
          fileType: value.type,
          lastModified: value.lastModified,
          base64: base64, // Include base64 for server-side upload
          _isFile: true, // Flag to identify file metadata
        }
      } catch (error) {
        console.error(`Failed to convert file ${value.name} to base64:`, error)
        throw new Error(`Failed to process file ${value.name}`)
      }
    } else if (value && typeof value === 'object' && !Array.isArray(value) && value.constructor === Object) {
      // Recursively handle nested objects
      serialized[key] = await serializeFileData(value)
    }
  }
  
  return serialized
}

/**
 * Submit form data to the API
 */
export async function submitForm(
  formType: 'appointment' | 'checkup' | 'research' | 'job',
  data: Record<string, any>
): Promise<FormSubmissionResponse> {
  try {
    // Serialize File objects to base64 before sending
    const serializedData = await serializeFileData(data)
    
    const response = await fetch('/api/forms/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        formType,
        data: serializedData,
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Failed to submit form',
      }
    }

    return {
      success: true,
      submissionId: result.submissionId,
      message: result.message || 'Form submitted successfully',
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

