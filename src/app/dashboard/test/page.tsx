'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { Badge } from '@/components/ui/Badge'
import { TestTube, Send, RotateCcw, Clock, DollarSign, Zap, AlertTriangle } from 'lucide-react'

interface TestResult {
  tier: number
  response: string
  model: string
  tokensUsed: number
  costEstimate: number
  processingTime: number
  escalated: boolean
  category: string
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

const sampleQuestions = [
  '¿Tienen stock disponible?',
  '¿El precio incluye IVA?',
  'Mi pedido no llega, necesito seguimiento',
  'El producto llegó roto, quiero mi dinero de vuelta',
  '¿Hacen factura A?',
  '¿Cuánto demora el envío a Córdoba?'
]

export default function TestBotPage() {
  const [question, setQuestion] = useState('')
  const [itemId, setItemId] = useState('MLA999999999')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<TestResult | null>(null)
  const [history, setHistory] = useState<Array<{ question: string; result: TestResult; timestamp: Date }>>([])

  const handleTest = async () => {
    if (!question.trim()) return

    setIsLoading(true)
    try {
      const testResult = await testBotResponse(question, itemId)
      setResult(testResult)
      
      // Add to history
      setHistory(prev => [{
        question,
        result: testResult,
        timestamp: new Date()
      }, ...prev].slice(0, 10)) // Keep last 10
      
    } catch (error) {
      console.error('Test failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSampleQuestion = (sampleQuestion: string) => {
    setQuestion(sampleQuestion)
  }

  const getTierBadge = (tier: number) => {
    switch (tier) {
      case 2:
        return <Badge className="badge-tier-2">Tier 2 - Haiku</Badge>
      case 3:
        return <Badge className="badge-tier-3">Tier 3 - Sonnet</Badge>
      case 4:
        return <Badge className="badge-tier-4">Tier 4 - Manual</Badge>
      default:
        return <Badge variant="default">Desconocido</Badge>
    }
  }

  const formatCurrency = (usd: number) => {
    return `$${(usd * 1000).toFixed(4)} USD` // Show in more readable format
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <TestTube className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Test Bot</h1>
            <p className="text-slate-600">Prueba preguntas para ver cómo responde el bot antes de activarlo</p>
          </div>
        </div>

        {/* API Status */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            🤖 <strong>Bot conectado a Anthropic Claude API</strong> - Las respuestas son generadas por IA real
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Test Form */}
        <Card>
          <CardHeader>
            <CardTitle>Probar Pregunta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="question" className="block text-sm font-medium text-slate-700 mb-2">
                Pregunta del comprador:
              </label>
              <Textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={3}
                placeholder="Ejemplo: ¿Tienen stock en color azul?"
              />
            </div>

            <div>
              <label htmlFor="itemId" className="block text-sm font-medium text-slate-700 mb-2">
                ID del producto (opcional):
              </label>
              <input
                type="text"
                id="itemId"
                value={itemId}
                onChange={(e) => setItemId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                placeholder="MLA999999999"
              />
            </div>

            <Button 
              onClick={handleTest} 
              disabled={!question.trim() || isLoading}
              loading={isLoading}
              className="w-full"
            >
              <Send className="h-4 w-4 mr-2" />
              {isLoading ? 'Procesando...' : 'Probar Bot'}
            </Button>

            {/* Sample Questions */}
            <div className="pt-4 border-t">
              <p className="text-sm font-medium text-slate-700 mb-3">Preguntas de ejemplo:</p>
              <div className="grid gap-2">
                {sampleQuestions.map((sample, index) => (
                  <button
                    key={index}
                    onClick={() => handleSampleQuestion(sample)}
                    className="text-left text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded transition-colors"
                  >
                    "{sample}"
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Result */}
        {result && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Resultado</CardTitle>
                {getTierBadge(result.tier)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.escalated ? (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                    <span className="font-medium text-amber-800">Escalado a Manual</span>
                  </div>
                  <p className="text-sm text-amber-700">
                    Esta consulta requiere atención humana. Se ha generado un borrador sugerido:
                  </p>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <span className="text-sm font-medium text-green-800">✅ Respuesta Automática</span>
                </div>
              )}

              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm text-slate-800">{result.response}</p>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Zap className="h-4 w-4" />
                  <span>{result.tokensUsed} tokens</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <DollarSign className="h-4 w-4" />
                  <span>{formatCurrency(result.costEstimate)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock className="h-4 w-4" />
                  <span>{result.processingTime}ms</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <TestTube className="h-4 w-4" />
                  <span className="truncate">{result.model}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* History */}
      {history.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Historial de Pruebas</CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setHistory([])}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Limpiar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {history.map((item, index) => (
                <div key={index} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-slate-900">"{item.question}"</p>
                    {getTierBadge(item.result.tier)}
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{item.result.response}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>{item.timestamp.toLocaleTimeString()}</span>
                    <span>{item.result.tokensUsed} tokens</span>
                    <span>{formatCurrency(item.result.costEstimate)}</span>
                    <span>{item.result.model}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}