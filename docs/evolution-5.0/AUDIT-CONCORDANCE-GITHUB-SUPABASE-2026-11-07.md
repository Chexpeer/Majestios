# MajestiOS — audit de concordance GitHub / Supabase avant extension du CRM

**Date du contrôle :** 7 novembre 2026  
**Projet Supabase :** `majestios-backend` — `awtgrjnpckgxsdpfrnhg` — région `eu-west-3`  
**Branche GitHub examinée :** `evolution-5.0-admin-cockpit`  
**Nature du contrôle :** lectures seules (catalogue PostgreSQL, tables, migrations, politiques RLS, fonctions et Storage).  
**Aucune écriture backend n'a été exécutée.**

## 1. Résultat principal : ne pas lancer de migration avant réconciliation

Le schéma live est plus avancé que certaines documentations de la branche, mais son historique de migrations ne correspond pas exactement aux noms et versions de fichiers présents dans la branche GitHub.

Le projet Supabase retourne notamment des versions :
- `20261106085409`
- `20261106085411`
- `20261106085415`
- `20261106085430`
- `20261106085434`
- `20261106085436`
- `20261106135037`

La branche GitHub contient à certains endroits des migrations proches fonctionnellement, mais avec d'autres horodatages, par exemple :
- `20261106031500_bootstrap_first_internal_admin.sql`
- `20261106074500_enforce_crm_editor_roles.sql`
- `20261106090000_atomic_client_workspace_provisioning.sql`

Les tentatives de lecture des fichiers correspondant exactement aux versions live retournées par Supabase ont donné 404 dans la branche examinée. Cela ne prouve pas que le code SQL live est incorrect ; cela établit une **dérive de traçabilité entre l'historique Supabase et la branche GitHub consultée**.

**Décision de sécurité :** ne pas exécuter de `apply_migration`, ne pas rejouer une migration homonyme, ne pas réinitialiser la base et ne pas tenter de « réaligner » les versions par supposition. Il faut d'abord récupérer ou reconstituer les sources exactes des migrations appliquées et comparer leur contenu.

## 2. Inventaire live des tables publiques

Le projet retourne dix tables publiques, toutes avec RLS activé :

| Table | Fonction constatée |
|---|---|
| `organizations` | frontière de tenant (interne, client, partenaire) |
| `organization_members` | appartenance et rôle |
| `profiles` | profil personnel minimal |
| `businesses` | fiches entreprises par organisation |
| `contacts` | contacts professionnels |
| `opportunities` | pipeline commercial |
| `activities` | historique d'activité |
| `client_requests` | demandes adressées à MajestiOS |
| `privacy_acknowledgments` | journal de prise de connaissance d'une notice |
| `crm_reminders` | relances CRM persistantes |

Le schéma live ne retourne aucune table dédiée aux consultations, lots, pièces de consultation, exigences, analyses IA, correspondances entreprise/lot ou candidatures.

Les tables `opportunities` et `client_requests` ne doivent pas être détournées pour remplacer ces objets.

## 3. Inventaire des politiques RLS live

Les politiques lues directement dans `pg_policies` indiquent :

- `organizations`, `organization_members` : lecture par les membres de l'organisation ;
- `profiles` : lecture et mise à jour de son propre profil ;
- `businesses`, `contacts`, `opportunities` : lecture par les membres, écriture par les éditeurs, suppression par les administrateurs ;
- `activities` : lecture par les membres et ajout par les éditeurs, sans politique de modification/suppression applicative ;
- `client_requests` : création par les membres, lecture par le demandeur/membre ou l'équipe interne, changement de statut par le personnel interne ;
- `crm_reminders` : lecture par les membres et marquage comme lu par les éditeurs ;
- `privacy_acknowledgments` : politique de refus de tout accès direct API pour `anon` et `authenticated`.

Les fonctions d'autorisation présentes dans le schéma privé sont :
- `private.is_org_member(uuid)` ;
- `private.is_org_admin(uuid)` ;
- `private.is_org_editor(uuid)` ;
- `private.is_internal_staff()`.

Elles sont déclarées `SECURITY DEFINER`. Leur présence dans le schéma privé et leurs droits d'exécution doivent rester encadrés ; aucune nouvelle fonction privilégiée ne doit être ajoutée sans revue dédiée.

La fonction `public.provision_client_workspace(...)` est également présente en `SECURITY DEFINER`. Son contrôle d'exécution, ses paramètres, son appelant réel et son équivalence avec le code versionné doivent être vérifiés avant de l'utiliser comme fondation d'un nouveau parcours public.

