'use client'

import React, { useEffect, useRef, useState } from 'react'
import AppShell from '@/components/app/AppShell'
import PageHeader from '@/components/app/PageHeader'

type PlanSession = { date: string; name: string; session_type: string; duration_minutes: number; intensity: number; description?: string }
type Msg = { id?: string; role: 'user' | 'assistant'; text: string; plan?: PlanSession[] | null; planStatus?: 'idle' | 'applying' | 'applied' | 'error' }

const TYPE_COLOR: Record<string, string> = { cardio: 'var(--z2)', strength: 'var(--accent)', recovery: 'var(--z3)', mixed: 'var(--z5)', skill: 'var(--z4)' }
const planDay = (d: string) => new Date(d + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })

// Minimal markdown for chat bubbles: line breaks + **bold**. No dependency, React-safe.
function Md({ text }: { text: string }) {
  const lines = text.split(/\n+/).filter((l) => l.trim().length)
  return (
    <>
      {lines.map((line, i) => (
        <div key={i} style={{ marginTop: i ? 6 : 0 }}>
          {line.split(/(\*\*[^*]+\*\*)/g).map((seg, j) =>
            seg.startsWith('**') && seg.endsWith('**')
              ? <strong key={j} style={{ color: 'var(--ink)', fontWeight: 600 }}>{seg.slice(2, -2)}</strong>
              : <React.Fragment key={j}>{seg}</React.Fragment>
          )}
        </div>
      ))}
    </>
  )
}

