import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import jwt from 'jsonwebtoken'
import { db } from '@/lib/supabase'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'No authentication token' },
        { status: 401 }
      )
    }

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string }

    // Get user from database
    const userResult = await db.query(
      'SELECT id, email FROM users WHERE id = $1',
      [decoded.userId]
    )

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      )
    }

    const user = userResult.rows[0]

    return NextResponse.json({
      user: { id: user.id, email: user.email }
    })

  } catch (error) {
    console.error('Auth verification error:', error)
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    )
  }
}