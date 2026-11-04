# AUDIT MAJESTIOS 3.0 — Diagnostic de référence pour l'évolution 4.0

**Date de consultation :** 4 novembre 2026  
**Dépôt :** `Chexpeer/Majestios`  
**Branche de référence auditée :** `evolution-3.0`  
**Commit observé :** `05f2435af0d926b3ed24471065cf9d43b7adab88`  
**Branche documentaire de ce rapport :** `docs/audit-vision-roadmap-4.0-2026-11-04`  
**Statut :** diagnostic documentaire fondé sur les fichiers et métadonnées GitHub consultés ; certains contrôles d'exécution et services externes restent à compléter.

> Ce rapport distingue les faits observés dans le dépôt, les déclarations de la documentation, les résultats CI consultés et les points non vérifiés. Il ne transforme pas une intention ou un prototype en fonctionnalité opérationnelle.

## 1. Synthèse exécutive

MajestiOS 3.0 possède un prototype web statique déjà conséquent et une documentation métier/technique particulièrement riche. Il ne s'agit cependant pas encore d'une plateforme SaaS opérationnelle : le dépôt décrit explicitement l'absence de backend applicatif, de base de données, d'authentification et de persistance.

Les acquis les plus solides sont :
- une expérience de site multi-pages avec immeuble interactif et dix espaces thématiques ;
- des modules de recherche BOAMP et BODACC dans le navigateur ;
- une qualification indicative d'entreprises par APE/NAF et département via l'API publique Recherche d'Entreprises ;
- des tests unitaires, des tests navigateur et des contrôles d'architecture/liens ;
- une documentation structurée autour des étapes A/B/C, du cloisonnement des données, des permissions et des contrats API ;
- des travaux de modularisation en cours dans les PR #32 à #34.

Les principaux écarts qui justifient une évolution 4.0 sont :
1. l'écart entre la vision produit et les capacités réellement connectées ;
2. l'absence de socle backend, identité, persistance et autorisations côté serveur ;
3. la dispersion des changements entre plusieurs chaînes de PR empilées ;
4. des contradictions entre les décisions documentées et le code de la branche de référence ;
5. l'évolution importante du périmètre : Nettoyage, Réputation virtuelle, Prosp'active, Google Maps et BrainIOS agentique ;
6. les prérequis de protection des données et de gouvernance avant collecte réelle, suivi comportemental et analyse des conversations.

**Conclusion :** conserver les acquis du prototype et les documents utiles, mais définir l'architecture cible 4.0 avant toute nouvelle vague de développement fonctionnel. Ne pas prendre `main` comme base de travail sans arbitrage : son arbre observé est très réduit par rapport à `evolution-3.0`.

## 2. Périmètre et méthode

### 2.1 Sources examinées

- Métadonnées du dépôt et branche par défaut.
- Arbre récursif de `evolution-3.0` et arbre de `main`.
- README racine et `AGENTS.md`.
- Documentation active `docs/evolution-3.0/` : README, étapes A/B/C, audit comparatif technique, cahier des charges fonctionnel.
- Documentation héritée `docs/evolution-2.0/` : audit existant et cahier des charges fondateur.
- Documentation BrainIOS historique.
- Fichiers représentatifs : accueil, résultats, CRM, espace membre, BrainOS, recherche, qualification d'entreprises, pages légales.
- Scripts de build et de vérification, workflows GitHub Actions et tests pertinents.
- Métadonnées, bases, têtes et fichiers modifiés des PR ouvertes #23 à #34.

### 2.2 Limites

Cet audit est une lecture du dépôt et des preuves GitHub disponibles. Il ne constitue pas :
- un audit d'intrusion ou un audit de sécurité applicatif complet ;
- un audit juridique RGPD/CNIL ;
- un test de charge ou de performance en production ;
- une recette complète de tous les parcours sur appareils réels ;
- une vérification du compte, des réglages et des déploiements Vercel ;
- une validation contractuelle des conditions d'utilisation des sources externes ;
- une preuve d'usage par de vrais utilisateurs.

