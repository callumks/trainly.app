import React from 'react'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

export default async function HomePage() {
  const token = cookies().get('auth-token')?.value
  if (token) {
    try {
      const secret = process.env.JWT_SECRET || 'your-secret-key-change-this'
      const decoded = jwt.verify(token, secret) as { userId: string }
      // TODO: read onboarding flag; for now send to coach
      redirect('/coach')
    } catch {}
  }
  redirect('/auth/login')
}