import React from 'react'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { db } from '@/lib/supabase'
import AppShell from '@/components/app/AppShell'
import PageHeader from '@/components/app/PageHeader'
import StravaConnect from '@/components/strava/StravaConnect'
import ProfileDetails from '@/components/profile/ProfileDetails'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const token = cookies().get('auth-token')?.value
  if (!token) return null
  const secret = process.env.JWT_SECRET || 'your-secret-key-change-this'
  const { userId } = jwt.verify(token, secret) as { userId: string }

  const result = await db.query(
    'SELECT email, full_name, experience_level, weekly_volume, sports, metadata FROM profiles WHERE id = $1',
    [userId]
  )
  const p = result.rows[0] || {}
  const initial = {
    email: p.email || '',
    full_name: p.full_name || null,
    experience_level: p.experience_level || null,
    weekly_volume: p.weekly_volume ?? null,
    sports: Array.isArray(p.sports) ? p.sports : null,
    ftp: p.metadata?.ftp ?? null,
    ftpEstimated: !!p.metadata?.ftp_estimated,
  }

  return (
    <AppShell>
      <PageHeader eyebrow="Account" title="Profile" sub="Your athlete profile — this is what shapes your plan." />
      <div className="grid-2">
        <div className="card">
          <ProfileDetails initial={initial} />
        </div>
        <div className="card">
          <div className="chead"><div className="t"><h3 className="ct">Connections</h3></div></div>
          <StravaConnect />
        </div>
      </div>
    </AppShell>
  )
}
