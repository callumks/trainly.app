'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { OnboardingData } from '../new-onboarding-flow'
import { cn } from '@/lib/utils'
import { 
  Heart, 
  Moon, 
  Zap,
  Activity,
  TrendingUp
} from 'lucide-react'

interface RecoveryReadinessStepProps {
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
  loading: boolean
  canProceed: boolean
}

export function RecoveryReadinessStep({ data, updateData, onNext, onBack, loading, canProceed }: RecoveryReadinessStepProps) {
  const updateBaselineFatigue = (key: keyof typeof data.baselineFatigue, value: number) => {
    updateData({
      baselineFatigue: { ...data.baselineFatigue, [key]: value }
    })
  }

  const getFatigueColor = (value: number) => {
    if (value <= 3) return 'text-red-400'
    if (value <= 6) return 'text-yellow-400'
    return 'text-green-400'
  }

  const getFatigueLabel = (value: number) => {
    if (value <= 3) return 'Poor'
    if (value <= 6) return 'Fair'
    return 'Good'
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">
          Recovery & Readiness
        </h2>
        <p className="text-neutral-400">
          Help us understand your current recovery status and baseline metrics
        </p>
      </div>

      {/* Baseline Fatigue Questionnaire */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          <span>Baseline Fatigue Assessment</span>
        </h3>
        
        <div className="space-y-6">
          {/* Energy Level */}
          <Card className="bg-neutral-900/50 border-neutral-700 p-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                <Label className="text-white font-medium">Energy Level</Label>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-300 text-sm">How energetic do you feel?</span>
                  <span className={cn('font-medium', getFatigueColor(data.baselineFatigue.energy))}>
                    {data.baselineFatigue.energy}/10 - {getFatigueLabel(data.baselineFatigue.energy)}
                  </span>
                </div>
                
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={data.baselineFatigue.energy}
                  onChange={(e) => updateBaselineFatigue('energy', Number(e.target.value))}
                  className="w-full"
                />
                
                <div className="flex justify-between text-xs text-neutral-400">
                  <span>Exhausted</span>
                  <span>Very Energetic</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Sleep Quality */}
          <Card className="bg-neutral-900/50 border-neutral-700 p-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Moon className="h-4 w-4 text-blue-500" />
                <Label className="text-white font-medium">Sleep Quality</Label>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-300 text-sm">How well have you been sleeping?</span>
                  <span className={cn('font-medium', getFatigueColor(data.baselineFatigue.sleepQuality))}>
                    {data.baselineFatigue.sleepQuality}/10 - {getFatigueLabel(data.baselineFatigue.sleepQuality)}
                  </span>
                </div>
                
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={data.baselineFatigue.sleepQuality}
                  onChange={(e) => updateBaselineFatigue('sleepQuality', Number(e.target.value))}
                  className="w-full"
                />
                
                <div className="flex justify-between text-xs text-neutral-400">
                  <span>Poor Sleep</span>
                  <span>Excellent Sleep</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Muscle Soreness */}
          <Card className="bg-neutral-900/50 border-neutral-700 p-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-red-500" />
                <Label className="text-white font-medium">Muscle Soreness</Label>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-300 text-sm">How sore are your muscles?</span>
                  <span className={cn('font-medium', getFatigueColor(10 - data.baselineFatigue.soreness + 1))}>
                    {data.baselineFatigue.soreness}/10 - {getFatigueLabel(10 - data.baselineFatigue.soreness + 1)}
                  </span>
                </div>
                
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={data.baselineFatigue.soreness}
                  onChange={(e) => updateBaselineFatigue('soreness', Number(e.target.value))}
                  className="w-full"
                />
                
                <div className="flex justify-between text-xs text-neutral-400">
                  <span>Very Sore</span>
                  <span>No Soreness</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* HRV & Heart Rate */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          <Heart className="h-5 w-5 text-red-500" />
          <span>Heart Rate Variability & Resting Heart Rate</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-neutral-900/50 border-neutral-700 p-4">
            <div className="space-y-3">
              <Label className="text-white font-medium">HRV (ms)</Label>
              <Input
                type="number"
                placeholder="45"
                value={data.hrv || ''}
                onChange={(e) => updateData({ hrv: e.target.value ? Number(e.target.value) : undefined })}
                className="bg-neutral-800 border-neutral-700 text-white"
              />
              <p className="text-xs text-neutral-400">
                Heart Rate Variability - higher values indicate better recovery
              </p>
            </div>
          </Card>
          
          <Card className="bg-neutral-900/50 border-neutral-700 p-4">
            <div className="space-y-3">
              <Label className="text-white font-medium">Resting Heart Rate (bpm)</Label>
              <Input
                type="number"
                placeholder="60"
                value={data.restingHeartRate || ''}
                onChange={(e) => updateData({ restingHeartRate: e.target.value ? Number(e.target.value) : undefined })}
                className="bg-neutral-800 border-neutral-700 text-white"
              />
              <p className="text-xs text-neutral-400">
                Measured first thing in the morning
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Recovery Insights */}
      <Card className="bg-blue-900/20 border-blue-500/30 p-4">
        <div className="flex items-start space-x-3">
          <TrendingUp className="h-5 w-5 text-blue-400 mt-0.5" />
          <div>
            <h4 className="text-blue-200 font-medium">Recovery Tracking</h4>
            <p className="text-blue-300/80 text-sm mt-1">
              We'll use this baseline to track your recovery over time and adjust your training intensity accordingly. 
              You can update these metrics anytime in your dashboard.
            </p>
          </div>
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={loading}
          className="bg-neutral-900 border-neutral-700 text-white hover:bg-neutral-800"
        >
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={loading}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {loading ? 'Saving...' : 'Next'}
        </Button>
      </div>
    </div>
  )
}
