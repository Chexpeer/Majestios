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
