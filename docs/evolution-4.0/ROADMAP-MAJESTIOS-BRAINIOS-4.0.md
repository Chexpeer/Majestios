# Feuille de route — MajestiOS 4.0 et BrainIOS

**Date :** 4 novembre 2026  
**Statut :** feuille de route de travail 4.0 engagée sur la branche dédiée ; les choix techniques non encore vérifiés restent explicitement ouverts.  
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
- Les contre-audits externes sont facultatifs. Les observations techniques retenues sont suivies dans `REGISTRE-OBSERVATIONS-TECHNIQUES-4.0.md` ; elles ne dictent pas la vision produit.

## 2. Vue synthétique des phases

| Phase | Intitulé | Résultat attendu | Statut |
|---|---|---|---|
| 0 | Cadrage documentaire et lancement | Diagnostic 3.0, vision cible, feuille de route et branche 4.0 créés | TERMINÉ |
| 1 | Réconciliation Git et hygiène technique | PR cartographiées, risques techniques vérifiés, socle stabilisé | EN COURS |
| 2 | Fondations sécurité et données | Identité, permissions, données, API, audit et sauvegardes | À ARBITRER / À CONSTRUIRE |
| 3 | Socle développement commercial | Recherche fiable, taxonomie, sources, qualification, CRM fondamental | À CONSTRUIRE |
| 4 | Réputation virtuelle | Recherche de présence locale, vérification et parcours d'accompagnement | À CONSTRUIRE |
| 5 | BrainIOS utilisateur | Assistant contextuel utile, sourcé et non intrusif | À CONSTRUIRE |
| 6 | BrainIOS administrateur | Cockpit de pilotage, API OpenAI, demandes, mémoire, rapports, budgets et recommandations | PROTOTYPE UX INITIAL RÉALISÉ / BACKEND À CONSTRUIRE |
| 7 | Atelier BrainIOS | Évolution pilotée depuis l'admin : GitHub, lots isolés, tests, SEO et validations | À CONSTRUIRE |
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

**Critère de sortie :** diagnostic, vision, feuille de route et branche de travail 4.0 sont disponibles. Cette phase est terminée ; le développement peut commencer par lots sans attendre un nouvel avis externe.

## 4. Phase 1 — Réconciliation Git et cadrage détaillé

**Objectif :** choisir une base de développement fiable sans perdre les acquis.

Travaux :
- comparer les arbres et commits de `main`, `evolution-2.0`, `evolution-3.0`, sauvegardes et branches de PR ;
- classifier chaque PR ouverte : conserver, intégrer dans la base, réimplémenter, fermer/archiver après décision ;
- résoudre les chaînes empilées #24–26, #29–31 et #32–34 ;
- confirmer et documenter la base exacte de la branche `evolution-4.0` (créée le 4 novembre 2026 depuis la branche documentaire fondée sur `evolution-3.0`) ;
- établir une matrice exigences → modules → données → permissions → API → tests ;
- mettre à jour les instructions des agents et la documentation canonique.

**Critère de sortie :** un commit de base vérifié, une cartographie des PR, un plan de conservation des changements et un registre des décisions techniques.

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

**Objectif :** faire de l'espace admin le cockpit depuis lequel le porteur du projet pilote et fait évoluer MajestiOS avec BrainIOS, alimenté par une API OpenAI payante dédiée.

### 6.0 — Ergonomie et structure du cockpit (prototype initial réalisé)
- shell de navigation et vue d'ensemble ;
- modules BrainIOS, demandes/lots, atelier GitHub, qualité, SEO et paramètres ;
- design system autonome, responsive et accessible au clavier ;
- prototype isolé dans `admin/`, non inclus dans le build public ;
- aucun backend, compte, donnée persistante ou appel externe à ce stade.

Référence : `FONDATIONS-BACK-OFFICE-4.0.md`. Le prototype est une base de conception, pas une interface sécurisée ni une fonctionnalité opérationnelle.

Menu et fonctions :
- Assistant BrainIOS et contexte projet ;
- vision, mémoire et décisions ;
- demandes, backlog, lots et priorités ;
- surveillance et rapports journaliers confidentiels ;
- recommandations fonctionnelles, techniques et commerciales ;
- état GitHub, tests et résultats ;
- SEO et visibilité ;
- paramètres IA non secrets, budgets et consommation API.

