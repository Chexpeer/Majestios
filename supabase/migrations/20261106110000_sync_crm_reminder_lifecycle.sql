-- Cycle de vie des relances : replanification, changement d'action et clôture d'opportunité.
-- GitHub uniquement ; migration non appliquée en production.

alter table public.crm_reminders
  add column if not exists cancelled_at timestamptz;

alter table public.crm_reminders
  drop constraint if exists crm_reminders_state_check;

alter table public.crm_reminders
  add constraint crm_reminders_state_check
  check (state in ('pending', 'read', 'cancelled'));

create index if not exists crm_reminders_org_state_due_idx
  on public.crm_reminders (organization_id, state, due_at);

create or replace function private.sync_crm_reminders_for_opportunity()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.status in ('won', 'lost', 'archived')
     or new.next_action is null
     or btrim(new.next_action) = ''
     or new.next_action_at is null then
    update public.crm_reminders
       set state = 'cancelled', cancelled_at = now()
     where opportunity_id = new.id
       and organization_id = new.organization_id
       and state = 'pending';
    return new;
  end if;

  update public.crm_reminders
     set state = 'cancelled', cancelled_at = now()
   where opportunity_id = new.id
     and organization_id = new.organization_id
     and state = 'pending'
     and due_at is distinct from new.next_action_at;

  update public.crm_reminders
     set title = new.title, action = new.next_action
   where opportunity_id = new.id
     and organization_id = new.organization_id
     and due_at = new.next_action_at
     and state = 'pending';

  return new;
end;
$$;

revoke all on function private.sync_crm_reminders_for_opportunity() from public, anon, authenticated;

drop trigger if exists opportunities_sync_crm_reminders on public.opportunities;
create trigger opportunities_sync_crm_reminders
after update of status, title, next_action, next_action_at
on public.opportunities
for each row
execute function private.sync_crm_reminders_for_opportunity();

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
  on conflict (organization_id, opportunity_id, due_at)
  do update set
    state = 'pending',
    title = excluded.title,
    action = excluded.action,
    read_at = null,
    cancelled_at = null
  where public.crm_reminders.state = 'cancelled';
  get diagnostics inserted_count = row_count;
  return inserted_count;
end;
$$;

revoke all on function private.materialize_crm_reminders() from public, anon, authenticated;

comment on column public.crm_reminders.cancelled_at is
'Horodatage de l’annulation automatique après replanification ou clôture de l’opportunité.';
