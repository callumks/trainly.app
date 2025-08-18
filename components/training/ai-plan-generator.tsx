'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Brain, Loader2, Sparkles, Target, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export function AIPlanGenerator() {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [planDuration, setPlanDuration] = useState('8')
  const [focusArea, setFocusArea] = useState('none')
  const [specificGoal, setSpecificGoal] = useState('')

  const focusAreas = [
    { value: 'endurance', label: 'Endurance Building' },
    { value: 'speed', label: 'Speed Development' },
    { value: 'strength', label: 'Strength Training' },
    { value: 'recovery', label: 'Active Recovery' },
    { value: 'race_prep', label: 'Race Preparation' },
    { value: 'base_building', label: 'Base Building' },
    { value: 'maintenance', label: 'Fitness Maintenance' }
  ]

  const handleGeneratePlan = async () => {
    if (!planDuration) {
      toast.error('Please select a plan duration')
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch('/api/training-plans/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planDuration: parseInt(planDuration),
          focusArea: focusArea === 'none' ? undefined : focusArea,
          specificGoal: specificGoal || undefined,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to generate plan')
      }

      const { plan } = await response.json()
      
      toast.success(`AI Training Plan "${plan.name}" created successfully!`)
      
      // Refresh the page to show the new plan
      router.refresh()
      
      // Reset form
      setPlanDuration('8')
      setFocusArea('none')
      setSpecificGoal('')
      
    } catch (error: any) {
      console.error('Error generating plan:', error)
      toast.error(error.message || 'Failed to generate training plan')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card className="border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="flex items-center space-x-2">
                <span>AI Training Plan Generator</span>
                <Sparkles className="h-4 w-4 text-yellow-500" />
              </CardTitle>
              <CardDescription>
                Create a personalized training plan based on your Strava data
              </CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            Beta
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Plan Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Plan Duration</span>
            </Label>
            <Select value={planDuration} onValueChange={setPlanDuration}>
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4">4 weeks</SelectItem>
                <SelectItem value="6">6 weeks</SelectItem>
                <SelectItem value="8">8 weeks</SelectItem>
                <SelectItem value="12">12 weeks</SelectItem>
                <SelectItem value="16">16 weeks</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Focus Area */}
          <div className="space-y-2">
            <Label htmlFor="focus" className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>Focus Area (Optional)</span>
            </Label>
            <Select value={focusArea} onValueChange={setFocusArea}>
              <SelectTrigger>
                <SelectValue placeholder="Choose focus area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No specific focus</SelectItem>
                {focusAreas.map((area) => (
                  <SelectItem key={area.value} value={area.value}>
                    {area.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Specific Goal */}
        <div className="space-y-2">
          <Label htmlFor="goal">Specific Goal (Optional)</Label>
          <Input
            id="goal"
            placeholder="e.g., 'Prepare for a 10K race in March' or 'Increase weekly mileage safely'"
            value={specificGoal}
            onChange={(e) => setSpecificGoal(e.target.value)}
            disabled={isGenerating}
          />
          <p className="text-xs text-muted-foreground">
            Be specific about your goal - the AI will tailor the plan accordingly
          </p>
        </div>

        {/* AI Analysis Info */}
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-medium mb-2 flex items-center space-x-2">
            <Brain className="h-4 w-4 text-primary" />
            <span>What the AI analyzes:</span>
          </h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Your recent Strava activity patterns and performance</li>
            <li>• Training consistency and current fitness level</li>
            <li>• Heart rate zones and pace progressions</li>
            <li>• Recovery patterns and training load</li>
            <li>• Your goals and experience level from onboarding</li>
          </ul>
        </div>

        {/* Generate Button */}
        <Button 
          onClick={handleGeneratePlan}
          disabled={isGenerating || !planDuration}
          className="w-full"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing your data & generating plan...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate AI Training Plan
            </>
          )}
        </Button>

        {/* Pro tip */}
        <div className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
          <strong>💡 Pro tip:</strong> The AI works best with at least 2-3 weeks of recent Strava data. 
          Make sure your Strava account is connected and syncing activities.
        </div>
      </CardContent>
    </Card>
  )
}