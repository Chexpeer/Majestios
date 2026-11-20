# Audit du produit — 20 novembre 2026 (lecture seule)

**Branche :** `evolution-10`, commit audité `da6ae51`. **Méthode :** lecture du dépôt, rejeu des contrôles, lecture de la base de test Supabase et du contrôle GitHub. Aucune correction, aucune écriture Supabase, aucun déploiement.

## 1. Défauts démontrés

| Réf. | Constat | Effet sur le site | Suite proposée |
|---|---|---|---|
| AUD-01 | Contrôle GitHub : les tests navigateur démarraient avant l'installation de Playwright (échec sur tous les envois récents de `evolution-10`). **Corrigé** le 20 novembre (commit `da6ae51`, contrôle vert). | Aucun | Clos |
| AUD-02 | `tests/internal-entry-contract.test.cjs` échoue : il cherche deux noms de variables (`allowedDestinations`, `destinationAllowed`) remplacés par `safeReturnTo` / `canOpen`. Le comportement (retour limité aux routes autorisées) est présent dans le code. | Aucun : test périmé | Aligner l'assertion sur le code actuel (test seul) |
| AUD-03 | Le workflow « anti-régression » ne se déclenche pas sur `evolution-10` (liste de branches sans elle) : AUD-02 n'est donc jamais vu en ligne. | Aucun | Ajouter la branche après correction d'AUD-02 |
| AUD-04 | Adresse administrateur réelle dans `supabase/functions/bootstrap-internal-admin/index.ts` (AN-05) et, jusqu'au 20 novembre, en clair dans le registre. Registre corrigé ; le code non. | Exposition d'une adresse dans un dépôt | Décision du propriétaire |

## 2. Cohérence du produit (vérifiée par les contrôles automatiques, tous verts sur GitHub)

- **Pages et rubriques :** 43 pages, 143 ressources publiées, liens locaux et ancres présents, menu de repli identique.
- **Moteurs de recherche :** parcours Prospection, recherche d'opportunités et filtre BODACC réel testés en navigateur ; connexions réelles BOAMP et BODACC répondent.
- **Parcours utilisateurs :** création d'espace par lien, activation, tableau de bord, annonces (12 types), contact sans transmission de données, menus mobile/ordinateur.
- **Accès membres / VIP / interne :** verrouillage sans session testé ; rôles internes owner/admin/member/viewer reconnus ; import officiel VIP non déployé (bloqué volontairement).
- **CRM :** fondations et sécurité présentes sur Test (RLS active sur toutes les tables `public`, aucune sans RLS). **Recette multi-rôles réelle jamais exécutée.**

## 3. Fonctions présentes mais non recettées

Recette réelle des rôles CRM (AN-02, AN-13) ; consentement prouvé côté serveur (AUTH-02) ; pont Git Cheexpeer (AN-06) ; import officiel VIP ; restauration des sauvegardes (AN-10) ; facturation électronique (en attente du partenaire).

## 4. Sécurité Supabase (Test)

Seule action propriétaire : activer « Leaked password protection ». Les alertes sur les fonctions exécutables par les utilisateurs connectés concernent des fonctions voulues (annonces, invitations, CRM, Cheexpeer) ; chacune contrôle le rôle dans son code, ce qui reste à prouver par la recette multi-rôles.

## 5. Évolutions à prévoir

Diffusion des annonces au-delà du bandeau ; formulaire d'ajout de piste ; « Mes annonces » ; factures (B2Brouter / Iopole) ; SMTP personnalisé ; nom de domaine ; comparaison des migrations Test / production avant toute fusion.

**Règle :** aucune correction esthétique improvisée, aucun CSS ajouté sans besoin, aucune modification fonctionnelle sans autorisation du propriétaire.
