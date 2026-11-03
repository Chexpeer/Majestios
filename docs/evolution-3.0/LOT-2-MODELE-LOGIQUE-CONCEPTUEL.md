# MajestiOS 3.0 — Lot 2.2 : modèle logique conceptuel des données

**Date :** 3 novembre 2026  
**Branche de travail :** `docs/consolidation-abc-2026-11-03`  
**Statut :** proposition de structuration à arbitrer — aucune décision B-01 à B-10 n'est validée par ce document.  
**Périmètre :** documentation conceptuelle uniquement. Aucun schéma SQL, migration, modèle ORM, endpoint, policy RLS ou traitement n'est créé.

---

## 1. Objet et limites

Ce document transforme les domaines et frontières décrits dans l'étape B et le lot 2 en un inventaire logique d'entités, de relations et d'invariants. Il prépare la discussion des contrats API de l'étape C sans figer de choix physiques.

Il répond à quatre objectifs :

1. nommer les objets métier nécessaires et éviter les confusions d'identité ;
2. rendre explicites leur propriétaire fonctionnel et leur périmètre de sécurité ;
3. identifier les relations qui doivent préserver le cloisonnement ;
4. fournir des invariants et scénarios de contrôle réutilisables pour les contrats API et les futurs tests.

**Ce document ne décide pas** du SGBD, du partitionnement, du schéma multi-tenant, des clés primaires physiques, de la stratégie RLS, de l'ORM, du stockage documentaire, du moteur de recherche, du fournisseur d'identité ni des règles de conservation. Les cardinalités sont des hypothèses conceptuelles à confirmer. Les champs sont indicatifs et ne constituent pas un dictionnaire SQL définitif.

## 2. Conventions de lecture

| Marqueur | Sens |
|---|---|
| Constat | Concept déjà présent dans les documents A/B/C examinés |
| Proposition | Structuration logique suggérée pour rendre le modèle testable |
| À arbitrer | Choix qui exige une décision explicite |
| Hors modèle physique | Détail volontairement laissé à l'étape technique |

Les termes **organisation**, **tenant**, **workspace**, **identité d'entreprise**, **établissement** et **dossier CRM** désignent des concepts distincts. Aucun identifiant commun ne vaut permission.

## 3. Principes de modélisation non négociables proposés

1. Le CRM interne MajestiOS est un périmètre interne distinct d'un tenant client.
2. Un tenant client constitue une frontière d'isolation ; ses workspaces restent sous cette frontière.
3. L'identité globale d'une entreprise est séparée de ses dossiers contextualisés dans chaque périmètre.
4. Une relation, une note, un contact ou un historique CRM ne devient pas global parce que l'entreprise correspond à un SIREN/SIRET.
5. Les enregistrements collectés conservent la source, la référence externe et la date de collecte.
6. Un rapprochement ne fusionne pas les enregistrements et ne déclenche pas à lui seul un transfert.
7. Un partage vers un client crée une projection autorisée, jamais un accès direct à la fiche CRM source.
8. Les documents et index BrainOS ont une autorisation documentaire propre.
9. Toute ressource privée est rattachée à un propriétaire fonctionnel et à un périmètre explicite.
10. Les relations entre ressources sont soumises aux mêmes contrôles de périmètre que les ressources elles-mêmes.
11. Les restrictions, oppositions, finalités et révocations sont contrôlées avant une action et au moment de son exécution.
12. En cas de propriétaire, de finalité ou de droit inconnu, le traitement est refusé ou mis en attente.

## 4. Catalogue conceptuel des entités

Les noms ci-dessous sont des noms logiques provisoires. Ils ne préjugent pas des noms de tables ou des ressources REST.

### 4.1 Identité, organisation et appartenance

