'use client'

import React from 'react'
import { MockupImage } from './MockupImage'
import { Play, CheckCircle, Shield } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 pt-20 pb-32 sm:pt-32 sm:pb-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          
          {/* Content - appears first on mobile */}
          <div className="order-2 lg:order-1 text-center lg:text-left">
            <div className="mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-neutral-800 text-zinc-300 border border-neutral-700 mb-8">
                <span className="mr-2 w-2 h-2 bg-green-500 rounded-full"></span>
                Now in Beta
              </div>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-zinc-100 leading-tight mb-8">
              Train Smarter with{' '}
              <span className="text-white">
                AI Coaching
              </span>
            </h1>
            
            <p className="text-xl text-zinc-400 mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Get personalized training plans powered by Strava and AI — built for hybrid athletes.
            </p>
            
            {/* Primary CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <button className="group relative px-8 py-4 bg-white text-neutral-950 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                <span className="relative z-10">Get Early Access</span>
              </button>
              
              <button className="px-8 py-4 text-zinc-300 font-semibold hover:text-zinc-100 transition-colors duration-200 flex items-center justify-center border border-neutral-700 rounded-2xl hover:border-neutral-600">
                                 <Play size={18} />
                See how it works
              </button>
            </div>
            
            {/* Microcopy */}
            <p className="text-sm text-zinc-500 mb-16">
              No credit card required · Cancel anytime
            </p>
            
            {/* Social proof badges */}
            <div className="flex items-center justify-center lg:justify-start space-x-8 text-sm text-zinc-400">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-orange-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">S</span>
                </div>
                <span>Strava Verified</span>
              </div>
              <div className="flex items-center space-x-2">
                                 <CheckCircle size={16} />
                <span>GDPR Compliant</span>
              </div>
            </div>
          </div>
          
          {/* Mockup Image - appears second on mobile */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative">
              <MockupImage />
            </div>
          </div>
          
        </div>
      </div>
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-transparent to-neutral-950 pointer-events-none"></div>
    </section>
  )
} 