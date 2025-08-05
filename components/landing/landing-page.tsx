'use client'

import React from 'react'
import Link from 'next/link'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Header */}
      <header className="border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-blue-500 rounded flex items-center justify-center">
              🏃
            </div>
            <span className="text-2xl font-bold">trainly</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/auth/login" className="px-4 py-2 text-gray-300 hover:text-white">
              Sign In
            </Link>
            <Link href="/auth/login" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Train Smarter with{' '}
            <span className="text-blue-400">AI-Powered</span> Coaching
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            The ultimate training platform for hybrid athletes. Connect your Strava, 
            get personalized AI coaching, and optimize your performance across all disciplines.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/auth/login"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
            >
              🏃 Connect with Strava
            </Link>
            <Link 
              href="/auth/login"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-600 text-white rounded-md hover:bg-gray-800 font-medium"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              Everything You Need to Excel
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Built specifically for hybrid athletes who demand more from their training
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: '🧠',
                title: 'AI-Powered Plans',
                description: 'Personalized training plans that adapt to your progress and recovery'
              },
              {
                icon: '📊',
                title: 'Strava Integration',
                description: 'Seamlessly sync your activities and let AI analyze your performance'
              },
              {
                icon: '📅',
                title: 'Smart Scheduling',
                description: 'Intelligent training calendar that balances intensity and recovery'
              },
              {
                icon: '⚡',
                title: 'Real-time Adaptation',
                description: 'Plans adjust automatically based on your performance and fatigue'
              },
              {
                icon: '🏃‍♂️',
                title: 'Multi-Sport Focus',
                description: 'Built for hybrid athletes training across multiple disciplines'
              },
              {
                icon: '🏆',
                title: 'Performance Insights',
                description: 'Deep analytics to understand your progress and optimize training'
              }
            ].map((feature, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="bg-gray-800 border border-gray-700 rounded-lg text-center p-8">
          <h3 className="text-3xl font-bold mb-4">Ready to Transform Your Training?</h3>
          <p className="text-lg text-gray-300 mb-6">
            Join thousands of athletes already training smarter with trainly
          </p>
          <Link 
            href="/auth/login"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
          >
            Start Your Free Trial
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 bg-blue-500 rounded flex items-center justify-center">
                🏃
              </div>
              <span className="font-bold">trainly</span>
            </div>
            <p className="text-sm text-gray-400">
              © 2024 trainly. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
} 