'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { StravaConnectButton } from '@/components/strava/connect-button'
import { Badge, } from '@/components/ui/badge'
import { Sparkles, Activity, Clipboard, Check, Shield } from 'lucide-react'

const SEED = `I’m a cyclist and climber, currently Cat 5 aiming for Cat 2/3 by year‑end. Past A3 pulley and meniscus issues—want to train hard without re‑injury. Confident at V5, aiming for V9. I can train 6 days/week, prefer long Z2 rides and 2 bouldering sessions.`

const SPORTS = ['Cycling', 'Climbing', 'Running', 'Strength']
const TIME = ['3d/wk', '4d/wk', '5d/wk', '6d/wk']
const GOALS = ['Upgrade race category', 'Increase FTP', 'Project V‑grade', 'Balanced hybrid']

export function OnboardingLanding({ onSubmit, stravaConnected }: { onSubmit: (text: string) => void; stravaConnected?: boolean }) {
  const [text, setText] = useState('')
  const [copied, setCopied] = useState(false)
  const [chips, setChips] = useState<string[]>([])

  const toggle = (v: string) => setChips((prev)=> prev.includes(v) ? prev.filter(x=>x!==v) : [...prev, v])

  const buildPrompt = () => {
    const addons = chips.length ? `\n\nChips: ${chips.join(', ')}` : ''
    return `${(text || SEED).trim()}${addons}`
  }

  return (
    <div className="min-h-[100svh] bg-gradient-to-b from-neutral-950 via-neutral-950 to-neutral-900">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <header className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1 text-xs text-zinc-400">
            <Sparkles className="h-3.5 w-3.5 text-zinc-300" />
            Coach
          </div>
          <h1 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight text-zinc-100">Let’s build your plan.</h1>
          <p className="mt-2 text-zinc-400">Tell me about you as an athlete. I’ll generate a hybrid week that adapts as you train.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Input column */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-4 md:p-6 bg-neutral-950/60 border-neutral-800">
              <div className="mb-3 flex flex-wrap gap-2">
                {SPORTS.map(s => (
                  <button key={s} onClick={()=>toggle(s)} className={`px-3 py-1 rounded-full text-sm border transition ${chips.includes(s) ? 'bg-neutral-800 border-neutral-700 text-zinc-200' : 'border-neutral-800 text-zinc-400 hover:text-zinc-200'}`}>{s}</button>
                ))}
              </div>
              <div className="mb-3 flex flex-wrap gap-2">
                {TIME.map(s => (
                  <button key={s} onClick={()=>toggle(s)} className={`px-3 py-1 rounded-full text-sm border transition ${chips.includes(s) ? 'bg-neutral-800 border-neutral-700 text-zinc-200' : 'border-neutral-800 text-zinc-400 hover:text-zinc-200'}`}>{s}</button>
                ))}
              </div>
              <div className="mb-4 flex flex-wrap gap-2">
                {GOALS.map(s => (
                  <button key={s} onClick={()=>toggle(s)} className={`px-3 py-1 rounded-full text-sm border transition ${chips.includes(s) ? 'bg-neutral-800 border-neutral-700 text-zinc-200' : 'border-neutral-800 text-zinc-400 hover:text-zinc-200'}`}>{s}</button>
                ))}
              </div>

              <Textarea
                rows={5}
                value={text}
                onChange={(e)=>setText(e.target.value)}
                placeholder="Paste the example or describe your sports, goals, schedule, injuries. Enter to send, Shift+Enter for newline."
                onKeyDown={(e)=>{ if (e.key==='Enter' && !e.shiftKey){ e.preventDefault(); onSubmit(buildPrompt()) } }}
                className="bg-neutral-950 border-neutral-800 focus-visible:ring-zinc-700"
              />

              <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 justify-between">
                <div className="text-xs text-zinc-500 flex items-center gap-2"><Shield className="h-3.5 w-3.5" /> Your data stays private. We only use it to build plans.</div>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" onClick={()=>{ setText(SEED); navigator.clipboard.writeText(SEED); setCopied(true); setTimeout(()=>setCopied(false), 1200) }}>
                    {copied ? <Check className="mr-2 h-4 w-4" /> : <Clipboard className="mr-2 h-4 w-4" />} Use example
                  </Button>
                  <Button onClick={()=> onSubmit(buildPrompt())}>
                    <Sparkles className="mr-2 h-4 w-4" /> Generate plan
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Right rail */}
          <div className="space-y-4">
            {!stravaConnected && (
              <Card className="p-5 border-neutral-800 bg-neutral-950/60">
                <div className="flex items-center gap-2 text-sm text-zinc-300 mb-2"><Activity className="h-4 w-4" /> Strava</div>
                <div className="text-sm text-zinc-400 mb-3">Connect Strava to analyze your recent training and auto‑adapt your plan.</div>
                <StravaConnectButton />
              </Card>
            )}

            <Card className="p-5 border-neutral-800 bg-neutral-950/60">
              <div className="text-sm text-zinc-400 mb-2">Quick prompts</div>
              <div className="flex flex-wrap gap-2">
                {['Build a balanced hybrid week','2 bouldering sessions + long Z2 ride','Deload this week by 20%','Focus on FTP gains'].map(p => (
                  <button key={p} onClick={()=>setText(p)} className="px-3 py-1 rounded-full text-sm border border-neutral-800 text-zinc-400 hover:text-zinc-200">{p}</button>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

