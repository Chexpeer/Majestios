# Architecture d'exécution de Cheexpeer — du besoin au résultat

**Version :** 1.0 — 9 novembre 2026  
**Branche de travail :** `Evolution-7`  
**Nature :** conception d'exécution et état vérifié du dépôt  
**Statut :** spécification à implémenter ; ne vaut pas preuve de mise en service.

> Règle centrale : une capacité écrite dans un cahier des charges n'est pas une capacité opérationnelle. Chaque fonction possède un statut de spécification, un statut de réalisation, un statut de déploiement et un statut de recette indépendants.

## 1. Les quatre états à ne jamais confondre

| État | Signification | Preuve attendue |
|---|---|---|
| Spécifiée | Le besoin, les règles métier et le résultat attendu sont définis | Cahier des charges validé |
| Implémentée | Le code, le connecteur, l'interface ou le workflow existent | Fichiers et commit identifiables |
| Déployée / raccordée | Le composant est installé dans l'environnement et relié aux bons services | Configuration non secrète, version déployée, endpoint ou intégration observable |
| Recettée | Le parcours complet a été exécuté avec des résultats vérifiés | Tests, traces, preuves et limites documentées |

Un composant peut être implémenté sans être déployé. Un endpoint peut être déployé sans être correctement raccordé à l'interface. Un test unitaire réussi ne prouve pas que le parcours complet fonctionne.

## 2. Le modèle d'exécution cible

Cheexpeer doit fonctionner comme un orchestrateur de missions, pas comme une simple réponse générée dans une fenêtre de chat.

### 2.1 Chaîne d'exécution

1. **Entrée** — demande de l'administrateur, d'un membre, événement métier ou déclencheur planifié.
2. **Identification du contexte** — espace concerné, utilisateur, organisation, données accessibles, niveau d'autonomie.
3. **Interprétation** — objectif, livrable attendu, critères de réussite, échéance, contraintes.
4. **Planification** — étapes, dépendances, outils requis, coût/risque, validations nécessaires.
5. **Création d'une mission persistante** — identifiant, demande originale, paramètres, état initial.
6. **Exécution des étapes** — appels aux outils/connecteurs autorisés, traitement et collecte des résultats.
7. **Contrôle** — validation des formats, qualité des données, provenance, cohérence, complétude et erreurs.
8. **Décision** — poursuivre, demander une précision, demander une validation, réessayer de façon bornée ou déclarer un blocage.
9. **Livrable** — résultat exploitable, sources, fichiers, éléments non vérifiés et recommandations.
10. **Historisation** — journal d'exécution, résultat, coûts éventuels, preuves, décisions et liens vers les objets métier.

Aucune étape ne doit être déclarée terminée sur la seule base d'une réponse textuelle du modèle. Le résultat doit être confirmé par l'outil concerné.

### 2.2 Les composants techniques nécessaires

| Composant | Responsabilité concrète | État cible |
|---|---|---|
| Interface Cheexpeer | Recevoir une demande, afficher les missions, résultats, validations et pièces jointes | Centre de commande à construire |
| API d'orchestration | Créer une mission, contrôler le contexte, préparer le plan et lancer les étapes | À construire |
| Moteur de tâches | Exécuter les étapes, gérer états, reprises, délais, erreurs et idempotence | À construire |
| Registre des outils | Décrire les outils disponibles, leurs paramètres, droits, limites et retours | À construire |
| Adaptateur IA | Interpréter, planifier, analyser et produire des résultats structurés | Brique IA partielle sur Réputation virtuelle ; moteur général à construire |
| Connecteurs métier | CRM, recherches officielles, réputation, opportunités, SEO, documents | Plusieurs briques spécialisées existent ; raccordement transversal incomplet |
| Planificateur | Déclencher les missions récurrentes et gérer leur prochaine occurrence | À construire |
| Stockage des missions | Conserver demande, plan, état, étapes, pièces et résultats | Modèle durable transversal à construire |
| Journal d'exécution | Conserver les événements, appels outils, erreurs et validations | À construire de manière transversale |
| Centre de commande | Donner à l'administrateur visibilité et contrôle | Cockpit existant, fonctions Cheexpeer persistantes à construire |

## 3. Comment Cheexpeer exécute réellement une mission

Une mission doit être représentée par des données, pas seulement par une conversation.

### 3.1 Objet Mission

Champs fonctionnels minimaux :

