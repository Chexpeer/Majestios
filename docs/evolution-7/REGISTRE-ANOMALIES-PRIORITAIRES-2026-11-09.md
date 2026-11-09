# Registre des risques et anomalies — MajestiOS Evolution-7

**Date :** 9 novembre 2026  
**Branche :** `Evolution-7`

Ce document ne doit pas devenir une liste de toutes les fonctionnalités manquantes. Il distingue :
- **Anomalies / risques à traiter** : défauts constatés ou contrôles indispensables avant ouverture.
- **Évolutions produit** : capacités non encore prévues ou non développées ; elles relèvent de la feuille de route, pas d'une correction urgente.
- **Recettes à effectuer** : vérifications nécessitant un environnement réel et une autorisation.

## A. Anomalies et risques à traiter

| ID | Priorité | Domaine | Constat vérifié | Action / statut |
|---|---|---|---|---|
| AUTH-01 | **P0 — avant ouverture aux membres** | OTP / espace membre | Le front appelle `signInWithOtp()` et `verifyOtp()`, mais aucun test de bout en bout ne prouve l'envoi réel, la validation, l'expiration, les limites de débit et le provisionnement de l'espace. Le déploiement de `provision-client-workspace` en environnement de test n'est pas confirmé. | **À vérifier — recette E2E isolée.** Aucun changement Auth, migration, déploiement de fonction ou donnée de test dans Supabase métier sans autorisation. |
| CRM-02 | **P1 — traçabilité** | Création de fiches CRM | La fonction générique `create()` insère entreprises, contacts et opportunités sans créer d'activité historique. Les migrations inspectées ne montrent pas de journalisation automatique de ces créations. | **À corriger après choix technique.** Définir une écriture atomique ou une stratégie compensatoire et tester les créations et imports. |
| CRM-03 | **P1 — intégrité des données** | Colonnes d’audit CRM | `20261107065916_grant_crm_record_updates.sql` réintroduit un `UPDATE` table-level sur entreprises, contacts et opportunités. La migration `20261109160000_restrict_crm_update_columns.sql` révoque ce droit puis restaure exactement les listes blanches de `20261106074500_enforce_crm_editor_roles.sql`. | **Corrigé dans Evolution-7 — à vérifier en environnement autorisé.** Migration et test de non-régression ajoutés ; workflow GitHub vert. Aucun privilège distant lu ni migration appliquée. Les champs d’audit ne sont donc pas déclarés protégés en production tant que la migration n’est pas appliquée et contrôlée. |
| AUTH-02 | **P1 — conformité / traçabilité** | Consentement lors du provisionnement | `auth-espace-membre.js` contrôle la case dans le parcours normal, mais `provision-client-workspace/index.ts` vérifie seulement `body.privacy_acknowledged === true`. La fonction transmet ensuite la version courante au RPC, qui enregistre une ligne `privacy_acknowledgments`. Un utilisateur authentifié peut appeler directement l’Edge Function avec cette valeur sans passer par la case du formulaire ; le serveur ne vérifie pas `user.user_metadata.privacy_notice_acknowledged` ni sa version. | **Ouvert — correction serveur à préparer.** Valider côté Edge Function les métadonnées de consentement et leur version avant l’appel RPC ; prévoir un test d’intégration négatif. Ne pas déployer sans autorisation. |

## B. Évolutions produit — hors registre des erreurs

Ces éléments sont des limites ou des fonctions non développées, pas des défauts de code à corriger immédiatement. Ils restent dans la feuille de route.

| ID de suivi | Domaine | État actuel | Évolution éventuelle |
|---|---|---|---|
| ROADMAP-01 | Contact | Formulaire explicitement en mode prévisualisation ; aucun envoi annoncé. | Activer un canal de réception lorsque la destination est décidée et autorisée. |
| ROADMAP-02 | Candidatures | La page indique que le dépôt de CV n'est pas ouvert. | Concevoir un parcours de candidature et un stockage sécurisé si cette fonction est retenue. |
| ROADMAP-03 | Circulation vers CRM | Import manuel DINUM depuis le CRM présent ; transferts BOAMP/BODACC et prospection publique vers CRM non démontrés. | Étudier des actions d'import avec revue humaine, provenance et anti-doublon. |
| ROADMAP-04 | Couverture BODACC | Le moteur traite jusqu'à 100 annonces récentes sans pagination dans ce parcours. | Étudier pagination et filtres serveur selon les besoins métier. |
| ROADMAP-05 | Résultats mixtes | Le plafond actuel répartit 10 résultats, soit 5 maximum par source. | Étudier pagination ou chargement progressif. |
| ROADMAP-06 | Familles privées | Immobilier, emploi et sous-traitance sont déclarés non connectés et renvoient un état d'indisponibilité. | Connecter des sources adaptées ou maintenir un affichage explicite « à venir ». |

