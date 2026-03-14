'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Info, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react'

export default function InfoPage() {
  return (
    <div>
      <div className="mb-4 lg:mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Info className="h-6 w-6 text-blue-600" />
          <h1 className="text-xl lg:text-3xl font-bold text-slate-900">Estado del Proyecto</h1>
        </div>
        <p className="text-sm text-slate-600">Funcionalidades actuales y próximos pasos</p>
      </div>

      <div className="grid gap-3 lg:gap-6 lg:grid-cols-2">
        {/* Current Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Funcionalidades Activas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                ['Dashboard y navegación', '✅ Completo'],
                ['Test Bot (API real Claude)', '✅ API'],
                ['Gestión de escalaciones', '✅ Completo'],
                ['Configuración de tienda', '✅ Completo'],
                ['UI/UX completa', '✅ Completo'],
                ['Switch ON/OFF', '✅ Funcional'],
              ].map(([label, status], i) => (
                <div key={i} className="flex items-center justify-between py-1">
                  <span className="text-sm text-slate-700">{label}</span>
                  <span className="badge badge-success text-xs">{status}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              Pendiente de Implementar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                'Anthropic API (IA real)',
                'MercadoLibre API',
                'Base de datos Supabase',
                'Autenticación',
                'Base de conocimiento',
                'Analytics avanzadas',
              ].map((label, i) => (
                <div key={i} className="flex items-center justify-between py-1">
                  <span className="text-sm text-slate-700">{label}</span>
                  <span className="badge badge-warning text-xs">🔄 Pendiente</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Test Bot Info */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>🧪 Test Bot</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-blue-800 mb-2">
                <strong>El Test Bot está funcional</strong> con lógica simulada inteligente:
              </p>
              <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                <li>Preguntas simples → Haiku</li>
                <li>Consultas complejas → Sonnet</li>
                <li>Palabras de reclamo → Escalación</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="font-medium text-green-800 text-sm">Simples</p>
                <p className="text-green-600 text-xs mt-1">"¿Tienen stock?"</p>
                <span className="badge badge-tier-2 mt-2 text-xs">→ Haiku</span>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="font-medium text-amber-800 text-sm">Complejas</p>
                <p className="text-amber-600 text-xs mt-1">"Seguimiento de pedido"</p>
                <span className="badge badge-tier-3 mt-2 text-xs">→ Sonnet</span>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="font-medium text-red-800 text-sm">Escalaciones</p>
                <p className="text-red-600 text-xs mt-1">"Reclamo", "Legal"</p>
                <span className="badge badge-tier-4 mt-2 text-xs">→ Manual</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>🚀 Próximos Pasos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="border-l-4 border-l-blue-500 pl-3">
                <h4 className="font-medium text-slate-900 text-sm">Fase 1: APIs Core</h4>
                <p className="text-xs text-slate-600">Integrar Anthropic Claude y MercadoLibre API</p>
              </div>
              <div className="border-l-4 border-l-green-500 pl-3">
                <h4 className="font-medium text-slate-900 text-sm">Fase 2: Base de Datos</h4>
                <p className="text-xs text-slate-600">Conectar Supabase para persistencia y auth</p>
              </div>
              <div className="border-l-4 border-l-purple-500 pl-3">
                <h4 className="font-medium text-slate-900 text-sm">Fase 3: Avanzado</h4>
                <p className="text-xs text-slate-600">Knowledge base, analytics, webhooks</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Links */}
      <Card className="mt-3">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href="https://github.com/henaihh/sales-chatbot"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <ExternalLink className="h-4 w-4 text-slate-500 flex-shrink-0" />
              <div className="min-w-0">
                <p className="font-medium text-slate-900 text-sm">Código Fuente</p>
                <p className="text-xs text-slate-500 truncate">github.com/henaihh/sales-chatbot</p>
              </div>
            </a>
            <a
              href="/dashboard/test"
              className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <ExternalLink className="h-4 w-4 text-slate-500 flex-shrink-0" />
              <div className="min-w-0">
                <p className="font-medium text-slate-900 text-sm">Probar Test Bot</p>
                <p className="text-xs text-slate-500 truncate">Experimenta con preguntas simuladas</p>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}