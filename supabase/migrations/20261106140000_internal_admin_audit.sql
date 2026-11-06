-- Journal des opérations d'administration interne MajestiOS.
create table if not exists public.internal_admin_audit (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  actor_user_id uuid not null references auth.users(id) on delete restrict,
  target_user_id uuid references auth.users(id) on delete set null,
  action text not null check (action in ('invite_user','change_role','remove_member')),
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists internal_admin_audit_org_created_idx
  on public.internal_admin_audit (organization_id, created_at desc);
alter table public.internal_admin_audit enable row level security;
create policy "Internal administrators can read admin audit"
  on public.internal_admin_audit for select to authenticated
  using (
    exists (
      select 1 from public.organization_members m
      where m.organization_id = internal_admin_audit.organization_id
        and m.user_id = (select auth.uid())
        and m.role in ('owner','admin')
    )
  );
revoke all on public.internal_admin_audit from anon, authenticated;
grant select on public.internal_admin_audit to authenticated;
comment on table public.internal_admin_audit is
  'Journal des opérations de gestion des membres internes. Écritures réalisées par les fonctions SECURITY DEFINER de gestion des rôles et des appartenances.';

create or replace function public.manage_internal_member_role(p_membership_id uuid, p_role text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_actor uuid := auth.uid();
  v_org_id uuid;
  v_actor_role text;
  v_target public.organization_members%rowtype;
begin
  if v_actor is null then raise exception 'Authentification requise.' using errcode = '28000'; end if;
  if p_role not in ('admin','member','viewer') then raise exception 'Rôle non autorisé.' using errcode = '22023'; end if;

  select o.id, m.role into v_org_id, v_actor_role
  from public.organizations o
  join public.organization_members m on m.organization_id = o.id
  where o.kind = 'internal' and m.user_id = v_actor
  limit 1;
  if v_org_id is null or v_actor_role not in ('owner','admin') then
    raise exception 'Droits administrateur requis.' using errcode = '42501';
  end if;

  select * into v_target from public.organization_members
  where id = p_membership_id and organization_id = v_org_id for update;
  if not found then raise exception 'Membre introuvable.' using errcode = 'P0002'; end if;
  if v_target.role = 'owner' or v_target.user_id = v_actor then
    raise exception 'Le rôle propriétaire ou votre propre rôle ne peut pas être modifié ici.' using errcode = '42501';
  end if;
  if v_actor_role <> 'owner' and (v_target.role = 'admin' or p_role = 'admin') then
    raise exception 'Seul le propriétaire peut gérer les administrateurs.' using errcode = '42501';
  end if;

  update public.organization_members set role = p_role where id = p_membership_id;
  insert into public.internal_admin_audit(organization_id, actor_user_id, target_user_id, action, details)
  values (v_org_id, v_actor, v_target.user_id, 'change_role',
    jsonb_build_object('from', v_target.role, 'to', p_role));
end;
$$;

create or replace function public.remove_internal_member(p_membership_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_actor uuid := auth.uid();
  v_org_id uuid;
  v_actor_role text;
  v_target public.organization_members%rowtype;
begin
  if v_actor is null then raise exception 'Authentification requise.' using errcode = '28000'; end if;

  select o.id, m.role into v_org_id, v_actor_role
  from public.organizations o
  join public.organization_members m on m.organization_id = o.id
  where o.kind = 'internal' and m.user_id = v_actor
  limit 1;
  if v_org_id is null or v_actor_role not in ('owner','admin') then
    raise exception 'Droits administrateur requis.' using errcode = '42501';
  end if;

  select * into v_target from public.organization_members
  where id = p_membership_id and organization_id = v_org_id for update;
  if not found then raise exception 'Membre introuvable.' using errcode = 'P0002'; end if;
  if v_target.role = 'owner' or v_target.user_id = v_actor then
    raise exception 'Le propriétaire ou votre propre compte ne peut pas être retiré ici.' using errcode = '42501';
  end if;
  if v_actor_role <> 'owner' and v_target.role = 'admin' then
    raise exception 'Seul le propriétaire peut retirer un administrateur.' using errcode = '42501';
  end if;

  delete from public.organization_members where id = p_membership_id;
  insert into public.internal_admin_audit(organization_id, actor_user_id, target_user_id, action, details)
  values (v_org_id, v_actor, v_target.user_id, 'remove_member',
    jsonb_build_object('previous_role', v_target.role));
end;
$$;

revoke all on function public.manage_internal_member_role(uuid, text) from public, anon;
revoke all on function public.remove_internal_member(uuid) from public, anon;
grant execute on function public.manage_internal_member_role(uuid, text) to authenticated;
grant execute on function public.remove_internal_member(uuid) to authenticated;
comment on function public.manage_internal_member_role(uuid, text) is
  'Changes a member role in the internal MajestiOS organization. Owner/admin permissions are enforced server-side and audited.';
comment on function public.remove_internal_member(uuid) is
  'Removes a member from the internal MajestiOS organization. Owner/admin permissions are enforced server-side and audited.';