Le succès d'un workflow CI prouve que les étapes automatisées de ce workflow ont réussi pour le commit concerné ; il ne prouve ni l'adéquation métier, ni la conformité juridique, ni la disponibilité permanente d'une source.

## 3. État matériel du dépôt

### 3.1 Branche par défaut et branche de travail

- Branche par défaut du dépôt : `main`.
- Arbre de `main` observé : 7 fichiers suivis.
- Branche `evolution-3.0` : 123 fichiers suivis, dont 32 HTML, 14 JavaScript, 4 CSS et 49 fichiers sous `docs/`.
- Branche `backup/evolution-3.0-pre-lot-1-2026-11-03` : même SHA observé que `evolution-3.0` au moment de l'audit.

La différence d'ampleur entre `main` et `evolution-3.0` est un point majeur de gouvernance. Toute branche de référence 4.0 devra partir d'un commit explicitement choisi après vérification des changements utiles, pas du seul nom de la branche par défaut.

### 3.2 Technologies observées

- Frontend : HTML, CSS et JavaScript natif.
- Scripts de construction et de contrôle : Node.js.
- Tests navigateur : Playwright/Chromium.
- Hébergement cible décrit : Vercel, publication du dossier `dist/`.
- Pas de `package.json` à la racine de la branche auditée.
- Pas de backend applicatif ni de base relationnelle présents dans l'arbre examiné.
- Pas de configuration de déploiement Vercel examinée au-delà du fichier `vercel.json`.

Le README et `AGENTS.md` indiquent explicitement que l'architecture API, l'authentification, le CRM persistant et les schémas de données décrits dans la documentation 3.0 sont des propositions, non des implémentations.

## 4. Fonctionnalités : état observé

| Domaine | État observé dans le dépôt | Ce que cela ne prouve pas |
|---|---|---|
| Accueil et immeuble interactif | Page d'accueil, zones interactives et catalogue de dix espaces ; PR #33 extrait le catalogue dans un module dédié | Ne prouve pas que toute l'arborescence métier est définitivement stabilisée |
| Navigation | Menu présent dans les pages ; PR #34 ajoute un gestionnaire partagé | Ne prouve pas une navigation parfaite sur tous les appareils et contextes d'accessibilité |
| Recherche BOAMP | Code de requête vers l'API publique, filtres et affichage de résultats | Ne prouve pas la pertinence métier de chaque catégorie ni une disponibilité sans interruption |
| Recherche BODACC | Code de requête vers l'API publique et classification de familles | La branche de base contient encore cinq familles BODACC actives dans le moteur, en contradiction avec le périmètre initial documenté à trois familles |
| Qualification entreprises | Appel à l'API Recherche d'Entreprises, normalisation, dédoublonnage, scoring indicatif et suggestions APE/NAF | Ne constitue pas une preuve de compétence, de capacité opérationnelle ou d'éligibilité |
| Publication d'une demande | PR #30 ajoute un formulaire de prévisualisation et des parcours d'intention | Aucun compte, enregistrement, transmission, modération effective ou publication n'est connecté |
| CRM | Page de présentation et périmètre fonctionnel | Aucun CRM persistant ni espace de travail opérationnel |
| Espace membre | Parcours de formulaire de démonstration | Aucun compte créé et aucune donnée transmise ou enregistrée |
| BrainOS actuel | Page de présentation d'un futur référentiel documentaire | Pas de corpus connecté, de RAG, de mémoire active, de chatbot relié au référentiel ou d'agent autonome |
| Réputation virtuelle | Le site contient encore une page Showroom/Salon virtuel | Pas de module de réputation, de recherche Google Maps ou d'analyse d'avis constaté |
| Traceur et rapports | Aucun système de collecte d'événements utilisateurs ou de rapports journaliers identifié dans les fichiers examinés | Aucun apprentissage sur les comportements ou conversations n'est opérationnel |

