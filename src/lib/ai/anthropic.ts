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

const MODEL_COSTS: Record<string, { input: number; output: number }> = {
  'claude-3-haiku-20240307': { input: 0.25, output: 1.25 },
  'claude-3-5-haiku-20241022': { input: 1.0, output: 5.0 },
  'claude-3-5-sonnet-20241022': { input: 3.0, output: 15.0 },
  'claude-3-sonnet-20240229': { input: 3.0, output: 15.0 },
}

function calculateCost(model: string, inputTokens: number, outputTokens: number): number {
  const costs = MODEL_COSTS[model]
  if (!costs) return 0
  return (inputTokens * costs.input + outputTokens * costs.output) / 1_000_000
}

// Try multiple model IDs in order of preference
const HAIKU_MODELS = [
  'claude-3-5-haiku-20241022',
  'claude-3-haiku-20240307',
]

const SONNET_MODELS = [
  'claude-3-5-sonnet-20241022',
  'claude-3-sonnet-20240229',
]

async function callModel(models: string[], systemPrompt: string, userMessage: string, maxTokens: number): Promise<AnthropicResponse> {
  let lastError: any = null
  
  for (const model of models) {
    try {
      const response = await anthropic.messages.create({
        model,
        max_tokens: maxTokens,
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

      return { response: text, tokensInput, tokensOutput, costUsd, model }
    } catch (error: any) {
      console.error(`Model ${model} failed:`, error?.message || error)
      lastError = error
      // Try next model
    }
  }
  
  throw lastError || new Error('All models failed')
}

export async function callHaiku(systemPrompt: string, userMessage: string): Promise<AnthropicResponse> {
  return callModel(HAIKU_MODELS, systemPrompt, userMessage, 500)
}

export async function callSonnet(systemPrompt: string, userMessage: string): Promise<AnthropicResponse> {
  return callModel(SONNET_MODELS, systemPrompt, userMessage, 1000)
}