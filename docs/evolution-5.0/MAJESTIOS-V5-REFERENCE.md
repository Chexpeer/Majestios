# MajestiOS V.5 — référence fonctionnelle et technique

**Statut :** référence de cadrage et d'architecture pour la branche `evolution-5.0`
**Mise à jour :** 4 novembre 2026
**Branche examinée :** `evolution-5.0`, commit `b64264f30b9be6a8d8380aaa4c1414e6c3c9250a`
**Nature :** doctrine cible et état vérifié du prototype ; ce document ne vaut ni décision technique fournisseur ni preuve de mise en production.

## 1. Autorité et lecture

Ce document est la référence centrale V5. Il rassemble la vision, l'arborescence, les frontières fonctionnelles, l'architecture technique réellement présente, les états de réalisation et les décisions restant à prendre. Les autres documents V5 précisent certains sujets ; en cas de divergence, appliquer la présente référence et inscrire l'écart dans l'audit de conformité.

Les éléments sont étiquetés comme suit :

- **FAIT VÉRIFIÉ** : constaté dans le dépôt ou confirmé par un contrôle indiqué.
- **DÉCISION DE CADRAGE** : orientation explicitement donnée par le propriétaire du projet.
- **CIBLE** : comportement attendu, non nécessairement implémenté.
- **PROPOSITION** : option à examiner, non validée.
- **À ARBITRER** : choix qui requiert une décision du propriétaire.

L'absence de V4 dans le dépôt examiné est un **fait vérifié** : aucun document suivi sous `docs/evolution-4.0/` ou `docs/evolution-4/` n'a été trouvé. La V4 reste la base fonctionnelle demandée pour la synthèse, mais son contenu devra être fourni ou référencé avant qu'une filiation V4 → V5 puisse être attestée. Les documents 2.0 et 3.0 présents sont consultés comme sources historiques ; la branche `evolution-3.0` n'est pas modifiée.

## 2. Vision et positionnement

**DÉCISION DE CADRAGE — MajestiOS V.5 est le cerveau du site MajestiOS.** Il est l'intelligence centrale qui coordonne les fonctionnalités, les analyses, les automatisations et les interactions du site, sous les autorisations et validations définies par le projet.

MajestiOS aide les PME à repérer des opportunités, comprendre leur contexte, décider d'une action commerciale, la préparer et en capitaliser les résultats. La séquence métier directrice est :

**Détecter → Qualifier → Identifier → Contacter → Transformer → Capitaliser.**

MajestiOS ne se réduit ni à un annuaire, ni à un agrégateur d'annonces, ni à un tableau de bord, ni à un CRM générique. L'immeuble est une représentation de l'écosystème fonctionnel ; il ne remplace pas les pages, les dossiers ou les fonctions transversales réellement accessibles.

