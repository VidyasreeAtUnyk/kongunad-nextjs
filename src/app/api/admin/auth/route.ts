import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminPassword } from '@/lib/admin-auth'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting for login attempts
    const clientId = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    
    // Stricter rate limit for login (5 attempts per 15 minutes)
    const rateLimit = checkRateLimit(
      `admin-login-${clientId}`,
      5,
      15 * 60 * 1000 // 15 minutes
    )

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Too many login attempts',
          message: 'Please try again later',
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rateLimit.resetTime - Date.now()) / 1000)),
          },
        }
      )
    }

    const body = await request.json()
    const { password } = body

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      )
    }

    // Limit password length to prevent DoS
    if (password.length > 1000) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 400 }
      )
    }

    const isValid = verifyAdminPassword(password)

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }

    // Set cookie for authentication
    const response = NextResponse.json({ success: true })
    response.cookies.set('admin-auth', password, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/', // Set to root so it's accessible from all routes
    })

    return response
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  const response = NextResponse.json({ success: true })
  response.cookies.delete('admin-auth')
  return response
}

