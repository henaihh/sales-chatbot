import { callHaiku, callSonnet, type AnthropicResponse } from './anthropic'
import { buildPrompt, getMockSellerConfig } from './prompts'
import type { RouterInput, RouterResult, SellerConfig, KnowledgeEntry } from '@/lib/types'

// Keywords that trigger immediate escalation
const ESCALATION_KEYWORDS = [
  'reclamo', 'queja', 'denuncia', 'defensa', 'consumidor', 'legal',
  'abogado', 'demanda', 'tribunal', 'problema', 'mal', 'roto',
  'estafa', 'fraude', 'engaño', 'mentira', 'cancelar', 'devolver dinero'
]

function shouldEscalate(text: string): boolean {
  const lowerText = text.toLowerCase()
  return ESCALATION_KEYWORDS.some(keyword => lowerText.includes(keyword))
}

function determineCategory(text: string): string {
  const lowerText = text.toLowerCase()
  
  if (lowerText.includes('stock') || lowerText.includes('disponible')) return 'stock_inquiry'
  if (lowerText.includes('precio') || lowerText.includes('costo')) return 'price_inquiry'
  if (lowerText.includes('envio') || lowerText.includes('envío')) return 'shipping_inquiry'
  if (lowerText.includes('pedido') || lowerText.includes('seguimiento')) return 'order_tracking'
  if (lowerText.includes('factura') || lowerText.includes('facturación')) return 'invoice_inquiry'
  if (lowerText.includes('garantía') || lowerText.includes('garantia')) return 'warranty_inquiry'
  if (lowerText.includes('devolucion') || lowerText.includes('devolución')) return 'return_inquiry'
  if (shouldEscalate(text)) return 'complaint'
  
  return 'general_inquiry'
}

export async function routeInteraction(input: RouterInput): Promise<RouterResult> {
  const startTime = Date.now()
  
  try {
    // Check for immediate escalation
    if (shouldEscalate(input.buyerText)) {
      return {
        tier: 4,
        response: null,
        draft: `Hola! Entiendo tu preocupación y quiero ayudarte a resolver este tema. Déjame revisar tu consulta personalmente para darte la mejor solución posible. Te voy a contactar a la brevedad para resolver esto juntos.`,
        category: 'complaint',
        model: 'escalation',
        tokensInput: 0,
        tokensOutput: 0,
        costUsd: 0
      }
    }

    // For now, use mock seller config (TODO: load from DB)
    const sellerConfig = getMockSellerConfig()
    
    // Mock knowledge entries (TODO: load from DB)
    const knowledgeEntries: KnowledgeEntry[] = []

    // Determine if it's a complex query (for now, simple heuristics)
    const complexKeywords = ['seguimiento', 'pedido', 'orden', 'envio', 'factura', 'devolucion', 'garantía']
    const isComplex = complexKeywords.some(keyword => 
      input.buyerText.toLowerCase().includes(keyword)
    )

    const category = determineCategory(input.buyerText)
    const promptType = input.type === 'message' ? 'postsale' : 'presale'

    // Build prompt
    const { system, user } = buildPrompt({
      sellerConfig,
      promptType,
      knowledgeEntries,
      itemTitle: `Producto ${input.itemId}`, // TODO: get real item data
      buyerText: input.buyerText
    })

    let result: AnthropicResponse

    if (!isComplex && input.type === 'question') {
      // Try Haiku first for simple pre-sale questions
      try {
        result = await callHaiku(system, user)
        
        // Check if Haiku escalated
        if (result.response.trim() === '[ESCALATE]') {
          // Try Sonnet
          result = await callSonnet(system, user)
          
          if (result.response.trim() === '[ESCALATE]') {
            // Final escalation to human
            return {
              tier: 4,
              response: null,
              draft: `Hola! Tu consulta requiere atención personalizada. Déjame revisar los detalles y te respondo con información específica. Gracias por tu paciencia.`,
              category,
              model: 'escalation',
              tokensInput: result.tokensInput,
              tokensOutput: result.tokensOutput,
              costUsd: result.costUsd
            }
          }

          return {
            tier: 3,
            response: result.response,
            draft: null,
            category,
            model: result.model,
            tokensInput: result.tokensInput,
            tokensOutput: result.tokensOutput,
            costUsd: result.costUsd
          }
        }

        return {
          tier: 2,
          response: result.response,
          draft: null,
          category,
          model: result.model,
          tokensInput: result.tokensInput,
          tokensOutput: result.tokensOutput,
          costUsd: result.costUsd
        }
      } catch (error) {
        console.error('Haiku failed, trying Sonnet:', error)
        // Fallback to Sonnet
      }
    }

    // Use Sonnet for complex queries or if Haiku failed
    result = await callSonnet(system, user)
    
    if (result.response.trim() === '[ESCALATE]') {
      return {
        tier: 4,
        response: null,
        draft: `Hola! Tu consulta requiere atención personalizada. Déjame revisar los detalles específicos de tu caso y te respondo con la información correcta. Te contacto a la brevedad.`,
        category,
        model: 'escalation',
        tokensInput: result.tokensInput,
        tokensOutput: result.tokensOutput,
        costUsd: result.costUsd
      }
    }

    return {
      tier: 3,
      response: result.response,
      draft: null,
      category,
      model: result.model,
      tokensInput: result.tokensInput,
      tokensOutput: result.tokensOutput,
      costUsd: result.costUsd
    }

  } catch (error) {
    console.error('Router error:', error)
    
    return {
      tier: 4,
      response: null,
      draft: `Hola! Disculpa, estoy teniendo dificultades técnicas en este momento. Te voy a responder personalmente en unos minutos. ¡Gracias por tu paciencia!`,
      category: 'error',
      model: 'error',
      tokensInput: 0,
      tokensOutput: 0,
      costUsd: 0
    }
  }
}