### 4.1 Recherche : écarts précis

Le catalogue partagé de la branche de référence expose huit catégories publiques actives, en plus de catégories prévues. Le moteur privé et les fonctions de classification BODACC comprennent cinq familles : créations, cessions, modifications, procédures collectives et radiations.

Or les documents fondateurs et les instructions de travail décrivent un périmètre BODACC initial de trois familles : créations, ventes/cessions et modifications. La PR #24 vise précisément à rétablir cette limite et à rejeter les procédures collectives et radiations, y compris si elles sont renvoyées par l'API. Cette PR n'est pas fusionnée dans `evolution-3.0`.

La documentation historique prévoit cinq catégories BOAMP, mais le code de la branche auditée en expose huit actives. La liste définitive doit être réexaminée avec le porteur du projet.

Le moteur utilise encore une notion de région dans le socle de la branche auditée. La PR #25 propose de remplacer le filtre géographique par un département, et la PR #26 ajoute une pagination bornée. Ces deux PR sont empilées sur la PR #24.

**Évolution à intégrer en 4.0 :** la catégorie Nettoyage a été demandée. Son rattachement (public, privé, ou les deux selon les sources et la nature du besoin), ses sous-catégories, sa nomenclature, ses sources, ses règles de filtrage et ses destinations restent à spécifier. Ne pas l'ajouter comme simple libellé sans traitement de bout en bout.

### 4.2 Qualification des entreprises

Le module de qualification interroge l'API publique Recherche d'Entreprises depuis le navigateur. Il utilise les codes APE/NAF, le département, le statut administratif et des identifiants SIREN/SIRET pour normaliser et dédoublonner les résultats.

Le score indicatif peut atteindre 100 pour une correspondance de code, de département et de statut actif. Le code précise qu'il s'agit d'un indice de rapprochement et non d'une preuve de capacité. Un module distinct rappelle les contrôles humains nécessaires : établissement local, qualifications, références, moyens humains et matériels, éligibilité et disponibilité.

Points à traiter en 4.0 :
- distinguer entreprise et établissement dans le parcours et les résultats ;
- documenter les critères de qualification et leur pondération ;
- éviter de présenter un score numérique comme une décision automatique ;
- conserver provenance, date, fraîcheur et limites de la source ;
- décider si les enrichissements doivent passer par un backend afin de maîtriser quotas, traçabilité et exposition des données.

## 5. Architecture et documentation

### 5.1 Points forts

La documentation 3.0 est structurée :
- Étape A : responsabilités fonctionnelles et frontières des modules ;
- Étape B : modèle conceptuel, propriété et cloisonnement ;
- Étape C : contrats API, échanges et événements ;
- audit comparatif des options techniques ;
- cahier des charges fonctionnel ;
- registre d'arbitrages et de sécurité.

Les principes de séparation CRM interne / espaces clients / BrainOS, de refus par défaut, de provenance, de finalité et de traçabilité sont de bons points de départ.

Le fichier `AGENTS.md` rappelle explicitement qu'une architecture cible documentaire ne doit jamais être présentée comme une implémentation réelle.

### 5.2 Points à reprendre

- La documentation active de la 3.0 et les nouveaux arbitrages du fondateur ne sont pas encore consolidés dans un référentiel unique 4.0.
- Le nom BrainOS dans le dépôt correspond à un référentiel documentaire envisagé ; le BrainIOS désormais discuté est un système beaucoup plus large.
- Les documents A/B/C sont des propositions. Les décisions A-01 à A-10, B-01 à B-10 et C-01 à C-10 ne doivent pas être présumées validées.
- Les catégories du moteur, les sources et les transferts CRM doivent être alignés sur les arbitrages les plus récents.
- Le vocabulaire de la branche n'est plus à jour : remplacer dans la cible 4.0 « Prospection active » par « Prosp'active » et « Salon virtuel / Showroom » par « Réputation virtuelle », sans effectuer ces renommages sur la 3.0 avant arbitrage.

