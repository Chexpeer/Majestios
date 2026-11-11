# Dossier de suivi des anomalies critiques — MajestiOS

> **Point d'entrée obligatoire pour tout agent IA ou développeur intervenant sur MajestiOS.** Lire ce fichier avant toute modification, puis ouvrir le registre détaillé de la branche active.

## 1. Où trouver les informations

- **Registre actif Evolution-9 :** [REGISTRE-ANOMALIES-EVOLUTION-9.md](../evolution-9/REGISTRE-ANOMALIES-EVOLUTION-9.md)
- **Registre détaillé Evolution-8 :** [REGISTRE-ANOMALIES-EVOLUTION-8.md](../evolution-8/REGISTRE-ANOMALIES-EVOLUTION-8.md)
- **Historique Evolution-7 :** [REGISTRE-ANOMALIES-PRIORITAIRES-2026-11-09.md](../evolution-7/REGISTRE-ANOMALIES-PRIORITAIRES-2026-11-09.md)
- **Consignes obligatoires des agents :** [AGENTS.md](../../AGENTS.md)
- **Index documentaire général :** [docs/README.md](../README.md)
- **Référentiel Evolution-9 :** [README.md](../evolution-9/README.md)
- **Référentiel Evolution-8 :** [README.md](../evolution-8/README.md)
- **Audit de départ :** [AUDIT-EXISTANT-PREPARATION-EVOLUTION-8-2026-11-11.md](../evolution-7/AUDIT-EXISTANT-PREPARATION-EVOLUTION-8-2026-11-11.md)
- **Décisions de navigation héritées :** [REFONTE-GLOBALE-NAVIGATION-CHATBOT-2026-11-09.md](../evolution-7/REFONTE-GLOBALE-NAVIGATION-CHATBOT-2026-11-09.md)

Le registre Evolution-9 est la source de vérité pour les anomalies de la branche active. Les registres Evolution-8 et Evolution-7 restent conservés comme historiques ; les identifiants hérités sont repris et ne sont clôturés qu'après preuve.

**Reprise Evolution-9 — 11 novembre 2026 :** la branche de consolidation a été créée depuis Evolution-8 après correction du décalage du contrat de navigation (NAV-01 : 20 entrées secondaires, 18 destinations uniques). Le build Vercel Evolution-8 est READY sur le commit `53a780e7f8c3817197611c4cb9948b3c544a90a5` ; ce résultat ne vaut pas recette CI ni navigateur. Les anomalies Supabase, Auth, multi-tenant et Cheexpeer restent ouvertes selon leurs preuves antérieures. Voir le [registre Evolution-9](../evolution-9/REGISTRE-ANOMALIES-EVOLUTION-9.md).

## 2. Anomalies actuellement suivies

| ID | Priorité | Domaine | État connu | Règle de traitement |
|---|---|---|---|---|
| AUTH-01 | P0 — avant ouverture aux membres | Authentification OTP et provisionnement | **Code source présent dans Git ; déploiement Supabase non démontré et recette E2E absente** | Vérifier le déploiement réel sur le projet cible, les redirections, e-mails, récupération, anti-abus et parcours complet avant ouverture. |
| AUTH-02 | P1 — conformité / traçabilité | Preuve de prise de connaissance | **Ouvert — le contrôle repose notamment sur `user_metadata`, modifiable par l'utilisateur** | Concevoir un reçu serveur horodaté, versionné et traçable ; tester la preuve recueillie et les règles de conservation avant de la présenter comme preuve robuste. |
| CRM-02 | P1 — traçabilité | Journalisation des créations CRM | **Corrigé dans Evolution-7 — migration non appliquée** | Migration `20261109170000_atomic_crm_activity_history.sql` et test de contrat présents dans Git ; recette transactionnelle réelle encore requise. |
| CRM-03 | P1 — intégrité des données | Privilèges UPDATE des tables CRM | **Corrigé dans Evolution-7 — migration non appliquée** | Migration `20261109160000_restrict_crm_update_columns.sql` et test de non-régression ajoutés. Vérifier/appliquer uniquement après autorisation explicite ; ne pas prétendre que les privilèges distants sont déjà corrigés. |
| AN-14 | P1 — sécurité Supabase | RLS désactivée sur `private.reputation_audit_usage` dans `MajestiOS-Test` ; ACL directe observée limitée à `postgres` | **Ouvert — défense en profondeur** | Vérifier l'exposition du schéma et définir les politiques avant tout élargissement des privilèges ; aucune modification distante effectuée. |

