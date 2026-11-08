# Moteur de Prospection — raccordement des critères — 8 novembre 2026

**Branche :** `feature/rubriques-moteurs-coherence`  
**PR :** #49 — brouillon, non fusionnée  
**Sauvegarde avant modification :** `backup/prospection-engine-pre-wire-2026-11-08`

## Objectif

La rubrique Prospection conserve un seul moteur de recherche métier. Il utilise une source principale unique pour les données d'entreprises : l'API publique Recherche d'Entreprises de la DINUM. Il n'affiche aucun catalogue de fournisseurs, logo, nom de source ou sélecteur de connecteur.

Le service de géolocalisation des communes n'est utilisé que pour convertir le lieu saisi en coordonnées nécessaires au rayon ; il ne fournit pas de données d'entreprises.

## Raccordements réalisés

- Recherche par code APE/NAF et département ou région via `GET /search`.
- Recherche par code APE/NAF et rayon de 1 à 50 km via `GET /near_point`, après géocodage de la commune ou du code postal.
- Effectif : transmission du filtre `tranche_effectif_salarie` à `/search`, y compris la valeur inconnue `NN` lorsque l'option de conservation des inconnues est active ; contrôle complémentaire des résultats.
- Chiffre d'affaires minimum et maximum, ainsi que les indicateurs RGE, Qualiopi, EPV et ESS : transmis uniquement à `/search`.
- Ancienneté, forme/catégorie juridique et expression présente dans la dénomination : filtres appliqués aux fiches reçues.
- Conservation des fiches sans donnée filtrée selon l'option « Conserver les entreprises dont l'information filtrée est inconnue ».
- Filtre de statut actif/non actif conservé.
- Dédoublonnage par SIREN et plafonnement à dix entreprises affichées.

## Limites d'API prises en compte

La documentation officielle de `/near_point` ne décrit que les filtres géographiques et l'activité APE/NAF. Les filtres chiffre d'affaires et labels ne lui sont donc pas transmis. L'interface bloque explicitement ces combinaisons en mode rayon et demande de choisir un département ou une région pour les utiliser.

En mode rayon, les critères d'effectif, d'ancienneté, de forme juridique et de dénomination sont appliqués localement aux fiches retournées. Le volume récupéré reste limité par la pagination demandée ; une liste filtrée ne doit pas être présentée comme exhaustive.

Documentation officielle : https://recherche-entreprises.api.gouv.fr/docs/

## Compatibilité et tests

Le script commun reste compatible avec les deux formulaires qui l'utilisent :
- le formulaire de Prospection dans `prospection-active.html` ;
- le formulaire de préqualification lié à l'accompagnement des appels d'offres dans `qualification-entreprises.html`.

Tests CI ajoutés ou étendus :
- contrat du moteur de ciblage, dédoublonnage et filtres métier ;
- paramètres transmis à `/search` et `/near_point` ;
- cohérence des champs réellement présents dans le formulaire Prospection ;
- compatibilité du formulaire de préqualification existant ;
- contrat serveur et adaptateur membre déjà présents.

## Hors périmètre / non effectué

- Aucun changement du CRM, des accès VIP, des rôles, de l'authentification, des politiques RLS ou de Supabase.
- Aucun déploiement d'Edge Function.
- L'adaptateur authentifié vers `prospection-search-member` reste non raccordé à la page tant que le déploiement hébergé n'a pas été vérifié.
- Aucun test de recette avec un compte membre réel n'a été effectué.
- Aucun merge ni déploiement Vercel/production.

## Contrôles CI du lot

Le workflow ciblé a validé les six étapes de tests, y compris les tests du moteur public, les filtres métier, le formulaire Prospection et l'adaptateur membre. Le workflow global du site a encore un échec au contrôle d'architecture/navigation déjà présent sur la branche ; les tests CRM de navigation et de sécurité ainsi que les tests du moteur et la construction statique passent avant cette étape. Cet échec global n'a pas été corrigé dans ce lot afin de ne pas modifier la navigation VIP ni le périmètre CRM.
