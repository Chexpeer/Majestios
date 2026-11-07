insert into public.official_data_sources
  (source_key, display_name, authority_name, source_kind, official_homepage, api_documentation_url, access_mode, connector_status, requires_api_key, notes)
values
  ('api_recherche_entreprises','API Recherche d’Entreprises','DINUM','company_registry',
   'https://recherche-entreprises.api.gouv.fr',
   'https://recherche-entreprises.api.gouv.fr/docs/',
   'api','active',false,
   'Connecteur de recherche ouvert déployé dans search-official-companies. Agrège notamment des données SIRENE et RNE, mais ne remplace pas l’accès complet au répertoire SIRENE et exclut certaines entités non diffusibles.')
on conflict (source_key) do update set
  display_name = excluded.display_name,
  authority_name = excluded.authority_name,
  official_homepage = excluded.official_homepage,
  api_documentation_url = excluded.api_documentation_url,
  access_mode = excluded.access_mode,
  connector_status = excluded.connector_status,
  requires_api_key = excluded.requires_api_key,
  notes = excluded.notes,
  updated_at = now();

update public.official_data_sources
set notes = 'API SIRENE de l’INSEE : accès au répertoire SIRENE, souscription/compte requis selon le catalogue INSEE. À intégrer séparément pour les accès détaillés et les usages nécessitant la base complète.',
    connector_status = 'assessment',
    requires_api_key = true,
    updated_at = now()
where source_key = 'sirene_insee';
