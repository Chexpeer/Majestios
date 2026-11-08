# Lot 05 — Correction de couverture lexicale des suggestions APE/NAF

**Date :** 8 novembre 2026  
**Branche :** `feature/crm-atomic-integration`  
**Point de départ :** `b6a2ecb3ca2ee828e9701baf2ba24c162e19e5af`  
**Périmètre :** correction ciblée du vocabulaire de la règle électrique 43.21A et renforcement du test de descriptif. Aucun changement aux sources de données, au ciblage d'entreprises ou au CRM.

## Diagnostic établi

Le test CI fournit un marché dont le titre est générique (« Réhabilitation d’un bâtiment public ») et dont le descriptif mentionne « installations électriques », « remplacement des luminaires » et « réseaux électriques ». Le moteur normalise les accents, mais compare ensuite les expressions lexicales sous forme exacte. Les mots-clés historiques « installation electrique » et « reseau electrique » au singulier ne reconnaissaient pas leurs formes plurielles. Le test échouait donc malgré la présence d'indices techniques pertinents dans le descriptif.

## Correction

- Ajout des expressions « installations electriques », « reseaux electriques », « mise en conformite des reseaux electriques » et « remplacement des luminaires » à la règle 43.21A.
- Conservation des mots-clés existants : aucune suppression ni modification des autres règles.
- Renforcement du test pour vérifier les deux formes plurielles et le cumul d'au moins trois indices explicables.
- Mise à jour de la référence V5 : les suggestions sont lexicales, indicatives et ne constituent pas une preuve de compétence.

## Sécurité et limites

- Aucun appel réseau, aucune collecte, aucune transmission et aucune écriture CRM déclenchés par ces suggestions.
- Aucun changement de code APE/NAF officiel, de données entreprise ou de qualification métier.
- Les suggestions restent des pistes à vérifier par une personne ; le code APE/NAF ne prouve pas la compétence ni l'éligibilité.

## Vérifications

- GitHub Actions, run `42455599604` : `tests/naf-suggestions.test.cjs` réussi ; le build a copié les 70 fichiers du manifeste sans différence avec les sources.
- Le workflow s'arrête ensuite dans `verify-architecture.js` sur six incohérences de navigation/architecture listées dans le lot 06. Les tests ciblés et le build sont donc validés ; l'architecture générale reste non validée.
- Aucun test navigateur, contrôle Supabase réel ou test d'intégration API n'a été exécuté après cet arrêt.

## Point de retour

Le commit parent `b6a2ecb3ca2ee828e9701baf2ba24c162e19e5af` est conservé comme point de retour ; la mise à jour sera un commit descendant sans réécriture d'historique.
