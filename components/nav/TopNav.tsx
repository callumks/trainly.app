"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Menu, ChevronDown, Search, Bell, Plus, User } from 'lucide-react'
import * as Sheet from '@radix-ui/react-dialog'
import { useState } from 'react'

const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Training', href: '/training', children: [
    { label: 'Overview', href: '/training/overview' },
    { label: 'Calendar', href: '/training/calendar' },
    { label: 'Activities', href: '/training/activities' },
  ]},
  { label: 'Coach', href: '/coach' },
  { label: 'Insights', href: '/insights' },
  { label: 'Goals', href: '/goals' },
  { label: 'Profile', href: '/profile' },
  { label: 'Settings', href: '/settings' },
]

export default function TopNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isActive = (href: string) => href === '/training' ? pathname.startsWith('/training') : pathname === href

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-900 bg-black/80 backdrop-blur">
      <div className="mx-auto max-w-[1220px] px-4">
        <div className="h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <Sheet.Root open={open} onOpenChange={setOpen}>
              <Sheet.Trigger asChild>
                <button className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-neutral-800 text-zinc-200">
                  <Menu className="h-5 w-5" />
                </button>
              </Sheet.Trigger>
              <Sheet.Portal>
                <Sheet.Overlay className="fixed inset-0 bg-black/60" />
                <Sheet.Content className="fixed inset-y-0 left-0 w-80 bg-black border-r border-neutral-900 p-4">
                  <div className="mb-4 font-semibold">trainly</div>
                  <nav className="space-y-1">
                    {navItems.map((it) => (
                      <div key={it.label}>
                        <Link onClick={()=>setOpen(false)} href={it.children ? it.children[0].href : it.href} className={cn('block rounded-md px-3 py-2 text-sm', isActive(it.href)?'bg-zinc-100/10 text-white':'text-zinc-300 hover:bg-zinc-100/5 hover:text-white')}>{it.label}</Link>
                        {it.children && (
                          <div className="ml-3 mt-1 space-y-1">
                            {it.children.map((c) => (
                              <Link key={c.href} onClick={()=>setOpen(false)} href={c.href} className={cn('block rounded-md px-3 py-1.5 text-sm', pathname===c.href?'bg-zinc-100/10 text-white':'text-zinc-300 hover:bg-zinc-100/5 hover:text-white')}>{c.label}</Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </nav>
                </Sheet.Content>
              </Sheet.Portal>
            </Sheet.Root>

            <Link href="/dashboard" className="font-semibold tracking-tight text-white">trainly</Link>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((it) => (
              it.children ? (
                <div key={it.label} className="relative group">
                  <Link href={it.children[0].href} className={cn('px-3 py-2 rounded-md text-sm inline-flex items-center gap-1', isActive(it.href)?'bg-zinc-100/10 text-white':'text-zinc-300 hover:bg-zinc-100/5 hover:text-white')}>
                    {it.label} <ChevronDown className="h-4 w-4 opacity-70" />
                  </Link>
                  <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition fixed mt-1 bg-black border border-neutral-900 rounded-md shadow-lg p-1">
                    {it.children.map((c) => (
                      <Link key={c.href} href={c.href} className={cn('block whitespace-nowrap rounded-sm px-3 py-2 text-sm', pathname===c.href?'bg-zinc-100/10 text-white':'text-zinc-300 hover:bg-zinc-100/5 hover:text-white')}>{c.label}</Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link key={it.label} href={it.href} className={cn('px-3 py-2 rounded-md text-sm', isActive(it.href)?'bg-zinc-100/10 text-white':'text-zinc-300 hover:bg-zinc-100/5 hover:text-white')}>{it.label}</Link>
              )
            ))}
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-2 text-zinc-300">
            <button className="hidden md:inline-flex h-9 w-9 items-center justify-center rounded-md border border-neutral-800 hover:bg-neutral-900"><Search className="h-4 w-4" /></button>
            <button className="hidden md:inline-flex h-9 w-9 items-center justify-center rounded-md border border-neutral-800 hover:bg-neutral-900"><Bell className="h-4 w-4" /></button>
            <Link href="/onboarding" className="inline-flex items-center gap-2 rounded-md border border-neutral-800 px-3 py-2 text-sm hover:bg-neutral-900">
              <Plus className="h-4 w-4" /> New plan
            </Link>
            <button className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-neutral-800"><User className="h-4 w-4" /></button>
          </div>
        </div>
      </div>
    </header>
  )
}