| Entité logique | Rôle | Attributs conceptuels indicatifs | Propriétaire / périmètre |
|---|---|---|---|
| UserIdentity | Identité d'un utilisateur humain | id logique, identifiant fournisseur, email vérifié, état, dates | Domaine Identité ; global plateforme |
| Organization | Personne morale ou organisation cliente/interne | id, nom légal, forme, pays, identifiants légaux disponibles, état | Référentiel d'identité organisationnelle ; accès filtré |
| Establishment | Établissement rattaché à une organisation | id, SIRET éventuel, adresse, statut, dates | Référentiel d'identité organisationnelle |
| Tenant | Frontière de sécurité d'une organisation cliente | id, organization_id, état, dates | Domaine Espaces clients |
| Membership | Appartenance d'un utilisateur à un tenant | id, tenant_id, user_id, rôle(s) ou référence de rôle, état, validité | Tenant concerné |
| Workspace | Espace/dossier de travail dans un tenant | id, tenant_id, nom, état, paramètres | Tenant propriétaire |
| WorkspaceMembership (option) | Accès d'un membre à un workspace | workspace_id, membership_id, état, permissions spécifiques | Tenant concerné |

**À arbitrer :** une organisation peut-elle porter plusieurs tenants ? Un utilisateur peut-il appartenir à plusieurs tenants ? Un tenant peut-il avoir plusieurs workspaces dès la première version ? Le workspace aura-t-il une adhésion dédiée ou héritera-t-il strictement des droits du tenant ?

### 4.2 CRM interne et relations commerciales

| Entité logique | Rôle | Attributs conceptuels indicatifs | Propriétaire / périmètre |
|---|---|---|---|
| CrmCompanyRecord | Dossier entreprise contextualisé dans le CRM | id, organization_identity_id éventuel, statut CRM, qualification, propriétaire interne, dates | CRM interne MajestiOS |
| CrmEstablishmentRecord | Dossier établissement contextualisé | id, crm_company_record_id, establishment_identity_id éventuel, qualification | CRM interne |
| Contact | Personne contact connue dans un périmètre | id, identité minimale, coordonnées, statut, provenance | CRM interne ou tenant selon le dossier |
| CompanyContactRelationship | Relation contextualisée contact/entreprise | company_record_id, contact_id, fonction, période, source, statut | Même périmètre que le dossier parent |
| CrmActivity | Interaction ou action historisée | id, type, date, acteur, résultat, compte rendu, finalité | CRM interne |
| Campaign | Campagne commerciale | id, objectif, statut, période, propriétaire | CRM interne |
| CampaignTarget | Lien entre campagne et cible contextualisée | campaign_id, company_record_id, état, résultat | CRM interne |
| Opportunity | Opportunité commerciale suivie | id, origine, statut, valeur indicative, dates, responsable | CRM interne ou tenant selon l'usage ; séparation explicite requise |
| Qualification | Évaluation d'un dossier ou signal | critères, résultat, version de règle, évaluateur, date | Périmètre de l'objet qualifié |

Une entité Contact ne doit pas devenir une personne globale accessible à tous les tenants. La réutilisation éventuelle d'une identité de personne doit être étudiée séparément, avec minimisation et contrôle d'accès. Une fiche CRM et une fiche client peuvent désigner la même entreprise sans partager leurs champs privés.

### 4.3 Collecte, provenance, signaux et rapprochements

| Entité logique | Rôle | Attributs conceptuels indicatifs | Propriétaire / périmètre |
|---|---|---|---|
| SourceDefinition | Décrit une source et ses conditions d'utilisation | id, nom, type, conditions, statut, version | Domaine Collecte / gouvernance |
| SourceRecord | Enregistrement reçu d'une source | id, source_id, external_ref, collected_at, payload normalisé, statut | Domaine Collecte ; accès selon finalité |
| Provenance | Justifie l'origine d'un champ ou d'un objet | source, référence, date, méthode, transformation | Attachée à la donnée concernée |
| Signal | Fait ou indice détecté | type, date, source, niveau de confiance, état | Domaine Veille / périmètre interne |
| MatchCandidate | Proposition de rapprochement entre objets | références source/cible, critères, score, version de règle, revue | Domaine Qualification ; visibilité contrôlée |
| Restriction | Restriction/opposition applicable à une entité ou action | sujet, portée, motif, source, dates, statut | Domaine conformité / périmètre d'application |
| EligibilityAssessment | Résultat d'un contrôle avant action | action, cible, finalité, règles/version, résultat, date | Domaine Prospection active |