## C. Détail de la recette AUTH-01

Le code de `auth-espace-membre.js` appelle Supabase Auth pour demander et vérifier un code à six chiffres. Le test `tests/auth-espace-membre-otp.test.cjs` est un test de contrat statique : il vérifie la présence des appels et des éléments de formulaire, pas l'envoi effectif d'un e-mail ni la validation contre un service Auth réel.

La documentation `docs/evolution-6/AUTHENTIFICATION-OTP-ESPACE-MEMBRE-2026-11-09.md` indique qu'il reste à faire : test d'intégration Supabase local, vérification du modèle e-mail et des paramètres OTP distants, déploiement de la fonction de provisionnement en environnement de test, tests Auth/RLS multi-identités et validation avant activation métier.

**Décision :** ne pas annoncer le système OTP comme opérationnel tant que ces critères ne sont pas validés. Ne pas modifier la configuration Auth, appliquer de migration, déployer de fonction ni créer de données de test dans le projet Supabase métier sans autorisation explicite.

## D. Précision sur l'import CRM

Le contrôle de `crm-page.js` confirme un import manuel depuis le ciblage APE/NAF dans le poste CRM interne : sélection des candidats, contrôle SIREN/SIRET via `findBusinessesByIdentifiers`, puis appel à `MajestiosCRM.createBusiness`. La fiche conserve la source DINUM, les critères, les motifs et le statut `to_review`. Les doublons détectés sont refusés et les échecs sont remontés.

En revanche, `prospection-active.html` ne charge pas `crm-client.js`, et le moteur `opportunity-search.js` ne référence ni `MajestiosCRM`, ni `createOpportunity`, ni `createBusiness`. Les transferts directs des annonces BOAMP/BODACC vers le CRM ne sont donc pas démontrés.

## E. Règles de mise à jour

- N'ajouter au registre A que les défauts constatés ou risques bloquants.
- Mettre les nouvelles fonctionnalités et améliorations dans la feuille de route.
- Distinguer « présent dans le code », « testé automatiquement » et « validé en environnement réel ».
- Statuts de traitement : Ouvert, En cours, Corrigé à vérifier, Validé, Bloqué.
- Conserver commit, preuve et date pour chaque correction.
## F. Détail du risque AUTH-02 — preuve de prise de connaissance

Le formulaire `espace-membre.html` impose la case de confidentialité et `auth-espace-membre.js` vérifie `privacyAccepted` avant l'appel normal à `signInWithOtp`. Les métadonnées de profil comprennent `privacy_notice_acknowledged` et `privacy_notice_version`.

Cependant, `supabase/functions/provision-client-workspace/index.ts` ne vérifie pas ces métadonnées. Il vérifie uniquement que le corps HTTP contient `flow === "signup"` et `privacy_acknowledged === true`, puis appelle le RPC avec la constante `NOTICE_VERSION`. Le RPC atomique insère alors une ligne dans `privacy_acknowledgments`. Un utilisateur authentifié et confirmé peut donc appeler directement l'Edge Function avec ce booléen, sans avoir suivi le formulaire.

**Correction attendue :** le serveur doit vérifier la présence et la version attendue des métadonnées de consentement liées à l'inscription avant d'enregistrer l'accusé de réception ; la version doit être cohérente avec celle du RPC. Ajouter un test négatif qui appelle la fonction sans métadonnées de consentement et vérifie le refus avant toute écriture. Cette vérification améliore la cohérence de la preuve, sans prétendre qu'une métadonnée client constitue à elle seule une signature juridique inviolable.

**Périmètre :** anomalie localisée dans le code de l'Edge Function et son contrat de provisionnement. Aucun changement Auth, migration, déploiement ou écriture dans le projet Supabase n'a été effectué.
## G. Détail du risque CRM-03 — privilèges de colonnes

