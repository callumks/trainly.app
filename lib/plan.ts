import { db } from '@/lib/supabase'
import { Plan, PlanDiff, Session } from '@/lib/types'
import { publishPlanUpdated } from '@/lib/realtime'

export async function readActivePlan(userId: string): Promise<Plan | null> {
  const res = await db.query('select metadata from training_plans where user_id=$1 and is_active=true order by updated_at desc limit 1', [userId])
  const row = res.rows?.[0]
  const meta = row?.metadata || null
  return meta?.plan ?? null
}

export async function writePlan(userId: string, plan: Plan): Promise<void> {
  // deactivate existing
  await db.query('update training_plans set is_active=false where user_id=$1 and is_active=true', [userId])
  await db.query(
    `insert into training_plans (user_id, name, start_date, is_active, plan_type, metadata)
     values ($1,$2,$3,true,'ai_generated',$4)`,
    [userId, 'Hybrid plan', plan.weekStart, { plan }]
  )
  // Broadcast simple event (no diff here; actions will publish with diffs)
  publishPlanUpdated(userId, { versionTo: plan.meta.version })
}

export function diffPlan(prev: Plan, next: Plan): PlanDiff {
  const changes: PlanDiff['changes'] = []

  const prevSessions = new Map<string, { weekStart: string; session: Session }>()
  for (const w of prev.weeks) for (const s of w.sessions) prevSessions.set(s.id, { weekStart: w.start, session: s })

  const nextSessions = new Map<string, { weekStart: string; session: Session }>()
  for (const w of next.weeks) for (const s of w.sessions) nextSessions.set(s.id, { weekStart: w.start, session: s })

  // additions and updates
  for (const [id, entry] of Array.from(nextSessions.entries())) {
    const { weekStart, session } = entry
    const prevEntry = prevSessions.get(id)
    if (!prevEntry) {
      changes.push({ type: 'add-session', weekStart, session })
    } else {
      const patch: Partial<Session> = {}
      const keys: (keyof Session)[] = ['date', 'sport', 'title', 'description', 'metrics', 'status']
      for (const k of keys) {
        if (JSON.stringify(prevEntry.session[k]) !== JSON.stringify(session[k])) {
          ;(patch as any)[k] = session[k]
        }
      }
      if (Object.keys(patch).length > 0) {
        changes.push({ type: 'update-session', sessionId: id, patch })
      }
    }
  }

  // removals
  for (const id of Array.from(prevSessions.keys())) {
    if (!nextSessions.has(id)) changes.push({ type: 'remove-session', sessionId: id })
  }

  return {
    versionFrom: prev.meta.version,
    versionTo: next.meta.version,
    changes,
  }
}

