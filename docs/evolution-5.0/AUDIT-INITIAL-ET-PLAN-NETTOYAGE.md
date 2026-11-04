# Audit initial V5 — patrimoine, modularisation et plan de nettoyage

**Date :** 4 novembre 2026  
**Branche examinée :** `evolution-5.0`  
**Référence V3 :** `evolution-3.0` — commit de référence `05f2435af0d926b3ed24471065cf9d43b7adab88`  
**Référence V4 :** `docs/audit-vision-roadmap-4.0-2026-11-04`  
**Nature :** audit documentaire et lecture ciblée du dépôt GitHub ; ce document ne vaut pas recette locale, audit de sécurité exhaustif ou validation de production.

## 1. Résumé exécutif

La V5 est correctement isolée sur sa branche et conserve la base V3. La comparaison GitHub indique que V5 est en avance de 33 commits sur V3, sans retard, mais les changements observés portent principalement sur la documentation V5, le renommage de la page BrainIOS en MajestiOS V.5, le retrait de la page 100blages et quelques références associées. **Au moment de ce premier relevé, les principes des PR #32 à #34 n'étaient pas encore repris. État actualisé : V5 a depuis adopté le manifeste central et le build piloté par configuration de la PR #32 ; les PR #33 et #34 restent à examiner et ne sont pas réputées intégrées.**

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

### A. Modularisation : manifeste repris, catalogue et navigation à instruire

**État vérifié sur V5 :** `site-files.json` est présent, `build.js` le lit et publie les 51 ressources déclarées. Le principe de la PR #32 est donc déjà repris dans la branche V5, même si la PR #32 reste ouverte et non fusionnée. Le contrôle compare la présence des 32 pages HTML dans le manifeste et ne relève aucune page HTML oubliée.

Le catalogue des huit destinations reste embarqué dans `index.html` ; le fichier `building-catalogue.js` proposé par la PR #33 n'est pas présent. La navigation commune proposée par la PR #34 (`site-navigation.js`) n'est pas présente non plus.

**Recommandation :** ne pas reprendre ni fusionner la PR #32 à l'aveugle : comparer son contenu avec le manifeste déjà actif. Examiner les PR #33 et #34 comme propositions, puis décider si un catalogue de destinations et un module de navigation partagés apportent une valeur nette à la nouvelle architecture.

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
| #32 | Manifeste central, build piloté par configuration, contrôles de chemins et ressources | Le principe est déjà implémenté sur V5 via `site-files.json` et `build.js` ; comparer les différences avec la PR avant toute reprise | Ne pas fusionner la PR sans comparaison ; conserver le manifeste V5 comme référence active |
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

