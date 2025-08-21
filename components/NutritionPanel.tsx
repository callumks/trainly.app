'use client'
import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'

export function NutritionPanel({ enabled, tips }: { enabled: boolean; tips?: string[] }) {
  const [local, setLocal] = useState(enabled)
  const onToggle = async (next: boolean) => {
    try {
      setLocal(next)
      await fetch('/api/nutrition/toggle', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ enabled: next }) })
    } catch {
      setLocal(!next)
    }
  }
  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="font-medium">Nutrition tips</div>
        <Switch checked={local} onCheckedChange={(v)=>{onToggle(v)}} aria-label="Toggle nutrition tips" />
      </div>
      {local && (
        <ul className="text-sm list-disc pl-5 space-y-1">
          {(tips || ['Fuel 60-80g carbs/hr on long rides','20-30g protein within 30m post climb']).map((t,i)=>(
            <li key={i}>{t}</li>
          ))}
        </ul>
      )}
    </Card>
  )
}

