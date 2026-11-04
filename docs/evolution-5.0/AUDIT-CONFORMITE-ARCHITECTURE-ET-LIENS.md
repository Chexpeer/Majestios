# Audit de conformité de l'architecture et des liens — MajestiOS V.5

**Date :** 4 novembre 2026
**Branche examinée :** `evolution-5.0`
**Commit de départ :** `b64264f30b9be6a8d8380aaa4c1414e6c3c9250a`
**Périmètre :** documentation active, architecture visible du prototype, destinations et liens HTML locaux. Aucun déploiement n'a été lancé.

## 1. Synthèse

Le dépôt contient un prototype statique structuré et navigable, pas la plateforme connectée décrite comme cible. Les huit destinations de l'immeuble renvoient à des pages réelles et publiées. Un contrôle indépendant des attributs HTML `href` sur les 32 pages a trouvé **0 lien local cassé** et **0 ancre locale manquante**.

Le résultat est limité : les liens externes n'ont pas été sollicités, les actions dynamiques des scripts n'ont pas été exécutées et les contrôles JavaScript du dépôt n'ont pas pu être lancés. Les pages de CRM, d'espace privé et de fonctions IA signalent dans leur contenu qu'elles ne sont pas connectées. Il ne faut donc pas conclure de la seule cohérence des routes que les fonctions métier cible sont opérationnelles.

## 2. Périmètre et preuves consultées

Fichiers déterminants :

- `AGENTS.md` : doctrine de travail et frontières de sécurité.
- `docs/README.md` et `docs/evolution-5.0/README.md` : index et hiérarchie documentaires.
- `docs/evolution-5.0/MAJESTIOS-V5-REFERENCE.md` : référence fonctionnelle et technique consolidée.
- `index.html` : panorama, destinations, contrôles d'ascenseur et moteur d'accueil.
- `rubric-search.js`, `catalogue-majestios.js`, `app.js` : formulaire partagé, catégories et interactions.
- `opportunity-search.js` : requêtes BOAMP et BODACC.
- `site-files.json`, `build.js` : manifeste et construction statique.
- `verify-site.js`, `verify-architecture.js` : assertions automatisées du dépôt.
- `crm.html`, `espace-membre.html`, `majestios-v5.html` : déclarations d'état du prototype.

Le dépôt contient 32 pages HTML racine et un manifeste de 52 ressources. Aucun document suivi sous `docs/evolution-4.0/` ou `docs/evolution-4/` n'a été trouvé ; la source V4 demandée n'est donc pas disponible dans ce checkout.

## 3. Correspondance de l'immeuble et des routes

La liste est extraite du tableau `destinations` dans `index.html` (vers les lignes 394–403). Les routes existent et sont inscrites dans `site-files.json`.

| Identifiant | Destination de l'immeuble | Route | Résultat du contrôle |
|---|---|---|---|
| 08 | Espace privé | `espace-membre.html` | Présente et publiée |
| 07 | Réseau | `reseaux-synergies.html` | Présente et publiée |
| 06 | Développement commercial | `developpement-commercial.html` | Présente et publiée |
| 05 | Prospection | `prospection-active.html` | Présente et publiée |
| 04 | Marchés publics | `marches-publics.html` | Présente et publiée |
| 03 | Marchés privés | `marches-prives.html` | Présente et publiée |
| 02 | Réputation virtuelle | `reputation-virtuelle.html` | Présente et publiée |
| 01 | Accueil | `index.html#accueil` | Présente ; l'ancre `accueil` existe |

Les parcours détaillés passent par des pages distinctes : notamment `veille-marches.html`, `accompagnement-appels-offres.html`, `bodacc-veille-entreprises.html`, `sous-traitance.html`, `qualification-entreprises.html`, `salons-seminaires.html` et `suivi-commercial.html`. Ces pages ne sont pas des destinations supplémentaires de l'immeuble.

**FAIT VÉRIFIÉ :** les zones et la cabine sont des éléments SVG superposés à `Ambitios.webp`. La cabine démarre au niveau 01, les huit arrêts sont définis dans `index.html`, les boutons haut/bas changent le niveau et une région `aria-live` annonce le niveau. Une sélection par zone suit le lien après l'animation, avec respect de la préférence de réduction du mouvement. C'est un prototype 2D ; le dépôt n'établit pas l'existence d'une scène 3D.

## 4. Inventaire et résultat du contrôle des liens

| Contrôle | Méthode | Résultat |
|---|---|---|
| `href` local et fragments | Analyse indépendante PowerShell des 32 fichiers HTML, résolution des chemins et vérification des identifiants ciblés | 0 cible locale absente ; 0 ancre manquante |
| `src` local, ressources et manifeste | Assertions prévues dans `verify-site.js` et `verify-architecture.js` | Non exécutées : Node.js n'est pas disponible dans l'environnement |
| Huit destinations de l'immeuble | Tableau `destinations` et assertions attendues dans `verify-architecture.js` | Les huit routes concordent avec les fichiers présents et le manifeste ; le test JavaScript n'a pas été lancé |
| Liens externes | Aucun appel réseau de vérification | Non vérifiés |
| Clics, formulaires, transitions et navigation dynamique | Tests navigateur existants, non exécutables dans cet environnement | Non vérifiés pendant cet audit |

