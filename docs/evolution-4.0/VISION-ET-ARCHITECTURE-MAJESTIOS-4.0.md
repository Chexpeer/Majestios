# Vision et architecture cible — MajestiOS 4.0

**Date :** 4 novembre 2026  
**Statut :** vision produit consolidée et architecture cible à soumettre au contre-audit des IA ; non implémentée et non définitivement arbitrée.  
**Référence d'état réel :** `AUDIT-MAJESTIOS-3.0.md`.

## 1. Ambition

MajestiOS est une plateforme de développement commercial qui aide les entreprises et les professionnels à détecter des opportunités, comprendre leur environnement, identifier des partenaires ou prospects pertinents, agir et capitaliser sur les résultats.

La plateforme ne doit être ni un simple tableau de bord, ni un annuaire, ni un agrégateur d'annonces. Elle doit transformer des informations dispersées en démarches commerciales compréhensibles et maîtrisées.

Chaîne de valeur :

**Détecter → Qualifier → Identifier → Contacter → Transformer → Capitaliser.**

La décision commerciale reste celle de l'utilisateur. L'IA accompagne, explique, rapproche et propose ; elle ne doit pas transformer un signal en certitude ni engager une action sensible sans autorisation.

## 2. Doctrine produit

### 2.1 Principes structurants

1. **Le développement commercial est le cœur du produit.**
2. **Le CRM est le référentiel commercial central**, mais il doit être distinct des espaces clients et des données publiques.
3. **Le moteur de recherche est transversal** et conserve une expérience cohérente sur les pages et rubriques.
4. **L'immeuble interactif reflète l'arborescence réelle** : chaque étage et zone doit conduire vers un dossier ou une rubrique réelle, avec des destinations vérifiables.
5. **La qualification est explicable** : les scores, codes APE/NAF et signaux administratifs ne prouvent jamais une capacité ou une compétence.
6. **Les transferts de données sont explicites** : aucune transmission implicite entre publication, veille, CRM, prospection et espaces clients.
7. **BrainIOS est une intelligence d'accompagnement et d'amélioration**, mais son autonomie est encadrée.
8. **La protection des données est une fondation** : identité, autorisations, finalités, minimisation, rétention et traçabilité précèdent les traitements réels.
9. **Les fonctionnalités sont présentées selon leur état réel** : idée, spécification, prototype, testée, opérationnelle.
10. **La plateforme doit pouvoir évoluer par modules** sans imposer une architecture distribuée prématurée.

### 2.2 Vocabulaire de référence

- Produit : **MajestiOS**.
- Positionnement : **développement commercial**.
- Rubrique de prospection : **Prosp'active**.
- Rubrique de présence et réputation : **Réputation virtuelle**.
- Navigation visuelle : **immeuble interactif**.
- Intelligence complémentaire : **BrainIOS**.

Les anciens libellés « Prospection active », « Salon virtuel », « Showroom virtuel » et « e-Réputation » ne doivent pas être réintroduits comme terminologie cible, sauf citation historique.

## 3. Architecture fonctionnelle cible

La proposition distingue quatre grands domaines et une couche transversale.

### 3.1 Domaine A — Développement commercial

Responsabilité : détecter, qualifier et aider à transformer des opportunités en actions commerciales.

Composants envisagés :
- moteur de recherche commun ;
- marchés publics ;
- marchés privés ;
- veille économique et signaux d'entreprises ;
- qualification d'entreprises et d'établissements ;
- Prosp'active ;
- CRM interne ;
- accompagnement aux appels d'offres ;
- réseaux, synergies et partenaires ;
- publication et réception de demandes.

Le CRM conserve les relations, activités, interactions, décisions et résultats autorisés. Il ne devient pas un aspirateur automatique de toutes les données rencontrées sur le site.

### 3.2 Domaine B — Réputation virtuelle

Responsabilité : aider une entreprise à comprendre et améliorer sa présence numérique locale et sa réputation.

Composants possibles :
- recherche de fiche Google Maps à partir de l'activité et de l'adresse ;
- vérification de la correspondance entre la fiche trouvée et l'entreprise/établissement ;
- état de présence locale et cohérence des informations ;
- lecture des avis accessibles par des interfaces autorisées ;
- analyse qualitative prudente des retours ;
- détection de lacunes de présence numérique ;
- orientation vers un accompagnement : fiche locale, gestion de réputation, visibilité et site web.

