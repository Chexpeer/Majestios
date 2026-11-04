# Vision et architecture cible — MajestiOS 4.0

**Date :** 4 novembre 2026  
**Statut :** vision produit 4.0 en cours de réalisation ; l'espace d'administration est le poste de pilotage depuis lequel le porteur du projet fait évoluer MajestiOS avec BrainIOS.  
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

Cette interface est intégrée à l'espace d'administration MajestiOS. Elle constitue le poste de pilotage principal du porteur du projet : l'évolution de MajestiOS doit pouvoir être conduite depuis cet espace, en dialoguant avec BrainIOS, en formulant des demandes, en choisissant les priorités, en examinant les propositions et en suivant les résultats.

L'espace admin ne se limite donc pas à gérer des comptes et des paramètres. Il devient l'atelier de pilotage et d'évolution du produit. Le porteur du projet doit pouvoir demander une évolution fonctionnelle ou technique en langage naturel, joindre des éléments de contexte, faire analyser l'existant, recevoir un plan d'action, suivre les modifications préparées et consulter les tests avant de décider de leur mise en service.

#### C2.1. Moteur IA BrainIOS — API OpenAI payante

BrainIOS utilisera l'API OpenAI avec une clé API dédiée au fonctionnement applicatif de MajestiOS. Le modèle et les capacités appelées seront configurables côté serveur, sans figer le fournisseur ou le modèle dans le code métier.

Principes :
- clé API dédiée à l'application ou à son projet OpenAI, idéalement portée par un compte de service ;
- clé conservée exclusivement dans les secrets d'environnement du backend / de la plateforme d'hébergement ;
- aucun affichage, stockage en clair ou transmission de la clé dans le navigateur, l'espace admin, la base métier, les logs ou GitHub ;
- les appels au modèle passent par un service serveur BrainIOS, jamais directement depuis le navigateur ;
- choix du modèle, limites de contexte, plafonds de tokens, délais, quotas et budgets configurables ;
- journalisation des coûts estimés, volumes, modèles, durées, erreurs et identifiants de requête, sans conserver les secrets ni les données sensibles inutiles ;
- seuils d'alerte et coupure contrôlée en cas de dépassement du budget applicatif ;
- gestion des erreurs, limites de débit, reprises bornées et mode dégradé ;
- possibilité de remplacer ou faire évoluer le modèle sans refondre les modules métier.

La clé API n'est pas un paramètre ordinaire que l'administrateur saisit dans un formulaire web. Son installation et sa rotation relèvent de la configuration sécurisée du serveur. L'espace admin peut indiquer si le service est configuré, afficher son état de santé et ses métriques, mais jamais révéler la clé.

**Facturation :** l'usage de l'API OpenAI est facturé séparément de l'abonnement ChatGPT, selon le compte API, les modèles et les volumes utilisés. Le budget API devra donc être activé et surveillé indépendamment.

#### C2.2. L'espace admin comme cockpit d'évolution de MajestiOS

Le cockpit BrainIOS doit progressivement permettre au porteur du projet de :

1. **Dialoguer et donner des instructions** : décrire une idée, un besoin, une correction ou une nouvelle fonctionnalité.
2. **Conserver la vision** : consulter et mettre à jour les décisions, la doctrine, les priorités, les documents de référence et le vocabulaire.
3. **Faire analyser MajestiOS** : demander un audit ciblé du code, des pages, des liens, des données, des parcours, du SEO ou des performances.
4. **Transformer une demande en travail** : obtenir un diagnostic, les fichiers concernés, les dépendances, un plan par lots et des critères d'acceptation.
5. **Piloter les développements** : suivre les tâches, branches, commits, pull requests, tests, erreurs et résultats.
6. **Faire évoluer les contenus et paramètres** : gérer les éléments éditoriaux, taxonomies, règles métier et configurations autorisées depuis l'admin.
7. **Piloter le SEO** : consulter les audits, tendances, alertes et recommandations ; approuver les modifications de contenu, métadonnées, liens et routes.
8. **Suivre les coûts IA** : visualiser consommation, budgets, alertes et évolution des appels API.
9. **Valider les changements** : examiner les diffs, prévisualisations, tests et risques avant toute mise en service.

Le parcours de développement piloté depuis l'admin est :
**Demande → Analyse du contexte → Proposition de solution → Découpage en tâches → Approbation du lot → Exécution isolée → Tests → Présentation du résultat → Validation de mise en service.**

Les demandes et décisions sont conservées dans une mémoire de projet versionnée. BrainIOS doit retrouver la vision et l'état des travaux avant de proposer une modification, afin d'éviter les régressions et les répétitions.

Le porteur du projet garde le contrôle des priorités et des validations. Les opérations destructrices, les modifications de permissions, les migrations de données, les fusions et les déploiements ne sont jamais déclenchés implicitement par une simple conversation.

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
- connecteurs IA et outils de développement ;
- passerelle serveur vers l'API OpenAI, gestion des quotas et suivi des coûts.

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
13. Configuration BrainIOS non secrète, budgets et métriques d'utilisation IA.

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
| Répondre à l'administrateur via l'API OpenAI | Oui, selon les budgets, quotas et permissions configurés |
| Préparer un plan d'évolution depuis une instruction admin | Oui, proposition à examiner |
| Modifier des contenus et paramètres explicitement autorisés | Oui, avec historique et possibilité de retour arrière |
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

## 10. Pilotage de l'évolution depuis l'espace admin

L'espace d'administration est l'interface de commande du projet. Le porteur du projet n'a pas à modifier le code pour chaque évolution : il exprime l'objectif dans BrainIOS, puis suit un processus lisible et contrôlé.

Les demandes sont classées par nature :
- **Contenu** : textes, pages éditoriales, FAQ, slogans, ressources.
- **Configuration métier** : catégories, sources activées, règles de qualification, paramètres de recherche.
- **Évolution fonctionnelle** : nouveaux parcours, rubriques, formulaires, modules.
- **Évolution technique** : architecture, API, données, performances, sécurité, intégrations.
- **Visibilité** : SEO, indexation, données structurées, maillage interne et suivi de présence dans les moteurs.

Chaque demande devient un dossier de travail avec identifiant, objectif, contexte, priorité, périmètre, dépendances, fichiers ou données concernés, critères de réussite, état, décisions et historique.

L'espace admin doit présenter au minimum :
- conversation BrainIOS et contexte projet ;
- backlog et priorités ;
- vision et mémoire documentaire ;
- demandes et plans de travail ;
- aperçu des changements préparés ;
- état GitHub et des workflows ;
- rapports de tests et anti-régression ;
- surveillance, rapports journaliers et alertes ;
- tableau de bord SEO ;
- configuration non secrète du moteur IA et suivi de consommation.

Les opérations sont séparées par niveau :
- lecture et diagnostic ;
- proposition et planification ;
- modification de contenu/configuration réversible ;
- modification de code sur branche isolée ;
- approbation d'une PR ;
- mise en service.

Le porteur du projet peut autoriser les niveaux progressivement. Le cockpit ne doit jamais confondre « demander une évolution », « l'implémenter », « la fusionner » et « la déployer ».

## 11. Décisions ouvertes pour le contre-audit

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

## 12. Critères de réussite de la vision 4.0

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
