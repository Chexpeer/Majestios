create index if not exists privacy_acknowledgments_organization_id_idx
  on public.privacy_acknowledgments(organization_id);
create policy "No direct API access to privacy acknowledgments"
on public.privacy_acknowledgments
for all to anon, authenticated
using (false)
with check (false);
