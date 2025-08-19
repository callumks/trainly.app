import { db } from '@/lib/supabase'

type StravaTokenResponse = {
  access_token: string
  refresh_token: string
  expires_at: number
  athlete?: { id: number }
}

export async function exchangeAuthCodeForTokens(params: {
  code: string
  redirectUri: string
  clientId?: string
  clientSecret?: string
}): Promise<StravaTokenResponse> {
  const client_id = params.clientId || process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID
  const client_secret = params.clientSecret || process.env.STRAVA_CLIENT_SECRET
  if (!client_id || !client_secret) throw new Error('Missing Strava client credentials')

  const res = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id,
      client_secret,
      code: params.code,
      grant_type: 'authorization_code',
      redirect_uri: params.redirectUri,
    }),
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
    body: JSON.stringify({
      client_id,
      client_secret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  })
  if (!res.ok) throw new Error('Failed to refresh Strava token')
  return (await res.json()) as StravaTokenResponse
}

async function fetchActivities(accessToken: string, afterUnix?: number) {
  const url = new URL('https://www.strava.com/api/v3/athlete/activities')
  url.searchParams.set('per_page', '200')
  url.searchParams.set('page', '1')
  if (afterUnix) url.searchParams.set('after', String(afterUnix))
  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (res.status === 401) throw new Error('unauthorized')
  if (!res.ok) throw new Error('Failed to fetch Strava activities')
  return (await res.json()) as any[]
}

export async function syncStravaActivitiesForUser(userId: string): Promise<{ inserted: number; updated: number }> {
  // Load tokens from profile
  const profileRes = await db.query(
    'SELECT strava_access_token, strava_refresh_token FROM profiles WHERE id = $1',
    [userId]
  )
  let accessToken = profileRes.rows[0]?.strava_access_token as string | null
  let refreshToken = profileRes.rows[0]?.strava_refresh_token as string | null

  // Dev fallback: use env tokens for a single-user development flow
  if (!accessToken && process.env.STRAVA_ACCESS_TOKEN) {
    accessToken = process.env.STRAVA_ACCESS_TOKEN
    refreshToken = process.env.STRAVA_REFRESH_TOKEN || null
  }

  if (!accessToken) {
    throw new Error('No Strava tokens found for user and no STRAVA_ACCESS_TOKEN in env')
  }

  // Try fetch; refresh if needed
  let activities: any[] = []
  try {
    activities = await fetchActivities(accessToken)
  } catch (err: any) {
    if (err?.message === 'unauthorized' && refreshToken) {
      const refreshed = await refreshStravaTokens(refreshToken)
      accessToken = refreshed.access_token
      refreshToken = refreshed.refresh_token
      // Persist refreshed tokens if they originated from profile
      await db.query(
        'UPDATE profiles SET strava_access_token = $1, strava_refresh_token = $2 WHERE id = $3',
        [accessToken, refreshToken, userId]
      )
      activities = await fetchActivities(accessToken)
    } else {
      throw err
    }
  }

  let inserted = 0
  let updated = 0
  for (const a of activities) {
    const avgHr = a.average_heartrate != null ? Math.round(Number(a.average_heartrate)) : null
    const maxHr = a.max_heartrate != null ? Math.round(Number(a.max_heartrate)) : null
    const suffer = a.suffer_score != null ? Math.round(Number(a.suffer_score)) : null
    const values = [
      userId,
      String(a.id),
      a.name || 'Activity',
      a.type || 'Workout',
      a.distance ?? null,
      a.moving_time ?? null,
      a.elapsed_time ?? null,
      a.total_elevation_gain ?? null,
      a.start_date,
      a.average_speed ?? null,
      a.max_speed ?? null,
      avgHr,
      maxHr,
      suffer,
      a ? JSON.stringify(a) : null,
    ]

    const result = await db.query(
      `INSERT INTO strava_activities (
         user_id, strava_id, name, type, distance, moving_time, elapsed_time,
         total_elevation_gain, start_date, average_speed, max_speed,
         average_heartrate, max_heartrate, suffer_score, metadata
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
       ON CONFLICT (strava_id) DO UPDATE SET
         name = EXCLUDED.name,
         type = EXCLUDED.type,
         distance = EXCLUDED.distance,
         moving_time = EXCLUDED.moving_time,
         elapsed_time = EXCLUDED.elapsed_time,
         total_elevation_gain = EXCLUDED.total_elevation_gain,
         start_date = EXCLUDED.start_date,
         average_speed = EXCLUDED.average_speed,
         max_speed = EXCLUDED.max_speed,
         average_heartrate = EXCLUDED.average_heartrate,
         max_heartrate = EXCLUDED.max_heartrate,
         suffer_score = EXCLUDED.suffer_score,
         metadata = EXCLUDED.metadata
       RETURNING xmax = 0 AS inserted
      `,
      values
    )

    if (result.rows[0]?.inserted) inserted++
    else updated++
  }

  return { inserted, updated }
}

