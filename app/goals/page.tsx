import React from 'react'
import { Target } from 'lucide-react'
import AppShell from '@/components/app/AppShell'
import PageHeader from '@/components/app/PageHeader'

export default function Page() {
  return (
    <AppShell>
      <PageHeader eyebrow="Targets" title="Goals" sub="Your events and targets — what the plan builds toward." />
      <div className="card">
        <div className="empty">
          <div className="ei"><Target /></div>
          <h4>Goal editor is coming together</h4>
          <p>Set an A-race or target and Trainly will periodize your plan toward it.</p>
          <span className="tag">Coming soon</span>
        </div>
      </div>
    </AppShell>
  )
}
