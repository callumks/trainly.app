'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { useSupabase } from '@/components/providers/supabase-provider'
import { cn } from '@/lib/utils'

interface TrainingCalendarProps {
  userId: string
}

interface TrainingSession {
  id: string
  date: string
  name: string
  session_type: string
  intensity: number
  status: string
  duration_minutes: number | null
}

export function TrainingCalendar({ userId }: TrainingCalendarProps) {
  const { supabase } = useSupabase()
  const [sessions, setSessions] = useState<TrainingSession[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await fetch('/api/sessions/upcoming')
        if (!res.ok) throw new Error('Failed to load sessions')
        const j = await res.json()
        setSessions(j.sessions || [])
      } catch (error) {
        console.error('Error fetching training sessions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSessions()
  }, [userId, supabase])

  const getSessionTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'cardio':
        return 'bg-blue-500'
      case 'strength':
        return 'bg-red-500'
      case 'recovery':
        return 'bg-green-500'
      case 'mixed':
        return 'bg-purple-500'
      case 'skill':
        return 'bg-yellow-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-500">Completed</Badge>
      case 'planned':
        return <Badge variant="outline">Planned</Badge>
      case 'skipped':
        return <Badge variant="destructive">Skipped</Badge>
      case 'modified':
        return <Badge variant="secondary">Modified</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const moveSession = async (sessionId: string) => {
    const newDate = prompt('Move to date (YYYY-MM-DD):')
    if (!newDate) return
    try {
      const res = await fetch('/api/sessions/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, newDate })
      })
      if (!res.ok) throw new Error('Move failed')
      window.location.reload()
    } catch (e) {
      console.error(e)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Training Calendar</CardTitle>
          <CardDescription>Your upcoming sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3 p-3 bg-muted rounded-lg animate-pulse">
                <div className="w-3 h-3 bg-muted-foreground rounded-full" />
                <div className="flex-1">
                  <div className="h-4 bg-muted-foreground rounded w-1/2 mb-1" />
                  <div className="h-3 bg-muted-foreground rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Training Calendar</CardTitle>
        <CardDescription>Your upcoming sessions</CardDescription>
      </CardHeader>
      <CardContent>
        {sessions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No sessions planned for the next week.
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={cn(
                      'w-3 h-3 rounded-full',
                      getSessionTypeColor(session.session_type)
                    )}
                  />
                  <div>
                    <p className="font-medium">{session.name}</p>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>{formatDate(new Date(session.date))}</span>
                      {session.duration_minutes && (
                        <>
                          <span>•</span>
                          <span>{session.duration_minutes}min</span>
                        </>
                      )}
                      <span>•</span>
                      <span>Intensity {session.intensity}/5</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(session.status)}
                  <button className="text-xs underline" onClick={() => moveSession(session.id)}>Move</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 