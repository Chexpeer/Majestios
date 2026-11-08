# Cahier des charges fonctionnel — Cheexpeer

**Date :** 8 novembre 2026  
**Plateforme :** MajestiOS V.5  
**Statut :** cadrage fonctionnel cible — préparation documentaire uniquement  
**Activation :** différée ; aucune mission autonome n'est autorisée par ce document.

## 1. Objet et identité

**Cheexpeer est le nom d'emprunt et l'identité d'usage de l'intelligence intégrée à MajestiOS.** Ce n'est pas un produit IA séparé ni un modèle propriétaire à entraîner obligatoirement.

L'identité, les missions, les règles métier et les permissions de Cheexpeer doivent rester distinctes du moteur qui l'alimente. Claude, ChatGPT ou un autre modèle peuvent être connectés comme moteurs, selon une décision technique ultérieure fondée sur la qualité, les capacités, la sécurité, les coûts, la latence, les conditions contractuelles et la portabilité.

- **MajestiOS** : plateforme et environnement de travail.
- **Cheexpeer** : identité fonctionnelle de l'intelligence intégrée.
- **Moteur IA** : modèle ou fournisseur exécutant une partie des tâches.
- **Administration** : autorité de gouvernance, de contrôle, de validation et d'affectation.
- **CRM** : référentiel opérationnel de capitalisation des relations, entreprises, contacts, opportunités et activités.

L'abonnement à une interface conversationnelle d'un fournisseur ne vaut pas automatiquement droit d'intégration dans MajestiOS. Les accès API, licences, conditions d'utilisation et coûts devront être vérifiés séparément. Aucun secret fournisseur ne doit être exposé au navigateur ou au dépôt.

## 2. Finalité et résultats attendus

Cheexpeer doit aider MajestiOS à transformer des informations dispersées et des signaux pertinents en décisions et actions utiles, explicables et contrôlées.

Résultats attendus :
1. détecter les signaux et évolutions pertinents dans les périmètres autorisés ;
2. analyser, rapprocher et qualifier les informations sans confondre faits et hypothèses ;
3. identifier les opportunités les plus prometteuses et expliquer leur priorité ;
4. produire des rapports, synthèses et alertes contextualisés ;
5. préparer des actions commerciales, éditoriales, SEO et administratives ;
6. mesurer les résultats et capitaliser les enseignements vérifiés ;
7. réduire les tâches répétitives sans retirer aux personnes compétentes leur pouvoir de décision.

La valeur de Cheexpeer ne se mesure pas au nombre de tâches automatisées, mais à la fiabilité des informations, au temps utile gagné, à la pertinence des alertes et aux résultats obtenus.

## 3. Périmètre fonctionnel

### 3.1 Veille et surveillance des opportunités

Cheexpeer pourra surveiller les signaux issus des sources et connecteurs autorisés : annonces, marchés, mouvements d'entreprises, créations, cessions, procédures collectives, événements, évolutions de comptes suivis et autres signaux retenus dans les cahiers des charges métier.

Pour chaque signal, il doit :
- conserver l'identifiant et la provenance de la donnée ;
- distinguer date de publication, date de collecte et date de dernière vérification ;
- détecter les changements significatifs et limiter les alertes répétitives ;
- rapprocher le signal des critères de recherche et des fiches autorisées ;
- indiquer les données manquantes, les contradictions et la fraîcheur ;
- proposer une action proportionnée, sans contacter automatiquement un tiers.

Les sources restent invisibles dans les interfaces du moteur de Prospection. Leur traçabilité demeure disponible dans les métadonnées et les outils internes autorisés.

### 3.2 Analyse et qualification

Cheexpeer doit distinguer explicitement :
- fait directement établi par une source ;
- donnée déclarative ;
- donnée calculée ou rapprochée ;
- hypothèse ou inférence ;
- recommandation ;
- information inconnue ou non vérifiée.

