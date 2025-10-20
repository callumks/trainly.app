import { NextRequest, NextResponse } from 'next/server'
import { corsHeadersFor, getUserIdFromRequest } from '@/lib/auth'

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, { headers: corsHeadersFor(request) })
}

export async function POST(request: NextRequest) {
  const userId = getUserIdFromRequest(request)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeadersFor(request) })
  // Placeholder: accept a token or just mark connected in memory (no-op for MVP)
  return NextResponse.json({ success: true, connected: true }, { headers: corsHeadersFor(request) })
}


