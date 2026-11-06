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

**Décision : la réconciliation n'est pas clôturée.** La logique live de matérialisation est retrouvée dans la migration de cycle de vie. Il reste à tracer la provenance du grant d'UPDATE, à expliquer les horodatages divergents et à déterminer comment préserver une source de vérité unique sans fusionner aveuglément les deux lignées. L'historique Supabase ne donnant pas le texte SQL historique, une comparaison byte-à-byte reste impossible avec les seules données accessibles. En attendant : aucune migration, aucun changement de privilège, aucun déploiement Edge, aucune fusion de branches, aucune réinitialisation.

**Périmètre inchangé :** contrôle en lecture seule de Supabase et documentation GitHub uniquement. Aucun objet CRM, aucune donnée, aucune politique, aucune fonction, aucun job et aucun élément de l'immeuble interactif n'ont été modifiés.


## 10. Provenance de la migration de grants et décision sur la branche de référence — 7 novembre 2026

### 10.1 Origine Git vérifiée de `grant_crm_record_updates`

L'historique GitHub du fichier permet désormais de reconstituer sa séquence :

1. **13:50:41 UTC** — commit `60ba793541b926891e97cdf027304bee7e5d37b3`, intitulé **« Grant CRM editor update privileges »**. Il ajoute le fichier `supabase/migrations/20261106135000_grant_crm_record_updates.sql`.
2. Le contenu de ce premier fichier contient exactement trois instructions :
   - `grant update on table public.businesses to authenticated;`
   - `grant update on table public.contacts to authenticated;`
   - `grant update on table public.opportunities to authenticated;`
   Le commentaire précise que les contrôles d'organisation et de rôle restent assurés par les politiques RLS.
3. **13:50:51 UTC** — commit `f659a2123ef7797f7e862c86202d362fce3518f5`, intitulé **« Align CRM update migration version with Supabase history »**. Il ajoute la version renommée `supabase/migrations/20261106135037_grant_crm_record_updates.sql`, avec le même contenu SQL.
4. Le fichier versionné sous le nom final est présent dans `evolution-5.0-clean-preview), et absent de `evolution-5.0-admin-cockpit). L'historique Git de ce chemin sur la branche clean-preview retourne le commit de réalignement `f659a212...`.

Cette séquence explique précisément le passage du suffixe `135000` au suffixe `135037` : le second commit a renommé la migration pour aligner son identifiant sur celui retourné par l'historique Supabase.

**Limite de preuve importante :** GitHub établit l'origine, le contenu et le renommage du fichier. Le catalogue Supabase établit que la migration portant le nom `grant_crm_record_updates` figure dans l'historique live et que les trois privilèges sont présents. Les éléments disponibles ne prouvent toutefois pas quel canal exact a exécuté le SQL (CLI, SQL Editor ou autre processus), ni ne fournissent le journal d'exécution contenant le texte SQL historique. On ne doit donc pas affirmer que le commit GitHub a, à lui seul, déclenché l'application en production.

### 10.2 Pourquoi les six autres versions ne correspondent pas aux horodatages des fichiers

Le constat reste le suivant : les six premières versions enregistrées dans l'historique Supabase (de `20261106085409` à `20261106085436`) ne sont pas les préfixes des six fichiers retrouvés dans le dépôt (de `20261106031500` à `20261106120000`).

La migration de grants fournit un exemple démontré d'un réalignement volontaire d'horodatage, mais **elle ne permet pas de généraliser cette explication aux six autres migrations**. Aucune preuve suffisante n'établit à ce stade si leurs identifiants live résultent d'un renommage, d'une exécution via un autre canal, d'une génération d'identifiants distincts ou d'une autre séquence de livraison.

Pour lever ce point, il faudra obtenir le journal de déploiement/migration d'origine ou une archive du dépôt et de l'environnement utilisés lors de l'application. Tant que cette preuve n'est pas disponible, les correspondances restent nominales/fonctionnelles et non une équivalence historique exacte.

### 10.3 Quelle branche peut être déclarée référence ?

**Aucune des deux branches ne peut actuellement être certifiée comme source de vérité complète du backend live.**

- `evolution-5.0-clean-preview` contient la migration de grants finale et sa provenance Git, mais sa variante de la politique de lecture dans `20261106100000_persistent_crm_reminders.sql` appelle `public.is_org_member`, alors que la politique live appelle `private.is_org_member`.
- `evolution-5.0-admin-cockpit` contient la variante de cette politique qui correspond au catalogue live et porte les documents d'audit les plus récents, mais ne contient pas le fichier de migration qui explique les privilèges UPDATE live.
- Les deux branches restent divergentes de plusieurs centaines de commits au total ; leur fusion ne constitue pas une opération de réconciliation sûre.

