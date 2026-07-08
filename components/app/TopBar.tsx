'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from './ThemeToggle'

const NAV = [
  { href: '/dashboard', label: 'Dashboard', match: (p: string) => p === '/dashboard' },
  { href: '/dashboard/calendar', label: 'Calendar', match: (p: string) => p.startsWith('/dashboard/calendar') },
  { href: '/dashboard/coach', label: 'Coach', match: (p: string) => p.startsWith('/dashboard/coach') },
  { href: '/dashboard/stats', label: 'Progress', match: (p: string) => p.startsWith('/dashboard/stats') },
]

export default function TopBar() {
  const path = usePathname() || ''
  const [initials, setInitials] = useState('')

  useEffect(() => {
    let ok = true
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (ok && d?.user?.email) setInitials(String(d.user.email).slice(0, 2).toUpperCase()) })
      .catch(() => {})
    return () => { ok = false }
  }, [])

  return (
    <div className="topbar">
      <Link href="/dashboard" className="brand"><span className="dot" />Trainly</Link>
      <nav className="main">
        {NAV.map((n) => (
          <Link key={n.href} href={n.href} className={n.match(path) ? 'active' : ''}>{n.label}</Link>
        ))}
      </nav>
      <div className="spacer" />
      <ThemeToggle />
      <Link href="/dashboard/profile" className="avatar">{initials || '··'}</Link>
    </div>
  )
}
