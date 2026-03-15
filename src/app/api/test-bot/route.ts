import { NextRequest, NextResponse } from 'next/server'
import { routeInteraction } from '@/lib/ai/router'
import type { RouterInput } from '@/lib/types'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { question, itemId, type } = body

    if (!question) {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      )
    }

    // Check if API key is configured
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({
        tier: 4,
        response: 'Error: ANTHROPIC_API_KEY no está configurada en las variables de entorno.',
        model: 'config_error',
        tokensUsed: 0, tokensInput: 0, tokensOutput: 0,
        costEstimate: 0, processingTime: 0,
        escalated: true, category: 'config_error',
        error: 'Missing ANTHROPIC_API_KEY'
      })
    }

    const input: RouterInput = {
      type: type || 'question',
      buyerText: question,
      itemId: itemId || 'MLA999999999',
      sellerId: 'mock-seller',
      buyerUserId: 'test-buyer'
    }

    const startTime = Date.now()
    const result = await routeInteraction(input)
    const processingTime = Date.now() - startTime

    return NextResponse.json({
      tier: result.tier,
      response: result.response || result.draft || '',
      model: result.model,
      tokensUsed: result.tokensInput + result.tokensOutput,
      tokensInput: result.tokensInput,
      tokensOutput: result.tokensOutput,
      costEstimate: result.costUsd,
      processingTime,
      escalated: result.tier === 4,
      category: result.category,
      draft: result.draft
    })

  } catch (error: any) {
    console.error('Test Bot API error:', error?.message || error)
    
    return NextResponse.json({
      tier: 4,
      response: `Error: ${error?.message || 'Unknown error'}`,
      model: 'error',
      tokensUsed: 0, tokensInput: 0, tokensOutput: 0,
      costEstimate: 0, processingTime: 0,
      escalated: true, category: 'error',
      error: error?.message || 'Unknown error'
    }, { status: 500 })
  }
}