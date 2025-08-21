import React from 'react'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { db } from '@/lib/supabase'
import { OnboardingLanding } from '@/components/coach/OnboardingLanding'
import { AiThinking } from '@/components/AiThinking'

export default async function OnboardingPage() {
  const token = cookies().get('auth-token')?.value
  if (!token) redirect('/auth/login')

  const secret = process.env.JWT_SECRET || 'your-secret-key-change-this'
  const decoded = jwt.verify(token, secret) as { userId: string; email: string }

  // Check if user already completed onboarding
  const result = await db.query(
    'SELECT goals, sports, experience_level FROM profiles WHERE id = $1',
    [decoded.userId]
  )
  const profile = result.rows[0]

  // If profile is complete, redirect to dashboard
  if (profile?.goals && profile?.sports && profile?.experience_level) {
    redirect('/dashboard')
  }

  return (
    <div className="px-4 py-10">
      <OnboardingLanding onSubmit={() => {}} />
    </div>
  )
} 