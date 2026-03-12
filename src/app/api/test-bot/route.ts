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

    // Create router input
    const input: RouterInput = {
      type: type || 'question',
      buyerText: question,
      itemId: itemId || 'MLA999999999',
      sellerId: 'mock-seller', // For now, using mock seller
      buyerUserId: 'test-buyer'
    }

    const startTime = Date.now()
    
    // Route through AI system
    const result = await routeInteraction(input)
    
    const processingTime = Date.now() - startTime

    // Format response for Test Bot
    const response = {
      tier: result.tier,
      response: result.response || '',
      model: result.model,
      tokensUsed: result.tokensInput + result.tokensOutput,
      tokensInput: result.tokensInput,
      tokensOutput: result.tokensOutput,
      costEstimate: result.costUsd,
      processingTime,
      escalated: result.tier === 4,
      category: result.category,
      draft: result.draft
    }

    return NextResponse.json(response)

  } catch (error: any) {
    console.error('Test Bot API error:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error.message,
        // Return a fallback response for testing
        tier: 4,
        response: '',
        escalated: true,
        model: 'error',
        tokensUsed: 0,
        costEstimate: 0,
        processingTime: 0,
        category: 'error'
      },
      { status: 500 }
    )
  }
}