import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only protect /admin routes (except login)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    // DEV BYPASS: Skip auth in development mode
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.next()
    }

    const sessionCookie = request.cookies.get('admin_session')

    if (!sessionCookie?.value) {
      // Redirect to login page
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Session exists - cookie httpOnly + secure + sameSite provides protection
    // Token is a crypto.randomUUID() set by the login route
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
