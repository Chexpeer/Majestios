# Registre des arbitrages — sécurité et cloisonnement MajestiOS 3.0

**Date d'ouverture :** 3 novembre 2026  
**Branche de référence :** `evolution-3.0`  
**Statut global :** arbitrages de principe B-01 à B-04 validés le 3 novembre 2026 ; les autres arbitrages restent à arbitrer.  
**Références :** `ETAPE-B-MODELE-DONNEES-CLOISONNEMENT.md`, `ETAPE-C-CONTRATS-API-EVENEMENTS.md`, `ARCHITECTURE-API-CIBLE.md`.

> Ce registre rend les décisions traçables. Les décisions explicitement confirmées par le porteur du projet sont distinguées des propositions encore à arbitrer. Une validation de principe ne vaut ni autorisation de développement, ni validation de tous les détails d'implémentation, ni choix de fournisseur.

## 1. Synthèse des arbitrages

| ID | Sujet | Proposition à examiner | Conséquence principale | État |
|---|---|---|---|---|
| B-01 | Isolation des tenants clients | Base de données commune avec isolation stricte par espace client (Option A) ; choix à traduire en contrôles vérifiables | Modèle de données, autorisation, sauvegarde et exploitation | Validé — 03/11/2026 |
| B-02 | CRM interne | Périmètre organisationnel distinct ; accès réservé aux utilisateurs internes explicitement autorisés | Routes, données, rôles et opérations internes isolés | Validé — 03/11/2026 |
| B-03 | BrainOS | Périmètre de données et de permissions indépendant ; accès limité aux corpus et données explicitement autorisés | Corpus, index, recherche et métadonnées d'accès | Validé — 03/11/2026 |
| B-04 | Entreprises communes | Identité d'entreprise rapprochable, mais dossiers, notes, contacts et pièces restent propres à leur périmètre ; aucune fusion/enrichissement automatique | Référentiel, dédoublonnage et provenance | Validé — 03/11/2026 |
| B-05 | Partage CRM vers client | Projection de champs minimale, finalisée, approuvée, traçable, expirante si nécessaire et révocable | Objet de partage, autorité d'approbation et propagation de révocation | À arbitrer |
| B-06 | Annonces | Séparer contenu privé, décision de modération et projection publique ; publication distincte du transfert CRM et de l'usage commercial | États, droits, pièces et projections | À arbitrer |
| B-07 | Rapprochements | Proposition explicable, revue selon règles métier ; aucune fusion automatique irréversible | Score explicable, preuves, version et décision | À arbitrer |
| B-08 | Restrictions et oppositions | Registre central consulté avant toute action pertinente, avec recontrôle avant exécution et rejeu | Éligibilité, prospection, transferts et tâches différées | À arbitrer |
| B-09 | Audit | Journal append-only logique, accès restreint, protection contre altération et journalisation de ses consultations | Traçabilité, sécurité et investigation | À arbitrer |
| B-10 | Conservation | Politique par catégorie et finalité, couvrant archives, suppression, anonymisation, sauvegardes et index | Cycle de vie et conformité avant données réelles | À arbitrer |

## 2. Fiches de décision

### B-01 — Modèle d'isolation des tenants clients

- **Question à trancher :** base partagée avec isolation logique renforcée, schéma séparé par tenant ou base séparée par tenant ?
- **Décision validée le 3 novembre 2026 :** Option A — une base de données commune avec isolation stricte par espace client.
- **Portée de la validation :** le principe d'une base commune est retenu. Les mécanismes concrets d'isolation, le contexte tenant côté serveur, les politiques de base, la séparation des fichiers, exports, caches et tâches asynchrones restent à spécifier et à tester avant toute implémentation.
- **Options non retenues à ce stade :** schéma séparé ou base séparée par client. Elles pourront être réexaminées si une exigence de sécurité, de résidence, de restauration ou de contrat le justifie.
- **Critères de comparaison :** niveau d'isolation, risque d'erreur inter-tenant, complexité opérationnelle, sauvegarde/restauration, évolutivité, coût et exigences de résidence.
- **Conséquences :** modèle de données, contexte tenant côté serveur, politiques de base, fichiers, exports, caches, tâches asynchrones et observabilité.
- **Preuves attendues :** tests négatifs inter-tenant sur lecture, écriture, recherche, export, fichier et tâche différée ; tests de restauration et vérification de l'isolation.
- **Responsable de l'arbitrage :** porteur du projet, avec avis technique et sécurité.
- **État :** Validé — principe et option A confirmés par le porteur du projet le 3 novembre 2026. Détails techniques encore à spécifier.

