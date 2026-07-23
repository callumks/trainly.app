'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Zap, Target, Activity, Flag, Sparkles, Bike, Dumbbell, Waves, Mountain, Footprints } from 'lucide-react'
import ThemeToggle from '@/components/app/ThemeToggle'
import WeekGlance from './WeekGlance'
import './dashboard.css'

/* ---------------- chart helpers ---------------- */
type Pt = [number, number]
const sx = (i: number, n: number, w: number, pad: number) => pad + (i * (w - 2 * pad)) / (n - 1)
function smooth(pts: Pt[]): string {
  if (pts.length < 3) return 'M ' + pts.map((p) => p.join(' ')).join(' L ')
  let d = `M ${pts[0][0]} ${pts[0][1]}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2
    const c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6
    const c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2[0]} ${p2[1]}`
  }
  return d
}
const drawStyle: React.CSSProperties = { strokeDasharray: 1, strokeDashoffset: 1 }

/* ---------------- count-up ---------------- */
function CountUp({ value, decimals = 0, prefix = '', className }: { value: number; decimals?: number; prefix?: string; className?: string }) {
  const [v, setV] = useState(0)
  useEffect(() => {
    let raf = 0
    const dur = 900, start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur)
      const e = 1 - Math.pow(1 - t, 3)
      setV(value * e)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value])
  return <span className={className}>{prefix}{decimals ? v.toFixed(decimals) : Math.round(v)}</span>
}

/* ---------------- data types ---------------- */
type Overview = { ftp: number | null; ftpEstimated?: boolean; powerCurve?: Record<string, number> | null; lastSyncedAt?: string | null; weeklyTSS?: number; weeklyWorkKJ: number; weeklyHours: number; trendPct: number; compliance: number }
const relAgo = (iso: string) => {
  const mins = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000))
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const h = Math.round(mins / 60)
  if (h < 48) return `${h}h ago`
  return `${Math.round(h / 24)}d ago`
}
type Readiness = { score: number; ratio: number; flag: string }
const ZN: Record<string, [string, string]> = { Z1: ['Active recovery', 'var(--z1)'], Z2: ['Endurance', 'var(--z2)'], Z3: ['Tempo', 'var(--z3)'], Z4: ['Threshold', 'var(--z4)'], Z5: ['VO₂ max', 'var(--z5)'] }
const PC_DUR: [string, number][] = [['5s', 5], ['1m', 60], ['5m', 300], ['20m', 1200], ['1h', 3600]]
const ACT = (type: string): { Icon: any; c: string } => {
  const t = (type || '').toLowerCase()
  if (t.includes('ride') || t.includes('cycl') || t.includes('bike') || t.includes('velo')) return { Icon: Bike, c: '#E03E1F' }
  if (t.includes('climb') || t.includes('boulder')) return { Icon: Mountain, c: '#4C7DD0' }
  if (t.includes('run')) return { Icon: Footprints, c: '#2FA187' }
  if (t.includes('swim')) return { Icon: Waves, c: '#4C7DD0' }
  if (t.includes('weight') || t.includes('workout') || t.includes('strength')) return { Icon: Dumbbell, c: '#2FA187' }
  return { Icon: Activity, c: '#7A8087' }
}
const relDate = (s: string) => { try { return new Date(s).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) } catch { return '' } }

const READINESS_MSG: Record<string, { head: string; dim: string }> = {
  fresh: { head: "You're fresh.", dim: 'Form is positive — a strong day for quality or a test effort.' },
  balanced: { head: 'Balanced — train as planned.', dim: 'Load and recovery are in equilibrium.' },
  fatigued: { head: 'Easy does it today.', dim: "You're carrying real fatigue — recovery makes the fitness stick." },
}

