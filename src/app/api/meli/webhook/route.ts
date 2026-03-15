import { NextRequest, NextResponse } from 'next/server'
import { getQuestion, answerQuestion, getItem, getStoredTokens } from '@/lib/meli/client'
import { routeInteraction } from '@/lib/ai/router'
import type { RouterInput } from '@/lib/types'

// Store recent webhook events for debugging
const recentEvents: any[] = []
const MAX_EVENTS = 50

// POST /api/meli/webhook → Receives MercadoLibre notifications
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Log the event
    const event = {
      ...body,
      received_at: new Date().toISOString(),
      processed: false,
      error: null as string | null,
      response: null as string | null,
    }
    recentEvents.unshift(event)
    if (recentEvents.length > MAX_EVENTS) recentEvents.pop()

    console.log('📩 MeLi webhook received:', body.topic, body.resource)

    // Only process questions for now
    if (body.topic === 'questions') {
      const tokens = getStoredTokens()
      if (!tokens) {
        event.error = 'Not authenticated - no tokens stored'
        console.warn('⚠️ Webhook received but not authenticated')
        return NextResponse.json({ status: 'ok', note: 'not_authenticated' })
      }

      // TODO: Check if bot is enabled before processing
      // For now, always process

      try {
        // Extract question ID from resource path: /questions/XXXXX
        const questionId = parseInt(body.resource.split('/').pop())
        if (!questionId) throw new Error('Invalid question ID')

        // Fetch the question
        const question = await getQuestion(questionId)
        console.log('📝 Question:', question.text, 'for item:', question.item_id)

        // Skip if already answered
        if (question.status === 'ANSWERED') {
          event.processed = true
          event.response = 'Already answered, skipping'
          return NextResponse.json({ status: 'ok', note: 'already_answered' })
        }

        // Fetch item details for context
        let itemTitle = 'Producto'
        try {
          const item = await getItem(question.item_id)
          itemTitle = item.title
        } catch (e) {
          console.warn('Could not fetch item details:', e)
        }

        // Route through AI
        const input: RouterInput = {
          type: 'question',
          buyerText: question.text,
          itemId: question.item_id,
          sellerId: tokens.user_id.toString(),
          buyerUserId: question.from?.id?.toString(),
        }

        const result = await routeInteraction(input)
        console.log('🤖 AI result: tier', result.tier, 'model:', result.model)

        // If AI has a response (tier 2 or 3), answer automatically
        if (result.response && result.tier !== 4) {
          await answerQuestion(questionId, result.response)
          event.processed = true
          event.response = result.response
          console.log('✅ Auto-answered question', questionId)
        } else {
          // Tier 4: escalated, don't auto-answer
          event.processed = true
          event.response = `ESCALATED: ${result.draft || 'Needs manual review'}`
          console.log('⚠️ Question escalated:', questionId)
        }

      } catch (processError: any) {
        event.error = processError.message
        console.error('❌ Error processing question:', processError)
      }
    }

    // Always return 200 to ML so they don't retry
    return NextResponse.json({ status: 'ok' })
    
  } catch (error: any) {
    console.error('❌ Webhook error:', error)
    return NextResponse.json({ status: 'error', message: error.message }, { status: 200 })
  }
}

// GET /api/meli/webhook → Debug: view recent events
export async function GET() {
  return NextResponse.json({
    total: recentEvents.length,
    authenticated: !!getStoredTokens(),
    events: recentEvents,
  })
}