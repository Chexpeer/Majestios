# MajestiOS 3.0 — Référentiel de cohérence documentaire A, B et C

**Date :** 3 novembre 2026  
**Branche de référence examinée :** `evolution-3.0`  
**Branche de travail documentaire :** `docs/consolidation-abc-2026-11-03`  
**Statut :** document de consolidation et de traçabilité — les décisions métier et techniques restent soumises à validation explicite.  
**Périmètre :** documentation uniquement ; aucune implémentation applicative.

---

## 1. Objet et règle de lecture

Ce document facilite la lecture croisée des étapes A, B et C. Il ne remplace pas ces documents et ne transforme pas leurs propositions en décisions validées.

Les documents spécialisés restent les références détaillées de leur domaine :

| Domaine | Document de référence | Responsabilité |
|---|---|---|
| A — Frontières fonctionnelles | [ETAPE-A-ARCHITECTURE-FONCTIONNELLE.md](ETAPE-A-ARCHITECTURE-FONCTIONNELLE.md) | Modules, responsabilités, flux et interdictions |
| B — Données et cloisonnement | [ETAPE-B-MODELE-DONNEES-CLOISONNEMENT.md](ETAPE-B-MODELE-DONNEES-CLOISONNEMENT.md) | Propriété fonctionnelle, entités, périmètres et isolation |
| C — Contrats | [ETAPE-C-CONTRATS-API-EVENEMENTS.md](ETAPE-C-CONTRATS-API-EVENEMENTS.md) | Routes, commandes, événements, transferts et garanties |
| Architecture cible antérieure | [ARCHITECTURE-API-CIBLE.md](ARCHITECTURE-API-CIBLE.md) | Proposition d'architecture globale à réaligner |
| Migration | [MIGRATION-EVOLUTION-3.0.md](MIGRATION-EVOLUTION-3.0.md) | Lots, dépendances et gouvernance de migration |

### 1.1 Statuts à employer

- **VALIDÉ** : décision explicitement confirmée par le porteur du projet.
- **À VALIDER** : proposition existante qui attend une décision.
- **PROPOSÉ** : recommandation de conception non arbitrée.
- **DIFFÉRÉ** : volontairement hors du périmètre courant.
- **OBSOLÈTE** : contenu remplacé explicitement, avec référence vers son successeur.

La présence d'une proposition dans un diagramme, une table ou un exemple ne vaut pas validation. Une recommandation de ce document ne devient pas une décision sans validation explicite.

### 1.2 Hiérarchie de lecture en cas de divergence

1. Une décision explicitement validée et datée par le porteur du projet prévaut.
2. À défaut, les documents spécialisés A, B et C décrivent les propositions propres à leur domaine et conservent leur statut « à confirmer » ou « à valider ».
3. L'architecture cible et les anciens plans de migration sont des propositions de synthèse à réaligner ; ils ne peuvent pas invalider silencieusement A, B ou C.
4. Toute contradiction non résolue est inscrite au registre de la section 7. Aucun choix implicite n'est effectué.

---

## 2. Socle fonctionnel commun

La chaîne de valeur de MajestiOS est :

**Détecter → Qualifier → Identifier → Contacter → Transformer → Capitaliser.**

Cette chaîne décrit un parcours commercial possible, pas une automatisation obligatoire. La détection ou la qualification d'un signal ne crée pas, à elle seule, une autorisation de transfert CRM ou de prospection.

Les principes communs proposés dans A, B et C sont :

