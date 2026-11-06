# État du backend MajestiOS — 6 novembre 2026

## 1. Périmètre et statut

Le projet Supabase `majestios-backend` est créé dans l'organisation Chexpeer's Org, région Paris (`eu-west-3`).

- Référence du projet : `awtgrjnpckgxsdpfrnhg`.
- État contrôlé : `ACTIVE_HEALTHY`.
- PostgreSQL : version 17.11.
- Branche du dépôt contenant les migrations et les fonctions : `evolution-5.0-clean-preview`.

Le backend constitue une **fondation technique** pour l'authentification, les espaces de travail et le futur CRM. Il ne constitue pas encore un CRM opérationnel ni une chaîne de collecte et de prospection automatisée.

Aucune donnée client, aucun prospect issu d'une source externe et aucune annonce BOAMP/BODACC n'ont été importés dans la base. Aucun compte Auth utilisateur ni membre de l'organisation interne n'était provisionné au dernier contrôle.

## 2. Migrations appliquées

Six migrations versionnées sont présentes et appliquées dans le projet :

1. `20261105163901_majestios_core_multitenant_foundation.sql`
2. `20261105163922_harden_private_authorization_and_fk_indexes.sql`
3. `20261105163953_enforce_tenant_relationship_integrity.sql`
4. `20261105164403_add_private_consent_records.sql`
5. `20261105164411_replace_consent_placeholder_with_privacy_acknowledgments.sql`
6. `20261105164732_harden_privacy_acknowledgment_access.sql`

Elles établissent le socle multi-tenant, renforcent les contrôles d'autorisation, imposent l'intégrité des relations entre organisations et ajoutent un journal serveur de prise de connaissance de la politique de confidentialité.

## 3. Tables présentes

Neuf tables sont présentes dans le schéma public :

| Table | Rôle |
|---|---|
| `organizations` | Périmètre d'organisation / tenant |
| `profiles` | Profil minimal lié à `auth.users` |
| `organization_members` | Appartenance à un espace et rôle |
| `businesses` | Fiches d'entreprises |
| `contacts` | Interlocuteurs professionnels |
| `opportunities` | Opportunités et pipeline commercial |
| `activities` | Historique des actions commerciales |
| `client_requests` | Demandes émises depuis un espace client authentifié |
| `privacy_acknowledgments` | Historique serveur des versions de politique reconnues |

Les valeurs de référence actuellement prévues sont :

- `organizations.kind` : `internal`, `client`, `partner`.
- `organization_members.role` : `owner`, `admin`, `member`, `viewer`.
- `opportunities.pipeline_status` : `detected`, `to_qualify`, `qualified`, `to_contact`, `contacted`, `meeting`, `proposal`, `won`, `lost`, `archived`.
- `opportunities.source_type` : `manual`, `boamp`, `bodacc`, `private_market`, `partner`, `other`.

**Distinction métier à préserver :** `organizations.kind` qualifie le type d'espace de données, pas le statut commercial d'une entreprise. Prospect, client, partenaire et entreprise à exclure du contact doivent être représentés par une relation commerciale distincte et gouvernée. Le registre de blocage / liste d'exclusion demandé pour éviter certains contacts n'est pas encore implémenté. Il ne faut pas détourner les rôles des membres ou le type de tenant pour porter ces statuts.

Une organisation interne existe : `majestios-interne` (`kind = internal`). Aucun compte Auth utilisateur et aucun membre interne n'étaient recensés au dernier contrôle ; le premier administrateur n'a donc pas encore été provisionné.

## 4. Sécurité et isolation

- RLS est activé sur les neuf tables du schéma public.
- Les fonctions d'autorisation `private.is_org_member`, `private.is_org_admin` et `private.is_internal_staff` sont placées dans le schéma privé `private`.
- Les fonctions SECURITY DEFINER sensibles ne sont pas exposées à l'API publique ; l'exécution anonyme est révoquée.
- Les politiques limitent l'accès aux données métier selon l'appartenance à l'organisation et le rôle.
- Des contrôles d'intégrité empêchent les relations inter-organisations et le déplacement d'une ligne vers un autre tenant.
- Les activités sont conçues en historique append-only pour les rôles applicatifs.
- L'accès direct à `privacy_acknowledgments` est refusé aux rôles `anon` et `authenticated` ; l'écriture est effectuée par le flux serveur prévu.
- La clé `service_role` reste exclusivement côté serveur. Le navigateur utilise la clé publishable du projet.

Dernier contrôle connu : le conseiller de sécurité Supabase ne signalait aucun lint restant. Cela ne remplace pas des tests d'autorisation applicatifs complets, des tests multi-tenant ni une revue de sécurité avant ouverture publique.

## 5. Authentification et fonction serveur

Le raccordement du parcours espace membre est **présent dans le code**, mais son fonctionnement complet n'est pas encore validé de bout en bout :

