# MajestiOS 3.0 — Étape C : contrats API, échanges et événements

**Version :** 0.1  
**Date :** 3 novembre 2026  
**Branche :** evolution-3.0  
**Statut :** proposition de conception soumise à validation  
**Dépendances :** étapes A et B — architecture fonctionnelle, modèle conceptuel et cloisonnement  
**Nature :** contrats logiques et règles d'intégration ; aucun endpoint ni événement n'est implémenté.

## 1. Objectif et limites

Cette étape définit comment les composants MajestiOS doivent communiquer sans contourner les frontières fonctionnelles et les règles de données établies aux étapes A et B.

Elle précise :
- les principes communs des API ;
- les familles d'endpoints et leurs responsabilités ;
- les contrats de requête et de réponse ;
- l'authentification et l'autorisation à chaque frontière ;
- les règles de transmission intermodules ;
- les événements métier, leur enveloppe et leur cycle de vie ;
- les garanties de livraison, d'idempotence, de reprise et de traçabilité ;
- les scénarios de tests contractuels et de sécurité.

Cette étape ne choisit pas de framework, de fournisseur, de broker, de base ou de protocole d'authentification. REST/JSON est proposé comme interface externe initiale, avec événements internes découplés. Le choix final reste à valider.

**Important :** les étapes A et B sont des propositions documentaires dont les arbitrages doivent être confirmés. Le présent document les utilise comme hypothèses de travail ; il ne vaut pas validation implicite des étapes précédentes.

## 2. Principes contractuels non négociables

1. Le navigateur appelle l'API MajestiOS ; il n'appelle pas directement les sources externes avec des secrets.
2. L'API valide les entrées, l'identité, l'appartenance, les permissions, la finalité et les restrictions applicables.
3. L'autorisation est évaluée côté serveur pour chaque ressource et chaque action ; cacher un bouton dans l'interface n'est pas un contrôle d'accès.
4. Aucun identifiant de tenant transmis par le client ne prouve l'appartenance à ce tenant.
5. Les modules échangent des contrats versionnés, pas des accès directs aux tables ou aux objets internes d'un autre module.
6. Les commandes expriment une intention ; les événements relatent un fait métier effectivement validé.
7. Un événement technique ne constitue jamais une autorisation métier ou juridique.
8. Toute transmission de données est minimisée, justifiée, autorisée, traçable et révocable lorsque pertinent.
9. Les appels et traitements doivent être idempotents ou protégés contre les répétitions.
10. Une erreur, une permission manquante ou une finalité non démontrée conduit au refus ou à la mise en attente, jamais à une autorisation implicite.

## 3. Vue des interactions

~~~mermaid
flowchart LR
    UI[Frontend] --> API[API MajestiOS v1]
    API --> IAM[Identité et autorisations]
    API --> DOM[Services métier par domaine]
    DOM --> DB[(Persistance)]
    DOM --> OUTBOX[Outbox transactionnelle]
    OUTBOX --> DISPATCH[Dispatcher d'événements]
    DISPATCH --> HANDLERS[Consommateurs autorisés]
    HANDLERS --> DOM
    DOM --> AUDIT[Audit]
    API --> ADAPTERS[Adaptateurs de sources]
    ADAPTERS --> EXTERNAL[Sources externes]
~~~

L'outbox et le dispatcher sont des responsabilités logiques. Ils ne préjugent pas d'un service de file externe. Dans un premier déploiement monolithique, ils peuvent être implémentés dans le même processus et la même base transactionnelle, si les garanties décrites sont respectées.

## 4. Conventions générales de l'API

### 4.1 Racine et versionnement

Proposition de racine : `/api/v1`.

- Les changements compatibles peuvent ajouter des champs facultatifs, endpoints ou valeurs documentées sans casser les consommateurs.
- Un changement incompatible de structure, de sémantique ou de sécurité nécessite une nouvelle version majeure de contrat.
- Une version obsolète est annoncée, possède une période de transition et une date de retrait documentée.
- Les versions de contrat sont distinctes des versions de code et des versions des événements.
- Les contrats sont décrits dans une spécification OpenAPI versionnée, relue et testée en intégration continue.

Le versionnement dans le chemin est une proposition simple pour les API publiques/consommées par le frontend. Les événements portent leur propre `schema_version`.

### 4.2 Formats et conventions

- JSON UTF-8 pour les échanges structurés.
- Dates/horodatages au format ISO 8601 avec fuseau explicite ; stockage de référence en UTC.
- Identifiants internes opaques, non séquentiels, proposés en UUID.
- Montants représentés avec devise explicite et précision décimale, jamais en flottant binaire.
- Codes de statut et de motif stables, documentés ; ne pas utiliser le texte d'affichage comme valeur métier.
- Champs inconnus : rejet pour les commandes sensibles lorsque cela évite une ambiguïté ; politique explicite pour les autres contrats.
- Taille maximale des corps, fichiers et listes fixée par endpoint.
- Les données confidentielles ne sont jamais retournées « par commodité » si elles ne sont pas nécessaires à l'usage demandé.

### 4.3 Enveloppe de réponse proposée

Réponse réussie :

~~~json
{
  "data": {
    "id": "opaque-id",
    "status": "qualified"
  },
  "meta": {
    "request_id": "request-id",
    "contract_version": "v1"
  }
}
~~~

Réponse de collection :

~~~json
{
  "data": [],
  "meta": {
    "request_id": "request-id",
    "next_cursor": null,
    "has_more": false
  }
}
~~~

Les réponses de collection utilisent une pagination par curseur pour les flux volumineux ou évolutifs. Le serveur impose une limite maximale ; le client ne peut pas demander une page illimitée.

Erreur normalisée :

~~~json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Operation not permitted.",
    "details": [],
    "retryable": false
  },
  "meta": {
    "request_id": "request-id"
  }
}
~~~

