"use client"
import Link from 'next/link'

export default function MinimalTopbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-900 bg-black/80 backdrop-blur">
      <div className="mx-auto max-w-[1220px] px-4">
        <div className="h-14 flex items-center justify-between">
          <Link href="/dashboard" className="font-semibold tracking-tight text-white">trainly</Link>
          <div className="h-7 w-7 rounded-full bg-neutral-800" />
        </div>
      </div>
    </header>
  )
}