export default function TrainlyDashboard({ name, initials }: { name: string; initials: string }) {
  const [overview, setOverview] = useState<Overview | null>(null)
  const [readiness, setReadiness] = useState<Readiness | null>(null)
  const [prog, setProg] = useState<any>(null)
  const [recent, setRecent] = useState<any[]>([])

  useEffect(() => {
    let ok = true
    const loadAll = () => Promise.allSettled([
      fetch('/api/dashboard/overview').then((r) => (r.ok ? r.json() : null)),
      fetch('/api/readiness').then((r) => (r.ok ? r.json() : null)),
      fetch('/api/progress').then((r) => (r.ok ? r.json() : null)),
      fetch('/api/activities/recent').then((r) => (r.ok ? r.json() : null)),
    ]).then(([o, r, p, a]) => {
      if (!ok) return
      setOverview(o.status === 'fulfilled' ? o.value : null)
      setReadiness(r.status === 'fulfilled' ? r.value : null)
      setProg(p.status === 'fulfilled' ? p.value : null)
      setRecent(a.status === 'fulfilled' && a.value?.activities ? a.value.activities : [])
    })
    loadAll()
    // auto-sync on open (no-op if synced within the last 30 min); refresh if new data landed
    fetch('/api/strava/sync?ifStale=30')
      .then((r) => (r.ok ? r.json() : null))
      .then((s) => { if (ok && s && !s.skipped && (s.inserted > 0 || s.updated > 0)) loadAll() })
      .catch(() => {})
    return () => { ok = false }
  }, [])

  // "live" = there is real training data flowing; otherwise we show representative sample data.
  const live = !!overview && Number(overview.weeklyHours) > 0
  const firstName = (name || 'there').split(' ')[0]

  // ---- header date (computed client-side so it always reads current) ----
  const today = new Date()
  const fmt = today.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })

  // ---- real-or-sample values ----
  const readyScore = live && readiness ? readiness.score : 84
  const readyMsg = READINESS_MSG[(live && readiness?.flag) || 'balanced'] || READINESS_MSG.balanced
  const weeklyHours = live ? Number(overview!.weeklyHours) : 15.0
  const tss = live ? Math.round(Number(overview!.weeklyTSS) || 0) : 642
  const compliance = live ? Number(overview!.compliance) : 92
  const ftp = live && overview?.ftp ? overview.ftp : null

  // ---- chart datasets: real where available, else representative sample ----
  const hasTrend = !!prog?.trend?.ctl?.length
  const ctl: number[] = hasTrend ? prog.trend.ctl : [65, 68, 72, 75, 78, 82, 85, 88, 90]
  const atl: number[] = hasTrend ? prog.trend.atl : [58, 62, 68, 72, 75, 78, 80, 82, 85]
  const ffCur = prog?.current || { ctl: ctl[ctl.length - 1], atl: atl[atl.length - 1], tsb: ctl[ctl.length - 1] - atl[atl.length - 1] }

  const hasZones = !!prog?.zones?.length
  const zones = hasZones
    ? prog.zones.map((z: any) => ({ z: z.z, n: ZN[z.z]?.[0] || z.z, h: z.h, p: z.p, c: ZN[z.z]?.[1] || 'var(--muted)' }))
    : [
        { z: 'Z1', n: 'Active recovery', h: 4.2, p: 28, c: 'var(--z1)' },
        { z: 'Z2', n: 'Endurance', h: 5.8, p: 39, c: 'var(--z2)' },
        { z: 'Z3', n: 'Tempo', h: 2.1, p: 14, c: 'var(--z3)' },
        { z: 'Z4', n: 'Threshold', h: 2.3, p: 15, c: 'var(--z4)' },
        { z: 'Z5', n: 'VO₂ max', h: 0.6, p: 4, c: 'var(--z5)' },
      ]

  const hasPC = !!(overview?.powerCurve && Object.keys(overview.powerCurve).length)
  const power: [string, number, number][] = hasPC
    ? PC_DUR.filter(([, s]) => overview!.powerCurve![String(s)]).map(([lab, s]) => { const w = Math.round(overview!.powerCurve![String(s)]); return [lab, w, w] as [string, number, number] })
    : [['5s', 1245, 1320], ['1m', 485, 520], ['5m', 368, 395], ['20m', 285, 298], ['1h', 245, 262]]
  const hasSpark = !!prog?.readinessTrend?.length
  const spark: number[] = hasSpark ? prog.readinessTrend : []

  const recentList = Array.isArray(recent) ? recent.slice(0, 5) : []

  const coachInsight = !live
    ? 'Connect your training and your coach will tailor sessions to your real load.'
    : ffCur.tsb <= -20 ? `You're deep in fatigue (TSB ${ffCur.tsb}). Back right off — an easy spin or a rest day lets your fitness stick.`
    : ffCur.tsb <= -8 ? `You're carrying real fatigue (TSB ${ffCur.tsb}) after ${weeklyHours.toFixed(1)}h this week. Keep today controlled and save the hard efforts.`
    : ffCur.tsb >= 10 ? `You're fresh (TSB +${ffCur.tsb}) — a strong day for a hard session or a test effort.`
    : `Balanced form (TSB ${ffCur.tsb > 0 ? '+' : ''}${ffCur.tsb}). A good day to train as planned.`

  const df = (real: boolean) => (real ? null : <span className="demoflag">sample</span>)

  return (
    <div className="tr-dash">
      {/* top bar */}
      <div className="topbar">
        <Link href="/dashboard" className="brand"><span className="dot" />Trainly</Link>
        <nav className="main">
          <Link href="/dashboard" className="active">Dashboard</Link>
          <Link href="/training/calendar">Calendar</Link>
          <Link href="/coach">Coach</Link>
          <Link href="/dashboard/stats">Progress</Link>
        </nav>
        <div className="spacer" />
        <div className={`sync${live ? '' : ' off'}`}>
          <span className="live" />{overview?.lastSyncedAt ? `Synced · ${relAgo(overview.lastSyncedAt)}` : live ? 'Synced' : 'Not synced'}
        </div>
        <ThemeToggle />
        <Link href="/dashboard/profile" className="avatar">{initials}</Link>
      </div>

      <div className="wrap">
        {/* header */}
        <header className="page">
          <div>
            <h1>Hey, {firstName}</h1>
            <div className="sub">{fmt} — ready for today&apos;s session?</div>
          </div>
          <div className="topstats">
            <div className="s"><div className="eyebrow">This week</div><div className="v num"><CountUp value={weeklyHours} decimals={1} /><small>h</small></div></div>
            <div className="s"><div className="eyebrow">Load · TSS</div><div className="v num"><CountUp value={tss} /></div></div>
            <div className="s"><div className="eyebrow">Compliance</div><div className="v num"><CountUp value={compliance} /><small>%</small></div></div>
            <div className="s"><div className="eyebrow">FTP</div><div className="v num">{ftp ? <CountUp value={ftp} /> : '—'}<small>w</small></div></div>
          </div>
        </header>

        <div className="grid">
          {/* LEFT */}
          <div className="col">
            {/* readiness */}
            <div className="card readiness" style={{ animationDelay: '.02s' }}>
              <div className="chead">
                <div className="t"><span className="ic"><Zap /></span><h3 className="ct">Readiness</h3></div>
                <span className="meta">TODAY</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline' }}>
                <CountUp className="bignum num" value={readyScore} />
                <span className="of">/100</span>
              </div>
              <div className="track"><i style={{ width: `${readyScore}%` }} /></div>
              <div className="rmsg">{readyMsg.head}<span className="dim">{readyMsg.dim}</span></div>
              {hasSpark && (
                <div className="spark">
                  <span className="lab">7-DAY</span>
                  <Sparkline vals={spark} />
                </div>
              )}
            </div>

            {/* zones */}
            <div className="card" style={{ animationDelay: '.10s' }}>
              <div className="chead">
                <div className="t"><span className="ic"><Target /></span><h3 className="ct">Training Zones {df(hasZones)}</h3></div>
                <span className="meta">LAST 30 DAYS</span>
              </div>
              <div className="ztot"><b className="num">{zones.reduce((s: number, z: any) => s + z.h, 0).toFixed(1)}</b><span>total hours</span></div>
              <div className="zbar">{zones.map((z: any) => <span key={z.z} style={{ background: z.c, width: `${z.p}%` }} />)}</div>
              <div className="zlist">
                {zones.map((z: any, i: number) => (
                  <React.Fragment key={z.z}>
                    <div className="zrow">
                      <span className="sw" style={{ background: z.c }} />
                      <span className="zn">{z.z} · {z.n}</span>
                      <span className="zh">{z.h.toFixed(1)}h</span>
                      <span className="zp">{z.p}%</span>
                    </div>
                    {i < zones.length - 1 && <div className="zline" />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* CENTER */}
          <div className="col">
            {/* this week — plan at a glance */}
            <WeekGlance />

            {/* recent activity (real) */}
            <div className="card" style={{ animationDelay: '.05s' }}>
              <div className="chead">
                <div className="t"><span className="ic"><Activity /></span><h3 className="ct">Recent Activity</h3></div>
                <Link href="/dashboard/activities" className="meta" style={{ textDecoration: 'none' }}>VIEW ALL →</Link>
              </div>
              {recentList.length === 0 ? (
                <div style={{ padding: '28px 8px', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>No activities yet — connect Strava on your profile.</div>
              ) : recentList.map((a: any) => {
                const { Icon, c } = ACT(a.type)
                return (
                  <div className="session" key={a.id}>
                    <div className="sic" style={{ background: c }}><Icon /></div>
                    <div className="si"><div className="nm">{a.name}</div><div className="mt">{a.type} · {relDate(a.start_date)}{a.moving_time ? ` · ${Math.round(a.moving_time / 60)}m` : ''}</div></div>
                    {a.suffer_score != null && <span className="pill" title="Relative effort">{a.suffer_score}</span>}
                  </div>
                )
              })}
            </div>

            {/* fitness & fatigue */}
            <div className="card" style={{ animationDelay: '.13s' }}>
              <div className="chead">
                <div className="t"><span className="ic"><Activity /></span><h3 className="ct">Fitness &amp; Fatigue {df(hasTrend)}</h3></div>
                <span className="meta">90 DAYS</span>
              </div>
              <div className="trio">
                <div className="stat"><div className="k">CTL · Fitness</div><div className="n num"><CountUp value={ffCur.ctl} /></div><div className="d up">chronic load</div></div>
                <div className="stat"><div className="k">ATL · Fatigue</div><div className="n num"><CountUp value={ffCur.atl} /></div><div className="d warn">acute load</div></div>
                <div className="stat"><div className="k">TSB · Form</div><div className="n num"><CountUp value={ffCur.tsb} prefix={ffCur.tsb > 0 ? '+' : ''} /></div><div className="d neutral">{ffCur.tsb >= 5 ? 'fresh' : ffCur.tsb <= -15 ? 'fatigued' : 'optimal'}</div></div>
              </div>
              <FitnessFatigue ctl={ctl} atl={atl} />
              <div className="legend">
                <i><b style={{ background: '#5B8DEF' }} />Fitness (CTL)</i>
                <i><b style={{ background: '#E08F2A' }} />Fatigue (ATL)</i>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="col">
            {/* event */}
            <div className="card event" style={{ animationDelay: '.08s' }}>
              <div className="chead">
                <div className="t"><span className="ic"><Flag /></span><h3 className="ct">Next Event</h3></div>
              </div>
              <div style={{ padding: '20px 6px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--disp)', fontWeight: 600, fontSize: 14, color: 'var(--ink)', marginBottom: 4 }}>No goal race set</div>
                <p style={{ fontSize: 12.5, color: 'var(--muted)', margin: '0 auto 12px', maxWidth: 210 }}>Add a target event and Trainly will build toward it.</p>
                <Link href="/goals" style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--accent)', textDecoration: 'none', borderBottom: '1px solid var(--accent)', paddingBottom: 1 }}>Set a goal →</Link>
              </div>
            </div>

            {/* power curve */}
            <div className="card" style={{ animationDelay: '.12s' }}>
              <div className="chead">
                <div className="t"><span className="ic"><Zap /></span><h3 className="ct">Power Curve {df(hasPC)}</h3></div>
                <span className="meta">LAST 90 DAYS</span>
              </div>
              <PowerCurve data={power} />
              <div className="pcrow">
                {power.map(([d, w, at]) => {
                  const pr = w >= at
                  return (
                    <div className="pc" key={d}>
                      <div className="pd">{d}</div>
                      <div className="pw num">{w}<span style={{ fontSize: 9, color: 'var(--muted)' }}>w</span></div>
                      <div className={`pdelta${pr ? ' pr' : ''}`}>{pr ? 'PR' : `−${at - w}w`}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* coach */}
            <div className="card coach" style={{ animationDelay: '.16s' }}>
              <div className="chead">
                <div className="t"><span className="ic"><Sparkles /></span><h3 className="ct">Coach</h3></div>
                <span className="meta">AI · ADAPTIVE</span>
              </div>
              <div className="bubble">{coachInsight}</div>
              <Link href="/coach" className="ask">Ask your coach… <span className="k">↵</span></Link>
            </div>
          </div>
        </div>

        <div className="foot"><span className="note">{live ? 'Live — synced to your training' : 'Sample data — connect your training to go live'}</span></div>
      </div>
    </div>
  )
}

/* ---------------- chart components ---------------- */
function FitnessFatigue({ ctl, atl }: { ctl: number[]; atl: number[] }) {
  const W = 480, H = 130, pad = 8, padB = 16, padT = 10
  const all = ctl.concat(atl), min = Math.min(...all) - 6, max = Math.max(...all) + 4
  const y = (v: number) => (H - padB) - ((v - min) / (max - min)) * (H - padT - padB)
  const pts = (arr: number[]): Pt[] => arr.map((v, i) => [sx(i, arr.length, W, pad), y(v)])
  const series = (arr: number[], color: string, id: string) => {
    const P = pts(arr), line = smooth(P), last = P[P.length - 1]
    return (
      <g key={id}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.16} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <path className="area" d={`${line} L ${P[P.length - 1][0]} ${H - padB} L ${P[0][0]} ${H - padB} Z`} fill={`url(#${id})`} />
        <path className="draw" d={line} fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round" pathLength={1} style={drawStyle} />
        <circle className="area" cx={last[0]} cy={last[1]} r={3.4} fill="var(--surface)" stroke={color} strokeWidth={2} />
      </g>
    )
  }
  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      {[0, 1, 2].map((g) => { const yy = padT + g * ((H - padT - padB) / 2); return <line key={g} x1={pad} y1={yy} x2={W - pad} y2={yy} stroke="var(--line-2)" strokeWidth={1} /> })}
      {series(atl, '#E08F2A', 'gatl')}
      {series(ctl, '#5B8DEF', 'gctl')}
    </svg>
  )
}

function PowerCurve({ data }: { data: [string, number, number][] }) {
  const W = 320, H = 110, pad = 6, padB = 8, padT = 8, min = 200, max = 1320
  const lv = (v: number) => Math.log(v)
  const y = (v: number) => (H - padB) - ((lv(v) - lv(min)) / (lv(max) - lv(min))) * (H - padT - padB)
  const ptsOf = (idx: 1 | 2): Pt[] => data.map((d, i) => [sx(i, data.length, W, pad), y(d[idx])])
  const cur = ptsOf(1), allt = ptsOf(2), cline = smooth(cur)
  return (
    <svg className="chart" style={{ height: 110 }} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="gpc" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E03E1F" stopOpacity={0.15} />
          <stop offset="100%" stopColor="#E03E1F" stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={smooth(allt)} fill="none" stroke="var(--faint)" strokeWidth={1.6} strokeDasharray="4 4" />
      <path className="area" d={`${cline} L ${cur[cur.length - 1][0]} ${H - padB} L ${cur[0][0]} ${H - padB} Z`} fill="url(#gpc)" />
      <path className="draw" d={cline} fill="none" stroke="#E03E1F" strokeWidth={2.6} strokeLinecap="round" pathLength={1} style={drawStyle} />
      {cur.map((p, i) => <circle className="area" key={i} cx={p[0]} cy={p[1]} r={3} fill="var(--surface)" stroke="#E03E1F" strokeWidth={2} />)}
    </svg>
  )
}

function Sparkline({ vals }: { vals: number[] }) {
  const W = 160, H = 32, pad = 3, min = Math.min(...vals) - 3, max = Math.max(...vals) + 3
  const P: Pt[] = vals.map((v, i) => [sx(i, vals.length, W, pad), (H - pad) - ((v - min) / (max - min)) * (H - 2 * pad)])
  const last = P[P.length - 1]
  return (
    <svg width={160} height={32} viewBox={`0 0 ${W} ${H}`}>
      <path className="draw" d={smooth(P)} fill="none" stroke="#2E9E77" strokeWidth={2} strokeLinecap="round" pathLength={1} style={drawStyle} />
      <circle className="area" cx={last[0]} cy={last[1]} r={2.6} fill="#2E9E77" />
    </svg>
  )
}
