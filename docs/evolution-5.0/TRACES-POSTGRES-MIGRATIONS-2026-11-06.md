# Traces PostgreSQL des migrations MajestiOS — 6 novembre 2026

Projet : `awtgrjnpckgxsdpfrnhg` — région `eu-west-3`.

## Preuve issue des journaux live Supabase

Les journaux PostgreSQL ont été interrogés en lecture seule sur deux fenêtres horaires ciblées. Ils contiennent les requêtes complètes envoyées au serveur, avec l'horodatage, le backend, le nom d'application, l'identifiant de session et l'adresse de connexion du client.

### Première séquence — 08:54 UTC

Six transactions d'application SQL sont visibles via `application_name = mgmt-api`, `backend_type = client backend`, utilisateur PostgreSQL `postgres` :

| Heure UTC | Migration reconnue dans le SQL |
|---|---|
| 08:54:09.352 | `bootstrap_first_internal_admin` |
| 08:54:11.966 | `enforce_crm_editor_roles` |
| 08:54:15.246 | `atomic_client_workspace_provisioning` |
| 08:54:17.275 | `persistent_crm_reminders` — première tentative |
| 08:54:30.860 | `persistent_crm_reminders` — nouvelle tentative |
| 08:54:34.830 | `sync_crm_reminder_lifecycle` |
| 08:54:36.773 | `complete_crm_reminder_with_activity` |

La première tentative de `persistent_crm_reminders` échoue à 08:54:17.662 UTC avec SQLSTATE `42883` : `function public.is_org_member(uuid) does not exist`. Le SQL de la nouvelle tentative à 08:54:30 contient l'appel corrigé à `private.is_org_member`. L'historique live des migrations confirme l'enregistrement de cette version corrigée.

Il y a donc **six migrations CRM distinctes enregistrées**, mais **sept soumissions SQL** dans les logs à cause de la première tentative échouée.

### Origine technique observable

Pour ces transactions, les journaux indiquent :
- application PostgreSQL : `mgmt-api` ;
- backend : `client backend` ;
- rôle PostgreSQL : `postgres` ;
- connexions issues d'adresses IPv6 du réseau de service Supabase.

Ces journaux ne donnent pas le nom du produit client ni l'identité humaine à l'origine de la requête. Ils prouvent le passage par l'API de gestion Supabase (`mgmt-api`), pas à eux seuls que le clic a été effectué depuis ChatGPT. En recoupant avec le compte rendu contemporain de 08:55 UTC et les outils Supabase connectés à la session, l'exécution via l'intégration Supabase de ChatGPT reste l'explication la plus probable, désormais étayée par les logs côté serveur.

### Treizième migration — 13:50 UTC

Une transaction SQL distincte apparaît à **13:50:37.630 UTC**, toujours via `mgmt-api` et `postgres`. Son contenu est explicitement la migration `grant_crm_record_updates`, qui accorde les privilèges UPDATE aux rôles authentifiés sur les tables CRM concernées. Elle correspond à la treizième entrée de l'historique live Supabase.

### Limites

- Les logs PostgreSQL prouvent les requêtes reçues et les erreurs observées ; ils ne révèlent pas l'interface ayant déclenché l'appel.
- Ils ne prouvent pas l'identité de l'opérateur humain.
- Aucun journal brut d'appel MCP/ChatGPT n'a été retrouvé.
- Les logs disponibles pour cette période exposaient `postgres_logs` et `postgrest_logs`, pas de flux distinct `function_edge_logs`.
- La lecture des logs n'a modifié aucune donnée.

## Périmètre de l'enquête

Lecture seule : aucune migration, requête d'écriture, modification de fonction, configuration, donnée CRM ou immeuble interactif n'a été effectuée.


## Vérification complémentaire — métadonnées de l'historique

Lecture directe de `supabase_migrations.schema_migrations` (SELECT uniquement) :

