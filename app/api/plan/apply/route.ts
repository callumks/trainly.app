import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { applyPlan, PlanSession } from '@/lib/plan-engine'
import { db } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const token = cookies().get('auth-token')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const secret = process.env.JWT_SECRET || 'your-secret-key-change-this'
    const { userId } = jwt.verify(token, secret) as { userId: string }

    const { sessions, messageId } = await req.json()
    if (!Array.isArray(sessions) || sessions.length === 0 || sessions.length > 21) {
      return NextResponse.json({ error: 'sessions array required (1-21)' }, { status: 400 })
    }
    for (const s of sessions) {
      if (!s?.date || !/^\d{4}-\d{2}-\d{2}$/.test(s.date) || !s.name || !s.session_type) {
        return NextResponse.json({ error: 'invalid session shape' }, { status: 400 })
      }
    }

    const result = await applyPlan(userId, sessions as PlanSession[])
    if (messageId) {
      await db.query(`UPDATE coach_messages SET plan_status='applied' WHERE id=$1 AND user_id=$2`, [messageId, userId])
    }
    return NextResponse.json({ success: true, ...result })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to apply plan' }, { status: 500 })
  }
}
