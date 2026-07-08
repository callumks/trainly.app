'use client'

import React, { useEffect, useState } from 'react'

type Pt = [number, number]
const sx = (i: number, n: number, w: number, pad: number) => (n <= 1 ? w / 2 : pad + (i * (w - 2 * pad)) / (n - 1))
function smooth(pts: Pt[]): string {
  if (pts.length < 3) return 'M ' + pts.map((p) => p.join(' ')).join(' L ')
  let d = `M ${pts[0][0]} ${pts[0][1]}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2
    d += ` C ${p1[0] + (p2[0] - p0[0]) / 6} ${p1[1] + (p2[1] - p0[1]) / 6}, ${p2[0] - (p3[0] - p1[0]) / 6} ${p2[1] - (p3[1] - p1[1]) / 6}, ${p2[0]} ${p2[1]}`
  }
  return d
}
const drawStyle: React.CSSProperties = { strokeDasharray: 1, strokeDashoffset: 1 }
const ZN: Record<string, [string, string]> = {
  Z1: ['Active recovery', 'var(--z1)'], Z2: ['Endurance', 'var(--z2)'], Z3: ['Tempo', 'var(--z3)'], Z4: ['Threshold', 'var(--z4)'], Z5: ['VO₂ max', 'var(--z5)'],
}

export default function ProgressView() {
  const [overview, setOverview] = useState<any>(null)
  const [readiness, setReadiness] = useState<any>(null)
  const [prog, setProg] = useState<any>(null)

  useEffect(() => {
    let ok = true
    Promise.allSettled([
      fetch('/api/dashboard/overview').then((r) => (r.ok ? r.json() : null)),
      fetch('/api/readiness').then((r) => (r.ok ? r.json() : null)),
      fetch('/api/progress').then((r) => (r.ok ? r.json() : null)),
    ]).then(([o, r, p]) => {
      if (!ok) return
      setOverview(o.status === 'fulfilled' ? o.value : null)
      setReadiness(r.status === 'fulfilled' ? r.value : null)
      setProg(p.status === 'fulfilled' ? p.value : null)
    })
    return () => { ok = false }
  }, [])

  const live = !!overview && Number(overview.weeklyHours) > 0
  const hours = live ? Number(overview.weeklyHours) : 15.0
  const tss = live ? Math.round(Number(overview.weeklyTSS) || 0) : 642
  const readyScore = live && readiness ? readiness.score : 84

  // ---- fitness/fatigue trend (real if present) ----
  const hasTrend = !!prog?.trend?.ctl?.length
  const ctl: number[] = hasTrend ? prog.trend.ctl : [62, 65, 68, 70, 74, 78, 82, 85, 88, 90]
  const atl: number[] = hasTrend ? prog.trend.atl : [55, 60, 64, 68, 70, 74, 78, 80, 83, 85]
  const cur = prog?.current || { ctl: ctl[ctl.length - 1], atl: atl[atl.length - 1], tsb: ctl[ctl.length - 1] - atl[atl.length - 1] }
  const tsbLabel = cur.tsb >= 5 ? 'fresh' : cur.tsb <= -15 ? 'fatigued' : 'optimal'

  // ---- weekly volume (real if present) ----
  const hasVol = !!prog?.weeklyVolume?.length
  const vol: number[] = hasVol ? prog.weeklyVolume.map((w: any) => w.hours) : [8.5, 11, 9.5, 12, 10.5, 13.5, 14, 15]
  const volMax = Math.max(...vol, 0.1)

  // ---- zones (real if present) ----
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

  const df = (cond: boolean) => (!cond ? <span className="demoflag">sample</span> : null)

  return (
    <>
      <div className="trio">
        <div className="stat"><div className="k">Readiness</div><div className="n num">{readyScore}</div><div className="d up">{live ? 'live' : 'sample'}</div></div>
        <div className="stat"><div className="k">Weekly hours</div><div className="n num">{hours.toFixed(1)}</div><div className="d neutral">last 7 days</div></div>
        <div className="stat"><div className="k">Load · TSS</div><div className="n num">{tss}</div><div className="d neutral">last 7 days</div></div>
      </div>

      <div className="card" style={{ marginTop: 18 }}>
        <div className="chead">
          <div className="t"><h3 className="ct">Fitness &amp; Fatigue{df(hasTrend)}</h3></div>
          <span className="meta">90 DAYS</span>
        </div>
        <div className="trio" style={{ marginBottom: 16 }}>
          <div className="stat"><div className="k">CTL · Fitness</div><div className="n num">{cur.ctl}</div><div className="d up">chronic load</div></div>
          <div className="stat"><div className="k">ATL · Fatigue</div><div className="n num">{cur.atl}</div><div className="d warn">acute load</div></div>
          <div className="stat"><div className="k">TSB · Form</div><div className="n num">{cur.tsb > 0 ? `+${cur.tsb}` : cur.tsb}</div><div className="d neutral">{tsbLabel}</div></div>
        </div>
        <Trend ctl={ctl} atl={atl} />
        <div className="legend">
          <i><b style={{ background: '#5B8DEF' }} />Fitness (CTL)</i>
          <i><b style={{ background: '#E08F2A' }} />Fatigue (ATL)</i>
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: 18 }}>
        <div className="card">
          <div className="chead"><div className="t"><h3 className="ct">Weekly Volume{df(hasVol)}</h3></div><span className="meta">8 WEEKS</span></div>
          <div className="vbars">
            {vol.map((v, i) => (
              <div key={i} className={`vb${v === volMax ? ' peak' : ''}`}>
                <div className="bar" style={{ height: `${(v / volMax) * 100}%` }} />
                <span className="vl num">{v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="chead"><div className="t"><h3 className="ct">Training Zones{df(hasZones)}</h3></div><span className="meta">30 DAYS · HR</span></div>
          <div className="zbar">{zones.map((z: any) => <span key={z.z} style={{ background: z.c, width: `${z.p}%` }} />)}</div>
          {zones.map((z: any) => (
            <div className="zrow" key={z.z}>
              <span className="sw" style={{ background: z.c }} />
              <span className="zn">{z.z} · {z.n}</span>
              <span className="zh">{z.h.toFixed(1)}h</span>
              <span className="zp">{z.p}%</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

function Trend({ ctl, atl }: { ctl: number[]; atl: number[] }) {
  const W = 720, H = 180, pad = 8, padB = 16, padT = 10
  const all = ctl.concat(atl), min = Math.min(...all) - 6, max = Math.max(...all) + 4
  const span = max - min || 1
  const y = (v: number) => (H - padB) - ((v - min) / span) * (H - padT - padB)
  const pts = (arr: number[]): Pt[] => arr.map((v, i) => [sx(i, arr.length, W, pad), y(v)])
  const series = (arr: number[], col: string, id: string) => {
    const P = pts(arr), line = smooth(P), last = P[P.length - 1]
    return (
      <g key={id}>
        <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={col} stopOpacity={0.16} /><stop offset="100%" stopColor={col} stopOpacity={0} /></linearGradient></defs>
        <path className="area" d={`${line} L ${P[P.length - 1][0]} ${H - padB} L ${P[0][0]} ${H - padB} Z`} fill={`url(#${id})`} />
        <path className="draw" d={line} fill="none" stroke={col} strokeWidth={2.4} strokeLinecap="round" pathLength={1} style={drawStyle} />
        <circle className="area" cx={last[0]} cy={last[1]} r={3.4} fill="var(--surface)" stroke={col} strokeWidth={2} />
      </g>
    )
  }
  return (
    <svg className="chart" style={{ height: 180 }} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      {[0, 1, 2].map((g) => { const yy = padT + g * ((H - padT - padB) / 2); return <line key={g} x1={pad} y1={yy} x2={W - pad} y2={yy} stroke="var(--line-2)" strokeWidth={1} /> })}
      {series(atl, '#E08F2A', 'patl')}
      {series(ctl, '#5B8DEF', 'pctl')}
    </svg>
  )
}
