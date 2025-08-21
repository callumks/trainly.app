import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { db } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const token = cookies().get('auth-token')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const secret = process.env.JWT_SECRET || 'your-secret-key-change-this'
    const { userId } = jwt.verify(token, secret) as { userId: string }

    const now = new Date()
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)

    const toISO = (d: Date) => d.toISOString().slice(0,10)

    const ftpRes = await db.query(`SELECT NULLIF((metadata->>'ftp')::int,0) AS ftp FROM profiles WHERE id=$1`, [userId])
    const ftp = ftpRes.rows?.[0]?.ftp ?? null

    const volRes = await db.query(
      `WITH w AS (
         SELECT SUM(COALESCE(metadata->'computed'->>'tss', '0')::float) as tss,
                SUM(COALESCE(work_kj,0)) as work_kj,
                SUM(COALESCE(moving_time,0)) as secs
         FROM strava_activities WHERE user_id=$1 AND start_date>=NOW()-interval '7 days'
       ), p AS (
         SELECT SUM(COALESCE(work_kj,0)) as work_kj_prev
         FROM strava_activities WHERE user_id=$1 AND start_date>=NOW()-interval '14 days' AND start_date<NOW()-interval '7 days'
       ) SELECT w.tss, w.work_kj, w.secs, p.work_kj_prev FROM w, p`,
      [userId]
    )
    const secs = Number(volRes.rows?.[0]?.secs || 0)
    const work_kj = Number(volRes.rows?.[0]?.work_kj || 0)
    const work_kj_prev = Number(volRes.rows?.[0]?.work_kj_prev || 0)
    const trendPct = work_kj_prev > 0 ? Math.round(((work_kj - work_kj_prev) / work_kj_prev) * 100) : 0

    const compRes = await db.query(
      `SELECT CASE WHEN COUNT(*)=0 THEN 100 ELSE ROUND(100.0 * SUM(CASE WHEN status='completed' THEN 1 ELSE 0 END)/COUNT(*),0) END::int AS compliance
       FROM training_sessions WHERE user_id=$1 AND date>= $2 AND date<= $3`,
      [userId, toISO(startOfWeek), toISO(endOfWeek)]
    )
    const compliance = compRes.rows?.[0]?.compliance ?? 100

    return NextResponse.json({
      ftp: ftp,
      weeklyWorkKJ: work_kj,
      weeklyHours: Math.round((secs/3600)*10)/10,
      trendPct,
      compliance,
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed' }, { status: 500 })
  }
}