1. Chaque domaine a une responsabilité métier identifiable.
2. La proximité technique de deux données ne crée aucun droit d'accès ou de partage.
3. Le CRM interne MajestiOS est distinct des espaces clients.
4. Chaque tenant client est isolé des autres tenants.
5. BrainOS possède un périmètre documentaire et des permissions propres.
6. Les données issues de sources externes conservent leur provenance.
7. Un rapprochement est distinct d'une fusion ou d'un enrichissement.
8. Une annonce soumise, sa modération et sa projection publique sont des objets/états distincts.
9. Veille et Prospection active sont des domaines distincts.
10. Toute transmission est explicite, limitée, justifiée, autorisée et traçable.
11. Les recherches, exports et traitements asynchrones appliquent les mêmes règles d'accès que les requêtes interactives.
12. En cas de droit, de finalité ou d'information manquante : refus ou mise en attente, jamais autorisation implicite.

Ces principes sont cohérents entre A, B et C. Leur validation formelle reste à effectuer au moyen des décisions A-01 à A-10, B-01 à B-10 et C-01 à C-10.

---

## 3. Frontières fonctionnelles — synthèse de l'étape A

| Domaine | Responsabilité | Interdiction structurante |
|---|---|---|
| Interface publique | Présentation, recherche et saisie temporaire | Aucun secret, décision d'autorisation ou accès direct aux données internes |
| Identité et accès | Identité, sessions, rôles, appartenances et permissions | Ne décide pas de la finalité métier à la place du domaine responsable |
| Collecte | Sources autorisées, provenance et normalisation | Ne déclenche pas directement une prospection |
| Réception / qualification | Contrôle, dédoublonnage, classement et routage | Aucun droit automatique vers une destination |
| Recherche / opportunités | Résultats autorisés et projections | N'expose jamais le CRM brut |
| Publication / modération | Dépôt, examen, publication, retrait et expiration | Une annonce n'est pas automatiquement réutilisable commercialement |
| Veille | Signaux, analyses et rapprochements | Un signal ou un rapprochement ne vaut pas autorisation de contacter |
| CRM interne | Référentiel et historique commercial interne | N'est pas une base partagée avec les clients |
| Prospection active | Préparation et suivi des actions autorisées | Pas d'action sans contrôle préalable d'éligibilité et d'opposition |
| Espaces clients | Données et dossiers propres à chaque client | Aucun accès au CRM interne ou à un autre tenant |
| BrainOS | Corpus et recherche documentaires autorisés | Aucun accès implicite au CRM ou aux espaces clients |
| Audit | Traces des accès et décisions sensibles | Ne devient pas une copie générale du contenu métier |

### 3.1 Décisions A

Les dix décisions A-01 à A-10 figurant dans le document A sont toutes **À CONFIRMER** dans la référence examinée. Elles couvrent notamment la séparation du CRM, de Veille et de Prospection, la frontière BrainOS, les transferts, l'isolation des tenants, les projections de recherche et les contrôles de prospection.

Le critère de sortie de A est la confirmation ou la correction explicite de ces dix propositions, puis la mise en cohérence des responsabilités, interdictions et échanges.

---

## 4. Propriété et cloisonnement — synthèse de l'étape B

### 4.1 Trois périmètres distincts

| Périmètre | Contenu | Règle |
|---|---|---|
| Interne MajestiOS | CRM, qualification, Veille, Prospection, administration et modération | Accès réservé aux rôles internes habilités |
| Tenant client | Membres, dossiers, documents et données propres au client | Isolation entre tenants et autorisation par appartenance/permission |
| BrainOS | Corpus, documents, versions, métadonnées et index | Autorisation documentaire indépendante |

Le CRM interne n'est pas un tenant client ordinaire. BrainOS n'hérite d'aucun droit depuis le CRM ou les espaces clients.

### 4.2 Trois notions à ne pas confondre

- **Identité d'entreprise** : personne morale ou organisation, identifiée notamment par SIREN lorsqu'il existe.
- **Établissement** : implantation ou unité, identifiée notamment par SIRET.
- **Relation commerciale** : relation entre entreprise, contact et organisation, avec fonction, période et provenance.

Une entreprise peut apparaître dans le CRM interne et dans un espace client. Cela ne rend pas les fiches, notes, contacts, pièces ou historiques partageables.

