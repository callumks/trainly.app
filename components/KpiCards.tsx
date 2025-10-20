"use client"
import React, { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'

type Overview = { ftp: number|null; weeklyWorkKJ: number; weeklyHours: number; trendPct: number; compliance: number }

export function KpiCards() {
  const [data, setData] = useState<Overview | null>(null)
  useEffect(()=>{
    let canceled = false
    fetch('/api/dashboard/overview', { cache: 'no-store' })
      .then(r=>r.json()).then(j=>{ if(!canceled) setData(j) }).catch(()=>{})
    return ()=>{ canceled = true }
  },[])
  const items: { label: string; value: string }[] = [
    { label: 'Current FTP', value: data?.ftp != null ? `${data.ftp} W` : 'NA' },
    { label: 'Weekly Work', value: data?.weeklyWorkKJ != null ? `${Math.round(data.weeklyWorkKJ)} kJ` : 'NA' },
    { label: 'Volume (7d)', value: data?.weeklyHours != null ? `${data.weeklyHours.toFixed(1)} h` : 'NA' },
    { label: 'Trend', value: data?.trendPct != null ? `${data.trendPct>0?'+':''}${data.trendPct}%` : 'NA' },
    { label: 'Compliance', value: data?.compliance != null ? `${data.compliance}%` : 'NA' },
  ]
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {items.map((it) => (
        <Card key={it.label} className="p-4">
          <div className="text-xs text-zinc-400">{it.label}</div>
          <div className="text-xl font-semibold mt-1 truncate">{it.value}</div>
        </Card>
      ))}
    </div>
  )
}

