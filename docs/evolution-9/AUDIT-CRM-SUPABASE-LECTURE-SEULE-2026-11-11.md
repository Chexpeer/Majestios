# Audit CRM et Supabase — Evolution-9

**Date du contrôle :** 11 novembre 2026  
**Branche de référence :** `Evolution-9`  
**Méthode :** lecture seule du dépôt GitHub et des deux projets Supabase accessibles.  
**Périmètre :** configuration frontend, migrations, tables/RLS, fonctions Edge, RPC et advisors.  
**Limite :** cet audit ne constitue pas une recette fonctionnelle multi-utilisateur, un audit juridique, ni une validation de sauvegarde/restauration.

## 1. Résumé exécutif

Le dépôt contient un socle CRM multi-tenant et une fondation d'exécution Cheexpeer avancés. Toutefois, les deux projets Supabase sont désynchronisés :

- Le frontend MajestiOS pointe actuellement vers **`majestios-crm`** (`qxaghcifdhugfskuscoc`), confirmé par `supabase-config.js`.
- Ce projet ne possède que **22 migrations appliquées**, jusqu'à `vip_only_crm_access`.
- **`MajestiOS-Test`** (`qrlnnfjstoeliymxtkbk`) possède **39 migrations appliquées**, dont les migrations récentes du moteur de missions et du pont worker Cheexpeer.
- Le projet de test n'est pas la cible configurée par le frontend.
- Les fonctions et RPC ne sont donc pas équivalentes entre les deux projets.

**Conclusion :** ne pas inviter les pilotes, ne pas lancer de migration et ne pas déployer de nouvelle fonction avant d'avoir désigné le projet Supabase de référence et préparé un plan de convergence vérifié.

## 2. Projet réellement utilisé par le site

Le fichier `supabase-config.js` référence l'URL du projet `qxaghcifdhugfskuscoc`, c'est-à-dire `majestios-crm`. Le navigateur utilise une clé publishable ; aucune clé `service_role` n'est présente dans ce fichier.

Ce point tranche la question du projet réellement ciblé par le code actuel : **le site ne pointe pas vers `MajestiOS-Test`**.

## 3. Parité des migrations

| Projet | Migrations appliquées | Dernière migration distante |
|---|---:|---|
| `majestios-crm` | 22 | `20261108181246_vip_only_crm_access` |
| `MajestiOS-Test` | 39 | `20261109250000_cheexpeer_worker_server_bridge` |

Les migrations récentes présentes dans Git mais absentes de `majestios-crm` comprennent notamment :
- restrictions fines des colonnes modifiables du CRM ;
- historisation atomique des créations et modifications ;
- durcissement du RPC de relance ;
- intégrité des relations CRM inter-organisations ;
- quotas de Réputation virtuelle ;
- restauration des permissions CRM tenant-scoped ;
- fondation persistante Cheexpeer, politiques privées, file durable, dispatcher, approbations humaines, registre d'outils fail-closed et pont serveur.

L'écart de 17 migrations ne doit pas être résolu par une simple application en bloc : il faut comparer les objets distants, les dépendances, les données et l'ordre réel des migrations, puis tester une trajectoire de convergence.

## 4. Tables, données et isolation

### `majestios-crm` — cible du frontend
- Les tables publiques CRM inspectées ont RLS activée.
- Les tables principales présentes comprennent organisations, membres, entreprises, contacts, opportunités, activités, demandes clients, consentements, relances et référentiels d'entreprises.
- Les compteurs retournés par l'inspection montrent une organisation, un membre et un contact ; aucune entreprise, opportunité ou activité dans les tables CRM inspectées.
- Les tables privées Cheexpeer ne sont pas présentes dans le schéma inspecté.

### `MajestiOS-Test`
- Les tables publiques CRM inspectées ont RLS activée.
- Les tables privées Cheexpeer sont présentes : missions, étapes, événements, approbations, registre d'outils et planifications.
- Les compteurs retournés comprennent cinq missions, quinze événements, une approbation et une entrée de registre d'outils.
- `private.reputation_audit_usage` a RLS désactivée. Son ACL relevée ne donne des privilèges qu'à `postgres` ; aucun privilège table direct à `anon` ou `authenticated` n'a été constaté. Le schéma est privé dans l'architecture actuelle : il ne s'agit donc pas d'une preuve d'accès navigateur, mais le défaut de défense en profondeur reste à corriger avant tout élargissement des droits.

## 5. Fonctions Edge réellement déployées

