-- Invitations de membres internes et de clients depuis la surface d'administration.
-- Spécification : docs/evolution-9/SPECIFICATION-INVITATIONS-ET-CHAT-CHEEXPEER-2026-11-15.md
-- Principes : aucun accès direct aux tables ; tout passe par des fonctions qui contrôlent les droits côté serveur ;
-- aucun droit accordé avant acceptation ; l'e-mail de la session doit être celui de l'invitation.
-- Candidat : appliqué d'abord sur MajestiOS-Test uniquement.

create table if not exists private.invitations (
  id uuid primary key default gen_random_uuid(),
  email text not null check (email = lower(btrim(email)) and email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' and length(email) <= 254),
  kind text not null check (kind in ('internal', 'client')),
  role text not null check (role in ('owner', 'admin', 'member', 'viewer')),
  organization_id uuid references public.organizations(id) on delete cascade,
  new_organization_name text check (new_organization_name is null or length(btrim(new_organization_name)) between 2 and 120),
  invited_by uuid references auth.users(id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'revoked', 'expired')),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '7 days',
  accepted_at timestamptz,
  accepted_user_id uuid references auth.users(id) on delete set null,
  revoked_at timestamptz,
  constraint invitations_target_check check (
    (kind = 'internal' and organization_id is not null and new_organization_name is null and role in ('admin', 'member', 'viewer'))
    or (kind = 'client' and ((organization_id is not null) <> (new_organization_name is not null)) and (new_organization_name is null or role = 'owner'))
  )
);
create unique index if not exists invitations_one_pending_per_email on private.invitations (email) where status = 'pending';
create index if not exists invitations_inviter_created on private.invitations (invited_by, created_at);

create table if not exists private.invitation_events (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references private.invitations(id) on delete cascade,
  event text not null check (event in ('created', 'delivery_failed', 'revoked', 'accepted', 'expired')),
  actor_user_id uuid references auth.users(id) on delete set null,
  occurred_at timestamptz not null default now()
);

alter table private.invitations enable row level security;
alter table private.invitation_events enable row level security;
revoke all on private.invitations, private.invitation_events from public, anon, authenticated;

-- Rôle interne le plus élevé de l'appelant : 'owner', 'admin' ou null.
create or replace function private.caller_internal_rank()
returns text language sql stable security definer set search_path = '' as $$
  select case
    when bool_or(m.role = 'owner') then 'owner'
    when bool_or(m.role = 'admin') then 'admin'
    else null end
  from public.organization_members m
  join public.organizations o on o.id = m.organization_id
  where m.user_id = (select auth.uid()) and o.kind = 'internal' and m.role in ('owner', 'admin');
$$;

create or replace function public.create_invitation(
  p_email text, p_kind text, p_role text,
  p_organization_id uuid default null, p_new_organization_name text default null)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_uid uuid := (select auth.uid());
  v_rank text;
  v_email text := lower(btrim(coalesce(p_email, '')));
  v_org public.organizations%rowtype;
  v_name text := nullif(btrim(coalesce(p_new_organization_name, '')), '');
  v_role text := p_role;
  v_existing uuid;
  v_id uuid;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED' using errcode = '28000'; end if;
  v_rank := private.caller_internal_rank();
  if v_rank is null then raise exception 'ACCESS_DENIED' using errcode = '42501'; end if;
  if v_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' or length(v_email) > 254 then
    raise exception 'INVALID_EMAIL' using errcode = '22023'; end if;
  if exists (select 1 from auth.users u where u.id = v_uid and lower(u.email) = v_email) then
    raise exception 'SELF_INVITATION' using errcode = '22023'; end if;
  if p_kind not in ('internal', 'client') then raise exception 'INVALID_KIND' using errcode = '22023'; end if;

  -- Quota : 10 invitations par invitant sur 24 h.
  if (select count(*) from private.invitations i where i.invited_by = v_uid and i.created_at > now() - interval '24 hours') >= 10 then
    raise exception 'QUOTA_EXCEEDED' using errcode = '54000'; end if;

  if p_kind = 'internal' then
    select * into v_org from public.organizations o where o.id = p_organization_id and o.kind = 'internal';
    if not found then raise exception 'INVALID_ORGANIZATION' using errcode = '22023'; end if;
    if v_role not in ('admin', 'member', 'viewer') then raise exception 'INVALID_ROLE' using errcode = '22023'; end if;
    if v_role = 'admin' and v_rank <> 'owner' then raise exception 'ACCESS_DENIED' using errcode = '42501'; end if;
    v_name := null;
  else
    if (p_organization_id is not null) = (v_name is not null) then
      raise exception 'INVALID_ORGANIZATION' using errcode = '22023'; end if;
    if p_organization_id is not null then
      select * into v_org from public.organizations o where o.id = p_organization_id and o.kind = 'client';
      if not found then raise exception 'INVALID_ORGANIZATION' using errcode = '22023'; end if;
      if v_role not in ('owner', 'member', 'viewer') then raise exception 'INVALID_ROLE' using errcode = '22023'; end if;
    else
      if length(v_name) not between 2 and 120 then raise exception 'INVALID_ORGANIZATION' using errcode = '22023'; end if;
      v_role := 'owner';
    end if;
  end if;

  if p_organization_id is not null and exists (
       select 1 from public.organization_members m join auth.users u on u.id = m.user_id
       where m.organization_id = p_organization_id and lower(u.email) = v_email) then
    raise exception 'ALREADY_MEMBER' using errcode = '23505'; end if;

  -- Une seule invitation en attente par adresse : on expire d'abord celles dépassées.
  update private.invitations set status = 'expired' where email = v_email and status = 'pending' and expires_at <= now();
  select id into v_existing from private.invitations where email = v_email and status = 'pending';
  if v_existing is not null then raise exception 'ALREADY_PENDING' using errcode = '23505'; end if;

  insert into private.invitations (email, kind, role, organization_id, new_organization_name, invited_by)
  values (v_email, p_kind, v_role, p_organization_id, v_name, v_uid) returning id into v_id;
  insert into private.invitation_events (invitation_id, event, actor_user_id) values (v_id, 'created', v_uid);
  return jsonb_build_object('ok', true, 'invitation_id', v_id, 'email', v_email);
