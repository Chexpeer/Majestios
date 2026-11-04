# MajestiOS 3.0 — Étape A : architecture fonctionnelle et frontières des modules

**Version :** 0.1  
**Date :** 3 novembre 2026  
**Branche :** evolution-3.0  
**Statut :** proposition structurante soumise à validation du porteur de projet  
**Nature :** cadrage fonctionnel ; aucune implémentation applicative n'est décrite comme réalisée.

## 1. Objectif et règle de conception

Cette étape fixe les responsabilités, les frontières et les échanges autorisés entre les domaines MajestiOS avant de choisir les technologies ou de créer le backend.

La règle centrale est la suivante : **chaque module possède une responsabilité métier identifiable, ses propres règles d'accès et des contrats d'échange explicites.** Un module ne lit pas ou ne modifie pas les données internes d'un autre module en contournant ces contrats.

MajestiOS suit la chaîne de valeur :

**Détecter → Qualifier → Identifier → Contacter → Transformer → Capitaliser.**

Cette chaîne décrit un parcours commercial possible, pas une automatisation obligatoire. Une information peut être détectée et qualifiée sans devenir une cible CRM ni faire l'objet d'une prospection.

## 2. Vue fonctionnelle de référence

~~~mermaid
flowchart TB
    VIS[Visiteur / utilisateur]
    FRONT[Interface MajestiOS]
    GATE[Frontière applicative<br/>identité • autorisation • validation]
    COLLECT[Collecte et adaptateurs de sources]
    QUAL[Réception • normalisation • qualification]
    PUB[Publication et annonces]
    WATCH[Veille]
    CRM[CRM interne MajestiOS]
    PROS[Prospection active]
    CLIENT[Espaces clients cloisonnés]
    KNOWLEDGE[corpus documentaire]
    AUDIT[Traçabilité et audit]

    VIS --> FRONT --> GATE
    GATE --> COLLECT --> QUAL
    QUAL --> PUB
    QUAL --> WATCH
    QUAL --> CRM
    WATCH --> CRM
    CRM --> PROS
    PROS --> CRM
    GATE --> CLIENT
    GATE --> KNOWLEDGE

    COLLECT -. décisions et traces .-> AUDIT
    QUAL -. décisions et traces .-> AUDIT
    PUB -. décisions et traces .-> AUDIT
    WATCH -. décisions et traces .-> AUDIT
    CRM -. décisions et traces .-> AUDIT
    PROS -. décisions et traces .-> AUDIT
    CLIENT -. décisions et traces .-> AUDIT
    KNOWLEDGE -. décisions et traces .-> AUDIT
~~~

Les flèches indiquent des échanges possibles soumis à autorisation. Elles ne signifient ni synchronisation générale ni transfert automatique. La frontière applicative est une responsabilité logique ; elle ne préjuge pas du nombre de serveurs ou de déploiements.

## 3. Carte des domaines et responsabilités