Lots :
1. authentification admin et autorisations serveur ;
2. backend BrainIOS et passerelle OpenAI ;
3. conversation admin avec mémoire projet autorisée ;
4. création de demandes, plans, tâches et décisions ;
5. budgets, quotas, alertes et suivi des coûts ;
6. rapports, surveillance et recommandations.

**Critère de sortie :** le porteur peut dialoguer avec BrainIOS depuis l'admin, retrouver la mémoire du projet, transformer une demande en plan de travail et suivre son état. La clé API reste côté serveur ; les coûts sont bornés et traçables.

## 10. Phase 7 — Atelier d'évolution piloté depuis l'admin

**Objectif :** permettre au porteur de faire réaliser les évolutions MajestiOS depuis l'espace admin, BrainIOS préparant les changements et contrôles dans un environnement isolé.

Capacités par étapes :
1. analyser la demande et l'état réel du dépôt ;
2. retrouver les décisions, contraintes et travaux antérieurs ;
3. identifier les fichiers, modules, dépendances et risques ;
4. transformer la demande en lot et critères d'acceptation ;
5. créer une branche isolée et préparer les modifications ;
6. exécuter build, tests, SEO et contrôles anti-régression ;
7. présenter les diffs, preuves, limites et risques dans l'admin ;
8. recueillir la décision du porteur avant fusion ou production.

L'atelier est relié à GitHub avec des permissions minimales. Les opérations sont historisées et réversibles autant que possible.

**Critère de sortie :** une évolution demandée depuis l'admin peut être analysée, planifiée, préparée, testée et présentée. Aucune fusion ou mise en production n'est déclenchée sans autorisation distincte.

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


## 15. Décision structurante — pilotage par l'espace admin

Le porteur du projet a confirmé que les évolutions futures de MajestiOS seront pilotées depuis l'espace d'administration. BrainIOS sera alimenté par une clé API OpenAI payante dédiée à l'application.

