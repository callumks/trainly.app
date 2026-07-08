import { db } from '@/lib/supabase'

export type CoachContext = {
  ftp: number | null
  ftpEstimated: boolean
  weeklyHours: number
  weeklyTSS: number
  ctl: number
  atl: number
  tsb: number
  readiness: number
  readinessFlag: 'fresh' | 'balanced' | 'fatigued'
  recent: { name: string; type: string; date: string; miles: number | null; mins: number; tss: number | null }[]
  sports: { type: string; hours: number }[]
  hasData: boolean
}

const dayKey = (d: Date) => d.toISOString().slice(0, 10)

// Single source of truth for readiness: blends form (TSB, 70%) with load spikiness
// (acute:chronic ratio, 30%) so it can't say "98/100" while TSB shows deep fatigue.
export function computeReadiness(tsb: number, ratio: number): number {
  const formScore = Math.max(0, Math.min(100, 70 + 2 * tsb))
  const ratioScore = Math.max(0, Math.min(100, 100 - Math.abs(ratio - 1) * 60))
  return Math.round(0.7 * formScore + 0.3 * ratioScore)
}

export async function buildCoachContext(userId: string): Promise<CoachContext> {
  // profile FTP
  const pm = (await db.query('SELECT metadata FROM profiles WHERE id=$1', [userId])).rows?.[0]?.metadata || {}

  // daily TSS / seconds over 180d → EWMA fitness/fatigue + weekly + chronic
  const daily = (await db.query(
    `SELECT (date_trunc('day', start_date))::date AS d,
            SUM(COALESCE((metadata->'computed'->>'tss')::float,0)) AS tss,
            SUM(COALESCE(moving_time,0)) AS secs
     FROM strava_activities WHERE user_id=$1 AND start_date >= NOW() - interval '180 days'
     GROUP BY 1 ORDER BY 1`, [userId]
  )).rows

  let ctl = 0, atl = 0, weeklyTSS = 0, weeklySecs = 0, acute = 0, chronic = 0
  if (daily.length) {
    const map = new Map<string, number>()
    for (const r of daily) map.set(dayKey(new Date(r.d)), Number(r.tss) || 0)
    const start = new Date(daily[0].d), today = new Date()
    for (let dt = new Date(start); dt <= today; dt.setDate(dt.getDate() + 1)) {
      const tss = map.get(dayKey(dt)) || 0
      ctl += (tss - ctl) / 42
      atl += (tss - atl) / 7
    }
    const now = Date.now()
    for (const r of daily) {
      const ageDays = (now - new Date(r.d).getTime()) / 86400000
      if (ageDays <= 7) { weeklyTSS += Number(r.tss) || 0; weeklySecs += Number(r.secs) || 0; acute += Number(r.tss) || 0 }
      if (ageDays <= 28) chronic += Number(r.tss) || 0
    }
    chronic = chronic / 4
  }
  const tsb = Math.round(ctl - atl)
  const ratio = chronic > 0 ? acute / chronic : 1
  const readiness = computeReadiness(tsb, ratio)
  const readinessFlag: CoachContext['readinessFlag'] = tsb >= 5 ? 'fresh' : tsb <= -15 ? 'fatigued' : 'balanced'

  const recent = (await db.query(
    `SELECT name, type, start_date, distance, moving_time, (metadata->'computed'->>'tss')::int AS tss
     FROM strava_activities WHERE user_id=$1 ORDER BY start_date DESC LIMIT 5`, [userId]
  )).rows.map((r: any) => ({
    name: r.name, type: r.type, date: new Date(r.start_date).toISOString(),
    miles: r.distance ? Math.round((r.distance / 1609.344) * 10) / 10 : null,
    mins: Math.round((r.moving_time || 0) / 60), tss: r.tss ?? null,
  }))

  const sports = (await db.query(
    `SELECT type, SUM(COALESCE(moving_time,0)) AS secs FROM strava_activities
     WHERE user_id=$1 AND start_date >= NOW() - interval '90 days' GROUP BY 1 ORDER BY 2 DESC LIMIT 6`, [userId]
  )).rows.map((r: any) => ({ type: r.type, hours: Math.round((Number(r.secs) / 3600) * 10) / 10 }))

  return {
    ftp: pm.ftp ?? null,
    ftpEstimated: !!pm.ftp_estimated,
    weeklyHours: Math.round((weeklySecs / 3600) * 10) / 10,
    weeklyTSS: Math.round(weeklyTSS),
    ctl: Math.round(ctl), atl: Math.round(atl), tsb,
    readiness, readinessFlag,
    recent, sports,
    hasData: daily.length > 0,
  }
}

