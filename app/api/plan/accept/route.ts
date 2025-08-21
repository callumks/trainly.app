import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { readActivePlan, writePlan, diffPlan } from '@/lib/plan'
import { revalidateTag } from 'next/cache'

export const runtime = 'nodejs'

// In this simplified model, "accept" just bumps version to seal current active state
export async function POST(request: NextRequest) {
  try {
    const token = cookies().get('auth-token')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const secret = process.env.JWT_SECRET || 'your-secret-key-change-this'
    const { userId } = jwt.verify(token, secret) as { userId: string }

    const plan = await readActivePlan(userId)
    if (!plan) return NextResponse.json({ error: 'no plan' }, { status: 404 })
    const next = { ...plan, meta: { ...plan.meta, version: plan.meta.version + 1 } }
    const diff = diffPlan(plan, next)
    await writePlan(userId, next)

    revalidateTag('plan')
    revalidateTag('overview')

    return NextResponse.json({ ok: true, diff, plan: next })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed' }, { status: 500 })
  }
}

