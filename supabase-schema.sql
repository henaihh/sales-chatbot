-- MercadoLibre Auto-Responder Database Schema

-- Seller configuration
create table seller_config (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  meli_user_id text unique,
  store_name text not null,
  tone text default 'friendly',
  shipping_policy text default 'Enviamos a todo el país via Mercado Envíos.',
  return_policy text default 'Aceptamos devoluciones dentro de los 30 días.',
  warranty_policy text default 'Garantía de 6 meses por defectos de fábrica.',
  invoice_info text default 'Emitimos factura tipo B.',
  is_enabled boolean default false, -- ON/OFF switch starts OFF
  presale_prompt text not null default E'Eres el asistente de ventas de "{store_name}". Responde consultas de compradores en MercadoLibre.\n\nTono: amigable y útil.\nSaluda con "¡Hola!" y termina con "Saludos, {store_name}".\nSolo responde basándote en la información del producto y base de conocimiento.\n\nPolíticas:\n- Envíos: {shipping_policy}\n- Devoluciones: {return_policy}\n- Garantía: {warranty_policy}\n- Facturación: {invoice_info}',
  postsale_prompt text not null default E'Eres el asistente post-venta de "{store_name}". Atiendes consultas de compradores en MercadoLibre después de la compra.\n\nTono: empático y orientado a soluciones.\nSaluda con "¡Hola!" y termina con "Saludos, {store_name}".\nPara consultas de seguimiento, incluye el estado actual y fecha estimada.\nPara problemas del producto, muestra empatía y ofrece soluciones según políticas.\n\nPolíticas:\n- Envíos: {shipping_policy}\n- Devoluciones: {return_policy}\n- Garantía: {warranty_policy}\n- Facturación: {invoice_info}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Knowledge base
create table knowledge_base (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid references seller_config(id) on delete cascade,
  title text not null,
  content text not null,
  category text,
  applies_to text default 'all', -- 'all' or comma-separated ML item IDs
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Interactions
create table interactions (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid references seller_config(id) on delete cascade,
  meli_question_id bigint,
  meli_item_id text,
  meli_pack_id text,
  meli_order_id text,
  buyer_user_id text,
  type text not null check (type in ('question', 'message')),
  buyer_text text not null,
  response_text text,
  draft_text text,
  tier_used int not null check (tier_used in (2, 3, 4)),
  category text,
  status text default 'pending' check (status in ('pending', 'answered', 'escalated', 'error')),
  model_used text,
  tokens_input int default 0,
  tokens_output int default 0,
  cost_usd numeric(10,6) default 0,
  error_message text,
  answered_at timestamptz,
  created_at timestamptz default now()
);

-- Notifications
create table notifications (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid references seller_config(id) on delete cascade,
  interaction_id uuid references interactions(id) on delete cascade,
  title text not null,
  body text not null,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- MercadoLibre tokens
create table meli_tokens (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid references seller_config(id) on delete cascade,
  access_token text not null,
  refresh_token text not null,
  expires_at timestamptz not null,
  app_id text not null,
  client_secret text not null,
  updated_at timestamptz default now()
);

-- Add unique constraint for user_id in seller_config (one config per user)
alter table seller_config add constraint unique_user_config unique (user_id);

-- Add indexes for performance
create index idx_interactions_seller_created on interactions(seller_id, created_at desc);
create index idx_interactions_status on interactions(status);
create index idx_interactions_type on interactions(type);
create index idx_knowledge_base_seller_active on knowledge_base(seller_id, is_active);
create index idx_notifications_seller_unread on notifications(seller_id, is_read);

-- RLS policies
alter table seller_config enable row level security;
alter table knowledge_base enable row level security;
alter table interactions enable row level security;
alter table notifications enable row level security;
alter table meli_tokens enable row level security;

-- Seller config policies
create policy "own_config" on seller_config for all using (user_id = auth.uid());

-- Knowledge base policies
create policy "own_kb" on knowledge_base for all using (
  seller_id in (select id from seller_config where user_id = auth.uid())
);

-- Interactions policies  
create policy "own_interactions" on interactions for all using (
  seller_id in (select id from seller_config where user_id = auth.uid())
);

-- Notifications policies
create policy "own_notifications" on notifications for all using (
  seller_id in (select id from seller_config where user_id = auth.uid())
);

-- Tokens policies
create policy "own_tokens" on meli_tokens for all using (
  seller_id in (select id from seller_config where user_id = auth.uid())
);

-- Function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language 'plpgsql';

-- Add triggers for updated_at
create trigger update_seller_config_updated_at before update on seller_config
  for each row execute procedure update_updated_at_column();

create trigger update_knowledge_base_updated_at before update on knowledge_base
  for each row execute procedure update_updated_at_column();

-- Enable realtime for dashboard updates
alter publication supabase_realtime add table interactions;
alter publication supabase_realtime add table notifications;
alter publication supabase_realtime add table seller_config;