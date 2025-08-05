import OpenAI from 'openai'
import { createServerSupabase } from './supabase'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

interface StravaActivity {
  id: string
  strava_id: string
  name: string
  type: string
  distance: number | null
  moving_time: number | null
  elapsed_time: number | null
  total_elevation_gain: number | null
  start_date: string
  average_speed: number | null
  max_speed: number | null
  average_heartrate: number | null
  max_heartrate: number | null
  suffer_score: number | null
}

interface UserProfile {
  goals: string[]
  sports: string[]
  experience_level: 'beginner' | 'intermediate' | 'advanced'
  weekly_volume: number | null
}

interface TrainingPlanRequest {
  userId: string
  planDuration: number // weeks
  focusArea?: string
  specificGoal?: string
}

export class AITrainingGenerator {
  private supabase = createServerSupabase()

  async generateTrainingPlan({
    userId,
    planDuration = 8,
    focusArea,
    specificGoal
  }: TrainingPlanRequest) {
    try {
      // 1. Get user profile and preferences
      const profile = await this.getUserProfile(userId)
      
      // 2. Get recent Strava activities (last 8 weeks for analysis)
      const activities = await this.getRecentActivities(userId, 56) // 8 weeks
      
      // 3. Analyze current fitness and patterns
      const fitnessAnalysis = this.analyzeFitnessData(activities, profile)
      
      // 4. Generate AI training plan
      const trainingPlan = await this.createAITrainingPlan({
        profile,
        activities,
        fitnessAnalysis,
        planDuration,
        focusArea,
        specificGoal
      })
      
      // 5. Save to database
      const savedPlan = await this.saveTrainingPlan(userId, trainingPlan)
      
      return savedPlan
    } catch (error) {
      console.error('Error generating training plan:', error)
      throw error
    }
  }

