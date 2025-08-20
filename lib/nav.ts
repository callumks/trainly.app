import type React from 'react'
import { LayoutDashboard, CalendarDays, ListTree, Map, Target, Dumbbell, Settings2 } from 'lucide-react'

export type NavItem = {
  title: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  items?: NavItem[]
}

export const sidebarNav: NavItem[] = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  {
    title: 'Training',
    href: '/training',
    icon: Dumbbell,
    items: [
      { title: 'Overview', href: '/training/overview' },
      { title: 'Calendar', href: '/training/calendar' },
      { title: 'Activities', href: '/training/activities' },
    ],
  },
  { title: 'Maps', href: '/maps', icon: Map },
  { title: 'Challenges', href: '/challenges', icon: Target },
  { title: 'Settings', href: '/settings', icon: Settings2 },
]

