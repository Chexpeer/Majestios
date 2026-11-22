-- Cheexpeer — opportunités après attribution : le moteur lit aussi la catégorie et la commune de l'acheteur,
-- pour situer le chantier (marché d'une commune) et calculer la distance des entreprises. Lecture seule, service_role uniquement.
drop function if exists public.cheexpeer_worker_read_awarded_contract(text);
create function public.cheexpeer_worker_read_awarded_contract(p_contract_uid text)
returns table(contract_uid text, winner_id text, winner_name text, winner_category text, winner_dept text, object text, amount numeric,
  amount_flag text, duration_months integer, cpv text, buyer_name text, subcontracting_declared boolean, awarded_on date, procedure text,
  buyer_category text, buyer_commune text, buyer_dept text)
language sql stable security definer set search_path to ''
as $function$
  select c.contract_uid, c.winner_id, c.winner_name, c.winner_category, c.winner_dept, c.object, c.amount, c.amount_flag,
         c.duration_months, c.cpv, c.buyer_name, c.subcontracting_declared, c.awarded_on, c.procedure,
         c.buyer_category, c.buyer_commune, c.buyer_dept
  from private.awarded_contracts c
  where c.contract_uid = p_contract_uid
  order by c.winner_name nulls last
  limit 10;
$function$;
revoke all on function public.cheexpeer_worker_read_awarded_contract(text) from public, anon, authenticated;
grant execute on function public.cheexpeer_worker_read_awarded_contract(text) to service_role;
