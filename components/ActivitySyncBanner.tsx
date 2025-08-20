import React from 'react'
import { Badge } from '@/components/ui/badge'

export function ActivitySyncBanner({ hasNew }: { hasNew: boolean }) {
  if (!hasNew) return null
  return (
    <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-sm text-amber-200">
      New activity synced. Reviewing load…
    </div>
  )
}

