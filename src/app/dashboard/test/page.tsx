'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { TestTube, Send, Clock, DollarSign, Bot } from 'lucide-react'

interface TestResult {
  tier: number
  response: string
  model: string
  tokensUsed: number
  costEstimate: number
  processingTime: number
  escalated: boolean
  category?: string
}

// Real API call to test bot with Anthropic Claude
async function testBotResponse(question: string, itemId?: string): Promise<TestResult> {
  try {
    const response = await fetch('/api/test-bot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question,
        itemId,
        type: 'question'
      })
    })

    if (!response.ok) {
      throw new Error('API request failed')
    }

    const data = await response.json()
    
    return {
      tier: data.tier,
      response: data.response || data.draft || 'Sin respuesta disponible',
      model: data.model,
      tokensUsed: data.tokensUsed || 0,
      costEstimate: data.costEstimate || 0,
      processingTime: data.processingTime || 0,
      escalated: data.escalated || false,
      category: data.category
    }
  } catch (error) {
    console.error('Error testing bot:', error)
    
    // Fallback to simulated response if API fails
    return {
      tier: 4,
      response: 'Error: No se pudo conectar con la API de IA. Verifica la configuración de Anthropic.',
      model: 'error',
      tokensUsed: 0,
      costEstimate: 0,
      processingTime: 0,
      escalated: true,
      category: 'api_error'
    }
  }
}

export default function TestBotPage() {
  const [question, setQuestion] = useState('')
  const [itemId, setItemId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<TestResult | null>(null)
  const [testHistory, setTestHistory] = useState<Array<{ question: string; result: TestResult; timestamp: Date }>>([])

  const handleTest = async () => {
    if (!question.trim()) return

    setIsLoading(true)
    try {
      const testResult = await testBotResponse(question, itemId || undefined)
      setResult(testResult)
      
      // Add to history
      setTestHistory(prev => [{
        question,
        result: testResult,
        timestamp: new Date()
      }, ...prev.slice(0, 4)]) // Keep only last 5 tests
      
    } catch (error) {
      console.error('Error testing bot:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getTierBadgeClass = (tier: number) => {
    switch (tier) {
      case 2: return 'badge-tier-2'
      case 3: return 'badge-tier-3'
      case 4: return 'badge-tier-4'
      default: return 'badge'
    }
  }

  const getTierLabel = (tier: number) => {
    switch (tier) {
      case 2: return 'Haiku (Rápido)'
      case 3: return 'Sonnet (Complejo)'
      case 4: return 'Escalación Manual'
      default: return 'Desconocido'
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <TestTube className="h-8 w-8 text-indigo-600" />
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Test Bot</h1>
            <p className="text-slate-600">Prueba cómo respondería el bot a diferentes preguntas</p>
          </div>
        </div>
        
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-amber-800">
            💡 <strong>Tip:</strong> Usa esta herramienta para ajustar tus prompts y base de conocimiento antes de activar el bot en producción.
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Test Input */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Probar Pregunta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="question" className="block text-sm font-medium text-slate-700 mb-2">
                Pregunta del comprador
              </label>
              <Textarea
                id="question"
                placeholder="Ej: ¿Tienen stock en talle L? ¿Cuándo llega mi pedido?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={4}
              />
            </div>
            
            <div>
              <label htmlFor="itemId" className="block text-sm font-medium text-slate-700 mb-2">
                ID del producto (opcional)
              </label>
              <Input
                id="itemId"
                placeholder="Ej: MLA123456789"
                value={itemId}
                onChange={(e) => setItemId(e.target.value)}
              />
              <p className="text-xs text-slate-500 mt-1">
                Para simular preguntas sobre productos específicos
              </p>
            </div>

            <Button 
              onClick={handleTest}
              disabled={!question.trim() || isLoading}
              loading={isLoading}
              className="w-full"
            >
              {isLoading ? 'Procesando...' : 'Probar Respuesta'}
            </Button>
          </CardContent>
        </Card>

        {/* Test Result */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Resultado del Test
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!result ? (
              <div className="text-center text-slate-500 py-12">
                <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Escribe una pregunta y presiona "Probar Respuesta" para ver cómo respondería el bot</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Tier and Status */}
                <div className="flex items-center justify-between">
                  <span className={`badge ${getTierBadgeClass(result.tier)}`}>
                    {getTierLabel(result.tier)}
                  </span>
                  {result.escalated && (
                    <Badge variant="destructive">Escalado</Badge>
                  )}
                </div>

                {/* Response */}
                {result.escalated ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-800">
                      <strong>⚠️ Esta pregunta sería escalada</strong>
                    </p>
                    <p className="text-sm text-red-600 mt-2">
                      El bot detectó palabras clave que requieren atención humana (reclamo, problema, legal, etc.)
                    </p>
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <p className="text-sm text-slate-700 font-medium mb-2">Respuesta del bot:</p>
                    <p className="text-sm text-slate-900">{result.response}</p>
                  </div>
                )}

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">Tiempo</p>
                      <p className="text-sm font-medium">{result.processingTime}ms</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">Costo</p>
                      <p className="text-sm font-medium">${result.costEstimate.toFixed(5)}</p>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <p className="text-xs text-slate-500">Modelo: <span className="font-mono">{result.model}</span></p>
                    <p className="text-xs text-slate-500">Tokens: {result.tokensUsed}</p>
                    {result.category && (
                      <p className="text-xs text-slate-500">Categoría: {result.category}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Test History */}
      {testHistory.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Historial de Pruebas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {testHistory.map((test, index) => (
                <div key={index} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm text-slate-900 font-medium">{test.question}</p>
                    <span className={`badge ${getTierBadgeClass(test.result.tier)} ml-2`}>
                      Tier {test.result.tier}
                    </span>
                  </div>
                  {!test.result.escalated && (
                    <p className="text-xs text-slate-600">{test.result.response}</p>
                  )}
                  <p className="text-xs text-slate-400 mt-2">
                    {test.timestamp.toLocaleTimeString('es-AR')} • 
                    ${test.result.costEstimate.toFixed(5)} • 
                    {test.result.processingTime}ms
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}