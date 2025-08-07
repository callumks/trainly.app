import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await db.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    )

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const userResult = await db.query(
      'INSERT INTO users (email, password_hash, email_verified) VALUES ($1, $2, $3) RETURNING id, email',
      [email, hashedPassword, true] // For simplicity, we'll mark as verified
    )

    const user = userResult.rows[0]

    // Create profile
    await db.query(
      'INSERT INTO profiles (id, email) VALUES ($1, $2)',
      [user.id, user.email]
    )

    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email }
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}