-- Atomic, server-only import from the official open company search API.
create or replace function public.can_import_official_company(p_organization_id uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select p_organization_id is not null
     and (select private.is_org_editor(p_organization_id));
$$;
revoke all on function public.can_import_official_company(uuid) from public, anon;
grant execute on function public.can_import_official_company(uuid) to authenticated;

create or replace function public.import_official_company_record(
  p_organization_id uuid, p_company jsonb, p_establishments jsonb, p_source_url text
)
returns jsonb
language plpgsql security definer set search_path = ''
as $$
declare
  v_siren text;
  v_siret text;
  v_registry_id uuid;
  v_business_id uuid;
  v_source_id uuid;
  v_was_existing boolean;
  v_name text;
  v_naf text;
  v_postal text;
  v_city text;
  v_department text;
  v_est jsonb;
  v_est_siret text;
  v_establishment_id uuid;
begin
  if coalesce(auth.role(),'') <> 'service_role' then
    raise exception 'Import réservé au connecteur serveur.' using errcode = '42501';
  end if;
  if p_organization_id is null or p_company is null or jsonb_typeof(p_company) <> 'object' then
    raise exception 'Données entreprise invalides.' using errcode = '22023';
  end if;
  v_siren := p_company->>'siren';
  v_name := coalesce(nullif(p_company->>'nom_raison_sociale',''), nullif(p_company->>'nom_complet',''), nullif(p_company->>'name',''));
  if v_siren !~ '^[0-9]{9}$' or v_name is null then
    raise exception 'SIREN ou dénomination invalide.' using errcode = '22023';
  end if;
  if not exists (select 1 from public.organizations o where o.id=p_organization_id) then
    raise exception 'Organisation introuvable.' using errcode = 'P0002';
  end if;
  select id into v_source_id from public.official_data_sources where source_key='api_recherche_entreprises';
  if v_source_id is null then raise exception 'Source officielle non référencée.' using errcode = 'P0002'; end if;

  v_naf := nullif(p_company->>'activite_principale','');
  v_siret := nullif(p_company #>> '{siege,siret}','');
  v_postal := nullif(p_company #>> '{siege,code_postal}','');
  v_city := nullif(p_company #>> '{siege,libelle_commune}','');
  v_department := nullif(p_company #>> '{siege,departement}','');

  insert into public.company_registry(
    siren,legal_name,usual_name,legal_form,ape_naf,activity_label,legal_status,
    creation_date,head_office_siret,postal_code,city,department_code,last_verified_at
  ) values (
    v_siren,v_name,nullif(p_company->>'sigle',''),nullif(p_company->>'nature_juridique',''),
    v_naf,nullif(p_company->>'section_activite_principale',''),
    nullif(p_company->>'etat_administratif',''),
    case when coalesce(p_company->>'date_creation','') ~ '^\\d{4}-\\d{2}-\\d{2}$' then (p_company->>'date_creation')::date end,
    case when v_siret ~ '^[0-9]{14}$' then v_siret end,
    v_postal,v_city,v_department,now()
  )
  on conflict (siren) do update set
    legal_name=excluded.legal_name,
    usual_name=coalesce(excluded.usual_name,public.company_registry.usual_name),
    legal_form=coalesce(excluded.legal_form,public.company_registry.legal_form),
    ape_naf=coalesce(excluded.ape_naf,public.company_registry.ape_naf),
    activity_label=coalesce(excluded.activity_label,public.company_registry.activity_label),
    legal_status=coalesce(excluded.legal_status,public.company_registry.legal_status),
    creation_date=coalesce(excluded.creation_date,public.company_registry.creation_date),
    head_office_siret=coalesce(excluded.head_office_siret,public.company_registry.head_office_siret),
    postal_code=coalesce(excluded.postal_code,public.company_registry.postal_code),
    city=coalesce(excluded.city,public.company_registry.city),
    department_code=coalesce(excluded.department_code,public.company_registry.department_code),
    last_verified_at=now(),updated_at=now()
  returning id into v_registry_id;

  v_was_existing := exists(select 1 from public.businesses b where b.organization_id=p_organization_id and b.siren=v_siren);
  insert into public.businesses(
    organization_id,legal_name,siren,siret,ape_naf,address_line,postal_code,city,
    department_code,country_code,source_label,source_url,qualification_status
  ) values (
    p_organization_id,v_name,v_siren,
    case when v_siret ~ '^[0-9]{14}$' then v_siret end,
    v_naf,
    nullif(concat_ws(' ',nullif(p_company #>> '{siege,numero_voie}',''),
      nullif(p_company #>> '{siege,type_voie}',''),nullif(p_company #>> '{siege,libelle_voie}','')),''),
    v_postal,v_city,v_department,'FR','API Recherche d’Entreprises — DINUM',p_source_url,'to_review'
  )
  on conflict (organization_id,siren) do update set
    legal_name=excluded.legal_name,
    siret=coalesce(excluded.siret,public.businesses.siret),
    ape_naf=coalesce(excluded.ape_naf,public.businesses.ape_naf),
    address_line=coalesce(excluded.address_line,public.businesses.address_line),
    postal_code=coalesce(excluded.postal_code,public.businesses.postal_code),
    city=coalesce(excluded.city,public.businesses.city),
    department_code=coalesce(excluded.department_code,public.businesses.department_code),
    source_label=excluded.source_label,source_url=excluded.source_url,updated_at=now()
  returning id into v_business_id;

  if jsonb_typeof(p_establishments)='array' then
    for v_est in select value from jsonb_array_elements(p_establishments) limit 200 loop
      v_est_siret := nullif(v_est->>'siret','');
      if v_est_siret is null or v_est_siret !~ '^[0-9]{14}$' then continue; end if;
      insert into public.company_registry_establishments(
        siret,siren,establishment_name,is_head_office,ape_naf,establishment_status,
        creation_date,address_line,postal_code,city,department_code,last_verified_at
      ) values (
        v_est_siret,v_siren,nullif(v_est->>'nom_complet',''),
        coalesce((v_est->>'est_etablissement')::boolean,false),
        nullif(v_est->>'activite_principale',''),nullif(v_est->>'etat_administratif',''),
        case when coalesce(v_est->>'date_creation','') ~ '^\\d{4}-\\d{2}-\\d{2}$' then (v_est->>'date_creation')::date end,
        nullif(concat_ws(' ',nullif(v_est->>'numero_voie',''),nullif(v_est->>'type_voie',''),nullif(v_est->>'libelle_voie','')),''),
        nullif(v_est->>'code_postal',''),nullif(v_est->>'libelle_commune',''),
        nullif(v_est->>'departement',''),now()
      )
      on conflict (siret) do update set
        siren=excluded.siren,
        establishment_name=coalesce(excluded.establishment_name,public.company_registry_establishments.establishment_name),
        is_head_office=excluded.is_head_office,
        ape_naf=coalesce(excluded.ape_naf,public.company_registry_establishments.ape_naf),
        establishment_status=coalesce(excluded.establishment_status,public.company_registry_establishments.establishment_status),
        address_line=coalesce(excluded.address_line,public.company_registry_establishments.address_line),
        postal_code=coalesce(excluded.postal_code,public.company_registry_establishments.postal_code),
        city=coalesce(excluded.city,public.company_registry_establishments.city),
        department_code=coalesce(excluded.department_code,public.company_registry_establishments.department_code),
        last_verified_at=now(),updated_at=now()
      returning id into v_establishment_id;
    end loop;
  end if;

  insert into public.company_source_observations(
    source_id,company_registry_id,external_record_id,record_kind,source_url,payload
  ) values (v_source_id,v_registry_id,'siren:'||v_siren,'company_search',p_source_url,p_company)
  on conflict (source_id,external_record_id) do update set
    company_registry_id=excluded.company_registry_id,source_url=excluded.source_url,
    observed_at=now(),payload=excluded.payload;

  return jsonb_build_object(
    'registry_id',v_registry_id,'business_id',v_business_id,'siren',v_siren,
    'created_in_organization',not v_was_existing,'matched_existing_business',v_was_existing
  );
end;
$$;
revoke all on function public.import_official_company_record(uuid,jsonb,jsonb,text) from public,anon,authenticated;
grant execute on function public.import_official_company_record(uuid,jsonb,jsonb,text) to service_role;