- `mission_id` : identifiant unique ;
- `workspace_id` : espace de travail ;
- `created_by` : initiateur ;
- `mission_type` : CRM, veille, recherche, audit, SEO, développement, archivage, etc. ;
- `title` et `objective` ;
- `input_payload` : paramètres et références aux pièces ;
- `plan` : étapes ordonnées et dépendances ;
- `autonomy_level` : niveau A0 à A4 ;
- `status` : état global ;
- `scheduled_at`, `started_at`, `completed_at` ;
- `result_summary` et `result_refs` ;
- `error_code`, `blocked_reason` ;
- `created_at`, `updated_at`.

### 3.2 États d'une mission

`draft` → `queued` → `running` → `review_required` → `completed`

États alternatifs : `waiting_input`, `waiting_approval`, `blocked`, `failed`, `cancelled`.

Une mission échouée ne devient pas terminée parce qu'un message d'excuse a été affiché. Une mission bloquée indique précisément l'étape, la raison, les éléments déjà obtenus et l'action attendue.

### 3.3 Objet Étape

Chaque étape possède :

- identifiant et rang ;
- type d'action ;
- outil / connecteur sélectionné ;
- paramètres validés ;
- prérequis et dépendances ;
- statut ;
- début et fin ;
- nombre de tentatives ;
- référence à la sortie réelle de l'outil ;
- contrôles effectués ;
- erreur ou motif de blocage.

Une étape doit être rejouable sans créer de doublons lorsque cela est possible. Les actions non idempotentes doivent être protégées par une clé d'idempotence ou une confirmation adaptée.

### 3.4 Journal d'exécution

Chaque événement utile doit être horodaté :

- mission créée ou modifiée ;
- plan proposé et accepté ;
- outil appelé ;
- résultat reçu ;
- validation demandée, accordée ou refusée ;
- reprise, annulation ou échec ;
- livrable produit ;
- archivage réalisé.

Le journal doit permettre de répondre à : qui a demandé quoi, quel outil a été utilisé, sur quelles données, à quel moment, avec quel résultat et quelle validation.

## 4. Registre des outils : ce que Cheexpeer peut appeler

Cheexpeer ne doit pas inventer une capacité. Chaque outil raccordé est décrit dans un registre technique.

| Champ | Contenu |
|---|---|
| tool_id | Identifiant stable |
| domaine | CRM, web, GitHub, Drive, SEO, documents, etc. |
| description | Opération réellement exécutée |
| entrée | Schéma et paramètres obligatoires |
| sortie | Format et données retournées |
| contexte requis | Utilisateur, organisation, espace |
| niveau d'autonomie | A0 à A4 |
| effets | Lecture, écriture, envoi, suppression, publication, dépense |
| validation | Automatique, humaine ou interdite |
| limites | Quotas, taille, délai, couverture, conditions d'accès |
| timeout / retry | Durée maximale et stratégie de reprise |
| preuve | Identifiant de requête, lien, trace ou objet créé |

Le modèle IA choisit parmi les outils déclarés. Il ne peut ni créer arbitrairement un outil, ni s'octroyer des droits, ni contourner un refus du connecteur.

## 5. Raccordement des domaines métier

### 5.1 CRM MajestiOS

**Exécution attendue :**
1. recevoir une demande ou un signal ;
2. rechercher dans les objets CRM accessibles ;
3. récupérer les données et l'historique utiles ;
4. rapprocher les fiches candidates ;
5. présenter les correspondances et incertitudes ;
6. préparer la modification ;
7. demander une validation lorsque l'opération le nécessite ;
8. appeler l'API ou le service CRM ;
9. relire l'objet pour confirmer l'écriture ;
10. conserver la trace et lier le résultat à la mission.

**À construire :** un adaptateur CRM Cheexpeer documenté, avec opérations explicites de recherche, lecture, création, mise à jour, activité et relance. Le raccordement doit réutiliser les services et règles métier existants plutôt que réimplémenter la logique dans le prompt IA.

### 5.2 Recherche d'entreprises et prospection

**Briques constatées dans le dépôt :**
- `supabase/functions/prospection-search-member/index.ts` ;
- modules `supabase/functions/_shared/prospection-*.mjs` ;
- interrogation de l'API officielle de recherche d'entreprises et de l'API géographique ;
- authentification et contrôle de l'appartenance cliente dans le code.

**Exécution cible :** Cheexpeer construit des critères, appelle la fonction de recherche, récupère les résultats normalisés, les qualifie, recherche les doublons CRM, prépare un lot de pistes et soumet les actions CRM à la validation adaptée.

