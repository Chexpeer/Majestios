# Registre central des erreurs critiques et risques — MajestiOS Evolution-7

<badge>DOCUMENT DE SUIVI PRIORITAIRE</badge>

**Date :** 9 novembre 2026  
**Branche :** `Evolution-7`

> **À consulter avant toute intervention sur MajestiOS.** Ce registre doit rester visible depuis l'index général, être actualisé au fil des audits et conserver l'historique des corrections. Une synthèse stratégique ne doit jamais masquer ni supprimer une anomalie critique.

## Tableau de bord immédiat

| Niveau | Anomalies inscrites | Traitement |
|---|---:|---|
| P0 — bloquant avant ouverture | 1 | Recette impérative avant ouverture aux membres |
| P1 — important | 6 | Correction ou vérification prioritaire |
| Corrigée à revalider | 1 | Ne pas clôturer sans preuve de recette |

**À traiter en premier :**
1. **AUTH-01 — OTP / espace membre :** parcours réel non validé de bout en bout.
2. **AUTH-02 — consentement :** contrôle serveur insuffisant lors du provisionnement.
3. **CRM-02 — traçabilité :** création de fiches sans activité historique atomique.
4. **CRM-03 — privilèges CRM :** correction préparée, état distant à vérifier avant clôture.
5. **CRM-04 — RPC des relances :** le contrôle SQL historique accepte un rôle plus large que la frontière VIP actuelle.
6. **CRM-05 — cohérence relationnelle :** contact rattaché à une autre entreprise que l’opportunité et absence d’unicité SIRET au niveau SQL.
7. **CHEEXPEER-01 — accès à l’audit IA :** contrôle d’authentification présent, mais absence de vérification d’appartenance à un espace MajestiOS.

**Consigne aux agents :** traiter les P0 avant les P1. Après chaque découverte ou correction, préciser l'ID, le statut, les fichiers concernés, le commit, les tests exécutés et la preuve. Une modification de code seule ne suffit pas à déclarer une anomalie corrigée.

Ce document ne doit pas devenir une liste de toutes les fonctionnalités manquantes. Il distingue :
- **Anomalies / risques à traiter** : défauts constatés ou contrôles indispensables avant ouverture.
- **Évolutions produit** : capacités non encore prévues ou non développées ; elles relèvent de la feuille de route, pas d'une correction urgente.
- **Recettes à effectuer** : vérifications nécessitant un environnement réel et une autorisation.

## A. Anomalies et risques à traiter

