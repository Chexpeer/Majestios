# Matrice de réalignement documentaire CRM — socle V5

> État de travail au 6 novembre 2026. Cette matrice distingue le code SQL versionné dans `main` de l'état réellement constaté en production. La présence d'une migration dans Git ne prouve pas, à elle seule, qu'elle a été appliquée.

## 1. Référentiel de preuve

- Socle multi-tenant : `20261105163901_majestios_core_multitenant_foundation.sql`.
- Durcissement des relations et autorisations : `20261105163922_harden_private_authorization_and_fk_indexes.sql`, `20261105163953_enforce_tenant_relationship_integrity.sql`.
- Confidentialité : `20261105164403_add_private_consent_records.sql`, `20261105164411_replace_consent_placeholder_with_privacy_acknowledgments.sql`, `20261105164732_harden_privacy_acknowledgment_access.sql`.
- Bootstrap administrateur interne : `20261106031500_bootstrap_first_internal_admin.sql`.
- Rôles éditeur CRM : `20261106074500_enforce_crm_editor_roles.sql`.
- Provisionnement client atomique : `20261106090000_atomic_client_workspace_provisioning.sql`.
- Relances persistantes et cycle de vie : `20261106100000_persistent_crm_reminders.sql`, `20261106110000_sync_crm_reminder_lifecycle.sql`, `20261106120000_complete_crm_reminder_with_activity.sql`.

Les migrations de rôles éditeur et de relances ont été explicitement commentées dans leurs fichiers comme versionnées dans Git uniquement / non appliquées en production. Les migrations de provisionnement et de bootstrap sont versionnées ; leur application en production a été rapportée dans le journal de travail, mais chaque objet doit encore faire l'objet d'une vérification SQL ciblée avant toute certification.

## 2. Modèle de données

| Domaine documentaire historique | Correspondance V5 | Statut | Décision documentaire |
|---|---|---|---|
| Organisation / tenant | `organizations` | Implémenté dans le socle SQL | Décrire l'organisation comme frontière de cloisonnement. |
| Membres et rôles | `organization_members` avec `owner`, `admin`, `member`, `viewer` | Implémenté dans le socle ; politiques à vérifier selon migration | Ne pas reprendre la matrice historique de rôles provisoires comme modèle effectif. |
| Profil utilisateur | `profiles` lié à `auth.users` | Implémenté dans le socle | Séparer identité Auth et profil applicatif. |
| Entreprises | `businesses` | Implémenté dans le socle | Données métier rattachées à `organization_id`. |
| Contacts | `contacts` | Implémenté dans le socle | Rattachement organisationnel explicite ; lien entreprise facultatif. |
| Opportunités | `opportunities` | Implémenté dans le socle | Statuts métier et source sont contraints par le schéma. |
| Activités / historique | `activities` | Implémenté dans le socle | Chronologie rattachée à l'organisation et aux objets métier. |
| Demandes client | `client_requests` | Implémenté dans le socle | Ne pas confondre avec un mécanisme générique de publication communautaire. |
| Relances persistantes | `crm_reminders` | Partiel / migration Git non appliquée selon son en-tête | Fonctionnalité conçue dans SQL ; activation et tests de production non certifiés. |
| Consentements / accusés de lecture | `privacy_acknowledgments` | Implémenté dans les migrations | Vérifier les politiques effectives et le parcours UX avant d'affirmer la conformité complète. |
| Campagnes commerciales | Aucun objet dédié identifié dans les migrations examinées | Absent du socle examiné | Proposition future, pas une fonction V5 acquise. |
| Projections / copies CRM partagées | Aucun objet dédié identifié | Absent du socle examiné | Conserver comme option d'architecture à arbitrer. |
| BrainOS / BrainIOS | Aucun objet dédié identifié | Hors périmètre du socle | Ne pas figer le modèle ni les flux avant cadrage fonctionnel. |

## 3. Autorisations et cloisonnement

