'use client'

import React, { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

export default function ThemeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'))
  }, [])

  const flip = () => {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    try { localStorage.setItem('trainly-theme', next ? 'dark' : 'light') } catch {}
  }

  return (
    <button
      onClick={flip}
      aria-label="Toggle theme"
      style={{
        width: 32, height: 32, borderRadius: 9, cursor: 'pointer',
        border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--muted)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {dark ? <Sun style={{ width: 15, height: 15 }} /> : <Moon style={{ width: 15, height: 15 }} />}
    </button>
  )
}