  private async getUserProfile(userId: string): Promise<UserProfile> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('goals, sports, experience_level, weekly_volume')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data
  }

  private async getRecentActivities(userId: string, days: number): Promise<StravaActivity[]> {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    const { data, error } = await this.supabase
      .from('strava_activities')
      .select('*')
      .eq('user_id', userId)
      .gte('start_date', cutoffDate.toISOString())
      .order('start_date', { ascending: false })

    if (error) throw error
    return data || []
  }

  private analyzeFitnessData(activities: StravaActivity[], profile: UserProfile) {
    const totalActivities = activities.length
    const totalDistance = activities.reduce((sum, a) => sum + (a.distance || 0), 0) / 1000 // km
    const totalTime = activities.reduce((sum, a) => sum + (a.moving_time || 0), 0) / 3600 // hours
    const avgPace = totalDistance > 0 ? (totalTime * 60) / totalDistance : 0 // min/km
    
    // Calculate weekly averages
    const weeklyDistance = totalDistance / 8
    const weeklyTime = totalTime / 8
    const weeklyActivities = totalActivities / 8

    // Activity type distribution
    const activityTypes = activities.reduce((acc, activity) => {
      acc[activity.type] = (acc[activity.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Heart rate analysis (if available)
    const hrActivities = activities.filter(a => a.average_heartrate)
    const avgHeartRate = hrActivities.length > 0 
      ? hrActivities.reduce((sum, a) => sum + (a.average_heartrate || 0), 0) / hrActivities.length
      : null

    // Training load analysis (using suffer score if available)
    const sufferScores = activities.filter(a => a.suffer_score).map(a => a.suffer_score!)
    const avgSufferScore = sufferScores.length > 0
      ? sufferScores.reduce((sum, score) => sum + score, 0) / sufferScores.length
      : null

    return {
      totalActivities,
      totalDistance,
      totalTime,
      avgPace,
      weeklyDistance,
      weeklyTime,
      weeklyActivities,
      activityTypes,
      avgHeartRate,
      avgSufferScore,
      recentForm: this.calculateRecentForm(activities),
      trainingConsistency: this.calculateConsistency(activities)
    }
  }

  private calculateRecentForm(activities: StravaActivity[]): 'improving' | 'stable' | 'declining' {
    if (activities.length < 4) return 'stable'
    
    const recent = activities.slice(0, 4) // last 4 activities
    const older = activities.slice(4, 8) // previous 4 activities
    
    const recentAvgDistance = recent.reduce((sum, a) => sum + (a.distance || 0), 0) / recent.length
    const olderAvgDistance = older.reduce((sum, a) => sum + (a.distance || 0), 0) / older.length
    
    const changePercent = ((recentAvgDistance - olderAvgDistance) / olderAvgDistance) * 100
    
    if (changePercent > 10) return 'improving'
    if (changePercent < -10) return 'declining'
    return 'stable'
  }

  private calculateConsistency(activities: StravaActivity[]): number {
    if (activities.length === 0) return 0
    
    // Calculate weekly activity counts for last 8 weeks
    const weeks = Array(8).fill(0)
    const now = new Date()
    
    activities.forEach(activity => {
      const activityDate = new Date(activity.start_date)
      const daysDiff = Math.floor((now.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24))
      const weekIndex = Math.floor(daysDiff / 7)
      
      if (weekIndex < 8) {
        weeks[weekIndex]++
      }
    })
    
    // Calculate consistency as percentage of weeks with activities
    const activeWeeks = weeks.filter(count => count > 0).length
    return (activeWeeks / 8) * 100
  }

  private async createAITrainingPlan({
    profile,
    activities,
    fitnessAnalysis,
    planDuration,
    focusArea,
    specificGoal
  }: {
    profile: UserProfile
    activities: StravaActivity[]
    fitnessAnalysis: any
    planDuration: number
    focusArea?: string
    specificGoal?: string
  }) {
    const prompt = this.buildTrainingPrompt({
      profile,
      fitnessAnalysis,
      planDuration,
      focusArea,
      specificGoal
    })

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert endurance coach and exercise physiologist. Create detailed, personalized training plans based on the athlete's data and goals. Respond with a JSON object containing the training plan structure."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2500
    })

    const aiResponse = completion.choices[0]?.message?.content
    if (!aiResponse) throw new Error('No response from AI')

    try {
      return JSON.parse(aiResponse)
    } catch (parseError) {
      // If JSON parsing fails, create a fallback plan
      console.error('Failed to parse AI response:', parseError)
      return this.createFallbackPlan(profile, fitnessAnalysis, planDuration)
    }
  }

  private buildTrainingPrompt({
    profile,
    fitnessAnalysis,
    planDuration,
    focusArea,
    specificGoal
  }: {
    profile: UserProfile
    fitnessAnalysis: any
    planDuration: number
    focusArea?: string
    specificGoal?: string
  }): string {
    return `
Create a ${planDuration}-week personalized training plan for this athlete:

ATHLETE PROFILE:
- Goals: ${profile.goals?.join(', ') || 'General fitness'}
- Sports: ${profile.sports?.join(', ') || 'Running'}
- Experience: ${profile.experience_level || 'intermediate'}
- Target weekly volume: ${profile.weekly_volume || 'Not specified'}

CURRENT FITNESS ANALYSIS:
- Weekly average distance: ${fitnessAnalysis.weeklyDistance.toFixed(1)}km
- Weekly average time: ${fitnessAnalysis.weeklyTime.toFixed(1)} hours
- Activities per week: ${fitnessAnalysis.weeklyActivities.toFixed(1)}
- Main activity types: ${Object.entries(fitnessAnalysis.activityTypes).map(([type, count]) => `${type}: ${count}`).join(', ')}
- Recent form: ${fitnessAnalysis.recentForm}
- Training consistency: ${fitnessAnalysis.trainingConsistency.toFixed(0)}%
${fitnessAnalysis.avgHeartRate ? `- Average heart rate: ${fitnessAnalysis.avgHeartRate.toFixed(0)} bpm` : ''}
${fitnessAnalysis.avgPace > 0 ? `- Average pace: ${fitnessAnalysis.avgPace.toFixed(2)} min/km` : ''}

${focusArea ? `FOCUS AREA: ${focusArea}` : ''}
${specificGoal ? `SPECIFIC GOAL: ${specificGoal}` : ''}

Create a detailed training plan with this JSON structure:
{
  "name": "Training Plan Name",
  "description": "Brief description of the plan focus and approach",
  "duration_weeks": ${planDuration},
  "weekly_structure": {
    "target_sessions_per_week": 4,
    "target_weekly_distance": 25,
    "target_weekly_time_hours": 5
  },
  "phases": [
    {
      "name": "Base Building",
      "weeks": [1, 2, 3],
      "focus": "Aerobic development",
      "description": "Build aerobic capacity and consistency"
    }
  ],
  "sessions": [
    {
      "week": 1,
      "day_of_week": 1,
      "name": "Easy Run",
      "session_type": "cardio",
      "duration_minutes": 45,
      "intensity": 2,
      "description": "Comfortable aerobic pace, focus on form",
      "target_pace": "5:30-6:00 min/km",
      "notes": "Should feel conversational throughout"
    }
  ],
  "ai_insights": {
    "plan_rationale": "Why this plan structure was chosen",
    "progression_strategy": "How the plan builds over time",
    "key_adaptations": "What adaptations this plan targets",
    "recovery_emphasis": "Recovery and load management approach"
  }
}

Make the plan progressive, specific to their current fitness level, and aligned with their goals. Include variety in session types and intensities. Consider their recent form and consistency when planning progression.
`
  }

  private createFallbackPlan(profile: UserProfile, fitnessAnalysis: any, planDuration: number) {
    // Create a basic fallback plan if AI parsing fails
    return {
      name: `${planDuration}-Week Personal Training Plan`,
      description: "AI-generated training plan based on your recent activity data",
      duration_weeks: planDuration,
      weekly_structure: {
        target_sessions_per_week: Math.max(3, Math.round(fitnessAnalysis.weeklyActivities)),
        target_weekly_distance: Math.round(fitnessAnalysis.weeklyDistance * 1.1),
        target_weekly_time_hours: Math.round(fitnessAnalysis.weeklyTime * 1.1)
      },
      phases: [
        {
          name: "Progressive Build",
          weeks: Array.from({length: planDuration}, (_, i) => i + 1),
          focus: "Gradual fitness improvement",
          description: "Systematic progression based on current fitness"
        }
      ],
      sessions: [], // Would be populated with basic session templates
      ai_insights: {
        plan_rationale: "Plan created based on recent training patterns",
        progression_strategy: "Gradual weekly progression",
        key_adaptations: "Aerobic fitness and consistency",
        recovery_emphasis: "Balanced training load"
      }
    }
  }

  private async saveTrainingPlan(userId: string, aiPlan: any) {
    const supabase = createServerSupabase()
    
    // Save the main training plan
    const { data: plan, error: planError } = await supabase
      .from('training_plans')
      .insert({
        user_id: userId,
        name: aiPlan.name,
        description: aiPlan.description,
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + aiPlan.duration_weeks * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        plan_type: 'ai_generated',
        metadata: {
          weekly_structure: aiPlan.weekly_structure,
          phases: aiPlan.phases,
          ai_insights: aiPlan.ai_insights
        }
      })
      .select()
      .single()

    if (planError) throw planError

    // Save individual training sessions
    if (aiPlan.sessions && aiPlan.sessions.length > 0) {
      const sessions = aiPlan.sessions.map((session: any) => ({
        plan_id: plan.id,
        user_id: userId,
        date: this.calculateSessionDate(session.week, session.day_of_week),
        name: session.name,
        description: session.description,
        session_type: session.session_type,
        duration_minutes: session.duration_minutes,
        intensity: session.intensity,
        metadata: {
          target_pace: session.target_pace,
          notes: session.notes,
          ai_generated: true
        }
      }))

      const { error: sessionsError } = await supabase
        .from('training_sessions')
        .insert(sessions)

      if (sessionsError) throw sessionsError
    }

    return plan
  }

  private calculateSessionDate(week: number, dayOfWeek: number): string {
    const startDate = new Date()
    const daysToAdd = (week - 1) * 7 + (dayOfWeek - 1)
    const sessionDate = new Date(startDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000)
    return sessionDate.toISOString().split('T')[0]
  }
}

// Export a singleton instance
export const aiTrainingGenerator = new AITrainingGenerator()