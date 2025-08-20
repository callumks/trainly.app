import OpenAI from 'openai'
import { db } from './supabase'

let openai: OpenAI | null = null

function getOpenAIClient() {
  if (!openai) {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required')
    }
    openai = new OpenAI({ apiKey })
  }
  return openai
}

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
  private db = db

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
    const result = await this.db.query(
      'SELECT goals, sports, experience_level, weekly_volume FROM profiles WHERE id = $1',
      [userId]
    )

    if (result.rows.length === 0) {
      throw new Error('User profile not found')
    }

    return result.rows[0]
  }

  private async getRecentActivities(userId: string, days: number): Promise<StravaActivity[]> {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    const result = await this.db.query(
      'SELECT * FROM strava_activities WHERE user_id = $1 AND start_date >= $2 ORDER BY start_date DESC',
      [userId, cutoffDate.toISOString()]
    )

    return result.rows || []
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

    const completion = await getOpenAIClient().chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: "system",
          content: "You are an expert endurance coach and exercise physiologist. Create detailed, personalized training plans based on the athlete's data and goals. Return ONLY a valid JSON object, with no code fences, no markdown, and no commentary."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.5,
      max_tokens: 2500
    })

    const aiResponse = completion.choices[0]?.message?.content
    if (!aiResponse) throw new Error('No response from AI')

    // Try strict JSON parse, then sanitize and retry once before falling back
    const tryParse = (text: string) => JSON.parse(text)
    const sanitize = (text: string) => {
      let t = text.trim()
      // remove any markdown code fences anywhere
      t = t.replace(/```json\s*/gi, '').replace(/```/g, '').trim()
      // extract first {...} block if extra prose exists
      const first = t.indexOf('{')
      const last = t.lastIndexOf('}')
      if (first !== -1 && last !== -1 && last > first) {
        t = t.slice(first, last + 1)
      }
      return t
    }

    try {
      return tryParse(aiResponse)
    } catch (_) {
      try {
        return tryParse(sanitize(aiResponse))
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError)
        return this.createFallbackPlan(profile, fitnessAnalysis, planDuration)
      }
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
    // Save the main training plan
    const planResult = await this.db.query(
      `INSERT INTO training_plans (user_id, name, description, start_date, end_date, plan_type, metadata, ai_generated_insights) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        userId,
        aiPlan.name,
        aiPlan.description,
        new Date().toISOString().split('T')[0],
        new Date(Date.now() + aiPlan.duration_weeks * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        'ai_generated',
        JSON.stringify({
          weekly_structure: aiPlan.weekly_structure,
          phases: aiPlan.phases
        }),
        JSON.stringify(aiPlan.ai_insights)
      ]
    )

    const plan = planResult.rows[0]

    // Save individual training sessions
    if (aiPlan.sessions && aiPlan.sessions.length > 0) {
      for (const session of aiPlan.sessions) {
        await this.db.query(
          `INSERT INTO training_sessions (plan_id, user_id, date, name, description, session_type, duration_minutes, intensity, metadata, ai_recommendations) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [
            plan.id,
            userId,
            this.calculateSessionDate(session.week, session.day_of_week),
            session.name,
            session.description,
            session.session_type,
            session.duration_minutes,
            session.intensity,
            JSON.stringify({
              target_pace: session.target_pace,
              notes: session.notes,
              ai_generated: true
            }),
            JSON.stringify({
              target_pace: session.target_pace,
              notes: session.notes
            })
          ]
        )
      }
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