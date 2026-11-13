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

## 4. Corrections techniques du lot du 13 novembre

| Sujet | Correction | Preuve / limite |
|---|---|---|
| Ressource de build supprimée | Le blob Git exact de la ressource requise a été restauré depuis le parent du commit qui l'avait supprimée. | Build et vérificateur d'architecture passés dans le workflow anti-régression sur le commit `6ac81d8` ; ce n'est pas une recette visuelle. |
| Géocodage par code postal | La regex de cinq chiffres de `company-targeting.js` a été corrigée ; le test vérifie maintenant le paramètre officiel `codePostal=72000`. | Test ciblé passé dans le workflow anti-régression sur `6ac81d8` ; le workflow complet du site doit confirmer les contrôles supplémentaires. |
| Vérificateur d'architecture | Le motif de détection des sélecteurs CSS historiques a été corrigé pour interpréter les points et classes comme prévu. | `verify-architecture.js` passé dans le workflow anti-régression sur `6ac81d8`. |
| CI anti-régression | Le workflow inclut désormais `Evolution-9` dans ses déclencheurs push et pull request. | Workflow anti-régression réussi sur `6ac81d8`. |
| Contrat Prospection | Le workflow de contrat déclenche aussi sur push Evolution-9. | Workflow de contrat réussi sur le commit `26c1ef9`. |
| Syntaxe Edge | Le workflow principal vérifie aussi les trois fonctions Edge identifiées comme déployées dans l'audit : recherche officielle, import officiel et bootstrap admin. | Contrôle ajouté ; résultat du workflow principal à confirmer sur le dernier SHA. |

Aucun fichier HTML/CSS, libellé public, parcours, menu, donnée distante ou configuration Supabase n'a été modifié dans ce lot. La restauration de la ressource a rétabli le blob Git antérieur ; elle n'a pas créé un nouveau visuel.

## 5. Dossiers complexes consignés — aucune correction distante

| Sujet | État | Traitement requis |
|---|---|---|
| Triggers d'intégrité CRM en doublon | La chaîne de migrations crée deux noms de triggers par table ; l'état réel distant doit être revérifié. | Comparer migrations, triggers présents et fonctions appelées ; préparer une migration de nettoyage seulement après revue et autorisation. |
| Policies CRM et frontière VIP | Une migration retire les anciennes policies VIP et installe des policies tenant-scoped ; cela ne prouve pas à lui seul une exposition, mais exige une vérification des helpers et rôles. | Tester owner/admin/member et les refus inter-organisations sur les deux périmètres ; ne rien appliquer à distance. |
| Policy UPDATE de `crm_reminders` | Une policy UPDATE est créée puis le privilège UPDATE est révoqué pour `authenticated`. | Clarifier la règle attendue et la cohérence policy/GRANT ; ne pas réécrire les migrations historiques. |
| Bootstrap admin | Le code contient une adresse administrateur codée en dur et un CORS `*`. | Définir une configuration serveur et une liste d'origines autorisées sans risquer de verrouiller l'accès initial ; revue de sécurité avant modification. |
| Navigation statique et contenu | Les menus HTML historiques et certains libellés ne sont pas homogènes ; le contrôleur commun masque une partie des écarts. | Inventaire page par page et correction seulement après autorisation d'un lot site distinct. |
| Fichiers semblant orphelins | Des feuilles et scripts ne sont pas publiés ou chargés directement. | Tracer imports, chargements dynamiques, workflows et usages serveur avant toute suppression. |

Les constats, identifiants et critères de clôture sont consignés dans le [registre détaillé](REGISTRE-ANOMALIES-EVOLUTION-9.md). Les constats Supabase de l'audit du 11 novembre sont datés : ils ne remplacent pas une nouvelle lecture des environnements.

## 6. État produit à ne pas embellir

- Le frontend est un site statique ; la présence d'un formulaire ou d'un module dans Git ne prouve pas son raccordement.
- Le CRM interne est distinct du futur CRM client multi-tenant.
- Les projets `majestios-crm` et `MajestiOS-Test` ont des rôles différents ; leurs migrations ne doivent pas être synchronisées mécaniquement.
- Le provisionnement OTP, la recette multi-tenant et les droits SQL du CRM principal ne sont pas réputés validés sans preuve de bout en bout.
- Le worker Cheexpeer et ses connecteurs doivent être décrits selon le code réellement déployé, pas seulement selon les fichiers Git.
- La facturation électronique et la connexion à une PA restent des cibles de phase ultérieure.

## 7. Conditions de clôture

1. Les workflows concernés sont terminés sur le même SHA final.
2. Build, architecture, site, liens documentaires et tests ciblés réussissent.
3. Les risques non corrigés ont un identifiant, un propriétaire de décision, des prérequis et un critère de clôture.
4. Aucun parcours, page, contenu, style ou fonctionnalité existante n'a été supprimé ou remanié dans ce lot.
5. Aucun changement distant ou production n'a été effectué.
