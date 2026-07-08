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

    const limit = Math.min(100, Math.max(1, Number(new URL(request.url).searchParams.get('limit')) || 10))
    const res = await db.query(
      `SELECT id, strava_id, name, type, distance, moving_time, total_elevation_gain, start_date,
              average_speed, average_heartrate, suffer_score,
              (metadata->'computed'->>'tss')::int AS tss,
              (metadata->>'average_watts')::float AS average_watts
       FROM strava_activities WHERE user_id = $1 ORDER BY start_date DESC LIMIT $2`,
      [userId, limit]
    )
    return NextResponse.json({ activities: res.rows })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed' }, { status: 500 })
  }
}

