# MajestiOS 3.0 — Lot 2 : propriété des données, cloisonnement CRM et espaces clients

**Date :** 3 novembre 2026  
**Branche de travail :** `docs/consolidation-abc-2026-11-03`  
**Base documentaire :** étape B — modèle conceptuel des données et cloisonnement ; référentiel de cohérence A/B/C.  
**Statut :** dossier de clarification et de préparation à arbitrage — aucune décision B-01 à B-10 n'est validée par ce document.  
**Périmètre :** documentation uniquement. Aucun schéma SQL, backend, politique RLS, rôle applicatif ou parcours client n'est implémenté ici.

---

## 1. Objet du lot

Le lot 2 approfondit le domaine B afin de rendre vérifiables les frontières de propriété et d'accès avant tout modèle logique ou développement backend.

Il répond à cinq questions structurantes :

1. Qui est propriétaire fonctionnel d'une donnée et qui en est responsable ?
2. Dans quel périmètre de sécurité la donnée réside-t-elle ?
3. Qui peut la consulter, la modifier, la partager ou l'exporter ?
4. Que devient une donnée lorsqu'elle est rapprochée ou transmise à un autre périmètre ?
5. Comment démontrer qu'un client ne peut atteindre ni les données d'un autre client, ni le CRM interne ?

Ce document complète l'étape B ; il ne la remplace pas. En cas de divergence, les propositions de l'étape B et les décisions explicitement validées par le porteur du projet restent déterminantes. Les points non tranchés sont maintenus comme questions ouvertes.

## 2. Règles de lecture et de gouvernance

Les termes suivants sont employés strictement :

- **Constat documentaire** : élément déjà décrit dans l'étape B ou dans le référentiel A/B/C.
- **Clarification** : reformulation destinée à rendre une règle testable, sans créer une nouvelle décision.
- **Recommandation** : option à examiner, non validée.
- **À arbitrer** : choix qui requiert une décision explicite.
- **Validé** : uniquement après confirmation explicite et traçable du porteur du projet.

Aucune table conceptuelle, matrice ou séquence de ce dossier ne vaut autorisation d'implémenter. Les décisions B-01 à B-10 conservent leur statut **À valider**.

## 3. Cartographie des périmètres de propriété

### 3.1 Périmètres à séparer

| Périmètre | Propriétaire fonctionnel | Exemples de données | Règle de frontière |
|---|---|---|---|
| Interne MajestiOS | Organisation MajestiOS / domaines internes habilités | CRM, notes internes, qualification, Veille, Prospection active, campagnes, activités | Aucune exposition directe aux comptes clients |
| Tenant client | Organisation cliente concernée | Membres, dossiers, documents, commentaires, éléments de travail | Accès limité aux membres et permissions de ce tenant |
| Publication publique | Domaine Publication / modération pour les champs publiés | Projection publique d'une annonce validée | Seuls les champs explicitement publiés sont accessibles au public |
| Sources externes | Domaine Collecte, sous réserve des droits de la source | Référence source, enregistrement collecté, provenance, dates | Accès et réutilisation soumis aux conditions de la source et à la finalité |
| BrainOS | Propriétaire du corpus et gouvernance documentaire à préciser | Corpus, documents, versions, métadonnées, index | Autorisation documentaire indépendante des autres périmètres |
| Audit | Fonction d'audit et de sécurité habilitée | Traces d'accès, décisions, mutations, transferts | Journal minimisé, accès restreint et lui-même audité |

La propriété fonctionnelle indique le domaine responsable du cycle de vie et de la qualité. Elle ne signifie pas que tous les membres de ce domaine disposent automatiquement d'un droit de lecture ou de modification.

### 3.2 Ne pas confondre identité, dossier et droit d'accès

Trois niveaux doivent rester distincts :

- **Identité d'entreprise** : identité d'une personne morale ou organisation, notamment à l'aide du SIREN lorsqu'il existe.
- **Établissement** : implantation rattachée à une entreprise, notamment identifiée par SIRET.
- **Dossier/contextualisation** : informations, notes, relations, pièces et historique détenus par un périmètre donné.

Un identifiant commun peut permettre un rapprochement, mais ne fusionne pas les dossiers et ne donne aucun droit d'accès à leur contenu. La présence d'une même entreprise dans le CRM interne et dans un tenant client ne rend pas les informations interchangeables.

## 4. Référentiel CRM interne

### 4.1 Frontière

Le CRM interne MajestiOS est un périmètre organisationnel spécifique. Il ne doit pas être modélisé comme un tenant client ordinaire.

