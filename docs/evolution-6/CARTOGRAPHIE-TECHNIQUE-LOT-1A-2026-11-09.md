# Cartographie technique MajestiOS — Lot 1A — 9 novembre 2026

**Statut :** cartographie partielle vérifiée en lecture seule.  
**Branche inspectée :** `Evolution-6`.  
**Commit de tête observé :** `90912af83c36ac127dda249f6b8505c3313a09d3`.  
**Dépôt :** `Chexpeer/Majestios`.  
**Périmètre de ce lot :** manifeste et ressources publiées, inventaire Git, migrations Supabase, schéma/RLS/fonctions, workflows et projets/déploiements Vercel.  
**Aucune modification applicative, migration, écriture SQL, donnée métier, configuration, fusion ou déploiement n'a été effectuée.**

---

## 1. Résumé exécutif

La première cartographie technique fait ressortir quatre constats structurants :

1. **Le manifeste de publication est cohérent sur l'existence des fichiers** : 73 entrées, toutes présentes dans l'arbre Git inspecté. Il ne couvre volontairement pas les scripts de build, tests, fonctions Edge, modules internes et certains actifs de documentation.
2. **Le dépôt et l'historique de migrations Supabase ne sont pas parfaitement alignés** : 23 fichiers SQL sont versionnés sur `Evolution-6`, contre 22 migrations enregistrées comme appliquées sur `majestios-crm`. Plusieurs migrations portent le même nom mais des identifiants de version différents ; une migration locale supplémentaire n'apparaît pas dans l'historique distant. Cet écart doit être expliqué avant tout `db reset`, `db push`, déploiement de migration ou automatisation de synchronisation.
3. **Le socle de sécurité CRM est réellement présent dans les politiques observées**, mais la frontière VIP doit encore être validée avec des sessions Auth réelles et une matrice complète de rôles/tenants. L'inspection statique ne remplace pas un test d'accès.
4. **Trois projets Vercel liés au même dépôt brouillent la gouvernance** : deux publient des déploiements ayant la cible `production` depuis `main`, tandis que le projet `majestios-jc8g` sert aussi des previews. Le projet `majestios-jc8g` n'a pas de protection SSO activée dans les métadonnées observées.

La cartographie reste partielle : les dépendances page → script → endpoint → table et les résultats d'exécution des workflows ne sont pas encore tous rattachés à une matrice unique.

## 2. Dépôt, manifeste et ressources

### 2.1 Instantané Git

L'arbre récursif de `Evolution-6` retourné par GitHub correspond au commit `90912af83c36ac127dda249f6b8505c3313a09d3` et contient **256 fichiers blob** au moment de la lecture.

Le manifeste `site-files.json` contient **73 entrées** :
- 37 pages HTML ;
- 7 feuilles CSS ;
- 24 scripts JavaScript classiques ;
- 5 ressources visuelles (images).

**Contrôle effectué :** 73/73 chemins du manifeste existent dans l'arbre Git. Aucun fichier déclaré par le manifeste n'est manquant.

### 2.2 Fichiers sources hors manifeste

Les fichiers suivants existent dans le dépôt mais ne figurent pas dans le manifeste public. Ils sont des ressources de build, de test, de serveur ou de développement et ne doivent pas être ajoutés mécaniquement à la publication :

- `build.js`, `verify-site.js`, `verify-architecture.js` ;
- `prospection-member-adapter.mjs`, `prospection-member-client.js` ;
- `reputation-audit-analysis.mjs`, `reputation-audit-connectors.mjs`, `reputation-audit-core.mjs` ;
- `schema-majestios.svg`.

Les répertoires `tests/`, `supabase/`, `.github/` et `docs/` contiennent également des ressources qui ne relèvent pas de la publication statique directe.

### 2.3 Inventaire des workflows

Six workflows sont présents dans `.github/workflows/` :

