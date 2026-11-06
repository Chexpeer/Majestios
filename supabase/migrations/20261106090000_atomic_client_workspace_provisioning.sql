-- Provisionnement client atomique : organisation, propriétaire, profil et preuve de prise de connaissance.
-- Cette fonction remplace les écritures successives de la fonction Edge.
create or replace function public.provision_client_workspace(
  p_user_id uuid,
  p_organization_name text,
  p_slug text,
  p_display_name text,
  p_phone text,
  p_notice_version text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_confirmed_at timestamptz;
  v_client_count integer;
  v_other_count integer;
  v_org public.organizations%rowtype;
begin
  if coalesce(auth.role(), '') <> 'service_role' then
    raise exception 'Service role required' using errcode = '42501';
  end if;

  if p_user_id is null
     or nullif(btrim(p_organization_name), '') is null
     or nullif(btrim(p_slug), '') is null then
    raise exception 'User, organization name and slug are required' using errcode = '22004';
  end if;

  if p_notice_version is distinct from '2026-11-05' then
    raise exception 'Privacy notice version is not current' using errcode = '23514';
  end if;

  -- Serialize concurrent provisioning attempts for the same Auth user.
  perform pg_advisory_xact_lock(hashtext(p_user_id::text)::bigint);

  select u.email_confirmed_at
    into v_confirmed_at
  from auth.users u
  where u.id = p_user_id;

  if not found or v_confirmed_at is null then
    raise exception 'The Auth user must exist and have a confirmed email' using errcode = '23514';
  end if;

  select
    count(*) filter (where o.kind = 'client'),
    count(*) filter (where o.kind <> 'client')
  into v_client_count, v_other_count
  from public.organization_members m
  join public.organizations o on o.id = m.organization_id
  where m.user_id = p_user_id;

  if v_other_count > 0 then
    raise exception 'This account already belongs to an internal or partner organization' using errcode = '23505';
  end if;

  if v_client_count > 1 then
    raise exception 'This account is linked to multiple client workspaces; manual review is required' using errcode = '23505';
  end if;

  if v_client_count = 1 then
    select o.*
      into strict v_org
    from public.organizations o
    join public.organization_members m on m.organization_id = o.id
    where m.user_id = p_user_id and o.kind = 'client'
    limit 1;

    insert into public.privacy_acknowledgments(user_id, organization_id, notice_version)
    values (p_user_id, v_org.id, p_notice_version)
    on conflict (user_id, organization_id, notice_version) do nothing;

    insert into public.profiles(id, display_name, phone)
    values (p_user_id, nullif(btrim(p_display_name), ''), nullif(btrim(p_phone), ''))
    on conflict (id) do update set
      display_name = coalesce(excluded.display_name, public.profiles.display_name),
      phone = coalesce(excluded.phone, public.profiles.phone);

    return jsonb_build_object(
      'ok', true,
      'existing', true,
      'organization', jsonb_build_object(
        'id', v_org.id, 'name', v_org.name, 'slug', v_org.slug, 'kind', v_org.kind
      )
    );
  end if;

  insert into public.organizations(name, slug, kind, created_by)
  values (btrim(p_organization_name), p_slug, 'client', p_user_id)
  returning * into v_org;

  insert into public.organization_members(organization_id, user_id, role)
  values (v_org.id, p_user_id, 'owner');

  insert into public.privacy_acknowledgments(user_id, organization_id, notice_version)
  values (p_user_id, v_org.id, p_notice_version)
  on conflict (user_id, organization_id, notice_version) do nothing;

  insert into public.profiles(id, display_name, phone)
  values (p_user_id, nullif(btrim(p_display_name), ''), nullif(btrim(p_phone), ''))
  on conflict (id) do update set
    display_name = coalesce(excluded.display_name, public.profiles.display_name),
    phone = coalesce(excluded.phone, public.profiles.phone);

  return jsonb_build_object(
    'ok', true,
    'existing', false,
    'organization', jsonb_build_object(
      'id', v_org.id, 'name', v_org.name, 'slug', v_org.slug, 'kind', v_org.kind
    )
  );
end;
$$;

revoke all on function public.provision_client_workspace(uuid, text, text, text, text, text)
  from public, anon, authenticated;
grant execute on function public.provision_client_workspace(uuid, text, text, text, text, text)
  to service_role;

comment on function public.provision_client_workspace(uuid, text, text, text, text, text) is
'Atomic, idempotent client workspace provisioning. Service-role only; serializes concurrent requests per Auth user and records the current privacy acknowledgment.';

notify pgrst, 'reload schema';
