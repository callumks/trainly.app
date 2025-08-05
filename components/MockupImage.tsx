'use client'

import React from 'react'

export function MockupImage() {
  return (
    <div className="relative">
      {/* iPhone-style frame */}
      <div className="relative w-80 h-[640px] bg-neutral-900 rounded-[3rem] p-2 shadow-2xl border border-neutral-800">
        {/* Inner screen */}
        <div className="w-full h-full bg-neutral-950 rounded-[2.5rem] overflow-hidden relative">
          
          {/* Status bar */}
          <div className="absolute top-0 left-0 right-0 h-10 bg-neutral-950 flex items-center justify-between px-6 text-sm font-medium text-zinc-200 z-10">
            <span>9:41</span>
            <div className="flex items-center space-x-1">
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-zinc-200 rounded-full"></div>
                <div className="w-1 h-1 bg-zinc-200 rounded-full"></div>
                <div className="w-1 h-1 bg-zinc-200 rounded-full"></div>
              </div>
              <div className="w-6 h-3 border border-zinc-200 rounded-sm">
                <div className="w-4 h-2 bg-zinc-200 rounded-sm m-0.5"></div>
              </div>
            </div>
          </div>

          {/* App content mockup */}
          <div className="pt-12 pb-8 px-4 h-full bg-neutral-950">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="w-16 h-3 bg-neutral-700 rounded-full mb-2"></div>
                <div className="w-24 h-6 bg-zinc-200 rounded"></div>
              </div>
              <div className="w-10 h-10 bg-white rounded-full"></div>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                <div className="w-6 h-6 bg-neutral-700 rounded-lg mb-2"></div>
                <div className="w-8 h-4 bg-zinc-200 rounded mb-1"></div>
                <div className="w-12 h-2 bg-neutral-600 rounded"></div>
              </div>
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                <div className="w-6 h-6 bg-neutral-700 rounded-lg mb-2"></div>
                <div className="w-8 h-4 bg-zinc-200 rounded mb-1"></div>
                <div className="w-12 h-2 bg-neutral-600 rounded"></div>
              </div>
            </div>

            {/* Calendar/schedule preview */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="w-20 h-4 bg-zinc-200 rounded"></div>
                <div className="w-12 h-3 bg-white rounded-full"></div>
              </div>
              
              {/* Training sessions */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <div className="flex-1">
                    <div className="w-24 h-3 bg-zinc-300 rounded mb-1"></div>
                    <div className="w-16 h-2 bg-neutral-600 rounded"></div>
                  </div>
                  <div className="w-8 h-6 bg-neutral-800 rounded"></div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-neutral-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="w-20 h-3 bg-zinc-300 rounded mb-1"></div>
                    <div className="w-14 h-2 bg-neutral-600 rounded"></div>
                  </div>
                  <div className="w-8 h-6 bg-neutral-800 rounded"></div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-neutral-400 rounded-full"></div>
                  <div className="flex-1">
                    <div className="w-28 h-3 bg-zinc-300 rounded mb-1"></div>
                    <div className="w-18 h-2 bg-neutral-600 rounded"></div>
                  </div>
                  <div className="w-8 h-6 bg-neutral-800 rounded"></div>
                </div>
              </div>
            </div>

            {/* Bottom action */}
            <div className="bg-white rounded-xl p-4 text-center">
              <div className="w-32 h-4 bg-neutral-300 rounded mx-auto"></div>
            </div>
          </div>

          {/* Home indicator */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-zinc-200 rounded-full"></div>
        </div>

        {/* Subtle reflection effect */}
        <div className="absolute inset-2 bg-gradient-to-br from-white/5 to-transparent rounded-[2.5rem] pointer-events-none"></div>
      </div>
    </div>
  )
} 