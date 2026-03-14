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
        return <Badge className="badge-default">Desconocido</Badge>
    }
  }

  const formatCurrency = (usd: number) => {
    return `$${(usd * 1000).toFixed(4)} USD`
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <TestTube className="h-5 w-5 text-blue-600" />
          <h1 className="text-xl lg:text-3xl font-bold text-slate-900">Test Bot</h1>
        </div>
        <p className="text-sm text-slate-600 mb-3">Prueba preguntas antes de activar el bot</p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-800">
            🤖 <strong>Conectado a Anthropic Claude API</strong> — Respuestas reales de IA
          </p>
        </div>
      </div>

      {/* Test Form */}
      <div className="card mb-4">
        <div className="p-4 lg:p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Probar Pregunta</h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="question" className="block text-sm font-medium text-slate-700 mb-2">
              Pregunta del comprador:
            </label>
            <textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={3}
              className="textarea"
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
              className="input"
              placeholder="MLA999999999"
            />
          </div>

          <button 
            onClick={handleTest} 
            disabled={!question.trim() || isLoading}
            className={`btn btn-primary btn-full ${isLoading ? 'loading' : ''}`}
          >
            <Send className="h-4 w-4" />
            {isLoading ? 'Procesando...' : 'Probar Bot'}
          </button>
        </div>

        {/* Sample Questions */}
        <div className="pt-4 border-t border-slate-200 mt-4">
          <p className="text-sm font-medium text-slate-700 mb-2">Preguntas de ejemplo:</p>
          <div className="space-y-2">
            {sampleQuestions.map((sample, index) => (
              <button
                key={index}
                onClick={() => handleSampleQuestion(sample)}
                className="w-full text-left text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2.5 rounded-lg transition-colors border border-blue-100"
              >
                "{sample}"
              </button>
            ))}
          </div>
        </div>
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className="card mb-4">
          <div className="p-4 lg:p-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Resultado</h3>
            {getTierBadge(result.tier)}
          </div>
          
          <div className="space-y-3">
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
              <p className="text-sm text-slate-800 leading-relaxed">{result.response}</p>
            </div>

            {/* Metrics */}
            <div className="pt-3 border-t border-slate-200">
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Zap className="h-3.5 w-3.5" />
                  <span>{result.tokensUsed} tokens</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <DollarSign className="h-3.5 w-3.5" />
                  <span>{formatCurrency(result.costEstimate)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{result.processingTime}ms</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <TestTube className="h-3.5 w-3.5" />
                  <span className="truncate">{result.model}</span>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="card">
          <div className="p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-900">Historial</h3>
            <button 
              onClick={() => setHistory([])}
              className="text-xs text-slate-500 hover:text-slate-700"
            >
              <RotateCcw className="h-3.5 w-3.5 inline mr-1" />
              Limpiar
            </button>
          </div>
          
          <div className="space-y-3">
            {history.map((item, index) => (
              <div key={index} className="border border-slate-200 rounded-lg p-3">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-sm font-medium text-slate-900">"{item.question}"</p>
                  {getTierBadge(item.result.tier)}
                </div>
                <p className="text-xs text-slate-600 mb-2 leading-relaxed">{item.result.response}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <span>{item.timestamp.toLocaleTimeString()}</span>
                  <span>{item.result.tokensUsed} tok</span>
                  <span>{item.result.processingTime}ms</span>
                </div>
              </div>
            ))}
          </div>
          </div>
        </div>
      )}
    </div>
  )
}