- `espace-membre.html` charge `auth-espace-membre.js`.
- Le module prévoit inscription, connexion, demande de réinitialisation et mise à jour du mot de passe via Supabase Auth.
- Le navigateur utilise la clé publishable définie dans `supabase-config.js`.
- La fonction Edge `provision-client-workspace` est toujours déployée en version 2 avec vérification JWT activée. **Le code source actuellement versionné dans la branche n'a pas été redéployé** : il appelle désormais la RPC atomique `public.provision_client_workspace`.
- **Limite importante sur la preuve de confidentialité :** la version actuelle vérifie `user_metadata.privacy_notice_acknowledged` et `user_metadata.privacy_notice_version`. Or `user_metadata` est modifiable par l'utilisateur. La ligne créée dans `privacy_acknowledgments` est bien écrite côté serveur, mais son déclencheur actuel n'est pas une preuve indépendante et infalsifiable d'un clic sur la case à cocher. Ne pas présenter cette donnée comme une preuve juridique robuste avant mise en place d'un mécanisme de consentement vérifiable côté serveur.
- La migration `20261106090000_atomic_client_workspace_provisioning.sql` installe cette RPC, qui sérialise les tentatives concurrentes par utilisateur et crée ou complète l'espace dans une transaction. Cette migration est versionnée dans GitHub uniquement et **n'a pas été appliquée au projet Supabase**.
- En conséquence, le parcours actuellement déployé ne doit pas être décrit comme utilisant le nouveau provisionnement atomique. La recette Auth et le test de la RPC restent bloqués jusqu'à application contrôlée de la migration puis déploiement explicite de la fonction Edge.

**Limites de validation :** aucune recette complète avec une véritable boîte e-mail n'a été confirmée. Les URL de redirection, les modèles et l'expédition des e-mails, les protections CAPTCHA / limitation de débit et les scénarios de récupération doivent être testés avant ouverture publique.

Aucun workflow d'invitation de collaborateurs, aucun premier administrateur interne et aucun mécanisme d'approbation des nouveaux membres ne sont encore livrés.

## 6. Connexions métier encore absentes

Les éléments suivants ne sont pas opérationnels :

- aucune passerelle BOAMP ou BODACC vers la table `opportunities` ;
- aucune ingestion planifiée d'annuaires officiels ou de données d'entreprises ;
- aucune déduplication persistante ou historisation des observations de sources ;
- aucun CRM interne utilisable pour enregistrer et suivre les prospects ;
- aucun espace client complet avec dossiers, échanges et activités persistants ;
- aucun formulaire public de contact ou de candidature raccordé à un endpoint serveur ;
- aucun stockage de CV ou de KBIS et aucun bucket Storage ;
- aucun registre de relations prospect / client / partenaire ni liste d'exclusion des contacts ;
- aucune automatisation de prospection ou d'envoi de messages.

Les formulaires publics devront passer par des endpoints serveur avec validation, protections anti-spam, minimisation, finalités et durées de conservation définies avant toute collecte.

## 7. Migrations en attente — état au 6 novembre 2026

Les migrations suivantes sont présentes dans la branche GitHub mais ne font pas partie des six migrations appliquées listées plus haut :

- `20261106031500_bootstrap_first_internal_admin.sql` : installe une procédure de bootstrap unique, réservée au rôle `service_role`. Elle ne crée aucun utilisateur Auth et n'accorde aucun accès tant qu'elle n'est pas exécutée explicitement après création et confirmation du compte administrateur.
- `20261106074500_enforce_crm_editor_roles.sql` : rend le rôle `viewer` strictement consultatif dans les politiques d'écriture et protège les colonnes d'audit / rattachement.
- `20261106090000_atomic_client_workspace_provisioning.sql` : installe la RPC transactionnelle appelée par la nouvelle version source de la fonction Edge.

**Aucune de ces trois migrations n'a été appliquée à Supabase.** Le code navigateur et la fonction Edge versionnés ne constituent donc pas une validation opérationnelle du CRM ou de l'inscription.

## 8. Gouvernance et ordre de reprise

Le socle Supabase est conservé comme fondation versionnée. **Aucune extension backend n'est engagée dans le lot courant tant que le chantier du site, de la navigation, des liens et des parcours n'est pas stabilisé.**

Lors de la reprise du chantier backend, l'ordre recommandé est :

1. définir séparément les statuts commerciaux prospect / client / partenaire et le registre d'exclusion ;
2. confirmer le modèle de relation entre entreprises, contacts, organisations et membres ;
3. provisionner l'administrateur interne par un canal privilégié ;
4. valider Auth de bout en bout, invitations, récupération et contrôles anti-abus ;
5. définir les contrats, finalités, droits d'usage et durées de conservation de chaque source ;
6. construire et tester les passerelles de données et les règles de déduplication ;
7. connecter progressivement les formulaires et le CRM avec des tests RLS multi-tenant ;
8. ne créer Storage qu'après définition des règles d'accès, de conservation et de suppression.

Toute extension doit conserver la séparation CRM interne / espace client / moteur de qualification, la provenance des informations, les décisions humaines, les règles d'exclusion et les tests anti-régression.

## 9. Références techniques

- Projet : `https://awtgrjnpckgxsdpfrnhg.supabase.co`.
- Migrations : `supabase/migrations/`.
- Configuration navigateur : `supabase-config.js`.
- Auth espace membre : `auth-espace-membre.js`.
- Fonction serveur : `supabase/functions/provision-client-workspace/index.ts`.

Les identifiants ci-dessus sont des références de projet, pas des secrets. Aucune clé privée ne doit figurer dans cette documentation.