**Décision provisoire :**
- conserver `evolution-5.0-admin-cockpit` comme branche de travail documentaire pour le présent audit ;
- utiliser `evolution-5.0-clean-preview` comme source de preuve historique pour la migration de grants ;
- ne déclarer ni l'une ni l'autre « branche canonique backend » ;
- ne copier, rejouer, renommer ou appliquer aucune migration pour le seul motif de faire disparaître l'écart ;
- établir ultérieurement une référence backend canonique par comparaison des contenus SQL, des objets live et des preuves de livraison, puis seulement préparer une réconciliation contrôlée.

Cette décision n'autorise ni merge, ni déploiement, ni modification du schéma ou des privilèges.

### 10.4 État final de cette étape

- Provenance Git de la migration de grants : **retrouvée**.
- Renommage `135000` → `135037` : **démontré par deux commits successifs et leurs diffs**.
- Canal exact d'application en production : **non établi**.
- Cause des six autres écarts d'horodatage : **non établie**.
- Branche canonique backend : **non déterminée**.
- Branche de travail documentaire : `evolution-5.0-admin-cockpit`.
- Modification Supabase, migration, grant, politique, fonction, job ou donnée : **aucune**.
- Modification du code CRM ou de l'immeuble interactif : **aucune**.
- Merge ou déploiement : **aucun**.


## 11. Chronologie des six migrations dont les versions live diffèrent des noms de fichiers

### 11.1 Chronologie Git vérifiée

L'historique des fichiers sur `evolution-5.0-clean-preview` permet de dater leurs ajouts et principales modifications (heures UTC) :

| Fichier de migration | Historique Git vérifié | Dernière évolution relevée avant intégration |
|---|---|---|
| `20261106031500_bootstrap_first_internal_admin.sql` | ajout le 6 nov. à 03:12:36 ; verrou advisory ajouté à 07:40:15 ; accès au schéma privé accordé à 07:45:56 | 07:45:56 |
| `20261106074500_enforce_crm_editor_roles.sql` | ajout le 6 nov. à 07:38:31 | 07:38:31 |
| `20261106090000_atomic_client_workspace_provisioning.sql` | ajout le 6 nov. à 07:43:34 ; notification de rechargement PostgREST ajoutée à 07:44:14 | 07:44:14 |
| `20261106100000_persistent_crm_reminders.sql` | ajout le 6 nov. à 08:29:40 | 08:29:40 |
| `20261106110000_sync_crm_reminder_lifecycle.sql` | ajout le 6 nov. à 08:41:50 | 08:41:50 |
| `20261106120000_complete_crm_reminder_with_activity.sql` | ajout le 6 nov. à 08:42:37 | 08:42:37 |

Les commits correspondants confirment les étapes de conception et de durcissement des migrations. Pour le bootstrap administrateur, le fichier a notamment évolué en trois commits distincts : création de la procédure protégée, sérialisation des tentatives concurrentes, puis autorisation d'accès au schéma privé pour `service_role`.

### 11.2 Point de synchronisation Git juste avant l'historique live

La PR GitHub **#38 — « MajestiOS V5 — reconstruction propre et validation complète »** a été fusionnée le 6 novembre 2026 à **08:54:02 UTC**, avec le commit de merge `844cb147524d15310d00c8c314921de405717527`.

Cette PR intègre la lignée `evolution-5.0-clean-preview` dans `main`. Les six fichiers de migration étudiés sont présents dans l'arbre Git de cette lignée au moment de cette intégration.

L'API GitHub confirme que la PR est fermée et fusionnée. Son texte descriptif contient toutefois encore des mentions indiquant que la PR serait ouverte/en brouillon et que Supabase, Auth, migrations, RLS, fonctions Edge et données resteraient en pause. Ces phrases sont donc des indications de garde-fou historiques, pas une preuve de l'état effectif après le 6 novembre à 08:54 UTC.

### 11.3 Corrélation avec les versions enregistrées dans Supabase

L'historique live relu le 7 novembre retourne, dans le même ordre fonctionnel :

