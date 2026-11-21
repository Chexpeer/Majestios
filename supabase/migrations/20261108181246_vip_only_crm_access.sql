-- VIP-only CRM access: only owner/admin may read or mutate CRM records.
-- Applied as Supabase migration 20261108181246_vip_only_crm_access.

drop policy if exists "Members can read businesses" on public.businesses;
drop policy if exists "Editors can create businesses" on public.businesses;
drop policy if exists "Editors can update businesses" on public.businesses;
drop policy if exists "Organization admins can delete businesses" on public.businesses;
create policy "VIP can read businesses" on public.businesses for select to authenticated using ((select private.is_org_admin(organization_id)));
create policy "VIP can create businesses" on public.businesses for insert to authenticated with check ((select private.is_org_admin(organization_id)) and (created_by is null or created_by = (select auth.uid())));
create policy "VIP can update businesses" on public.businesses for update to authenticated using ((select private.is_org_admin(organization_id))) with check ((select private.is_org_admin(organization_id)));
create policy "VIP can delete businesses" on public.businesses for delete to authenticated using ((select private.is_org_admin(organization_id)));

drop policy if exists "Members can read contacts" on public.contacts;
drop policy if exists "Editors can create contacts" on public.contacts;
drop policy if exists "Editors can update contacts" on public.contacts;
drop policy if exists "Organization admins can delete contacts" on public.contacts;
create policy "VIP can read contacts" on public.contacts for select to authenticated using ((select private.is_org_admin(organization_id)));
create policy "VIP can create contacts" on public.contacts for insert to authenticated with check ((select private.is_org_admin(organization_id)) and (created_by is null or created_by = (select auth.uid())));
create policy "VIP can update contacts" on public.contacts for update to authenticated using ((select private.is_org_admin(organization_id))) with check ((select private.is_org_admin(organization_id)));
create policy "VIP can delete contacts" on public.contacts for delete to authenticated using ((select private.is_org_admin(organization_id)));

drop policy if exists "Members can read opportunities" on public.opportunities;
drop policy if exists "Editors can create opportunities" on public.opportunities;
drop policy if exists "Editors can update opportunities" on public.opportunities;
drop policy if exists "Organization admins can delete opportunities" on public.opportunities;
create policy "VIP can read opportunities" on public.opportunities for select to authenticated using ((select private.is_org_admin(organization_id)));
create policy "VIP can create opportunities" on public.opportunities for insert to authenticated with check ((select private.is_org_admin(organization_id)) and (created_by is null or created_by = (select auth.uid())));
create policy "VIP can update opportunities" on public.opportunities for update to authenticated using ((select private.is_org_admin(organization_id))) with check ((select private.is_org_admin(organization_id)));

create policy "VIP can delete opportunities" on public.opportunities for delete to authenticated using ((select private.is_org_admin(organization_id)));

drop policy if exists "Members can read activities" on public.activities;
drop policy if exists "Editors can append activities" on public.activities;
create policy "VIP can read activities" on public.activities for select to authenticated using ((select private.is_org_admin(organization_id)));
create policy "VIP can append activities" on public.activities for insert to authenticated with check ((select private.is_org_admin(organization_id)) and (actor_user_id is null or actor_user_id = (select auth.uid())));

drop policy if exists "Members can read their CRM reminders" on public.crm_reminders;
drop policy if exists "Editors can mark their CRM reminders read" on public.crm_reminders;
create policy "VIP can read CRM reminders" on public.crm_reminders for select to authenticated using ((select private.is_org_admin(organization_id)));
create policy "VIP can mark CRM reminders read" on public.crm_reminders for update to authenticated using ((select private.is_org_admin(organization_id))) with check ((select private.is_org_admin(organization_id)) and state = 'read' and read_at is not null);