La migration `20261107065916_grant_crm_record_updates.sql` accorde explicitement `UPDATE` au niveau de la table sur `businesses`, `contacts` et `opportunities`. La migration `20261106074500_enforce_crm_editor_roles.sql` prévoit de retirer ce privilège global puis de réaccorder seulement les colonnes métier modifiables ; son en-tête précise qu'elle est versionnée dans GitHub mais non appliquée à Supabase. La migration `20261108181246_vip_only_crm_access.sql`, déclarée appliquée, resserre les politiques RLS aux rôles VIP, mais ne révoque pas le droit `UPDATE` table-level.

Conséquence : un utilisateur VIP autorisé à modifier une ligne peut contourner la liste blanche JavaScript `editableColumns` en appelant directement l'API Supabase et tenter de modifier des colonnes d'audit telles que `created_by` ou `created_at`. Le trigger `enforce_tenant_relationship_integrity` empêche le changement de `organization_id`, mais ne protège pas ces champs d'audit. L'état effectif des privilèges distants doit être lu avant de conclure que le risque est présent en production.

**Correction attendue :** vérifier `information_schema.column_privileges` et les privilèges table sur l'environnement autorisé ; si le droit large est confirmé, appliquer une migration qui révoque `UPDATE` table-level et réaccorde uniquement les colonnes métier nécessaires, en conservant la politique VIP et les triggers. Ajouter un test d'intégration qui tente de modifier `created_by`, `created_at` et `organization_id` par API directe. Aucune migration ni requête distante n'a été exécutée pendant cet audit.


## H. Vérification du lot Cheexpeer — intégration au parcours membre

Le moteur d’analyse fondé sur les preuves reste la référence : chaque constat doit citer des éléments existants ; faits, interprétations et hypothèses sont distingués ; les données administratives et les annonces BODACC ne peuvent pas prouver une réputation ; les recommandations sont liées à des constats ; la validation humaine est obligatoire.

**Correction de l’écart d’intégration dans le code :** la page `reputation-virtuelle.html` / `reputation-virtuelle.js` appelle désormais l’Edge Function `reputation-audit-context` avec une session Supabase authentifiée. Le handler exécute la collecte existante puis appelle `runCheexpeerAuditAnalysis` lorsqu’un adaptateur IA est configuré. La réponse est restituée dans la page avec des insertions DOM textuelles. Le bouton n’est activé qu’après préparation du dossier.

Un nouvel adaptateur serveur `reputation-audit-provider.mjs` permet de joindre un endpoint compatible Chat Completions avec JSON Schema strict. Les variables attendues sont `CHEEXPEER_AI_API_KEY`, `CHEEXPEER_AI_MODEL` et, facultativement, `CHEEXPEER_AI_BASE_URL`. Elles sont lues côté Edge Function uniquement. **Aucun fournisseur, modèle ou secret n’a été choisi ou configuré.** En l’absence de configuration, l’API retourne explicitement `collection_only` et ne prétend pas avoir produit une analyse.

Les tests ajoutés couvrent l’orchestration avec et sans analyse, l’adaptateur fournisseur, la validation de schéma et le comportement d’activation du bouton. Le workflow doit encore être consulté sur le commit courant avant de qualifier le lot de validé.

**Contrôle complémentaire — résilience du fournisseur IA :** le 9 novembre 2026, l’audit du handler a confirmé qu’une exception du fournisseur IA pouvait auparavant faire remonter une erreur globale et masquer les preuves déjà collectées. Le handler isole désormais l’appel d’analyse : en cas d’échec IA, il conserve le DTO de collecte et retourne `status: collection_only` avec `analysis_unavailable` et un message explicite. Un test de non-régression vérifie la conservation des deux preuves lorsque l’analyse échoue. Correction enregistrée dans le commit `48ae1279b9fdfba8561c6ee22b700512b5d5ea0c` ; validation CI de ce commit à confirmer.

**Limites non levées :** connecteurs de collecte limités à l’identité officielle et au BODACC ; pas de collecte automatisée exhaustive du Web, des avis ou des réseaux ; dossier et rapport non persistés ; quotas, contrôle de coûts et historique multi-tenant non réalisés ; aucune recette réelle du fournisseur ou de l’Edge Function déployée.

**Qualification :** ROADMAP-07 passe de « non raccordé » à « raccordement code effectué — CI et recette distante à confirmer ». Il ne s’agit pas d’une vulnérabilité de sécurité démontrée. Aucun secret, appel au fournisseur IA, déploiement Edge Function, migration ou changement du projet Supabase hébergé n’a été réalisé.

Détails, fichiers, configuration et séquence de recette : [Lot Cheexpeer — raccordement du parcours d’audit](LOT-CHEXPEER-INTEGRATION-2026-11-09.md).