Chaque conclusion importante doit être accompagnée de ses éléments justificatifs, de la date, des sources consultées, du niveau de confiance et des limites. Une absence de donnée ne doit jamais être transformée en conclusion négative certaine.

Les codes APE/NAF, effectifs, annonces ou scores de similarité ne prouvent pas à eux seuls une compétence, une capacité, une disponibilité ou une volonté d'achat.

### 3.3 Scoring et notation des leads

Cheexpeer pourra proposer un score de priorité explicable, jamais une vérité absolue ni une décision automatique de qualification.

Dimensions candidates à évaluer, selon disponibilité et légitimité des données :
- adéquation avec l'activité, les compétences et l'offre ;
- potentiel économique estimé ;
- urgence ou fenêtre temporelle ;
- qualité, fraîcheur et fiabilité des informations ;
- adéquation géographique ;
- signaux d'intérêt ou d'intention observables ;
- historique relationnel et interactions CRM autorisées ;
- probabilité estimée de progression commerciale, avec prudence.

Exigences :
1. afficher le score, son échelle et sa date de calcul ;
2. expliquer les facteurs positifs, négatifs et inconnus ;
3. montrer les données utilisées et leur provenance ;
4. distinguer score de priorité, niveau de confiance et statut de qualification humaine ;
5. permettre à un collaborateur habilité de corriger, commenter ou contester le résultat ;
6. conserver la version de la méthode et les paramètres utilisés ;
7. tester faux positifs, faux négatifs, biais, dérive et stabilité ;
8. ne jamais utiliser une caractéristique sensible ou un proxy injustifié ;
9. ne pas déclencher seul une sollicitation, une exclusion ou une décision produisant un effet significatif sur une personne.

Le score initial doit être testé en mode silencieux ou consultatif sur un jeu de cas contrôlé avant d'être exposé dans les parcours opérationnels.

### 3.4 Rapports et alertes

Rapports possibles :
- opportunités nouvelles, évolutions et échéances ;
- opportunités prioritaires et justification du classement ;
- activité des entreprises suivies ;
- qualité et fraîcheur des données ;
- couverture et disponibilité des sources ;
- synthèses par rubrique, territoire, secteur ou période ;
- résultats de prospection et progression CRM ;
- santé SEO et visibilité numérique ;
- anomalies de la plateforme et résultats des contrôles autorisés.

Chaque alerte doit comporter au minimum : objet, motif, gravité ou priorité, source, horodatage, confiance, évolution depuis le dernier état, destinataire autorisé et action proposée. Les seuils et fréquences doivent être configurables ; les doublons et alertes sans valeur doivent être maîtrisés.

### 3.5 Développement commercial et CRM

Cheexpeer peut :
- préparer une fiche entreprise ou opportunité ;
- proposer des rapprochements avec les fiches existantes ;
- signaler des doublons potentiels ;
- préparer une prochaine action, une relance ou un brouillon ;
- synthétiser l'historique autorisé ;
- proposer une affectation à un collaborateur en expliquant le motif ;
- suivre les résultats après validation et mise à jour CRM.

Il ne peut pas, sans autorisation spécifique :
- créer ou modifier des données CRM ;
- fusionner des fiches ;
- changer un responsable ou une affectation ;
- envoyer un e-mail, message ou courrier ;
- lancer une campagne ou prendre rendez-vous ;
- exporter ou transmettre des données à un tiers.

Les transmissions inter-rubriques et vers le CRM suivent le circuit validé par le fondateur : préparation, contrôles, validation de l'Administration, affectation, restitution au demandeur ou au bénéficiaire autorisé, puis capitalisation. Le demandeur initial et le bénéficiaire final peuvent être différents. Les droits d'accès s'appliquent indépendamment de la validation administrative.

### 3.6 SEO, marketing et visibilité numérique

Le SEO constitue un domaine de mission à part entière de Cheexpeer. Sa finalité est de transformer la visibilité organique de MajestiOS en visites qualifiées, demandes pertinentes et opportunités commerciales mesurables.

