import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { syncStravaActivitiesForUser, getLastSyncedAt } from '@/lib/strava'

export async function GET(request: NextRequest) {
  try {
    const token = cookies().get('auth-token')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const secret = process.env.JWT_SECRET || 'your-secret-key-change-this'
    const { userId } = jwt.verify(token, secret) as { userId: string }

    // ?ifStale=30 → no-op when the last sync is fresher than 30 minutes
    const ifStale = Number(new URL(request.url).searchParams.get('ifStale') || 0)
    if (ifStale > 0) {
      const last = await getLastSyncedAt(userId)
      if (last && Date.now() - new Date(last).getTime() < ifStale * 60_000) {
        return NextResponse.json({ success: true, skipped: true, lastSyncedAt: last })
      }
    }

    const result = await syncStravaActivitiesForUser(userId)
    return NextResponse.json({ success: true, skipped: false, lastSyncedAt: new Date().toISOString(), ...result })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Sync failed' }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
