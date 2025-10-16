'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { OnboardingData } from '../new-onboarding-flow'
import { cn } from '@/lib/utils'
import { 
  CheckCircle, 
  Calendar, 
  CreditCard,
  Star,
  Zap,
  Users,
  Target,
  Heart,
  Apple,
  Clock,
  Moon
} from 'lucide-react'

interface FinalReviewStepProps {
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
  loading: boolean
  canProceed: boolean
}

export function FinalReviewStep({ data, updateData, onNext, onBack, loading, canProceed }: FinalReviewStepProps) {
  const trialEndDate = new Date()
  trialEndDate.setDate(trialEndDate.getDate() + 7)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">
          Final Review & Trial Start
        </h2>
        <p className="text-neutral-400">
          Review your settings and start your 7-day free trial
        </p>
      </div>

      {/* Trial Information */}
      <Card className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-500/50 p-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Star className="h-6 w-6 text-yellow-400" />
            <h3 className="text-xl font-bold text-white">7-Day Free Trial</h3>
          </div>
          
          <div className="space-y-2">
            <p className="text-blue-200">
              Your trial starts today and ends on <strong>{formatDate(trialEndDate)}</strong>
            </p>
            <p className="text-blue-300/80 text-sm">
              No credit card required • Cancel anytime • Full access to all features
            </p>
          </div>
          
          <div className="flex items-center justify-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-green-200">AI Training Plans</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-green-200">Performance Analytics</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-green-200">Community Access</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Settings Summary */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Your Settings Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Sports & Goals */}
          <Card className="bg-neutral-900/50 border-neutral-700 p-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-blue-500" />
                <h4 className="text-white font-medium">Sports & Goals</h4>
              </div>
              
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-neutral-400">Primary Sports:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {data.selectedSports.slice(0, 3).map((sport, index) => (
                      <Badge key={sport} variant="outline" className="text-xs">
                        #{index + 1} {sport}
                      </Badge>
                    ))}
                    {data.selectedSports.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{data.selectedSports.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-neutral-400">Goals:</p>
                  <p className="text-white text-sm">{data.goals.length} performance goals set</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Training Preferences */}
          <Card className="bg-neutral-900/50 border-neutral-700 p-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                <h4 className="text-white font-medium">Training Preferences</h4>
              </div>
              
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-neutral-400">Program Type:</p>
                  <p className="text-white text-sm capitalize">{data.planType}</p>
                </div>
                
                <div>
                  <p className="text-sm text-neutral-400">Structure:</p>
                  <p className="text-white text-sm capitalize">{data.trainingStructure}</p>
                </div>
                
                <div>
                  <p className="text-sm text-neutral-400">Weekly Volume:</p>
                  <p className="text-white text-sm">
                    {Object.values(data.weeklyHours).reduce((sum, hours) => sum + (hours || 0), 0).toFixed(1)}h total
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Health & Recovery */}
          <Card className="bg-neutral-900/50 border-neutral-700 p-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Heart className="h-4 w-4 text-red-500" />
                <h4 className="text-white font-medium">Health & Recovery</h4>
              </div>
              
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-neutral-400">Current Injuries:</p>
                  <p className="text-white text-sm">
                    {data.currentInjuries ? 'Reported' : 'None reported'}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-neutral-400">Past Injuries:</p>
                  <p className="text-white text-sm">{data.pastInjuries.length} recorded</p>
                </div>
                
                <div>
                  <p className="text-sm text-neutral-400">Energy Level:</p>
                  <p className="text-white text-sm">{data.baselineFatigue.energy}/10</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Nutrition & Lifestyle */}
          <Card className="bg-neutral-900/50 border-neutral-700 p-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Apple className="h-4 w-4 text-green-500" />
                <h4 className="text-white font-medium">Nutrition & Lifestyle</h4>
              </div>
              
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-neutral-400">Dietary Preferences:</p>
                  <p className="text-white text-sm">
                    {data.dietaryPreferences.length > 0 
                      ? data.dietaryPreferences.slice(0, 2).join(', ')
                      : 'No restrictions'
                    }
                    {data.dietaryPreferences.length > 2 && ' +more'}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-neutral-400">Allergies:</p>
                  <p className="text-white text-sm">
                    {data.allergies.length > 0 ? `${data.allergies.length} recorded` : 'None'}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-neutral-400">Sleep Quality:</p>
                  <p className="text-white text-sm">{data.baselineFatigue.sleepQuality}/10</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Community & Coaching */}
      <Card className="bg-neutral-900/50 border-neutral-700 p-4">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-purple-500" />
            <h4 className="text-white font-medium">Community & Coaching</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-neutral-400">Interest Groups:</p>
              <p className="text-white text-sm">
                {data.interestGroups.length > 0 
                  ? `Joined ${data.interestGroups.length} groups`
                  : 'No groups selected'
                }
              </p>
            </div>
            
            <div>
              <p className="text-sm text-neutral-400">Coaching Level:</p>
              <p className="text-white text-sm">
                {data.coachConnect ? 'Coach Connect' : 'Self-Guided'}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* What Happens Next */}
      <Card className="bg-green-900/20 border-green-500/30 p-4">
        <div className="space-y-3">
          <h4 className="text-green-200 font-medium">What happens next?</h4>
          <div className="space-y-2 text-sm text-green-300/80">
            <div className="flex items-center space-x-2">
              <Clock className="h-3 w-3" />
              <span>Your personalized training plan will be generated within 2 minutes</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-3 w-3" />
              <span>Your first week of training will be ready to start immediately</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="h-3 w-3" />
              <span>AI will adapt your plan based on your progress and feedback</span>
            </div>
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
          className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-lg px-8 py-3"
        >
          {loading ? 'Starting Trial...' : 'Start Free Trial'}
        </Button>
      </div>
    </div>
  )
}
