import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const state = url.searchParams.get('state')

  // Until full token exchange is implemented, use state to choose destination
  const destination = state === 'signup' ? '/onboarding' : '/dashboard'
  return NextResponse.redirect(new URL(destination, url.origin))
}