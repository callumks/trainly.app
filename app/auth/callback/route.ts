import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
// TODO: Implement Strava OAuth callback handling for Railway + custom auth

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  // For now just redirect to login until Strava OAuth is re-implemented
  return NextResponse.redirect(new URL('/auth/login', requestUrl.origin))
} 