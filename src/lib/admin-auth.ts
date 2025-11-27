/**
 * Simple Admin Authentication
 * Uses environment variable for password protection
 * For production, consider using NextAuth.js or similar
 */

export function verifyAdminPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) {
    // If no password is set, deny access in production
    if (process.env.NODE_ENV === 'production') {
      console.error('[Admin Auth] ADMIN_PASSWORD not set in production!')
      return false
    }
    // In development, allow (for easier testing)
    return true
  }

  // Use constant-time comparison to prevent timing attacks
  if (password.length !== adminPassword.length) {
    return false
  }

  let result = 0
  for (let i = 0; i < password.length; i++) {
    result |= password.charCodeAt(i) ^ adminPassword.charCodeAt(i)
  }
  return result === 0
}

export function isAdminAuthenticated(request: Request): boolean {
  const authHeader = request.headers.get('authorization')
  if (!authHeader) {
    return false
  }

  // Basic auth: "Basic base64(username:password)"
  const base64Credentials = authHeader.split(' ')[1]
  if (!base64Credentials) {
    return false
  }

  try {
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8')
    const [username, password] = credentials.split(':')
    
    // For simplicity, we only check password
    // Username can be anything or 'admin'
    return verifyAdminPassword(password)
  } catch {
    return false
  }
}

/**
 * Get admin password from cookie (for form-based auth)
 */
export function getAdminPasswordFromCookie(request: Request): string | null {
  const cookieHeader = request.headers.get('cookie')
  if (!cookieHeader) {
    return null
  }

  const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=')
    acc[key] = value
    return acc
  }, {} as Record<string, string>)

  return cookies['admin-auth'] || null
}

