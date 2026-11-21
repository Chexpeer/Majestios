-- Limite des recherches d'entreprises : un visiteur sans espace personnel voit 20 résultats au plus ; un titulaire connecté voit tout.
-- Appliquée côté serveur (auth.uid() est nul pour la clé publique seule), donc impossible à contourner depuis le navigateur.
-- Retour arrière : réappliquer list_awarded_contracts / top_awarded_winners / list_published_announcements des migrations 20261121200000 et 20261118170000.

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
  -- Visiteur sans espace personnel (aucun utilisateur identifié) : 20 résultats au plus, décalage compris.
  if (select auth.uid()) is null then v_lim := least(v_lim, greatest(20 - v_off, 0)); end if;
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

create or replace function public.top_awarded_winners(
  p_department text default null, p_months integer default 6, p_min_contracts integer default 2, p_limit integer default 20, p_offset integer default 0)
returns table(winner_id text, winner_name text, winner_category text, winner_commune text, winner_dept text, contracts integer, median_amount numeric)
language sql stable security definer set search_path = '' as $$
  select w.winner_id, w.winner_name, w.winner_category, w.winner_commune, w.winner_dept, w.contracts, w.median_amount
  from private.awarded_winners w
  where (p_department is null or w.winner_dept = p_department)
    and w.contracts >= least(greatest(coalesce(p_min_contracts, 2), 1), 50)
  order by w.contracts desc, w.winner_id
  limit case when (select auth.uid()) is null
    then least(least(greatest(coalesce(p_limit, 20), 1), 50), greatest(20 - greatest(coalesce(p_offset, 0), 0), 0))
    else least(greatest(coalesce(p_limit, 20), 1), 50) end
  offset greatest(coalesce(p_offset, 0), 0);
$$;

create or replace function public.list_published_announcements(p_kind text default null, p_department text default null, p_limit integer default 20, p_offset integer default 0)
returns table(reference text, kind text, title text, description text, trade text, department text, area_note text, valid_until date, published_at timestamp with time zone, company text)
language sql stable security definer set search_path = '' as $$
  select a.reference, a.kind, a.title, a.description, a.trade, a.department, a.area_note, a.valid_until, a.published_at, s.company
  from public.announcements a
  left join private.announcement_sources s on s.announcement_id = a.id
  where a.status = 'published' and a.expires_at > now()
    and (p_kind is null or a.kind = p_kind)
    and (p_department is null or a.department = p_department)
  order by a.published_at desc
  limit case when (select auth.uid()) is null
    then least(least(greatest(coalesce(p_limit, 20), 1), 50), greatest(20 - greatest(coalesce(p_offset, 0), 0), 0))
    else least(greatest(coalesce(p_limit, 20), 1), 50) end
  offset greatest(coalesce(p_offset, 0), 0);
$$;
revoke all on function public.list_published_announcements(text, text, integer, integer) from public;
grant execute on function public.list_published_announcements(text, text, integer, integer) to anon, authenticated;
