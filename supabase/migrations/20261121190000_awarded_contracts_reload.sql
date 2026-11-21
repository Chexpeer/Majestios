-- Chargement quotidien : une ligne inchangée n'est plus réécrite (évite le dépassement de délai à la relecture du même fichier).
-- Retour arrière : réappliquer la fonction de 20261121160000_awarded_contracts.sql.

create or replace function public.import_awarded_contracts(p_rows jsonb)
returns integer language plpgsql security definer set search_path = '' as $$
declare n integer;
begin
  if jsonb_typeof(p_rows) is distinct from 'array' then raise exception 'invalid_rows' using errcode = '22023'; end if;
  if jsonb_array_length(p_rows) > 2000 then raise exception 'batch_too_large' using errcode = '22023'; end if;
  insert into private.awarded_contracts as t (
    contract_uid, winner_id, awarded_on, published_on, nature, kind, procedure, cpv, object, amount, amount_flag,
    duration_months, offers_received, subcontracting_declared,
    buyer_id, buyer_name, buyer_category, buyer_commune, buyer_dept, buyer_dept_name, buyer_region,
    winner_name, winner_id_type, winner_activity, winner_category, winner_commune, winner_dept, winner_dept_name, winner_distance_km,
    search_text, loaded_at)
  select r.contract_uid, r.winner_id, r.awarded_on, r.published_on, r.nature, r.kind, r.procedure, r.cpv, left(r.object, 1000), r.amount, r.amount_flag,
    r.duration_months, r.offers_received, r.subcontracting_declared,
    r.buyer_id, r.buyer_name, r.buyer_category, r.buyer_commune, r.buyer_dept, r.buyer_dept_name, r.buyer_region,
    r.winner_name, r.winner_id_type, r.winner_activity, r.winner_category, r.winner_commune, r.winner_dept, r.winner_dept_name, r.winner_distance_km,
    lower(concat_ws(' ', r.object, r.buyer_name, r.buyer_commune, r.winner_name, r.winner_commune, r.winner_activity)), now()
  from jsonb_to_recordset(p_rows) as r(
    contract_uid text, winner_id text, awarded_on date, published_on date, nature text, kind text, procedure text, cpv text, object text,
    amount numeric, amount_flag text, duration_months integer, offers_received integer, subcontracting_declared boolean,
    buyer_id text, buyer_name text, buyer_category text, buyer_commune text, buyer_dept text, buyer_dept_name text, buyer_region text,
    winner_name text, winner_id_type text, winner_activity text, winner_category text, winner_commune text, winner_dept text,
    winner_dept_name text, winner_distance_km integer)
  where r.contract_uid is not null and r.winner_id is not null and r.awarded_on is not null
  on conflict (contract_uid, winner_id) do update set
    awarded_on = excluded.awarded_on, published_on = excluded.published_on, nature = excluded.nature, kind = excluded.kind,
    procedure = excluded.procedure, cpv = excluded.cpv, object = excluded.object, amount = excluded.amount, amount_flag = excluded.amount_flag,
    duration_months = excluded.duration_months, offers_received = excluded.offers_received,
    subcontracting_declared = excluded.subcontracting_declared, buyer_id = excluded.buyer_id, buyer_name = excluded.buyer_name,
    buyer_category = excluded.buyer_category, buyer_commune = excluded.buyer_commune, buyer_dept = excluded.buyer_dept,
    buyer_dept_name = excluded.buyer_dept_name, buyer_region = excluded.buyer_region, winner_name = excluded.winner_name,
    winner_id_type = excluded.winner_id_type, winner_activity = excluded.winner_activity, winner_category = excluded.winner_category,
    winner_commune = excluded.winner_commune, winner_dept = excluded.winner_dept, winner_dept_name = excluded.winner_dept_name,
    winner_distance_km = excluded.winner_distance_km, search_text = excluded.search_text, loaded_at = now()
  where (t.object, t.amount, t.amount_flag, t.winner_name, t.awarded_on, t.published_on, t.offers_received, t.duration_months, t.buyer_name, t.buyer_dept, t.winner_dept, t.procedure, t.cpv)
    is distinct from (excluded.object, excluded.amount, excluded.amount_flag, excluded.winner_name, excluded.awarded_on, excluded.published_on, excluded.offers_received, excluded.duration_months, excluded.buyer_name, excluded.buyer_dept, excluded.winner_dept, excluded.procedure, excluded.cpv);
  get diagnostics n = row_count;
  return n;
end $$;
revoke all on function public.import_awarded_contracts(jsonb) from public, anon, authenticated;
grant execute on function public.import_awarded_contracts(jsonb) to service_role;

create or replace function public.refresh_awarded_stats()
returns void language plpgsql security definer set search_path = '' as $$
begin
  insert into private.awarded_stats as s (id, contracts, winners, buyers, oldest, newest, loaded_at, refreshed_at)
  select 1, count(distinct contract_uid), count(distinct winner_id), count(distinct buyer_id), min(awarded_on), max(awarded_on), now(), now()
  from private.awarded_contracts
  on conflict (id) do update set contracts = excluded.contracts, winners = excluded.winners, buyers = excluded.buyers,
    oldest = excluded.oldest, newest = excluded.newest, loaded_at = now(), refreshed_at = now();
end $$;
