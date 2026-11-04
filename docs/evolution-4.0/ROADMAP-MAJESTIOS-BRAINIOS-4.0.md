# Feuille de route — MajestiOS 4.0 et BrainIOS

**Date :** 4 novembre 2026  
**Statut :** proposition de séquencement à confronter aux autres IA et à faire arbitrer par le porteur du projet.  
**Dépendances :** `AUDIT-MAJESTIOS-3.0.md` et `VISION-ET-ARCHITECTURE-MAJESTIOS-4.0.md`.

## 1. Règles de pilotage

### 1.1 Statuts

- **VALIDÉ** : décision explicitement prise par le porteur du projet.
- **À ARBITRER** : choix qui nécessite une décision.
- **À CONSTRUIRE** : fonctionnalité planifiée, non réalisée.
- **À TESTER** : implémentation existante ou nouvelle à vérifier selon des critères définis.
- **DIFFÉRÉ** : conservé pour une phase ultérieure.
- **BLOQUÉ** : dépendance ou prérequis manquant.

Aucun statut « opérationnel » ne sera attribué sur la seule base d'une page de présentation ou d'un document de conception.

### 1.2 Principes de livraison

- Lots cohérents et de taille maîtrisée.
- Une branche dédiée par chantier.
- Tests unitaires, tests d'intégration et tests navigateur séparés.
- Contrôles anti-régression avant revue.
- Rapport précis des fichiers, preuves, limites et risques.
- Sauvegarde et procédure de retour arrière pour toute évolution structurante.
- Aucune fusion, promotion ou mise en production sans autorisation explicite du porteur du projet.
- Les autres IA interviennent d'abord en contre-audit documentaire ; elles ne modifient pas le dépôt pendant cette consultation.

## 2. Vue synthétique des phases

| Phase | Intitulé | Résultat attendu | Statut |
|---|---|---|---|
| 0 | Audit et consultation | Diagnostic, architecture cible, contre-audits et arbitrages | En cours |
| 1 | Réconciliation Git et cadrage | Base 4.0 choisie, PR classées, décisions produit consolidées | À CONSTRUIRE |
| 2 | Fondations sécurité et données | Identité, permissions, données, API, audit et sauvegardes | À ARBITRER / À CONSTRUIRE |
| 3 | Socle développement commercial | Recherche fiable, taxonomie, sources, qualification, CRM fondamental | À CONSTRUIRE |
| 4 | Réputation virtuelle | Recherche de présence locale, vérification et parcours d'accompagnement | À CONSTRUIRE |
| 5 | BrainIOS utilisateur | Assistant contextuel utile, sourcé et non intrusif | À CONSTRUIRE |
| 6 | BrainIOS administrateur | Surveillance, rapports, recommandations et mémoire projet | À CONSTRUIRE |
| 7 | Atelier BrainIOS | GitHub, développement isolé, tests et validation humaine | À CONSTRUIRE |
| 8 | Apprentissage contrôlé | Analyse agrégée des usages et amélioration mesurée | À CONSTRUIRE |
| 9 | Stabilisation et ouverture | Sécurité, conformité, performance, recette et déploiement progressif | À CONSTRUIRE |

## 3. Phase 0 — Audit et consultation indépendante

**Objectif :** disposer d'une compréhension commune avant de toucher au produit.

Travaux :
1. finaliser l'audit de la 3.0 ;
2. cartographier branches, commits et PR empilées ;
3. identifier les éléments à conserver et les contradictions ;
4. publier vision et architecture cible ;
5. soumettre le dossier aux autres IA ;
6. comparer leurs rapports et arbitrer les désaccords.

Livrables :
- diagnostic de la 3.0 ;
- vision et architecture cible 4.0 ;
- feuille de route ;
- mission de contre-audit ;
- registre des décisions et questions ouvertes.

**Critère de sortie :** le porteur du projet a validé le périmètre, les principes de sécurité et les arbitrages prioritaires. Aucune implémentation fonctionnelle nouvelle n'est lancée avant ce jalon.

## 4. Phase 1 — Réconciliation Git et cadrage détaillé

**Objectif :** choisir une base de développement fiable sans perdre les acquis.

Travaux :
- comparer les arbres et commits de `main`, `evolution-2.0`, `evolution-3.0`, sauvegardes et branches de PR ;
- classifier chaque PR ouverte : conserver, intégrer dans la base, réimplémenter, fermer/archiver après décision ;
- résoudre les chaînes empilées #24–26, #29–31 et #32–34 ;
- confirmer la base exacte et créer la branche de développement 4.0 après autorisation ;
- établir une matrice exigences → modules → données → permissions → API → tests ;
- mettre à jour les instructions des agents et la documentation canonique.

