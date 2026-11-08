# Lot D — contrat complet du moteur serveur de Prospection — 8 novembre 2026

**Branche :** `feature/crm-atomic-integration`  
**Périmètre :** contrat membre, validation, orchestration de recherche, correspondance avec l'ancien moteur et page de qualification.  
**Nature de ce lot :** audit technique et matrice de décision en lecture seule. Aucun code applicatif, test, workflow, endpoint hébergé ou objet Supabase n'a été modifié dans ce lot.

## 1. Conclusion exécutive

Le contrat serveur actuel est une base utile, mais il n'est pas encore un remplacement fonctionnel de l'ancien moteur. Trois problèmes doivent être résolus avant le raccordement frontend :

1. plusieurs critères acceptés par la validation ne sont pas appliqués dans tous les parcours ;
2. des filtres historiques n'ont pas de représentation fiable dans le contrat serveur ;
3. le formulaire HTML courant et son script navigateur sont désynchronisés : le script lit des champs absents du formulaire, ce qui peut interrompre le traitement avant l'appel réseau.

**Décision de sécurité :** un critère non implémenté doit être rejeté explicitement ou signalé comme non pris en charge ; il ne doit jamais être accepté puis ignoré silencieusement. Aucun remplacement direct de `company-targeting.js` par un simple appel au nouvel endpoint n'est acceptable à ce stade.

## 2. Matrice des critères observés

