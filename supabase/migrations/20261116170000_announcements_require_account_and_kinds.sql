-- Annonces gratuites : dépôt réservé aux titulaires d'un espace personnel + types élargis (décision propriétaire 2026-11-16).

alter table public.announcements add column if not exists author_user_id uuid references auth.users(id) on delete set null;
create index if not exists announcements_author_user_id_idx on public.announcements(author_user_id) where author_user_id is not null;

do $$
declare c record;
begin
  for c in select conname from pg_constraint where conrelid = 'public.announcements'::regclass and contype = 'c' and pg_get_constraintdef(oid) like '%subcontract_need%' loop
    execute format('alter table public.announcements drop constraint %I', c.conname);
  end loop;
end $$;
alter table public.announcements add constraint announcements_kind_check check (kind in
  ('subcontract_need','subcontract_offer','job_offer','job_seeker','equipment_offer','equipment_wanted','other_offer','other_request'));

create or replace function public.submit_announcement(p_kind text, p_title text, p_description text, p_trade text, p_department text, p_area_note text, p_valid_until date, p_contact_name text, p_email text, p_phone text, p_consent boolean, p_notice_version text, p_website text default null)
returns text language plpgsql security definer set search_path = '' as $function$
declare
  v_uid uuid := (select auth.uid());
  v_hash text := private.announcement_caller_hash();
  v_email text;
  v_email_hash text;
  v_id uuid;
  v_ref text;
begin
  if coalesce(p_website, '') <> '' then return 'AN-IGNORE'; end if;
  if v_uid is null then raise exception 'account_required' using errcode = 'P0001'; end if;
  select lower(u.email) into v_email from auth.users u where u.id = v_uid and u.email_confirmed_at is not null;
  if v_email is null or not exists (select 1 from public.organization_members m where m.user_id = v_uid) then
    raise exception 'account_required' using errcode = 'P0001';
  end if;
  v_email_hash := encode(sha256(convert_to(v_email, 'utf8')), 'hex');
  if p_consent is distinct from true or coalesce(p_notice_version, '') = '' then raise exception 'consent_required' using errcode = 'P0001'; end if;
  if p_kind not in ('subcontract_need','subcontract_offer','job_offer','job_seeker','equipment_offer','equipment_wanted','other_offer','other_request') then raise exception 'invalid_kind' using errcode = 'P0001'; end if;
  if char_length(trim(coalesce(p_title, ''))) not between 8 and 120
     or char_length(trim(coalesce(p_description, ''))) not between 30 and 2000
     or char_length(trim(coalesce(p_trade, ''))) not between 2 and 80
     or char_length(trim(coalesce(p_contact_name, ''))) not between 2 and 120 then
    raise exception 'invalid_text' using errcode = 'P0001';
  end if;
  if (p_title || ' ' || p_description || ' ' || coalesce(p_area_note, '')) ~* '(https?://|www\.|[^@\s]+@[^@\s]+\.[a-z]{2,}|(\+33|0)[1-9]([ .-]?[0-9]{2}){4})' then
    raise exception 'contact_in_text' using errcode = 'P0001';
  end if;
  if p_department is not null and p_department <> '' and p_department !~ '^(0[1-9]|[1-8][0-9]|9[0-5]|2[AB]|97[1-6])$' then raise exception 'invalid_department' using errcode = 'P0001'; end if;
  if p_valid_until is not null and (p_valid_until < current_date or p_valid_until > current_date + 365) then raise exception 'invalid_date' using errcode = 'P0001'; end if;
  if (select count(*) from public.announcements a where a.author_user_id = v_uid and a.created_at > now() - interval '24 hours') >= 5
     or (select count(*) from public.announcements a where a.submitter_hash = v_hash and a.created_at > now() - interval '24 hours') >= 10 then
    raise exception 'rate_limited' using errcode = 'P0001';
  end if;
  if (select count(*) from public.announcements a where a.status = 'pending') >= 300 then raise exception 'queue_full' using errcode = 'P0001'; end if;

  insert into public.announcements(kind, title, description, trade, department, area_note, valid_until, consent_notice_version, submitter_hash, author_user_id)
  values (p_kind, trim(p_title), trim(p_description), trim(p_trade), nullif(p_department, ''), nullif(trim(coalesce(p_area_note, '')), ''), p_valid_until, p_notice_version, v_hash, v_uid)
  returning id, reference into v_id, v_ref;
  insert into private.announcement_contacts(announcement_id, contact_name, email, email_hash, phone)
  values (v_id, trim(p_contact_name), v_email, v_email_hash, nullif(trim(coalesce(p_phone, '')), ''));
  insert into private.announcement_events(announcement_id, event) values (v_id, 'submitted');
  return v_ref;
end;
$function$;

revoke execute on function public.submit_announcement(text,text,text,text,text,text,date,text,text,text,boolean,text,text) from public, anon;
grant execute on function public.submit_announcement(text,text,text,text,text,text,date,text,text,text,boolean,text,text) to authenticated;

