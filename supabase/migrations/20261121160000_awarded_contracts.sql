-- Marchés publics attribués (DECP consolidées, data.gouv.fr, Licence Ouverte 2.0) : 6 derniers mois, lecture publique bornée.
-- Aucun accès direct aux tables : RLS activée, droits retirés ; tout passe par des fonctions.
-- Chargement : fonction réservée au rôle de service (tâche GitHub Actions « charger-decp »), jamais exposée aux visiteurs.
-- Retour arrière : drop function public.list_awarded_contracts, public.top_awarded_winners, public.awarded_contracts_meta,
--   public.import_awarded_contracts, public.purge_awarded_contracts ; drop table private.awarded_contracts.

create table if not exists private.awarded_contracts (
  contract_uid text not null,
  winner_id text not null,
  awarded_on date not null,
  published_on date,
  nature text,
  kind text,
  procedure text,
  cpv text,
  object text,
  amount numeric,
  amount_flag text,
  duration_months integer,
  offers_received integer,
  subcontracting_declared boolean,
  buyer_id text,
  buyer_name text,
  buyer_category text,
  buyer_commune text,
  buyer_dept text,
  buyer_dept_name text,
  buyer_region text,
  winner_name text,
  winner_id_type text,
  winner_activity text,
  winner_category text,
  winner_commune text,
  winner_dept text,
  winner_dept_name text,
  winner_distance_km integer,
  search_text text not null,
  loaded_at timestamptz not null default now(),
  primary key (contract_uid, winner_id)
);
alter table private.awarded_contracts enable row level security;
revoke all on private.awarded_contracts from public, anon, authenticated;
create index if not exists awarded_contracts_awarded_on_idx on private.awarded_contracts (awarded_on desc);
create index if not exists awarded_contracts_buyer_dept_idx on private.awarded_contracts (buyer_dept, awarded_on desc);
create index if not exists awarded_contracts_winner_idx on private.awarded_contracts (winner_id);
create index if not exists awarded_contracts_winner_dept_idx on private.awarded_contracts (winner_dept);

-- Chargement par lots (service uniquement). Une ligne = un marché × un titulaire ; une ligne déjà connue est mise à jour.
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
    winner_distance_km = excluded.winner_distance_km, search_text = excluded.search_text, loaded_at = now();
  get diagnostics n = row_count;
  return n;
end $$;
revoke all on function public.import_awarded_contracts(jsonb) from public, anon, authenticated;
grant execute on function public.import_awarded_contracts(jsonb) to service_role;

-- Retire les marchés notifiés avant une date (fenêtre glissante de 6 mois). Service uniquement.
create or replace function public.purge_awarded_contracts(p_before date)
returns integer language plpgsql security definer set search_path = '' as $$
declare n integer;
begin
  if p_before is null then raise exception 'invalid_date' using errcode = '22023'; end if;
  delete from private.awarded_contracts where awarded_on < p_before;
  get diagnostics n = row_count;
  return n;
end $$;
revoke all on function public.purge_awarded_contracts(date) from public, anon, authenticated;
grant execute on function public.purge_awarded_contracts(date) to service_role;

-- Liste publique : un marché par ligne (titulaires regroupés), 50 lignes au maximum par appel.
create or replace function public.list_awarded_contracts(
  p_department text default null, p_query text default null, p_cpv text default null, p_min_amount numeric default null,
  p_months integer default 6, p_limit integer default 10, p_offset integer default 0)
returns table(contract_uid text, object text, awarded_on date, kind text, procedure text, cpv text, amount numeric, amount_flag text,
  offers_received integer, duration_months integer, subcontracting_declared boolean, buyer_name text, buyer_commune text,
  buyer_dept text, winners text, winner_count integer)
language sql stable security definer set search_path = '' as $$
  select c.contract_uid, max(c.object), max(c.awarded_on), max(c.kind), max(c.procedure), max(c.cpv), max(c.amount), max(c.amount_flag),
    max(c.offers_received), max(c.duration_months), bool_or(c.subcontracting_declared), max(c.buyer_name), max(c.buyer_commune),
    max(c.buyer_dept), left(string_agg(distinct c.winner_name, ' · ' order by c.winner_name), 300), count(*)::integer
  from private.awarded_contracts c
  where c.awarded_on >= (current_date - make_interval(months => least(greatest(coalesce(p_months, 6), 1), 36)))
    and (p_department is null or c.buyer_dept = p_department)
    and (p_cpv is null or p_cpv !~ '^[0-9]{2,8}$' or c.cpv like p_cpv || '%')
    and (p_min_amount is null or c.amount >= p_min_amount)
    and (p_query is null or length(trim(p_query)) < 3 or position(lower(left(trim(p_query), 80)) in c.search_text) > 0)
  group by c.contract_uid
  order by max(c.awarded_on) desc, c.contract_uid
  limit least(greatest(coalesce(p_limit, 10), 1), 50) offset greatest(coalesce(p_offset, 0), 0);
$$;
revoke all on function public.list_awarded_contracts(text, text, text, numeric, integer, integer, integer) from public;
grant execute on function public.list_awarded_contracts(text, text, text, numeric, integer, integer, integer) to anon, authenticated;

-- Annuaire des gagnants : entreprises ayant obtenu au moins N marchés sur la période, classées par nombre de marchés.
create or replace function public.top_awarded_winners(
  p_department text default null, p_months integer default 6, p_min_contracts integer default 2, p_limit integer default 20, p_offset integer default 0)
returns table(winner_id text, winner_name text, winner_category text, winner_commune text, winner_dept text, contracts integer, median_amount numeric)
language sql stable security definer set search_path = '' as $$
  select c.winner_id, max(c.winner_name), max(c.winner_category), max(c.winner_commune), max(c.winner_dept),
    count(distinct c.contract_uid)::integer,
    (percentile_cont(0.5) within group (order by c.amount) filter (where c.amount is not null))::numeric
  from private.awarded_contracts c
  where c.awarded_on >= (current_date - make_interval(months => least(greatest(coalesce(p_months, 6), 1), 36)))
    and (p_department is null or c.winner_dept = p_department)
  group by c.winner_id
  having count(distinct c.contract_uid) >= least(greatest(coalesce(p_min_contracts, 2), 1), 50)
  order by count(distinct c.contract_uid) desc, c.winner_id
  limit least(greatest(coalesce(p_limit, 20), 1), 50) offset greatest(coalesce(p_offset, 0), 0);
$$;
revoke all on function public.top_awarded_winners(text, integer, integer, integer, integer) from public;
grant execute on function public.top_awarded_winners(text, integer, integer, integer, integer) to anon, authenticated;

-- Chiffres de la page : volume, période couverte et date du dernier chargement (affichés pour la transparence).
create or replace function public.awarded_contracts_meta()
returns table(contracts bigint, winners bigint, buyers bigint, oldest date, newest date, loaded_at timestamptz)
language sql stable security definer set search_path = '' as $$
  select count(distinct contract_uid), count(distinct winner_id), count(distinct buyer_id), min(awarded_on), max(awarded_on), max(loaded_at)
  from private.awarded_contracts;
$$;
revoke all on function public.awarded_contracts_meta() from public;
grant execute on function public.awarded_contracts_meta() to anon, authenticated;
