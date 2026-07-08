import React from 'react'
import AppShell from '@/components/app/AppShell'
import PageHeader from '@/components/app/PageHeader'
import CalendarView from '@/components/training/CalendarView'

export default function CalendarPage() {
  return (
    <AppShell>
      <PageHeader eyebrow="Schedule" title="Calendar" sub="Your week of sessions — cycling, climbing, and strength in one view." />
      <CalendarView />
    </AppShell>
  )
}
