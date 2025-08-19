import React from 'react'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { TrainingCalendar } from '@/components/training/training-calendar'

export default async function CalendarPage() {
  const token = cookies().get('auth-token')?.value
  if (!token) return null
  const secret = process.env.JWT_SECRET || 'your-secret-key-change-this'
  const { userId } = jwt.verify(token, secret) as { userId: string }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Calendar</h2>
      <TrainingCalendar userId={userId} />
    </div>
  )
}

