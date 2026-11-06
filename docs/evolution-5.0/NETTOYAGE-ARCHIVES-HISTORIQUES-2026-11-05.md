# Nettoyage des archives historiques — 5 novembre 2026

## Périmètre et méthode

Comparaison des 35 fichiers présents dans `docs/historique/` sur la branche `evolution-5.0` avec les arbres documentaires des branches sources `evolution-2.0`, `evolution-3.0` et `evolution-4.0`, à partir des identifiants de blobs Git.

## Résultat

| Classe | Nombre | Traitement |
|---|---:|---|
| Copies strictement identiques à une source historique | 27 | Supprimées de V5 ; originales préservées sur leurs branches sources |
| Fichiers modifiés par rapport à la source | 6 | Conservés provisoirement pour rapprochement avec la doctrine V5 |
| Fichiers sans équivalent dans les branches sources comparées | 2 | Conservés comme ressources historiques |

Les 27 suppressions sont limitées aux copies locales du dossier `docs/historique/`. Elles ne suppriment aucune branche ni aucun fichier des branches V2, V3 ou V4.

## Fichiers conservés

1. `DOCUMENTATION-REPRISE-IA-MAJESTIOS.md`
2. `DOSSIERS-MAJESTIOS.md`
3. `MATRICE-TRAÇABILITE-EXIGENCES-MAJESTIOS.md`
4. `PLAN-CHANTIER-RECHERCHE-DONNEES-CRM.md`
5. `SPECIFICATION-FONCTIONNELLE-DETAILLEE-MAJESTIOS.md`
6. `dossiers/10-business-intelligence/README.md`
7. `referentiel-connaissances/CONSIGNES-ASSISTANTS-IA.md`
8. `referentiel-connaissances/README.md`

Les six fichiers modifiés ne sont pas présumés à jour : leurs différences peuvent contenir des compléments utiles, mais aussi des formulations ou statuts obsolètes. Ils restent isolés sous le statut d'archives jusqu'à consolidation explicite dans les documents V5. Les deux fichiers sans équivalent doivent être examinés avant toute éventuelle suppression.

## Garanties

- Aucun fichier applicatif, visuel, HTML, CSS ou JavaScript n'a été modifié.
- Aucune branche source V2, V3 ou V4 n'a été modifiée.
- Aucun merge et aucun déploiement n'ont été déclenchés.
- La documentation V5 reste la référence courante ; les archives restantes ne sont pas une source de doctrine active.

Le détail des archives restantes et leur statut est consigné dans [README des archives](../historique/README.md).
