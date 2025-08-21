"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { sidebarNav } from '@/lib/nav'
import { cn } from '@/lib/utils'

export default function TopNav() {
  const pathname = usePathname()
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-900 bg-black/80 backdrop-blur">
      <div className="mx-auto max-w-[1220px] px-4">
        <div className="h-14 flex items-center justify-between">
          <Link href="/dashboard" className="font-semibold tracking-tight text-white">trainly</Link>
          <nav className="hidden md:flex items-center gap-2">
            {sidebarNav.filter(i=>!i.items).map((item)=>{
              const active = pathname === item.href
              const Icon = item.icon as any
              return (
                <Link key={item.href} href={item.href} className={cn('px-3 py-2 rounded-md text-sm', active?'bg-zinc-100/10 text-white':'text-zinc-300 hover:bg-zinc-100/5 hover:text-white')}>
                  <span className="inline-flex items-center gap-2">
                    {Icon ? <Icon className="h-4 w-4" /> : null}
                    {item.title}
                  </span>
                </Link>
              )
            })}
            {/* Training root goes to overview by default */}
            <Link href="/training/overview" className={cn('px-3 py-2 rounded-md text-sm', pathname.startsWith('/training')?'bg-zinc-100/10 text-white':'text-zinc-300 hover:bg-zinc-100/5 hover:text-white')}>Training</Link>
          </nav>
          <div className="h-7 w-7 rounded-full bg-neutral-800" />
        </div>
      </div>
    </header>
  )
}

