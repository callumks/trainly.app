import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { db } from '@/lib/supabase'
import { exchangeAuthCodeForTokens } from '@/lib/strava'

function getRequestOrigin(request: NextRequest): string {
  const headers = request.headers
  const configured = process.env.NEXT_PUBLIC_APP_URL
  if (configured && /^https?:\/\//i.test(configured)) return configured.replace(/\/$/, '')
  if (configured && !/^https?:\/\//i.test(configured)) return `https://${configured}`
  const host = headers.get('x-forwarded-host') || headers.get('host') || 'localhost:3000'
  const proto = headers.get('x-forwarded-proto') || 'http'
  return `${proto}://${host}`
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const state = url.searchParams.get('state')
  const code = url.searchParams.get('code')
  const error = url.searchParams.get('error')
  const origin = getRequestOrigin(request)

  // If Strava returned an error, send the user to login with a message
  if (error) {
    return NextResponse.redirect(new URL(`/auth/login?error=${encodeURIComponent(error)}`, origin))
  }

  // Require a signed-in user for linking
  const token = request.cookies.get('auth-token')?.value
  if (!token) {
    return NextResponse.redirect(new URL('/auth/login?error=signin_required', origin))
  }

  let userId: string
  try {
    const secret = process.env.JWT_SECRET || 'your-secret-key-change-this'
    const decoded = jwt.verify(token, secret) as { userId: string }
    userId = decoded.userId
  } catch {
    return NextResponse.redirect(new URL('/auth/login?error=invalid_session', origin))
  }

  // If we have a code, exchange and persist tokens
  if (code) {
    try {
      const redirectUri = `${origin.replace(/\/$/, '')}/auth/callback`
      const tokens = await exchangeAuthCodeForTokens({ code, redirectUri })

      const stravaId = tokens.athlete?.id ? String(tokens.athlete.id) : null

      await db.query(
        'UPDATE profiles SET strava_id = $1, strava_access_token = $2, strava_refresh_token = $3 WHERE id = $4',
        [stravaId, tokens.access_token, tokens.refresh_token, userId]
      )

      const dest = state === 'signup' ? '/onboarding' : '/dashboard'
      return NextResponse.redirect(new URL(`${dest}?strava=linked`, origin))
    } catch (e) {
      return NextResponse.redirect(new URL('/dashboard?strava=link_failed', origin))
    }
  }

  // Fallback redirect
  const destination = state === 'signup' ? '/onboarding' : '/dashboard'
  return NextResponse.redirect(new URL(destination, origin))
}