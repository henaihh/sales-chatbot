import { NextResponse } from 'next/server'
import { getStoredTokens, isTokenExpired, getUser } from '@/lib/meli/client'

export async function GET() {
  const tokens = getStoredTokens()
  const hasConfig = !!(process.env.MELI_APP_ID && process.env.MELI_CLIENT_SECRET)
  
  if (!hasConfig) {
    return NextResponse.json({
      status: 'not_configured',
      message: 'MELI_APP_ID and MELI_CLIENT_SECRET not set',
      authUrl: null,
    })
  }

  if (!tokens) {
    return NextResponse.json({
      status: 'not_connected',
      message: 'Not authenticated. Visit /api/meli/auth to connect.',
      authUrl: '/api/meli/auth',
    })
  }

  try {
    const user = await getUser()
    return NextResponse.json({
      status: 'connected',
      user: {
        id: user.id,
        nickname: user.nickname,
        site_id: user.site_id,
      },
      tokenExpired: isTokenExpired(),
    })
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: error.message,
      tokenExpired: isTokenExpired(),
      authUrl: '/api/meli/auth',
    })
  }
}