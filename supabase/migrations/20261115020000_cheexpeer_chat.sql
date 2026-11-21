-- Chat Cheexpeer dans le cockpit (niveaux N0–N2 : dialogue en lecture seule, aucune action directe).
-- Spécification : docs/evolution-9/SPECIFICATION-INVITATIONS-ET-CHAT-CHEEXPEER-2026-11-15.md §B.
-- Garde-fous : interrupteur éteint par défaut (seul le propriétaire interne l'allume), plafonds par jour et par mois,
-- aucun accès direct aux tables, réponses de l'assistant écrites uniquement par la fonction serveur (service_role).
-- Candidat : appliqué d'abord sur MajestiOS-Test uniquement.

create table if not exists private.cheexpeer_chat_settings (
  organization_id uuid primary key references public.organizations(id) on delete cascade,
  enabled boolean not null default false,
  daily_message_cap integer not null default 30 check (daily_message_cap between 1 and 500),
  monthly_message_cap integer not null default 500 check (monthly_message_cap between 1 and 10000),
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);
create table if not exists private.cheexpeer_chat_messages (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  conversation_id uuid not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null check (length(content) between 1 and 12000),
  input_tokens integer check (input_tokens is null or input_tokens >= 0),
  output_tokens integer check (output_tokens is null or output_tokens >= 0),
  created_at timestamptz not null default now()
);
create index if not exists cheexpeer_chat_messages_conv on private.cheexpeer_chat_messages (user_id, conversation_id, created_at);
create index if not exists cheexpeer_chat_messages_org_time on private.cheexpeer_chat_messages (organization_id, role, created_at);
alter table private.cheexpeer_chat_settings enable row level security;
alter table private.cheexpeer_chat_messages enable row level security;
revoke all on private.cheexpeer_chat_settings, private.cheexpeer_chat_messages from public, anon, authenticated;

-- Organisation interne de l'appelant (owner/admin) : renvoie (organization_id, rôle) ou aucune ligne.
create or replace function private.caller_internal_membership()
returns table (organization_id uuid, role text) language sql stable security definer set search_path = '' as $$
  select m.organization_id, m.role
  from public.organization_members m join public.organizations o on o.id = m.organization_id
  where m.user_id = (select auth.uid()) and o.kind = 'internal' and m.role in ('owner', 'admin')
  order by (m.role = 'owner') desc limit 1;
$$;

create or replace function public.cheexpeer_chat_status()
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare v_m record; v_s private.cheexpeer_chat_settings%rowtype; v_day int; v_month int;
begin
  select * into v_m from private.caller_internal_membership();
  if not found then raise exception 'ACCESS_DENIED' using errcode = '42501'; end if;
  select * into v_s from private.cheexpeer_chat_settings s where s.organization_id = v_m.organization_id;
  select count(*) into v_day from private.cheexpeer_chat_messages x where x.organization_id = v_m.organization_id and x.role = 'user' and x.created_at >= date_trunc('day', now());
  select count(*) into v_month from private.cheexpeer_chat_messages x where x.organization_id = v_m.organization_id and x.role = 'user' and x.created_at >= date_trunc('month', now());
  return jsonb_build_object('enabled', coalesce(v_s.enabled, false), 'is_owner', v_m.role = 'owner',
    'daily_cap', coalesce(v_s.daily_message_cap, 30), 'monthly_cap', coalesce(v_s.monthly_message_cap, 500),
    'used_today', v_day, 'used_month', v_month);
end $$;

create or replace function public.set_cheexpeer_chat_enabled(p_enabled boolean)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_m record;
begin
  select * into v_m from private.caller_internal_membership();
  if not found or v_m.role <> 'owner' then raise exception 'ACCESS_DENIED' using errcode = '42501'; end if;
  insert into private.cheexpeer_chat_settings (organization_id, enabled, updated_by) values (v_m.organization_id, coalesce(p_enabled, false), (select auth.uid()))
  on conflict (organization_id) do update set enabled = excluded.enabled, updated_by = excluded.updated_by, updated_at = now();
  return jsonb_build_object('ok', true, 'enabled', coalesce(p_enabled, false));
end $$;

-- Étape 1 d'un échange : droits, interrupteur, plafonds ; enregistre la question et renvoie l'historique récent.
create or replace function public.cheexpeer_chat_prepare(p_conversation uuid, p_message text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_uid uuid := (select auth.uid()); v_m record; v_s private.cheexpeer_chat_settings%rowtype;
  v_conv uuid := coalesce(p_conversation, gen_random_uuid()); v_text text := btrim(coalesce(p_message, ''));
  v_day int; v_month int; v_history jsonb;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED' using errcode = '28000'; end if;
  select * into v_m from private.caller_internal_membership();
  if not found then raise exception 'ACCESS_DENIED' using errcode = '42501'; end if;
  if length(v_text) = 0 then raise exception 'EMPTY_MESSAGE' using errcode = '22023'; end if;
  if length(v_text) > 4000 then raise exception 'MESSAGE_TOO_LONG' using errcode = '22023'; end if;
  select * into v_s from private.cheexpeer_chat_settings s where s.organization_id = v_m.organization_id;
  if not found or not v_s.enabled then raise exception 'CHAT_DISABLED' using errcode = '55000'; end if;
  perform pg_advisory_xact_lock(hashtext('chx-chat:' || v_m.organization_id::text)::bigint);
  select count(*) into v_day from private.cheexpeer_chat_messages x where x.organization_id = v_m.organization_id and x.role = 'user' and x.created_at >= date_trunc('day', now());
  select count(*) into v_month from private.cheexpeer_chat_messages x where x.organization_id = v_m.organization_id and x.role = 'user' and x.created_at >= date_trunc('month', now());
  if v_day >= v_s.daily_message_cap then raise exception 'QUOTA_DAY' using errcode = '54000'; end if;
  if v_month >= v_s.monthly_message_cap then raise exception 'QUOTA_MONTH' using errcode = '54000'; end if;
  if p_conversation is not null and not exists (select 1 from private.cheexpeer_chat_messages x where x.conversation_id = p_conversation and x.user_id = v_uid) then
    raise exception 'CONVERSATION_NOT_FOUND' using errcode = 'P0002'; end if;
  insert into private.cheexpeer_chat_messages (organization_id, conversation_id, user_id, role, content) values (v_m.organization_id, v_conv, v_uid, 'user', v_text);
  select coalesce(jsonb_agg(jsonb_build_object('role', h.role, 'content', h.content) order by h.created_at), '[]'::jsonb) into v_history
  from (select role, content, created_at from private.cheexpeer_chat_messages where conversation_id = v_conv and user_id = v_uid order by created_at desc limit 20) h;
  return jsonb_build_object('ok', true, 'conversation_id', v_conv, 'organization_id', v_m.organization_id, 'history', v_history);
end $$;

-- Étape 2 : enregistrement de la réponse, réservé à la fonction serveur (service_role).
create or replace function public.cheexpeer_chat_record(p_user_id uuid, p_conversation uuid, p_reply text, p_input_tokens integer, p_output_tokens integer)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_org uuid;
begin
  select x.organization_id into v_org from private.cheexpeer_chat_messages x where x.conversation_id = p_conversation and x.user_id = p_user_id limit 1;
  if v_org is null then raise exception 'CONVERSATION_NOT_FOUND' using errcode = 'P0002'; end if;
  insert into private.cheexpeer_chat_messages (organization_id, conversation_id, user_id, role, content, input_tokens, output_tokens)
  values (v_org, p_conversation, p_user_id, 'assistant', left(coalesce(nullif(btrim(p_reply), ''), '(réponse vide)'), 12000), p_input_tokens, p_output_tokens);
  return jsonb_build_object('ok', true);
end $$;

create or replace function public.cheexpeer_chat_history(p_conversation uuid default null)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare v_uid uuid := (select auth.uid()); v_conv uuid := p_conversation;
begin
  if private.caller_internal_rank() is null then raise exception 'ACCESS_DENIED' using errcode = '42501'; end if;
  if v_conv is null then
    select conversation_id into v_conv from private.cheexpeer_chat_messages where user_id = v_uid order by created_at desc limit 1;
  end if;
  if v_conv is null then return jsonb_build_object('conversation_id', null, 'messages', '[]'::jsonb); end if;
  return jsonb_build_object('conversation_id', v_conv, 'messages', coalesce((
    select jsonb_agg(jsonb_build_object('role', role, 'content', content, 'created_at', created_at) order by created_at)
    from private.cheexpeer_chat_messages where conversation_id = v_conv and user_id = v_uid), '[]'::jsonb));
end $$;

create or replace function public.cheexpeer_chat_clear(p_conversation uuid)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_uid uuid := (select auth.uid());
begin
  if private.caller_internal_rank() is null then raise exception 'ACCESS_DENIED' using errcode = '42501'; end if;
  delete from private.cheexpeer_chat_messages where conversation_id = p_conversation and user_id = v_uid;
  return jsonb_build_object('ok', true);
end $$;

revoke all on function public.cheexpeer_chat_status() from public, anon;
revoke all on function public.set_cheexpeer_chat_enabled(boolean) from public, anon;
revoke all on function public.cheexpeer_chat_prepare(uuid, text) from public, anon;
revoke all on function public.cheexpeer_chat_record(uuid, uuid, text, integer, integer) from public, anon, authenticated;
revoke all on function public.cheexpeer_chat_history(uuid) from public, anon;
revoke all on function public.cheexpeer_chat_clear(uuid) from public, anon;
revoke all on function private.caller_internal_membership() from public, anon, authenticated;
grant execute on function public.cheexpeer_chat_status() to authenticated;
grant execute on function public.set_cheexpeer_chat_enabled(boolean) to authenticated;
grant execute on function public.cheexpeer_chat_prepare(uuid, text) to authenticated;
grant execute on function public.cheexpeer_chat_history(uuid) to authenticated;
grant execute on function public.cheexpeer_chat_clear(uuid) to authenticated;
grant execute on function public.cheexpeer_chat_record(uuid, uuid, text, integer, integer) to service_role;
