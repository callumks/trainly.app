'use client'

import React, { createContext, useContext } from 'react'

// Mock Supabase client for compatibility
const mockSupabase = {
  from: () => ({
    select: () => ({
      eq: () => ({ single: async () => ({ data: null, error: null }) })
    })
  })
}

type SupabaseContext = {
  supabase: typeof mockSupabase
}

const Context = createContext<SupabaseContext | undefined>(undefined)

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  return (
    <Context.Provider value={{ supabase: mockSupabase }}>
      {children}
    </Context.Provider>
  )
}

export const useSupabase = () => {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error('useSupabase must be used inside SupabaseProvider')
  }
  return context
} 