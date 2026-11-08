# Mapping du contrat de transmission vers l'existant — Supabase et fonctions serveur

**Date du relevé :** 8 novembre 2026  
**Dépôt :** `Chexpeer/Majestios`  
**Branche contrôlée :** `feature/crm-atomic-integration`  
**HEAD contrôlé avant relevé :** `f097dccc99ee461e552339a8d11cd2b0eb651cca`  
**Projet Supabase :** `majestios-crm` (`qxaghcifdhugfskuscoc`, région `eu-west-3`)  
**Nature :** constat en lecture seule et mapping logique ; aucune modification de schéma, de données, de fonction ou de permission.

Documents associés :
- [Contrat commun de transmission](CONTRAT-COMMUN-TRANSMISSION-RUBRIQUES-ADMIN-CRM-2026-11-08.md)
- [Audit des circuits d'information](AUDIT-CIRCUITS-INFORMATION-IMMEUBLE-RUBRIQUES-CRM-ADMIN-2026-11-08.md)
- [Matrice de circulation des rubriques et du CRM](MATRICE-CIRCULATION-RUBRIQUES-CRM-2026-11-08.md)

## 1. Synthèse exécutive

Le projet possède déjà une base multitenant et un premier CRM exploitable comme socle : organisations, membres, entreprises, contacts, opportunités, activités, demandes, rappels et référentiel d'entreprises. Les tables publiques observées ont RLS activé.

En revanche, **le contrat commun de transmission n'existe pas encore dans le schéma**. Aucune table actuelle ne réunit les rôles demandeur/bénéficiaire/préparateur/validateur, la finalité, l'origine et la destination inter-rubriques, les éléments sélectionnés, la décision, l'affectation, la livraison et son historique. `client_requests` est une demande entrante simplifiée, pas un dossier de circulation universel.

Trois écarts doivent être traités avant d'implémenter le circuit :

1. **Parité Git / base :** 21 migrations sont appliquées dans Supabase, mais seulement 12 fichiers de migration sont présents dans la branche contrôlée. Ne pas générer de migration ni synchroniser à l'aveugle avant récupération des neuf migrations manquantes.
2. **Parité Git / fonctions Edge :** les trois fonctions Edge actives ne sont pas versionnées dans cette branche. La branche contient une autre fonction (`provision-client-workspace`) qui n'apparaît pas dans l'inventaire des fonctions actives.
3. **Visibilité des sources :** le catalogue technique et les observations brutes sont lisibles par les utilisateurs authentifiés, et la fonction de recherche renvoie explicitement l'identité de la source et son payload brut. C'est incompatible avec la règle MajestiOS selon laquelle les fournisseurs restent invisibles dans les interfaces de Prospection.

Le relevé n'a pas déclenché de test métier de bout en bout : les tables CRM sont actuellement vides et aucun flux de transmission complet n'est implémenté.

## 2. État observé

### 2.1 Tables et volumes

Quinze tables sont présentes dans le schéma `public`, toutes avec RLS activé :

| Groupe | Tables | Lignes observées |
|---|---|---:|
| Organisation et identité | `organizations`, `profiles`, `organization_members` | 1, 1, 1 |
| CRM | `businesses`, `contacts`, `opportunities`, `activities`, `crm_reminders` | 0 chacune |
| Demandes et vie privée | `client_requests`, `privacy_acknowledgments` | 0 chacune |
| Référentiel et traçabilité des données officielles | `official_data_sources`, `company_registry`, `company_registry_establishments`, `official_source_sync_runs`, `company_source_observations` | 8, 0, 0, 0, 0 |

Ces volumes sont un instantané du relevé, pas une garantie permanente.

### 2.2 Migrations : divergence à résoudre en priorité

- Supabase indique **21 migrations appliquées**.
- La branche `feature/crm-atomic-integration` contient **12 fichiers SQL** dans `supabase/migrations`.
- Les neuf migrations appliquées mais absentes de cette branche sont :

| Version | Nom appliqué en base |
|---|---|
| `20261107065916` | `grant_crm_record_updates` |
| `20261107065932` | `harden_crm_reminder_permissions_and_indexes` |
| `20261107065956` | `official_company_registry_and_sources` |
| `20261107070006` | `restrict_source_sync_run_visibility` |
| `20261107070144` | `register_open_company_search_api` |
| `20261107070313` | `atomic_official_company_import` |
| `20261107070340` | `validate_official_import_identifiers` |
| `20261107070406` | `harden_import_permission_and_sync_index` |
| `20261107070905` | `expose_internal_admin_bootstrap_service_role_only` |

**Conséquence :** l'historique SQL versionné de cette branche ne décrit pas à lui seul l'état réel de la base. Il faut récupérer les contenus SQL exacts depuis l'environnement de développement, les archives ou l'historique fiable, puis les comparer au schéma et à l'historique Supabase. Ne pas reconstituer ces fichiers à partir de leur nom.

### 2.3 Fonctions Edge : divergence de versionnement

Inventaire Supabase au relevé :

| Fonction active | Version | JWT requis | Empreinte du bundle déployé |
|---|---:|---:|---|
| `search-official-companies` | 4 | Oui | `e91851a82639e45fcc9eb45e441905874650ca84ad82f92de233542f709dc5ad` |
| `import-official-company` | 2 | Oui | `7cb5c723140719ea10f4db67708793b1ae3afb49bfa413003052bc37b3b90a5c` |
| `bootstrap-internal-admin` | 3 | Oui | `331827cfdf8999eb4d2d861e7c7644fe99354c4fb0dd580cdb19ddbc4af606d4` |

Les trois sources déployées ont été récupérées depuis Supabase pour analyse, mais leurs chemins `supabase/functions/<nom>/index.ts` sont absents de l'arbre Git contrôlé. La seule fonction présente dans cette branche est `provision-client-workspace/index.ts`, qui n'apparaît pas dans la liste des trois fonctions actives consultées.

Il n'existe donc pas de parité source/déploiement démontrée. Avant toute correction, conserver les sources récupérées, leurs empreintes, versions, dépendances et noms de variables d'environnement (jamais leurs valeurs secrètes), puis les réintroduire dans Git après revue.

## 3. Mapping du contrat : champs existants et lacunes

| Besoin du contrat | Stockage existant | État | Conclusion |
|---|---|---|---|
| Identité de l'organisation / tenant | `organizations.id`, `organization_members.organization_id` | Présent | Réutilisable comme frontière de tenant ; les transferts inter-organisations doivent rester explicitement autorisés |
| Identité et rôle d'appartenance | `auth.users`, `profiles`, `organization_members` | Partiel | Identité et rôles génériques présents ; pas de capacités Administration dédiées |
| Demande initiale | `client_requests` | Partiel | Bon point d'entrée pour certains besoins clients, pas un dossier universel |
| Identifiant stable de transmission | Aucun | Absent | À concevoir |
| Lien entre demande et transmission | Aucun lien dédié | Absent | Une demande peut produire plusieurs transmissions ; relation explicite nécessaire |
| Origine rubrique / dossier / route / objet métier | Quelques champs `source_*` sur le CRM | Très partiel | Pas de contexte d'origine commun ni de retour vers la rubrique |
| Destination fonctionnelle | Aucun | Absent | À concevoir |
| Demandeur | `client_requests.created_by` | Partiel | Présent pour une demande ; ne couvre pas toutes les transmissions |
| Bénéficiaire distinct | Aucun | Absent | Ne pas le déduire du demandeur |
| Préparateur | Aucun champ dédié | Absent | À concevoir |
| Validateur Administration | Aucun champ dédié ni capacité métier dédiée | Absent | Les rôles d'organisation ne suffisent pas |
| Collaborateur affecté et historique de réaffectation | `businesses.assigned_to`, `opportunities.assigned_to` | Partiel | Affectation d'objets CRM uniquement ; pas de gestion d'affectation d'un dossier inter-rubriques ni d'historique |
| Finalité et base légale documentée | `client_requests.request_type`, `privacy_notice_version`, `consent_recorded_at`, `privacy_acknowledgments` | Partiel | Type de demande et preuve d'information/acceptation présents ; ne constituent pas une finalité détaillée ou une base légale générique |
| Classification / périmètre / actions autorisées | Aucun | Absent | À concevoir avec les politiques d'accès |
| États d'instruction, validation, affectation, livraison, CRM séparés | `client_requests.status`, états CRM | Très partiel | Un statut de demande et des pipelines CRM existent ; aucune machine d'état transversale |
| Décision et motif Administration | Aucun champ commun | Absent | À concevoir |
| Éléments sélectionnés | Références CRM et observations officielles isolées | Partiel | Pas de collection d'éléments hétérogènes attachée à une transmission |
| Provenance par champ et qualité | `company_source_observations`, `official_source_sync_runs`, champs `source_*`, `qualification_*` | Partiel | Bonne base pour données officielles ; pas de provenance normalisée commune à tous les domaines |
| Déduplication | Unicité SIREN / SIRET et upsert dans le référentiel | Partiel | Déduplication entreprise ; pas de rapprochement générique ni de décision sur doublons ambigus |
| Historique append-only des transmissions | `activities` | Partiel et non réutilisable tel quel | Journal CRM d'activité, pas journal des transitions de transmission |
| Livraisons, tentatives, reçus | Aucun | Absent | À concevoir |
| Liens CRM vers une transmission | Aucun lien dédié | Absent | À concevoir sans transformer tout résultat en opportunité |
| Pièces et preuves rattachées | `privacy_acknowledgments` et payload d'observation | Partiel | Pas de gestion documentaire générique et gouvernée pour les transmissions |
| Conservation / échéance | Quelques dates métier et rappels | Absent au niveau transmission | Règles de conservation à définir par catégorie |

## 4. Détail des tables réutilisables

### 4.1 `client_requests` : demande entrante, pas transmission

Colonnes observées :
- `id`, `organization_id`, `created_by`
- `request_type`, `status`, `subject`, `message`
- `contact_snapshot`
- `privacy_notice_version`, `consent_recorded_at`
- `created_at`, `updated_at`

Cette table est utile pour conserver une demande client entrante et son contexte de contact. Elle ne porte ni bénéficiaire distinct, ni rubrique d'origine, ni objet métier sélectionné, ni préparateur, ni validateur, ni affectation, ni livraison, ni journal de transitions. Elle ne doit pas devenir la table de toutes les transmissions par simple ajout de champs.

Autorisations constatées :
- `authenticated` dispose de SELECT et INSERT sur les colonnes de la demande.
- UPDATE est accordé uniquement sur `status`, pas sur les autres colonnes.
- La politique UPDATE s'appuie sur `private.is_internal_staff()`.
- Cette fonction considère comme personnel interne les rôles `owner`, `admin` **et `member`** de l'organisation interne.
- La politique de lecture permet à un membre de l'organisation propriétaire de lire les demandes de son organisation, ou à tout membre interne reconnu par cette fonction de lire les demandes.

Cela signifie qu'un membre interne générique peut modifier le statut et lire les demandes de tous les tenants. Ce n'est pas une capacité Administration dédiée ni une affectation au cas par cas. Le contrôle actuel reste limité au statut, mais son périmètre de lecture et sa définition de « personnel interne » doivent être revus avant le nouveau circuit.

### 4.2 CRM : objets métier à relier, non à détourner

- `businesses` : entreprise dans un tenant, identifiants SIREN/SIRET, coordonnées, statut de qualification, source, créateur et affectation.
- `contacts` : contact rattaché à une entreprise du même tenant, coordonnées, consentement.
- `opportunities` : opportunité commerciale, entreprise/contact, source, statut pipeline, score, résumé, affectation et prochaine action.
- `activities` : activité rattachée à l'entreprise, au contact ou à l'opportunité ; INSERT/SELECT côté membre éditeur, sans UPDATE/DELETE accordé au rôle authentifié dans le modèle observé.
- `crm_reminders` : rappels dérivés des prochaines actions d'opportunités, pas des tâches de transmission.

Le CRM est un destinataire potentiel de la transmission. Il doit recevoir une référence vers la transmission et une provenance contrôlée, mais le circuit doit pouvoir restituer un résultat sans créer de fiche CRM.

### 4.3 Référentiel officiel et observations techniques

- `company_registry` : référentiel commun par SIREN.
- `company_registry_establishments` : établissements par SIRET.
- `official_data_sources` : catalogue technique des fournisseurs/référentiels.
- `company_source_observations` : payload brut observé, source, identifiant externe, URL, date et références au registre.
- `official_source_sync_runs` : exécutions techniques de synchronisation.

Ces tables fournissent une base de provenance et de rapprochement pour les données d'entreprises. Elles ne constituent pas le dossier de transmission inter-rubriques.

**Point de sécurité / doctrine :** les politiques RLS SELECT de `official_data_sources`, `company_source_observations`, `company_registry` et `company_registry_establishments` utilisent actuellement `USING (true)` pour `authenticated`. Les privilèges SELECT sont également accordés aux utilisateurs authentifiés. En particulier, les observations brutes et le catalogue technique sont donc accessibles directement par API aux utilisateurs authentifiés, indépendamment de leur organisation. Le fait que `official_source_sync_runs` soit masquée ne masque pas les autres tables techniques.

La règle de MajestiOS est plus stricte : les sources et fournisseurs doivent rester invisibles dans toutes les interfaces utilisateur, en particulier Prospection. Il faut donc séparer l'accès interne de traçabilité technique de la restitution métier normalisée. La correction doit préserver le fonctionnement des Edge Functions et ne pas casser la recherche officielle.

## 5. Analyse des fonctions serveur actives

### 5.1 `search-official-companies` v4

Fonction GET, JWT obligatoire. Elle valide l'utilisateur, contrôle les paramètres de recherche, appelle l'API Recherche d'Entreprises et renvoie au navigateur :
- le libellé explicite du fournisseur ;
- l'URL du fournisseur ;
- l'horodatage et les paramètres de pagination ;
- le payload amont complet dans `data`.

**Écart confirmé :** l'identité du fournisseur et le payload brut sont exposés au client. Le payload peut contenir bien plus de champs que l'interface n'a besoin d'afficher. La réponse doit à terme devenir un objet métier normalisé, minimal et stable, sans nom, logo, URL de fournisseur ni catalogue. La provenance détaillée reste dans la couche technique interne.

### 5.2 `import-official-company` v2

Fonction POST, JWT obligatoire. Elle :
1. vérifie l'identité ;
2. demande `can_import_official_company(organization_id)` ;
3. recherche le SIREN exact ;
4. appelle avec le rôle serveur `import_official_company_record` ;
5. renvoie un résumé de l'entreprise importée.

La permission SQL `can_import_official_company` s'appuie sur `private.is_org_editor`, qui inclut les rôles `owner`, `admin` et `member`. L'import est donc permis à un membre éditeur de son organisation ; il ne s'agit pas d'une validation Administration.

La fonction SQL d'import, exécutée en `SECURITY DEFINER` et limitée à `service_role`, met à jour le référentiel global, les établissements et l'entreprise dans l'organisation, avec `qualification_status='to_review'`, puis enregistre l'observation brute. Elle utilise un upsert sur les identifiants SIREN/SIRET pour limiter les doublons.

**Limites confirmées :**
- l'import ne crée pas de transmission ;
- il ne passe pas par une file de validation Administration ;
- il ne prouve pas que le bénéficiaire a été autorisé à recevoir les données ;
- il ne crée pas d'opportunité, ce qui est cohérent avec le fait qu'une entreprise importée n'est pas encore une opportunité qualifiée ;
- les champs `source_label` et `source_url` sont stockés sur l'entreprise CRM et peuvent être lus par les membres de l'organisation via les politiques CRM actuelles. Leur présentation doit respecter la doctrine d'invisibilité des fournisseurs.

Séparer à terme trois décisions : autorisation d'importer, validation métier/diffusion Administration, qualification commerciale CRM.

### 5.3 `bootstrap-internal-admin` v3

Fonction POST, JWT obligatoire. Le code déployé vérifie l'identité du compte initial autorisé, la confirmation de l'adresse, l'existence d'une appartenance et appelle la fonction SQL de bootstrap. Le bootstrap SQL utilise un verrou transactionnel et refuse l'opération si un propriétaire/administrateur interne existe déjà. Le second appel par le propriétaire déjà initialisé est traité comme une opération sans effet.

C'est un mécanisme de **première initialisation**, pas un système de délégation des capacités Administration. Il ne fournit pas à lui seul la gestion des validateurs, des remplaçants, de la révocation ou de la séparation des tâches. L'identité initiale est codée dans la fonction déployée ; toute évolution de ce point doit être revue et versionnée, sans exposer de donnée personnelle dans la documentation.

## 6. Mapping des responsabilités et permissions

| Acteur du contrat | Capacité actuelle | Écart à combler |
|---|---|---|
| Demandeur client | Soumission de `client_requests` dans son organisation | Associer une demande à une ou plusieurs transmissions et conserver le contexte d'origine |
| Bénéficiaire | Membre d'organisation, sans rôle bénéficiaire dédié | Accès explicite à la transmission et à la livraison qui lui sont destinées |
| Préparateur | Rôle générique `member`/éditeur | Capacité de préparation distincte et périmètre dossier |
| Collaborateur affecté | `assigned_to` sur certains objets CRM | Affectation du dossier avec historique et révocation de l'accès après réaffectation |
| Validateur Administration | Aucun droit métier dédié démontré | Capacité distincte de valider/refuser/demander correction, indépendante des rôles tenant |
| Administrateur client | `owner/admin` dans son tenant | Ne doit pas obtenir de pouvoir Administration MajestiOS |
| Administrateur technique | Accès technique au projet selon les rôles plateforme | Ne doit pas être automatiquement validateur métier |
| Cheexpeer | Aucune intégration IA active identifiée | Plus tard : lecture, analyse et préparation ; pas de validation ni diffusion implicite |

La fonction `private.is_internal_staff()` est actuellement une frontière trop large pour représenter une habilitation Administration : elle inclut les membres internes ordinaires. Ne pas réutiliser ce prédicat comme autorisation de valider, affecter ou diffuser.

## 7. Risques prioritaires constatés

| Priorité | Constat | Risque / impact | Orientation de correction |
|---|---|---|---|
| P0 | Neuf migrations appliquées absentes de Git | Reproductibilité et capacité de retour arrière compromises | Récupérer les SQL exacts et réconcilier l'historique avant toute migration |
| P0 | Trois fonctions Edge actives absentes du dépôt | Déploiements non reproductibles et modifications non auditables | Restaurer les sources exactes et établir la parité par empreinte |
| P1 | Catalogue et observations brutes accessibles aux utilisateurs authentifiés | Exposition des fournisseurs et des payloads techniques ; accès inter-tenant au référentiel global | Réserver les données techniques aux rôles internes/serveur ; publier une réponse normalisée autorisée |
| P1 | Réponse de recherche exposant fournisseur, URL et payload brut | Violation directe de l'invisibilité des sources ; sur-exposition de données au navigateur | Contrat de sortie neutre, filtré, normalisé |
| P1 | `client_requests` lisible par tout personnel interne générique | Accès global aux demandes sans affectation ni habilitation dédiée | Remplacer progressivement par contrôle de dossier et capacité dédiée, après tests |
| P1 | Membres internes génériques autorisés à modifier le statut des demandes | La décision métier n'est pas réservée à une capacité Administration dédiée | Séparer transition de demande et décision Administration |
| P1 | Import d'entreprise autorisé aux membres éditeurs et sans validation Administration | Import confondu avec qualification ou diffusion si l'interface ne distingue pas les étapes | Maintenir `to_review`, introduire le circuit de validation avant diffusion |
| P2 | Provenance CRM stockée dans des champs visibles de l'organisation | Le fournisseur peut apparaître dans l'interface métier | Garder la provenance technique dans une couche interne et afficher uniquement une provenance neutre utile |
| P2 | Absence d'historique des affectations et transitions de transmission | Audit et reprise de dossier impossibles | Journal d'événements append-only et transitions serveur |
| P2 | Absence de livraison et accusé de réception | Impossible de prouver qui a reçu quoi et quand | État de livraison et reçu idempotent |

## 8. Modèle de stockage recommandé après rapprochement

Ne pas créer une table par concept sans nécessité. À partir des écarts constatés, le premier incrément logique à évaluer est :

1. **`transmissions`** (nom conceptuel) : tenant, demande liée facultative, origine, destination, finalité, demandeur, bénéficiaire, préparateur, affectation courante, état par dimension, décision et échéances.
2. **`transmission_items`** : éléments métier explicitement sélectionnés, référence polymorphe contrôlée ou payload minimal typé.
3. **`transmission_events`** : journal append-only des transitions, décisions, affectations, livraisons et rattachements CRM.
4. **Références CRM** : lien explicite vers `businesses`, `contacts`, `opportunities` ou `activities`, seulement quand un lien métier est justifié.

Ne matérialiser des tables séparées `participants`, `deliveries`, `artifacts` que si les cas d'usage exigent plusieurs destinataires, livraisons indépendantes, fichiers ou affectations simultanées. Les pièces doivent utiliser un stockage privé avec métadonnées et droits propres, pas des URL publiques arbitraires.

**Ne pas modifier maintenant `client_requests` ni les tables CRM.** Faire d'abord le mapping des contraintes FK, des usages UI et des fonctions déployées. La demande peut rester une demande et être liée à plusieurs transmissions si le besoin l'exige.

## 9. Ordre de travail recommandé

1. Récupérer les neuf migrations exactes manquantes ; vérifier que leurs versions et contenus correspondent aux migrations appliquées.
2. Récupérer et versionner les trois sources Edge exactes, avec leurs empreintes et dépendances ; documenter les variables d'environnement sans leurs valeurs.
3. Établir une parité de référence Git ↔ Supabase pour les migrations, fonctions SQL, Edge Functions et permissions.
4. Concevoir la matrice d'habilitations Administration, notamment la séparation entre membre interne, préparateur et validateur.
5. Corriger la visibilité des catalogues et observations techniques, après tests de non-régression du moteur de recherche et des imports.
6. Choisir un seul flux pilote de transmission, puis définir les tests d'accès et de bout en bout avant toute migration.
7. Proposer ensuite une migration minimale, réversible et explicitement soumise à validation.

## 10. Périmètre et limites de vérification

- Le HEAD de la branche a été vérifié avant le relevé : `f097dccc99ee461e552339a8d11cd2b0eb651cca`.
- Le schéma, les colonnes, les volumes, les politiques RLS, les privilèges, les fonctions SQL, les migrations appliquées, les Edge Functions actives et les sources déployées ont été inspectés en lecture seule.
- Les empreintes des trois fonctions actives ont été relevées.
- La présence des chemins des fonctions déployées dans l'arbre Git a été contrôlée ; ils sont absents.
- Les 12 fichiers de migration présents dans la branche ont été listés et comparés aux 21 versions appliquées.
- Les advisors Supabase ont signalé : protection contre les mots de passe compromis désactivée (avertissement sécurité) et 20 index non utilisés (information de performance). Ces index ne doivent pas être supprimés sur la seule base de cet avertissement, notamment parce que le projet a très peu de données et peu de trafic observé.
- Aucun test de flux utilisateur ou d'accès avec plusieurs identités n'a été exécuté dans ce relevé.
- Aucun DDL, DML, GRANT, REVOKE, RLS, Edge Function, secret, déploiement ou merge n'a été modifié.

**Conclusion :** le socle CRM et multitenant est réutilisable, mais il n'existe pas encore de stockage ni de circuit serveur commun de transmission. La priorité immédiate n'est pas de créer des tables : c'est de restaurer la parité des migrations et des fonctions, puis de verrouiller la séparation entre données techniques, décisions Administration et restitution métier.
