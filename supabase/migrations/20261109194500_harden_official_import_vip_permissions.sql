-- VIP CRM boundary: official-company import uses service_role after a user-scoped authorization check.
-- The check must match the current CRM policies (owner/admin only), not the historical editor role (which includes member).
-- GitHub-only migration; do not apply remotely without explicit approval.

create or replace function public.can_import_official_company(p_organization_id uuid)
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select p_organization_id is not null
     and (select private.is_org_admin(p_organization_id));
$$;

revoke all on function public.can_import_official_company(uuid) from public, anon;
grant execute on function public.can_import_official_company(uuid) to authenticated;

comment on function public.can_import_official_company(uuid) is
'Authorization gate for the server-side official company importer; matches the VIP CRM policy and requires owner/admin.';