### B-02 — Frontière du CRM interne MajestiOS

- **Question à trancher :** confirmer que le CRM interne constitue un domaine organisationnel distinct, et non un tenant client standard.
- **Décision validée le 3 novembre 2026 :** le CRM interne constitue un périmètre organisationnel distinct des espaces clients ; seuls les utilisateurs internes explicitement autorisés y accèdent. Aucune permission client ne donne accès au CRM et l'appartenance au CRM ne donne pas automatiquement accès aux espaces clients.
- **Conséquences :** identité interne, permissions dédiées, routes protégées côté serveur, recherche, exports, tâches et journalisation séparés.
- **Preuves attendues :** un client ne peut accéder à aucune route ou ressource CRM, même avec un identifiant valide ; un opérateur sans permission CRM est refusé.
- **Responsable de l'arbitrage :** porteur du projet.
- **État :** Validé — principe de séparation et d'accès interne autorisé confirmés le 3 novembre 2026. La matrice détaillée des rôles reste à arbitrer.

### B-03 — Cloisonnement de BrainOS

- **Question à trancher :** corpus par utilisateur, par organisation, corpus MajestiOS partagé avec droits documentaires, ou combinaison contrôlée de ces niveaux ?
- **Décision validée le 3 novembre 2026 :** BrainOS possède un périmètre de données et de permissions indépendant. Il n'accède qu'aux corpus et données explicitement autorisés ; aucun accès implicite au CRM ou aux espaces clients n'est accordé. Les droits doivent être appliqués avant récupération et avant restitution au modèle.
- **Conséquences :** métadonnées de propriétaire, corpus, finalité et permissions ; cycle d'indexation, suppression, réindexation et invalidation des caches.
- **Preuves attendues :** aucune recherche ne récupère, ne cite ni n'utilise un document hors périmètre autorisé ; test après révocation.
- **Responsable de l'arbitrage :** porteur du projet, avec avis sécurité et produit.
- **État :** Validé — principe de séparation et d'accès explicite confirmé le 3 novembre 2026. Le modèle de corpus (utilisateur, organisation, corpus MajestiOS partagé avec droits documentaires ou combinaison) reste à arbitrer.

### B-04 — Fiches entreprise communes au CRM et aux clients

- **Question à trancher :** comment représenter une même entreprise présente dans plusieurs périmètres sans mélanger les informations ?
- **Décision validée le 3 novembre 2026 :** une même entreprise peut être rapprochée entre plusieurs périmètres à partir d'une identité d'entreprise vérifiable, sans fusionner les dossiers ni partager automatiquement leurs informations.
- **Règle de cloisonnement :** les notes, contacts, pièces, historiques commerciaux et autres données de dossier restent la propriété de leur périmètre. Aucun enrichissement croisé ni accès implicite n'est autorisé. Une modification dans un périmètre ne modifie pas le dossier d'un autre périmètre.
- **Précision d'identification :** le SIREN peut servir d'identifiant de rapprochement de l'unité légale lorsqu'il est disponible et vérifié ; il ne doit pas être confondu avec le SIRET, qui identifie un établissement. Les cas incomplets, ambigus ou concernant des établissements distincts nécessitent une règle de rapprochement explicable et une vérification adaptée. Cette validation ne décide pas de l'existence ni de la structure d'un référentiel maître partagé.
- **Conséquences :** provenance par champ, propriété des notes et contacts, gestion des doublons et droits de consultation ; la représentation technique de l'identité rapprochée reste à concevoir.
- **Preuves attendues :** une fiche client ne révèle pas les notes, contacts ou pièces CRM ; une modification dans un espace n'altère pas l'autre dossier ; tout rapprochement est traçable et n'accorde aucun droit d'accès supplémentaire.
- **Responsable de l'arbitrage :** porteur du projet.
- **État :** Validé — principe de rapprochement d'identité sans fusion ni enrichissement croisé confirmé le 3 novembre 2026. Le modèle technique de référence reste à spécifier.

### B-05 — Partage CRM vers client