Terminologie active : **développement commercial**, **prospection** (avec **Prosp'active** comme signature éventuelle), **Réseau**, **Réputation virtuelle**, **immeuble interactif**, **MajestiOS V.5**.

## 3. Architecture fonctionnelle de référence

### 3.1 Destinations de l'immeuble

**FAIT VÉRIFIÉ :** `index.html` définit huit liens SVG natifs. Les routes ci-dessous existent dans le dépôt et sont incluses dans `site-files.json`. Les numéros reproduisent les identifiants du prototype, du haut vers le rez-de-chaussée.

| Niveau | Destination | Route vérifiée | Rattachement fonctionnel |
|---|---|---|---|
| 08 | Espace privé | `espace-membre.html` | Préparer une demande et présenter l'espace personnel cible ; aucun compte connecté n'est activé. |
| 07 | Réseau | `reseaux-synergies.html` | Réseau professionnel ; `salons-seminaires.html` est un parcours associé. |
| 06 | Développement commercial | `developpement-commercial.html` | Démarche commerciale globale et accès aux parcours associés. |
| 05 | Prospection | `prospection-active.html` | Prospection commerciale ; « Prosp'active » peut servir de signature. |
| 04 | Marchés publics | `marches-publics.html` | Veille et consultation ; les catégories aboutissent aux résultats communs. |
| 03 | Marchés privés | `marches-prives.html` | Signaux d'entreprises et catégories privées selon la disponibilité réelle des sources. |
| 02 | Réputation virtuelle | `reputation-virtuelle.html` | Présence numérique et accompagnement ; les intégrations externes restent à cadrer. |
| 01 | Accueil | `index.html#accueil` | Panorama, orientation et moteur de recherche. |

Le numéro `01` correspond au point de départ de la cabine. La navigation comprend un délai d'animation avant l'ouverture du lien ; le délai est nul quand `prefers-reduced-motion: reduce` est actif. Les commandes haut/bas déplacent la cabine et mettent à jour l'étage annoncé ; sélectionner une zone ouvre sa route.

### 3.2 Dossiers et fonctions transversales

Les pages `veille-marches.html`, `accompagnement-appels-offres.html`, `bodacc-veille-entreprises.html`, `sous-traitance.html`, `qualification-entreprises.html`, `salons-seminaires.html` et `suivi-commercial.html` sont des parcours rattachés à des domaines, pas de nouveaux étages implicites.

Les fonctions suivantes traversent plusieurs rubriques et ne sont pas des étages :

- **Moteur de recherche** : composant partagé par l'accueil et les rubriques, alimenté par `catalogue-majestios.js`, injecté par `rubric-search.js` et traité par `app.js`.
- **CRM** : fonction centrale prévue pour organiser les relations et activités commerciales ; `crm.html` est actuellement une page de présentation.
- **Business Intelligence** : analyses et aide à la décision ; `intelligence-economique.html` existe, mais aucun entrepôt décisionnel ou tableau de bord connecté n'est prouvé.
- **Intelligence centrale MajestiOS V.5** : coordination cible des capacités, données, analyses, automatisations et interactions ; l'orchestration n'est pas opérationnelle dans le prototype.
- **SEO, mémoire, administration, automatisations et gouvernance** : capacités transversales à construire et à soumettre aux règles d'accès et d'approbation.

### 3.3 Domaines métier

1. **Marchés publics** : recherche BOAMP, catégories, département, résultats et accompagnement aux réponses.
2. **Marchés privés** : recherche et interprétation de signaux économiques, dont les annonces BODACC actuellement raccordées.
3. **Développement commercial et prospection** : qualification, identification, préparation de contact, suivi et capitalisation. Les actions de contact réelles ne sont pas automatisées.
4. **Réseau, salons et séminaires** : parcours de mise en relation et présentation ; fonctions communautaires et événements restent à spécifier.
5. **Réputation virtuelle et SEO** : présence locale, visibilité et recommandations. Les sources et APIs tierces doivent être autorisées et vérifiées avant usage.
6. **CRM et Business Intelligence** : référentiel commercial et analyses, distincts des comptes et données client.
7. **Intelligence artificielle et automatisation** : compréhension, extraction, synthèse, recommandation et préparation d'actions, sous contrôle de permissions et de validation humaine.
8. **Publication** : les annonces publiques et les demandes confidentielles sont des circuits distincts. Aucune publication ou réutilisation n'est impliquée par une simple saisie.

## 4. Architecture technique réellement présente

### 4.1 Prototype vérifié

**FAITS VÉRIFIÉS dans le dépôt :**

- Le site est un prototype statique construit en HTML, CSS et JavaScript natif ; `build.js` copie les fichiers déclarés dans `site-files.json` vers `dist/`.
- Le manifeste comporte 52 entrées et les 32 pages HTML racine y figurent.
- `index.html` contient le panorama WebP, les huit liens superposés, les commandes d'ascenseur et le moteur de recherche d'accueil.
- `rubric-search.js` installe le formulaire de recherche commun sur les pages de rubrique ; `app.js` pilote les filtres et la soumission.
- `opportunity-search.js` appelle directement, depuis le navigateur, les API publiques BOAMP et BODACC. Les requêtes d'entreprises sont réalisées par `company-targeting.js` auprès de l'API Recherche d'Entreprises.
- `company-fit.js` et les tests associés calculent un rapprochement indicatif à partir des informations disponibles ; un score ne constitue pas une preuve de compétence ou d'éligibilité.
- Les fichiers `verify-site.js` et `verify-architecture.js` définissent des contrôles de manifeste, routes, pages, recherche, destinations, images et liens.
- Les tests du dépôt couvrent des fonctions de ciblage, d'adéquation, de suggestions NAF, de mesures BOAMP, des appels de fumée BOAMP/BODACC et des parcours navigateur.

Le dépôt examiné ne montre pas de serveur applicatif, de base de données connectée, de système d'authentification, de CRM persistant ou d'orchestrateur d'IA opérationnel. Les APIs tierces consommées par le navigateur ne constituent pas un backend MajestiOS.

### 4.2 État par catégorie

| Catégorie | État observé |
|---|---|
| **A. Opérationnel dans le prototype** | Navigation statique entre les pages publiées ; moteur commun de recherche ; requêtes à la demande aux APIs BOAMP/BODACC et à l'API publique de recherche d'entreprises ; affichage et qualification indicative des résultats ; interaction 2D de l'immeuble et de l'ascenseur. L'exécution complète de ces parcours doit être confirmée par les tests appropriés. |
| **B. Partiel ou en cours** | Pages de présentation du CRM, de l'espace privé, de l'IA et de l'administration ; formulaires de démonstration ; recherche et qualification qui ne persistent pas les résultats au CRM ; interactions d'ascenseur dont le test Playwright n'est pas exécutable dans l'environnement courant. |
| **C. Cible** | MajestiOS V.5 comme intelligence centrale connectant les domaines, assistants, analyses et automatisations avec permissions distinctes ; CRM persistant ; comptes et espaces client ; publication modérée ; BI ; mémoire contrôlée ; compréhension assistée des dossiers d'appels d'offres ; SEO piloté et auditable. |
| **D. Proposition à étudier** | Backend et hébergement ; base et modèle de séparation ; fournisseur IA et orchestration ; stockage documentaire et recherche sémantique ; fournisseur d'authentification ; automatisation proactive ; choix d'un modèle 3D ou d'une scène de visite. Aucune technologie majeure n'est validée par la seule présence de recommandations documentaires. |

Les pages `crm.html`, `majestios-v5.html` et `espace-membre.html` indiquent elles-mêmes que les fonctions connectées correspondantes ne sont pas activées. Les formulaires qui précisent qu'aucune donnée n'est transmise ne doivent pas être présentés comme une collecte réelle.

## 5. Données, sécurité et gouvernance

### 5.1 Principes d'architecture cible

- Distinguer identité d'entreprise, fiche CRM, données déclarées, données publiques, données privées et données explicitement partagées.
- Séparer le CRM interne MajestiOS des espaces clients et cloisonner chaque tenant.
- Séparer publication, veille, CRM et prospection active ; aucun transfert automatique par défaut.
- Autoriser côté serveur selon l'identité, le rôle, la ressource, la finalité et la destination. Une vérification d'interface ou une instruction donnée à l'IA ne constitue pas une autorisation.
- Conserver pour chaque collecte et transmission la provenance, la date, la finalité, le motif, l'autorisation, la destination, le statut et le résultat.
- Appliquer les durées de conservation, oppositions, corrections et suppressions aux données dérivées, index et copies.
- Traiter les documents externes comme des données non fiables ; ne jamais leur donner pouvoir d'instruction ou d'accès.
- Distinguer fait issu de source, donnée déclarée, calcul, hypothèse et recommandation ; toute sortie IA doit être traçable et vérifiable.
- Soumettre publication, contact externe, export, fusion, modification sensible, changement de droit et déploiement à l'autorisation requise.

### 5.2 Limites de sécurité constatées

Le prototype statique ne démontre ni contrôle d'accès serveur, ni authentification, ni isolation multi-tenant, ni journal d'audit, ni suppression propagée. Ces protections sont des exigences de conception, pas des capacités opérationnelles actuellement prouvées. Avant toute donnée confidentielle, personnelle à grande échelle ou appartenant à un client, définir et tester l'architecture serveur, les rôles, les permissions, les finalités, la rétention, les contrats fournisseurs et la réponse aux incidents.

Les appels directs aux APIs tierces exposent les paramètres de recherche au navigateur et dépendent de la disponibilité, des quotas, CORS et conditions de chaque service. Ils ne doivent pas transmettre de données confidentielles. Une couche serveur ne sera décidée qu'après définition des besoins et comparaison des options.

## 6. Sources de données et exactitude

| Source ou famille | État dans le prototype | Règle de présentation |
|---|---|---|
| BOAMP | API appelée par le moteur public | Afficher source, date et lien de publication ; résultats à revérifier dans la source. |
| BODACC | API d'annonces commerciales appelée par la recherche privée | Séparer le texte officiel de l'explication et de toute interprétation commerciale. Une cession ne prouve pas une continuité ; une radiation ne prouve pas une reprise. |
| Recherche d'Entreprises (DINUM) | Appel API présent pour trouver des entreprises à partir de critères APE/NAF et de départements | Le rapprochement est indicatif ; le code APE/NAF ne prouve ni capacité ni éligibilité. |
| Immobilier, emploi, sous-traitance | Catégories ou parcours mentionnés dans le site ; sources spécialisées non démontrées comme raccordées | Les marquer comme non connectées tant que la source, les droits et le fonctionnement n'ont pas été vérifiés. |
| Réseaux, avis, cartes et moteurs de recherche | Cas d'usage documentés ; intégrations actives non établies | Vérifier API, conditions de réutilisation et données accessibles avant toute collecte ou prospection. |

## 7. Parcours utilisateurs de référence

### Recherche d'opportunité

1. L'utilisateur ouvre le formulaire compact, depuis l'accueil ou une rubrique.
2. Il saisit un mot-clé ; le type public ou privé, la catégorie puis le département apparaissent selon le parcours du composant commun.
3. Le catalogue partagé détermine les filtres et la source annoncée.
4. La soumission ouvre les résultats avec les critères de recherche ; les résultats publics et privés restent identifiables par source.
5. Le résultat peut être qualifié et préparé pour un suivi, mais aucun transfert CRM ne doit être promis tant qu'il n'est pas réellement mis en œuvre et autorisé.

### Développement commercial

Détecter un signal, vérifier la source, qualifier l'opportunité, identifier l'entreprise, préparer une prise de contact, faire valider l'action, consigner le résultat et capitaliser. Un signal ne déclenche pas automatiquement un message ni une écriture dans un CRM.

### Publication et demande confidentielle

L'auteur précise la visibilité et la finalité ; une demande privée adressée à MajestiOS ne devient pas une annonce publique. Modération, autorisation de publication, partage CRM et usage de prospection sont des décisions distinctes et traçables.

## 8. Feuille de route et dépendances

1. **Référentiel et arbitrages** : obtenir la base V4, approuver la matrice des destinations et clarifier les fonctions présentes, cibles et proposées.
2. **Architecture de référence** : définir identité, rôles, cloisonnement, transferts, conservation, audit et menace avant de manipuler des données réelles.
3. **Conformité du prototype** : fiabiliser routes, formulaires, recherche partagée, catégories, sources et tests, sans refonte générale.
4. **Socle serveur** : choisir backend, stockage, authentification, sauvegarde et observabilité après comparaison et validation.
5. **Données et CRM** : mettre en place modèle de données, provenance, identité, déduplication et isolation avant tout transfert CRM.
6. **Publication, réseau et services** : distinguer annonces publiques, demandes privées, modération et espaces utilisateurs.
7. **Intelligence centrale MajestiOS V.5** : introduire progressivement analyse en lecture seule, synthèses sourcées, préparation d'action, validation humaine, puis seules automatisations explicitement autorisées.
8. **BI, SEO et mémoire** : bâtir à partir de données fiables, permissions testées, finalités définies et règles de rétention.
9. **Stabilisation** : tests bout en bout, accessibilité, performance, sécurité, sauvegarde/restauration et validation avant toute autorisation de production.

Les dépendances principales sont : décisions de gouvernance avant données réelles ; identité et permissions avant CRM ou espaces clients ; provenance et droit d'usage avant enrichissement IA ; socle de données fiable avant BI et automatisation ; inventaire de routes avant changement du panorama. Les arbitrages de fournisseur IA, de 3D et d'hébergement peuvent attendre la stabilisation des besoins et critères de sortie.

## 9. Décisions à obtenir du propriétaire du projet

- Fournir ou référencer la documentation V4, et préciser les éléments V4 abandonnés ou conservés.
- Valider définitivement les huit noms, l'ordre, les identifiants et les dossiers associés à chaque destination.
- Définir les frontières et propriétaires des données internes, clients, publiques, privées et partagées.
- Définir l'inscription, les rôles, le consentement, la modération, les demandes privées et le retrait d'une publication.
- Valider sources, droits de réutilisation, finalités, durées, oppositions et transferts vers le CRM.
- Fixer les règles d'autorisation, journalisation, réversibilité et approbation des actions IA.
- Définir les critères de choix des fournisseurs et le budget ; ne pas confondre recommandation et décision.
- Valider le périmètre initial des sources BOAMP/BODACC et des catégories dont les sources ne sont pas connectées.

## 10. Documents et contrôles associés

- [Audit de conformité de l'architecture et des liens](AUDIT-CONFORMITE-ARCHITECTURE-ET-LIENS.md) — preuves, état des routes, résultats et limites des contrôles.
- [Arborescence cible V5](ARBORESCENCE-CIBLE-V5.md) — détails des rattachements fonctionnels.
- [Expérience immersive et étages](EXPERIENCE-IMMERSIVE-ET-ETAGES.md) — interaction spatiale et exigences du panorama.
- [Architecture fonctionnelle cible](ARCHITECTURE-FONCTIONNELLE-CIBLE.md) — domaines, données et frontières.
- [Roadmap et gouvernance](ROADMAP-ET-GOUVERNANCE.md) — phases et règles d'approbation.

La documentation de cadrage ne prouve jamais l'exécution d'une fonction. Pour chaque évolution, consigner les fichiers touchés, les tests réellement lancés, les tests non exécutés et les anomalies restantes. Aucun déploiement de production n'est autorisé par ce document.