| Critère | Ancien moteur / page | Contrat membre actuel | Traitement serveur actuel | Décision |
|---|---|---|---|---|
| Recherche textuelle | `query` / nom recherché dans le navigateur selon l'ancien écran | `query` facultatif | transmis en `q` sur `/search` ; absent du parcours géographique | Conserver ; préciser sémantique et combinaisons dans le contrat UI |
| APE/NAF multiples | `nafCodes` | `activity_codes` | transmis sur les deux routes | Conserver |
| Départements multiples | `departments` | `departments` | transmis sur `/search` ; incompatible avec rayon | Conserver |
| Région | `region` (valeur simple dans l'ancien script) | `regions` (tableau de codes) | transmis sur `/search` ; incompatible avec rayon | Conserver sous forme de codes région officiels validés |
| Rayon géographique | commune/code postal + `radiusKm` | `location` + `radius_km` | géocodage puis `/near_point`, APE obligatoire | Conserver ; préciser qu'il s'agit du centre communal |
| Tranche d'effectif | filtre client historique | `workforce_bands` | transmis sur `/search`, mais ignoré sur `/near_point` | Conserver ; refuser en mode rayon jusqu'à prise en charge vérifiée |
| Catégorie juridique | filtre texte client historique | `legal_forms` | transmis sur `/search`, mais ignoré sur `/near_point` | Conserver les codes officiels ; refuser en mode rayon provisoirement |
| Labels RGE, Qualiopi, EPV, ESS | booléens historiques | `labels` | transmis sur `/search`, mais ignoré sur `/near_point` | Conserver ; refuser en mode rayon provisoirement |
| Date de création | ancienneté calculée dans le navigateur | `creation_after`, `creation_before` | filtre local sur la seule page amont récupérée | Conserver, mais pagination/complétude à corriger avant promesse de couverture |
| Statut actif | case `activeOnly` | absent | pas de filtre dédié dans le contrat ; l'ancien script filtrait après réception | À ajouter explicitement avant migration UI |
| Nom contient | champ `nameContains` dans le script | absent | aucun filtre serveur correspondant | À ajouter si le produit conserve ce critère ; filtrage local sur page limitée insuffisant |
| Inclure données inconnues | `includeUnknown` | absent | absent | À définir avec les règles métier des filtres effectif/ancienneté/juridique ; ne pas l'interpréter implicitement |
| Chiffre d'affaires min/max | `caMin`, `caMax` dans l'ancien moteur | `revenue_bands` | les valeurs non vides sont rejetées ; aucun référentiel de tranches défini | Ne pas convertir en tranches arbitraires ; définir exercice, devise, seuils, disponibilité et source avant implémentation |
| Limite de résultats | 5 ou 10 dans le formulaire | page taille fixe 10 | taille 10, page 1 à 50 | Conserver 10 côté endpoint ; le choix 5 peut être une limite d'affichage, pas une taille API |
| Exclusion des inactives | case cochée par défaut dans le formulaire | absent | absent | À ajouter explicitement ; ne pas déduire du statut d'une source côté client |
| Suggestions APE/NAF depuis un marché | moteur lexical distinct | hors contrat de recherche | n'effectue pas la suggestion | Garder comme étape de préparation séparée, puis envoyer les codes validés |

## 3. Défauts précis du contrat actuel

### 3.1 Filtres acceptés mais ignorés en recherche par rayon

Dans `buildMemberSearchUrl`, la branche `/near_point` ne transmet que les coordonnées, le rayon et les codes APE/NAF. Pourtant `validateMemberSearch` accepte également `workforce_bands`, `legal_forms` et `labels` dans ce mode. Ces critères sont donc validés puis ignorés sans erreur.

**Correctif requis :** jusqu'à preuve de compatibilité documentée de l'API amont, la validation doit refuser ces combinaisons en mode rayon. Même règle pour tout nouveau critère qui ne peut être traduit dans une requête géographique.

### 3.2 Filtrage local et pagination

Les dates de création sont filtrées après réception d'une seule page de résultats. La page est de 10 éléments. Si certains enregistrements sont écartés, le moteur ne complète pas la page avec les pages amont suivantes. Le champ `partial` n'est pas un indicateur général de complétude et peut rester faux alors que moins de 10 résultats sont renvoyés avec d'autres pages amont disponibles.

**Correctif requis :** établir une stratégie de pagination serveur qui continue à lire les pages amont jusqu'à remplir la page demandée ou atteindre une limite explicite, puis renvoie un indicateur `partial` fiable. À défaut, ne pas prétendre que les résultats sont exhaustifs et documenter la limite dans la réponse.

### 3.3 Effectifs

La conversion actuelle associe `0-2` aux codes `00` et `01`, `3-5` à `02`, `6-9` à `03`, `10-19` à `11`, etc. Elle n'exprime pas une cible exacte de 5 à 15 salariés. Le référentiel officiel fournit des tranches, pas nécessairement un effectif exact ; une tranche 10–19 ne permet pas d'affirmer qu'une entreprise compte au plus 15 salariés.

**Correctif requis :** si le ciblage métier est strictement 5–15 salariés, ne pas assimiler 10–19 à une correspondance exacte. Il faut soit afficher une tranche compatible avec réserve, soit enrichir avec une donnée d'effectif exacte et datée, soit demander une vérification humaine. Ne pas exclure automatiquement toute tranche qui chevauche la cible sans arbitrage métier.

### 3.4 Recherche textuelle et rayon

Le contrat accepte une requête textuelle facultative. En mode rayon, elle est actuellement refusée lorsqu'elle est combinée au rayon. Cette restriction doit rester explicite tant que l'API géographique ne démontre pas la prise en charge de la recherche textuelle.

## 4. Désynchronisation page HTML / script

Le formulaire présent dans `qualification-entreprises.html` expose actuellement les champs `marketTitle`, `marketDescription`, `nafCodes`, `departments`, `limit` et `activeOnly`.

Le script `company-targeting-page.js` lit aussi `workforce`, `companyAge`, `legalCategory`, `nameContains`, `includeUnknown`, `caMin`, `caMax`, `estRge`, `estQualiopi`, `estEpV`, `estEss`, `radiusLocation`, `radiusKm` et d'autres champs qui ne figurent pas dans le formulaire HTML actuel. Il lit notamment `form.elements.workforce.value` avant de lancer la recherche. Avec le balisage consulté, cette référence est absente et peut provoquer une exception JavaScript au submit.

En outre, le script appelle encore directement le moteur navigateur `MajestiosCompanyTargeting`. Le nouvel endpoint membre n'est pas utilisé.

**Conséquence :** le raccordement frontend est bloqué non seulement par l'écart de critères, mais aussi par la désynchronisation HTML/JavaScript. Il faudra d'abord choisir quels champs font réellement partie de l'expérience actuelle, puis harmoniser formulaire, script et contrat dans un lot dédié.

## 5. Contrat cible recommandé

Le contrat membre doit rester fermé et versionnable :

- `query` : recherche textuelle facultative, avec sémantique définie ;
- `filters.activity_codes[]` ;
- `filters.departments[]` ;
- `filters.regions[]` ;
- `filters.location` et `filters.radius_km`, mutuellement cohérents ;
- `filters.workforce_bands[]` ;
- `filters.legal_forms[]` ;
- `filters.labels[]` ;
- `filters.creation_after` et `filters.creation_before` ;
- futurs critères explicites : `active_only`, `name_contains`, `company_age_bands[]`, `include_unknown`, seulement après définition de leur sémantique et de leur traitement serveur ;
- `page.number`, taille serveur fixe à 10.

`revenue_bands` reste refusé tant que les tranches et la donnée sous-jacente ne sont pas spécifiées. Les champs non reconnus restent rejetés. Aucun champ fournisseur, URL, identifiant de connecteur, payload amont ou donnée brute ne doit entrer dans le DTO membre.

## 6. Ordre de réalisation proposé

1. Corriger la validation pour refuser immédiatement les filtres non pris en charge en mode rayon.
2. Corriger la pagination/complétude des filtres exécutés localement (dates, puis nom/ancienneté si ajoutés).
3. Ajouter les critères statut actif et nom uniquement après décision sur leurs sémantiques et tests de traduction.
4. Décider du traitement des tranches d'effectif chevauchant une cible métier de 5–15 salariés.
5. Définir le modèle chiffre d'affaires avant toute activation du filtre.
6. Écrire des tests unitaires par critère, par combinaison de route, pour les refus explicites, la pagination et la projection DTO.
7. Dans un lot distinct, harmoniser HTML et script, puis construire un adaptateur frontend vers l'endpoint authentifié.
8. Garder le moteur historique intact jusqu'à recette comparative ; ne pas modifier le moteur de recherche transversal de l'accueil.

## 7. Tests et vérifications

Les fichiers de tests existants consultés sont :

- `tests/prospection-search-core.test.cjs`
- `tests/prospection-contract.test.cjs`

Ils vérifient déjà plusieurs filtres de la route `/search`, le géocodage et le rayon, les erreurs 429/503, la pagination nominale, le filtrage de dates et l'absence de clés interdites dans le DTO.

Ils ne couvrent pas encore :
- le rejet des filtres workforce/juridique/labels combinés au rayon ;
- le remplissage d'une page après filtrage local ;
- le signal `partial` en cas de limite de pages ;
- statut actif, nom, ancienneté par tranches et inclusion des inconnues ;
- les combinaisons contradictoires entre tous les critères.

**Exécution :** aucun test n'a été lancé dans ce lot. Les tests ont été lus statiquement via GitHub ; leur passage n'est pas revendiqué.

## 8. Périmètre non modifié

- aucun fichier applicatif ou test modifié ;
- aucun changement de workflow ou de configuration ;
- aucune écriture Supabase, migration, RLS, Auth ou secret ;
- aucun déploiement Edge, aucune publication Vercel, aucun merge ;
- ancien moteur navigateur conservé ;
- moteur global d'accueil non touché ;
- aucune source de données exposée à l'interface membre.

## 9. Critère de sortie du prochain lot

Le prochain lot de code devra fournir une matrice exécutable des critères : chaque filtre doit être soit appliqué avec preuve par test, soit rejeté explicitement, soit marqué comme non disponible dans l'interface. Aucune recherche ne doit accepter silencieusement un critère qu'elle ne traite pas.
