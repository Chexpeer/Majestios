# Registre des arbitrages — sécurité et cloisonnement MajestiOS 3.0

**Date d'ouverture :** 3 novembre 2026  
**Branche de référence :** `evolution-3.0`  
**Statut global :** arbitrages de principe B-01 à B-04 validés le 3 novembre 2026 ; B-05 validé sur les principes d'accès ; B-06 partiellement validé sur l'autorité de publication ; les autres arbitrages et précisions restent à arbitrer.  
**Références :** `ETAPE-B-MODELE-DONNEES-CLOISONNEMENT.md`, `ETAPE-C-CONTRATS-API-EVENEMENTS.md`, `ARCHITECTURE-API-CIBLE.md`.

> Ce registre rend les décisions traçables. Les décisions explicitement confirmées par le porteur du projet sont distinguées des propositions encore à arbitrer. Une validation de principe ne vaut ni autorisation de développement, ni validation de tous les détails d'implémentation, ni choix de fournisseur.

## 1. Synthèse des arbitrages

| ID | Sujet | Proposition à examiner | Conséquence principale | État |
|---|---|---|---|---|
| B-01 | Isolation des tenants clients | Base de données commune avec isolation stricte par espace client (Option A) ; choix à traduire en contrôles vérifiables | Modèle de données, autorisation, sauvegarde et exploitation | Validé — 03/11/2026 |
| B-02 | CRM interne | Périmètre organisationnel distinct ; accès réservé aux utilisateurs internes explicitement autorisés | Routes, données, rôles et opérations internes isolés | Validé — 03/11/2026 |
| B-03 | BrainOS | Périmètre de données et de permissions indépendant ; accès limité aux corpus et données explicitement autorisés | Corpus, index, recherche et métadonnées d'accès | Validé — 03/11/2026 |
| B-04 | Entreprises communes | Identité d'entreprise rapprochable, mais dossiers, notes, contacts et pièces restent propres à leur périmètre ; aucune fusion/enrichissement automatique | Référentiel, dédoublonnage et provenance | Validé — 03/11/2026 |
| B-05 | Accès visiteurs, utilisateurs identifiés et partage CRM vers client | Visiteurs limités à quelques annonces publiques ; annonces privées majoritairement verrouillées ; utilisateurs identifiés accèdent aux étages et contenus pédagogiques ; habilitations administrées exclusivement par l'administrateur | Parcours public/identifié, contrôle d'accès, projection des annonces et partage CRM | Validé — principes d'accès et de présentation ; détails de partage à préciser |
| B-06 | Annonces | Séparer soumission, modération, validation privée et publication ; l'auteur peut demander la publication, mais l'administrateur doit l'approuver ; publication distincte du transfert CRM et de l'usage commercial | États, droits, pièces et projections | Partiellement validé — autorité de publication ; workflow détaillé à préciser |
| B-07 | Rapprochements | Identifiant officiel vérifié pour le rapprochement automatique ; au moins deux critères concordants pour une proposition probable soumise à validation humaine ; réglages administrables | Critères, seuils et niveau de filtrage configurables, versionnés et traçables | Validé — règles de principe et paramétrage progressif ; détails opérationnels à préciser |
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

### B-05 — Accès visiteurs, utilisateurs identifiés et administration des habilitations

