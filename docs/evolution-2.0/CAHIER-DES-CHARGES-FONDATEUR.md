# MAJESTIOS — Cahier des charges fondateur et feuille de route

**Version :** 0.2 — décisions du 3 novembre 2026 intégrées (§ 11)  
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
- Cinq catégories de recherche, choisies parmi les catégories les plus importantes du BOAMP ; la liste exacte reste à faire valider par le porteur du projet (§ 11).
- D'autres sources pourront être ajoutées ultérieurement dans le parcours public.

**Recherche privée**
- Source initiale envisagée : BODACC.
- Trois catégories issues du BODACC : créations, ventes et cessions, modifications.
- **Emploi :** uniquement les annonces publiées par les utilisateurs ou par l'équipe MajestiOS.
- **Je publie mon annonce :** dépôt d'annonces professionnelles par les utilisateurs : emploi, sous-traitance, demande, offre ou autre annonce pertinente.
- L'immobilier est retiré du moteur de recherche.
- Les annonces externes de Cadremploi, France Travail et APEC ne sont pas des offres publiées dans MajestiOS. Leur éventuelle consultation/cache et leur transmission à la Veille sont reportées à une phase ultérieure.

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

Une information collectée ou déposée peut alimenter plusieurs circuits coordonnés, selon sa nature, sa provenance, les droits applicables et sa qualification :

1. **Publication :** annonces et informations validées destinées aux espaces publics de MajestiOS.
2. **CRM :** entreprises, contacts, demandes, offres, relations, historique et suivi commercial.
3. **Veille :** détection, rapprochement, qualification et préparation d'actions.
4. **Prospection active :** exploitation encadrée des informations qualifiées pour développer la clientèle et identifier des marchés de sous-traitance.

**Circuit des annonces déposées par les utilisateurs :** après contrôle et qualification, une annonce peut être publiée dans l'espace approprié, enregistrée ou rapprochée dans le CRM, exploitée par la Veille et utilisée pour préparer des actions de prospection. Ces transmissions ne sont pas automatiques par défaut : elles dépendent de règles à définir, de la provenance, des droits, des consentements ou autres bases applicables et des finalités autorisées.

Il faut distinguer le contenu public de l'annonce, les données internes de gestion et les informations réservées à l'analyse ou à la prospection. Une annonce visible publiquement ne rend pas automatiquement toutes les données de son auteur accessibles ou réutilisables.

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

## 11. Décisions validées par le porteur du projet

Cette section ne contient que ce que le porteur du projet a explicitement dit ou validé. Tout le reste du document demeure une base de travail.

### 11.1 Décisions du 3 novembre 2026

1. **Marchés publics :** cinq catégories, choisies parmi les catégories les plus importantes du BOAMP.
2. **Marchés privés BODACC :** trois catégories : créations, ventes et cessions, modifications.
3. **Emploi :** seules les annonces déposées par les utilisateurs ou publiées par l'équipe MajestiOS sont affichées comme offres d'emploi dans la plateforme.
4. **Annonces utilisateurs :** remplacer la rubrique Immobilier du moteur par **« Je publie mon annonce »**, avec les types annoncés : emploi, sous-traitance, demande, offre et autres annonces professionnelles pertinentes.
5. **Finalité commerciale :** les marchés publics sont un moyen de détecter de nouveaux clients et des marchés de sous-traitance, et non une finalité isolée de MajestiOS.
6. **Documentation :** l'ancienne documentation, retirée du dépôt pour l'alléger, peut être rétablie. Elle l'a été à l'identique dans `docs/historique/` (voir `docs/README.md`).
7. **Harmonisation graphique du 2 novembre 2026 :** à conserver impérativement ; le porteur du projet en est plutôt satisfait. Elle fait partie de l'état de référence.
8. **Suite :** reprise du perfectionnement de la branche `evolution-2.0`.

### 11.1 ter Précision sur les sources d'emploi — 3 novembre 2026