**Audit et diagnostic**
- analyser l'exploration, l'indexabilité, les statuts HTTP, les redirections et les erreurs ;
- contrôler les titres, descriptions, hiérarchie des titres, URL canoniques, robots directives, sitemap et données structurées ;
- examiner maillage interne, profondeur des pages, pages orphelines et cohérence de l'arborescence ;
- suivre performance, ergonomie mobile, accessibilité et signaux de qualité technique ;
- repérer contenus dupliqués, faibles, obsolètes ou en conflit d'intention.

**Recherche et stratégie éditoriale**
- identifier mots-clés, variantes, questions et intentions de recherche ;
- cartographier les requêtes par rubrique, page, public et étape du parcours ;
- repérer les sujets manquants et les risques de cannibalisation ;
- préparer briefs, plans, contenus et mises à jour avec sources et objectif explicite ;
- respecter le vocabulaire métier, la promesse réelle et la structure de MajestiOS.

**Référencement local**
- analyser les intentions et besoins par territoire ;
- proposer des contenus locaux uniquement lorsque MajestiOS dispose d'une offre, d'une couverture ou d'une information réellement pertinente ;
- éviter les pages départementales artificielles, répétitives ou trompeuses ;
- distinguer visibilité locale, établissement réel et zone de service.

**Autorité et concurrence**
- surveiller les concurrents et changements de résultats ;
- repérer des partenariats et liens éditoriaux légitimes ;
- éviter achats de liens artificiels, réseaux de sites, contenus trompeurs et techniques contraires aux règles des moteurs.

**Mesure**
- suivre impressions, clics, CTR, positions, indexation, trafic organique et conversions ;
- relier les résultats aux formulaires, demandes et opportunités CRM lorsque les données sont disponibles et que les règles de confidentialité le permettent ;
- distinguer attribution observée, corrélation et hypothèse ;
- annoter les changements éditoriaux et techniques afin de mesurer leurs effets.

**Outils et accès**
Les données de Search Console, d'outils d'analyse d'audience, de mesure de performance, de crawl et de suivi de positionnement pourront être utilisées après sélection, autorisation et configuration. Aucun outil n'est réputé connecté du seul fait qu'il figure dans ce cahier des charges.

**Limites**
Cheexpeer peut surveiller, diagnostiquer, prioriser, rédiger et préparer des changements. La publication de contenus, les modifications de pages publiques, redirections, directives d'indexation, données structurées, campagnes ou actions de netlinking nécessitent une validation adaptée. Toute modification doit être versionnée, testée, traçable et réversible.

### 3.7 Administration, qualité et continuité

Dans le périmètre explicitement autorisé, Cheexpeer peut aider à surveiller :
- disponibilité et fraîcheur des connecteurs ;
- erreurs applicatives et anomalies récurrentes ;
- résultats CI et tests de non-régression ;
- incohérences documentaires et liens cassés ;
- consommation, latence et coûts des moteurs IA ;
- incidents et alertes de sécurité non sensibles.

Il peut préparer des diagnostics et correctifs. Il ne modifie pas les rôles, permissions, règles RLS, secrets, schémas de production, paramètres de facturation ou déploiements sans procédure d'approbation dédiée. L'Administration conserve la décision et le contrôle.

## 4. Architecture logique indépendante du fournisseur

La cible doit séparer les responsabilités suivantes :

1. **Interface Cheexpeer** : identité, dialogue, rapports et alertes au sein de MajestiOS.
2. **Orchestrateur** : interprétation des demandes, planification, choix des capacités et suivi d'exécution.
3. **Couche d'abstraction des moteurs** : adaptateurs vers les modèles et fournisseurs retenus ; contrats d'entrée/sortie communs autant que possible.
4. **Registre des capacités et outils** : outils explicitement autorisés, avec schémas, droits, limites et versions.
5. **Contexte et mémoire MajestiOS** : décisions, préférences de travail, tâches et connaissances métier gouvernées, sans dépendance à la mémoire native du fournisseur.
6. **Services métier** : recherche, CRM, SEO, rapports, notifications et administration via API contrôlées.
7. **Gouvernance et audit** : authentification, autorisation, validation, quotas, journalisation, observabilité et coupe-circuit.