Un score de rapprochement ne doit pas être présenté comme une certitude d'identité ou de capacité. Une restriction doit pouvoir être évaluée même si la donnée commerciale a été importée depuis plusieurs sources.

### 4.4 Partage, transfert et publication

| Entité logique | Rôle | Attributs conceptuels indicatifs | Propriétaire / périmètre |
|---|---|---|---|
| TransferRequest | Demande de passage entre domaines/périmètres | source, destination, finalité, champs demandés, demandeur, date | Domaine de transfert |
| TransferDecision | Décision explicite sur le transfert | demande, décisionnaire, résultat, motif, règle/version, dates, expiration | Domaine de transfert / audit |
| SharedProjection | Projection limitée remise à un destinataire | source_ref, tenant_id, champs autorisés, version, état, validité | Tenant destinataire pour la projection ; source inchangée |
| ProjectionFieldGrant | Définition des champs autorisés | projection_id, champ, règle, période | Partage / gouvernance |
| PublicationSubmission | Contenu soumis à publication | auteur, contenu, statut, dates | Domaine Publication |
| ModerationDecision | Décision de modération | submission_id, acteur, décision, motif, date | Domaine Modération |
| PublicProjection | Vue publique des seuls champs publiés | source_submission_id, champs publiés, version, expiration | Domaine Publication |

TransferDecision demeure l'objet de décision de référence proposé par B/C. La création d'une projection ne doit pas modifier le propriétaire de la source. Une annonce soumise, sa décision de modération et sa projection publique restent distinctes.

### 4.5 BrainOS, documents et audit

| Entité logique | Rôle | Attributs conceptuels indicatifs | Propriétaire / périmètre |
|---|---|---|---|
| Corpus | Ensemble documentaire autorisé | id, propriétaire, périmètre, politique d'accès, état | Propriétaire du corpus |
| Document | Document logique | id, corpus_id, origine, propriétaire, classification, état, dates | Périmètre du corpus |
| DocumentVersion | Version immuable ou historisée d'un document | document_id, version, emplacement, empreinte, date | Même périmètre que Document |
| IndexEntry | Référence d'index/recherche dérivée | document_version_id, index, version de traitement | BrainOS ; droits dérivés mais revérifiés |
| AuditEvent | Trace d'une action ou décision | acteur, action, ressource, périmètre, date, résultat, corrélation | Domaine Audit |
| RetentionRule | Règle de conservation à appliquer | catégorie, déclencheur, durée, exceptions, version | Gouvernance à désigner |
| DeletionRequest | Demande de suppression ou d'effacement | ressource, demandeur, motif, état, résultat | Domaine responsable + audit |

L'index n'est jamais une frontière d'autorisation. Toute recherche BrainOS doit réévaluer les droits sur le document source avant de restituer un extrait ou un résultat.

## 5. Relations logiques et cardinalités provisoires

