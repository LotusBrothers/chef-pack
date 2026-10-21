create schema if not exists chef_private;
revoke all on schema chef_private from public;
grant usage on schema chef_private to authenticated;
create function chef_private.mock_pull(p_pack_id text, p_idempotency_key text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  uid uuid := auth.uid();
  pack public.pack_catalog;
  ord public.pack_orders;
  pull public.pack_pulls;
begin
  if uid is null then raise exception 'authentication_required' using errcode='28000'; end if;
  if p_idempotency_key is null or length(p_idempotency_key) < 8 or length(p_idempotency_key) > 128 then
    raise exception 'invalid_idempotency_key' using errcode='22023';
  end if;
  perform pg_advisory_xact_lock(hashtextextended(uid::text || ':' || p_idempotency_key, 0));
  select * into ord from public.pack_orders where user_id=uid and idempotency_key=p_idempotency_key;
  if found then
    if ord.pack_id <> p_pack_id then raise exception 'idempotency_key_reused' using errcode='22023'; end if;
  else
    select * into pack from public.pack_catalog where id=p_pack_id and active for share;
    if not found then raise exception 'pack_unavailable' using errcode='22023'; end if;
    insert into public.pack_orders(user_id,pack_id,amount_cents,idempotency_key,status)
      values(uid,pack.id,pack.price_cents,p_idempotency_key,'fulfilled') returning * into ord;
    insert into public.pack_pulls(order_id,user_id,restaurant_label,face_value_cents)
      values(ord.id,uid,'Demo restaurant — not redeemable',pack.price_cents) returning * into pull;
  end if;
  select * into pull from public.pack_pulls where order_id=ord.id and user_id=uid;
  return jsonb_build_object('mode','mock','order',to_jsonb(ord),'pull',to_jsonb(pull));
end $$;
revoke all on function chef_private.mock_pull(text,text) from public, anon;
grant execute on function chef_private.mock_pull(text,text) to authenticated;
create function public.create_mock_pull(p_pack_id text,p_idempotency_key text)
returns jsonb language sql security invoker set search_path='' as $$
select chef_private.mock_pull(p_pack_id,p_idempotency_key);
$$;
revoke all on function public.create_mock_pull(text,text) from public, anon;
grant execute on function public.create_mock_pull(text,text) to authenticated;
