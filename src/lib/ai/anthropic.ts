import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export interface AnthropicResponse {
  response: string
  tokensInput: number
  tokensOutput: number
  costUsd: number
  model: string
}

// Cost calculation (per 1M tokens)
const MODEL_COSTS = {
  'claude-3-5-haiku-20241022': { input: 1.0, output: 5.0 },
  'claude-3-5-sonnet-20241022': { input: 3.0, output: 15.0 },
} as const

function calculateCost(model: string, inputTokens: number, outputTokens: number): number {
  const costs = MODEL_COSTS[model as keyof typeof MODEL_COSTS]
  if (!costs) return 0
  return (inputTokens * costs.input + outputTokens * costs.output) / 1_000_000
}

export async function callHaiku(systemPrompt: string, userMessage: string): Promise<AnthropicResponse> {
  const model = 'claude-3-5-haiku-20241022'
  
  try {
    const response = await anthropic.messages.create({
      model,
      max_tokens: 500,
      system: systemPrompt,
      messages: [{
        role: "user",
        content: userMessage
      }]
    })

    const content = response.content[0]
    const text = content.type === 'text' ? content.text : ''
    const tokensInput = response.usage.input_tokens
    const tokensOutput = response.usage.output_tokens
    const costUsd = calculateCost(model, tokensInput, tokensOutput)

    return {
      response: text,
      tokensInput,
      tokensOutput, 
      costUsd,
      model
    }
  } catch (error) {
    console.error('Anthropic Haiku error:', error)
    throw error
  }
}

export async function callSonnet(systemPrompt: string, userMessage: string): Promise<AnthropicResponse> {
  const model = 'claude-3-5-sonnet-20241022'
  
  try {
    const response = await anthropic.messages.create({
      model,
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{
        role: "user", 
        content: userMessage
      }]
    })

    const content = response.content[0]
    const text = content.type === 'text' ? content.text : ''
    const tokensInput = response.usage.input_tokens
    const tokensOutput = response.usage.output_tokens
    const costUsd = calculateCost(model, tokensInput, tokensOutput)

    return {
      response: text,
      tokensInput,
      tokensOutput,
      costUsd,
      model
    }
  } catch (error) {
    console.error('Anthropic Sonnet error:', error)
    throw error
  }
}