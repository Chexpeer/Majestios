# Plan de synthèse documentaire — MajestiOS

## 1. Objectif

Réduire la dispersion documentaire sans perdre les décisions, les preuves techniques ni l'historique. Le but n'est pas de supprimer les anciens documents, mais de distinguer clairement :
- les références stratégiques actuelles ;
- les spécifications métier et techniques ;
- les audits et registres de risques ;
- les comptes rendus datés et archives.

## 2. Nouvelle hiérarchie cible

| Niveau | Document canonique | Rôle |
|---|---|---|
| 1 | `docs/README.md` | Porte d'entrée courte, ordre de lecture et liens |
| 2 | `docs/evolution-9/VISION-STRATEGIQUE-MAJESTIOS-2026-2028.md` | Pourquoi MajestiOS existe, pour qui et quelle différence il vise |
| 3 | `docs/evolution-9/PLAN-REALISATION-ET-MOYENS.md` | Comment réaliser la vision, avec dépendances et critères |
| 4 | `docs/evolution-8/ARCHITECTURE-CIBLE-CRM-TOUT-EN-UN.md` (à consolider) | Architecture produit et technique |
| 5 | Référentiels spécialisés | Cheexpeer, CRM, facturation, PA, Connect, Supabase, sécurité, UX |
| 6 | Registres et audits | Anomalies, preuves, limites et décisions |
| 7 | Documents historiques | Traçabilité, état à une date donnée, propositions anciennes |

## 3. Règles de synthèse

- Un sujet = une référence canonique actuelle.
- Les autres documents renvoient vers la référence canonique et indiquent leur statut : historique, détaillé, supersédé ou à vérifier.
- Ne pas dupliquer les mêmes règles dans plusieurs documents.
- Ne pas supprimer les documents historiques ni leurs preuves sans décision explicite.
- Ne pas déplacer massivement les fichiers avant d'avoir recensé tous les liens internes, workflows, scripts et références externes.
- Conserver les dates, commits, tests et limites qui justifient une décision.
- Une synthèse courte ne remplace jamais un registre d'anomalies ou une spécification de sécurité.

## 4. Documents à rapprocher

### Vision et stratégie
- vision fondatrice V5 ;
- vision IA transversale ;
- vision produit CRM tout-en-un Evolution-7 ;
- phase 2 CRM clients, artisans, facturation électronique et réseau ;
- visibilité IA/GEO et community management ;
- architecture cible Evolution-8.

**Action :** la vision Evolution-9 devient le point de lecture principal. Les sources précédentes restent conservées et sont reliées comme documents historiques ou spécialisés.

### Réalisation et architecture
- architecture fonctionnelle cible V5 ;
- architecture d'exécution Cheexpeer ;
- cahier des charges fonctionnel MajestiOS/Cheexpeer ;
- cahier des charges détaillé Cheexpeer ;
- architecture CRM tout-en-un Evolution-8 ;
- plans UX et parcours.

**Action :** créer des spécifications spécialisées par domaine seulement lorsqu'elles sont nécessaires à la réalisation. Éviter un document unique trop volumineux.

### Audits et anomalies
- registre central Evolution-7 ;
- audit de l'existant Evolution-7 ;
- registre Evolution-8 ;
- dossier central `docs/CRITIQUES`.

**Action :** un index central pointe vers le registre de la branche active. Les anomalies sont reprises avec leur ID et leur preuve, jamais effacées lors d'une synthèse.

## 5. Plan de migration documentaire

1. Geler la liste des documents sources et leurs branches.
2. Identifier les documents canoniques, historiques, contradictoires et redondants.
3. Comparer les décisions explicites du porteur du projet avec les propositions anciennes.
4. Produire la synthèse stratégique et le plan de réalisation.
5. Réécrire l'index `docs/README.md` en page d'orientation concise.
6. Ajouter dans chaque document spécialisé un en-tête de statut et un lien vers sa référence canonique.
7. Vérifier automatiquement tous les liens Markdown locaux avec `node verify-doc-links.js` pour les documents canoniques ;
8. Vérifier que les workflows et scripts n'utilisent pas les anciens chemins supprimés.
9. Ne déplacer ou archiver physiquement qu'après validation des références.
10. Produire un rapport final : conservé, fusionné, remplacé, historique, à arbitrer.

## 6. Règles de qualité

- Pas de promesse produit sans statut explicite.
- Pas de partenaire ou tarif inventé.
- Pas de confusion entre CRM interne, CRM client natif et CRM externe.
- Pas de confusion entre logiciel compatible et plateforme agréée.
- Pas de confusion entre Cheexpeer spécifié, implémenté, déployé et recetté.
- Pas de disparition d'anomalie dans les synthèses.
- Chaque document canonique affiche date, branche, statut et liens vers les preuves.
