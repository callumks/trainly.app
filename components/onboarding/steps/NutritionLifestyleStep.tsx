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
  Apple, 
  AlertTriangle, 
  Clock, 
  Moon,
  Plus,
  X
} from 'lucide-react'

interface NutritionLifestyleStepProps {
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
  loading: boolean
  canProceed: boolean
}

const DIETARY_PREFERENCES = [
  'Vegetarian',
  'Vegan',
  'Keto',
  'Paleo',
  'Mediterranean',
  'Low-carb',
  'High-protein',
  'Intermittent Fasting',
  'Gluten-free',
  'Dairy-free',
  'No restrictions'
]

const COMMON_ALLERGIES = [
  'Nuts',
  'Shellfish',
  'Dairy',
  'Eggs',
  'Soy',
  'Wheat/Gluten',
  'Fish',
  'Sesame',
  'Other'
]

export function NutritionLifestyleStep({ data, updateData, onNext, onBack, loading, canProceed }: NutritionLifestyleStepProps) {
  const [customAllergy, setCustomAllergy] = useState('')

  const toggleDietaryPreference = (preference: string) => {
    const isSelected = data.dietaryPreferences.includes(preference)
    if (isSelected) {
      updateData({ dietaryPreferences: data.dietaryPreferences.filter(p => p !== preference) })
    } else {
      updateData({ dietaryPreferences: [...data.dietaryPreferences, preference] })
    }
  }

  const toggleAllergy = (allergy: string) => {
    const isSelected = data.allergies.includes(allergy)
    if (isSelected) {
      updateData({ allergies: data.allergies.filter(a => a !== allergy) })
    } else {
      updateData({ allergies: [...data.allergies, allergy] })
    }
  }

  const addCustomAllergy = () => {
    if (customAllergy.trim() && !data.allergies.includes(customAllergy.trim())) {
      updateData({ allergies: [...data.allergies, customAllergy.trim()] })
      setCustomAllergy('')
    }
  }

  const removeAllergy = (allergy: string) => {
    updateData({ allergies: data.allergies.filter(a => a !== allergy) })
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">
          Nutrition & Lifestyle
        </h2>
        <p className="text-neutral-400">
          Help us personalize your nutrition and recovery recommendations
        </p>
      </div>

      {/* Dietary Preferences */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          <Apple className="h-5 w-5 text-green-500" />
          <span>Dietary Preferences</span>
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {DIETARY_PREFERENCES.map((preference) => {
            const isSelected = data.dietaryPreferences.includes(preference)
            return (
              <Card
                key={preference}
                className={cn(
                  'cursor-pointer transition-all hover:scale-105',
                  isSelected
                    ? 'bg-green-900/30 border-green-500'
                    : 'bg-neutral-900/50 border-neutral-700 hover:border-neutral-600'
                )}
                onClick={() => toggleDietaryPreference(preference)}
              >
                <div className="p-3 text-center">
                  <span className="text-white text-sm">{preference}</span>
                  {isSelected && (
                    <div className="mt-2 h-1 w-full bg-green-500 rounded-full" />
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Allergies & Restrictions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <span>Allergies & Food Restrictions</span>
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {COMMON_ALLERGIES.map((allergy) => {
            const isSelected = data.allergies.includes(allergy)
            return (
              <Card
                key={allergy}
                className={cn(
                  'cursor-pointer transition-all hover:scale-105',
                  isSelected
                    ? 'bg-red-900/30 border-red-500'
                    : 'bg-neutral-900/50 border-neutral-700 hover:border-neutral-600'
                )}
                onClick={() => toggleAllergy(allergy)}
              >
                <div className="p-3 text-center">
                  <span className="text-white text-sm">{allergy}</span>
                  {isSelected && (
                    <div className="mt-2 h-1 w-full bg-red-500 rounded-full" />
                  )}
                </div>
              </Card>
            )
          })}
        </div>

        {/* Custom Allergy Input */}
        <div className="flex space-x-2">
          <Input
            placeholder="Add other allergy..."
            value={customAllergy}
            onChange={(e) => setCustomAllergy(e.target.value)}
            className="bg-neutral-800 border-neutral-700 text-white"
            onKeyPress={(e) => e.key === 'Enter' && addCustomAllergy()}
          />
          <Button
            onClick={addCustomAllergy}
            disabled={!customAllergy.trim()}
            className="bg-red-600 hover:bg-red-700"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Selected Allergies */}
        {data.allergies.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-neutral-300">Selected Allergies:</h4>
            <div className="flex flex-wrap gap-2">
              {data.allergies.map((allergy) => (
                <Badge
                  key={allergy}
                  variant="outline"
                  className="bg-red-900/30 border-red-500 text-red-200"
                >
                  {allergy}
                  <button
                    onClick={() => removeAllergy(allergy)}
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

      {/* Schedule Constraints */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          <Clock className="h-5 w-5 text-blue-500" />
          <span>Daily Schedule Constraints</span>
        </h3>
        
        <Card className="bg-neutral-900/50 border-neutral-700 p-4">
          <Textarea
            placeholder="Describe your typical daily schedule, work hours, family commitments, or other time constraints that might affect your training..."
            value={data.scheduleConstraints}
            onChange={(e) => updateData({ scheduleConstraints: e.target.value })}
            rows={4}
            className="bg-neutral-800 border-neutral-700 text-white placeholder-neutral-400"
          />
        </Card>
      </div>

      {/* Sleep Habits */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          <Moon className="h-5 w-5 text-purple-500" />
          <span>Sleep Habits</span>
        </h3>
        
        <Card className="bg-neutral-900/50 border-neutral-700 p-4">
          <Textarea
            placeholder="Tell us about your sleep patterns, bedtime routine, sleep quality, or any sleep-related challenges..."
            value={data.sleepHabits}
            onChange={(e) => updateData({ sleepHabits: e.target.value })}
            rows={3}
            className="bg-neutral-800 border-neutral-700 text-white placeholder-neutral-400"
          />
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
