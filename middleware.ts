import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (pathname.startsWith('/api')) return NextResponse.next()
  if (pathname.startsWith('/auth')) return NextResponse.next()
  if (pathname === '/') return NextResponse.next()

  const token = req.cookies.get('auth-token')?.value
  if (!token) {
    const url = req.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }
  try {
    const secret = process.env.JWT_SECRET || 'your-secret-key-change-this'
    jwt.verify(token, secret)
    return NextResponse.next()
  } catch {
    const url = req.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

