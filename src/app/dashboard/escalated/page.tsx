'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { AlertTriangle, Send, Eye, X, Clock, MessageSquare } from 'lucide-react'

const mockEscalatedInteractions = [
  {
    id: '1',
    type: 'message' as const,
    buyer_text: 'Hola, compré hace 5 días y mi pedido sigue en preparación. Necesito que me den una fecha exacta porque es un regalo.',
    draft_text: 'Hola! Entiendo tu preocupación por el pedido. Déjame verificar el estado específico de tu orden y te proporciono una fecha exacta de envío.',
    meli_item_id: 'MLA123456789',
    item_title: 'iPhone 15 Pro Max 256GB',
    buyer_user_id: 'BUYER123',
    created_at: '2026-03-12T01:30:00Z',
    category: 'shipping_complaint'
  },
  {
    id: '2',
    type: 'question' as const,
    buyer_text: '¿Es original este producto? Porque vi en otros lugares más barato y me da desconfianza.',
    draft_text: 'Hola! Te aseguro que todos nuestros productos son 100% originales con garantía oficial.',
    meli_item_id: 'MLA987654321',
    item_title: 'Zapatillas Nike Air Max 270',
    buyer_user_id: 'BUYER456',
    created_at: '2026-03-12T00:45:00Z',
    category: 'authenticity_concern'
  },
  {
    id: '3',
    type: 'message' as const,
    buyer_text: 'El producto llegó roto. Necesito la devolución inmediata del dinero.',
    draft_text: 'Lamento mucho que el producto haya llegado en mal estado. Te voy a generar una etiqueta de devolución prepaga.',
    meli_item_id: 'MLA555666777',
    item_title: 'Notebook Lenovo ThinkPad E14',
    buyer_user_id: 'BUYER789',
    created_at: '2026-03-11T22:15:00Z',
    category: 'damaged_product'
  }
]

interface EscalatedItemProps {
  interaction: typeof mockEscalatedInteractions[0]
  onRespond: (id: string, response: string) => void
  onDismiss: (id: string) => void
}

function EscalatedItem({ interaction, onRespond, onDismiss }: EscalatedItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [responseText, setResponseText] = useState(interaction.draft_text)
  const [isResponding, setIsResponding] = useState(false)

  const handleRespond = async () => {
    setIsResponding(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    onRespond(interaction.id, responseText)
    setIsResponding(false)
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    if (diffHours < 1) return 'Hace < 1h'
    if (diffHours < 24) return `Hace ${diffHours}h`
    return `Hace ${Math.floor(diffHours / 24)}d`
  }

  const getCategoryLabel = (cat?: string) => {
    const labels: Record<string, string> = {
      shipping_complaint: 'Envío',
      authenticity_concern: 'Autenticidad',
      damaged_product: 'Daño'
    }
    return labels[cat || ''] || 'General'
  }

  return (
    <div className="card border-l-4 border-l-red-500">
      <div className="p-3 lg:p-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="badge badge-tier-4 text-xs">{getCategoryLabel(interaction.category)}</span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatTime(interaction.created_at)}
            </span>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded hover:bg-slate-100"
            >
              <Eye className="h-4 w-4 text-slate-500" />
            </button>
            <button
              onClick={() => onDismiss(interaction.id)}
              className="p-1.5 rounded hover:bg-slate-100"
            >
              <X className="h-4 w-4 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Product */}
        <p className="text-xs text-slate-500 mb-1 truncate">
          {interaction.item_title} · {interaction.meli_item_id}
        </p>

        {/* Buyer text */}
        <p className="text-sm text-slate-900 leading-snug">{interaction.buyer_text}</p>

        {/* Expanded response area */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-slate-200">
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Tu respuesta:
            </label>
            <textarea
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              rows={3}
              className="textarea text-sm"
            />
            <p className="text-xs text-slate-400 mt-1">Máx 2000 chars. No incluir contactos externos.</p>
            
            <div className="flex gap-2 mt-3">
              <button 
                onClick={handleRespond}
                disabled={isResponding}
                className={`btn btn-primary flex-1 text-sm ${isResponding ? 'loading' : ''}`}
              >
                <Send className="h-3.5 w-3.5" />
                {isResponding ? 'Enviando...' : 'Enviar'}
              </button>
              <button 
                onClick={() => onDismiss(interaction.id)}
                className="btn btn-outline text-sm"
              >
                Marcar leído
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function EscalatedPage() {
  const [interactions, setInteractions] = useState(mockEscalatedInteractions)

  const handleRespond = (id: string, response: string) => {
    console.log('Sending response for', id, ':', response)
    setInteractions(prev => prev.filter(i => i.id !== id))
    alert('Respuesta enviada correctamente')
  }

  const handleDismiss = (id: string) => {
    setInteractions(prev => prev.filter(i => i.id !== id))
  }

  return (
    <div>
      <div className="mb-4 lg:mb-6">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="h-6 w-6 text-red-500" />
          <h1 className="text-xl lg:text-3xl font-bold text-slate-900">Escalaciones</h1>
        </div>
        <p className="text-sm text-slate-600">Mensajes que requieren tu atención personal</p>
        
        {interactions.length === 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
            <p className="text-sm text-green-800">
              🎉 ¡No tienes escalaciones pendientes!
            </p>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {interactions.map((interaction) => (
          <EscalatedItem
            key={interaction.id}
            interaction={interaction}
            onRespond={handleRespond}
            onDismiss={handleDismiss}
          />
        ))}
      </div>

      {interactions.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
          <p className="text-xs font-medium text-amber-800 mb-1">💡 Tips:</p>
          <ul className="text-xs text-amber-700 space-y-0.5 list-disc list-inside">
            <li>Mantené tono empático y profesional</li>
            <li>No incluir contacto externo (tel, email, redes)</li>
            <li>Para casos complejos, sugerir mensajería privada de ML</li>
          </ul>
        </div>
      )}
    </div>
  )
}