| Relation | Cardinalité indicative | Contrainte attendue |
|---|---|---|
| Organization → Establishment | 1 à N | L'établissement référence une organisation valide |
| Organization → Tenant | 1 à 0..N (à arbitrer) | Pas d'assimilation organisation/tenant |
| UserIdentity → Membership | 1 à 0..N | Appartenance active vérifiée côté serveur |
| Tenant → Membership | 1 à N | Une membership appartient à un seul tenant |
| Tenant → Workspace | 1 à 0..N | Workspace obligatoirement rattaché à un tenant |
| Membership ↔ Workspace | N à N (option) | Aucun accès workspace hors tenant |
| Organization identity → CrmCompanyRecord | 1 à 0..N | Plusieurs dossiers contextualisés possibles selon périmètre |
| CrmCompanyRecord → CrmEstablishmentRecord | 1 à 0..N | Même périmètre de sécurité |
| Company record ↔ Contact | N à N via relation | Relation, contact et dossier contrôlés dans le même périmètre |
| Campaign → CampaignTarget | 1 à N | Cibles CRM internes uniquement dans le modèle CRM interne |
| SourceDefinition → SourceRecord | 1 à N | Référence externe stable dans le périmètre de la source |
| SourceRecord → Provenance | 1 à N | Provenance conservée après normalisation |
| Signal → MatchCandidate | 1 à 0..N | Rapprochement non fusionnant |
| TransferRequest → TransferDecision | 1 à 0..N (historique) | Décision courante explicite et traçable |
| TransferDecision → SharedProjection | 1 à 0..N | Projection seulement après décision favorable et contrôles finaux |
| Tenant → SharedProjection | 1 à N | Projection isolée du tenant destinataire |
| PublicationSubmission → ModerationDecision | 1 à 0..N | Historique de décisions conservé selon politique |
| PublicationSubmission → PublicProjection | 1 à 0..N | Projection seulement après approbation |
| Corpus → Document | 1 à N | Document appartient à un corpus autorisé |
| Document → DocumentVersion | 1 à N | Version et origine traçables |
| DocumentVersion → IndexEntry | 1 à 0..N | Index dérivé ; autorisation revérifiée |
| Ressource métier → AuditEvent | 1 à 0..N | Trace minimisée, accès restreint |

Les cardinalités « 1 à N » décrivent des relations logiques souhaitées, pas des contraintes SQL déjà définies. Les cas de migration, fusion, archivage et suppression logique restent à spécifier.

## 6. Attributs transversaux recommandés

Pour les ressources métier privées, examiner la présence des attributs suivants lorsque pertinents :

- identifiant interne non signifiant ;
- type de propriétaire fonctionnel ;
- identifiant du périmètre de sécurité (tenant ou périmètre interne explicite) ;
- état métier et dates de création/mise à jour ;
- acteur ou système à l'origine de la mutation ;
- provenance et version de transformation pour les données importées ;
- classification et finalité lorsque la nature de la donnée l'exige ;
- date d'expiration ou règle de conservation si applicable ;
- identifiant de corrélation pour les opérations inter-domaines.

Ces attributs ne doivent pas être ajoutés mécaniquement à chaque objet. Le catalogue de champs et les obligations applicables doivent être définis par catégorie.

## 7. Invariants d'intégrité et de cloisonnement

Les invariants suivants sont proposés comme exigences de conception et de test :

**LOG-01 — Cohérence tenant :** toute ressource détenue par un tenant référence un tenant existant et actif selon la règle métier applicable.

**LOG-02 — Cohérence des relations :** une relation entre deux ressources privées ne peut pas connecter deux tenants différents, sauf mécanisme explicite de projection autorisée.

**LOG-03 — CRM interne :** aucune ressource CRM interne ne peut être rendue accessible en fournissant simplement un tenant_id ou un identifiant d'entreprise.

**LOG-04 — Identité distincte :** un SIREN/SIRET ou identifiant externe sert au rapprochement ; il ne sert jamais de clé d'autorisation.

**LOG-05 — Contacts contextualisés :** une relation contact/entreprise ne peut pas être utilisée pour franchir une frontière de périmètre.

**LOG-06 — Provenance :** une donnée issue d'une source conserve une référence de provenance consultable par les acteurs autorisés.

**LOG-07 — Rapprochement :** MatchCandidate n'entraîne ni fusion, ni copie, ni révélation d'un objet source non autorisé.

**LOG-08 — Transfert :** une projection n'est créée que si TransferDecision est favorable, non expirée et encore valide au moment de l'exécution.

