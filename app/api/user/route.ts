import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id') || '00000000-0000-0000-0000-000000000001'
    const res = await db.query('select id, email, onboarded, preferences from users where id=$1', [userId])
    const user = res.rows?.[0] || null
    return NextResponse.json({ user })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id') || '00000000-0000-0000-0000-000000000001'
    const { onboarded, preferences } = await req.json()
    await db.query('update users set onboarded=coalesce($2,onboarded), preferences=coalesce($3,preferences), updated_at=now() where id=$1', [userId, onboarded, preferences])
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Server error' }, { status: 500 })
  }
}

