import { db } from '@/lib/supabase'
import { matchCompletedSessions } from '@/lib/plan-engine'

type StravaTokenResponse = {
  access_token: string
  refresh_token: string
  expires_at: number
  athlete?: { id: number }
}

const STRAVA_API = 'https://www.strava.com/api/v3'

export async function exchangeAuthCodeForTokens(params: {
  code: string; redirectUri: string; clientId?: string; clientSecret?: string
}): Promise<StravaTokenResponse> {
  const client_id = params.clientId || process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID
  const client_secret = params.clientSecret || process.env.STRAVA_CLIENT_SECRET
  if (!client_id || !client_secret) throw new Error('Missing Strava client credentials')
  const res = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id, client_secret, code: params.code, grant_type: 'authorization_code', redirect_uri: params.redirectUri }),
  })
  if (!res.ok) throw new Error('Failed to exchange Strava code')
  return (await res.json()) as StravaTokenResponse
}

export async function refreshStravaTokens(refreshToken: string): Promise<StravaTokenResponse> {
  const client_id = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID
  const client_secret = process.env.STRAVA_CLIENT_SECRET
  if (!client_id || !client_secret) throw new Error('Missing Strava client credentials')
  const res = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id, client_secret, refresh_token: refreshToken, grant_type: 'refresh_token' }),
  })
  if (!res.ok) throw new Error('Failed to refresh Strava token')
  return (await res.json()) as StravaTokenResponse
}

class RateLimitError extends Error {}

// Authorized GET against the Strava API, with a single transparent token refresh on 401.
class StravaClient {
  token: string
  refresh: string | null
  userId: string
  reqs = 0
  constructor(userId: string, token: string, refresh: string | null) { this.userId = userId; this.token = token; this.refresh = refresh }

  async get(path: string): Promise<any> {
    this.reqs++
    let res = await fetch(`${STRAVA_API}${path}`, { headers: { Authorization: `Bearer ${this.token}` } })
    if (res.status === 401 && this.refresh) {
      const r = await refreshStravaTokens(this.refresh)
      this.token = r.access_token; this.refresh = r.refresh_token
      await db.query('UPDATE profiles SET strava_access_token=$1, strava_refresh_token=$2 WHERE id=$3', [this.token, this.refresh, this.userId])
      res = await fetch(`${STRAVA_API}${path}`, { headers: { Authorization: `Bearer ${this.token}` } })
    }
    if (res.status === 429) throw new RateLimitError('Strava rate limit reached')
    if (res.status === 401) throw new Error('unauthorized')
    if (!res.ok) throw new Error(`Strava ${res.status} for ${path}`)
    return res.json()
  }
}

// Proper training-load: power-based (NP/FTP) when available, else Relative Effort, else heuristic.
function computeLoad(a: any, ftp: number): { tss: number; if: number; method: string } {
  const sec = Number(a?.moving_time || 0)
  if (!sec) return { tss: 0, if: 0, method: 'none' }
  const np = Number(a?.weighted_average_watts || a?.average_watts || 0)
  if (np > 0 && ftp > 0) {
    const intf = np / ftp
    return { tss: Math.round(((sec * intf * intf) / 3600) * 100), if: Math.round(intf * 100) / 100, method: 'power' }
  }
  if (a?.suffer_score != null) return { tss: Math.round(Number(a.suffer_score)), if: 0, method: 'effort' }
  return { tss: Math.round(((sec * 0.49) / 3600) * 100), if: 0, method: 'estimate' }
}

// best average power over each window (assumes ~1Hz watts stream)
function bestEfforts(watts: number[]): Record<string, number> {
  const windows = [5, 60, 300, 1200, 3600]
  const out: Record<string, number> = {}
  const n = watts.length
  const prefix = new Array(n + 1).fill(0)
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + (Number(watts[i]) || 0)
  for (const w of windows) {
    if (n < w) continue
    let best = 0
    for (let i = w; i <= n; i++) best = Math.max(best, (prefix[i] - prefix[i - w]) / w)
    if (best > 0) out[String(w)] = Math.round(best)
  }
  return out
}

