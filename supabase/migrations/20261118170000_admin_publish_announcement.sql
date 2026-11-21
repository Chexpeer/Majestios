-- Publication d'une annonce par le propriétaire depuis l'administration (annonce d'une entreprise, par ex. vue sur LinkedIn).
-- Champs facultatifs : nom de l'entreprise (affiché) et lien d'origine (privé). Publication immédiate. Mises en relation via MajestiOS.
-- Candidat : appliqué d'abord sur MajestiOS-Test uniquement.

create table if not exists private.announcement_sources (
  announcement_id uuid primary key references public.announcements(id) on delete cascade,
  company text check (char_length(company) between 2 and 120),
  source_url text check (char_length(source_url) <= 500),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);
alter table private.announcement_sources enable row level security;
revoke all on private.announcement_sources from public, anon, authenticated;

drop function if exists public.list_published_announcements(text, text, integer, integer);
create function public.list_published_announcements(p_kind text default null, p_department text default null, p_limit integer default 20, p_offset integer default 0)
returns table(reference text, kind text, title text, description text, trade text, department text, area_note text, valid_until date, published_at timestamp with time zone, company text)
language sql stable security definer set search_path = '' as $$
  select a.reference, a.kind, a.title, a.description, a.trade, a.department, a.area_note, a.valid_until, a.published_at, s.company
  from public.announcements a
  left join private.announcement_sources s on s.announcement_id = a.id
  where a.status = 'published' and a.expires_at > now()
    and (p_kind is null or a.kind = p_kind)
    and (p_department is null or a.department = p_department)
  order by a.published_at desc
  limit least(greatest(coalesce(p_limit, 20), 1), 50) offset greatest(coalesce(p_offset, 0), 0);
$$;
revoke all on function public.list_published_announcements(text, text, integer, integer) from public;
grant execute on function public.list_published_announcements(text, text, integer, integer) to anon, authenticated;

create or replace function public.publish_announcement_admin(
  p_kind text, p_title text, p_description text, p_trade text, p_department text, p_area_note text, p_valid_until date,
  p_company text, p_source_url text)
returns text language plpgsql security definer set search_path = '' as $$
declare
  v_uid uuid := (select auth.uid());
  v_email text; v_id uuid; v_ref text;
begin
  if v_uid is null then raise exception 'account_required' using errcode = 'P0001'; end if;
  if private.caller_internal_rank() is distinct from 'owner' then raise exception 'forbidden' using errcode = '42501'; end if;
  select lower(u.email) into v_email from auth.users u where u.id = v_uid;
  if p_kind not in ('subcontract_need','subcontract_offer','job_offer','job_seeker','equipment_offer','equipment_wanted','other_offer','other_request') then raise exception 'invalid_kind' using errcode = 'P0001'; end if;
  if char_length(trim(coalesce(p_title, ''))) not between 8 and 120
     or char_length(trim(coalesce(p_description, ''))) not between 30 and 2000
     or char_length(trim(coalesce(p_trade, ''))) not between 2 and 80
     or (coalesce(trim(p_company), '') <> '' and char_length(trim(p_company)) not between 2 and 120) then
    raise exception 'invalid_text' using errcode = 'P0001'; end if;
  if p_department is not null and p_department <> '' and p_department !~ '^(0[1-9]|[1-8][0-9]|9[0-5]|2[AB]|97[1-6])$' then raise exception 'invalid_department' using errcode = 'P0001'; end if;
  if p_valid_until is not null and (p_valid_until < current_date or p_valid_until > current_date + 365) then raise exception 'invalid_date' using errcode = 'P0001'; end if;

  insert into public.announcements(kind, status, title, description, trade, department, area_note, valid_until, consent_notice_version, submitter_hash,
                                   author_user_id, published_at, expires_at, moderated_by, moderated_at)
  values (p_kind, 'published', trim(p_title), trim(p_description), trim(p_trade), nullif(p_department, ''), nullif(trim(coalesce(p_area_note, '')), ''), p_valid_until,
          'admin-v1', private.announcement_caller_hash(), v_uid, now(),
          least(now() + interval '60 days', coalesce(p_valid_until::timestamptz + interval '1 day', now() + interval '60 days')), v_uid, now())
  returning id, reference into v_id, v_ref;
  insert into private.announcement_contacts(announcement_id, contact_name, email, email_hash)
  values (v_id, coalesce(nullif(trim(p_company), ''), 'MajestiOS'), v_email, encode(sha256(convert_to(v_email, 'utf8')), 'hex'));
  if coalesce(trim(p_company), '') <> '' or coalesce(trim(p_source_url), '') <> '' then
    insert into private.announcement_sources(announcement_id, company, source_url, created_by)
    values (v_id, nullif(trim(coalesce(p_company, '')), ''), nullif(left(trim(coalesce(p_source_url, '')), 500), ''), v_uid);
  end if;
  insert into private.announcement_events(announcement_id, event, actor, note) values (v_id, 'published', v_uid, 'Publiée par le propriétaire');
  return v_ref;
end $$;
revoke all on function public.publish_announcement_admin(text,text,text,text,text,text,date,text,text) from public, anon;
grant execute on function public.publish_announcement_admin(text,text,text,text,text,text,date,text,text) to authenticated;
