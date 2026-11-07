# Vérification complémentaire de la sauvegarde Supabase — 7 novembre 2026

Projet contrôlé : `majestios-backend` (`awtgrjnpckgxsdpfrnhg`).
Dépôt : `Chexpeer/Majestios`, branche `evolution-5.0-clean-preview`.

## Contrôles effectués après la première capture

### Fonctions SQL : comparaison Git / production

Les définitions retournées par `pg_get_functiondef` sur la base active ont été comparées aux trois migrations Git signalées comme ayant des horodatages différents.

- `private.bootstrap_first_internal_admin(uuid)` : définition live identique au corps SQL du fichier Git `20261106031500_bootstrap_first_internal_admin.sql`.
- `private.is_org_editor(uuid)` : définition live identique au corps SQL du fichier Git `20261106074500_enforce_crm_editor_roles.sql`.
- `public.provision_client_workspace(uuid,text,text,text,text,text)` : définition live identique au corps SQL du fichier Git `20261106090000_atomic_client_workspace_provisioning.sql`.

Cela confirme que les fonctions existent bien en production et que leurs corps correspondent aux fichiers SQL examinés. Cela ne prouve pas que les fichiers Git représentent à eux seuls l'intégralité des commandes de chaque migration (grants, policies, commentaires, notifications ou autres effets doivent aussi être rapprochés).

### Migrations réellement enregistrées par Supabase

13 versions sont enregistrées dans `supabase_migrations.schema_migrations` :

| Version live | Nom |
|---|---|
| 20261105163901 | majestios_core_multitenant_foundation |
| 20261105163922 | harden_private_authorization_and_fk_indexes |
| 20261105163953 | enforce_tenant_relationship_integrity |
| 20261105164403 | add_private_consent_records |
| 20261105164411 | replace_consent_placeholder_with_privacy_acknowledgments |
| 20261105164732 | harden_privacy_acknowledgment_access |
| 20261106085409 | bootstrap_first_internal_admin |
| 20261106085411 | enforce_crm_editor_roles |
| 20261106085415 | atomic_client_workspace_provisioning |
| 20261106085430 | persistent_crm_reminders |
| 20261106085434 | sync_crm_reminder_lifecycle |
| 20261106085436 | complete_crm_reminder_with_activity |
| 20261106135037 | grant_crm_record_updates |

### Politiques RLS publiques observées

Les 24 politiques recensées sont réparties ainsi :

| Table | Nombre |
|---|---:|
| activities | 2 |
| businesses | 4 |
| client_requests | 3 |
| contacts | 4 |
| crm_reminders | 2 |
| opportunities | 4 |
| organization_members | 1 |
| organizations | 1 |
| privacy_acknowledgments | 1 |
| profiles | 2 |

Les politiques d'écriture « Editors » sont présentes sur les tables CRM concernées. La fonction `private.is_org_editor` reconnaît les rôles owner, admin et member, et exclut viewer. Les politiques de lecture restent distinctes.

## Conclusion et précautions

L'écart d'horodatage des trois migrations ne correspond pas à une absence des fonctions SQL en production : leurs définitions live correspondent aux corps des fichiers Git. Il reste néanmoins nécessaire de comparer l'ensemble des effets de migration et de conserver le registre exact avant toute reconstruction.

Cette vérification est une capture de définitions et d'état SQL, pas un dump PostgreSQL restaurable. Elle ne sauvegarde ni les utilisateurs Auth exportables, ni les secrets, ni les clés privées, ni les paramètres de plateforme. Ne supprimer ni réinitialiser le projet avant un dump natif complet, les exports applicables et un test de restauration isolé.

Aucune donnée personnelle ni aucun secret n'est inclus dans ce document.
