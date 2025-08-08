// Server Component: allows passing icon components from server to client without function-prop errors

import React from 'react'
import { LucideIcon } from 'lucide-react'

interface IconFeatureProps {
  icon: LucideIcon
  title: string
  description: string
}

export function IconFeature({ icon: Icon, title, description }: IconFeatureProps) {
  return (
    <div className="group relative">
      {/* Card */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 hover:border-neutral-700 transition-all duration-300 group-hover:-translate-y-1">
        
        {/* Icon */}
        <div className="mb-8">
          <div className="w-16 h-16 bg-neutral-800 rounded-2xl flex items-center justify-center group-hover:bg-neutral-700 transition-colors duration-300">
            <Icon size={32} />
          </div>
        </div>
        
        {/* Title */}
        <h3 className="text-2xl font-bold text-zinc-100 mb-4 group-hover:text-white transition-colors duration-300">
          {title}
        </h3>
        
        {/* Description */}
        <p className="text-zinc-400 leading-relaxed text-lg">
          {description}
        </p>
        
        {/* Subtle hover accent */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </div>
  )
} 