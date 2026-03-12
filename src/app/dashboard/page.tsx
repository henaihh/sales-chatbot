'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { MessageSquare, Bot, AlertTriangle, DollarSign } from 'lucide-react'

// Mock data - in production this will come from Supabase
const mockStats = {
  questionsToday: 24,
  autoAnswered: 18,
  pendingEscalations: 3,
  costToday: 2.34
}

const mockRecentInteractions = [
  {
    id: '1',
    type: 'question' as const,
    buyer_text: '¿Tienen stock en color azul?',
    response_text: '¡Hola! Sí, tenemos stock disponible en color azul. Puedes realizar tu compra con normalidad.',
    tier_used: 2 as const,
    status: 'answered' as const,
    created_at: '2026-03-12T02:00:00Z',
    item_title: 'Zapatillas Nike Air Max'
  },
  {
    id: '2', 
    type: 'message' as const,
    buyer_text: '¿Cuándo llega mi pedido? Ya pasaron 3 días',
    response_text: null,
    tier_used: 4 as const,
    status: 'escalated' as const,
    created_at: '2026-03-12T01:30:00Z',
    item_title: 'iPhone 15 Pro Max'
  },
  {
    id: '3',
    type: 'question' as const,
    buyer_text: '¿Hacen factura A?',
    response_text: 'Hola! Emitimos factura tipo B. Si necesitas factura A, podrías consultarlo por mensaje privado.',
    tier_used: 3 as const,
    status: 'answered' as const,
    created_at: '2026-03-12T01:15:00Z',
    item_title: 'Notebook Lenovo ThinkPad'
  }
]

function StatCard({ title, value, icon: Icon, description }: {
  title: string
  value: string | number
  icon: any
  description: string
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-700">{title}</CardTitle>
        <Icon className="h-4 w-4 text-slate-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        <p className="text-xs text-slate-500 mt-1">{description}</p>
      </CardContent>
    </Card>
  )
}

function RecentInteractionRow({ interaction }: { interaction: typeof mockRecentInteractions[0] }) {
  const tierConfig = {
    2: { label: 'Haiku', className: 'badge-tier-2' },
    3: { label: 'Sonnet', className: 'badge-tier-3' },
    4: { label: 'Manual', className: 'badge-tier-4' },
  }

  const statusConfig = {
    answered: { label: 'Respondida', className: 'badge-status-answered' },
    escalated: { label: 'Escalada', className: 'badge-status-escalated' },
    pending: { label: 'Pendiente', className: 'badge-status-pending' },
    error: { label: 'Error', className: 'badge-status-escalated' },
  }

  const typeConfig = {
    question: { label: 'Consulta', className: 'badge-type-question' },
    message: { label: 'Mensaje', className: 'badge-type-message' },
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('es-AR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <tr className="border-b border-slate-200 hover:bg-slate-50">
      <td className="px-4 py-3 text-sm text-slate-500">{formatTime(interaction.created_at)}</td>
      <td className="px-4 py-3">
        <span className={`badge ${typeConfig[interaction.type].className}`}>
          {typeConfig[interaction.type].label}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-slate-900 max-w-xs truncate">
        {interaction.buyer_text}
      </td>
      <td className="px-4 py-3">
        <span className={`badge ${tierConfig[interaction.tier_used].className}`}>
          {tierConfig[interaction.tier_used].label}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className={`badge ${statusConfig[interaction.status].className}`}>
          {statusConfig[interaction.status].label}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-slate-600 max-w-sm truncate">
        {interaction.item_title}
      </td>
    </tr>
  )
}

export default function DashboardPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600">Resumen de actividad del bot de respuestas automáticas</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Consultas Hoy"
          value={mockStats.questionsToday}
          icon={MessageSquare}
          description="Total de preguntas recibidas"
        />
        <StatCard
          title="Auto-respondidas"
          value={mockStats.autoAnswered}
          icon={Bot}
          description={`${Math.round((mockStats.autoAnswered / mockStats.questionsToday) * 100)}% de automatización`}
        />
        <StatCard
          title="Escalaciones Pendientes"
          value={mockStats.pendingEscalations}
          icon={AlertTriangle}
          description="Requieren atención manual"
        />
        <StatCard
          title="Costo Estimado Hoy"
          value={`$${mockStats.costToday}`}
          icon={DollarSign}
          description="Uso de tokens de IA"
        />
      </div>

      {/* Recent Interactions */}
      <Card>
        <CardHeader>
          <CardTitle>Interacciones Recientes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Hora</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Tipo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Texto</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Tier</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Estado</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Producto</th>
                </tr>
              </thead>
              <tbody>
                {mockRecentInteractions.map((interaction) => (
                  <RecentInteractionRow key={interaction.id} interaction={interaction} />
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}