**État :** code présent dans Git ; documentation du dépôt indiquant que la fonction est non déployée. Elle ne doit pas être annoncée comme un service opérationnel.

### 5.3 Réputation virtuelle

**Briques constatées :**
- `reputation-audit-context/index.ts` ;
- `reputation-audit-handler.mjs` ;
- connecteurs d'identité officielle et BODACC ;
- normalisation des preuves ;
- analyse structurée par adaptateur IA compatible Chat Completions / JSON Schema.

**Exécution actuelle dans le code :** authentifier l'utilisateur, vérifier son organisation et son quota, collecter les éléments officiels, normaliser les preuves, puis appeler l'analyse IA si les variables de fournisseur et de modèle sont présentes.

**Limites constatées :** cette collecte ne constitue pas à elle seule un audit complet de réputation en ligne ; le stockage durable du dossier et le raccordement général au moteur de missions ne sont pas établis. La documentation du dépôt indique que l'Edge Function n'est pas déployée.

### 5.4 GitHub / développement

**Exécution cible :**
1. identifier dépôt, branche et périmètre autorisés ;
2. lire les fichiers et comprendre leurs dépendances ;
3. établir un diagnostic avec preuves ;
4. préparer un plan de correction ;
5. modifier uniquement la branche autorisée ;
6. exécuter les tests réellement disponibles ;
7. lire les statuts CI et examiner les échecs ;
8. produire un rapport de changements ;
9. demander autorisation avant merge ou déploiement.

**État :** des opérations GitHub sont utilisables dans l'environnement de travail actuel. Aucun connecteur GitHub embarqué dans le runtime Cheexpeer de MajestiOS n'a été identifié dans le périmètre examiné. Il ne faut pas confondre notre accès GitHub pendant le développement avec une intégration produit déjà livrée.

### 5.5 Google Workspace / Drive

**Exécution cible :**
- connecter un compte Workspace autorisé par OAuth ;
- limiter les autorisations aux espaces et fichiers nécessaires ;
- rechercher et lire les documents autorisés ;
- déposer un livrable dans le dossier prévu ;
- conserver l'identifiant du fichier, son chemin logique, sa version et son lien ;
- réconcilier les mises à jour et éviter les doublons ;
- respecter les règles de partage et de conservation.

**État :** objectif fonctionnel confirmé ; connecteur Drive opérationnel non identifié dans le dépôt audité. L'accès doit être explicitement autorisé et ne peut être déduit de la seule présence d'un compte Google.

### 5.6 Web, collecte et scraping

**Exécution cible :**
- choisir entre API, flux, export, connecteur navigateur ou extraction autorisée ;
- enregistrer source, URL, date et conditions de collecte ;
- contrôler fraîcheur, complétude, doublons et erreurs ;
- appliquer limites de débit et règles d'accès ;
- transformer les résultats en objets structurés ;
- conserver la preuve et les limites de couverture.

Instant Data Scraper peut être évalué comme outil opérateur ou source d'inspiration d'un connecteur, mais sa présence dans le navigateur de l'administrateur ne signifie pas que Cheexpeer peut l'orchestrer automatiquement. Il faut un connecteur réel, une interface d'exécution et des autorisations compatibles. Aucun contournement de CAPTCHA, authentification, paywall ou protection n'est admis.

### 5.7 Veille SEO

**Exécution cible :**
1. déclenchement planifié ;
2. collecte des pages et indicateurs depuis les sources autorisées ;
3. comparaison avec la période précédente ;
4. détection des baisses, erreurs, pages manquantes et opportunités ;
5. classement par impact et effort ;
6. préparation des corrections ;
7. application automatique uniquement dans un périmètre préautorisé, sinon demande de validation ;
8. contrôle après modification ;
9. rapport avant/après archivé.

**État :** mission spécifiée ; moteur de planification et connecteurs SEO transversaux non démontrés comme opérationnels.

## 6. Planification et exécution en arrière-plan

Une mission récurrente ne peut pas dépendre du fait que l'administrateur garde une page ouverte.

Architecture cible :
- un planificateur persistant déclenche la mission à l'heure prévue ;
- un worker prend une tâche en attente ;
- une réservation/lease évite que plusieurs workers exécutent la même tâche ;
- le worker renouvelle sa réservation pendant les opérations longues ;
- les tentatives et délais sont bornés ;
- les erreurs temporaires sont distinguées des erreurs définitives ;
- une file d'échec conserve les tâches nécessitant une intervention ;
- le résultat est enregistré avant notification.