### 4.3 Règles de prudence sur le rapprochement

- Le rapprochement peut être proposé à partir d'un identifiant légal ou de critères documentés.
- Aucun rapprochement ne fusionne automatiquement les données.
- Les données privées d'un client n'enrichissent pas le CRM interne par défaut.
- Un identifiant commun ne doit pas révéler à un client l'existence d'une fiche privée appartenant à un autre périmètre.
- La visibilité d'une correspondance, d'un résultat ou d'un état de rapprochement doit elle-même être autorisée.

### 4.4 Partage CRM vers client

Un partage doit être représenté par une projection explicite, limitée aux champs ou documents autorisés, et associée au tenant destinataire, à une finalité, un motif, un acteur, une durée/statut et une possibilité de révocation.

Le partage ne donne pas accès à la fiche CRM source. Les modifications du client restent dans son propre espace.

**Point encore ouvert :** décider si le partage est une vue dynamique ou une copie, puis définir expiration, révocation, invalidation des caches, traitement des exports et limites des copies déjà téléchargées.

### 4.5 Décisions B

Les dix décisions B-01 à B-10 sont **À VALIDER** dans la référence examinée. Elles couvrent le modèle de tenant, le CRM interne, BrainOS, les fiches entreprise, les partages, les annonces, les rapprochements, les restrictions/oppositions, l'audit et la conservation.

Le modèle B est conceptuel : il ne constitue ni un schéma SQL définitif ni une base implémentée. Les relations d'appartenance et contraintes de sécurité restent à détailler dans le modèle logique.

---

## 5. Contrats API, transferts et événements — synthèse de l'étape C

### 5.1 Conventions API proposées par C

Le document C propose une API REST/JSON versionnée sous `/api/v1`, une spécification OpenAPI comme référence des routes, des enveloppes homogènes et une autorisation serveur par action, ressource, rôle et périmètre.

La convention précise des réponses, erreurs, pagination, routes et identifiants doit être arrêtée dans un contrat canonique. Les exemples de l'architecture cible antérieure ne doivent pas être combinés avec C sans arbitrage explicite.

### 5.2 Commande, événement et notification

- Une **commande** demande une opération et peut être refusée.
- Un **événement** annonce un fait métier déjà validé.
- Une **notification** informe un utilisateur ou un opérateur ; elle ne remplace pas l'événement de référence.

Un événement ne constitue jamais une autorisation de transfert. Le consommateur réévalue les permissions, le périmètre et la finalité avant toute action.

### 5.3 Modèle de transfert

Le concept de référence proposé par B et détaillé par C est **TransferDecision**.

Une décision de transfert doit pouvoir documenter au minimum :
- la source et sa provenance ;
- le domaine et la ressource source ;
- le domaine, l'espace ou tenant destinataire ;
- la finalité et la version de règle ;
- les champs/projections demandés ;
- le demandeur et l'acteur décisionnaire ;
- le statut, le motif et les dates ;
- l'expiration, la corrélation et le résultat d'exécution ;
- la révocation et le traitement des transmissions déjà réalisées.

Le cycle distingue demande, contrôles, revue éventuelle, approbation/rejet, recontrôle au moment de l'exécution, réception de la projection et historisation. Une approbation ancienne n'est pas un passe-droit permanent.

### 5.4 Événements

C propose une enveloppe versionnée contenant notamment un identifiant d'événement, un type, `schema_version`, les dates, le producteur, l'agrégat/version, l'acteur, le périmètre, la finalité et les identifiants de corrélation/causation.

Les noms d'événements et leurs charges utiles doivent être fixés dans un catalogue unique versionné. Les variantes de l'architecture cible antérieure ne doivent pas subsister en parallèle.

### 5.5 Fiabilité

C propose une livraison au moins une fois, des consommateurs idempotents, une outbox transactionnelle si le stockage retenu le permet, des reprises bornées, une quarantaine des échecs durables et des règles explicites de rejeu/compensation.

