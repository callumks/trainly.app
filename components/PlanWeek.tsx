import React from 'react'
import { Card } from '@/components/ui/card'
import { Session } from '@/lib/types'

export function PlanWeek({ start, sessions }: { start: string; sessions: Session[] }) {
  return (
    <div className="space-y-2">
      <div className="text-sm text-zinc-400">Week starting {new Date(start).toLocaleDateString()}</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
        {sessions.map((s) => (
          <Card key={s.id} className="p-3">
            <div className="flex justify-between">
              <div className="font-medium">{s.title}</div>
              <div className="text-xs text-zinc-500">{s.sport}</div>
            </div>
            {s.description && <div className="text-sm mt-1">{s.description}</div>}
          </Card>
        ))}
      </div>
    </div>
  )
}

