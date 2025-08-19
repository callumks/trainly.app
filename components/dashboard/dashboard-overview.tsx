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
        const res = await fetch('/api/dashboard/overview')
        if (!res.ok) throw new Error('Failed to load overview')
        const j = await res.json()
        setStats({
          weeklyActivities: j.weeklyActivities || 0,
          completedSessions: j.completedSessions || 0,
          upcomingSessions: j.upcomingSessions || 0,
          weeklyProgress: j.weeklyProgress || 0,
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