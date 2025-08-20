import React from 'react'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { db } from '@/lib/supabase'
import { PageHeader } from '@/components/ui/page-header'
import { ProgressRing } from '@/components/ui/progress-ring'
import { StravaConnectButton } from '@/components/strava/connect-button'
import { readActivePlan } from '@/lib/plan'
import { KpiCards } from '@/components/KpiCards'
import { PlanWeek } from '@/components/PlanWeek'
import { NutritionPanel } from '@/components/NutritionPanel'
import { CoachChatDock } from '@/components/CoachChat'

export default async function DashboardPage() {
  const token = cookies().get('auth-token')?.value
  if (!token) return null

  const secret = process.env.JWT_SECRET || 'your-secret-key-change-this'
  const decoded = jwt.verify(token, secret) as { userId: string; email: string }

  // Get user profile
  const profileResult = await db.query('SELECT * FROM profiles WHERE id = $1', [decoded.userId])
  const profile = profileResult.rows[0]
  const plan = await readActivePlan(decoded.userId)

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

      <KpiCards ftp={250} volumeMin={420} rpeTrend="flat" compliance={0.86} />
      {plan ? (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
          <div className="space-y-4">
            {plan.weeks.map((w: any)=> (
              <PlanWeek key={w.start} start={w.start} sessions={w.sessions} />
            ))}
          </div>
          <div>
            <NutritionPanel enabled={!!plan.weeks[0]?.nutrition?.enabled} onToggle={async (enabled)=>{}} />
          </div>
        </div>
      ) : (
        <div className="text-sm text-zinc-400">No plan yet. Generate one in the coach.</div>
      )}
      <CoachChatDock />

      {!profile?.strava_id && (
        <div className="mt-4">
          <StravaConnectButton />
        </div>
      )}
    </div>
  )
} 