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
    const { id } = await request.json()
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
    await db.query(`UPDATE training_sessions SET status='completed' WHERE id=$1 AND user_id=$2`, [id, userId])
    revalidateTag('overview'); [-1,0,1].forEach(o=>revalidateTag(`plan:${o}`))
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed' }, { status: 500 })
  }
}

