# Audit initial de l'environnement MajestiOS pour Cheexpeer — 9 novembre 2026

**Statut :** audit en lecture seule, fondé sur les sources GitHub, les métadonnées Vercel et l'introspection Supabase disponibles le 9 novembre 2026.  
**Branche de référence :** `Evolution-6`.  
**Dépôt :** `Chexpeer/Majestios`.  
**Périmètre :** cartographie documentaire et applicative initiale, backend, CRM, sécurité, environnements, déploiements et prérequis de l'orchestration Cheexpeer.  
**Aucune modification applicative, migration, écriture SQL, modification de données, changement de configuration, fusion ou déploiement n'a été effectué pendant l'audit.**

---

## 1. Synthèse exécutive

MajestiOS possède déjà plusieurs fondations réutilisables pour Cheexpeer :

- un site statique structuré autour d'un manifeste unique `site-files.json` ;
- des contrôles d'architecture, de liens et de parcours ainsi que des tests automatisés ;
- un socle Supabase PostgreSQL 17 avec 15 tables publiques et RLS activé sur chacune ;
- un CRM multi-tenant avec une séparation d'accès VIP au niveau des politiques CRM actuellement observées ;
- un registre de huit sources officielles et trois Edge Functions actives ;
- un projet Supabase de test distinct, créé mais encore vierge ;
- trois projets Vercel rattachés à l'écosystème MajestiOS.

**Conclusion :** il existe des composants techniques substantiels, mais pas encore de cerveau Cheexpeer transversal démontré, ni de cartographie d'exécution centralisée, ni de canal Admin ↔ Cheexpeer opérationnel, ni de bus d'événements et de mémoire commune dont le fonctionnement serait prouvé.

La priorité n'est donc pas de créer immédiatement un agent conversationnel. Il faut d'abord consolider la vérité de l'environnement, harmoniser la documentation et définir les contrats de circulation, de mission et d'autorisation sur les composants existants.

## 2. Dépôt GitHub et architecture du site

### 2.1 Structure et publication

Le dépôt utilise un site principalement statique en HTML, CSS et JavaScript natif. Le manifeste `site-files.json` centralise les pages et ressources publiées dans `dist/`. Le manifeste consulté contient 70 entrées environ (pages HTML, scripts, styles et ressources visuelles) ; son contenu exact doit rester la source de vérité au moment d'une nouvelle génération.

Les contrôles repérés comprennent notamment :

- `build.js` : génération statique à partir du manifeste ;
- `verify-site.js` : contrôle des pages, liens locaux et identifiants ;
- `verify-architecture.js` : contrôle des invariants de navigation et d'architecture ;
- `.github/workflows/verify-site.yml` et `.github/workflows/majestios-anti-regression.yml` : workflows de validation ;
- tests unitaires et navigateur autour du bâtiment interactif, de la recherche, des formulaires, de la prospection et du contrat de sécurité CRM.

Les tests et workflows sont des fondations utiles pour Cheexpeer : il pourra les orchestrer et interpréter leurs résultats. En revanche, la présence de scripts de vérification ne prouve pas que tous les parcours réels, comptes et connecteurs sont testés de bout en bout.

### 2.2 Arborescence fonctionnelle repérée

La référence V5 décrit neuf destinations principales de l'immeuble interactif :

| Niveau | Destination | Route |
|---|---|---|
| 08 | Espace privé | `espace-membre.html` |
| 07 | Réseau | `reseaux-synergies.html` |
| 06 | Développement commercial | `developpement-commercial.html` |
| 05 | Prospection | `prospection-active.html` |
| 04 | Accompagnement appels d'offres | `accompagnement-appels-offres.html` |
| 03 | Marchés publics | `marches-publics.html` |
| 02 | Marchés privés | `marches-prives.html` |
| 01 | Réputation virtuelle | `reputation-virtuelle.html` |
| RDC | Accueil | `index.html` |

Des parcours et dossiers complémentaires sont présents : veille marchés, BODACC, sous-traitance, qualification entreprises, salons et séminaires, suivi commercial, CRM, intelligence économique, pages de vision/FAQ et pages légales.

Les fonctions transversales identifiées sont le moteur de recherche commun, le CRM, la Business Intelligence, Cheexpeer, l'administration, la mémoire, le SEO et la gouvernance.

**À compléter :** la matrice exhaustive route → dossier → page → script → données → événements n'est pas encore consolidée dans un seul inventaire machine-readable. Le manifeste recense les ressources publiées, mais pas leurs dépendances métier ou leurs droits.

### 2.3 État réel des fonctionnalités

