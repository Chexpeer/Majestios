# Préparation de l’environnement technique de Cheexpeer — 8 novembre 2026

**Statut :** audit en lecture seule et préparation documentaire.  
**Branche examinée :** `feature/crm-atomic-integration`, HEAD `20391c375b2fc00195db53b658df304a49fad1f0`.  
**Projet Supabase contrôlé :** `majestios-crm`, région Paris (`eu-west-3`), référence `qxaghcifdhugfskuscoc`, état `ACTIVE_HEALTHY`.  
**Périmètre :** sources de données, connecteurs, CRM, Administration, sécurité, circulation et prérequis de l’IA intégrée.  
**Aucune activation de Cheexpeer, aucune modification de code applicatif, aucune migration, aucun changement Supabase et aucun déploiement n’ont été effectués.**

---

## 1. Conclusion exécutive

MajestiOS dispose déjà de fondations plus avancées que ne le laisse penser une partie de la documentation de la branche :

- un projet Supabase actif ;
- quinze tables métier dans le schéma public, toutes avec RLS activé ;
- un registre de huit sources de données officielles ;
- un référentiel d’entreprises et d’établissements prêt à recevoir des données ;
- un journal des observations par source et des exécutions de synchronisation ;
- trois Edge Functions actives, dont une pour rechercher les entreprises officielles et une pour importer une entreprise après contrôle des droits ;
- un CRM interne avec entreprises, contacts, opportunités, activités et relances persistantes.

**Mais le socle n’est pas encore une chaîne de collecte opérationnelle.** Les tables du registre et d’observation sont vides, aucune synchronisation de source n’a été enregistrée, et les résultats de recherche ne sont pas encore alimentés de façon récurrente. Les moteurs BOAMP et BODACC interrogent encore leurs API directement depuis le navigateur.

Deux écarts de cohérence doivent être traités avant toute extension :

1. la documentation backend du 6 novembre cite un ancien projet Supabase (`awtgrjnpckgxsdpfrnhg`) alors que la configuration du dépôt et le projet actuellement accessible correspondent à `majestios-crm` (`qxaghcifdhugfskuscoc`) ;
2. la base active connaît **21 migrations**, alors que les branches `main`, `feature/crm-atomic-integration` et `evolution-5.0-admin-cockpit` ne versionnent que 12 fichiers de migration. Ne pas lancer de synchronisation ou de migration automatique tant que cet écart n’est pas réconcilié.

La bonne stratégie est donc de consolider les fondations existantes, de rendre les flux de données fiables et auditables, puis seulement ensuite de connecter un moteur IA à Cheexpeer.

## 2. État vérifié du backend et du CRM

### 2.1 Projet et données

Contrôle effectué directement sur le projet Supabase actuellement configuré dans `supabase-config.js` :

| Élément | État observé |
|---|---|
| Projet | `majestios-crm` |
| Région | Paris — `eu-west-3` |
| État | `ACTIVE_HEALTHY` |
| PostgreSQL | 17.11 |
| Tables publiques | 15 |
| Tables publiques avec RLS | 15 sur 15 |
| Organisations | 1 |
| Membres d’organisation | 1 |
| Profils | 1 |
| Fiches entreprises CRM (`businesses`) | 0 |
| Contacts | 0 |
| Opportunités | 0 |
| Activités | 0 |
| Relances CRM | 0 |
| Référentiel officiel d’entreprises | 0 |
| Établissements du référentiel | 0 |
| Observations de sources | 0 |
| Exécutions de synchronisation | 0 |

Le projet possède donc une organisation interne initialisée, mais le référentiel commercial et les historiques d’observation ne contiennent pas encore de données métier.

### 2.2 Tables déjà présentes

Les quinze tables publiques observées sont :

- **Identité et espaces :** `organizations`, `profiles`, `organization_members`.
- **CRM :** `businesses`, `contacts`, `opportunities`, `activities`, `client_requests`, `crm_reminders`.
- **Confidentialité :** `privacy_acknowledgments`.
- **Sources officielles et référentiel :** `official_data_sources`, `company_registry`, `company_registry_establishments`, `official_source_sync_runs`, `company_source_observations`.

