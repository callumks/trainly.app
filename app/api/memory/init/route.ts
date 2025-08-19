import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { buildAthleteDossier, buildRollingDigest, buildCoachPacket } from '@/lib/memory'

export const dynamic = 'force-dynamic'

function getWeekStartISO(): string {
  const d = new Date()
  const wd = d.getDay()
  const diff = wd === 0 ? 6 : wd - 1 // Monday start
  d.setDate(d.getDate() - diff)
  return d.toISOString().slice(0, 10)
}

export async function POST(request: NextRequest) {
  try {
    const token = cookies().get('auth-token')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const secret = process.env.JWT_SECRET || 'your-secret-key-change-this'
    const { userId } = jwt.verify(token, secret) as { userId: string }

    const [dossier, digest] = await Promise.all([
      buildAthleteDossier(userId),
      buildRollingDigest(userId),
    ])

    const weekStart = getWeekStartISO()
    const packet = await buildCoachPacket(userId, weekStart)
    const size = Buffer.from(JSON.stringify(packet)).length

    return NextResponse.json({
      ok: true,
      dossier,
      digest,
      packetBytes: size,
      weekStart,
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'init failed' }, { status: 500 })
  }
}

