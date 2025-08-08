import React from 'react'
export const dynamic = 'force-static'
import { Hero } from '@/components/Hero'
import { EmailSignup } from '@/components/EmailSignup'
import { IconFeature } from '@/components/IconFeature'
import { Brain, Activity, Target, Users, Star, Lock, Mail, Zap } from 'lucide-react'

export default function HomePage() {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Plans',
      description: 'Adaptive training based on your performance and recovery data'
    },
    {
      icon: Activity,
      title: 'Strava Integration',
      description: 'Seamlessly sync activities and get intelligent insights'
    },
    {
      icon: Target,
      title: 'Multi-Sport Focus',
      description: 'Built for hybrid athletes training across disciplines'
    }
  ]

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Hero Section */}
      <Hero />
      
      {/* Features Section */}
      <section className="py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-100 mb-6">
              Everything you need to train smarter
            </h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Built specifically for hybrid athletes who demand more from their training
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <IconFeature
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Email Signup Section */}
      <EmailSignup />

      {/* Built For Section */}
      <section className="py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-100 mb-12">
            Built for hybrid athletes
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-neutral-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-zinc-400" />
              </div>
              <span className="text-zinc-300 font-medium">Runners</span>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-neutral-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 text-zinc-400" />
              </div>
              <span className="text-zinc-300 font-medium">Cyclists</span>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-neutral-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-zinc-400" />
              </div>
              <span className="text-zinc-300 font-medium">Swimmers</span>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-neutral-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-zinc-400" />
              </div>
              <span className="text-zinc-300 font-medium">CrossFit</span>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-12">
            <div className="flex justify-center mb-8">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-yellow-500 fill-current" />
              ))}
            </div>
            <blockquote className="text-2xl md:text-3xl text-zinc-200 font-medium mb-8 leading-relaxed">
              "Finally, a training platform that understands hybrid athletes. The AI coaching adapts perfectly to my running and strength training schedule."
            </blockquote>
            <div className="flex items-center justify-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-neutral-700 to-neutral-800 rounded-full flex items-center justify-center">
                <span className="text-zinc-300 font-bold text-lg">J</span>
              </div>
              <div className="text-left">
                <div className="font-semibold text-zinc-200 text-lg">Jordan Martinez</div>
                <div className="text-zinc-400">Triathlete & CrossFit Athlete</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 border-t border-neutral-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <span className="text-neutral-950 font-bold text-lg">T</span>
              </div>
              <span className="text-2xl font-bold text-zinc-100">trainly</span>
            </div>
            <div className="flex items-center space-x-8 text-zinc-400">
              <a href="#" className="hover:text-zinc-200 transition-colors">Privacy</a>
              <a href="#" className="hover:text-zinc-200 transition-colors">Terms</a>
              <a href="#" className="hover:text-zinc-200 transition-colors">Support</a>
            </div>
            <p className="text-zinc-500">© 2024 trainly. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 