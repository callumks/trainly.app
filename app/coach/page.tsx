"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from 'next/navigation'
import { OnboardingHero } from '@/components/OnboardingHero'
import { AiThinking } from '@/components/AiThinking'

export default function CoachPage() {
  const router = useRouter()
  const [thinking, setThinking] = useState(false)
  const [step, setStep] = useState(0)

  async function handleSubmit(prompt: string) {
    setThinking(true)
    setStep(0)
    const steps = ["Analyzing Strava…","Balancing load…","Building hybrid week…"]
    const timer = setInterval(()=>setStep((i)=> (i+1)%steps.length), 900)
    try {
      // Call chat to generate a draft plan; in this stub we simulate client-side and persist via /api/plan
      const draft = buildDraftPlan()
      await fetch('/api/plan', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ plan: draft }) })
      router.push('/dashboard')
    } finally {
      clearInterval(timer)
      setThinking(false)
    }
  }

  function buildDraftPlan() {
    const now = new Date()
    const monday = new Date(now)
    const day = monday.getDay()
    const diff = (day === 0 ? -6 : 1 - day)
    monday.setDate(monday.getDate() + diff)
    const iso = (d: Date) => d.toISOString().slice(0,10)
    const sessions = [
      { id: 's1', date: iso(monday), sport: 'cycling', title: 'Z2 Endurance Ride', status: 'planned' },
      { id: 's2', date: iso(new Date(monday.getTime()+1*86400000)), sport: 'climbing', title: 'Bouldering Power', status: 'planned' },
      { id: 's3', date: iso(new Date(monday.getTime()+3*86400000)), sport: 'cycling', title: 'Threshold Intervals', status: 'planned' },
      { id: 's4', date: iso(new Date(monday.getTime()+5*86400000)), sport: 'climbing', title: 'Technique + Volume', status: 'planned' },
    ] as any
    return {
      id: 'plan-1',
      userId: 'u1',
      weekStart: iso(monday),
      weeks: [{ start: iso(monday), sessions }],
      meta: { generatedAt: new Date().toISOString(), sources: ['user_input'], version: 1, goals: [] }
    }
  }

  return (
    <div className="p-6">
      {!thinking ? (
        <OnboardingHero onSubmit={handleSubmit} />
      ) : (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
          <div className="text-2xl font-semibold">Generating your plan…</div>
          <AiThinking steps={["Analyzing Strava…","Balancing load…","Building hybrid week…"]} activeIndex={step} />
        </div>
      )}
    </div>
  )
}