Le message destiné à l'utilisateur ne révèle ni existence d'une ressource interdite, ni règle interne sensible. Les détails techniques sont conservés côté serveur et reliés au `request_id`.

### 4.4 Codes HTTP et erreurs métier

| Code HTTP | Usage |
|---|---|
| 200 | Lecture ou commande traitée avec réponse |
| 201 | Ressource créée |
| 202 | Traitement accepté, résultat asynchrone à suivre |
| 204 | Action réussie sans corps de réponse |
| 400 | Format ou paramètres invalides |
| 401 | Authentification absente ou invalide |
| 403 | Action interdite |
| 404 | Ressource inexistante ou volontairement masquée pour éviter sa divulgation |
| 409 | Conflit d'état, doublon métier ou version concurrente |
| 413 | Corps ou fichier trop volumineux |
| 422 | Données valides syntaxiquement mais incompatibles avec les règles métier |
| 429 | Limite de débit atteinte |
| 500 | Erreur interne non exposée en détail |
| 502/503/504 | Dépendance indisponible, service temporairement indisponible ou délai dépassé |

Un refus métier explicite doit comporter un code stable, par exemple `PURPOSE_NOT_ALLOWED`, `OBJECTION_ACTIVE`, `TENANT_SCOPE_MISMATCH` ou `MODERATION_REQUIRED`, sans divulguer d'information confidentielle.

## 5. Authentification, autorisation et contexte d'exécution

### 5.1 Authentification

L'API accepte uniquement les identités émises ou vérifiées par le mécanisme d'identité retenu. Les jetons sont validés côté serveur : signature, émetteur, audience, expiration, état du compte et révocation selon la politique retenue.

Les cookies de session, si utilisés, doivent être configurés avec les protections adaptées (Secure, HttpOnly, SameSite), et les opérations sensibles doivent intégrer une protection contre les requêtes intersites. Les jetons et secrets ne sont jamais placés dans les URL ou journaux.

### 5.2 Autorisation

L'autorisation combine au minimum :
- identité et état du compte ;
- type de principal (interne, client, service) ;
- rôle et permissions ;
- appartenance active au tenant, si applicable ;
- périmètre de la ressource ;
- finalité et statut de la donnée ;
- restrictions, oppositions et décisions de partage ;
- contexte de l'action et éventuelle approbation requise.

La règle est « deny by default ». Les privilèges sont minimaux et spécifiques. Une permission de lecture n'implique pas la permission d'exporter, partager, modérer ou déclencher une action commerciale.

### 5.3 Contexte tenant

Le serveur déduit le périmètre autorisé à partir de l'identité et des appartenances vérifiées. Un `tenant_id` fourni dans une route ou un corps de requête sert au mieux à exprimer le contexte souhaité ; il est systématiquement comparé aux droits vérifiés.

