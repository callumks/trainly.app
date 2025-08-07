'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type User = {
  id: string
  email: string
}

type AuthContext = {
  user: User | null
  session: any | null
  loading: boolean
}

const Context = createContext<AuthContext | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on load
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const userData = await response.json()
          setUser(userData.user)
          setSession({ user: userData.user })
        }
      } catch (error) {
        console.log('No existing session')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  return (
    <Context.Provider value={{ user, session, loading }}>
      {children}
    </Context.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
} 