**Règle de rapprochement :** l'activité et l'adresse constituent les premiers critères de recherche demandés par le porteur du projet, mais ils ne suffisent pas toujours à établir une identité certaine. Prévoir le nom, la ville, l'établissement, la catégorie, les coordonnées et une confirmation humaine lorsque plusieurs fiches correspondent.

**Contraintes à instruire :** API Google Places/Maps appropriée, autorisations, conditions d'affichage et de conservation, quotas, facturation, restrictions de réutilisation des avis, clés protégées côté serveur. Aucun scraping non autorisé.

### 3.3 Domaine C — BrainIOS

BrainIOS est conçu comme le système d'intelligence qui accompagne les utilisateurs et contribue à l'amélioration continue de MajestiOS.

Il comporte deux surfaces reliées à un même socle de connaissances et de règles, mais séparées par des permissions et des contextes.

#### C1. BrainIOS côté utilisateur

- Comprendre la page, la rubrique et l'étape du parcours en cours.
- Répondre aux questions à partir de connaissances validées.
- Expliquer les fonctionnalités et leurs limites.
- Proposer une action utile au bon moment.
- Aider à publier une annonce, qualifier une opportunité ou demander un accompagnement.
- Observer les étapes pertinentes du parcours afin d'éviter de répéter des questions.
- Respecter le refus, le silence et la navigation libre.

Exemple de comportement : après plusieurs consultations d'opportunités, BrainIOS peut proposer une aide à la qualification ou à la publication, sans imposer cette action.

Le système ne doit pas envoyer chaque clic brut au modèle. Le frontend ou la couche événementielle transforme les actions pertinentes en contexte structuré, filtré et dédupliqué.

#### C2. BrainIOS côté administration

Un menu BrainIOS dans l'interface d'administration est proposé, avec les espaces suivants :

1. **Assistant** : dialogue avec l'administrateur et réception d'instructions en langage naturel.
2. **Surveillance** : erreurs, anomalies, parcours significatifs, santé des modules.
3. **Rapports journaliers** : synthèses confidentielles réservées à l'administrateur.
4. **Recommandations** : améliorations techniques, fonctionnelles, ergonomiques et commerciales.
5. **Atelier de développement** : analyse de documentation/code, préparation de modifications et branches GitHub.
6. **Laboratoire de tests** : tests automatisés, scénarios navigateur, contrôles de liens et anti-régression.
7. **Mémoire du projet** : décisions, architecture, contrats, changements, preuves et état des lots.

Cette interface peut être intégrée au back-office MajestiOS ; un site indépendant BrainIOS n'est pas une exigence initiale.

#### C3. Intelligence commune, séparation des droits

Le cerveau partagé ne signifie pas que chaque surface peut accéder à toutes les données.

- Le BrainIOS visiteur ne lit pas le CRM interne ni les rapports d'administration.
- Le BrainIOS administrateur accède uniquement aux données autorisées selon son rôle.
- Les conversations brutes ne sont pas automatiquement exposées dans les rapports.
- Les recommandations issues des usages sont agrégées et minimisées lorsque possible.
- Les actions techniques sont exécutées dans un environnement de développement isolé.

### 3.4 Domaine D — Administration et gouvernance

L'administration gère :
- comptes, rôles, permissions et invitations ;
- utilisateurs et espaces clients ;
- contenus, catégories, sources et paramètres ;
- modération des annonces ;
- CRM interne et règles de partage ;
- supervision, journaux et incidents ;
- menu BrainIOS ;
- approbation des actions sensibles ;
- sauvegardes, conservation et demandes relatives aux données.

Les permissions doivent être vérifiées côté serveur, au niveau de chaque ressource et action. Cacher un bouton dans le navigateur ne constitue pas une autorisation.

### 3.5 Couche transversale — Données, événements et intégrations

Cette couche comprend :
- identité et sessions ;
- API applicative ;
- base relationnelle ;
- stockage de documents ;
- adaptateurs de sources externes ;
- événements métier ;
- audit et traçabilité ;
- notifications ;
- observabilité et sauvegardes ;
- connecteurs IA et outils de développement.

