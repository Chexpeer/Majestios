-- Expose a narrowly scoped RPC entrypoint for the first internal-admin bootstrap.
-- The private implementation remains inaccessible to browser roles.
create or replace function public.bootstrap_first_internal_admin(p_user_id uuid)
returns uuid
language sql
security definer
set search_path = ''
as $$
  select private.bootstrap_first_internal_admin(p_user_id);
$$;

revoke all on function public.bootstrap_first_internal_admin(uuid) from public, anon, authenticated;
grant execute on function public.bootstrap_first_internal_admin(uuid) to service_role;
