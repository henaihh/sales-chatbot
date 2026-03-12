'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { Badge } from '@/components/ui/Badge'
import { AlertTriangle, Send, Eye, X, Clock, MessageSquare } from 'lucide-react'

// Mock data for escalated interactions
const mockEscalatedInteractions = [
  {
    id: '1',
    type: 'message' as const,
    buyer_text: 'Hola, compré hace 5 días y mi pedido sigue en preparación. Necesito que me den una fecha exacta porque es un regalo. Si no pueden cumplir voy a cancelar y hacer el reclamo correspondiente.',
    draft_text: 'Hola! Entiendo tu preocupación por el pedido. Déjame verificar el estado específico de tu orden y te proporciono una fecha exacta de envío. ¿Podrías compartir tu número de pedido para darte información precisa? Vamos a resolver esto juntos.',
    meli_item_id: 'MLA123456789',
    item_title: 'iPhone 15 Pro Max 256GB',
    buyer_user_id: 'BUYER123',
    created_at: '2026-03-12T01:30:00Z',
    category: 'shipping_complaint'
  },
  {
    id: '2',
    type: 'question' as const,
    buyer_text: '¿Es original este producto? Porque vi en otros lugares más barato y me da desconfianza. Si no es original voy a hacer la denuncia en defensa del consumidor.',
    draft_text: 'Hola! Te aseguro que todos nuestros productos son 100% originales con garantía oficial. Entiendo tu preocupación por el precio - nosotros trabajamos con márgenes justos y ofrecemos garantía completa. ¿Te gustaría que te envíe fotos del producto sellado o información adicional sobre la garantía?',
    meli_item_id: 'MLA987654321',
    item_title: 'Zapatillas Nike Air Max 270',
    buyer_user_id: 'BUYER456',
    created_at: '2026-03-12T00:45:00Z',
    category: 'authenticity_concern'
  },
  {
    id: '3',
    type: 'message' as const,
    buyer_text: 'El producto llegó roto. Necesito la devolución inmediata del dinero. Ya saqué fotos de todo. Si no me responden en 24hs voy a escalarlo con MercadoLibre.',
    draft_text: 'Lamento mucho que el producto haya llegado en mal estado. Queremos resolver esto inmediatamente. Te voy a generar una etiqueta de devolución prepaga y en cuanto recibamos el producto te reintegramos el dinero completo. ¿Podrías enviarme las fotos para procesar la devolución más rápido?',
    meli_item_id: 'MLA555666777',
    item_title: 'Notebook Lenovo ThinkPad E14',
    buyer_user_id: 'BUYER789',
    created_at: '2026-03-11T22:15:00Z',
    category: 'damaged_product'
  }
]

interface EscalatedInteractionProps {
  interaction: typeof mockEscalatedInteractions[0]
  onRespond: (id: string, response: string) => void
  onDismiss: (id: string) => void
}

function EscalatedInteraction({ interaction, onRespond, onDismiss }: EscalatedInteractionProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [responseText, setResponseText] = useState(interaction.draft_text)
  const [isResponding, setIsResponding] = useState(false)

  const handleRespond = async () => {
    setIsResponding(true)
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    onRespond(interaction.id, responseText)
    setIsResponding(false)
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    
    if (diffHours < 1) {
      return 'Hace menos de 1 hora'
    } else if (diffHours < 24) {
      return `Hace ${diffHours} horas`
    } else {
      const diffDays = Math.floor(diffHours / 24)
      return `Hace ${diffDays} días`
    }
  }

  const getCategoryBadge = (category?: string) => {
    const configs = {
      shipping_complaint: { label: 'Envío', color: 'bg-amber-50 text-amber-700 border-amber-200' },
      authenticity_concern: { label: 'Autenticidad', color: 'bg-purple-50 text-purple-700 border-purple-200' },
      damaged_product: { label: 'Producto Dañado', color: 'bg-red-50 text-red-700 border-red-200' }
    }
    
    if (!category || !configs[category as keyof typeof configs]) {
      return <Badge variant="default">General</Badge>
    }
    
    const config = configs[category as keyof typeof configs]
    return <span className={`badge ${config.color}`}>{config.label}</span>
  }

  return (
    <Card className="border-l-4 border-l-red-500">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="h-4 w-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700">
                {interaction.type === 'question' ? 'Pregunta' : 'Mensaje'} - {interaction.item_title}
              </span>
              {getCategoryBadge(interaction.category)}
            </div>
            
            <p className="text-sm text-slate-900 mb-3">{interaction.buyer_text}</p>
            
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatTime(interaction.created_at)}
              </span>
              <span>ID: {interaction.meli_item_id}</span>
              <span>Usuario: {interaction.buyer_user_id}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <Eye className="h-4 w-4" />
              {isExpanded ? 'Cerrar' : 'Responder'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDismiss(interaction.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-0">
          <div className="border-t border-slate-200 pt-4">
            <div className="mb-4">
              <label htmlFor={`response-${interaction.id}`} className="block text-sm font-medium text-slate-700 mb-2">
                Tu respuesta (puedes editar la sugerencia del bot):
              </label>
              <Textarea
                id={`response-${interaction.id}`}
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                rows={4}
                placeholder="Escribe tu respuesta personalizada..."
              />
              <p className="text-xs text-slate-500 mt-1">
                Máximo 2000 caracteres. Evita incluir contactos externos.
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={handleRespond}
                loading={isResponding}
                className="flex-1"
              >
                <Send className="h-4 w-4 mr-2" />
                Enviar Respuesta
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => onDismiss(interaction.id)}
              >
                <X className="h-4 w-4 mr-2" />
                Marcar como Leído
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}

export default function EscalatedPage() {
  const [interactions, setInteractions] = useState(mockEscalatedInteractions)

  const handleRespond = (id: string, response: string) => {
    // TODO: Send response via MercadoLibre API
    console.log('Sending response for interaction', id, ':', response)
    
    // Remove from escalated list
    setInteractions(prev => prev.filter(i => i.id !== id))
    
    // Show success message
    alert('Respuesta enviada correctamente')
  }

  const handleDismiss = (id: string) => {
    setInteractions(prev => prev.filter(i => i.id !== id))
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="h-8 w-8 text-red-500" />
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Escalaciones</h1>
            <p className="text-slate-600">Mensajes que requieren tu atención personal</p>
          </div>
        </div>
        
        {interactions.length === 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">
              🎉 ¡Excelente! No tienes escalaciones pendientes. El bot está manejando todo automáticamente.
            </p>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {interactions.map((interaction) => (
          <EscalatedInteraction
            key={interaction.id}
            interaction={interaction}
            onRespond={handleRespond}
            onDismiss={handleDismiss}
          />
        ))}
      </div>

      {interactions.length > 0 && (
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-amber-800">
            <strong>💡 Tips para respuestas efectivas:</strong>
          </p>
          <ul className="text-sm text-amber-700 mt-2 space-y-1 list-disc list-inside">
            <li>Mantén un tono empático y profesional</li>
            <li>Ofrece soluciones concretas cuando sea posible</li>
            <li>Evita incluir información de contacto externa (teléfono, email, redes)</li>
            <li>Para casos complejos, sugiere continuar por mensajería privada de ML</li>
          </ul>
        </div>
      )}
    </div>
  )
}