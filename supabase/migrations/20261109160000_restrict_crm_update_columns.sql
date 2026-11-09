-- Révoquer le privilège UPDATE global réintroduit par
-- 20261107065916_grant_crm_record_updates.sql.
-- Restaurer exactement la liste blanche de colonnes définie dans
-- 20261106074500_enforce_crm_editor_roles.sql.
-- Migration versionnée dans GitHub uniquement : ne pas l'appliquer sans autorisation.

revoke update on public.businesses, public.contacts, public.opportunities from authenticated;

grant update (
  legal_name, trade_name, siren, siret, vat_number, ape_naf, website,
  address_line, postal_code, city, department_code, country_code,
  qualification_status, qualification_notes, source_label, source_url, assigned_to
) on public.businesses to authenticated;

grant update (
  business_id, first_name, last_name, job_title, email, phone,
  is_primary, source_label, consent_status
) on public.contacts to authenticated;

grant update (
  business_id, primary_contact_id, title, description, source_type,
  source_external_id, source_url, source_published_at, department_code,
  status, qualification_score, qualification_summary, assigned_to,
  next_action, next_action_at
) on public.opportunities to authenticated;
