"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Dumbbell, Map, Target, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'

export function BottomNav() {
  const pathname = usePathname()
  const items = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Home' },
    { href: '/training/overview', icon: Dumbbell, label: 'Train' },
    { href: '/coach', icon: MessageSquare, label: 'Coach' },
    { href: '/maps', icon: Map, label: 'Maps' },
    { href: '/challenges', icon: Target, label: 'Goals' },
  ]
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-neutral-800 bg-black/70 backdrop-blur lg:hidden">
      <ul className="grid grid-cols-5">
        {items.map((it) => {
          const active = pathname === it.href
          const Icon = it.icon
          return (
            <li key={it.href}>
              <Link href={it.href} className={cn('flex flex-col items-center py-2 text-xs', active ? 'text-white' : 'text-zinc-400') }>
                <Icon className="h-5 w-5" />
                {it.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