| Sujet | État V5 documenté | Statut |
|---|---|---|
| Frontière tenant | `organization_id` sur les principales tables métier | Implémenté dans le socle SQL |
| Adhésion à une organisation | `organization_members` | Implémenté dans le socle SQL |
| Rôles effectifs | `owner/admin/member/viewer` | Implémenté dans le socle ; contrôle effectif à confirmer en base |
| Viewer en lecture seule | Fonction `private.is_org_editor(uuid)`, policies et grants dans la migration dédiée | Partiel : migration explicitement non appliquée en production |
| Contrôle de l'éditeur côté base | Policies RLS et privilèges de colonnes | Partiel : ne pas déduire de la seule présence du fichier SQL que la base active est alignée |
| Isolation des relations inter-tenant | Contraintes et contrôles de cohérence dédiés | Implémenté dans les migrations versionnées ; validation réelle à compléter |
| Accès service-role au provisionnement client | `provision_client_workspace(...)` | Implémenté dans le SQL versionné ; exécution réservée à `service_role` |
| Bootstrap du premier administrateur interne | RPC dédiée avec garde-fous | Implémenté dans une migration ; aucun compte administrateur ne doit être créé automatiquement |
| Transfert CRM entre organisations | Aucun flux de transfert implémenté identifié | Proposition |
| Partage sélectif de données / révocation | Pas de mécanisme complet identifié dans le socle examiné | Proposition |

## 4. Contrats applicatifs et API

| Contrat historique | Correspondance actuelle | Statut |
|---|---|---|
| Création d'espace client | Edge Function `provision-client-workspace` + RPC `provision_client_workspace` | Implémenté dans le périmètre rapporté ; parcours E2E non testé faute de compte client créé |
| Bootstrap admin interne | RPC de bootstrap, service-role uniquement | Implémenté côté SQL ; initialisation réelle volontairement en attente |
| CRUD entreprises / contacts / opportunités | Tables et politiques RLS du socle CRM | Partiel : fondation présente, parcours UI/E2E à valider |
| Journal d'activités | `activities` | Implémenté au niveau du modèle ; couverture fonctionnelle à tester |
| Traitement atomique d'une relance | RPC `complete_crm_reminder(uuid)` | Partiel : migration Git non appliquée en production selon son en-tête |
| Campagnes, transfert et partage CRM | Aucun endpoint complet identifié | Proposition / absent du socle |
| Contrat BrainOS/BrainIOS | Aucun contrat stabilisé | À cadrer ultérieurement, aucune décision d'architecture prise |

## 5. Règles de réécriture des anciens documents

1. Remplacer les rôles fonctionnels historiques proposés par le vocabulaire V5 réel, sans supprimer les besoins métiers qu'ils exprimaient.
2. Marquer toute permission non matérialisée par une policy, un grant ou un contrôle serveur comme « proposition ».
3. Décrire les tables V5 et leurs clés étrangères à partir des migrations, sans inventer de cardinalité ou de comportement non démontré.
4. Distinguer systématiquement : « présent dans le dépôt », « appliqué en production », « testé de bout en bout ».
5. Garder transferts, projections partagées, campagnes et BrainOS/BrainIOS au statut de pistes d'évolution.
6. Ne pas présenter `client_requests` comme un stockage des demandes publiques tant que le contrat, la finalité, la modération, le consentement et les politiques d'accès n'ont pas été conçus et validés.

## 6. Vérifications restantes avant validation

- Interroger Supabase en lecture seule pour confirmer les colonnes, contraintes, policies RLS, grants et fonctions réellement actives.
- Vérifier l'historique des migrations appliquées et rapprocher chaque version SQL du schéma courant.
- Exécuter des tests négatifs multi-tenant : lecture, insertion, mise à jour et relations croisées entre deux organisations.
- Tester les parcours provisionnement et CRM avec un compte de test dédié, sans créer le compte administrateur réel de l'utilisateur.
- Vérifier les relances, leur annulation/replanification et la création atomique d'activité après application contrôlée des migrations concernées.

**Conclusion :** V5 possède un socle CRM multi-tenant réel et des briques de provisionnement. Les anciennes spécifications A/B/C restent une source d'intentions métier, pas une description fidèle du système actuel. La PR documentaire historique ne doit pas être fusionnée telle quelle.