Les anomalies AUTH-01, AUTH-02, CRM-02 et CRM-03 sont héritées de l'audit Evolution-7 ; leurs statuts distants ne sont pas réputés validés par leur présence dans Git.

## 3. Règles obligatoires pour chaque agent

1. Identifier le dépôt, la branche et le commit HEAD ; travailler uniquement sur la branche explicitement autorisée.
2. Lire AGENTS.md, ce dossier, le registre détaillé et les décisions récentes liées au périmètre.
3. Vérifier le code actuel avant de reprendre un constat ancien : une anomalie peut avoir été corrigée depuis la dernière mise à jour du registre.
4. Qualifier chaque constat : anomalie confirmée ; évolution produit ; ou recette nécessitant un environnement, des identifiants, une source externe ou une autorisation.
5. Corriger au fur et à mesure uniquement les défauts dont la cause et la correction sont établies. Pour les risques de sécurité, d'authentification, de données ou de droits, arrêter avant toute opération sensible et demander l'autorisation nécessaire.
6. Après chaque correction : ajouter ou ajuster un test pertinent, exécuter les contrôles réellement disponibles, examiner le diff et noter les limites.
7. Mettre à jour le registre détaillé avec l'ID, la priorité, le constat, la preuve, le statut, les fichiers, le commit et les tests.
8. Ne jamais présenter un test statique comme une recette réelle, un déploiement Preview comme une mise en production, ni une fonctionnalité prévue comme opérationnelle.

## 4. Statuts normalisés

- **Ouvert** : anomalie confirmée, non corrigée.
- **En cours** : analyse ou correction commencée.
- **Corrigé à vérifier** : modification effectuée, preuve de validation insuffisante.
- **Validé** : correction et critères de non-régression vérifiés.
- **Bloqué** : une autorisation, un accès, une dépendance ou un environnement manque.

## 5. Autorisations et périmètre de sécurité

Sauf autorisation explicite du porteur du projet, aucun agent ne doit :
- fusionner une branche ou modifier main ;
- déployer ou promouvoir en production ;
- modifier la configuration, les politiques, les migrations ou les données Supabase métier ;
- changer les habilitations, les rôles ou les règles RLS ;
- supprimer une page, une fonctionnalité, une ressource ou une sauvegarde sans analyse de dépendances et point de retour.

## 6. Dernière actualisation

