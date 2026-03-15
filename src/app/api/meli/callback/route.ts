import { NextRequest, NextResponse } from 'next/server'
import { exchangeCode, getUser } from '@/lib/meli/client'

// GET /api/meli/callback?code=... → Exchange code for tokens
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  
  if (!code) {
    return NextResponse.json({ error: 'No authorization code received' }, { status: 400 })
  }

  try {
    const tokens = await exchangeCode(code)
    const user = await getUser()

    // Redirect to dashboard with success
    const dashboardUrl = new URL('/dashboard/settings', req.nextUrl.origin)
    dashboardUrl.searchParams.set('meli_connected', 'true')
    dashboardUrl.searchParams.set('meli_user', user.nickname || user.id)

    return NextResponse.redirect(dashboardUrl.toString())
  } catch (error: any) {
    console.error('MeLi OAuth callback error:', error)
    
    const dashboardUrl = new URL('/dashboard/settings', req.nextUrl.origin)
    dashboardUrl.searchParams.set('meli_error', error.message || 'Unknown error')
    
    return NextResponse.redirect(dashboardUrl.toString())
  }
}