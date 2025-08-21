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
  const items = [
    data?.ftp != null ? { label: 'Current FTP', value: `${data.ftp} W` } : null,
    data ? { label: 'Weekly Work', value: `${Math.round((data.weeklyWorkKJ||0))} kJ` } : null,
    data ? { label: 'Volume (7d)', value: `${data.weeklyHours?.toFixed(1)} h` } : null,
    data ? { label: 'Trend', value: `${data.trendPct>0?'+':''}${data.trendPct}%` } : null,
    data ? { label: 'Compliance', value: `${data.compliance}%` } : null,
  ].filter(Boolean) as { label: string; value: string }[]
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {items.map((it) => (
        <Card key={it.label} className="p-4">
          <div className="text-xs text-zinc-400">{it.label}</div>
          <div className="text-xl font-semibold mt-1">{it.value}</div>
        </Card>
      ))}
    </div>
  )
}

