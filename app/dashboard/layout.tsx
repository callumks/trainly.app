import React from 'react'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import Sidebar from '@/components/nav/Sidebar'

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
    <div className="min-h-dvh grid grid-cols-1 lg:grid-cols-[260px_1fr]">
      <Sidebar />
      <div className="min-h-dvh">{children}</div>
    </div>
  )
} 