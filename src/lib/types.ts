// Database types
export interface SellerConfig {
  id: string;
  user_id: string;
  meli_user_id: string;
  store_name: string;
  tone: string;
  shipping_policy: string;
  return_policy: string;
  warranty_policy: string;
  invoice_info: string;
  presale_prompt: string;
  postsale_prompt: string;
  is_enabled: boolean; // ON/OFF switch
  created_at: string;
  updated_at: string;
}

export interface KnowledgeEntry {
  id: string;
  seller_id: string;
  title: string;
  content: string;
  category?: string;
  applies_to: string; // 'all' or comma-separated item IDs
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Interaction {
  id: string;
  seller_id: string;
  meli_question_id?: bigint;
  meli_item_id?: string;
  meli_pack_id?: string;
  meli_order_id?: string;
  buyer_user_id?: string;
  type: 'question' | 'message';
  buyer_text: string;
  response_text?: string;
  draft_text?: string;
  tier_used: 2 | 3 | 4;
  category?: string;
  status: 'pending' | 'answered' | 'escalated' | 'error';
  model_used?: string;
  tokens_input: number;
  tokens_output: number;
  cost_usd: number;
  error_message?: string;
  answered_at?: string;
  created_at: string;
}

export interface Notification {
  id: string;
  seller_id: string;
  interaction_id: string;
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
}

export interface MeliToken {
  id: string;
  seller_id: string;
  access_token: string;
  refresh_token: string;
  expires_at: string;
  app_id: string;
  client_secret: string;
  updated_at: string;
}

// MercadoLibre API types
export interface MeliQuestion {
  id: number;
  text: string;
  item_id: string;
  from: {
    id: string;
  };
  date_created: string;
}

export interface MeliMessage {
  id: string;
  from: {
    user_id: string;
  };
  to: {
    user_id: string;
  };
  text: string;
  message_date: string;
}

export interface MeliItem {
  id: string;
  title: string;
  price: number;
  available_quantity: number;
  attributes: Array<{
    name: string;
    value_name: string;
  }>;
  shipping: {
    free_shipping: boolean;
    mode: string;
  };
}

export interface MeliOrder {
  id: string;
  status: string;
  buyer: {
    id: string;
  };
  order_items: Array<{
    item: {
      id: string;
      title: string;
    };
    quantity: number;
    unit_price: number;
  }>;
  payments: Array<{
    status: string;
    payment_method_id: string;
  }>;
}

// AI Router types
export interface RouterInput {
  type: 'question' | 'message';
  buyerText: string;
  itemId: string;
  packId?: string;
  orderId?: string;
  buyerUserId?: string;
  sellerId: string;
}

export interface RouterResult {
  tier: 2 | 3 | 4;
  response: string | null;
  draft: string | null;
  category: string;
  model: string;
  tokensInput: number;
  tokensOutput: number;
  costUsd: number;
}

// Test Mode types (for the textarea testing feature)
export interface TestInput {
  question: string;
  itemId?: string;
  type: 'question' | 'message';
}

export interface TestResult {
  tier: number;
  response: string;
  model: string;
  tokensUsed: number;
  costEstimate: number;
  processingTime: number;
  escalated: boolean;
}

// Dashboard component props
export interface StatsCardData {
  questionsToday: number;
  autoAnswered: number;
  pendingEscalations: number;
  costToday: number;
}

// Utility types
export type InteractionStatus = Interaction['status'];
export type InteractionType = Interaction['type'];
export type TierLevel = RouterResult['tier'];