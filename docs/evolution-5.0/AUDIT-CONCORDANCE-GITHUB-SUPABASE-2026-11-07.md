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
