import React from 'react'
import AppShell from '@/components/app/AppShell'
import PageHeader from '@/components/app/PageHeader'
import ActivitiesList from '@/components/strava/ActivitiesList'

export default function ActivitiesPage() {
  return (
    <AppShell>
      <PageHeader eyebrow="Log" title="Activities" sub="Everything you've logged — across every discipline." />
      <ActivitiesList />
    </AppShell>
  )
}