export async function syncStravaActivitiesForUser(userId: string): Promise<{
  inserted: number; updated: number; ftp: number | null; ftpEstimated: boolean; enrichedZones: number; powerCurve: Record<string, number> | null; requests: number; rateLimited: boolean
}> {
  const profileRes = await db.query('SELECT strava_access_token, strava_refresh_token FROM profiles WHERE id = $1', [userId])
  let accessToken = (profileRes.rows[0]?.strava_access_token as string | null) || process.env.STRAVA_ACCESS_TOKEN || null
  const refreshToken = (profileRes.rows[0]?.strava_refresh_token as string | null) || process.env.STRAVA_REFRESH_TOKEN || null
  if (!accessToken) throw new Error('No Strava tokens found for user')

  const c = new StravaClient(userId, accessToken, refreshToken)
  let rateLimited = false

  // 1) Athlete profile → FTP / weight (only overwrite FTP when Strava actually has one)
  let realFtp = 0
  try {
    const ath = await c.get('/athlete')
    realFtp = Number(ath?.ftp) || 0
    const meta: any = {
      weight: ath?.weight ?? null,
      athlete: { firstname: ath?.firstname, lastname: ath?.lastname, sex: ath?.sex, city: ath?.city, country: ath?.country },
      athlete_synced_at: new Date().toISOString(),
    }
    if (realFtp > 0) { meta.ftp = realFtp; meta.ftp_estimated = false }
    await db.query(`UPDATE profiles SET metadata = COALESCE(metadata,'{}'::jsonb) || $2::jsonb WHERE id=$1`, [userId, JSON.stringify(meta)])
  } catch (e) { if (e instanceof RateLimitError) rateLimited = true; /* continue without ftp */ }

  // 2) Paginate ALL activities
  const all: any[] = []
  for (let page = 1; page <= 6 && !rateLimited; page++) {
    let batch: any[] = []
    try {
      batch = await c.get(`/athlete/activities?per_page=200&page=${page}`)
    } catch (e) { if (e instanceof RateLimitError) { rateLimited = true; break } else throw e }
    all.push(...batch)
    if (batch.length < 200) break
  }

  // 3) Upsert with proper TSS
  let inserted = 0, updated = 0
  for (const a of all) {
    const load = computeLoad(a, realFtp)
    a.computed = { ...(a.computed || {}), tss: load.tss, if: load.if, method: load.method }
    const values = [
      userId, String(a.id), a.name || 'Activity', a.type || 'Workout', a.distance ?? null, a.moving_time ?? null,
      a.elapsed_time ?? null, a.total_elevation_gain ?? null, a.start_date, a.average_speed ?? null, a.max_speed ?? null,
      a.average_heartrate != null ? Math.round(Number(a.average_heartrate)) : null,
      a.max_heartrate != null ? Math.round(Number(a.max_heartrate)) : null,
      a.suffer_score != null ? Math.round(Number(a.suffer_score)) : null,
      JSON.stringify(a),
    ]
    const result = await db.query(
      `INSERT INTO strava_activities (user_id, strava_id, name, type, distance, moving_time, elapsed_time, total_elevation_gain, start_date, average_speed, max_speed, average_heartrate, max_heartrate, suffer_score, metadata)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
       ON CONFLICT (strava_id) DO UPDATE SET name=EXCLUDED.name, type=EXCLUDED.type, distance=EXCLUDED.distance,
         moving_time=EXCLUDED.moving_time, elapsed_time=EXCLUDED.elapsed_time, total_elevation_gain=EXCLUDED.total_elevation_gain,
         start_date=EXCLUDED.start_date, average_speed=EXCLUDED.average_speed, max_speed=EXCLUDED.max_speed,
         average_heartrate=EXCLUDED.average_heartrate, max_heartrate=EXCLUDED.max_heartrate, suffer_score=EXCLUDED.suffer_score,
         metadata = strava_activities.metadata || EXCLUDED.metadata
       RETURNING xmax = 0 AS inserted`,
      values
    )
    if (result.rows[0]?.inserted) inserted++; else updated++
  }

  // 4) Enrich recent activities with real time-in-zone — store FULL buckets ({min,max,time})
  //    for both HR and power so the distribution can be mapped to true zones.
  let enrichedZones = 0
  if (!rateLimited) {
    const recent = await db.query(
      `SELECT strava_id FROM strava_activities
       WHERE user_id=$1 AND start_date >= NOW() - interval '45 days'
         AND (metadata->'computed'->'zones') IS NULL
       ORDER BY start_date DESC LIMIT 50`,
      [userId]
    )
    for (const r of recent.rows) {
      if (c.reqs > 90) break
      try {
        const zones = await c.get(`/activities/${r.strava_id}/zones`)
        const pick = (t: string) => {
          const z = Array.isArray(zones) ? zones.find((x: any) => x.type === t) : null
          return z?.distribution_buckets?.map((b: any) => ({ min: Number(b.min), max: Number(b.max), time: Number(b.time) || 0 })) || null
        }
        const payload = { hr: pick('heartrate'), pwr: pick('power') }
        await db.query(
          `UPDATE strava_activities SET metadata = jsonb_set(metadata, '{computed,zones}', $2::jsonb, true) WHERE strava_id=$1 AND user_id=$3`,
          [String(r.strava_id), JSON.stringify(payload), userId]
        )
        if (payload.hr || payload.pwr) enrichedZones++
      } catch (e) { if (e instanceof RateLimitError) { rateLimited = true; break } /* skip this one */ }
    }
  }

  // 5) Power-duration curve from streams of recent power rides
  let powerCurve: Record<string, number> | null = null
  if (!rateLimited) {
    const rides = await db.query(
      `SELECT strava_id FROM strava_activities
       WHERE user_id=$1 AND type='Ride' AND metadata->>'device_watts'='true'
         AND start_date >= NOW() - interval '90 days'
       ORDER BY start_date DESC LIMIT 15`,
      [userId]
    )
    const agg: Record<string, number> = {}
    for (const r of rides.rows) {
      if (c.reqs > 95) break
      try {
        const s = await c.get(`/activities/${r.strava_id}/streams?keys=watts&key_by_type=true`)
        const watts = s?.watts?.data
        if (Array.isArray(watts) && watts.length) {
          const be = bestEfforts(watts)
          for (const k in be) agg[k] = Math.max(agg[k] || 0, be[k])
        }
      } catch (e) { if (e instanceof RateLimitError) { rateLimited = true; break } }
    }
    if (Object.keys(agg).length) {
      powerCurve = agg
      await db.query(`UPDATE profiles SET metadata = COALESCE(metadata,'{}'::jsonb) || $2::jsonb WHERE id=$1`, [userId, JSON.stringify({ powerCurve: agg, powerCurve_synced_at: new Date().toISOString() })])
    }
  }

  // 6) Finalize FTP: Strava's real value wins → else a MANUAL value is kept as-is →
  //    else estimate from the power curve → else keep whatever's stored.
  const pm = await db.query(`SELECT (metadata->>'ftp')::int AS ftp, (metadata->>'ftp_estimated')::boolean AS est FROM profiles WHERE id=$1`, [userId])
  const storedFtp = Number(pm.rows?.[0]?.ftp) || 0
  const storedIsManual = storedFtp > 0 && pm.rows?.[0]?.est === false
  let effectiveFtp = realFtp
  if (effectiveFtp <= 0 && storedIsManual) effectiveFtp = storedFtp
  if (effectiveFtp <= 0 && powerCurve && powerCurve['1200']) effectiveFtp = Math.round(0.95 * powerCurve['1200'])
  if (effectiveFtp <= 0) effectiveFtp = storedFtp
  if (effectiveFtp > 0 && realFtp <= 0 && !storedIsManual && effectiveFtp !== storedFtp) {
    await db.query(`UPDATE profiles SET metadata = COALESCE(metadata,'{}'::jsonb) || $2::jsonb WHERE id=$1`, [userId, JSON.stringify({ ftp: effectiveFtp, ftp_estimated: true })])
  }
  if (effectiveFtp > 0) {
    await db.query(
      `UPDATE strava_activities SET metadata = jsonb_set(metadata, '{computed,tss}',
         to_jsonb( round( (moving_time * power((metadata->>'weighted_average_watts')::float / $2, 2)) / 3600.0 * 100 )::int ), true)
       WHERE user_id=$1 AND metadata->>'weighted_average_watts' IS NOT NULL AND COALESCE(moving_time,0) > 0`,
      [userId, effectiveFtp]
    )
  }

  // Mark planned sessions completed when a matching activity landed on the same day
  try { await matchCompletedSessions(userId) } catch { /* non-fatal */ }

  await db.query(`UPDATE profiles SET metadata = COALESCE(metadata,'{}'::jsonb) || $2::jsonb WHERE id=$1`, [userId, JSON.stringify({ last_synced_at: new Date().toISOString() })])

  return { inserted, updated, ftp: effectiveFtp || null, ftpEstimated: realFtp <= 0 && !storedIsManual, enrichedZones, powerCurve, requests: c.reqs, rateLimited }
}

// Returns the profile's last sync time, or null if never synced.
export async function getLastSyncedAt(userId: string): Promise<string | null> {
  const r = await db.query(`SELECT metadata->>'last_synced_at' AS t FROM profiles WHERE id=$1`, [userId])
  return r.rows?.[0]?.t || null
}
