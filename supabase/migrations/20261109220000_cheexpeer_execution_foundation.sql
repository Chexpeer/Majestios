-- Cheexpeer — fondation persistante du moteur de missions.
-- Préparation versionnée uniquement : ne pas appliquer avant recette sur MajestiOS-Test.
-- Les files de transport (pgmq) et les workers seront ajoutés après validation de ce contrat métier.

create schema if not exists private;

create table if not exists private.cheexpeer_missions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete restrict,
  created_by uuid references auth.users(id) on delete set null,
  mission_type text not null,
  title text not null,
  objective text,
  status text not null default 'queued'
    check (status in ('draft','awaiting_approval','queued','scheduled','running','retry_wait','succeeded','failed','cancelled','blocked')),
  priority smallint not null default 3 check (priority between 1 and 5),
  autonomy_level smallint not null default 1 check (autonomy_level between 0 and 4),
  requires_approval boolean not null default true,
  scheduled_at timestamptz not null default now(),
  deadline_at timestamptz,
  estimated_duration_seconds integer check (estimated_duration_seconds is null or estimated_duration_seconds >= 0),
  estimated_cost numeric(12,4) check (estimated_cost is null or estimated_cost >= 0),
  max_attempts smallint not null default 3 check (max_attempts between 1 and 20),
  attempt_count smallint not null default 0 check (attempt_count >= 0),
  idempotency_key text,
  input jsonb not null default '{}'::jsonb,
  context jsonb not null default '{}'::jsonb,
  result jsonb,
  error_code text,
  error_summary text,
  lease_owner text,
  lease_expires_at timestamptz,
  started_at timestamptz,
  finished_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint cheexpeer_missions_deadline_check check (deadline_at is null or deadline_at >= created_at),
  constraint cheexpeer_missions_idempotency_unique unique (idempotency_key)
);

create index if not exists cheexpeer_missions_dispatch_idx
  on private.cheexpeer_missions (status, scheduled_at, priority desc, created_at)
  where status in ('queued','scheduled','retry_wait');
create index if not exists cheexpeer_missions_org_created_idx
  on private.cheexpeer_missions (organization_id, created_at desc);
create index if not exists cheexpeer_missions_lease_idx
  on private.cheexpeer_missions (lease_expires_at)
  where status = 'running';

create table if not exists private.cheexpeer_mission_steps (
  id uuid primary key default gen_random_uuid(),
  mission_id uuid not null references private.cheexpeer_missions(id) on delete cascade,
  step_order integer not null check (step_order > 0),
  step_key text not null,
  tool_key text,
  status text not null default 'pending'
    check (status in ('pending','ready','awaiting_approval','running','retry_wait','succeeded','failed','skipped','cancelled','blocked')),
  depends_on_step_id uuid,
  input jsonb not null default '{}'::jsonb,
  output jsonb,
  attempt_count smallint not null default 0 check (attempt_count >= 0),
  max_attempts smallint not null default 3 check (max_attempts between 1 and 20),
  lease_owner text,
  lease_expires_at timestamptz,
  started_at timestamptz,
  finished_at timestamptz,
  error_code text,
  error_summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (mission_id, id),
  unique (mission_id, step_order),
  unique (mission_id, step_key),
  constraint cheexpeer_step_dependency_fk
    foreign key (mission_id, depends_on_step_id)
    references private.cheexpeer_mission_steps(mission_id, id)
    deferrable initially deferred,
  constraint cheexpeer_step_not_self_dependent
    check (depends_on_step_id is null or depends_on_step_id <> id)
);

create index if not exists cheexpeer_steps_dispatch_idx
  on private.cheexpeer_mission_steps (status, updated_at)
  where status in ('pending','ready','retry_wait');

create table if not exists private.cheexpeer_mission_events (
  id bigint generated always as identity primary key,
  mission_id uuid not null references private.cheexpeer_missions(id) on delete cascade,
  step_id uuid,
  event_type text not null,
  actor_type text not null check (actor_type in ('user','agent','worker','system','tool')),
  actor_id text,
  details jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now(),
  constraint cheexpeer_event_step_fk
    foreign key (mission_id, step_id)
    references private.cheexpeer_mission_steps(mission_id, id)
    deferrable initially deferred
);

create index if not exists cheexpeer_events_mission_time_idx
  on private.cheexpeer_mission_events (mission_id, occurred_at, id);

create table if not exists private.cheexpeer_approvals (
  id uuid primary key default gen_random_uuid(),
  mission_id uuid not null references private.cheexpeer_missions(id) on delete cascade,
  step_id uuid,
  requested_from uuid references auth.users(id) on delete set null,
  decision_by uuid references auth.users(id) on delete set null,
  status text not null default 'pending'
    check (status in ('pending','approved','rejected','expired','cancelled')),
  action_summary text not null,
  risk_level text not null default 'medium'
    check (risk_level in ('low','medium','high','critical')),
  decision_note text,
  expires_at timestamptz,
  decided_at timestamptz,
  created_at timestamptz not null default now(),
  constraint cheexpeer_approval_step_fk
    foreign key (mission_id, step_id)
    references private.cheexpeer_mission_steps(mission_id, id)
    deferrable initially deferred
);

