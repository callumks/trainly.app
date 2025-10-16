'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { OnboardingData } from '../new-onboarding-flow'
import { cn } from '@/lib/utils'
import { 
  AlertTriangle, 
  Heart, 
  Ruler, 
  Weight, 
  Calendar,
  User,
  Plus,
  X
} from 'lucide-react'

interface InjuryHealthStepProps {
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
  loading: boolean
  canProceed: boolean
}

const PAST_INJURY_OPTIONS = [
  'Knee (ACL, meniscus, patellar)',
  'Shoulder (rotator cuff, labrum)',
  'Lower back (herniated disc, strain)',
  'Ankle (sprain, fracture)',
  'Hip (labral tear, impingement)',
  'Wrist/Hand (carpal tunnel, tendonitis)',
  'Elbow (tennis elbow, golfer\'s elbow)',
  'Neck (whiplash, strain)',
  'Foot (plantar fasciitis, stress fracture)',
  'Hamstring (strain, tear)',
  'Achilles (tendonitis, rupture)',
  'Other'
]

export function InjuryHealthStep({ data, updateData, onNext, onBack, loading, canProceed }: InjuryHealthStepProps) {
  const [customInjury, setCustomInjury] = useState('')

  const togglePastInjury = (injury: string) => {
    const isSelected = data.pastInjuries.includes(injury)
    if (isSelected) {
      updateData({ pastInjuries: data.pastInjuries.filter(i => i !== injury) })
    } else {
      updateData({ pastInjuries: [...data.pastInjuries, injury] })
    }
  }

  const addCustomInjury = () => {
    if (customInjury.trim() && !data.pastInjuries.includes(customInjury.trim())) {
      updateData({ pastInjuries: [...data.pastInjuries, customInjury.trim()] })
      setCustomInjury('')
    }
  }

  const removePastInjury = (injury: string) => {
    updateData({ pastInjuries: data.pastInjuries.filter(i => i !== injury) })
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">
          Injury & Health Profile
        </h2>
        <p className="text-neutral-400">
          Help us create safe, personalized training plans
        </p>
      </div>

      {/* Current Injuries */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          <span>Current Injuries & Recovery Status</span>
        </h3>
        <Card className="bg-neutral-900/50 border-neutral-700 p-4">
          <Textarea
            placeholder="Describe any current injuries, pain, or limitations you're experiencing. Include recovery timeline if known."
            value={data.currentInjuries}
            onChange={(e) => updateData({ currentInjuries: e.target.value })}
            rows={4}
            className="bg-neutral-800 border-neutral-700 text-white placeholder-neutral-400"
          />
        </Card>
      </div>

      {/* Past Injuries */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          <Heart className="h-5 w-5 text-red-500" />
          <span>Past Injuries (Select all that apply)</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {PAST_INJURY_OPTIONS.map((injury) => {
            const isSelected = data.pastInjuries.includes(injury)
            return (
              <Card
                key={injury}
                className={cn(
                  'cursor-pointer transition-all hover:scale-105',
                  isSelected
                    ? 'bg-red-900/30 border-red-500'
                    : 'bg-neutral-900/50 border-neutral-700 hover:border-neutral-600'
                )}
                onClick={() => togglePastInjury(injury)}
              >
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm">{injury}</span>
                    {isSelected && (
                      <div className="h-2 w-2 bg-red-500 rounded-full" />
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Custom Injury Input */}
        <div className="flex space-x-2">
          <Input
            placeholder="Add other injury..."
            value={customInjury}
            onChange={(e) => setCustomInjury(e.target.value)}
            className="bg-neutral-800 border-neutral-700 text-white"
            onKeyPress={(e) => e.key === 'Enter' && addCustomInjury()}
          />
          <Button
            onClick={addCustomInjury}
            disabled={!customInjury.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Selected Past Injuries */}
        {data.pastInjuries.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-neutral-300">Selected Injuries:</h4>
            <div className="flex flex-wrap gap-2">
              {data.pastInjuries.map((injury) => (
                <Badge
                  key={injury}
                  variant="outline"
                  className="bg-red-900/30 border-red-500 text-red-200"
                >
                  {injury}
                  <button
                    onClick={() => removePastInjury(injury)}
                    className="ml-2 hover:text-red-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Basic Health Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          <User className="h-5 w-5 text-blue-500" />
          <span>Basic Health Information (Optional)</span>
        </h3>
        <Card className="bg-neutral-900/50 border-neutral-700 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className="text-neutral-300 flex items-center space-x-1">
                <Ruler className="h-4 w-4" />
                <span>Height (cm)</span>
              </Label>
              <Input
                type="number"
                placeholder="175"
                value={data.height || ''}
                onChange={(e) => updateData({ height: e.target.value ? Number(e.target.value) : undefined })}
                className="bg-neutral-800 border-neutral-700 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-neutral-300 flex items-center space-x-1">
                <Weight className="h-4 w-4" />
                <span>Weight (kg)</span>
              </Label>
              <Input
                type="number"
                placeholder="70"
                value={data.weight || ''}
                onChange={(e) => updateData({ weight: e.target.value ? Number(e.target.value) : undefined })}
                className="bg-neutral-800 border-neutral-700 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-neutral-300 flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Age</span>
              </Label>
              <Input
                type="number"
                placeholder="25"
                value={data.age || ''}
                onChange={(e) => updateData({ age: e.target.value ? Number(e.target.value) : undefined })}
                className="bg-neutral-800 border-neutral-700 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-neutral-300">Sex</Label>
              <select
                value={data.sex || ''}
                onChange={(e) => updateData({ sex: e.target.value as 'male' | 'female' | 'other' || undefined })}
                className="w-full p-2 bg-neutral-800 border border-neutral-700 rounded-md text-white"
              >
                <option value="">Prefer not to say</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </Card>
      </div>

      {/* Privacy Note */}
      <Card className="bg-blue-900/20 border-blue-500/30 p-4">
        <div className="flex items-start space-x-3">
          <Heart className="h-5 w-5 text-blue-400 mt-0.5" />
          <div>
            <h4 className="text-blue-200 font-medium">Your health data is private</h4>
            <p className="text-blue-300/80 text-sm mt-1">
              This information helps us create safer, more personalized training plans. 
              It's encrypted and never shared with third parties.
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
