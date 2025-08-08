import React from 'react'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { DashboardNavigation } from '@/components/dashboard/dashboard-navigation'

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
    <div className="min-h-screen bg-background">
      <DashboardNavigation />
      <main className="lg:pl-72">
        <div className="xl:pl-96">
          {children}
        </div>
      </main>
    </div>
  )
} 