- **Question à trancher :** qui peut autoriser un partage, pour quelle finalité, quels champs et quelle durée ?
- **Proposition technique :** projection minimale et distincte de la fiche source, avec destinataire, finalité, approbateur, dates, statut et révocation.
- **Conséquences :** workflow d'approbation, contrôle au moment de l'exécution, traçabilité des champs transmis, révocation des accès, caches et tâches différées.
- **Preuves attendues :** seuls les champs approuvés sont exposés ; révocation effective ; aucune remontée vers la fiche CRM complète ; traitement des copies déjà transmises défini.
- **Responsable de l'arbitrage :** porteur du projet ; désignation explicite du rôle approbateur requise.
- **État :** À arbitrer.

### B-06 — Séparation des données d'annonce

- **Question à trancher :** quels champs et pièces relèvent du contenu privé, de la modération et de la projection publique ?
- **Proposition technique :** séparer contenu soumis, décision de modération et projection publiée. La publication ne vaut ni transfert CRM ni autorisation de prospection.
- **Conséquences :** états versionnés, droits d'accès par état, contrôle des pièces, historique des décisions et projections publiques.
- **Preuves attendues :** annonce non publiée invisible au public ; projection publique limitée aux champs approuvés ; aucun transfert CRM ou usage commercial implicite.
- **Responsable de l'arbitrage :** porteur du projet, avec avis produit/modération.
- **État :** À arbitrer.

### B-07 — Rapprochements entre signaux et entreprises

- **Question à trancher :** quels critères, seuils et cas imposent une revue humaine ?
- **Proposition technique :** rapprochement proposé avec critères explicables, score/version et preuves ; validation séparée ; aucune fusion automatique irréversible.
- **Conséquences :** statut de revue, historique des décisions, dédoublonnage idempotent et traitement des ambiguïtés.
- **Preuves attendues :** cas ambigus envoyés en revue ; rejet sans mutation des dossiers sources ; validation attribuable et historisée.
- **Responsable de l'arbitrage :** porteur du projet, avec avis métier.
- **État :** À arbitrer.

### B-08 — Restrictions et oppositions

- **Question à trancher :** quelles catégories de restrictions sont gérées, qui les enregistre, les vérifie et peut les lever ?
- **Proposition technique :** registre central et contrôles bloquants à la préparation, à l'approbation, à l'exécution et au rejeu.
- **Conséquences :** propagation vers prospection, CRM, transferts, événements, caches et tâches différées ; priorité à la règle la plus restrictive tant qu'un conflit n'est pas résolu.
- **Preuves attendues :** une opposition enregistrée après préparation bloque l'exécution ; le rejeu ne contourne pas une restriction ; toute levée est autorisée et tracée.
- **Responsable de l'arbitrage :** porteur du projet, avec validation métier et conformité.
- **État :** À arbitrer.

### B-09 — Journal d'audit

- **Question à trancher :** quel niveau de garantie d'intégrité, quelle autorité de consultation et quelle séparation des responsabilités ?
- **Proposition technique :** journal append-only logique, protection contre modification/suppression, accès minimal et journalisation des consultations/exports du journal.
- **Conséquences :** séparation des journaux techniques et métier, politique d'accès, alertes d'altération et minimisation des charges utiles.
- **Preuves attendues :** un utilisateur audité ne peut altérer ses traces ; toute consultation/export est attribuable ; aucune charge utile sensible inutile n'est copiée.
- **Responsable de l'arbitrage :** porteur du projet, avec avis sécurité.
- **État :** À arbitrer.

### B-10 — Conservation et suppression

- **Question à trancher :** quelles durées ou règles de déclenchement par catégorie et finalité ?
- **Proposition technique :** politique documentée par catégorie, sans durée globale arbitraire.
- **Conséquences :** archivage, suppression/anonymisation, sauvegardes, index BrainOS, caches, copies transférées et preuve d'exécution.
- **Preuves attendues :** tests de suppression et de propagation ; restauration de sauvegarde conforme à la politique ; absence de réapparition d'une donnée supprimée dans les index et traitements.
- **Responsable de l'arbitrage :** porteur du projet, avec validation compétente en matière de conformité.
- **État :** À arbitrer.

## 3. Matrice de permissions de référence — proposition non approuvée

La permission doit être évaluée selon : **acteur × domaine × ressource × action × périmètre × finalité**. Un droit de lecture n'implique pas un droit de modification, d'export, de partage ou d'exécution.