| Domaine | Mission principale | Données qu'il maîtrise | Ce qu'il ne doit pas faire |
|---|---|---|---|
| Interface publique | Présenter MajestiOS, permettre la recherche et recueillir les demandes | Préférences d'interface et données de saisie temporaires | Détenir des secrets, décider seule des autorisations ou accéder aux données internes |
| Identité et accès | Authentifier les utilisateurs et vérifier les rôles, appartenances et permissions | Comptes, sessions, rôles, appartenances et révocations | Décider de la finalité métier d'un traitement à la place du domaine concerné |
| Collecte et adaptateurs | Interroger les sources autorisées, conserver leur provenance et normaliser les réponses | Références source, identifiants externes, dates, versions et traces de collecte | Déduire une capacité commerciale, créer une campagne ou transmettre directement une cible à la prospection |
| Réception et qualification | Contrôler, dédoublonner, classer et orienter les éléments entrants | État de contrôle, qualité, doublons, motifs et décisions de routage | Publier ou transmettre sans règle et autorisation applicables |
| Recherche et opportunités | Exposer les résultats autorisés des recherches publiques et privées | Résultats normalisés et projections publiables | Exposer les données internes du CRM ou présenter un signal comme une opportunité garantie |
| Publication et annonces | Recevoir, modérer, publier, suspendre, retirer et expirer les annonces | Contenu soumis, auteur, pièces, décisions de modération et projection publique | Réutiliser automatiquement les coordonnées ou le contenu à des fins commerciales |
| Veille | Analyser les signaux, rapprocher des entreprises et expliciter les critères | Signaux, analyses, rapprochements proposés, scores explicables et revues | Transformer seule un rapprochement en action de prospection ou conclure à une capacité sur le seul APE/NAF |
| CRM interne MajestiOS | Constituer le référentiel commercial interne et l'historique des relations et actions | Entreprises, établissements, contacts, relations, interactions, opportunités et historique interne | Devenir une base partagée avec les clients ou recevoir des données sans provenance/finalité documentées |
| Prospection active | Préparer et suivre les actions commerciales autorisées | Éligibilité, actions, campagnes, oppositions, relances et résultats | Lancer une action sans vérifier finalité, pertinence, autorisation et opposition |
| Espaces clients | Fournir à chaque client un espace de travail propre et isolé | Dossiers, documents et éléments explicitement partagés avec ce client | Voir le CRM interne, les données d'un autre client ou les espaces privés de MajestiOS |
| Recherche documentaire | Rechercher dans les documents autorisés | Documents, métadonnées, versions, droits et index documentaires | Accéder implicitement au CRM, aux contacts, aux campagnes ou aux espaces clients |
| Traçabilité et audit | Conserver la preuve des accès sensibles, décisions et transmissions | Acteur, action, ressource, date, motif, résultat et corrélation | Devenir une copie générale du contenu métier ou conserver inutilement des données personnelles |

## 4. Frontières de confiance et séparation des périmètres

### 4.1 Trois périmètres de données distincts

1. **Organisation MajestiOS interne** : CRM, qualification interne, Veille, Prospection, administration et modération. L'accès est réservé aux collaborateurs et rôles internes habilités.
2. **Périmètre client** : chaque client dispose de son propre tenant et de ses propres membres, dossiers et documents. Deux tenants ne partagent aucune donnée par défaut.
3. **Corpus documentaire** : périmètre de données séparé, alimenté uniquement par des documents dont l'usage est autorisé. Il ne bénéficie d'aucun droit implicite sur les deux autres périmètres.

Le CRM interne n'est pas un tenant client ordinaire. Il constitue un périmètre organisationnel séparé avec une matrice de permissions propre.

### 4.2 Règles impératives

- Aucun accès client au CRM interne, même en lecture.
- Aucun accès d'un client aux données d'un autre tenant.
- Aucun accès du corpus documentaire au CRM ou aux espaces clients sans autorisation documentaire et technique explicite, limitée et révocable.
- Aucun secret de fournisseur ou droit privilégié dans le navigateur.
- Toute requête sensible est autorisée côté serveur ; un identifiant de tenant fourni par le navigateur ne constitue jamais une preuve d'appartenance.
- Les opérations de support ou d'administration sur un espace client sont limitées, justifiées, journalisées et soumises à des permissions spécifiques.
- Les exports, recherches globales, tâches planifiées et traitements asynchrones appliquent les mêmes frontières que les accès interactifs.

## 5. Contrats d'échange entre domaines