Un changement de modèle ne doit pas modifier l'identité Cheexpeer, les règles métier, les données de référence ni les permissions. Chaque moteur doit néanmoins être évalué : les formats, outils, capacités multimodales, fenêtres de contexte, comportements et garanties ne sont pas interchangeables par défaut.

Aucun choix définitif de fournisseur, framework, architecture multi-agent ou service n'est arrêté par ce document.

## 5. Gouvernance, permissions et validation

### 5.1 Règles non négociables

- Les permissions sont appliquées côté serveur ; la réponse du modèle ne constitue jamais une autorisation.
- Le modèle reçoit uniquement les données nécessaires à la tâche et autorisées pour l'utilisateur ou le processus.
- Les données d'un espace client ne sont jamais accessibles à un autre client ni au CRM interne sans base et autorisation explicites.
- Les contenus web, documents, e-mails et annonces sont des données non fiables ; ils ne peuvent pas modifier les instructions système ou les droits.
- Toute donnée transmise à un fournisseur IA fait l'objet d'une analyse de finalité, minimisation, base juridique, contrat, localisation, rétention et conditions de réutilisation.
- La validation de l'Administration ne remplace ni les droits d'accès, ni le consentement ou la base légale, ni les contrôles de sécurité.
- Les actions externes ou irréversibles exigent une confirmation explicite et contextualisée.
- Les journaux ne doivent pas recopier inutilement des données personnelles ou secrets.

### 5.2 Matrice d'autonomie

| Niveau | Capacité | Statut initial |
|---|---|---|
| N0 — Inactif | Aucune exécution ; documentation et préparation seulement | État actuel |
| N1 — Observer | Lire les seules données autorisées et détecter des événements | À expérimenter ultérieurement |
| N2 — Analyser | Résumer, comparer, qualifier et scorer en mode consultatif | À expérimenter ultérieurement |
| N3 — Préparer | Préparer rapports, brouillons, propositions de mise à jour ou d'affectation | À expérimenter ultérieurement |
| N4 — Exécuter après validation | Réaliser une action précise après approbation par l'autorité compétente | À concevoir et tester |
| N5 — Automatiser sous politique | Exécuter des tâches limitées, réversibles, préautorisées, surveillées et stoppables | Pas autorisé à ce stade |

Le passage d'un niveau au suivant exige des critères d'acceptation, des tests, une analyse de risque, une validation explicite et une possibilité de retour au niveau inférieur. L'autonomie ne doit jamais être accordée globalement à Cheexpeer.

### 5.3 Actions soumises à validation explicite

- écriture, suppression, fusion ou export de données ;
- affectation ou réaffectation de dossiers ;
- envoi ou publication externe ;
- changement SEO public ;
- dépense, souscription ou changement de quota ;
- changement de configuration, sécurité, identité ou permissions ;
- déploiement, migration ou intervention de production.

## 6. Traçabilité et contrat d'une tâche

Chaque tâche significative doit pouvoir conserver, selon sa nature et les règles de minimisation :
- identifiant de tâche et corrélation ;
- demandeur, bénéficiaire et responsable ;
- finalité et périmètre ;
- rôle Cheexpeer et capacité utilisée ;
- moteur, version du modèle et version des instructions ;
- outils et versions appelés ;
- références des données consultées et horodatages ;
- décisions de validation et identité de l'approbateur ;
- entrées/sorties utiles, erreurs, incertitudes et résultat ;
- coût, latence et consommation ;
- statut final, éventuelle reprise et lien vers le dossier CRM ou rubrique.

