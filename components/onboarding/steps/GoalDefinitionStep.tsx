'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { OnboardingData } from '../new-onboarding-flow'
import { cn } from '@/lib/utils'
import { Plus, X, Target, Calendar, Trophy } from 'lucide-react'

interface GoalDefinitionStepProps {
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
  loading: boolean
  canProceed: boolean
}

const GOAL_TEMPLATES = {
  running: [
    { goal: 'Run a sub-20 minute 5K', deadline: '3 months' },
    { goal: 'Complete a half marathon under 1:45', deadline: '6 months' },
    { goal: 'Run a marathon under 4 hours', deadline: '8 months' },
    { goal: 'Run 1000 miles this year', deadline: '12 months' },
  ],
  cycling: [
    { goal: 'Complete a century ride in under 5 hours', deadline: '4 months' },
    { goal: 'Increase FTP by 50 watts', deadline: '6 months' },
    { goal: 'Complete a multi-day bike tour', deadline: '8 months' },
    { goal: 'Upgrade to Cat 3 racer', deadline: '12 months' },
  ],
  climbing: [
    { goal: 'Climb V8 boulder problem', deadline: '6 months' },
    { goal: 'Lead climb 5.12a', deadline: '8 months' },
    { goal: 'Complete a multi-pitch climb', deadline: '4 months' },
    { goal: 'Climb 100 routes this year', deadline: '12 months' },
  ],
  swimming: [
    { goal: 'Swim 1 mile without stopping', deadline: '3 months' },
    { goal: 'Complete a 2.4 mile open water swim', deadline: '6 months' },
    { goal: 'Swim 100 laps in under 45 minutes', deadline: '4 months' },
    { goal: 'Complete a triathlon swim leg', deadline: '5 months' },
  ],
  strength: [
    { goal: 'Deadlift 2x bodyweight', deadline: '8 months' },
    { goal: 'Bench press 1.5x bodyweight', deadline: '6 months' },
    { goal: 'Squat 1.75x bodyweight', deadline: '6 months' },
    { goal: 'Complete 20 pull-ups', deadline: '4 months' },
  ],
  triathlon: [
    { goal: 'Complete Olympic distance triathlon', deadline: '6 months' },
    { goal: 'Complete Ironman 70.3', deadline: '8 months' },
    { goal: 'Complete full Ironman', deadline: '12 months' },
    { goal: 'Qualify for age group nationals', deadline: '10 months' },
  ],
}

export function GoalDefinitionStep({ data, updateData, onNext, onBack, loading, canProceed }: GoalDefinitionStepProps) {
  const [newGoal, setNewGoal] = useState({ sport: '', goal: '', deadline: '' })

  const addGoal = () => {
    if (newGoal.sport && newGoal.goal && newGoal.deadline) {
      const goal = {
        sport: newGoal.sport,
        goal: newGoal.goal,
        deadline: newGoal.deadline,
        isTemplate: false,
      }
      updateData({ goals: [...data.goals, goal] })
      setNewGoal({ sport: '', goal: '', deadline: '' })
    }
  }

  const addTemplateGoal = (sport: string, template: { goal: string; deadline: string }) => {
    const goal = {
      sport,
      goal: template.goal,
      deadline: template.deadline,
      isTemplate: true,
    }
    updateData({ goals: [...data.goals, goal] })
  }

  const removeGoal = (index: number) => {
    updateData({ goals: data.goals.filter((_, i) => i !== index) })
  }

  const getSportGoals = (sport: string) => {
    return data.goals.filter(g => g.sport === sport)
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">
          What are your performance goals?
        </h2>
        <p className="text-neutral-400">
          Set specific, time-bound goals for each sport you train
        </p>
      </div>

      {/* Goal Templates */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Goal Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.selectedSports.map(sportId => {
            const templates = GOAL_TEMPLATES[sportId as keyof typeof GOAL_TEMPLATES] || []
            if (templates.length === 0) return null

            return (
              <Card key={sportId} className="bg-neutral-900/50 border-neutral-700">
                <div className="p-4 space-y-3">
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-blue-500" />
                    <h4 className="font-semibold text-white capitalize">{sportId}</h4>
                  </div>
                  
                  <div className="space-y-2">
                    {templates.map((template, index) => (
                      <div
                        key={index}
                        className="p-3 bg-neutral-800/50 rounded-lg border border-neutral-700 hover:border-blue-500 cursor-pointer transition-colors"
                        onClick={() => addTemplateGoal(sportId, template)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-white font-medium">{template.goal}</p>
                            <div className="flex items-center space-x-1 mt-1">
                              <Calendar className="h-3 w-3 text-neutral-400" />
                              <span className="text-xs text-neutral-400">{template.deadline}</span>
                            </div>
                          </div>
                          <Plus className="h-4 w-4 text-blue-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Custom Goal Input */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Add Custom Goals</h3>
        <Card className="bg-neutral-900/50 border-neutral-700 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-neutral-300">Sport</Label>
              <select
                value={newGoal.sport}
                onChange={(e) => setNewGoal(prev => ({ ...prev, sport: e.target.value }))}
                className="w-full p-2 bg-neutral-800 border border-neutral-700 rounded-md text-white"
              >
                <option value="">Select sport</option>
                {data.selectedSports.map(sport => (
                  <option key={sport} value={sport} className="capitalize">{sport}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-neutral-300">Goal</Label>
              <Input
                placeholder="e.g., Run sub-20 minute 5K"
                value={newGoal.goal}
                onChange={(e) => setNewGoal(prev => ({ ...prev, goal: e.target.value }))}
                className="bg-neutral-800 border-neutral-700 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-neutral-300">Deadline</Label>
              <Input
                placeholder="e.g., 6 months"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
                className="bg-neutral-800 border-neutral-700 text-white"
              />
            </div>
          </div>
          
          <Button
            onClick={addGoal}
            disabled={!newGoal.sport || !newGoal.goal || !newGoal.deadline}
            className="mt-4 bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Goal
          </Button>
        </Card>
      </div>

      {/* Current Goals */}
      {data.goals.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Your Goals</h3>
          <div className="space-y-3">
            {data.goals.map((goal, index) => (
              <Card key={index} className="bg-neutral-900/50 border-neutral-700">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Trophy className="h-4 w-4 text-yellow-500" />
                      <div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {goal.sport}
                          </Badge>
                          {goal.isTemplate && (
                            <Badge variant="secondary" className="text-xs bg-blue-600">
                              Template
                            </Badge>
                          )}
                        </div>
                        <p className="text-white font-medium mt-1">{goal.goal}</p>
                        <div className="flex items-center space-x-1 mt-1">
                          <Calendar className="h-3 w-3 text-neutral-400" />
                          <span className="text-sm text-neutral-400">{goal.deadline}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeGoal(index)}
                      className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
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
