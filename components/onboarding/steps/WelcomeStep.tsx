'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { OnboardingData } from '../new-onboarding-flow'
import { User } from 'lucide-react'

interface WelcomeStepProps {
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
  loading: boolean
  canProceed: boolean
}

export function WelcomeStep({ data, updateData, onNext, loading, canProceed }: WelcomeStepProps) {

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

      {/* Quick intro */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Welcome</h3>
        
        {/* Name only */}
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
