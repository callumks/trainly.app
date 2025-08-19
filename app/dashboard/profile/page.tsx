import React from 'react'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { db } from '@/lib/supabase'

export default async function ProfilePage() {
  const token = cookies().get('auth-token')?.value
  if (!token) return null
  const secret = process.env.JWT_SECRET || 'your-secret-key-change-this'
  const { userId } = jwt.verify(token, secret) as { userId: string }

  const result = await db.query('SELECT email, full_name FROM profiles WHERE id = $1', [userId])
  const profile = result.rows[0]

  return (
    <div className="p-8 space-y-2">
      <h2 className="text-2xl font-bold">Profile</h2>
      <div>Email: {profile?.email}</div>
      <div>Name: {profile?.full_name ?? '—'}</div>
    </div>
  )
}