### `majestios-crm`
Fonctions actives observées :
- `search-official-companies` — version 4 ;
- `import-official-company` — version 2 ;
- `bootstrap-internal-admin` — version 3.

Les fonctions `provision-client-workspace`, `prospection-search-member`, `reputation-audit-context` et `cheexpeer-worker-bridge` ne figurent pas dans la liste distante de ce projet au moment du contrôle.

Le provisionnement d'espace client et le parcours OTP restent donc à considérer comme non déployés/non recettés sur la cible du site.

### `MajestiOS-Test`
Une fonction active observée :
- `cheexpeer-worker` — version 1, vérification JWT activée.

Le code déployé est un worker de test sécurisé : il n'exécute que `readiness_probe`, refuse les autres types d'outils et n'effectue pas d'effet externe métier. Il ne constitue pas encore un Cheexpeer opérationnel.

Le nom et le contrat de cette fonction déployée (`cheexpeer-worker`) diffèrent du pont versionné dans Git (`cheexpeer-worker-bridge`). Il faut documenter explicitement cette distinction et ne pas supposer que le pont Git est déployé.

## 6. RPC et droits CRM

Le RPC `public.complete_crm_reminder` présente une différence entre environnements :

- Sur `MajestiOS-Test`, la fonction est `SECURITY DEFINER`, exécutable par `authenticated`, et vérifie `private.is_org_admin` avant de traiter la relance. L'advisor Supabase signale l'exposition d'une fonction SECURITY DEFINER au rôle authenticated ; le contrôle d'autorisation interne existe, mais la surface doit rester documentée et testée avec owner/admin/member.
- Sur `majestios-crm`, la fonction observée est `SECURITY INVOKER` et utilise encore `private.is_org_editor`. Les politiques de tables CRM observées sur ce projet sont déjà limitées aux rôles VIP owner/admin. Cette différence de contrat doit être résolue et testée ; le contrôle RLS reste déterminant pour les accès effectifs.

Le frontend vérifie lui aussi owner/admin dans `requireWorkspace()`, mais cette vérification d'interface ne remplace jamais les politiques et contrôles serveur.

## 7. Advisors Supabase

### `majestios-crm`
- Alerte sécurité : protection contre les mots de passe compromis désactivée.
- 20 index signalés inutilisés. Ce sont des informations de performance à réévaluer après trafic réel ; ne pas supprimer automatiquement les index.

### `MajestiOS-Test`
- Alerte sécurité : fonction `complete_crm_reminder` SECURITY DEFINER exécutable par `authenticated`.
- 44 index signalés inutilisés. Même règle : mesurer avant toute suppression.

Aucun advisory de santé n'a été retourné lors de ce contrôle.

## 8. État fonctionnel réel du CRM

Le CRM interne dispose d'une interface et de fonctions de consultation, création, qualification, relations et relances. Le frontend filtre les données par organisation et le schéma comporte des politiques RLS.

Cependant, la recette de sécurité n'est pas démontrée :
- tests réels owner/admin/member non fournis ;
- tests inter-organisations non fournis ;
- vérification du comportement des RPC sur le projet réellement ciblé à compléter ;
- migrations Git postérieures à la migration distante actuelle non appliquées sur la cible ;
- le CRM client autonome, le module de facturation électronique, les connecteurs CRM externes et l'intégration d'une plateforme agréée ne sont pas démontrés comme capacités opérationnelles dans les tables et fonctions inspectées.

## 9. Priorités et conditions de passage

| Priorité | Action | Condition de clôture |
|---|---|---|
| P0 | Décider quel projet Supabase devient la référence : `majestios-crm` ou `MajestiOS-Test` | Décision écrite, responsabilités et environnements clarifiés |
| P0 | Produire une matrice de parité Git / `majestios-crm` / `MajestiOS-Test` | Migrations, tables, fonctions, RPC, politiques, extensions et paramètres comparés |
| P0 | Recetter l'isolation multi-tenant et les rôles | Tests automatisés owner/admin/member et deux organisations, succès et refus prouvés |
| P0 | Recetter Auth OTP et provisionnement | Fonction déployée en environnement de test, parcours complet et récupération vérifiés |
| P1 | Aligner le RPC de relance et ses droits | Contrat identique et tests directs du RPC pour chaque rôle |
| P1 | Traiter `private.reputation_audit_usage` | RLS et politiques adaptées, privilèges revus, advisor recontrôlé |
| P1 | Activer la protection contre les mots de passe compromis | Paramètre Auth vérifié sur le projet retenu |
| P1 | Aligner le pont et le worker Cheexpeer | Noms, secrets, versions, fonctions RPC et mode d'exécution documentés et testés |
| P2 | Réévaluer les index inutilisés | Décision fondée sur des métriques de charge et des requêtes réelles |

