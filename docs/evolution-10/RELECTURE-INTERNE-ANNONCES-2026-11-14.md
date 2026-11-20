# Relecture interne des annonces — branche `test-annonces-relecture`

Page : `admin-annonces.html` (accès réservé). Branche créée depuis `test-ecriture-claude`. Rien n'est fusionné ni en production.

## Rôle
Relire chaque annonce déposée par un visiteur avant publication : corriger titre/description, publier, refuser (motif obligatoire), retirer une annonce publiée.

## Sécurité
- Connexion par code e-mail sur le projet MajestiOS-Test (`shouldCreateUser: false` : aucun compte créé depuis la page).
- Le verrou réel est côté base : `moderation_queue` et `moderate_announcement` exigent `private.announcement_is_moderator()` (propriétaire/administrateur de l'organisation interne). Un compte refusé voit l'écran verrouillé.
- Les coordonnées de l'auteur ne s'affichent qu'ici et ne sont jamais publiées. Les textes sont affichés en texte brut.
- Aucune lecture/écriture directe des tables.

## Pour la tester pour de vrai
Le projet MajestiOS-Test n'a aucun utilisateur ni membre : il faut d'abord créer le compte interne (connexion, puis ajout d'une ligne propriétaire dans `organization_members`) — décision du propriétaire requise.

## Tests
`tests/annonces-moderation.test.mjs` (règles) et `tests/annonces-moderation.browser.cjs` (verrouillage, liste, refus motivé, publication corrigée), ajoutés à la CI.

## Fusion
Conflits prévisibles avec `test-annonces-liste-publique` : `site-files.json`, `.github/workflows/verify-site.yml`. Résolution = garder les deux séries d'entrées.
