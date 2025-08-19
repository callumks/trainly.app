import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { db } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const token = cookies().get('auth-token')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const secret = process.env.JWT_SECRET || 'your-secret-key-change-this'
    const { userId } = jwt.verify(token, secret) as { userId: string }

    const { sessionId, newDate } = await request.json()
    if (!sessionId || !newDate) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    // Move only own session
    const res = await db.query('UPDATE training_sessions SET date = $1, updated_at = NOW() WHERE id = $2 AND user_id = $3 RETURNING id', [newDate, sessionId, userId])
    if (res.rowCount === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    // TODO: adapt() next 7 days

    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'move failed' }, { status: 500 })
  }
}

