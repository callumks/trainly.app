import React from 'react'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { redirect } from 'next/navigation'

export default async function BrandNewUxHome() {
  const token = cookies().get('auth-token')?.value
  if (!token) redirect('/auth/login')
  try {
    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-this')
  } catch {
    redirect('/auth/login')
  }

  return (
    <div className="mx-auto max-w-[1220px] px-4 py-10">
      <h1 className="text-2xl font-bold text-white">Brand New UX</h1>
      <p className="text-sm text-zinc-400 mt-2">This is a sandbox route namespace for the new frontend. Build freely here using existing APIs.</p>
      <div className="mt-6 space-x-3">
        <a className="underline text-zinc-300" href="/dashboard">Go to current dashboard</a>
        <a className="underline text-zinc-300" href="/coach">Open coach</a>
      </div>
    </div>
  )
}


