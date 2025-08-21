'use client'
import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { RecentActivities } from '@/components/strava/recent-activities'

const SPORTS = ['Cycling','Climbing','Running','Strength']

export function UserRail({ profile }: { profile: any }) {
  const [selected, setSelected] = useState<string[]>([])
  const toggle = (v: string) => setSelected(p => p.includes(v) ? p.filter(x=>x!==v) : [...p, v])

  return (
    <div className="space-y-4">
      <Card className="p-4 border-neutral-800 bg-neutral-950/60">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-neutral-800" />
          <div>
            <div className="font-medium text-zinc-100">{profile?.full_name || profile?.email || 'Athlete'}</div>
            <div className="text-xs text-zinc-400">Hybrid athlete</div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          {[
            { label: 'Weeks', value: '4' },
            { label: 'Volume', value: `${profile?.weekly_volume ?? 0} hrs` },
            { label: 'Compliance', value: '86%' },
          ].map((k) => (
            <div key={k.label} className="rounded-lg border border-neutral-800 bg-neutral-900/40 py-2">
              <div className="text-sm font-semibold text-zinc-100">{k.value}</div>
              <div className="text-[11px] text-zinc-500">{k.label}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4 border-neutral-800 bg-neutral-950/60">
        <div className="text-sm font-medium mb-3">Sports</div>
        <div className="flex flex-wrap gap-2">
          {SPORTS.map(s => (
            <button key={s} onClick={()=>toggle(s)} className={`px-3 py-1 rounded-full text-xs border transition ${selected.includes(s) ? 'bg-neutral-800 border-neutral-600 text-zinc-100' : 'border-neutral-800 text-zinc-400 hover:text-zinc-200'}`}>{s}</button>
          ))}
        </div>
      </Card>
      <RecentActivities userId={profile?.id || ''} />
    </div>
  )
}

