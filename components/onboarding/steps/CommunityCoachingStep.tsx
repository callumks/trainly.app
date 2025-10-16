'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { OnboardingData } from '../new-onboarding-flow'
import { cn } from '@/lib/utils'
import { 
  Users, 
  MessageCircle, 
  Trophy,
  Target,
  Zap,
  CheckCircle,
  Plus,
  X
} from 'lucide-react'

interface CommunityCoachingStepProps {
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
  loading: boolean
  canProceed: boolean
}

const INTEREST_GROUPS = [
  { 
    id: 'cyclist-climber', 
    name: 'Cyclist-Climber Hybrid Hub', 
    description: 'For athletes who love both cycling and climbing',
    members: '2.3k',
    icon: '🚴‍♂️🧗‍♂️'
  },
  { 
    id: 'triathlon', 
    name: 'Triathlon Community', 
    description: 'Swim, bike, run multisport athletes',
    members: '5.1k',
    icon: '🏊‍♂️🚴‍♂️🏃‍♂️'
  },
  { 
    id: 'strength-endurance', 
    name: 'Strength & Endurance', 
    description: 'Balancing strength training with endurance sports',
    members: '3.7k',
    icon: '💪🏃‍♂️'
  },
  { 
    id: 'mountain-sports', 
    name: 'Mountain Sports', 
    description: 'Climbing, trail running, and alpine adventures',
    members: '4.2k',
    icon: '🏔️🥾'
  },
  { 
    id: 'beginner-friendly', 
    name: 'Beginner Friendly', 
    description: 'Supportive community for new athletes',
    members: '1.8k',
    icon: '🌟'
  },
  { 
    id: 'competitive', 
    name: 'Competitive Athletes', 
    description: 'Serious athletes focused on performance',
    members: '2.9k',
    icon: '🏆'
  },
]

const COACHING_OPTIONS = [
  {
    id: 'basic',
    name: 'Self-Guided',
    description: 'AI-powered plans with community support',
    price: 'Free',
    features: ['AI Training Plans', 'Community Access', 'Basic Analytics']
  },
  {
    id: 'coach-connect',
    name: 'Coach Connect',
    description: 'Connect with certified coaches for personalized guidance',
    price: '$49/month',
    features: ['Everything in Basic', 'Coach Matching', 'Monthly Check-ins', 'Priority Support']
  },
  {
    id: 'premium-coaching',
    name: 'Premium Coaching',
    description: 'Dedicated coach with weekly check-ins and custom plans',
    price: '$149/month',
    features: ['Everything in Coach Connect', 'Weekly Check-ins', 'Custom Nutrition Plans', 'Race Strategy']
  }
]

export function CommunityCoachingStep({ data, updateData, onNext, onBack, loading, canProceed }: CommunityCoachingStepProps) {
  const [selectedCoaching, setSelectedCoaching] = useState('basic')

  const toggleInterestGroup = (groupId: string) => {
    const isSelected = data.interestGroups.includes(groupId)
    if (isSelected) {
      updateData({ interestGroups: data.interestGroups.filter(id => id !== groupId) })
    } else {
      updateData({ interestGroups: [...data.interestGroups, groupId] })
    }
  }

  const handleCoachingSelection = (coachingId: string) => {
    setSelectedCoaching(coachingId)
    updateData({ coachConnect: coachingId !== 'basic' })
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">
          Community & Coaching Options
        </h2>
        <p className="text-neutral-400">
          Join communities and choose your coaching level
        </p>
      </div>

      {/* Interest Groups */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          <Users className="h-5 w-5 text-blue-500" />
          <span>Join Interest Groups</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {INTEREST_GROUPS.map((group) => {
            const isSelected = data.interestGroups.includes(group.id)
            return (
              <Card
                key={group.id}
                className={cn(
                  'cursor-pointer transition-all hover:scale-105',
                  isSelected
                    ? 'bg-gradient-to-br from-neutral-800 to-neutral-900 border-blue-500'
                    : 'bg-neutral-900/50 border-neutral-700 hover:border-neutral-600'
                )}
                onClick={() => toggleInterestGroup(group.id)}
              >
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-2xl">{group.icon}</div>
                    {isSelected && (
                      <CheckCircle className="h-5 w-5 text-blue-500" />
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-white">{group.name}</h4>
                    <p className="text-sm text-neutral-400">{group.description}</p>
                    <div className="flex items-center space-x-1 mt-2">
                      <Users className="h-3 w-3 text-neutral-500" />
                      <span className="text-xs text-neutral-500">{group.members} members</span>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Coaching Options */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          <MessageCircle className="h-5 w-5 text-green-500" />
          <span>Choose Your Coaching Level</span>
        </h3>
        
        <div className="space-y-4">
          {COACHING_OPTIONS.map((option) => {
            const isSelected = selectedCoaching === option.id
            return (
              <Card
                key={option.id}
                className={cn(
                  'cursor-pointer transition-all hover:scale-105',
                  isSelected
                    ? 'bg-gradient-to-br from-neutral-800 to-neutral-900 border-green-500'
                    : 'bg-neutral-900/50 border-neutral-700 hover:border-neutral-600'
                )}
                onClick={() => handleCoachingSelection(option.id)}
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-white">{option.name}</h4>
                      <p className="text-sm text-neutral-400">{option.description}</p>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold text-white">{option.price}</div>
                      {isSelected && (
                        <Badge variant="secondary" className="bg-green-600 text-white mt-1">
                          Selected
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {option.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span className="text-sm text-neutral-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Additional Preferences */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          <Target className="h-5 w-5 text-purple-500" />
          <span>Additional Preferences</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-neutral-900/50 border-neutral-700 p-4">
            <div className="space-y-3">
              <h4 className="text-white font-medium">Motivation Style</h4>
              <div className="space-y-2">
                {['Progress charts', 'Social challenges', 'Coach check-ins', 'Goal tracking'].map((motivator) => {
                  const isSelected = data.motivation.includes(motivator)
                  return (
                    <div
                      key={motivator}
                      className="flex items-center space-x-2 cursor-pointer"
                      onClick={() => {
                        const newMotivation = isSelected
                          ? data.motivation.filter(m => m !== motivator)
                          : [...data.motivation, motivator]
                        updateData({ motivation: newMotivation })
                      }}
                    >
                      <div className={cn(
                        'w-4 h-4 rounded border-2 flex items-center justify-center',
                        isSelected ? 'bg-purple-600 border-purple-600' : 'border-neutral-600'
                      )}>
                        {isSelected && <CheckCircle className="h-3 w-3 text-white" />}
                      </div>
                      <span className="text-sm text-neutral-300">{motivator}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </Card>
          
          <Card className="bg-neutral-900/50 border-neutral-700 p-4">
            <div className="space-y-3">
              <h4 className="text-white font-medium">Feedback Style</h4>
              <div className="space-y-2">
                {[
                  { id: 'data-driven', label: 'Data-driven insights' },
                  { id: 'motivational', label: 'Motivational messages' },
                  { id: 'both', label: 'Both' }
                ].map((style) => (
                  <div
                    key={style.id}
                    className="flex items-center space-x-2 cursor-pointer"
                    onClick={() => updateData({ feedbackStyle: style.id as any })}
                  >
                    <div className={cn(
                      'w-4 h-4 rounded-full border-2',
                      data.feedbackStyle === style.id ? 'bg-purple-600 border-purple-600' : 'border-neutral-600'
                    )} />
                    <span className="text-sm text-neutral-300">{style.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
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
          disabled={loading}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {loading ? 'Saving...' : 'Next'}
        </Button>
      </div>
    </div>
  )
}