## 10. Interdictions maintenues

Cet audit n'a effectué aucune écriture Supabase. Aucune migration, donnée, fonction Edge, politique RLS, configuration Auth, clé ou secret distant n'a été modifié. Aucun déploiement Vercel ni changement de production n'a été effectué.

Toute convergence doit faire l'objet d'un plan explicite, d'une sauvegarde vérifiée, d'une revue SQL, d'une recette sur environnement isolé et d'une autorisation avant exécution.

## 11. Addendum de vérification — 11 novembre 2026, 12:35 (heure de Paris)

Ce contrôle complémentaire précise et, lorsque nécessaire, corrige les formulations des sections précédentes. Il confirme que les deux projets ont des rôles distincts ; leur différence de migrations n'est pas en elle-même une anomalie à corriger.

### 11.1 Rôle des environnements

- `MajestiOS-Test` est traité comme environnement de test/recette : 39 migrations, socle CRM multi-tenant élargi, tables privées Cheexpeer et worker de test.
- `majestios-crm` reste le projet actuellement référencé par `supabase-config.js` : 22 migrations, CRM interne protégé VIP et fonctions Edge de recherche/import officiel.
- L'écart de 17 migrations est une divergence de périmètre et de cycle de vie à documenter, pas une instruction de synchronisation. Aucune convergence automatique n'est recommandée.

### 11.2 RLS et table privée

Les tables publiques CRM inspectées ont RLS activée dans les deux projets. Dans `MajestiOS-Test`, `private.reputation_audit_usage` a RLS désactivée, mais les privilèges directs observés dans `information_schema.role_table_grants` sont exclusivement attribués à `postgres` ; aucune politique n'est définie. Le schéma privé et l'absence de droits directs pour `anon`/`authenticated` réduisent l'exposition directe constatée. Le point reste une faiblesse de défense en profondeur à traiter avant toute évolution des droits ou exposition du schéma, et non une preuve d'accès navigateur.

### 11.3 RPC de relance — correction du constat précédent

- Dans `MajestiOS-Test`, `public.complete_crm_reminder(uuid)` est `SECURITY DEFINER`, exécutable par `authenticated` et non exécutable par `anon`. Son corps vérifie `auth.uid()`, l'appartenance et les droits via `private.can_edit_crm_org(organization_id)`, puis vérifie l'état de la relance et l'organisation de l'opportunité. Le précédent texte indiquant `private.is_org_admin` était inexact. L'advisor reste un signal de revue ; il faut tester les rôles et les cas inter-organisations avant clôture.
- Dans `majestios-crm`, le RPC est `SECURITY INVOKER`, exécutable par `authenticated` et non par `anon`, et utilise `private.is_org_editor`. Les politiques RLS actuelles des tables CRM du projet principal sont limitées à `private.is_org_admin`, ce qui maintient de fait la frontière VIP owner/admin.

### 11.4 Cohérence frontend / droits du projet principal

Le fichier `crm-client.js` sur `Evolution-9` vérifie la session avec `getSession()` puis `getUser()`, recherche l'appartenance à une organisation interne et refuse l'accès si le rôle n'est pas `owner` ou `admin`. Cette restriction concorde avec les politiques RLS VIP de `majestios-crm`. Elle signifie aussi que le CRM client multi-tenant ouvert aux membres d'entreprises pilotes n'est pas encore activé sur le projet utilisé par le site.

### 11.5 Cheexpeer et advisors

Le worker Edge `cheexpeer-worker` v1 de `MajestiOS-Test` a `verify_jwt=true`. Le code déployé exige un JWT de rôle `service_role`, utilise le service role côté serveur et ne permet que `readiness_probe` ; les autres types de mission sont refusés/échouent en mode test. Le code déclare explicitement l'absence d'effets externes (réseau métier, email, écriture CRM, scraping ou mutation de fichiers). Ce worker ne doit pas être présenté comme un agent Cheexpeer opérationnel.

Les advisors recontrôlés indiquent : protection contre les mots de passe compromis désactivée sur `majestios-crm` ; 20 index inutilisés signalés sur ce projet et 44 sur `MajestiOS-Test`. Les alertes d'index sont informatives dans des environnements peu chargés et ne justifient aucune suppression automatique. Aucun advisory de santé n'a été retourné.