Elle doit assurer la provenance, la finalité, le consentement ou autre base applicable, les droits d'accès, la rétention et la suppression.

## 4. Moteur de recherche transversal

### 4.1 Parcours utilisateur

Le moteur commun doit rendre le choix progressif et compréhensible :
1. choisir le type de marché ou la famille de recherche ;
2. choisir une catégorie pertinente ;
3. choisir la zone géographique, notamment le département selon le cadrage retenu ;
4. saisir un mot-clé ;
5. consulter une page de résultats dédiée ;
6. qualifier une opportunité et, si autorisé, préparer une action ou un dossier CRM.

L'ordre précis des contrôles et le comportement mobile doivent être validés par tests UX.

### 4.2 Taxonomie et sources

La taxonomie ne doit pas être confondue avec les fournisseurs de données. Chaque catégorie doit déclarer :
- intention métier ;
- type public/privé ou transversal ;
- sources autorisées ;
- champs et filtres ;
- règles de qualification ;
- page de résultats ;
- état : active, expérimentale, planifiée ou indisponible.

**Nettoyage :** catégorie demandée pour la 4.0. Son périmètre public/privé reste à arbitrer. Il faudra définir les activités et nomenclatures pertinentes, sans assimiler automatiquement code APE/NAF et savoir-faire réel.

**BODACC :** le périmètre initial documenté à trois familles (créations, ventes/cessions, modifications) doit être réconcilié avec le code et les PR ouvertes. Toute extension doit être une décision explicite, pas un effet de recherche textuelle.

**BOAMP :** les catégories définitives doivent être validées à partir des besoins et des volumes mesurés, sans conserver arbitrairement les catégories historiques.

### 4.3 Résultats et qualification

- Afficher des résultats vérifiables, datés et sourcés.
- Limiter le nombre initial affiché selon la décision produit (la référence historique est dix résultats).
- Gérer pagination et limites d'appels.
- Distinguer résultats source, signaux interprétés et recommandations.
- Ne pas fabriquer de résultats de démonstration en cas d'échec.
- Ne pas transformer une recherche en envoi ou campagne commerciale automatique.

## 5. Architecture technique cible — hypothèse à contre-auditer

L'audit 3.0 recommande d'étudier un **monolithe modulaire** plutôt que des microservices au démarrage. Cette option est une hypothèse de travail, pas un choix final.

### 5.1 Principes

- Conserver le frontend statique autant que possible pendant la première migration.
- Ajouter une API backend versionnée.
- Organiser le backend en modules métier avec contrats et frontières explicites.
- Utiliser une base relationnelle adaptée aux relations CRM.
- Centraliser les secrets et appels fournisseurs côté serveur.
- Appliquer les permissions côté serveur et tester les refus.
- Découpler les événements métier par un mécanisme fiable (par exemple outbox) sans imposer immédiatement un broker externe.
- Garder les modules extractibles si les volumes ou les contraintes le justifient.
- Documenter les contrats API et schémas avant les intégrations sensibles.

### 5.2 Domaines de données séparés

1. Identité et appartenance.
2. Organisation interne MajestiOS.
3. CRM interne.
4. Espaces clients cloisonnés.
5. Sources et enregistrements externes.
6. Opportunités et signaux.
7. Publication et modération.
8. Réputation virtuelle.
9. Événements et audit.
10. Corpus de connaissances BrainIOS.
11. Conversations et interactions IA.
12. Atelier de développement et résultats de tests.

La séparation doit être appliquée par permissions, relations de propriété, règles de rétention et tests négatifs ; elle ne repose pas uniquement sur l'interface.

### 5.3 Événements

Les événements représentent des faits métier utiles et minimisés, par exemple :
- rubrique consultée ;
- recherche lancée et filtres choisis ;
- opportunité ouverte ;
- fiche entreprise consultée ;
- parcours commencé, terminé ou abandonné ;
- formulaire présenté ou soumis ;
- demande d'accompagnement ;
- erreur fonctionnelle ;
- proposition BrainIOS affichée, acceptée ou refusée.

Chaque événement doit préciser : identifiant, type, version de schéma, date, contexte fonctionnel, session pseudonymisée si justifiée, finalité, source et niveau de sensibilité.

