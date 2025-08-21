import React from 'react'
import { KpiCards } from '@/components/KpiCards'

export default function TrainingOverviewPage() {
  return (
    <div className="min-h-[100svh] bg-gradient-to-b from-neutral-950 via-neutral-950 to-neutral-900">
      <div className="mx-auto max-w-[1220px] px-4 py-10 space-y-6">
        <KpiCards ftp={250} volumeMin={420} rpeTrend="flat" compliance={0.86} />
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-5 text-zinc-300">Current week plan coming soon</div>
      </div>
    </div>
  )
}

