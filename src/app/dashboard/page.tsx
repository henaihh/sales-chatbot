'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { MessageSquare, TrendingUp, Clock, AlertTriangle } from 'lucide-react'

// Mock data
const mockStats = {
  todayQuestions: 47,
  automationRate: 85,
  avgResponseTime: '1.2s',
  escalatedCount: 3
}

const mockInteractions = [
  {
    id: '1',
    type: 'question' as const,
    buyerText: '¿Tienen stock disponible en color azul?',
    response: 'Sí, tenemos stock disponible en color azul. Puedes realizar tu compra con normalidad.',
    tier: 2,
    timestamp: '2026-03-12T02:30:00Z',
    itemTitle: 'Zapatillas Nike Air Max',
    status: 'answered' as const
  },
  {
    id: '2', 
    type: 'message' as const,
    buyerText: 'Mi pedido no llegó en la fecha prometida',
    response: 'Entiendo tu preocupación. Déjame verificar el estado de tu pedido y te doy una actualización.',
    tier: 3,
    timestamp: '2026-03-12T02:15:00Z',
    itemTitle: 'Notebook Lenovo ThinkPad',
    status: 'escalated' as const
  },
  {
    id: '3',
    type: 'question' as const, 
    buyerText: '¿El precio incluye IVA?',
    response: 'Sí, el precio publicado incluye IVA. También aceptamos todos los medios de pago.',
    tier: 2,
    timestamp: '2026-03-12T01:45:00Z',
    itemTitle: 'iPhone 15 Pro Max',
    status: 'answered' as const
  }
]

export default function DashboardPage() {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('es-AR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const getTierBadge = (tier: number) => {
    switch (tier) {
      case 2:
        return <Badge className="badge-tier-2">Tier 2</Badge>
      case 3:
        return <Badge className="badge-tier-3">Tier 3</Badge>
      case 4:
        return <Badge className="badge-tier-4">Tier 4</Badge>
      default:
        return <Badge className="badge-default">-</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'answered':
        return <Badge className="badge-success">Respondida</Badge>
      case 'pending':
        return <Badge className="badge-warning">Pendiente</Badge>
      case 'escalated':
        return <Badge className="badge-tier-4">Escalada</Badge>
      default:
        return <Badge className="badge-default">-</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    return (
      <Badge className={type === 'question' ? 'badge-tier-2' : 'badge-tier-3'}>
        {type === 'question' ? 'Pregunta' : 'Mensaje'}
      </Badge>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-4 lg:mb-6">
        <h1 className="text-xl lg:text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-600 mt-1">Resumen de actividad del bot de ventas</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4 mb-4 lg:mb-8">
        {[
          { label: 'Consultas Hoy', value: mockStats.todayQuestions, color: 'text-slate-900', icon: MessageSquare, iconColor: 'text-blue-500' },
          { label: 'Automatización', value: `${mockStats.automationRate}%`, color: 'text-green-600', icon: TrendingUp, iconColor: 'text-green-500' },
          { label: 'Tiempo Prom.', value: mockStats.avgResponseTime, color: 'text-indigo-600', icon: Clock, iconColor: 'text-indigo-500' },
          { label: 'Escalaciones', value: mockStats.escalatedCount, color: 'text-amber-600', icon: AlertTriangle, iconColor: 'text-amber-500' },
        ].map(({ label, value, color, icon: Icon, iconColor }, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-lg p-3 lg:p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-slate-500">{label}</p>
                <p className={`text-lg lg:text-2xl font-bold ${color} mt-0.5`}>{value}</p>
              </div>
              <Icon className={`h-5 w-5 lg:h-7 lg:w-7 ${iconColor} flex-shrink-0`} />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Interactions - Mobile: card list, Desktop: table */}
      <div>
        <div className="mb-3">
          <h2 className="text-base lg:text-xl font-semibold text-slate-900">Interacciones Recientes</h2>
          <p className="text-slate-500 text-xs">Últimas consultas procesadas</p>
        </div>

        {/* Mobile: card list */}
        <div className="lg:hidden space-y-2">
          {mockInteractions.map((interaction) => (
            <div key={interaction.id} className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm">
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {getTypeBadge(interaction.type)}
                  {getTierBadge(interaction.tier)}
                </div>
                {getStatusBadge(interaction.status)}
              </div>
              <p className="text-sm text-slate-900 leading-snug mb-1">{interaction.buyerText}</p>
              <p className="text-xs text-slate-400">{interaction.itemTitle} · {formatTime(interaction.timestamp)}</p>
            </div>
          ))}
        </div>

        {/* Desktop: table */}
        <div className="hidden lg:block table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Consulta</th>
                <th>Tier</th>
                <th>Estado</th>
                <th>Hora</th>
              </tr>
            </thead>
            <tbody>
              {mockInteractions.map((interaction) => (
                <tr key={interaction.id}>
                  <td>{getTypeBadge(interaction.type)}</td>
                  <td>
                    <p className="font-medium text-slate-900 truncate max-w-md">{interaction.buyerText}</p>
                  </td>
                  <td>{getTierBadge(interaction.tier)}</td>
                  <td>{getStatusBadge(interaction.status)}</td>
                  <td><span className="text-xs text-slate-500">{formatTime(interaction.timestamp)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}