Les objets métier envisagés dans l'étape B comprennent notamment :

- entreprise et établissement ;
- contact et relation contact/entreprise ;
- activité CRM et interaction réalisée ;
- campagne et action commerciale ;
- signal, rapprochement et opportunité ;
- restrictions et oppositions applicables ;
- décisions et historique de transfert.

Cette liste décrit les concepts documentés, pas un schéma physique arrêté.

### 4.2 Contrôles d'accès

Une opération CRM doit être autorisée selon l'identité, le rôle interne, la permission précise, la ressource et la finalité. Le simple fait d'être authentifié, opérateur, modérateur ou administrateur technique ne doit pas accorder un accès CRM global.

Les accès privilégiés doivent être limités, motivés, traçables et révocables. La séparation des tâches et les accès d'urgence restent à définir dans la matrice des permissions.

### 4.3 Interdictions structurantes

- Un compte client ne lit ni ne modifie le CRM interne.
- Un tenant ne peut pas découvrir indirectement l'existence d'une fiche CRM privée par une recherche, un rapprochement ou un message d'erreur trop révélateur.
- Une donnée déposée par un client n'enrichit pas le CRM interne par défaut.
- Une projection partagée ne permet pas de remonter vers les champs, notes, contacts ou pièces non partagés.
- Un export ou une tâche asynchrone ne contourne pas les contrôles appliqués à une lecture interactive.

## 5. Espaces clients et modèle de tenant

### 5.1 Définition fonctionnelle

Un **tenant** représente la frontière d'une organisation cliente. Il regroupe les membres, appartenances, rôles, permissions et données propres à cette organisation.

Un **workspace** ou dossier de travail est un espace fonctionnel appartenant à un tenant. L'étape B prévoit ce concept, mais ne tranche pas encore si un tenant pourra contenir plusieurs workspaces indépendants dès la première version.

### 5.2 Appartenance

Le modèle conceptuel prévoit une appartenance utilisateur/tenant (Membership) avec rôle, état et période de validité. Les règles détaillées restent à arbitrer pour :

- invitation et acceptation ;
- activation, suspension et révocation ;
- départ d'un membre ;
- changement de rôle ;
- sessions et délai de prise en compte d'une révocation ;
- cumul éventuel de plusieurs rôles ;
- accès d'un même utilisateur à plusieurs tenants.

L'identifiant du tenant transmis par le navigateur n'est jamais une preuve d'appartenance ou d'autorisation. Le serveur doit déterminer et vérifier le contexte autorisé.

### 5.3 Règles minimales de cloisonnement

Chaque objet métier appartenant à un tenant doit être rattaché à ce tenant selon une règle cohérente. Toute lecture, écriture, suppression, recherche, téléchargement, export et tâche différée doit appliquer le même contrôle de périmètre.

Les relations entre objets doivent être contrôlées elles aussi : un objet du tenant A ne peut pas référencer un document, un commentaire ou une ressource du tenant B pour contourner l'isolation.

### 5.4 Modèle technique non arbitré

L'étape B propose d'évaluer en premier une base relationnelle partagée avec séparation logique stricte, identifiant de tenant obligatoire, politiques de sécurité au niveau des lignes lorsque disponibles et autorisation serveur. Cette option n'est pas validée.

Elle doit être comparée aux schémas séparés et bases séparées selon la confidentialité attendue, la résidence, les sauvegardes/restaurations, l'exploitation, les coûts et la réversibilité. Le choix technique appartient à l'étape d'arbitrage et de preuve de concept.

## 6. Rapprochement des entreprises sans fusion de propriété

### 6.1 Principe

Le rapprochement entre une entreprise du CRM interne, une entreprise connue d'un tenant ou un signal externe doit produire une proposition explicable. Il ne doit pas provoquer automatiquement :

- une fusion des fiches ;
- la copie de notes ou d'historiques ;
- la révélation de l'existence d'un dossier privé ;
- l'enrichissement du CRM à partir de données client ;
- l'ouverture d'un accès entre périmètres.

### 6.2 Traçabilité attendue

La proposition de rapprochement devrait conserver, selon le modèle B :

- les références des objets comparés et leurs périmètres ;
- les critères et identifiants utilisés ;
- le score ou niveau de confiance, s'il existe, et son explication ;
- la version de la règle de rapprochement ;
- l'état de revue et l'acteur décisionnaire ;
- la date et la provenance des données examinées.

La visibilité du résultat de rapprochement est elle-même soumise à autorisation. Un identifiant légal commun ne prouve ni la pertinence commerciale, ni la compétence, ni la capacité opérationnelle.