| Workflow | Déclenchement et rôle observés | Limite à retenir |
|---|---|---|
| `verify-site.yml` | Push et pull request ; syntaxe JS/TS, tests, build, vérifications de routes/liens, navigateurs et parcours | Il faut vérifier les fichiers réellement présents et l'exécution sur la tête de branche concernée ; le YAML seul ne prouve pas un passage CI |
| `majestios-anti-regression.yml` | Push sur plusieurs anciennes branches, PR vers ces branches et déclenchement manuel | La liste de branches ne cite pas `Evolution-6` ; ne pas supposer qu'un push sur cette branche déclenche ce workflow |
| `prospection-auth-integration.yml` | Tests Auth/RLS sur stack Supabase locale ; filtre de push visant `feature/crm-atomic-integration`, PR et manuel | La portée de déclenchement doit être vérifiée pour la branche cible |
| `prospection-search-contract.yml` | Tests du contrat DTO, validation et moteur de recherche ; filtres de chemins et manuel | Le YAML décrit des tests, pas leur dernier résultat |
| `mesure-boamp.yml` | Workflow de mesure BOAMP | Détail d'exécution et état courant à rattacher à l'historique des runs |
| `supabase-backup.yml` | Déclenchement manuel ; export PostgreSQL, chiffrement AES-256-CBC/PBKDF2 et artefact 90 jours | Pas de preuve d'une sauvegarde récente ni d'une copie hors GitHub |

**Constat de gouvernance CI :** les workflows sont hétérogènes et certains ciblent des branches historiques ou spécifiques. Il faut établir une politique explicite pour `Evolution-6`, sans lancer de workflow ni générer de preview à ce stade.

## 3. Supabase — comparaison Git / état distant

### 3.1 Fichiers de migration

L'arbre Git contient **23 fichiers SQL** dans `supabase/migrations/`.

L'historique Supabase du projet `majestios-crm` (`qxaghcifdhugfskuscoc`) retourne **22 migrations appliquées**.

Écarts constatés :
- le fichier `20261108151400_enforce_vip_boundary_for_internal_crm.sql` est présent dans Git, mais aucun nom correspondant n'apparaît dans l'historique des migrations appliquées ;
- le nom `vip_only_crm_access` est présent dans les deux côtés, avec le fichier local `20261108181246_vip_only_crm_access.sql` et une version distante `20261108181246` ;
- pour plusieurs autres migrations, le nom fonctionnel correspond mais l'identifiant de version distant retourné par Supabase diffère du préfixe du fichier versionné. Exemple : le fichier local `20261105163901_majestios_core_multitenant_foundation.sql` correspond au nom distant `majestios_core_multitenant_foundation`, enregistré sous la version `20261107065846`.

Cet écart de versionnement est **un risque de dérive de l'historique**, pas une preuve que le schéma réel est incorrect. Il faut produire un rapprochement exact par nom, version, contenu et empreinte avant toute action de synchronisation. Ne pas renommer les migrations, modifier l'historique distant ou exécuter un reset pour « réparer » sans plan contrôlé.

### 3.2 Tables et RLS

Le projet métier expose 15 tables dans `public`, avec RLS activé sur chacune :

| Domaine | Tables |
|---|---|
| Identité / tenant | `organizations`, `profiles`, `organization_members` |
| CRM | `businesses`, `contacts`, `opportunities`, `activities`, `client_requests`, `crm_reminders` |
| Confidentialité | `privacy_acknowledgments` |
| Référentiel et provenance | `official_data_sources`, `company_registry`, `company_registry_establishments`, `official_source_sync_runs`, `company_source_observations` |

Les politiques observées confirment :
- l'accès direct aux données CRM VIP `businesses`, `contacts`, `opportunities`, `activities` et `crm_reminders` repose sur `private.is_org_admin(organization_id)` ;
- `private.is_org_admin` ne reconnaît que `owner` et `admin` ;
- `client_requests` suit un circuit distinct : les membres peuvent soumettre leurs demandes et `private.is_internal_staff()` autorise le traitement interne ; cette dernière fonction inclut `member` et ne doit donc pas être employée pour ouvrir le CRM VIP ou le canal de commandement ;
- les tables du registre officiel sont lisibles par les utilisateurs authentifiés selon les politiques observées ;
- `official_source_sync_runs` n'est pas consultable directement par les utilisateurs authentifiés ;
- `privacy_acknowledgments` refuse l'accès direct API à `anon` et `authenticated`.

