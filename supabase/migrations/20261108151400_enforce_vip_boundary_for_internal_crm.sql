-- Séparer les droits VIP internes des droits des espaces clients.
-- Cette migration est versionnée dans GitHub uniquement ; elle n'est pas appliquée à Supabase.
-- Les membres des organisations clientes conservent leurs droits CRM sur leur propre tenant.
-- Dans l'organisation interne MajestiOS, seuls owner/admin peuvent lire ou modifier le CRM.

create or replace function private.can_read_crm_org(target_org uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.organizations o
    join public.organization_members m on m.organization_id = o.id
    where o.id = target_org
      and m.user_id = (select auth.uid())
      and (
        o.kind <> 'internal'
        or m.role in ('owner', 'admin')
      )
  );
$$;

create or replace function private.can_edit_crm_org(target_org uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.organizations o
    join public.organization_members m on m.organization_id = o.id
    where o.id = target_org
      and m.user_id = (select auth.uid())
      and (
        (o.kind = 'internal' and m.role in ('owner', 'admin'))
        or (o.kind <> 'internal' and m.role in ('owner', 'admin', 'member'))
      )
  );
$$;

revoke all on function private.can_read_crm_org(uuid) from public, anon;
revoke all on function private.can_edit_crm_org(uuid) from public, anon;
grant execute on function private.can_read_crm_org(uuid) to authenticated;
grant execute on function private.can_edit_crm_org(uuid) to authenticated;

-- Entreprises
drop policy if exists "Members can read businesses" on public.businesses;
drop policy if exists "Editors can create businesses" on public.businesses;
drop policy if exists "Editors can update businesses" on public.businesses;
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

-- Contacts
drop policy if exists "Members can read contacts" on public.contacts;
drop policy if exists "Editors can create contacts" on public.contacts;
drop policy if exists "Editors can update contacts" on public.contacts;
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

-- Opportunités
drop policy if exists "Members can read opportunities" on public.opportunities;
drop policy if exists "Editors can create opportunities" on public.opportunities;
drop policy if exists "Editors can update opportunities" on public.opportunities;
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

-- Activités
drop policy if exists "Members can read activities" on public.activities;
drop policy if exists "Editors can append activities" on public.activities;
create policy "Authorized users can read activities"
  on public.activities for select to authenticated
  using ((select private.can_read_crm_org(organization_id)));
create policy "Authorized editors can append activities"
  on public.activities for insert to authenticated
  with check (
    (select private.can_edit_crm_org(organization_id))
    and (actor_user_id is null or actor_user_id = (select auth.uid()))
  );

-- Relances persistantes
drop policy if exists "Members can read their CRM reminders" on public.crm_reminders;
drop policy if exists "Editors can mark their CRM reminders read" on public.crm_reminders;
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

-- L'appel RPC doit appliquer exactement la même frontière de sécurité que les tables.
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

comment on function private.can_read_crm_org(uuid) is
'Lecture CRM : VIP owner/admin dans l’organisation interne ; membres de leur propre tenant client/partenaire.';
comment on function private.can_edit_crm_org(uuid) is
'Écriture CRM : VIP owner/admin en interne ; owner/admin/member dans leur propre tenant client/partenaire.';
