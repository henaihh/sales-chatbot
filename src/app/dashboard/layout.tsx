'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/ui/Sidebar'

// TODO: This will come from Supabase in production
// For now, using localStorage to persist the bot state
function useBotState() {
  const [isEnabled, setIsEnabled] = useState(false)

  useEffect(() => {
    // Load state from localStorage on mount
    const saved = localStorage.getItem('bot-enabled')
    if (saved !== null) {
      setIsEnabled(JSON.parse(saved))
    }
  }, [])

  const toggleBot = async () => {
    const newState = !isEnabled
    setIsEnabled(newState)
    
    // Save to localStorage
    localStorage.setItem('bot-enabled', JSON.stringify(newState))
    
    // TODO: In production, update the seller_config.is_enabled in Supabase
    // await updateSellerConfig({ is_enabled: newState })
  }

  return { isEnabled, toggleBot }
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isEnabled, toggleBot } = useBotState()

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar isEnabled={isEnabled} onToggleBot={toggleBot} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}