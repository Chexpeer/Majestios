-- Gestion de l'équipe interne depuis l'administration : liste, changement de rôle, retrait.
-- Principes : aucun accès direct aux tables ; tout passe par des fonctions qui contrôlent les droits côté serveur ;
-- seul un propriétaire modifie ou retire ; on ne peut ni se modifier ni se retirer soi-même ; il reste toujours un propriétaire.
-- Retirer un membre supprime son appartenance (son accès) mais ne supprime pas son compte.
-- Candidat : appliqué d'abord sur MajestiOS-Test uniquement.

create table if not exists private.team_events (
  id uuid primary key default gen_random_uuid(),
  event text not null check (event in ('role_changed', 'member_removed')),
  actor_user_id uuid references auth.users(id) on delete set null,
  target_user_id uuid,
  organization_id uuid,
  old_role text,
  new_role text,
  occurred_at timestamptz not null default now()
);
alter table private.team_events enable row level security;
revoke all on private.team_events from public, anon, authenticated;

create or replace function public.list_internal_team()
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare v_uid uuid := (select auth.uid());
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED' using errcode = '28000'; end if;
  if private.caller_internal_rank() is null then raise exception 'ACCESS_DENIED' using errcode = '42501'; end if;
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'member_id', m.id, 'email', u.email, 'role', m.role, 'created_at', m.created_at,
      'last_sign_in_at', u.last_sign_in_at, 'is_self', m.user_id = v_uid,
      'email_confirmed', u.email_confirmed_at is not null)
      order by case m.role when 'owner' then 0 when 'admin' then 1 when 'member' then 2 else 3 end, m.created_at)
    from public.organization_members m
    join public.organizations o on o.id = m.organization_id and o.kind = 'internal'
    left join auth.users u on u.id = m.user_id), '[]'::jsonb);
end $$;

create or replace function public.set_internal_member_role(p_member_id uuid, p_role text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_uid uuid := (select auth.uid());
  v_target public.organization_members%rowtype;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED' using errcode = '28000'; end if;
  if private.caller_internal_rank() is distinct from 'owner' then raise exception 'ACCESS_DENIED' using errcode = '42501'; end if;
  if p_role not in ('owner', 'admin', 'member', 'viewer') then raise exception 'INVALID_ROLE' using errcode = '22023'; end if;
  select m.* into v_target from public.organization_members m
    join public.organizations o on o.id = m.organization_id and o.kind = 'internal'
   where m.id = p_member_id for update of m;
  if not found then raise exception 'MEMBER_NOT_FOUND' using errcode = 'P0002'; end if;
  if v_target.user_id = v_uid then raise exception 'SELF_CHANGE_FORBIDDEN' using errcode = '42501'; end if;
  if v_target.role = p_role then return jsonb_build_object('ok', true, 'unchanged', true); end if;
  if v_target.role = 'owner' and p_role <> 'owner' and not exists (
       select 1 from public.organization_members m where m.organization_id = v_target.organization_id and m.role = 'owner' and m.id <> v_target.id) then
    raise exception 'LAST_OWNER' using errcode = '42501'; end if;
  update public.organization_members set role = p_role where id = v_target.id;
  insert into private.team_events (event, actor_user_id, target_user_id, organization_id, old_role, new_role)
  values ('role_changed', v_uid, v_target.user_id, v_target.organization_id, v_target.role, p_role);
  return jsonb_build_object('ok', true);
end $$;

create or replace function public.remove_internal_member(p_member_id uuid)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_uid uuid := (select auth.uid());
  v_target public.organization_members%rowtype;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED' using errcode = '28000'; end if;
  if private.caller_internal_rank() is distinct from 'owner' then raise exception 'ACCESS_DENIED' using errcode = '42501'; end if;
  select m.* into v_target from public.organization_members m
    join public.organizations o on o.id = m.organization_id and o.kind = 'internal'
   where m.id = p_member_id for update of m;
  if not found then raise exception 'MEMBER_NOT_FOUND' using errcode = 'P0002'; end if;
  if v_target.user_id = v_uid then raise exception 'SELF_CHANGE_FORBIDDEN' using errcode = '42501'; end if;
  if v_target.role = 'owner' and not exists (
       select 1 from public.organization_members m where m.organization_id = v_target.organization_id and m.role = 'owner' and m.id <> v_target.id) then
    raise exception 'LAST_OWNER' using errcode = '42501'; end if;
  delete from public.organization_members where id = v_target.id;
  insert into private.team_events (event, actor_user_id, target_user_id, organization_id, old_role)
  values ('member_removed', v_uid, v_target.user_id, v_target.organization_id, v_target.role);
  return jsonb_build_object('ok', true);
end $$;

revoke all on function public.list_internal_team() from public, anon;
revoke all on function public.set_internal_member_role(uuid, text) from public, anon;
revoke all on function public.remove_internal_member(uuid) from public, anon;
grant execute on function public.list_internal_team() to authenticated;
grant execute on function public.set_internal_member_role(uuid, text) to authenticated;
grant execute on function public.remove_internal_member(uuid) to authenticated;
