'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { OnboardingData } from '../new-onboarding-flow'
import { cn } from '@/lib/utils'
import { 
  Settings, 
  Calendar, 
  Target,
  Zap,
  Apple,
  Dumbbell
} from 'lucide-react'

interface ProgramPreferencesStepProps {
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
  loading: boolean
  canProceed: boolean
}

const PLAN_TYPES = [
  { 
    id: 'training', 
    name: 'Training Only', 
    description: 'Focus on workout plans and performance',
    icon: Target,
    color: 'bg-blue-500'
  },
  { 
    id: 'nutrition', 
    name: 'Nutrition Only', 
    description: 'Focus on fueling and recovery nutrition',
    icon: Apple,
    color: 'bg-green-500'
  },
  { 
    id: 'combined', 
    name: 'Training + Nutrition', 
    description: 'Complete program with workouts and nutrition',
    icon: Zap,
    color: 'bg-purple-500'
  },
]

const TRAINING_STRUCTURES = [
  { 
    id: 'structured', 
    name: 'Structured Workouts', 
    description: 'Specific workouts with prescribed intensity and duration'
  },
  { 
    id: 'freeform', 
    name: 'Free-form Schedule', 
    description: 'Flexible training with general guidelines'
  },
]

export function ProgramPreferencesStep({ data, updateData, onNext, onBack, loading, canProceed }: ProgramPreferencesStepProps) {
  const updateFrequency = (sport: string, frequency: number) => {
    updateData({ 
      frequency: { ...data.frequency, [sport]: frequency }
    })
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">
          Program Preferences
        </h2>
        <p className="text-neutral-400">
          Choose your preferred training approach and structure
        </p>
      </div>

      {/* Plan Type */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          <Settings className="h-5 w-5 text-blue-500" />
          <span>Program Type</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PLAN_TYPES.map((type) => {
            const Icon = type.icon
            const isSelected = data.planType === type.id
            return (
              <Card
                key={type.id}
                className={cn(
                  'cursor-pointer transition-all hover:scale-105',
                  isSelected
                    ? 'bg-gradient-to-br from-neutral-800 to-neutral-900 border-blue-500'
                    : 'bg-neutral-900/50 border-neutral-700 hover:border-neutral-600'
                )}
                onClick={() => updateData({ planType: type.id as 'training' | 'nutrition' | 'combined' })}
              >
                <div className="p-4 space-y-3">
                  <div className={cn('p-2 rounded-lg w-fit', type.color)}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-white">{type.name}</h4>
                    <p className="text-sm text-neutral-400">{type.description}</p>
                  </div>
                  
                  {isSelected && (
                    <Badge variant="secondary" className="bg-blue-600 text-white">
                      Selected
                    </Badge>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Training Frequency */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-green-500" />
          <span>Training Frequency per Sport</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.selectedSports.map(sport => (
            <Card key={sport} className="bg-neutral-900/50 border-neutral-700 p-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Dumbbell className="h-4 w-4 text-green-500" />
                  <span className="text-white font-medium capitalize">{sport}</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-300 text-sm">Sessions per week</span>
                    <span className="text-white font-medium">
                      {data.frequency[sport] || 0}
                    </span>
                  </div>
                  
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5, 6, 7].map(num => (
                      <button
                        key={num}
                        onClick={() => updateFrequency(sport, num)}
                        className={cn(
                          'w-8 h-8 rounded-full text-sm font-medium transition-colors',
                          data.frequency[sport] === num
                            ? 'bg-green-600 text-white'
                            : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
                        )}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Training Structure */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          <Target className="h-5 w-5 text-purple-500" />
          <span>Training Structure Preference</span>
        </h3>
        
        <div className="space-y-3">
          {TRAINING_STRUCTURES.map((structure) => {
            const isSelected = data.trainingStructure === structure.id
            return (
              <Card
                key={structure.id}
                className={cn(
                  'cursor-pointer transition-all hover:scale-105',
                  isSelected
                    ? 'bg-gradient-to-br from-neutral-800 to-neutral-900 border-purple-500'
                    : 'bg-neutral-900/50 border-neutral-700 hover:border-neutral-600'
                )}
                onClick={() => updateData({ trainingStructure: structure.id as 'structured' | 'freeform' })}
              >
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-white">{structure.name}</h4>
                      <p className="text-sm text-neutral-400">{structure.description}</p>
                    </div>
                    
                    {isSelected && (
                      <Badge variant="secondary" className="bg-purple-600 text-white">
                        Selected
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
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
          disabled={!canProceed || loading}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {loading ? 'Saving...' : 'Next'}
        </Button>
      </div>
    </div>
  )
}
