'use client'

import React, { useEffect, useState } from 'react'
import { Bike, Mountain, Footprints, Waves, Dumbbell, Activity } from 'lucide-react'

const ACT = (type: string): { Icon: any; c: string } => {
  const t = (type || '').toLowerCase()
  if (t.includes('ride') || t.includes('cycl') || t.includes('bike') || t.includes('velo')) return { Icon: Bike, c: '#E03E1F' }
  if (t.includes('climb') || t.includes('boulder')) return { Icon: Mountain, c: '#4C7DD0' }
  if (t.includes('run')) return { Icon: Footprints, c: '#2FA187' }
  if (t.includes('swim')) return { Icon: Waves, c: '#4C7DD0' }
  if (t.includes('weight') || t.includes('workout') || t.includes('strength')) return { Icon: Dumbbell, c: '#2FA187' }
  return { Icon: Activity, c: '#7A8087' }
}
const fmtDate = (s: string) => { try { return new Date(s).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) } catch { return '' } }
const dur = (sec: number) => { if (!sec) return '—'; const h = Math.floor(sec / 3600), m = Math.round((sec % 3600) / 60); return h ? `${h}h ${m}m` : `${m}m` }
const mi = (m: number | null) => (m ? `${(m / 1609.344).toFixed(1)} mi` : null)

function Stat({ label, val }: { label: string; val: string }) {
  return (
    <div style={{ textAlign: 'right', minWidth: 52 }}>
      <div style={{ fontFamily: 'var(--disp)', fontWeight: 600, fontSize: 13, color: 'var(--ink)' }} className="num">{val}</div>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 9, textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--faint)' }}>{label}</div>
    </div>
  )
}

export default function ActivitiesList() {
  const [acts, setActs] = useState<any[] | null>(null)

  useEffect(() => {
    let ok = true
    fetch('/api/activities/recent?limit=50')
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => { if (ok) setActs(j?.activities || []) })
      .catch(() => { if (ok) setActs([]) })
    return () => { ok = false }
  }, [])

  if (acts === null) return <div className="card"><div style={{ padding: 22, color: 'var(--muted)', fontSize: 13 }}>Loading…</div></div>
  if (acts.length === 0) return (
    <div className="card"><div className="empty">
      <div className="ei"><Activity /></div>
      <h4>No activities yet</h4>
      <p>Connect Strava on your profile and hit Sync to see your training here.</p>
    </div></div>
  )

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      {acts.map((a, i) => {
        const { Icon, c } = ACT(a.type)
        const dist = mi(a.distance)
        return (
          <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '13px 18px', borderTop: i ? '1px solid var(--line-2)' : 'none', transition: 'background .12s' }}>
            <div style={{ background: c, width: 36, height: 36, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
              <Icon style={{ width: 17, height: 17 }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--disp)', fontWeight: 600, fontSize: 14, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.name}</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{a.type} · {fmtDate(a.start_date)}</div>
            </div>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              {dist && <Stat label="dist" val={dist} />}
              <Stat label="time" val={dur(a.moving_time)} />
              {a.average_watts ? <Stat label="avg w" val={String(Math.round(a.average_watts))} /> : null}
              {a.tss != null && <Stat label="tss" val={String(a.tss)} />}
            </div>
          </div>
        )
      })}
    </div>
  )
}
