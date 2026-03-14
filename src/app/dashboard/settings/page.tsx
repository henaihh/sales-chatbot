'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Settings, Save, RotateCcw } from 'lucide-react'

const mockSellerConfig = {
  store_name: 'Vicus Store',
  tone: 'friendly',
  shipping_policy: 'Enviamos a todo el país via Mercado Envíos. Los envíos se procesan dentro de las 24hs hábiles.',
  return_policy: 'Aceptamos devoluciones dentro de los 30 días. El producto debe estar en las mismas condiciones.',
  warranty_policy: 'Garantía de 6 meses por defectos de fábrica. No cubre daños por mal uso.',
  invoice_info: 'Emitimos factura tipo B. Para factura A consultanos por mensaje privado.',
}

export default function SettingsPage() {
  const [config, setConfig] = useState(mockSellerConfig)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
    setIsSaving(false)
  }

  const handleReset = () => setConfig(mockSellerConfig)

  const handleChange = (field: keyof typeof config, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div>
      <div className="mb-4 lg:mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Settings className="h-6 w-6 text-indigo-600" />
          <h1 className="text-xl lg:text-3xl font-bold text-slate-900">Configuración</h1>
        </div>
        <p className="text-sm text-slate-600">Información básica de tu tienda y políticas</p>
      </div>

      <div className="space-y-3 lg:space-y-6 max-w-3xl">
        {/* Store Info */}
        <Card>
          <CardHeader>
            <CardTitle>Información de la Tienda</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label htmlFor="store_name" className="block text-sm font-medium text-slate-700 mb-1">
                Nombre de la tienda
              </label>
              <input
                id="store_name"
                value={config.store_name}
                onChange={(e) => handleChange('store_name', e.target.value)}
                placeholder="Mi Tienda ML"
                className="input"
              />
              <p className="text-xs text-slate-500 mt-1">Aparecerá en las respuestas del bot</p>
            </div>

            <div>
              <label htmlFor="tone" className="block text-sm font-medium text-slate-700 mb-1">
                Tono de comunicación
              </label>
              <select
                id="tone"
                className="input"
                value={config.tone}
                onChange={(e) => handleChange('tone', e.target.value)}
              >
                <option value="friendly">Amigable</option>
                <option value="professional">Profesional</option>
                <option value="casual">Casual</option>
                <option value="formal">Formal</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Policies */}
        <Card>
          <CardHeader>
            <CardTitle>Políticas de la Tienda</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { id: 'shipping_policy', label: 'Política de envíos', rows: 2 },
              { id: 'return_policy', label: 'Política de devoluciones', rows: 2 },
              { id: 'warranty_policy', label: 'Política de garantía', rows: 2 },
              { id: 'invoice_info', label: 'Información de facturación', rows: 2 },
            ].map(({ id, label, rows }) => (
              <div key={id}>
                <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
                  {label}
                </label>
                <textarea
                  id={id}
                  value={config[id as keyof typeof config]}
                  onChange={(e) => handleChange(id as keyof typeof config, e.target.value)}
                  rows={rows}
                  className="textarea text-sm"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Variables */}
        <Card>
          <CardHeader>
            <CardTitle>Variables Disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1.5 text-xs">
              {[
                ['{store_name}', config.store_name],
                ['{shipping_policy}', 'Política de envíos'],
                ['{return_policy}', 'Política de devoluciones'],
                ['{warranty_policy}', 'Política de garantía'],
                ['{invoice_info}', 'Info de facturación'],
              ].map(([variable, desc], i) => (
                <div key={i} className="flex items-center gap-2">
                  <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs flex-shrink-0">{variable}</code>
                  <span className="text-slate-500 truncate">→ {desc}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={handleSave} disabled={isSaving} className={`btn btn-primary flex-1 ${isSaving ? 'loading' : ''}`}>
            <Save className="h-4 w-4" />
            {saved ? 'Guardado ✓' : isSaving ? 'Guardando...' : 'Guardar'}
          </button>
          <button onClick={handleReset} className="btn btn-outline">
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>

        {saved && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-800">
              ✅ Configuración guardada. Los cambios se aplicarán en las próximas respuestas.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}