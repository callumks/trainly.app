import React from 'react'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { db } from '@/lib/supabase'
import { DashboardOverview } from '@/components/dashboard/dashboard-overview'
import { TrainingCalendar } from '@/components/training/training-calendar'
import { RecentActivities } from '@/components/strava/recent-activities'
import { AIPlanGenerator } from '@/components/training/ai-plan-generator'

export default async function DashboardPage() {
  const token = cookies().get('auth-token')?.value
  if (!token) return null

  const secret = process.env.JWT_SECRET || 'your-secret-key-change-this'
  const decoded = jwt.verify(token, secret) as { userId: string; email: string }

  // Get user profile
  const profileResult = await db.query('SELECT * FROM profiles WHERE id = $1', [decoded.userId])
  const profile = profileResult.rows[0]

  return (
    <div className="space-y-8 p-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Welcome back{profile?.full_name ? `, ${profile.full_name}` : ''}!
        </h2>
        <p className="text-muted-foreground">
          Here's what's happening with your training.
        </p>
      </div>

      <DashboardOverview userId={decoded.userId} />
      
      {/* AI Training Plan Generator */}
      <AIPlanGenerator />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TrainingCalendar userId={decoded.userId} />
        <RecentActivities userId={decoded.userId} />
      </div>
    </div>
  )
} 