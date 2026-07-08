'use client'

import React, { useState } from 'react'

type P = {
  email: string
  full_name: string | null
  experience_level: string | null
  weekly_volume: number | null
  sports: string[] | null
  ftp: number | null
  ftpEstimated: boolean
}

const SPORTS = ['cycling', 'climbing', 'running', 'strength', 'swimming', 'triathlon', 'crossfit']
const LEVELS = ['beginner', 'intermediate', 'advanced']

const inputStyle: React.CSSProperties = {
  width: '100%', height: 38, padding: '0 11px', border: '1px solid var(--line)', borderRadius: 9,
  background: 'var(--surface)', color: 'var(--ink)', fontFamily: 'var(--ui)', fontSize: 13.5,
}

export default function ProfileDetails({ initial }: { initial: P }) {
  const [p, setP] = useState<P>(initial)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<P>(initial)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  const startEdit = () => { setDraft(p); setErr(''); setEditing(true) }

  const save = async () => {
    setSaving(true); setErr('')
    try {
      const r = await fetch('/api/profile', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: draft.full_name,
          experience_level: draft.experience_level,
          weekly_volume: draft.weekly_volume,
          sports: draft.sports || [],
          ftp: draft.ftp,
        }),
      })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || 'Save failed')
      setP(d.profile)
      setEditing(false)
    } catch (e: any) {
      setErr(e.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const toggleSport = (s: string) => {
    const cur = draft.sports || []
    setDraft({ ...draft, sports: cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s] })
  }

  if (!editing) {
    return (
      <>
        <div className="chead">
          <div className="t"><h3 className="ct">Details</h3></div>
          <button className="btn ghost" style={{ height: 32, fontSize: 12.5 }} onClick={startEdit}>Edit</button>
        </div>
        <div className="kv">
          <div className="row"><span className="k">Email</span><span className="v">{p.email}</span></div>
          <div className="row"><span className="k">Name</span><span className="v">{p.full_name || '—'}</span></div>
          <div className="row"><span className="k">FTP</span><span className="v num">{p.ftp ? `${p.ftp}w` : '—'}{p.ftp ? <span className="demoflag" style={{ marginLeft: 6 }}>{p.ftpEstimated ? 'estimated' : 'manual'}</span> : null}</span></div>
          <div className="row"><span className="k">Experience</span><span className="v" style={{ textTransform: 'capitalize' }}>{p.experience_level || '—'}</span></div>
          <div className="row"><span className="k">Weekly volume</span><span className="v">{p.weekly_volume ? `${p.weekly_volume} h` : '—'}</span></div>
          <div className="row"><span className="k">Sports</span><span className="v" style={{ textTransform: 'capitalize' }}>{p.sports?.length ? p.sports.join(', ') : '—'}</span></div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="chead">
        <div className="t"><h3 className="ct">Details</h3></div>
        <span className="meta">EDITING</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
        <label>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Name</div>
          <input style={inputStyle} value={draft.full_name || ''} placeholder="Your name" onChange={(e) => setDraft({ ...draft, full_name: e.target.value })} />
        </label>
        <label>
          <div className="eyebrow" style={{ marginBottom: 6 }}>FTP (watts)</div>
          <input style={inputStyle} type="number" min={50} max={600} value={draft.ftp ?? ''} placeholder="e.g. 280"
            onChange={(e) => setDraft({ ...draft, ftp: e.target.value === '' ? null : Number(e.target.value) })} />
          <div className="meta" style={{ marginTop: 5 }}>Setting this manually overrides the estimate — TSS &amp; zones re-key to it.</div>
        </label>
        <div>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Experience</div>
          <div style={{ display: 'flex', gap: 7 }}>
            {LEVELS.map((l) => (
              <button key={l} className={`btn ghost`} onClick={() => setDraft({ ...draft, experience_level: l })}
                style={{ height: 34, fontSize: 12.5, textTransform: 'capitalize', ...(draft.experience_level === l ? { background: 'var(--ink)', color: 'var(--paper)', borderColor: 'var(--ink)' } : {}) }}>
                {l}
              </button>
            ))}
          </div>
        </div>
        <label>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Weekly volume (hours)</div>
          <input style={inputStyle} type="number" min={0} max={60} value={draft.weekly_volume ?? ''} placeholder="e.g. 8"
            onChange={(e) => setDraft({ ...draft, weekly_volume: e.target.value === '' ? null : Number(e.target.value) })} />
        </label>
        <div>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Sports</div>
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
            {SPORTS.map((s) => {
              const on = (draft.sports || []).includes(s)
              return (
                <button key={s} className="btn ghost" onClick={() => toggleSport(s)}
                  style={{ height: 32, fontSize: 12, textTransform: 'capitalize', ...(on ? { background: 'var(--ink)', color: 'var(--paper)', borderColor: 'var(--ink)' } : {}) }}>
                  {s}
                </button>
              )
            })}
          </div>
        </div>
        {err && <div style={{ fontFamily: 'var(--mono)', fontSize: 11.5, color: 'var(--accent)' }}>{err}</div>}
        <div style={{ display: 'flex', gap: 9, marginTop: 4 }}>
          <button className="btn accent" style={{ height: 38 }} onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
          <button className="btn ghost" style={{ height: 38 }} onClick={() => setEditing(false)} disabled={saving}>Cancel</button>
        </div>
      </div>
    </>
  )
}
