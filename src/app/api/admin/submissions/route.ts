import { NextRequest, NextResponse } from 'next/server'
import { supabase, FormSubmission } from '@/lib/supabase'
import { getAdminPasswordFromCookie, verifyAdminPassword } from '@/lib/admin-auth'

/**
 * Middleware to check admin authentication
 */
function checkAuth(request: NextRequest): boolean {
  const password = getAdminPasswordFromCookie(request)
  if (!password) {
    return false
  }
  return verifyAdminPassword(password)
}

/**
 * GET /api/admin/submissions
 * Fetch all form submissions with optional filters
 */
export async function GET(request: NextRequest) {
  // Check authentication
  if (!checkAuth(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const { searchParams } = new URL(request.url)
    const formType = searchParams.get('formType')
    const status = searchParams.get('status')
    // Reduce default limit for better performance
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100) // Max 100 per request
    const offset = parseInt(searchParams.get('offset') || '0')
    const search = searchParams.get('search')?.trim()

    // Build query - optimize by selecting only needed columns
    let query = supabase
      .from('form_submissions')
      .select('id, form_type, form_data, status, created_at, updated_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters (order matters for index usage)
    if (formType) {
      query = query.eq('form_type', formType)
    }
    if (status) {
      query = query.eq('status', status)
    }

    // Apply search (search in form_data JSONB)
    // Use GIN index efficiently by searching specific fields
    if (search) {
      // Sanitize search query to prevent injection (Supabase client handles this, but be extra safe)
      const sanitizedSearch = search.substring(0, 100) // Limit search length
      // Search in common fields (name, email, phone) - using ilike for case-insensitive search
      // Note: Supabase client properly escapes these queries
      query = query.or(
        `form_data->>firstName.ilike.%${sanitizedSearch}%,form_data->>lastName.ilike.%${sanitizedSearch}%,form_data->>email.ilike.%${sanitizedSearch}%,form_data->>phone.ilike.%${sanitizedSearch}%`
      )
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch submissions', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      submissions: data || [],
      total: count || 0,
      limit,
      offset,
    })
  } catch (error) {
    console.error('Error fetching submissions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/admin/submissions/[id]
 * Update submission status
 */
export async function PATCH(request: NextRequest) {
  // Check authentication
  if (!checkAuth(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Missing id or status' },
        { status: 400 }
      )
    }

    const validStatuses = ['pending', 'reviewed', 'contacted', 'archived']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('form_submissions')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to update submission', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, submission: data })
  } catch (error) {
    console.error('Error updating submission:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