### 11.6 Décisions d'audit

1. Conserver les deux projets distincts et documenter leurs responsabilités respectives.
2. Ne pas appliquer les migrations de test sur `majestios-crm` en bloc.
3. Garder `MajestiOS-Test` comme environnement d'expérimentation/recette tant que son rôle n'est pas explicitement redéfini.
4. Avant pilote client, construire les tests d'isolation inter-organisations, les tests owner/admin/member, le parcours OTP et le provisionnement complet sur le projet de test.
5. Ne modifier aucun paramètre Auth, privilège, RLS, fonction Edge, donnée ou migration distante sans plan et autorisation.

**Périmètre de ce complément : lecture seule.** Aucun changement Supabase ou Vercel n'a été effectué.

### 11.7 Privilèges UPDATE et historisation — constat complémentaire

Une comparaison des privilèges effectifs du rôle authenticated sur les colonnes des tables CRM révèle un écart de sécurité important :

- Sur MajestiOS-Test, les droits UPDATE sont limités aux colonnes métier prévues. Les colonnes id, organization_id, created_by, created_at et updated_at ne sont pas modifiables par authenticated pour les tables CRM inspectées.
- Sur majestios-crm, le rôle authenticated dispose encore du droit UPDATE sur toutes les colonnes des tables businesses, contacts et opportunities, y compris les identifiants, l'organisation, les auteurs et les horodatages. Les politiques RLS exigent toujours un administrateur de l'organisation, et des triggers d'intégrité existent, mais la restriction au niveau des colonnes n'est pas déployée sur le projet actuellement utilisé par le site. La whitelist dans crm-client.js est une protection frontend, pas une protection contre un appel direct à l'API.
- La migration 20261109160000_restrict_crm_update_columns est donc une correction de sécurité prioritaire à préparer et tester ; ne pas l'appliquer à distance sans plan et autorisation.

L'historisation présente un second écart fonctionnel :
- MajestiOS-Test possède des triggers record_crm_activity() après INSERT/UPDATE sur businesses, contacts et opportunities.
- majestios-crm ne présente pas ces triggers sur les trois tables. Le frontend crm-client.js cherche pourtant l'activité créée après une modification ; crm-page.js affiche un avertissement lorsque historyRecorded est faux. En l'absence des triggers correspondants, une modification peut réussir sans que son historique soit enregistré.
- La migration 20261109170000_atomic_crm_activity_history est donc nécessaire pour le comportement attendu, après validation sur l'environnement de test.

Enfin, MajestiOS-Test présente deux triggers BEFORE INSERT/UPDATE redondants par table CRM (*_enforce_tenant_integrity et *_tenant_integrity) appelant la même fonction private.enforce_tenant_relationship_integrity(). Aucun impact fonctionnel n'est démontré ; c'est une dette de nettoyage à traiter dans une migration contrôlée, pas une suppression manuelle immédiate.

**Priorité mise à jour :** verrouiller les privilèges de colonnes et rétablir l'historisation atomique sur le projet principal avant d'ouvrir le CRM à un groupe pilote ou à des clients.


### 11.8 Audit du parcours métier CRM — contrôle du code Evolution-9

Le contrôle du code frontend et des migrations complète l'audit Supabase en lecture seule :

- **Entreprises :** création avec statut initial « à examiner », identification par SIREN/SIRET, qualification (à examiner, en cours, qualifiée, non qualifiée, ne pas contacter), notes, provenance et rattachement à une organisation.
- **Contacts :** rattachement facultatif à une entreprise, coordonnées, fonction et statut de consentement (inconnu, fourni, retiré, non applicable).
- **Opportunités :** rattachement à une entreprise et à un contact principal, étape commerciale, score de qualification borné de 0 à 100, synthèse, responsable, prochaine action et échéance.
- **Activités :** journal des interactions et événements métier. Le modèle SQL prévoit une insertion append-only pour les rôles applicatifs ordinaires ; l'historisation des créations/modifications des trois fiches principales est portée par la migration atomique dédiée.
- **Intégrité relationnelle :** les migrations du dépôt contrôlent l'appartenance des entreprises, contacts, opportunités et activités au même tenant ; elles vérifient également la cohérence entre le contact principal et l'entreprise de l'opportunité, ainsi que les responsables membres de l'organisation. Le SIREN est unique par organisation dans le schéma initial ; une migration ultérieure ajoute l'unicité du SIRET normalisé par organisation.
- **Relances :** le modèle prévoit une matérialisation périodique des échéances échues, l'annulation des relances en attente lors d'une clôture ou d'une replanification, et un RPC de traitement qui ajoute une activité à la chronologie dans la même transaction. Ce fonctionnement reste à recetter sur une base de test représentative ; il n'est pas démontré sur le projet principal tant que les migrations correspondantes n'y sont pas appliquées.

