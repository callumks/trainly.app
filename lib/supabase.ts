import { createClient } from '@supabase/supabase-js'
import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// For client-side usage
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// For client components
export const createClientSupabase = () => createClientComponentClient()

// For server components
export const createServerSupabase = () => createServerComponentClient({ cookies })

// Database types (will be generated from Supabase)
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          full_name: string | null
          avatar_url: string | null
          strava_id: string | null
          strava_access_token: string | null
          strava_refresh_token: string | null
          subscription_status: 'free' | 'active' | 'canceled' | 'past_due'
          subscription_id: string | null
          goals: string[] | null
          sports: string[] | null
          experience_level: 'beginner' | 'intermediate' | 'advanced' | null
          weekly_volume: number | null
          nutrition_enabled: boolean
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          strava_id?: string | null
          strava_access_token?: string | null
          strava_refresh_token?: string | null
          subscription_status?: 'free' | 'active' | 'canceled' | 'past_due'
          subscription_id?: string | null
          goals?: string[] | null
          sports?: string[] | null
          experience_level?: 'beginner' | 'intermediate' | 'advanced' | null
          weekly_volume?: number | null
          nutrition_enabled?: boolean
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          strava_id?: string | null
          strava_access_token?: string | null
          strava_refresh_token?: string | null
          subscription_status?: 'free' | 'active' | 'canceled' | 'past_due'
          subscription_id?: string | null
          goals?: string[] | null
          sports?: string[] | null
          experience_level?: 'beginner' | 'intermediate' | 'advanced' | null
          weekly_volume?: number | null
          nutrition_enabled?: boolean
        }
      }
      training_plans: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          name: string
          description: string | null
          start_date: string
          end_date: string | null
          is_active: boolean
          plan_type: 'ai_generated' | 'manual' | 'template'
          metadata: any | null
        }
        Insert: {
          user_id: string
          name: string
          description?: string | null
          start_date: string
          end_date?: string | null
          is_active?: boolean
          plan_type?: 'ai_generated' | 'manual' | 'template'
          metadata?: any | null
        }
        Update: {
          name?: string
          description?: string | null
          start_date?: string
          end_date?: string | null
          is_active?: boolean
          plan_type?: 'ai_generated' | 'manual' | 'template'
          metadata?: any | null
        }
      }
      training_sessions: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          plan_id: string
          user_id: string
          date: string
          name: string
          description: string | null
          session_type: 'cardio' | 'strength' | 'recovery' | 'mixed' | 'skill'
          duration_minutes: number | null
          intensity: 1 | 2 | 3 | 4 | 5
          status: 'planned' | 'completed' | 'skipped' | 'modified'
          strava_activity_id: string | null
          notes: string | null
          metadata: any | null
        }
        Insert: {
          plan_id: string
          user_id: string
          date: string
          name: string
          description?: string | null
          session_type: 'cardio' | 'strength' | 'recovery' | 'mixed' | 'skill'
          duration_minutes?: number | null
          intensity: 1 | 2 | 3 | 4 | 5
          status?: 'planned' | 'completed' | 'skipped' | 'modified'
          strava_activity_id?: string | null
          notes?: string | null
          metadata?: any | null
        }
        Update: {
          date?: string
          name?: string
          description?: string | null
          session_type?: 'cardio' | 'strength' | 'recovery' | 'mixed' | 'skill'
          duration_minutes?: number | null
          intensity?: 1 | 2 | 3 | 4 | 5
          status?: 'planned' | 'completed' | 'skipped' | 'modified'
          strava_activity_id?: string | null
          notes?: string | null
          metadata?: any | null
        }
      }
      strava_activities: {
        Row: {
          id: string
          created_at: string
          user_id: string
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
          metadata: any | null
        }
        Insert: {
          user_id: string
          strava_id: string
          name: string
          type: string
          distance?: number | null
          moving_time?: number | null
          elapsed_time?: number | null
          total_elevation_gain?: number | null
          start_date: string
          average_speed?: number | null
          max_speed?: number | null
          average_heartrate?: number | null
          max_heartrate?: number | null
          suffer_score?: number | null
          metadata?: any | null
        }
        Update: {
          name?: string
          type?: string
          distance?: number | null
          moving_time?: number | null
          elapsed_time?: number | null
          total_elevation_gain?: number | null
          start_date?: string
          average_speed?: number | null
          max_speed?: number | null
          average_heartrate?: number | null
          max_heartrate?: number | null
          suffer_score?: number | null
          metadata?: any | null
        }
      }
    }
  }
} 