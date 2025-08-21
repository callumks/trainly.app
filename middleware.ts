import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

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
  // Avoid JWT verification in Edge middleware; verification happens in server routes/pages
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