| Version live Supabase | Migration |
|---|---|
| `20261106085409` | `bootstrap_first_internal_admin` |
| `20261106085411` | `enforce_crm_editor_roles` |
| `20261106085415` | `atomic_client_workspace_provisioning` |
| `20261106085430` | `persistent_crm_reminders` |
| `20261106085434` | `sync_crm_reminder_lifecycle` |
| `20261106085436` | `complete_crm_reminder_with_activity` |

La première entrée live apparaît **7 secondes après** le merge de la PR #38 ; les six entrées s'échelonnent sur **27 secondes** (08:54:09 à 08:54:36 UTC). L'ordre est identique à celui des six migrations fonctionnelles.

Cette proximité temporelle constitue un indice fort d'une séquence de livraison ou d'enregistrement réalisée juste après l'intégration Git. Elle explique vraisemblablement pourquoi les versions live portent des horodatages proches de 08:54, alors que les fichiers portent des préfixes de migration plus anciens (03:15, 07:45, 09:00, 10:00, 11:00, 12:00).

**Ce qui est démontré :**
- les six fichiers existaient dans Git avant le merge ;
- la PR #38 a été fusionnée à 08:54:02 UTC ;
- les six noms fonctionnels apparaissent dans Supabase entre 08:54:09 et 08:54:36 UTC ;
- leur ordre live correspond à l'ordre fonctionnel des fichiers.

**Ce qui n'est pas démontré :**
- le mécanisme exact ayant généré les six versions live (outil, commande, appel API ou procédure manuelle) ;
- que le merge Git a déclenché automatiquement l'application SQL ;
- que le SQL exécuté est identique octet par octet au contenu des fichiers ;
- que la mention « Supabase en pause » dans la description de PR était encore exacte après sa fusion.

L'hypothèse la plus cohérente est une application/enregistrement séquentiel des six migrations à proximité immédiate de la fusion, avec des identifiants live attribués au moment de l'opération plutôt que repris des préfixes de fichiers. Elle reste une **hypothèse de chronologie**, pas une preuve du canal d'exécution.

### 11.4 Conclusion sur l'écart des horodatages

La cause des six écarts est désormais mieux circonscrite : les noms de fichiers représentent des horodatages antérieurs de préparation/versionnement, tandis que les versions live correspondent à une séquence enregistrée quelques secondes après le merge de la PR #38. La migration de grants, elle, a fait l'objet d'un renommage explicite et documenté de `135000` vers `135037` dans deux commits à 13:50:41 et 13:50:51 UTC.

Il reste nécessaire de récupérer une trace du mécanisme d'application (historique CLI/API, journal d'opération ou export fiable de la table de migrations accompagné des éléments de livraison) pour transformer cette corrélation en preuve complète.

**Décision maintenue :** ne pas renommer les six fichiers pour imiter les versions live, ne pas les rejouer, ne pas utiliser `migration repair` et ne pas tenter de correction de l'historique. Les versions live et les fichiers Git doivent être rapprochés par leur contenu et leur provenance, pas par une modification cosmétique des horodatages.

### 11.5 Périmètre de cette étape

- Lecture de l'historique Git des six fichiers : effectuée.
- Lecture de la PR #38 et de sa date de fusion : effectuée.
- Relecture de l'historique des migrations Supabase : effectuée.
- Explication temporelle : corrélation forte, mécanisme exact non prouvé.
- Écriture Supabase, migration, correction de version ou modification de données : **aucune**.
- Code CRM et immeuble interactif : **inchangés**.
- Merge, déploiement ou création de projet : **aucun**.


## 12. Recherche de la preuve du mécanisme d'application — GitHub Actions et PR #38

### 12.1 Workflow GitHub déclenché immédiatement après la fusion

La lecture de l'API GitHub Actions sur la fenêtre du 6 novembre 2026, de 08:45 à 09:00 UTC, retourne dix exécutions. Pour le commit de merge `844cb147524d15310d00c8c314921de405717527`, un workflow est créé **à 08:54:04 UTC**, soit deux secondes après la fusion de la PR #38 :

- workflow : **Vérification du site MajestiOS** ;
- événement : `push` ;
- branche : `main` ;
- SHA : `844cb147524d15310d00c8c314921de405717527` ;
- run : `42190997800` ;
- résultat : **success** ;
- exécution du job : 08:54:08 à 08:54:56 UTC.

Les étapes du job ont toutes réussi : syntaxe JavaScript, tests de ciblage et qualification d'entreprises, suggestions APE/NAF, build statique, vérification des routes et liens, tests live BOAMP/BODACC, navigateur de l'immeuble interactif, moteur de recherche, navigation et formulaire Contact.

