'use client'

import React, { useEffect, useState } from 'react'

type Session = { id: string; date: string; name: string; session_type: string; intensity: number; status: string; duration_minutes: number | null }

const TYPE_COLOR: Record<string, string> = {
  cardio: 'var(--z2)', strength: 'var(--accent)', recovery: 'var(--z3)', mixed: 'var(--z5)', skill: 'var(--z1)',
}
const color = (t: string) => TYPE_COLOR[(t || '').toLowerCase()] || 'var(--muted)'
const localYmd = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export default function CalendarView() {
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

  const real = !!sessions && sessions.length > 0
  const list: Session[] = real ? sessions! : []
  const byDay = (d: Date) => list.filter((s) => (s.date || '').slice(0, 10) === localYmd(d))
  const range = `${monday.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} – ${days[6].toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`

  return (
    <>
      <div className="card">
        <div className="chead">
          <div className="t"><h3 className="ct">This week</h3></div>
          <span className="meta">{range}</span>
        </div>
        <div className="cal-grid">
          {days.map((d, i) => {
            const ss = byDay(d)
            const isToday = localYmd(d) === localYmd(today)
            return (
              <div key={i} className={`cal-day${isToday ? ' today' : ''}`}>
                <div className="cd-head">
                  <span className="cd-dn">{['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'][i]}</span>
                  <span className="cd-dd num">{d.getDate()}</span>
                </div>
                {ss.map((s) => (
                  <div key={s.id} className={`sess-chip${s.status === 'completed' ? ' done' : ''}`} style={{ borderLeftColor: color(s.session_type) }}>
                    <div className="sc-nm">{s.name}</div>
                    <div className="sc-mt">{s.duration_minutes ? `${s.duration_minutes}m · ` : ''}I{s.intensity}</div>
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </div>

      <div className="card" style={{ marginTop: 18 }}>
        <div className="chead"><div className="t"><h3 className="ct">Upcoming</h3></div></div>
        {list.length === 0 ? (
          <div className="empty">
            <h4>No sessions yet</h4>
            <p>Generate a plan in Coach and your week will fill in here.</p>
          </div>
        ) : (
          [...list].sort((a, b) => (a.date || '').localeCompare(b.date || '')).map((s) => (
            <div key={s.id} className="up-row">
              <span className="dot" style={{ background: color(s.session_type) }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="ur-nm">{s.name}</div>
                <div className="ur-mt">
                  {new Date(s.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                  {s.duration_minutes ? ` · ${s.duration_minutes}m` : ''} · {s.session_type} · I{s.intensity}/5
                </div>
              </div>
              <span className={`status ${s.status}`}>{s.status}</span>
            </div>
          ))
        )}
      </div>
    </>
  )
}
