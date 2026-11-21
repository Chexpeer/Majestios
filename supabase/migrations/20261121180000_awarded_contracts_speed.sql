-- Marchés attribués : accélération des lectures publiques (la limite du visiteur anonyme est de 3 secondes).
-- Les chiffres de la page sont calculés à la fin de chaque chargement (service uniquement) et lus dans une petite table.
-- Retour arrière : réappliquer les définitions de 20261121160000_awarded_contracts.sql ; drop function public.refresh_awarded_stats ; drop table private.awarded_stats.

create table if not exists private.awarded_stats (
  id integer primary key check (id = 1),
  contracts bigint, winners bigint, buyers bigint, oldest date, newest date, loaded_at timestamptz,
  refreshed_at timestamptz not null default now()
);
alter table private.awarded_stats enable row level security;
revoke all on private.awarded_stats from public, anon, authenticated;

create or replace function public.refresh_awarded_stats()
returns void language plpgsql security definer set search_path = '' as $$
begin
  insert into private.awarded_stats as s (id, contracts, winners, buyers, oldest, newest, loaded_at, refreshed_at)
  select 1, count(distinct contract_uid), count(distinct winner_id), count(distinct buyer_id), min(awarded_on), max(awarded_on), max(loaded_at), now()
  from private.awarded_contracts
  on conflict (id) do update set contracts = excluded.contracts, winners = excluded.winners, buyers = excluded.buyers,
    oldest = excluded.oldest, newest = excluded.newest, loaded_at = excluded.loaded_at, refreshed_at = now();
end $$;
revoke all on function public.refresh_awarded_stats() from public, anon, authenticated;
grant execute on function public.refresh_awarded_stats() to service_role;

create or replace function public.awarded_contracts_meta()
returns table(contracts bigint, winners bigint, buyers bigint, oldest date, newest date, loaded_at timestamptz)
language sql stable security definer set search_path = '' as $$
  select s.contracts, s.winners, s.buyers, s.oldest, s.newest, s.loaded_at from private.awarded_stats s where s.id = 1;
$$;

-- Liste : on classe d'abord les identifiants de marchés, puis on ne détaille que la page demandée.
create or replace function public.list_awarded_contracts(
  p_department text default null, p_query text default null, p_cpv text default null, p_min_amount numeric default null,
  p_months integer default 6, p_limit integer default 10, p_offset integer default 0)
returns table(contract_uid text, object text, awarded_on date, kind text, procedure text, cpv text, amount numeric, amount_flag text,
  offers_received integer, duration_months integer, subcontracting_declared boolean, buyer_name text, buyer_commune text,
  buyer_dept text, winners text, winner_count integer)
language sql stable security definer set search_path = '' as $$
  with page as (
    select c.contract_uid, max(c.awarded_on) as d
    from private.awarded_contracts c
    where c.awarded_on >= (current_date - make_interval(months => least(greatest(coalesce(p_months, 6), 1), 36)))
      and (p_department is null or c.buyer_dept = p_department)
      and (p_cpv is null or p_cpv !~ '^[0-9]{2,8}$' or c.cpv like p_cpv || '%')
      and (p_min_amount is null or c.amount >= p_min_amount)
      and (p_query is null or length(trim(p_query)) < 3 or position(lower(left(trim(p_query), 80)) in c.search_text) > 0)
    group by c.contract_uid
    order by max(c.awarded_on) desc, c.contract_uid
    limit least(greatest(coalesce(p_limit, 10), 1), 50) offset greatest(coalesce(p_offset, 0), 0))
  select c.contract_uid, max(c.object), max(c.awarded_on), max(c.kind), max(c.procedure), max(c.cpv), max(c.amount), max(c.amount_flag),
    max(c.offers_received), max(c.duration_months), bool_or(c.subcontracting_declared), max(c.buyer_name), max(c.buyer_commune),
    max(c.buyer_dept), left(string_agg(distinct c.winner_name, ' · ' order by c.winner_name), 300), count(*)::integer
  from page p join private.awarded_contracts c on c.contract_uid = p.contract_uid
  group by c.contract_uid, p.d
  order by p.d desc, c.contract_uid;
$$;

-- Annuaire des gagnants : on classe d'abord les entreprises, puis on calcule le détail pour la page demandée seulement.
create or replace function public.top_awarded_winners(
  p_department text default null, p_months integer default 6, p_min_contracts integer default 2, p_limit integer default 20, p_offset integer default 0)
returns table(winner_id text, winner_name text, winner_category text, winner_commune text, winner_dept text, contracts integer, median_amount numeric)
language sql stable security definer set search_path = '' as $$
  with page as (
    select c.winner_id, count(distinct c.contract_uid) as n
    from private.awarded_contracts c
    where c.awarded_on >= (current_date - make_interval(months => least(greatest(coalesce(p_months, 6), 1), 36)))
      and (p_department is null or c.winner_dept = p_department)
    group by c.winner_id
    having count(distinct c.contract_uid) >= least(greatest(coalesce(p_min_contracts, 2), 1), 50)
    order by count(distinct c.contract_uid) desc, c.winner_id
    limit least(greatest(coalesce(p_limit, 20), 1), 50) offset greatest(coalesce(p_offset, 0), 0))
  select c.winner_id, max(c.winner_name), max(c.winner_category), max(c.winner_commune), max(c.winner_dept),
    p.n::integer,
    (percentile_cont(0.5) within group (order by c.amount) filter (where c.amount is not null))::numeric
  from page p join private.awarded_contracts c on c.winner_id = p.winner_id
  where c.awarded_on >= (current_date - make_interval(months => least(greatest(coalesce(p_months, 6), 1), 36)))
    and (p_department is null or c.winner_dept = p_department)
  group by c.winner_id, p.n
  order by p.n desc, c.winner_id;
$$;
