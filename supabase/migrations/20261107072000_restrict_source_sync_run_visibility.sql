-- Explicitly deny authenticated access to connector execution logs.
-- The service role retains platform-level access and bypasses RLS.
create policy "Authenticated users cannot inspect source sync runs"
  on public.official_source_sync_runs
  for select to authenticated
  using (false);
