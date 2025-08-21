import React from 'react'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { db } from '@/lib/supabase'
import { StravaConnectButton } from '@/components/strava/connect-button'
import { readActivePlan } from '@/lib/plan'
import { KpiCards } from '@/components/KpiCards'
import { PlanWeek } from '@/components/PlanWeek'
import { CoachChatDock } from '@/components/CoachChat'
import { ActivitySyncBanner } from '@/components/ActivitySyncBanner'
import { Sparkles } from 'lucide-react'
import { UserRail } from '@/components/dashboard/UserRail'
import { RightRail } from '@/components/dashboard/RightRail'
import { BottomNav } from '@/components/nav/BottomNav'

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
    <div className="min-h-[100svh] bg-gradient-to-b from-neutral-950 via-neutral-950 to-neutral-900">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <header className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1 text-xs text-zinc-400">
            <Sparkles className="h-3.5 w-3.5 text-zinc-300" />
            Dashboard
          </div>
          <h1 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight text-zinc-100">Your hybrid plan</h1>
          <p className="mt-2 text-zinc-400">This week’s plan, live metrics, and coach updates.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left rail */}
          <div className="hidden lg:block lg:col-span-3">
            <UserRail profile={profile} />
          </div>

          {/* Center column */}
          <div className="lg:col-span-6 space-y-6">
            <KpiCards ftp={250} volumeMin={420} rpeTrend="flat" compliance={0.86} />
            {plan ? (
              <div className="space-y-4">
                {plan.weeks.map((w: any)=> (
                  <PlanWeek key={w.start} start={w.start} sessions={w.sessions} />
                ))}
              </div>
            ) : (
              <div className="text-sm text-zinc-400">No plan yet. Generate one in the coach.</div>
            )}
          </div>

          {/* Right rail */}
          <div className="lg:col-span-3">
            <RightRail plan={plan} />
          </div>
        </div>

        <CoachChatDock />
        <BottomNav />
      </div>
    </div>
  )
} 