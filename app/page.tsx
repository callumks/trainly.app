import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

export default function HomePage() {
  const token = cookies().get('auth-token')?.value
  let valid = false
  if (token) {
    try { jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-this'); valid = true } catch {}
  }
  redirect(valid ? '/dashboard' : '/auth/login')
}
