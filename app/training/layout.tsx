import React from 'react'
import TopNav from '@/components/nav/TopNav'

export default function TrainingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh">
      <TopNav />
      <div className="min-h-dvh">{children}</div>
    </div>
  )
}

