-- MajestiOS initial schema. Apply only after creating a Supabase project.
-- Tenant isolation is enforced by RLS; raw source data is kept separate from validated memory.
create extension if not exists pgcrypto;
create schema if not exists private;
create schema if not exists staging;
create schema if not exists memory;
create schema if not exists analysis;
create schema if not exists ops_coach;

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) between 2 and 160),
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.organization_members (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'MEMBER' check (role in ('TENANT_ADMIN','BUSINESS_DEVELOPER','COACH','MEMBER')),
  created_at timestamptz not null default now(),
  primary key (organization_id, user_id)
);

create or replace function private.add_creator_as_admin()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.organization_members (organization_id, user_id, role)
  values (new.id, new.created_by, 'TENANT_ADMIN')
  on conflict (organization_id, user_id) do nothing;
  return new;
end;
$$;
revoke all on function private.add_creator_as_admin() from public, anon, authenticated;
drop trigger if exists organizations_add_creator_admin on public.organizations;
create trigger organizations_add_creator_admin after insert on public.organizations
for each row execute function private.add_creator_as_admin();

create or replace function private.is_org_member(target_org uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.organization_members m
    where m.organization_id = target_org and m.user_id = (select auth.uid()));
$$;
revoke all on function private.is_org_member(uuid) from public, anon;
grant execute on function private.is_org_member(uuid) to authenticated;

alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
drop policy if exists "org members can read their organizations" on public.organizations;
create policy "org members can read their organizations" on public.organizations for select to authenticated
using (private.is_org_member(id));
drop policy if exists "signed in users can create an organization" on public.organizations;
create policy "signed in users can create an organization" on public.organizations for insert to authenticated
with check (created_by = (select auth.uid()));
drop policy if exists "members can read their membership" on public.organization_members;
create policy "members can read their membership" on public.organization_members for select to authenticated
using (user_id = (select auth.uid()) or private.is_org_member(organization_id));

