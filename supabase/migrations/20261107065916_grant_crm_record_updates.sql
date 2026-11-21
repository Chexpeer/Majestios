-- Allow authenticated CRM editors to update records.
-- Row-level security policies remain the authority for organization and role checks.
grant update on table public.businesses to authenticated;
grant update on table public.contacts to authenticated;
grant update on table public.opportunities to authenticated;