create index if not exists cheexpeer_approvals_pending_idx
  on private.cheexpeer_approvals (created_at)
  where status = 'pending';

create table if not exists private.cheexpeer_tool_registry (
  id uuid primary key default gen_random_uuid(),
  tool_key text not null,
  version integer not null default 1 check (version > 0),
  display_name text not null,
  description text,
  input_schema jsonb not null default '{}'::jsonb,
  output_schema jsonb not null default '{}'::jsonb,
  autonomy_max smallint not null default 1 check (autonomy_max between 0 and 4),
  requires_approval boolean not null default true,
  effects text not null default 'read'
    check (effects in ('read','write','external_side_effect','financial','destructive','admin')),
  enabled boolean not null default false,
  timeout_seconds integer not null default 60 check (timeout_seconds between 1 and 86400),
  max_cost numeric(12,4) check (max_cost is null or max_cost >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tool_key, version)
);

create table if not exists private.cheexpeer_schedules (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  mission_type text not null,
  enabled boolean not null default false,
  recurrence text not null,
  timezone text not null default 'Europe/Paris',
  next_run_at timestamptz,
  last_run_at timestamptz,
  mission_template jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function private.cheexpeer_set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := pg_catalog.now();
  return new;
end;
$$;

drop trigger if exists cheexpeer_missions_set_updated_at on private.cheexpeer_missions;
create trigger cheexpeer_missions_set_updated_at
before update on private.cheexpeer_missions
for each row execute function private.cheexpeer_set_updated_at();

drop trigger if exists cheexpeer_steps_set_updated_at on private.cheexpeer_mission_steps;
create trigger cheexpeer_steps_set_updated_at
before update on private.cheexpeer_mission_steps
for each row execute function private.cheexpeer_set_updated_at();

drop trigger if exists cheexpeer_tools_set_updated_at on private.cheexpeer_tool_registry;
create trigger cheexpeer_tools_set_updated_at
before update on private.cheexpeer_tool_registry
for each row execute function private.cheexpeer_set_updated_at();

drop trigger if exists cheexpeer_schedules_set_updated_at on private.cheexpeer_schedules;
create trigger cheexpeer_schedules_set_updated_at
before update on private.cheexpeer_schedules
for each row execute function private.cheexpeer_set_updated_at();

create or replace function private.cheexpeer_reject_event_mutation()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  raise exception 'Cheexpeer mission events are append-only'
    using errcode = '55000';
end;
$$;

drop trigger if exists cheexpeer_events_immutable on private.cheexpeer_mission_events;
create trigger cheexpeer_events_immutable
before update or delete on private.cheexpeer_mission_events
for each row execute function private.cheexpeer_reject_event_mutation();

alter table private.cheexpeer_missions enable row level security;
alter table private.cheexpeer_mission_steps enable row level security;
alter table private.cheexpeer_mission_events enable row level security;
alter table private.cheexpeer_approvals enable row level security;
alter table private.cheexpeer_tool_registry enable row level security;
alter table private.cheexpeer_schedules enable row level security;

-- Aucun accès direct depuis anon/authenticated : les accès passeront par des API
-- serveur contrôlées. Le worker utilisera un rôle serveur dédié, jamais le navigateur.
revoke all on table
  private.cheexpeer_missions,
  private.cheexpeer_mission_steps,
  private.cheexpeer_mission_events,
  private.cheexpeer_approvals,
  private.cheexpeer_tool_registry,
  private.cheexpeer_schedules
from public, anon, authenticated;

grant usage on schema private to service_role;
grant select, insert, update, delete on
  private.cheexpeer_missions,
  private.cheexpeer_mission_steps,
  private.cheexpeer_approvals,
  private.cheexpeer_tool_registry,
  private.cheexpeer_schedules
to service_role;
grant select, insert on private.cheexpeer_mission_events to service_role;
grant usage, select on sequence private.cheexpeer_mission_events_id_seq to service_role;

comment on schema private is 'Schéma privé : fonctions et données internes non exposées par la Data API.';
comment on table private.cheexpeer_missions is 'Registre persistant des missions Cheexpeer ; source de vérité, indépendante des files de transport.';
comment on table private.cheexpeer_mission_steps is 'Étapes, dépendances et tentatives d’une mission Cheexpeer.';
comment on table private.cheexpeer_mission_events is 'Journal append-only des événements, décisions et résultats de mission.';
comment on table private.cheexpeer_approvals is 'Demandes et décisions de validation humaine pour les actions Cheexpeer.';
comment on table private.cheexpeer_tool_registry is 'Registre versionné des outils autorisés, de leurs effets et plafonds d’autonomie.';
comment on table private.cheexpeer_schedules is 'Planification persistante des missions récurrentes Cheexpeer.';
