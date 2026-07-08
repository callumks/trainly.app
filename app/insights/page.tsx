import React from 'react'
import { Sparkles } from 'lucide-react'
import AppShell from '@/components/app/AppShell'
import PageHeader from '@/components/app/PageHeader'

export default function Page() {
  return (
    <AppShell>
      <PageHeader eyebrow="Analysis" title="Insights" sub="Readiness, load, and trends, read for you." />
      <div className="card">
        <div className="empty">
          <div className="ei"><Sparkles /></div>
          <h4>Insights are coming together</h4>
          <p>Once data is flowing, Trainly will surface what's working and what to change.</p>
          <span className="tag">Coming soon</span>
        </div>
      </div>
    </AppShell>
  )
}
