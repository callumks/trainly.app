import React from 'react'
import TopBar from './TopBar'
import './app.css'

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="tr-app">
      <TopBar />
      <div className="wrap">{children}</div>
    </div>
  )
}
