import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const USERNAME = 'globalsistema'
const PASSWORD = 'Fontan20251!'

export function verifyCredentials(username: string, password: string): boolean {
  return username === USERNAME && password === PASSWORD
}

export function getSession(request: NextRequest): string | null {
  return request.cookies.get('session')?.value || null
}

export function setSession(response: NextResponse, username: string) {
  response.cookies.set('session', username, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export function clearSession(response: NextResponse) {
  response.cookies.delete('session')
}