## 6. PR ouvertes et état des branches

Au moment de la consultation, dix PR ouvertes en brouillon ont été relevées :

| PR | Sujet | Base / dépendance | État observé |
|---|---|---|---|
| #23 | Consolidation documentaire A/B/C, données, permissions, contrats API | `evolution-3.0` | Ouverte, draft, non fusionnée |
| #24 | Limitation du périmètre BODACC | `evolution-3.0` | Ouverte, draft, non fusionnée |
| #25 | Filtrage départemental | Empilée sur #24 | Ouverte, draft, non fusionnée |
| #26 | Pagination bornée des résultats | Empilée sur #25 | Ouverte, draft, non fusionnée |
| #29 | Moteur de recherche compact partagé | `evolution-3.0` | Ouverte, draft, non fusionnée |
| #30 | Parcours « Publier ma demande » | Empilée sur #29 | Ouverte, draft, non fusionnée |
| #31 | Nettoyage d'anciennes cartes Show Room | Empilée sur #30 | Ouverte, draft, non fusionnée |
| #32 | Manifeste central des fichiers publiés | `evolution-3.0` | Ouverte, draft, non fusionnée |
| #33 | Catalogue de l'immeuble externalisé | Empilée sur #32 | Ouverte, draft, non fusionnée |
| #34 | Navigation partagée | Empilée sur #33 | Ouverte, draft, non fusionnée |

Les trois chaînes #24–26, #29–31 et #32–34 sont distinctes. Elles ne doivent pas être fusionnées ou rebasées automatiquement pendant l'audit 4.0.

Le workflow de vérification du site associé à la tête de la PR #34 a été consulté : deux exécutions récentes sont en succès. Ce résultat est utile pour les contrôles automatisés de cette tête et de sa base empilée ; il ne vaut pas validation générale de toutes les PR indépendantes.

### 6.1 Point de vigilance CI

Le workflow `.github/workflows/verify-site.yml` se déclenche sur tous les pushes et pull requests. Il possède une concurrence qui annule les exécutions précédentes sur la même référence. L'historique Actions consulté montre une succession importante d'exécutions annulées très rapprochées sur la branche de la PR #34, avant deux succès.

Il faudra éviter les commits minuscules et les relances répétées : regrouper les modifications par lot cohérent, attendre les résultats, et limiter les déclenchements inutiles afin de réduire le bruit CI et les prévisualisations éventuelles.

## 7. Tests et qualité

### 7.1 Contrôles existants

Le dépôt comprend :
- tests unitaires de qualification et ciblage d'entreprises ;
- tests de suggestions APE/NAF ;
- smoke tests réels BOAMP et BODACC ;
- tests navigateur pour l'immeuble et le moteur de recherche ;
- script de build ;
- vérification de l'architecture, des pages, des liens locaux et des identifiants ;
- workflows GitHub Actions.

La CI de la PR #34 a deux exécutions récentes réussies au moment de l'audit.

### 7.2 Limites des preuves

- Les tests unitaires utilisent des réponses simulées pour les fonctions métier.
- Les smoke tests BOAMP/BODACC vérifient un accès et un échantillon de réponse, pas l'exhaustivité ni la qualité de toute la recherche.
- Les tests navigateur utilisent des fixtures et des routes interceptées pour une partie des scénarios.
- Les contrôles de liens et d'architecture ne remplacent pas une recette métier complète.
- Aucune mesure de fréquentation, de conversion ou d'expérience réelle n'a été relevée.

La feuille de route 4.0 devra maintenir des tests simulés rapides et des tests réels distincts, avec des résultats rapportés sans les confondre.

## 8. Sécurité, confidentialité et prérequis juridiques