L'état du dépôt a évolué depuis l'audit initial. Il contient actuellement cinq ressources WebP : `Ambitios.webp` (panorama d'accueil), `Développement-.webp`, `Marché-Public-.webp`, `Prospection-.webp` et `Marcheprive.webp` (fonds de rubriques). Les cinq sont déclarées dans `site-files.json`. Les affirmations antérieures de suppression de toutes les images sauf Ambitios sont donc historiques et ne décrivent plus l'état courant.

### Architecture de navigation

La référence spatiale est limitée à huit destinations visibles : Espace privé, Réseau, Développement commercial, Prospection, Marchés publics, Marchés privés, Réputation virtuelle et Accueil. Recherche, CRM, Business Intelligence, administration, mémoire, orchestration et MajestiOS V.5 sont transversaux et ne doivent pas être représentés comme des étages supplémentaires.

### État des preuves

Les ressources et leurs références sont présentes dans GitHub. La validation du build, des tests et de l'expérience interactive doit être établie par les résultats CI du commit courant. La vérification des zones interactives, des routes, du déplacement de l'ascenseur et de l'éclairage reste à effectuer.


## Addendum de rectification — état documentaire et patrimoine visuel (4 novembre 2026, 17 h UTC)

Cet addendum prévaut sur les passages antérieurs de ce document lorsqu'ils décrivent un état de branche ou des décisions désormais dépassés. Les constats historiques restent conservés pour leur traçabilité.

### Rectifications factuelles

- La branche V5 contient un manifeste `site-files.json`. L'affirmation antérieure selon laquelle ce manifeste était absent est historique et ne décrit plus l'état actuel.
- Le dépôt V5 contient cinq WebP : `Ambitios.webp`, `Développement-.webp`, `Marché-Public-.webp`, `Prospection-.webp` et `Marcheprive.webp`. Les quatre derniers sont des fonds de rubriques. L'ancien addendum affirmant qu'un seul WebP subsistait est erroné et remplacé par cet inventaire.
- Le README V5 et l'arborescence doivent mentionner les quatre fonds. La présence dans Git et dans le manifeste ne suffit pas à certifier le rendu ou l'affectation CSS.
- Le rôle de BrainIOS n'est pas définitivement arbitré. Le fondateur souhaite exposer ses idées avant de définir son périmètre et son articulation avec MajestiOS V.5 ; aucune suppression documentaire ou décision d'architecture ne doit anticiper cet échange.
- La vision immersive ne se limite pas à des zones SVG posées sur une image : elle comprend le quartier d'affaires, une expérience explorable, l'immeuble, les espaces intérieurs et l'ascenseur. Le prototype actuel ne doit pas être déclaré conforme avant démonstration de ces parcours.

### Nettoyage documentaire déjà appliqué dans cette reprise

- L'index `docs/README.md` présente la V5 comme référentiel actif et conserve les références V2/V3.
- Le README V5 a été réécrit pour distinguer vision stratégique, patrimoine, état réel des ressources et points à ne pas figer.
- L'arborescence V5 a été corrigée pour inventorier les cinq images, préserver les parcours métier non visibles comme étages et exiger la validation des zones et de l'ascenseur.
- La vision fondatrice conserve l'ouverture de l'arbitrage BrainIOS / MajestiOS V.5.
- Le document de nettoyage distingue désormais clairement les capacités à préserver des éléments éventuellement supprimables.

### Ce qui n'est pas encore validé

Aucun retrait de page, script, style, image ou fonction métier n'est autorisé sur la seule base de cet addendum. Restent à réaliser : inventaire exhaustif des références croisées, cartographie des pages et routes, détection des scripts/styles orphelins, contrôle complet des liens, exécution des tests et vérification visuelle desktop/mobile. Les coordonnées des zones interactives et le comportement de l'ascenseur ne sont pas certifiés ici. Aucun merge ni déploiement de production n'a été effectué.


---

## 10. Actualisation de l'audit — 4 novembre 2026, contrôle du dépôt V5

**Branche contrôlée :** `evolution-5.0`  
**État du code après correction du défaut de recherche :** commit `bf1642be3264410c7b59301037ffb5d18b83a7a5`  
**Périmètre :** arborescence Git complète, référentiel V5, accueil, moteur de recherche, manifeste, scripts de vérification et dernier workflow observé.

### 10.1 Identité de la plateforme

La règle est désormais sans ambiguïté : **BrainIOS est l'ancien nom de MajestiOS V.5 ; il s'agit d'une seule et même plateforme.** Les capacités utiles de l'ancien corpus BrainIOS doivent être intégrées sous le nom MajestiOS V.5. Le document de nettoyage qui laissait ce sujet ouvert a été corrigé.

### 10.2 Ressource de façade : divergence de nom à résoudre

Le dépôt contenait initialement `Ambisios.webp`, alors que le nom confirmé par le fondateur est `Ambitios.webp`. Le fichier a été renommé en conservant exactement ses octets ; les références actives dans l'accueil, le manifeste, les contrôles et les documents V5 sont alignées sur `Ambitios.webp`. L'identité visuelle du binaire doit encore être comparée au visuel source fourni par le fondateur avant de valider définitivement les coordonnées des zones.

### 10.3 État réel de l'expérience visuelle

L'accueil affiche une image WebP statique et superpose huit liens SVG natifs. Cela constitue une navigation par hotspots, pas encore le quartier d'affaires explorable décrit dans l'expérience cible. Ne sont pas démontrés par le code observé :
- rotation ou exploration de plusieurs façades ;
- exploration de la toiture ;
- ascenseur extérieur animé reliant les étages ;
- déplacement spatial cohérent avec l'arborescence ;
- expérience immersive complète responsive.

Les anciennes règles CSS de tour construite en CSS coexistent avec des règles ultérieures dédiées à la photo et aux hotspots. Cette superposition de styles doit être rationalisée après vérification du rendu, sans casser les zones de clic. Le test navigateur actuel ne valide que l'image, les huit zones et les routes.

### 10.4 Défaut JavaScript détecté et corrigé

Le test navigateur du workflow `41874890785` a échoué à l'étape de sélection d'une catégorie : `#feed-sector` restait désactivé. L'analyse de `app.js` a identifié une référence à `initialParams` alors que la variable déclarée est `initialSearchParams`. Cette erreur interrompait l'exécution du script avant l'enregistrement des gestionnaires de changement du type de marché.

**Correction appliquée :** remplacement de la référence erronée par `initialSearchParams` dans `app.js`, commit `bf1642be3264410c7b59301037ffb5d18b83a7a5`. Le résultat du nouveau workflow doit être consulté avant de considérer le correctif validé.

### 10.5 État de la recherche et des sources

Le catalogue distingue les catégories publiques des familles privées. Les cinq familles BODACC présentes dans le catalogue sont actives ; immobilier, emploi et sous-traitance restent explicitement planifiés et désactivés. Les tests d'intégration du workflow précédent ont confirmé l'accessibilité des API BOAMP et BODACC sur un échantillon, mais ne démontrent ni exhaustivité, ni fraîcheur garantie, ni pertinence métier de toutes les catégories.

Le parcours de recherche reste à tester de bout en bout pour chaque type, catégorie et département, y compris les catégories sans page dédiée, les paramètres URL, les erreurs de source et les résultats plafonnés à dix.

### 10.6 Priorités de l'audit complet

1. Réconcilier le nom et l'identité du fichier de façade avec `Ambitios.webp` et mettre à jour toutes les références ensemble.
2. Construire la matrice complète panorama → destination → dossier → sous-dossier → page → fonction et vérifier chaque lien.
3. Distinguer le prototype d'image cliquable de la future expérience immersive avec quartier, façades, toiture et ascenseur.
4. Auditer tous les parcours de recherche, catégories privées/publics, sources, paramètres et états d'erreur.
5. Cartographier les dépendances de chaque page, script, style, image, manifeste, test et workflow avant tout retrait.
6. Confronter les capacités futures — CRM, Business Intelligence, MajestiOS V.5, mémoire, administration IA, SEO continu, réputation virtuelle, réseau et accompagnement AO — aux preuves du code et à la roadmap.
7. Contrôler sécurité, confidentialité, formulaires, persistance, authentification et cloisonnement ; ne pas assimiler le prototype statique à un SaaS opérationnel.

**Limite :** cette actualisation est une lecture distante du dépôt et des traces GitHub Actions. Elle ne constitue pas une recette visuelle manuelle sur tous les appareils, un audit juridique, un audit de sécurité exhaustif ni une validation de production.


### 10.7 Nettoyage et cohérence des parcours — actualisation

- Le fichier de façade a été renommé `Ambisios.webp` → `Ambitios.webp` en conservant le même SHA de contenu Git : le binaire n'a pas été modifié. Les références de l'accueil, du manifeste, des tests et des documents V5 ont été alignées.
- `shared-search.css` a été retiré après vérification des 32 pages HTML et des feuilles de style/scripts actifs : aucun lien ni import ne le référençait. Les styles utiles du moteur restent dans la feuille globale.
- La page Développement commercial contenait un ancien formulaire de recherche statique, un filtre régional obsolète et une seconde recherche générée par `rubric-search.js`. Le formulaire statique et son style inline doublon ont été retirés ; la page s'appuie maintenant sur le moteur par rubrique.
- Le moteur par rubrique a été ajouté à Réputation virtuelle, Espace privé, Salons et séminaires, CRM et MajestiOS V.5. Le contrôle statique et le test navigateur couvrent désormais ces destinations supplémentaires.
- `category-results.js` affichait encore une localisation régionale alors que le catalogue ne propose plus de régions. Il restitue maintenant le département sélectionné, avec un test dédié.
- La page Salons et séminaires est explicitement rattachée au Réseau ; les anciens intitulés « Salon virtuel » et « zone artisanale » ont été retirés de cette page et des liens de navigation contrôlés.
- La FAQ a été corrigée : BOAMP et BODACC sont interrogés à la demande dans le prototype ; il ne s'agit pas d'une veille continue. Elle distingue aussi le panorama cliquable actuel de l'expérience immersive future.

### 10.8 Contrôle CI après corrections

Le workflow complet précédent a validé la syntaxe, les tests unitaires métier, le build, les routes, les ressources locales, les API BOAMP/BODACC et le test navigateur des huit destinations de l'immeuble. Le test de recherche avait ensuite échoué sur une assertion qui attendait un seul résultat BOAMP alors que les données simulées contenaient deux annonces valides ; l'assertion a été corrigée et des tests de restitution du département et de présence du moteur sur les destinations supplémentaires ont été ajoutés.

**Le workflow couvrant l'ensemble de ces dernières corrections est encore en attente d'exécution sur GitHub Actions.** Aucun succès final n'est déclaré tant que ce workflow n'a pas terminé.


### 10.9 Espaces privés, formulaires et capture de contact

- Les huit destinations principales de l'immeuble disposent désormais du moteur de recherche transversal : accueil, espace privé, réseau, développement commercial, prospection, marchés publics, marchés privés et réputation virtuelle. Le moteur par rubrique est configuré sur 16 pages métier/modules et le contrôle statique vérifie ces 16 pages.
- Le moteur a aussi été ajouté aux pages CRM interne, MajestiOS V.5 et Salons et séminaires. Les tests navigateur vérifient la présence du formulaire et du filtre département sur ces destinations.
- La page CRM précise maintenant qu'il s'agit du **CRM interne MajestiOS**, distinct de l'offre commerciale d'accompagnement/intégration de CRM tiers et des CRM/données appartenant aux clients.
- La page « Nous rejoindre » ne contient pas encore de formulaire ni de dépôt de CV. Elle indique désormais que le dépôt sécurisé de CV reste à développer et qu'aucun CV n'est collecté actuellement.
- L'accueil ne comporte pas encore l'assistant conversationnel qui oriente vers un formulaire de contact. Le formulaire de contact réel, le parcours de candidature, le dépôt sécurisé de CV et la création effective d'espace membre sont inscrits dans la phase 4 de la roadmap ; les formulaires actuellement présents restent des prévisualisations sans transmission ni persistance.

## Contrôle transversal — moteur de recherche

Point de vigilance confirmé pendant l’audit : les premières pages de rubrique proposaient un formulaire différent de celui de l’accueil (champs visibles simultanément, identifiants et logique séparés). Cette divergence est corrigée dans la branche evolution-5.0 : le script de rubrique injecte désormais la même structure de formulaire que l’accueil, puis app.js applique les interactions communes et le catalogue unique. Les styles du formulaire de rubrique reprennent la composition, la palette et les états du panneau d’accueil.

La suite de la recette doit confirmer le même parcours sur toutes les destinations : mot-clé → type public/privé → catégorie correspondante → département → résultats. Aucun type ne doit être préselectionné ou verrouillé par une rubrique. Les tests navigateur doivent contrôler les identifiants communs, l’affichage progressif, la séparation BOAMP/BODACC et les valeurs restaurées au retour des résultats.
