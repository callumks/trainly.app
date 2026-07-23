'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { CalendarDays, Bike, Dumbbell, Waves, Mountain, Activity } from 'lucide-react'

type Session = { id: string; date: string; name: string; session_type: string; intensity: number; status: string; duration_minutes: number | null }

const TYPE_COLOR: Record<string, string> = { cardio: 'var(--z2)', strength: 'var(--accent)', recovery: 'var(--z3)', mixed: 'var(--z5)', skill: 'var(--z4)' }
const TYPE_ICON: Record<string, any> = { cardio: Bike, strength: Dumbbell, recovery: Waves, skill: Mountain, mixed: Activity }
const localYmd = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export default function WeekGlance() {
  const [sessions, setSessions] = useState<Session[] | null>(null)

  useEffect(() => {
    let ok = true
    fetch('/api/sessions/upcoming')
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => { if (ok) setSessions(j?.sessions || []) })
      .catch(() => { if (ok) setSessions([]) })
    return () => { ok = false }
  }, [])

  const today = new Date()
  const monday = new Date(today); monday.setDate(today.getDate() - ((today.getDay() + 6) % 7))
  const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(monday); d.setDate(monday.getDate() + i); return d })
  const list = sessions || []
  const byDay = (d: Date) => list.filter((s) => (s.date || '').slice(0, 10) === localYmd(d))
  const todays = byDay(today)
  const upcoming = list
    .filter((s) => (s.date || '').slice(0, 10) >= localYmd(today))
    .sort((a, b) => (a.date || '').localeCompare(b.date || ''))
    .slice(0, 3)

  return (
    <div className="card" style={{ animationDelay: '.04s' }}>
      <div className="chead">
        <div className="t"><span className="ic"><CalendarDays /></span><h3 className="ct">This Week</h3></div>
        <Link href="/dashboard/calendar" className="meta" style={{ textDecoration: 'none' }}>FULL CALENDAR →</Link>
      </div>

      <div className="week">
        {days.map((d, i) => {
          const ss = byDay(d)
          const isToday = localYmd(d) === localYmd(today)
          const done = ss.length > 0 && ss.every((s) => s.status === 'completed')
          return (
            <div key={i} className={`d${ss.length ? ' has' : ''}${isToday ? ' today' : ''}`} title={ss.map((s) => s.name).join(', ')}>
              <div className="dn">{['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'][i]}</div>
              <div className="dd num">{d.getDate()}</div>
              <div className="pip" style={done ? { background: 'var(--good)' } : undefined} />
            </div>
          )
        })}
      </div>

      {sessions === null ? (
        <div style={{ padding: '10px 4px', color: 'var(--muted)', fontSize: 13 }}>Loading…</div>
      ) : list.length === 0 ? (
        <div style={{ padding: '14px 8px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--disp)', fontWeight: 600, fontSize: 13.5, color: 'var(--ink)', marginBottom: 3 }}>No plan on the calendar</div>
          <p style={{ fontSize: 12.5, color: 'var(--muted)', margin: '0 auto 10px', maxWidth: 260 }}>Ask the coach for a week and add it in one click.</p>
          <Link href="/dashboard/coach" style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--accent)', textDecoration: 'none', borderBottom: '1px solid var(--accent)', paddingBottom: 1 }}>Ask the coach →</Link>
        </div>
      ) : (
        (todays.length ? todays : upcoming).map((s) => {
          const Icon = TYPE_ICON[s.session_type] || Activity
          return (
            <div className="session" key={s.id} style={s.status === 'completed' ? { opacity: 0.62 } : undefined}>
              <div className="sic" style={{ background: TYPE_COLOR[s.session_type] || 'var(--muted)' }}><Icon /></div>
              <div className="si">
                <div className="nm">{s.name}</div>
                <div className="mt">
                  {new Date(s.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                  {s.duration_minutes ? ` · ${s.duration_minutes}m` : ''} · I{s.intensity}/5
                </div>
              </div>
              <span className={`pill${s.status === 'completed' ? ' done' : s.intensity >= 4 ? ' z4' : ''}`}>
                {s.status === 'completed' ? 'Done' : s.status === 'skipped' ? 'Skipped' : `I${s.intensity}`}
              </span>
            </div>
          )
        })
      )}
    </div>
  )
}
