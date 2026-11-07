-- Relances CRM persistantes, matérialisées côté PostgreSQL.
-- GitHub uniquement : cette migration n'est pas appliquée en production.

create extension if not exists pg_cron with schema pg_catalog;

create table if not exists public.crm_reminders (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  due_at timestamptz not null,
  title text not null,
  action text not null,
  state text not null default 'pending' check (state in ('pending', 'read')),
  created_at timestamptz not null default now(),
  read_at timestamptz,
  constraint crm_reminders_dedupe unique (organization_id, opportunity_id, due_at)
);

create index if not exists crm_reminders_org_state_due_idx
  on public.crm_reminders (organization_id, state, due_at);

alter table public.crm_reminders enable row level security;
revoke all on public.crm_reminders from anon, authenticated;
grant select on public.crm_reminders to authenticated;
grant update (state, read_at) on public.crm_reminders to authenticated;

create policy "Members can read their CRM reminders"
  on public.crm_reminders for select to authenticated
  using ((select private.is_org_member(organization_id)));

create policy "Editors can mark their CRM reminders read"
  on public.crm_reminders for update to authenticated
  using ((select private.is_org_editor(organization_id)))
  with check (
    (select private.is_org_editor(organization_id))
    and state = 'read'
    and read_at is not null
  );

create or replace function private.materialize_crm_reminders()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  inserted_count integer;
begin
  insert into public.crm_reminders (organization_id, opportunity_id, due_at, title, action)
  select o.organization_id, o.id, o.next_action_at, o.title, o.next_action
  from public.opportunities o
  where o.next_action is not null
    and btrim(o.next_action) <> ''
    and o.next_action_at is not null
    and o.next_action_at <= now()
    and o.status not in ('won', 'lost', 'archived')
  on conflict (organization_id, opportunity_id, due_at) do nothing;
  get diagnostics inserted_count = row_count;
  return inserted_count;
end;
$$;

revoke all on function private.materialize_crm_reminders() from public, anon, authenticated;
grant usage on schema private to postgres;

do $$
begin
  if exists (select 1 from cron.job where jobname = 'majestios-crm-reminders') then
    perform cron.unschedule('majestios-crm-reminders');
  end if;
  perform cron.schedule('majestios-crm-reminders', '*/5 * * * *',
    'select private.materialize_crm_reminders();');
end;
$$;

comment on table public.crm_reminders is
'Relances commerciales persistantes par tenant, matérialisées toutes les cinq minutes par pg_cron. Notifications internes au CRM uniquement, sans e-mail ni push.';
