# Documentation MajestiOS

**Index — 4 novembre 2026** · Branche de travail active : `evolution-5.0`

La V5 est la branche de travail active. La branche `evolution-3.0` est conservée intacte comme base de référence et patrimoine fonctionnel ; `evolution-2.0` conserve les références fondatrices et de gouvernance. Le corpus documentaire V4 demandé n'est pas présent dans ce dépôt ; les dossiers historiques disponibles sont des sources à examiner, pas des décisions automatiquement reprises.

## Référentiel actif — MajestiOS 5.0

### Référence canonique

| Document | Rôle |
|---|---|
| [Référence MajestiOS V.5](evolution-5.0/MAJESTIOS-V5-REFERENCE.md) | Source canonique de vision, d'architecture, d'arborescence, d'état réel et de décisions à prendre |
| [Audit de conformité et des liens](evolution-5.0/AUDIT-CONFORMITE-ARCHITECTURE-ET-LIENS.md) | Preuves du contrôle du dépôt, état des routes, résultats et limites de vérification |
| [Audit du lot 2 — navigation fonctionnelle](evolution-5.0/AUDIT-LOT-2-NAVIGATION-FONCTIONNELLE.md) | Parcours de second niveau, corrections vérifiées et contrôles non exécutés |
| [Audit du lot 3 — fonctionnalités des rubriques](evolution-5.0/AUDIT-LOT-3-FONCTIONNALITES.md) | Qualification opérationnelle des rubriques, correction du menu et travaux restant à développer |
| [Audit du lot 4 — moteur de recherche transversal](evolution-5.0/AUDIT-LOT-4-MOTEUR-RECHERCHE.md) | Sources, filtres, pertinence, limites de couverture, CRM et recommandations d'évolution |
| [Audit du lot 5 — architecture CRM et capitalisation](evolution-5.0/AUDIT-LOT-5-ARCHITECTURE-CRM-CAPITALISATION.md) | Données par source, écarts entre prototype et CRM cible, modèle conceptuel proposé et décisions avant persistance |

Les autres documents V5 sont des précisions thématiques subordonnées à la référence centrale. En cas de divergence, appliquer la référence et corriger le document de détail.

### Documents complémentaires

| Document | Rôle |
|---|---|
| [Instructions agents](../AGENTS.md) | Règles canoniques de travail, préservation et validation |
| [README V5](evolution-5.0/README.md) | Entrée du référentiel actif |
| [Vision fondatrice](evolution-5.0/VISION-FONDATRICE.md) | Promesse, doctrine et principes structurants |
| [Arborescence cible](evolution-5.0/ARBORESCENCE-CIBLE-V5.md) | Correspondance immeuble → étages → dossiers → pages |
| [Expérience immersive](evolution-5.0/EXPERIENCE-IMMERSIVE-ET-ETAGES.md) | Panorama, quartier, immeuble, ascenseur et navigation |
| [Architecture fonctionnelle](evolution-5.0/ARCHITECTURE-FONCTIONNELLE-CIBLE.md) | Domaines métier, données et frontières fonctionnelles |
| [Vision IA transversale](evolution-5.0/VISION-IA-TRANSVERSALE.md) | Orchestration, assistants spécialisés, mémoire et gouvernance |
| [Module Administration IA](evolution-5.0/MODULE-ADMIN-IA.md) | Supervision, maintenance, SEO et autonomie encadrée |
| [Mémoire conversationnelle](evolution-5.0/MEMOIRE-CONVERSATIONNELLE-ET-IA.md) | Continuité, recherche et réutilisation contrôlée du contexte |
| [Roadmap et gouvernance](evolution-5.0/ROADMAP-ET-GOUVERNANCE.md) | Phases, critères, validations et autonomie |
| [Audit initial et plan de nettoyage](evolution-5.0/AUDIT-INITIAL-ET-PLAN-NETTOYAGE.md) | État daté, écarts et plan d'assainissement |
| [Nettoyage documentaire](evolution-5.0/NETTOYAGE-DOCUMENTAIRE.md) | Inventaire, conservation, regroupement et archivage |

## Références fonctionnelles héritées — Évolution 3.0

| Document | Rôle |
|---|---|
| [README 3.0](evolution-3.0/README.md) | Contexte de la base de référence |
| [Cahier des charges fonctionnel révisé](evolution-3.0/CAHIER-DES-CHARGES-FONCTIONNEL-REVISION-2026-11-03.md) | Évolutions métier récentes : recherche, publication, compréhension AO et parcours |
| [Migration 3.0](evolution-3.0/MIGRATION-EVOLUTION-3.0.md) | Historique des évolutions et décisions |
| [Architecture API cible](evolution-3.0/ARCHITECTURE-API-CIBLE.md) | Proposition d'architecture technique, non assimilable à un backend déployé |

## Références fondatrices — Évolution 2.0

| Document | Rôle |
|---|---|
| [Cahier des charges fondateur](evolution-2.0/CAHIER-DES-CHARGES-FONDATEUR.md) | Vision et besoins fonctionnels historiques |
| [Gouvernance des interventions](evolution-2.0/GOUVERNANCE-INTERVENTIONS.md) | Préservation, autorisations et gestion des versions |
| [Audit de l'existant](evolution-2.0/AUDIT-EXISTANT-PHASE-1.md) | État historique du prototype |
| [Cartographie des flux](evolution-2.0/CARTOGRAPHIE-FONCTIONNELLE-FLUX.md) | Responsabilités et séparation des circuits métier |

## Hiérarchie documentaire

1. Les décisions explicites et validations récentes du porteur du projet prévalent.
2. Le référentiel V5 définit l'orientation stratégique et la cible de travail actuelle.
3. Les documents 3.0 et 2.0 préservent les acquis fonctionnels et les décisions héritées. Les copies versionnées dans cette branche ont été alignées sur la terminologie V5, sans modification de la branche source `evolution-3.0`.
4. Les audits décrivent un état daté : leurs constats doivent être revalidés avant intervention.
5. Une proposition n'est pas une décision ; une page ou un script présent n'est pas la preuve d'une fonction opérationnelle.
6. Toute contradiction non résolue est inscrite dans le registre d'audit ; aucune IA ne tranche par supposition.

## Règles de conservation

- Inventorier avant de supprimer, déplacer ou renommer.
- Préserver les fonctions métier utiles même si elles ne sont pas visibles comme étage.
- Regrouper les doublons autour d'une référence canonique ; archiver les sources historiques tant que leur valeur n'a pas été évaluée.
- Ne supprimer que les éléments explicitement abandonnés, sans dépendance utile et après vérification des liens, du build et des tests.
- Aucun merge ni déploiement de production sans validation explicite.

## Points stratégiques à instruire

- Nomenclature finale et expérience immersive réellement explorable, avec ascenseur visible et parcours cohérents.
- Périmètre BODACC et catégories privées, à harmoniser entre décisions métier, catalogue et tests.
- Catégories BOAMP après mesure des volumes et validation.
- Circuits distincts entre publication, CRM, veille et prospection.
- Rôle de l'intelligence centrale MajestiOS V.5, permissions des assistants, mémoire et orchestration.
- Architecture backend, identité, cloisonnement, stockage, coûts et intégrations.
- SEO : audit continu, veille des moteurs, recommandations et validation des changements.

## Archives

Les documents de `historique/` et les anciennes versions restent consultables pour retrouver les décisions, exigences et idées utiles. Leur présence ne les rend pas automatiquement actives ; leur contenu ne doit pas être supprimé au seul motif qu'il est ancien.
