import { NextRequest, NextResponse } from 'next/server'
import { corsHeadersFor, getUserIdFromRequest } from '@/lib/auth'

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, { headers: corsHeadersFor(request) })
}

export async function POST(request: NextRequest) {
  const userId = getUserIdFromRequest(request)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeadersFor(request) })
  // Placeholder: pretend to create a calendar event for tomorrow's session
  return NextResponse.json({ success: true, created: [{ id: 'evt_demo_1', date: new Date(Date.now()+86400000).toISOString() }] }, { headers: corsHeadersFor(request) })
}


