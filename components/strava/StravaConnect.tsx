'use client'

import React, { useEffect, useState } from 'react'

export default function StravaConnect() {
  const [connected, setConnected] = useState<boolean | null>(null)
  const [syncing, setSyncing] = useState(false)
  const [msg, setMsg] = useState('')
  const clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID

  useEffect(() => {
    let ok = true
    fetch('/api/profile', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (ok) setConnected(!!d?.profile?.strava_id) })
      .catch(() => { if (ok) setConnected(false) })
    return () => { ok = false }
  }, [])

  const connect = () => {
    if (!clientId) { setMsg('Add NEXT_PUBLIC_STRAVA_CLIENT_ID to .env.local first, then restart.'); return }
    const redirect = `${window.location.origin}/auth/callback`
    window.location.href =
      `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code` +
      `&redirect_uri=${encodeURIComponent(redirect)}&approval_prompt=auto&scope=read,activity:read_all&state=dashboard`
  }

  const sync = async () => {
    setSyncing(true); setMsg('')
    try {
      const r = await fetch('/api/strava/sync')
      const j = await r.json()
      if (!r.ok) throw new Error(j.error || 'Sync failed')
      setMsg(`Synced — ${j.inserted} new, ${j.updated} updated. Reload to see your numbers.`)
    } catch (e: any) {
      setMsg(e.message || 'Sync failed')
    } finally {
      setSyncing(false)
    }
  }

  return (
    <div className="kv">
      <div className="row">
        <span className="k">Strava</span>
        <span className="v" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {connected === null ? (
            <span style={{ color: 'var(--muted)' }}>…</span>
          ) : connected ? (
            <>
              <span style={{ color: 'var(--good)', fontFamily: 'var(--mono)', fontSize: 12 }}>Connected</span>
              <button className="btn ghost" style={{ height: 32, fontSize: 12.5 }} onClick={sync} disabled={syncing}>
                {syncing ? 'Syncing…' : 'Sync now'}
              </button>
            </>
          ) : (
            <button className="btn" style={{ height: 34, fontSize: 13, background: '#FC4C02', borderColor: '#FC4C02' }} onClick={connect}>
              Connect Strava
            </button>
          )}
        </span>
      </div>
      {msg && (
        <div className="row">
          <span className="k"> </span>
          <span className="v" style={{ fontFamily: 'var(--mono)', fontSize: 11.5, color: 'var(--muted)', textAlign: 'right' }}>{msg}</span>
        </div>
      )}
      <div className="row"><span className="k">Garmin</span><span className="v" style={{ color: 'var(--muted)' }}>Not connected</span></div>
      <div className="row"><span className="k">Wearable (HRV)</span><span className="v" style={{ color: 'var(--muted)' }}>Not connected</span></div>
    </div>
  )
}