Le document de référence détaillé est [BrainIOS — API OpenAI et cockpit d'évolution MajestiOS](BRAINIOS-API-ET-ESPACE-ADMIN.md).

Cette décision implique que l'espace admin n'est pas un chantier secondaire : il est une pièce structurante du produit et doit être développé assez tôt pour devenir le point d'entrée des évolutions suivantes.

La clé API est un secret serveur, jamais un champ de formulaire admin. La facturation API est distincte de l'abonnement ChatGPT. Le service devra comporter des budgets, quotas, alertes et un suivi des coûts avant son ouverture à un usage régulier.


---

## 17. Feuille de route d'exécution — prochains changements

Cette section transforme les phases fonctionnelles en une séquence de lots techniques concrets. Elle est priorisée pour obtenir rapidement un cockpit réellement utilisable, sans exposer l'administration ni construire prématurément des fonctions coûteuses.

### Ordre directeur

**Sécuriser le terrain → rendre le cockpit accessible → connecter BrainIOS → lui donner une mémoire fiable → lui confier la préparation des évolutions → étendre les modules métier et SEO.**

Les lots sont séquentiels lorsqu'ils touchent à l'identité, aux données ou aux secrets. Les travaux documentaires, UX et contrôles de qualité peuvent avancer en parallèle s'ils ne créent pas de dépendance cachée.

### Lot A — Consolider le chantier back-office et la base Git
**Priorité : P0 — préalable immédiat**

- conserver le prototype dans `foundation-backoffice-4.0` jusqu'à revue ;
- vérifier l'arborescence, le build, les scripts de test et les règles d'exclusion du dossier `admin/` ;
- exécuter le build et les tests disponibles, ajouter un contrôle explicite garantissant que le prototype privé n'entre pas dans `dist/` ;
- vérifier accessibilité clavier, responsive, liens internes, erreurs console et cohérence des états désactivés ;
- clarifier la cartographie des branches et PR héritées sans les fusionner ni les retargeter ;
- intégrer les changements du prototype à la branche 4.0 uniquement après validation des contrôles et de la stratégie de branche.

**Livrables :** rapport de vérification, inventaire des scripts, preuve d'exclusion du build public, décision de conservation du prototype.  
**Critère de sortie :** build et contrôles ciblés reproductibles ; aucun fichier admin privé dans l'artefact public.

### Lot B — Choisir et documenter le socle backend / identité
**Priorité : P0 — avant toute connexion réelle**

- inspecter les ressources Vercel et Supabase réellement disponibles, sans créer ni modifier de service ;
- comparer les options d'authentification, de base relationnelle, de sessions, de migrations, de coûts et de portabilité ;
- retenir une architecture minimale compatible avec le prototype statique existant et l'hébergement retenu ;
- définir les environnements local, preview et production ;
- décider comment sera créé et récupéré le premier compte administrateur ;
- rédiger le modèle de menace et le contrat d'accès des routes admin.

**Livrables :** ADR (décision d'architecture), schéma de flux, matrice coûts/risques, procédure de bootstrap admin.  
**Critère de sortie :** choix explicite et vérifié ; aucun secret ni service externe créé pendant la phase d'étude.

### Lot C — Authentification et périmètre d'administration
**Priorité : P0 — fondation de sécurité**

- implémenter une authentification réelle ;
- vérifier chaque requête et rôle administrateur côté serveur ;
- gérer sessions sécurisées, expiration, révocation, protection CSRF/origine et limitation de fréquence ;
- protéger toutes les routes sous `/api/v1/admin/` ;
- prévoir une page de connexion et les états session expirée / accès refusé ;
- ajouter tests anonymes, utilisateur authentifié non admin, admin, session expirée et accès direct aux API ;
- éviter tout accès public aux données et rapports du cockpit.

**Livrables :** login fonctionnel, middleware/guard serveur, tests de permissions, procédure de récupération d'accès.  
**Critère de sortie :** les routes sont refusées par défaut et la matrice de permissions est démontrée par des tests.

### Lot D — API admin et persistance minimale
**Priorité : P0 — rendre le cockpit vivant**

- établir les contrats API versionnés ;
- créer les entités demandes, plans, lots, tâches, décisions et événements d'audit ;
- versionner les migrations et documenter sauvegarde/restauration ;
- ajouter validation stricte des entrées et pagination ;
- connecter la vue d'ensemble à des données réelles, avec états chargement/vide/erreur ;
- journaliser les opérations sensibles sans secrets ni contenu inutilement personnel.

**Livrables :** schéma initial, migrations, services, routes et tests d'intégration.  
**Critère de sortie :** une demande peut être créée, consultée, modifiée et historisée par un administrateur autorisé.

### Lot E — Passerelle BrainIOS / OpenAI
**Priorité : P1 — premier usage intelligent du cockpit**

- configurer une clé API dédiée dans les secrets serveur uniquement ;
- créer une passerelle backend qui n'accepte que les appels admin autorisés ;
- définir modèles autorisés, limites de tokens, budgets, quotas, timeouts et gestion des erreurs ;
- enregistrer les métriques d'usage et coûts estimés sans conserver de secrets ;
- ajouter un coupe-circuit lorsque le budget ou les quotas sont atteints ;
- présenter clairement l'état de configuration sans jamais afficher la clé.

**Livrables :** service IA serveur, paramètres non secrets, suivi de consommation, tests de sécurité et de budget.  
**Critère de sortie :** une conversation admin fonctionne sans appel direct navigateur → OpenAI ; les limites et refus sont testés.

### Lot F — Mémoire projet et gestion des demandes
**Priorité : P1 — continuité et pilotage**

- structurer la mémoire à partir de la vision, des décisions validées, du vocabulaire et des documents de référence ;
- distinguer mémoire confirmée, hypothèses, idées en attente et historique ;
- rendre les entrées consultables, versionnées, corrigibles et traçables ;
- permettre à BrainIOS de résumer une demande, identifier les impacts, proposer un lot, critères d'acceptation et risques ;
- demander une validation avant de transformer une proposition en travail autorisé ;
- ne pas inclure automatiquement les données CRM ou personnelles dans le contexte IA.

**Livrables :** mémoire projet versionnée, interface de conversation, gestion demandes/plans/lots/décisions.  
**Critère de sortie :** BrainIOS restitue les décisions pertinentes et transforme une demande en plan vérifiable sans inventer l'état du dépôt.

### Lot G — Atelier GitHub, build et anti-régression
**Priorité : P1 — capacité d'évolution contrôlée**

- relier le compte GitHub via un jeton/app à permissions minimales ;
- inspecter le dépôt et les fichiers autorisés ;
- créer des branches de travail isolées ;
- afficher diff, fichiers modifiés et justification ;
- lancer build, tests et contrôles de liens/architecture ;
- présenter preuves, limites, risques et retour arrière ;
- séparer approbation de plan, approbation de modification, fusion et déploiement.

**Livrables :** atelier de changement, journal d'exécution, rapports de tests et mécanisme de validation.  
**Critère de sortie :** une modification est préparée et testée en branche isolée ; aucune fusion ou publication sans approbation distincte.

### Lot H — SEO, rapports et veille continue
**Priorité : P2 — après fiabilisation du cockpit et de l'observabilité**

- établir l'audit SEO technique initial de MajestiOS ;
- intégrer progressivement Search Console et Bing Webmaster Tools si autorisés ;
- suivre indexation, sitemap, robots, canonical, redirections, erreurs HTTP, métadonnées, données structurées, maillage interne, mobile et Core Web Vitals ;
- distinguer positions et données mesurées des hypothèses, tendances et estimations ;
- suivre les évolutions de recherche générative séparément du référencement naturel classique ;
- générer des alertes et recommandations, puis préparer les corrections dans des lots isolés ;
- exiger revue humaine pour les URLs, canonicals, redirections, contenus stratégiques et directives d'indexation.

**Livrables :** audit de référence, tableau de suivi, rapports périodiques et backlog d'optimisation.  
**Critère de sortie :** les alertes sont sourcées et reproductibles ; les corrections proposées sont mesurables et réversibles.

### Lot I — Modules métier MajestiOS et intégrations
**Priorité : P2/P3 — selon les dépendances métier**

- stabiliser le moteur transversal et sa taxonomie ;
- réconcilier les adaptateurs BOAMP et BODACC ;
- finaliser les règles de la catégorie Nettoyage ;
- construire le référentiel entreprise/établissement et le CRM fondamental ;
- implémenter Réputation virtuelle sur les interfaces autorisées et avec résolution des homonymes ;
- développer Prosp'active avec qualification, provenance, préférences et validation humaine ;
- connecter BrainIOS utilisateur après validation du corpus et des permissions.

**Livrables :** modules métier par lots, contrats API, tests de parcours et preuves de provenance.  
**Critère de sortie :** chaîne de valeur traçable de la détection à la capitalisation, avec les droits et contrôles adaptés.

### Lot J — Recette, sécurité et ouverture
**Priorité : P0 avant toute mise en production**

- tests de bout en bout desktop/mobile ;
- audit de sécurité et tests de cloisonnement ;
- contrôle des données personnelles et conformité ;
- tests de sauvegarde et restauration ;
- tests de charge, performance et accessibilité ;
- vérification des coûts et alertes ;
- procédure incident et retour arrière ;
- validation finale explicite avant déploiement.

**Livrables :** dossier de recette, rapport sécurité, plan d'exploitation et décision d'ouverture.  
**Critère de sortie :** tous les critères critiques sont démontrés ; la mise en production fait l'objet d'une autorisation distincte.

### Priorisation synthétique

| Ordre | Lot | Priorité | Dépend de | Résultat concret |
|---:|---|---|---|---|
| 1 | A — Consolidation et vérifications | P0 | Prototype existant | Base propre et contrôlée |
| 2 | B — Choix backend / identité | P0 | A | Architecture décidée |
| 3 | C — Authentification admin | P0 | B | Accès admin sécurisé |
| 4 | D — API et persistance | P0 | B, C | Données et demandes réelles |
| 5 | E — BrainIOS / OpenAI | P1 | C, D | IA utilisable côté admin |
| 6 | F — Mémoire et demandes | P1 | D, E | Continuité du projet |
| 7 | G — Atelier GitHub | P1 | C, D, F | Évolutions isolées et testées |
| 8 | H — SEO et veille | P2 | D, E, G | Pilotage SEO mesuré |
| 9 | I — Modules métier | P2/P3 | B, C, D | Fonctions commerciales robustes |
| 10 | J — Recette et ouverture | P0 final | Tous les lots ouverts | Autorisation de production |

### Règles de progression

- Commencer par le lot A : vérifier ce qui a été préparé avant d'empiler du code.
- Ne pas créer de projet Supabase, de base, de compte fournisseur ou de secret sans avoir vérifié les ressources et présenté le choix technique.
- Ne pas demander à l'utilisateur de coller une clé privée dans le chat ou dans l'interface navigateur ; la configuration se fera dans les secrets serveur.
- Les lots peuvent être subdivisés en sous-lots courts, mais chaque sous-lot conserve ses critères de sortie.
- À chaque étape, mettre à jour ce document avec le statut réel, le commit, les tests exécutés et les risques résiduels.
- La branche `foundation-backoffice-4.0` reste isolée jusqu'à validation de son intégration dans la ligne 4.0.