Le contexte d'autorisation est propagé aux tâches asynchrones sous forme d'identité de service limitée, avec acteur initiateur, finalité, tenant éventuel et corrélation. Ne jamais transmettre un jeton utilisateur brut à un worker.

### 5.4 Comptes de service

Chaque compte de service possède :
- une identité distincte ;
- une liste d'actions et de ressources permises ;
- une portée tenant ou organisation clairement définie ;
- une durée de validité et un mécanisme de révocation ;
- un responsable et un motif ;
- une journalisation des appels.

Aucun compte de service générique « super-admin » ne doit être utilisé par commodité.

## 6. Catalogue initial des API par domaine

Les routes ci-dessous sont des exemples de contrats à détailler. Elles ne sont ni créées ni disponibles actuellement.

| Domaine | Méthode et route proposées | Usage | Contrôle spécifique |
|---|---|---|---|
| Recherche | `POST /api/v1/searches` | Lancer une recherche typée et filtrée | Type, catégorie et département autorisés ; validation des filtres |
| Recherche | `GET /api/v1/searches/{id}` | Lire l'état/résultat d'une recherche | Propriétaire, périmètre et durée de disponibilité |
| Opportunités | `GET /api/v1/opportunities` | Consulter une projection de résultats autorisés | Champs publics ou autorisés, pagination |
| Sources | `GET /api/v1/sources/status` | État opérationnel des connecteurs | Pas de secret ni de détails d'infrastructure |
| Publication | `POST /api/v1/announcements` | Déposer une annonce | Auteur, type, validation, limitation et anti-abus |
| Publication | `GET /api/v1/announcements/{id}` | Consulter une annonce selon son état | Auteur, public ou modérateur selon permission |
| Publication | `POST /api/v1/announcements/{id}/submit` | Soumettre pour modération | Auteur autorisé, état valide |
| Modération | `POST /api/v1/moderation/{id}/decisions` | Accepter, refuser ou demander correction | Permission de modération distincte, motif obligatoire |
| CRM interne | `GET /api/v1/internal/crm/companies` | Rechercher les entreprises internes | Principal interne et permission CRM |
| CRM interne | `POST /api/v1/internal/crm/companies` | Créer une fiche interne | Permission d'écriture, provenance et dédoublonnage |
| CRM interne | `GET /api/v1/internal/crm/companies/{id}` | Lire une fiche CRM | Permission par ressource |
| Veille | `GET /api/v1/internal/watch/signals` | Consulter les signaux | Rôle interne Veille |
| Veille | `POST /api/v1/internal/watch/matches/{id}/review` | Valider/rejeter un rapprochement | Revue autorisée, motif et version attendue |
| Prospection | `POST /api/v1/internal/prospecting/actions` | Préparer une action | Finalité, éligibilité, opposition et validation |
| Prospection | `POST /api/v1/internal/prospecting/actions/{id}/execute` | Exécuter une action autorisée | Recontrôle juste avant exécution |
| Espaces clients | `GET /api/v1/client/workspaces` | Lister les espaces du tenant courant | Membership actif et rôle |
| Espaces clients | `POST /api/v1/client/workspaces` | Créer un espace de travail | Permission tenant, quota et propriétaire |
| Espaces clients | `POST /api/v1/client/shares/{id}/accept` | Accepter un élément explicitement partagé | Tenant destinataire, statut et validité du partage |
| Recherche documentaire | `POST /api/v1/knowledge/searches` | Rechercher dans les corpus autorisés | Droits documentaires appliqués avant restitution |
| Recherche documentaire | `POST /api/v1/knowledge/documents` | Ajouter un document à un corpus | Droit d'usage, corpus, analyse de fichier |
| Gouvernance | `POST /api/v1/internal/transfers/{id}/approve` | Approuver une transmission | Autorité de validation, finalité, champs, destinataire |
| Audit | `GET /api/v1/internal/audit-events` | Consulter les traces autorisées | Permission d'audit et périmètre restreint |

Les routes internes ne doivent pas être exposées à un rôle client par simple absence de lien dans l'interface. Elles sont protégées par des contrôles serveur explicites.

### 6.1 Commandes et lectures

