import { db } from '@/lib/supabase'
import { computeIfTss, updateLoad } from '@/lib/metrics'

type Json = any

async function ensureMemoryTables(): Promise<void> {
  await db.query(`
    CREATE TABLE IF NOT EXISTS memory_dossier (
      user_id UUID PRIMARY KEY,
      data JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS memory_digest (
      user_id UUID PRIMARY KEY,
      data JSONB NOT NULL,
      generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS memory_conversation (
      user_id UUID PRIMARY KEY,
      bullets JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS decision_log (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL,
      at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      actions JSONB,
      messages JSONB,
      range JSONB
    );
  `)
}

function trimBytes<T extends object>(obj: T, maxBytes: number, dropOrder: string[][]): T {
  let s = Buffer.from(JSON.stringify(obj))
  if (s.length <= maxBytes) return obj
  const clone: any = JSON.parse(s.toString())
  for (const path of dropOrder) {
    let ref: any = clone
    for (let i = 0; i < path.length - 1; i++) {
      if (ref == null) break
      ref = ref[path[i]]
    }
    const last = path[path.length - 1]
    if (ref && last in ref) {
      delete ref[last]
    }
    s = Buffer.from(JSON.stringify(clone))
    if (s.length <= maxBytes) return clone
  }
  return clone
}