Il ne faut pas promettre une livraison « exactement une fois » de bout en bout.

### 5.6 Décisions C

Les dix décisions C-01 à C-10 sont **À VALIDER** dans la référence examinée. Elles couvrent REST/JSON, OpenAPI, enveloppes, autorisation, commandes/événements, versionnement, outbox, idempotence, recontrôle des finalités/oppositions/révocations et rejeu audité.

Aucun endpoint, serveur, worker, broker, outbox, table, schéma SQL, politique RLS ou flux automatisé n'est créé par le document C.

---

## 6. Matrice des transferts — règles communes proposées

| Flux | Condition préalable | Décision par défaut |
|---|---|---|
| Source → Collecte | Source, accès, quota et conditions vérifiés | Collecte limitée au périmètre validé |
| Collecte → Qualification | Provenance, référence externe et normalisation tracées | Contrôle uniquement |
| Qualification → Publication | Type admis, auteur et champs publiables identifiés | Modération requise |
| Qualification → Veille | Source, finalité et champs nécessaires documentés | Analyse sans prospection |
| Veille → CRM | Rapprochement explicable, provenance et revue requise | Proposition/revue avant intégration |
| CRM → Prospection | Finalité, éligibilité et opposition vérifiées au moment de l'action | Blocage si contrôle incomplet |
| Annonce → CRM / Veille | Règle de transmission, finalité et droits vérifiés | Aucun transfert par défaut |
| CRM → espace client | Partage explicite, tenant, champs, motif, durée et révocation | Aucun partage par défaut |
| Client → CRM | Réception contrôlée, attribution, provenance et revue interne | Pas d'écriture directe |
| Document → BrainOS | Droit documentaire, propriétaire, corpus et rétention définis | Refus si droit non démontré |

Ces règles sont des propositions de conception à valider. Elles ne constituent pas des contrôles déjà implémentés.

---

## 7. Registre de cohérence et divergences à résoudre

| ID | Sujet | Constat documentaire | Traitement recommandé | Statut |
|---|---|---|---|---|
| X-01 | Étape D | L'architecture cible appelle D le déplacement des intégrations sources ; C et le plan de migration associent D à l'arbitrage technique / preuve de concept | Réserver D à l'arbitrage technique et à la preuve de concept ; placer les adaptateurs dans une étape ultérieure distincte | À arbitrer |
| X-02 | Routes API | L'architecture cible et C ne présentent pas partout la même racine ni le même découpage public/interne/client | Définir une seule racine et une convention canonique dans OpenAPI | À arbitrer |
| X-03 | Pagination | L'architecture cible illustre page/page_size ; C doit servir de contrat canonique à finaliser | Choisir une seule pagination pour les collections évolutives et documenter les exceptions | À arbitrer |
| X-04 | Enveloppes de réponse/erreur | L'architecture cible utilise une enveloppe indicative différente de celle proposée par C | Définir une enveloppe unique et ses codes HTTP/métier | À arbitrer |
| X-05 | Événements de rapprochement | Noms et sémantiques varient entre les documents ; « reviewed » peut recouvrir plusieurs issues tandis que « approved » n'en représente qu'une | Définir un événement de revue avec décision explicite approved/rejected/needs_review et un nom canonique | À arbitrer |
| X-06 | Catalogue d'événements | L'architecture cible comporte des événements absents du catalogue C et inversement | Publier un catalogue versionné unique et documenter producteurs/consommateurs autorisés | À arbitrer |
| X-07 | Transfert | B/C décrivent TransferDecision/TransferField ; l'architecture cible représente un DATA_TRANSFER plus sommaire | Aligner le modèle d'architecture sur TransferDecision et son cycle complet | À arbitrer |
| X-08 | Identité et propriété entreprise | COMPANY/SIREN est représenté, mais le rattachement aux fiches CRM internes, aux tenants et aux projections partagées n'est pas complètement spécifié | Séparer identité commune, fiches/contextes par propriétaire et projections partagées | À arbitrer |
| X-09 | Droits | Les principes de refus par défaut existent, mais A-01 à A-10 et B-01 à B-10 restent non validés ; la matrice complète des permissions n'est pas arrêtée | Finaliser les permissions par rôle, ressource et action, y compris recherche, export, fichiers et workers | À arbitrer |
| X-10 | Révocation et copies | Le partage est révocable, mais vue dynamique/copie, propagation, exports et copies déjà téléchargées ne sont pas définis | Définir le modèle de partage et ses limites opérationnelles | À arbitrer |
| X-11 | Suppression, audit et rétention | Les exigences de suppression propagée et de journalisation existent sans politique complète par catégorie, événement, cache, index et sauvegarde | Définir durées et mécanismes par famille ; minimiser/pseudonymiser les traces | À arbitrer |
| X-12 | Sources et réutilisation | Les conditions d'accès, quotas, cache, redistribution, finalités et conservation sont identifiées comme dépendances mais non vérifiées/validées ici | Établir un registre par source et faire valider les usages avant collecte persistante ou transmission | À arbitrer |
| X-13 | Plan de migration | Le plan historique présente des lots 0 à 8 tandis que le contre-audit propose des étapes A à I ; les deux nomenclatures ne sont pas équivalentes | Publier une correspondance explicite ou adopter une nomenclature unique après validation | À arbitrer |
| X-14 | Choix technologiques | Un comparatif existe, mais aucun candidat runtime/base/identité/isolation n'est validé sur charge, coûts, exploitation et réversibilité mesurés | Conserver les options au statut candidat et conduire une preuve de concept sur scénarios définis | À arbitrer |

