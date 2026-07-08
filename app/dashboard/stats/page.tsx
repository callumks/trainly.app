import React from 'react'
import AppShell from '@/components/app/AppShell'
import PageHeader from '@/components/app/PageHeader'
import ProgressView from '@/components/dashboard/ProgressView'

export default function StatsPage() {
  return (
    <AppShell>
      <PageHeader eyebrow="Trends" title="Progress" sub="Fitness, fatigue, and form over time — across every discipline." />
      <ProgressView />
    </AppShell>
  )
}