Le dépôt contient des interfaces et des composants de recherche/prospection, mais les documents de référence rappellent plusieurs limites :
- les appels BOAMP et BODACC sont notamment décrits comme des appels directs depuis le navigateur ;
- un registre de sources ou une page dédiée ne prouve pas qu'une synchronisation continue existe ;
- les pages et formulaires de démonstration ne doivent pas être confondus avec des services persistants ;
- les fonctions SEO, BI, mémoire et orchestration doivent être qualifiées selon leur état réel et leurs preuves.

La future cartographie Cheexpeer devra attribuer à chaque capacité un statut contrôlé : prévu, spécifié, développé, testé, intégré, déployé, opérationnel.

## 3. Supabase : état constaté en direct

### 3.1 Projets

| Projet | Référence | Région | État | Constat |
|---|---|---|---|---|
| `majestios-crm` | `qxaghcifdhugfskuscoc` | Paris (`eu-west-3`) | `ACTIVE_HEALTHY` | Projet métier existant, à préserver |
| `MajestiOS-Test` | `qrlnnfjstoeliymxtkbk` | Francfort (`eu-central-1`) | `ACTIVE_HEALTHY` | Projet de test vierge |

Les deux projets utilisent PostgreSQL 17.11. Le projet de test ne contient actuellement aucune table publique, aucune migration appliquée et aucune Edge Function. Il ne contient donc pas une copie de la production et ne doit pas être considéré comme prêt à exécuter les parcours métier avant préparation contrôlée de son schéma.

### 3.2 Projet métier `majestios-crm`

Constats directs :
- 15 tables dans le schéma public ;
- RLS activé sur les 15 tables ;
- 22 migrations enregistrées comme appliquées ;
- trois Edge Functions actives ;
- une organisation de type `internal` ;
- un membre d'organisation avec le rôle `owner` ;
- huit entrées dans le registre `official_data_sources`.

Tables observées :

- Identité et espaces : `organizations`, `profiles`, `organization_members`.
- CRM : `businesses`, `contacts`, `opportunities`, `activities`, `client_requests`, `crm_reminders`.
- Confidentialité : `privacy_acknowledgments`.
- Sources et référentiel : `official_data_sources`, `company_registry`, `company_registry_establishments`, `official_source_sync_runs`, `company_source_observations`.

Comptages agrégés consultés, sans extraction de contenu personnel :
- fiches CRM entreprises : 0 ;
- contacts : 1 ;
- opportunités : 0 ;
- activités : 0 ;
- registre entreprises officielles : 0 ;
- établissements : 0 ;
- observations de sources : 0 ;
- organisation interne : 1 ;
- membres : 1, rôle `owner`.

Le CRM possède donc son schéma et ses règles, mais il ne constitue pas encore un historique commercial alimenté. Le contact déjà présent n'a pas été consulté ni reproduit dans ce rapport.

### 3.3 Edge Functions actives

| Fonction | Version observée | Vérification JWT |
|---|---:|---|
| `search-official-companies` | 4 | Oui |
| `import-official-company` | 2 | Oui |
| `bootstrap-internal-admin` | 3 | Oui |

La fonction `provision-client-workspace` est mentionnée dans la documentation historique et le code, mais elle n'apparaît pas dans l'inventaire des fonctions actives retourné pour le projet au moment du contrôle. Ce décalage doit être réconcilié avant de considérer le parcours d'inscription comme opérationnel.

### 3.4 Sécurité et rôles — constat nuancé

Les politiques actuellement présentes sur les tables CRM `businesses`, `contacts`, `opportunities`, `activities` et `crm_reminders` s'appuient sur `private.is_org_admin(organization_id)`. Cette fonction ne reconnaît que les rôles `owner` et `admin`. Les lectures et écritures directes du CRM sont donc bien limitées à ces rôles dans les politiques observées.

La fonction `private.is_internal_staff()` inclut aussi le rôle `member`, mais elle est utilisée sur le circuit `client_requests` pour permettre certaines opérations de traitement des demandes. Cette capacité ne doit pas être réutilisée comme autorisation générale du canal de commandement Admin ni du CRM VIP.

Les tables publiques sont toutes sous RLS. Cela constitue une bonne base, mais ne remplace pas :
- des tests Auth/RLS réels avec des identités owner, admin, member, viewer et utilisateurs de tenants distincts ;
- une revue des privilèges SQL et des fonctions SECURITY DEFINER ;
- des tests directs d'API, au-delà des contrôles d'interface ;
- une validation des frontières entre données internes, données clients et contexte IA.

**Alerte Supabase Auth :** le conseiller de sécurité signale que la protection contre les mots de passe compromis est désactivée. Il s'agit d'une recommandation de sécurité à examiner dans le tableau de bord ; aucun réglage n'a été modifié.