9. **Sources d'emploi internes uniquement :** les offres d'emploi de MajestiOS proviennent exclusivement des annonces des utilisateurs et de l'équipe MajestiOS.
10. **Sources externes en attente :** Cadremploi, France Travail et APEC ne sont pas des sources d'offres affichées dans MajestiOS. Leur éventuelle consultation, mise en cache et transmission à la Veille est une fonctionnalité différée, non à développer dans la phase actuelle.

### 11.1 bis Décisions complémentaires du 3 novembre 2026

6. **Trois catégories BODACC retenues :** créations, ventes et cessions, modifications. Les procédures collectives et les radiations ne font pas partie des trois catégories.
7. **Catégories publiques :** les cinq catégories seront choisies d'après une **mesure des volumes réels d'avis BOAMP**, puis validées par le porteur du projet.

### 11.2 Ce qui reste à décider (non tranché)

| Point | Précision attendue |
|---|---|
| Les cinq catégories publiques | Mesure des volumes réels réalisée (outil prêt, § 11.4) ; le porteur du projet valide ensuite les cinq retenues |
| Cinq catégories publiques | Mesure des volumes réels réalisée (outil prêt, § 11.4) ; validation finale par le porteur du projet |
| Annonces utilisateurs | Conditions de dépôt, identification de l'auteur, modération, validation, durée de vie, signalement et modalités de contact |
| Réutilisation interne des annonces | Règles de qualification, déduplication, alimentation du CRM et de la Veille, déclenchement éventuel de prospection, information et droits des auteurs |
| Emploi — sources externes | Fonctionnalité différée : faisabilité, conditions d'accès/cache et règles de transmission à la Veille à étudier ultérieurement |

### 11.3 Conséquences à cadrer (propositions, aucune n'est une décision)

- Les annonces internes sont du **contenu produit par les utilisateurs ou l'équipe MajestiOS** : elles supposent stockage, identification de l'auteur, modération, protections anti-abus, gestion des durées et conformité à vérifier. Le prototype actuel n'a ni base de données ni authentification (audit, § 3.1) : cette fonction relève de l'architecture cible, pas d'un simple ajout de page.
- Le flux d'annonces doit prévoir une qualification avant publication et des règles distinctes pour l'affichage public, l'enregistrement CRM, la Veille et la prospection. La transmission vers ces fonctions doit respecter les finalités et droits applicables.
- La consultation/cache d'annonces externes d'emploi (Cadremploi, France Travail, APEC) et leur transfert à la Veille sont explicitement différés.
- Les catégories du code actuel ne correspondent pas entièrement aux décisions. Aucune modification du code n'est autorisée par cette mise à jour documentaire.
- Le choix des catégories publiques « les plus importantes » peut s'appuyer sur une mesure réelle des avis BOAMP, à effectuer depuis un environnement ayant accès à la source.

### 11.4 Outil de mesure des volumes BOAMP

- **Fichier :** `outils/mesure-boamp.cjs`, vérifié par `tests/mesure-boamp.test.cjs` (réponses simulées).
- **Action :** quelques requêtes en lecture seule sur l'API publique du BOAMP ; classement par type de marché, famille d'avis et descripteur, plus le volume des catégories actuelles du moteur. Aucune donnée n'est enregistrée, aucun chiffre n'est inventé : une mesure qui échoue est marquée « non mesuré ».
- **Lancement :** dans GitHub, onglet Actions, « Mesure des volumes BOAMP », « Run workflow » (le rapport apparaît dans le résumé du job et en pièce jointe), ou en local avec `node outils/mesure-boamp.cjs`.
- **Limites :** l'outil n'a pas pu être essayé contre l'API réelle depuis l'environnement où il a été écrit ; le premier passage réel doit être relu. Les familles d'avis incluent des résultats et rectificatifs. Le volume ne dit rien de la valeur commerciale d'une catégorie.