Ne pas enregistrer les frappes clavier, champs de formulaire complets, contenus sensibles ou clics sans utilité définie.

## 6. Apprentissage et amélioration continue de BrainIOS

### 6.1 Sources d'amélioration

- événements fonctionnels agrégés ;
- erreurs et anomalies ;
- questions fréquentes ;
- incompréhensions et demandes répétées ;
- suggestions explicites des utilisateurs ;
- résultats des propositions BrainIOS ;
- documentation et historique de développement ;
- résultats des tests et changements GitHub.

### 6.2 Cycle de progression

**Écouter → Observer → Analyser → Apprendre → Proposer → Expérimenter → Évaluer → Améliorer.**

Exemple : des demandes répétées d'aide pour publier une annonce peuvent révéler un parcours peu clair. BrainIOS prépare un diagnostic et propose une amélioration de l'interface ou de son explication.

### 6.3 Définition stricte de l'apprentissage

Le terme « apprendre » doit être défini techniquement. Les premières versions doivent privilégier :
- mise à jour contrôlée du corpus documentaire ;
- règles et consignes versionnées ;
- amélioration des réponses à partir de retours évalués ;
- recommandations fondées sur des données agrégées ;
- tests de non-régression des réponses ;
- validation humaine des changements.

Aucune modification autonome des poids du modèle, des règles sensibles, des permissions ou du code en production n'est prévue dans le MVP.

### 6.4 Rapports administrateur

Le rapport journalier est strictement confidentiel et réservé à l'administrateur. Il peut synthétiser :
- activité globale et rubriques consultées ;
- recherches et catégories ;
- consultations et étapes de parcours ;
- conversions et abandons ;
- demandes d'aide et interventions BrainIOS ;
- erreurs et anomalies ;
- tendances et recommandations.

Il doit privilégier les agrégats et éviter d'exposer les messages bruts ou les identités des utilisateurs sans nécessité et autorisation explicite.

## 7. Autonomie contrôlée de BrainIOS

| Action | Autonomie envisagée |
|---|---|
| Lire la documentation et les fichiers autorisés | Oui, dans le périmètre de ses droits |
| Analyser les logs et tests autorisés | Oui, avec minimisation des données |
| Détecter une anomalie et proposer une cause | Oui, avec niveau de confiance et preuves |
| Proposer une amélioration produit ou technique | Oui |
| Préparer une modification sur une branche de travail | Oui, dans un environnement isolé et une mission autorisée |
| Exécuter des tests | Oui, sur environnement de test |
| Modifier les règles de sécurité, permissions ou données de production | Non sans validation explicite |
| Fusionner une PR | Validation explicite requise |
| Déployer en production | Validation explicite requise |
| Lancer une campagne commerciale ou contacter un prospect | Autorisation métier distincte et explicite requise |

Toute proposition de code doit inclure fichiers concernés, justification, diff, tests, risques, limites et procédure de retour arrière.

## 8. Gouvernance des données et sécurité

Avant d'activer les traitements :
- établir le registre des données et finalités ;
- identifier le responsable de traitement et les sous-traitants ;
- déterminer les bases légales et obligations d'information ;
- définir conservation, effacement, export et exercice des droits ;
- documenter les sources et licences ;
- appliquer le principe de minimisation ;
- cloisonner les espaces clients ;
- séparer les données internes et publiques ;
- gérer les secrets et clés API côté serveur ;
- protéger les journaux et rapports ;
- auditer les accès administrateur ;
- évaluer les risques liés à l'analyse IA des conversations.

Les pages légales actuelles sont des gabarits incomplets : elles devront être finalisées et adaptées aux traitements réellement mis en place avant ouverture au public.

## 9. Expérience et cohérence de navigation

- Le même moteur de recherche transversal doit rester disponible sur les pages concernées.
- L'immeuble interactif reste la représentation visuelle de l'arborescence.
- Chaque zone cliquable doit pointer vers une destination réelle et contrôlée.
- Les slogans sont placés sur les pages de destination, sous le titre principal.
- Aucun étage ne doit conduire à une simple ancre ou à une popup intermédiaire si une destination de rubrique est attendue.
- Les noms et l'ordre du catalogue doivent être cohérents avec la taxonomie réelle.
- Les pages doivent distinguer clairement les fonctions disponibles, les prototypes et les fonctions à venir.

