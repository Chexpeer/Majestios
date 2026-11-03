# MAJESTIOS — Cahier des charges fondateur et feuille de route

**Version :** 0.1 — document de cadrage initial  
**Statut :** base de travail à compléter et à valider  
**Branche de travail :** `evolution-2.0`  
**Règle impérative :** aucun changement du site, du code, de l'architecture existante ou de la production avant validation des fondations et autorisation explicite.

## 1. Vision et positionnement

MajestiOS a vocation à devenir une plateforme professionnelle de développement commercial et d'intelligence économique destinée aux entreprises, indépendants et professionnels.

La plateforme doit aider ses utilisateurs à détecter des marchés et des opportunités, identifier des entreprises et des contacts pertinents, qualifier des informations, développer leur clientèle et suivre leurs démarches.

**Le CRM est le cœur de MajestiOS.** MajestiOS ne doit pas être conçu comme un moteur d'annonces auquel on ajouterait secondairement un carnet d'adresses. Les moteurs de recherche, la collecte, la veille, l'analyse, la qualification, la prospection et les espaces clients sont des fonctions coordonnées qui alimentent et exploitent le référentiel commercial.

## 2. Principes directeurs

1. **Centralité du CRM :** centraliser entreprises, établissements, contacts, opportunités, sources, interactions, actions et résultats.
2. **Fonctions spécialisées et interconnectées :** chaque fonction a une responsabilité explicite et échange des données traçables avec les autres.
3. **Exploitation différenciée :** distinguer les données publiables, celles destinées au CRM, celles réservées à la veille/analyse et celles utilisées en prospection interne.
4. **Traçabilité :** conserver la source, la date de collecte, les transformations, enrichissements, qualifications, transmissions et usages.
5. **Expérience accessible :** proposer des parcours progressifs, compréhensibles et pédagogiques.
6. **Automatisation maîtrisée :** aucune automatisation sans déclencheur, règles, contrôles, journalisation et procédure de reprise.
7. **Sécurité et conformité dès la conception :** cloisonnement, droits, protection des données, conditions d'utilisation des sources et conformité de la prospection.

## 3. Socle fonctionnel initial

### 3.1 Moteur de recherche unique

Le moteur comporte un premier choix entre deux familles.

**Recherche publique**
- Source initiale envisagée : BOAMP.
- Cinq catégories de recherche restent à définir par le porteur du projet.
- D'autres sources pourront être ajoutées ultérieurement dans le parcours public.

**Recherche privée**
- Source initiale envisagée : BODACC.
- Trois catégories issues du BODACC restent à définir.
- Immobilier.
- Offres d'emploi, avec Cadremploi et APEC regroupés dans une même catégorie.
- Publier mon annonce.

Chaque catégorie possède son propre espace de résultats. La présentation initiale prévoit au maximum dix annonces par page et une pagination. Les catégories ne doivent pas être inventées par les intervenants techniques ou les IA : elles nécessitent une décision explicite.

Le clic sur une annonce doit s'inscrire dans un parcours de création d'espace personnalisé et de découverte des services MajestiOS. Le parcours exact et les éventuelles exceptions restent à spécifier.

### 3.2 CRM central

Le CRM interne est le référentiel commercial de MajestiOS. Il doit notamment gérer :
- entreprises et établissements ;
- contacts professionnels ;
- annonces, marchés et opportunités ;
- relations entre entreprises et opportunités ;
- sources et provenance ;
- historique des interactions ;
- actions et campagnes de prospection ;
- suivi, résultats et transformations commerciales.

La déduplication, la qualité des données, les règles de rapprochement et les droits d'accès sont des exigences de conception.

### 3.3 Veille et analyse

La veille n'est pas une simple liste d'annonces. Elle collecte et analyse des informations, détecte des nouveautés, rapproche des activités professionnelles, qualifie des entreprises potentiellement concernées et transmet les résultats pertinents au CRM et à la prospection.

Les codes NAF/APE peuvent servir de critères de présélection, mais ne prouvent ni la compétence ni la capacité réelle d'une entreprise à répondre à une opportunité. Des critères complémentaires et une vérification adaptée sont nécessaires.

La veille peut traiter des informations qui ne sont jamais destinées à la publication publique.

