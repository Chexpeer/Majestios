# MajestiOS 3.0 — Lot 2.3 : traçabilité des contrats API, données et permissions

**Date :** 3 novembre 2026  
**Branche de travail :** `docs/consolidation-abc-2026-11-03`  
**Statut :** proposition de cadrage contractuel — routes, rôles et décisions restent à valider.  
**Dépendances :** étape C, lot 2.1 (permissions), lot 2.2 (modèle logique conceptuel).  
**Périmètre :** documentation uniquement. Aucun endpoint, schéma OpenAPI, middleware, service ou événement n'est implémenté.

---

## 1. Objectif

Ce document relie les trois couches préparées dans les lots précédents :

- **données** : entités, relations, propriétaire et périmètre ;
- **permissions** : acteur, action, ressource et conditions ;
- **API** : opérations exposées, entrées, sorties, erreurs et contrôles à exécuter.

Il s'agit d'un registre de traçabilité destiné à éviter qu'une route API soit définie sans propriétaire de données, sans permission correspondante ou sans scénario de test.

Il complète [l'étape C](ETAPE-C-CONTRATS-API-EVENEMENTS.md), qui demeure le document de référence pour les conventions générales, les événements et la fiabilité. Il ne remplace pas ses propositions et ne transforme pas les décisions A/B/C en décisions validées.

## 2. Règles de conception contractuelle

1. Une route est rattachée à un domaine propriétaire ; un autre domaine n'accède pas directement à ses tables ou objets internes.
2. Chaque opération est associée à une action explicite : DISCOVER, READ, CREATE, UPDATE, DELETE, INVITE, ASSIGN, SHARE, EXPORT, MODERATE, ADMINISTER ou AUDIT_READ.
3. Chaque ressource privée porte un périmètre de sécurité vérifiable. Le contexte transmis par le client n'est jamais une preuve d'autorisation.
4. Une permission est vérifiée côté serveur à chaque lecture, commande, recherche, export, téléchargement et traitement asynchrone.
5. Les relations entre ressources font l'objet d'un contrôle de cohérence de périmètre.
6. Les commandes sensibles expriment une transition métier, pas une mise à jour libre de champs.
7. Les transferts utilisent une décision explicite et une projection minimisée ; un événement ne vaut jamais autorisation.
8. Les réponses ne révèlent pas l'existence d'une ressource interdite.
9. Les contrats de lecture n'exposent que les champs nécessaires au cas d'usage.
10. Toute opération non couverte par une permission explicite est refusée.

## 3. Légende de traçabilité

| Dimension | Signification |
|---|---|
| Entité | Concept logique du lot 2.2, non table physique |
| Ressource API | Projection ou ressource exposée par contrat |
| Action | Permission fonctionnelle du lot 2.1 |
| Périmètre | Public, interne MajestiOS, tenant, corpus BrainOS ou partage |
| Contrôle | Vérification obligatoire avant exécution |
| Test | Scénario de référence à rattacher aux tests automatisés |

Les rôles de la matrice (VISITOR, CLIENT_OWNER, CLIENT_MEMBER, CRM_OPERATOR, CRM_MANAGER, MODERATOR, TECH_ADMIN, SERVICE_ACCOUNT) restent provisoires. Dans les contrats, il est préférable de référencer une **permission nommée** et sa portée plutôt que de coder un rôle directement dans la spécification.

## 4. Registre des familles de contrats

Les chemins ci-dessous reprennent les exemples de l'étape C pour permettre la traçabilité. Ils restent indicatifs et peuvent être modifiés lors de la consolidation OpenAPI.

| Famille | Ressources logiques | Opérations/API proposées | Actions à autoriser | Périmètre et contrôle central |
|---|---|---|---|---|
| Identité / accès | UserIdentity, Tenant, Membership, Workspace | Consultation du profil, liste des appartenances, gestion des membres et workspaces | READ, DISCOVER, INVITE, ASSIGN, CREATE, UPDATE | Appartenance active ; gestion limitée au tenant concerné ; TECH_ADMIN sans droit métier implicite |
| Organisations | Organization, Establishment | Recherche et consultation d'identités organisationnelles | DISCOVER, READ | Projection minimale ; identifiant légal = rapprochement, jamais autorisation |
| Recherche / opportunités | Search, SourceRecord, PublicProjection, SharedProjection | `POST /api/v1/searches`, `GET /api/v1/searches/{id}`, `GET /api/v1/opportunities` | CREATE, DISCOVER, READ | Type/catégorie/département autorisés ; résultats filtrés selon le périmètre et la projection |
| Sources / collecte | SourceDefinition, SourceRecord, Provenance | État des sources et opérations de collecte internes | READ, CREATE, ADMINISTER selon opération | Secrets conservés côté serveur ; conditions de source, provenance et finalité contrôlées |
| Publication | PublicationSubmission, PublicProjection | `POST /api/v1/announcements`, lecture d'annonce, soumission | CREATE, READ, UPDATE | Auteur, état, champs soumis ; aucune publication avant décision requise |
| Modération | ModerationDecision | `POST /api/v1/moderation/{id}/decisions` | READ, MODERATE | Élément attribué ; motif ; version examinée ; aucune lecture CRM implicite |
| CRM interne | CrmCompanyRecord, Contact, CrmActivity, Campaign, Opportunity | Routes `/api/v1/internal/crm/*` | DISCOVER, READ, CREATE, UPDATE, EXPORT, SHARE | Principal interne et permission dédiée ; aucune exposition au tenant client |
| Veille / qualification | Signal, MatchCandidate, Qualification | Lecture des signaux, revue d'un rapprochement | READ, UPDATE ou commande de revue | Visibilité du rapprochement autorisée ; pas de fusion ni de transfert implicite |
| Prospection active | EligibilityAssessment, Restriction, Campaign, CrmActivity | Préparation et exécution d'une action | CREATE, READ, commande d'exécution | Finalité, opposition, restrictions et éligibilité recontrôlées juste avant l'action |
| Espaces clients | Tenant, Membership, Workspace, documents et activités du tenant | `GET/POST /api/v1/client/workspaces` et opérations associées | READ, CREATE, UPDATE, DELETE, INVITE, ASSIGN, EXPORT | Membership active ; même tenant pour toutes les ressources liées |
| Partages / transferts | TransferRequest, TransferDecision, SharedProjection | Demande, approbation, exécution, acceptation, révocation | SHARE, READ, commande de décision | Source, destinataire, champs, finalité, expiration, décision et révocation |
| BrainOS | Corpus, Document, DocumentVersion, IndexEntry | `POST /api/v1/brain/searches`, dépôt de document | READ, CREATE, ADMINISTER | Droits corpus/document appliqués avant restitution ; index non autorisant |
| Audit / cycle de vie | AuditEvent, RetentionRule, DeletionRequest | Consultation d'audit et demandes de cycle de vie | AUDIT_READ, DELETE (demande contrôlée) | Périmètre d'audit dédié ; minimisation ; conservation et suppression selon règles validées |

### 4.1 Points d'attention sur les familles

- La famille Organisations peut être consultable dans plusieurs parcours, mais ne doit pas exposer les dossiers CRM contextualisés.
- Une recherche ne constitue pas un passe-droit : DISCOVER et READ sont évalués sur chaque résultat, pas seulement sur la requête.
- Les routes CRM internes ne sont pas rendues accessibles à un client en changeant simplement un identifiant ou un paramètre de contexte.
- La route d'acceptation d'un partage ne doit pas permettre au destinataire d'élargir les champs ou la finalité approuvés.
- Les routes BrainOS doivent filtrer les documents avant de restituer titres, extraits, métadonnées ou résultats de similarité.
- Une route d'audit ne doit pas retourner les charges utiles métier complètes par défaut.

## 5. Contrat d'autorisation : structure logique

Chaque opération devrait être évaluée à partir d'un contexte interne construit par le serveur. Exemple conceptuel, non schéma d'implémentation :

~~~json
{
  "principal": {
    "id": "principal-id",
    "type": "user",
    "status": "active"
  },
  "permission": "crm.company.read",
  "resource": {
    "type": "CrmCompanyRecord",
    "id": "opaque-resource-id"
  },
  "scope": {
    "kind": "internal",
    "id": "majestios-internal"
  },
  "purpose": {
    "code": "internal_business_development",
    "version": 1
  },
  "request": {
    "id": "request-id",
    "correlation_id": "correlation-id"
  }
}
~~~

Règles :

- le principal est issu de l'identité authentifiée ou du compte de service validé ;
- la permission est une capacité nommée, pas une chaîne fournie librement par le navigateur ;
- le périmètre est dérivé des droits et de la ressource ;
- le serveur vérifie aussi l'état métier, les restrictions et les relations ;
- un contrôle obligatoire impossible à réaliser produit un refus ou une mise en attente ;
- les détails de décision internes ne sont pas exposés au demandeur.

## 6. Contrats de commande sensibles

Les exemples suivants illustrent les données minimales à prévoir. Ils ne constituent pas des JSON Schemas validés.

### 6.1 Revue d'un rapprochement

Commande proposée : `POST /api/v1/internal/watch/matches/{id}/review`

Entrées minimales :
- décision autorisée (valider, rejeter ou demander une revue complémentaire) ;
- code de motif ;
- version attendue de l'objet ;
- identifiant de corrélation, généré ou propagé côté serveur.

Contrôles :
- permission de revue dans le domaine Veille ;
- visibilité des objets source et cible ;
- version courante et état compatible ;
- motif obligatoire pour les décisions négatives ou les cas définis ;
- aucune fusion ou copie automatique des dossiers.

Erreurs métier possibles : `FORBIDDEN`, `NOT_FOUND` masqué, `VERSION_CONFLICT`, `INVALID_STATE`, `REVIEW_REQUIRED`.

### 6.2 Préparation et exécution d'une action de prospection active

Commandes proposées :
- `POST /api/v1/internal/prospecting/actions`
- `POST /api/v1/internal/prospecting/actions/{id}/execute`

La préparation enregistre une intention et son contexte ; elle ne signifie pas que l'action a été exécutée.

Contrôles à la préparation et à l'exécution :
- permission sur la campagne, la cible et l'action ;
- finalité autorisée et version de règle ;
- restrictions et oppositions applicables ;
- éligibilité de la cible et état actuel ;
- validité des coordonnées et du canal lorsque pertinent ;
- contrôle répété au moment exact de l'exécution ;
- idempotence afin d'éviter les doubles sollicitations.

L'état préparé ne doit pas être considéré comme une autorisation durable. Une restriction apparue après la préparation bloque l'exécution.

### 6.3 Décision et exécution d'un transfert

Commandes logiques proposées :
- demande de transfert ;
- approbation ou rejet ;
- exécution de la projection ;
- révocation du partage.

Champs conceptuels minimaux :
- ressource source et domaine propriétaire ;
- tenant ou domaine destinataire ;
- finalité et version ;
- liste blanche de champs ;
- demandeur, décisionnaire et motifs ;
- état, dates d'effet et expiration ;
- référence de corrélation et version de la source.

Contrôles :
- permission SHARE distincte de READ/UPDATE ;
- autorité de décision séparée du demandeur lorsque le workflow l'exige ;
- source encore accessible et transférable ;
- destinataire et finalité toujours valides à l'exécution ;
- liste blanche appliquée côté serveur ;
- projection isolée du tenant destinataire ;
- révocation appliquée aux lectures, recherches, exports et caches sous contrôle de la plateforme.

### 6.4 Décision de modération

Commande proposée : `POST /api/v1/moderation/{id}/decisions`

Entrées minimales : décision, motif, version de la soumission examinée.  
Contrôles : permission MODERATE, affectation du dossier, état valide, absence de conflit de version, traçabilité de l'acteur.  
La décision de modération ne doit pas directement modifier une fiche CRM ni autoriser une prospection.

## 7. Contrats de lecture et minimisation des réponses

Chaque ressource exposée doit définir une projection par cas d'usage. Un objet interne ne doit jamais être sérialisé intégralement « par défaut ».

| Ressource | Champs de réponse indicatifs | Champs exclus par défaut |
|---|---|---|
| Organization (projection publique/annuaire) | identifiant opaque, dénomination, identifiants légaux publiables, données publiques utiles | notes CRM, contacts privés, historique commercial |
| SearchResult | type, catégorie, date, résumé autorisé, provenance publiable, lien vers détail autorisé | payload source brut, notes internes, clés connecteur |
| CrmCompanyRecord | champs métier autorisés selon permission interne | données sensibles non nécessaires, secrets, informations d'autres périmètres |
| SharedProjection | uniquement les champs accordés par TransferDecision | fiche CRM source complète, champs non accordés, notes et activités privées |
| TenantWorkspace | identifiant opaque, libellé, état et métadonnées accessibles au membre | autres tenants, attributs techniques sensibles |
| BrainSearchResult | document autorisé, métadonnées permises, extrait autorisé | contenu d'un document interdit, score ou métadonnée révélatrice si non autorisés |
| AuditEvent | type d'action, acteur selon habilitation, date, ressource minimisée, résultat | corps complet des requêtes, secrets, contenus métier sans nécessité |

Les champs réellement exposés, leur sensibilité et leurs permissions doivent être définis dans le futur dictionnaire de données/API.

## 8. Enveloppes, erreurs et pagination

L'étape C propose une enveloppe JSON commune, une pagination par curseur et des codes HTTP normalisés. Le lot 2.3 ajoute les règles de traçabilité suivantes :

- chaque réponse porte un identifiant de requête ;
- une collection indique explicitement si d'autres résultats existent et fournit un curseur opaque si nécessaire ;
- le serveur impose les limites de taille et de pagination ;
- les erreurs d'autorisation ne distinguent pas une ressource inexistante d'une ressource interdite lorsque cette distinction révélerait son existence ;
- les codes métier sont stables et non traduits dans les traitements ;
- aucun détail interne de permission, règle de détection ou donnée privée n'est inclus dans `details`.

Codes métier indicatifs à harmoniser dans le catalogue C :

| Code | Sens | Traitement attendu |
|---|---|---|
| `AUTHENTICATION_REQUIRED` | Identité absente ou invalide | Réauthentification |
| `FORBIDDEN` | Permission absente | Refus sans détail sensible |
| `RESOURCE_NOT_AVAILABLE` | Ressource absente ou masquée | Réponse non révélatrice |
| `TENANT_SCOPE_MISMATCH` | Relation ou ressource hors périmètre | Refus et audit approprié |
| `PURPOSE_NOT_ALLOWED` | Finalité non admise | Refus ou revue |
| `OBJECTION_ACTIVE` | Restriction/opposition active | Bloquer l'action concernée |
| `TRANSFER_NOT_APPROVED` | Décision de transfert absente ou défavorable | Ne pas créer de projection |
| `TRANSFER_EXPIRED` | Décision expirée | Nouvelle demande/revue |
| `VERSION_CONFLICT` | Version attendue différente | Relecture puis décision explicite |
| `INVALID_STATE` | Transition métier interdite | Refus de commande |
| `IDEMPOTENCY_CONFLICT` | Même clé réutilisée avec contenu différent | Conflit, aucune répétition d'effet |
| `RATE_LIMITED` | Limite de débit atteinte | Reprise selon politique |

Les noms ci-dessus sont des propositions à harmoniser avec les codes déjà présents dans l'étape C ; ils ne doivent pas créer un second catalogue concurrent.

## 9. Idempotence, concurrence et tâches asynchrones

Pour toute commande susceptible d'être répétée par le navigateur, un proxy ou un worker :

- définir si elle est naturellement idempotente ;
- sinon, prévoir une clé d'idempotence et une empreinte de requête ;
- rattacher la clé à l'identité, à l'opération et au périmètre ;
- retourner le résultat initial pour une répétition strictement identique ;
- refuser une réutilisation de clé avec une charge utile différente ;
- utiliser une version attendue pour les transitions concurrentes ;
- transmettre aux workers un contexte minimal de service, avec acteur initiateur, finalité, périmètre et corrélation ;
- refaire les contrôles d'autorisation, d'opposition et de révocation au moment de l'exécution.

Les garanties de livraison, d'outbox et de reprise restent celles proposées dans l'étape C ; le présent document ne choisit aucun broker ni fournisseur.

## 10. Matrice de traçabilité API → permissions → tests

| Opération | Permission à définir | Invariants liés | Tests de référence |
|---|---|---|---|
| Lire une fiche CRM interne | `crm.company.read` | LOG-03, LOG-04 | PERM-03, LOG-T04 |
| Rechercher des opportunités | `opportunity.discover/read` | LOG-06, LOG-11 | PERM-15, LOG-T12 |
| Revoir un rapprochement | `watch.match.review` | LOG-04, LOG-07 | LOG-T05, conflit de version |
| Préparer une action de prospection | `prospecting.action.prepare` | LOG-12 | PERM-12, LOG-T10 |
| Exécuter une action de prospection | `prospecting.action.execute` | LOG-12 | restriction ajoutée après préparation |
| Créer une ressource tenant | `tenant.resource.create` | LOG-01, LOG-02 | PERM-01, PERM-13, LOG-T02 |
| Inviter / attribuer un membre | `tenant.membership.invite/assign` | LOG-01 | PERM-02 |
| Créer un partage CRM | `crm.projection.share` | LOG-08, LOG-09 | PERM-04, LOG-T06, LOG-T07 |
| Lire une projection partagée | `crm.projection.read` | LOG-08, LOG-09 | PERM-10, LOG-T07 |
| Modérer une annonce | `publication.moderate` | LOG-11 | PERM-06, contrôle de version |
| Rechercher dans BrainOS | `brain.document.discover/read` | LOG-10 | PERM-08, LOG-T08 |
| Télécharger un document | `document.export` | LOG-01, LOG-02, LOG-09 | PERM-13, LOG-T13 |
| Lire les traces d'audit | `audit.event.read` | LOG-13 | P-10, contrôle de portée |
| Traiter une suppression | `resource.deletion.request` | LOG-14 | LOG-T14 |

Les identifiants de permission sont des noms candidats. Ils doivent être consolidés dans un registre unique et reliés à la matrice finale ; ne pas les implémenter avant arbitrage.

## 11. Scénarios contractuels complémentaires

| ID | Requête / contexte | Résultat attendu |
|---|---|---|
| API-T01 | Client transmet un tenant_id valide mais sans Membership active | Refus ; le contexte client ne crée aucun droit |
| API-T02 | Client demande une fiche CRM par identifiant connu | Refus non révélateur |
| API-T03 | Relation d'une ressource tenant A vers un document tenant B | Refus de la mutation et de la lecture |
| API-T04 | Recherche retourne un résultat privé hors périmètre | Résultat absent, sans compteur révélateur |
| API-T05 | Appel de partage avec champ non autorisé dans le payload | Champ ignoré ou requête rejetée selon contrat strict ; jamais partagé |
| API-T06 | Transfert approuvé puis restriction ajoutée avant exécution | Recontrôle ; transfert/action bloqué |
| API-T07 | Deux commandes de revue concurrentes avec même version attendue | Une transition acceptée ; l'autre reçoit un conflit |
| API-T08 | Même Idempotency-Key et même payload | Un seul effet métier, résultat initial restitué |
| API-T09 | Même Idempotency-Key et payload différent | Conflit, aucun second effet |
| API-T10 | Worker reprend une tâche après révocation de l'acteur ou du partage | Contrôles rejoués ; exécution refusée si non autorisée |
| API-T11 | BrainOS trouve un document interdit par similarité | Aucun titre, extrait ou métadonnée révélatrice |
| API-T12 | Réponse d'erreur sur ressource inexistante puis interdite | Pas de différence révélatrice selon politique de masquage |
| API-T13 | Export demandé sans permission EXPORT dédiée | Refus même si READ est accordé |
| API-T14 | Décision de modération sur une ancienne version de soumission | Conflit ; pas de publication de la mauvaise version |

Ces scénarios complètent PERM-01 à PERM-15 et LOG-T01 à LOG-T14. Ils doivent être traduits en tests API et, lorsque pertinent, en tests de persistance/RLS avant l'ouverture à des données réelles.

## 12. Registre des arbitrages nécessaires

| ID | Sujet | Question | Dépendances |
|---|---|---|---|
| API-01 | Permissions canoniques | Quels identifiants de permissions et quelles portées sont retenus ? | P-01 à P-10 |
| API-02 | Contexte tenant | Tenant dans l'URL, sélection de session ou contexte dérivé ; quelle convention ? | B-01, P-03 |
| API-03 | Routes | Confirmer les routes REST proposées ou retenir une convention alternative | C-01 |
| API-04 | Projection | Vue dynamique ou copie contrôlée ; quelles garanties de fraîcheur ? | B-05, MOD-06 |
| API-05 | Erreurs | Politique exacte de masquage 403/404 et catalogue de codes | C-03 |
| API-06 | Pagination | Curseur opaque, tri stable, durée de vie et limites | C-03 |
| API-07 | Idempotence | Durée de conservation des clés et opérations concernées | C-08 |
| API-08 | Versionnement | Stratégie de compatibilité OpenAPI et retrait des versions | C-01, C-06 |
| API-09 | Événements | Catalogue canonique, charges utiles et abonnements autorisés | C-05, C-06 |
| API-10 | Audit | Actions obligatoirement tracées et champs minimisés | B-10, P-10 |
| API-11 | Finalités | Référentiel des finalités et règles de recontrôle | B-09, C-09 |
| API-12 | Export / suppression | Contrats distincts et règles de cycle de vie | B-10, P-06 |

Aucun arbitrage n'est réputé effectué par l'inscription de cette question dans le registre.

## 13. Critères de sortie du lot 2.3

Le cadrage contractuel pourra passer à une spécification OpenAPI détaillée lorsque :

- chaque famille d'API possède un domaine propriétaire ;
- chaque opération est reliée à une ressource, une action et un périmètre ;
- les permissions conditionnelles sont décomposées et arbitrées ;
- les projections de réponse sont définies par cas d'usage ;
- les contrats de transfert, de partage et de révocation sont cohérents ;
- les codes d'erreur et la pagination sont harmonisés avec l'étape C ;
- l'idempotence et la concurrence sont définies pour les commandes sensibles ;
- les tests PERM, LOG-T et API-T sont acceptés comme exigences ;
- les décisions A/B/C dépendantes ont été confirmées ou corrigées.

## 14. Hors périmètre et références

Ce document ne crée ni route, ni spécification OpenAPI, ni middleware, ni permission active, ni schéma physique, ni worker. Il ne valide pas les rôles provisoires ni les décisions B/C.

Références :
- [Étape C — Contrats API, échanges et événements](ETAPE-C-CONTRATS-API-EVENEMENTS.md)
- [Lot 2.1 — Matrice de permissions proposée](LOT-2-MATRICE-PERMISSIONS-PROPOSITION.md)
- [Lot 2.2 — Modèle logique conceptuel](LOT-2-MODELE-LOGIQUE-CONCEPTUEL.md)
- [Lot 2 — Propriété des données et cloisonnement](LOT-2-PROPRIETE-DONNEES-CLOISONNEMENT.md)
- [Référentiel de cohérence A/B/C](CONSOLIDATION-A-B-C-REFERENTIEL.md)