### 3.3 Fonctions SQL et privilèges — premier inventaire

L'inspection du catalogue PostgreSQL identifie notamment des fonctions dans les schémas `private` et `public` :
- helpers d'autorisation : `is_org_admin`, `is_org_editor`, `is_org_member`, `is_internal_staff` ;
- bootstrap et identité : `bootstrap_first_internal_admin`, `handle_new_auth_user` ;
- intégrité multi-tenant : `enforce_tenant_relationship_integrity` ;
- relances CRM : `materialize_crm_reminders`, `sync_crm_reminders_for_opportunity`, `complete_crm_reminder` ;
- registre officiel : `can_import_official_company`, `import_official_company_record` ;
- provisionnement : `provision_client_workspace` ;
- utilitaire : `set_updated_at`.

Plusieurs fonctions `SECURITY DEFINER` utilisent un `search_path` vide (`SET search_path TO ''`) et des références qualifiées. Les ACL observées restreignent notamment les fonctions sensibles de bootstrap, d'import et de provisionnement à `service_role`/Postgres. Les helpers d'autorisation dans `private` sont appelables par `authenticated` dans les ACL, mais résident dans un schéma distinct de `public`.

Points à approfondir avant toute évolution :
- vérifier les privilèges `USAGE` sur les schémas et l'exposition effective des schémas via Data API ;
- examiner le corps complet et les chemins d'appel de chaque fonction `SECURITY DEFINER` ;
- vérifier les ACL effectives de chaque fonction et les rôles hérités ;
- auditer les vues, triggers, tâches `pg_cron` et fonctions indirectement appelables ;
- tester les fonctions sous sessions owner/admin/member/viewer et entre tenants.

La fonction publique `set_updated_at` présente une exécution accordée à `PUBLIC` dans le catalogue. Comme il s'agit d'une fonction de trigger, ce grant ne suffit pas à démontrer une voie d'appel exploitable ; il doit néanmoins être documenté et vérifié avec son contexte de déclenchement.

### 3.4 Edge Functions

L'inventaire distant du projet métier confirme trois fonctions actives :
- `search-official-companies`, version 4, JWT requis ;
- `import-official-company`, version 2, JWT requis ;
- `bootstrap-internal-admin`, version 3, JWT requis.

Le dépôt contient aussi `prospection-search-member`, `provision-client-workspace` et `reputation-audit-context`, mais ces fonctions ne figurent pas dans l'inventaire des trois fonctions actives retourné par Supabase à cette date. Leur présence dans Git ne prouve donc pas leur déploiement.

## 4. Vercel — rattachement des projets et des branches

Les trois projets sont rattachés au même dépôt GitHub `Chexpeer/Majestios`, dans l'équipe Vercel `Majestic` (`majistr`).

| Projet | Dernier déploiement observé | Branche / SHA | Domaine et protection |
|---|---|---|---|
| `majestios` | `READY`, cible `production` | `main` / `94f2af84e96577b6370af1804ecfbd66bd100e71` | `majestios.vercel.app` ; SSO activé hors domaines personnalisés |
| `majestios-ljx1` | `READY`, cible `production` | `main` / `94f2af84e96577b6370af1804ecfbd66bd100e71` | Domaines `majestios-ljx1...` ; SSO activé hors domaines personnalisés |
| `majestios-jc8g` | `READY`, cible non renseignée | `brouillon-reputation-virtuelle` / `29d41ac4c19955b61a54713d32aa4e680782b014` | Domaines `majestios-jc8g...` ; SSO désactivé dans les métadonnées observées |

