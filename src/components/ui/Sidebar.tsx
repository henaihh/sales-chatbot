'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
  Home, 
  AlertTriangle, 
  History, 
  BarChart3, 
  BookOpen, 
  Settings, 
  MessageSquare,
  Power,
  TestTube,
  Info,
  Menu,
  X
} from 'lucide-react'

const navigation = [
  { name: 'Inicio', href: '/dashboard', icon: Home },
  { name: 'Test Bot', href: '/dashboard/test', icon: TestTube },
  { name: 'Estado del Proyecto', href: '/dashboard/info', icon: Info },
  { name: 'Escalaciones', href: '/dashboard/escalated', icon: AlertTriangle },
  { name: 'Historial', href: '/dashboard/history', icon: History },
  { name: 'Analíticas', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Base de Conocimiento', href: '/dashboard/knowledge', icon: BookOpen },
  { name: 'Configuración', href: '/dashboard/settings', icon: Settings },
]

interface SidebarProps {
  botEnabled: boolean
  onToggleBot: (enabled: boolean) => void
}

export function Sidebar({ botEnabled, onToggleBot }: SidebarProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const closeMobileMenu = () => setMobileMenuOpen(false)

  const SidebarContent = () => (
    <>
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <MessageSquare className="h-8 w-8 text-indigo-600" />
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Sales Bot</h2>
            <p className="text-sm text-slate-500">MercadoLibre AI</p>
          </div>
        </div>
      </div>

      {/* Bot Toggle */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Power className={`h-5 w-5 ${botEnabled ? 'text-green-500' : 'text-slate-400'}`} />
            <span className="text-sm font-medium text-slate-900">Bot Status</span>
          </div>
          <button
            onClick={() => onToggleBot(!botEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
              botEnabled ? 'bg-green-500' : 'bg-slate-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                botEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          {botEnabled ? 'Bot activo - Respondiendo automáticamente' : 'Bot desactivado - No responde automáticamente'}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={closeMobileMenu}
              className={`sidebar-item ${isActive ? 'active' : ''}`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200">
        <p className="text-xs text-slate-400 text-center">
          MercadoLibre Auto-Responder v1.0
        </p>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 bg-white rounded-md shadow-md border border-slate-200"
        >
          <Menu className="h-6 w-6 text-slate-600" />
        </button>
      </div>

      {/* Mobile sidebar */}
      <div className={`lg:hidden fixed inset-0 z-40 ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={closeMobileMenu}
        />
        
        {/* Sidebar */}
        <div className="fixed left-0 top-0 bottom-0 w-80 max-w-[80vw] bg-white shadow-xl flex flex-col">
          {/* Close button */}
          <div className="p-4 border-b border-slate-200">
            <button
              onClick={closeMobileMenu}
              className="p-2 rounded-md hover:bg-slate-100"
            >
              <X className="h-6 w-6 text-slate-600" />
            </button>
          </div>
          
          <SidebarContent />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:fixed lg:inset-y-0 lg:flex-col lg:bg-white lg:border-r lg:border-slate-200">
        <SidebarContent />
      </div>
    </>
  )
}