// Facts block fed to the LLM (or used by the rule engine)
export function contextSummary(c: CoachContext): string {
  const now = new Date()
  const ago = (iso: string) => {
    const mins = Math.max(0, Math.round((now.getTime() - new Date(iso).getTime()) / 60000))
    if (mins < 90) return `${mins}min ago`
    if (mins < 36 * 60) return `${Math.round(mins / 60)}h ago`
    return `${Math.round(mins / 1440)}d ago`
  }
  const sports = c.sports.map((s) => `${s.type} ${s.hours}h`).join(', ') || 'none'
  const recent = c.recent.map((r, i) =>
    `${i === 0 ? 'MOST RECENT: ' : ''}${r.type} "${r.name}" — ${ago(r.date)} (${r.mins}min${r.miles ? `, ${r.miles}mi` : ''}${r.tss != null ? `, ${r.tss} TSS` : ''})`
  ).join('; ') || 'none'
  return [
    `Now: ${now.toLocaleString('en-GB', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}.`,
    `FTP: ${c.ftp ? `${c.ftp}W${c.ftpEstimated ? ' (estimated)' : ''}` : 'not set'}`,
    `Fitness (CTL): ${c.ctl}. Fatigue (ATL): ${c.atl}. Form (TSB): ${c.tsb > 0 ? '+' : ''}${c.tsb} (${c.readinessFlag}).`,
    `Readiness: ${c.readiness}/100.`,
    `This week: ${c.weeklyHours}h, ${c.weeklyTSS} TSS.`,
    `Last 90 days by sport: ${sports}.`,
    `Recent sessions: ${recent}.`,
  ].join('\n')
}

// Grounded rule-based responder — works with no LLM key. Real data, no hallucination.
export function ruleReply(message: string, c: CoachContext): string {
  const m = message.toLowerCase()
  if (!c.hasData) return "I don't see any training data yet — connect Strava on your Profile and sync, then I can actually coach you."

  const climbHours = c.sports.find((s) => /climb|boulder/i.test(s.type))?.hours || 0
  const formLine = `Your form's at TSB ${c.tsb > 0 ? '+' : ''}${c.tsb} (${c.readinessFlag}), readiness ${c.readiness}/100.`

  // what should I do today / session recommendation
  if (/today|what should i|workout|session|train now|ride today/.test(m)) {
    if (c.tsb <= -20 || c.readinessFlag === 'fatigued') return `${formLine} You're deep in the hole — take a rest day or a very easy spin. Pushing now just digs the hole deeper. ${climbHours > 1 ? "Your legs are also carrying recent climbing load, so be honest about how fresh they feel." : ''}`.trim()
    if (c.tsb <= -8) return `${formLine} Keep it endurance today — steady Z2, nothing above tempo. Save the hard efforts until your form climbs back toward zero.`
    if (c.tsb >= 8) return `${formLine} You're fresh — a great day for quality: threshold or VO₂ intervals, or a hard group ride. Make it count.`
    return `${formLine} Balanced day — train as planned. A tempo or threshold session is well within reach; just don't turn it into a max day.`
  }
  // overtraining / fatigue
  if (/overtrain|tired|fatigu|rest|recover|burn|sore/.test(m)) {
    if (c.tsb <= -15) return `Yes — you're carrying real fatigue (TSB ${c.tsb}, ATL ${c.atl} vs CTL ${c.ctl}). That's fine short-term if it's intentional, but 1–2 easy days will let the fitness actually stick. Watch sleep and appetite.`
    return `You're not overreaching — TSB ${c.tsb > 0 ? '+' : ''}${c.tsb}, readiness ${c.readiness}. Load looks sustainable. Keep stacking consistent weeks.`
  }
  // how am I doing / fitness / form / status
  if (/how am i|how'?s my|form|fitness|doing|status|progress/.test(m)) {
    return `${formLine} Fitness (CTL) is ${c.ctl} and climbing; you've done ${c.weeklyHours}h / ${c.weeklyTSS} TSS this week. ${c.tsb < -8 ? "You're loading hard right now — make sure recovery keeps pace." : "Solid, sustainable place to be."}`
  }
  // ftp / power
  if (/ftp|power|watt|threshold/.test(m)) {
    return c.ftp ? `Your FTP is ${c.ftp}W${c.ftpEstimated ? ' (estimated from your best 20-min power — set a real one in Profile for accuracy)' : ''}. Everything power-based — TSS, zones, targets — keys off this.` : `You don't have an FTP set yet. Do a 20-min test or set it in Profile, and I'll anchor your zones and load to it.`
  }
  // last week / this week / volume
  if (/last week|this week|volume|hours|how much/.test(m)) {
    return `This week: ${c.weeklyHours}h and ${c.weeklyTSS} TSS. Across the last 90 days you're spread over ${c.sports.map((s) => `${s.type} (${s.hours}h)`).join(', ')}.`
  }
  // climbing / hybrid
  if (/climb|boulder|hybrid|strength|lift/.test(m)) {
    return climbHours > 0
      ? `You've logged ${climbHours}h of climbing in the last 90 days alongside your riding. That upper-body/forearm load doesn't show in bike TSS but it does cost recovery — when you've climbed hard, treat the next bike day as a touch easier.`
      : `No climbing logged recently — it's all bike right now. When you do mix in climbing/strength, I'll factor that load into your bike recommendations.`
  }
  // fallback — grounded status + nudge
  return `${formLine} You're at ${c.weeklyHours}h / ${c.weeklyTSS} TSS this week. Ask me what to do today, whether you're overtraining, or how your form's trending — I'll answer from your real numbers.`
}