- **Question à trancher :** distinguer les contenus consultables sans compte, les contenus accessibles après identification et les données ou fonctionnalités réservées par habilitation.
- **Décision confirmée le 3 novembre 2026 — autorité d'administration :** le porteur du projet, en qualité d'administrateur, est le seul à accorder, modifier ou retirer les accès, privilèges et fonctionnalités. Aucun utilisateur, rôle client ou opérateur ne peut s'attribuer une habilitation ni en déléguer une implicitement.
- **Décision confirmée — visiteurs non identifiés :** les visiteurs ne disposent que d'un accès limité à quelques annonces sélectionnées pour être publiques. La majorité des annonces privées est présentée comme verrouillée/grisée afin de rendre visible l'existence de contenus réservés et d'inciter le visiteur à créer son espace personnel. Un élément grisé ne doit jamais exposer les données masquées dans le HTML, les réponses API, les métadonnées, les pièces jointes ou les résultats de recherche.
- **Décision confirmée — utilisateurs identifiés :** après identification, les utilisateurs peuvent accéder à l'ensemble des étages/rubriques de MajestiOS et consulter les documents pédagogiques qui expliquent la méthode de travail de MajestiOS, ses processus et ses moyens d'action. Cette ouverture concerne les contenus explicatifs prévus pour les utilisateurs ; elle ne donne aucun accès implicite aux données internes du CRM, aux dossiers d'autres clients, aux notes privées, aux contacts confidentiels ou aux documents internes.
- **Exemples de contenus pédagogiques :**
  - **Veille économique :** expliquer comment MajestiOS organise la veille, quelles informations sont recueillies, comment elles sont qualifiées et à quelles fins elles sont utilisées.
  - **Prospection :** expliquer l'organisation de la prospection, notamment le recours à un réseau de télétravailleurs et de business developers, ainsi que le rôle de ces intervenants dans le dispositif.
  - Les autres étages doivent suivre le même principe : expliquer clairement ce que fait MajestiOS, comment il le fait et ce que le client peut en attendre, sans divulguer d'informations confidentielles ou de données appartenant à un tiers.
- **Principe de préparation technique :** les contenus, annonces et fonctionnalités doivent être identifiés et contrôlés séparément selon leur niveau d'accès (public visiteur, utilisateur identifié, accès soumis à habilitation). Les contrôles doivent être appliqués côté serveur ; masquer visuellement un contenu ne constitue jamais une mesure de sécurité. Le dispositif doit permettre d'ouvrir simplement les contenus pédagogiques aux utilisateurs identifiés, puis d'ajouter progressivement des restrictions plus fines sans refonte majeure.
- **Principe de déploiement progressif :** commencer par une expérience aussi simple que possible. Les droits et fonctionnalités supplémentaires sont accordés uniquement par l'administrateur et peuvent être activés ou retirés au fur et à mesure de la montée en complexité du produit.
- **Limite de portée :** l'identification donne accès aux contenus pédagogiques et aux rubriques prévues pour les utilisateurs, mais ne vaut pas autorisation générale d'accès à toutes les annonces privées, à tous les services, ni aux données CRM. Les conditions exactes de déverrouillage des annonces privées, les catégories d'annonces accessibles selon le statut du compte, les champs partageables depuis le CRM, les finalités, les durées et les modalités de révocation restent à préciser. Aucun contenu CRM interne, note, contact privé ou document confidentiel ne devient accessible par défaut.
- **Conséquences :** séparation nette entre vitrine publique, espace utilisateur identifié et domaines métier privés ; classification des contenus ; contrôles d'accès serveur ; administration centralisée des habilitations ; configuration évolutive des fonctionnalités ; journalisation des changements d'accès ; révocation effective ; protection contre la fuite de contenus verrouillés via API, recherche, index, fichiers ou caches.
- **Preuves attendues :** un visiteur ne récupère que les quelques annonces expressément publiées ; les annonces privées verrouillées ne divulguent aucune donnée sous-jacente ; un utilisateur identifié accède aux contenus pédagogiques de tous les étages ; cet accès ne permet pas de lire les dossiers CRM ou ceux d'autres clients ; seul l'administrateur peut modifier les habilitations ; un verrouillage est respecté par URL directe et appel API ; un droit retiré est effectivement bloqué.
- **Responsable de l'arbitrage :** administrateur / porteur du projet.
- **État :** principes d'accès visiteurs/utilisateurs identifiés, de présentation des annonces privées et d'autorité exclusive de l'administrateur validés le 3 novembre 2026. Les règles détaillées de déverrouillage des annonces privées et de partage de données CRM restent à préciser.

### B-06 — Cycle de vie et publication des annonces privées

