import React from 'react'
import { Apple } from 'lucide-react'
import AppShell from '@/components/app/AppShell'
import PageHeader from '@/components/app/PageHeader'

export default function NutritionPage() {
  return (
    <AppShell>
      <PageHeader eyebrow="Fuel" title="Nutrition" sub="Fueling and recovery guidance, tuned to your training load." />
      <div className="card">
        <div className="empty">
          <div className="ei"><Apple /></div>
          <h4>Nutrition is coming together</h4>
          <p>Once your training data is flowing, Trainly will suggest fueling around your hardest sessions.</p>
          <span className="tag">Coming soon</span>
        </div>
      </div>
    </AppShell>
  )
}
