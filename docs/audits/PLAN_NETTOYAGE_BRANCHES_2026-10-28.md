# Plan de nettoyage des branches — 28 octobre 2026

## Objectif

Réduire le dépôt à trois branches de référence :

1. `developpement` — branche active pour les corrections et l’intégration.
2. `main` — branche de référence principale ; ne pas la fusionner aveuglément avec `developpement`.
3. `sauvegarde-majestios` — branche de sauvegarde à conserver.

Ne pas créer de nouvelles branches pour chaque correction mineure. Regrouper les travaux cohérents dans `developpement`.

## Éléments préservés avant nettoyage

- Les référentiels de vision et de continuité IA ont déjà été copiés dans `developpement`.
- Les règles métier contre les hypothèses non validées ont été conservées dans `docs/architecture/REGLES_IA_HYPOTHESES_INTERDITES_V0.1.md`.
- La page de présentation Business utile a été adaptée dans `src/app/opportunites/business/page.tsx`.
- La recherche BODACC actuelle est conservée dans `/business` ; elle n’est pas remplacée par une ancienne page de présentation.
- La FAQ actuelle de `/faq` est plus complète que la FAQ de la branche historique `architecture-v0-1`.
- La page historique `/espace-membre` n’a pas été copiée car `/espace-professionnel` existe déjà dans la branche active.
- Le catalogue d’événements de l’ancienne branche ne contient qu’un exemple fictif ; il n’a pas été intégré comme source réelle.

## Branches historiques candidates au retrait

Les branches ci-dessous sont des candidates à la suppression après vérification dans GitHub qu’aucune pull request ouverte ni automatisation active ne les utilise :

- `architecture-v0-1` — ancienne architecture divergente ; les éléments utiles identifiés ont été préservés ou remplacés par les versions actuelles.
- `backup/opportunity-search-2026-10-28` — ancienne sauvegarde technique, derrière `developpement`.
- `chexpeer-site-majestios` — ancienne structure statique, incompatible avec l’application Next.js actuelle ; les documents utiles ont été préservés séparément.
- `feat/bodacc-business-cleanup` — ancienne variante de la route BODACC ; la version actuelle contient déjà le nettoyage retenu et son utilitaire de recherche.
- `feat/homepage-depth-navigation` — ancienne variante de navigation, derrière `developpement`.
- `feat/opportunity-search-conversion` — ancienne variante du parcours d’opportunités, derrière `developpement`.
- `fix/boamp-flat-records-tests` — tests et utilitaires BOAMP utiles déjà présents dans une version plus récente ; ne pas fusionner cette branche entière.
- `fix/boamp-open-filter` — ancienne correction, derrière `developpement`.
- `fix/homepage-structure-opportunity-flow` — ancienne structure d’accueil, derrière `developpement`.
- `fix/lint-apostrophes-2026-10-28` — branche divergente liée à l’ancienne architecture ; vérifier les pull requests avant retrait.
- `fix/navigation-depth` — branche divergente ; les pages utiles identifiées existent déjà ou sont remplacées par une version plus récente.
- `site-profondeur-v0-1` — ancienne variante de structure du site, derrière `developpement`.

## Procédure obligatoire avant suppression

1. Vérifier qu’aucune pull request ouverte ne cible la branche.
2. Vérifier que la branche n’est pas protégée ni utilisée par un déploiement ou un workflow.
3. Confirmer que les éléments uniques utiles sont déjà conservés dans `developpement`.
4. Supprimer les branches historiques candidates par lots, puis relire la liste des branches.
5. Ne pas supprimer `main`, `developpement` ni `sauvegarde-majestios`.

## Limite d’exécution

Ce document est un plan de nettoyage, pas une confirmation de suppression. L’outil GitHub disponible dans cette session permet d’inspecter et de modifier des fichiers et des références, mais ne fournit pas d’action dédiée de suppression de branche. Aucune branche n’a été supprimée par cette session.

## État de validation

Le plan repose sur les comparaisons de branches et l’inspection statique de fichiers. Il ne remplace pas la vérification des pull requests ouvertes ni une validation par le propriétaire du dépôt.
