import { NextRequest, NextResponse } from 'next/server'
import { diffPlan } from '@/lib/plan'
import { Plan } from '@/lib/types'

export async function POST(req: NextRequest) {
  try {
    const { prev, next } = await req.json()
    if (!prev || !next) return NextResponse.json({ error: 'prev and next required' }, { status: 400 })
    const diff = diffPlan(prev as Plan, next as Plan)
    return NextResponse.json({ diff })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Server error' }, { status: 500 })
  }
}

