-- Checkout schema for El Kiosco (PayPal + manual payments)
-- Run in Supabase SQL Editor.

-- 1) Enums
do $$ begin
  create type public.order_status as enum (
    'draft',
    'pending_payment',
    'pending_verification',
    'paid',
    'cancelled',
    'rejected'
  );
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type public.payment_method as enum (
    'paypal',
    'bolivares',
    'binance_pay',
    'zinli'
  );
exception
  when duplicate_object then null;
end $$;

-- 2) Tables
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status public.order_status not null default 'draft',
  payment_method public.payment_method not null,
  currency text not null default 'USD',
  subtotal_amount numeric not null default 0,
  name text,
  email text,
  phone text,
  address_line text,
  city text,
  state text,
  zip_code text,
  shipping_method text,
  paypal_order_id text
);

-- Si ya tenías la tabla sin estos campos, ejecuta también:
-- alter table public.orders add column if not exists address_line text;
-- alter table public.orders add column if not exists city text;
-- alter table public.orders add column if not exists state text;
-- alter table public.orders add column if not exists zip_code text;
-- alter table public.orders add column if not exists shipping_method text;

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_status_idx on public.orders (status);
create index if not exists orders_paypal_order_id_idx on public.orders (paypal_order_id);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_slug text not null,
  title text not null,
  unit_price numeric not null,
  quantity int not null check (quantity > 0),
  image text
);

create index if not exists order_items_order_id_idx on public.order_items (order_id);

create table if not exists public.payment_proofs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  order_id uuid not null references public.orders(id) on delete cascade,
  method public.payment_method not null,
  file_path text not null,
  reference text
);

create index if not exists payment_proofs_order_id_idx on public.payment_proofs (order_id);

-- 3) RLS (locked down by default; server uses service role)
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payment_proofs enable row level security;

-- No policies by default. Access should go through server routes using service role.

-- 4) Storage bucket (create in UI):
-- Bucket name: payment-proofs
-- Recommended: private

