import { NextRequest, NextResponse } from 'next/server'
import { readActivePlan, writePlan } from '@/lib/plan'

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id') || '00000000-0000-0000-0000-000000000001'
    const { enabled } = await req.json()
    const plan = await readActivePlan(userId)
    if (!plan) return NextResponse.json({ error: 'no plan' }, { status: 404 })
    const next = { ...plan, weeks: plan.weeks.map(w => ({ ...w, nutrition: { ...(w.nutrition || {}), enabled } })), meta: { ...plan.meta, version: plan.meta.version + 1 } }
    await writePlan(userId, next)
    return NextResponse.json({ ok: true, plan: next })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Server error' }, { status: 500 })
  }
}

