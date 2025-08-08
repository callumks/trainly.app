'use client'

import React, { createContext, useContext } from 'react'

// Very lightweight client-side mock so build doesn't fail while we migrate off Supabase
// Returns empty data; real data is fetched via server components or API routes
const emptyResult = { data: [], count: 0, error: null }

function makeThenable<T>(value: T) {
  return {
    ...value,
    then(resolve: (v: any) => void) {
      resolve(emptyResult)
    },
  }
}

const mockSupabase: any = {
  from: (_table: string) => {
    const chain: any = {
      select: (_cols?: string, _opts?: any) => makeThenable(chain),
      eq: (_c: string, _v: any) => makeThenable(chain),
      gte: (_c: string, _v: any) => makeThenable(chain),
      lte: (_c: string, _v: any) => makeThenable(chain),
      in: (_c: string, _vals: any[]) => makeThenable(chain),
      order: (_c: string, _opts?: any) => makeThenable(chain),
      limit: (_n: number) => makeThenable(chain),
      single: async () => ({ data: null, error: null }),
    }
    return chain
  },
}

type SupabaseContext = { supabase: any }

const Context = createContext<SupabaseContext | undefined>(undefined)

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  return <Context.Provider value={{ supabase: mockSupabase }}>{children}</Context.Provider>
}

export const useSupabase = () => {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error('useSupabase must be used inside SupabaseProvider')
  }
  return context
}