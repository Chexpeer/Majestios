-- Restore the intended tenant-scoped CRM boundary after the later VIP-only policy migration.
-- Internal MajestiOS CRM: owner/admin only.
-- Client/partner CRM: owner/admin/member in their own organization; viewer remains read-only.
-- Deletes remain owner/admin only in every organization.
-- GitHub-only migration: do not apply to a remote Supabase project without explicit approval.

-- Businesses
drop policy if exists "VIP can read businesses" on public.businesses;
drop policy if exists "VIP can create businesses" on public.businesses;
drop policy if exists "VIP can update businesses" on public.businesses;
drop policy if exists "VIP can delete businesses" on public.businesses;
drop policy if exists "Authorized users can read businesses" on public.businesses;
drop policy if exists "Authorized editors can create businesses" on public.businesses;
drop policy if exists "Authorized editors can update businesses" on public.businesses;

create policy "Authorized users can read businesses"
  on public.businesses for select to authenticated
  using ((select private.can_read_crm_org(organization_id)));
create policy "Authorized editors can create businesses"
  on public.businesses for insert to authenticated
  with check (
    (select private.can_edit_crm_org(organization_id))
    and (created_by is null or created_by = (select auth.uid()))
  );
create policy "Authorized editors can update businesses"
  on public.businesses for update to authenticated
  using ((select private.can_edit_crm_org(organization_id)))
  with check ((select private.can_edit_crm_org(organization_id)));
create policy "Organization admins can delete businesses"
  on public.businesses for delete to authenticated
  using ((select private.is_org_admin(organization_id)));

-- Contacts
drop policy if exists "VIP can read contacts" on public.contacts;
drop policy if exists "VIP can create contacts" on public.contacts;
drop policy if exists "VIP can update contacts" on public.contacts;
drop policy if exists "VIP can delete contacts" on public.contacts;
drop policy if exists "Authorized users can read contacts" on public.contacts;
drop policy if exists "Authorized editors can create contacts" on public.contacts;
drop policy if exists "Authorized editors can update contacts" on public.contacts;

create policy "Authorized users can read contacts"
  on public.contacts for select to authenticated
  using ((select private.can_read_crm_org(organization_id)));
create policy "Authorized editors can create contacts"
  on public.contacts for insert to authenticated
  with check (
    (select private.can_edit_crm_org(organization_id))
    and (created_by is null or created_by = (select auth.uid()))
  );
create policy "Authorized editors can update contacts"
  on public.contacts for update to authenticated
  using ((select private.can_edit_crm_org(organization_id)))
  with check ((select private.can_edit_crm_org(organization_id)));
create policy "Organization admins can delete contacts"
  on public.contacts for delete to authenticated
  using ((select private.is_org_admin(organization_id)));

-- Opportunities
drop policy if exists "VIP can read opportunities" on public.opportunities;
drop policy if exists "VIP can create opportunities" on public.opportunities;
drop policy if exists "VIP can update opportunities" on public.opportunities;
drop policy if exists "VIP can delete opportunities" on public.opportunities;
drop policy if exists "Authorized users can read opportunities" on public.opportunities;
drop policy if exists "Authorized editors can create opportunities" on public.opportunities;
drop policy if exists "Authorized editors can update opportunities" on public.opportunities;

create policy "Authorized users can read opportunities"
  on public.opportunities for select to authenticated
  using ((select private.can_read_crm_org(organization_id)));
create policy "Authorized editors can create opportunities"
  on public.opportunities for insert to authenticated
  with check (
    (select private.can_edit_crm_org(organization_id))
    and (created_by is null or created_by = (select auth.uid()))
  );
create policy "Authorized editors can update opportunities"
  on public.opportunities for update to authenticated
  using ((select private.can_edit_crm_org(organization_id)))
  with check ((select private.can_edit_crm_org(organization_id)));
create policy "Organization admins can delete opportunities"
  on public.opportunities for delete to authenticated
  using ((select private.is_org_admin(organization_id)));

-- Activities
drop policy if exists "VIP can read activities" on public.activities;
drop policy if exists "VIP can append activities" on public.activities;
drop policy if exists "Authorized users can read activities" on public.activities;
drop policy if exists "Authorized editors can append activities" on public.activities;

create policy "Authorized users can read activities"
  on public.activities for select to authenticated
  using ((select private.can_read_crm_org(organization_id)));
create policy "Authorized editors can append activities"
  on public.activities for insert to authenticated
  with check (
    (select private.can_edit_crm_org(organization_id))
    and (actor_user_id is null or actor_user_id = (select auth.uid()))
  );

-- Persistent reminders
drop policy if exists "VIP can read CRM reminders" on public.crm_reminders;
drop policy if exists "VIP can mark CRM reminders read" on public.crm_reminders;
drop policy if exists "Authorized users can read their CRM reminders" on public.crm_reminders;
drop policy if exists "Authorized editors can mark their CRM reminders read" on public.crm_reminders;

create policy "Authorized users can read their CRM reminders"
  on public.crm_reminders for select to authenticated
  using ((select private.can_read_crm_org(organization_id)));
create policy "Authorized editors can mark their CRM reminders read"
  on public.crm_reminders for update to authenticated
  using ((select private.can_edit_crm_org(organization_id)))
  with check (
    (select private.can_edit_crm_org(organization_id))
    and state = 'read'
    and read_at is not null
  );

-- The SECURITY DEFINER RPC must enforce the same tenant-aware boundary as table RLS.
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

comment on function public.complete_crm_reminder(uuid) is
'Traite une relance CRM et écrit atomiquement une activité ; droits tenant-scoped, VIP owner/admin en interne et owner/admin/member côté client/partenaire.';
