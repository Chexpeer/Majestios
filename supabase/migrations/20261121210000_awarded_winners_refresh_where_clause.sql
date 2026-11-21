-- Production : la base refuse un DELETE sans clause WHERE (protection activée côté Supabase de production).
-- refresh_awarded_winners() vidait la table avec « delete from ... » : ajout de « where true ». Appliqué en production le 21/11/2026.
create or replace function public.refresh_awarded_winners()
returns integer language plpgsql security definer set search_path = '' as $$
declare n integer;
begin
  delete from private.awarded_winners where true;
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
