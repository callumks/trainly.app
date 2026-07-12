import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import OpenAI from 'openai'
import { buildCoachContext, contextSummary, ruleReply } from '@/lib/coach'
import { looksLikePlan, extractPlanSessions } from '@/lib/plan-engine'
import { getCoachNotes, notesBlock, extractAndStoreNotes } from '@/lib/coach-memory'
import { db } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function hasRealKey() {
  const k = process.env.OPENAI_API_KEY || ''
  return k.length > 20 && !k.startsWith('sk-local-dev')
}

async function llmReply(system: string, history: { role: string; text?: string; content?: string }[], message: string): Promise<string | null> {
  if (!hasRealKey()) return null
  try {
    const baseURL = process.env.LLM_BASE_URL || undefined
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, baseURL })
    // GLM models are thinking models — disable reasoning for snappy chat replies,
    // otherwise the token budget is consumed before any content is produced.
    const isGlm = !!baseURL && /z\.ai|bigmodel/i.test(baseURL)
    const r = await client.chat.completions.create({
      model: process.env.LLM_MODEL || 'gpt-4o-mini',
      temperature: 0.6,
      max_tokens: 500,
      ...(isGlm ? { thinking: { type: 'disabled' } } : {}),
      messages: [
        { role: 'system', content: system },
        ...history.slice(-12).map((h) => ({ role: h.role === 'user' ? 'user' : 'assistant', content: String(h.text ?? h.content ?? '') } as any)).filter((h) => h.content),
        { role: 'user', content: message },
      ],
    } as any)
    return r.choices?.[0]?.message?.content?.trim() || null
  } catch {
    return null // fall back to rules on any LLM error
  }
}

export async function GET() {
  try {
    const token = cookies().get('auth-token')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const secret = process.env.JWT_SECRET || 'your-secret-key-change-this'
    const { userId } = jwt.verify(token, secret) as { userId: string }
    const ctx = await buildCoachContext(userId)
    const hist = await db.query(
      `SELECT id, role, text, plan, plan_status FROM coach_messages
       WHERE user_id=$1 ORDER BY created_at DESC LIMIT 50`, [userId]
    )
    return NextResponse.json({
      source: hasRealKey() ? 'ai' : 'rules',
      history: hist.rows.reverse().map((r: any) => ({ id: r.id, role: r.role, text: r.text, plan: r.plan, planStatus: r.plan_status })),
      context: {
        ftp: ctx.ftp, ftpEstimated: ctx.ftpEstimated, ctl: ctx.ctl, atl: ctx.atl, tsb: ctx.tsb,
        readiness: ctx.readiness, weeklyHours: ctx.weeklyHours, weeklyTSS: ctx.weeklyTSS, hasData: ctx.hasData,
      },
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = cookies().get('auth-token')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const secret = process.env.JWT_SECRET || 'your-secret-key-change-this'
    const { userId } = jwt.verify(token, secret) as { userId: string }

    const { message, history } = await req.json()
    if (!message || typeof message !== 'string') return NextResponse.json({ error: 'message required' }, { status: 400 })

    const ctx = await buildCoachContext(userId)
    const notes = await getCoachNotes(userId)

    const system = [
      "You are Trainly, texting with the athlete you coach — endurance + hybrid (cycling / climbing / strength).",
      '',
      'VOICE:',
      "- Text like a sharp coach-friend, not a report. Vary how you open; never start two replies the same way.",
      "- Cite a number ONLY when it changes the advice or they ask for it. NEVER re-cite stats (TSB, readiness, that big ride) you've already mentioned earlier in this conversation unless they've changed.",
      "- Match their register. Casual chat (coffee rides, kit choices, weather) gets casual answers — no watt targets, no TSB lectures. Training questions get precise, prescriptive answers with numbers.",
      "- The athlete's reported feel outranks the model. If they say they feel good or flat, trust it, adapt the call, and say so — don't argue with dashboard numbers.",
      '',
      'DATA:',
      "- Live data below, including recent sessions with how long ago they happened. If they mention a ride or climb they just did, find it (it's likely MOST RECENT) and react to its specifics. If it isn't there, say the sync probably hasn't caught it yet — don't guess.",
      '- Never invent numbers. Miles and watts.',
      '- 1-4 sentences for chat. Day-per-line format ("**Mon** — 90min ride, 2x20min @ 240-260W") only when they ask for a plan.',
      "- When prescribing, account for fatigue and recent climbing/strength load that taxes the legs even when bike TSS looks low.",
      '',
      "ATHLETE'S DATA:",
      contextSummary(ctx),
      notesBlock(notes),
    ].join('\n')

    const reply = (await llmReply(system, Array.isArray(history) ? history : [], message)) ?? ruleReply(message, ctx)
    const source = hasRealKey() ? 'ai' : 'rules'

    // If the reply is a multi-day plan, extract structured sessions the client can
    // offer to add to the calendar. Failure here never blocks the reply.
    let proposedPlan = null
    if (source === 'ai' && looksLikePlan(reply)) {
      proposedPlan = await extractPlanSessions(reply, new Date().toISOString().slice(0, 10))
    }

    // Learn durable facts in the background — never blocks the reply
    void extractAndStoreNotes(userId, message, reply)

    // Persist both sides of the exchange
    await db.query(`INSERT INTO coach_messages (user_id, role, text) VALUES ($1,'user',$2)`, [userId, message])
    const saved = await db.query(
      `INSERT INTO coach_messages (user_id, role, text, plan, plan_status) VALUES ($1,'assistant',$2,$3,$4) RETURNING id`,
      [userId, reply, proposedPlan ? JSON.stringify(proposedPlan) : null, proposedPlan ? 'idle' : null]
    )

    return NextResponse.json({
      reply,
      messageId: saved.rows[0]?.id ?? null,
      proposedPlan,
      source,
      context: {
        ftp: ctx.ftp, ftpEstimated: ctx.ftpEstimated, ctl: ctx.ctl, atl: ctx.atl, tsb: ctx.tsb,
        readiness: ctx.readiness, weeklyHours: ctx.weeklyHours, weeklyTSS: ctx.weeklyTSS, hasData: ctx.hasData,
      },
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Coach failed' }, { status: 500 })
  }
}
