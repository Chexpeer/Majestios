create table public.privacy_acknowledgments (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 organization_id uuid references public.organizations(id) on delete set null,
 notice_version text not null,
 acknowledged_at timestamptz not null default now(),
 created_at timestamptz not null default now(),
 unique (user_id,organization_id,notice_version)
);
alter table public.privacy_acknowledgments enable row level security;
revoke all on public.privacy_acknowledgments from anon,authenticated;
comment on table public.privacy_acknowledgments is 'Server-side evidence that a user acknowledged a specific privacy notice version. This is not marketing consent.';