**LOG-09 — Révocation :** une projection révoquée n'est plus accessible par les routes, recherches, téléchargements ou caches contrôlés par la plateforme.

**LOG-10 — BrainOS :** un résultat d'index ne peut pas restituer un document auquel le demandeur n'a pas accès au moment de la réponse.

**LOG-11 — Publication :** PublicProjection ne contient que les champs approuvés et encore publiables.

**LOG-12 — Restriction :** une action de prospection est bloquée si une restriction applicable est active ou si son contrôle ne peut pas être effectué.

**LOG-13 — Audit :** les événements d'audit ne doivent pas devenir une copie intégrale et largement accessible des données métier.

**LOG-14 — Suppression/conservation :** aucune suppression ou conservation automatique n'est codée avant arbitrage des règles, exceptions et obligations applicables.

## 8. Correspondance indicative avec les familles API de l'étape C

| Famille logique | Entités principalement concernées | Contrôle critique |
|---|---|---|
| Identité / accès | UserIdentity, Tenant, Membership, Workspace | Appartenance active et autorisation par ressource |
| Organisations | Organization, Establishment | Séparer identité et dossier contextualisé |
| CRM | CrmCompanyRecord, Contact, CrmActivity, Campaign, Opportunity | Périmètre CRM interne ou tenant explicitement établi |
| Collecte / sources | SourceDefinition, SourceRecord, Provenance | Source, finalité et droits de réutilisation |
| Veille / qualification | Signal, MatchCandidate, Qualification | Pas de transfert ou de prospection implicite |
| Restrictions / prospection | Restriction, EligibilityAssessment | Contrôle au moment de l'action |
| Transferts / partages | TransferRequest, TransferDecision, SharedProjection | Décision, champs, destinataire, expiration et révocation |
| Publication | PublicationSubmission, ModerationDecision, PublicProjection | Modération et liste blanche de champs |
| BrainOS | Corpus, Document, DocumentVersion, IndexEntry | Autorisation documentaire à chaque restitution |
| Audit / cycle de vie | AuditEvent, RetentionRule, DeletionRequest | Accès dédié, minimisation, politique validée |

Cette table n'arrête ni les URI, ni les verbes HTTP, ni les enveloppes JSON. Les contrats C devront définir séparément les opérations de lecture, mutation, recherche, partage, export et suppression.

## 9. Scénarios de validation logique à ajouter aux tests

| ID | Scénario | Résultat attendu |
|---|---|---|
| LOG-T01 | Deux tenants possèdent des dossiers contextualisés pour le même SIREN | Aucun accès croisé ; aucune fusion automatique |
| LOG-T02 | Une membership du tenant A référence un workspace du tenant B | Relation rejetée |
| LOG-T03 | Un contact lié à une entreprise du tenant A est demandé depuis B | Refus sans divulgation |
| LOG-T04 | Un client tente de lire CrmCompanyRecord via un identifiant connu | Refus |
| LOG-T05 | Un rapprochement trouve une fiche CRM privée | Résultat filtré selon les droits ; aucune révélation implicite |
| LOG-T06 | Une TransferDecision est expirée avant exécution | Projection non créée |
| LOG-T07 | Une projection est révoquée puis demandée via recherche et URL directe | Refus dans les deux cas |
| LOG-T08 | Une recherche BrainOS trouve un document interdit | Aucun extrait ni métadonnée révélatrice |
| LOG-T09 | Une version de document est retirée du corpus | Index correspondant non restitué après invalidation prévue |
| LOG-T10 | Une restriction est ajoutée après préparation d'une campagne | Éligibilité recalculée ; action bloquée si restriction applicable |
| LOG-T11 | Un enregistrement source est normalisé puis transféré | Provenance et référence source conservées |
| LOG-T12 | Un champ non approuvé figure dans la fiche source | Champ absent de PublicProjection et SharedProjection |
| LOG-T13 | Un utilisateur révoqué conserve un lien de téléchargement | Accès refusé selon la politique de révocation |
| LOG-T14 | Une suppression est demandée sur une ressource soumise à conservation | Traitement selon règle validée, décision auditée |

