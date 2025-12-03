import { NextResponse } from 'next/server'
import { getFacilities } from '@/lib/contentful'

export async function GET() {
  try {
    const facilities = await getFacilities()
    
    return NextResponse.json(facilities, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    })
  } catch (error) {
    console.error('Error fetching facilities:', error)
    return NextResponse.json(
      { error: 'Failed to fetch facilities' },
      { status: 500 }
    )
  }
}

