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

    const res = await db.query(
      'SELECT id, email, full_name, strava_id, (strava_access_token IS NOT NULL) AS has_access_token, (strava_refresh_token IS NOT NULL) AS has_refresh_token FROM profiles WHERE id = $1',
      [userId]
    )
    if (res.rows.length === 0) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    return NextResponse.json({ profile: res.rows[0] })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = cookies().get('auth-token')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const secret = process.env.JWT_SECRET || 'your-secret-key-change-this'
    const { userId } = jwt.verify(token, secret) as { userId: string }

    const body = await request.formData()
    const full_name = String(body.get('full_name') || '')
    const avatar_url = String(body.get('avatar_url') || '')
    await db.query('update profiles set full_name=$1, avatar_url=$2 where id=$3',[full_name || null, avatar_url || null, userId])
    return NextResponse.redirect(new URL('/profile', request.url))
  } catch (e:any) {
    return NextResponse.json({ error: e?.message || 'Failed' }, { status: 500 })
  }
}

