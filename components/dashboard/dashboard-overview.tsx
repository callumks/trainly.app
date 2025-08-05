'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, Target, Calendar, TrendingUp } from 'lucide-react'
import { useSupabase } from '@/components/providers/supabase-provider'
import { cn } from '@/lib/utils'

interface DashboardOverviewProps {
  userId: string
}

interface Stats {
  weeklyActivities: number
  completedSessions: number
  upcomingSessions: number
  weeklyProgress: number
}

export function DashboardOverview({ userId }: DashboardOverviewProps) {
  const { supabase } = useSupabase()
  const [stats, setStats] = useState<Stats>({
    weeklyActivities: 0,
    completedSessions: 0,
    upcomingSessions: 0,
    weeklyProgress: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get this week's date range
        const now = new Date()
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))
        const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6))

        // Fetch weekly activities
        const { count: activitiesCount } = await supabase
          .from('strava_activities')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .gte('start_date', startOfWeek.toISOString())
          .lte('start_date', endOfWeek.toISOString())

        // Fetch completed sessions
        const { count: completedCount } = await supabase
          .from('training_sessions')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('status', 'completed')
          .gte('date', startOfWeek.toISOString())
          .lte('date', endOfWeek.toISOString())

        // Fetch upcoming sessions (next 7 days)
        const nextWeek = new Date()
        nextWeek.setDate(nextWeek.getDate() + 7)
        
        const { count: upcomingCount } = await supabase
          .from('training_sessions')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('status', 'planned')
          .gte('date', new Date().toISOString())
          .lte('date', nextWeek.toISOString())

        // Calculate weekly progress (completed vs planned sessions)
        const { count: plannedCount } = await supabase
          .from('training_sessions')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .in('status', ['planned', 'completed'])
          .gte('date', startOfWeek.toISOString())
          .lte('date', endOfWeek.toISOString())

        const progress = plannedCount ? Math.round((completedCount! / plannedCount) * 100) : 0

        setStats({
          weeklyActivities: activitiesCount || 0,
          completedSessions: completedCount || 0,
          upcomingSessions: upcomingCount || 0,
          weeklyProgress: progress,
        })
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [userId, supabase])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const statCards = [
    {
      title: 'This Week',
      value: stats.weeklyActivities,
      description: 'Activities completed',
      icon: Activity,
      color: 'text-blue-600',
    },
    {
      title: 'Sessions',
      value: stats.completedSessions,
      description: 'Completed this week',
      icon: Target,
      color: 'text-green-600',
    },
    {
      title: 'Upcoming',
      value: stats.upcomingSessions,
      description: 'Sessions planned',
      icon: Calendar,
      color: 'text-purple-600',
    },
    {
      title: 'Progress',
      value: `${stats.weeklyProgress}%`,
      description: 'Weekly completion',
      icon: TrendingUp,
      color: 'text-orange-600',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className={cn('h-4 w-4', stat.color)} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
} 