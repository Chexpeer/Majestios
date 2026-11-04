# Audit initial V5 — patrimoine, modularisation et plan de nettoyage

**Date :** 4 novembre 2026  
**Branche examinée :** `evolution-5.0`  
**Référence V3 :** `evolution-3.0` — commit de référence `05f2435af0d926b3ed24471065cf9d43b7adab88`  
**Référence V4 :** `docs/audit-vision-roadmap-4.0-2026-11-04`  
**Nature :** audit documentaire et lecture ciblée du dépôt GitHub ; ce document ne vaut pas recette locale, audit de sécurité exhaustif ou validation de production.

## 1. Résumé exécutif

La V5 est correctement isolée sur sa branche et conserve la base V3. La comparaison GitHub indique que V5 est en avance de 33 commits sur V3, sans retard, mais les changements observés portent principalement sur la documentation V5, le renommage de la page BrainIOS en MajestiOS V.5, le retrait de la page 100blages et quelques références associées. **La V5 n'a pas encore intégré les chantiers de modularisation des PR #32 à #34.**

Le patrimoine V3 est plus avancé que ne le suggère une simple lecture de ses pages : il contient une architecture cible API détaillée, les étapes A/B/C, des tests, des contrôles de cohérence et des parcours de recherche. Toutefois, les documents A/B/C sont des propositions non implémentées et la V4 rappelle que le prototype n'est pas un SaaS : backend métier, persistance, authentification et autorisations serveur ne sont pas établis comme opérationnels.

La recommandation est de **ne pas réécrire le site**. Il faut préserver le socle, reprendre les bonnes idées de modularisation après examen, nettoyer les incohérences documentaires, puis traiter le code par lots courts et vérifiables.

## 2. État des branches et du patrimoine

| Élément | Constat vérifié | Conséquence |
|---|---|---|
| `evolution-3.0` | Base de référence conservée ; commit identifié dans l'audit V4 | Ne pas modifier ; point de retour |
| `evolution-4.0` documentaire | Vision, roadmap, audit et mission de contre-audit présents | Source d'analyse, pas une base de code à fusionner |
| `evolution-5.0` | Branche créée depuis V3 ; 33 commits d'avance sur V3 au moment de la comparaison | Branche de travail active |
| PR #23 | Ouverte, non fusionnée ; consolidation A/B/C et compléments de propriété, permissions, modèle logique et contrats | Documentation utile à intégrer après revue |
| PR #32 | Ouverte, non fusionnée ; manifeste central `site-files.json` et build fondé sur ce manifeste | Candidat fort pour modulariser le build |
| PR #33 | Ouverte, non fusionnée ; catalogue de l'immeuble externalisé dans `building-catalogue.js` | Bonne séparation éditoriale, mais contenu à réviser |
| PR #34 | Ouverte, non fusionnée ; navigation partagée `site-navigation.js` et adaptations de pages | À examiner page par page avant adoption |

Les PR #29 à #31 concernent d'autres lots de recherche, publication et nettoyage du showroom. Elles ne sont pas réputées intégrées à V5.

## 3. Acquis à préserver

### 3.1 Architecture métier et données

Les documents V3 A/B/C posent des bases pertinentes :
- responsabilités métier distinctes et contrats explicites entre modules ;
- séparation du CRM interne MajestiOS, des données propres à chaque client et du corpus documentaire ;
- distinction entreprise / établissement / contact ;
- séparation signal source / opportunité / rapprochement / action commerciale / interaction réelle ;
- provenance, fraîcheur, statut de vérification et historique ;
- contrôles de finalité avant transfert entre collecte, veille, CRM, publication et prospection ;
- permissions côté serveur, refus par défaut, moindre privilège et tests négatifs inter-tenant ;
- événements idempotents, reprises, corrélation et audit ;
- migration progressive, sans imposer prématurément des microservices.

Ces principes doivent être repris dans l'architecture V5, en remplaçant le vocabulaire historique BrainOS par MajestiOS V.5 dans les documents actifs, sans réécrire les archives historiques.

### 3.2 Acquis du prototype