Les objets du référentiel officiel sont distincts des fiches CRM : cette séparation est utile. Une entreprise repérée dans une source n’est pas automatiquement un prospect CRM, et une observation brute ne doit pas être confondue avec une qualification commerciale validée.

### 2.3 Fonctions serveur actuellement déployées

Trois Edge Functions sont actives sur le projet :

| Fonction | Version observée | Usage |
|---|---:|---|
| `search-official-companies` | 4 | Recherche authentifiée dans l’API Recherche d’Entreprises |
| `import-official-company` | 2 | Import d’une entreprise et de ses établissements après contrôle des droits |
| `bootstrap-internal-admin` | 3 | Initialisation contrôlée du premier administrateur interne |

La fonction `provision-client-workspace` existe dans le dépôt et est appelée par `auth-espace-membre.js`, mais elle **n’apparaît pas dans la liste des fonctions déployées du projet actuel**. Le parcours d’inscription client doit donc être considéré comme non confirmé sur cet environnement tant que le déploiement et son test de bout en bout ne sont pas vérifiés. Aucun déploiement n’a été tenté pendant cet audit.

### 2.4 Migrations : écart de traçabilité à résoudre

La base active contient 21 migrations appliquées. Neuf migrations présentes dans l’historique de la base ne figurent pas dans les dossiers `supabase/migrations/` des trois branches contrôlées :

- `20261107065916_grant_crm_record_updates`
- `20261107065932_harden_crm_reminder_permissions_and_indexes`
- `20261107065956_official_company_registry_and_sources`
- `20261107070006_restrict_source_sync_run_visibility`
- `20261107070144_register_open_company_search_api`
- `20261107070313_atomic_official_company_import`
- `20261107070340_validate_official_import_identifiers`
- `20261107070406_harden_import_permission_and_sync_index`
- `20261107070905_expose_internal_admin_bootstrap_service_role_only`

Ces migrations ne doivent pas être recréées de mémoire ni remplacées par des fichiers approximatifs. Il faut retrouver leur SQL exact, vérifier les dépendances et comparer le schéma réel avant de rétablir la parité Git ↔ Supabase.

## 3. Registre des sources et état des connecteurs

Le registre technique `official_data_sources` contient huit entrées. Les statuts ci-dessous proviennent de la base active ; ils ne sont pas des promesses de disponibilité commerciale.

| Source | Statut du registre | Situation constatée / prochaine vérification |
|---|---|---|
| API Recherche d’Entreprises — DINUM | `active` | Recherche et import via Edge Functions déployées. Aucun historique de synchronisation ni import persistant observé. |
| Annuaire des Entreprises | `assessment` | Portail et agrégateur de données ; clarifier son rôle par rapport à l’API Recherche d’Entreprises pour éviter les doublons de connecteurs. |
| BOAMP | `assessment` | Recherche actuelle côté navigateur via OpenDataSoft ; pas de pipeline serveur ni d’historique de synchronisation observé. |
| BODACC | `assessment` | Recherche actuelle côté navigateur via OpenDataSoft ; les annonces restent des signaux légaux à qualifier, pas des marchés privés confirmés. |
| data.gouv.fr | `assessment` | Portail de jeux de données et services ; chaque jeu doit être évalué séparément, avec ses conditions de réutilisation. |
| Journal officiel | `planned` | Non raccordé. Définir les cas d’usage et le périmètre juridique avant intégration. |
| RNE — INPI | `planned` | Pas de connecteur actif observé ; accès et conditions à instruire. |
| Répertoire SIRENE — INSEE | `assessment` | Source authentifiée ; clé et proxy serveur à configurer et tester avant utilisation. |

Autres ressources recensées dans le code de Prospection :

