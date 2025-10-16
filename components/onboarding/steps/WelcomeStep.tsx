'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { OnboardingData } from '../new-onboarding-flow'
import { Mail, Lock, User, Activity, Apple, Chrome } from 'lucide-react'
import { cn } from '@/lib/utils'

interface WelcomeStepProps {
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
  loading: boolean
  canProceed: boolean
}

export function WelcomeStep({ data, updateData, onNext, loading, canProceed }: WelcomeStepProps) {
  const [showOAuth, setShowOAuth] = useState(false)

  const handleOAuth = (provider: 'strava' | 'google' | 'apple') => {
    updateData({ oauthProvider: provider })
    // TODO: Implement OAuth flow
    onNext()
  }

  return (
    <div className="space-y-6">
      {/* Mission Statement */}
      <div className="text-center space-y-4">
        <div className="text-6xl">🚀</div>
        <h2 className="text-2xl font-bold text-white">
          Welcome to Trainly
        </h2>
        <p className="text-neutral-400 max-w-2xl mx-auto">
          Train smarter across all your sports. Get personalized training plans, 
          nutrition guidance, and recovery insights powered by AI.
        </p>
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg inline-block">
          <span className="font-semibold">Start your 7-day free trial</span>
        </div>
      </div>

      {/* Account Setup */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Create your account</h3>
        
        {/* Email/Password Form */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-neutral-300">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={data.name}
                onChange={(e) => updateData({ name: e.target.value })}
                className="pl-10 bg-neutral-900 border-neutral-700 text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-neutral-300">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={data.email}
                onChange={(e) => updateData({ email: e.target.value })}
                className="pl-10 bg-neutral-900 border-neutral-700 text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-neutral-300">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={data.password}
                onChange={(e) => updateData({ password: e.target.value })}
                className="pl-10 bg-neutral-900 border-neutral-700 text-white"
              />
            </div>
          </div>
        </div>

        {/* OAuth Options */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="flex-1 h-px bg-neutral-700" />
            <span className="text-neutral-400 text-sm">or continue with</span>
            <div className="flex-1 h-px bg-neutral-700" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button
              variant="outline"
              onClick={() => handleOAuth('strava')}
              className="bg-neutral-900 border-neutral-700 hover:bg-neutral-800 text-white"
            >
              <Activity className="mr-2 h-4 w-4" />
              Strava
            </Button>
            <Button
              variant="outline"
              onClick={() => handleOAuth('google')}
              className="bg-neutral-900 border-neutral-700 hover:bg-neutral-800 text-white"
            >
              <Chrome className="mr-2 h-4 w-4" />
              Google
            </Button>
            <Button
              variant="outline"
              onClick={() => handleOAuth('apple')}
              className="bg-neutral-900 border-neutral-700 hover:bg-neutral-800 text-white"
            >
              <Apple className="mr-2 h-4 w-4" />
              Apple
            </Button>
          </div>
        </div>
      </div>

      {/* Features Preview */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">What you'll get</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-neutral-900/50 border-neutral-700 p-4">
            <div className="text-2xl mb-2">🤖</div>
            <h4 className="font-semibold text-white mb-1">AI Training Plans</h4>
            <p className="text-sm text-neutral-400">
              Personalized plans that adapt to your progress
            </p>
          </Card>
          <Card className="bg-neutral-900/50 border-neutral-700 p-4">
            <div className="text-2xl mb-2">📊</div>
            <h4 className="font-semibold text-white mb-1">Performance Analytics</h4>
            <p className="text-sm text-neutral-400">
              Track your progress across all sports
            </p>
          </Card>
          <Card className="bg-neutral-900/50 border-neutral-700 p-4">
            <div className="text-2xl mb-2">🍎</div>
            <h4 className="font-semibold text-white mb-1">Nutrition Guidance</h4>
            <p className="text-sm text-neutral-400">
              Fuel your training with smart nutrition
            </p>
          </Card>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-end pt-6">
        <Button
          onClick={onNext}
          disabled={!canProceed || loading}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {loading ? 'Creating Account...' : 'Start Free Trial'}
        </Button>
      </div>
    </div>
  )
}
