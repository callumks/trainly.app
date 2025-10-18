import React from 'react'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { db } from '@/lib/supabase'

export default async function HomePage() {
  const token = cookies().get('auth-token')?.value
  if (token) {
    try {
      const secret = process.env.JWT_SECRET || 'your-secret-key-change-this'
      const decoded = jwt.verify(token, secret) as { userId: string }
      const res = await db.query('SELECT goals, sports, experience_level FROM profiles WHERE id=$1', [decoded.userId])
      const profile = res.rows[0]
      if (!profile?.goals || !profile?.sports || !profile?.experience_level) {
        redirect('/onboarding')
      }
      redirect('/dashboard')
    } catch {}
  }
  redirect('/auth/login')
}