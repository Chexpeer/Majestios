# Liste publique « Appels d'offres privés » — branche `test-annonces-liste-publique`

**Date :** 14 novembre 2026 · **Base :** `test-ecriture-claude` · **Cible de données :** projet Supabase `MajestiOS-Test` (SQL appliqué le 14/11, voir [spécification](SPECIFICATION-ANNONCES-SOUS-TRAITANCE-2026-11-14.md)).

## Ce que la branche ajoute

Une section « Appels d'offres privés publiés sur MajestiOS » en tête de `marches-prives.html` : filtres (type, département), cartes d'annonces paginées par 10, bouton « Voir plus », et pour chaque annonce une demande de mise en relation (relayée par l'équipe ; l'auteur reste anonyme). Rien n'est publié sans relecture ; la liste n'affiche que les annonces `published` non expirées, sans aucune coordonnée.

| Fichier | Rôle |
|---|---|
| `annonces-liste.mjs` | Règles pures : requête, nettoyage des lignes reçues, formats, validation de la demande |
| `annonces-liste.js` / `.css` | Affichage (texte inséré par `textContent`, jamais en HTML) |
| `tests/annonces-liste.test.mjs` | 5 tests de règles |
| `tests/annonces-liste.browser.cjs` | Navigateur : pagination, filtres, texte non interprété, aucune coordonnée, mise en relation (clé publique seule), états vide et erreur |

## Limites connues

- **Référencement :** la liste est chargée par JavaScript ; les moteurs de recherche voient mal des annonces ainsi chargées. Pour que chaque annonce serve le référencement, il faudra une page statique par annonce (`annonce-AN-XXXXXXXX.html`) et un plan de site généré à la construction à partir de `list_published_announcements`. À faire séparément.
- **Données de test :** tant qu'aucune annonce n'est publiée sur `MajestiOS-Test`, la liste affiche « Aucune annonce publiée… ».
- **Cible :** la configuration pointe sur `MajestiOS-Test` (`annonces-config.mjs`). Avant toute fusion vers la branche principale, choisir le projet cible, y appliquer le SQL, puis changer l'URL.
