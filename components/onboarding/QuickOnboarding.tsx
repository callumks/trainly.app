'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

const SPORTS = ['Cycling', 'Running', 'Climbing', 'Strength', 'Swimming']
const GOALS = ['Build Strength', 'Improve Endurance', 'Lose Weight', 'Multisport Training', 'Recovery Focus']
const DAYS = [3, 4, 5, 6]

export function QuickOnboarding() {
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [sport, setSport] = useState('')
  const [goal, setGoal] = useState('')
  const [days, setDays] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const canNext = () => {
    if (step === 0) return name.trim().length > 0
    if (step === 1) return !!sport
    if (step === 2) return !!goal
    if (step === 3) return !!days
    return true
  }

  const persistProfile = async () => {
    try {
      // Save name
      if (name.trim()) {
        await fetch('/api/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ full_name: name.trim() }),
        })
      }
      // Save core onboarding
      await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ goals: [goal], sports: [sport], weekly_volume: days ?? undefined }),
      })
    } catch (_) {
      // non-blocking for MVP
    }
  }

  const generatePlan = async () => {
    setLoading(true)
    try {
      await persistProfile()
      const res = await fetch('/api/training-plans/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ planDuration: 8, focusArea: sport, specificGoal: goal }),
      })
      if (!res.ok) {
        const j = await res.json().catch(()=>({}))
        throw new Error(j.error || 'Failed to generate plan')
      }
      toast.success('Your plan is ready')
      if (typeof window !== 'undefined') window.location.href = '/dashboard'
    } catch (e: any) {
      toast.error(e?.message || 'Failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[100svh] bg-gradient-to-b from-neutral-950 via-neutral-950 to-neutral-900">
      <div className="mx-auto max-w-xl px-4 py-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1 text-xs text-zinc-400">
            <Sparkles className="h-3.5 w-3.5 text-zinc-300" /> Coach
          </div>
          <h1 className="text-2xl font-bold text-white">Let’s get your plan in under 90 seconds</h1>
          <p className="text-sm text-zinc-400">Step {step + 1} of 4</p>
        </div>

        <Card className="p-5 bg-neutral-950/60 border-neutral-800 space-y-4">
          {step === 0 && (
            <div className="space-y-3">
              <Label htmlFor="full_name" className="text-neutral-300">Your name</Label>
              <Input id="full_name" placeholder="Jane Doe" value={name} onChange={(e)=>setName(e.target.value)} className="bg-neutral-900 border-neutral-700 text-white" />
            </div>
          )}

          {step === 1 && (
            <div>
              <div className="text-neutral-300 mb-3">Primary sport</div>
              <div className="flex flex-wrap gap-2">
                {SPORTS.map(s => (
                  <button key={s} onClick={()=>setSport(s)} className={`px-3 py-1 rounded-full text-sm border transition ${sport===s ? 'bg-neutral-800 border-neutral-700 text-zinc-200' : 'border-neutral-800 text-zinc-400 hover:text-zinc-200'}`}>{s}</button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="text-neutral-300 mb-3">Primary goal</div>
              <div className="flex flex-wrap gap-2">
                {GOALS.map(g => (
                  <button key={g} onClick={()=>setGoal(g)} className={`px-3 py-1 rounded-full text-sm border transition ${goal===g ? 'bg-neutral-800 border-neutral-700 text-zinc-200' : 'border-neutral-800 text-zinc-400 hover:text-zinc-200'}`}>{g}</button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="text-neutral-300 mb-3">Training days per week</div>
              <div className="flex flex-wrap gap-2">
                {DAYS.map(d => (
                  <button key={d} onClick={()=>setDays(d)} className={`px-3 py-1 rounded-full text-sm border transition ${days===d ? 'bg-neutral-800 border-neutral-700 text-zinc-200' : 'border-neutral-800 text-zinc-400 hover:text-zinc-200'}`}>{d}d/wk</button>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between pt-2">
            <Button variant="secondary" onClick={()=> setStep(prev => Math.max(0, prev-1))} disabled={step===0 || loading}>Back</Button>
            {step < 3 ? (
              <Button onClick={()=> setStep(prev => prev+1)} disabled={!canNext() || loading}>Next</Button>
            ) : (
              <Button onClick={generatePlan} disabled={!canNext() || loading}>
                <Sparkles className="mr-2 h-4 w-4" /> {loading ? 'Generating…' : 'Generate plan'}
              </Button>
            )}
          </div>
        </Card>

        <Card className="p-4 bg-neutral-950/60 border-neutral-800">
          <div className="text-sm text-zinc-400">Tip: Connect Strava after you see your plan to enable automatic updates.</div>
        </Card>
      </div>
    </div>
  )
}