Une première implémentation peut utiliser les capacités planifiées et asynchrones de l'environnement retenu (par exemple Supabase Cron/Queues ou une solution équivalente), après vérification des services réellement disponibles. Le choix final doit être comparé sur fiabilité, coûts, observabilité, facilité de reprise et dépendance fournisseur.

## 7. Niveaux d'autonomie appliqués à l'exécution

| Niveau | Comportement | Exemple |
|---|---|---|
| A0 | Observer et expliquer | Lire un dossier, signaler une anomalie |
| A1 | Analyser et proposer | Préparer une fiche ou une correction |
| A2 | Exécuter après validation | Écrire une fiche CRM ou déposer un document |
| A3 | Exécuter seul dans un périmètre prédéfini | Veille périodique, collecte autorisée, rapport |
| A4 | Orchestrer une chaîne d'actions préautorisées | Collecter, qualifier, dédupliquer, préparer et archiver |

Un niveau d'autonomie s'applique à une mission et à ses outils. Il ne donne pas un droit global à l'agent. Les envois à des tiers, campagnes de prospection, suppressions importantes, publications, changements de droits, dépenses et déploiements restent soumis à des règles spécifiques et à une validation lorsque requise.

## 8. Contrat de réussite d'une mission

Une mission ne peut être marquée `completed` que si :
- toutes les étapes obligatoires sont terminées ;
- les sorties attendues existent réellement ;
- les contrôles prévus ont été exécutés ;
- les écritures éventuelles ont été relues ou confirmées ;
- les limites et éléments non vérifiés sont affichés ;
- les preuves et livrables sont rattachés à la mission.

Si la mission produit un résultat partiel, son état doit le refléter (`blocked`, `failed` ou état partiel défini explicitement), sans masquer les étapes réussies.

## 9. État réel constaté au 9 novembre 2026

| Domaine | Code / brique constatée | Exécution réellement démontrée dans le dépôt | Prochaine pièce manquante |
|---|---|---|---|
| Réputation virtuelle | Edge Function, collecteurs, normalisation, analyse IA optionnelle | Pipeline spécialisé dans le code ; fonction indiquée non déployée | Déploiement contrôlé, configuration fournisseur, stockage dossier, recette bout en bout |
| Prospection officielle | Edge Function de recherche, filtres, géocodage, normalisation | Code présent ; fonction indiquée non déployée | Déploiement contrôlé et recette authentifiée |
| CRM | Interfaces et services CRM | Pas d'orchestrateur Cheexpeer CRM identifié | Adaptateur d'outils CRM et tests d'écriture/lecture |
| Chat général | Assistant local par règles/mots-clés dans `app.js` | Réponses locales et navigation ; pas moteur IA général | API d'orchestration et registre d'outils |
| GitHub | Accès de développement par intégration GitHub | Utilisable dans le cadre des interventions de développement | Connecteur runtime produit, droits et journalisation |
| Google Drive | Besoin défini | Pas de connecteur démontré | OAuth, connecteur, archivage et recette |
| Missions persistantes | Spécification détaillée | Pas de moteur général identifié | Modèle mission/étape, worker, journal |
| Automatisations récurrentes | Mission SEO et veille spécifiées | Planificateur transversal non démontré | Scheduler, queue, worker, reprise |
| Centre de commande | Cockpit VIP existant | Pas de console de missions Cheexpeer complète identifiée | UI, API, conversation persistante, validations, pièces jointes |
| Archives | Besoin défini | Pas de stockage transversal de missions et preuves identifié | Stockage structuré et connecteurs d'archives |

Ce tableau décrit le périmètre examiné, pas une certification exhaustive de tout le dépôt ni de l'environnement distant.

## 10. Ordre de réalisation recommandé

### Lot EXE-01 — Contrat d'exécution et données
- définir schémas Mission, Étape, Événement, Validation, Livrable ;
- définir les états, transitions et règles d'idempotence ;
- définir le registre des outils ;
- ajouter tests de contrats et transitions.

### Lot EXE-02 — Moteur de mission minimal
- API de création et lecture ;
- worker d'exécution ;
- journal d'événements ;
- gestion des échecs et reprises ;
- première mission simple sans effet externe : analyse d'un document fourni.

