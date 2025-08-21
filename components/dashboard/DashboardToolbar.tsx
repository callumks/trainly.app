'use client'
import React from 'react'
import { Bike, Mountain, Dumbbell, Footprints, ChevronDown } from 'lucide-react'

export function DashboardToolbar() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-zinc-300">
        <button className="h-9 w-9 inline-flex items-center justify-center rounded-md border border-neutral-800 hover:bg-neutral-900"><Bike className="h-4 w-4" /></button>
        <button className="h-9 w-9 inline-flex items-center justify-center rounded-md border border-neutral-800 hover:bg-neutral-900"><Mountain className="h-4 w-4" /></button>
        <button className="h-9 w-9 inline-flex items-center justify-center rounded-md border border-neutral-800 hover:bg-neutral-900"><Footprints className="h-4 w-4" /></button>
        <button className="h-9 w-9 inline-flex items-center justify-center rounded-md border border-neutral-800 hover:bg-neutral-900"><Dumbbell className="h-4 w-4" /></button>
      </div>
      <button className="inline-flex items-center gap-2 rounded-md border border-neutral-800 px-3 py-2 text-sm text-zinc-200 hover:bg-neutral-900">
        This week <ChevronDown className="h-4 w-4" />
      </button>
    </div>
  )
}