## 7. Partage CRM vers un tenant client

### 7.1 Nature du partage

Le partage doit être explicite et limité. Il ne donne jamais au client un accès direct à l'enregistrement CRM source. Le mécanisme décrit dans l'étape B est une projection de champs ou documents autorisés, liée à un tenant destinataire et à une finalité.

La décision de partage doit pouvoir identifier au minimum :

- l'objet source et son périmètre ;
- le tenant destinataire ;
- les champs ou documents autorisés ;
- la finalité et le motif ;
- le demandeur et l'acteur ayant autorisé ;
- le statut, les dates d'effet et, si nécessaire, l'expiration ;
- les accès ou opérations de partage à auditer ;
- la possibilité de révocation.

### 7.2 Cycle proposé à préciser

Le cycle de partage à spécifier avant implémentation est :

1. demande de partage ;
2. vérification de la propriété et des droits sur la source ;
3. vérification de la finalité et de la nécessité des champs ;
4. décision explicite (approbation, refus ou attente) ;
5. création ou actualisation de la projection autorisée ;
6. contrôle d'accès du tenant destinataire ;
7. journalisation des accès et changements ;
8. expiration ou révocation ;
9. traitement des caches, exports et copies déjà téléchargées.

Ce cycle est une clarification de conception, pas un workflow implémenté ni une décision sur la personne habilitée à approuver.

### 7.3 Arbitrage majeur : vue dynamique ou copie

L'étape B et le référentiel A/B/C identifient explicitement ce point comme ouvert. Deux familles de solutions doivent être comparées :

| Option | Principe | Questions à résoudre |
|---|---|---|
| Vue/projection dynamique | Le client consulte une projection calculée depuis la source autorisée | Effet immédiat des changements, disponibilité de la source, cache, historique de ce qui a été vu |
| Copie contrôlée | Une projection est matérialisée dans le tenant destinataire | Synchronisation, divergence, correction, suppression, révocation et copies exportées |

Aucune option n'est retenue dans ce lot. Dans les deux cas, le client ne doit recevoir que les champs autorisés et ne doit pas pouvoir accéder à l'objet source complet.

### 7.4 Révocation et limites

La révocation doit empêcher les accès futurs à la projection selon une politique définie. Les effets sur les caches, exports et fichiers téléchargés doivent être explicitement documentés. Il ne faut pas promettre l'effacement à distance d'une copie déjà téléchargée hors du contrôle de la plateforme ; les obligations, notifications et mesures possibles doivent être arbitrées séparément.

## 8. BrainOS : frontière documentaire indépendante

BrainOS dispose d'un périmètre documentaire propre : corpus, documents, versions, métadonnées, droits et index éventuel.

Règles conceptuelles reprises de B :

- un document n'est indexable que si son origine, son propriétaire et les droits d'usage sont connus ;
- un index vectoriel n'est pas une frontière de sécurité ;
- chaque résultat doit être filtré et autorisé selon le corpus et les droits du demandeur ;
- aucun accès CRM ou tenant n'est hérité implicitement ;
- les droits d'un compte de service d'indexation doivent être strictement limités.

Reste à arbitrer : corpus par utilisateur, par organisation, ou corpus MajestiOS partagé avec droits documentaires ; niveau de séparation physique/logique ; rôles de gestion et de consultation ; règles de dépôt, versionnement, retrait et conservation.

## 9. Classification et cycle de vie

L'étape B distingue cinq niveaux fonctionnels : public validé, compte utilisateur, tenant client, interne MajestiOS et restreint/sensible. Cette classification n'est pas une qualification juridique.

Pour chaque famille de données, le modèle détaillé devra préciser :

| Dimension | Question à résoudre |
|---|---|
| Origine | Qui crée ou collecte la donnée ? |
| Propriétaire | Quel domaine ou tenant en est responsable ? |
| Finalité | Pour quelle finalité précise est-elle utilisée ? |
| Classification | Quel niveau de visibilité et de sensibilité s'applique ? |
| Accès | Qui peut lire, modifier, partager, exporter ou supprimer ? |
| Conservation | Quelle durée ou quel critère de fin s'applique ? |
| Retrait | Comment archiver, retirer, supprimer ou anonymiser ? |
| Propagation | Comment appliquer restrictions, oppositions et révocations ? |
| Sauvegardes | Dans quel délai une suppression se propage-t-elle aux sauvegardes ? |
| Preuve | Quelle trace minimisée démontre l'opération ? |

Aucune durée chiffrée ni base légale n'est fixée dans ce lot. Ces éléments doivent être déterminés par catégorie, finalité et obligations applicables avant toute donnée réelle.

