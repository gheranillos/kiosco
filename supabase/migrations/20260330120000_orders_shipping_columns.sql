-- Añade columnas de envío a órdenes existentes (ejecutar en Supabase SQL Editor si la tabla ya existía sin ellas).
alter table public.orders add column if not exists address_line text;
alter table public.orders add column if not exists city text;
alter table public.orders add column if not exists state text;
alter table public.orders add column if not exists zip_code text;
alter table public.orders add column if not exists shipping_method text;
alter table public.orders add column if not exists paypal_order_id text;
