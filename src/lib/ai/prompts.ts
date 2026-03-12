import type { SellerConfig, KnowledgeEntry } from '@/lib/types'

interface PromptParams {
  sellerConfig: SellerConfig
  promptType: 'presale' | 'postsale'
  knowledgeEntries?: KnowledgeEntry[]
  itemTitle?: string
  itemPrice?: number
  buyerText: string
}

// Safety rules that are ALWAYS appended (non-editable)
const SAFETY_RULES = `
---

REGLAS IMPORTANTES (obligatorias):
- Máximo 2000 caracteres en tu respuesta.
- NUNCA incluir información de contacto (teléfono, email, WhatsApp, Instagram, redes sociales).
- NUNCA mencionar otras plataformas de venta.
- NUNCA ofrecer pagos fuera de Mercado Pago.
- Si no tienes información suficiente para responder bien, responde EXACTAMENTE "[ESCALATE]" y nada más.
- Si la consulta es una queja, agresiva, o menciona acciones legales, responde EXACTAMENTE "[ESCALATE]".`

function replaceVariables(text: string, config: SellerConfig): string {
  return text
    .replace(/{store_name}/g, config.store_name)
    .replace(/{shipping_policy}/g, config.shipping_policy)
    .replace(/{return_policy}/g, config.return_policy)
    .replace(/{warranty_policy}/g, config.warranty_policy)
    .replace(/{invoice_info}/g, config.invoice_info)
}

export function buildPrompt(params: PromptParams): { system: string; user: string } {
  const { sellerConfig, promptType, knowledgeEntries = [], itemTitle, itemPrice, buyerText } = params

  // Select the appropriate base prompt
  const basePrompt = promptType === 'presale' 
    ? sellerConfig.presale_prompt
    : sellerConfig.postsale_prompt

  // Replace variables in the prompt
  let systemPrompt = replaceVariables(basePrompt, sellerConfig)

  // Add knowledge base if available
  if (knowledgeEntries.length > 0) {
    const knowledgeText = knowledgeEntries
      .map(entry => `${entry.title}: ${entry.content}`)
      .join('\n\n')
    
    systemPrompt += `\n\n---\n\nBASE DE CONOCIMIENTO:\n${knowledgeText}`
  }

  // Always append safety rules
  systemPrompt += SAFETY_RULES

  // Build user message with context
  let userMessage = `Consulta del comprador: "${buyerText}"`
  
  if (itemTitle) {
    userMessage += `\n\nProducto: ${itemTitle}`
    if (itemPrice) {
      userMessage += ` - $${itemPrice}`
    }
  }

  return {
    system: systemPrompt,
    user: userMessage
  }
}

// Mock seller config for testing (when no real DB is connected)
export const getMockSellerConfig = (): SellerConfig => ({
  id: 'mock-seller',
  user_id: 'mock-user',
  meli_user_id: 'MOCK123456',
  store_name: 'Vicus Store',
  tone: 'friendly',
  shipping_policy: 'Enviamos a todo el país via Mercado Envíos. Los envíos se procesan dentro de las 24hs hábiles.',
  return_policy: 'Aceptamos devoluciones dentro de los 30 días. El producto debe estar en las mismas condiciones.',
  warranty_policy: 'Garantía de 6 meses por defectos de fábrica. No cubre daños por mal uso.',
  invoice_info: 'Emitimos factura tipo B. Para factura A consultanos por mensaje privado.',
  is_enabled: false,
  presale_prompt: `Eres el asistente de ventas de "{store_name}". Responde consultas de compradores en MercadoLibre.

Tono: amigable y útil.
Saluda con "¡Hola!" y termina con "Saludos, {store_name}".
Solo responde basándote en la información del producto y base de conocimiento.

Políticas:
- Envíos: {shipping_policy}
- Devoluciones: {return_policy}
- Garantía: {warranty_policy}
- Facturación: {invoice_info}`,
  postsale_prompt: `Eres el asistente post-venta de "{store_name}". Atiendes consultas de compradores en MercadoLibre después de la compra.

Tono: empático y orientado a soluciones.
Saluda con "¡Hola!" y termina con "Saludos, {store_name}".
Para consultas de seguimiento, incluye el estado actual y fecha estimada.
Para problemas del producto, muestra empatía y ofrece soluciones según políticas.

Políticas:
- Envíos: {shipping_policy}
- Devoluciones: {return_policy}
- Garantía: {warranty_policy}
- Facturación: {invoice_info}`,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
})