Les journaux doivent être protégés contre les accès indus, limités dans leur contenu et leur durée, et adaptés aux obligations légales. Ne pas conserver automatiquement l'intégralité des prompts ou données brutes lorsqu'une référence et une empreinte suffisent.

## 7. Rapports, notifications et expérience utilisateur

Les rapports doivent être lisibles, datés, contextualisés et orientés décision. Ils indiquent le périmètre analysé, la période, les sources, les critères, les limites, les éléments nouveaux et les actions recommandées.

Les notifications doivent :
- cibler uniquement le demandeur, le bénéficiaire ou le collaborateur autorisé ;
- proposer des fréquences, seuils et canaux configurables ;
- regrouper les événements similaires ;
- distinguer information, avertissement et urgence ;
- permettre de consulter l'élément source et de corriger les préférences ;
- ne pas exposer de données confidentielles dans un aperçu non authentifié.

## 8. Évaluation et indicateurs

Aucun indicateur ne doit être annoncé comme mesuré avant instrumentation et validation de sa méthode.

**Veille et opportunités**
- délai entre publication, collecte et alerte ;
- taux de signaux pertinents après revue humaine ;
- taux de doublons et d'alertes répétitives ;
- fraîcheur, couverture et disponibilité des sources.

**Qualification et scoring**
- précision des leads prioritaires ;
- faux positifs et faux négatifs ;
- taux de scores contestés ou corrigés ;
- calibration et stabilité du score ;
- qualité de l'explication et traçabilité des facteurs.

**SEO**
- couverture d'indexation et erreurs techniques ;
- impressions, clics, CTR et visibilité par groupe de pages ;
- trafic organique qualifié ;
- conversions et demandes attribuables selon une méthode explicite ;
- évolution après changements annotés ;
- part de recommandations validées, rejetées et ayant produit un effet mesurable.

**Opérations et coûts**
- taux de réussite par type de tâche ;
- erreurs factuelles, citations défectueuses et réponses non fondées ;
- taux d'intervention humaine et temps gagné ;
- latence, disponibilité et coût par tâche ;
- incidents de permission, données ou actions ;
- capacité à arrêter, reprendre et revenir à une version antérieure.

Les évaluations doivent utiliser des cas représentatifs, des jeux de référence contrôlés et des revues humaines. Les résultats sont ventilés par mission et niveau de risque ; un score global unique est insuffisant.

## 9. Déploiement par étapes et critères de passage

### Phase 0 — Préparation documentaire et technique (maintenant)

- harmoniser l'identité Cheexpeer dans la documentation ;
- inventorier les données, sources, droits, outils et dépendances ;
- préparer les contrats de tâches, la gouvernance, les critères d'évaluation et la couche d'abstraction cible ;
- préciser les besoins SEO et les données de mesure disponibles ;
- ne pas activer de surveillance autonome ni d'accès fournisseur en production.

**Sortie :** cahier des charges approuvé, écarts connus, dépendances et risques documentés.

### Phase 1 — Prototype isolé en lecture seule

- choisir un moteur pilote après comparaison ;
- utiliser un environnement de test et un jeu de données non sensibles ;
- expérimenter recherche, synthèse, rapports et diagnostic SEO ;
- interdire les écritures et actions externes ;
- mesurer qualité, coût, latence et erreurs.

**Sortie :** résultats reproductibles, contrôles de permissions validés et rapport d'évaluation.

### Phase 2 — Veille et analyse contrôlées

- connecter un périmètre limité de sources autorisées ;
- mettre en place collecte horodatée, déduplication, fraîcheur et alertes ;
- tester qualification et scoring en mode silencieux ;
- faire valider les rapports et alertes par des utilisateurs habilités.

**Sortie :** pertinence et taux d'erreur mesurés sur un échantillon validé.

### Phase 3 — Préparation des actions

- préparer des fiches CRM, brouillons, recommandations SEO et propositions d'affectation ;
- présenter les données, les impacts et la provenance avant toute action ;
- conserver les approbations et résultats ;
- vérifier les retours arrière.

