-- Référentiel partagé des entreprises et registre extensible des sources officielles.
create table public.official_data_sources (
  id uuid primary key default gen_random_uuid(),
  source_key text not null unique,
  display_name text not null,
  authority_name text not null,
  source_kind text not null check (source_kind in ('company_registry','legal_notice','public_procurement','open_data','other')),
  official_homepage text,
  api_documentation_url text,
  access_mode text not null default 'to_assess'
    check (access_mode in ('api','bulk_download','open_data_portal','manual','to_assess','unavailable')),
  usage_terms_url text,
  requires_api_key boolean not null default false,
  connector_status text not null default 'planned'
    check (connector_status in ('planned','assessment','ready','active','paused','retired')),
  refresh_policy text,
  last_successful_sync_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.company_registry (
  id uuid primary key default gen_random_uuid(),
  siren text not null unique check (siren ~ '^[0-9]{9}$'),
  legal_name text not null,
  usual_name text,
  legal_form text,
  ape_naf text,
  activity_label text,
  legal_status text,
  creation_date date,
  cessation_date date,
  head_office_siret text,
  postal_code text,
  city text,
  department_code text,
  country_code text not null default 'FR',
  last_verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.company_registry_establishments (
  id uuid primary key default gen_random_uuid(),
  siret text not null unique check (siret ~ '^[0-9]{14}$'),
  siren text not null references public.company_registry(siren) on update cascade on delete cascade,
  establishment_name text,
  is_head_office boolean not null default false,
  ape_naf text,
  establishment_status text,
  creation_date date,
  closure_date date,
  address_line text,
  postal_code text,
  city text,
  department_code text,
  last_verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.official_source_sync_runs (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references public.official_data_sources(id) on delete restrict,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  run_status text not null default 'running'
    check (run_status in ('running','succeeded','partial','failed','cancelled')),
  records_seen integer not null default 0 check (records_seen >= 0),
  records_inserted integer not null default 0 check (records_inserted >= 0),
  records_updated integer not null default 0 check (records_updated >= 0),
  records_rejected integer not null default 0 check (records_rejected >= 0),
  error_summary text,
  execution_metadata jsonb not null default '{}'::jsonb
);

create table public.company_source_observations (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references public.official_data_sources(id) on delete restrict,
  company_registry_id uuid references public.company_registry(id) on delete cascade,
  establishment_id uuid references public.company_registry_establishments(id) on delete cascade,
  external_record_id text not null,
  record_kind text not null,
  source_url text,
  source_published_at timestamptz,
  observed_at timestamptz not null default now(),
  payload jsonb not null default '{}'::jsonb,
  payload_sha256 text,
  sync_run_id uuid references public.official_source_sync_runs(id) on delete set null,
  unique (source_id, external_record_id),
  check (company_registry_id is not null or establishment_id is not null)
);

create index company_registry_name_idx on public.company_registry (legal_name);
create index company_registry_naf_idx on public.company_registry (ape_naf);
create index company_registry_department_idx on public.company_registry (department_code);
create index company_establishments_siren_idx on public.company_registry_establishments (siren);
create index company_establishments_department_idx on public.company_registry_establishments (department_code);
create index source_observations_company_idx on public.company_source_observations (company_registry_id, observed_at desc);
create index source_observations_establishment_idx on public.company_source_observations (establishment_id, observed_at desc);
create index source_sync_runs_source_idx on public.official_source_sync_runs (source_id, started_at desc);

alter table public.official_data_sources enable row level security;
alter table public.company_registry enable row level security;
alter table public.company_registry_establishments enable row level security;
alter table public.official_source_sync_runs enable row level security;
alter table public.company_source_observations enable row level security;

revoke all on public.official_data_sources, public.company_registry, public.company_registry_establishments,
  public.official_source_sync_runs, public.company_source_observations from anon, authenticated;

grant select on public.official_data_sources, public.company_registry,
  public.company_registry_establishments, public.company_source_observations to authenticated;

create policy "Authenticated users can read official source catalog"
  on public.official_data_sources for select to authenticated using (true);
create policy "Authenticated users can read official company registry"
  on public.company_registry for select to authenticated using (true);
create policy "Authenticated users can read official establishments"
  on public.company_registry_establishments for select to authenticated using (true);
create policy "Authenticated users can read official source observations"
  on public.company_source_observations for select to authenticated using (true);

insert into public.official_data_sources
  (source_key, display_name, authority_name, source_kind, official_homepage, access_mode, connector_status, notes)
values
  ('annuaire_entreprises','Annuaire des Entreprises','État français','company_registry','https://annuaire-entreprises.data.gouv.fr/','open_data_portal','assessment','Point d’entrée de recherche et d’identification des entreprises. Valider les interfaces officielles et conditions de réutilisation avant intégration.'),
  ('sirene_insee','Répertoire SIRENE','INSEE','company_registry','https://www.insee.fr/fr/information/3591226','api','assessment','Référentiel des unités légales et établissements ; vérifier les modalités d’accès, quotas et licence du service retenu.'),
  ('rne_inpi','Registre national des entreprises','INPI','company_registry','https://data.inpi.fr/','to_assess','planned','Identifier les services officiels, champs accessibles et conditions de réutilisation.'),
  ('bodacc','BODACC','Direction de l’information légale et administrative','legal_notice','https://www.bodacc.fr/','open_data_portal','assessment','Annonces légales et événements d’entreprises. Connecteur à qualifier.'),
  ('boamp','BOAMP','Direction de l’information légale et administrative','public_procurement','https://www.boamp.fr/','api','assessment','Avis de marchés publics. Connecteur à qualifier.'),
  ('data_gouv','data.gouv.fr','DINUM','open_data','https://www.data.gouv.fr/','api','assessment','Catalogue de jeux de données ouverts ; chaque jeu conserve sa licence et sa provenance.'),
  ('journal_officiel','Journal officiel','Direction de l’information légale et administrative','legal_notice','https://www.journal-officiel.gouv.fr/','to_assess','planned','Publications officielles pertinentes, sous réserve des interfaces et droits de réutilisation.');
