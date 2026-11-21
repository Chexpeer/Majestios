-- AN-14 / TEST-RLS-01 : RLS activée sans policy directe ; l'accès passe par la fonction SECURITY DEFINER (propriétaire postgres, BYPASSRLS).
-- Déjà appliqué sur MajestiOS-Test (migration « enable_rls_reputation_audit_usage ») ; ce fichier aligne le dépôt. Idempotent.
alter table private.reputation_audit_usage enable row level security;
