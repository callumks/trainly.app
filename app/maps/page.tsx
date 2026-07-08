import React from 'react'
import { Map } from 'lucide-react'
import AppShell from '@/components/app/AppShell'
import PageHeader from '@/components/app/PageHeader'

export default function Page() {
  return (
    <AppShell>
      <PageHeader eyebrow="Explore" title="Routes" sub="Your routes and where you ride." />
      <div className="card">
        <div className="empty">
          <div className="ei"><Map /></div>
          <h4>Routes are coming together</h4>
          <p>Map-based route history and planning will live here.</p>
          <span className="tag">Coming soon</span>
        </div>
      </div>
    </AppShell>
  )
}