### 3.4 Prospection active

La prospection est transversale et peut exploiter en parallèle :
- ressources publiques ;
- ressources privées ;
- analyses et résultats de la veille ;
- annuaires et répertoires professionnels ;
- recherches directes d'entreprises.

Elle doit permettre de qualifier et prioriser des cibles, préparer des campagnes, gérer les relances et enregistrer les résultats. Les règles de prospection, d'opposition, de désinscription et de conformité doivent être intégrées.

### 3.5 Espaces clients personnalisés

Chaque client dispose d'un environnement de travail séparé, qui peut notamment lui permettre de :
- consulter des opportunités sélectionnées ;
- recevoir des dossiers qualifiés ;
- préparer et suivre des candidatures ou réponses aux marchés ;
- gérer documents, échéances et démarches ;
- utiliser des outils de développement commercial ;
- retrouver l'historique de son activité.

Il faut distinguer strictement le CRM interne global de MajestiOS et les espaces de travail clients. Un client ne doit accéder ni aux données internes de prospection ni aux données d'un autre client.

## 4. Circuits de données

Une information collectée peut alimenter trois circuits distincts et coordonnés :

1. **CRM :** centralisation, enrichissement, relation entre entités et suivi commercial.
2. **Publication :** sélection limitée d'informations destinées au site et à l'acquisition d'utilisateurs.
3. **Veille :** analyse, rapprochement, qualification et préparation d'actions.

Toutes les informations collectées ne sont pas destinées à être publiées. La valeur de la plateforme repose aussi sur le traitement interne, la qualification et les rapprochements.

### Scénario fonctionnel de référence

1. Une consultation publique est détectée.
2. Les informations utiles et leur provenance sont conservées.
3. La veille analyse le sujet et identifie les activités potentiellement concernées.
4. Les codes NAF/APE et d'autres critères servent à rechercher des entreprises.
5. Les entreprises sont qualifiées, avec indication des limites du rapprochement.
6. Le lien entre chaque entreprise et la consultation déclenchante est conservé.
7. Les éléments utiles sont transmis au CRM.
8. La prospection peut préparer une action ciblée.
9. Les contacts et résultats sont historisés dans le CRM.

Ce scénario servira de premier test de cohérence fonctionnelle de bout en bout.

## 5. Fondations techniques à cadrer

Aucun choix technique majeur ne doit être arrêté avant audit de l'existant et formalisation des besoins.

Le dossier technique devra couvrir :
- architecture des applications et des modules ;
- responsabilités et interfaces entre fonctions ;
- API, événements et mécanismes de transmission ;
- modèle de données et référentiels ;
- déduplication, historisation et archivage ;
- collecte et intégration des sources ;
- automatisations, contrôles et reprise sur erreur ;
- authentification, rôles et cloisonnement ;
- journalisation, secrets et sécurité ;
- conformité et conditions d'utilisation des données ;
- performance, coûts et capacité d'évolution ;
- environnements de développement, test, prévisualisation et production.

Les coûts de collecte, stockage, traitement, enrichissement et prospection doivent être évalués avant toute montée en charge.

## 6. Fondations commerciales

Le modèle commercial doit répondre explicitement aux questions suivantes :
- Quels segments de clientèle sont prioritaires ?
- Quels problèmes concrets MajestiOS résout-il pour chacun ?
- Quels services sont gratuits, payants ou proposés en accompagnement ?
- Quels services peuvent réellement être automatisés ?
- Quelle valeur justifie un abonnement, une facturation à l'usage ou une prestation ?

Une structuration à étudier pourrait distinguer : accès découverte, espace personnalisé, veille qualifiée, services de développement commercial et accompagnement. Il s'agit d'une hypothèse, pas d'une tarification validée.

Aucun service ne doit être annoncé comme disponible tant que sa capacité réelle à être fourni n'a pas été vérifiée.

## 7. Fondations pédagogiques

L'accompagnement doit être intégré à l'expérience :
- présentation claire des services ;
- parcours de découverte et de création du profil ;
- explication des catégories et résultats ;
- guides pratiques et FAQ ;
- aide contextuelle et tutoriels ;
- explication des critères de qualification et des limites des données ;
- accompagnement des dossiers et démarches.

