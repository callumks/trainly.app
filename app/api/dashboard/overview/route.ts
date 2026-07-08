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
    const toISO = (d: Date) => d.toISOString().slice(0, 10)

    // Weekly load (TSS computed during sync, in metadata.computed.tss), kJ (Strava kilojoules),
    // and moving time. All read from columns/JSON that actually exist.
    const volRes = await db.query(
      `WITH w AS (
         SELECT COALESCE(SUM(COALESCE((metadata->'computed'->>'tss')::float, 0)), 0) AS tss,
                COALESCE(SUM(COALESCE(NULLIF(metadata->>'kilojoules','')::float, 0)), 0) AS kj,
                COALESCE(SUM(COALESCE(moving_time, 0)), 0) AS secs
         FROM strava_activities WHERE user_id=$1 AND start_date >= NOW() - interval '7 days'
       ), p AS (
         SELECT COALESCE(SUM(COALESCE((metadata->'computed'->>'tss')::float, 0)), 0) AS tss_prev
         FROM strava_activities WHERE user_id=$1 AND start_date >= NOW() - interval '14 days' AND start_date < NOW() - interval '7 days'
       ) SELECT w.tss, w.kj, w.secs, p.tss_prev FROM w, p`,
      [userId]
    )
    const row = volRes.rows?.[0] || {}
    const secs = Number(row.secs || 0)
    const weeklyTSS = Math.round(Number(row.tss || 0))
    const weeklyWorkKJ = Math.round(Number(row.kj || 0))
    const tssPrev = Number(row.tss_prev || 0)
    const trendPct = tssPrev > 0 ? Math.round(((weeklyTSS - tssPrev) / tssPrev) * 100) : 0

    const compRes = await db.query(
      `SELECT CASE WHEN COUNT(*)=0 THEN 100 ELSE ROUND(100.0 * SUM(CASE WHEN status='completed' THEN 1 ELSE 0 END)/COUNT(*),0) END::int AS compliance
       FROM training_sessions WHERE user_id=$1 AND date>= $2 AND date<= $3`,
      [userId, toISO(startOfWeek), toISO(endOfWeek)]
    )
    const compliance = compRes.rows?.[0]?.compliance ?? 100

    const profRes = await db.query('SELECT metadata FROM profiles WHERE id=$1', [userId])
    const pmeta = profRes.rows?.[0]?.metadata || {}

    return NextResponse.json({
      ftp: pmeta.ftp ?? null,
      ftpEstimated: !!pmeta.ftp_estimated,
      powerCurve: pmeta.powerCurve ?? null,
      lastSyncedAt: pmeta.last_synced_at ?? null,
      weeklyTSS,
      weeklyWorkKJ,
      weeklyHours: Math.round((secs / 3600) * 10) / 10,
      trendPct,
      compliance,
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed' }, { status: 500 })
  }
}
