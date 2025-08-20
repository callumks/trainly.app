'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Activity, Loader2 } from 'lucide-react'

export function StravaConnectButton() {
  const [loading, setLoading] = useState(false)

  const onConnect = async () => {
    try {
      setLoading(true)
      const configuredBase = process.env.NEXT_PUBLIC_APP_URL as string | undefined
      const normalizedBase = configuredBase
        ? (/^https?:\/\//i.test(configuredBase) ? configuredBase : `https://${configuredBase}`)
        : undefined
      const appBaseUrl = normalizedBase || window.location.origin
      const redirectUri = `${appBaseUrl.replace(/\/$/, '')}/auth/callback`
      const state = 'coach'
      const stravaAuthUrl = `https://www.strava.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&approval_prompt=force&scope=read,activity:read_all&state=${encodeURIComponent(state)}`
      window.location.href = stravaAuthUrl
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={onConnect} disabled={loading} className="bg-[#FC4C02] hover:bg-[#FC4C02]/90 text-white">
      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Activity className="mr-2 h-4 w-4" />}
      Connect Strava
    </Button>
  )
}