L'arbre V5 conserve notamment :
- pages HTML métier et pages de résultats ;
- moteur de recherche et modules de recherche par rubrique ;
- intégrations navigateur BOAMP / BODACC et qualification indicative des entreprises ;
- catalogue éditorial existant et ressources visuelles ;
- tests unitaires et tests navigateur ;
- scripts `verify-site.js` et `verify-architecture.js` ;
- build statique et configuration Vercel.

Leur présence dans le dépôt ne prouve pas à elle seule leur fonctionnement en production. Les appels externes, les limites des sources et les parcours complets doivent être retestés.

## 4. Constats et écarts prioritaires

### A. V5 n'a pas encore repris les PR de modularisation

La branche V5 contient encore un tableau de fichiers codé directement dans `build.js`. Le manifeste `site-files.json` proposé par la PR #32 n'est pas présent dans l'arbre V5. Le catalogue d'étages reste embarqué dans `index.html` et la navigation partagée proposée par la PR #34 n'est pas intégrée.

**Recommandation :** reprendre les principes des PR #32 à #34 dans un lot V5 dédié, sans fusionner aveuglément les branches empilées.

### B. Le catalogue d'étages de la PR #33 n'est pas validable en l'état

La proposition externalise utilement les données éditoriales, mais elle contient encore des références historiques à BrainOS, des intitulés à réexaminer et des destinations/folders qui doivent être comparés à l'arborescence réelle. Le comportement de sélection repose sur une boîte de dialogue et doit être confronté à la préférence exprimée pour une navigation directe vers le dossier ou la page de destination, sans popup intermédiaire.

**Recommandation :** reprendre le principe de catalogue unique, mais reconstruire ses données après arbitrage des destinations V5. Ne pas reprendre les intitulés ou comportements tels quels.

### C. La page d'accueil est encore une page statique, pas le panorama 3D/spatial demandé

Le code actuel ne démontre pas la capacité de faire le tour de l'immeuble ni d'accéder à la toiture. La cible fondatrice nouvellement documentée exige :
- panorama haute qualité occupant environ 70 % de l'espace visuel desktop ;
- exploration de plusieurs façades / tour du bâtiment ;
- accès visuel à la toiture ;
- ascenseur extérieur interactif ;
- expérience responsive, accessible et optimisée.

**Recommandation :** isoler l'expérience immersive dans un prototype visuel dédié, sans toucher aux moteurs métier ni remplacer l'accueil existant avant validation.

### D. Dette documentaire de format

Trois documents V5 contenaient des séquences littérales `\\n` qui empêchaient un rendu Markdown propre : README, architecture fonctionnelle et roadmap.

**Correction réalisée :** remplacement de ces séquences par de véritables retours à la ligne sur la branche V5. Aucun code applicatif n'a été modifié par cette correction.

### E. Statut des capacités à clarifier

Le cadrage V5 décrit de nombreuses capacités cibles (CRM natif, mémoire, IA transversale, BI, SEO, Réputation virtuelle, administration). Elles ne doivent pas être présentées comme opérationnelles sans preuve de code, d'intégration et de test.

**Recommandation :** maintenir un registre unique avec les statuts : idée, proposition, spécifié, prototype, intégré, testé, opérationnel. Ajouter une preuve et une date à tout passage de statut.

## 5. Analyse des PR de modularisation

| PR | Apport intéressant | Risque / vérification avant reprise | Décision proposée |
|---|---|---|---|
| #32 | Manifeste central, build piloté par configuration, contrôles de chemins et ressources | Vérifier inclusion de toutes les ressources V5, chemins, exclusion des documents, suppression/recréation de `dist` et gestion d'échec de copie | Reprendre le principe dans un lot isolé |
| #33 | Catalogue de l'immeuble séparé du HTML | Nomenclature ancienne, BrainOS résiduel, routes et dossiers à vérifier, dialogue intermédiaire à arbitrer | Réutiliser le modèle de données après refonte V5 |
| #34 | Gestionnaire de navigation commun, fermeture Escape et état ARIA | Vérifier que toutes les pages ont le même DOM, les styles, les scripts, l'ordre de chargement et les comportements mobile | Réutiliser seulement après tests multi-pages |

Les PR restent ouvertes et non fusionnées. Leur code n'est pas réputé validé ni intégré.

## 6. Architecture modulaire recommandée pour V5

