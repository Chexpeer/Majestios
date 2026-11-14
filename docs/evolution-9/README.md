# Evolution-9 — stabilisation et consolidation MajestiOS

**Branche active :** `Evolution-9`  
**Mise à jour :** 13 novembre 2026  
**Mission :** corriger les défauts techniques avérés, consigner les risques qui exigent une analyse ou une recette spécifique, et rendre la documentation cohérente sans refondre ni modifier la présentation du site.

## 1. Mandat du lot courant

- Aucune refonte graphique, éditoriale, de navigation ou de parcours.
- Aucune modification des pages HTML ou des feuilles CSS.
- Corrections limitées aux défauts techniques démontrés et aux contrôles CI.
- Pas de clone, de copie partielle ou de branche parallèle : la référence de travail reste cette branche.
- Aucune écriture Supabase distante, modification de migration appliquée, promotion Vercel ou action de production.

Les sujets qui exigent une revue de sécurité, une décision métier ou une recette distante sont consignés dans le registre, sans correctif improvisé.

## 2. Références de travail

1. [AGENTS.md](../../AGENTS.md) — consignes obligatoires.
2. [Dossier des anomalies critiques](../CRITIQUES/README.md) — risques prioritaires.
3. [Index documentaire](../README.md) — hiérarchie générale.
4. [Vision stratégique](VISION-STRATEGIQUE-MAJESTIOS-2026-2028.md) — ambition produit.
5. [Plan de réalisation](PLAN-REALISATION-ET-MOYENS.md) — dépendances et phases.
6. [Plan de synthèse documentaire](PLAN-SYNTHESE-DOCUMENTAIRE.md) — consolidation et statut des sources.
7. [Registre des anomalies](REGISTRE-ANOMALIES-EVOLUTION-9.md) — source détaillée des défauts, preuves et suites.
8. [Audit CRM / Supabase](AUDIT-CRM-SUPABASE-LECTURE-SEULE-2026-11-11.md) — état distant daté, en lecture seule.
9. [Audit de non-régression fonctionnelle](AUDIT-NON-REGRESSION-FONCTIONNELLE-EVOLUTION-7.md) — matrice de conservation.

## 3. État du dépôt

- Manifeste de publication : **93 ressources**, dont **39 pages HTML**.
- Contrat de navigation contrôlé par le vérificateur : **21 entrées secondaires / 19 destinations uniques**.
- Branche de référence : `Evolution-9`; le commit courant doit être relu avant chaque intervention.
- Le build et les contrôles CI doivent être rattachés au SHA exact testé. Une CI verte sur un commit antérieur ne valide pas les commits ultérieurs.

## 4. État courant et corrections

L'état à jour (site, branche de test, anomalies critiques, trajectoire) est dans [la synthèse](../SYNTHESE-MAJESTIOS.md). Les corrections techniques du 13 novembre, les dossiers complexes consignés et le recontrôle Supabase du 13 novembre sont archivés dans [le journal Evolution-9](../historique/JOURNAL-EVOLUTION-9-2026-11-13.md).

## 7. Conditions de clôture

1. Les workflows concernés sont terminés sur le même SHA final.
2. Build, architecture, site, liens documentaires et tests ciblés réussissent.
3. Les risques non corrigés ont un identifiant, un propriétaire de décision, des prérequis et un critère de clôture.
4. Aucun parcours, page, contenu, style ou fonctionnalité existante n'a été supprimé ou remanié dans ce lot.
5. Aucun changement distant ou production n'a été effectué.
