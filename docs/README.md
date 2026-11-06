# Documentation MajestiOS

**Index — 5 novembre 2026** · Référentiel V5 source : `evolution-5.0` · Reconstruction de livraison en revue : `evolution-5.0-clean-preview` (PR #38)

La branche `evolution-5.0` porte le référentiel documentaire actuel de MajestiOS. Les versions antérieures restent séparées sur leurs branches sources : `evolution-2.0`, `evolution-3.0` et `evolution-4.0`. Leurs dossiers ne sont pas recopiés dans V5.

## Référentiel actif — MajestiOS V.5

### Référence canonique

| Document | Rôle |
|---|---|
| [Référence MajestiOS V.5](evolution-5.0/MAJESTIOS-V5-REFERENCE.md) | Source canonique de vision, d'architecture, d'arborescence, d'état réel et de décisions à prendre |
| [Guide autonome de reprise IA](evolution-5.0/GUIDE-REPRISE-IA-MAJESTIOS-V5.md) | Dossier autonome pour reprendre le projet sans perdre la vision, les décisions, les preuves et les limites |
| [Filiation documentaire V2 → V5](evolution-5.0/FILIATION-DOCUMENTAIRE-V2-A-V5.md) | Chronologie vérifiée, sources par branche, continuité des décisions et rectification de l'erreur sur V4 |
| [Audit de conformité et des liens](evolution-5.0/AUDIT-CONFORMITE-ARCHITECTURE-ET-LIENS.md) | Preuves du contrôle du dépôt, routes, résultats, rectificatif documentaire et limites de vérification |
| [Audit du lot 2 — navigation fonctionnelle](evolution-5.0/AUDIT-LOT-2-NAVIGATION-FONCTIONNELLE.md) | Parcours de second niveau, corrections vérifiées et contrôles non exécutés |
| [Audit du lot 3 — fonctionnalités des rubriques](evolution-5.0/AUDIT-LOT-3-FONCTIONNALITES.md) | Qualification opérationnelle des rubriques, correction du menu et travaux restant à développer |
| [Audit du lot 4 — moteur de recherche transversal](evolution-5.0/AUDIT-LOT-4-MOTEUR-RECHERCHE.md) | Sources, filtres, pertinence, limites de couverture, CRM et recommandations d'évolution |
| [Audit du lot 5 — architecture CRM et capitalisation](evolution-5.0/AUDIT-LOT-5-ARCHITECTURE-CRM-CAPITALISATION.md) | Données par source, écarts entre prototype et CRM cible, modèle conceptuel proposé et décisions avant persistance |

### Documents complémentaires V5

| Document | Rôle |
|---|---|
| [Instructions agents](../AGENTS.md) | Règles canoniques de travail, préservation et validation |
| [README V5](evolution-5.0/README.md) | Entrée du référentiel actif |
| [Vision fondatrice](evolution-5.0/VISION-FONDATRICE.md) | Promesse, doctrine et principes structurants |
| [Arborescence cible](evolution-5.0/ARBORESCENCE-CIBLE-V5.md) | Correspondance immeuble → étages → dossiers → pages |
| [Expérience immersive](evolution-5.0/EXPERIENCE-IMMERSIVE-ET-ETAGES.md) | Panorama, quartier, immeuble, ascenseur et navigation |
| [Architecture fonctionnelle](evolution-5.0/ARCHITECTURE-FONCTIONNELLE-CIBLE.md) | Domaines métier, données et frontières fonctionnelles |
| [Vision IA transversale](evolution-5.0/VISION-IA-TRANSVERSALE.md) | Intelligence centrale, orchestration, capacités transversales et gouvernance |
| [Module Administration IA](evolution-5.0/MODULE-ADMIN-IA.md) | Supervision, maintenance, SEO et autonomie encadrée |
| [Architecture des espaces Administration, CRM et Client](evolution-5.0/ARCHITECTURE-ESPACES-ADMIN-CRM-CLIENT.md) | Séparation des espaces, intégration CRM, permissions, métaphores et état de réalisation du cockpit |
| [Mémoire conversationnelle](evolution-5.0/MEMOIRE-CONVERSATIONNELLE-ET-IA.md) | Continuité, recherche et réutilisation contrôlée du contexte |
| [Roadmap et gouvernance](evolution-5.0/ROADMAP-ET-GOUVERNANCE.md) | Phases, critères, validations et autonomie |
| [Audit du panorama et trajectoire 3D](evolution-5.0/AUDIT-PANORAMA-ET-PLAN-3D.md) | État réel du prototype et limites vérifiées |
| [Audit initial et plan de nettoyage](evolution-5.0/AUDIT-INITIAL-ET-PLAN-NETTOYAGE.md) | Constats datés, écarts historiques et rectifications à revalider |
| [Nettoyage documentaire](evolution-5.0/NETTOYAGE-DOCUMENTAIRE.md) | Inventaire, règles de tri et conservation du patrimoine |
| [Maintenance, sauvegardes et continuité](evolution-5.0/MAINTENANCE-ET-CONTINUITE.md) | Protocole permanent de nettoyage Git, points de retour, contrôles, documentation et reprise |
| [Nettoyage des archives historiques](evolution-5.0/NETTOYAGE-ARCHIVES-HISTORIQUES-2026-11-05.md) | Comparaison des empreintes Git et retrait des copies exactes ; statut des huit documents conservés |
| [Cahier des charges — veille stratégique](evolution-5.0/CAHIER-DES-CHARGES-VEILLE-STRATEGIQUE.md) | Spécification de cadrage des signaux, ressources, emploi, immobilier professionnel et raccordement au ciblage commercial |

## Archives thématiques

Le dossier `historique/` conserve des spécifications et ressources thématiques utiles à la compréhension du projet. Il ne constitue pas un substitut aux branches sources V2, V3 ou V4 et ne doit pas être interprété comme une doctrine active sans rapprochement avec la référence V5.

## Hiérarchie documentaire

1. Les décisions explicites et validations récentes du porteur du projet prévalent.
2. `docs/evolution-5.0/MAJESTIOS-V5-REFERENCE.md` est la référence canonique actuelle.
3. Le document de filiation explique l'origine des exigences et les changements de version ; les documents sources antérieurs restent sur leurs branches.
4. Les audits décrivent un état daté : leurs constats doivent être revalidés avant intervention.
5. Une proposition n'est pas une décision ; une page ou un script présent n'est pas la preuve d'une fonction opérationnelle.
6. Toute contradiction non résolue est inscrite dans le registre d'audit ; aucune IA ne tranche par supposition.

## Règles d'entretien et de continuité

Le nettoyage, les sauvegardes et la mise à jour documentaire sont obligatoires à chaque évolution importante. Le protocole détaillé est défini dans [Maintenance, sauvegardes et continuité](evolution-5.0/MAINTENANCE-ET-CONTINUITE.md). Les références de branche et de commit doivent être datées et revalidées avant toute reprise.

## Règles de conservation

- Inventorier avant de supprimer, déplacer ou renommer.
- Préserver les fonctions métier utiles même si elles ne sont pas visibles comme étage.
- Regrouper les doublons autour d'une référence canonique sans déplacer les sources historiques hors de leurs branches.
- Ne supprimer que les éléments explicitement abandonnés, sans dépendance utile et après vérification des liens, du build et des tests.
- Aucun merge ni déploiement de production sans validation explicite.

## Points stratégiques à instruire

- Nomenclature finale et expérience immersive réellement explorable, avec ascenseur visible et parcours cohérents.
- Périmètre BODACC et catégories privées, à harmoniser entre décisions métier, catalogue et tests.
- Catégories BOAMP après mesure des volumes et validation.
- Circuits distincts entre publication, CRM, veille et prospection.
- Rôle de l'intelligence centrale MajestiOS V.5, permissions, mémoire et orchestration.
- Architecture backend, identité, cloisonnement, stockage, coûts et intégrations.
- SEO : audit continu, veille des moteurs, recommandations et validation des changements.