## 10. Décisions ouvertes pour le contre-audit

Les IA consultées doivent répondre explicitement à ces questions :

1. Le découpage en quatre domaines et une couche transversale est-il pertinent ?
2. Le monolithe modulaire est-il proportionné ou faut-il une autre architecture ?
3. Comment séparer techniquement CRM interne, espaces clients, administration et BrainIOS ?
4. Quel modèle de données permet de gérer entreprises, établissements, signaux, opportunités, réputation et événements sans duplication incontrôlée ?
5. Comment gérer les autorisations et les données des conversations ?
6. Quel dispositif est adapté pour Google Maps et les avis, en respectant les conditions fournisseurs ?
7. Comment intégrer Nettoyage sans inventer une taxonomie erronée ?
8. Quelle architecture d'événements et de rapports est utile sans surveillance excessive ?
9. Comment concevoir un BrainIOS qui prépare du code et des tests tout en restant sous contrôle ?
10. Quels risques, coûts, dépendances ou complexités sont sous-estimés ?

## 11. Critères de réussite de la vision 4.0

La vision ne sera considérée suffisamment cadrée que si :
- chaque domaine a une responsabilité et des frontières définies ;
- chaque fonction possède un statut réel et des critères d'acceptation ;
- les sources, coûts, quotas et conditions d'utilisation sont documentés ;
- les flux de données sont autorisés, traçables et testables ;
- le CRM interne et les espaces clients sont séparés ;
- BrainIOS possède des permissions et un cycle d'approbation explicites ;
- les rapports administrateur sont confidentiels et minimisés ;
- les décisions techniques sont comparées et validées ;
- les dépendances entre lots sont explicites ;
- le plan de migration préserve les acquis 3.0 sans déployer prématurément.

## 12. BrainIOS — Pilotage SEO et visibilité numérique

### 12.1 Finalité
BrainIOS doit également contribuer au maintien et à l'amélioration de la visibilité organique de MajestiOS. Cette fonction est un volet de veille, d'analyse et de développement commercial. Elle ne garantit aucun classement et ne promet pas de contourner les algorithmes : elle observe les signaux disponibles, détecte les problèmes, formule des recommandations et mesure les évolutions.

### 12.2 Périmètre fonctionnel
- **Surveillance de l'indexation :** couverture des pages, exploration, sitemap, robots.txt, canonical, redirections et erreurs HTTP, selon les données accessibles.
- **Santé technique :** performances, Core Web Vitals, compatibilité mobile, accessibilité technique, HTTPS et qualité des liens internes.
- **Qualité éditoriale :** titres, méta-descriptions, hiérarchie des titres, contenu utile, intention de recherche, duplication et cohérence sémantique.
- **Données structurées :** contrôle des balisages pertinents, de leur validité et de leur conformité au contenu réellement visible.
- **Veille de visibilité :** évolution des requêtes et positions, tendances de recherche, concurrents pertinents et changements documentés des moteurs.
- **Recherche assistée par IA :** observer, lorsque des outils fiables le permettent, la découvrabilité et la représentation de MajestiOS dans les moteurs et expériences de recherche générative. Ne pas assimiler cette observation à un classement SEO classique.
- **Plan d'action :** prioriser les corrections selon leur impact probable, leur niveau de confiance, leur coût et leur risque ; suivre les actions et leurs effets.

### 12.3 Sources et instrumentation à étudier
Le contre-audit devra comparer les outils et interfaces officiels adaptés, notamment Google Search Console, Bing Webmaster Tools, les outils de mesure de performances et les données analytiques respectueuses de la confidentialité. Les accès, quotas, coûts, conditions d'utilisation et éventuels consentements requis devront être vérifiés avant intégration. Les secrets et jetons restent côté serveur ; aucune clé privée ne doit être exposée dans le navigateur.

### 12.4 Espace administrateur
Ajouter à BrainIOS un espace **SEO & Visibilité** comprenant : tableau de bord et indicateurs de tendance ; surveillance et alertes techniques ; analyse des requêtes et pages ; audit SEO par page ; veille concurrentielle et évolutions des moteurs ; recommandations priorisées ; suivi des optimisations et historique.

