import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/supabase'
import { getUserIdFromRequest, corsHeadersFor } from '@/lib/auth'

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, { headers: corsHeadersFor(request) })
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeadersFor(request) })
    }

    const body = await request.json()
    const goals = Array.isArray(body?.goals) ? body.goals : null
    const sports = Array.isArray(body?.sports) ? body.sports : null
    const experience_level = typeof body?.experience_level === 'string' ? body.experience_level : null
    const weekly_volume = Number.isFinite(body?.weekly_volume) ? Number(body.weekly_volume) : null

    await db.query(
      'UPDATE profiles SET goals = COALESCE($1, goals), sports = COALESCE($2, sports), experience_level = COALESCE($3, experience_level), weekly_volume = COALESCE($4, weekly_volume) WHERE id = $5',
      [goals, sports, experience_level, weekly_volume, userId]
    )

    return NextResponse.json({ success: true }, { headers: corsHeadersFor(request) })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed' }, { status: 500, headers: corsHeadersFor(request) })
  }
}

export const dynamic = 'force-dynamic'