Les requêtes de lecture ne modifient pas l'état métier. Les commandes modifient un état ou demandent une opération. Les commandes sensibles sont conçues comme des transitions d'état explicites plutôt que comme des mises à jour génériques de champs.

Exemple de commande de revue d'un rapprochement :

~~~json
{
  "decision": "approve",
  "reason_code": "MATCH_CONFIRMED",
  "expected_version": 4
}
~~~

Le serveur vérifie la version attendue, les droits du réviseur, les éléments de preuve et le statut actuel. Un conflit de version retourne `409`, sans écraser la décision concurrente.

## 7. Contrat de transmission intermodules

Toute transmission entre domaines utilise une commande de transfert ou un mécanisme interne équivalent. Il ne suffit pas d'émettre un événement générique contenant des données.

### 7.1 Enveloppe de décision de transfert

~~~json
{
  "transfer_id": "opaque-id",
  "source": {
    "domain": "watch",
    "resource_type": "signal",
    "resource_id": "opaque-source-id",
    "provenance_ref": "source-record-id"
  },
  "destination": {
    "domain": "internal_crm",
    "resource_type": "company_candidate"
  },
  "purpose": {
    "code": "validated_internal_business_development",
    "version": 1
  },
  "fields": ["company_reference", "signal_reference", "qualification_summary"],
  "decision": "pending_review",
  "reason_code": "HUMAN_REVIEW_REQUIRED",
  "requested_by": "principal-id",
  "requested_at": "2026-11-03T14:00:00Z",
  "expires_at": null,
  "correlation_id": "correlation-id"
}
~~~

Valeurs de décision proposées : `pending_review`, `approved`, `rejected`, `executed`, `revoked`, `expired`, `failed`.

### 7.2 Cycle de vie

1. L'émetteur demande un transfert en précisant source, destination, finalité et champs.
2. Le serveur contrôle la provenance, les droits d'usage, la minimisation et les restrictions.
3. Si une validation humaine est requise, le transfert reste en attente.
4. L'autorité compétente approuve ou rejette avec un motif.
5. Au moment de l'exécution, les contrôles sont rejoués : une approbation antérieure n'est pas un passe-droit permanent.
6. Le destinataire reçoit uniquement la projection autorisée.
7. Le résultat, les champs effectivement transmis et la référence à la décision sont historisés.
8. Une révocation bloque les transmissions futures et déclenche, si nécessaire, une procédure de traitement des copies déjà transmises.

Un transfert refusé, expiré ou échoué ne doit pas être rejoué comme s'il était approuvé.

## 8. Contrat d'événement métier

### 8.1 Commande versus événement

- Une **commande** demande à un domaine d'effectuer une opération et peut être refusée.
- Un **événement** annonce qu'un fait métier a été validé et qu'il s'est produit.
- Une **notification** est un message de présentation ou d'alerte ; elle ne remplace pas l'événement de référence.

Exemple : `CompanyMatchReviewRequested` est une commande ; `CompanyMatchApproved` est un événement seulement après validation effective.

### 8.2 Enveloppe commune proposée

~~~json
{
  "event_id": "uuid",
  "event_type": "watch.company_match.approved",
  "schema_version": 1,
  "occurred_at": "2026-11-03T14:00:00Z",
  "recorded_at": "2026-11-03T14:00:01Z",
  "producer": "watch",
  "aggregate": {
    "type": "company_match",
    "id": "opaque-id",
    "version": 5
  },
  "actor": {
    "type": "user",
    "id": "principal-id"
  },
  "scope": {
    "kind": "internal",
    "tenant_id": null
  },
  "purpose": {
    "code": "validated_internal_business_development",
    "version": 1
  },
  "correlation_id": "correlation-id",
  "causation_id": "command-or-event-id",
  "data": {
    "decision": "approved",
    "reason_code": "MATCH_CONFIRMED"
  }
}
~~~

L'enveloppe est un contrat logique. Les données personnelles et contenus métier ne sont pas inclus par défaut. Les événements transportent des identifiants et des références minimales ; le consommateur autorisé récupère ensuite la projection nécessaire via le contrat du domaine propriétaire.

### 8.3 Métadonnées obligatoires

