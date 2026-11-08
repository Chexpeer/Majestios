# Lot CRM atomique 04 — navigation Administration / CRM

**Date :** 8 novembre 2026  
**Branche :** `feature/crm-atomic-integration`  
**Point de départ vérifié :** `6f52f11184f72ad11cf49a244ad39fa28682a02d`  
**Base de comparaison :** `rebuild/evolution-5.0-admin-cockpit-clean-supabase`  
**Périmètre :** navigation entre le cockpit d'administration et le CRM interne ; aucune fusion ni aucun déploiement.

## Objectif

Faire apparaître clairement le CRM comme un module opérationnel de l'administration générale, sans fusionner les deux interfaces ni modifier leurs identités visuelles.

## Changements

1. Le menu du cockpit distingue maintenant la navigation entre modules (Administration générale, CRM interne, Recherches ciblées) des ancres de navigation propres au cockpit.
2. Le module Administration est identifié comme page active par `aria-current="page"`.
3. L'en-tête du CRM annonce explicitement la navigation des modules internes et conserve son accès à l'accueil interne ainsi que les liens conditionnels vers Administration et Recherches.
4. Le contrat de navigation vérifie la séparation entre navigation intermodules et ancres internes.
5. L'architecture rappelle que cette étape ne crée ni coque applicative unifiée, ni gestion complète des habilitations ou des clients.

## Sécurité et frontières préservées

- Les rôles `owner` et `admin` restent seuls habilités à ouvrir le cockpit d'administration et les recherches ciblées.
- Les rôles internes `member` et `viewer` conservent leur parcours CRM autorisé ; le rôle `viewer` reste en consultation seule.
- Les liens masqués dans l'interface ne remplacent jamais les contrôles d'accès ni les politiques RLS existantes.
- Aucun changement de schéma, de politique RLS, de donnée Supabase ou d'Edge Function.
- Aucun changement des espaces clients, du moteur de recherche public, des ressources visuelles ou de l'immeuble interactif.

## Vérifications

- GitHub Actions, run `42455346047` sur le commit `6a936cfe414a6a4518dbb62ddd29cb78a1cffa23` : syntaxe JavaScript réussie et étape « Vérifier la navigation Administration / CRM » réussie. Le contrat ciblé est donc effectivement exécuté et validé.
- Le test ciblé de navigation Administration / CRM a réussi dans les runs GitHub Actions `42455346047` et `42455375960`.
- Le workflow global a ensuite échoué sur `tests/naf-suggestions.test.cjs` (ligne 22) : le descriptif du lot contenait les formes plurielles « installations électriques » et « réseaux électriques », absentes du vocabulaire de la règle 43.21A. Ce défaut de couverture lexicale est corrigé dans le lot suivant ; il n'était pas causé par les changements de navigation.
- Aucun test navigateur ni contrôle Supabase n'a été exécuté pour le lot 04.

## Point de retour et limites

Le commit de départ `6f52f11184f72ad11cf49a244ad39fa28682a02d` reste le point de retour identifié. La branche était à 9 commits d'avance et 0 en retard sur sa base ; aucune PR ouverte n'était associée à cette branche lors du contrôle. Le lot ne crée pas de branche supplémentaire.

Ce lot harmonise les accès de navigation ; il ne transforme pas les deux pages en une application à coque unique. La gestion des membres, rôles et espaces clients demeure un chantier distinct.
