'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Activity, Mail, Loader2 } from 'lucide-react'
import { useSupabase } from '@/components/providers/supabase-provider'
import toast from 'react-hot-toast'

const authSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type AuthFormData = z.infer<typeof authSchema>

interface AuthFormProps {
  isSignUp?: boolean
}

export function AuthForm({ isSignUp = false }: AuthFormProps) {
  const { supabase } = useSupabase()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isStravaLoading, setIsStravaLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
  })

  const onEmailSubmit = async (data: AuthFormData) => {
    setIsLoading(true)
    try {
      const endpoint = isSignUp ? '/api/auth/register' : '/api/auth/login'
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Authentication failed')
      }

      if (isSignUp) {
        toast.success('Account created successfully! Please sign in.')
        // You might want to redirect to login or auto-sign them in
      } else {
        toast.success('Welcome back!')
        router.push('/dashboard')
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStravaAuth = async () => {
    setIsStravaLoading(true)
    try {
      // For now, redirect to Strava OAuth manually
      // TODO: Implement proper Strava OAuth flow
      const configuredBase = process.env.NEXT_PUBLIC_APP_URL as string | undefined
      const normalizedBase = configuredBase
        ? (/^https?:\/\//i.test(configuredBase) ? configuredBase : `https://${configuredBase}`)
        : undefined
      const appBaseUrl = normalizedBase || window.location.origin
      const redirectUri = `${appBaseUrl.replace(/\/$/, '')}/auth/callback`
      const state = isSignUp ? 'signup' : 'login'
      const stravaAuthUrl = `https://www.strava.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&approval_prompt=force&scope=read,activity:read_all&state=${encodeURIComponent(state)}`
      window.location.href = stravaAuthUrl
    } catch (error: any) {
      toast.error(error.message || 'Failed to connect with Strava')
      setIsStravaLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Strava OAuth */}
      <Button
        onClick={handleStravaAuth}
        disabled={isStravaLoading}
        className="w-full bg-[#FC4C02] hover:bg-[#FC4C02]/90 text-white"
        size="lg"
      >
        {isStravaLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Activity className="mr-2 h-4 w-4" />
        )}
        {isSignUp ? 'Sign up' : 'Continue'} with Strava
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            or continue with email
          </span>
        </div>
      </div>

      {/* Email Form */}
      <form onSubmit={handleSubmit(onEmailSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            {...register('email')}
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register('password')}
            disabled={isLoading}
          />
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Mail className="mr-2 h-4 w-4" />
          )}
          {isSignUp ? 'Create Account' : 'Sign In'}
        </Button>
      </form>
    </div>
  )
} 