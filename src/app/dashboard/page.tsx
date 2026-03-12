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
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-1">Resumen de actividad del bot de ventas</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Consultas Hoy</p>
              <p className="text-2xl lg:text-3xl font-bold text-slate-900">{mockStats.todayQuestions}</p>
            </div>
            <MessageSquare className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Automatización</p>
              <p className="text-2xl lg:text-3xl font-bold text-green-600">{mockStats.automationRate}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Tiempo Promedio</p>
              <p className="text-2xl lg:text-3xl font-bold text-indigo-600">{mockStats.avgResponseTime}</p>
            </div>
            <Clock className="h-8 w-8 text-indigo-500" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Escalaciones</p>
              <p className="text-2xl lg:text-3xl font-bold text-amber-600">{mockStats.escalatedCount}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-amber-500" />
          </div>
        </div>
      </div>

      {/* Recent Interactions */}
      <div className="card">
        <div className="mb-6">
          <h2 className="text-lg lg:text-xl font-semibold text-slate-900">Interacciones Recientes</h2>
          <p className="text-slate-600 text-sm">Últimas consultas procesadas por el bot</p>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th className="mobile-hidden">Tipo</th>
                <th>Consulta</th>
                <th className="mobile-hidden">Tier</th>
                <th>Estado</th>
                <th className="mobile-hidden">Hora</th>
              </tr>
            </thead>
            <tbody>
              {mockInteractions.map((interaction) => (
                <tr key={interaction.id}>
                  <td className="mobile-hidden">
                    {getTypeBadge(interaction.type)}
                  </td>
                  <td>
                    <div>
                      <p className="font-medium text-slate-900 truncate max-w-xs lg:max-w-md">
                        {interaction.buyerText}
                      </p>
                      <p className="text-xs text-slate-500 mt-1 lg:hidden">
                        {interaction.itemTitle}
                      </p>
                      <div className="lg:hidden mt-2 mobile-stack">
                        {getTypeBadge(interaction.type)}
                        {getTierBadge(interaction.tier)}
                      </div>
                    </div>
                  </td>
                  <td className="mobile-hidden">
                    {getTierBadge(interaction.tier)}
                  </td>
                  <td>
                    {getStatusBadge(interaction.status)}
                  </td>
                  <td className="mobile-hidden">
                    <span className="text-xs text-slate-500">
                      {formatTime(interaction.timestamp)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}