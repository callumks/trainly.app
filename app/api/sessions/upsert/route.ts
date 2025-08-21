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
    const { session_id, date, sport, name, description, duration_minutes } = await request.json()
    if (session_id) {
      await db.query(
        `UPDATE training_sessions SET date=$1, session_type=$2, name=$3, description=$4, duration_minutes=$5 WHERE id=$6 AND user_id=$7`,
        [date, sport, name, description, duration_minutes, session_id, userId]
      )
    } else {
      await db.query(
        `INSERT INTO training_sessions (user_id, plan_id, date, session_type, name, description, duration_minutes)
         VALUES ($1, (SELECT id FROM training_plans WHERE user_id=$1 AND is_active=true ORDER BY updated_at DESC LIMIT 1), $2, $3, $4, $5, $6)`,
        [userId, date, sport, name, description, duration_minutes]
      )
    }
    [-1,0,1].forEach(o=>revalidateTag(`plan:${o}`))
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed' }, { status: 500 })
  }
}