- **Question à trancher :** comment une annonce privée est-elle soumise, modérée, validée puis éventuellement rendue publique, sans confondre publication et partage de données CRM ?
- **Décision confirmée le 3 novembre 2026 — autorité de publication (option B) :** l'auteur d'une annonce peut demander sa publication. Cette demande ne rend pas l'annonce publique : l'administrateur du projet doit examiner et approuver explicitement la publication. L'auteur ne peut pas publier seul, même si l'annonce a déjà été modérée ou validée comme annonce privée.
- **Séquence de référence proposée, dont les détails restent à spécifier :**
  1. **Brouillon :** visible par son auteur et les personnes explicitement habilitées à l'accompagner ; aucune visibilité publique.
  2. **Soumise :** transmise à la modération ; accessible à l'auteur et aux modérateurs habilités.
  3. **À corriger / refusée :** décision de modération tracée ; les corrections éventuelles repassent par le circuit de soumission.
  4. **Validée privée :** annonce admise dans le dispositif privé ; elle reste non publique et visible uniquement aux personnes autorisées selon leurs habilitations.
  5. **Publication demandée :** l'auteur sollicite la publication ; la demande est distincte de la validation privée.
  6. **Publication approuvée :** l'administrateur approuve explicitement la publication et les champs destinés à la projection publique. Seuls ces champs approuvés sont exposés aux visiteurs.
  7. **Publication refusée / retirée :** la décision est tracée ; l'annonce ne devient pas publique ou cesse de l'être selon le cas. Les règles de notification et de recours restent à définir.
- **Séparation impérative :** validation de modération, validation privée et approbation de publication sont des décisions distinctes. Une annonce validée privée ne devient jamais publique automatiquement. La publication ne vaut ni transfert de données CRM, ni autorisation de prospection, ni ingestion dans BrainOS. Tout partage CRM demeure soumis à une autorisation distincte de l'administrateur, selon B-05.
- **Conséquences :** états versionnés, droits d'accès par état, contrôle des pièces, projection publique en liste blanche de champs approuvés, historique des décisions et révocation/retrait de publication.
- **Preuves attendues :** annonce non publiée invisible au public ; demande de publication de l'auteur sans effet public tant que l'administrateur n'a pas approuvé ; projection publique limitée aux champs approuvés ; refus ou retrait effectif ; aucun transfert CRM, usage commercial ou ingestion BrainOS implicite.
- **Responsable de l'arbitrage :** porteur du projet / administrateur, avec avis produit et modération.
- **État :** partiellement validé le 3 novembre 2026 : option B confirmée pour l'autorité de publication (demande possible par l'auteur, approbation obligatoire de l'administrateur). Les états définitifs, critères de modération, champs publiables, pièces, notifications, retrait et recours restent à préciser.

### B-07 — Rapprochements entre signaux et entreprises

