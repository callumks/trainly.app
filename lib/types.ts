export type Sport = 'cycling' | 'climbing' | 'running' | 'strength'

export type Goal = { sport: Sport; target: string; timeline?: string }

export type Injury = { name: string; status: 'active' | 'recovered'; notes?: string }

export type Session = {
  id: string
  date: string
  sport: Sport
  title: string
  description?: string
  metrics?: { durationMin?: number; tss?: number; powerTargets?: { ftpPct?: number }; grade?: string }
  status: 'planned' | 'completed' | 'skipped' | 'modified'
}

export type Plan = {
  id: string
  userId: string
  weekStart: string
  weeks: Array<{
    start: string
    sessions: Session[]
    notes?: string
    nutrition?: { enabled: boolean; tips?: string[] }
  }>
  meta: {
    generatedAt: string
    sources: ('user_input' | 'strava_sync' | 'coach_edit')[]
    version: number
    goals: Goal[]
    injuries?: Injury[]
    experience?: Record<Sport, 'beginner' | 'intermediate' | 'advanced'>
  }
}

export type PlanDiff = {
  versionFrom: number
  versionTo: number
  changes: Array<
    | { type: 'add-session'; weekStart: string; session: Session }
    | { type: 'remove-session'; sessionId: string }
    | { type: 'update-session'; sessionId: string; patch: Partial<Session> }
    | { type: 'note'; text: string }
  >
}

