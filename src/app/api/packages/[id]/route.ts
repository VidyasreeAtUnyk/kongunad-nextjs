import { NextRequest, NextResponse } from 'next/server'
import { getClient } from '@/lib/contentful'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    if (!id) {
      return NextResponse.json(
        { error: 'Package ID is required' },
        { status: 400 }
      )
    }

    const client = getClient()
    const entry = await client.getEntry(id)
    
    return NextResponse.json(entry, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    })
  } catch (error) {
    console.error('Error fetching package:', error)
    return NextResponse.json(
      { error: 'Package not found' },
      { status: 404 }
    )
  }
}

