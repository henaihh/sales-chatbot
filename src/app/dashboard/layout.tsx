'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/ui/Sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [botEnabled, setBotEnabled] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar botEnabled={botEnabled} onToggleBot={setBotEnabled} />
      
      {/* Main content */}
      <div className="lg:pl-64">
        <main className="min-h-screen">
          {/* Mobile header spacing */}
          <div className="lg:hidden h-16" />
          
          {/* Content */}
          <div className="px-4 py-6 lg:px-8 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}