export default function CoachPage() {
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [ctx, setCtx] = useState<any>(null)
  const [source, setSource] = useState<'ai' | 'rules' | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let ok = true
    fetch('/api/coach').then((r) => (r.ok ? r.json() : null)).then((d) => {
      if (!ok || !d) return
      if (d.source) setSource(d.source)
      const c = d.context
      if (c) setCtx(c)
      if (Array.isArray(d.history) && d.history.length > 0) {
        // persisted conversation survives reloads
        setMsgs((m) => (m.length === 0 ? d.history : m))
      } else if (c) {
        const flag = c.tsb >= 5 ? 'fresh' : c.tsb <= -15 ? 'fatigued' : 'balanced'
        const greeting = c.hasData
          ? `Hey — I've got your training pulled up. Your form's at TSB ${c.tsb > 0 ? '+' : ''}${c.tsb} (${flag}) with readiness ${c.readiness}/100, and you've done ${c.weeklyHours}h this week. Ask me what to do today, whether you're overreaching, or how your fitness is trending — I'll answer from your real numbers.`
          : `Hey — connect Strava on your Profile and sync, and I'll start coaching from your real training. Right now I can't see any data.`
        setMsgs((m) => (m.length === 0 ? [{ role: 'assistant', text: greeting }] : m))
      }
    }).catch(() => {})
    // keep training data fresh so "I just did a ride" is visible to the coach
    fetch('/api/strava/sync?ifStale=15').catch(() => {})
    return () => { ok = false }
  }, [])
  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight }) }, [msgs, busy])

  async function send(text?: string) {
    const q = (text ?? input).trim()
    if (!q || busy) return
    setInput('')
    const history = msgs
    setMsgs((m) => [...m, { role: 'user', text: q }])
    setBusy(true)
    try {
      const r = await fetch('/api/coach', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: q, history }) })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || 'failed')
      setMsgs((m) => [...m, { id: d.messageId || undefined, role: 'assistant', text: d.reply, plan: d.proposedPlan || null, planStatus: d.proposedPlan ? 'idle' : undefined }])
      if (d.context) setCtx(d.context)
      if (d.source) setSource(d.source)
    } catch {
      setMsgs((m) => [...m, { role: 'assistant', text: 'Sorry — something went wrong reaching the coach.' }])
    } finally {
      setBusy(false)
    }
  }

  async function applyPlan(idx: number) {
    const m = msgs[idx]
    if (!m?.plan || m.planStatus === 'applying' || m.planStatus === 'applied') return
    setMsgs((prev) => prev.map((x, i) => (i === idx ? { ...x, planStatus: 'applying' } : x)))
    try {
      const r = await fetch('/api/plan/apply', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessions: m.plan, messageId: m.id }) })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || 'failed')
      setMsgs((prev) => prev.map((x, i) => (i === idx ? { ...x, planStatus: 'applied' } : x)))
    } catch {
      setMsgs((prev) => prev.map((x, i) => (i === idx ? { ...x, planStatus: 'error' } : x)))
    }
  }

  const chips = ['What should I do today?', 'Make me a plan for the week', 'Am I overtraining?', 'How was this week?']

  return (
    <AppShell>
      <PageHeader
        eyebrow={source === 'ai' ? 'AI · grounded in your data' : 'Grounded in your data'}
        title="Coach"
        sub="Ask anything about your training — answers come straight from your real numbers."
      />
      <div className="grid-2" style={{ gridTemplateColumns: '1.6fr 1fr' }}>
        {/* chat */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '64vh', padding: 0 }}>
          <div ref={scrollRef} style={{ flex: 1, overflow: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 11 }}>
            {msgs.length === 0 && (
              <div style={{ margin: 'auto', textAlign: 'center', maxWidth: 320 }}>
                <div style={{ fontFamily: 'var(--disp)', fontWeight: 600, fontSize: 15, marginBottom: 6 }}>Ask your coach</div>
                <p style={{ fontSize: 13, color: 'var(--muted)' }}>It reads your live fitness, fatigue, readiness and recent training to answer — try a prompt on the right.</p>
              </div>
            )}
            {msgs.map((m, i) => (
              <React.Fragment key={i}>
                <div style={{
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '82%',
                  background: m.role === 'user' ? 'var(--ink)' : 'var(--surface-2)',
                  color: m.role === 'user' ? 'var(--paper)' : 'var(--ink-2)',
                  border: m.role === 'user' ? 'none' : '1px solid var(--line-2)',
                  borderRadius: 13, borderTopRightRadius: m.role === 'user' ? 3 : 13, borderTopLeftRadius: m.role === 'user' ? 13 : 3,
                  padding: '11px 14px', fontSize: 13.5, lineHeight: 1.5,
                }}>{m.role === 'assistant' ? <Md text={m.text} /> : m.text}</div>

                {m.plan && (
                  <div style={{ alignSelf: 'flex-start', width: '82%', border: '1px solid var(--line)', borderRadius: 13, background: 'var(--surface)', padding: 14 }}>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '.14em', color: 'var(--muted)', marginBottom: 10 }}>
                      Proposed plan · {m.plan.length} sessions
                    </div>
                    {m.plan.map((s, j) => (
                      <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderTop: j ? '1px solid var(--line-2)' : 'none' }}>
                        <span style={{ width: 8, height: 8, borderRadius: 3, background: TYPE_COLOR[s.session_type] || 'var(--muted)', flexShrink: 0 }} />
                        <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', width: 86, flexShrink: 0 }}>{planDay(s.date)}</span>
                        <span style={{ fontFamily: 'var(--disp)', fontWeight: 600, fontSize: 12.5, color: 'var(--ink)', flex: 1 }}>{s.name}</span>
                        <span style={{ fontFamily: 'var(--mono)', fontSize: 10.5, color: 'var(--faint)', whiteSpace: 'nowrap' }}>{s.duration_minutes}m · I{s.intensity}</span>
                      </div>
                    ))}
                    <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                      {m.planStatus === 'applied' ? (
                        <a href="/dashboard/calendar" style={{ fontFamily: 'var(--mono)', fontSize: 11.5, color: 'var(--good)', textDecoration: 'none' }}>✓ Added — view calendar →</a>
                      ) : (
                        <button className="btn accent" style={{ height: 36, fontSize: 12.5 }} onClick={() => applyPlan(i)} disabled={m.planStatus === 'applying'}>
                          {m.planStatus === 'applying' ? 'Adding…' : 'Add to calendar'}
                        </button>
                      )}
                      {m.planStatus === 'error' && <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--accent)' }}>failed — try again</span>}
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
            {busy && <div style={{ alignSelf: 'flex-start', color: 'var(--muted)', fontFamily: 'var(--mono)', fontSize: 12, padding: '4px 6px' }}>coach is thinking…</div>}
          </div>
          <div style={{ display: 'flex', gap: 8, padding: 14, borderTop: '1px solid var(--line-2)' }}>
            <input
              value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') send() }}
              placeholder="Ask your coach…"
              style={{ flex: 1, height: 44, padding: '0 14px', border: '1px solid var(--line)', borderRadius: 11, background: 'var(--surface)', color: 'var(--ink)', fontFamily: 'var(--ui)', fontSize: 14 }}
            />
            <button className="btn accent" style={{ height: 44, padding: '0 20px' }} onClick={() => send()} disabled={busy}>Send</button>
          </div>
        </div>

        {/* context + prompts */}
        <div className="col">
          <div className="card">
            <div className="chead"><div className="t"><h3 className="ct">Your numbers</h3></div><span className="meta">LIVE</span></div>
            {ctx?.hasData ? (
              <div className="kv">
                <div className="row"><span className="k">Form · TSB</span><span className="v num">{ctx.tsb > 0 ? '+' : ''}{ctx.tsb}</span></div>
                <div className="row"><span className="k">Fitness · CTL</span><span className="v num">{ctx.ctl}</span></div>
                <div className="row"><span className="k">Fatigue · ATL</span><span className="v num">{ctx.atl}</span></div>
                <div className="row"><span className="k">Readiness</span><span className="v num">{ctx.readiness}/100</span></div>
                <div className="row"><span className="k">This week</span><span className="v num">{ctx.weeklyHours}h · {ctx.weeklyTSS} TSS</span></div>
                <div className="row"><span className="k">FTP</span><span className="v num">{ctx.ftp ? `${ctx.ftp}w` : '—'}</span></div>
              </div>
            ) : <p style={{ fontSize: 13, color: 'var(--muted)' }}>Sync Strava on your Profile to load your numbers.</p>}
          </div>
          <div className="card">
            <div className="chead"><div className="t"><h3 className="ct">Try asking</h3></div></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {chips.map((c) => (
                <button key={c} className="btn ghost" style={{ height: 'auto', padding: '10px 12px', justifyContent: 'flex-start', fontFamily: 'var(--ui)', fontWeight: 500, fontSize: 13 }} onClick={() => send(c)}>{c}</button>
              ))}
            </div>
          </div>
          {source === 'rules' && (
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10.5, color: 'var(--faint)', padding: '0 4px', lineHeight: 1.5 }}>
              Grounded mode (no LLM key set) — answers are real but rule-based. Add an LLM key for full conversation.
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
