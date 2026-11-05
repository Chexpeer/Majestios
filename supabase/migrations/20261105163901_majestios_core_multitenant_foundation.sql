-- MajestiOS — socle initial multi-tenant
-- Aucune donnée métier n'est importée. Les accès sont fermés par défaut.
create extension if not exists pgcrypto;

create table public.organizations (
 id uuid primary key default gen_random_uuid(),
 name text not null,
 slug text not null unique,
 kind text not null check (kind in ('internal','client','partner')),
 created_by uuid references auth.users(id) on delete set null,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create table public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 display_name text, phone text,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create table public.organization_members (
 id uuid primary key default gen_random_uuid(),
 organization_id uuid not null references public.organizations(id) on delete cascade,
 user_id uuid not null references auth.users(id) on delete cascade,
 role text not null check (role in ('owner','admin','member','viewer')),
 created_at timestamptz not null default now(),
 unique (organization_id,user_id)
);
create table public.businesses (
 id uuid primary key default gen_random_uuid(),
 organization_id uuid not null references public.organizations(id) on delete cascade,
 legal_name text not null, trade_name text,
 siren text check (siren is null or siren ~ '^[0-9]{9}$'),
 siret text check (siret is null or siret ~ '^[0-9]{14}$'),
 vat_number text, ape_naf text, website text,
 address_line text, postal_code text, city text, department_code text,
 country_code text not null default 'FR',
 qualification_status text not null default 'to_review'
  check (qualification_status in ('to_review','in_progress','qualified','not_qualified','do_not_contact')),
 qualification_notes text, source_label text, source_url text,
 created_by uuid references auth.users(id) on delete set null,
 assigned_to uuid references auth.users(id) on delete set null,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 unique (organization_id,siren)
);
create table public.contacts (
 id uuid primary key default gen_random_uuid(),
 organization_id uuid not null references public.organizations(id) on delete cascade,
 business_id uuid references public.businesses(id) on delete set null,
 first_name text, last_name text not null, job_title text, email text, phone text,
 is_primary boolean not null default false, source_label text,
 consent_status text not null default 'unknown'
  check (consent_status in ('unknown','provided','withdrawn','not_applicable')),
 created_by uuid references auth.users(id) on delete set null,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create table public.opportunities (
 id uuid primary key default gen_random_uuid(),
 organization_id uuid not null references public.organizations(id) on delete cascade,
 business_id uuid references public.businesses(id) on delete set null,
 primary_contact_id uuid references public.contacts(id) on delete set null,
 title text not null, description text,
 source_type text not null default 'manual'
  check (source_type in ('manual','boamp','bodacc','private_market','partner','other')),
 source_external_id text, source_url text, source_published_at timestamptz,
 department_code text,
 status text not null default 'detected'
  check (status in ('detected','to_qualify','qualified','to_contact','contacted','meeting','proposal','won','lost','archived')),
 qualification_score numeric(5,2) check (qualification_score is null or qualification_score between 0 and 100),
 qualification_summary text,
 assigned_to uuid references auth.users(id) on delete set null,
 next_action text, next_action_at timestamptz,
 created_by uuid references auth.users(id) on delete set null,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 unique (organization_id,source_type,source_external_id)
);
create table public.activities (
 id uuid primary key default gen_random_uuid(),
 organization_id uuid not null references public.organizations(id) on delete cascade,
 business_id uuid references public.businesses(id) on delete set null,
 contact_id uuid references public.contacts(id) on delete set null,
 opportunity_id uuid references public.opportunities(id) on delete set null,
 actor_user_id uuid references auth.users(id) on delete set null,
 activity_type text not null
  check (activity_type in ('note','call','email','meeting','task','status_change','qualification','system')),
 subject text not null, body text,
 occurred_at timestamptz not null default now(),
 metadata jsonb not null default '{}'::jsonb,
 created_at timestamptz not null default now()
);
create table public.client_requests (
 id uuid primary key default gen_random_uuid(),
 organization_id uuid not null references public.organizations(id) on delete restrict,
 created_by uuid references auth.users(id) on delete set null,
 request_type text not null
  check (request_type in ('contact','account_access','commercial_support','tender_support','qualification','other')),
 status text not null default 'received'
  check (status in ('received','in_review','waiting_for_user','accepted','rejected','closed')),
 subject text, message text,
 contact_snapshot jsonb not null default '{}'::jsonb,
 privacy_notice_version text, consent_recorded_at timestamptz,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);

create index organization_members_user_idx on public.organization_members(user_id);
create index businesses_org_name_idx on public.businesses(organization_id,legal_name);
create index businesses_siren_idx on public.businesses(siren);
create index contacts_org_business_idx on public.contacts(organization_id,business_id);
create index opportunities_org_status_idx on public.opportunities(organization_id,status,updated_at desc);
create index opportunities_assigned_idx on public.opportunities(assigned_to,next_action_at);
create index activities_org_occurred_idx on public.activities(organization_id,occurred_at desc);
create index client_requests_org_status_idx on public.client_requests(organization_id,status,created_at desc);

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end;
$$;
create trigger organizations_set_updated_at before update on public.organizations for each row execute function public.set_updated_at();
create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger businesses_set_updated_at before update on public.businesses for each row execute function public.set_updated_at();
create trigger contacts_set_updated_at before update on public.contacts for each row execute function public.set_updated_at();
create trigger opportunities_set_updated_at before update on public.opportunities for each row execute function public.set_updated_at();
create trigger client_requests_set_updated_at before update on public.client_requests for each row execute function public.set_updated_at();

create or replace function public.handle_new_auth_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
 insert into public.profiles(id,display_name)
 values (new.id,coalesce(nullif(new.raw_user_meta_data ->> 'display_name',''),nullif(new.raw_user_meta_data ->> 'full_name','')))
 on conflict (id) do nothing;
 return new;
end;
$$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_auth_user();

create or replace function public.is_org_member(target_org uuid)
returns boolean language sql stable security definer set search_path = '' as $$
 select exists(select 1 from public.organization_members m where m.organization_id=target_org and m.user_id=(select auth.uid()));
$$;
create or replace function public.is_org_admin(target_org uuid)
returns boolean language sql stable security definer set search_path = '' as $$
 select exists(select 1 from public.organization_members m where m.organization_id=target_org and m.user_id=(select auth.uid()) and m.role in ('owner','admin'));
$$;
create or replace function public.is_internal_staff()
returns boolean language sql stable security definer set search_path = '' as $$
 select exists(select 1 from public.organization_members m join public.organizations o on o.id=m.organization_id where m.user_id=(select auth.uid()) and o.kind='internal' and m.role in ('owner','admin','member'));
$$;
revoke all on function public.is_org_member(uuid) from public;
revoke all on function public.is_org_admin(uuid) from public;
revoke all on function public.is_internal_staff() from public;
grant execute on function public.is_org_member(uuid) to authenticated;
grant execute on function public.is_org_admin(uuid) to authenticated;
grant execute on function public.is_internal_staff() to authenticated;

insert into public.organizations(name,slug,kind) values ('MajestiOS — CRM interne','majestios-interne','internal') on conflict (slug) do nothing;

alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.organization_members enable row level security;
alter table public.businesses enable row level security;
alter table public.contacts enable row level security;
alter table public.opportunities enable row level security;
alter table public.activities enable row level security;
alter table public.client_requests enable row level security;

revoke all on public.organizations,public.profiles,public.organization_members,public.businesses,public.contacts,public.opportunities,public.activities,public.client_requests from anon,authenticated;
grant select on public.organizations,public.organization_members to authenticated;
grant select on public.profiles to authenticated;
grant update(display_name,phone) on public.profiles to authenticated;
grant select,insert,update,delete on public.businesses,public.contacts,public.opportunities to authenticated;
grant select,insert on public.activities to authenticated;
grant select,insert on public.client_requests to authenticated;
grant update(status) on public.client_requests to authenticated;

create policy "Members can read their organizations" on public.organizations for select to authenticated using ((select public.is_org_member(id)));
create policy "Members can read organization memberships" on public.organization_members for select to authenticated using ((select public.is_org_member(organization_id)));
create policy "Users can read their own profile" on public.profiles for select to authenticated using (id=(select auth.uid()));
create policy "Users can update their own profile" on public.profiles for update to authenticated using (id=(select auth.uid())) with check (id=(select auth.uid()));

create policy "Members can read businesses" on public.businesses for select to authenticated using ((select public.is_org_member(organization_id)));
create policy "Members can create businesses" on public.businesses for insert to authenticated with check ((select public.is_org_member(organization_id)) and (created_by is null or created_by=(select auth.uid())));
create policy "Members can update businesses" on public.businesses for update to authenticated using ((select public.is_org_member(organization_id))) with check ((select public.is_org_member(organization_id)));
create policy "Organization admins can delete businesses" on public.businesses for delete to authenticated using ((select public.is_org_admin(organization_id)));

create policy "Members can read contacts" on public.contacts for select to authenticated using ((select public.is_org_member(organization_id)));
create policy "Members can create contacts" on public.contacts for insert to authenticated with check ((select public.is_org_member(organization_id)) and (created_by is null or created_by=(select auth.uid())));
create policy "Members can update contacts" on public.contacts for update to authenticated using ((select public.is_org_member(organization_id))) with check ((select public.is_org_member(organization_id)));
create policy "Organization admins can delete contacts" on public.contacts for delete to authenticated using ((select public.is_org_admin(organization_id)));

create policy "Members can read opportunities" on public.opportunities for select to authenticated using ((select public.is_org_member(organization_id)));
create policy "Members can create opportunities" on public.opportunities for insert to authenticated with check ((select public.is_org_member(organization_id)) and (created_by is null or created_by=(select auth.uid())));
create policy "Members can update opportunities" on public.opportunities for update to authenticated using ((select public.is_org_member(organization_id))) with check ((select public.is_org_member(organization_id)));
create policy "Organization admins can delete opportunities" on public.opportunities for delete to authenticated using ((select public.is_org_admin(organization_id)));

create policy "Members can read activities" on public.activities for select to authenticated using ((select public.is_org_member(organization_id)));
create policy "Members can append activities" on public.activities for insert to authenticated with check ((select public.is_org_member(organization_id)) and (actor_user_id is null or actor_user_id=(select auth.uid())));

create policy "Requesters and internal staff can read requests" on public.client_requests for select to authenticated using ((select public.is_org_member(organization_id)) or (select public.is_internal_staff()));
create policy "Organization members can submit requests" on public.client_requests for insert to authenticated with check ((select public.is_org_member(organization_id)) and created_by=(select auth.uid()));
create policy "Internal staff can update request status" on public.client_requests for update to authenticated using ((select public.is_internal_staff())) with check ((select public.is_internal_staff()));

comment on table public.organizations is 'Tenant boundary: internal MajestiOS, client companies, or approved partners.';
comment on table public.organization_members is 'Memberships are provisioned by trusted administrative workflows; users cannot self-join.';
comment on table public.businesses is 'Business records scoped to one organization; internal CRM and client workspaces remain separate.';
comment on table public.opportunities is 'Commercial pipeline records; source identity and official source URL are retained.';
comment on table public.activities is 'Append-only commercial activity history.';
comment on table public.client_requests is 'Requests submitted from authenticated client workspaces; public forms require a trusted server-side endpoint.';
