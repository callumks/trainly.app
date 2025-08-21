import React from 'react'
import { RecentActivities } from '@/components/strava/recent-activities'

export default function TrainingActivitiesPage() {
  return (
    <div className="min-h-[100svh] bg-gradient-to-b from-neutral-950 via-neutral-950 to-neutral-900">
      <div className="mx-auto max-w-[1220px] px-4 py-10">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-5">
          <RecentActivities userId={''} />
        </div>
      </div>
    </div>
  )
}

