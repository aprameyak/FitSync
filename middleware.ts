import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    // If the user is not authenticated and trying to access protected routes
    if (!req.nextauth.token) {
      return NextResponse.redirect(new URL('/sign-in', req.url))
    }
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - sign-in (sign-in page)
     * - sign-up (sign-up page)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|sign-in|sign-up).*)'
  ]
}