| ID | Priorité | Domaine | Constat vérifié | Action / statut |
|---|---|---|---|---|
| AUTH-01 | **P0 — avant ouverture aux membres** | OTP / espace membre | Le front appelle `signInWithOtp()` et `verifyOtp()`, mais aucun test de bout en bout ne prouve l'envoi réel, la validation, l'expiration, les limites de débit et le provisionnement de l'espace. Le déploiement de `provision-client-workspace` en environnement de test n'est pas confirmé. | **À vérifier — recette E2E isolée.** Aucun changement Auth, migration, déploiement de fonction ou donnée de test dans Supabase métier sans autorisation. |
| CRM-02 | **P1 — traçabilité** | Création et modification de fiches CRM | Avant correction, `create()` n'enregistrait aucune activité ; `update()` modifiait la fiche puis tentait une seconde insertion d'activité, pouvant échouer après la modification. Les imports via `createBusiness()` étaient également concernés. | **Correction préparée sur Evolution-7 — à valider.** La migration `20261109170000_atomic_crm_activity_history.sql` ajoute un trigger SQL après insertion/modification des entreprises, contacts et opportunités ; le client ne crée plus de doublon d'historique. La CI GitHub est verte sur le commit de code `71c456fba64afb4dc5caeb79b58f7958977d4096` (run `42647542128`). La migration n'est pas appliquée à Supabase. Recette transactionnelle autorisée encore requise avant clôture. |
| CRM-03 | **P1 — intégrité des données** | Colonnes d’audit CRM | `20261107065916_grant_crm_record_updates.sql` réintroduit un `UPDATE` table-level sur entreprises, contacts et opportunités. La migration `20261109160000_restrict_crm_update_columns.sql` révoque ce droit puis restaure exactement les listes blanches de `20261106074500_enforce_crm_editor_roles.sql`. | **Corrigé dans Evolution-7 — à vérifier en environnement autorisé.** Migration et test de non-régression ajoutés ; workflow GitHub vert. Aucun privilège distant lu ni migration appliquée. Les champs d’audit ne sont donc pas déclarés protégés en production tant que la migration n’est pas appliquée et contrôlée. |
| CHEEXPEER-01 | **P1 — contrôle d’accès / coûts** | Accès à l’audit Cheexpeer | Le handler vérifiait seulement qu’un JWT Supabase correspond à un utilisateur ; aucune appartenance à `organization_members` n’était exigée. Un compte authentifié sans espace MajestiOS pouvait donc appeler directement l’endpoint et déclencher les collectes publiques, puis l’analyse IA si elle est configurée. Aucun quota ou rate limit persistant n’est présent dans ce lot. | **Contrôle d’appartenance ajouté sur Evolution-7 — CI à confirmer.** `reputation-audit-context/index.ts` vérifie maintenant l’appartenance via le client utilisateur et RLS avant de lancer la collecte. Test de contrat ajouté et intégré au workflow. Le contrôle de débit et les quotas restent à concevoir ; fonction non déployée, fournisseur IA non configuré. |
| CRM-05 | **P1 — intégrité relationnelle** | Cohérence des rattachements CRM et doublons SIRET | Le trigger `enforce_tenant_relationship_integrity()` vérifie l’appartenance au même tenant, mais n’impose pas que le contact principal d’une opportunité appartienne à l’entreprise liée à cette opportunité. Le schéma garantit l’unicité du SIREN par organisation, mais pas celle du SIRET. L’import contrôle les doublons avant insertion côté navigateur, contrôle exposé à une course entre deux imports simultanés. | **Correction préparée sur Evolution-7 — tests CI à confirmer.** Migration `20261109190000_enforce_crm_business_relationships.sql` : vérifie la cohérence entreprise/contact pour opportunités et activités, ajoute un index unique SIRET par organisation après contrôle préalable des doublons existants. Migration non appliquée à Supabase ; vérifier les doublons préexistants et effectuer une recette multi-rôles avant clôture. |
| CRM-04 | **P1 — contrôle d’accès** | RPC de traitement des relances CRM | `complete_crm_reminder()` est une fonction `SECURITY DEFINER` qui vérifie encore `private.is_org_editor()`, lequel accepte `owner`, `admin` et `member`. La migration VIP appliquée remplace les politiques des tables par une frontière `owner/admin`, mais ne remplace pas ce contrôle RPC. Un membre peut donc tenter un appel direct par identifiant de relance et contourner la restriction d’interface et les politiques RLS. | **Correction préparée sur Evolution-7 — CI verte.** Migration `20261109180000_harden_crm_reminder_vip_rpc.sql` : le RPC vérifie `private.is_org_admin()` avant toute écriture, avec test de contrat. CI réussie sur le commit `91c9d0ec991ea92dff0f78ec50526019487f0c04` (run `42648987588`). Migration non appliquée à Supabase ; recette directe multi-rôles nécessaire avant clôture. |
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
| ROADMAP-08 | Cheexpeer / CRM | Aucun connecteur ne permet actuellement à Cheexpeer de lire, qualifier ou préparer des actions sur les données CRM. | Concevoir un connecteur serveur multi-tenant avec permissions explicites, journalisation, quotas et validation humaine des écritures. |
| ROADMAP-09 | Cheexpeer / GitHub | Aucune intégration GitHub n'est implémentée dans l'application MajestiOS pour que Cheexpeer audite le dépôt ou prépare des corrections. | Concevoir une intégration GitHub limitée aux dépôts et branches autorisés, en lecture par défaut et écriture sur branche dédiée. |
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

**Affichage des états dégradés :** le contrôle du parcours navigateur a relevé que la page affichait « moteur IA non configuré » même lorsque le fournisseur était configuré mais venait d’échouer. Le statut distingue désormais `analysis_unavailable` (panne ponctuelle) de l’absence de configuration. Correction code enregistrée dans `6af33bc3efa7e09955de6252fd2a415e793186f7` ; CI à confirmer. Un test navigateur simule désormais une session membre et vérifie le libellé exact après échec IA ; test ajouté dans `baa847c22dd86187b97f1aa350805a0e86ff1a9f`.

**Limites non levées :** connecteurs de collecte limités à l’identité officielle et au BODACC ; pas de collecte automatisée exhaustive du Web, des avis ou des réseaux ; dossier et rapport non persistés ; quotas, contrôle de coûts et historique multi-tenant non réalisés ; aucune recette réelle du fournisseur ou de l’Edge Function déployée.

**Qualification :** ROADMAP-07 passe de « non raccordé » à « raccordement code effectué — CI et recette distante à confirmer ». Il ne s’agit pas d’une vulnérabilité de sécurité démontrée. Aucun secret, appel au fournisseur IA, déploiement Edge Function, migration ou changement du projet Supabase hébergé n’a été réalisé.

Détails, fichiers, configuration et séquence de recette : [Lot Cheexpeer — raccordement du parcours d’audit](LOT-CHEXPEER-INTEGRATION-2026-11-09.md).


## I. Détail du risque CRM-02 — historique atomique

L'audit du 9 novembre 2026 a confirmé deux défauts liés :
- la création d'une entreprise, d'un contact ou d'une opportunité ne produisait pas automatiquement d'activité ;
- la modification d'une fiche était validée avant une seconde requête d'insertion dans `activities`. Si cette seconde requête échouait, la fiche restait modifiée sans historique complet.

**Correction préparée dans Evolution-7 :** la migration `20261109170000_atomic_crm_activity_history.sql` installe un trigger SQL après insertion ou modification sur `businesses`, `contacts` et `opportunities`. L'activité est alors écrite dans la même transaction que la fiche : si la journalisation échoue, l'opération métier échoue aussi. Les métadonnées identifient l'entité, l'événement et les champs modifiés. Le client `crm-client.js` ne tente plus d'insérer une seconde activité lors d'une modification, afin d'éviter les doublons ; il vérifie la présence de l'activité générée par le trigger avant d'annoncer l'historisation.

