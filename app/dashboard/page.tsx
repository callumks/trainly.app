import React from 'react'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { db } from '@/lib/supabase'
import TrainlyDashboard from '@/components/dashboard/TrainlyDashboard'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const token = cookies().get('auth-token')?.value
  if (!token) return null

  const secret = process.env.JWT_SECRET || 'your-secret-key-change-this'
  const decoded = jwt.verify(token, secret) as { userId: string; email: string }

  const res = await db.query('SELECT email, full_name FROM profiles WHERE id = $1', [decoded.userId])
  const profile = res.rows[0] || {}
  const email: string = profile.email || decoded.email || ''
  const fullName: string = profile.full_name || ''

  const name = fullName || (email ? email.split('@')[0] : 'there')
  const initials = (
    fullName
      ? fullName.split(/\s+/).map((s: string) => s[0]).slice(0, 2).join('')
      : (email || 'U').slice(0, 2)
  ).toUpperCase()

  return <TrainlyDashboard name={name} initials={initials} />
}
