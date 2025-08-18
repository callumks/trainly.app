'use client'

import React, { useEffect } from 'react'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    try {
      fetch('/api/logs/client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scope: 'global',
          message: error?.message,
          stack: error?.stack,
          digest: (error as any)?.digest,
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
          href: typeof location !== 'undefined' ? location.href : '',
        }),
      }).catch(() => {})
    } catch {}
  }, [error])

  return (
    <html>
      <body>
        <div style={{ padding: 24 }}>
          <h2>Something went wrong</h2>
          <p>{error?.message}</p>
          <button onClick={() => reset()}>Try again</button>
        </div>
      </body>
    </html>
  )
}

