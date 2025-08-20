import { NextRequest, NextResponse } from 'next/server'
import { readActivePlan, writePlan } from '@/lib/plan'
import { Plan } from '@/lib/types'

export async function POST(req: NextRequest) {
  try {
    const { userId, activity } = await req.json()
    if (!userId || !activity) return NextResponse.json({ error: 'userId and activity required' }, { status: 400 })
    const plan = await readActivePlan(userId)
    if (!plan) return NextResponse.json({ ok: true })

    // naive adaptation: mark matching date session as completed and bump version
    const next: Plan = {
      ...plan,
      weeks: plan.weeks.map(w => ({
        ...w,
        sessions: w.sessions.map(s => (s.date.startsWith(activity.date) ? { ...s, status: 'completed' } : s)),
      })),
      meta: { ...plan.meta, version: plan.meta.version + 1, sources: Array.from(new Set([...(plan.meta.sources || []), 'strava_sync'])) as any },
    }
    await writePlan(userId, next)
    return NextResponse.json({ ok: true, message: 'plan updated' })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Server error' }, { status: 500 })
  }
}