Autres observations :
- `majestios-jc8g` possède un déploiement récent depuis `Evolution-6` (SHA `e639ad65b00a004322897e505706a73a297a6614`), mais ce n'est pas le commit de tête actuel `90912af...` ;
- les projets `majestios` et `majestios-ljx1` ont chacun un déploiement étiqueté `production` depuis le même commit `main` ;
- le projet `majestios` porte le domaine simple `majestios.vercel.app`, tandis que `majestios-ljx1` possède ses propres domaines de projet.

**Conclusion :** le projet canonique de production ne peut pas être déclaré définitivement à partir des seules métadonnées consultées. `majestios` est le candidat évident pour le domaine `majestios.vercel.app`, mais `majestios-ljx1` publie également des déploiements `production`. Il faut confirmer les alias de domaines, les réglages Git de production et les domaines personnalisés avant de supprimer, déconnecter ou reconfigurer quoi que ce soit.

**Point de vigilance :** les previews `majestios-jc8g` sont dépourvues de protection SSO dans les métadonnées observées. Il faut vérifier si elles exposent des écrans internes, sans tenter de contourner un contrôle d'accès ni modifier la protection pendant cet audit.

## 5. Matrice composant → preuve → état → dépendances → contrôle

| Composant | Preuve consultée | État observé | Dépendances principales | Vérification encore nécessaire |
|---|---|---|---|---|
| Publication statique | `site-files.json`, arbre Git | 73 ressources déclarées, 0 manquante | `build.js`, Vercel | build sur commit de tête et test HTTP du déploiement correspondant |
| Contrôle de site | `verify-site.js`, `verify-architecture.js`, workflows | Scripts et workflows versionnés | Node, manifeste, tests | runs CI liés à `Evolution-6` et couverture réelle |
| CRM VIP | Tables, RLS, fonctions SQL | Politiques limitant les cinq tables CRM à owner/admin | Auth, `organization_members`, `private.is_org_admin` | tests Auth/RLS réels et tests multi-tenant |
| Demandes clients | `client_requests`, politiques distinctes | Circuit membres / équipe interne | `is_org_member`, `is_internal_staff` | confirmer les rôles exacts et parcours front |
| Référentiel officiel | Tables, registre de 8 sources, deux Edge Functions | Schéma et fonctions de recherche/import présents | sources officielles, Edge Functions, Auth | test de bout en bout et fraîcheur réelle des données |
| Provisionnement client | Fonction SQL et code Edge dans Git | Fonction SQL présente ; Edge Function non listée active | Auth, organisation, consentement | réconcilier SQL, Edge Function et parcours d'inscription |
| Prospection membre | Code/contrats dans Git | code présent, Edge Function non listée active | Auth, contrats DTO, moteur de recherche | état de déploiement, tests et permissions |
| Réputation virtuelle | Interface et modules dans Git ; PR dédiée antérieure | interface de consultation présente ; moteur IA non prouvé actif | connecteurs, endpoint, AI Gateway, Edge Function | vérifier PR/branche, secrets, route et endpoint avant toute affirmation |
| Vercel production | trois projets, historique de déploiements | deux projets avec cible production sur main | GitHub, domaines, réglages Vercel | identifier le projet canonique et les alias |
| Cheexpeer transversal | docs d'architecture et modules spécialisés | doctrine et composants préparatoires ; orchestration centrale non démontrée | Auth, CRM, journal, missions, mémoire, événements | architecture d'exécution, canal Admin, autorisations et audit |

## 6. Risques et priorités immédiates

### P0 — avant toute modification backend
1. Produire le rapprochement des 23 fichiers de migration avec les 22 versions distantes, par nom, identifiant, empreinte et contenu.
2. Ne pas exécuter `supabase db reset`, `db push`, `apply_migration` ou une modification d'historique tant que cette dérive n'est pas expliquée.
3. Confirmer le projet Vercel de production canonique et les domaines effectivement assignés.
4. Vérifier la protection des previews `majestios-jc8g`, sans exposer de données internes.

