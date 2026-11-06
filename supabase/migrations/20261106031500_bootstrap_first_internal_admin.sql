-- MajestiOS: one-time bootstrap for the first internal administrator.
-- This migration only installs the guarded procedure. It does NOT create a user
-- or grant membership. Execute manually after creating and confirming the Auth user.
create or replace function private.bootstrap_first_internal_admin(p_user_id uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_org_id uuid;
  v_user_confirmed timestamptz;
  v_membership_id uuid;
begin
  if p_user_id is null then
    raise exception 'A valid Auth user ID is required' using errcode = '22004';
  end if;

  -- Serialize concurrent bootstrap attempts so only one can become the first owner.
  perform pg_advisory_xact_lock(2026110601);

  select email_confirmed_at into v_user_confirmed
  from auth.users
  where id = p_user_id;

  if not found or v_user_confirmed is null then
    raise exception 'The Auth user must exist and have a confirmed email' using errcode = '23514';
  end if;

  if exists (
    select 1
    from public.organization_members m
    join public.organizations o on o.id = m.organization_id
    where o.kind = 'internal'
      and m.role in ('owner','admin')
  ) then
    raise exception 'Initial internal administrator is already bootstrapped' using errcode = '23505';
  end if;

  select id into v_org_id
  from public.organizations
  where kind = 'internal'
  order by created_at asc
  limit 1;

  if v_org_id is null then
    raise exception 'Internal MajestiOS organization was not found' using errcode = 'P0002';
  end if;

  if exists (
    select 1 from public.organization_members
    where user_id = p_user_id
  ) then
    raise exception 'This user already has an organization membership' using errcode = '23505';
  end if;

  insert into public.organization_members(organization_id, user_id, role)
  values (v_org_id, p_user_id, 'owner')
  returning id into v_membership_id;

  return v_membership_id;
end;
$$;

grant usage on schema private to service_role;
revoke all on function private.bootstrap_first_internal_admin(uuid) from public, anon, authenticated;
grant execute on function private.bootstrap_first_internal_admin(uuid) to service_role;

comment on function private.bootstrap_first_internal_admin(uuid) is
'One-time, service-role-only bootstrap. Requires a confirmed Auth user and no existing internal owner/admin. Does not create Auth users.';