**Critère de sortie :** un commit de base approuvé, un plan de conservation des changements et un registre d'arbitrages sans ambiguïté.

## 5. Phase 2 — Fondations techniques, données et sécurité

**Objectif :** construire le socle avant les données utilisateurs réelles.

Lots proposés :

### 2.1 Choix d'architecture
- comparer backend, base relationnelle, identité, stockage, hébergement, événements et coûts ;
- valider l'option monolithe modulaire ou son alternative ;
- définir environnements développement, test, préproduction et production.

### 2.2 Identité et autorisations
- authentification ;
- sessions et révocation ;
- rôles internes et clients ;
- autorisations côté serveur ;
- séparation de l'administration, du CRM interne et des espaces clients ;
- tests négatifs d'accès croisé.

### 2.3 Modèle de données et API
- entreprises, établissements, contacts ;
- sources, enregistrements et provenance ;
- signaux et opportunités ;
- annonces et modération ;
- CRM et activités ;
- événements, audit et rapports ;
- contrats API versionnés ;
- migrations, sauvegardes et restauration.

### 2.4 Gouvernance des données
- registre des traitements et finalités ;
- bases légales et information ;
- durées de conservation et suppression ;
- sous-traitants, sources et conditions de réutilisation ;
- pages légales adaptées ;
- processus de gestion des demandes des personnes.

**Critère de sortie :** les tests prouvent les permissions et le cloisonnement ; les pages légales et règles de traitement sont prêtes avant ouverture de collecte réelle.

## 6. Phase 3 — Développement commercial

**Objectif :** fiabiliser la chaîne de valeur commerciale de bout en bout.

### 3.1 Moteur transversal
- contrat unique de recherche ;
- parcours progressif type → catégorie → département/mot-clé ;
- catalogue de catégories versionné ;
- résultats dédiés ;
- pagination et limites ;
- provenance et fraîcheur des données ;
- état visible en cas d'indisponibilité source.

### 3.2 Sources publiques et privées
- BOAMP : choix définitif des catégories et mesure de volumes ;
- BODACC : périmètre initial documenté de créations, cessions et modifications à réconcilier ;
- règles d'exclusion et tests des familles non retenues ;
- registre des sources et conditions d'utilisation.

### 3.3 Catégorie Nettoyage
- arbitrer le rattachement public/privé/transversal ;
- définir catégories et nomenclature de recherche ;
- relier les catégories aux sources réellement disponibles ;
- établir les règles de qualification ;
- prévoir pages et résultats dédiés ;
- tester les cas positifs, négatifs et ambiguïtés.

### 3.4 Qualification entreprises
- distinction entreprise/établissement ;
- critères APE/NAF et département ;
- provenance et date ;
- dédoublonnage ;
- score explicable ;
- revue humaine ;
- préparation d'une action CRM sans automatisation de contact par défaut.

### 3.5 CRM fondamental
- référentiel d'entreprises et établissements ;
- contacts et relations ;
- opportunités, activités et historique ;
- tâches et prochaines actions ;
- droits internes ;
- provenance et traçabilité ;
- import/transfert seulement sur base autorisée.

### 3.6 Prosp'active
- définition des segments et signaux déclencheurs ;
- qualification avant contact ;
- priorisation explicable ;
- préparation de campagnes ;
- gestion des oppositions et préférences ;
- validation humaine avant tout envoi ;
- suivi des résultats.

**Critère de sortie :** un parcours complet et traçable de la détection à la qualification, puis à l'action autorisée et au suivi CRM.

## 7. Phase 4 — Réputation virtuelle

**Objectif :** évaluer et accompagner la présence numérique locale d'une entreprise.

Lots :
1. choix des interfaces officielles Google pertinentes ;
2. modèle entreprise/établissement et recherche par activité + adresse ;
3. résolution d'identité et gestion des homonymes ;
4. lecture des informations autorisées ;
5. analyse de présence et des avis dans les limites contractuelles ;
6. détection des lacunes de visibilité ;
7. recommandations et offre d'accompagnement ;
8. suivi CRM du besoin exprimé, sous réserve de la base légale et des règles applicables.

**Critères de sortie :**
- correspondance de fiche explicable et confirmable ;
- absence de collecte ou conservation non autorisée ;
- quotas et coûts maîtrisés ;
- aucun avis ou score présenté hors de son contexte ;
- parcours de contact soumis aux règles d'autorisation.

