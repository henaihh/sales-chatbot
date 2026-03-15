// MercadoLibre API Client

const MELI_API_BASE = 'https://api.mercadolibre.com'
const MELI_AUTH_URL = 'https://auth.mercadolibre.com.ar/authorization'
const MELI_TOKEN_URL = 'https://api.mercadolibre.com/oauth/token'

export interface MeliTokens {
  access_token: string
  refresh_token: string
  expires_in: number
  user_id: number
}

// Store tokens in memory for now (TODO: move to Supabase)
let currentTokens: MeliTokens | null = null
let tokenExpiry: number = 0

export function getStoredTokens(): MeliTokens | null {
  return currentTokens
}

export function setStoredTokens(tokens: MeliTokens) {
  currentTokens = tokens
  tokenExpiry = Date.now() + (tokens.expires_in * 1000) - 60000 // 1 min buffer
}

export function isTokenExpired(): boolean {
  return !currentTokens || Date.now() > tokenExpiry
}

// Generate OAuth authorization URL
export function getAuthUrl(): string {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.MELI_APP_ID!,
    redirect_uri: process.env.MELI_REDIRECT_URI!,
  })
  return `${MELI_AUTH_URL}?${params.toString()}`
}

// Exchange authorization code for tokens
export async function exchangeCode(code: string): Promise<MeliTokens> {
  const response = await fetch(MELI_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.MELI_APP_ID!,
      client_secret: process.env.MELI_CLIENT_SECRET!,
      code,
      redirect_uri: process.env.MELI_REDIRECT_URI!,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Token exchange failed: ${response.status} - ${error}`)
  }

  const tokens = await response.json() as MeliTokens
  setStoredTokens(tokens)
  return tokens
}

// Refresh access token
export async function refreshTokens(): Promise<MeliTokens> {
  if (!currentTokens?.refresh_token) {
    throw new Error('No refresh token available. Re-authorize.')
  }

  const response = await fetch(MELI_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: process.env.MELI_APP_ID!,
      client_secret: process.env.MELI_CLIENT_SECRET!,
      refresh_token: currentTokens.refresh_token,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Token refresh failed: ${response.status} - ${error}`)
  }

  const tokens = await response.json() as MeliTokens
  setStoredTokens(tokens)
  return tokens
}

// Get valid access token (auto-refresh if expired)
async function getAccessToken(): Promise<string> {
  if (isTokenExpired() && currentTokens?.refresh_token) {
    await refreshTokens()
  }
  if (!currentTokens?.access_token) {
    throw new Error('Not authenticated. Visit /api/meli/auth to connect.')
  }
  return currentTokens.access_token
}

// Generic API call with auth
export async function meliGet<T = any>(path: string): Promise<T> {
  const token = await getAccessToken()
  const response = await fetch(`${MELI_API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`MELI API ${path}: ${response.status} - ${error}`)
  }
  return response.json()
}

export async function meliPost<T = any>(path: string, body: any): Promise<T> {
  const token = await getAccessToken()
  const response = await fetch(`${MELI_API_BASE}${path}`, {
    method: 'POST',
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`MELI API POST ${path}: ${response.status} - ${error}`)
  }
  return response.json()
}

export async function meliPut<T = any>(path: string, body: any): Promise<T> {
  const token = await getAccessToken()
  const response = await fetch(`${MELI_API_BASE}${path}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`MELI API PUT ${path}: ${response.status} - ${error}`)
  }
  return response.json()
}

// ─── Specific API calls ─────────────────────────────────

// Get question by ID
export async function getQuestion(questionId: number) {
  return meliGet(`/questions/${questionId}`)
}

// Answer a question
export async function answerQuestion(questionId: number, text: string) {
  return meliPost(`/answers`, {
    question_id: questionId,
    text,
  })
}

// Get item details
export async function getItem(itemId: string) {
  return meliGet(`/items/${itemId}`)
}

// Get user info
export async function getUser(userId?: number) {
  const path = userId ? `/users/${userId}` : '/users/me'
  return meliGet(path)
}

// Get unanswered questions for seller
export async function getUnansweredQuestions(sellerId: number) {
  return meliGet(`/questions/search?seller_id=${sellerId}&status=UNANSWERED&sort_fields=date_created&sort_types=DESC`)
}

// Get messages for an order/pack
export async function getMessages(packId: string) {
  return meliGet(`/messages/packs/${packId}/sellers`)
}

// Send message in a pack
export async function sendMessage(packId: string, buyerId: number, text: string) {
  return meliPost(`/messages/packs/${packId}/sellers`, {
    from: { user_id: currentTokens?.user_id },
    to: { user_id: buyerId },
    text,
  })
}