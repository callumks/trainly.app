import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const headers = Object.fromEntries(request.headers)
  const host = headers['x-forwarded-host'] || headers['host']
  const proto = headers['x-forwarded-proto'] || 'http'
  const url = new URL(request.url)
  const derivedOrigin = `${proto}://${host}`

  console.log('[DEBUG] request.url', request.url)
  console.log('[DEBUG] headers.host', host)
  console.log('[DEBUG] headers.x-forwarded-*', {
    'x-forwarded-host': headers['x-forwarded-host'],
    'x-forwarded-proto': headers['x-forwarded-proto'],
    'x-forwarded-port': headers['x-forwarded-port'],
  })

  return NextResponse.json({
    requestUrl: request.url,
    urlOrigin: url.origin,
    headers: {
      host,
      'x-forwarded-host': headers['x-forwarded-host'],
      'x-forwarded-proto': headers['x-forwarded-proto'],
      'x-forwarded-port': headers['x-forwarded-port'],
    },
    derivedOrigin,
  })
}