### 12.5 Gouvernance et limites d'autonomie
BrainIOS peut effectuer des analyses planifiées, signaler une anomalie, rédiger une proposition de contenu ou préparer un correctif dans une branche isolée. Il ne doit pas modifier seul les pages stratégiques, les URL, les redirections, les balises d'indexation, les contenus publiés ni les réglages de production. Toute modification à risque ou publication exige une validation humaine, des tests et une possibilité de retour arrière.

Le référencement doit privilégier la qualité, l'utilité, l'accessibilité et la conformité aux consignes des moteurs. Sont exclus les pratiques trompeuses, le bourrage de mots-clés, les pages artificielles à grande échelle, le cloaking et toute promesse de position garantie.

### 12.6 Lien avec Réputation virtuelle
La compétence SEO développée pour MajestiOS pourra, après validation, inspirer des services clients de Réputation virtuelle : audit de visibilité locale et organique, cohérence des informations d'établissement, qualité de présence web, recommandations éditoriales et suivi. Les données et rapports internes de MajestiOS doivent rester séparés de ceux des entreprises clientes.


## Addendum stratégique — 4 novembre 2026 : MajestiOS, intelligence et CRM natif

Cet addendum complète la vision initiale. Il doit être pris en compte dans le contre-audit indépendant. Il exprime une orientation du fondateur, pas une fonctionnalité déjà développée ni une architecture définitivement arrêtée.

### 1. Une marque et une intelligence unifiées

L'orientation proposée est de faire de **MajestiOS** le nom unique du produit, de la plateforme et de l'intelligence qui l'anime. La séparation de marque entre MajestiOS et BrainIOS est donc remise en question.

BrainIOS devient, à ce stade, un nom historique de travail pour les idées d'orchestration, de mémoire, d'assistance et d'amélioration continue. Il ne doit plus être considéré automatiquement comme un produit autonome ou une marque visible. Le contre-audit devra évaluer s'il faut conserver ce nom pour un composant interne, le renommer ou l'abandonner. Aucune migration de nom dans le code ne doit être engagée avant arbitrage.

### 2. Ambition : faire évoluer MajestiOS vers un CRM nativement intelligent

L'ambition ne consiste pas simplement à ajouter un chatbot ou quelques fonctions d'IA à un CRM classique. Elle consiste à faire évoluer progressivement MajestiOS vers un système dans lequel l'intelligence artificielle devient une interface et un opérateur central de la gestion de la relation commerciale.

Trajectoire envisagée :
- CRM classique : l'utilisateur saisit, classe, actualise et exploite les données.
- CRM augmenté : l'IA assiste l'utilisateur dans la saisie, l'analyse et les tâches.
- CRM nativement intelligent : l'IA contribue à détecter, rapprocher, qualifier, enrichir, organiser, analyser, recommander et préparer les actions, dans le respect des permissions et validations humaines.
- Système de développement commercial intelligent : le CRM devient une fonction centrale d'un ensemble plus large reliant détection, qualification, prospection, transformation, Business Intelligence et capitalisation.

Le CRM reste un référentiel structuré et auditable. L'IA ne doit pas devenir une boîte noire qui modifie silencieusement les données : chaque donnée importante doit conserver sa provenance, sa date, son niveau de confiance, son historique et les règles d'accès applicables.

### 3. Distinguer deux sens du mot CRM

Cette distinction est obligatoire dans toute la documentation, l'architecture, l'arborescence et les interfaces :

**A. CRM comme offre commerciale présentée dans l'immeuble interactif**
- Cette rubrique correspond à une activité et une proposition de valeur commerciale de MajestiOS.
- Elle peut inclure conseil, sélection, intégration, configuration ou accompagnement autour de solutions CRM existantes, y compris open source.
- Elle peut proposer l'évolution vers des usages intégrant IA et Business Intelligence.
- Elle s'adresse notamment aux entreprises qui souhaitent acquérir, remplacer, améliorer ou mieux exploiter un CRM.
- Le clic sur cette rubrique doit conduire à une page de présentation de cette offre commerciale, et non être interprété comme l'accès au CRM privé de l'espace client.

