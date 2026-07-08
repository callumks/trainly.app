import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { db } from '@/lib/supabase'
import { computeReadiness } from '@/lib/coach'

export const dynamic = 'force-dynamic'

const dayKey = (d: Date) => d.toISOString().slice(0, 10)

export async function GET() {
  try {
    const token = cookies().get('auth-token')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const secret = process.env.JWT_SECRET || 'your-secret-key-change-this'
    const { userId } = jwt.verify(token, secret) as { userId: string }

    // ---- daily TSS (180d) → CTL/ATL EWMA ----
    const tssRes = await db.query(
      `SELECT (date_trunc('day', start_date))::date AS d,
              SUM(COALESCE((metadata->'computed'->>'tss')::float, 0)) AS tss
       FROM strava_activities
       WHERE user_id=$1 AND start_date >= NOW() - interval '180 days'
       GROUP BY 1 ORDER BY 1`,
      [userId]
    )

    let trend: { ctl: number[]; atl: number[] } | null = null
    let current: { ctl: number; atl: number; tsb: number } | null = null
    let readinessTrend: number[] | null = null

    if (tssRes.rows.length > 0) {
      const map = new Map<string, number>()
      for (const r of tssRes.rows) map.set(dayKey(new Date(r.d)), Number(r.tss) || 0)
      const start = new Date(tssRes.rows[0].d)
      const today = new Date()
      let ctl = 0, atl = 0
      const series: { ctl: number; atl: number }[] = []
      for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
        const tss = map.get(dayKey(d)) || 0
        ctl += (tss - ctl) / 42
        atl += (tss - atl) / 7
        series.push({ ctl, atl })
      }
      const last90 = series.slice(-90)
      // downsample to ~30 points for a clean chart
      const step = Math.max(1, Math.ceil(last90.length / 30))
      const sampled = last90.filter((_, i) => i % step === 0)
      if (sampled[sampled.length - 1] !== last90[last90.length - 1]) sampled.push(last90[last90.length - 1])
      trend = { ctl: sampled.map((p) => Math.round(p.ctl)), atl: sampled.map((p) => Math.round(p.atl)) }
      readinessTrend = series.slice(-7).map((p) => {
        const ratio = p.ctl > 0 ? p.atl / p.ctl : 1
        return computeReadiness(Math.round(p.ctl - p.atl), ratio)
      })
      const tail = series[series.length - 1]
      current = { ctl: Math.round(tail.ctl), atl: Math.round(tail.atl), tsb: Math.round(tail.ctl - tail.atl) }
    }

    // ---- weekly volume (last 8 weeks) ----
    const wkRes = await db.query(
      `SELECT (date_trunc('week', start_date))::date AS wk, SUM(COALESCE(moving_time, 0)) AS secs
       FROM strava_activities WHERE user_id=$1 AND start_date >= NOW() - interval '56 days'
       GROUP BY 1 ORDER BY 1`,
      [userId]
    )
    let weeklyVolume: { label: string; hours: number }[] | null = null
    if (wkRes.rows.length > 0) {
      const wkMap = new Map<string, number>()
      for (const r of wkRes.rows) wkMap.set(dayKey(new Date(r.wk)), Number(r.secs) || 0)
      const out: { label: string; hours: number }[] = []
      const now = new Date()
      const thisMonday = new Date(now); thisMonday.setDate(now.getDate() - ((now.getDay() + 6) % 7))
      for (let i = 7; i >= 0; i--) {
        const wk = new Date(thisMonday); wk.setDate(thisMonday.getDate() - i * 7)
        const secs = wkMap.get(dayKey(wk)) || 0
        out.push({ label: wk.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }), hours: Math.round((secs / 3600) * 10) / 10 })
      }
      weeklyVolume = out
    }

    // ---- zone distribution (30d): power-based (Coggan vs FTP) preferred, then HR time-in-zone ----
    const ftpRow = await db.query(`SELECT (metadata->>'ftp')::float AS ftp FROM profiles WHERE id=$1`, [userId])
    const ftpZ = Number(ftpRow.rows?.[0]?.ftp) || 0

    let zones: { z: string; h: number; p: number; real?: boolean; source?: string }[] | null = null
    const zres = await db.query(
      `SELECT metadata->'computed'->'zones' AS z
       FROM strava_activities WHERE user_id=$1 AND start_date >= NOW() - interval '30 days'
         AND jsonb_typeof(metadata->'computed'->'zones') = 'object'`,
      [userId]
    )
    if (zres.rows.length > 0) {
      const buckets = [0, 0, 0, 0, 0]
      let usedPower = false, any = false
      for (const row of zres.rows) {
        const z = row.z
        if (z && Array.isArray(z.pwr) && z.pwr.length && ftpZ > 0) {
          usedPower = true; any = true
          for (const b of z.pwr) {
            const rep = b.max > 0 && b.max < 5000 ? (b.min + b.max) / 2 : b.min // bucket midpoint (or floor for open top bucket)
            const pct = (rep / ftpZ) * 100
            buckets[pct < 56 ? 0 : pct < 76 ? 1 : pct < 91 ? 2 : pct < 106 ? 3 : 4] += Number(b.time) || 0 // Z5 = Coggan Z5/6/7 (VO2+)
          }
        } else if (z && Array.isArray(z.hr) && z.hr.length) {
          any = true
          for (let i = 0; i < z.hr.length; i++) buckets[Math.min(i, 4)] += Number(z.hr[i].time) || 0
        }
      }
      const totalSec = buckets.reduce((s, v) => s + v, 0)
      if (any && totalSec > 0) zones = buckets.map((s, i) => ({ z: `Z${i + 1}`, h: Math.round((s / 3600) * 10) / 10, p: Math.round((s / totalSec) * 100), real: true, source: usedPower ? 'power' : 'hr' }))
    }

    // (b) fallback: approximate from each activity's average HR
    if (!zones) {
      const hrmaxRes = await db.query(`SELECT MAX(max_heartrate) AS hrmax FROM strava_activities WHERE user_id=$1`, [userId])
      const hrmax = Number(hrmaxRes.rows?.[0]?.hrmax) || 190
      const hrRes = await db.query(
        `SELECT average_heartrate AS hr, COALESCE(moving_time,0) AS secs
         FROM strava_activities WHERE user_id=$1 AND start_date >= NOW() - interval '30 days' AND average_heartrate IS NOT NULL`,
        [userId]
      )
      if (hrRes.rows.length > 0) {
        const buckets = [0, 0, 0, 0, 0]
        for (const r of hrRes.rows) {
          const pct = (Number(r.hr) / hrmax) * 100
          buckets[pct < 60 ? 0 : pct < 70 ? 1 : pct < 80 ? 2 : pct < 90 ? 3 : 4] += Number(r.secs) || 0
        }
        const totalSec = buckets.reduce((s, v) => s + v, 0)
        if (totalSec > 0) zones = buckets.map((s, i) => ({ z: `Z${i + 1}`, h: Math.round((s / 3600) * 10) / 10, p: Math.round((s / totalSec) * 100), real: false }))
      }
    }

    return NextResponse.json({ live: !!current, trend, current, readinessTrend, weeklyVolume, zones })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed' }, { status: 500 })
  }
}