create table if not exists staging.imports (
 id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
 source_name text not null, source_type text not null default 'manual', status text not null default 'pending' check (status in ('pending','processing','completed','failed','review_required')),
 requested_by uuid references auth.users(id) on delete set null, metadata jsonb not null default '{}'::jsonb,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists staging.source_records (
 id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
 import_id uuid references staging.imports(id) on delete set null, source_url text, source_name text not null,
 external_id text, record_type text not null default 'unknown', raw_payload jsonb not null default '{}'::jsonb,
 captured_at timestamptz not null default now(), review_status text not null default 'unreviewed' check (review_status in ('unreviewed','accepted','rejected','duplicate')),
 reviewed_by uuid references auth.users(id) on delete set null, reviewed_at timestamptz
);
create table if not exists staging.queues (
 id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
 job_type text not null, payload jsonb not null default '{}'::jsonb, status text not null default 'queued' check (status in ('queued','running','done','failed','cancelled')),
 attempts integer not null default 0 check (attempts >= 0), available_at timestamptz not null default now(), created_at timestamptz not null default now()
);
create table if not exists staging.connectors (
 id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
 provider text not null, display_name text not null, enabled boolean not null default false,
 config jsonb not null default '{}'::jsonb, last_sync_at timestamptz, created_at timestamptz not null default now()
);

create table if not exists memory.companies (
 id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
 name text not null, legal_name text, registration_number text, website text, industry text, country_code text,
 description text, verification_status text not null default 'unverified' check (verification_status in ('unverified','in_review','verified','rejected')),
 source_record_id uuid references staging.source_records(id) on delete set null,
 attributes jsonb not null default '{}'::jsonb, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists memory.contacts (
 id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
 company_id uuid references memory.companies(id) on delete set null, first_name text, last_name text not null,
 job_title text, email text, phone text, profile_url text, source_record_id uuid references staging.source_records(id) on delete set null,
 confidence numeric(4,3) check (confidence between 0 and 1), created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists memory.decision_makers (
 id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
 contact_id uuid not null references memory.contacts(id) on delete cascade, decision_role text, influence_level text check (influence_level in ('low','medium','high','unknown')),
 rationale text, validated boolean not null default false, validated_by uuid references auth.users(id) on delete set null,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique (organization_id, contact_id)
);
create table if not exists memory.opportunities (
 id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
 title text not null, description text, opportunity_type text not null default 'other',
 status text not null default 'to_qualify' check (status in ('to_qualify','qualified','contacted','in_discussion','won','lost','archived')),
 company_id uuid references memory.companies(id) on delete set null, source_record_id uuid references staging.source_records(id) on delete set null,
 estimated_value numeric(14,2), currency_code char(3), score numeric(5,2) check (score between 0 and 100),
 due_at timestamptz, owner_id uuid references auth.users(id) on delete set null, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists memory.activities (
 id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
 activity_type text not null check (activity_type in ('CALL','VISIO','TASK','NOTE','EMAIL','RDV','OTHER')),
 title text not null, description text, company_id uuid references memory.companies(id) on delete set null,
 contact_id uuid references memory.contacts(id) on delete set null, opportunity_id uuid references memory.opportunities(id) on delete set null,
 status text not null default 'planned' check (status in ('planned','completed','cancelled')),
 scheduled_at timestamptz, completed_at timestamptz, owner_id uuid references auth.users(id) on delete set null, created_at timestamptz not null default now()
);
create table if not exists memory.relationships (
 id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
 from_company_id uuid references memory.companies(id) on delete cascade, to_company_id uuid references memory.companies(id) on delete cascade,
 relationship_type text not null, notes text, source_record_id uuid references staging.source_records(id) on delete set null,
 created_at timestamptz not null default now(), check (from_company_id is distinct from to_company_id)
);

create table if not exists analysis.signals (
 id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
 source_record_id uuid references staging.source_records(id) on delete set null, title text not null, summary text,
 signal_type text not null default 'other', confidence numeric(4,3) check (confidence between 0 and 1),
 status text not null default 'new' check (status in ('new','reviewing','accepted','dismissed')), detected_at timestamptz not null default now(),
 created_at timestamptz not null default now()
);
create table if not exists analysis.hypotheses (
 id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
 title text not null, statement text not null, evidence jsonb not null default '[]'::jsonb,
 status text not null default 'to_validate' check (status in ('to_validate','validated','rejected','superseded')),
 validated_by uuid references auth.users(id) on delete set null, validated_at timestamptz, created_at timestamptz not null default now()
);
create table if not exists analysis.scores (
 id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
 entity_type text not null, entity_id uuid not null, score numeric(5,2) not null check (score between 0 and 100),
 model_version text, factors jsonb not null default '{}'::jsonb, explanation text, calculated_at timestamptz not null default now()
);
create table if not exists analysis.recommendations (
 id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
 title text not null, rationale text not null, related_entity_type text, related_entity_id uuid,
 priority text not null default 'medium' check (priority in ('low','medium','high')),
 status text not null default 'proposed' check (status in ('proposed','accepted','rejected','done')),
 created_at timestamptz not null default now()
);

create table if not exists ops_coach.missions (
 id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
 title text not null, objective text, status text not null default 'draft' check (status in ('draft','active','paused','completed','cancelled')),
 owner_id uuid references auth.users(id) on delete set null, due_at timestamptz, context jsonb not null default '{}'::jsonb, created_at timestamptz not null default now()
);
create table if not exists ops_coach.campaigns (
 id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
 name text not null, channel text not null default 'manual', status text not null default 'draft' check (status in ('draft','ready','active','paused','completed')),
 criteria jsonb not null default '{}'::jsonb, created_by uuid references auth.users(id) on delete set null, created_at timestamptz not null default now()
);
create table if not exists ops_coach.double_dossiers (
 id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
 entity_type text not null, entity_id uuid not null, candidate_payload jsonb not null, existing_entity_id uuid,
 status text not null default 'pending_review' check (status in ('pending_review','merged','dismissed')),
 reviewed_by uuid references auth.users(id) on delete set null, reviewed_at timestamptz, created_at timestamptz not null default now()
);
create table if not exists ops_coach.human_decisions (
 id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
 decision_type text not null, target_type text not null, target_id uuid, decision text not null check (decision in ('approved','rejected','deferred')),
 rationale text, decided_by uuid references auth.users(id) on delete set null, created_at timestamptz not null default now()
);

-- Every tenant-owned table has row-level isolation. Private schemas are not exposed by default.
do $$
declare t record;
begin
 for t in select * from (values
 ('staging','imports'),('staging','source_records'),('staging','queues'),('staging','connectors'),
 ('memory','companies'),('memory','contacts'),('memory','decision_makers'),('memory','opportunities'),('memory','activities'),('memory','relationships'),
 ('analysis','signals'),('analysis','hypotheses'),('analysis','scores'),('analysis','recommendations'),
 ('ops_coach','missions'),('ops_coach','campaigns'),('ops_coach','double_dossiers'),('ops_coach','human_decisions')
 ) as x(schema_name,table_name)
 loop
   execute format('alter table %I.%I enable row level security',t.schema_name,t.table_name);
   execute format('drop policy if exists tenant_member_access on %I.%I',t.schema_name,t.table_name);
   execute format('create policy tenant_member_access on %I.%I for all to authenticated using (private.is_org_member(organization_id)) with check (private.is_org_member(organization_id))',t.schema_name,t.table_name);
   execute format('create index if not exists %I on %I.%I (organization_id)', t.table_name || '_org_id_idx', t.schema_name, t.table_name);
 end loop;
end $$;

-- Only grant API access to the public onboarding tables here.
grant usage on schema public to authenticated;
grant select, insert on public.organizations to authenticated;
grant select on public.organization_members to authenticated;
-- The four business schemas remain unexposed unless an administrator explicitly enables them in Supabase Data API settings.
