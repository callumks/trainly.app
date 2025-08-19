'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Activity, ExternalLink } from 'lucide-react'
import { formatDate, formatTime } from '@/lib/utils'
import { useSupabase } from '@/components/providers/supabase-provider'
import toast from 'react-hot-toast'
import { StravaConnectButton } from '@/components/strava/connect-button'

interface RecentActivitiesProps {
  userId: string
}

interface StravaActivity {
  id: string
  strava_id: string
  name: string
  type: string
  distance: number | null
  moving_time: number | null
  start_date: string
  average_speed: number | null
  suffer_score: number | null
}

export function RecentActivities({ userId }: RecentActivitiesProps) {
  const { supabase } = useSupabase()
  const [activities, setActivities] = useState<StravaActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [hasStrava, setHasStrava] = useState(false)
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        // Check if user has Strava connected
        const { data: profile } = await supabase
          .from('profiles')
          .select('strava_id')
          .eq('id', userId)
          .single()

        if (!profile?.strava_id) {
          setHasStrava(false)
          setLoading(false)
          return
        }

        setHasStrava(true)

        // Fetch recent activities
        // Fetch from API so we don't depend on client mock
        const res = await fetch('/api/activities/recent')
        if (!res.ok) throw new Error('Failed to load activities')
        const j = await res.json()
        setActivities(j.activities || [])
      } catch (error) {
        console.error('Error fetching activities:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [userId, supabase])

  const formatDistance = (distance: number | null) => {
    if (!distance) return null
    return `${(distance / 1000).toFixed(1)}km`
  }

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return null
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const getActivityIcon = (type: string) => {
    // You could expand this with specific icons for different activity types
    return <Activity className="h-4 w-4" />
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>Your latest Strava activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3 p-3 bg-muted rounded-lg animate-pulse">
                <div className="w-4 h-4 bg-muted-foreground rounded" />
                <div className="flex-1">
                  <div className="h-4 bg-muted-foreground rounded w-2/3 mb-1" />
                  <div className="h-3 bg-muted-foreground rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!hasStrava) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>Connect Strava to see your activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Connect your Strava account to automatically track your activities and get AI-powered insights.
            </p>
            <div className="flex items-center justify-center">
              <StravaConnectButton />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
        <CardDescription>Your latest Strava activities</CardDescription>
        <div className="mt-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={async () => {
              try {
                setSyncing(true)
                const res = await fetch('/api/strava/sync')
                const j = await res.json()
                if (!res.ok) throw new Error(j.error || 'Sync failed')
                toast.success(`Synced: ${j.inserted || 0} new, ${j.updated || 0} updated`)
                window.location.reload()
              } catch (e: any) {
                console.error(e)
                toast.error(e?.message || 'Sync failed')
              } finally {
                setSyncing(false)
              }
            }}
            disabled={syncing}
          >
            {syncing ? 'Syncing…' : 'Sync now'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No recent activities found.
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex items-center space-x-3">
                  {getActivityIcon(activity.type)}
                  <div>
                    <p className="font-medium">{activity.name}</p>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        {activity.type}
                      </Badge>
                      {activity.distance && (
                        <>
                          <span>•</span>
                          <span>{formatDistance(activity.distance)}</span>
                        </>
                      )}
                      {activity.moving_time && (
                        <>
                          <span>•</span>
                          <span>{formatDuration(activity.moving_time)}</span>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(new Date(activity.start_date))} at{' '}
                      {formatTime(new Date(activity.start_date))}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" asChild>
                  <a
                    href={`https://www.strava.com/activities/${activity.strava_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 