### 7.1 Précision sur BODACC

Le périmètre documentaire initial retient les créations, ventes/cessions et modifications. Les procédures collectives et radiations sont exclues du périmètre initial. La catégorie immobilière apparaît dans la taxonomie et le schéma, mais le code consulté indique que sa source n'est pas connectée : sa présence ne prouve donc pas une collecte immobilière active.

La correction doit aligner code, filtres, schéma, contrats et tests avec le périmètre finalement validé. Les catégories différées doivent rester explicitement non disponibles ; elles ne doivent pas être présentées comme des sources opérationnelles.

Les cinq catégories BOAMP encore à mesurer et valider ne doivent pas être confondues avec les trois catégories BODACC retenues dans le cadrage initial.

### 7.2 Précision sur la sécurité

Le contre-audit n'établit pas de fuite avérée de données de tenants dans le prototype statique. Les pages examinées indiquent que le CRM opérationnel et les comptes ne sont pas activés. Les risques identifiés concernent principalement la conception cible, les appels côté navigateur et les règles d'autorisation à implémenter avant des données réelles.

---

## 8. Registre des décisions et critères de sortie

| Étape | Décisions recensées | État constaté dans les documents examinés | Critère de sortie |
|---|---:|---|---|
| A | A-01 à A-10 | À confirmer | Frontières, responsabilités et interdictions explicitement confirmées/corrigées |
| B | B-01 à B-10 | À valider | Propriété, appartenance, isolation, partage et scénarios négatifs définis |
| C | C-01 à C-10 | À valider | Contrat API, événements, transferts, erreurs, idempotence et reprise unifiés |

Aucune des étapes A, B ou C n'est considérée comme validée par le seul fait que ce document existe.

### Décisions transversales nécessaires avant l'étape D

- Confirmer les frontières et règles A.
- Décider l'identité, la propriété des fiches, les tenants/workspaces et les partages B.
- Définir les rôles et permissions nécessaires à la preuve de concept.
- Finaliser les contrats, événements et transferts C.
- Déterminer les conditions d'utilisation des sources nécessaires au périmètre de la preuve de concept.
- Définir les exigences mesurables de charge, disponibilité, sauvegarde/restauration, coûts et réversibilité.