### Lot EXE-03 — Centre de commande
- liste et détail des missions ;
- conversation rattachée à une mission ;
- dépôt de captures et documents ;
- affichage étapes, états, erreurs, validations et livrables ;
- reprise d'une mission existante.

### Lot EXE-04 — Premier connecteur métier complet
- sélectionner une fonction existante à valeur claire ;
- l'exposer au registre d'outils ;
- l'appeler depuis une mission ;
- enregistrer les preuves ;
- vérifier le résultat bout en bout.

La recherche officielle d'entreprises ou le contexte Réputation virtuelle sont les candidats les plus proches d'un premier raccordement, sous réserve de leur recette et de leur disponibilité réelle.

### Lot EXE-05 — CRM
- adapter les opérations CRM existantes ;
- recherche et lecture d'abord ;
- préparation d'écritures ensuite ;
- validation et relecture systématiques des premières écritures ;
- suivi des relances.

### Lot EXE-06 — Planification, Drive et veille
- planificateur et exécutions récurrentes ;
- connecteur Google Workspace ;
- archivage et recherche documentaire ;
- veille SEO et rapports périodiques.

## 11. Règles de mise à jour documentaire

Pour chaque capacité, tenir une fiche de suivi avec :
- besoin et résultat attendu ;
- composants nécessaires ;
- fichiers et fonctions réels ;
- statut spécifié / implémenté / raccordé / déployé / recetté ;
- preuve de chaque statut ;
- limites et dépendances ;
- anomalie liée ;
- prochain travail concret.

La documentation ne doit jamais faire passer une cible pour une fonction livrée. Le registre des anomalies conserve les erreurs et risques jusqu'à résolution vérifiée, mais ne transforme pas chaque fonction non encore construite en incident de sécurité.

## 12. Décision d'architecture

La priorité n'est pas de développer immédiatement douze connecteurs séparés ni de créer un agent différent pour chaque domaine. La priorité est de construire un **socle d'exécution commun** : mission persistante, étapes, registre d'outils, worker, validation, journal et livrables. Les connecteurs métier viennent ensuite se brancher sur ce socle.

C'est ce socle qui transformera Cheexpeer d'une vision fonctionnelle et de quelques fonctions spécialisées en un véritable agent technico-commercial capable d'exécuter, de vérifier et de rendre compte.


## 13. Premier audit du système nerveux Supabase — 9 novembre 2026

### 13.1 Environnements distants observés en lecture seule

| Projet | État vérifié | Inventaire constaté |
|---|---|---|
| `majestios-crm` (`qxaghcifdhugfskuscoc`, Paris) | Actif, PostgreSQL 17.11 | 15 tables publiques ; RLS activé sur les 15 ; schéma `private` non accessible à `anon` ; 3 Edge Functions actives ; 1 tâche Cron CRM toutes les 5 minutes |
| `MajestiOS-Test` (`qrlnnfjstoeliymxtkbk`, Francfort) | Actif, PostgreSQL 17.11 | Aucune table publique métier, aucune migration enregistrée par l'outil, aucune Edge Function ; seule extension pertinente observée : `pgcrypto` |

Sur `majestios-crm`, les migrations distantes observées s'arrêtent à `20261108181246_vip_only_crm_access`. Les migrations Evolution-7 ultérieures du 9 novembre — notamment restrictions de colonnes, historique atomique, permissions d'import, restauration tenant-scoped et triggers d'intégrité — ne sont donc pas confirmées comme appliquées à cette base. Le dépôt Git ne doit jamais être pris pour un état de déploiement.

### 13.2 Briques Supabase disponibles ou absentes

| Brique | État observé sur `majestios-crm` | Rôle envisagé pour Cheexpeer |
|---|---|---|
| PostgreSQL | Présent | Source de vérité : missions, étapes, états, dépendances, décisions, journaux et quotas |
| `pg_cron` | Installé ; 1 job CRM existant | Déclenchement des échéances, récurrences et reprises |
| `pgmq` / Queues | Non installé / aucune file observée | Transport durable des travaux vers les consommateurs |
| `pg_net` | Non installé | Appels HTTP asynchrones éventuels depuis PostgreSQL ; à évaluer, pas à activer par défaut |
| Vault | Non installé / non observé | Secrets des connecteurs et appels planifiés, sans valeurs dans le dépôt |
| `vector` | Non installé | Recherche sémantique documentaire éventuelle, après définition des besoins et du fournisseur d'embeddings |
| Storage | Aucun bucket métier observé | Pièces jointes, captures, rapports et archives privées après définition des politiques d'accès |
| Edge Functions | 3 actives | Endpoints et tâches courtes spécialisées ; pas un moteur de missions persistant à elles seules |
| Auth + RLS | Présents ; RLS sur les 15 tables publiques observées | Identité, rattachement organisationnel et contrôle des données |
| Realtime | Capacité non encore vérifiée dans cet audit | Notifications et actualisation du centre de commande, à valider |

