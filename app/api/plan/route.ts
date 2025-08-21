import { NextRequest, NextResponse } from "next/server";
import { Plan } from "@/lib/types";
import { readActivePlan, writePlan } from "@/lib/plan";
import { revalidateTag } from 'next/cache'

export const runtime = 'nodejs'

// Minimal plan CRUD
export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id') || '00000000-0000-0000-0000-000000000001'
    const plan = await readActivePlan(userId)
    return NextResponse.json({ plan })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id') || '00000000-0000-0000-0000-000000000001'
    const body = await req.json()
    const plan = body?.plan as Plan
    if (!plan) return NextResponse.json({ error: 'plan is required' }, { status: 400 })
    await writePlan(userId, plan)
    revalidateTag('plan')
    revalidateTag('overview')
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id') || '00000000-0000-0000-0000-000000000001'
    const body = await req.json()
    const plan = body?.plan as Plan
    if (!plan) return NextResponse.json({ error: 'plan is required' }, { status: 400 })
    await writePlan(userId, plan)
    revalidateTag('plan')
    revalidateTag('overview')
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Server error' }, { status: 500 })
  }
}