Le conseiller performance signale plusieurs index non utilisés. Dans un projet encore peu alimenté, ces signaux ne justifient pas de supprimer des index : ils doivent être réévalués après charge réelle et analyse des requêtes.

## 4. Vercel : projets et gouvernance des déploiements

Trois projets Vercel associés au périmètre MajestiOS ont été retrouvés :

| Projet | Identifiant | Dernier déploiement observé |
|---|---|---|
| `majestios` | `prj_efmheKwiXnsncdhJYLmNIWN9QYQL` | `READY`, cible `production` |
| `majestios-jc8g` | `prj_sGuy8pdmacMpqcASR2RvOUx6NWkd` | `READY`, cible non renseignée |
| `majestios-ljx1` | `prj_MpP40i8sQTmFpNxL1FOHu23h4BQp` | `READY`, cible `production` |

Les domaines et protections diffèrent selon les projets. Le projet `majestios` expose notamment `majestios.vercel.app` et présente une protection SSO sur les déploiements hors domaines personnalisés ; `majestios-jc8g` ne présente pas de protection SSO dans les métadonnées consultées.

**Décision requise avant toute activation :** choisir un projet Vercel canonique pour la production, identifier les projets réservés aux previews/tests et documenter la correspondance dépôt/branche/environnement. Aucun déploiement n'a été lancé pendant cet audit.

## 5. État des travaux Cheexpeer déjà présents

Le document directeur transversal Cheexpeer est présent sur `Evolution-6`. Il définit l'architecture cible : connaissance de l'environnement, circulation inter-rubriques, mémoires, compétences spécialisées, canal Admin, orchestration, permissions, autonomie et critères d'acceptation.

La PR #59 sur la Réputation virtuelle est ouverte et ne doit pas être considérée comme intégrée ou opérationnelle. Elle prévoit une route Vercel d'analyse IA et un adaptateur Claude via AI Gateway, mais son descriptif précise que l'Edge Function de contexte n'est pas déployée, que la route n'est pas déployée ni raccordée à l'interface, et qu'aucun appel réel au modèle n'a été effectué.

La PR #47 contient un historique important sur la séparation des accès VIP et Membres. Son descriptif conserve une alerte ancienne indiquant que la migration VIP n'était pas appliquée. Le contrôle direct actuel de Supabase montre cependant la migration `vip_only_crm_access` dans l'historique appliqué et les politiques CRM VIP en place. **L'état direct de la base prévaut sur cette note historique**, sous réserve de tests d'accès avec de vrais comptes.

## 6. Écarts prioritaires avant le développement du cerveau central

| Priorité | Écart | Pourquoi c'est bloquant | Travail à prévoir |
|---|---|---|---|
| P0 | Choix du Vercel canonique | Éviter les déploiements sur la mauvaise cible | Cartographier projet, branche, domaine, environnement et protection |
| P0 | Parité migrations Git ↔ Supabase | Éviter dérive et migrations destructrices | Comparer les 22 migrations appliquées aux fichiers versionnés ; retrouver le SQL exact manquant |
| P0 | Tests d'accès Auth/RLS | Le canal Admin et la mémoire ne doivent pas contourner le CRM VIP | Scénarios directs API avec identités dédiées |
| P1 | Cartographie complète du site | Cheexpeer doit connaître routes, composants, données et dépendances | Générer un inventaire exploitable depuis le manifeste, les imports, les routes et les tests |
| P1 | Contrat événement / transmission | Les rubriques doivent partager des informations traçables | Harmoniser les contrats V5 et définir enveloppe, provenance, finalité, confiance, destinataires et idempotence |
| P1 | Contrat de mission | Continuité entre conversations et exécutions | Définir mission, état, étapes, blocages, approbations, reprise et journal |
| P1 | Préparation du projet de test | Les essais doivent rester isolés | Reconstituer le schéma à partir de migrations vérifiées, sans données VIP réelles |
| P2 | Audit des privilèges SQL et fonctions sensibles | Éviter les élévations de privilèges indirectes | Revue exhaustive SECURITY DEFINER, grants, search_path et appels |
| P2 | Sources et ingestion | Les registres ne sont pas des pipelines actifs | Distinguer catalogue, connecteur, collecte, observation et synchronisation prouvée |
| P2 | Mémoire transversale | Éviter duplication et fuite entre tenants | Définir stockage, indexation, rétention, droits et provenance |

## 7. Architecture cible de réalisation recommandée

Ne pas créer un ensemble d'agents autonomes. Construire une identité Cheexpeer centrale, avec :

