import React from 'react'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import TopNav from '@/components/nav/TopNav'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const token = cookies().get('auth-token')?.value
  if (!token) {
    redirect('/auth/login')
  }

  try {
    const secret = process.env.JWT_SECRET || 'your-secret-key-change-this'
    jwt.verify(token, secret)
  } catch {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-dvh">
      <TopNav />
      <div className="min-h-dvh">{children}</div>
    </div>
  )
} 