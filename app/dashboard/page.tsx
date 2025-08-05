import React from 'react'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { DashboardOverview } from '@/components/dashboard/dashboard-overview'
import { TrainingCalendar } from '@/components/training/training-calendar'
import { RecentActivities } from '@/components/strava/recent-activities'
import { AIPlanGenerator } from '@/components/training/ai-plan-generator'

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return null
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

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

      <DashboardOverview userId={session.user.id} />
      
      {/* AI Training Plan Generator */}
      <AIPlanGenerator />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TrainingCalendar userId={session.user.id} />
        <RecentActivities userId={session.user.id} />
      </div>
    </div>
  )
} 