## 4. Storage

Le catalogue `storage.buckets` ne retourne aucun bucket.

Conséquence directe : aucun dépôt de KBIS, assurance, justificatif financier, CV ou pièce de candidature ne doit être présenté comme disponible dans le backend actuel. La conception Storage devra préciser les propriétaires, chemins, politiques, durées de conservation, téléchargements temporaires, suppression et journalisation avant la création du premier bucket.

## 5. Écarts de documentation à corriger

La documentation `ETAT-BACKEND-SUPABASE.md` présente un état au 6 novembre qui indique neuf tables et six migrations appliquées, et qualifie trois autres migrations de non appliquées. Le contrôle live du 7 novembre montre dix tables et treize entrées dans l'historique des migrations.

Cela signifie que ce document est daté et ne peut plus être utilisé seul comme état courant. Il faut le mettre à jour à partir d'une comparaison ligne par ligne entre :
1. les versions de migrations retournées par Supabase ;
2. les fichiers réellement présents dans les branches GitHub pertinentes ;
3. le schéma, les fonctions, les triggers, les politiques et les grants réellement observés.

Ne pas assimiler une migration GitHub non présente sous le même nom à une migration live absente : les horodatages différents peuvent correspondre à une autre série de commits ou à une branche antérieure.

## 6. Incidences pour le futur modèle appels d'offres

Le modèle conceptuel des consultations et lots peut continuer à être affiné dans la documentation, mais aucun SQL ne doit être généré avant les étapes suivantes :

1. retrouver les sources exactes des treize migrations live ;
2. identifier la branche GitHub qui représente réellement l'état livré ;
3. comparer les définitions live avec les migrations et les fichiers de configuration ;
4. confirmer les helpers d'autorisation, les rôles et les privilèges de chaque fonction ;
5. documenter les relations multi-tenant et les clés étrangères composées nécessaires aux nouveaux objets ;
6. définir la matrice RLS par table et par opération ;
7. écrire les tests d'isolation avant toute migration.

La première extension devra isoler clairement les données de consultation publiques des dossiers de candidature privés et du CRM interne.

## 7. État de réalisation après ce contrôle

- Modèle conceptuel consultations / lots / documents / exigences : documenté.
- Inventaire live des tables : contrôlé.
- Inventaire live des politiques RLS : contrôlé en lecture seule.
- Présence de Storage : contrôlée, aucun bucket.
- Concordance complète des migrations GitHub / Supabase : **non résolue**.
- Migration, RLS, fonction, bucket ou donnée modifiés : **non**.
- Déploiement ou merge : **non**.
- Immeuble interactif : hors périmètre et inchangé.

**Prochaine étape technique : réconcilier l'historique des migrations et identifier la branche de référence du backend avant de préparer la matrice RLS définitive.**


## 8. Contrôle complémentaire du 7 novembre 2026 — état du projet et limites de sauvegarde

Un nouveau contrôle en lecture seule a été réalisé via l'API de gestion Supabase :