- les 13 entrées sont présentes ;
- le champ `created_by` contient la même valeur déclarative pour les 13 migrations ;
- `idempotency_key` est nul pour les 13 entrées ;
- la table ne possède pas de colonne `created_at` : la tentative de lecture de cette colonne a renvoyé une erreur de schéma, sans effet sur la base.

Le champ `created_by` est une métadonnée enregistrée dans l'historique des migrations. Il est cohérent avec l'identifiant transmis dans le SQL de chaque migration, mais il ne constitue pas une preuve cryptographique de l'identité humaine qui a déclenché l'appel API. Il ne permet donc pas d'attribuer formellement l'opération à une personne ou à une interface précise.

## Inventaire des journaux disponibles

Sur les fenêtres interrogées du 6 novembre 2026, la table unifiée de logs ne retourne que deux sources : `postgres_logs` et `postgrest_logs`. Aucun flux `edge_logs`, `function_edge_logs` ou journal d'audit de déploiement n'est disponible dans ces résultats pour cette période. Les journaux PostgreSQL permettent donc de prouver les requêtes SQL et l'erreur, mais pas de reconstituer l'appel API côté client ni le déploiement de la fonction Edge.


## Concordance exacte entre le SQL enregistré en production et les fichiers GitHub

Une vérification complémentaire a été menée en lecture seule. Pour chacune des sept migrations CRM enregistrées dans `supabase_migrations.schema_migrations`, le contenu de `statements[1]` a été comparé caractère par caractère au contenu du fichier SQL GitHub correspondant.

Résultat : **7 correspondances exactes sur 7** (même longueur et égalité stricte des chaînes SQL).

| Version enregistrée en production | Migration | Fichier GitHub correspondant | Branche | Résultat |
|---|---|---|---|---|
| `20261106085409` | `bootstrap_first_internal_admin` | `20261106031500_bootstrap_first_internal_admin.sql` | `evolution-5.0-admin-cockpit` | Exact |
| `20261106085411` | `enforce_crm_editor_roles` | `20261106074500_enforce_crm_editor_roles.sql` | `evolution-5.0-admin-cockpit` | Exact |
| `20261106085415` | `atomic_client_workspace_provisioning` | `20261106090000_atomic_client_workspace_provisioning.sql` | `evolution-5.0-admin-cockpit` | Exact |
| `20261106085430` | `persistent_crm_reminders` | `20261106100000_persistent_crm_reminders.sql` | `evolution-5.0-admin-cockpit` | Exact |
| `20261106085434` | `sync_crm_reminder_lifecycle` | `20261106110000_sync_crm_reminder_lifecycle.sql` | `evolution-5.0-admin-cockpit` | Exact |
| `20261106085436` | `complete_crm_reminder_with_activity` | `20261106120000_complete_crm_reminder_with_activity.sql` | `evolution-5.0-admin-cockpit` | Exact |
| `20261106135037` | `grant_crm_record_updates` | `20261106135037_grant_crm_record_updates.sql` | `evolution-5.0-clean-preview` | Exact |

### Portée et limites

- Cette comparaison établit que le SQL conservé dans l'historique Supabase pour les sept migrations correspond exactement aux fichiers GitHub indiqués.
- La septième migration est retrouvée dans `evolution-5.0-clean-preview`, pas dans `evolution-5.0-admin-cockpit` au moment de la vérification. C'est une divergence documentaire entre branches à conserver dans l'audit, pas une raison de relancer la migration.
- La première tentative de `persistent_crm_reminders` du 6 novembre à 08:54:17 UTC a échoué et n'est pas une entrée supplémentaire dans l'historique des migrations. La version enregistrée `20261106085430` correspond au SQL corrigé, comparé ci-dessus.
- Cette concordance prouve l'identité du SQL enregistré et des fichiers de référence. Elle ne prouve toujours pas quelle interface ou quelle personne a déclenché les appels API.

Aucune écriture, migration, modification de schéma ou opération sur les données n'a été effectuée pendant cette vérification.