## 10. Matrice de contrôle à conserver comme base de test

| Acteur | CRM interne | Tenant A | Tenant B | BrainOS |
|---|---|---|---|---|
| Visiteur non authentifié | Refus | Refus | Refus | Refus |
| Utilisateur client A | Refus | Selon rôle | Refus | Selon corpus autorisé |
| Utilisateur client B | Refus | Refus | Selon rôle | Selon corpus autorisé |
| Opérateur CRM MajestiOS | Selon rôle interne | Pas d'accès implicite | Pas d'accès implicite | Pas d'accès implicite |
| Modérateur | Selon habilitation distincte | Pas d'accès implicite | Pas d'accès implicite | Refus par défaut |
| Administrateur technique | Aucun accès métier automatique | Aucun accès métier automatique | Aucun accès métier automatique | Aucun accès métier automatique |
| Compte de service | Périmètre strictement déclaré | Périmètre strictement déclaré | Périmètre strictement déclaré | Périmètre strictement déclaré |

Cette matrice est un socle de scénarios, pas une matrice complète de permissions validée. « Selon rôle » impose une définition ultérieure par ressource, action et finalité.

## 11. Batterie anti-régression sécurité

Avant toute ouverture à des données réelles, les tests suivants doivent être reproductibles et intégrés aux contrôles CI lorsqu'ils seront implémentés :