Le vocabulaire doit être professionnel, simple et cohérent. L'utilisateur doit comprendre non seulement comment utiliser la plateforme, mais aussi ce que chaque service peut apporter à son activité.

## 8. Feuille de route prévisionnelle

Les phases ci-dessous sont des étapes de validation, pas des dates de livraison.

### Phase 1 — Audit et préservation de l'existant
- inventorier le dépôt, les pages, routes, composants, scripts, API et sources ;
- distinguer fonctions réelles, partielles, simulées et inactives ;
- repérer dépendances, risques et contraintes ;
- établir un état de référence sans modifier le produit.

**Livrable :** audit de l'existant et cartographie des écarts.

### Phase 2 — Cadrage fonctionnel
- définir les responsabilités des espaces ;
- préciser les parcours publics et privés ;
- faire définir les cinq catégories publiques et les trois catégories BODACC ;
- formaliser CRM, veille, prospection, publication et espaces clients ;
- décrire les circuits de données, statuts et règles d'accès.

**Livrable :** cahier des charges fonctionnel validé.

### Phase 3 — Cadrage commercial et pédagogique
- préciser les clientèles prioritaires et propositions de valeur ;
- définir services, niveaux d'accès et modèle économique ;
- formaliser les parcours d'inscription et de conversion ;
- préparer les contenus pédagogiques et l'accompagnement.

**Livrable :** modèle commercial et parcours pédagogiques de référence.

### Phase 4 — Architecture technique cible
- définir le modèle de données et les interfaces ;
- sélectionner les mécanismes de collecte et d'automatisation ;
- établir sécurité, conformité, observabilité et sauvegardes ;
- évaluer coûts, limites et conditions des sources ;
- définir les environnements et procédures de livraison.

**Livrable :** dossier d'architecture et plan de réalisation.

### Phase 5 — Prototype fonctionnel contrôlé
- démontrer le scénario de référence de bout en bout ;
- tester les transmissions et la traçabilité ;
- vérifier les droits et le cloisonnement ;
- mesurer la fiabilité et les coûts.

**Livrable :** prototype de validation sur environnement isolé.

### Phase 6 — Construction progressive du MVP
- consolider le CRM ;
- fiabiliser les collectes ;
- développer veille et qualification ;
- développer la prospection ;
- construire les espaces clients ;
- intégrer les parcours pédagogiques et commerciaux.

**Livrable :** MVP cohérent sur un périmètre explicitement défini.

### Phase 7 — Validation et déploiement
- tests fonctionnels, sécurité, droits et cloisonnement ;
- tests de fiabilité, performance et coûts ;
- tests utilisateurs et validation commerciale ;
- documentation et préparation du déploiement ;
- déploiement uniquement après autorisation explicite.

**Livrable :** version validée, documentée et exploitable.

## 9. Gouvernance et règles de changement

Jusqu'à validation des fondations :
- ne pas modifier le site actuel ;
- ne pas modifier la production ;
- ne pas réorganiser le code ou l'architecture ;
- ne pas fusionner de branche ni déployer sans autorisation ;
- ne pas ajouter de module sans définir son rôle et ses échanges ;
- ne pas inventer les catégories ou arbitrages laissés ouverts ;
- documenter les décisions, hypothèses, risques et validations.

Chaque proposition doit distinguer :
1. l'existant constaté ;
2. le fonctionnement effectivement vérifié ;
3. les défauts ou lacunes ;
4. les propositions ;
5. les décisions validées ;
6. les actions autorisées.

## 10. Conditions préalables à toute refonte

Une refonte ne pourra être envisagée qu'après validation :
- de la vision et du positionnement ;
- des fonctions, responsabilités et parcours ;
- des circuits de données ;
- du modèle CRM ;
- du modèle commercial ;
- du dispositif pédagogique ;
- de l'architecture technique cible ;
- des exigences de sécurité, conformité et coûts ;
- du périmètre MVP et de ses critères de réussite.

**Principe final : MajestiOS ne sera pas refondu pour changer son apparence. La transformation ne commencera qu'une fois la plateforme définie, cohérente, maîtrisée techniquement, viable commercialement et compréhensible par ses utilisateurs.**
