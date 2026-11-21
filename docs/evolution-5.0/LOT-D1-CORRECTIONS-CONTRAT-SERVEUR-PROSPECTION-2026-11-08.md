# Lot D1 — corrections ciblées du contrat serveur de Prospection — 8 novembre 2026

**Branche :** `feature/crm-atomic-integration`  
**Point de retour :** branche `backup/pre-prospection-d1-2026-11-08`, créée avant toute modification depuis le commit `9f9702ff98dbb1256f9ee304dd5ebe6a3a718c96`.  
**Commit de code/tests/workflow :** `e418449c89fd09502046641189ef6cdb8b93832f`.  
**CI ciblée :** workflow `Tests du contrat serveur de Prospection`, run `42481188283`, conclusion `success`.

## 1. Résultat

Le contrat serveur refuse désormais explicitement les filtres géographiques qui étaient auparavant acceptés sans être transmis à l'API amont. Le filtrage local sur dates parcourt plusieurs pages amont pour constituer une page logique cohérente, dans une limite contrôlée et signalée. Les tests couvrent les refus et la pagination.

## 2. Corrections apportées

### 2.1 Recherche par rayon : refus des critères non pris en charge

Dans `prospection-validation.mjs`, la combinaison `location + radius_km` est désormais refusée si elle contient également :

- `workforce_bands` ;
- `legal_forms` ;
- `labels`.

Les critères de rayon déjà incompatibles (recherche textuelle, départements, régions, absence de code APE/NAF) restent refusés. Cette validation empêche qu'un filtre soit accepté puis ignoré par le moteur.

Les dates de création restent compatibles avec le rayon : elles sont appliquées par filtrage serveur après récupération.

### 2.2 Pagination après filtrage local des dates

Dans `prospection-search-core.mjs` :

- une recherche sans filtre de date demande directement la page logique demandée ;
- une recherche avec filtre de date repart de la première page amont et agrège les résultats qui satisfont les bornes ;
- l'agrégation continue jusqu'à disposer des dix résultats de la page logique demandée, ou jusqu'à la fin des pages amont ;
- le balayage est plafonné à cinq pages amont par requête ;
- si cette limite est atteinte avant de constituer la page demandée, `partial` vaut `true` et `page.has_more` reste vrai ;
- le géocodage du rayon est effectué une seule fois pendant le balayage, puis les numéros de page sont ajustés sur l'URL construite ;
- pour une recherche sans filtre local, `page.has_more` compare désormais la page réellement demandée à `total_pages`, au lieu de comparer le nombre de pages lues (qui vaut une seule page).

**Limite assumée :** le plafond de cinq pages amont évite un balayage non borné et une multiplication incontrôlée des appels. Une réponse `partial: true` signifie que le moteur n'a pas pu garantir la constitution complète de la page logique dans ce budget. Le client devra afficher cet état et ne pas interpréter une page partielle comme une absence définitive d'entreprises. Une évolution ultérieure pourra introduire un curseur serveur ou une pagination de reprise.

### 2.3 Tests ajoutés

`tests/prospection-search-core.test.cjs` couvre désormais :

- refus de chacun des trois filtres non transmis en mode rayon ;
- agrégation des résultats filtrés depuis plusieurs pages ;
- constitution correcte de la deuxième page logique ;
- état `partial` lorsque le plafond de cinq pages est atteint avant d'obtenir assez de résultats ;
- état `has_more` correct sur la dernière page d'une recherche sans filtre local.

Le test existant `tests/prospection-contract.test.cjs` continue de couvrir le contrat DTO, la validation générale et les habilitations.

## 3. Vérification CI

Workflow ciblé : **Tests du contrat serveur de Prospection**  
Run : `42481188283`  
Commit testé : `e418449c89fd09502046641189ef6cdb8b93832f`  
Résultat : **success**.

Étapes exécutées et réussies :

1. `node tests/prospection-contract.test.cjs`
2. `node tests/prospection-search-core.test.cjs`

Un premier run ciblé a échoué sur une assertion de test qui attendait à tort `has_more=false` alors que deux résultats filtrés supplémentaires existaient après la première page logique. L'attente du test a été corrigée ; le run final ci-dessus est vert. Le comportement du moteur était cohérent avec la présence de résultats supplémentaires.

Le workflow global de vérification du site déclenché sur le même commit était encore en cours au dernier contrôle ; aucun résultat n'est revendiqué pour lui ici. Le workflow Auth/RLS lancé sur un commit antérieur est indépendant du run ciblé et n'est pas utilisé comme preuve de ce lot.

## 4. Fichiers modifiés

- `supabase/functions/_shared/prospection-validation.mjs`
- `supabase/functions/_shared/prospection-search-core.mjs`
- `tests/prospection-search-core.test.cjs`
- `.github/workflows/prospection-search-contract.yml` (nouveau workflow ciblé, sans secrets ni accès distant)

## 5. Périmètre préservé

- aucun raccordement frontend ;
- aucun changement à `company-targeting.js`, `company-targeting-page.js` ou au formulaire HTML ;
- aucun retrait de l'ancien moteur navigateur ;
- moteur transversal de recherche de l'accueil non modifié ;
- aucun nom, logo, URL ou fournisseur exposé dans le DTO membre ;
- aucune migration, écriture ou modification de schéma Supabase ;
- aucune modification Auth/RLS, aucun secret ;
- aucune fonction Edge déployée ;
- aucun merge ni déploiement Vercel/production.

## 6. Limites restantes avant raccordement frontend

1. Décider et implémenter les sémantiques de `active_only`, `name_contains`, `company_age_bands` et `include_unknown` si ces critères sont conservés.
2. Définir les seuils et la donnée sous-jacente du chiffre d'affaires avant d'activer `revenue_bands`.
3. Décider comment présenter les tranches d'effectif qui chevauchent la cible métier de 5 à 15 salariés ; une tranche 10–19 ne prouve pas un effectif maximal de 15.
4. Harmoniser le formulaire HTML et son script ; le script actuel lit des champs absents du formulaire.
5. Construire un adaptateur frontend vers l'endpoint authentifié, puis comparer les résultats avec l'ancien moteur sans le supprimer.

**Critère de sortie :** aucun critère de recherche ne doit être silencieusement ignoré. Chaque critère visible doit être appliqué, refusé explicitement ou indisponible dans l'interface.
