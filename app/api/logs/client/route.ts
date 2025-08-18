import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.error('[CLIENT_ERROR]', body)
  } catch (e) {
    console.error('[CLIENT_ERROR_PARSE]', e)
  }
  return NextResponse.json({ ok: true })
}

