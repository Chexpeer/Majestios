-- DRAFT ONLY — CRM notes table
-- This file is deliberately stored under docs/, not supabase/migrations/.
-- It has NOT been applied to any Supabase project.
-- Generate the final migration filename with `supabase migration new crm_notes`
-- after the product decisions and SQL review are approved.
--
-- PRODUCT DECISIONS APPROVED:
-- - All organization members may read notes; only editors may create/update them.
-- - Deleting one parent must not silently delete a note that is also linked elsewhere.
-- - If the deleted parent is the note's only remaining parent, the FK/check constraints
--   block that parent deletion until the note is reassigned or archived/deleted explicitly.

begin;

-- Composite unique keys make tenant identity part of every relationship.
-- The UUID primary keys remain the public identifiers used by the application.
create unique index if not exists businesses_org_id_id_uidx
  on public.businesses (organization_id, id);
create unique index if not exists contacts_org_id_id_uidx
  on public.contacts (organization_id, id);
create unique index if not exists opportunities_org_id_id_uidx
  on public.opportunities (organization_id, id);

create table public.crm_notes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null
    references public.organizations(id) on delete cascade,
  business_id uuid,
  contact_id uuid,
  opportunity_id uuid,
  title text not null check (length(btrim(title)) > 0),
  body text not null check (length(btrim(body)) > 0),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz,
  constraint crm_notes_at_least_one_parent
    check (business_id is not null or contact_id is not null or opportunity_id is not null),
  constraint crm_notes_business_same_org_fk
    foreign key (organization_id, business_id)
    references public.businesses (organization_id, id)
    on delete set null (business_id),
  constraint crm_notes_contact_same_org_fk
    foreign key (organization_id, contact_id)
    references public.contacts (organization_id, id)
    on delete set null (contact_id),
  constraint crm_notes_opportunity_same_org_fk
    foreign key (organization_id, opportunity_id)
    references public.opportunities (organization_id, id)
    on delete set null (opportunity_id)
);

create index crm_notes_org_updated_idx
  on public.crm_notes (organization_id, updated_at desc)
  where archived_at is null;
create index crm_notes_business_idx
  on public.crm_notes (organization_id, business_id, updated_at desc)
  where business_id is not null and archived_at is null;
create index crm_notes_contact_idx
  on public.crm_notes (organization_id, contact_id, updated_at desc)
  where contact_id is not null and archived_at is null;
create index crm_notes_opportunity_idx
  on public.crm_notes (organization_id, opportunity_id, updated_at desc)
  where opportunity_id is not null and archived_at is null;

create trigger crm_notes_set_updated_at
before update on public.crm_notes
for each row execute function public.set_updated_at();

alter table public.crm_notes enable row level security;

revoke all on public.crm_notes from anon, authenticated;
grant select, insert on public.crm_notes to authenticated;
grant update (business_id, contact_id, opportunity_id, title, body, updated_by, archived_at)
  on public.crm_notes to authenticated;

create policy "Members can read CRM notes"
  on public.crm_notes for select to authenticated
  using ((select private.is_org_member(organization_id)));

create policy "Editors can create CRM notes"
  on public.crm_notes for insert to authenticated
  with check (
    (select private.is_org_editor(organization_id))
    and (created_by is null or created_by = (select auth.uid()))
    and (updated_by is null or updated_by = (select auth.uid()))
  );

create policy "Editors can update CRM notes"
  on public.crm_notes for update to authenticated
  using ((select private.is_org_editor(organization_id)))
  with check (
    (select private.is_org_editor(organization_id))
    and (updated_by is null or updated_by = (select auth.uid()))
  );

comment on table public.crm_notes is
'Notes CRM durables, rattachées à au moins un dossier métier et strictement isolées par organisation.';

comment on column public.crm_notes.archived_at is
'Archivage réversible ; les notes archivées restent consultables via un filtre dédié.';

commit;

-- REVIEW GATES BEFORE GENERATING/APPLYING A REAL MIGRATION:
-- 1. Confirm whether created_by/updated_by should be nullable on Auth user deletion.
-- 2. Add application-level and SQL tests for cross-tenant parent IDs, viewer writes,
--    editor CRUD, empty title/body, missing parent, archive/restore, and tenant isolation.
-- 3. Test deletion semantics explicitly:
--    a. deleting one of several linked parents nulls only that parent_id and preserves the note;
--    b. deleting the sole remaining parent is rejected by crm_notes_at_least_one_parent;
--    c. deleting an organization still cascades through organization_id.
-- 4. Run Supabase advisors and verify grants/RLS on a disposable development database.
