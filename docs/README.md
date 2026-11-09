# Documentation MajestiOS

**Index — 6 novembre 2026** · Référentiel V5 source : `evolution-5.0` · PR #38 fusionnée dans `main` · Branche de réalisation du cockpit : `evolution-5.0-admin-cockpit`

La branche `evolution-5.0` porte le référentiel documentaire actuel de MajestiOS. Les versions antérieures restent séparées sur leurs branches sources : `evolution-2.0`, `evolution-3.0` et `evolution-4.0`. Leurs dossiers ne sont pas recopiés dans V5.

## Évolution 6 — lots intégrés

| Document | Rôle |
|---|---|
| [Réputation virtuelle — état d’implémentation du 9 novembre 2026](evolution-6/REPUTATION-VIRTUELLE-ETAT-IMPLEMENTATION-2026-11-09.md) | Compte rendu du lot fusionné par la PR #53 : recherches Google Web/Maps, dossier d’audit et journal en session, vitrine sociale illustrative, limites fonctionnelles, contrôles CI et tests navigateur restant à ajouter |

## Évolution 6 — moteur d'audit Réputation virtuelle

| Document | Rôle |
|---|---|
| [État d'implémentation du 9 novembre 2026](evolution-6/REPUTATION-VIRTUELLE-ETAT-IMPLEMENTATION-2026-11-09.md) | Interface, dossier, journal de consultation et limites |
| [Architecture du moteur d'audit Cheexpeer](evolution-6/REPUTATION-VIRTUELLE-MOTEUR-CHEXPEER-ARCHITECTURE-2026-11-09.md) | Contrat de données, preuves et rapport préparatoire |
| [Orchestration et premier connecteur](evolution-6/REPUTATION-VIRTUELLE-ORCHESTRATION-ET-CONNECTEUR-2026-11-09.md) | Registre interne et vérification du contexte administratif |
| [Edge Function authentifiée](evolution-6/REPUTATION-VIRTUELLE-EDGE-FUNCTION-2026-11-09.md) | Endpoint serveur, contrôles d'accès, CORS et limites avant déploiement |
| [Analyse Cheexpeer fondée sur les preuves](evolution-6/REPUTATION-VIRTUELLE-ANALYSE-CHEXPEER-2026-11-09.md) | Schéma d'analyse, citations obligatoires, contrôle des conclusions et recommandations liées aux constats |

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
| [Vision IA transversale](evolution-5.0/VISION-IA-TRANSVERSALE.md) | Périmètre de Cheexpeer, missions, surveillance, analyse, scoring et gouvernance |
| [Cahier des charges fonctionnel — Cheexpeer](evolution-5.0/CAHIER-DES-CHARGES-CHEXPEER.md) | Identité indépendante du moteur IA, missions de veille et développement commercial, scoring explicable, SEO, rapports, alertes, gouvernance, sécurité et déploiement progressif |
| [Plan stratégique acquisition, circulation, CRM et IA — 8 novembre 2026](evolution-5.0/PLAN-STRATEGIQUE-ACQUISITION-CIRCULATION-CRM-IA-2026-11-08.md) | Audit courant, circulation bidirectionnelle entre rubriques et CRM, gouvernance, identité Cheexpeer indépendante du moteur IA, missions commerciales et périmètre SEO |
| [Matrice de circulation — Immeuble, rubriques, acquisition et CRM — 8 novembre 2026](evolution-5.0/MATRICE-CIRCULATION-RUBRIQUES-CRM-2026-11-08.md) | Routes observées, liens existants, limites du raccordement CRM et parcours bidirectionnels à réaliser et tester |\n| [Contrat commun de transmission — rubriques, Administration et CRM — 8 novembre 2026](evolution-5.0/CONTRAT-COMMUN-TRANSMISSION-RUBRIQUES-ADMIN-CRM-2026-11-08.md) | Contrat transversal : acteurs, finalités, états séparés, transitions, journal immuable, API conceptuelle, sécurité et tests d'acceptation ; spécification non implémentée |
| [Module Administration IA](evolution-5.0/MODULE-ADMIN-IA.md) | Supervision, maintenance, SEO et autonomie encadrée |
| [Architecture des espaces Administration, CRM et Client](evolution-5.0/ARCHITECTURE-ESPACES-ADMIN-CRM-CLIENT.md) | Séparation des espaces, intégration CRM, permissions, métaphores et état de réalisation du cockpit |
| [Lot CRM 04 — navigation Administration / CRM](evolution-5.0/LOT-CRM-ATOMIC-04-NAVIGATION-ADMIN-CRM.md) | Navigation de modules cohérente, séparation des ancres du cockpit et maintien des restrictions par rôle |
| [Lot 05 — couverture lexicale des suggestions APE/NAF](evolution-5.0/LOT-CRM-ATOMIC-05-COUVERTURE-LEXICALE-NAF.md) | Reconnaissance des variantes au pluriel dans les descriptifs de marchés, avec preuves lexicales testées |
| [Lot CRM 06 — indicateurs du CRM dans le cockpit](evolution-5.0/LOT-CRM-ATOMIC-06-INDICATEURS-CRM-COCKPIT.md) | Compteurs en lecture seule des entreprises, contacts et opportunités de l’organisation interne |
| [Mémoire conversationnelle](evolution-5.0/MEMOIRE-CONVERSATIONNELLE-ET-IA.md) | Continuité, recherche et réutilisation contrôlée du contexte |
| [Roadmap et gouvernance](evolution-5.0/ROADMAP-ET-GOUVERNANCE.md) | Phases, critères, validations et autonomie |
| [Audit du panorama et trajectoire 3D](evolution-5.0/AUDIT-PANORAMA-ET-PLAN-3D.md) | État réel du prototype et limites vérifiées |
| [Audit initial et plan de nettoyage](evolution-5.0/AUDIT-INITIAL-ET-PLAN-NETTOYAGE.md) | Constats datés, écarts historiques et rectifications à revalider |
| [Nettoyage documentaire](evolution-5.0/NETTOYAGE-DOCUMENTAIRE.md) | Inventaire, règles de tri et conservation du patrimoine |
| [Maintenance, sauvegardes et continuité](evolution-5.0/MAINTENANCE-ET-CONTINUITE.md) | Protocole permanent de nettoyage Git, points de retour, contrôles, documentation et reprise |
| [Nettoyage des archives historiques](evolution-5.0/NETTOYAGE-ARCHIVES-HISTORIQUES-2026-11-05.md) | Comparaison des empreintes Git et retrait des copies exactes ; statut des huit documents conservés |
| [Cahier des charges — veille stratégique](evolution-5.0/CAHIER-DES-CHARGES-VEILLE-STRATEGIQUE.md) | Spécification de cadrage des signaux, ressources, emploi, immobilier professionnel et raccordement au ciblage commercial |
| [Concept — Publipostage intelligent par QR Code et badge MajestiOS](evolution-5.0/CONCEPT-PUBLIPOSTAGE-QR-CODE-BADGE-VIP-2026-11-06.md) | Orientation stratégique à soumettre aux autres IA : publipostage physique QR complémentaire à l'emailing, badge public/invité/VIP, Accès VIP, sécurité, conformité et MVP pilote |

| [Méthodologie opérationnelle — Audit SEO et Réputation virtuelle](evolution-5.0/METHODOLOGIE-AUDIT-SEO-REPUTATION-VIRTUELLE.md) | Méthode d'audit par ChatGPT puis Cheexpeer : preuves, réputation, SEO, présence locale, concurrence, conversion, feuille de route et indicateurs ; méthode sans dépendance obligatoire aux API Google |
| [Cadrage stratégique CRM, sources et Réputation virtuelle](evolution-5.0/CADRAGE-STRATEGIQUE-CRM-SOURCES-CIBLAGE-REPUTATION-VIRTUELLE-2026-11-06.md) | Ciblage NAF/APE depuis les appels d'offres, détection des nouvelles entreprises, consultation intégrée visée des résultats Web/cartographiques, audit de réputation par Cheexpeer et plan d'assainissement avec actions traçables/QR code |
| [Parcours éditorial de l’immeuble interactif](evolution-5.0/PARCOURS-EDITORIAL-IMMEUBLE-INTERACTIF-2026-11-07.md) | Contenus différenciés pour le RDC et les huit étages, progression commerciale, promesses, slogans et règles d’intégration |
| [Lot CRM — poste de travail Entreprises](evolution-5.0/LOT-CRM-POSTE-ENTREPRISES-2026-11-06.md) | Recherche locale, filtres de qualification et département, limites et prochaines briques du module Entreprises |
| [État des ressources du moteur de Prospection](evolution-5.0/ETAT-RESSOURCES-PROSPECTION-2026-11-07.md) | État réel des connecteurs DINUM, SIRENE, RNE, ADEME et organismes de qualification, avec limites et contrôles exécutés |
| [Préparation de l’environnement technique de Cheexpeer — 8 novembre 2026](evolution-5.0/PREPARATION-ENVIRONNEMENT-CHEXPEER-2026-11-08.md) | État vérifié du projet Supabase, registre des sources, fonctions serveur, écarts de migrations, gouvernance des données et prérequis IA |

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
- Choix du premier moteur IA pouvant alimenter Cheexpeer, conditions d'accès, coûts, évaluations et modalités d'intégration ; les missions et l'identité de Cheexpeer sont déjà cadrées.
- Architecture backend, identité, cloisonnement, stockage, coûts et intégrations.
- SEO : audit continu, veille des moteurs, recommandations et validation des changements.

## Audit des circuits d'information — 8 novembre 2026

[Audit et optimisation des circuits d'information — Immeuble, rubriques, CRM et Administration](evolution-5.0/AUDIT-CIRCUITS-INFORMATION-IMMEUBLE-RUBRIQUES-CRM-ADMIN-2026-11-08.md) — contrôle en lecture seule du schéma Supabase et des politiques RLS, écarts de visibilité et d'habilitation, circuit cible demande → préparation → validation Administration → affectation → restitution → CRM, plan de correction et tests d'acceptation.


## Mapping du contrat de transmission — 8 novembre 2026

[Mapping du contrat de transmission vers l'existant — Supabase et fonctions serveur](evolution-5.0/MAPPING-CONTRAT-TRANSMISSION-SCHEMA-SUPABASE-EDGE-2026-11-08.md) — rapprochement en lecture seule du contrat avec les 15 tables, les politiques et privilèges RLS, les 21 migrations appliquées, les trois fonctions Edge actives et les écarts de versionnement.


## Lot technique Prospection — 8 novembre 2026

[Lot A — fondations partagées de Prospection : DTO, validation et autorisation](evolution-5.0/LOT-A-FONDATIONS-PROSPECTION-DTO-VALIDATION-AUTHZ-2026-11-08.md) — modules partagés ESM, projections DTO en liste blanche, validation des deux parcours, contrôle d'appartenance client avec RLS et tests Node ajoutés. Aucun endpoint ni changement Supabase déployé.

## Endpoint authentifié de Prospection — 8 novembre 2026

[Lot B — premier endpoint authentifié de Prospection](evolution-5.0/LOT-B-ENDPOINT-PROSPECTION-MEMBER-2026-11-08.md) — source du premier endpoint membre, orchestration serveur, normalisation des résultats, validation des filtres, tests simulés et garde-fous avant déploiement.

## Dossier de reprise CRM, Supabase et Prospection — 8 novembre 2026

[Dossier de reprise IA — CRM, Supabase et Prospection](evolution-5.0/DOSSIER-REPRISE-IA-CRM-SUPABASE-PROSPECTION-2026-11-08.md) — synthèse complète de l’existant, des restaurations Git, du modèle CRM, des 21 migrations, des Edge Functions, des habilitations/RLS, des lots A/B/C, des preuves CI, des limites et de la feuille de route détaillée pour la prochaine IA.

## Tests d’intégration Auth/RLS — 8 novembre 2026

[Lot C — banc d’intégration Auth/RLS local](evolution-5.0/LOT-C-BANC-INTEGRATION-AUTH-RLS-LOCAL-2026-11-08.md) — configuration Supabase locale isolée, workflow GitHub Actions, vraies sessions Auth, vérification RLS et limites de couverture avant toute connexion au projet hébergé.


## Réputation virtuelle — moteur Cheexpeer

- [État d'implémentation au 9 novembre 2026](evolution-6/REPUTATION-VIRTUELLE-ETAT-IMPLEMENTATION-2026-11-09.md)
- [Contrat initial du moteur d'audit interne](evolution-6/REPUTATION-VIRTUELLE-MOTEUR-CHEXPEER-ARCHITECTURE-2026-11-09.md)
- [Orchestration et premier connecteur de contexte](evolution-6/REPUTATION-VIRTUELLE-ORCHESTRATION-ET-CONNECTEUR-2026-11-09.md)
