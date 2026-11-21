# Livraison d'evolution-12 vers `main` — préparation (21 novembre 2026)

**Décision du propriétaire :** créer une branche à partir de `main` (histoire commune), y recopier tout le contenu d'`evolution-12`, ouvrir la demande de fusion ; **c'est le propriétaire qui clique sur « fusionner »**. La base de production n'est pas modifiée par cette préparation.

## Pourquoi une branche de livraison
`main` et `evolution-10/11/12` n'ont aucun ancêtre commun : GitHub refuse de les fusionner directement. La branche `livraison-evolution-12` part de `main` (ancêtre commun garanti) et contient exactement l'arbre d'`evolution-12`, avec les réglages de production ci-dessous. `evolution-12` et toutes les sauvegardes restent intactes.

## Réglages de production appliqués dans la branche de livraison
- `supabase-config.js` : projet **majestios-crm** (valeur déjà présente sur `main`), et non plus MajestiOS-Test.
- `annonces-config.mjs` : projet majestios-crm et **dépôt d'annonces fermé** (`ANNONCES_OUVERTES = false`) tant que le SQL « annonces » n'est pas appliqué en production.
- `dist/` reconstruit : aucune référence à la base de test.
- Test navigateur du formulaire d'annonces : simule l'ouverture du dépôt pour continuer à contrôler le parcours.

## Avant de cliquer sur « fusionner » (à décider par le propriétaire)
La base de production **n'a pas** les nouveautés ; sans mise à jour, ces fonctions afficheront un message d'indisponibilité (sans casser le reste du site) :
- Marchés attribués (migrations 20261121160000, 20261121180000, 20261121190000, 20261121200000 + secrets du chargement DECP) ;
- annonces et relecture (SQL « annonces »), invitations, Cheexpeer, CRM récent (migration 20261120190000, fonction `provision-client-workspace` v4, secret `INTERNAL_ADMIN_EMAIL` avant le bootstrap admin) ;
- réglages Google / LinkedIn de la production et adresses de retour autorisées.
Toute action sur la base de production exige l'autorisation explicite du propriétaire.

## Contenus de `main` absents de la livraison (à confirmer)
Fichiers présents sur `main` et non repris par `evolution-12` : `salons-seminaires.html` (page), 6 images à la racine (`Designer (2).png`, `IMMEUBLE.jfif`, `OFFRE PUBLIC.png`, `PROSPECTION.jfif`, `RESEAU.png`, `devellopement (2).jfif`, `immeuble-masque.png`), `docs/evolution-6/REPUTATION-VIRTUELLE-EXECUTION-IA-VERCEL-2026-11-09.md`, `tests/immeuble-interactif.browser.cjs`. Ils restent dans l'historique de `main` ; décision du propriétaire pour les réintégrer ou non.

## Chargement DECP
Le workflow `charger-decp.yml` contient une planification hebdomadaire qui ne s'exécute que sur la branche par défaut : elle démarrera après la fusion. Ses secrets visent la base indiquée dans les secrets GitHub (à vérifier avant la fusion).
