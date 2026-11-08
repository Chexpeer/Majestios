# Lot D2-A — harmonisation du formulaire de qualification — 8 novembre 2026

**Branche :** `feature/crm-atomic-integration`  
**Point de retour :** `backup/pre-prospection-d2-2026-11-08`, créé avant les modifications du lot.  
**Périmètre :** alignement HTML/JavaScript, garde-fou automatisé et préparation de la transition vers le moteur membre.  
**Statut :** harmonisation ciblée réalisée ; bascule vers l'endpoint membre non réalisée.

## 1. Corrections réalisées

Le formulaire `qualification-entreprises.html` expose actuellement cinq champs exploités par son script : `marketTitle`, `nafCodes`, `departments`, `limit` et `activeOnly`.

Le script précédent lisait en plus des contrôles absents du DOM : région, localisation/rayon, effectif, ancienneté, catégorie juridique, nom, inconnus, chiffre d'affaires et labels. Ces lectures pouvaient interrompre le traitement avant l'appel réseau.

Dans `company-targeting-page.js` :
- suppression des lectures des champs inexistants ;
- validation limitée aux codes APE/NAF et départements réellement présents ;
- maintien de la limite d'affichage 5/10 ;
- maintien du filtre « exclure les entreprises non actives » ; les statuts inconnus ne sont pas assimilés à des statuts inactifs ;
- suppression de la logique de rayon et des filtres avancés non exposés dans ce formulaire ;
- maintien provisoire de l'ancien parcours navigateur, sans suppression du moteur historique.

## 2. Contrôle anti-régression ajouté

Nouveau test : `tests/prospection-form-contract.test.cjs`.

Il vérifie :
- l'existence du formulaire ;
- la présence des cinq champs attendus ;
- que chaque accès `form.elements.*` dans le script correspond à un contrôle HTML réel ;
- l'absence des références obsolètes aux champs qui n'existent pas.

Le workflow ciblé `.github/workflows/prospection-search-contract.yml` inclut désormais les chemins HTML/JS et exécute ce test en plus des deux suites du contrat serveur.

**État CI :** le workflow a été configuré pour se déclencher sur les modifications concernées. La conclusion du run correspondant n'a pas encore été récupérée au moment de la rédaction ; aucun succès CI n'est revendiqué ici.

## 3. Arbitrages métier préservés

Aucun critère n'a été réintroduit artificiellement :
- le chiffre d'affaires reste désactivé tant que l'exercice, la devise, les seuils, la fraîcheur et la disponibilité de la donnée ne sont pas définis ;
- une tranche officielle « 10 à 19 salariés » ne prouve pas un effectif maximal de 15 ; elle ne doit pas être présentée comme équivalente à la cible 5–15 ;
- les critères d'ancienneté, de forme juridique et de nom ne sont pas affichés tant que leur contrat serveur n'est pas défini et testé ;
- les données inconnues ne sont pas implicitement acceptées pour tous les filtres.

## 4. Limite importante — endpoint membre

Le nouvel endpoint `prospection-search-member` est présent dans Git mais n'est pas déployé sur le projet hébergé selon le dernier inventaire vérifié. Le frontend n'a donc pas été basculé vers cet endpoint et aucun appel n'a été simulé comme s'il était disponible.

L'ancien parcours navigateur reste temporairement utilisé. Il ne constitue pas la cible d'architecture : la prochaine étape doit préparer l'adaptateur authentifié, puis faire une recette contrôlée après autorisation et déploiement distincts. Les sources doivent rester invisibles dans l'interface et les DTO membre.

## 5. Fichiers modifiés

- `company-targeting-page.js`
- `tests/prospection-form-contract.test.cjs` (nouveau)
- `.github/workflows/prospection-search-contract.yml`

Aucun changement du formulaire HTML n'a été nécessaire : ses champs présents ont été conservés.

## 6. Périmètre préservé

- aucun déploiement Edge Function ;
- aucune écriture, migration ou modification distante Supabase ;
- aucun changement Auth/RLS ou secret ;
- aucune suppression de l'ancien moteur ;
- aucun changement du moteur transversal de recherche de l'accueil ;
- aucun merge ni déploiement Vercel/production.

## 7. Étape suivante

Le lot D2-B doit :
1. définir un contrat minimal de réponse UI à partir du DTO membre (`legal_status`, `activity_code`, `address.department`, `workforce_band`, `creation_date`) ;
2. construire un adaptateur navigateur utilisant la session Supabase existante et appelant uniquement `prospection-search-member` ;
3. tester la transformation DTO → carte sans réintroduire de provenance technique ;
4. maintenir l'ancien moteur comme référence de comparaison, sans bascule utilisateur avant endpoint déployé et recette autorisée ;
5. comparer la couverture et les écarts, notamment pagination, statuts inconnus et tranches d'effectif.

**Critère de sortie :** le script ne lit aucun contrôle absent, et aucun critère présenté à l'utilisateur n'est silencieusement ignoré.
