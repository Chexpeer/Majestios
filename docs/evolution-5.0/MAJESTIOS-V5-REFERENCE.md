# MajestiOS V.5 — référence fonctionnelle et technique

**Statut :** référence de cadrage et d'architecture pour la branche `evolution-5.0`
**Mise à jour :** 5 novembre 2026 — consolidation de l'audit sur HEAD
**Branche examinée :** `evolution-5.0`, commit `735a09ce0b5c476ff659558060791b34a628b6ac`
**Nature :** doctrine cible et état vérifié du prototype ; ce document ne vaut ni décision technique fournisseur ni preuve de mise en production.

## 1. Autorité et lecture

Ce document est la référence centrale V5. Il rassemble la vision, l'arborescence, les frontières fonctionnelles, l'architecture technique réellement présente, les états de réalisation et les décisions restant à prendre. Les autres documents V5 précisent certains sujets ; en cas de divergence, appliquer la présente référence et inscrire l'écart dans l'audit de conformité.

Les éléments sont étiquetés comme suit :

- **FAIT VÉRIFIÉ** : constaté dans le dépôt ou confirmé par un contrôle indiqué.
- **DÉCISION DE CADRAGE** : orientation explicitement donnée par le propriétaire du projet.
- **CIBLE** : comportement attendu, non nécessairement implémenté.
- **PROPOSITION** : option à examiner, non validée.
- **À ARBITRER** : choix qui requiert une décision du propriétaire.

L'historique des versions est désormais établi par [FILIATION-DOCUMENTAIRE-V2-A-V5.md](FILIATION-DOCUMENTAIRE-V2-A-V5.md). Les branches V2 (`evolution-2.0`), V3 (`evolution-3.0`) et V4 (`evolution-4.0`) existent et conservent leurs propres sources documentaires. Elles ne sont pas recopiées dans le dossier V5. La branche V4 a été retrouvée et son corpus comporte sept documents. Les copies locales V2 et V3 ont été retirées de l'arborescence V5. MajestiOS V.5 est l'intelligence centrale actuelle ; les anciennes propositions d'intelligence autonome ne constituent pas l'architecture V5.

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
| **B. Partiel ou en cours** | Pages de présentation du CRM, de l'espace privé, de l'IA et de l'administration ; formulaires de démonstration ; recherche et qualification qui ne persistent pas les résultats au CRM ; interactions d'ascenseur couvertes par un test Playwright exécuté avec Chromium dans le workflow GitHub Actions sur le commit de référence. |
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