export async function buildAthleteDossier(userId: string): Promise<Json> {
  await ensureMemoryTables()
  const prof = await db.query(
    `SELECT full_name, email, goals, sports, experience_level, weekly_volume
     FROM profiles WHERE id = $1`,
    [userId]
  )
  const p = prof.rows[0] || {}

  const dossier: any = {
    id: userId,
    name: p.full_name || null,
    email: p.email || null,
    weeklyHoursTarget: p.weekly_volume || null,
    sportsEmphasis: null,
    goals: p.goals ? { primary: p.goals[0] || null, secondary: p.goals.slice(1) || [] } : null,
    thresholds: {},
    schedulePrefs: null,
    constraints: [],
    nutritionPrefs: null,
    lastUpdated: new Date().toISOString(),
  }

  // Cap ~2 KB
  const capped = trimBytes(dossier, 2 * 1024, [
    ['email'],
    ['goals','secondary'],
  ])

  await db.query(
    `INSERT INTO memory_dossier(user_id, data, updated_at)
     VALUES ($1,$2,NOW())
     ON CONFLICT (user_id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
    [userId, capped]
  )
  return capped
}

export async function buildRollingDigest(userId: string): Promise<Json> {
  await ensureMemoryTables()
  // Fetch last 90 days activities
  const since = new Date(); since.setDate(since.getDate() - 90)
  const acts = await db.query(
    `SELECT start_date, moving_time, average_power, metadata
     FROM strava_activities WHERE user_id = $1 AND start_date >= $2
     ORDER BY start_date ASC`,
    [userId, since.toISOString()]
  )

  // Aggregate TSS by day
  const dayMap = new Map<string, number>()
  for (const a of acts.rows) {
    const d = new Date(a.start_date); const key = d.toISOString().slice(0,10)
    const tss = a.metadata?.computed?.tss ?? computeIfTss({
      movingSec: a.moving_time || 0,
      avgPower: a.average_power || null,
      ftpW: null,
    }).tss
    dayMap.set(key, (dayMap.get(key) || 0) + (tss || 0))
  }

  // Compute rolling CTL/ATL/TSB forward
  const days: string[] = Array.from({ length: 90 }).map((_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (89 - i)); return d.toISOString().slice(0,10)
  })
  let ctl = 0, atl = 0
  const todayKey = new Date().toISOString().slice(0,10)
  for (const day of days) {
    const tss = dayMap.get(day) || 0
    const load = updateLoad({ ctl, atl }, tss)
    ctl = load.ctl; atl = load.atl
  }
  const tsb = ctl - atl

  // Aggregates
  const sumRange = (n: number) => days.slice(-n).reduce((s, d) => s + (dayMap.get(d) || 0), 0)
  const digest: any = {
    ctl: Math.round(ctl),
    atl: Math.round(atl),
    tsb: Math.round(tsb),
    tss7: Math.round(sumRange(7)),
    tss28: Math.round(sumRange(28)),
    tss90: Math.round(sumRange(90)),
    timeInZonesPct: null,
    loadBySport: null,
    compliancePct: null,
    monotony: null,
    strain: null,
    recentPRs: [],
    recentFlags: {},
    generatedAt: new Date().toISOString(),
  }

  // Cap ~2.5 KB
  const capped = trimBytes(digest, 2500, [
    ['recentFlags'],
    ['loadBySport'],
    ['recentPRs'],
  ])

  await db.query(
    `INSERT INTO memory_digest(user_id, data, generated_at)
     VALUES ($1,$2,NOW())
     ON CONFLICT (user_id) DO UPDATE SET data = EXCLUDED.data, generated_at = NOW()`,
    [userId, capped]
  )
  return capped
}

export async function updateConversationMemory(userId: string, userMsg: string, coachMsg: string): Promise<string[]> {
  await ensureMemoryTables()
  const res = await db.query('SELECT bullets FROM memory_conversation WHERE user_id = $1', [userId])
  let bullets: string[] = res.rows[0]?.bullets || []

  // Heuristic extraction: pick durable preferences keywords
  const candidates: string[] = []
  const text = `${userMsg} ${coachMsg}`.toLowerCase()
  if (/long ride saturday/.test(text)) candidates.push('Prefers long ride Saturday')
  if (/avoid plyo|achilles/.test(text)) candidates.push('Avoid plyos (achilles)')

  // Merge with de-dupe
  for (const c of candidates) {
    if (!bullets.includes(c)) bullets.unshift(c)
  }
  // Keep max 6
  bullets = bullets.slice(0,6)

  await db.query(
    `INSERT INTO memory_conversation(user_id, bullets, updated_at)
     VALUES ($1,$2,NOW())
     ON CONFLICT (user_id) DO UPDATE SET bullets = EXCLUDED.bullets, updated_at = NOW()`,
    [userId, JSON.stringify(bullets)]
  )
  return bullets
}

export async function buildCoachPacket(userId: string, weekStart: string): Promise<Json> {
  await ensureMemoryTables()
  const [dossierRes, digestRes, sessionsRes, convRes] = await Promise.all([
    db.query('SELECT data FROM memory_dossier WHERE user_id = $1', [userId]),
    db.query('SELECT data FROM memory_digest WHERE user_id = $1', [userId]),
    db.query(
      `SELECT id, date, session_type AS sport, name, intensity FROM training_sessions
       WHERE user_id = $1 AND date >= $2 AND date < ($2::date + INTERVAL '7 day')
       ORDER BY date ASC`,
      [userId, weekStart]
    ),
    db.query('SELECT bullets FROM memory_conversation WHERE user_id = $1', [userId])
  ])

  const packet: any = {
    dossier: dossierRes.rows[0]?.data || null,
    digest: digestRes.rows[0]?.data || null,
    planWindow: {
      weekStart,
      sessions: sessionsRes.rows.map((s: any) => ({ id: s.id, date: s.date, sport: s.sport, name: s.name }))
    },
    todayContext: null,
    conversation: (convRes.rows[0]?.bullets || []) as string[],
  }

  // Size cap 6KB with drop order
  const capped = trimBytes(packet, 6 * 1024, [
    ['digest','recentPRs'],
    ['digest','recentFlags'],
    ['digest','loadBySport'],
    ['dossier','goals','secondary'],
  ])
  return capped
}

export async function appendDecisionLog(userId: string, entry: { actions?: Json; messages?: Json; range?: Json }) {
  await ensureMemoryTables()
  await db.query(
    'INSERT INTO decision_log(user_id, actions, messages, range) VALUES ($1,$2,$3,$4)',
    [userId, entry.actions || null, entry.messages || null, entry.range || null]
  )
}

