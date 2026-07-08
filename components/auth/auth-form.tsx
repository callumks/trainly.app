'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import './auth.css'

const authSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type AuthFormData = z.infer<typeof authSchema>

export function AuthForm({ isSignUp = false }: { isSignUp?: boolean }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
  })

  const goDashboard = () => {
    if (typeof window !== 'undefined') window.location.href = '/dashboard'
    else { router.replace('/dashboard'); router.refresh() }
  }

  const post = (url: string, data: AuthFormData) =>
    fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data), credentials: 'include' })

  const onSubmit = async (data: AuthFormData) => {
    setIsLoading(true)
    try {
      if (isSignUp) {
        const reg = await post('/api/auth/register', data)
        const rj = await reg.json()
        if (!reg.ok) throw new Error(rj.error || 'Could not create account')
      }
      // Sign in (also runs straight after a successful signup → no "please sign in" detour)
      const login = await post('/api/auth/login', data)
      const lj = await login.json()
      if (!login.ok) throw new Error(lj.error || 'Authentication failed')
      toast.success(isSignUp ? 'Welcome to Trainly' : 'Welcome back')
      goDashboard()
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" type="email" placeholder="you@example.com" autoComplete="email" disabled={isLoading} {...register('email')} />
        {errors.email && <p className="err">{errors.email.message}</p>}
      </div>

      <div className="field">
        <label htmlFor="password">Password</label>
        <input id="password" type="password" placeholder="••••••••" autoComplete={isSignUp ? 'new-password' : 'current-password'} disabled={isLoading} {...register('password')} />
        {errors.password && <p className="err">{errors.password.message}</p>}
      </div>

      <button className="submit" type="submit" disabled={isLoading}>
        {isLoading && <span className="spin" />}
        {isSignUp ? 'Create account' : 'Sign in'}
      </button>
    </form>
  )
}