**Sortie :** workflow de validation complet et auditable.

### Phase 4 — Exécution limitée après validation

- autoriser seulement des actions précises, à faible risque et réversibles ;
- limiter chaque outil par rôle, ressource, durée et budget ;
- surveiller erreurs et coûts ;
- fournir arrêt d'urgence et procédure de reprise.

**Sortie :** preuves d'exécution maîtrisée, absence d'accès hors périmètre et audit favorable.

### Phase 5 — Automatisations ciblées

- définir des politiques par tâche et non un droit global ;
- exécuter uniquement les opérations préautorisées, idempotentes et contrôlables ;
- maintenir supervision, alertes, quotas et possibilité de suspension ;
- réévaluer régulièrement les performances et les risques.

**Sortie :** valeur démontrée et gouvernance durable.

## 10. Dépendances à préparer avant activation

1. Identité, authentification, rôles et permissions serveur.
2. Séparation CRM interne / espaces clients et contrôle multi-tenant.
3. Contrat de circulation des données et validation Administration.
4. Provenance, identifiants stables, déduplication et qualité des données.
5. Registre des sources et connecteurs, conditions d'accès, fraîcheur et disponibilité.
6. API métier contrôlées pour recherche, CRM, SEO, rapports et notifications.
7. Journal d'audit, observabilité, quotas et gestion des coûts.
8. Gestion sécurisée des secrets et séparation des environnements.
9. Corpus de tests, évaluations, cas adversariaux et procédure de revue.
10. Sauvegardes, arrêt d'urgence, restauration et retour arrière.

Chaque dépendance doit être classée : existante et vérifiée, partielle, à construire, ou inconnue. Une mention documentaire n'est pas une preuve d'implémentation.

## 11. Risques principaux et mesures de maîtrise

| Risque | Mesure de maîtrise |
|---|---|
| Dépendance à un fournisseur | Couche d'abstraction, formats documentés, tests comparatifs et stratégie de repli |
| Hallucination ou mauvaise qualification | Provenance, niveaux de confiance, règles déterministes et validation humaine |
| Fuite de données | Minimisation, cloisonnement, contrôle serveur, contrats fournisseurs et audit |
| Faux scoring ou biais | Explicabilité, tests de performance, revue humaine et contestation |
| Alertes excessives | Seuils, regroupement, déduplication et réglage par utilisateur |
| Publication SEO dommageable | Prévisualisation, tests, approbation et retour arrière |
| Coûts incontrôlés | Quotas, budgets, suivi par tâche et limites d'exécution |
| Prompt injection | Séparation instructions/données, outils à privilèges minimaux et validation côté serveur |
| Action non autorisée | Confirmation explicite, politiques par outil et coupe-circuit |
| Dégradation du modèle | Évaluations versionnées, surveillance et possibilité de changer de moteur |

## 12. Décisions réservées au fondateur

Ce cahier des charges ne décide pas :
- du premier moteur IA ni de son fournisseur ;
- des abonnements, contrats API ou budgets ;
- de la technologie d'orchestration ou du nombre d'agents ;
- des connecteurs SEO et commerciaux à activer ;
- des seuils de scoring et d'alerte ;
- des tâches qui pourront être préautorisées ;
- des dates d'activation et niveaux d'autonomie ;
- des changements de production ou des permissions.

Toute évolution de ces points doit faire l'objet d'un arbitrage documenté. L'Administration conserve ses prérogatives de contrôle et de validation.

## 13. Règle de clôture

**Cheexpeer est une identité durable de MajestiOS, indépendante du modèle qui l'alimente. Ses capacités peuvent évoluer, mais ses accès, ses responsabilités et son autonomie restent explicitement gouvernés.**

Ce document prépare l'intégration future ; il n'active pas Cheexpeer, ne connecte aucun fournisseur, ne crée aucun accès API et n'autorise aucune opération autonome.
