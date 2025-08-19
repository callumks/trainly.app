import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { db } from '@/lib/supabase'
import { syncStravaActivitiesForUser } from '@/lib/strava'
import { computeIfTss } from '@/lib/metrics'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const token = cookies().get('auth-token')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const secret = process.env.JWT_SECRET || 'your-secret-key-change-this'
    const { userId } = jwt.verify(token, secret) as { userId: string }

    // Pull from Strava (or env fallback)
    const result = await syncStravaActivitiesForUser(userId)

    // Compute IF/TSS for recent activities that lack computed metrics
    const rows = await db.query('SELECT id, moving_time, average_heartrate, average_speed, average_power, metadata FROM strava_activities WHERE user_id = $1 ORDER BY start_date DESC LIMIT 200', [userId])
    for (const r of rows.rows) {
      const meta = r.metadata || {}
      if (meta.computed?.tss) continue
      const metrics = computeIfTss({
        movingSec: r.moving_time || 0,
        avgPower: r.average_power || null,
        ftpW: null,
      })
      const merged = { ...meta, computed: metrics }
      await db.query('UPDATE strava_activities SET metadata = $1 WHERE id = $2', [merged, r.id])
    }

    return NextResponse.json({ success: true, ...result })
  } catch (e: any) {
    console.error('sync error', e)
    return NextResponse.json({ error: e?.message || 'sync failed' }, { status: 500 })
  }
}

