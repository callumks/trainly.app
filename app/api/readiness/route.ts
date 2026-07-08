import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { buildCoachContext } from '@/lib/coach'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const token = cookies().get('auth-token')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const secret = process.env.JWT_SECRET || 'your-secret-key-change-this'
    const { userId } = jwt.verify(token, secret) as { userId: string }

    // Single source of truth: same context (EWMA CTL/ATL, TSB-blended readiness) as the coach.
    const c = await buildCoachContext(userId)
    return NextResponse.json({ score: c.readiness, tsb: c.tsb, flag: c.readinessFlag })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed' }, { status: 500 })
  }
}
