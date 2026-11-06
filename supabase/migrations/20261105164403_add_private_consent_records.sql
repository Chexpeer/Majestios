create table public.consent_records (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 organization_id uuid references public.organizations(id) on delete set null,
 purpose text not null check (purpose in ('account_creation','service_operation','marketing')),
 notice_version text not null,
 accepted_at timestamptz not null default now(),
 withdrawn_at timestamptz,
 created_at timestamptz not null default now()
);
create index consent_records_user_purpose_idx on public.consent_records(user_id,purpose,accepted_at desc);
alter table public.consent_records enable row level security;
revoke all on public.consent_records from anon,authenticated;
comment on table public.consent_records is 'Consent and privacy-notice evidence. Writes are server-side only; marketing consent is separate from account creation.';
