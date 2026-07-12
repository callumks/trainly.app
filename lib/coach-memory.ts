import OpenAI from 'openai'
import { db } from '@/lib/supabase'

// Long-term coach memory: durable athlete facts extracted from conversation,
// injected into every coach prompt so nothing important scrolls out of the window.

export async function getCoachNotes(userId: string, limit = 24): Promise<{ id: string; note: string; category: string | null }[]> {
  const r = await db.query(
    `SELECT id, note, category FROM coach_memory
     WHERE user_id=$1 AND active=true ORDER BY created_at DESC LIMIT $2`,
    [userId, limit]
  )
  return r.rows
}

export function notesBlock(notes: { note: string; category: string | null }[]): string {
  if (!notes.length) return ''
  return [
    '',
    'ATHLETE NOTES (long-term memory from past conversations — use them naturally, do not recite the list):',
    ...notes.map((n) => `- ${n.category ? `[${n.category}] ` : ''}${n.note}`),
  ].join('\n')
}

// Fire-and-forget after each exchange. Extracts NEW durable facts only.
export async function extractAndStoreNotes(userId: string, userMessage: string, coachReply: string): Promise<void> {
  try {
    const key = process.env.OPENAI_API_KEY || ''
    if (key.length <= 20 || key.startsWith('sk-local-dev')) return
    const existing = await getCoachNotes(userId, 40)

    const baseURL = process.env.LLM_BASE_URL || undefined
    const client = new OpenAI({ apiKey: key, baseURL })
    const isGlm = !!baseURL && /z\.ai|bigmodel/i.test(baseURL)
    const r = await client.chat.completions.create({
      model: process.env.LLM_MODEL || 'gpt-4o-mini',
      temperature: 0,
      max_tokens: 400,
      ...(isGlm ? { thinking: { type: 'disabled' } } : {}),
      messages: [
        {
          role: 'system',
          content: [
            'Extract DURABLE athlete facts from this coaching exchange worth remembering long-term: injuries/niggles, goals/target events, schedule constraints, equipment, strong preferences, dietary notes, life context that affects training.',
            'NOT durable: how they feel today, one-off ride details, anything already known.',
            `ALREADY KNOWN (do not repeat): ${existing.map((n) => n.note).join(' | ') || 'nothing'}`,
            'Output JSON only, no fences: {"notes":[{"note":"...", "category":"injury|goal|schedule|preference|equipment|context"}]}. Empty array if nothing new. Max 3 notes.',
          ].join('\n'),
        },
        { role: 'user', content: `ATHLETE: ${userMessage}\nCOACH: ${coachReply}` },
      ],
    } as any)
    const raw = (r.choices?.[0]?.message?.content || '').trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '')
    const parsed = JSON.parse(raw)
    const notes = (parsed.notes || []).filter((n: any) => n?.note && String(n.note).length > 5).slice(0, 3)
    for (const n of notes) {
      await db.query(
        `INSERT INTO coach_memory (user_id, note, category) VALUES ($1, $2, $3)`,
        [userId, String(n.note).slice(0, 240), n.category ? String(n.category).slice(0, 24) : null]
      )
    }
  } catch {
    // memory extraction must never break the chat
  }
}
