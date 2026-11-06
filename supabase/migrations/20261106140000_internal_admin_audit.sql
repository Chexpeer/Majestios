-- Journal des opérations d'administration interne MajestiOS.
create table if not exists public.internal_admin_audit (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  actor_user_id uuid not null references auth.users(id) on delete restrict,
  target_user_id uuid references auth.users(id) on delete set null,
  action text not null check (action in ('invite_user','change_role','remove_member')),
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists internal_admin_audit_org_created_idx
  on public.internal_admin_audit (organization_id, created_at desc);
alter table public.internal_admin_audit enable row level security;
create policy "Internal administrators can read admin audit"
  on public.internal_admin_audit for select to authenticated
  using (
    exists (
      select 1 from public.organization_members m
      where m.organization_id = internal_admin_audit.organization_id
        and m.user_id = (select auth.uid())
        and m.role in ('owner','admin')
    )
  );
revoke all on public.internal_admin_audit from anon, authenticated;
grant select on public.internal_admin_audit to authenticated;
comment on table public.internal_admin_audit is
  'Journal des opérations de gestion des membres internes. Écriture réservée au service role via Edge Function.';