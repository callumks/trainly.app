import React from 'react'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { redirect } from 'next/navigation'
import dynamic from 'next/dynamic'

const RedesignApp = dynamic(() => import('./redesign-fitness-dashboard/src/App').then(m => m.default), { ssr: false })

export default async function BrandNewUxHome() {
  const token = cookies().get('auth-token')?.value
  if (!token) redirect('/auth/login')
  try {
    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-this')
  } catch {
    redirect('/auth/login')
  }

  return <RedesignApp />
}