**Ce run est une preuve d'un contrôle applicatif post-merge, pas une preuve d'application de migrations Supabase.**

### 12.2 Contenu des workflows présents dans la branche fusionnée

Le répertoire `.github/workflows` de `evolution-5.0-clean-preview` contient trois fichiers :

- `verify-site.yml` ;
- `majestios-anti-regression.yml` ;
- `mesure-boamp.yml`.

Le workflow `verify-site.yml` déclenche sur `push` et `pull_request`. Son job vérifie les modules JavaScript, compile le site statique et exécute des tests de navigateur et des tests d'accès aux API BOAMP/BODACC. Il vérifie aussi la syntaxe de `supabase-config.js` et `auth-espace-membre.js`, mais **ne contient aucune commande de migration, aucun appel d'application SQL et aucune étape de déploiement Supabase**.

Le workflow `majestios-anti-regression.yml` exécute des tests ciblés, le build et les contrôles de liens. Il ne contient pas non plus d'étape d'application de migration.

Dans le répertoire de workflows inspecté, aucun workflow dédié à Supabase ou à l'application des migrations n'a été trouvé. Cette observation porte sur les trois fichiers présents dans ce répertoire ; elle ne permet pas d'exclure un déclenchement externe, une action manuelle, le SQL Editor, la CLI depuis un poste, ou un autre canal hors de ces workflows.

### 12.3 Le statut Vercel ne doit pas être confondu avec Supabase

Le statut GitHub associé au commit de merge affiche un échec du contexte **Vercel – majestios**, avec le message : `Deployment rate limited — retry in 24 hours`, horodaté à 08:54:06 UTC.

Ce statut concerne une limitation de déploiement Vercel. Il ne constitue ni un échec du workflow GitHub Actions (qui a réussi), ni une preuve d'échec ou de réussite d'une opération Supabase.

### 12.4 Ce que les traces établissent — et ce qu'elles ne permettent pas d'affirmer

**Éléments vérifiés :**
- PR #38 fusionnée à 08:54:02 UTC par le compte GitHub `Chexpeer` ;
- workflow de vérification du site déclenché sur `main` à 08:54:04 UTC sur le SHA du merge ;
- job GitHub Actions terminé avec succès à 08:54:56 UTC ;
- le workflow vérifie le site et ses tests, mais n'applique pas de migrations ;
- les trois workflows présents dans le répertoire inspecté ne comportent pas de procédure d'application Supabase ;
- l'historique live Supabase contient les six migrations fonctionnelles entre 08:54:09 et 08:54:36 UTC.

**Conclusion limitée :** les traces GitHub Actions accessibles ne démontrent pas que la fusion a déclenché les migrations Supabase. Le workflow post-merge observé ne réalise pas cette opération. La proximité temporelle entre le merge et les six entrées live demeure donc une corrélation forte, mais le canal d'application n'est toujours pas identifié.

**Non établi :**
- si les migrations ont été lancées depuis Supabase SQL Editor, Supabase CLI, une API de gestion, un outil tiers ou une autre session ;
- quel utilisateur ou processus a soumis les requêtes SQL ;
- si le SQL appliqué était identique octet par octet aux fichiers Git ;
- si un journal externe ou une trace d'audit de l'opération est encore disponible.

Les logs Supabase unifiés accessibles par l'outil de lecture sont limités à une fenêtre maximale de 24 heures. Ils ne peuvent donc pas reconstituer directement l'opération du 6 novembre depuis le contrôle du 7 novembre. L'historique des migrations reste consultable, mais il ne fournit pas à lui seul le texte SQL ni l'identité du canal d'exécution.

### 12.5 Décision et prochaine preuve utile

La piste « GitHub Actions post-merge » est désormais contrôlée : elle explique le contrôle du site, pas l'application des migrations. Il faut donc rechercher une trace hors de ces workflows : historique d'activité Supabase conservé, journal d'audit/organisation, historique local de terminal ou capture/export du processus d'application, si l'un de ces éléments existe encore.

Aucune nouvelle opération ne doit être lancée pour tenter de reproduire l'événement historique.

- Inspection GitHub Actions et des workflows : **effectuée en lecture seule**.
- Lecture de l'historique Supabase : **effectuée en lecture seule**.
- Canal exact d'application des six migrations : **toujours non identifié**.
- Migration, SQL, table, grant, RLS, fonction, job ou donnée modifiés : **aucun**.
- CRM et immeuble interactif : **inchangés**.
- Merge, déploiement ou création de projet : **aucun**.