Les contrôles Supabase ont également signalé la protection des mots de passe compromis désactivée sur `majestios-crm`. Vérifier le mode d'authentification effectivement proposé ; si des mots de passe sont acceptés, activer cette protection avant une ouverture plus large. L'audit performance a signalé 20 index inutilisés à ce stade : ne pas les supprimer sans mesure d'usage représentative.

### 13.3 Architecture cible recommandée

1. **Tables métier durables dans PostgreSQL** : `agent_missions`, `agent_mission_steps`, `agent_mission_events`, `agent_approvals`, `agent_tool_registry`, `agent_artifacts` et `agent_schedules` (noms indicatifs à confirmer avant migration).
2. **Ordonnanceur métier** : sélectionne les missions dues selon priorité, `run_at`, échéance, dépendances, budget, quotas et règles anti-famine. Il ne délègue pas ces décisions à l'ordre FIFO d'une file.
3. **Queues pgmq** : distribuent les identifiants de missions/étapes prêtes ; messages minimaux, sans secrets ni documents confidentiels en clair. La base métier reste la source de vérité.
4. **Worker / consommateurs** : prennent un travail avec bail/visibilité, vérifient l'état et l'idempotence, appellent un outil autorisé, enregistrent la sortie, puis acquittent ou planifient une reprise bornée. Les tâches longues ou durables pourront nécessiter un worker externe persistant ; ne pas faire dépendre une mission longue d'une invocation Edge Function unique.
5. **Cron** : réveille l'ordonnanceur et les reprises à intervalles maîtrisés ; conserver un nombre limité de jobs, avec suivi de durée et d'échec.
6. **Edge Functions** : API d'entrée, connecteurs et opérations courtes, avec authentification, validation des paramètres et contrôle des droits à chaque appel.
7. **Realtime** : diffuse les changements d'état autorisés vers le cockpit, sans remplacer le journal durable.
8. **Storage privé** : conserve les fichiers ; la base conserve leurs métadonnées, leur propriétaire, leur organisation, leur classification et leurs références. Les accès sont contrôlés par politiques dédiées.
9. **Vault** : conserve les secrets serveur nécessaires aux appels externes ; aucun secret dans le navigateur, les messages de queue ou Git.
10. **Registre des outils** : associe chaque outil à un schéma d'entrée/sortie, un contexte, un niveau d'autonomie, un coût, un délai, des effets et une règle de validation.

### 13.4 Règles de conception non négociables

- Séparer les missions immédiates des missions planifiées sans sacrifier les urgences légitimes.
- Ne jamais utiliser la queue comme seul historique ou registre d'état.
- Prévoir clés d'idempotence, baux d'exécution, tentatives bornées, backoff, file d'échec et reprise contrôlée.
- Cloisonner les missions, fichiers et journaux par espace et organisation ; le cockpit privé administrateur reste strictement séparé.
- Le worker ne reçoit que les permissions nécessaires à l'étape ; aucun accès global implicite lié au statut d'agent IA.
- Toute action externe sensible (message, campagne, publication, dépense, suppression, changement de droits) applique le niveau de validation requis.
- Mesurer coût, durée, volume, erreurs et appels fournisseurs par mission.
- Commencer par une mission de test sans effet externe, puis un connecteur en lecture seule, avant toute écriture métier.

### 13.5 Suite de l'audit

- Réconcilier précisément les migrations Git et les migrations distantes, puis examiner les fonctions SQL, RLS et droits effectifs avant toute application.
- Vérifier les paramètres Auth, les flux OTP, Realtime, les politiques Storage et la configuration des secrets sans afficher de valeurs sensibles.
- Comparer les trois Edge Functions déployées à leurs sources Git et vérifier leurs contrats d'autorisation.
- Préparer l'environnement `MajestiOS-Test` comme cible de recette uniquement après synchronisation contrôlée des migrations et des fonctions.
- Concevoir le socle de mission dans Git et le tester d'abord hors production. Aucun changement distant, aucune migration, activation d'extension, création de bucket ou déploiement n'a été effectué pendant cet inventaire.

