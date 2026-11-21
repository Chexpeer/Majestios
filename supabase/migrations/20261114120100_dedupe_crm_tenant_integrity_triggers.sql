-- CRM-TRG-01 : la migration 20261105163953 crée *_tenant_integrity, la 20261109210000 ajoute
-- *_enforce_tenant_integrity sans retirer les premiers. On ne garde que *_enforce_tenant_integrity.
-- Déjà appliqué à la main sur MajestiOS-Test ; ce fichier aligne le dépôt. Idempotent.
drop trigger if exists businesses_tenant_integrity on public.businesses;
drop trigger if exists contacts_tenant_integrity on public.contacts;
drop trigger if exists opportunities_tenant_integrity on public.opportunities;
drop trigger if exists activities_tenant_integrity on public.activities;
