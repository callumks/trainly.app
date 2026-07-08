import React from 'react'
import { Settings as SettingsIcon } from 'lucide-react'
import AppShell from '@/components/app/AppShell'
import PageHeader from '@/components/app/PageHeader'

export default function SettingsPage() {
  return (
    <AppShell>
      <PageHeader eyebrow="Account" title="Settings" sub="Preferences, connections, and billing." />
      <div className="card">
        <div className="empty">
          <div className="ei"><SettingsIcon /></div>
          <h4>Settings are coming together</h4>
          <p>Data connections, units, and subscription controls will live here.</p>
          <span className="tag">Coming soon</span>
        </div>
      </div>
    </AppShell>
  )
}
