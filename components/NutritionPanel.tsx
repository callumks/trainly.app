'use client'
import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'

export function NutritionPanel({ enabled, onToggle, tips }: { enabled: boolean; tips?: string[]; onToggle: (enabled: boolean) => void }) {
  const [local, setLocal] = useState(enabled)
  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="font-medium">Nutrition tips</div>
        <Switch checked={local} onCheckedChange={(v)=>{setLocal(v); onToggle(v)}} aria-label="Toggle nutrition tips" />
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

