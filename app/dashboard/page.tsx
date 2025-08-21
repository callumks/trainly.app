import React from 'react'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { db } from '@/lib/supabase'
import { StravaConnectButton } from '@/components/strava/connect-button'
import { readActivePlan } from '@/lib/plan'
import { KpiCards } from '@/components/KpiCards'
import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import { PlanWeek } from '@/components/PlanWeek'
import { CoachChatDock } from '@/components/CoachChat'
import { ActivitySyncBanner } from '@/components/ActivitySyncBanner'
import { Sparkles } from 'lucide-react'
import { UserRail } from '@/components/dashboard/UserRail'
import { RightRail } from '@/components/dashboard/RightRail'
import { BottomNav } from '@/components/nav/BottomNav'
import { DashboardToolbar } from '@/components/dashboard/DashboardToolbar'
import Link from 'next/link'
import { NextUp } from '@/components/dashboard/NextUp'

export default async function DashboardPage({ searchParams }: { searchParams?: { weekOffset?: string } }) {
  const token = cookies().get('auth-token')?.value
  if (!token) return null

  const secret = process.env.JWT_SECRET || 'your-secret-key-change-this'
  const decoded = jwt.verify(token, secret) as { userId: string; email: string }

  // Get user profile
  const profileResult = await db.query('SELECT * FROM profiles WHERE id = $1', [decoded.userId])
  const profile = profileResult.rows[0]
  const weekOffset = Number(searchParams?.weekOffset || '0')
  const getPlan = unstable_cache(async (uid: string, offset: number) => readActivePlan(uid), ['plan', String(weekOffset)], { tags: ['plan', `plan:${weekOffset}`] })
  const plan = await getPlan(decoded.userId, weekOffset)

  return (
    <div className="min-h-[100svh] bg-gradient-to-b from-neutral-950 via-neutral-950 to-neutral-900">
      <div className="mx-auto max-w-[1220px] px-4 pb-20 pt-6">
        {/* Header texts removed per design feedback */}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left rail */}
          <div className="hidden lg:block lg:col-span-3 sticky top-16 self-start">
            <UserRail profile={profile} />
          </div>

          {/* Center column */}
          <div className="lg:col-span-6 space-y-6">
            <DashboardToolbar />
            <KpiCards />
            {/* Next up block */}
            <NextUp />
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
          <div className="lg:col-span-3 sticky top-16 self-start">
            <RightRail plan={plan} />
          </div>
        </div>

        <CoachChatDock />
        <BottomNav />
      </div>
    </div>
  )
}