import React from 'react'
import { Card } from '@/components/ui/card'
import { NutritionPanel } from '@/components/NutritionPanel'
import { ActivitySyncBanner } from '@/components/ActivitySyncBanner'

export function RightRail({ plan }: { plan: any }) {
  return (
    <div className="space-y-4">
      <ActivitySyncBanner hasNew={false} />
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