| Champ | Règle |
|---|---|
| `event_id` | Identifiant unique et stable lors des nouvelles tentatives |
| `event_type` | Nom métier stable, qualifié par domaine |
| `schema_version` | Version du schéma de l'événement |
| `occurred_at` | Date du fait métier |
| `recorded_at` | Date d'enregistrement technique |
| `producer` | Domaine producteur |
| `aggregate` | Type, identifiant et version de l'objet métier concerné |
| `actor` | Utilisateur ou compte de service initiateur |
| `scope` | Périmètre interne, tenant ou corpus autorisé |
| `purpose` | Finalité applicable lorsque l'événement porte un traitement de données |
| `correlation_id` | Relie les opérations d'un même parcours |
| `causation_id` | Identifie la commande ou l'événement déclencheur |
| `data` | Charge utile minimale, sans secret ni donnée non nécessaire |

### 8.4 Catalogue initial des événements

| Événement | Producteur | Signification | Consommateurs possibles, sous contrôle |
|---|---|---|---|
| `source.record.collected` | Collecte | Un enregistrement source a été collecté et tracé | Qualification |
| `intake.record.normalized` | Réception | Un enregistrement est normalisé | Qualification, dédoublonnage |
| `intake.record.qualified` | Qualification | Une décision de qualification a été prise | Veille, Publication ou CRM selon décision dédiée |
| `announcement.submitted` | Publication | Une annonce a été soumise | Modération |
| `announcement.moderation.approved` | Modération | Une version précise est approuvée | Publication de la projection |
| `announcement.published` | Publication | Une projection publique est publiée | Recherche publique, expiration |
| `announcement.withdrawn` | Publication | Une annonce est retirée | Recherche, notification, audit |
| `watch.signal.created` | Veille | Un signal a été constitué | Revue Veille |
| `watch.company_match.proposed` | Veille | Un rapprochement est proposé | Revue autorisée |
| `watch.company_match.approved` | Veille | Un rapprochement a été validé | Demande éventuelle de transfert CRM |
| `transfer.approved` | Gouvernance | Une transmission précise a été approuvée | Exécution du transfert, audit |
| `transfer.executed` | Gouvernance / destinataire | Une projection autorisée a été reçue | Historisation, audit |
| `crm.company.created` | CRM interne | Une fiche entreprise interne a été créée | Recherche interne, index contrôlé |
| `crm.activity.recorded` | CRM interne | Une interaction a été historisée | Historique CRM, indicateurs internes |
| `prospecting.action.authorized` | Prospection | Les contrôles d'une action ont été satisfaits | Préparation de l'exécution |
| `prospecting.action.executed` | Prospection | Une action a réellement été exécutée | CRM, suivi de campagne |
| `prospecting.objection.registered` | Prospection / gouvernance | Une opposition a été enregistrée | Blocage des actions pertinentes |
| `client.share.created` | Espaces clients / gouvernance | Un partage limité a été créé | Tenant destinataire, audit |
| `client.share.revoked` | Espaces clients / gouvernance | Un partage est révoqué | Accès, caches et tâches différées |
| `knowledge.document.indexed` | Recherche documentaire | Un document autorisé est indexé | Recherche dans le corpus autorisé |
| `identity.membership.revoked` | Identité | Une appartenance est révoquée | Sessions, caches et traitements différés |

La présence d'un événement dans ce catalogue n'implique pas que le consommateur soit abonné ou autorisé. Les abonnements sont définis par cas d'usage, champ et périmètre.

## 9. Fiabilité, ordre et reprise

### 9.1 Garantie de livraison

La cible est une livraison **au moins une fois** pour les événements asynchrones, avec consommateurs idempotents. Ne pas promettre « exactement une fois » de bout en bout : une panne peut survenir entre traitement et accusé de réception.

Chaque consommateur conserve un registre des `event_id` traités ou un mécanisme équivalent. Un événement déjà traité ne doit pas reproduire ses effets métier.

### 9.2 Outbox transactionnelle

Lorsqu'une transaction métier doit produire un événement :
1. la mutation métier et l'enregistrement outbox sont validés dans la même transaction ;
2. un dispatcher lit les entrées non publiées ;
3. il publie avec un identifiant stable ;
4. il marque l'entrée comme publiée après confirmation du transport ;
5. les échecs sont retentés avec temporisation et plafond de tentatives ;
6. les messages durablement en échec passent en file de quarantaine / dead-letter avec alerte et procédure de reprise.

La table outbox, si PostgreSQL est retenu, n'est qu'une implémentation possible de cette garantie. Le principe transactionnel est indépendant du fournisseur.