## 8. Phase 5 — BrainIOS côté utilisateur

**Objectif :** construire un assistant contextuel qui accompagne réellement le visiteur.

MVP :
- contexte de page et de rubrique ;
- corpus documentaire validé ;
- réponses sourcées ;
- explication des fonctionnalités et limites ;
- propositions d'actions contextualisées ;
- état de conversation contrôlé ;
- refus et désactivation simples ;
- escalade vers un contact humain ;
- tests de qualité, de sécurité et de non-divulgation.

À différer :
- apprentissage autonome du modèle ;
- mémoire longue non contrôlée ;
- accès aux données CRM ;
- actions commerciales automatiques.

**Critère de sortie :** l'assistant répond correctement sur un ensemble de scénarios métier, respecte les permissions et ne pousse pas l'utilisateur dans une action non souhaitée.

## 9. Phase 6 — BrainIOS côté administration

**Objectif :** donner à l'administrateur un poste de pilotage de l'intelligence.

Menu proposé :
- Assistant ;
- Surveillance ;
- Rapports journaliers ;
- Recommandations ;
- Atelier de développement ;
- Laboratoire de tests ;
- Mémoire du projet.

### Traceur et rapports
- définir une taxonomie d'événements utiles ;
- collecter le minimum nécessaire ;
- pseudonymiser les sessions ;
- séparer événements techniques et métier ;
- agréger les données ;
- produire un rapport journalier confidentiel réservé à l'administrateur ;
- gérer les erreurs et alertes ;
- documenter conservation et accès.

**Critère de sortie :** l'administrateur voit des rapports fiables, utiles et minimisés, sans accès superflu aux conversations ou données personnelles.

## 10. Phase 7 — Atelier de développement BrainIOS

**Objectif :** faire de BrainIOS un développeur technique permanent, sous gouvernance.

Capacités par étapes :
1. lire la documentation et le code autorisés ;
2. rechercher les dépendances et routes ;
3. diagnostiquer les anomalies ;
4. proposer un plan de correction ;
5. créer une branche isolée et préparer un diff ;
6. lancer les tests autorisés ;
7. fournir un rapport de résultat et les risques ;
8. demander approbation avant toute fusion ou production.

L'atelier doit être séparé de la production, avec permissions minimales, secrets protégés, journalisation et environnement reproductible.

**Critère de sortie :** BrainIOS peut préparer et tester un correctif dans un environnement contrôlé, mais ne peut pas contourner la validation humaine.

## 11. Phase 8 — Apprentissage et amélioration contrôlés

**Objectif :** utiliser les retours réels pour améliorer progressivement MajestiOS et BrainIOS.

Sources possibles :
- questions récurrentes ;
- demandes et suggestions ;
- abandons de parcours agrégés ;
- erreurs ;
- résultats de l'assistance ;
- tests et évaluations ;
- documentation et décisions.

Cycle :
**Écouter → Observer → Analyser → Apprendre → Proposer → Expérimenter → Évaluer → Améliorer.**

Mécanisme :
- classer les enseignements ;
- évaluer leur fiabilité ;
- produire une recommandation ;
- tester en environnement isolé ;
- faire valider le changement ;
- mesurer l'effet après livraison ;
- conserver la version précédente et un retour arrière.

**Critère de sortie :** chaque amélioration est traçable, mesurée et réversible ; aucune auto-modification sensible de la production.

## 12. Phase 9 — Stabilisation, recette et ouverture

- recette fonctionnelle complète ;
- audit sécurité indépendant ;
- revue juridique et confidentialité ;
- accessibilité ;
- performance et charge ;
- tests de restauration ;
- surveillance et gestion d'incident ;
- documentation opératoire ;
- tests de parcours mobile et desktop ;
- déploiement progressif après autorisation ;
- plan de retour arrière.

## 13. Dépendances et ordre recommandé

Les dépendances majeures sont :

- identité, autorisations et gouvernance des données avant CRM réel, conversations ou rapports ;
- taxonomie et contrats de recherche avant l'ajout de Nettoyage ;
- modèle entreprise/établissement avant Google Maps et Réputation virtuelle ;
- corpus validé et permissions avant BrainIOS côté utilisateur ;
- événements minimisés et gouvernance avant les rapports ;
- environnements isolés et GitHub contrôlé avant l'atelier de développement ;
- évaluations et versions avant l'apprentissage continu.

Les chantiers d'interface et de contenu peuvent avancer en parallèle uniquement s'ils ne préjugent pas des décisions d'architecture ou des routes qui restent à arbitrer.

