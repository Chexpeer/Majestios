# Correctif ciblé — navigation du CRM interne

**Date :** 6 novembre 2026  
**Branche :** `evolution-5.0-admin-cockpit`

## Constat

La page `crm.html` présentait deux liens de retour identiques vers l'administration générale : un dans l'en-tête et un dans le pied de page. Cette duplication créait deux repères concurrents pour une même destination, alors que le CRM doit rester clairement situé comme module interne du poste de commandement.

Le balisage contenait également les deux caractères littéraux `\\n` entre le bloc des relances persistantes et la grille des échéances, au lieu d'un simple saut de ligne HTML.

## Correction

- conservation d'un seul retour « Administration générale » dans l'en-tête du CRM ;
- suppression du lien de retour redondant dans le pied de page ;
- pied de page conservé comme repère institutionnel, sans navigation concurrente ;
- remplacement de la séquence littérale `\\n` par un vrai retour à la ligne ;
- clarification du titre et de la description : CRM interne rattaché à l'administration générale.

## Périmètre préservé

Aucun changement de `crm-page.js`, `crm-client.js`, configuration Supabase, table, migration, politique RLS, fonction Edge ou donnée. Aucun changement de l'immeuble interactif, de ses ressources, liens ou zones. Aucun déploiement ni fusion vers `main`.

## Contrôle anti-régression ajouté

Le test `tests/crm-navigation-contract.test.cjs` vérifie qu'il n'existe qu'un seul lien vers l'administration, qu'il se trouve dans l'en-tête, que le pied de page ne le duplique pas, que la séquence littérale `\\n` est absente et que le module `crm-page.js` reste chargé.

**Statut :** correctif ciblé enregistré sur la branche de travail ; exécution CI à confirmer après publication du commit.