- **Question initiale :** quels critères permettent de rattacher un signal économique à une entreprise, et dans quels cas une vérification humaine est-elle nécessaire ?
- **Décision confirmée le 3 novembre 2026 — correspondance certaine :** le rapprochement peut être automatique lorsqu'un identifiant officiel vérifié établit une correspondance exacte : SIREN pour l'unité légale ou SIRET pour l'établissement concerné. La distinction entre unité légale et établissement doit être conservée.
- **Décision confirmée — correspondance probable :** en l'absence de correspondance officielle certaine, MajestiOS peut proposer un rapprochement lorsqu'au moins deux critères concordants sont réunis. Exemples : nom + adresse, nom + téléphone, adresse + téléphone, SIREN + téléphone ou SIRET + adresse. Ces combinaisons sont des exemples, pas une liste exhaustive ni une équivalence de fiabilité : les critères doivent être qualifiés selon leur fiabilité et leur contexte. Une correspondance probable est toujours soumise à la vérification d'un utilisateur habilité ; MajestiOS présente les éléments qui motivent sa proposition.
- **Décision confirmée — correspondance incertaine :** un seul indice non officiel, des informations contradictoires ou plusieurs entreprises candidates ne déclenchent aucun rattachement automatique. Le signal reste en attente de qualification.
- **Paramétrage administrateur et simplicité initiale :** le système doit démarrer avec une configuration simple et prudente, comportant peu de règles et des seuils compréhensibles. Depuis l'interface d'administration, l'administrateur du projet doit pouvoir faire évoluer le niveau de filtrage : ajouter ou retirer des critères, ajuster leur poids ou leur caractère obligatoire, relever ou abaisser les seuils et rendre la détection plus stricte ou plus souple. Les réglages doivent être versionnés et leurs changements tracés afin de savoir quelle règle a produit chaque proposition. Les conséquences d'un changement sur les rapprochements déjà effectués restent à définir ; aucun recalcul rétroactif ne doit être implicite.
- **Garde-fous qui ne peuvent pas être désactivés par un simple réglage de souplesse :** une correspondance probable ne devient pas un rapprochement confirmé sans validation humaine ; aucun dossier CRM ou client n'est fusionné ; aucune note, aucun contact, document ou historique ne traverse un périmètre ; toute association conserve sa source, ses critères, sa justification, sa date, la version des règles et son historique ; une association erronée doit pouvoir être annulée sans détruire le signal source ni les dossiers concernés.
- **Conséquences :** moteur de critères configurable, niveaux de confiance explicables, file de vérification humaine, versionnement des règles, historique des décisions et traitement idempotent des signaux.
- **Preuves attendues :** tests des correspondances certaines, probables et incertaines ; validation humaine attribuable ; modification des réglages visible et historisée ; absence de fusion et de transfert de données entre périmètres ; annulation d'un rapprochement sans perte des données sources.
- **Responsable de l'arbitrage :** porteur du projet / administrateur.
- **État :** principes validés le 3 novembre 2026 : rapprochement automatique limité à l'identifiant officiel vérifié ; au moins deux critères concordants pour proposer une correspondance probable avec validation humaine ; configuration initiale simple et possibilité pour l'administrateur d'assouplir ou de renforcer le filtrage. Les critères exacts, pondérations, seuils par défaut, droits détaillés et traitement des changements de règles restent à spécifier.

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
| Visiteur non identifié | Aucun accès | Contenus pédagogiques publics uniquement ; aucune donnée d'espace client | Lecture de quelques annonces explicitement publiques ; annonces privées affichées verrouillées sans données sous-jacentes | Aucun accès privé | Aucun accès |
| Utilisateur identifié | Aucun accès | Accès aux étages et contenus pédagogiques prévus pour les utilisateurs ; données et fonctions privées selon habilitation et périmètre | Accès selon statut du compte et droits ; annonces privées non déverrouillées restent protégées | Corpus explicitement autorisés uniquement | Aucun accès global |
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
5. Qui valide un partage d'une donnée CRM vers un client ? **Principe décidé : seul l'administrateur du projet l'autorise ;** les contenus, finalités, destinataires, durées et modalités restent à définir.

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
| B-07 | C-04, C-05, C-08, C-09 |
| B-08 | C-04, C-09, C-10 |
| B-09 | C-06, C-07, C-10 |
| B-10 | C-06, C-07, C-10 |

Les contrats C-01 à C-10 restent eux-mêmes à valider. Ce registre ne les approuve pas implicitement.

## 6. Conditions de clôture

Un arbitrage ne passe à « Validé » que lorsque le porteur du projet a explicitement confirmé la décision. Les validations B-01 à B-04 du 3 novembre 2026 portent sur les principes et choix explicitement énoncés. B-05 est validé sur les principes d'accès et d'administration des habilitations ; B-06 est partiellement validé sur l'autorité de publication (option B uniquement) ; B-07 est validé sur les règles de principe des rapprochements et leur paramétrage administrable, mais pas sur les critères, pondérations et seuils détaillés. Les précisions techniques signalées comme restant à arbitrer ne sont pas réputées approuvées. Pour chaque décision validée, consigner :
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

**Historique de ce registre :** créé comme document préparatoire le 3 novembre 2026. Mis à jour le 3 novembre 2026 à la suite des arbitrages explicites du porteur du projet : B-01 (base commune avec isolation stricte), B-02 (CRM interne distinct), B-03 (BrainOS indépendant), B-04 (rapprochement d'identité d'entreprise sans fusion ni enrichissement croisé), B-05 (accès visiteurs/utilisateurs identifiés et autorité exclusive de l'administrateur sur les habilitations), B-06 (l'auteur peut demander la publication d'une annonce, mais l'administrateur doit l'approuver) et B-07 (rapprochement automatique sur identifiant officiel vérifié, revue humaine à partir d'au moins deux critères concordants pour les correspondances probables, et filtrage évolutif réglable par l'administrateur). Les critères, pondérations et seuils détaillés de B-07 restent à préciser. Les règles détaillées de déverrouillage des annonces privées, de partage CRM et le workflow complet des annonces restent également à préciser ; B-08 à B-10 restent à arbitrer.
