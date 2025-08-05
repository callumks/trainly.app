'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Activity, Target, Trophy, Users, Zap, Heart } from 'lucide-react'
import { useSupabase } from '@/components/providers/supabase-provider'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

interface OnboardingFlowProps {
  userId: string
}

const goals = [
  { id: 'endurance', name: 'Build Endurance', icon: Heart, description: 'Improve cardiovascular fitness and stamina' },
  { id: 'strength', name: 'Build Strength', icon: Zap, description: 'Increase muscle strength and power' },
  { id: 'performance', name: 'Race Performance', icon: Trophy, description: 'Prepare for specific events or competitions' },
  { id: 'general', name: 'General Fitness', icon: Target, description: 'Maintain overall health and fitness' },
  { id: 'weight', name: 'Weight Management', icon: Users, description: 'Lose weight or change body composition' },
]

const sports = [
  { id: 'running', name: 'Running' },
  { id: 'cycling', name: 'Cycling' },
  { id: 'swimming', name: 'Swimming' },
  { id: 'triathlon', name: 'Triathlon' },
  { id: 'weightlifting', name: 'Weight Lifting' },
  { id: 'crossfit', name: 'CrossFit' },
  { id: 'climbing', name: 'Climbing' },
  { id: 'martial_arts', name: 'Martial Arts' },
  { id: 'other', name: 'Other' },
]

const experienceLevels = [
  { id: 'beginner', name: 'Beginner', description: 'New to structured training' },
  { id: 'intermediate', name: 'Intermediate', description: 'Some training experience' },
  { id: 'advanced', name: 'Advanced', description: 'Experienced athlete' },
]

export function OnboardingFlow({ userId }: OnboardingFlowProps) {
  const { supabase } = useSupabase()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  
  const [selectedGoals, setSelectedGoals] = useState<string[]>([])
  const [selectedSports, setSelectedSports] = useState<string[]>([])
  const [selectedExperience, setSelectedExperience] = useState<string>('')

  const totalSteps = 3
  const progress = (step / totalSteps) * 100

  const toggleGoal = (goalId: string) => {
    setSelectedGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    )
  }

  const toggleSport = (sportId: string) => {
    setSelectedSports(prev => 
      prev.includes(sportId) 
        ? prev.filter(id => id !== sportId)
        : [...prev, sportId]
    )
  }

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      handleComplete()
    }
  }

  const handleComplete = async () => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          goals: selectedGoals,
          sports: selectedSports,
          experience_level: selectedExperience,
        })
        .eq('id', userId)

      if (error) throw error

      toast.success('Welcome to trainly! Your profile is complete.')
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.message || 'Failed to complete onboarding')
    } finally {
      setLoading(false)
    }
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return selectedGoals.length > 0
      case 2:
        return selectedSports.length > 0
      case 3:
        return selectedExperience !== ''
      default:
        return false
    }
  }

  return (
    <div className="mobile-container py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Activity className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">trainly</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Let's set up your training</h1>
          <p className="text-muted-foreground">
            Help us personalize your experience
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Step {step} of {totalSteps}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1 && 'What are your goals?'}
              {step === 2 && 'What sports do you do?'}
              {step === 3 && 'What\'s your experience level?'}
            </CardTitle>
            <CardDescription>
              {step === 1 && 'Select all that apply to help us create the perfect training plan'}
              {step === 2 && 'Choose the activities you want to focus on'}
              {step === 3 && 'This helps us calibrate your training intensity'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Goals */}
            {step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {goals.map((goal) => {
                  const Icon = goal.icon
                  const isSelected = selectedGoals.includes(goal.id)
                  return (
                    <div
                      key={goal.id}
                      onClick={() => toggleGoal(goal.id)}
                      className={cn(
                        'p-4 border rounded-lg cursor-pointer transition-all hover:bg-muted',
                        isSelected
                          ? 'border-primary bg-primary/10'
                          : 'border-border'
                      )}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <Icon className="h-5 w-5 text-primary" />
                        <h3 className="font-medium">{goal.name}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {goal.description}
                      </p>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Step 2: Sports */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {sports.map((sport) => {
                    const isSelected = selectedSports.includes(sport.id)
                    return (
                      <Badge
                        key={sport.id}
                        variant={isSelected ? 'default' : 'outline'}
                        className="cursor-pointer p-3 justify-center hover:bg-primary/80"
                        onClick={() => toggleSport(sport.id)}
                      >
                        {sport.name}
                      </Badge>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Step 3: Experience */}
            {step === 3 && (
              <div className="space-y-4">
                {experienceLevels.map((level) => {
                  const isSelected = selectedExperience === level.id
                  return (
                    <div
                      key={level.id}
                      onClick={() => setSelectedExperience(level.id)}
                      className={cn(
                        'p-4 border rounded-lg cursor-pointer transition-all hover:bg-muted',
                        isSelected
                          ? 'border-primary bg-primary/10'
                          : 'border-border'
                      )}
                    >
                      <h3 className="font-medium mb-1">{level.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {level.description}
                      </p>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                disabled={step === 1}
              >
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={!canProceed() || loading}
              >
                {step === totalSteps ? 'Complete Setup' : 'Next'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 