# Roadmap et gouvernance — MajestiOS 5.0

## 1. Stratégie de branches

- `evolution-3.0` : patrimoine de référence à préserver ; ne pas modifier dans le cadre de la V5.
- `evolution-4.0` : documentation de consultation en standby ; à relire comme source, sans reprendre automatiquement toutes ses propositions.
- `evolution-5.0` : nouvelle branche de cadrage et de construction.
- Toute branche de prototype ou de fonctionnalité V5 devra être dédiée et partir d'une base explicitement identifiée.

Aucune fusion vers la branche par défaut ni aucun déploiement production sans accord explicite du fondateur.

## 2. Phases

### Phase 0 — Inventaire, nettoyage et gel du patrimoine
- établir les références exactes de commits ;
- inventorier pages, scripts, styles, images, routes, tests, workflows, PR et documentation ;
- identifier doublons, fichiers obsolètes, contradictions et fonctionnalités sans destination ;
- vérifier les commandes de build et les tests réellement exécutables ;
- classer chaque élément : conserver, adapter, fusionner, archiver, abandonner (proposition) ou vérifier ;
- ne rien supprimer à ce stade.

**Sortie :** registre de patrimoine V3 et plan de nettoyage approuvé.

### Phase 1 — Vision, arborescence et contre-audit
- consolider les décisions fondatrices ;
- stabiliser la nomenclature des domaines et étages ;
- cartographier chaque étage vers dossiers, sous-dossiers, pages et fonctions ;
- préparer un dossier indépendant pour Claude et au moins deux autres IA ;
- comparer consensus, désaccords, erreurs factuelles, risques et idées nouvelles.

**Sortie :** vision V5 arbitrée et matrice de traçabilité.

### Phase 2 — Architecture et gouvernance des données
- définir identité, authentification, rôles et multi-tenant ;
- définir modèle de données, événements, provenance, audit et rétention ;
- choisir backend, base, stockage et orchestration après comparaison ;
- définir les frontières entre CRM interne, CRM clients, offre CRM, IA et BI ;
- cadrer contrats et transferts vers les fournisseurs IA.

**Sortie :** architecture cible, décisions techniques documentées et modèle de menace.

### Phase 3 — Prototype de l'expérience immersive
- créer le panorama industriel ;
- créer l'immeuble et l'ascenseur extérieur vitré ;
- produire un intérieur distinct par étage ;
- tester les animations, destinations, zones interactives et mobile ;
- conserver une navigation accessible et les accès utilitaires ;
- connecter d'abord des routes de démonstration, puis les pages réelles validées.

**Sortie :** prototype visuel validé sans régression des moteurs métier.

### Phase 4 — Socle applicatif sécurisé
- backend, identité, permissions, stockage et journalisation ;
- gestion des secrets, sauvegardes et restauration ;
- environnements séparés et CI ;
- observabilité, limites de coûts et protection anti-abus.

**Sortie :** socle testé avant données réelles.

### Phase 5 — Recherche et développement commercial
- taxonomie et sources ;
- recherche publique et privée ;
- Nettoyage à spécifier ;
- qualification et identification des entreprises ;
- traçabilité et qualité des résultats ;
- préparation des données pour le CRM.

**Sortie :** parcours de recherche et qualification vérifiable de bout en bout.

### Phase 6 — CRM, IA et Business Intelligence
- appliquer la doctrine multi-rôles / orchestrateur décrite dans [VISION-IA-TRANSVERSALE.md](VISION-IA-TRANSVERSALE.md) ;
- évaluer chaque capacité IA par tâche, risque, qualité, latence et coût ;
- commencer par un CRM structuré minimal ;
- introduire enrichissement et assistance IA en lecture seule ;
- proposer des modifications avec provenance et validation ;
- ajouter priorisation et recommandations ;
- construire indicateurs BI à partir de données fiables ;
- intégrer les CRM tiers si le cas d'usage et le coût le justifient.

**Sortie :** CRM augmenté mesurable, auditable et cloisonné.

### Phase 7 — Mémoire conversationnelle et assistants
- connecter la mémoire externe à l'orchestrateur sans dépendre de la mémoire native d'un fournisseur ;
- MVP sur corpus pilote non sensible ;
- recherche avec références aux échanges ;
- mémoire opérationnelle et stratégique contrôlée ;
- gestion des contradictions, rétention et suppression ;
- portabilité entre fournisseurs IA ;
- assistants visiteur et administration avec permissions distinctes.

**Sortie :** continuité de contexte démontrée sans accès indu ni transmission excessive.

### Phase 8 — Réputation virtuelle, réseau, salons et séminaires
- cadrer les sources, API, identités d'établissement, avis et conditions ;
- concevoir le parcours déclenché par un signal BODACC de création : croiser activité et adresse, vérifier la présence de l'établissement sur Google Maps et les informations/avis publics accessibles par des moyens autorisés ;
- si la présence est absente ou insuffisante, qualifier une opportunité d'accompagnement visibilité et préparer une prise de contact soumise à validation humaine ; aucune sollicitation automatique par défaut ;
- définir les fonctions réseau et événementielles ;
- tester les parcours de mise en relation ;
- mesurer qualité et valeur métier.

**Sortie :** fonctions validées sur des cas réels autorisés.

### Phase 9 — SEO, amélioration continue et stabilisation
- SEO technique, indexation, contenu et mesure ;
- surveiller en continu les évolutions des moteurs et des expériences de recherche classiques et génératives ;
- réaliser des audits récurrents, détecter les régressions et préparer des recommandations priorisées pour maintenir MajestiOS à niveau ;
- recommandations préparées et validées par le cockpit d'administration IA ;
- automatisation limitée aux tâches réversibles préautorisées ;
- évaluation continue des modèles et parcours ;
- audit sécurité et juridique ;
- performance, accessibilité, mobile, restauration et recette ;
- déploiement progressif après autorisation.

**Sortie :** version candidate documentée, testée et approuvée.

## 3. Règles de gouvernance

- Une branche dédiée par lot cohérent.
- Lots de taille maîtrisée, critères d'acceptation écrits avant réalisation.
- Sauvegarde / point de retour avant toute modification risquée.
- Aucun renommage global ou nettoyage destructif sans inventaire et validation.
- Tests de non-régression sur routes, formulaires, recherche, données et mobile.
- Distinguer prototype, simulation, intégration testée et fonctionnalité en production.
- Pas de secrets dans Git, le navigateur, les captures ou les logs.
- Pas d'envoi externe, d'action commerciale, de suppression, d'export ou de changement de droits sans autorisation appropriée.
- Aucun merge ou déploiement production sans validation explicite du fondateur.

## 4. Registre des décisions

Chaque décision comporte : identifiant, sujet, options, décision, auteur, date, justification, impacts, preuves et statut.

Statuts autorisés : proposé, à instruire, validé, rejeté, remplacé.

## 5. Mesures de réussite

Les indicateurs ne seront activés qu'après instrumentation et définition de leur mode de calcul :
- taux de réussite des destinations et parcours ;
- pertinence et fraîcheur des résultats ;
- qualité de qualification humaine ;
- complétude et exactitude des données CRM ;
- taux d'erreur des enrichissements IA ;
- pertinence des recommandations ;
- conversion et valeur commerciale ;
- précision de récupération mémoire ;
- temps gagné et coût par tâche ;
- régressions, incidents et anomalies d'accès ;
- visibilité SEO et performance technique.
