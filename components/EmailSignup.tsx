'use client'

import React, { useState } from 'react'
import { Lock, Mail, Zap, CheckCircle } from 'lucide-react'

export function EmailSignup() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsLoading(false)
    setIsSubmitted(true)
    setEmail('')
    
    // Reset success state after 3 seconds
    setTimeout(() => setIsSubmitted(false), 3000)
  }

  return (
    <section className="py-32 px-4 bg-neutral-900">
      <div className="max-w-2xl mx-auto text-center">
        
        {/* Section header */}
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-100 mb-6">
            Get early access
          </h2>
          <p className="text-xl text-zinc-400 leading-relaxed">
            Join 1,000+ athletes already on the waitlist for smarter training.
          </p>
        </div>

        {/* Email form */}
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            
            {/* Email input */}
            <div className="flex-1 relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-6 py-4 text-lg bg-neutral-800 border border-neutral-700 rounded-2xl text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200"
                required
              />
            </div>
            
            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading || isSubmitted}
              className="px-8 py-4 bg-white text-neutral-950 font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-neutral-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-neutral-400 border-t-neutral-950 rounded-full animate-spin"></div>
                  <span>Joining...</span>
                </div>
              ) : isSubmitted ? (
                <div className="flex items-center space-x-2">
                  <CheckCircle size={16} />
                  <span>Added!</span>
                </div>
              ) : (
                'Join the Beta'
              )}
            </button>
          </div>
        </form>

        {/* Success message */}
        {isSubmitted && (
          <div className="mt-8 p-4 bg-neutral-800 border border-neutral-700 rounded-2xl">
            <p className="text-zinc-200 font-medium">
              You're on the list! We'll email you when trainly is ready.
            </p>
          </div>
        )}

        {/* Trust indicators */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-12 text-sm text-zinc-400">
          <div className="flex items-center space-x-2">
            <Lock size={16} />
            <span>Your email is safe with us</span>
          </div>
          <div className="flex items-center space-x-2">
            <Mail size={16} />
            <span>No spam, ever</span>
          </div>
          <div className="flex items-center space-x-2">
            <Zap size={16} />
            <span>Unsubscribe anytime</span>
          </div>
        </div>

        {/* Social proof */}
        <div className="mt-16">
          <p className="text-zinc-500 mb-8">Trusted by athletes from</p>
          <div className="flex flex-wrap justify-center items-center gap-8 text-zinc-600">
            <div className="text-lg font-medium">Nike Run Club</div>
            <div className="text-lg font-medium">Strava</div>
            <div className="text-lg font-medium">Garmin</div>
            <div className="text-lg font-medium">Zwift</div>
          </div>
        </div>
      </div>
    </section>
  )
} 