**Limite de validation :** le changement est versionné dans GitHub uniquement. La CI est verte sur le commit `91c9d0ec991ea92dff0f78ec50526019487f0c04` (run `42648987588`), y compris le contrat de sécurité CRM. Aucune migration n'a été appliquée à Supabase. Une recette autorisée doit encore confirmer création, modification, rollback si l'insertion d'activité échoue, et absence de doublon. Ne pas déclarer CRM-02 validé en environnement réel avant ces preuves.


## J. Détail du risque CRM-04 — contrôle du RPC de relance

La migration `20261106120000_complete_crm_reminder_with_activity.sql` crée `public.complete_crm_reminder(uuid)` en `SECURITY DEFINER`. Son contrôle historique utilise `private.is_org_editor()`, qui autorise les rôles `owner`, `admin` et `member`. La migration `20261108181246_vip_only_crm_access.sql`, indiquée comme appliquée, a ensuite restreint les politiques des tables CRM aux rôles `owner/admin`, sans redéfinir ce RPC. Or une fonction `SECURITY DEFINER` effectue ses écritures avec les privilèges de son propriétaire ; les politiques RLS ne constituent donc pas une protection suffisante si le contrôle interne du RPC reste plus permissif.

**Correction préparée dans Evolution-7 :** la migration `20261109180000_harden_crm_reminder_vip_rpc.sql` remplace le contrôle par `private.is_org_admin(v_reminder.organization_id)`, cohérent avec la frontière VIP des tables, et refuse aussi une relance dont l'opportunité associée est absente. Le test de contrat vérifie explicitement l'absence de l'ancien contrôle permissif.

**Limite de validation :** aucune migration n'a été appliquée à Supabase. Après CI, une recette autorisée doit tenter le RPC avec un rôle `member` puis `owner/admin` et vérifier le refus/acceptation, ainsi que l'absence de modification de la relance et d'insertion d'activité lors du refus. Ne pas déclarer le risque corrigé en environnement réel avant cette preuve.

## K. Détail du risque CRM-05 — cohérence des relations et unicité SIRET

La migration historique `20261105163953_enforce_tenant_relationship_integrity.sql` garantit que les enregistrements liés appartiennent au même tenant. Elle ne compare toutefois pas l'entreprise du contact principal avec l'entreprise portée par l'opportunité. Le même défaut de cohérence peut affecter les activités associant simultanément entreprise, contact et opportunité. Le contrôle d'import SIREN/SIRET de `crm-page.js` est effectué avant l'insertion depuis le navigateur ; il ne protège pas contre deux imports concurrents. Enfin, le schéma initial impose `unique (organization_id, siren)` mais ne définit aucune unicité SQL sur `(organization_id, siret)`.

**Correction préparée dans Evolution-7 :** `supabase/migrations/20261109190000_enforce_crm_business_relationships.sql` complète le trigger de cohérence pour vérifier que le contact principal et les activités correspondent à l'entreprise liée. Elle ajoute un index unique partiel sur `(organization_id, siret)` lorsque le SIRET est renseigné. La migration interrompt volontairement son exécution si des doublons SIRET existent déjà dans un tenant, afin d'éviter une suppression ou fusion automatique de fiches.

**Limites de validation :** migration et test de contrat versionnés dans GitHub ; CI à confirmer. La migration n'est pas appliquée à Supabase. Avant toute application, inventorier et traiter manuellement les éventuels doublons SIRET, puis tester les rattachements valides/invalides (contact d'une autre entreprise, activité incohérente) et deux imports concurrents. Ne pas déclarer CRM-05 validé en environnement réel avant ces preuves.

## L. Détail du risque CHEEXPEER-01 — accès à l'audit et maîtrise des coûts

Le handler `reputation-audit-context` authentifiait le JWT avec `auth.getUser(token)`, mais ne vérifiait pas que l'utilisateur appartenait à un espace MajestiOS. Un compte Supabase authentifié sans appartenance pouvait donc appeler directement l'endpoint. En cas de configuration future du fournisseur IA, chaque appel pourrait également déclencher une requête facturée. Aucun quota ou rate limit persistant n'est implémenté dans ce lot.

**Correction préparée sur Evolution-7 :** l'Edge Function vérifie désormais, avec le client Supabase portant le JWT de l'utilisateur, l'existence d'une ligne dans `organization_members` avant de retourner l'identité à l'handler. Le test `tests/reputation-audit-access-contract.test.mjs` contrôle cette exigence et le workflow l'exécute.

**Limites :** CI à confirmer. La fonction n'est pas déployée et aucun test réel multi-comptes n'a été exécuté. Le contrôle d'appartenance ne remplace pas une limitation de débit, des quotas par utilisateur/organisation ni une surveillance des coûts ; ces mécanismes restent à concevoir avant activation d'un fournisseur IA.
