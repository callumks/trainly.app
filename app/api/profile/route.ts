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

const EXPERIENCE = new Set(['beginner', 'intermediate', 'advanced'])
const SPORTS = new Set(['cycling', 'climbing', 'running', 'strength', 'swimming', 'triathlon', 'crossfit'])

export async function PUT(request: NextRequest) {
  try {
    const token = cookies().get('auth-token')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const secret = process.env.JWT_SECRET || 'your-secret-key-change-this'
    const { userId } = jwt.verify(token, secret) as { userId: string }

    const body = await request.json()

    // typed columns
    const sets: string[] = []
    const vals: any[] = []
    const push = (frag: string, v: any) => { vals.push(v); sets.push(`${frag}$${vals.length}`) }

    if ('full_name' in body) push('full_name=', String(body.full_name || '').slice(0, 80) || null)
    if ('experience_level' in body) {
      if (body.experience_level !== null && !EXPERIENCE.has(body.experience_level)) return NextResponse.json({ error: 'invalid experience_level' }, { status: 400 })
      push('experience_level=', body.experience_level)
    }
    if ('weekly_volume' in body) {
      const v = body.weekly_volume === null ? null : Math.round(Number(body.weekly_volume))
      if (v !== null && (!Number.isFinite(v) || v < 0 || v > 60)) return NextResponse.json({ error: 'invalid weekly_volume' }, { status: 400 })
      push('weekly_volume=', v)
    }
    if ('sports' in body) {
      const arr = Array.isArray(body.sports) ? body.sports.filter((s: any) => SPORTS.has(s)) : []
      push('sports=', arr.length ? arr : null)
    }
    if (sets.length) {
      vals.push(userId)
      await db.query(`UPDATE profiles SET ${sets.join(', ')} WHERE id=$${vals.length}`, vals)
    }

    // FTP lives in metadata; a manual value is authoritative (ftp_estimated=false)
    if ('ftp' in body) {
      const ftp = body.ftp === null ? null : Math.round(Number(body.ftp))
      if (ftp !== null && (!Number.isFinite(ftp) || ftp < 50 || ftp > 600)) return NextResponse.json({ error: 'invalid ftp (50-600)' }, { status: 400 })
      await db.query(
        `UPDATE profiles SET metadata = COALESCE(metadata,'{}'::jsonb) || $2::jsonb WHERE id=$1`,
        [userId, JSON.stringify(ftp === null ? { ftp: null, ftp_estimated: null } : { ftp, ftp_estimated: false, ftp_source: 'manual' })]
      )
      // re-key power-based TSS to the new FTP so load numbers stay coherent
      if (ftp) {
        await db.query(
          `UPDATE strava_activities SET metadata = jsonb_set(metadata, '{computed,tss}',
             to_jsonb( round( (moving_time * power((metadata->>'weighted_average_watts')::float / $2, 2)) / 3600.0 * 100 )::int ), true)
           WHERE user_id=$1 AND metadata->>'weighted_average_watts' IS NOT NULL AND COALESCE(moving_time,0) > 0`,
          [userId, ftp]
        )
      }
    }

    const res = await db.query('SELECT email, full_name, experience_level, weekly_volume, sports, metadata FROM profiles WHERE id=$1', [userId])
    const p = res.rows[0] || {}
    return NextResponse.json({
      success: true,
      profile: {
        email: p.email, full_name: p.full_name, experience_level: p.experience_level,
        weekly_volume: p.weekly_volume, sports: p.sports,
        ftp: p.metadata?.ftp ?? null, ftpEstimated: !!p.metadata?.ftp_estimated,
      },
    })
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