| Acteur | CRM interne | Espace client | Publication / modération | BrainOS | Audit |
|---|---|---|---|---|---|
| Visiteur | Aucun accès | Aucun accès privé | Lecture des seules projections publiques | Aucun accès privé | Aucun accès |
| Utilisateur client | Aucun accès | Selon rôle dans son tenant | Ses annonces selon état et droits | Corpus explicitement autorisés | Aucun accès global |
| Administrateur client | Aucun accès | Administration de son tenant uniquement | Habilitation distincte | Corpus de son organisation si autorisé | Aucun accès global |
| Opérateur CRM | Permissions CRM attribuées | Aucun accès implicite | Aucun accès implicite | Aucun accès implicite | Selon habilitation distincte |
| Modérateur | Aucun accès par défaut | Aucun accès implicite | Modération dans son périmètre | Aucun accès par défaut | Traces de modération autorisées |
| Responsable des partages | Données minimales nécessaires à la décision | Destinataire désigné uniquement | Selon besoin autorisé | Selon besoin autorisé | Traces des décisions |
| Administrateur technique | Aucun accès métier automatique | Aucun accès métier automatique | Aucun accès métier automatique | Aucun accès métier automatique | Traces techniques strictement nécessaires |
| Compte de service | Périmètre et actions déclarés | Périmètre et actions déclarés | Périmètre et actions déclarés | Périmètre et actions déclarés | Écriture ou lecture limitée au contrat |

Les accès d'urgence, s'ils sont retenus, doivent être temporaires, motivés, approuvés et audités. Aucun rôle ne doit être « tout-puissant » par défaut.

## 4. Questions complémentaires de l'Étape B

Ces questions ne sont pas numérotées B-01 à B-10 dans le document source, mais conditionnent le modèle logique :

1. Plusieurs utilisateurs et plusieurs rôles par espace client dès la première version ?
2. Plusieurs espaces ou dossiers indépendants pour un même client ?
3. Dépôt de fichiers dès le premier lot ou après définition de la politique documentaire ?
4. Corpus BrainOS par utilisateur, par organisation ou partagé avec droits documentaires ?
5. Qui valide un partage d'une donnée CRM vers un client ?

Elles restent **à arbitrer**.

## 5. Dépendances avec l'Étape C

| Arbitrages B | Contrats C principalement concernés |
|---|---|
| B-01 | C-04, C-06, C-09 |
| B-02 | C-01, C-04 |
| B-03 | C-04, C-06, C-09 |
| B-04 | C-05, C-06, C-08 |
| B-05 | C-04, C-05, C-09, C-10 |
| B-06 | C-05, C-06, C-09 |
| B-07 | C-05, C-08 |
| B-08 | C-04, C-09, C-10 |
| B-09 | C-06, C-07, C-10 |
| B-10 | C-06, C-07, C-10 |

Les contrats C-01 à C-10 restent eux-mêmes à valider. Ce registre ne les approuve pas implicitement.

## 6. Conditions de clôture

Un arbitrage ne passe à « Validé » que lorsque le porteur du projet a explicitement confirmé la décision. Les validations B-01 à B-04 du 3 novembre 2026 portent sur les principes et choix explicitement énoncés ; les précisions techniques signalées comme restant à arbitrer ne sont pas réputées approuvées. Pour chaque décision validée, consigner :
- décision retenue et options écartées ;
- justification métier et technique ;
- responsable de validation et date ;
- conséquences documentaires et techniques ;
- tests d'acceptation et preuves attendues ;
- dépendances éventuelles et conditions de réexamen.

États autorisés :
- **À arbitrer** : aucune décision approuvée.
- **Proposé** : option soumise à examen.
- **Validé** : décision explicitement confirmée par le porteur du projet.
- **À réexaminer** : décision antérieure remise en question, sans effacement de son historique.

## 7. Garde-fous de mise en œuvre

Tant que les arbitrages bloquants ne sont pas validés :
- pas de schéma SQL définitif, migration ou politique RLS ;
- pas de choix de fournisseur imposé par ce registre ;
- pas de création de backend, authentification ou flux réel au titre de ces propositions ;
- pas de données clients réelles ;
- pas de partage ou transfert automatique entre domaines.

Le prototype existant reste préservé. Toute implémentation ultérieure devra faire l'objet d'un périmètre distinct, d'un audit, d'une autorisation explicite et de tests reproductibles.

**Historique de ce registre :** créé comme document préparatoire le 3 novembre 2026. Mis à jour le 3 novembre 2026 à la suite des arbitrages explicites du porteur du projet : B-01 (base commune avec isolation stricte), B-02 (CRM interne distinct), B-03 (BrainOS indépendant) et B-04 (rapprochement d'identité d'entreprise sans fusion ni enrichissement croisé). Les arbitrages B-05 à B-10 restent ouverts.