end $$;

create or replace function public.list_invitations(p_limit integer default 100)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
begin
  if private.caller_internal_rank() is null then raise exception 'ACCESS_DENIED' using errcode = '42501'; end if;
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', i.id, 'email', i.email, 'kind', i.kind, 'role', i.role,
      'organization_id', i.organization_id, 'organization_name', coalesce(o.name, i.new_organization_name),
      'status', case when i.status = 'pending' and i.expires_at <= now() then 'expired' else i.status end,
      'created_at', i.created_at, 'expires_at', i.expires_at) order by i.created_at desc)
    from (select * from private.invitations order by created_at desc limit greatest(1, least(coalesce(p_limit, 100), 200))) i
    left join public.organizations o on o.id = i.organization_id), '[]'::jsonb);
end $$;

create or replace function public.list_invitable_organizations()
returns jsonb language plpgsql stable security definer set search_path = '' as $$
begin
  if private.caller_internal_rank() is null then raise exception 'ACCESS_DENIED' using errcode = '42501'; end if;
  return coalesce((select jsonb_agg(jsonb_build_object('id', o.id, 'name', o.name, 'kind', o.kind) order by o.kind, o.name)
                   from public.organizations o where o.kind in ('internal', 'client')), '[]'::jsonb);
end $$;

create or replace function public.revoke_invitation(p_id uuid)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_uid uuid := (select auth.uid()); v_rank text; v_count integer;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED' using errcode = '28000'; end if;
  v_rank := private.caller_internal_rank();
  if v_rank is null then raise exception 'ACCESS_DENIED' using errcode = '42501'; end if;
  update private.invitations set status = 'revoked', revoked_at = now()
   where id = p_id and status = 'pending' and (v_rank = 'owner' or invited_by = v_uid);
  get diagnostics v_count = row_count;
  if v_count = 0 then raise exception 'INVITATION_NOT_FOUND' using errcode = 'P0002'; end if;
  insert into private.invitation_events (invitation_id, event, actor_user_id) values (p_id, 'revoked', v_uid);
  return jsonb_build_object('ok', true);
end $$;