### P1 — tests de sécurité et cohérence
1. Tester owner/admin/member/viewer et tenants distincts avec de vraies sessions Auth sur un environnement de test préparé.
2. Auditer les privilèges de schéma, les ACL de fonctions, vues, triggers et tâches planifiées.
3. Réconcilier les fonctions présentes dans Git avec l'inventaire des Edge Functions déployées.
4. Vérifier les runs CI et les tests réellement exécutés sur le commit de tête `Evolution-6`.

### P2 — cartographie d'exécution Cheexpeer
1. Extraire pour chaque page HTML les scripts et feuilles de style chargés.
2. Relier chaque script à ses endpoints, fonctions Edge, tables, politiques et rôles.
3. Documenter les événements métier et les échanges entre rubriques, CRM, administration et mémoire.
4. Produire un inventaire machine-readable qui pourra être réutilisé par le futur poste de commandement Cheexpeer.

## 7. Limites de cette livraison

Cette livraison ne prétend pas constituer l'audit exhaustif final :
- l'extraction page HTML → scripts et styles n'a pas encore été terminée pour les 37 pages ;
- la comparaison des migrations n'a pas encore été poussée jusqu'aux empreintes et à l'analyse SQL migration par migration ;
- les définitions complètes des fonctions et leurs chemins d'appel doivent faire l'objet d'une revue dédiée ;
- aucun test Auth/RLS avec plusieurs identités n'a été exécuté ;
- aucun run CI, build local ou test navigateur n'a été lancé pendant ce lot ;
- aucune vérification exhaustive des domaines, aliases, variables d'environnement et réglages Git Vercel n'a été réalisée.

**Critère de sortie du Lot 1A : non atteint.** Cette livraison est une première cartographie vérifiée et fait apparaître des écarts bloquants à traiter avant toute évolution backend ou automatisation Cheexpeer.


## 8. Dépendances des 37 pages HTML — extraction terminée

Les 37 pages HTML du manifeste ont été lues. Les références `<script src>` et `<link rel="stylesheet">` ont été extraites pour chaque page. Cette passe confirme une forte mutualisation autour de `catalogue-majestios.js`, `rubric-search.js`, `app.js`, `rubriques-immersives.js`, `styles.css`, `rubriques-immersives.css` et `charte-majestios.css`, avec des modules spécialisés selon les dossiers.

Principaux rattachements constatés :

| Page / groupe | Scripts et styles spécialisés | Dépendances et limites observées |
|---|---|---|
| Accueil et rubriques générales | `catalogue-majestios.js`, `rubric-search.js`, `app.js`, souvent `rubriques-immersives.js` | Navigation et recherche côté navigateur ; les scripts partagés ne constituent pas à eux seuls un service backend |
| Pages de catégories | Ajout de `category-results.js` | Affichage de résultats par catégorie |
| Résultats transversaux | `search-results.js` | Consommation du contexte de recherche côté navigateur |
| Prospection | `company-targeting.js`, `naf-suggestions.js`, `company-fit.js`, `company-targeting-page.js`, `prospection-criteria-ux.js` | Requêtes directes vers `recherche-entreprises.api.gouv.fr` et `geo.api.gouv.fr` ; l'adaptateur membre appelle une Edge Function distincte |
| Appels d'offres / opportunités | `opportunity-search.js` | Requêtes directes vers les API BOAMP et BODACC depuis le navigateur |
| CRM | `crm-page.js`, `crm-business-filters.js`, `crm-workspace-nav.js` ; `crm-page.js` importe `crm-client.js` | Le client CRM interroge `organization_members`, `organizations`, `businesses`, `activities`, `crm_reminders` et appelle le RPC `complete_crm_reminder` |
| Administration | `administration.js`, `administration.css` | Interroge `official_data_sources`, `organization_members`, `businesses`, `contacts`, `opportunities`, `organizations` |
| Espace interne | `espace-interne.js`, `espace-interne.css` | Interroge `organization_members` et `organizations` |
| Espace membre | `auth-espace-membre.js` | Interroge `organization_members` et appelle `provision-client-workspace` |
| Réputation virtuelle | `reputation-virtuelle.js`, `reputation-virtuelle.css` | Requêtes de consultation Google Web/Maps ; le JavaScript de page n'appelle pas de moteur IA Cheexpeer |