1. **Registre de l'environnement** : pages, routes, composants, services, tables, fonctions, connecteurs, dépendances et versions.
2. **Passerelle d'identité et de permissions** : vérification serveur de chaque acteur et de chaque mission.
3. **Orchestrateur central** : planification, sélection des compétences, séquencement et gestion des erreurs.
4. **Contrat commun d'information** : événements, observations, preuves, provenance, fraîcheur, sensibilité et destinataires.
5. **Contrat commun de mission** : objectif, demandeur, périmètre, étapes, état, approbations, résultats et historique.
6. **Mémoire gouvernée** : environnementale, métier, opérationnelle et relationnelle, cloisonnée par tenant et finalité.
7. **Passerelle d'outils** : API, fonctions serveur, CI, connecteurs et outils d'administration.
8. **Poste de commandement Admin** : dialogue, missions, supervision, décisions et mémoire.
9. **Observabilité** : journaux, preuves, tests, coûts, quotas, erreurs et reprise.

La logique déterministe doit garder la responsabilité des permissions, transitions d'état, validations de schéma et exécutions sensibles. Le modèle IA peut comprendre, analyser, classer, synthétiser et préparer, mais ne doit pas se donner lui-même des droits.

## 8. Prochain lot concret

**Lot 1A — Inventaire automatisable et parité documentaire :**
- produire un inventaire exhaustif des pages et ressources du manifeste ;
- extraire les routes, scripts chargés et dépendances ;
- relier les tests et workflows aux fonctions qu'ils couvrent ;
- comparer les migrations du dépôt à l'historique réel des 22 migrations ;
- établir la liste des fonctions SQL, Edge Functions, tables, politiques RLS et privilèges ;
- cartographier les projets Vercel et leurs branches/domaines ;
- produire une matrice « composant → preuve → état réel → dépendances → permissions → tests ».

**Critère de sortie :** chaque composant majeur de MajestiOS est répertorié, sa preuve est datée, ses dépendances sont connues et ses limites sont explicites. Aucun composant n'est déclaré opérationnel sur la seule base d'un écran ou d'un document.

## 9. Limites de cet audit

Cet audit est un premier relevé multi-sources en lecture seule, pas encore une revue exhaustive du code ligne par ligne. Les métadonnées GitHub, les fichiers ciblés, le manifeste, les documents de référence, les métadonnées Vercel et les catalogues Supabase ont été consultés. Les scénarios Auth/RLS avec de véritables comptes, les tests locaux complets, les tests navigateur, l'inspection de chaque page, la revue complète des grants SQL et la comparaison détaillée des 22 migrations avec les fichiers Git restent à exécuter.

Aucun contenu personnel de contact, secret, clé, mot de passe ou jeton n'a été extrait dans ce rapport.

---

**État final :** audit initial réalisé en lecture seule. Les projets de production sont restés intacts. Le projet `MajestiOS-Test` demeure vierge. Aucun déploiement, merge, migration ou changement de configuration n'a été effectué.


## 10. Mise à jour — simplification de l'authentification membre (9 novembre 2026)

À la suite de la décision produit, le formulaire de l'espace membre a été refondu sur la branche `Evolution-6` :
- prénom, nom et e-mail obligatoires ;
- entreprise et téléphone facultatifs ;
- suppression du mot de passe et de la récupération de mot de passe pour les membres/clients ;
- envoi et vérification d'un OTP e-mail natif Supabase Auth ;
- création de compte et connexions ultérieures par code à six chiffres ;
- conservation du provisionnement atomique du workspace client côté serveur.

Le code du client et de la fonction Edge `provision-client-workspace` a été adapté et un test de contrat Auth OTP a été ajouté à la CI. La documentation détaillée est disponible dans [AUTHENTIFICATION-OTP-ESPACE-MEMBRE-2026-11-09.md](AUTHENTIFICATION-OTP-ESPACE-MEMBRE-2026-11-09.md).

**Limites non levées :**
- `provision-client-workspace` n'était pas présente dans l'inventaire des fonctions actives du projet métier lors du dernier contrôle ; le code adapté n'a pas été déployé.
- Le modèle e-mail doit contenir `{{ .Token }}) pour délivrer un code numérique et les paramètres d'expiration/limitation doivent être vérifiés dans Supabase.
- Aucun test d'intégration Auth/OTP réel n'a encore été exécuté.
- Aucun QR code n'est implémenté dans ce lot ; il reste une option ultérieure à concevoir.
- Le parcours d'administration et les droits CRM VIP ne sont pas modifiés.

Aucun réglage Auth distant, migration SQL, politique RLS, compte métier ou déploiement Vercel n'a été modifié.