**Choix de départ recommandé : monolithe modulaire**, avec séparation stricte des responsabilités dans le code et une API versionnée lorsque le backend sera construit. Aucun besoin démontré ne justifie aujourd'hui une architecture microservices distribuée.

Découpage logique proposé :

1. **Socle web** : manifeste de publication, routes, navigation, design system, accessibilité et instrumentation.
2. **Expérience immersive** : panorama, scènes/façades, toiture, ascenseur, destinations et vues intérieures.
3. **Recherche** : interface commune, taxonomie, filtres, adaptateurs de sources, normalisation et résultats.
4. **Développement commercial** : qualification, identification, Prosp'active, accompagnement AO et suivi.
5. **Référentiel CRM** : entreprises, établissements, contacts, opportunités, activités et historique.
6. **Réputation virtuelle et SEO** : identité locale, visibilité, avis, audit SEO et recommandations, avec frontières de données propres.
7. **CRM clients et intégrations** : connecteurs de CRM tiers et espaces cloisonnés par client/mandat.
8. **MajestiOS V.5 — intelligence transversale** : orchestration, assistants, mémoire, connaissances et préparation d'actions.
9. **Business Intelligence** : indicateurs reproductibles, analyses et aide à la décision.
10. **Administration et gouvernance** : comptes, permissions, audit, coûts, qualité, supervision et approbations.

Les modules partagent des contrats explicites ; aucun module ne lit ou ne modifie directement les données privées d'un autre domaine. L'extraction future d'un service indépendant ne sera envisagée qu'en présence d'un besoin mesuré.

## 7. Avancement opérationnel au 4 novembre 2026

### Lot 1A — Manifeste central des ressources : réalisé et contrôlé

La V5 dispose désormais d'un fichier `site-files.json` (version 1) qui centralise les 51 pages et ressources actuellement publiées. `build.js` lit ce manifeste, contrôle les chemins, les doublons, les fichiers sources et les fichiers Markdown, puis vérifie l'intégrité des copies dans `dist/`. Les contrôles `verify-architecture.js` et `verify-site.js` lisent le même manifeste : il n'existe donc plus trois listes indépendantes à synchroniser.

**Validation GitHub Actions : réussie** sur le commit `f7d4c924f887e3c418284fcf3ce83dc8f7174685`. Les étapes exécutées avec succès comprennent syntaxe JavaScript, tests ciblage/qualification/APE-NAF, build, architecture, liens locaux/identifiants, tests navigateur Playwright de l'immeuble et du moteur de recherche, ainsi que les smoke tests BOAMP et BODACC. Cette réussite valide les contrôles automatisés de ce workflow sur ce commit ; elle ne vaut pas recette complète de tous les parcours métier ni validation de production.

### Point de vigilance découvert — catalogue des étages

Le code actuel contient dix entrées de catalogue, mais ne génère que neuf zones cliquables sur la photo. La correspondance des zones saute l'entrée CRM (B09) et affiche l'entrée Business Intelligence (B10) sous un libellé combiné « IA & Business Intelligence ». La séparation CRM / Business Intelligence et leur emplacement exact doivent être arbitrés avant d'externaliser le catalogue. La PR #33 ne sera donc pas reprise telle quelle : elle introduit notamment des dossiers non présents et un dialogue intermédiaire qui ne correspond pas au parcours direct attendu.

### Lot 0 — Sécuriser et inventorier
- conserver V3 et V4 intactes ;
- fixer le commit de référence V5 ;
- inventorier routes, pages, scripts, styles, images, tests et workflows ;
- relever les doublons et liens morts sans supprimer ;
- exécuter build et contrôles sur un environnement isolé dès que le dépôt est disponible localement.

**Sortie :** inventaire complet avec preuve et classement conserver / adapter / fusionner / archiver / supprimer après validation.

### Lot 1 — Modularisation sans changement métier
- introduire un manifeste unique des ressources publiées ;
- externaliser le catalogue des destinations dans un fichier unique ;
- définir un schéma stable pour chaque destination : identifiant, libellé, dossier, route, ordre, état et accessibilité ;
- mutualiser la navigation seulement si la compatibilité multi-pages est démontrée ;
- corriger les tests d'architecture en conséquence.

**Sortie :** même comportement métier, structure plus facile à maintenir, tests de correspondance destinations → routes.