Ces scénarios complètent les tests PERM-01 à PERM-15 de la matrice de permissions ; ils ne remplacent pas les tests d'autorisation API et base de données.

## 10. Décisions à prendre avant le modèle physique

| ID | Sujet | Question à arbitrer | Dépendance |
|---|---|---|---|
| MOD-01 | Identité d'entreprise | Référentiel global unique ou identités fédérées par source avec rapprochement ? | B-04 |
| MOD-02 | Dossiers contextualisés | Plusieurs dossiers pour une même identité dans des périmètres distincts ? | B-04 |
| MOD-03 | Contact | Identité globale minimale ou contact strictement contextualisé ? | B-04, règles de minimisation |
| MOD-04 | Tenant / organisation | Cardinalité et règles d'évolution organisation/tenant ? | B-01 |
| MOD-05 | Workspace | Un ou plusieurs workspaces et granularité des membres ? | B-01, P-04 |
| MOD-06 | Partage | Vue dynamique ou copie contrôlée ? | B-05, P-05 |
| MOD-07 | Historique | Politique d'historisation et correction des données sources ? | B-08, B-10 |
| MOD-08 | Suppression | Suppression physique, logique, anonymisation et exceptions ? | B-10 |
| MOD-09 | BrainOS | Granularité corpus/document et indexation multi-périmètre ? | B-03, P-09 |
| MOD-10 | Identifiants | Stratégie d'identifiants internes et externes, sans clé métier d'autorisation ? | C-01/C-02 |
| MOD-11 | Restrictions | Portée, priorité et source de vérité des oppositions/restrictions ? | B-09 |
| MOD-12 | Audit | Événements obligatoires, accès, durée et intégrité des traces ? | B-10, P-10 |

Aucune réponse n'est présumée dans ce document.

## 11. Critères de sortie du lot 2.2

Le modèle logique pourra être considéré suffisamment stabilisé pour préparer les contrats détaillés lorsque :

- les entités de base et leurs propriétaires sont acceptés ;
- les relations entre tenant, workspace, membership et ressources sont arbitrées ;
- la séparation identité d'entreprise / dossier contextualisé / établissement est confirmée ;
- les objets de transfert et de projection sont compatibles avec la décision de partage ;
- les restrictions et finalités sont intégrées au parcours d'action ;
- les règles de cycle de vie et d'audit ont un propriétaire ;
- les scénarios LOG-T01 à LOG-T14 sont acceptés comme exigences ;
- les décisions B concernées sont mises à jour avec date, auteur et justification.

## 12. Hors périmètre et références

Le prolongement contractuel est décrit dans [LOT-2-TRAÇABILITE-CONTRATS-API.md](LOT-2-TRAÇABILITE-CONTRATS-API.md) : registre des familles API, permissions, contrôles, erreurs, idempotence et tests. Il ne crée pas d'API active.

Ce document ne crée aucune table, migration, policy, endpoint, rôle, permission ou donnée. Il ne vaut ni validation juridique, ni choix de fournisseur, ni validation des décisions B.

Documents liés :
- [Référentiel de cohérence A/B/C](CONSOLIDATION-A-B-C-REFERENTIEL.md)
- [Lot 2 — Propriété des données et cloisonnement](LOT-2-PROPRIETE-DONNEES-CLOISONNEMENT.md)
- [Lot 2 — Matrice de permissions proposée](LOT-2-MATRICE-PERMISSIONS-PROPOSITION.md)
- [Lot 2.3 — Traçabilité des contrats API](LOT-2-TRAÇABILITE-CONTRATS-API.md)
- [Étape B — Modèle de données et cloisonnement](ETAPE-B-MODELE-DONNEES-CLOISONNEMENT.md)
- [Étape C — Contrats API et événements](ETAPE-C-CONTRATS-API-EVENEMENTS.md)
