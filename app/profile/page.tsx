import React from 'react'

export default function ProfilePage() {
  return (
    <div className="min-h-[100svh] bg-gradient-to-b from-neutral-950 via-neutral-950 to-neutral-900">
      <div className="mx-auto max-w-[1220px] px-4 py-10">
        <h1 className="text-2xl font-semibold text-zinc-100 mb-4">Profile</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-5">
            <div className="text-sm font-medium mb-3">Account</div>
            <div className="space-y-3 text-sm text-zinc-300">
              <div className="flex items-center justify-between"><span>Email</span><span>user@trainly.app</span></div>
              <div className="flex items-center justify-between"><span>Name</span><span>—</span></div>
            </div>
          </div>
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-5">
            <div className="text-sm font-medium mb-3">Preferences</div>
            <div className="space-y-2 text-sm text-zinc-300">
              <div>Sports: Cycling, Climbing</div>
              <div>Weekly volume: 6–8 hrs</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