| Émetteur | Destinataire | Objet de l'échange | Conditions préalables | Décision par défaut |
|---|---|---|---|---|
| Sources externes | Collecte | Avis, annonces et données d'entreprise | Source autorisée, quotas, conditions et provenance vérifiés | Collecte limitée au périmètre validé |
| Collecte | Qualification | Enregistrement source normalisé | Identifiant externe, date, URL/référence, empreinte et version du normaliseur | Autorisé pour contrôle |
| Qualification | Publication | Annonce candidate | Type admis, auteur et champs publiables identifiés | Modération obligatoire |
| Qualification | Veille | Signal candidat | Source, finalité et champs nécessaires documentés | Analyse, sans prospection |
| Qualification | CRM interne | Référence ou donnée qualifiée | Finalité, droit d'usage, minimisation et règle de rapprochement validés | Pas d'import général automatique |
| Veille | CRM interne | Signal et rapprochement | Critères explicables, provenance et statut de revue définis | Proposition ou revue avant intégration |
| CRM interne | Prospection active | Cible et contexte commercial | Éligibilité vérifiée, finalité compatible, opposition contrôlée | Blocage si contrôle incomplet |
| Prospection active | CRM interne | Action, interaction et résultat | Identifiant d'action, acteur, date et résultat | Historisation |
| Publication | Utilisateur public | Projection de l'annonce | Modération positive, champs publics validés, statut publiable | Publication limitée aux champs approuvés |
| Publication | CRM / Veille | Référence ou champs nécessaires d'une annonce | Règle dédiée, finalité et droits vérifiés | Aucun transfert par défaut |
| CRM interne | Espace client | Dossier ou élément sélectionné | Partage explicite, destinataire, périmètre, durée et révocation | Aucun partage par défaut |
| Espace client | CRM interne | Demande, retour ou document | Attribution, contrôle, finalité et revue interne | Réception en zone contrôlée |
| Corpus autorisé | Recherche documentaire | Document et métadonnées autorisés | Droits documentaires, périmètre et rétention définis | Refus si droit non démontré |

Tout contrat de transmission doit porter au minimum : identifiant, source et provenance, émetteur, destinataire, objet/champs transmis, finalité, règle évaluée, acteur ou processus déclencheur, horodatage, décision, statut, résultat et identifiant de corrélation.

Une transmission refusée ou échouée doit également être traçable. Un événement technique ne constitue jamais, à lui seul, une autorisation métier ou juridique.

## 6. Périmètres fonctionnels confirmés à ce stade

- **Marchés publics :** BOAMP dans le périmètre initial ; les cinq catégories restent à sélectionner après mesure des volumes puis validation.
- **Marchés privés :** BODACC pour créations, ventes et cessions, modifications. Procédures collectives, radiations et immobilier exclus du périmètre initial.
- **Emploi MajestiOS :** annonces déposées par les utilisateurs ou publiées par l'équipe MajestiOS. Les flux externes Cadremploi, France Travail et APEC restent différés.
- **Je publie mon annonce :** emploi, sous-traitance, demande, offre et autres annonces professionnelles pertinentes ; dépôt, contrôle et modération sont des étapes distinctes.
- **CRM :** référentiel commercial interne, distinct des espaces clients.
- **Veille :** détection, analyse, rapprochement et qualification ; APE/NAF ne prouve ni compétence ni capacité.
- **Prospection active :** actions commerciales soumises à un contrôle préalable et à la gestion des oppositions.
- **Recherche documentaire :** accès aux corpus autorisés, sous permissions explicites.

## 7. Parcours métier de référence et points d'arrêt

~~~mermaid
flowchart TD
    A[Signal ou annonce reçu] --> B[Provenance et droits contrôlés]
    B --> C{Donnée exploitable pour le périmètre ?}
    C -- Non --> X[Rejet / attente / conservation limitée]
    C -- Oui --> D[Normalisation et dédoublonnage]
    D --> E[Qualification]
    E --> F{Destination autorisée ?}
    F -- Publication --> G[Modération]
    F -- Veille --> H[Analyse et rapprochement]
    F -- CRM --> I[Création ou rapprochement contrôlé]
    G --> J{Décision de modération}
    J -- Refus / correction --> X
    J -- Publication --> K[Projection publique limitée]
    H --> L{Revue requise / validée ?}
    L -- Non --> X
    L -- Oui --> I
    I --> M{Usage de prospection autorisé ?}
    M -- Non --> N[CRM / Veille sans action commerciale]
    M -- Oui --> O[Contrôle opposition et éligibilité]
    O --> P{Contrôles satisfaits ?}
    P -- Non --> N
    P -- Oui --> Q[Action de prospection]
    Q --> R[Résultat et historique CRM]
~~~

Chaque point de décision doit être associé à un responsable, une règle versionnée, un motif et un état. Les automatismes futurs pourront assister la qualification, mais ne devront pas effacer les points d'arrêt métier requis.

## 8. Ce qui relève du même module et ce qui doit rester séparé

