-- Cheexpeer — quotas persistants pour les audits de Réputation virtuelle.
-- Limites de départ : 5 audits / membre / jour UTC et 25 audits / organisation / jour UTC.
-- Migration versionnée dans GitHub uniquement ; aucune application à Supabase sans autorisation.

create table if not exists private.reputation_audit_usage (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  usage_date date not null,
  request_count integer not null default 0 check (request_count >= 0),
  primary key (organization_id, user_id, usage_date)
);

create index if not exists reputation_audit_usage_org_date_idx
  on private.reputation_audit_usage (organization_id, usage_date);

revoke all on table private.reputation_audit_usage from public, anon, authenticated, service_role;

create or replace function private.consume_reputation_audit_quota(p_organization_id uuid)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_usage_date date := (now() at time zone 'UTC')::date;
  v_user_count integer := 0;
  v_org_count integer := 0;
begin
  if v_user_id is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  if p_organization_id is null or not (select private.is_org_member(p_organization_id)) then
    raise exception 'Organization membership required' using errcode = '42501';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(p_organization_id::text, 0)
  );

  delete from private.reputation_audit_usage
   where organization_id = p_organization_id
     and usage_date < v_usage_date - 90;

  select coalesce(sum(request_count), 0)::integer
    into v_org_count
    from private.reputation_audit_usage
   where organization_id = p_organization_id
     and usage_date = v_usage_date;

  select coalesce(sum(request_count), 0)::integer
    into v_user_count
    from private.reputation_audit_usage
   where organization_id = p_organization_id
     and user_id = v_user_id
     and usage_date = v_usage_date;

  if v_user_count >= 5 or v_org_count >= 25 then
    return false;
  end if;

  insert into private.reputation_audit_usage (
    organization_id, user_id, usage_date, request_count
  ) values (
    p_organization_id, v_user_id, v_usage_date, 1
  )
  on conflict (organization_id, user_id, usage_date)
  do update set request_count = private.reputation_audit_usage.request_count + 1;

  return true;
end;
$$;

revoke all on function private.consume_reputation_audit_quota(uuid) from public, anon;
grant execute on function private.consume_reputation_audit_quota(uuid) to authenticated;

create or replace function public.consume_reputation_audit_quota(p_organization_id uuid)
returns boolean
language sql
security invoker
set search_path = ''
as $$
  select private.consume_reputation_audit_quota(p_organization_id);
$$;

revoke all on function public.consume_reputation_audit_quota(uuid) from public, anon;
grant execute on function public.consume_reputation_audit_quota(uuid) to authenticated;

comment on function private.consume_reputation_audit_quota(uuid) is
'Consomme atomiquement un quota Cheexpeer : 5 audits par membre et par jour UTC, 25 par organisation et par jour UTC.';
