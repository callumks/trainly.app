"use server"
import { readActivePlan, writePlan, diffPlan, readPlanByVersion } from '@/lib/plan'
import { Plan, PlanDiff } from '@/lib/types'
import { publishPlanUpdated } from '@/lib/realtime'

export async function applyDraftPlan(draft: Plan): Promise<PlanDiff> {
  // Load previous
  const userId = draft.userId
  const prev = await readActivePlan(userId)
  await writePlan(userId, draft)
  const next = draft
  const diff = prev ? diffPlan(prev, next) : { versionFrom: 0, versionTo: draft.meta.version, changes: [] }
  publishPlanUpdated(userId, { ...diff, reason: 'coach_edit' })
  return diff
}

export async function acceptAllChanges(versionTo: number): Promise<PlanDiff> {
  // Accept means promote latest draft to active; compute diff from previous
  // Assuming caller already wrote the draft as next version; load prev and next
  throw new Error('acceptAllChanges requires userId context in this simplified setup')
}

export async function revertToVersion(version: number): Promise<Plan> {
  throw new Error('revertToVersion requires userId context in this simplified setup')
}

export async function toggleNutrition(enabled: boolean): Promise<void> {
  // Placeholder – update active plan nutrition flags and write new version
}

