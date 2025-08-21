import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { db } from '@/lib/supabase'
import { revalidateTag } from 'next/cache'

export async function POST(request: NextRequest) {
  try {
    const token = cookies().get('auth-token')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const secret = process.env.JWT_SECRET || 'your-secret-key-change-this'
    const { userId } = jwt.verify(token, secret) as { userId: string }

    const body = await request.json()
    const { sport, name, start_date, moving_time_s, distance_m = 0, work_kj = 0, notes = null } = body
    await db.query(
      `INSERT INTO strava_activities (user_id, type, name, start_date, moving_time, distance, suffer_score, metadata)
       VALUES ($1,$2,$3,$4,$5,$6,NULL, jsonb_build_object('source','manual','notes',$7))`,
      [userId, sport, name, start_date, moving_time_s, distance_m, notes]
    )
    revalidateTag('activities'); revalidateTag('overview')
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed' }, { status: 500 })
  }
}

