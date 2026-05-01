import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Middleware is minimal here - admin auth is handled client-side via API
  // This just ensures the admin page is served correctly
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
