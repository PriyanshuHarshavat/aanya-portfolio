import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only protect /admin routes (except login)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const sessionCookie = request.cookies.get('admin_session')

    if (!sessionCookie?.value) {
      // Redirect to login page
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Verify session is valid (basic check - token exists and was created recently)
    try {
      const decoded = Buffer.from(sessionCookie.value, 'base64').toString()
      const [prefix, timestamp] = decoded.split(':')

      if (prefix !== 'admin') {
        throw new Error('Invalid session')
      }

      // Check if session is expired (24 hours)
      const sessionAge = Date.now() - parseInt(timestamp)
      const maxAge = 24 * 60 * 60 * 1000 // 24 hours in ms

      if (sessionAge > maxAge) {
        // Session expired, redirect to login
        const response = NextResponse.redirect(new URL('/admin/login', request.url))
        response.cookies.delete('admin_session')
        return response
      }
    } catch {
      // Invalid session, redirect to login
      const response = NextResponse.redirect(new URL('/admin/login', request.url))
      response.cookies.delete('admin_session')
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