Aucun lien HTML local défectueux n'a été identifié ; aucun lien de navigation n'a donc été modifié. Le fait qu'une page existe ne garantit ni que son service est connecté, ni que sa promesse est opérationnelle.

## 5. Conformité documentaire et écarts

### Éléments mis en cohérence dans ce lot

- Une référence centrale V5 est créée et placée en tête des index.
- `AGENTS.md` énonce maintenant le rôle central de MajestiOS V.5, conformément à la décision récente du propriétaire.
- Les index établissent que les documents thématiques sont subordonnés à la référence centrale.
- L'état du prototype est distingué des objectifs, des propositions et des décisions à arbitrer.

### Écarts et limites encore ouverts

| Gravité | Constat | Preuve / conséquence | Suite recommandée |
|---|---|---|---|
| P1 | La base documentaire V4 demandée n'est pas présente dans le dépôt | Aucun chemin suivi `docs/evolution-4.0/` ou `docs/evolution-4/` ; la synthèse ne peut pas démontrer quels choix V4 sont conservés ou abandonnés | Fournir le corpus ou son emplacement avant validation de la filiation V4 → V5 |
| P1 | L'intelligence centrale V5 reste une cible, non un service connecté | `majestios-v5.html` indique l'absence d'orchestrateur, de mémoire persistante et de service IA de production | Garder les formulations « cible » et « à construire » jusqu'à preuve d'exécution |
| P1 | CRM et espace privé ne sont pas opérationnels | `crm.html` indique l'absence de stockage et de connexion ; `espace-membre.html` indique que les demandes ne sont ni envoyées ni stockées | Ne pas saisir de données réelles ; définir le socle serveur, les rôles et les règles de conservation avant mise en œuvre |
| P1 | Les contrôles automatisés ne sont pas exécutés localement | Node.js absent ; tests unitaires, contrôles d'architecture, smoke tests réseau et Playwright non lancés | Relancer les commandes du `README.md` dans la CI ou un environnement Node 22 avant de déclarer la recette complète |
| P2 | Le contrôle indépendant n'a pas vérifié les services externes ni le comportement des boutons/formulaires | L'analyse statique `href` ne simule pas le navigateur ni la disponibilité réseau | Exécuter les smoke tests API et les tests Playwright avant reprise de déploiement |
| P2 | Le contenu des documents thématiques V5 peut diverger de la référence centrale | Les documents ont été rédigés à des dates et étapes différentes ; certains contrôles navigateur décrits sont historiques | Les relire comme sources subordonnées et corriger les écarts factuels sans effacer l'historique utile |

## 6. Inventaire des tests

| Fichier | Couverture annoncée par le code / le nom | État lors de cet audit |
|---|---|---|
| `tests/company-fit.test.cjs` | Règles de rapprochement / adéquation d'entreprise | Non lancé |
| `tests/company-targeting.test.cjs` | Ciblage d'entreprises | Non lancé |
| `tests/naf-suggestions.test.cjs` | Suggestions de codes NAF | Non lancé |
| `tests/mesure-boamp.test.cjs` | Mesures et catégories BOAMP | Non lancé |
| `tests/boamp-live-smoke.cjs` | Requête de fumée vers BOAMP | Non lancé ; réseau requis |
| `tests/bodacc-live-smoke.cjs` | Requête de fumée vers BODACC | Non lancé ; réseau requis |
| `tests/immeuble-interactif.browser.cjs` | Interaction navigateur de l'immeuble | Non lancé ; Node.js et Playwright requis |
| `tests/opportunity-search.browser.cjs` | Parcours navigateur de recherche d'opportunités | Non lancé ; Node.js et Playwright requis |
| `verify-site.js` | Manifeste, pages, liens et identifiants locaux | Non lancé ; Node.js requis |
| `verify-architecture.js` | Destinations, images, moteur commun et invariants d'architecture | Non lancé ; Node.js requis |

Le contrôle PowerShell des liens HTML est un contrôle statique ponctuel, pas un remplacement de cette suite.

## 7. Ordre de reprise recommandé

1. Obtenir la documentation V4 et arbitrer la matrice finale des huit destinations et de leurs sous-parcours.
2. Corriger les contradictions des documents thématiques en prenant la référence maître comme autorité.
3. Exécuter en CI Node 22 le build, les vérifications de site et d'architecture, puis les tests unitaires.
4. Exécuter les smoke tests BOAMP/BODACC et les tests navigateur ; distinguer explicitement les erreurs réseau des défauts de code.
5. Auditer les clics et formulaires des parcours utilisateur, notamment les critères de recherche transportés vers les pages de résultats.
6. Définir les décisions de données, permissions et conservation avant tout CRM réel, compte client, publication ou automatisation.
7. Choisir les technologies seulement après validation des besoins, contraintes, coûts et critères de sortie ; ne pas déployer en production sans autorisation explicite.
