create table public.pack_catalog (
  id text primary key,
  name text not null,
  price_cents integer not null check (price_cents > 0),
  currency text not null default 'usd' check (currency = 'usd'),
  active boolean not null default true
);
create table public.pack_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  pack_id text not null references public.pack_catalog(id),
  amount_cents integer not null check (amount_cents > 0),
  currency text not null default 'usd' check (currency = 'usd'),
  mode text not null default 'mock' check (mode = 'mock'),
  status text not null default 'created' check (status in ('created','mock_paid','fulfilled','failed')),
  idempotency_key text not null,
  created_at timestamptz not null default now(),
  unique (user_id, idempotency_key),
  unique (id, user_id)
);
create table public.pack_pulls (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique,
  user_id uuid not null,
  restaurant_label text not null,
  face_value_cents integer not null check (face_value_cents > 0),
  mode text not null default 'mock' check (mode = 'mock'),
  delivery_status text not null default 'simulated' check (delivery_status = 'simulated'),
  created_at timestamptz not null default now(),
  foreign key (order_id, user_id) references public.pack_orders(id, user_id)
);
create index pack_orders_user_created on public.pack_orders(user_id, created_at desc);
create index pack_pulls_user_created on public.pack_pulls(user_id, created_at desc);
alter table public.pack_catalog enable row level security;
alter table public.pack_orders enable row level security;
alter table public.pack_pulls enable row level security;
revoke all on public.pack_catalog, public.pack_orders, public.pack_pulls from anon, authenticated;
grant select on public.pack_catalog to anon, authenticated;
grant select on public.pack_orders, public.pack_pulls to authenticated;
grant all on public.pack_catalog, public.pack_orders, public.pack_pulls to service_role;
create policy catalog_read on public.pack_catalog for select to anon, authenticated using (active);
create policy orders_read_own on public.pack_orders for select to authenticated using ((select auth.uid()) = user_id);
create policy pulls_read_own on public.pack_pulls for select to authenticated using ((select auth.uid()) = user_id);
insert into public.pack_catalog(id,name,price_cents) values
('quick-bite','Quick Bite',1500),('sit-down','Sit-Down',4000),('treat-yourself','Treat Yourself',10000);
