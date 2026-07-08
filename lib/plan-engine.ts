import OpenAI from 'openai'
import { db } from '@/lib/supabase'

export type PlanSession = {
  date: string // YYYY-MM-DD
  name: string
  session_type: 'cardio' | 'strength' | 'recovery' | 'mixed' | 'skill'
  duration_minutes: number
  intensity: number // 1-5
  description?: string
}

const VALID_TYPES = new Set(['cardio', 'strength', 'recovery', 'mixed', 'skill'])

// Heuristic: does a coach reply look like a multi-day plan worth extracting?
export function looksLikePlan(reply: string): boolean {
  const dayLines = (reply.match(/\*\*[^*]{2,20}\*\*\s*[—–-]/g) || []).length
  return dayLines >= 2
}

// Second LLM pass: turn the coach's prose plan into structured sessions.
export async function extractPlanSessions(replyText: string, todayISO: string): Promise<PlanSession[] | null> {
  try {
    const baseURL = process.env.LLM_BASE_URL || undefined
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, baseURL })
    const isGlm = !!baseURL && /z\.ai|bigmodel/i.test(baseURL)
    const r = await client.chat.completions.create({
      model: process.env.LLM_MODEL || 'gpt-4o-mini',
      temperature: 0,
      max_tokens: 900,
      ...(isGlm ? { thinking: { type: 'disabled' } } : {}),
      messages: [
        {
          role: 'system',
          content: [
            `Today is ${todayISO}. Convert the training plan below into JSON only — no prose, no code fences.`,
            `Output: {"sessions":[{"date":"YYYY-MM-DD","name":string,"session_type":"cardio"|"strength"|"recovery"|"mixed"|"skill","duration_minutes":number,"intensity":1-5,"description":string}]}`,
            `Rules: resolve day names ("Mon", "Today", "Tomorrow") to real dates on/after today. Cycling/running/swimming = cardio (easy spins = recovery). Climbing/bouldering = skill. Lifting/core = strength. intensity: 1 recovery, 2 endurance, 3 tempo, 4 threshold, 5 max. Put watt targets in description. Rest days are NOT sessions — omit them.`,
          ].join('\n'),
        },
        { role: 'user', content: replyText },
      ],
    } as any)
    const raw = r.choices?.[0]?.message?.content?.trim() || ''
    const jsonStr = raw.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '')
    const parsed = JSON.parse(jsonStr)
    const sessions: PlanSession[] = (parsed.sessions || [])
      .filter((s: any) => s && s.date && s.name && VALID_TYPES.has(s.session_type))
      .map((s: any) => ({
        date: String(s.date).slice(0, 10),
        name: String(s.name).slice(0, 120),
        session_type: s.session_type,
        duration_minutes: Math.max(5, Math.min(600, Math.round(Number(s.duration_minutes) || 60))),
        intensity: Math.max(1, Math.min(5, Math.round(Number(s.intensity) || 2))),
        description: s.description ? String(s.description).slice(0, 300) : undefined,
      }))
    return sessions.length ? sessions : null
  } catch {
    return null
  }
}

// Write an approved plan: one training_plans row + its sessions.
// Replaces still-planned sessions in the same date range (keeps completed ones).
export async function applyPlan(userId: string, sessions: PlanSession[]): Promise<{ planId: string; inserted: number }> {
  const dates = sessions.map((s) => s.date).sort()
  const start = dates[0], end = dates[dates.length - 1]

  await db.query(`UPDATE training_plans SET is_active=false WHERE user_id=$1 AND is_active=true`, [userId])
  await db.query(`DELETE FROM training_sessions WHERE user_id=$1 AND status='planned' AND date BETWEEN $2 AND $3`, [userId, start, end])

  const planRes = await db.query(
    `INSERT INTO training_plans (user_id, name, start_date, end_date, is_active, plan_type, metadata)
     VALUES ($1, $2, $3, $4, true, 'ai_generated', $5) RETURNING id`,
    [userId, 'Coach plan', start, end, JSON.stringify({ source: 'coach-chat', createdAt: new Date().toISOString() })]
  )
  const planId = planRes.rows[0].id

  let inserted = 0
  for (const s of sessions) {
    await db.query(
      `INSERT INTO training_sessions (plan_id, user_id, date, name, description, session_type, duration_minutes, intensity, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'planned')`,
      [planId, userId, s.date, s.name, s.description || null, s.session_type, s.duration_minutes, s.intensity]
    )
    inserted++
  }
  return { planId, inserted }
}

// Mark planned sessions completed when a same-day Strava activity of the matching
// sport family exists. Called after each sync.
export async function matchCompletedSessions(userId: string): Promise<number> {
  const res = await db.query(
    `UPDATE training_sessions ts
     SET status='completed', strava_activity_id=sa.strava_id, updated_at=NOW()
     FROM strava_activities sa
     WHERE ts.user_id=$1 AND sa.user_id=$1 AND ts.status='planned' AND ts.date <= CURRENT_DATE
       AND sa.start_date::date = ts.date
       AND (
         (ts.session_type IN ('cardio','recovery') AND sa.type ~* 'ride|run|swim|row|ski')
         OR (ts.session_type='skill' AND sa.type ~* 'climb|boulder')
         OR (ts.session_type='strength' AND sa.type ~* 'weight|workout|strength|crossfit')
         OR (ts.session_type='mixed')
       )
     RETURNING ts.id`,
    [userId]
  )
  return res.rowCount || 0
}
