import React from 'react'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { db } from '@/lib/supabase'
import { DashboardOverview } from '@/components/dashboard/dashboard-overview'
import { TrainingCalendar } from '@/components/training/training-calendar'
import { RecentActivities } from '@/components/strava/recent-activities'
import { GeneratorPanel } from '@/components/generator-panel'
import { PageHeader } from '@/components/ui/page-header'
import { ProgressRing } from '@/components/ui/progress-ring'
import { StravaConnectButton } from '@/components/strava/connect-button'

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
      <PageHeader
        title={`Welcome back${profile?.full_name ? `, ${profile.full_name}` : ''}!`}
        subtitle="Here’s what’s happening with your training."
        actions={(
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 shadow-soft">
              <ProgressRing value={42} />
              <div>
                <div className="text-xs text-muted-foreground">This week</div>
                <div className="text-sm font-medium">42% complete</div>
              </div>
            </div>
          </div>
        )}
      />

      <DashboardOverview userId={decoded.userId} />
      
      <GeneratorPanel onGenerate={() => { /* wire to /api/plan or chat */ }} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TrainingCalendar userId={decoded.userId} />
        <RecentActivities userId={decoded.userId} />
      </div>

      {!profile?.strava_id && (
        <div className="mt-4">
          <StravaConnectButton />
        </div>
      )}
    </div>
  )
} 