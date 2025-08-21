import React from 'react'
import { Card } from '@/components/ui/card'
import { NutritionPanel } from '@/components/NutritionPanel'
import { ActivitySyncBanner } from '@/components/ActivitySyncBanner'

export function RightRail({ plan }: { plan: any }) {
  // Server-rendered placeholder list until realtime channel is wired client-side
  const updates: any[] = []

  return (
    <div className="space-y-4">
      <ActivitySyncBanner hasNew={updates.length>0} />
      <Card className="p-4 border-neutral-800 bg-neutral-950/60">
        <div className="text-sm font-medium mb-2">Plan updates</div>
        <ul className="text-sm text-zinc-300 space-y-1">
          {updates.length === 0 ? <li>No changes yet</li> : updates.map((u,i)=>(
            <li key={i}>v{u.versionFrom} → v{u.versionTo} · {u.diff?.length || 0} changes</li>
          ))}
        </ul>
        <div className="mt-3 flex gap-2">
          <button className="px-3 py-1 rounded-md border border-neutral-800 text-sm">Accept all</button>
          <button className="px-3 py-1 rounded-md border border-neutral-800 text-sm">Revert</button>
        </div>
      </Card>
      <NutritionPanel enabled={!!plan?.weeks?.[0]?.nutrition?.enabled} />
      <Card className="p-4 border-neutral-800 bg-neutral-950/60">
        <div className="text-sm font-medium mb-2">Upcoming goals</div>
        <ul className="text-sm text-zinc-300 space-y-1">
          {(plan?.meta?.goals ?? []).slice(0,3).map((g: any, i: number)=>(
            <li key={i}>{g?.target || 'Goal'}{g?.timeline ? ` • ${g.timeline}` : ''}</li>
          ))}
          {(!plan?.meta?.goals || plan.meta.goals.length === 0) && <li>No goals set</li>}
        </ul>
      </Card>
    </div>
  )
}

