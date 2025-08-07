import { Pool } from 'pg'

// Database connection for Railway PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:tNcTUlhymzpXJBlwOOWtXNFctKXJtloG@interchange.proxy.rlwy.net:24312/railway',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

// Export the database pool for use in API routes
export const db = pool

// Simple database client for consistency with existing code
export const supabase = {
  from: (table: string) => ({
    select: (columns: string = '*') => ({
      eq: (column: string, value: any) => ({
        single: async () => {
          const query = `SELECT ${columns} FROM ${table} WHERE ${column} = $1 LIMIT 1`
          const result = await pool.query(query, [value])
          return { data: result.rows[0] || null, error: null }
        },
        async then(resolve: any) {
          const query = `SELECT ${columns} FROM ${table} WHERE ${column} = $1`
          const result = await pool.query(query, [value])
          resolve({ data: result.rows, error: null })
        }
      }),
      gte: (column: string, value: any) => ({
        lte: (column2: string, value2: any) => ({
          order: (orderColumn: string, options?: { ascending?: boolean }) => ({
            limit: (limitValue: number) => ({
              async then(resolve: any) {
                const orderDir = options?.ascending === false ? 'DESC' : 'ASC'
                const query = `SELECT ${columns} FROM ${table} WHERE ${column} >= $1 AND ${column2} <= $2 ORDER BY ${orderColumn} ${orderDir} LIMIT $3`
                const result = await pool.query(query, [value, value2, limitValue])
                resolve({ data: result.rows, error: null })
              }
            })
          })
        })
      }),
      order: (orderColumn: string, options?: { ascending?: boolean }) => ({
        limit: (limitValue: number) => ({
          async then(resolve: any) {
            const orderDir = options?.ascending === false ? 'DESC' : 'ASC'
            const query = `SELECT ${columns} FROM ${table} ORDER BY ${orderColumn} ${orderDir} LIMIT $1`
            const result = await pool.query(query, [limitValue])
            resolve({ data: result.rows, error: null })
          }
        })
      })
    }),
    insert: (data: any) => ({
      select: () => ({
        single: async () => {
          const keys = Object.keys(data)
          const values = Object.values(data)
          const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ')
          const query = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`
          const result = await pool.query(query, values)
          return { data: result.rows[0], error: null }
        }
      })
    }),
    update: (data: any) => ({
      eq: (column: string, value: any) => ({
        async then(resolve: any) {
          const keys = Object.keys(data)
          const values = Object.values(data)
          const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ')
          const query = `UPDATE ${table} SET ${setClause} WHERE ${column} = $${keys.length + 1} RETURNING *`
          const result = await pool.query(query, [...values, value])
          resolve({ data: result.rows[0], error: null })
        }
      })
    })
  })
}

// For compatibility with existing code
export const createClientSupabase = () => supabase
export const createServerSupabase = () => supabase

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