'use client'

import React, { useEffect, useState } from 'react'
import { Moon, Sun, RefreshCw } from 'lucide-react'

export function DashboardShell({
  left,
  center,
  right,
}: {
  left: React.ReactNode
  center: React.ReactNode
  right: React.ReactNode
}) {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem('theme') : null
    if (saved === 'light') setIsDark(false)
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('theme', isDark ? 'dark' : 'light')
    }
  }, [isDark])

  return (
    <div className={`min-h-[100svh] ${isDark ? 'bg-gradient-to-b from-[#0a0f1a] to-[#050812]' : 'bg-gradient-to-b from-[#fafbfc] to-[#f4f5f7]'}`}>
      <nav className="border-b border-neutral-800/60 bg-black/30 backdrop-blur-xl sticky top-0 z-50">
        <div className="mx-auto max-w-[1220px] px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6 text-sm text-zinc-300">
            <a href="/dashboard" className="font-semibold text-zinc-100">trainly</a>
            <a className="hover:text-white" href="/dashboard">Dashboard</a>
            <a className="hover:text-white" href="/training/overview">Training</a>
            <a className="hover:text-white" href="/coach">Coach</a>
            <a className="hover:text-white" href="/insights">Insights</a>
            <a className="hover:text-white" href="/goals">Goals</a>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDark(d => !d)}
              className="inline-flex items-center gap-2 rounded-md border border-neutral-800 px-3 py-1.5 text-xs text-zinc-200 hover:bg-neutral-900"
            >
              {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />} Theme
            </button>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 rounded-md border border-neutral-800 px-3 py-1.5 text-xs text-zinc-200 hover:bg-neutral-900"
            >
              <RefreshCw className="h-4 w-4" /> Refresh
            </button>
            <div className="h-8 w-8 rounded-full bg-neutral-800" />
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-[1220px] px-4 pb-20 pt-6">
        <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr_340px] gap-6 items-start">
          <aside className="hidden xl:block sticky top-24 self-start">
            {left}
          </aside>

          <main className="min-w-0 space-y-6">
            {center}
          </main>

          <aside className="hidden xl:block sticky top-24 self-start">
            {right}
          </aside>
        </div>

        {/* Stacked on smaller screens */}
        <div className="xl:hidden space-y-6 mt-6">
          {left}
          {right}
        </div>
      </div>
    </div>
  )
}


