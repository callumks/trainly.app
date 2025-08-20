'use client'
import React from 'react'

export function AiThinking({ steps, activeIndex }: { steps: string[]; activeIndex: number }) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      {steps.map((s, i) => (
        <div key={s} className={`px-3 py-1 rounded-full text-xs border ${i <= activeIndex ? 'border-zinc-500 text-zinc-200' : 'border-zinc-800 text-zinc-500'}`}>
          <span className={i === activeIndex ? 'animate-pulse' : ''}>{s}</span>
        </div>
      ))}
    </div>
  )
}

