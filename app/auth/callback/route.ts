import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Check if user needs onboarding
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  
  if (session?.user) {
    // Check if user profile exists
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()

    // If no profile exists or it's incomplete, redirect to onboarding
    if (!profile || !profile.goals || !profile.sports) {
      return NextResponse.redirect(new URL('/onboarding', requestUrl.origin))
    }
  }

  // Otherwise redirect to dashboard
  return NextResponse.redirect(new URL('/dashboard', requestUrl.origin))
} 