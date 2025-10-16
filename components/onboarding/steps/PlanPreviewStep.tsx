'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { OnboardingData } from '../new-onboarding-flow'
import { cn } from '@/lib/utils'
import { 
  Calendar, 
  Activity, 
  Zap,
  Moon,
  Apple,
  Dumbbell,
  ArrowUpDown,
  Plus,
  Minus
} from 'lucide-react'

interface PlanPreviewStepProps {
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
  loading: boolean
  canProceed: boolean
}

const SAMPLE_WEEK = [
  { day: 'Monday', sport: 'Running', type: 'Easy Run', duration: '45 min', intensity: 'Low' },
  { day: 'Tuesday', sport: 'Strength', type: 'Upper Body', duration: '60 min', intensity: 'High' },
  { day: 'Wednesday', sport: 'Cycling', type: 'Interval Training', duration: '75 min', intensity: 'High' },
  { day: 'Thursday', sport: 'Running', type: 'Tempo Run', duration: '50 min', intensity: 'Medium' },
  { day: 'Friday', sport: 'Climbing', type: 'Bouldering', duration: '90 min', intensity: 'Medium' },
  { day: 'Saturday', sport: 'Cycling', type: 'Long Ride', duration: '120 min', intensity: 'Low' },
  { day: 'Sunday', sport: 'Recovery', type: 'Rest Day', duration: '0 min', intensity: 'None' },
]

export function PlanPreviewStep({ data, updateData, onNext, onBack, loading, canProceed }: PlanPreviewStepProps) {
  const adjustVolume = (day: string, direction: 'up' | 'down') => {
    // This would typically update the actual plan data
    console.log(`Adjusting ${day} volume ${direction}`)
  }

  const swapDays = (day1: string, day2: string) => {
    // This would typically swap the workouts between days
    console.log(`Swapping ${day1} and ${day2}`)
  }

  const getIntensityColor = (intensity: string) => {
    switch (intensity.toLowerCase()) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-neutral-500'
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">
          Your Personalized Training Plan
        </h2>
        <p className="text-neutral-400">
          Preview and customize your weekly training schedule
        </p>
      </div>

      {/* Plan Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-neutral-900/50 border-neutral-700 p-4">
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-blue-500" />
            <div>
              <h3 className="text-white font-medium">Training Days</h3>
              <p className="text-2xl font-bold text-blue-400">6</p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-neutral-900/50 border-neutral-700 p-4">
          <div className="flex items-center space-x-3">
            <Activity className="h-5 w-5 text-green-500" />
            <div>
              <h3 className="text-white font-medium">Weekly Volume</h3>
              <p className="text-2xl font-bold text-green-400">8.5h</p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-neutral-900/50 border-neutral-700 p-4">
          <div className="flex items-center space-x-3">
            <Zap className="h-5 w-5 text-yellow-500" />
            <div>
              <h3 className="text-white font-medium">Intensity Mix</h3>
              <p className="text-sm text-yellow-400">2 High, 2 Medium, 2 Low</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Weekly Schedule */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Weekly Schedule</h3>
        
        <div className="space-y-3">
          {SAMPLE_WEEK.map((workout, index) => (
            <Card key={workout.day} className="bg-neutral-900/50 border-neutral-700 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-20">
                    <Badge variant="outline" className="text-xs">
                      {workout.day}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className={cn('w-3 h-3 rounded-full', getIntensityColor(workout.intensity))} />
                    <div>
                      <h4 className="text-white font-medium">{workout.type}</h4>
                      <p className="text-sm text-neutral-400">{workout.sport}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-white font-medium">{workout.duration}</p>
                    <p className="text-xs text-neutral-400">{workout.intensity}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => adjustVolume(workout.day, 'down')}
                    className="h-8 w-8 p-0"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => adjustVolume(workout.day, 'up')}
                    className="h-8 w-8 p-0"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Customization Options */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Customization Options</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-neutral-900/50 border-neutral-700 p-4">
            <div className="space-y-3">
              <h4 className="text-white font-medium">Adjust Volume</h4>
              <p className="text-sm text-neutral-400">
                Increase or decrease training duration for specific days
              </p>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="bg-neutral-800">
                  <Minus className="h-3 w-3 mr-1" />
                  Reduce
                </Button>
                <Button size="sm" variant="outline" className="bg-neutral-800">
                  <Plus className="h-3 w-3 mr-1" />
                  Increase
                </Button>
              </div>
            </div>
          </Card>
          
          <Card className="bg-neutral-900/50 border-neutral-700 p-4">
            <div className="space-y-3">
              <h4 className="text-white font-medium">Swap Days</h4>
              <p className="text-sm text-neutral-400">
                Move workouts to different days of the week
              </p>
              <Button size="sm" variant="outline" className="bg-neutral-800">
                <ArrowUpDown className="h-3 w-3 mr-1" />
                Swap Workouts
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Recovery Week */}
      <Card className="bg-purple-900/20 border-purple-500/30 p-4">
        <div className="space-y-3">
          <h4 className="text-purple-200 font-medium">Recovery Week Schedule</h4>
          <p className="text-purple-300/80 text-sm">
            Every 4th week will be a recovery week with 20% reduced volume to prevent overtraining and promote adaptation.
          </p>
          <div className="flex items-center space-x-2">
            <Moon className="h-4 w-4 text-purple-400" />
            <span className="text-purple-300 text-sm">Next recovery week: Week 4</span>
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