### 8.1 Écarts d'intégration détectés

- Le parcours Auth de l'espace membre appelle `provision-client-workspace`, mais cette Edge Function n'apparaît pas dans les trois fonctions actives du projet Supabase. Le code correspondant existe dans Git. **Le parcours d'inscription/provisionnement doit donc être considéré comme non confirmé et potentiellement bloqué en production** tant que le déploiement réel de cette fonction n'est pas vérifié ou rétabli.
- Le module d'adaptation de Prospection appelle `prospection-search-member`, mais cette Edge Function n'apparaît pas non plus dans l'inventaire distant actif. Le parcours de recherche membre ne peut pas être qualifié d'opérationnel sur la seule base du code versionné.
- `opportunity-search.js` interroge directement les API BOAMP et BODACC depuis le navigateur. Les fournisseurs sont donc des dépendances runtime côté client, même si l'interface n'affiche pas nécessairement leur nom.
- Le ciblage d'entreprises s'appuie sur les API publiques Recherche d'entreprises et geo.api.gouv.fr directement depuis le navigateur.
- La page Réputation virtuelle permet des consultations Google Web/Maps, mais son script de page ne déclenche pas d'analyse IA Cheexpeer. La présence d'une architecture d'analyse dans le dépôt ou d'une PR ne prouve pas l'exécution d'un endpoint en production.

### 8.2 Déclencheurs PostgreSQL observés

L'introspection des triggers du schéma public confirme :
- des triggers d'intégrité multi-tenant sur `businesses`, `contacts`, `opportunities` et `activities`, appelant `private.enforce_tenant_relationship_integrity()` ;
- des triggers `set_updated_at` sur `businesses`, `client_requests`, `contacts`, `opportunities`, `organizations` et `profiles` ;
- un trigger sur `opportunities` appelant `private.sync_crm_reminders_for_opportunity()`.

Les relances CRM reposent donc sur des mécanismes SQL déclenchés par les modifications d'opportunités. La tâche planifiée qui matérialise les relances doit encore être rapprochée des jobs `pg_cron` et de leur dernière exécution.

### 8.3 Exécution CI sur la livraison documentaire

Le commit documentaire `2f8f7410ba870ec790b67bd0e297a2ee7524c72e` a déclenché le workflow `Vérification du site MajestiOS` (`verify-site.yml`) sur `Evolution-6`.

Résultat observé après achèvement :
- statut du run : `completed` ;
- conclusion : `success` ;
- 31 étapes terminées avec succès, dont syntaxe JavaScript, tests unitaires ciblés, build statique, vérification d'architecture, liens/identifiants, tests navigateur Prospection, BOAMP, BODACC, immeuble interactif, recherche, Réputation virtuelle, navigation responsive, formulaire de contact et verrouillage du poste de commandement sans session.

Ce résultat constitue une preuve CI utile pour le commit documentaire testé. Il ne constitue pas un test Auth/RLS multi-identités contre Supabase distant, ni une validation du déploiement Vercel de production.

## 9. Mise à jour du critère de sortie

L'extraction des 37 pages HTML et la vérification CI sont maintenant réalisées. Le critère de sortie du Lot 1A reste **non atteint**, car les écarts critiques de versionnement des migrations, l'absence apparente de deux Edge Functions requises par les parcours membre, l'audit complet des privilèges et l'identification du projet Vercel canonique restent ouverts.


## 10. Vérifications approfondies — migrations, tâches planifiées, privilèges et Vercel

### 10.1 Comparaison du contenu des 22 migrations appliquées

La première comparaison des versions a révélé 12 différences d'identifiants. Une comparaison plus approfondie a ensuite confronté les instructions SQL stockées dans `supabase_migrations.schema_migrations` aux fichiers SQL de `Evolution-6`, après normalisation des commentaires et espaces.