1. Client A ne lit, ne modifie et ne supprime aucune donnée de B.
2. Client B ne lit, ne modifie et ne supprime aucune donnée de A.
3. Un client ne consulte pas le CRM interne, y compris avec un identifiant valide deviné.
4. Un visiteur non authentifié n'accède à aucune ressource privée.
5. La révocation d'un membre retire ses droits selon le délai de session explicitement défini.
6. Un opérateur sans permission CRM ne lit ni ne modifie le CRM.
7. Un modérateur n'hérite pas de droits CRM ou BrainOS.
8. Les recherches globales, filtres, pagination, exports et traitements asynchrones respectent le même cloisonnement.
9. Un fichier privé ne peut pas être téléchargé par un autre tenant en modifiant son URL ou son identifiant.
10. Une projection partagée ne révèle aucun champ non autorisé de l'objet source.
11. Une révocation bloque les nouveaux accès à la projection et déclenche le traitement documenté des caches.
12. Une opposition ou restriction bloque l'action commerciale pertinente, même si une ancienne éligibilité était positive.
13. Un compte de service n'accède qu'aux ressources et opérations explicitement attribuées.
14. Les relations entre objets ne permettent pas de traverser un périmètre (référence croisée vers document, contact ou activité d'un autre tenant).
15. Les erreurs d'autorisation ne révèlent pas l'existence ou le contenu d'une ressource privée.

Jeux de test minimaux : un visiteur anonyme, deux tenants distincts avec plusieurs membres, un opérateur CRM avec permissions limitées, un modérateur, un administrateur technique sans droit métier, et un compte de service restreint. Les données de test doivent être fictives.

## 12. Registre des décisions B

Les identifiants et statuts ci-dessous reprennent l'étape B. Les recommandations ne sont pas promues en décisions.

| ID | Sujet | Position documentaire actuelle | Statut |
|---|---|---|---|
| B-01 | Modèle de tenant client | Base partagée et séparation logique renforcée : hypothèse de départ à comparer aux schémas/bases séparés | À valider |
| B-02 | CRM interne | Périmètre organisationnel distinct, jamais un tenant client standard | À valider |
| B-03 | BrainOS | Frontière de données et de permissions indépendante | À valider |
| B-04 | Fiches entreprise entre CRM et tenants | Aucune fusion ni enrichissement croisé automatique | À valider |
| B-05 | Partage CRM vers client | Projection limitée, explicite, révocable et historisée ; vue dynamique ou copie non tranchée | À valider |
| B-06 | Données d'annonce | Séparer contenu privé, décision de modération et champs publics | À valider |
| B-07 | Rapprochements | Proposition explicable puis validation selon les règles métier | À valider |
| B-08 | Restrictions et oppositions | Registre central de restrictions consulté avant chaque action pertinente | À valider |
| B-09 | Audit | Journal append-only logique, accès restreint et contenu minimisé | À valider |
| B-10 | Conservation | Durées définies par catégorie et finalité avant données réelles | À valider |

## 13. Questions à arbitrer — sans réponse implicite

Les questions complémentaires du document B restent ouvertes :

1. Plusieurs utilisateurs et plusieurs rôles par espace client dès la première version ?
2. Un client peut-il posséder plusieurs espaces ou dossiers indépendants dans son tenant ?
3. Le dépôt de fichiers client est-il inclus dès le premier lot ou différé jusqu'à la définition de la politique documentaire ?
4. BrainOS utilise-t-il un corpus par utilisateur, par organisation, ou un corpus MajestiOS partagé avec droits documentaires ?
5. Qui peut demander et qui peut approuver un partage CRM vers un client ?

S'y ajoutent les précisions nécessaires à une spécification exploitable :

6. Un utilisateur peut-il appartenir à plusieurs tenants et basculer entre eux ?
7. Quels rôles client minimaux sont nécessaires et quelles actions leur sont associées ?
8. Quel délai de révocation des sessions est acceptable ?
9. La projection CRM vers client doit-elle être une vue dynamique ou une copie contrôlée ?
10. Quelle est la politique pour caches, exports, fichiers téléchargés et sauvegardes après révocation/suppression ?
11. Quelles opérations d'administration d'urgence sont permises, par qui, pour quelle durée et avec quelle approbation ?
12. Quelles familles de données et quelles finalités doivent être traitées dans le premier périmètre de preuve de concept ?

Ces questions doivent recevoir une décision datée ou rester explicitement différées. Aucun choix n'est déduit de ce document.

## 14. Dépendances et ordre de travail recommandé

Le modèle logique détaillé ne doit pas précéder les arbitrages de propriété et d'accès. Ordre recommandé :

1. confirmer/corriger les frontières fonctionnelles de l'étape A ;
2. arbitrer B-01 à B-10 et les questions complémentaires pertinentes ;
3. définir la matrice rôles × ressources × actions × périmètres ;
4. préciser le cycle de vie et les règles de conservation par catégorie ;
5. définir le partage CRM-client et la révocation ;
6. définir le périmètre BrainOS ;
7. traduire les décisions en modèle logique et contraintes d'intégrité ;
8. rattacher les permissions aux contrats API de l'étape C ;
9. concevoir les tests négatifs avant le premier endpoint protégé ;
10. conduire la preuve de concept dans un environnement isolé, sans données réelles.

## 15. Critères de sortie du lot 2

Le lot 2 documentaire est prêt pour arbitrage lorsque :

- [x] les périmètres de propriété et leurs frontières sont explicités à partir de l'étape B ;
- [x] la séparation identité d'entreprise / établissement / dossier est rappelée ;
- [x] les règles CRM interne / tenants / BrainOS sont structurées ;
- [x] le partage CRM-client et son arbitrage vue/copie sont explicités ;
- [x] la matrice de contrôle et les tests négatifs sont consolidés ;
- [x] les décisions B-01 à B-10 conservent leur statut « À valider » ;
- [x] les questions ouvertes sont visibles et non résolues artificiellement ;
- [ ] les arbitrages du porteur du projet sont recueillis ;
- [ ] la matrice de permissions est validée ;
- [ ] le modèle logique et les politiques techniques sont spécifiés ;
- [ ] les tests de sécurité sont implémentés et passés.

Les quatre derniers points sont volontairement hors de ce lot documentaire et conditionnent les étapes suivantes.

## 16. Hors périmètre et limites

Ce lot ne réalise pas :

- de choix entre base partagée, schémas séparés ou bases séparées ;
- de validation de Supabase, PostgreSQL RLS ou d'un fournisseur d'identité ;
- de schéma SQL, migration ou politique RLS ;
- de création de rôles, comptes, tenants ou espaces clients ;
- d'implémentation de partage, révocation, audit ou suppression ;
- de validation juridique des finalités, durées ou sources ;
- de création de backend ou de modification du prototype statique ;
- de test applicatif ou de test d'intrusion.

Aucune fuite de données n'est affirmée par ce dossier. Il formalise des risques de conception à traiter avant l'activation de données et services réels.

## 17. Références internes

- [Étape B — Modèle conceptuel des données et cloisonnement](ETAPE-B-MODELE-DONNEES-CLOISONNEMENT.md)
- [Référentiel de cohérence documentaire A/B/C](CONSOLIDATION-A-B-C-REFERENTIEL.md)
- [Étape A — Architecture fonctionnelle](ETAPE-A-ARCHITECTURE-FONCTIONNELLE.md)
- [Étape C — Contrats API et événements](ETAPE-C-CONTRATS-API-EVENEMENTS.md)
- [Audit comparatif technique](AUDIT-COMPARATIF-TECHNIQUE.md)
- [Migration évolution 3.0](MIGRATION-EVOLUTION-3.0.md)
