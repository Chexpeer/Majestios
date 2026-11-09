-- Révoquer le privilège UPDATE global réintroduit par
-- 20261107065916_grant_crm_record_updates.sql.
-- Les politiques RLS VIP restent la frontière d'accès aux lignes ;
-- cette migration ajoute la seconde frontière : les colonnes modifiables.
-- Migration versionnée dans GitHub uniquement : ne pas l'appliquer sans autorisation.

revoke update on table public.businesses from authenticated;
revoke update on table public.contacts from authenticated;
revoke update on table public.opportunities from authenticated;

grant update (
  legal_name, trade_name, siren, siret, vat_number, ape_naf, website,
  address_line, postal_code, city, department_code, country_code,
  qualification_status, qualification_notes, source_label, source_url, assigned_to
) on table public.businesses to authenticated;

grant update (
  business_id, first_name, last_name, job_title, email, phone,
  is_primary, source_label, consent_status
) on table public.contacts to authenticated;

grant update (
  business_id, primary_contact_id, title, description, source_type,
  source_external_id, source_url, source_published_at, department_code,
  status, qualification_score, qualification_summary, assigned_to,
  next_action, next_action_at
) on table public.opportunities to authenticated;

comment on table public.businesses is
  'MajestiOS CRM. UPDATE limité aux colonnes métier par privilèges SQL et aux lignes autorisées par RLS.';
comment on table public.contacts is
  'MajestiOS CRM. UPDATE limité aux colonnes métier par privilèges SQL et aux lignes autorisées par RLS.';
comment on table public.opportunities is
  'MajestiOS CRM. UPDATE limité aux colonnes métier par privilèges SQL et aux lignes autorisées par RLS.';
