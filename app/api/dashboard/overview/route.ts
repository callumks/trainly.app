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

    const activitiesRes = await db.query(
      `SELECT COUNT(*)::int AS c FROM strava_activities
       WHERE user_id = $1 AND start_date >= $2 AND start_date <= $3`,
      [userId, startOfWeek.toISOString(), endOfWeek.toISOString()]
    )
    const completedRes = await db.query(
      `SELECT COUNT(*)::int AS c FROM training_sessions
       WHERE user_id = $1 AND status = 'completed' AND date >= $2 AND date <= $3`,
      [userId, toISO(startOfWeek), toISO(endOfWeek)]
    )
    const plannedRes = await db.query(
      `SELECT COUNT(*)::int AS c FROM training_sessions
       WHERE user_id = $1 AND status IN ('planned','completed') AND date >= $2 AND date <= $3`,
      [userId, toISO(startOfWeek), toISO(endOfWeek)]
    )
    const nextWeek = new Date()
    nextWeek.setDate(now.getDate() + 7)
    const upcomingRes = await db.query(
      `SELECT COUNT(*)::int AS c FROM training_sessions
       WHERE user_id = $1 AND status = 'planned' AND date >= $2 AND date <= $3`,
      [userId, toISO(now), toISO(nextWeek)]
    )

    const weeklyActivities = activitiesRes.rows[0]?.c || 0
    const completedSessions = completedRes.rows[0]?.c || 0
    const plannedCount = plannedRes.rows[0]?.c || 0
    const upcomingSessions = upcomingRes.rows[0]?.c || 0
    const weeklyProgress = plannedCount ? Math.round((completedSessions / plannedCount) * 100) : 0

    return NextResponse.json({
      weeklyActivities,
      completedSessions,
      upcomingSessions,
      weeklyProgress,
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed' }, { status: 500 })
  }
}