#### Correction de robustesse effectuée dans le client

Le point d'entrée MajestiosCRM.create* acceptait auparavant tout objet transmis par son appelant, alors que les formulaires actuels construisaient des payloads limités. Une liste blanche explicite par table est maintenant appliquée aux créations d'entreprises, contacts, opportunités et activités ; les champs organization_id, created_by et actor_user_id restent imposés par le client authentifié. La comparaison des champs modifiés utilise aussi le payload normalisé, notamment pour le score de qualification.

Un test de contrat a été ajouté au test de sécurité CRM existant. Le workflow verify-static-site a exécuté ce contrôle sur le commit 5976681bc72f089c9bdb94a26951a7622254267a ; le contrôle de sécurité CRM a terminé avec succès. Cette protection du client ne remplace pas les privilèges SQL, RLS et contraintes serveur.

#### Limites et recette encore requise

- Le workflow couvre des contrats statiques, la navigation et la sécurité du code, mais ne comporte pas encore de recette navigateur complète de création → modification → historique → relance sur un tenant de test.
- Les tests d'isolation inter-organisations, de séparation interne/client et de cycle de vie des relances doivent être exécutés contre MajestiOS-Test, avec plusieurs identités et organisations synthétiques.
- Le code contient une branche d'interface viewer en lecture seule, mais requireWorkspace() refuse actuellement tout rôle autre que owner ou admin pour l'organisation interne. Cette branche est donc inaccessible dans le CRM interne actuel ; elle ne doit pas servir de preuve que le CRM client multi-tenant est activé.
- Les écritures effectuées par un traitement utilisant le rôle service peuvent produire un historique dont actor_user_id est nul via auth.uid(). Avant les imports/agents serveur, définir une attribution explicite « système » ou un identifiant de mission, sans usurper un utilisateur humain.

**Décision :** le socle métier est structuré dans le dépôt, mais il n'est pas encore recetté de bout en bout et les migrations CRM critiques ne sont pas présentes sur majestios-crm. Pas d'ouverture pilote, pas de migration distante et pas de déploiement de production à ce stade.


### 11.9 Facturation intégrée — périmètre absent de l'existant audité

L'audit des tables, migrations, fonctions Edge et parcours CRM ne démontre pas de domaine de facturation opérationnel sur les projets Supabase inspectés. Aucun cycle devis → facture → transmission PA → statut/rejet → règlement n'a été recetté. La page d'information sur la facturation électronique ne constitue pas un module de facturation.

Cette absence est une évolution structurante de phase 2, et non une anomalie à corriger par ajout précipité de tables dans le CRM actuel. Le modèle doit être conçu comme un domaine métier distinct mais relié au CRM. Il doit prendre en charge les modes natif, connecté et hybride, avec une source de référence par objet, des identifiants externes stables, l'idempotence et des mécanismes anti-doublons.

Le détail fonctionnel et technique figure dans la [spécification cible](SPECIFICATION-CIBLE-FACTURATION-CRM-ELECTRONIQUE.md). Préparer dès le CRM actuel les identifiants, adresses de facturation, liens documentaires, événements et permissions nécessaires, sans prétendre que la facturation ou une intégration PA existe déjà. Aucune modification Supabase distante n'a été effectuée.

## 12. Protocole de recette préparé — 11 novembre 2026

Un protocole détaillé de recette CRM a été préparé pour `MajestiOS-Test`. Il couvre les rôles, les opérations entreprises/contacts/opportunités, l'historisation atomique, les relations inter-tenant, les privilèges SQL et le cycle des relances. Il distingue explicitement le CRM interne VIP du futur CRM client multi-tenant, qui ne peut pas être validé uniquement depuis le frontend actuel.

**Le protocole est préparé mais non exécuté (NOT RUN).** Cette préparation n'a créé aucune donnée, n'a lancé aucune migration et n'a modifié aucun paramètre Supabase. L'exécution devra commencer par une nouvelle vérification en lecture seule de l'état distant, puis être autorisée séparément avec des identités et données synthétiques.

Voir [PROTOCOLE-RECETTE-CRM-MAJESTIOS-TEST.md](PROTOCOLE-RECETTE-CRM-MAJESTIOS-TEST.md).
