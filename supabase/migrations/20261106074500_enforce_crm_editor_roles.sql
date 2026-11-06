-- MajestiOS — rôle viewer en lecture seule, écriture réservée aux éditeurs.
-- Cette migration est versionnée dans GitHub uniquement ; elle n'est pas appliquée à Supabase.

create or replace function private.is_org_editor(target_org uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.organization_members m
    where m.organization_id = target_org
      and m.user_id = (select auth.uid())
      and m.role in ('owner', 'admin', 'member')
  );
$$;

revoke all on function private.is_org_editor(uuid) from public, anon;
grant execute on function private.is_org_editor(uuid) to authenticated;

-- Retirer les anciennes politiques qui autorisaient tout membre, y compris viewer, à écrire.
drop policy if exists "Members can create businesses" on public.businesses;
drop policy if exists "Members can update businesses" on public.businesses;
drop policy if exists "Members can create contacts" on public.contacts;
drop policy if exists "Members can update contacts" on public.contacts;
drop policy if exists "Members can create opportunities" on public.opportunities;
drop policy if exists "Members can update opportunities" on public.opportunities;
drop policy if exists "Members can append activities" on public.activities;

create policy "Editors can create businesses"
on public.businesses for insert to authenticated
with check (
  (select private.is_org_editor(organization_id))
  and (created_by is null or created_by = (select auth.uid()))
);

create policy "Editors can update businesses"
on public.businesses for update to authenticated
using ((select private.is_org_editor(organization_id)))
with check ((select private.is_org_editor(organization_id)));

create policy "Editors can create contacts"
on public.contacts for insert to authenticated
with check (
  (select private.is_org_editor(organization_id))
  and (created_by is null or created_by = (select auth.uid()))
);

create policy "Editors can update contacts"
on public.contacts for update to authenticated
using ((select private.is_org_editor(organization_id)))
with check ((select private.is_org_editor(organization_id)));

create policy "Editors can create opportunities"
on public.opportunities for insert to authenticated
with check (
  (select private.is_org_editor(organization_id))
  and (created_by is null or created_by = (select auth.uid()))
);

create policy "Editors can update opportunities"
on public.opportunities for update to authenticated
using ((select private.is_org_editor(organization_id)))
with check ((select private.is_org_editor(organization_id)));

create policy "Editors can append activities"
on public.activities for insert to authenticated
with check (
  (select private.is_org_editor(organization_id))
  and (actor_user_id is null or actor_user_id = (select auth.uid()))
);

-- Protéger les champs d'audit et de rattachement contre leur modification par le navigateur.
revoke update on public.businesses, public.contacts, public.opportunities from authenticated;

grant update (
  legal_name, trade_name, siren, siret, vat_number, ape_naf, website,
  address_line, postal_code, city, department_code, country_code,
  qualification_status, qualification_notes, source_label, source_url, assigned_to
) on public.businesses to authenticated;

grant update (
  business_id, first_name, last_name, job_title, email, phone,
  is_primary, source_label, consent_status
) on public.contacts to authenticated;

grant update (
  business_id, primary_contact_id, title, description, source_type,
  source_external_id, source_url, source_published_at, department_code,
  status, qualification_score, qualification_summary, assigned_to,
  next_action, next_action_at
) on public.opportunities to authenticated;

comment on function private.is_org_editor(uuid) is
'True for owner/admin/member. Viewer remains read-only at the database policy layer.';
