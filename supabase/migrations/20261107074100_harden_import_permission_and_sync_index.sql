create or replace function public.can_import_official_company(p_organization_id uuid)
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select p_organization_id is not null
     and (select private.is_org_editor(p_organization_id));
$$;

create index if not exists company_source_observations_sync_run_idx
  on public.company_source_observations (sync_run_id);