**B. CRM interne de la plateforme MajestiOS**
- Il s'agit du socle de gestion des contacts, entreprises, établissements, opportunités, interactions, activités et suivis nécessaires au fonctionnement de MajestiOS.
- Son accès relève des espaces authentifiés et des permissions appropriées.
- Il ne constitue pas la même offre ni la même destination que la rubrique commerciale CRM de l'immeuble.
- Les données de ce CRM interne ne doivent pas être exposées aux visiteurs ni aux clients sans fondement, finalité et autorisation explicites.

Les deux domaines peuvent partager des concepts génériques, mais leurs données, rôles, interfaces, finalités et droits d'accès doivent rester distincts.

### 4. IA, CRM et Business Intelligence comme ensemble cohérent

L'IA, le CRM et la Business Intelligence ne doivent pas être conçus comme trois modules indépendants juxtaposés :
- le CRM structure les relations, les interactions, les opportunités et les résultats ;
- l'IA aide à comprendre, rapprocher, enrichir, prioriser et préparer les actions ;
- la Business Intelligence transforme les données fiables et contextualisées en analyses, indicateurs et aide à la décision.

Le contre-audit devra recommander les frontières techniques et fonctionnelles qui permettent cette cohérence sans couplage excessif.

### 5. Capacités cibles à examiner

À terme, sous réserve de faisabilité, de sources autorisées et de validation humaine :
- détection et rapprochement de nouvelles entreprises, établissements, contacts et signaux ;
- enrichissement traçable des fiches ;
- qualification explicable et gestion de l'incertitude ;
- mémoire structurée des interactions et décisions ;
- synthèse des échanges et préparation de comptes rendus ;
- recommandations de prochaines actions et priorisation ;
- préparation de prises de contact et relances, sans envoi autonome par défaut ;
- suivi des opportunités et analyse des résultats ;
- tableaux de bord et analyses en langage naturel ;
- détection de tendances et signaux commerciaux ;
- apprentissage contrôlé à partir des résultats, retours et évaluations.

Ces capacités doivent être évaluées par étapes. Elles ne sont pas toutes des exigences du premier MVP.

### 6. Principes de gouvernance non négociables

- Pas d'action commerciale externe sensible sans autorisation adaptée.
- Pas d'envoi automatique de messages par défaut.
- Pas de modification silencieuse des données de référence.
- Provenance, horodatage, confiance et journal d'audit pour les enrichissements et recommandations.
- Cloisonnement strict entre CRM interne, espaces clients et données de clients accompagnés.
- Contrôle des accès côté serveur ; aucune sécurité fondée uniquement sur l'interface.
- Possibilité de corriger, contester, exporter et supprimer les données selon les règles applicables.
- Mesure de la qualité de l'IA, gestion des erreurs et possibilité de revenir à un fonctionnement manuel.
- Architecture progressive : ne pas imposer une plateforme multi-agents ou distribuée avant que les besoins réels le justifient.

### 7. Questions à soumettre impérativement aux autres IA

1. À quelles conditions une IA peut-elle devenir le cœur opérationnel d'un CRM sans sacrifier la fiabilité, l'auditabilité et le contrôle utilisateur ?
2. Quel modèle de données et quel modèle d'événements permettent à la fois un CRM structuré et une interaction principalement conversationnelle ?
3. Quelles opérations peuvent être automatisées, préparées ou seulement recommandées ?
4. Comment conserver une source de vérité structurée si l'utilisateur interagit principalement avec un agent ?
5. Comment éviter hallucinations, doublons, enrichissements erronés, dérives de qualification et actions commerciales inappropriées ?
6. Quel découpage entre CRM interne MajestiOS, offre commerciale CRM et CRM des entreprises clientes accompagnées ?
7. MajestiOS doit-il intégrer un CRM propre, se connecter à des CRM tiers, proposer les deux approches, ou évoluer progressivement vers un modèle hybride ?
8. BrainIOS doit-il rester un nom de composant interne, être renommé ou disparaître au profit d'une architecture intégralement nommée MajestiOS ?
9. Quel rôle précis attribuer à la Business Intelligence et comment distinguer indicateurs descriptifs, diagnostics et prédictions ?
10. Quels jalons mesurables permettent de passer d'un CRM assisté à un CRM réellement natif IA ?

