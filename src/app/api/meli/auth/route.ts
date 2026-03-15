import { NextResponse } from 'next/server'
import { getAuthUrl } from '@/lib/meli/client'

// GET /api/meli/auth → Redirects to MercadoLibre OAuth
export async function GET() {
  if (!process.env.MELI_APP_ID || !process.env.MELI_CLIENT_SECRET) {
    return NextResponse.json({
      error: 'MercadoLibre credentials not configured',
      help: 'Set MELI_APP_ID, MELI_CLIENT_SECRET, and MELI_REDIRECT_URI in environment variables'
    }, { status: 500 })
  }

  const authUrl = getAuthUrl()
  return NextResponse.redirect(authUrl)
}