**Résultat : les 22 migrations distantes ont toutes un fichier local de même nom et leur contenu SQL normalisé est identique.**
- 10 migrations ont le même identifiant de version local et distant.
- 12 migrations ont des identifiants de version différents, mais leur contenu SQL est identique.
- Aucune migration distante sans fichier local n'a été trouvée.
- Une migration supplémentaire existe uniquement dans Git : `20261108151400_enforce_vip_boundary_for_internal_crm.sql`.

L'écart des 12 identifiants correspond donc à une réécriture/re-numérotation de l'historique local par rapport à l'historique distant, et non à une divergence du contenu des 22 migrations effectivement appliquées.

### 10.2 Migration locale supplémentaire : ne pas appliquer

Le fichier `20261108151400_enforce_vip_boundary_for_internal_crm.sql` est absent de l'historique distant. Son contenu est particulièrement important :
- il introduit `private.can_read_crm_org` et `private.can_edit_crm_org` ;
- il réserve le CRM interne aux `owner/admin` ;
- mais il autorise aussi `member` à lire et modifier le CRM des organisations clientes/partenaires ;
- il redéfinit également le RPC `complete_crm_reminder`.

Cette logique n'est pas équivalente à la politique VIP actuellement appliquée, qui utilise `private.is_org_admin` pour les cinq tables CRM, sans distinction du type d'organisation.

**Décision d'audit : ne pas appliquer cette migration.** Elle ouvrirait des capacités CRM aux membres des tenants clients/partenaires, alors que le déploiement progressif retenu réserve actuellement le CRM VIP à owner/admin et ne doit pas anticiper l'ouverture du CRM membre. Son statut « local uniquement » doit rester explicite jusqu'à une décision métier ultérieure.

La migration appliquée `vip_only_crm_access` a elle-même été comparée au fichier local : son contenu SQL normalisé est identique.

### 10.3 Tâche planifiée des relances CRM

L'introspection `pg_cron` confirme une tâche active :
- job : `1` ;
- cadence : toutes les cinq minutes (`*/5 * * * *`) ;
- commande : `select private.materialize_crm_reminders();`.

Les 12 dernières exécutions consultées, de 08:30 à 09:25 UTC le 9 novembre 2026, sont toutes en statut `succeeded`. La matérialisation des relances est donc bien planifiée et ses exécutions récentes sont réussies. Cela ne prouve pas encore le comportement fonctionnel sur des opportunités réelles, puisque le CRM ne contient pas encore de pipeline d'opportunités à traiter.

### 10.4 Privilèges et fonctions sensibles

Le contrôle des ACL PostgreSQL confirme :
- le schéma `private` n'est pas utilisable par `anon`, mais son droit `USAGE` est accordé à `authenticated` et `service_role` ;
- `authenticated` ne possède pas le droit `CREATE` sur `private` ;
- les fonctions sensibles de bootstrap, import officiel et provisionnement sont limitées à `service_role` et/ou Postgres ;
- les helpers `private.is_org_admin`, `private.is_org_member`, `private.is_org_editor` et `private.is_internal_staff` sont exécutables par `authenticated`, ce qui est cohérent avec leur usage dans les politiques RLS ;
- les fonctions `SECURITY DEFINER` inspectées ont `search_path` fixé à la chaîne vide, et utilisent des noms de schémas qualifiés ;
- `public.set_updated_at` conserve un droit EXECUTE accordé à PUBLIC/anon/authenticated. Elle est une fonction trigger (retour `trigger`) et non un RPC métier ordinaire ; le grant est à documenter, mais ne démontre pas à lui seul une possibilité d'appel direct exploitable.

Les tests d'autorisation sous de vraies identités Auth n'ont pas été exécutés. L'audit des privilèges effectifs de toutes les vues, des chemins indirects et des rôles hérités reste ouvert.

### 10.5 Advisor Supabase

Le Security Advisor ne retourne qu'un avertissement :
- `auth_leaked_password_protection` — protection des mots de passe compromis désactivée.

