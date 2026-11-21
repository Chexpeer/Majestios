-- Marchés attribués : recherches rapides (limite de 3 s du visiteur) — index de recherche par fragments de texte,
-- index par département, liste classée par date sans tout relire, annuaire des gagnants précalculé en fin de chargement.
-- Retour arrière : drop index awarded_contracts_search_trgm_idx, awarded_contracts_dept_page_idx ; drop function public.refresh_awarded_winners ;
--   drop table private.awarded_winners ; réappliquer list_awarded_contracts / top_awarded_winners de 20261121180000.

create extension if not exists pg_trgm with schema extensions;
create index if not exists awarded_contracts_search_trgm_idx on private.awarded_contracts using gin (search_text extensions.gin_trgm_ops);
create index if not exists awarded_contracts_dept_page_idx on private.awarded_contracts (buyer_dept, awarded_on desc, contract_uid);
create index if not exists awarded_contracts_page_idx on private.awarded_contracts (awarded_on desc, contract_uid);

create or replace function public.list_awarded_contracts(
  p_department text default null, p_query text default null, p_cpv text default null, p_min_amount numeric default null,
  p_months integer default 6, p_limit integer default 10, p_offset integer default 0)
returns table(contract_uid text, object text, awarded_on date, kind text, procedure text, cpv text, amount numeric, amount_flag text,
  offers_received integer, duration_months integer, subcontracting_declared boolean, buyer_name text, buyer_commune text,
  buyer_dept text, winners text, winner_count integer)
language plpgsql stable security definer set search_path = '' as $$
declare
  v_where text := 'c.awarded_on >= $1';
  v_lim integer := least(greatest(coalesce(p_limit, 10), 1), 50);
  v_off integer := greatest(coalesce(p_offset, 0), 0);
  v_since date := current_date - make_interval(months => least(greatest(coalesce(p_months, 6), 1), 36));
  v_like text := null;
begin
  -- Requête construite selon les filtres réellement demandés, pour que chaque index serve (sinon > 3 s pour un visiteur).
  if p_department is not null then v_where := v_where || ' and c.buyer_dept = $2'; end if;
  if p_cpv is not null and p_cpv ~ '^[0-9]{2,8}$' then v_where := v_where || ' and c.cpv like $3 || ''%'''; end if;
  if p_min_amount is not null then v_where := v_where || ' and c.amount >= $4'; end if;
  if p_query is not null and length(trim(p_query)) >= 3 then
    v_like := '%' || replace(replace(replace(lower(left(trim(p_query), 80)), '\', '\\'), '%', '\%'), '_', '\_') || '%';
    v_where := v_where || ' and c.search_text like $5';
  end if;
  return query execute
    'with recent as (
       select c.contract_uid, c.awarded_on from private.awarded_contracts c where ' || v_where || '
       order by c.awarded_on desc, c.contract_uid limit $6),
     page as (
       select r.contract_uid, max(r.awarded_on) as d from recent r group by r.contract_uid
       order by max(r.awarded_on) desc, r.contract_uid limit $7 offset $8)
     select c.contract_uid, max(c.object), max(c.awarded_on), max(c.kind), max(c.procedure), max(c.cpv), max(c.amount), max(c.amount_flag),
       max(c.offers_received), max(c.duration_months), bool_or(c.subcontracting_declared), max(c.buyer_name), max(c.buyer_commune),
       max(c.buyer_dept), left(string_agg(distinct c.winner_name, '' · '' order by c.winner_name), 300), count(*)::integer
     from page p join private.awarded_contracts c on c.contract_uid = p.contract_uid
     group by c.contract_uid, p.d
     order by p.d desc, c.contract_uid'
    using v_since, p_department, p_cpv, p_min_amount, v_like, least((v_lim + v_off) * 30, 3000), v_lim, v_off;
end $$;
revoke all on function public.list_awarded_contracts(text, text, text, numeric, integer, integer, integer) from public;
grant execute on function public.list_awarded_contracts(text, text, text, numeric, integer, integer, integer) to anon, authenticated;

create table if not exists private.awarded_winners (
  winner_id text primary key, winner_name text, winner_category text, winner_commune text, winner_dept text,
  contracts integer not null, median_amount numeric
);
alter table private.awarded_winners enable row level security;
revoke all on private.awarded_winners from public, anon, authenticated;
create index if not exists awarded_winners_rank_idx on private.awarded_winners (contracts desc, winner_id);
create index if not exists awarded_winners_dept_rank_idx on private.awarded_winners (winner_dept, contracts desc, winner_id);

create or replace function public.refresh_awarded_winners()
returns integer language plpgsql security definer set search_path = '' as $$
declare n integer;
begin
  delete from private.awarded_winners;
  insert into private.awarded_winners (winner_id, winner_name, winner_category, winner_commune, winner_dept, contracts, median_amount)
  select c.winner_id, max(c.winner_name), max(c.winner_category), max(c.winner_commune), max(c.winner_dept),
    count(distinct c.contract_uid)::integer,
    (percentile_cont(0.5) within group (order by c.amount) filter (where c.amount is not null))::numeric
  from private.awarded_contracts c
  where c.winner_id ~ '^[0-9]{14}$' and c.winner_name is not null  -- exclut les identifiants fictifs, « donnée protégée » et les titulaires sans nom
  group by c.winner_id
  having count(distinct c.contract_uid) >= 2;
  get diagnostics n = row_count;
  return n;
end $$;
revoke all on function public.refresh_awarded_winners() from public, anon, authenticated;
grant execute on function public.refresh_awarded_winners() to service_role;

-- L'annuaire lit la table précalculée (fenêtre de 6 mois du chargement) ; p_months est conservé pour compatibilité.
create or replace function public.top_awarded_winners(
  p_department text default null, p_months integer default 6, p_min_contracts integer default 2, p_limit integer default 20, p_offset integer default 0)
returns table(winner_id text, winner_name text, winner_category text, winner_commune text, winner_dept text, contracts integer, median_amount numeric)
language sql stable security definer set search_path = '' as $$
  select w.winner_id, w.winner_name, w.winner_category, w.winner_commune, w.winner_dept, w.contracts, w.median_amount
  from private.awarded_winners w
  where (p_department is null or w.winner_dept = p_department)
    and w.contracts >= least(greatest(coalesce(p_min_contracts, 2), 1), 50)
  order by w.contracts desc, w.winner_id
  limit least(greatest(coalesce(p_limit, 20), 1), 50) offset greatest(coalesce(p_offset, 0), 0);
$$;
