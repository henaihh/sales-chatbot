import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export async function GET() {
  const hasKey = !!process.env.ANTHROPIC_API_KEY
  const keyPrefix = process.env.ANTHROPIC_API_KEY?.slice(0, 12) || 'NOT_SET'
  
  if (!hasKey) {
    return NextResponse.json({
      status: 'error',
      message: 'ANTHROPIC_API_KEY is not set',
      keyPrefix
    })
  }

  try {
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY!,
    })

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 50,
      messages: [{ role: 'user', content: 'Responde solo "OK"' }]
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''

    return NextResponse.json({
      status: 'ok',
      keyPrefix,
      model: 'claude-3-haiku-20240307',
      response: text,
      tokens: response.usage
    })
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      keyPrefix,
      errorType: error?.constructor?.name,
      message: error?.message || 'Unknown error',
      statusCode: error?.status
    })
  }
}