// Knowledge Base types and utilities

export type KBEntryType = 'faq' | 'product' | 'policy' | 'template' | 'instruction'

export interface KBEntry {
  id: string
  type: KBEntryType
  title: string
  // For FAQ: question field
  question?: string
  // For FAQ: ideal answer. For others: main content
  content: string
  // Tags for matching relevance
  tags: string[]
  // Priority 1-5 (1=always include, 5=only if relevant)
  priority: number
  // Active toggle
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface KBStore {
  entries: KBEntry[]
  version: number
}

// Type labels and descriptions
export const KB_TYPE_CONFIG: Record<KBEntryType, { label: string; emoji: string; description: string; color: string }> = {
  faq: {
    label: 'Ejemplo Q&A',
    emoji: '💬',
    description: 'Pregunta + respuesta ideal. El bot aprende a responder igual.',
    color: 'blue'
  },
  product: {
    label: 'Info Producto',
    emoji: '📦',
    description: 'Detalles específicos de un producto o categoría.',
    color: 'green'
  },
  policy: {
    label: 'Política',
    emoji: '📋',
    description: 'Reglas de envío, devoluciones, garantía, etc.',
    color: 'amber'
  },
  template: {
    label: 'Template',
    emoji: '📝',
    description: 'Respuesta predefinida para situaciones comunes.',
    color: 'purple'
  },
  instruction: {
    label: 'Instrucción',
    emoji: '⚙️',
    description: 'Regla o comportamiento específico del bot.',
    color: 'red'
  }
}

// Estimate tokens for a string (rough: 1 token ≈ 4 chars in Spanish)
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

// Build context string from knowledge base entries
// Optimized: only includes relevant entries based on tags and priority
export function buildKBContext(entries: KBEntry[], buyerText: string, maxTokens: number = 1500): { context: string; tokensUsed: number; entriesUsed: number } {
  const activeEntries = entries.filter(e => e.active)
  
  // Score each entry for relevance
  const scored = activeEntries.map(entry => {
    let score = 6 - entry.priority // Higher priority = higher score
    
    // Boost if buyer text matches tags
    const lowerBuyer = buyerText.toLowerCase()
    for (const tag of entry.tags) {
      if (lowerBuyer.includes(tag.toLowerCase())) {
        score += 3
      }
    }
    
    // Boost FAQ entries slightly (they're the best few-shot examples)
    if (entry.type === 'faq') score += 1
    
    // Boost instructions (always important)  
    if (entry.type === 'instruction') score += 2
    
    return { entry, score }
  })
  
  // Sort by score descending
  scored.sort((a, b) => b.score - a.score)
  
  // Build context respecting token budget
  const sections: string[] = []
  let totalTokens = 0
  let entriesUsed = 0
  
  // Group by type for cleaner context
  const instructions = scored.filter(s => s.entry.type === 'instruction')
  const faqs = scored.filter(s => s.entry.type === 'faq')
  const info = scored.filter(s => ['product', 'policy', 'template'].includes(s.entry.type))
  
  // Always include instructions first (they're rules)
  for (const { entry } of instructions) {
    const text = `REGLA: ${entry.content}`
    const tokens = estimateTokens(text)
    if (totalTokens + tokens > maxTokens) break
    sections.push(text)
    totalTokens += tokens
    entriesUsed++
  }
  
  // Then FAQ examples (few-shot learning)
  if (faqs.length > 0) {
    const faqTexts: string[] = []
    for (const { entry } of faqs) {
      const text = `P: ${entry.question || entry.title}\nR: ${entry.content}`
      const tokens = estimateTokens(text)
      if (totalTokens + tokens > maxTokens) break
      faqTexts.push(text)
      totalTokens += tokens
      entriesUsed++
    }
    if (faqTexts.length > 0) {
      sections.push(`EJEMPLOS DE RESPUESTA:\n${faqTexts.join('\n\n')}`)
    }
  }
  
  // Then info entries
  for (const { entry } of info) {
    const label = KB_TYPE_CONFIG[entry.type].label.toUpperCase()
    const text = `${label} - ${entry.title}: ${entry.content}`
    const tokens = estimateTokens(text)
    if (totalTokens + tokens > maxTokens) break
    sections.push(text)
    totalTokens += tokens
    entriesUsed++
  }
  
  return {
    context: sections.join('\n\n'),
    tokensUsed: totalTokens,
    entriesUsed
  }
}

// Default starter entries
export const DEFAULT_ENTRIES: KBEntry[] = [
  {
    id: '1',
    type: 'instruction',
    title: 'Tono de respuesta',
    content: 'Siempre responder de forma amigable y profesional. Usar "¡Hola!" al inicio y "Saludos, [nombre tienda]" al final.',
    tags: [],
    priority: 1,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    type: 'instruction',
    title: 'No inventar información',
    content: 'Si no tienes la información específica para responder, indica que vas a consultar y responder a la brevedad. NUNCA inventar datos.',
    tags: [],
    priority: 1,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    type: 'faq',
    title: 'Consulta de stock',
    question: '¿Tienen stock disponible?',
    content: '¡Hola! Sí, tenemos stock disponible. Podés realizar tu compra con total tranquilidad. Si necesitás algún color o talle específico, consultanos. Saludos, Vicus Store',
    tags: ['stock', 'disponible', 'hay', 'queda'],
    priority: 2,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    type: 'faq',
    title: 'Consulta de envío',
    question: '¿Cuánto tarda el envío?',
    content: '¡Hola! Los envíos se procesan en 24hs hábiles y el tiempo de entrega depende de tu zona (generalmente 2-5 días hábiles). Enviamos por Mercado Envíos con seguimiento. Saludos, Vicus Store',
    tags: ['envío', 'envio', 'demora', 'tarda', 'llega', 'días'],
    priority: 2,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '5',
    type: 'faq',
    title: 'Consulta de precio/IVA',
    question: '¿El precio incluye IVA?',
    content: '¡Hola! Sí, el precio publicado es el precio final con IVA incluido. Aceptamos todos los medios de pago de Mercado Pago. Saludos, Vicus Store',
    tags: ['precio', 'iva', 'impuesto', 'costo', 'vale'],
    priority: 2,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '6',
    type: 'policy',
    title: 'Política de devoluciones',
    content: 'Aceptamos devoluciones dentro de los 30 días de recibido el producto. Debe estar en las mismas condiciones y con embalaje original. La devolución se gestiona por Mercado Libre.',
    tags: ['devolución', 'devolucion', 'devolver', 'cambio', 'cambiar'],
    priority: 3,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '7',
    type: 'policy',
    title: 'Garantía',
    content: '6 meses de garantía por defectos de fabricación. No cubre daños por mal uso o desgaste natural. Para hacer uso de la garantía, contactar por mensaje de MercadoLibre.',
    tags: ['garantía', 'garantia', 'defecto', 'falla', 'roto'],
    priority: 3,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '8',
    type: 'template',
    title: 'Seguimiento de pedido',
    content: '¡Hola! Tu pedido ya fue despachado. Podés hacer el seguimiento desde la sección "Mis compras" en MercadoLibre donde encontrarás el código de seguimiento actualizado. Si tenés alguna duda adicional, estamos para ayudarte. Saludos, Vicus Store',
    tags: ['pedido', 'seguimiento', 'tracking', 'envío', 'dónde', 'donde', 'cuándo', 'cuando'],
    priority: 2,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]