## 14. Jalons de validation du porteur de projet

| Jalon | Décision attendue |
|---|---|
| G0 — Audit | Valider les constats et les limites |
| G1 — Vision | Valider le périmètre fonctionnel 4.0 |
| G2 — Architecture | Valider domaines, données, permissions et intégrations |
| G3 — Base Git | Valider commit de départ, branches et sort des PR |
| G4 — Socle | Valider sécurité et cloisonnement avant données réelles |
| G5 — Fonctionnel | Valider recherche, CRM, réputation et BrainIOS par lots |
| G6 — Production | Autoriser explicitement le déploiement |

## 15. Mesures de réussite

Mesures à définir après instrumentation autorisée :
- qualité et fraîcheur des résultats ;
- taux de résultats pertinents après qualification humaine ;
- taux de complétion des parcours ;
- demandes d'accompagnement pertinentes ;
- qualité de rapprochement des entreprises ;
- fiabilité des correspondances Google Maps ;
- utilité des réponses BrainIOS ;
- taux d'acceptation et de réussite des recommandations ;
- délai de diagnostic et de correction ;
- taux de régression ;
- coût par recherche, conversation et tâche IA ;
- incidents d'accès ou de confidentialité.

Aucune métrique ne doit être présentée comme disponible tant que le système de mesure correspondant n'existe pas.

## 16. Volet complémentaire — SEO & visibilité de MajestiOS

Ce volet est rattaché à **BrainIOS côté administration** et doit être planifié comme un lot identifiable, sans être confondu avec la Réputation virtuelle proposée aux clients.

### Objectif
Faire de BrainIOS un pilote de veille et d'amélioration SEO continue pour MajestiOS : surveiller la découvrabilité, détecter les régressions, suivre les requêtes et proposer des optimisations utiles, sans prétendre garantir les positions dans les moteurs.

### Lots proposés
**6.B — Mesure et accès aux sources**
- inventorier les propriétés et accès nécessaires ;
- étudier les interfaces officielles Google Search Console et Bing Webmaster Tools ;
- définir les mesures de performance et d'analytique adaptées ;
- cadrer quotas, coûts, permissions, secrets et confidentialité.

**6.C — Audit technique et indexation**
- contrôler sitemap, robots.txt, canonical, codes HTTP, redirections et erreurs ;
- suivre l'indexation des pages ;
- auditer les performances et Core Web Vitals ;
- contrôler les liens internes, la compatibilité mobile et les données structurées.

**6.D — Analyse éditoriale et veille**
- analyser requêtes, pages, intentions de recherche et tendances ;
- repérer les contenus faibles, dupliqués ou manquants ;
- suivre un ensemble limité de concurrents pertinents ;
- surveiller les évolutions documentées des moteurs et les possibilités de recherche assistée par IA, sans confondre ces signaux avec les positions organiques classiques.

**6.E — Recommandations et suivi**
- prioriser les actions selon impact, confiance, coût et risque ;
- préparer les propositions de titres, descriptions, contenus, liens internes et correctifs ;
- conserver un historique des recommandations, validations, changements et résultats ;
- mesurer les effets sans attribuer abusivement toute variation à une seule modification.

### Règles d'exploitation
- Les analyses planifiées et alertes peuvent être automatisées.
- Les changements de contenu, de structure, d'URL, de redirection, de canonical ou d'indexation doivent être soumis à validation humaine.
- Les modifications doivent être testées hors production, versionnées et réversibles.
- Aucune promesse de classement garanti ni technique contraire aux consignes des moteurs.
- Les données SEO internes restent distinctes des dossiers SEO des entreprises clientes.

### Critères de sortie
- sources officielles connectées avec permissions minimales ;
- tableau de bord affichant date, source, périmètre et limites des mesures ;
- alertes testées sur des anomalies reproductibles ;
- recommandations explicables et priorisées ;
- historique complet des validations et modifications ;
- absence de publication ou de modification sensible sans approbation.

### Dépendances et ordre
Ce volet peut commencer par un audit technique non intrusif dès que la base Git et les accès sont validés. Les connexions aux outils, la collecte analytique et les rapports récurrents dépendent du cadrage des accès, de la confidentialité et des pages légales. Il s'intègre à la phase 6 (BrainIOS administrateur), avant ou en parallèle de l'atelier de développement, mais ne doit pas retarder les fondations de sécurité et de données.

**Extension future :** les méthodes validées pourront alimenter les offres de Réputation virtuelle, après définition d'un périmètre client, de droits distincts et de conditions contractuelles adaptées.
