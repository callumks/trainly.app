import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { aiTrainingGenerator } from '@/lib/ai-training-generator'

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()
    const { 
      planDuration = 8, 
      focusArea, 
      specificGoal 
    } = body

    // Generate the training plan
    const trainingPlan = await aiTrainingGenerator.generateTrainingPlan({
      userId: session.user.id,
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