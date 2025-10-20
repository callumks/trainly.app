import React from 'react'

export default function BrandNewUxLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100svh] bg-gradient-to-b from-neutral-950 via-neutral-950 to-neutral-900">
      {children}
    </div>
  )
}