- Projet : `majestios-backend` ; référence `awtgrjnpckgxsdpfrnhg`.
- Organisation : identifiant `rgzepnxzzcusrosifcnx` (organisation affichée dans le compte : **Chexpeer's Org**).
- Région : `eu-west-3`.
- État retourné : `ACTIVE_HEALTHY`.
- PostgreSQL : version 17.11.
- Tables publiques : 10, toujours toutes avec RLS activé.
- Historique des migrations : 13 entrées, dont la dernière retournée est `20261106135037_grant_crm_record_updates`.
- Fonction Edge active retournée : `provision-client-workspace`, version 3, JWT obligatoire.

### Volumétrie constatée

Le relevé SQL précédent indique :

| Ressource | Nombre de lignes |
|---|---:|
| organizations | 1 |
| organization_members | 1 |
| profiles | 1 |
| businesses | 0 |
| contacts | 0 |
| opportunities | 0 |
| activities | 0 |
| client_requests | 0 |
| privacy_acknowledgments | 0 |
| crm_reminders | 0 |
| auth.users | 1 |

Les zéros des tables métier signifient qu'aucune fiche métier n'y a encore été enregistrée au moment du relevé. Ils ne signifient pas que le CRM ou son schéma peuvent être supprimés : le code, les tables, les relations, les politiques et les fonctions existent.

### Ce que ce contrôle ne constitue pas

Ce contrôle est un **inventaire technique en lecture seule**, pas une sauvegarde. Il ne contient pas les données exportées, les secrets, les fichiers Storage, ni une copie restaurable de PostgreSQL.

Les outils connectés disponibles dans cette session ne fournissent pas de commande de téléchargement d'un dump SQL complet ni d'archive physique. Aucun dump n'a donc été créé et aucune sauvegarde restaurable n'est revendiquée.

### Procédure de protection adaptée à une utilisation actuelle sur téléphone

Tant que l'utilisateur ne dispose que de son téléphone :

1. ne pas supprimer, mettre en pause, réinitialiser ou migrer le projet existant ;
2. ne pas créer un second projet payant ou une branche Supabase de développement ;
3. conserver le dépôt GitHub et les documents d'audit comme sauvegarde du code et de la documentation uniquement ;
4. différer le dump PostgreSQL jusqu'à l'accès à un ordinateur, ou jusqu'à la disponibilité d'un environnement local sûr capable d'exécuter Supabase CLI ;
5. lors de cette session ultérieure, produire au minimum un dump du schéma et des données, vérifier son intégrité, puis traiter séparément les éventuels objets Storage ;
6. ne jamais transmettre une clé `service_role`, un mot de passe de base ou un secret dans la conversation.

**Décision maintenue :** projet actuel conservé intact ; aucune création de projet Foundation, aucune migration, aucune modification CRM, aucun changement de l'immeuble interactif, aucun déploiement.


## 9. Réconciliation approfondie des migrations et des branches — contrôle du 7 novembre 2026

### 9.1 Les deux branches backend ne sont pas interchangeables

La comparaison GitHub entre `evolution-5.0-clean-preview` et `evolution-5.0-admin-cockpit` retourne :

- statut : `diverged` ;
- 245 commits d'avance côté `evolution-5.0-admin-cockpit` ;
- 259 commits d'avance côté `evolution-5.0-clean-preview` ;
- ancêtre commun retourné : `7ea2f31944c2b8daddad50fb78468a1a5af992e2`.

Ce sont deux lignées divergentes, pas une simple branche en avance sur l'autre. Aucune fusion ni promotion ne doit être tentée pour résoudre le sujet.

Le document historique `ETAT-BACKEND-SUPABASE.md` désigne `evolution-5.0-clean-preview` comme branche contenant les migrations et fonctions. Cette indication est un repère historique, pas une preuve suffisante que cette branche est aujourd'hui la source exacte du backend live.

### 9.2 Correspondance nominale entre l'historique live et les fichiers SQL

Les sept entrées live de novembre 2026 correspondent par leur nom aux sept migrations fonctionnelles retrouvées dans GitHub, mais les six premières portent des horodatages différents :

| Version enregistrée par Supabase | Nom live | Fichier retrouvé dans GitHub |
|---|---|---|
| `20261106085409` | `bootstrap_first_internal_admin` | `20261106031500_bootstrap_first_internal_admin.sql` |
| `20261106085411` | `enforce_crm_editor_roles` | `20261106074500_enforce_crm_editor_roles.sql` |
| `20261106085415` | `atomic_client_workspace_provisioning` | `20261106090000_atomic_client_workspace_provisioning.sql` |
| `20261106085430` | `persistent_crm_reminders` | `20261106100000_persistent_crm_reminders.sql` |
| `20261106085434` | `sync_crm_reminder_lifecycle` | `20261106110000_sync_crm_reminder_lifecycle.sql` |
| `20261106085436` | `complete_crm_reminder_with_activity` | `20261106120000_complete_crm_reminder_with_activity.sql` |
| `20261106135037` | `grant_crm_record_updates` | `20261106135037_grant_crm_record_updates.sql` |

Les six premières correspondances sont nominales et fonctionnelles à ce stade ; l'historique Supabase ne livre pas le texte SQL exécuté. Il n'est donc pas possible d'affirmer une identité octet par octet entre chaque fichier GitHub et le SQL historique.

### 9.3 Différence précise entre les deux versions de la migration des relances

Les fichiers `20261106100000_persistent_crm_reminders.sql` des deux branches ont une seule différence textuelle relevée :

- `evolution-5.0-clean-preview` : la politique de lecture appelle `public.is_org_member(organization_id)` ;
- `evolution-5.0-admin-cockpit` : elle appelle `private.is_org_member(organization_id)`.

Le contrôle de `pg_policies` sur le projet live confirme que la politique effective appelle **`private.is_org_member(organization_id)`**. Sur ce point précis, le fichier de la branche `evolution-5.0-admin-cockpit` correspond à l'expression live ; la version de `evolution-5.0-clean-preview` ne correspond pas.

La fonction live `private.materialize_crm_reminders()` réactive une relance annulée en cas de conflit sur la même échéance (remise à `pending`, actualisation du titre et de l'action, remise à zéro des dates de lecture et d'annulation). Cette logique n'est pas dans la migration initiale `20261106100000_persistent_crm_reminders.sql`, qui utilise `DO NOTHING`, mais elle est bien introduite par la migration suivante `20261106110000_sync_crm_reminder_lifecycle.sql`, qui redéfinit cette fonction avec `ON CONFLICT ... DO UPDATE`. Le corps de la fonction live lu via `pg_get_functiondef` correspond à cette version ultérieure. **Cet écart est donc expliqué par la séquence des migrations et n'est pas, à lui seul, une dérive SQL non versionnée.**

### 9.4 Les commentaires « non appliquée » sont devenus obsolètes

Les fichiers `20261106074500_enforce_crm_editor_roles.sql`, `20261106100000_persistent_crm_reminders.sql` et `20261106110000_sync_crm_reminder_lifecycle.sql` contiennent des commentaires indiquant qu'ils sont versionnés dans GitHub uniquement / non appliqués en production. Or l'historique live Supabase contient les migrations portant ces trois noms, et le schéma live expose les politiques, objets, triggers et fonctions correspondants.

Ces commentaires ne décrivent donc plus de manière fiable l'état live actuel. Ils ne doivent pas être utilisés comme preuve de non-application.

### 9.5 La migration de grants est absente d'une des branches

Le fichier `20261106135037_grant_crm_record_updates.sql` est présent dans `evolution-5.0-clean-preview` mais absent de `evolution-5.0-admin-cockpit`.

Le contrôle live de `information_schema.role_table_grants` confirme néanmoins le privilège `UPDATE` pour `authenticated` sur `businesses`, `contacts` et `opportunities`. Les politiques RLS restent présentes et déterminent les lignes et rôles autorisés.

La branche `evolution-5.0-admin-cockpit` ne contient donc pas à elle seule l'ensemble des fichiers qui expliquent les privilèges live constatés.

### 9.6 Contrôles live complémentaires des relances

Les lectures seules du catalogue PostgreSQL confirment :

- la table `public.crm_reminders` existe ;
- son état inclut `pending`, `read` et `cancelled` ;
- la colonne `cancelled_at` existe ;
- les deux politiques live de lecture et de traitement appellent les helpers du schéma `private` ;
- le job `majestios-crm-reminders` est actif, planifié toutes les cinq minutes ;
- la fonction de matérialisation live contient la logique de réactivation décrite ci-dessus ;
- la fonction `public.complete_crm_reminder(uuid)` existe et écrit une activité dans la chronologie commerciale.

Ces constats démontrent que le dispositif de relances existe bien dans le backend live. Ils ne constituent pas une validation fonctionnelle de bout en bout et n'autorisent aucune modification du CRM.

### 9.7 Conclusion de réconciliation

La situation est maintenant mieux circonscrite :

1. les noms des sept migrations live sont retrouvés dans les fichiers GitHub ;
2. les six premiers horodatages de fichiers ne correspondent pas aux versions inscrites dans l'historique Supabase ;
3. les deux branches sont fortement divergentes ;
4. la politique de lecture des relances live correspond à la variante `private.is_org_member` de `evolution-5.0-admin-cockpit` ;
5. la logique live de réactivation des relances est expliquée par la migration ultérieure `20261106110000_sync_crm_reminder_lifecycle.sql` ;
6. la migration de grants est absente de la branche `evolution-5.0-admin-cockpit`, alors que ses privilèges sont observés dans le backend ;
7. certains commentaires GitHub « non appliquée » sont contredits par l'historique et les objets live.

**Décision : la réconciliation n'est pas clôturée.** Il faut retrouver la source exacte de la fonction de matérialisation live et la provenance des grants, puis comparer les sept définitions SQL historiques si elles peuvent être récupérées. En attendant : aucune migration, aucun changement de privilège, aucun déploiement Edge, aucune fusion de branches, aucune réinitialisation.

**Périmètre inchangé :** contrôle en lecture seule de Supabase et documentation GitHub uniquement. Aucun objet CRM, aucune donnée, aucune politique, aucune fonction, aucun job et aucun élément de l'immeuble interactif n'ont été modifiés.
