import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'trainly - AI-Powered Training for Hybrid Athletes',
  description: 'Personalized training plans powered by Strava and AI. Built for hybrid athletes who demand more from their training.',
  keywords: ['training', 'fitness', 'strava', 'hybrid athlete', 'AI coaching'],
  authors: [{ name: 'trainly' }],
  creator: 'trainly',
  publisher: 'trainly',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0a0a0a' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} bg-neutral-950 text-zinc-200 antialiased`}>
        <Providers>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgb(23 23 23)',
                color: 'rgb(228 228 231)',
                border: '1px solid rgb(63 63 70)',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
} 