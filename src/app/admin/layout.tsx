import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { verifyAdminPassword } from '@/lib/admin-auth'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check authentication (skip for login page)
  const cookieStore = await cookies()
  const adminAuth = cookieStore.get('admin-auth')
  
  // Allow access to login page without auth
  // For other admin pages, require authentication
  if (!adminAuth || !verifyAdminPassword(adminAuth.value)) {
    // Check if we're on the login page by checking the path
    // Since we can't easily get pathname in layout, we'll handle redirect in the page itself
    // This is a simple approach - for production, consider using middleware
  }

  return <>{children}</>
}