### 9.3 Ordre et concurrence

- L'ordre global n'est pas garanti et n'est généralement pas nécessaire.
- Pour un même agrégat, l'événement porte une version monotone ; le consommateur détecte les événements obsolètes ou manquants.
- Les commandes concurrentes utilisent une version attendue ou un mécanisme de verrouillage adapté.
- Les événements hors ordre ne doivent pas faire régresser l'état d'une ressource.
- Les délais d'attente, tentatives et seuils d'alerte sont définis par flux lors de la conception opérationnelle.

### 9.4 Rejeu et compensation

Le rejeu doit être explicite, limité, autorisé et audité. Il ne doit pas contourner une révocation, une opposition ou une règle de finalité. Une opération externe déjà exécutée ne peut pas toujours être annulée ; une action compensatoire doit être définie (par exemple retrait d'une publication, blocage d'une campagne, révocation d'un partage).

## 10. Idempotence, dédoublonnage et concurrence API

- Les commandes de création ou d'exécution non naturellement idempotentes acceptent une clé `Idempotency-Key` liée à l'identité, à la route et à l'empreinte de la requête.
- Réutiliser la même clé avec le même contenu restitue le résultat initial ; avec un contenu différent, retourne un conflit.
- Les adaptateurs sources utilisent une clé d'unicité composée de la source et de l'identifiant externe lorsque disponible, complétée par une empreinte contrôlée.
- L'absence d'identifiant externe fiable ne doit pas déclencher une fusion approximative irréversible.
- Les mises à jour sensibles utilisent `expected_version` ou `ETag / If-Match`.
- Les retries réseau ne doivent pas provoquer une double campagne, une double publication, une double transmission ou une double action commerciale.

## 11. Sécurité des événements et des connecteurs

- Authentifier les producteurs et consommateurs ; refuser les messages non signés ou provenant d'une identité non autorisée selon le transport retenu.
- Valider le schéma et la version avant traitement.
- Vérifier le périmètre, le tenant, le compte de service et la finalité à la consommation, pas seulement à la publication.
- Ne jamais mettre de secrets, jetons, mots de passe ou pièces complètes dans les événements.
- Chiffrer les échanges et les données persistées selon leur classification.
- Limiter taille, débit, durée de rétention et droits de lecture des files.
- Les journaux techniques masquent les données personnelles et les charges utiles confidentielles.
- Une révocation de membre ou de partage doit invalider les caches et traitements en attente dans le périmètre concerné.
- Les adaptateurs externes appliquent délais, quotas, backoff, circuit breaker si nécessaire et traçabilité de la source ; les secrets sont stockés côté serveur.
- Les événements du corpus documentaire ne contiennent pas de texte documentaire ou de fragments récupérés par défaut.

## 12. Observabilité et audit

Chaque requête API reçoit un `request_id`. Un `correlation_id` suit le parcours métier entre API, commandes, événements et tâches asynchrones. Les identifiants de corrélation ne doivent pas être des données personnelles.

Les traces opérationnelles distinguent :
- résultat technique (succès, erreur, délai, retry) ;
- résultat métier (accepté, refusé, en attente, exécuté) ;
- décision d'autorisation et version de règle ;
- transmission et champs effectivement transmis.

Les métriques minimales :
- volume, latence et erreurs par route ;
- refus d'autorisation et tentatives inter-tenant ;
- erreurs et délais par source ;
- profondeur, âge et taux d'échec de l'outbox/file ;
- événements en retard, dupliqués ou en quarantaine ;
- commandes idempotentes répétées ;
- transmissions en attente, refusées, révoquées ou échouées.

L'accès aux traces d'audit est lui-même contrôlé et journalisé. Les métriques agrégées ne doivent pas exposer des données client ou CRM.

## 13. Tests contractuels et scénarios de sécurité

Avant toute donnée réelle, les tests automatisés devront couvrir au minimum :

### 13.1 Contrats API
1. Chaque route documentée correspond à un schéma de requête/réponse versionné.
2. Les champs obligatoires manquants, types invalides et valeurs inconnues sensibles sont rejetés.
3. Les erreurs suivent l'enveloppe normalisée sans fuite de données.
4. Les limites de pagination et de taille sont appliquées côté serveur.
5. Une commande avec une version obsolète retourne un conflit sans écraser les données.
6. Une même clé d'idempotence ne produit pas deux effets métier.

### 13.2 Autorisation
7. Un visiteur ne lit aucune ressource privée.
8. Un client A ne lit, ne modifie, n'exporte ni ne supprime aucune ressource du client B.
9. Un client ne peut appeler aucune route CRM interne, même en connaissant l'identifiant.
10. Un utilisateur client ne peut pas s'attribuer un rôle interne ou changer son tenant.
11. Un compte de service ne dépasse pas son périmètre déclaré.
12. Une révocation d'appartenance ou de partage bloque les accès ultérieurs et les traitements différés.

### 13.3 Flux et événements
13. Un événement dupliqué ne reproduit pas ses effets.
14. Un événement hors ordre ne fait pas régresser un agrégat.
15. Une panne entre commit métier et publication ne perd pas l'événement.
16. Un consommateur indisponible provoque une reprise contrôlée, puis une quarantaine après le seuil défini.
17. Un rejeu ne contourne pas une opposition ou une révocation.
18. Un événement ne déclenche pas de transmission sans décision de transfert autorisée.

### 13.4 Protection des données et finalités
19. Une annonce soumise n'est pas publiable avant modération.
20. Une annonce publiée n'est pas automatiquement versée au CRM ou à la prospection.
21. Une opposition active bloque l'exécution même si l'action avait été préparée antérieurement.
22. Un partage client n'expose que les champs approuvés et cesse d'être accessible après révocation.
23. Une recherche documentaire ne retourne aucun document hors corpus autorisé.

## 14. Décisions de l'étape C à valider

| ID | Proposition | Recommandation | Statut |
|---|---|---|---|
| C-01 | API externe REST/JSON versionnée sous /api/v1 | Retenir pour le premier contrat | À valider |
| C-02 | Spécification OpenAPI comme source de vérité des routes | Retenir | À valider |
| C-03 | Enveloppes de réponse et d'erreur homogènes | Retenir | À valider |
| C-04 | Autorisation serveur par action, ressource, rôle et périmètre | Impératif | À valider |
| C-05 | Commandes séparées des événements métier | Retenir | À valider |
| C-06 | Événements minimaux avec enveloppe versionnée | Retenir | À valider |
| C-07 | Outbox transactionnelle et livraison au moins une fois | Retenir comme modèle de fiabilité | À valider |
| C-08 | Idempotence pour commandes et consommateurs | Impératif | À valider |
| C-09 | Recontrôle des finalités, oppositions et révocations à l'exécution | Impératif | À valider |
| C-10 | Rejeu limité, audité et avec mécanismes compensatoires | Retenir | À valider |

### Arbitrages complémentaires

- Quelles API seront publiques, réservées aux utilisateurs authentifiés ou strictement internes ?
- Quelles commandes exigent une validation humaine à la première version ?
- Quels événements doivent être traités immédiatement et lesquels peuvent être différés ?
- Quels délais de reprise et de rétention sont acceptables par famille d'événements ?
- Quelles notifications sont nécessaires pour les clients et les opérateurs, sans exposer de données internes ?

## 15. Critères d'acceptation de l'étape C

L'étape C est considérée comme cadrée lorsque :
- les conventions API et l'approche de versionnement sont acceptées ;
- les routes initiales et leurs niveaux d'accès sont confirmés ;
- les contrats de transmission sont validés ;
- le catalogue initial d'événements et leurs consommateurs autorisés sont confirmés ;
- les garanties d'idempotence, de livraison, de reprise et d'ordre sont acceptées ;
- les tests contractuels, de cloisonnement et de finalité sont inscrits dans la stratégie qualité.

Les arbitrages A et B qui conditionnent les permissions, la propriété des données et les destinations doivent être résolus avant toute implémentation de contrats sensibles.

## 16. Hors périmètre

Aucun endpoint, serveur, worker, broker, outbox, table, schéma SQL, politique RLS, système d'authentification, connecteur réel ou flux automatisé n'est créé ici. Aucun fournisseur technologique n'est choisi. Aucun test technique n'est prétendu exécuté. Aucun déploiement, fusion ou changement de production n'est effectué.

Le passage à l'étape D portera sur le choix des technologies et la preuve de concept, après arbitrage explicite des décisions A, B et C.