---

## 9. Séquencement cible proposé — A à I

Le séquencement ci-dessous est une proposition de clarification. Il ne remplace pas formellement le plan de migration historique tant qu'il n'a pas été validé.

| Étape | Contenu | Critère de sortie |
|---|---|---|
| A — Frontières fonctionnelles | Domaines, responsabilités, interdictions et flux métiers | A-01 à A-10 confirmées/corrigées |
| B — Propriété et isolation | Identité entreprise, fiches par propriétaire, tenants/workspaces, partages et BrainOS | Propriété, partage, rôles de base et scénarios négatifs définis |
| C — Contrats | Routes, schémas, erreurs, événements et transferts | Une référence OpenAPI et un catalogue d'événements versionné |
| D — Arbitrage technique et preuve de concept | Runtime/hébergement, base, identité, isolation, sauvegardes/restauration, coûts et limites | Décision documentée et preuve de concept isolée sans données réelles |
| E — Socle serveur | API, identité, permissions, audit et persistance minimale | Tests d'accès interdits, révocation et séparation CRM/client réussis |
| F — Intégrations de sources | Adaptateurs serveur BOAMP, BODACC et API Entreprises | Conditions des sources validées ; provenance, quotas, erreurs et rétention testés |
| G — CRM et transferts | Entités métier, rapprochements, décisions de transfert, outbox et historique | Flux source → Veille → revue → CRM tracé, idempotent et révocable |
| H — Publication et espaces clients | Dépôt, modération, projection publique, dossiers et partages | Tests inter-tenant, CRM/client, révocation, export et fichiers réussis |
| I — Prospection et exploitation | Éligibilité, opposition, actions, restauration et préparation de livraison | Recontrôle avant exécution, revue sécurité/conformité et autorisation explicite avant déploiement |

---

## 10. Gouvernance de modification documentaire

Toute modification ultérieure des documents A, B ou C doit :

1. Indiquer le document et les décisions concernés.
2. Préserver les identifiants A-xx, B-xx et C-xx ; ne pas les réutiliser pour un autre sujet.
3. Mettre à jour le registre X-xx lorsqu'une divergence est résolue ou découverte.
4. Distinguer fait vérifié, hypothèse, recommandation et décision validée.
5. Ne jamais transformer « proposé », « à confirmer » ou « à valider » en « validé » sans décision explicite.
6. Conserver la provenance et la date des arbitrages.
7. Ne pas modifier le code applicatif dans le cadre d'une simple consolidation documentaire.
8. Vérifier les liens relatifs, les références croisées et les statuts après chaque changement.

## 11. Hors périmètre et limites

Ce référentiel ne constitue pas :
- une validation juridique des usages de données ou des sources ;
- un schéma SQL ou un modèle physique final ;
- une matrice complète des permissions validée ;
- une spécification OpenAPI exécutable ;
- un catalogue d'événements prêt à déployer ;
- un choix de fournisseur ou d'hébergement ;
- une preuve de concept technique ;
- une preuve d'implémentation des fonctions décrites.

Aucun backend, base, authentification, CRM opérationnel, connecteur serveur, worker ou automatisation n'est créé par ce document.

---

## 12. Références

- [Étape A — Architecture fonctionnelle](ETAPE-A-ARCHITECTURE-FONCTIONNELLE.md)
- [Étape B — Modèle de données et cloisonnement](ETAPE-B-MODELE-DONNEES-CLOISONNEMENT.md)
- [Étape C — Contrats API et événements](ETAPE-C-CONTRATS-API-EVENEMENTS.md)
- [Architecture API cible](ARCHITECTURE-API-CIBLE.md)
- [Migration évolution 3.0](MIGRATION-EVOLUTION-3.0.md)
- [Audit comparatif technique](AUDIT-COMPARATIF-TECHNIQUE.md)
