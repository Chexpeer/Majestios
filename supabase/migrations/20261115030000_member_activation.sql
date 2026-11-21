-- Activation d'un espace personnel : le compte reste « en attente » (10 jours) tant qu'un mot de passe sécurisé n'est pas créé.
-- L'espace (organisation + rattachement) n'est créé qu'après activation, par la fonction serveur provision-client-workspace.
create table if not exists private.member_activations (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  deadline timestamptz not null default now() + interval '10 days',
  activated_at timestamptz,
  last_reminder_at timestamptz,
  reminder_count integer not null default 0 check (reminder_count >= 0)
);
alter table private.member_activations enable row level security;
revoke all on private.member_activations from public, anon, authenticated;

-- Appelée par la personne connectée après vérification du code : ouvre (ou renouvelle) la période d'activation.
create or replace function public.start_member_activation()
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_uid uuid := auth.uid();
  v_confirmed timestamptz;
  v_row private.member_activations%rowtype;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED' using errcode = '42501'; end if;
  select u.email_confirmed_at into v_confirmed from auth.users u where u.id = v_uid;
  if v_confirmed is null then raise exception 'EMAIL_NOT_CONFIRMED' using errcode = '42501'; end if;
  if exists (select 1 from public.organization_members m where m.user_id = v_uid) then
    return jsonb_build_object('state', 'active');
  end if;
  insert into private.member_activations (user_id) values (v_uid)
  on conflict (user_id) do update
    set deadline = case when private.member_activations.deadline < now() then now() + interval '10 days' else private.member_activations.deadline end
  returning * into v_row;
  return jsonb_build_object('state', 'pending', 'deadline', v_row.deadline);
end $$;

-- État d'activation de la personne connectée (pour l'alerte à l'écran).
create or replace function public.member_activation_status()
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare
  v_uid uuid := auth.uid();
  v_row private.member_activations%rowtype;
  v_pwd boolean;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED' using errcode = '42501'; end if;
  select (coalesce(u.encrypted_password, '') <> '') into v_pwd from auth.users u where u.id = v_uid;
  if exists (select 1 from public.organization_members m where m.user_id = v_uid) then
    return jsonb_build_object('state', 'active', 'has_password', coalesce(v_pwd, false));
  end if;
  select * into v_row from private.member_activations a where a.user_id = v_uid;
  if not found then return jsonb_build_object('state', 'none', 'has_password', coalesce(v_pwd, false)); end if;
  return jsonb_build_object(
    'state', case when v_row.deadline < now() then 'expired' else 'pending' end,
    'deadline', v_row.deadline, 'has_password', coalesce(v_pwd, false));
end $$;

-- Réservées à la fonction serveur : un mot de passe existe-t-il, et l'activation est-elle dans les délais ?
create or replace function public.member_ready_for_workspace(p_user_id uuid)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare v_pwd boolean; v_row private.member_activations%rowtype;
begin
  select (coalesce(u.encrypted_password, '') <> '') into v_pwd from auth.users u where u.id = p_user_id;
  select * into v_row from private.member_activations a where a.user_id = p_user_id;
  return jsonb_build_object(
    'has_password', coalesce(v_pwd, false),
    'has_activation', found,
    'expired', found and v_row.deadline < now());
end $$;

create or replace function public.complete_member_activation(p_user_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
begin
  update private.member_activations set activated_at = coalesce(activated_at, now()) where user_id = p_user_id;
end $$;

revoke all on function public.start_member_activation() from public, anon;
revoke all on function public.member_activation_status() from public, anon;
grant execute on function public.start_member_activation() to authenticated;
grant execute on function public.member_activation_status() to authenticated;
revoke all on function public.member_ready_for_workspace(uuid) from public, anon, authenticated;
revoke all on function public.complete_member_activation(uuid) from public, anon, authenticated;
grant execute on function public.member_ready_for_workspace(uuid) to service_role;
grant execute on function public.complete_member_activation(uuid) to service_role;
