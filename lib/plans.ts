"use server"
import { readActivePlan, writePlan, diffPlan } from '@/lib/plan'
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
  // Placeholder – in real impl, load versions and compute diff accepted
  return { versionFrom: versionTo - 1, versionTo, changes: [] }
}

export async function revertToVersion(version: number): Promise<Plan> {
  // Placeholder – load plan_versions row
  throw new Error('not implemented')
}

export async function toggleNutrition(enabled: boolean): Promise<void> {
  // Placeholder – update active plan nutrition flags and write new version
}

