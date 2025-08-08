import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { aiTrainingGenerator } from '@/lib/ai-training-generator'

export async function POST(request: NextRequest) {
  try {
    // Check authentication via JWT cookie
    const token = cookies().get('auth-token')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const secret = process.env.JWT_SECRET || 'your-secret-key-change-this'
    const decoded = jwt.verify(token, secret) as { userId: string }

    // Parse request body
    const body = await request.json()
    const { 
      planDuration = 8, 
      focusArea, 
      specificGoal 
    } = body

    // Generate the training plan
    const trainingPlan = await aiTrainingGenerator.generateTrainingPlan({
      userId: decoded.userId,
      planDuration,
      focusArea,
      specificGoal
    })

    return NextResponse.json({ 
      success: true, 
      plan: trainingPlan 
    })

  } catch (error: any) {
    console.error('Error generating training plan:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate training plan' },
      { status: 500 }
    )
  }
}