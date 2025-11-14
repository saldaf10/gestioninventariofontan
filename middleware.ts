import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSession } from './lib/auth'

export function middleware(request: NextRequest) {
  const session = getSession(request)
  const isLoginPage = request.nextUrl.pathname === '/login'

  // If not logged in and trying to access protected route
  if (!session && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If logged in and trying to access login page
  if (session && isLoginPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|uploads).*)'],
}

