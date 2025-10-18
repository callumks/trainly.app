import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { corsHeadersFor, getUserIdFromRequest } from '@/lib/auth'
import { db } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const token = cookies().get('auth-token')?.value
    const userId = token ? (jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-this') as { userId: string }).userId : (getUserIdFromRequest(request) || null)
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeadersFor(request) })

    const res = await db.query(
      'SELECT id, email, full_name, strava_id, (strava_access_token IS NOT NULL) AS has_access_token, (strava_refresh_token IS NOT NULL) AS has_refresh_token, goals, sports, experience_level, weekly_volume FROM profiles WHERE id = $1',
      [userId]
    )
    if (res.rows.length === 0) return NextResponse.json({ error: 'Profile not found' }, { status: 404, headers: corsHeadersFor(request) })
    return NextResponse.json({ profile: res.rows[0] }, { headers: corsHeadersFor(request) })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed' }, { status: 500, headers: corsHeadersFor(request) })
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
    const avatar_file = body.get('avatar_file') as File | null
    let avatar_bytes: Buffer | null = null
    let avatar_mime: string | null = null
    if (avatar_file && typeof avatar_file.arrayBuffer === 'function') {
      const ab = await avatar_file.arrayBuffer()
      avatar_bytes = Buffer.from(ab)
      avatar_mime = avatar_file.type || 'application/octet-stream'
    }
    await db.query(
      'update profiles set full_name=$1, avatar_url=$2, avatar_bytes=COALESCE($3, avatar_bytes), avatar_mime=COALESCE($4, avatar_mime) where id=$5',
      [full_name || null, avatar_url || null, avatar_bytes, avatar_mime, userId]
    )
    return NextResponse.redirect(new URL('/profile', request.url))
  } catch (e:any) {
    return NextResponse.json({ error: e?.message || 'Failed' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request)
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeadersFor(request) })

    const body = await request.json()
    const full_name = body?.full_name ?? null
    const avatar_url = body?.avatar_url ?? null
    const goals = Array.isArray(body?.goals) ? body.goals : null
    const sports = Array.isArray(body?.sports) ? body.sports : null
    const experience_level = typeof body?.experience_level === 'string' ? body.experience_level : null
    const weekly_volume = Number.isFinite(body?.weekly_volume) ? Number(body.weekly_volume) : null

    await db.query(
      'update profiles set full_name=COALESCE($1, full_name), avatar_url=COALESCE($2, avatar_url), goals=COALESCE($3, goals), sports=COALESCE($4, sports), experience_level=COALESCE($5, experience_level), weekly_volume=COALESCE($6, weekly_volume) where id=$7',
      [full_name, avatar_url, goals, sports, experience_level, weekly_volume, userId]
    )
    return NextResponse.json({ success: true }, { headers: corsHeadersFor(request) })
  } catch (e:any) {
    return NextResponse.json({ error: e?.message || 'Failed' }, { status: 500, headers: corsHeadersFor(request) })
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, { headers: corsHeadersFor(request) })
}

