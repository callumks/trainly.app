'use client'
import React, { useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { StravaConnectButton } from '@/components/strava/connect-button'

const SEED = `I’m a cyclist and climber, currently Cat 5 aiming for Cat 2/3 by year‑end. Past A3 pulley and meniscus issues—want to train hard without re‑injury. Confident at V5, aiming for V9. I can train 6 days/week, prefer long Z2 rides and 2 bouldering sessions.`

const sports = ['Cycling', 'Climbing', 'Running', 'Strength']
const times = ['3d/wk', '4d/wk', '5d/wk', '6d/wk']
const goals = ['Upgrade race category', 'Increase FTP', 'Project V‑grade', 'Balanced hybrid']

export function OnboardingHero({ onSubmit }: { onSubmit: (text: string) => void }) {
  const [text, setText] = useState('')
  const [selected, setSelected] = useState<string[]>([])

  function toggleChip(value: string) {
    setSelected((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]))
  }

  function buildPrompt(): string {
    const chips = selected.length ? `\n\nChips: ${selected.join(', ')}` : ''
    return `${text.trim() || SEED}${chips}`
  }

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-6 px-4">
      <div>
        <h1 className="text-3xl md:text-5xl font-bold">Let’s build your plan.</h1>
        <p className="text-zinc-400 mt-2">Tell me about you as an athlete.</p>
      </div>

      <div className="max-w-2xl w-full space-y-3">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-left">
          <div className="text-xs text-zinc-400 mb-2">Example</div>
          <div className="text-sm text-zinc-200">{SEED}</div>
          <div className="mt-3">
            <Button variant="secondary" onClick={() => setText(SEED)}>Copy example</Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {sports.map((s) => (
            <button key={s} onClick={() => toggleChip(s)} className={`px-3 py-1 rounded-full text-sm border ${selected.includes(s) ? 'bg-neutral-800 border-neutral-700' : 'border-neutral-800'}`}>{s}</button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {times.map((s) => (
            <button key={s} onClick={() => toggleChip(s)} className={`px-3 py-1 rounded-full text-sm border ${selected.includes(s) ? 'bg-neutral-800 border-neutral-700' : 'border-neutral-800'}`}>{s}</button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {goals.map((s) => (
            <button key={s} onClick={() => toggleChip(s)} className={`px-3 py-1 rounded-full text-sm border ${selected.includes(s) ? 'bg-neutral-800 border-neutral-700' : 'border-neutral-800'}`}>{s}</button>
          ))}
        </div>

        <div className="space-y-2">
          <textarea
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 outline-none focus:ring-2 focus:ring-zinc-700"
            rows={4}
            placeholder="Type here. Enter to send, Shift+Enter for newline."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                onSubmit(buildPrompt())
              }
            }}
          />
          <div className="flex items-center justify-between">
            <StravaConnectButton />
            <Button onClick={() => onSubmit(buildPrompt())}>Generate plan</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

