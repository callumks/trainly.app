import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { readActivePlan, writePlan } from '@/lib/plan'
import { revalidateTag } from 'next/cache'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const token = cookies().get('auth-token')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const secret = process.env.JWT_SECRET || 'your-secret-key-change-this'
    const { userId } = jwt.verify(token, secret) as { userId: string }

    const { enabled } = await req.json()
    const plan = await readActivePlan(userId)
    if (!plan) return NextResponse.json({ error: 'no plan' }, { status: 404 })
    const next = { ...plan, weeks: plan.weeks.map(w => ({ ...w, nutrition: { ...(w.nutrition || {}), enabled: !!enabled } })), meta: { ...plan.meta, version: plan.meta.version + 1 } }
    await writePlan(userId, next)
    revalidateTag('plan'); revalidateTag('overview')
    return NextResponse.json({ ok: true, plan: next })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Server error' }, { status: 500 })
  }
}

