# MajestiOS — documentation de référence

**Branche de travail :** `Evolution-9`  
**Mise à jour :** 13 novembre 2026  
**Rôle :** point d'entrée documentaire court. Les preuves, décisions détaillées et anomalies restent dans leurs référentiels spécialisés.

## 1. Ordre de lecture

1. [Consignes de travail](../AGENTS.md) — mandat, branches, sécurité et méthode.
2. [Dossier des anomalies critiques](CRITIQUES/README.md) — risques bloquants et règles de traitement.
3. [Guide de prise en main IA](GUIDE-PRISE-EN-MAIN-IA-MAJESTIOS.md) — onboarding et limites de preuve.
4. [Référentiel Evolution-9](evolution-9/README.md) — état courant, références et priorités.
5. [Registre des anomalies Evolution-9](evolution-9/REGISTRE-ANOMALIES-EVOLUTION-9.md) — suivi détaillé, preuves et statuts.
6. Lire ensuite la spécification ou l'audit correspondant au sujet.

## 2. Vision produit

MajestiOS vise à réunir le développement commercial, la qualification d'entreprises, le CRM, la gestion quotidienne et, dans une phase ultérieure, la facturation électronique et l'accompagnement intelligent.

**Parcours cible :** Détecter → Comprendre → Qualifier → Décider → Agir → Gérer → Facturer → Capitaliser.

Cette formulation décrit une ambition produit. Elle ne signifie pas que tous les modules ou connecteurs sont déjà disponibles.

## 3. Références canoniques

| Sujet | Référence | Statut / rôle |
|---|---|---|
| Vision et positionnement | [Vision stratégique 2026–2028](evolution-9/VISION-STRATEGIQUE-MAJESTIOS-2026-2028.md) | Référence stratégique |
| Réalisation | [Plan de réalisation et moyens](evolution-9/PLAN-REALISATION-ET-MOYENS.md) | Phases, dépendances, moyens et critères |
| Architecture cible | [Architecture CRM tout-en-un](evolution-8/ARCHITECTURE-CIBLE-CRM-TOUT-EN-UN.md) | Référence détaillée héritée, à consolider avant toute réalisation nouvelle |
| Facturation | [Spécification CRM et facturation électronique](evolution-9/SPECIFICATION-CIBLE-FACTURATION-CRM-ELECTRONIQUE.md) | Cible phase 2 ; aucun module PA opérationnel démontré |
| Cheexpeer | [Cartographie fonctionnelle](evolution-9/CARTOGRAPHIE-FONCTIONNELLE-TRANSVERSALE-CHEEXPEER.md) et [audit des interfaces](evolution-9/AUDIT-INTERFACES-CHEEXPEER-2026-11-11.md) | Cible et état partiel ; ne pas confondre avec le guide conversationnel actuel |
| CRM / Supabase | [Audit en lecture seule](evolution-9/AUDIT-CRM-SUPABASE-LECTURE-SEULE-2026-11-11.md) | État daté des deux projets ; à recontrôler avant toute action distante |
| Non-régression | [Audit fonctionnel Evolution-7](evolution-9/AUDIT-NON-REGRESSION-FONCTIONNELLE-EVOLUTION-7.md) | Référence de conservation des fonctions et parcours |
| SEO | [Audit SEO Evolution-9](evolution-9/AUDIT-SEO-EVOLUTION-9.md) | Audit partiel ; les contrôles non réalisés restent ouverts |
| État réel et trajectoire | [État réel du site et trajectoire — 14 novembre 2026](evolution-9/ETAT-REEL-SITE-ET-TRAJECTOIRE-2026-11-14.md) | Écarts entre la documentation et la branche de test `test-ecriture-claude` (menu, fonds, BODACC, espace personnel) et feuille de route |
| Synthèse documentaire | [Plan de synthèse documentaire](evolution-9/PLAN-SYNTHESE-DOCUMENTAIRE.md) | Hiérarchie, consolidation effectuée et travaux restants |

## 4. État réel — distinguer code, déploiement et recette

### Présent dans le dépôt
- Frontend statique HTML/CSS/JavaScript, manifeste de publication et scripts de construction.
- Pages de recherche, rubriques commerciales et interfaces privées.
- Code du CRM interne et fondations Supabase (migrations, fonctions Edge et contrats).
- Premiers composants et contrats de Cheexpeer.

### Non démontré comme opérationnel de bout en bout
- CRM client multi-tenant ouvert aux entreprises pilotes.
- Provisionnement membre OTP complet.
- Historisation et droits SQL du CRM principal validés par une recette multi-rôles.
- Cycle devis → prestation → facture → transmission PA → règlement.
- Connecteurs CRM externes industrialisés.
- Agent Cheexpeer exécutant des missions métier avec approbation et traçabilité complètes.

Le guide conversationnel présent sur le site est un assistant local de première génération ; il ne doit pas être présenté comme l'agent Cheexpeer cible.

## 5. Repères vérifiés dans le dépôt au 13 novembre

- `site-files.json` déclare **93 ressources**, dont **39 pages HTML**.
- `verify-architecture.js` contrôle **21 entrées secondaires** et **19 destinations uniques**.
- Les nombres 81 et 86 rencontrés dans des documents antérieurs correspondent à des états datés ou à des compteurs non réconciliés ; ils ne doivent pas être présentés comme le manifeste actuel.
- **Branche de test `test-ecriture-claude` (14 novembre) :** 108 ressources dont 39 pages HTML ; contrat de menu **17 entrées / 17 destinations, 5 rubriques (validé le 14 novembre)**. Ces chiffres ne s'appliquent pas à `Evolution-9`, restée inchangée ; voir [État réel du site et trajectoire — 14 novembre 2026](evolution-9/ETAT-REEL-SITE-ET-TRAJECTOIRE-2026-11-14.md).
- Une présence dans Git ne prouve ni déploiement Supabase, ni configuration distante, ni recette fonctionnelle.

## 6. Règles de vérité

- Distinguer systématiquement : proposition, décision validée, spécification, code présent, build, déploiement et recette.
- Ne pas annoncer MajestiOS comme Plateforme Agréée ; une transmission réglementaire devra passer par une PA partenaire.
- Ne pas promettre un connecteur universel à tous les CRM externes.
- Ne pas confondre CRM interne MajestiOS et futur CRM client.
- Ne pas synchroniser automatiquement les deux projets Supabase : leurs rôles et leurs migrations doivent être comparés avant toute décision.
- Une anomalie reste ouverte tant que ses critères de clôture et ses preuves ne sont pas satisfaits.

## 7. Historique documentaire

Les dossiers Evolution-5.0 à Evolution-8 sont conservés comme sources historiques, audits ou spécifications spécialisées. Ils ne sont ni supprimés ni déplacés par la synthèse. En cas de contradiction, privilégier la décision la plus récente effectivement validée, après vérification de sa branche et de sa preuve.
