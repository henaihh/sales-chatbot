'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Settings, Save, RotateCcw } from 'lucide-react'

// Mock data - in production this comes from Supabase
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
    
    try {
      // TODO: Save to Supabase
      // await updateSellerConfig(config)
      
      // Simulate save
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
      
    } catch (error) {
      console.error('Error saving config:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    setConfig(mockSellerConfig)
  }

  const handleChange = (field: keyof typeof config, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Settings className="h-8 w-8 text-indigo-600" />
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Configuración General</h1>
            <p className="text-slate-600">Configura la información básica de tu tienda y políticas</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* Store Information */}
        <Card>
          <CardHeader>
            <CardTitle>Información de la Tienda</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="store_name" className="block text-sm font-medium text-slate-700 mb-2">
                Nombre de la tienda
              </label>
              <Input
                id="store_name"
                value={config.store_name}
                onChange={(e) => handleChange('store_name', e.target.value)}
                placeholder="Mi Tienda ML"
              />
              <p className="text-xs text-slate-500 mt-1">
                Este nombre aparecerá en las respuestas del bot
              </p>
            </div>

            <div>
              <label htmlFor="tone" className="block text-sm font-medium text-slate-700 mb-2">
                Tono de comunicación
              </label>
              <select
                id="tone"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={config.tone}
                onChange={(e) => handleChange('tone', e.target.value)}
              >
                <option value="friendly">Amigable</option>
                <option value="professional">Profesional</option>
                <option value="casual">Casual</option>
                <option value="formal">Formal</option>
              </select>
              <p className="text-xs text-slate-500 mt-1">
                Define el estilo de comunicación del bot
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Policies */}
        <Card>
          <CardHeader>
            <CardTitle>Políticas de la Tienda</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="shipping_policy" className="block text-sm font-medium text-slate-700 mb-2">
                Política de envíos
              </label>
              <Textarea
                id="shipping_policy"
                value={config.shipping_policy}
                onChange={(e) => handleChange('shipping_policy', e.target.value)}
                rows={3}
                placeholder="Información sobre envíos, tiempos de procesamiento, etc."
              />
            </div>

            <div>
              <label htmlFor="return_policy" className="block text-sm font-medium text-slate-700 mb-2">
                Política de devoluciones
              </label>
              <Textarea
                id="return_policy"
                value={config.return_policy}
                onChange={(e) => handleChange('return_policy', e.target.value)}
                rows={3}
                placeholder="Condiciones para devoluciones, plazos, etc."
              />
            </div>

            <div>
              <label htmlFor="warranty_policy" className="block text-sm font-medium text-slate-700 mb-2">
                Política de garantía
              </label>
              <Textarea
                id="warranty_policy"
                value={config.warranty_policy}
                onChange={(e) => handleChange('warranty_policy', e.target.value)}
                rows={3}
                placeholder="Información sobre garantías, qué cubren, plazos, etc."
              />
            </div>

            <div>
              <label htmlFor="invoice_info" className="block text-sm font-medium text-slate-700 mb-2">
                Información de facturación
              </label>
              <Textarea
                id="invoice_info"
                value={config.invoice_info}
                onChange={(e) => handleChange('invoice_info', e.target.value)}
                rows={2}
                placeholder="Tipos de factura que emites, condiciones especiales, etc."
              />
            </div>
          </CardContent>
        </Card>

        {/* Variables Help */}
        <Card>
          <CardHeader>
            <CardTitle>Variables Disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-slate-700 mb-2">En los prompts puedes usar:</p>
                <div className="space-y-1 font-mono text-xs">
                  <p><span className="bg-slate-100 px-1 rounded">{'{store_name}'}</span> → {config.store_name}</p>
                  <p><span className="bg-slate-100 px-1 rounded">{'{shipping_policy}'}</span> → Política de envíos</p>
                  <p><span className="bg-slate-100 px-1 rounded">{'{return_policy}'}</span> → Política de devoluciones</p>
                </div>
              </div>
              <div className="space-y-1 font-mono text-xs">
                <p><span className="bg-slate-100 px-1 rounded">{'{warranty_policy}'}</span> → Política de garantía</p>
                <p><span className="bg-slate-100 px-1 rounded">{'{invoice_info}'}</span> → Info de facturación</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button onClick={handleSave} loading={isSaving} className="flex-1">
            <Save className="h-4 w-4 mr-2" />
            {saved ? 'Guardado ✓' : 'Guardar Cambios'}
          </Button>
          
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Resetear
          </Button>
        </div>

        {saved && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">
              ✅ Configuración guardada correctamente. Los cambios se aplicarán en las próximas respuestas del bot.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}