- [Audit du lot 5 — architecture CRM et capitalisation](AUDIT-LOT-5-ARCHITECTURE-CRM-CAPITALISATION.md) — état des données par source, modèle conceptuel proposé, cloisonnement et arbitrages avant persistance.
- [Audit de conformité de l'architecture et des liens](AUDIT-CONFORMITE-ARCHITECTURE-ET-LIENS.md) — preuves, état des routes, résultats et limites des contrôles.
- [Arborescence cible V5](ARBORESCENCE-CIBLE-V5.md) — détails des rattachements fonctionnels.
- [Expérience immersive et étages](EXPERIENCE-IMMERSIVE-ET-ETAGES.md) — interaction spatiale et exigences du panorama.
- [Architecture fonctionnelle cible](ARCHITECTURE-FONCTIONNELLE-CIBLE.md) — domaines, données et frontières.
- [Roadmap et gouvernance](ROADMAP-ET-GOUVERNANCE.md) — phases et règles d'approbation.

La documentation de cadrage ne prouve jamais l'exécution d'une fonction. Pour chaque évolution, consigner les fichiers touchés, les tests réellement lancés, les tests non exécutés et les anomalies restantes. Aucun déploiement de production n'est autorisé par ce document.


---

# Addendum de consolidation — 5 novembre 2026

Cet addendum actualise les constats antérieurs à partir de l'état du dépôt au commit `735a09ce0b5c476ff659558060791b34a628b6ac` et des preuves GitHub Actions consultées le 5 novembre 2026. En cas de divergence avec une formulation plus ancienne de ce document, les constats datés de cet addendum prévalent pour l'état technique à cette date. Les décisions métier explicites du propriétaire restent prioritaires.

## 11. État de référence du dépôt et preuves CI

### 11.1 Référence examinée

- Dépôt : `Chexpeer/Majestios`.
- Branche de travail : `evolution-5.0`.
- Commit de référence de l'audit : `735a09ce0b5c476ff659558060791b34a628b6ac`.
- Nature du projet observé : site statique HTML/CSS/JavaScript natif, construit dans `dist/` par `build.js`.
- Le commit est associé à un déploiement Vercel de type preview observé comme prêt ; cela ne constitue pas une preuve de promotion en production. Aucun déploiement de production n'est autorisé par cet audit.

### 11.2 Exécution CI confirmée

Le workflow **« Vérification du site MajestiOS »** a terminé avec succès sur le commit de référence :

- Run GitHub Actions : `41936795822`.
- Job : `verify-static-site`.
- Conclusion : `success`.
- Date de lancement observée : 4 novembre 2026 à 23:50:05 UTC.

Étapes réussies dans ce run :
1. récupération du dépôt et installation de Node.js ;
2. vérification syntaxique JavaScript ;
3. tests de ciblage des entreprises ;
4. tests de qualification des entreprises ;
5. tests des suggestions APE/NAF ;
6. construction du site statique ;
7. vérification de l'architecture et des routes ;
8. vérification des pages, liens locaux et identifiants ;
9. installation de Playwright et Chromium ;
10. smoke test réel de l'API BOAMP ;
11. smoke test réel de l'API BODACC ;
12. test navigateur de l'immeuble interactif ;
13. test navigateur du moteur de recherche.

**Portée de la preuve :** ces étapes ont réussi dans ce run et sur ce commit. Cela ne prouve ni la couverture exhaustive des tests du dépôt, ni la pertinence métier de tous les résultats, ni la disponibilité continue des sources, ni le fonctionnement d'un backend, d'un CRM ou d'une IA de production.

### 11.3 Tests présents mais non couverts par le workflow principal

Le dépôt contient notamment `tests/mesure-boamp.test.cjs`. Ce test n'apparaît pas dans les étapes du workflow principal décrit ci-dessus. Il est exécuté par le workflow manuel `.github/workflows/mesure-boamp.yml`, qui lance également une mesure réelle à la demande.

Le script `outils/mesure-boamp.cjs` interroge l'API BOAMP pour mesurer des volumes par types, familles, descripteurs et catégories. Il produit un rapport ; il ne modifie pas le site et ne persiste pas de données. Le script a été conçu avec des réponses simulées. La présence du script et du workflow ne prouve pas qu'une mesure réelle complète ait déjà été lancée et validée. Aucune conclusion de couverture métier des catégories BOAMP ne doit être tirée avant examen d'un rapport réel.

Le workflow `.github/workflows/majestios-anti-regression.yml` ne déclenche pas automatiquement ses contrôles sur la branche `evolution-5.0` selon les filtres de branches actuellement déclarés. Il reste déclenchable manuellement. Le workflow général `verify-site.yml`, lui, est configuré sur push et pull request sans filtre de branche.

## 12. État fonctionnel précis — corrections et limites à retenir

### 12.1 Recherche BOAMP et BODACC

- Les appels BOAMP et BODACC sont effectués directement depuis le navigateur par le prototype.
- Le moteur peut récupérer un lot récent limité avant filtrage local ; une recherche sans résultat ne démontre donc pas l'absence d'opportunité dans l'ensemble de la source.
- Le parcours navigateur de recherche utilise des réponses API interceptées et simulées pour tester l'interface, le routage et le rendu. Les smoke tests BOAMP et BODACC du workflow principal sont, eux, des requêtes réelles limitées à un petit échantillon.
- Ces contrôles vérifient la connectivité et certaines propriétés des réponses, pas l'exhaustivité, la pertinence commerciale ou les droits de réutilisation de chaque donnée.
- Les annonces BODACC sont des signaux administratifs et économiques à interpréter avec prudence ; elles ne constituent pas en elles-mêmes des marchés privés confirmés.

### 12.2 Ciblage et qualification d'entreprises

- `company-targeting.js` normalise des identifiants et critères tels que SIREN/SIRET, APE/NAF, code postal/département, nom, statut et provenance.
- Le ciblage et le score sont indicatifs. Les codes APE/NAF, la géographie et le statut ne démontrent ni compétence, ni capacité, ni disponibilité, ni éligibilité.
- `company-fit.js` impose une revue humaine (`manual_review_required`) avant toute conclusion de qualification.
- La recherche d'entreprises utilise une pagination limitée dans le parcours audité ; les résultats peuvent être incomplets.
- Les résultats ne sont pas enregistrés dans un CRM persistant.

### 12.3 Formulaires et conversation

- Les handlers de formulaire examinés affichent explicitement une prévisualisation et indiquent que les données ne sont ni transmises ni enregistrées.
- Le formulaire de création d'espace personnel n'active pas de compte réel.
- Le parcours « Nous rejoindre » ne collecte pas de CV dans cette version.
- L'aide d'accueil est une navigation guidée ; elle ne constitue pas un chatbot conversationnel IA opérationnel.

### 12.4 CRM, intelligence centrale, mémoire et administration

Les pages et documents de présentation ne doivent pas être confondus avec des services connectés. À la date de cet addendum, le dépôt ne démontre pas :
- de backend applicatif MajestiOS connecté ;
- de base de données métier persistante ;
- d'authentification ou d'autorisation multi-tenant ;
- de CRM avec écritures, historique et pipeline persistants ;
- d'orchestrateur MajestiOS V.5 en production ;
- de mémoire conversationnelle MajestiOS persistante ;
- de cockpit d'administration IA opérationnel ;
- d'automatisation SEO reliée à des données de Search Console ou à des outils de mesure.

Ces éléments restent des cibles d'architecture et de développement. Les documents associés définissent des exigences et des options, non une implémentation existante.

## 13. SEO et veille des moteurs — doctrine V5 consolidée

Le SEO ne doit pas être réduit à l'ajout de mots-clés ou à la rédaction ponctuelle de pages. Il constitue une capacité transversale de MajestiOS V.5, pilotée dans le cadre de l'administration et de l'amélioration continue.

La cible comprend :

1. **Surveillance technique** : disponibilité, performance, indexabilité, erreurs HTTP, redirections, canonicals, sitemap, robots, données structurées, maillage interne et accessibilité des contenus aux robots.
2. **Surveillance de l'indexation et de la visibilité** : pages indexées ou exclues, requêtes, impressions, clics, positions et évolutions, à partir de sources et d'accès autorisés.
3. **Veille des moteurs** : suivre les changements documentés des moteurs de recherche, leurs consignes, fonctionnalités et formats de résultats, y compris les expériences de recherche génératives.
4. **Analyse concurrentielle et éditoriale** : repérer les sujets, intentions de recherche, contenus manquants, pages faibles, doublons et possibilités de différenciation sans copier les concurrents.
5. **Recommandations priorisées** : proposer des corrections selon impact attendu, effort, risque, confiance et dépendances.
6. **Mesure des effets** : comparer avant/après, conserver la provenance des données et distinguer corrélation et causalité.
7. **Amélioration continue** : actualiser la stratégie et les recommandations en fonction des évolutions observées, sans promettre une position garantie ni un maintien automatique en tête des résultats.

### 13.1 MajestiOS V.5

MajestiOS V.5 explore des pistes d'amélioration, confronte les hypothèses à des sources fiables, repère les évolutions pertinentes et propose des expérimentations mesurables. Ces fonctions relèvent directement de MajestiOS V.5 et restent soumises aux règles de validation et de gouvernance.


## 14. Intelligence centrale et gouvernance

Les fonctions d'analyse, de veille, d'exploration et de recommandation sont intégrées à MajestiOS V.5. Elles peuvent contribuer au référencement naturel, à l'évolution des moteurs de recherche, aux offres, à l'expérience utilisateur et à la stratégie commerciale.

Aucune analyse ne confère de privilège implicite : aucune dépense, prise de contact, publication ou modification de la production ne peut être engagée sans les permissions et validations applicables. Toute recommandation reste une proposition jusqu'à validation explicite.

## 15. Ordre de priorité recommandé après l'audit

Cet ordre est une recommandation de séquencement, non une autorisation d'exécuter des changements fonctionnels :

1. actualiser et stabiliser la documentation de référence et le guide de reprise IA ;
2. consolider les tests et la couverture anti-régression sur la branche V5 ;
3. terminer la fiabilisation des parcours existants sans refonte générale ;
4. arbitrer les sources, catégories et mesure réelle BOAMP/BODACC ;
5. définir les frontières de données, les permissions et le socle serveur ;
6. construire le CRM persistant et les circuits de capitalisation ;
7. mettre en place progressivement l'intelligence centrale, la mémoire et les rôles spécialisés ;
8. connecter l'administration, le SEO et la veille avec des sources mesurables ;
9. étendre les automatisations seulement après évaluation, autorisation et mécanismes de retour arrière.

**Règle de vérité :** une fonctionnalité documentée comme cible ne devient « présente » qu'après preuve dans le code ; elle ne devient « validée » qu'après tests exécutés et résultats examinés ; elle ne devient « opérationnelle en production » qu'après preuve de déploiement et de fonctionnement dans l'environnement de production.
