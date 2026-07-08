import React from 'react'
import { AIPlanGenerator } from '@/components/training/ai-plan-generator'
import AppShell from '@/components/app/AppShell'
import PageHeader from '@/components/app/PageHeader'

export default function PlansPage() {
  return (
    <AppShell>
      <PageHeader eyebrow="Build" title="Training Plans" sub="Generate an adaptive plan, then let it reshape itself around your real training." />
      <div className="frame">
        <AIPlanGenerator />
      </div>
    </AppShell>
  )
}
