import React from 'react'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { AuthForm } from '@/components/auth/auth-form'

export default function RegisterPage() {
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
          <div className="eyebrow">Built for hybrid athletes</div>
          <h2>Train smarter.<br />Across every discipline.</h2>
          <p className="tag">One plan that understands a hard climb costs your legs something — and adapts the bike around it.</p>
        </div>
        <div className="feats">
          <div className="f"><span className="ar">→</span> Adaptive daily plan, not a fixed schedule</div>
          <div className="f"><span className="ar">→</span> Balances endurance, strength &amp; climbing</div>
          <div className="f"><span className="ar">→</span> A coach that reads your real data</div>
        </div>
      </div>

      <div className="formside">
        <div className="formwrap">
          <h1>Create your account</h1>
          <p className="hint">Start training smarter — takes under a minute.</p>
          <AuthForm isSignUp />
          <p className="switch">Already have an account? <Link href="/auth/login">Sign in</Link></p>
          <p className="legal">By continuing you agree to train hard and recover harder.</p>
        </div>
      </div>
    </div>
  )
}
