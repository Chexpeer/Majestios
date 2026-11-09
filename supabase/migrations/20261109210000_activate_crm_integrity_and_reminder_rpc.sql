-- Activate the tenant relationship guard and keep reminder completion atomic.
-- GitHub-only migration: do not apply to a remote Supabase project without approval.

-- The integrity function was previously defined but not attached to table triggers.
drop trigger if exists businesses_enforce_tenant_integrity on public.businesses;
create trigger businesses_enforce_tenant_integrity
  before insert or update on public.businesses
  for each row execute function private.enforce_tenant_relationship_integrity();

drop trigger if exists contacts_enforce_tenant_integrity on public.contacts;
create trigger contacts_enforce_tenant_integrity
  before insert or update on public.contacts
  for each row execute function private.enforce_tenant_relationship_integrity();

drop trigger if exists opportunities_enforce_tenant_integrity on public.opportunities;
create trigger opportunities_enforce_tenant_integrity
  before insert or update on public.opportunities
  for each row execute function private.enforce_tenant_relationship_integrity();

drop trigger if exists activities_enforce_tenant_integrity on public.activities;
create trigger activities_enforce_tenant_integrity
  before insert or update on public.activities
  for each row execute function private.enforce_tenant_relationship_integrity();

-- Reminder completion must pass through the SECURITY DEFINER RPC so that
-- the state change and its activity history are committed atomically.
-- The RPC owner performs the update; authenticated browser clients do not.
revoke update on public.crm_reminders from authenticated;

create or replace function public.complete_crm_reminder(p_reminder_id uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_reminder public.crm_reminders%rowtype;
  v_opportunity public.opportunities%rowtype;
  v_activity_id uuid;
begin
  if v_user_id is null then
    raise exception 'Authentification requise.';
  end if;

  select r.* into v_reminder
    from public.crm_reminders r
   where r.id = p_reminder_id
   for update;

  if not found then
    raise exception 'Relance introuvable.';
  end if;

  if not (select private.can_edit_crm_org(v_reminder.organization_id)) then
    raise exception 'Droits insuffisants pour traiter cette relance.';
  end if;

  if v_reminder.state <> 'pending' then
    raise exception 'Cette relance a déjà été traitée ou annulée.';
  end if;

  select o.* into v_opportunity
    from public.opportunities o
   where o.id = v_reminder.opportunity_id
     and o.organization_id = v_reminder.organization_id;

  if not found then
    raise exception 'Opportunité associée introuvable.';
  end if;

  update public.crm_reminders
     set state = 'read', read_at = now()
   where id = v_reminder.id;

  insert into public.activities (
    organization_id, opportunity_id, business_id, actor_user_id,
    activity_type, subject, body, metadata
  ) values (
    v_reminder.organization_id,
    v_reminder.opportunity_id,
    v_opportunity.business_id,
    v_user_id,
    'task',
    'Relance commerciale traitée : ' || v_reminder.title,
    v_reminder.action,
    jsonb_build_object(
      'source', 'crm_reminder',
      'reminder_id', v_reminder.id,
      'due_at', v_reminder.due_at,
      'completed_at', now()
    )
  ) returning id into v_activity_id;

  return v_activity_id;
end;
$$;

revoke all on function public.complete_crm_reminder(uuid) from public, anon;
grant execute on function public.complete_crm_reminder(uuid) to authenticated;

comment on table public.crm_reminders is
'Relances persistantes par tenant ; clôture uniquement via complete_crm_reminder afin de journaliser atomiquement l’activité.';
