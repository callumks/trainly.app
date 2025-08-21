import React from 'react'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { db } from '@/lib/supabase'

async function getProfile() {
  const token = cookies().get('auth-token')?.value
  if (!token) return null
  try {
    const secret = process.env.JWT_SECRET || 'your-secret-key-change-this'
    const decoded = jwt.verify(token, secret) as { userId: string }
    const res = await db.query('select id, email, full_name, avatar_url, sports, weekly_volume from profiles where id=$1',[decoded.userId])
    return res.rows?.[0] || null
  } catch { return null }
}

export default async function ProfilePage() {
  const profile = await getProfile()
  return (
    <div className="min-h-[100svh] bg-gradient-to-b from-neutral-950 via-neutral-950 to-neutral-900">
      <div className="mx-auto max-w-[1220px] px-4 py-10">
        <h1 className="text-2xl font-semibold text-zinc-100 mb-4">Profile</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-5">
            <div className="text-sm font-medium mb-3">Account</div>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-14 w-14 rounded-full bg-neutral-800 overflow-hidden" />
              <div>
                <div className="text-zinc-100 text-sm">{profile?.full_name || '—'}</div>
                <div className="text-xs text-zinc-400">{profile?.email || ''}</div>
              </div>
            </div>
            <form action="/api/profile" method="post" className="space-y-3">
              <div className="text-sm text-zinc-300">
                <label className="block mb-1">Name</label>
                <input name="full_name" defaultValue={profile?.full_name || ''} className="w-full rounded-md border border-neutral-800 bg-black px-3 py-2 text-sm text-zinc-100" />
              </div>
              <div className="text-sm text-zinc-300">
                <label className="block mb-1">Profile picture URL</label>
                <input name="avatar_url" defaultValue={profile?.avatar_url || ''} className="w-full rounded-md border border-neutral-800 bg-black px-3 py-2 text-sm text-zinc-100" />
              </div>
              <button className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white">Save</button>
            </form>
          </div>
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-5">
            <div className="text-sm font-medium mb-3">Preferences</div>
            <div className="space-y-2 text-sm text-zinc-300">
              <div>Sports: {(profile?.sports || []).join(', ') || '—'}</div>
              <div>Weekly volume: {profile?.weekly_volume ?? '—'} hrs</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

