'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

// Import step components
import { WelcomeStep } from './steps/WelcomeStep'
import { SportSelectionStep } from './steps/SportSelectionStep'
import { GoalDefinitionStep } from './steps/GoalDefinitionStep'
import { InjuryHealthStep } from './steps/InjuryHealthStep'
import { TrainingHistoryStep } from './steps/TrainingHistoryStep'
import { ProgramPreferencesStep } from './steps/ProgramPreferencesStep'
import { NutritionLifestyleStep } from './steps/NutritionLifestyleStep'
import { RecoveryReadinessStep } from './steps/RecoveryReadinessStep'
import { PlanPreviewStep } from './steps/PlanPreviewStep'
import { CommunityCoachingStep } from './steps/CommunityCoachingStep'
import { FinalReviewStep } from './steps/FinalReviewStep'

export interface OnboardingData {
  // Welcome & Account Setup
  name: string
  oauthProvider?: 'strava' | 'google' | 'apple'
  
  // Sport Selection
  selectedSports: string[]
  sportOrder: string[]
  
  // Goal Definition
  goals: Array<{
    sport: string
    goal: string
    deadline: string
    isTemplate: boolean
  }>
  
  // Injury & Health Profile
  currentInjuries: string
  pastInjuries: string[]
  height?: number
  weight?: number
  age?: number
  sex?: 'male' | 'female' | 'other'
  
  // Training History & Baseline Metrics
  weeklyHours: Record<string, number>
  performanceMetrics: Record<string, any>
  syncHistoricalData: boolean
  
  // Program Preferences
  planType: 'training' | 'nutrition' | 'combined'
  frequency: Record<string, number>
  trainingStructure: 'structured' | 'freeform'
  
  // Nutrition & Lifestyle
  dietaryPreferences: string[]
  allergies: string[]
  scheduleConstraints: string
  sleepHabits: string
  
  // Recovery & Readiness
  baselineFatigue: {
    energy: number
    sleepQuality: number
    soreness: number
  }
  hrv?: number
  restingHeartRate?: number
  
  // Community & Coaching
  interestGroups: string[]
  coachConnect: boolean
  
  // Additional Preferences
  motivation: string[]
  feedbackStyle: 'data-driven' | 'motivational' | 'both'
  injuryPreventionFocus: string[]
  maxWorkoutDuration: number
  recoveryPreferences: string[]
}

interface OnboardingFlowProps {
  userId: string
}

const STEPS = [
  { id: 'welcome', title: 'Welcome & Account Setup', component: WelcomeStep },
  { id: 'sports', title: 'Sport Selection', component: SportSelectionStep },
  { id: 'goals', title: 'Goal Definition', component: GoalDefinitionStep },
  { id: 'injury', title: 'Injury & Health Profile', component: InjuryHealthStep },
  { id: 'history', title: 'Training History', component: TrainingHistoryStep },
  { id: 'preferences', title: 'Program Preferences', component: ProgramPreferencesStep },
  { id: 'nutrition', title: 'Nutrition & Lifestyle', component: NutritionLifestyleStep },
  { id: 'recovery', title: 'Recovery & Readiness', component: RecoveryReadinessStep },
  { id: 'preview', title: 'Plan Preview', component: PlanPreviewStep },
  { id: 'community', title: 'Community & Coaching', component: CommunityCoachingStep },
  { id: 'review', title: 'Final Review', component: FinalReviewStep },
]

export function NewOnboardingFlow({ userId }: OnboardingFlowProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    name: '',
    selectedSports: [],
    sportOrder: [],
    goals: [],
    currentInjuries: '',
    pastInjuries: [],
    weeklyHours: {},
    performanceMetrics: {},
    syncHistoricalData: false,
    planType: 'combined',
    frequency: {},
    trainingStructure: 'structured',
    dietaryPreferences: [],
    allergies: [],
    scheduleConstraints: '',
    sleepHabits: '',
    baselineFatigue: {
      energy: 5,
      sleepQuality: 5,
      soreness: 3,
    },
    interestGroups: [],
    coachConnect: false,
    motivation: [],
    feedbackStyle: 'both',
    injuryPreventionFocus: [],
    maxWorkoutDuration: 90,
    recoveryPreferences: [],
  })

  const totalSteps = STEPS.length
  const progress = ((currentStep + 1) / totalSteps) * 100

  const updateData = (updates: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...updates }))
  }

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
    setLoading(true)
    try {
      // Persist key onboarding fields via API
      const goals = onboardingData.goals.map(g => g.goal)
      const sports = onboardingData.selectedSports
      const experience_level = onboardingData.baselineFatigue.energy > 7 ? 'advanced' : 
                               onboardingData.baselineFatigue.energy > 4 ? 'intermediate' : 'beginner'
      const weekly_volume = typeof onboardingData.weeklyHours?.overall === 'number' ? onboardingData.weeklyHours.overall : undefined

      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ goals, sports, experience_level, weekly_volume }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || 'Failed to save onboarding')
      }

      toast.success('Welcome to Trainly! Your personalized training plan is ready.')
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.message || 'Failed to complete onboarding')
    } finally {
      setLoading(false)
    }
  }

  const canProceed = () => {
    const step = STEPS[currentStep]
    switch (step.id) {
      case 'welcome':
        return !!onboardingData.name
      case 'sports':
        return onboardingData.selectedSports.length > 0
      case 'goals':
        return onboardingData.goals.length > 0
      case 'injury':
        return true // Optional step
      case 'history':
        return true // Optional step
      case 'preferences':
        return !!(onboardingData.planType && onboardingData.trainingStructure)
      case 'nutrition':
        return true // Optional step
      case 'recovery':
        return true // Optional step
      case 'preview':
        return true // Review step
      case 'community':
        return true // Optional step
      case 'review':
        return true // Final step
      default:
        return false
    }
  }

  const CurrentStepComponent = STEPS[currentStep].component

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-950 to-neutral-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-2xl font-bold text-white">trainly</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Train smarter across all your sports
          </h1>
          <p className="text-neutral-400">
            Let's create your personalized training plan
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-neutral-400 mb-2">
            <span>Step {currentStep + 1} of {totalSteps}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>

        {/* Step Content */}
        <Card className="bg-neutral-950/60 border-neutral-800">
          <CardHeader>
            <CardTitle className="text-white">
              {STEPS[currentStep].title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CurrentStepComponent
              data={onboardingData}
              updateData={updateData}
              onNext={handleNext}
              onBack={handleBack}
              loading={loading}
              canProceed={canProceed()}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
