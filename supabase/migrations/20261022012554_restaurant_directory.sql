-- Public brand metadata for browsing and sample artwork; this is not provider inventory.
create table public.restaurant_directory (
  id text primary key check (id ~ '^[a-z0-9-]+$'),
  name text not null check (char_length(name) between 1 and 100),
  tier_id text not null references public.pack_catalog(id),
  cuisine text not null,
  official_url text not null check (official_url like 'https://%'),
  card_art text check (card_art ~ '^[a-z0-9-]+\.(svg|png)$'),
  color text not null check (color ~ '^#[0-9a-fA-F]{6}$'),
  active boolean not null default true,
  redemption_available boolean not null default false check (redemption_available = false)
);
create index restaurant_directory_tier on public.restaurant_directory(tier_id) where active;
alter table public.restaurant_directory enable row level security;
revoke all on public.restaurant_directory from public, anon, authenticated;
grant select on public.restaurant_directory to anon, authenticated;
grant all on public.restaurant_directory to service_role;
create policy restaurant_directory_read on public.restaurant_directory
  for select to anon, authenticated using (active);
comment on table public.restaurant_directory is 'Public brand directory and demo tier grouping. No affiliation, redeemable inventory, odds or restaurant fulfillment represented.';
insert into public.restaurant_directory(id,name,tier_id,cuisine,official_url,card_art,color) values
('mcdonalds','McDonald’s','quick-bite','Burgers','https://www.mcdonalds.com/','mcdonalds.svg','#c92724'),
('subway','Subway','quick-bite','Sandwiches','https://www.subway.com/','subway.svg','#087b40'),
('taco-bell','Taco Bell','quick-bite','Tacos','https://www.tacobell.com/','taco-bell.svg','#682dd0'),
('slim-chickens','Slim Chickens','quick-bite','Chicken','https://www.slimchickens.com/','slim-chickens.svg','#b21f32'),
('little-caesars','Little Caesars','quick-bite','Pizza','https://littlecaesars.com/','little-caesars.png','#f36c21'),
('chilis','Chili’s','sit-down','American grill','https://www.chilis.com/',null,'#ad2430'),
('olive-garden','Olive Garden','sit-down','Italian','https://www.olivegarden.com/',null,'#476344'),
('capital-grille','The Capital Grille','treat-yourself','Steakhouse','https://www.thecapitalgrille.com/',null,'#252c35'),
('ruths-chris','Ruth’s Chris','treat-yourself','Steakhouse','https://www.ruthschris.com/',null,'#8d2333');
