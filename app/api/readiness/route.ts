import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { db } from '@/lib/supabase'

export async function GET() {
  try {
    const token = cookies().get('auth-token')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const secret = process.env.JWT_SECRET || 'your-secret-key-change-this'
    const { userId } = jwt.verify(token, secret) as { userId: string }

    const res = await db.query(
      `WITH a AS (
         SELECT COALESCE(SUM((metadata->'computed'->>'tss')::float), 0) a7,
                COALESCE(SUM(COALESCE(moving_time,0)), 0) a7_secs
         FROM strava_activities WHERE user_id=$1 AND start_date>=NOW()-interval '7 days'
       ), c AS (
         SELECT COALESCE(SUM((metadata->'computed'->>'tss')::float), 0)/4.0 c7,
                COALESCE(SUM(COALESCE(moving_time,0)), 0)/4.0 c7_secs
         FROM strava_activities WHERE user_id=$1 AND start_date>=NOW()-interval '28 days'
       ) SELECT a.a7, a.a7_secs, c.c7, c.c7_secs FROM a,c`,
      [userId]
    )
    const r = res.rows?.[0] || { a7: 0, c7: 0, a7_secs: 0, c7_secs: 0 }
    const acute = Number(r.a7) || 0
    const chronic = Number(r.c7) || 0
    const acuteSecs = Number(r.a7_secs) || 0
    const chronicSecs = Number(r.c7_secs) || 0
    const ratioBase = chronic > 0 ? acute / chronic : (chronicSecs > 0 ? acuteSecs / chronicSecs : 1)
    const ratio = Number(ratioBase.toFixed(2))
    const flag = ratio > 1.5 ? 'overload' : ratio < 0.6 ? 'underload' : 'balanced'
    const score = Math.max(0, Math.min(100, Math.round(100 - Math.abs(ratio - 1) * 60)))
    return NextResponse.json({ score, ratio, flag })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed' }, { status: 500 })
  }
}