-- Acceptation par l'invité, une fois connecté : l'adresse de la session doit être celle de l'invitation.
create or replace function public.accept_invitation(p_notice_version text default null)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_uid uuid := (select auth.uid());
  v_user auth.users%rowtype;
  v_inv private.invitations%rowtype;
  v_org_id uuid;
  v_slug text;
  v_other integer;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED' using errcode = '28000'; end if;
  select * into v_user from auth.users u where u.id = v_uid;
  if not found or v_user.email_confirmed_at is null then raise exception 'EMAIL_NOT_CONFIRMED' using errcode = '23514'; end if;
  perform pg_advisory_xact_lock(hashtext(v_uid::text)::bigint);

  update private.invitations set status = 'expired' where email = lower(v_user.email) and status = 'pending' and expires_at <= now();
  select * into v_inv from private.invitations i where i.email = lower(v_user.email) and i.status = 'pending' for update;
  if not found then
    select * into v_inv from private.invitations i where i.email = lower(v_user.email) and i.status = 'accepted' and i.accepted_user_id = v_uid order by accepted_at desc limit 1;
    if found then return jsonb_build_object('ok', true, 'already_accepted', true, 'kind', v_inv.kind, 'organization_id', v_inv.organization_id, 'role', v_inv.role); end if;
    raise exception 'INVITATION_NOT_FOUND' using errcode = 'P0002';
  end if;

  if v_inv.kind = 'client' and p_notice_version is distinct from '2026-11-05' then
    raise exception 'NOTICE_REQUIRED' using errcode = '23514'; end if;

  -- Un compte ne mélange pas les mondes : interne, client et partenaire restent séparés.
  select count(*) into v_other from public.organization_members m join public.organizations o on o.id = m.organization_id
   where m.user_id = v_uid and o.kind <> case v_inv.kind when 'internal' then 'internal' else 'client' end;
  if v_other > 0 then raise exception 'ACCOUNT_CONFLICT' using errcode = '23505'; end if;

  if v_inv.kind = 'client' and v_inv.organization_id is null then
    v_slug := coalesce(nullif(regexp_replace(lower(v_inv.new_organization_name), '[^a-z0-9]+', '-', 'g'), ''), 'espace-client');
    v_slug := trim(both '-' from left(v_slug, 48)) || '-' || left(gen_random_uuid()::text, 8);
    insert into public.organizations (name, slug, kind, created_by) values (btrim(v_inv.new_organization_name), v_slug, 'client', v_uid) returning id into v_org_id;
  else
    v_org_id := v_inv.organization_id;
  end if;

  insert into public.organization_members (organization_id, user_id, role) values (v_org_id, v_uid, v_inv.role)
  on conflict (organization_id, user_id) do nothing;
  insert into public.profiles (id) values (v_uid) on conflict (id) do nothing;
  if v_inv.kind = 'client' then
    insert into public.privacy_acknowledgments (user_id, organization_id, notice_version) values (v_uid, v_org_id, p_notice_version)
    on conflict (user_id, organization_id, notice_version) do nothing;
  end if;

  update private.invitations set status = 'accepted', accepted_at = now(), accepted_user_id = v_uid where id = v_inv.id;
  insert into private.invitation_events (invitation_id, event, actor_user_id) values (v_inv.id, 'accepted', v_uid);
  return jsonb_build_object('ok', true, 'kind', v_inv.kind, 'organization_id', v_org_id, 'role', v_inv.role);
end $$;

-- Journal d'un échec d'envoi (appelé par la fonction serveur avec le jeton de l'invitant) : l'invitation est révoquée.
create or replace function public.fail_invitation_delivery(p_id uuid)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_uid uuid := (select auth.uid()); v_count integer;
begin
  if private.caller_internal_rank() is null then raise exception 'ACCESS_DENIED' using errcode = '42501'; end if;
  update private.invitations set status = 'revoked', revoked_at = now() where id = p_id and status = 'pending' and invited_by = v_uid;
  get diagnostics v_count = row_count;
  if v_count > 0 then insert into private.invitation_events (invitation_id, event, actor_user_id) values (p_id, 'delivery_failed', v_uid); end if;
  return jsonb_build_object('ok', true);
end $$;

revoke all on function public.create_invitation(text, text, text, uuid, text) from public, anon;
revoke all on function public.list_invitations(integer) from public, anon;
revoke all on function public.list_invitable_organizations() from public, anon;
revoke all on function public.revoke_invitation(uuid) from public, anon;
revoke all on function public.accept_invitation(text) from public, anon;
revoke all on function public.fail_invitation_delivery(uuid) from public, anon;
revoke all on function private.caller_internal_rank() from public, anon, authenticated;
grant execute on function public.create_invitation(text, text, text, uuid, text) to authenticated;
grant execute on function public.list_invitations(integer) to authenticated;
grant execute on function public.list_invitable_organizations() to authenticated;
grant execute on function public.revoke_invitation(uuid) to authenticated;
grant execute on function public.accept_invitation(text) to authenticated;
grant execute on function public.fail_invitation_delivery(uuid) to authenticated;