### 8.1 Socle applicatif

Aucun backend, système d'identité, session, base de données ou autorisation côté serveur n'est présent dans la branche auditée. Le cloisonnement décrit dans les documents est donc une cible, pas une protection déjà active.

Avant d'ouvrir les espaces membres, CRM ou administration, il faudra construire et tester :
- authentification robuste et gestion de session ;
- autorisation côté serveur par ressource et action ;
- séparation stricte des données internes et des espaces clients ;
- contrôle d'accès administrateur et journalisation ;
- gestion des secrets et des clés de fournisseurs côté serveur ;
- sauvegardes, restauration, rétention et suppression ;
- tests négatifs prouvant les refus d'accès croisés.

### 8.2 Pages légales

Les pages `mentions-legales.html` et `politique-confidentialite.html` sont des gabarits indiquant que les informations de l'éditeur, de l'hébergeur, du responsable de traitement, des finalités, bases légales, destinataires et durées de conservation restent à compléter.

Elles ne sont pas des documents juridiques finalisés. Cela devient un blocage avant tout traitement réel de comptes, formulaires, traceurs, conversations ou données commerciales personnelles.

### 8.3 BrainIOS et données utilisateurs

L'analyse des conversations et des comportements devra prévoir, avant mise en service :
- information claire des utilisateurs sur les données collectées et les finalités ;
- minimisation et pseudonymisation lorsque possible ;
- exclusion des données sensibles et des secrets des analyses générales ;
- durées de conservation et mécanismes d'effacement ;
- accès strictement réservé à l'administrateur pour les rapports journaliers confidentiels ;
- séparation entre conversations brutes, signaux agrégés et recommandations ;
- règles d'escalade humaine et de correction des réponses ;
- traçabilité des accès et actions de BrainIOS.

Les messages ne doivent pas devenir automatiquement des données d'entraînement librement réutilisables. L'apprentissage envisagé doit d'abord être compris comme une amélioration contrôlée des connaissances, des instructions et des parcours, avec validation et tests.

## 9. Évolutions confirmées dans la vision 4.0

Ces éléments proviennent des décisions et orientations exprimées par le porteur du projet pendant la préparation de la 4.0. Ils constituent une vision de travail ; les détails techniques et certains arbitrages restent à établir.

### 9.1 Vocabulaire et expérience

- Nom du projet : MajestiOS.
- « Développement commercial » comme positionnement.
- « Prosp'active » comme nom de la rubrique de prospection.
- « Réputation virtuelle » en remplacement de « Salon virtuel » / « e-Réputation ».
- « Immeuble interactif » comme représentation de l'arborescence fonctionnelle : le schéma doit refléter l'arborescence.
- Les slogans doivent être affichés sur les pages réelles de destination des étages, pas dans une popup ni comme simple ancre sur la page d'accueil.
- Le moteur de recherche reste une capacité transversale commune.

### 9.2 Nettoyage dans le moteur

Ajouter Nettoyage au moteur avec une vraie définition fonctionnelle : type de marché, catégories, nomenclature, filtres, sources, règles de recherche, résultats et pages de destination. Le rattachement public/privé reste à arbitrer.

### 9.3 Visibilité et réputation locale

À la création ou à la détection d'une entreprise, possibilité de rechercher sa présence Google Maps à partir de l'activité et de l'adresse, vérifier la correspondance de la fiche, puis examiner les avis et la visibilité. Si la présence est absente ou insuffisante, MajestiOS pourrait proposer un accompagnement en visibilité, réputation et présence web.

Le rapprochement doit gérer les homonymes, les adresses incomplètes et les établissements multiples. L'accès aux données et aux avis doit respecter les interfaces, licences, quotas et conditions applicables de Google ; ne pas concevoir de scraping non autorisé.

### 9.4 BrainIOS : deux surfaces, un cadre de confiance

