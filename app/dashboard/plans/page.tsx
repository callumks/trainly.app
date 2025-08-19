import React from 'react'
import { AIPlanGenerator } from '@/components/training/ai-plan-generator'

export default function PlansPage() {
  return (
    <div className="p-8 space-y-6">
      <h2 className="text-2xl font-bold">Training Plans</h2>
      <AIPlanGenerator />
    </div>
  )
}

