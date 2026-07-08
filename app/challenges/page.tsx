import React from 'react'
import { Trophy } from 'lucide-react'
import AppShell from '@/components/app/AppShell'
import PageHeader from '@/components/app/PageHeader'

export default function Page() {
  return (
    <AppShell>
      <PageHeader eyebrow="Compete" title="Challenges" sub="Goals and challenges with friends." />
      <div className="card">
        <div className="empty">
          <div className="ei"><Trophy /></div>
          <h4>Challenges are coming together</h4>
          <p>Shared challenges — good for you and your climbing crew.</p>
          <span className="tag">Coming soon</span>
        </div>
      </div>
    </AppShell>
  )
}
