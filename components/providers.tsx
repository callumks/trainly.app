'use client'

import React from 'react'
import { SupabaseProvider } from './providers/supabase-provider'
import { AuthProvider } from './providers/auth-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SupabaseProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </SupabaseProvider>
  )
} 