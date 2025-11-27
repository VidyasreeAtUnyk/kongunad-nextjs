import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getAdminPasswordFromCookie, verifyAdminPassword } from '@/lib/admin-auth'

export const runtime = 'nodejs'

/**
 * GET /api/files/download
 * Generate a signed URL for file download (admin only)
 * Query params: path (file path in storage)
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication (admin only)
    const password = getAdminPasswordFromCookie(request)
    if (!password || !verifyAdminPassword(password)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const filePath = searchParams.get('path')

    if (!filePath) {
      return NextResponse.json(
        { error: 'Missing file path' },
        { status: 400 }
      )
    }

    // Validate file path is within form-attachments bucket (prevent path traversal)
    if (!filePath.startsWith('form-submissions/')) {
      return NextResponse.json(
        { error: 'Invalid file path' },
        { status: 400 }
      )
    }

    // Additional path traversal protection
    if (filePath.includes('..') || filePath.includes('//') || filePath.includes('\\')) {
      return NextResponse.json(
        { error: 'Invalid file path' },
        { status: 400 }
      )
    }

    // Validate path format (should be: form-submissions/{submissionId}/{timestamp}-{filename})
    const pathParts = filePath.split('/')
    if (pathParts.length < 3) {
      return NextResponse.json(
        { error: 'Invalid file path format' },
        { status: 400 }
      )
    }

    // Generate signed URL (valid for 1 hour)
    const { data, error } = await supabase.storage
      .from('form-attachments')
      .createSignedUrl(filePath, 3600) // 1 hour expiry

    if (error) {
      console.error('Error generating signed URL:', error)
      return NextResponse.json(
        { error: 'Failed to generate download URL', details: error.message },
        { status: 500 }
      )
    }

    if (!data?.signedUrl) {
      return NextResponse.json(
        { error: 'Failed to generate download URL' },
        { status: 500 }
      )
    }

    // Return signed URL
    return NextResponse.json({
      url: data.signedUrl,
      expiresIn: 3600, // seconds
    })
  } catch (error) {
    console.error('Error in file download route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