- **ADEME — entreprises RGE :** appel direct depuis le navigateur, avec lecture dynamique du schéma du jeu de données. La réponse réelle et la stabilité des champs n’ont pas été validées dans le lot documentaire consulté.
- **QUALIBAT :** connecteur proxy prévu, mais URL serveur non configurée dans le code observé ; vérifier l’accès, les conditions et les données réellement retournées.
- **QUALIFELEC, OPQIBI et FNTP :** fiches de ressources et points d’extension, mais aucun raccordement actif vérifié ; accès soumis à confirmation des droits et modalités fournisseurs.
- **Annuaires professionnels, fédérations et plateformes de sous-traitance :** intégration au cas par cas, jamais par aspiration générique sans autorisation.

### Règle d’interface non négociable

Les sources restent **invisibles pour l’utilisateur du moteur unifié de Prospection** : pas de sélecteur, catalogue, liste de fournisseurs, logos ou noms de connecteurs. Le moteur orchestre les ressources en arrière-plan et présente une recherche cohérente. Les noms, contrats, états techniques et erreurs détaillées restent dans l’administration et les journaux internes.

La présence d’une source dans un catalogue ou un registre ne signifie pas qu’elle est connectée. Le statut doit reposer sur une preuve technique récente : appel réussi, réponse exploitable, conditions d’accès validées et traçabilité conservée.

## 4. Architecture cible de circulation des données

La préparation doit respecter la décision du fondateur : les données peuvent circuler entre rubriques, moteurs, dossiers et CRM après contrôle et validation de l’Administration, puis être retournées au demandeur ou au collaborateur auquel elles sont affectées.

Le flux de référence est :

1. **Demande ou collecte** — la rubrique ou le moteur exprime un besoin et ses critères.
2. **Connecteur** — le serveur interroge la source autorisée ; aucun secret fournisseur ne transite dans le navigateur.
3. **Normalisation** — conversion vers un contrat de données commun sans effacer les champs propres à la source.
4. **Contrôles** — format, complétude, fraîcheur, identifiants, doublons, provenance, finalité, droits d’usage et restrictions.
5. **Observation** — conservation de l’identifiant externe, de l’URL officielle, des dates, du hash du contenu utile, de la source et de l’exécution de collecte.
6. **Rapprochement** — SIREN/SIRET en priorité ; aucun rapprochement ou fusion automatique sur le seul nom ou l’adresse.
7. **Revue Administration** — validation, rejet, correction, demande de complément ou mise en attente.
8. **Attribution et retour** — remise au demandeur ou au collaborateur affecté, dans le périmètre de ses droits.
9. **Capitalisation CRM** — création ou rattachement explicite d’une fiche ou opportunité après validation ; conservation du lien vers le dossier d’origine et de l’historique.

Les tables `official_data_sources`, `official_source_sync_runs` et `company_source_observations` constituent déjà une première base pour le registre et la traçabilité. Leur contrat exact, les politiques RLS, les règles de rétention et les mécanismes de synchronisation doivent être vérifiés avant extension.

### Séparation des espaces

- **CRM interne :** référentiel de travail commercial et historique interne.
- **Espaces clients :** données strictement cloisonnées par organisation.
- **Référentiel officiel :** identité administrative et établissements issus de sources publiques, distincts des relations commerciales.
- **Administration :** contrôle qualité, validation, attribution, droits et audit.
- **Cheexpeer :** à terme, lecture, analyse, rapports, alertes et propositions dans les limites déléguées. Elle ne valide pas à la place de l’Administration.

Une validation administrative ne remplace jamais les permissions techniques, la RLS, la base légale, la minimisation des données ou le contrôle des finalités.

## 5. Préparer Cheexpeer sans l’activer

### 5.1 Indépendance du moteur IA

Cheexpeer demeure l’identité d’usage de l’IA intégrée à MajestiOS. Le fournisseur et le modèle sous-jacent pourront évoluer sans changer son identité, ses règles métier ou ses permissions.

L’architecture future devra donc isoler :

- l’identité, les instructions et les règles de Cheexpeer ;
- l’interface d’adaptation au fournisseur de modèle ;
- les outils métier autorisés ;
- les données accessibles selon le rôle et la finalité ;
- la gouvernance Administration ;
- les journaux d’exécution et les évaluations de qualité.

