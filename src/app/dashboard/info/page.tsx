'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Info, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react'

export default function InfoPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Info className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Estado del Proyecto</h1>
            <p className="text-slate-600">Información sobre funcionalidades actuales y próximos pasos</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Current Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Funcionalidades Activas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Dashboard y navegación</span>
              <Badge variant="success">✅ Completo</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Test Bot (API real Claude)</span>
              <Badge variant="success">✅ Anthropic API</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Gestión de escalaciones</span>
              <Badge variant="success">✅ Completo</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Configuración de tienda</span>
              <Badge variant="success">✅ Completo</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">UI/UX completa</span>
              <Badge variant="success">✅ Completo</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Switch ON/OFF</span>
              <Badge variant="success">✅ Funcional</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Pending Implementation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Pendiente de Implementar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Anthropic API (IA real)</span>
              <Badge variant="warning">🔄 Pendiente</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">MercadoLibre API</span>
              <Badge variant="warning">🔄 Pendiente</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Base de datos Supabase</span>
              <Badge variant="warning">🔄 Pendiente</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Autenticación</span>
              <Badge variant="warning">🔄 Pendiente</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Base de conocimiento</span>
              <Badge variant="warning">🔄 Pendiente</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Analytics avanzadas</span>
              <Badge variant="warning">🔄 Pendiente</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Test Bot Info */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>🧪 Test Bot - Funcionalidad Disponible</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800 mb-2">
                <strong>El Test Bot está completamente funcional</strong> con lógica simulada inteligente:
              </p>
              <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                <li>Detecta preguntas simples → Simula respuesta de Haiku</li>
                <li>Identifica consultas complejas → Simula respuesta de Sonnet</li>
                <li>Reconoce palabras de reclamo → Activa escalación automática</li>
                <li>Calcula costos y métricas estimados</li>
                <li>Mantiene historial de pruebas</li>
              </ul>
            </div>

            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="font-medium text-green-800">Preguntas Simples</p>
                <p className="text-green-600 text-xs mt-1">"¿Tienen stock?", "¿Precio incluye IVA?"</p>
                <Badge className="mt-2 badge-tier-2">→ Tier 2 (Haiku)</Badge>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="font-medium text-amber-800">Consultas Complejas</p>
                <p className="text-amber-600 text-xs mt-1">"Seguimiento de pedido", "Facturación"</p>
                <Badge className="mt-2 badge-tier-3">→ Tier 3 (Sonnet)</Badge>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="font-medium text-red-800">Escalaciones</p>
                <p className="text-red-600 text-xs mt-1">"Reclamo", "Denuncia", "Legal"</p>
                <Badge className="mt-2 badge-tier-4">→ Tier 4 (Manual)</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>🚀 Próximos Pasos de Desarrollo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-l-blue-500 pl-4">
                <h4 className="font-medium text-slate-900">Fase 1: APIs Core</h4>
                <p className="text-sm text-slate-600">Integrar Anthropic Claude y MercadoLibre API para funcionalidad real</p>
              </div>
              
              <div className="border-l-4 border-l-green-500 pl-4">
                <h4 className="font-medium text-slate-900">Fase 2: Base de Datos</h4>
                <p className="text-sm text-slate-600">Conectar Supabase para persistencia de datos y autenticación</p>
              </div>
              
              <div className="border-l-4 border-l-purple-500 pl-4">
                <h4 className="font-medium text-slate-900">Fase 3: Funcionalidades Avanzadas</h4>
                <p className="text-sm text-slate-600">Base de conocimiento, analytics, webhooks y automatización completa</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Links */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>🔗 Enlaces Útiles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <a
              href="https://github.com/henaihh/meli-autoresponder"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <ExternalLink className="h-4 w-4 text-slate-500" />
              <div>
                <p className="font-medium text-slate-900">Código Fuente</p>
                <p className="text-xs text-slate-500">github.com/henaihh/meli-autoresponder</p>
              </div>
            </a>
            
            <a
              href="/dashboard/test"
              className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <ExternalLink className="h-4 w-4 text-slate-500" />
              <div>
                <p className="font-medium text-slate-900">Probar Test Bot</p>
                <p className="text-xs text-slate-500">Experimenta con preguntas simuladas</p>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}