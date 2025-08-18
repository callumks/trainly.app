import { NextRequest, NextResponse } from 'next/server'

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
  const state = new URL(request.url).searchParams.get('state')
  const origin = getRequestOrigin(request)
  const destination = state === 'signup' ? '/onboarding' : '/dashboard'
  return NextResponse.redirect(new URL(destination, origin))
}