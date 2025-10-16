'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { OnboardingData } from '../new-onboarding-flow'
import { cn } from '@/lib/utils'
import { 
  Activity, 
  Mountain, 
  Waves, 
  Dumbbell, 
  Zap, 
  Shield, 
  Target,
  Bike,
  Trophy
} from 'lucide-react'

interface SportSelectionStepProps {
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
  loading: boolean
  canProceed: boolean
}

const SPORTS = [
  { 
    id: 'running', 
    name: 'Running', 
    icon: Activity, 
    description: 'Road, trail, track running',
    color: 'bg-red-500'
  },
  { 
    id: 'cycling', 
    name: 'Cycling', 
    icon: Bike, 
    description: 'Road, mountain, gravel cycling',
    color: 'bg-blue-500'
  },
  { 
    id: 'climbing', 
    name: 'Climbing', 
    icon: Mountain, 
    description: 'Bouldering, sport, trad climbing',
    color: 'bg-orange-500'
  },
  { 
    id: 'swimming', 
    name: 'Swimming', 
    icon: Waves, 
    description: 'Pool, open water swimming',
    color: 'bg-cyan-500'
  },
  { 
    id: 'strength', 
    name: 'Strength Training', 
    icon: Dumbbell, 
    description: 'Weight lifting, bodyweight',
    color: 'bg-purple-500'
  },
  { 
    id: 'yoga', 
    name: 'Yoga', 
    icon: Shield, 
    description: 'Vinyasa, hatha, restorative',
    color: 'bg-green-500'
  },
  { 
    id: 'crossfit', 
    name: 'CrossFit', 
    icon: Zap, 
    description: 'Functional fitness, HIIT',
    color: 'bg-yellow-500'
  },
  { 
    id: 'triathlon', 
    name: 'Triathlon', 
    icon: Trophy, 
    description: 'Swim, bike, run multisport',
    color: 'bg-indigo-500'
  },
  { 
    id: 'martial_arts', 
    name: 'Martial Arts', 
    icon: Target, 
    description: 'Boxing, BJJ, karate, etc.',
    color: 'bg-pink-500'
  },
]

export function SportSelectionStep({ data, updateData, onNext, onBack, loading, canProceed }: SportSelectionStepProps) {
  const toggleSport = (sportId: string) => {
    const isSelected = data.selectedSports.includes(sportId)
    let newSelectedSports: string[]
    let newSportOrder: string[]

    if (isSelected) {
      newSelectedSports = data.selectedSports.filter(id => id !== sportId)
      newSportOrder = data.sportOrder.filter(id => id !== sportId)
    } else {
      newSelectedSports = [...data.selectedSports, sportId]
      newSportOrder = [...data.sportOrder, sportId]
    }

    updateData({ 
      selectedSports: newSelectedSports,
      sportOrder: newSportOrder
    })
  }

  const moveSport = (sportId: string, direction: 'up' | 'down') => {
    const currentIndex = data.sportOrder.indexOf(sportId)
    if (currentIndex === -1) return

    const newOrder = [...data.sportOrder]
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1

    if (newIndex >= 0 && newIndex < newOrder.length) {
      [newOrder[currentIndex], newOrder[newIndex]] = [newOrder[newIndex], newOrder[currentIndex]]
      updateData({ sportOrder: newOrder })
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">
          What sports do you train?
        </h2>
        <p className="text-neutral-400">
          Select all that apply and drag to reorder by priority
        </p>
      </div>

      {/* Sport Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SPORTS.map((sport) => {
          const Icon = sport.icon
          const isSelected = data.selectedSports.includes(sport.id)
          const priority = data.sportOrder.indexOf(sport.id) + 1

          return (
            <Card
              key={sport.id}
              className={cn(
                'cursor-pointer transition-all hover:scale-105',
                isSelected
                  ? 'bg-gradient-to-br from-neutral-800 to-neutral-900 border-blue-500'
                  : 'bg-neutral-900/50 border-neutral-700 hover:border-neutral-600'
              )}
              onClick={() => toggleSport(sport.id)}
            >
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className={cn('p-2 rounded-lg', sport.color)}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  {isSelected && (
                    <Badge variant="secondary" className="bg-blue-600 text-white">
                      #{priority}
                    </Badge>
                  )}
                </div>
                
                <div>
                  <h3 className="font-semibold text-white">{sport.name}</h3>
                  <p className="text-sm text-neutral-400">{sport.description}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Priority Order */}
      {data.selectedSports.length > 1 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Training Priority Order</h3>
          <div className="space-y-2">
            {data.sportOrder.map((sportId, index) => {
              const sport = SPORTS.find(s => s.id === sportId)
              if (!sport) return null

              const Icon = sport.icon
              return (
                <div
                  key={sportId}
                  className="flex items-center justify-between p-3 bg-neutral-900/50 rounded-lg border border-neutral-700"
                >
                  <div className="flex items-center space-x-3">
                    <Badge variant="secondary" className="bg-blue-600 text-white">
                      {index + 1}
                    </Badge>
                    <div className={cn('p-1 rounded', sport.color)}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-white font-medium">{sport.name}</span>
                  </div>
                  
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => moveSport(sportId, 'up')}
                      disabled={index === 0}
                      className="h-8 w-8 p-0"
                    >
                      ↑
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => moveSport(sportId, 'down')}
                      disabled={index === data.sportOrder.length - 1}
                      className="h-8 w-8 p-0"
                    >
                      ↓
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

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
