import { NextRequest, NextResponse } from 'next/server'
import { getClient } from '@/lib/contentful'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')

    // Validate and sanitize query
    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 }
      )
    }

    // Sanitize: trim, limit length, remove dangerous characters
    const sanitizedQuery = query.trim().slice(0, 100).replace(/[<>]/g, '')
    
    if (sanitizedQuery.length < 2) {
      return NextResponse.json(
        { results: [] },
        { status: 200 }
      )
    }

    const client = getClient()

    // Search across all content types in parallel
    // Using Contentful's full-text search with query parameter
    // Limiting results and fields fetched for better performance
    const [doctorsResult, facilitiesResult, packagesResult] = await Promise.all([
      client.getEntries({
        content_type: 'doctor',
        query: sanitizedQuery,
        limit: 5,
      }).catch((err) => {
        console.error('Doctor search error:', err)
        return { items: [] }
      }),
      
      client.getEntries({
        content_type: 'facility',
        query: sanitizedQuery,
        limit: 5,
      }).catch((err) => {
        console.error('Facility search error:', err)
        return { items: [] }
      }),
      
      client.getEntries({
        content_type: 'healthPackage',
        query: sanitizedQuery,
        limit: 5,
      }).catch((err) => {
        console.error('Package search error:', err)
        return { items: [] }
      }),
    ])

    // Transform results to unified format
    const results = [
      ...doctorsResult.items.map((item: any) => ({
        id: item.sys.id,
        type: 'doctor' as const,
        title: item.fields.doctorName || 'Unknown Doctor',
        subtitle: item.fields.speciality || item.fields.department,
        action: 'modal' as const, // Open in modal instead of separate page
        url: null, // No URL navigation needed for modals
      })),
      
      ...facilitiesResult.items.map((item: any) => {
        // Generate slug from name (matching the facility page logic)
        const slug = item.fields.name
          ? item.fields.name.toLowerCase().replace(/\s+/g, '-')
          : item.sys.id
        return {
          id: item.sys.id,
          type: 'facility' as const,
          title: item.fields.name || 'Unknown Facility',
          subtitle: item.fields.category,
          action: 'navigate' as const, // Navigate to facility page
          url: `/facilities/${slug}`,
        }
      }),
      
      ...packagesResult.items.map((item: any) => ({
        id: item.sys.id,
        type: 'package' as const,
        title: item.fields.title || 'Unknown Package',
        subtitle: item.fields.category,
        action: 'modal' as const, // Open in modal instead of separate page
        url: null, // No URL navigation needed for modals
      })),
    ]

    return NextResponse.json(
      { results, query: sanitizedQuery },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    )
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', results: [] },
      { status: 500 }
    )
  }
}
