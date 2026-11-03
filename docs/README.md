# Documentation MajestiOS

**Index — 3 novembre 2026** · Branche `evolution-2.0`

Documentation concise de référence. Le porteur du projet est seul à valider les décisions.

## Documents actifs

| Document | Rôle |
|---|---|
| [`AGENTS.md`](../AGENTS.md) | Instructions communes et méthode obligatoire pour les agents |
| [Gouvernance des interventions](evolution-2.0/GOUVERNANCE-INTERVENTIONS.md) | Règles validées : audit préalable, alertes, autorisations, méthode sûre et gestion des versions |
| [Cahier des charges fondateur](evolution-2.0/CAHIER-DES-CHARGES-FONDATEUR.md) | Vision, besoins, décisions validées et feuille de route |
| [Audit de l'existant — phase 1](evolution-2.0/AUDIT-EXISTANT-PHASE-1.md) | État constaté du prototype, écarts, risques et points non vérifiés |
| [Cartographie fonctionnelle des flux](evolution-2.0/CARTOGRAPHIE-FONCTIONNELLE-FLUX.md) | Référence cible : responsabilités, circulation des informations et règles de séparation |

## Hiérarchie et entretien

1. Une décision explicite du porteur du projet prévaut.
2. Les décisions récentes validées, la feuille de route active et les documents visionnaires validés priment ; les documents actifs prévalent sur les archives historiques.
3. Un audit décrit un état daté : le vérifier avant de s'y fier.
4. Toute contradiction est signalée pour arbitrage ; aucune IA ne tranche par supposition.
5. Garder les documents actifs courts, sans répétition. Mettre à jour le document de référence concerné dès qu'une décision ou un changement significatif intervient.
6. La documentation historique est une archive de travail, non une source de décisions. Ne reprendre aucun contenu sans comparaison et validation.

## Contradictions et décisions encore ouvertes

- Les cinq catégories BOAMP restent à choisir après mesure des volumes réels.
- Les règles de dépôt, validation, modération et durée de vie des annonces utilisateurs restent à spécifier.
- Les règles d'exploitation de ces annonces dans le CRM, la Veille et la prospection restent à cadrer.
- La cartographie détaillée des statuts, déclencheurs, contrôles et droits reste à valider.
- La consultation/cache de Cadremploi, France Travail et APEC et leur transmission à la Veille sont différées ; à réexaminer ultérieurement.

## Archive

Les anciens documents sont conservés dans [`historique/`](historique/) comme matière de référence. Ils peuvent contenir des propositions anciennes ou contradictoires : ne pas les appliquer sans arbitrage.

## Contrôle de publication

La documentation reste dans `docs/` et ne doit pas être intégrée au site publié. Le contrôle `verify-architecture.js` encadre cette séparation.
