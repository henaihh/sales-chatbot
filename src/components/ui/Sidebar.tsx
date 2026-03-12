'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'
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
  Info
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
  isEnabled: boolean
  onToggleBot: () => void
}

export function Sidebar({ isEnabled, onToggleBot }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-slate-200">
      {/* Header */}
      <div className="flex h-16 items-center border-b border-slate-200 px-6">
        <div className="flex items-center gap-3">
          <MessageSquare className="h-8 w-8 text-indigo-600" />
          <div>
            <h1 className="text-lg font-bold text-slate-900">AutoResponder</h1>
            <p className="text-xs text-slate-500">MercadoLibre</p>
          </div>
        </div>
      </div>

      {/* Bot Status & Toggle */}
      <div className="border-b border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={clsx(
              'h-2 w-2 rounded-full',
              isEnabled ? 'bg-green-500' : 'bg-red-500'
            )} />
            <span className="text-sm font-medium text-slate-700">
              {isEnabled ? 'Bot Activo' : 'Bot Inactivo'}
            </span>
          </div>
          <button
            onClick={onToggleBot}
            className={clsx(
              'flex h-6 w-11 items-center rounded-full px-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500',
              isEnabled ? 'bg-indigo-600' : 'bg-slate-300'
            )}
          >
            <div
              className={clsx(
                'h-5 w-5 rounded-full bg-white transition-transform',
                isEnabled ? 'translate-x-5' : 'translate-x-0'
              )}
            />
          </button>
        </div>
        {!isEnabled && (
          <p className="mt-2 text-xs text-slate-500">
            Usa el Test Bot para probar antes de activar
          </p>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                'sidebar-item',
                isActive && 'active'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-200 p-4">
        <div className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-600">
          <Power className="h-4 w-4" />
          <div className="flex-1">
            <p className="font-medium">Vicus Admin</p>
            <p className="text-xs text-slate-500">vicus@example.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}