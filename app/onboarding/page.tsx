import React from 'react'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import Link from 'next/link'
import { db } from '@/lib/supabase'
import { OnboardingLanding } from '@/components/coach/OnboardingLanding'
import '@/components/app/app.css'

export default async function OnboardingPage() {
  const token = cookies().get('auth-token')?.value
  if (!token) redirect('/auth/login')

  const secret = process.env.JWT_SECRET || 'your-secret-key-change-this'
  const decoded = jwt.verify(token, secret) as { userId: string; email: string }

  const result = await db.query(
    'SELECT goals, sports, experience_level FROM profiles WHERE id = $1',
    [decoded.userId]
  )
  const profile = result.rows[0]
  if (profile?.goals && profile?.sports && profile?.experience_level) {
    redirect('/dashboard')
  }

  return (
    <div className="tr-app">
      <div className="topbar">
        <Link href="/dashboard" className="brand"><span className="dot" />Trainly</Link>
        <div className="spacer" />
        <span className="meta">Step 1 — set up your training</span>
      </div>
      <div className="wrap" style={{ paddingTop: 32 }}>
        <OnboardingLanding />
      </div>
    </div>
  )
}