### Lot 2 — Nettoyage et optimisation du site
- harmoniser les chargements CSS/JS ;
- réduire les styles et scripts inline répétés ;
- contrôler poids et dimensions des images ;
- éliminer les ressources orphelines uniquement après preuve ;
- vérifier liens, formulaires, métadonnées SEO, responsive et accessibilité.

**Sortie :** rapport avant/après et absence de régression démontrée.

### Lot 3 — Panorama interactif V5
- comparer scène 2D/SVG, panorama multi-vues et 3D légère ;
- réaliser un prototype isolé permettant de tourner autour du bâtiment et de voir la toiture ;
- conserver l'ascenseur comme interface de destination ;
- respecter la cible de 70 % de l'accueil desktop ;
- valider performances, mobile et accessibilité avant intégration.

**Sortie :** prototype exploratoire validé, sans régression des pages métier.

### Lot 4 — Implantation progressive
- intégrer les modules métier dans l'ordre des dépendances ;
- commencer par le socle de recherche et les routes/destinations ;
- ensuite seulement construire identité, API, persistance et permissions avant toute donnée sensible ;
- poursuivre CRM, IA, mémoire, BI, SEO et Réputation virtuelle selon les critères de sortie.

## 8. Garde-fous de modification

- Pas de suppression de page ou de ressource sur la seule base d'une absence de lien apparent.
- Pas de réécriture globale.
- Pas de changement des règles métier pendant un lot de modularisation pure.
- Pas de fusion des PR #32 à #34 sans comparaison de leurs diffs avec V5.
- Pas de migration de données ni de changement de permissions sans modèle et tests dédiés.
- Pas d'envoi externe, d'action commerciale, de merge ou de déploiement production sans autorisation explicite.
- Toute modification doit préciser les fichiers changés, les tests exécutés, les résultats, les limites et le retour arrière.

## 9. Limites de cet audit

Cet audit s'appuie sur les arbres et fichiers GitHub consultés, la comparaison V3/V5 et les métadonnées/diffs des PR ciblées. Il ne constitue pas :
- une exécution locale du build ou des tests ;
- une recette manuelle du site dans un navigateur ;
- une mesure de performance réelle ;
- une analyse de sécurité dynamique ;
- une vérification en direct de toutes les API externes ;
- une revue exhaustive de chaque ligne de tous les fichiers du dépôt.

Ces contrôles doivent être réalisés dans les lots suivants avant toute conclusion de qualité ou de préparation à la production.

## 10. Décision de pilotage proposée

Poursuivre sur `evolution-5.0` en gardant V3 comme référence intacte et V4 comme corpus historique. Le prochain changement de code doit être le **Lot 1 — modularisation sans changement métier**, en reprenant avec prudence les apports des PR #32 à #34. Le panorama 70 % / tour complet / toiture sera traité dans un prototype isolé et ne doit pas être confondu avec le nettoyage technique du site actuel.


## 10. Addendum — évolution du dépôt au 4 novembre 2026 (après l’audit initial)

Cet addendum complète les constats historiques ci-dessus ; il ne réécrit pas rétroactivement l’état observé au début de l’audit.

### État des ressources visuelles — vérification du 4 novembre 2026

L'état du dépôt a évolué depuis l'audit initial. Il contient actuellement cinq ressources WebP : `Ambisios.webp` (panorama d'accueil), `Développement-.webp`, `Marché-Public-.webp`, `Prospection-.webp` et `Marcheprive.webp` (fonds de rubriques). Les cinq sont déclarées dans `site-files.json`. Les affirmations antérieures de suppression de toutes les images sauf Ambisios sont donc historiques et ne décrivent plus l'état courant.

### Architecture de navigation

La référence spatiale est limitée à huit destinations visibles : Espace privé, Réseau, Développement commercial, Prospection, Marchés publics, Marchés privés, Réputation virtuelle et Accueil. Recherche, CRM, Business Intelligence, administration, mémoire, orchestration et MajestiOS V.5 sont transversaux et ne doivent pas être représentés comme des étages supplémentaires.

### État des preuves

Les ressources et leurs références sont présentes dans GitHub. La validation du build, des tests et de l'expérience interactive doit être établie par les résultats CI du commit courant. La vérification des zones interactives, des routes, du déplacement de l'ascenseur et de l'éclairage reste à effectuer.