- Recherche, résultats et adaptateurs de sources peuvent relever d'un même domaine de découverte, mais l'adaptateur ne décide pas de la publication ni de la prospection.
- Réception, normalisation et dédoublonnage peuvent former un domaine de traitement entrant commun.
- Publication et modération appartiennent au même domaine fonctionnel, avec permissions distinctes entre auteur, modérateur et administrateur.
- Veille et Prospection active restent deux domaines séparés : analyser un signal n'autorise pas à contacter une entreprise.
- Le CRM interne reste un domaine autonome et le référentiel central ; il ne se confond ni avec les résultats de recherche ni avec les espaces clients.
- Les espaces clients partagent éventuellement des composants techniques, mais leurs données et autorisations sont séparées tenant par tenant.
- Le corpus documentaire reste un périmètre de données distinct.
- Audit et traçabilité sont transversaux, sans donner à leurs lecteurs un accès métier implicite aux données journalisées.

## 9. Décisions d'architecture fonctionnelle proposées à validation

Les points ci-dessous constituent les arbitrages de l'étape A. Les propositions sont formulées pour être validées, corrigées ou refusées explicitement.

| ID | Proposition | Recommandation | Statut |
|---|---|---|---|
| A-01 | Le CRM interne est un périmètre MajestiOS séparé des tenants clients | Valider | À confirmer |
| A-02 | Veille et Prospection active sont deux domaines distincts | Valider | À confirmer |
| A-03 | Publication/modération est séparée de CRM et des usages de prospection | Valider | À confirmer |
| A-04 | La recherche documentaire n'a aucun accès implicite aux données CRM ou clients | Valider | À confirmer |
| A-05 | Les transferts intermodules sont explicites, minimisés, autorisés et traçables | Valider | À confirmer |
| A-06 | La qualification entrante est un point de contrôle commun, sans droit de destination automatique | Valider | À confirmer |
| A-07 | Les espaces clients sont isolés entre eux et des périmètres internes | Valider | À confirmer |
| A-08 | Les recherches publiques/privées exposent des projections autorisées, jamais le CRM brut | Valider | À confirmer |
| A-09 | Une action de prospection exige une vérification d'éligibilité et d'opposition distincte | Valider | À confirmer |
| A-10 | L'audit transversal trace les opérations sensibles sans recopier le contenu métier | Valider | À confirmer |

### Questions à arbitrer ensuite, sans bloquer la validation des frontières

1. Quels rôles internes peuvent qualifier, modérer, consulter le CRM, valider un rapprochement et déclencher une prospection ?
2. Un client pourra-t-il demander le partage d'un élément du CRM via une demande soumise à validation interne, ou seuls les opérateurs pourront-ils initier un partage ?
3. Quels éléments précis d'une annonce peuvent être rendus publics, et lesquels restent privés ou internes ?
4. Quels transferts vers le CRM ou la Veille peuvent être automatisés après validation des règles, et lesquels exigent toujours une revue humaine ?
5. Quels corpus et types de documents pourront être indexés ?

## 10. Critères d'acceptation de l'étape A

L'étape A sera considérée comme validée lorsque le porteur du projet aura confirmé ou corrigé les dix propositions A-01 à A-10 et que les responsabilités, interdictions et contrats d'échange auront été reportés dans la documentation de référence.

Avant de passer à l'étape B, il faudra pouvoir répondre sans ambiguïté aux questions suivantes :

- Qui possède chaque donnée et quel domaine en est responsable ?
- Qui peut la lire, la modifier, la transmettre et en autoriser le partage ?
- Quelle finalité autorise chaque transmission ?
- Quelle trace permet de reconstituer une décision ?
- Quel est le comportement par défaut lorsqu'une permission ou une information manque ? **Refus ou mise en attente, jamais autorisation implicite.**

## 11. Hors périmètre de cette étape

Cette étape ne choisit pas le fournisseur backend, la base, le service d'identité, le stockage, la file de tâches ou l'hébergeur. Elle ne définit pas encore le schéma physique SQL, les endpoints détaillés, la matrice complète des permissions, les durées légales de conservation ni les contrats fournisseurs.

Aucun code applicatif, backend, base de données, authentification, CRM opérationnel ou flux automatisé n'est créé par ce document. Aucun déploiement ni changement de production n'est autorisé ou effectué.
