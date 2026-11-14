# Méthode de travail MajestiOS — documentation, Test, CRM

Décidée par le propriétaire le 14 novembre 2026. S'applique à tout agent IA et à tout développeur.

## 1. Les trois niveaux

| Niveau | Rôle | Règle |
|---|---|---|
| **Documentation** | Source de vérité, toujours **en avance** sur MajestiOS-Test | Mise à jour avant et pendant chaque évolution, jamais après coup. |
| **MajestiOS-Test** (`qrlnnfjstoeliymxtkbk`) | Laboratoire et **dernier filtre** avant le CRM | Tout s'y essaie d'abord : migrations, droits, parcours, tests. |
| **MajestiOS-CRM** (`qxaghcifdhugfskuscoc`) | Projet réel | Ne reçoit **que** des éléments testés **et validés** sur Test, ajoutés progressivement, sur décision explicite du propriétaire. |

## 2. Chemin d'une évolution

1. Écrire ou mettre à jour la documentation (objectif, risques, plan de retour arrière).
2. Rejouer en local sur base jetable (`tests/sql/`) quand c'est possible.
3. Appliquer sur MajestiOS-Test, vérifier (transaction annulée de préférence), consigner la preuve dans le registre.
4. Marquer l'élément « validé sur Test » dans le suivi de promotion (section 4).
5. Promouvoir vers MajestiOS-CRM, par lots petits, uniquement après décision explicite du propriétaire.

Aucun élément ne saute une étape. Aucune donnée de test n'est jamais écrite sur MajestiOS-CRM.

## 3. Documents à part pour le critique

Les erreurs critiques, corrections prioritaires et alertes spécifiques ne sont pas mélangées à la documentation courante : elles vivent dans [`docs/CRITIQUES/`](CRITIQUES/README.md) (synthèse) et dans le registre Evolution-9 (preuves).

## 4. Suivi de promotion Test → CRM (état au 14/11/2026)

| Élément | Test | CRM | Remarque |
|---|---|---|---|
| Migrations CRM du dépôt | 44 appliquées | 22 appliquées (dernière `20261108181246`) | Retard à résorber par lots validés. |
| CRM-TRG-01 dédoublonnage des triggers | Appliqué, vérifié | Non concerné (un seul trigger par table) | Migration `20261114120100` alignée sur le dépôt. |
| CRM-ACT-01 correctif historique | Appliqué, vérifié | Non concerné pour l'instant (fonction absente) | À inclure dès que `20261109170000` sera promue : **toujours promouvoir `20261114120000` avec elle**. |
| Annonces / relecture | En préparation (branches de test) | Non promu | Recette complète à faire sur Test d'abord. |
| Comptes de test multi-identités | À créer par le propriétaire | — | Alias Gmail + création avec confirmation automatique. |
