# Dossier d'accueil de Cheexpeer — 14 novembre 2026

Objectif du propriétaire : Cheexpeer sera l'administrateur du site ; il doit trouver MajestiOS dans son meilleur état. Ce dossier dit **ce qu'il trouvera**, **ce qui est prêt**, **ce qui manque** et **ses limites**. Méthode : [documentation → Test → CRM](../METHODE-DE-TRAVAIL-DOCUMENTATION-TEST-CRM.md).

## 1. État réel constaté sur MajestiOS-Test (lecture seule, 14/11)

| Élément | Constat | Écart documentaire corrigé |
|---|---|---|
| API de soumission, d'approbation, de lecture | **Déployées et actives** sur Test (`cheexpeer-mission-submit`, `-approval-decision`, `-mission-read`, JWT vérifié) | Les documents du 11/11 les disaient « absentes » / « non déployées » |
| Pont du worker | Déployé sous le nom `cheexpeer-worker` ; le dépôt le nomme `cheexpeer-worker-bridge` | **Écart de nom à réconcilier** (CHX-01) |
| Registre des outils | 2 outils, **tous deux désactivés** : `test_executor`, `worker_self_check` | `worker_self_check` est bien enregistré (la spec disait « absent ») |
| Type de mission accepté par l'API | **`readiness_probe` uniquement**, autonomie 0 | **Décision du propriétaire (14/11)** : `worker_self_check` reste désactivé et non soumettable jusqu'à la recette |
| Missions déjà présentes | 5 (issues de tests antérieurs) | À identifier avant la recette (CHX-03) |
| Dernière migration | `20261114215058` | — |
| Fournisseur IA | **Anthropic (Claude), choisi, branché et validé** : adaptateur natif Messages API ; test réel réussi le 14/11 sur Test (audit réputation, 4 constats étayés, `claude-sonnet-5-5`). Clé enregistrée par le propriétaire ; ancienne clé révoquée | Mon premier jet le disait « non configuré » : corrigé (registre §91) |
| Worker hébergé | Non installé | Inchangé |

## 2. Ce que Cheexpeer trouvera sur le site

- **Centre de commande** `admin-cheexpeer.html` (nouveau, branche `test-ecriture-claude`) : soumettre un diagnostic, approuver ou refuser, suivre le statut, le résultat et l'historique. Reliée aux 3 API de Test. Bannière honnête : « Cheexpeer n'est pas encore en service ».
- Lien « Cheexpeer » dans la cabine de pilotage.
- Garde-fous visibles : autonomie 0, validation humaine obligatoire, aucun effet externe ; l'identité de l'acteur n'est **jamais** envoyée par le navigateur (le serveur la déduit du jeton).
- Un site cohérent : charte harmonisée, navigation, liens vérifiés, CI complète.
- Un CRM dont les droits et l'intégrité sont testés (44 scénarios, voir chapitre 100 du registre).

## 3. Ce qui manque avant son arrivée (ordre recommandé)

1. **Comptes de test** multi-identités (propriétaire, à faire demain) — prérequis de toute recette d'accès.
2. **Fournisseur IA** : déjà fait pour l'audit de réputation. Reste à : fixer un plafond de dépense mensuel sur la console Anthropic, et prévoir une **clé distincte** pour le worker (et plus tard pour la production).
3. **Origine autorisée** : la variable `ALLOWED_ORIGINS` des API doit contenir l'adresse de la page (aperçu Vercel ou domaine final) sinon le navigateur est refusé (CHX-04, à vérifier par le propriétaire).
4. **Worker** hébergé séparément, avec ses secrets propres (jamais ceux d'un utilisateur).
5. **Recette §8 de la spécification** : owner/admin, member, externe, inter-organisations, idempotence, bail expiré. Activation du registre **seulement après** réussite.
6. **Réconcilier** le nom du pont (CHX-01).
7. Plus tard : chat Cheexpeer, lecture CRM contrôlée, connecteur GitHub en lecture, archivage et capitalisation (voir `LOT-CHEEXPEER-INTEGRATION` §7).

## 4. Limites permanentes de Cheexpeer

Aucun merge, déploiement ni changement de production sans décision explicite du propriétaire ; aucune écriture sur MajestiOS-CRM ; aucune donnée sensible dans les journaux ; tout effet externe passe par une validation humaine ; toute action est historisée (date, acteur, motif, statut, preuve).

## 5. Points ouverts

| ID | Sujet | Statut |
|---|---|---|
| CHX-01 | Nom du pont : `cheexpeer-worker` (distant) ≠ `cheexpeer-worker-bridge` (dépôt) | Ouvert |
| CHX-02 | `readiness_probe` (API) vs `worker_self_check` (spécification, registre) | **Clos** : décision du 14/11, `readiness_probe` seul soumettable |
| CHX-03 | 5 missions de test existantes sur Test à qualifier et purger après accord | Ouvert |
| CHX-04 | `ALLOWED_ORIGINS` et CORS pour l'aperçu | À vérifier |
| CHX-05 | Page pas encore recettée avec un vrai compte (tests navigateur sur API simulées seulement) | Ouvert |
