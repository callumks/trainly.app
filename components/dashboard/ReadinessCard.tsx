"use client"
import React from 'react'

export function ReadinessCard() {
  const [data, setData] = React.useState<{ score: number; ratio: number; flag: string } | null>(null)
  React.useEffect(()=>{
    let cancelled = false
    fetch('/api/readiness', { cache: 'no-store' })
      .then(r=>r.json())
      .then(j=>{ if(!cancelled) setData(j) })
      .catch(()=>{})
    return ()=>{ cancelled = true }
  },[])
  if (!data) return <div className="text-sm text-zinc-400">Loading…</div>
  return (
    <div className="text-sm text-zinc-300">
      <div className="text-2xl font-semibold mb-1">{data.score}</div>
      <div className="text-xs text-zinc-500">AC ratio {data.ratio} · {data.flag}</div>
    </div>
  )
}

