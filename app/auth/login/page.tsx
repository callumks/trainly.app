import React from 'react'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { AuthForm } from '@/components/auth/auth-form'

export default function LoginPage() {
  const token = cookies().get('auth-token')?.value
  let valid = false
  if (token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-this')
      valid = true
    } catch {}
  }
  if (valid) redirect('/dashboard')

  return (
    <div className="tr-auth">
      <div className="panel">
        <Link href="/" className="brand"><span className="dot" />Trainly</Link>
        <div className="lead">
          <div className="eyebrow">Hybrid training, adapted daily</div>
          <h2>Your whole training.<br />One adaptive plan.</h2>
          <p className="tag">Cycling, climbing, and strength — balanced around how you&apos;re actually recovering, not a rigid schedule.</p>
        </div>
        <div className="feats">
          <div className="f"><span className="ar">→</span> Plans that adapt to today&apos;s load</div>
          <div className="f"><span className="ar">→</span> Cycling, climbing &amp; strength as one</div>
          <div className="f"><span className="ar">→</span> Your data, your coach</div>
        </div>
      </div>

      <div className="formside">
        <div className="formwrap">
          <h1>Welcome back</h1>
          <p className="hint">Sign in to pick up your training where you left off.</p>
          <AuthForm />
          <p className="switch">New here? <Link href="/auth/register">Create an account</Link></p>
        </div>
      </div>
    </div>
  )
}