Aucun choix de fournisseur n’est arrêté par cet audit. Une offre d’abonnement conversationnel ne doit pas être confondue avec un accès API autorisant l’intégration dans MajestiOS.

### 5.2 Contrat d’une tâche future

Avant toute exécution par Cheexpeer, chaque tâche devra préciser au minimum :

- identifiant de tâche et objectif ;
- demandeur, bénéficiaire et collaborateur éventuellement affecté ;
- organisation et périmètre de données autorisé ;
- finalité, catégorie de données et sources permises ;
- opérations permises : lecture, analyse, préparation, proposition ou action ;
- niveau de validation requis et personne habilitée à l’accorder ;
- échéance, limites d’exécution et conditions d’arrêt ;
- preuves, résultats, incertitudes, erreurs et décision humaine.

Chaque exécution devra être retraçable : modèle/fournisseur et version, horodatage, outils utilisés, sources consultées, références de données, résultat, coût/latence lorsque disponibles, validations et actions effectivement réalisées.

### 5.3 Progression de délégation

| Niveau | Capacité | État |
|---|---|---|
| N0 | Documentation, inventaire et préparation | **État actuel** |
| N1 | Lecture seule, recherche contextualisée et synthèse sourcée | À concevoir et tester |
| N2 | Analyse, détection de signaux, rapports et alertes proposés | À concevoir et tester |
| N3 | Scoring explicable et recommandations de priorisation | À concevoir, évaluer et faire valider |
| N4 | Préparation de fiches, tâches, affectations et mises à jour | Après validation humaine |
| N5 | Actions limitées explicitement autorisées, réversibles et auditées | Décision ultérieure du fondateur |

Le scoring futur devra distinguer les faits vérifiés, les indices, les hypothèses et les données manquantes. Un score de pertinence ne sera jamais présenté comme une probabilité de gain ou une garantie de succès commercial.

### 5.4 Mémoire et recherche sémantique

Le socle doit d’abord privilégier les données structurées, les identifiants stables, les historiques et les liens de provenance. L’extension PostgreSQL `vector` n’est pas installée sur le projet contrôlé ; elle ne doit pas être activée simplement par anticipation. Une mémoire sémantique ne sera utile qu’après définition des données indexables, des droits d’accès, des règles d’effacement, de la séparation des tenants et des évaluations de pertinence.

## 6. Sécurité et supervision — points constatés

- Les quinze tables publiques observées ont RLS activé.
- La clé publishable est utilisée côté navigateur ; aucun secret `service_role` n’a été trouvé dans le fichier de configuration web.
- Les fonctions d’import utilisent une vérification de permission avant l’écriture privilégiée.
- Le projet possède `pg_cron` et un seul job actif observé : `majestios-crm-reminders`, toutes les cinq minutes.
- Aucun job de synchronisation de sources n’est présent dans `cron.job`.
- Aucun secret applicatif n’est enregistré dans Supabase Vault au moment du contrôle. Cela ne permet pas de conclure sur toutes les variables d’environnement gérées séparément par les Edge Functions.
- L’extension `pg_cron` et Vault sont installées ; `pg_net` et `vector` ne sont pas installées.
- Le conseiller de sécurité signale que la protection contre les mots de passe compromis est désactivée. C’est un point à traiter dans les paramètres Auth après validation.
- Le conseiller de performance signale vingt index non utilisés. Les tables concernées sont en grande partie vides ; ces alertes informatives ne justifient aucune suppression à ce stade.
- Le conseiller de santé ne retourne pas d’alerte.

## 7. Plan de préparation recommandé

### P0 — Réconcilier l’état réel et les sources de vérité

1. Confirmer que `majestios-crm` est bien le projet de référence actuel ; la configuration web le désigne déjà.
2. Actualiser la documentation d’état backend sans effacer l’historique du relevé du 6 novembre.
3. Retrouver et versionner les neuf migrations manquantes à partir de leurs sources exactes ; vérifier chaque migration contre le schéma actif.
4. Vérifier le déploiement manquant de `provision-client-workspace` et tester le parcours Auth uniquement dans un lot autorisé.
5. Vérifier les différences entre le code source des Edge Functions et les versions réellement déployées.

