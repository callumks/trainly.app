import React from 'react'
import { Card } from '@/components/ui/card'

export function KpiCards({ ftp, volumeMin, rpeTrend, compliance }: { ftp?: number; volumeMin?: number; rpeTrend?: 'up'|'flat'|'down'; compliance?: number }) {
  const items = [
    ftp ? { label: 'Current FTP', value: `${ftp} W` } : null,
    volumeMin ? { label: 'Weekly Volume', value: `${volumeMin} min` } : null,
    rpeTrend ? { label: 'RPE trend', value: rpeTrend } : null,
    compliance != null ? { label: 'Compliance', value: `${Math.round(compliance*100)}%` } : null,
  ].filter(Boolean) as { label: string; value: string }[]
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {items.map((it) => (
        <Card key={it.label} className="p-4">
          <div className="text-xs text-zinc-400">{it.label}</div>
          <div className="text-xl font-semibold mt-1">{it.value}</div>
        </Card>
      ))}
    </div>
  )
}