**Côté utilisateur :** assistant contextuel qui comprend la rubrique consultée et les étapes utiles du parcours, répond aux questions et propose une action pertinente sans imposer la navigation.

**Côté administration :** menu BrainIOS avec assistant, surveillance, rapports journaliers confidentiels, recommandations, atelier de développement, laboratoire de tests et mémoire documentaire du projet.

BrainIOS doit pouvoir analyser la documentation et le code, identifier des anomalies, proposer des corrections, préparer des changements GitHub et exécuter des tests dans un environnement contrôlé. L'administrateur conserve l'autorité sur les changements sensibles, les fusions et les mises en production.

### 9.5 Observation et amélioration continue

Événements utiles envisagés : navigation significative, recherche, consultation d'une opportunité ou d'une entreprise, début/abandon de parcours, formulaire, demande d'accompagnement, erreurs et interventions BrainIOS.

Les rapports journaliers sont confidentiels et réservés à l'administrateur. BrainIOS peut croiser les tendances agrégées, les difficultés et les retours exprimés dans les conversations pour proposer des améliorations. La collecte doit être sélective, transparente et minimisée, pas un enregistrement indiscriminé de chaque clic ou de toutes les conversations.

## 10. Risques majeurs et mesures

| Risque | Niveau initial | Mesure requise |
|---|---|---|
| Prendre le prototype pour une plateforme opérationnelle | Élevé | Marquer les états réels et bloquer toute communication trompeuse |
| Partir de `main` qui ne reflète pas la 3.0 | Élevé | Choisir le commit de base après comparaison explicite |
| PR empilées et travaux redondants | Élevé | Cartographier les dépendances, ne rien fusionner sans décision |
| Contradiction code / périmètre BODACC | Élevé | Arbitrer et appliquer une taxonomie de référence testée |
| Backend et cloisonnement absents | Critique avant données réelles | Construire identité, autorisations et persistance avant ouverture |
| Collecte de conversations et trace comportementale | Critique avant activation | Analyse d'impact, information, minimisation, rétention, accès |
| Google Maps et avis | Élevé | Vérifier API, conditions, coûts, correspondance et quotas |
| Scores de qualification surinterprétés | Élevé | Explicabilité, limites, validation humaine et critères documentés |
| CI bruyante | Moyen | Regrouper les changements et limiter les déclenchements |
| Documentation ancienne ou divergente | Élevé | Référentiel 4.0 avec statut et historique des décisions |

## 11. Décisions à obtenir avant architecture détaillée

1. Quelle branche/quel commit sera la base de construction 4.0 ?
2. Quel statut final donner à chacune des dix PR ouvertes : conserver, intégrer dans la base, réimplémenter, abandonner ou archiver ?
3. Quelles catégories publiques BOAMP retenir définitivement ?
4. Nettoyage doit-il être disponible dans les marchés publics, privés ou les deux ?
5. Quelles sources et quels critères définissent la Réputation virtuelle ?
6. Quelles actions BrainIOS peut-il effectuer seul en environnement de développement, et lesquelles exigent une validation ?
7. Quelles données des conversations peuvent être analysées, sous quelles finalités et durées ?
8. Quel socle backend/authentification/base est retenu après contre-audit ?
9. Quelle politique de collecte d'événements et de rapports administrateur adopter ?
10. Quel modèle de coûts et de quotas est acceptable pour les services externes et l'IA ?

## 12. Recommandation de sortie d'audit

Ne pas démarrer les développements fonctionnels 4.0 avant :
- l'arbitrage de la base Git et des PR empilées ;
- la validation de l'architecture cible et des frontières de confiance ;
- le cadrage de la gouvernance des données et de BrainIOS ;
- la définition de critères d'acceptation testables pour chaque nouveau domaine.

Le prototype 3.0 est un actif à préserver. La 4.0 doit être construite comme une évolution structurée de cet actif, et non comme une réécriture précipitée ni comme une simple accumulation de fonctionnalités.