### P1 — Stabiliser le registre et les connecteurs

1. Définir une fiche de gouvernance par source : propriétaire, finalité, API/flux, authentification, conditions d’utilisation, quotas, champs, fraîcheur, rétention et statut de recette.
2. Définir un contrat de connecteur commun et des adaptateurs spécifiques ; ne pas fusionner les catégories métier BOAMP, BODACC, SIRENE ou RNE.
3. Déplacer progressivement les appels qui exigent secrets, historisation ou collecte récurrente vers des fonctions serveur.
4. Tester chaque source avec des cas réels, documenter les limites et les erreurs, et ne marquer `active` qu’après preuve.
5. Mettre en place la traçabilité des exécutions et des observations avant toute ingestion régulière.

### P2 — Sécuriser les circuits de données et l’Administration

1. Définir les statuts d’observation, de validation, de rejet et d’affectation.
2. Formaliser les rôles et permissions Administration / collaborateur / membre / client.
3. Ajouter les tests négatifs RLS et multi-tenant aux parcours de transfert.
4. Définir le registre d’exclusion et les règles de non-contact avant toute prospection assistée.
5. Tester la circulation aller-retour rubrique ↔ CRM en conservant l’origine.

### P3 — Préparer le futur environnement Cheexpeer

1. Définir l’interface indépendante du fournisseur IA.
2. Établir le contrat de tâche, les journaux et les évaluations.
3. Préparer un environnement de test avec données synthétiques ou minimisées.
4. Définir les seuils de confiance, les règles de citation des sources et les procédures d’escalade humaine.
5. N’activer aucune mission autonome avant une décision spécifique du fondateur.

## 8. Décisions et limites

Cet audit n’autorise pas :

- l’activation d’un modèle IA ou la création d’un agent Cheexpeer ;
- l’achat d’un abonnement ou la création d’une clé API fournisseur ;
- une migration ou une modification de schéma Supabase ;
- une modification de RLS, d’Auth, des rôles ou des secrets ;
- un déploiement d’Edge Function ou une modification de production ;
- une collecte massive, une synchronisation planifiée ou un import automatique ;
- une publication, un contact commercial ou une attribution automatique.

**Décision recommandée :** le prochain lot technique doit être le rétablissement de la parité entre les migrations Git et la base Supabase active, puis la vérification des Edge Functions réellement déployées. Ce travail est préalable à toute nouvelle couche de collecte ou d’intelligence.

---

## 9. Références contrôlées

- `supabase-config.js` — configuration publique du projet web.
- `supabase/migrations/` — douze migrations actuellement versionnées sur les branches comparées.
- `prospecting-resources.js` — catalogue et connecteurs complémentaires de Prospection.
- `prospecting-signals.js` — normalisation des signaux BODACC dédiés à la Prospection.
- `opportunity-search.js` — appels BOAMP et BODACC du moteur Marchés publics / privés.
- `crm-client.js` et `crm-page.js` — accès et opérations CRM.
- `schemas/opportunite.schema.json` — contrat normalisé des résultats et signaux.
- `docs/evolution-5.0/ETAT-BACKEND-SUPABASE.md` — relevé antérieur du 6 novembre, à conserver comme historique.
- `docs/evolution-5.0/ETAT-RESSOURCES-PROSPECTION-2026-11-07.md` — état des connecteurs complémentaires de Prospection.
- `docs/evolution-5.0/MATRICE-CIRCULATION-RUBRIQUES-CRM-2026-11-08.md` — doctrine et parcours de circulation vers le CRM.

**Règle de vérité :** un connecteur n’est « actif » qu’après une réponse réelle et exploitable, un contrôle des droits et une preuve de traçabilité. Une table, une fonction ou une documentation présente ne suffit pas à démontrer un flux métier opérationnel.
