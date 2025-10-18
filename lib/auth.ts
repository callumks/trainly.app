import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

export function getUserIdFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization') || ''
  const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
  const cookieToken = request.cookies.get('auth-token')?.value || null
  const token = bearerToken || cookieToken
  if (!token) return null
  try {
    const secret = process.env.JWT_SECRET || 'your-secret-key-change-this'
    const decoded = jwt.verify(token, secret) as { userId?: string }
    return decoded.userId || null
  } catch {
    return null
  }
}

export function corsHeadersFor(request: NextRequest): Record<string, string> {
  const origin = request.headers.get('origin') || '*'
  return {
    'Access-Control-Allow-Origin': origin,
    'Vary': 'Origin',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }
}


