'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { OnboardingData } from '../new-onboarding-flow'
import { cn } from '@/lib/utils'
import { 
  Clock, 
  Activity, 
  TrendingUp, 
  Download,
  CheckCircle
} from 'lucide-react'

interface TrainingHistoryStepProps {
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
  loading: boolean
  canProceed: boolean
}

const PERFORMANCE_METRICS = {
  running: [
    { key: '5k_time', label: '5K Time', placeholder: '20:00', unit: 'min:sec' },
    { key: '10k_time', label: '10K Time', placeholder: '42:00', unit: 'min:sec' },
    { key: 'half_marathon', label: 'Half Marathon', placeholder: '1:30:00', unit: 'hr:min:sec' },
    { key: 'marathon', label: 'Marathon', placeholder: '3:30:00', unit: 'hr:min:sec' },
  ],
  cycling: [
    { key: 'ftp', label: 'FTP', placeholder: '250', unit: 'watts' },
    { key: 'max_power', label: 'Max Power', placeholder: '1200', unit: 'watts' },
    { key: 'vo2_max', label: 'VO2 Max', placeholder: '55', unit: 'ml/kg/min' },
  ],
  climbing: [
    { key: 'max_boulder', label: 'Max Boulder Grade', placeholder: 'V6', unit: 'V-grade' },
    { key: 'max_lead', label: 'Max Lead Grade', placeholder: '5.11a', unit: 'YDS' },
    { key: 'max_trad', label: 'Max Trad Grade', placeholder: '5.10a', unit: 'YDS' },
  ],
  swimming: [
    { key: '100m_time', label: '100m Time', placeholder: '1:20', unit: 'min:sec' },
    { key: '400m_time', label: '400m Time', placeholder: '6:00', unit: 'min:sec' },
    { key: '1500m_time', label: '1500m Time', placeholder: '22:00', unit: 'min:sec' },
  ],
  strength: [
    { key: 'bench_press', label: 'Bench Press 1RM', placeholder: '100', unit: 'kg' },
    { key: 'squat', label: 'Squat 1RM', placeholder: '140', unit: 'kg' },
    { key: 'deadlift', label: 'Deadlift 1RM', placeholder: '180', unit: 'kg' },
    { key: 'pull_ups', label: 'Max Pull-ups', placeholder: '15', unit: 'reps' },
  ],
}

export function TrainingHistoryStep({ data, updateData, onNext, onBack, loading, canProceed }: TrainingHistoryStepProps) {
  const updateWeeklyHours = (sport: string, hours: number) => {
    updateData({ 
      weeklyHours: { ...data.weeklyHours, [sport]: hours }
    })
  }

  const updatePerformanceMetric = (sport: string, key: string, value: string) => {
    const sportMetrics = data.performanceMetrics[sport] || {}
    updateData({
      performanceMetrics: {
        ...data.performanceMetrics,
        [sport]: { ...sportMetrics, [key]: value }
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">
          Training History & Baseline Metrics
        </h2>
        <p className="text-neutral-400">
          Help us understand your current fitness level and training volume
        </p>
      </div>

      {/* Weekly Training Hours */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          <Clock className="h-5 w-5 text-blue-500" />
          <span>Weekly Training Hours</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.selectedSports.map(sport => (
            <Card key={sport} className="bg-neutral-900/50 border-neutral-700 p-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-blue-500" />
                  <span className="text-white font-medium capitalize">{sport}</span>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-neutral-300">Hours per week</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="range"
                      min="0"
                      max="20"
                      step="0.5"
                      value={data.weeklyHours[sport] || 0}
                      onChange={(e) => updateWeeklyHours(sport, Number(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-white font-medium w-12 text-right">
                      {data.weeklyHours[sport] || 0}h
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-green-500" />
          <span>Recent Performance Metrics</span>
        </h3>
        
        <div className="space-y-4">
          {data.selectedSports.map(sport => {
            const metrics = PERFORMANCE_METRICS[sport as keyof typeof PERFORMANCE_METRICS] || []
            if (metrics.length === 0) return null

            return (
              <Card key={sport} className="bg-neutral-900/50 border-neutral-700 p-4">
                <div className="space-y-3">
                  <h4 className="text-white font-medium capitalize">{sport}</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {metrics.map(metric => (
                      <div key={metric.key} className="space-y-2">
                        <Label className="text-neutral-300">
                          {metric.label} ({metric.unit})
                        </Label>
                        <Input
                          placeholder={metric.placeholder}
                          value={data.performanceMetrics[sport]?.[metric.key] || ''}
                          onChange={(e) => updatePerformanceMetric(sport, metric.key, e.target.value)}
                          className="bg-neutral-800 border-neutral-700 text-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Historical Data Sync */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          <Download className="h-5 w-5 text-purple-500" />
          <span>Import Historical Data</span>
        </h3>
        
        <Card className="bg-neutral-900/50 border-neutral-700 p-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="sync-historical"
                checked={data.syncHistoricalData}
                onChange={(e) => updateData({ syncHistoricalData: e.target.checked })}
                className="rounded border-neutral-700 bg-neutral-800"
              />
              <Label htmlFor="sync-historical" className="text-white">
                Sync historical data from Strava/Garmin
              </Label>
            </div>
            
            <p className="text-sm text-neutral-400">
              Automatically import your past activities to better understand your training patterns and performance trends.
            </p>
            
            {data.syncHistoricalData && (
              <div className="mt-3 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-blue-400" />
                  <span className="text-blue-200 text-sm">
                    Historical data sync will be enabled after onboarding
                  </span>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

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
