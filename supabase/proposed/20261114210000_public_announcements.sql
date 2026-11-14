-- PROPOSITION — NON APPLIQUÉE. Annonces gratuites de sous-traitance (appels d'offres privés).
-- Ce fichier est volontairement hors de supabase/migrations : il ne doit être appliqué
-- qu'après validation écrite du porteur (voir docs/evolution-9/SPECIFICATION-ANNONCES-SOUS-TRAITANCE-2026-11-14.md)
-- et d'abord sur une copie isolée (MajestiOS-Test ou branche Supabase), jamais directement sur le projet principal.
--
-- Principes : le visiteur n'a AUCUN accès direct aux tables ; il passe par des fonctions qui valident,
-- limitent le débit et n'exposent jamais les coordonnées. Toute annonce est relue avant publication.

create schema if not exists private;

-- 1. Annonces (contenu publiable, sans coordonnées) ---------------------------------------------
create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique default ('AN-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))),
  kind text not null check (kind in ('subcontract_need', 'subcontract_offer')),
  status text not null default 'pending' check (status in ('pending', 'published', 'rejected', 'withdrawn', 'expired')),
  title text not null check (char_length(title) between 8 and 120),
  description text not null check (char_length(description) between 30 and 2000),
  trade text not null check (char_length(trade) between 2 and 80),
  department text check (department ~ '^(0[1-9]|[1-8][0-9]|9[0-5]|2[AB]|97[1-6])$'),
  area_note text check (char_length(area_note) <= 200),
  valid_until date,
  consent_notice_version text not null,
  consent_recorded_at timestamptz not null default now(),
  submitter_hash text not null,
  published_at timestamptz,
  expires_at timestamptz,
  moderated_by uuid references auth.users(id) on delete set null,
  moderated_at timestamptz,
  moderation_note text check (char_length(moderation_note) <= 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (status <> 'published' or (published_at is not null and expires_at is not null))
);
create index announcements_status_created_idx on public.announcements(status, created_at desc);
create index announcements_public_idx on public.announcements(kind, department, published_at desc) where status = 'published';
create index announcements_submitter_idx on public.announcements(submitter_hash, created_at desc);
create index announcements_moderated_by_idx on public.announcements(moderated_by);
create trigger announcements_set_updated_at before update on public.announcements for each row execute function public.set_updated_at();

-- 2. Coordonnées de l'auteur : jamais exposées publiquement ----------------------------------------
create table private.announcement_contacts (
  announcement_id uuid primary key references public.announcements(id) on delete cascade,
  contact_name text not null check (char_length(contact_name) between 2 and 120),
  email text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and char_length(email) <= 254),
  email_hash text not null,
  phone text check (char_length(phone) <= 30),
  created_at timestamptz not null default now()
);
create index announcement_contacts_email_hash_idx on private.announcement_contacts(email_hash, created_at desc);

-- 3. Demandes de mise en relation (relayées par l'équipe, jamais en direct) ------------------------
create table private.announcement_introductions (
  id uuid primary key default gen_random_uuid(),
  announcement_id uuid not null references public.announcements(id) on delete cascade,
  requester_name text not null check (char_length(requester_name) between 2 and 120),
  requester_email text not null check (requester_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and char_length(requester_email) <= 254),
  requester_hash text not null,
  message text not null check (char_length(message) between 20 and 1000),
  consent_notice_version text not null,
  status text not null default 'received' check (status in ('received', 'relayed', 'closed')),
  created_at timestamptz not null default now()
);
create index announcement_introductions_announcement_idx on private.announcement_introductions(announcement_id, created_at desc);
create index announcement_introductions_requester_idx on private.announcement_introductions(requester_hash, created_at desc);

-- 4. Journal append-only ---------------------------------------------------------------------------
create table private.announcement_events (
  id bigint generated always as identity primary key,
  announcement_id uuid not null references public.announcements(id) on delete cascade,
  event text not null check (event in ('submitted', 'published', 'rejected', 'edited', 'withdrawn', 'expired', 'introduction_received')),
  actor uuid references auth.users(id) on delete set null,
  note text check (char_length(note) <= 500),
  created_at timestamptz not null default now()
);
create index announcement_events_announcement_idx on private.announcement_events(announcement_id, created_at);
create index announcement_events_actor_idx on private.announcement_events(actor);

-- 5. Verrouillage : aucune lecture ni écriture directe ---------------------------------------------
alter table public.announcements enable row level security;
alter table private.announcement_contacts enable row level security;
alter table private.announcement_introductions enable row level security;
alter table private.announcement_events enable row level security;
revoke all on public.announcements from anon, authenticated;
revoke all on private.announcement_contacts, private.announcement_introductions, private.announcement_events from anon, authenticated;
revoke all on sequence private.announcement_events_id_seq from anon, authenticated;
create policy announcements_no_direct_access on public.announcements for all to anon, authenticated using (false) with check (false);
create policy announcement_contacts_no_direct_access on private.announcement_contacts for all to anon, authenticated using (false) with check (false);
create policy announcement_introductions_no_direct_access on private.announcement_introductions for all to anon, authenticated using (false) with check (false);
create policy announcement_events_no_direct_access on private.announcement_events for all to anon, authenticated using (false) with check (false);

-- 6. Outils internes -------------------------------------------------------------------------------
-- Relecteur = propriétaire ou administrateur de l'organisation interne (accès VIP). Le rôle « member » est exclu.
create or replace function private.announcement_is_moderator()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists(
    select 1 from public.organization_members m join public.organizations o on o.id = m.organization_id
    where m.user_id = (select auth.uid()) and o.kind = 'internal' and m.role in ('owner', 'admin'));
$$;
revoke all on function private.announcement_is_moderator() from public, anon, authenticated;

create or replace function private.announcement_caller_hash()
returns text language sql stable security definer set search_path = '' as $$
  select encode(sha256(convert_to(
    coalesce(nullif(split_part(coalesce(current_setting('request.headers', true)::json ->> 'x-forwarded-for', ''), ',', 1), ''), 'inconnu')
    || '|' || to_char(now() at time zone 'utc', 'YYYY-MM-DD'), 'utf8')), 'hex');
$$;
revoke all on function private.announcement_caller_hash() from public, anon, authenticated;

-- 7. Dépôt d'une annonce par un visiteur -----------------------------------------------------------
create or replace function public.submit_announcement(
  p_kind text, p_title text, p_description text, p_trade text, p_department text, p_area_note text,
  p_valid_until date, p_contact_name text, p_email text, p_phone text,
  p_consent boolean, p_notice_version text, p_website text default null
) returns text
language plpgsql security definer set search_path = '' as $$
declare
  v_hash text := private.announcement_caller_hash();
  v_email text := lower(trim(coalesce(p_email, '')));
  v_email_hash text := encode(sha256(convert_to(lower(trim(coalesce(p_email, ''))), 'utf8')), 'hex');
  v_id uuid;
  v_ref text;
begin
  -- Piège à robots : un champ caché rempli est ignoré sans signaler l'échec.
  if coalesce(p_website, '') <> '' then return 'AN-IGNORE'; end if;
  if p_consent is distinct from true or coalesce(p_notice_version, '') = '' then raise exception 'consent_required' using errcode = 'P0001'; end if;
  if p_kind not in ('subcontract_need', 'subcontract_offer') then raise exception 'invalid_kind' using errcode = 'P0001'; end if;
  if char_length(trim(coalesce(p_title, ''))) not between 8 and 120
     or char_length(trim(coalesce(p_description, ''))) not between 30 and 2000
     or char_length(trim(coalesce(p_trade, ''))) not between 2 and 80
     or char_length(trim(coalesce(p_contact_name, ''))) not between 2 and 120 then
    raise exception 'invalid_text' using errcode = 'P0001';
  end if;
  if v_email !~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' then raise exception 'invalid_email' using errcode = 'P0001'; end if;
  -- Pas de lien ni de coordonnées dans le texte public : les mises en relation passent par MajestiOS.
  if (p_title || ' ' || p_description || ' ' || coalesce(p_area_note, '')) ~* '(https?://|www\.|[^@\s]+@[^@\s]+\.[a-z]{2,}|(\+33|0)[1-9]([ .-]?[0-9]{2}){4})' then
    raise exception 'contact_in_text' using errcode = 'P0001';
  end if;
  if p_department is not null and p_department !~ '^(0[1-9]|[1-8][0-9]|9[0-5]|2[AB]|97[1-6])$' then raise exception 'invalid_department' using errcode = 'P0001'; end if;
  if p_valid_until is not null and (p_valid_until < current_date or p_valid_until > current_date + 365) then raise exception 'invalid_date' using errcode = 'P0001'; end if;
  -- Limites de débit et de file : 3 dépôts par jour et par origine, 3 par adresse, 300 annonces en attente au maximum.
  if (select count(*) from public.announcements a where a.submitter_hash = v_hash and a.created_at > now() - interval '24 hours') >= 3
     or (select count(*) from private.announcement_contacts c where c.email_hash = v_email_hash and c.created_at > now() - interval '24 hours') >= 3 then
    raise exception 'rate_limited' using errcode = 'P0001';
  end if;
  if (select count(*) from public.announcements a where a.status = 'pending') >= 300 then raise exception 'queue_full' using errcode = 'P0001'; end if;

  insert into public.announcements(kind, title, description, trade, department, area_note, valid_until, consent_notice_version, submitter_hash)
  values (p_kind, trim(p_title), trim(p_description), trim(p_trade), nullif(p_department, ''), nullif(trim(coalesce(p_area_note, '')), ''), p_valid_until, p_notice_version, v_hash)
  returning id, reference into v_id, v_ref;
  insert into private.announcement_contacts(announcement_id, contact_name, email, email_hash, phone)
  values (v_id, trim(p_contact_name), v_email, v_email_hash, nullif(trim(coalesce(p_phone, '')), ''));
  insert into private.announcement_events(announcement_id, event) values (v_id, 'submitted');
  return v_ref;
end;
$$;

-- 8. Lecture publique : uniquement les annonces publiées, jamais les coordonnées ----------------------
create or replace function public.list_published_announcements(
  p_kind text default null, p_department text default null, p_limit integer default 20, p_offset integer default 0
) returns table (reference text, kind text, title text, description text, trade text, department text, area_note text, valid_until date, published_at timestamptz)
language sql stable security definer set search_path = '' as $$
  select a.reference, a.kind, a.title, a.description, a.trade, a.department, a.area_note, a.valid_until, a.published_at
  from public.announcements a
  where a.status = 'published' and a.expires_at > now()
    and (p_kind is null or a.kind = p_kind)
    and (p_department is null or a.department = p_department)
  order by a.published_at desc
  limit least(greatest(coalesce(p_limit, 20), 1), 50) offset greatest(coalesce(p_offset, 0), 0);
$$;

-- 9. Demande de mise en relation (relayée par l'équipe) -------------------------------------------------
create or replace function public.request_announcement_introduction(
  p_reference text, p_name text, p_email text, p_message text, p_consent boolean, p_notice_version text, p_website text default null
) returns boolean
language plpgsql security definer set search_path = '' as $$
declare
  v_id uuid;
  v_hash text := private.announcement_caller_hash();
begin
  if coalesce(p_website, '') <> '' then return true; end if;
  if p_consent is distinct from true or coalesce(p_notice_version, '') = '' then raise exception 'consent_required' using errcode = 'P0001'; end if;
  if lower(trim(coalesce(p_email, ''))) !~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' then raise exception 'invalid_email' using errcode = 'P0001'; end if;
  select a.id into v_id from public.announcements a where a.reference = p_reference and a.status = 'published' and a.expires_at > now();
  if v_id is null then raise exception 'announcement_not_available' using errcode = 'P0001'; end if;
  if (select count(*) from private.announcement_introductions i where i.requester_hash = v_hash and i.created_at > now() - interval '24 hours') >= 5 then
    raise exception 'rate_limited' using errcode = 'P0001';
  end if;
  insert into private.announcement_introductions(announcement_id, requester_name, requester_email, requester_hash, message, consent_notice_version)
  values (v_id, trim(p_name), lower(trim(p_email)), v_hash, trim(p_message), p_notice_version);
  insert into private.announcement_events(announcement_id, event) values (v_id, 'introduction_received');
  return true;
end;
$$;

-- 10. Relecture : réservée au personnel interne (VIP) ----------------------------------------------------
create or replace function public.moderation_queue(p_status text default 'pending', p_limit integer default 50)
returns table (id uuid, reference text, kind text, status text, title text, description text, trade text, department text, area_note text, valid_until date,
               contact_name text, email text, phone text, created_at timestamptz)
language plpgsql stable security definer set search_path = '' as $$
begin
  if not private.announcement_is_moderator() then raise exception 'forbidden' using errcode = '42501'; end if;
  return query
    select a.id, a.reference, a.kind, a.status, a.title, a.description, a.trade, a.department, a.area_note, a.valid_until,
           c.contact_name, c.email, c.phone, a.created_at
    from public.announcements a join private.announcement_contacts c on c.announcement_id = a.id
    where a.status = coalesce(p_status, 'pending')
    order by a.created_at asc
    limit least(greatest(coalesce(p_limit, 50), 1), 100);
end;
$$;

create or replace function public.moderate_announcement(
  p_id uuid, p_decision text, p_note text default null, p_title text default null, p_description text default null
) returns text
language plpgsql security definer set search_path = '' as $$
declare
  v_actor uuid := (select auth.uid());
  v_row public.announcements%rowtype;
begin
  if not private.announcement_is_moderator() then raise exception 'forbidden' using errcode = '42501'; end if;
  if p_decision not in ('publish', 'reject', 'withdraw') then raise exception 'invalid_decision' using errcode = 'P0001'; end if;
  select * into v_row from public.announcements where id = p_id for update;
  if not found then raise exception 'not_found' using errcode = 'P0001'; end if;
  if p_decision = 'reject' and coalesce(trim(p_note), '') = '' then raise exception 'note_required' using errcode = 'P0001'; end if;
  if p_decision = 'publish' and v_row.status <> 'pending' then raise exception 'not_pending' using errcode = 'P0001'; end if;

  if p_decision = 'publish' and (p_title is not null or p_description is not null) then
    update public.announcements
       set title = coalesce(nullif(trim(p_title), ''), title), description = coalesce(nullif(trim(p_description), ''), description)
     where id = p_id;
    insert into private.announcement_events(announcement_id, event, actor, note) values (p_id, 'edited', v_actor, 'Texte corrigé avant publication');
  end if;

  update public.announcements
     set status = case p_decision when 'publish' then 'published' when 'reject' then 'rejected' else 'withdrawn' end,
         published_at = case when p_decision = 'publish' then now() else published_at end,
         expires_at = case when p_decision = 'publish' then least(now() + interval '60 days', coalesce(valid_until::timestamptz + interval '1 day', now() + interval '60 days')) else expires_at end,
         moderated_by = v_actor, moderated_at = now(), moderation_note = nullif(trim(coalesce(p_note, '')), '')
   where id = p_id;
  insert into private.announcement_events(announcement_id, event, actor, note)
  values (p_id, case p_decision when 'publish' then 'published' when 'reject' then 'rejected' else 'withdrawn' end, v_actor, nullif(trim(coalesce(p_note, '')), ''));
  return p_decision;
end;
$$;

-- 11. Expiration (à planifier seulement après validation) --------------------------------------------------
create or replace function private.expire_announcements() returns integer
language plpgsql security definer set search_path = '' as $$
declare v_count integer;
begin
  with expired as (
    update public.announcements set status = 'expired' where status = 'published' and expires_at <= now() returning id
  ), logged as (
    insert into private.announcement_events(announcement_id, event) select id, 'expired' from expired returning 1
  )
  select count(*) into v_count from expired;
  return v_count;
end;
$$;
revoke all on function private.expire_announcements() from public, anon, authenticated;

-- 12. Droits d'exécution ---------------------------------------------------------------------------------------
revoke all on function public.submit_announcement(text, text, text, text, text, text, date, text, text, text, boolean, text, text) from public;
revoke all on function public.list_published_announcements(text, text, integer, integer) from public;
revoke all on function public.request_announcement_introduction(text, text, text, text, boolean, text, text) from public;
revoke all on function public.moderation_queue(text, integer) from public, anon;
revoke all on function public.moderate_announcement(uuid, text, text, text, text) from public, anon;
grant execute on function public.submit_announcement(text, text, text, text, text, text, date, text, text, text, boolean, text, text) to anon, authenticated;
grant execute on function public.list_published_announcements(text, text, integer, integer) to anon, authenticated;
grant execute on function public.request_announcement_introduction(text, text, text, text, boolean, text, text) to anon, authenticated;
grant execute on function public.moderation_queue(text, integer) to authenticated;
grant execute on function public.moderate_announcement(uuid, text, text, text, text) to authenticated;