Il recommande l'activation de la vérification des mots de passe compromis. Aucun réglage n'a été modifié pendant l'audit.

Le Performance Advisor signale 20 index non utilisés. Plusieurs concernent le registre officiel, les relations CRM et les relances. Les tables sont encore presque vides ; ces signaux ne justifient pas une suppression d'index. Conserver les index jusqu'à l'observation d'une charge et de statistiques représentatives.

### 10.6 Vercel — rattachement des alias confirmé

La lecture des alias et des déploiements précise le rôle des trois projets :

- **`majestios`** : le déploiement `READY` sur `main`, commit `94f2af84...`, cible `production`, porte l'alias `majestios.vercel.app`. C'est le projet Vercel associé au nom court principal.
- **`majestios-ljx1`** : le même commit `main` est également déployé avec cible `production`. Ses alias restent propres au projet (`majestios-ljx1.vercel.app`, `majestios-ljx1-majistr.vercel.app`, `majestios-ljx1-git-main-majistr.vercel.app`). Il s'agit donc d'un second projet en production, mais pas du propriétaire de `majestios.vercel.app`.
- **`majestios-jc8g`** : le dernier déploiement observé provient de `brouillon-reputation-virtuelle`, cible non renseignée, et les alias historiques sont des alias de preview par branche. La protection SSO et la protection par mot de passe sont désactivées dans les réglages lus.

Les trois projets sont liés au même dépôt GitHub `Chexpeer/Majestios`. Le projet `majestios` est le candidat canonique pour le domaine court Vercel ; `majestios-ljx1` constitue une duplication de déploiement production à clarifier. Aucun projet n'a été modifié ou supprimé.

Aucun des trois projets ne présente `MajestiOS.com` ou `www.majestios.com` dans sa liste de domaines de projet. La recherche du domaine `majestios.com` dans le compte Vercel de l'équipe n'a pas abouti. Le domaine peut être géré chez un autre registrar ou dans un autre compte ; son routage réel n'est donc pas confirmé par cet audit.

**Risque de confidentialité :** le projet `majestios-jc8g` expose des alias de preview sans SSO. Il faut vérifier le contenu de ces previews et décider d'une politique de protection avant d'y placer des informations internes. Aucun secret, contournement de protection ou changement de réglage n'a été demandé ni effectué.

## 11. État actualisé des points de contrôle

| Contrôle | État |
|---|---|
| 73 ressources du manifeste présentes | Vérifié |
| Extraction des 37 pages HTML et dépendances principales | Vérifié |
| 22 migrations appliquées comparées au SQL local | Vérifié : contenu identique après normalisation |
| Migration locale supplémentaire identifiée | Vérifié : non appliquée, à ne pas appliquer sans décision métier |
| 15 tables publiques avec RLS | Vérifié |
| Fonctions sensibles et ACL principales | Premier audit effectué ; chemins indirects à poursuivre |
| Cron des relances CRM | Actif, 12 dernières exécutions réussies |
| Security Advisor | 1 avertissement sur les mots de passe compromis |
| Performance Advisor | 20 index non utilisés, non supprimés |
| Fonctions Edge actives | 3 confirmées ; deux parcours membres appellent des fonctions non listées actives |
| Projets et alias Vercel | Rattachement des trois projets confirmé |
| Projet Vercel canonique | `majestios` pour `majestios.vercel.app` ; duplication `majestios-ljx1` à clarifier |
| Domaine MajestiOS.com | Non associé aux trois projets Vercel consultés |
| Tests Auth/RLS owner/admin/member/viewer multi-tenant | Non exécutés |
| Protection des previews `majestios-jc8g` | SSO désactivé ; décision de protection à prendre |

Le critère de sortie du Lot 1A reste **partiellement atteint** : l'inventaire et le rapprochement de l'historique des migrations sont désormais fiables, mais les tests d'accès Auth/RLS, la clarification de la duplication Vercel, la protection des previews et la réconciliation des Edge Functions restent à traiter.
