"use client"
import React from 'react'

export function NextUp() {
  const [data, setData] = React.useState<any>(null)
  React.useEffect(()=>{
    let cancelled = false
    fetch('/api/sessions/upcoming', { cache: 'no-store' })
      .then(r=>r.json())
      .then(j=>{ if(!cancelled) setData(j?.sessions?.[0] || null) })
      .catch(()=>{})
    return ()=>{ cancelled = true }
  },[])
  if (!data) return null
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-4 text-zinc-200 flex items-center justify-between">
      <div>
        <div className="text-xs text-zinc-400">Next up</div>
        <div className="text-lg font-medium">{data.name}</div>
        <div className="text-xs text-zinc-500">{data.date}</div>
      </div>
      <div className="flex items-center gap-2">
        <button
          className="rounded-md border border-green-600/40 bg-green-600/10 px-3 py-1 text-sm"
          onClick={async ()=>{
            try {
              await fetch('/api/sessions/complete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: data.id }) })
              location.reload()
            } catch {}
          }}
        >
          Mark completed
        </button>
        <a href="/dashboard/calendar" className="rounded-md border border-neutral-800 px-3 py-1 text-sm">Move</a>
      </div>
    </div>
  )
}

