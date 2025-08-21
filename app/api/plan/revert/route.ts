import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { readPlanByVersion, readActivePlan, writePlan } from '@/lib/plan'
import { revalidateTag } from 'next/cache'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const token = cookies().get('auth-token')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const secret = process.env.JWT_SECRET || 'your-secret-key-change-this'
    const { userId } = jwt.verify(token, secret) as { userId: string }

    const { version } = await request.json()
    if (typeof version !== 'number') return NextResponse.json({ error: 'version is required' }, { status: 400 })

    const target = await readPlanByVersion(userId, version)
    if (!target) return NextResponse.json({ error: 'version not found' }, { status: 404 })

    // Bump version to maintain monotonic versioning when reverting
    const current = await readActivePlan(userId)
    const nextVersion = Math.max(current?.meta.version || 0, target.meta.version) + 1
    const reverted = { ...target, meta: { ...target.meta, version: nextVersion } }
    await writePlan(userId, reverted as any)

    revalidateTag('plan')
    revalidateTag('overview')

    return NextResponse.json({ ok: true, plan: reverted })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed' }, { status: 500 })
  }
}