**État historique à l'ouverture d'Evolution-8 (11 novembre 2026) :** l'audit initial et le registre détaillé Evolution-7 avaient été repris dans Evolution-8. La convention worker est harmonisée dans Git sur `CHEEXPEER_*` ; les déclencheurs CI anti-régression couvrent désormais Evolution-7 et le test d'accès interne. Les contrôles Evolution-7 historiques sont réussis sur le commit de migration testé `fa66a8de` : worker [42844050029](https://github.com/Chexpeer/Majestios/actions/runs/42844050029), anti-régression [42844049859](https://github.com/Chexpeer/Majestios/actions/runs/42844049859) et site [42844049806](https://github.com/Chexpeer/Majestios/actions/runs/42844049806). Ils ne valent pas recette des changements Evolution-8 ; les tests navigateur de la nouvelle vitrine restent à confirmer. Le worker et son pont Edge restent non déployés selon la documentation ; aucun secret distant ni outil métier n'est activé par ces changements. AUTH-01 est confirmé bloquant : `provision-client-workspace` n'est déployée sur aucun des deux projets Supabase inspectés. AN-04 confirme l'écart actuel de 22 migrations sur `majestios-crm` contre 39 sur `MajestiOS-Test` ; le frontend utilise `majestios-crm` ; AN-06 confirme que `cheexpeer-worker` v1 est déployé sur le projet de test mais limité à `readiness_probe`, tandis que le pont Git `cheexpeer-worker-bridge` n'est pas déployé sous ce nom ; AN-07 confirme l'alerte de protection des mots de passe compromis sur le projet utilisé par le site ; AN-13 reste soumis à des tests multi-rôles ; AN-14 ajoute l'alerte RLS critique sur `private.reputation_audit_usage`. Aucune action distante n'a été effectuée.
**Branche de travail autorisée dans le chantier en cours :** Evolution-9. Evolution-8 et Evolution-7 restent préservées comme bases de travail et d'audit.
**Règle :** actualiser ce point d'entrée et le registre détaillé à chaque évolution significative des anomalies critiques.


**État Evolution-9 — 11 novembre 2026 :** NAV-01 a été corrigée dans Evolution-8 et la nouvelle branche reprend cette correction. Le contrôle documentaire des liens locaux a été ajouté au workflow et a réussi dans la suite GitHub Actions du commit `2438d8fd96f8e1d10676b8d193a5e99247096c67`. Les autres anomalies héritées restent ouvertes jusqu'à preuve contraire.

**Audit distant actualisé — 11 novembre 2026 :** [rapport CRM / Supabase Evolution-9](../evolution-9/AUDIT-CRM-SUPABASE-LECTURE-SEULE-2026-11-11.md). Le frontend pointe vers `majestios-crm` (22 migrations) ; `MajestiOS-Test` en possède 39. Les deux projets ne sont pas synchronisés. Aucun changement distant n'a été effectué.


## 7. Clarification de l'audit Supabase — 11 novembre 2026

Les deux projets Supabase ont des responsabilités distinctes : `MajestiOS-Test` est l'environnement de test/recette ; `majestios-crm` est le projet actuellement ciblé par le frontend. Les 39 contre 22 migrations ne justifient pas une synchronisation automatique.

- `AN-14` reste un point de défense en profondeur : `private.reputation_audit_usage` a RLS désactivée dans le projet de test, mais les droits directs observés sont réservés à `postgres`.
- `AN-13` doit être testé, sans exagérer l'alerte : sur le projet de test, le RPC SECURITY DEFINER vérifie `auth.uid()` et `private.can_edit_crm_org`; sur le projet principal, le RPC est SECURITY INVOKER et le CRM est limité aux droits VIP owner/admin.
- Le worker Cheexpeer de test ne traite que `readiness_probe` et ne réalise pas d'effet externe métier.
- Le CRM client multi-tenant n'est pas encore ouvert sur le projet principal.

Voir le [rapport d'audit et son addendum](../evolution-9/AUDIT-CRM-SUPABASE-LECTURE-SEULE-2026-11-11.md). Aucune écriture Supabase n'a été effectuée.

## 8. Nouvelle priorité CRM — droits de colonnes et historique

Le projet majestios-crm, actuellement ciblé par le frontend, n'a pas reçu les migrations de restriction des colonnes UPDATE et d'historisation atomique présentes sur MajestiOS-Test :
- Les droits SQL de authenticated couvrent encore les colonnes d'identité, d'organisation, d'auteur et d'horodatage sur businesses, contacts et opportunities. La whitelist frontend ne protège pas contre les appels directs à l'API.
- Les triggers d'historisation record_crm_activity() sont absents de ces tables sur le projet principal ; le code frontend peut donc signaler qu'une fiche a été modifiée sans historique.

**Priorité P1 avant pilote client.** Préparer et tester les migrations sur l'environnement de test, puis établir une sauvegarde, une revue SQL et un plan d'application soumis à autorisation. Aucune modification distante n'a été effectuée.


## 9. Recette CRM métier avant pilote

**CRM-05 — P1 ouvert.** Le contrôle statique du contrat de sécurité CRM réussit, mais il ne remplace pas un parcours E2E sur MajestiOS-Test. Avant toute invitation de pilotes, démontrer avec plusieurs comptes et organisations : création d'entreprise/contact/opportunité, modification, historisation atomique, relance, refus des accès inter-organisations et séparation entre CRM interne VIP et futur CRM client.

**CRM-03 / CRM-02 — P1 toujours bloquants sur le projet principal.** Les migrations de restriction des colonnes UPDATE et d'historisation atomique restent à préparer et tester ; elles ne doivent pas être appliquées à majestios-crm sans sauvegarde, revue SQL, plan de retour arrière et autorisation explicite.

**CRM-04 — correction de code présente.** Les payloads de création disposent désormais de listes blanches par table dans crm-client.js, avec test de contrat passé sur Evolution-9. Cela ne remplace jamais les privilèges SQL et politiques RLS.
