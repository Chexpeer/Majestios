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


## 13. Recontrôle du projet MajestiOS-Test — 11 novembre 2026

Un second contrôle strictement en lecture seule a confirmé l'état nécessaire à la préparation de la recette :

- 39 migrations appliquées jusqu'à `20261109250000_cheexpeer_worker_server_bridge`.
- Tables CRM businesses, contacts, opportunities, activities et crm_reminders vides.
- Une seule organisation interne (`MajestiOS — CRM interne`), zéro membre ; aucun tenant client/partenaire ni compte synthétique prêt.
- RLS activée sur les tables CRM contrôlées.
- Les fonctions privées `can_read_crm_org` et `can_edit_crm_org` confirment les règles de rôle décrites dans le protocole de recette : client/partenaire, lecture pour tous les membres et écriture owner/admin/member ; interne, lecture et écriture owner/admin seulement.
- Privilèges UPDATE authenticated limités aux colonnes métier prévues ; les colonnes système sont exclues.
- Triggers d'historisation actifs sur businesses, contacts et opportunities.
- Job `majestios-crm-reminders` actif toutes les cinq minutes.
- RPC `complete_crm_reminder` SECURITY DEFINER exécutable par authenticated ; le corps vérifie la session, les droits tenant et l'existence de l'opportunité. Les tests sous JWT restent à exécuter.
- Redondance AN-15 confirmée : deux triggers d'intégrité appellent la même fonction sur businesses, contacts, opportunities et activities.

**Conclusion actualisée :** le socle de test est présent, mais les identités et tenants synthétiques n'existent pas. La recette multi-tenant ne peut pas commencer sans provisionnement contrôlé de ces éléments. Aucun compte, tenant, enregistrement, migration, paramètre ou fonction n'a été modifié lors de ce contrôle.


## 14. Reprise de l'audit CRM après recette CI — 11 novembre 2026, 15:00

### 14.1 État du code CRM constaté

Le CRM interne actuellement livré dans le dépôt expose les domaines suivants : entreprises, contacts, opportunités, activités et relances persistantes. Le client vérifie la session Auth, l'identité effective, l'appartenance à une organisation interne unique et le rôle owner/admin. Les formulaires et listes sont présents dans `crm.html`, avec pagination et recherche serveur.

Le périmètre observé ne comprend pas de domaine opérationnel devis/factures/avoirs/règlements, ni de connecteur PA. La page `facturation-electronique.html` est une page d'information et d'accompagnement, pas un écran de facturation. Ce constat est conforme au cadrage phase 2 ; il ne faut pas présenter la facturation comme disponible.

### 14.2 Préparation facturation : écarts de modèle à conserver dans le backlog phase 2

Le schéma CRM actuel contient notamment `vat_number`, les coordonnées générales de l'entreprise, les identifiants légaux et les relations tenant. Il ne démontre pas encore :
- une adresse de facturation distincte de l'adresse commerciale ;
- des contacts de facturation ou règles de destinataire ;
- des devis versionnés et acceptations ;
- des commandes, prestations ou interventions reliées aux documents ;
- des factures, avoirs, lignes, taxes, échéances et règlements ;
- des statuts de transmission PA, rejets, webhooks et clés d'idempotence ;
- un stockage documentaire métier privé et une politique de conservation.

Ces éléments ne doivent pas être ajoutés sous forme de colonnes ou tables improvisées dans le CRM interne. Ils relèvent du domaine MajestiOS Facturation et de MajestiOS Connect, à concevoir en phase 2 selon la spécification cible. Le CRM actuel doit préserver les identifiants stables, les relations, la provenance, l'historisation, les permissions et des contrats d'intégration sans dépendance à une PA.

### 14.3 Bloquants sécurité et recette

Le projet configuré par le frontend reste `majestios-crm`, distinct de `MajestiOS-Test`. L'audit en lecture seule signale toujours, sur le projet principal, les privilèges UPDATE trop larges sur les fiches entreprises/contacts/opportunités et l'absence des triggers d'historisation présents dans le projet de test. Les migrations correctives sont versionnées dans Git, mais ne sont pas déployées sur le projet principal. La CI statique verte ne modifie pas ce constat.

Le protocole de recette `PROTOCOLE-RECETTE-CRM-MAJESTIOS-TEST.md` reste préparatoire : aucun tenant ni compte synthétique n'est prêt, et aucun scénario JWT multi-rôle/inter-organisation n'est déclaré exécuté. Aucune action Supabase distante n'a été effectuée dans cette reprise.

### 14.4 CI du dépôt — contrôle actualisé

Le workflow `verify-static-site` a terminé avec succès sur le HEAD Evolution-9 `905041b6c736a1c66adade91561beb623c67a1fe`, run [43042947816](https://github.com/Chexpeer/Majestios/actions/runs/43042947816). Les contrôles exécutés comprennent syntaxe JavaScript, contrats Cheexpeer, sécurité CRM statique, build, architecture/routes, liens et identifiants, documentation, tests navigateur de navigation desktop/mobile, recherche, Réputation virtuelle, BOAMP/BODACC, contact sans transmission et verrouillage du cockpit sans session.

**Interprétation :** CI verte = contrôles automatisés du dépôt réussis. Elle ne vaut ni migration Supabase, ni test multi-utilisateur distant, ni validation visuelle, ni déploiement production.

### 14.5 Ordre de poursuite

1. Sécuriser et recetter le CRM sur un environnement de test explicitement autorisé, en commençant par les privilèges de colonnes et l'historisation.
2. Établir les scénarios owner/admin/member/viewer et l'isolation inter-organisations avec données synthétiques.
3. Contrôler le parcours CRM complet entreprise → contact → opportunité → activité → relance.
4. Reprendre ensuite l'audit Cheexpeer et son écart entre code Git et worker réellement déployé.
5. Terminer par la consolidation documentaire et la revue visuelle des espaces privés.

**Aucune écriture Supabase, migration, modification de données, déploiement Vercel ou promotion production n'a été effectuée.**

## 15. Contrôle fonctionnel du ciblage APE/NAF — 11 novembre 2026

La revue du code crm-page.js a révélé une anomalie dans les expressions régulières de validation des codes APE/NAF et des départements. Les antislashs étaient doublés dans les regex littérales JavaScript : des valeurs usuelles comme 43.21A et 72 étaient donc interprétées comme des motifs contenant littéralement le marqueur de chiffre, et non comme des chiffres. Le formulaire pouvait refuser les critères valides avant même l'appel à l'API Recherche d'Entreprises.

**Correction intégrée dans Evolution-9 :**
- correction des deux regex pour reconnaître les formats APE/NAF NN.NNA et les départements français, y compris les codes spécifiques ultramarins ;
- ajout d'assertions de non-régression dans verify-site.js pour protéger les deux motifs exacts.

**Statut :** corrigé dans le code et contrôle statique ajouté. Le résultat CI du commit correctif doit être vérifié avant de considérer la correction comme validée par la suite complète. Aucun appel API métier n'a été effectué et aucune donnée CRM n'a été créée.

**Autres limites confirmées :** le ciblage interroge actuellement une seule page de l'API publique (maxPages: 1) et sélectionne au plus 10 candidats. C'est un choix fonctionnel limité, pas une preuve d'exhaustivité des entreprises correspondantes ; l'interface doit continuer à présenter les résultats comme des candidats à vérifier.

**Sécurité distante inchangée :** CRM-06 reste bloquant sur majestios-crm tant que les privilèges UPDATE et l'historisation n'ont pas été corrigés après validation et autorisation. Le protocole multi-rôle sur MajestiOS-Test reste NOT RUN.


## 16. Audit approfondi des relations, de l'historisation et des transitions — 11 novembre 2026

**Environnement contrôlé :** `MajestiOS-Test` (`qrlnnfjstoeliymxtkbk`), exclusivement en lecture seule.

### 16.1 Fonction de traitement des relances

La définition distante de `public.complete_crm_reminder(uuid)` a été relue :
- `SECURITY DEFINER`, avec `search_path` explicitement vide ;
- exécution autorisée à `authenticated` et `service_role`, pas à `anon` ;
- identité issue de `auth.uid()`, refus si absente ;
- verrouillage de la relance avec `FOR UPDATE` ;
- vérification de `private.can_edit_crm_org(organization_id)` ;
- refus si la relance n'est pas `pending` ;
- vérification de l'opportunité dans la même organisation ;
- mise à jour de la relance et insertion d'une activité dans la même transaction.

Ces contrôles réduisent les risques d'accès non autorisé et de double traitement. Ils ne remplacent pas un test authentifié owner/admin/member sur deux organisations. L'advisor Supabase SECURITY DEFINER reste donc ouvert jusqu'à recette et revue des permissions.

### 16.2 Déclencheurs d'intégrité en doublon

La base de test contient deux déclencheurs appelant la même fonction `private.enforce_tenant_relationship_integrity()` sur chacune des tables suivantes :
- `businesses` : `businesses_tenant_integrity` et `businesses_enforce_tenant_integrity` ;
- `contacts` : `contacts_tenant_integrity` et `contacts_enforce_tenant_integrity` ;
- `opportunities` : `opportunities_tenant_integrity` et `opportunities_enforce_tenant_integrity` ;
- `activities` : `activities_tenant_integrity` et `activities_enforce_tenant_integrity`.

Les définitions inspectées portent toutes sur `BEFORE INSERT OR UPDATE` et appellent la même fonction. Il s'agit d'une double exécution inutile du même contrôle. Cause probable : une migration initiale a créé les déclencheurs `*_tenant_integrity`, puis une migration ultérieure a ajouté les `*_enforce_tenant_integrity` sans supprimer les premiers. Cette hypothèse est corroborée par les migrations versionnées ; aucune suppression n'a été effectuée.

**Correction préparatoire :** conserver un seul déclencheur par table, après vérification de l'historique de migration et d'un test de non-régression. Ne pas corriger directement la base distante dans cette passe.

### 16.3 Historisation des activités

La table `activities` contient un journal d'activité avec `occurred_at`, `actor_user_id`, `subject`, `body` et `metadata`. Les déclencheurs enregistrent les créations et modifications des entreprises, contacts et opportunités. Lors d'une modification, le journal conserve les noms des champs modifiés et les changements de statut avant/après des opportunités.

**Limite P1 :** pour les modifications ordinaires, les valeurs précédentes et nouvelles ne sont pas enregistrées ; seul le nom des champs est conservé. Le journal ne permet donc pas de reconstituer complètement l'état antérieur d'une fiche. Les valeurs sensibles ne doivent toutefois pas être copiées en bloc : concevoir une liste blanche de champs métier, avec masquage/minimisation des données personnelles.

La politique RLS observée sur `activities` autorise la lecture aux membres autorisés et l'ajout aux éditeurs autorisés. Aucun droit UPDATE ou DELETE direct n'a été observé pour `authenticated`, ce qui constitue une bonne base d'append-only. `service_role` conserve des privilèges étendus : son usage serveur doit rester strictement contrôlé.

### 16.4 Transitions commerciales et relances

La contrainte `opportunities_status_check` limite les statuts à : `detected`, `to_qualify`, `qualified`, `to_contact`, `contacted`, `meeting`, `proposal`, `won`, `lost`, `archived`. Cette contrainte valide l'appartenance à la liste, mais n'impose pas une machine à états : elle ne bloque pas les transitions métier incohérentes.

Le déclencheur `opportunities_sync_crm_reminders` annule les relances `pending` lorsque l'opportunité passe à `won`, `lost` ou `archived`, ou lorsque l'action/date suivante est absente. Il annule aussi une relance devenue obsolète et met à jour le titre/action d'une relance encore en attente lorsque l'échéance correspond.

**À tester :** transitions interdites, réouverture d'une opportunité clôturée, motif obligatoire de perte/archivage, cohérence des relances après changement de statut, et comportement en cas de concurrence.

### 16.5 Relations et suppression

Les clés étrangères empêchent plusieurs liens inter-entités, et la fonction d'intégrité vérifie l'appartenance à la même organisation et la cohérence entreprise/contact/opportunité. En revanche, les suppressions de fiches entreprise/contact/opportunité peuvent détacher les activités par `ON DELETE SET NULL`, tandis que la suppression d'une organisation efface en cascade son CRM et ses activités.

**Risque P1 de conservation :** définir archivage logique, procédure de suppression, export préalable et durée de conservation avant ouverture à des clients. Étudier des instantanés métier minimisés pour que l'historique reste intelligible après suppression d'une fiche.

### 16.6 Données de recette et limites

Le projet de test contrôlé ne contient aucune fiche entreprise, contact, opportunité, activité ou relance au moment de ce contrôle. Il n'est donc pas possible de prouver les scénarios métier ni l'isolation inter-tenant par des données réelles. Aucun jeu de données synthétique ni compte multi-rôle n'a été créé dans cette passe.

**Aucune migration, modification de données, suppression de déclencheur ou activation de fonction n'a été effectuée.**


## 17. Revue des contrôles d’accès du parcours CRM — 12 novembre 2026

**Périmètre :** lecture du code `espace-interne.js`, `crm-client.js`, `crm-page.js`, `crm-workspace-nav.js` et des migrations de rôles/VIP, sans écriture Supabase.

### 17.1 Contrôles applicatifs observés

- `espace-interne.js` confirme l'identité avec `auth.getUser()`, recherche les appartenances, puis exige exactement une organisation de type `internal`. Plusieurs organisations internes entraînent un refus.
- L'accueil interne réserve les liens CRM, administration et recherches ciblées aux rôles `owner` et `admin`. Les rôles `member` et `viewer` n'obtiennent pas le lien VIP.
- `crm-client.js` répète le contrôle côté module : session, identité, organisation interne unique et rôle `owner/admin`. Un accès direct à `crm.html` ne dépend donc pas du seul masquage du lien dans l'accueil.
- Les lectures de fiches sont filtrées par `organization_id`. Les fonctions de mise à jour utilisent une liste blanche de colonnes et revérifient l'organisation.

### 17.2 Limites SQL et production

Ces contrôles frontend ne constituent pas une homologation de sécurité. Les migrations versionnées prévoient les politiques RLS et la restriction des colonnes, mais le projet principal `majestios-crm` conserve les anomalies distantes déjà relevées : privilèges UPDATE trop larges (CRM-03) et absence de triggers d'historisation (CRM-02). Les migrations correctives ne sont pas appliquées à la production.

Le protocole de recette inter-organisations et multi-rôles reste non exécuté. La CI statique ne prouve ni l'isolation réelle PostgreSQL, ni la résistance aux appels REST directs, ni les permissions effectives du projet distant.

**Conclusion :** contrôles applicatifs cohérents à la lecture du code ; sécurité SQL distante non homologuée ; CRM-02, CRM-03 et CRM-05/CRM-07 restent ouverts. Aucune migration, donnée, configuration Auth, fonction Edge ou déploiement n'a été modifié.


## 18. Recontrôle distant comparatif — 13 novembre 2026 (lecture seule)

**Projets consultés :**
- `majestios-crm` — `qxaghcifdhugfskuscoc`, projet ciblé par le frontend ;
- `MajestiOS-Test` — `qrlnnfjstoeliymxtkbk`, projet de test.

Les listes de migrations, tables, triggers PostgreSQL (`pg_trigger`), policies RLS, privilèges effectifs, définitions de fonctions et Security Advisors ont été relus. Aucune donnée, migration, policy, fonction, clé, secret ou configuration n'a été modifié.

### 18.1 Parité réelle des environnements

| Contrôle | `majestios-crm` | `MajestiOS-Test` |
|---|---|---|
| Migrations appliquées | 22, jusqu'à `20261108181246_vip_only_crm_access` | 39, jusqu'à `20261109250000_cheexpeer_worker_server_bridge` |
| Politique CRM principale | VIP / owner-admin interne | Policies tenant-scoped avec rôles selon le type d'organisation |
| Triggers d'intégrité | Un trigger `*_tenant_integrity` par table CRM contrôlée | Deux triggers par table : `*_tenant_integrity` et `*_enforce_tenant_integrity` |
| `complete_crm_reminder` | SECURITY INVOKER | SECURITY DEFINER |
| Alerte Security Advisor | Protection contre mots de passe compromis désactivée | RPC SECURITY DEFINER exécutable par authenticated et RLS désactivée sur `private.reputation_audit_usage` |

Cet écart est un écart de schéma effectivement observé, pas une autorisation de synchroniser les projets. Le projet de test contient des évolutions non appliquées au projet ciblé par le frontend ; leurs politiques et comportements ne sont donc pas interchangeables.

### 18.2 Relecture affinée — RPC de relance en production

Sur `majestios-crm`, `public.complete_crm_reminder(uuid)` est SECURITY INVOKER et exécutable par `authenticated`. Son corps lit la relance avec `SELECT ... FOR UPDATE`, contrôle `private.is_org_editor`, met à jour uniquement `state` et `read_at`, puis insère une activité.

La première lecture avait conclu à tort à l'absence totale de privilège UPDATE. Le contrôle des privilèges par colonne corrige ce point :
- `authenticated` dispose de SELECT sur les colonnes nécessaires ;
- `authenticated` dispose bien de privilèges UPDATE **au niveau des colonnes `state` et `read_at`** ; il ne dispose pas d'un UPDATE global de table ;
- la policy SELECT et la policy UPDATE de `crm_reminders` sont toutes deux limitées à `private.is_org_admin(organization_id)` ;
- la policy UPDATE impose aussi `state = 'read'` et `read_at IS NOT NULL` ;
- le helper `private.is_org_editor` accepte owner/admin/member, mais le filtre RLS SELECT empêche un member non-admin de lire la ligne ; la policy INSERT sur `activities` est également limitée à `is_org_admin`.

**Conclusion corrigée :** les privilèges de colonnes et les policies observées sont cohérents avec un traitement VIP owner/admin. Le helper plus large est redondant et sémantiquement trompeur, mais ne suffit pas à donner aux membres l'accès aux relances. Le défaut P1 précédemment annoncé n'est donc **pas confirmé**. Un test authentifié owner/admin puis member reste nécessaire pour homologuer le comportement de bout en bout ; aucun appel authentifié n'a été exécuté. Ne pas ajouter de GRANT global ni élargir la policy. Si une simplification est retenue plus tard, elle devra conserver explicitement la frontière VIP et être testée.

### 18.3 Doublons de triggers : différence entre les projets

La lecture directe de `pg_trigger` confirme :
- sur `majestios-crm`, un seul trigger d'intégrité par table (`businesses`, `contacts`, `opportunities`, `activities`) ;
- sur `MajestiOS-Test`, deux triggers distincts par table, chacun exécutant `private.enforce_tenant_relationship_integrity()`.

Le résultat précédent d'`information_schema.triggers` pouvait répéter une ligne par événement d'un trigger multi-événements. Le contrôle de `pg_trigger` élimine cette ambiguïté : les doublons sont de vrais objets PostgreSQL distincts sur le projet de test, pas un artefact d'affichage. Ils provoquent une double exécution du même contrôle avant INSERT/UPDATE.

### 18.4 RLS de `private.reputation_audit_usage` sur le projet de test

Le Security Advisor de `MajestiOS-Test` classe l'absence de RLS comme **CRITICAL** et recommande :

```sql
ALTER TABLE private.reputation_audit_usage ENABLE ROW LEVEL SECURITY;
```

La vérification directe complémentaire indique :
- RLS désactivée ;
- `anon` n'a pas USAGE sur le schéma `private` et n'a pas SELECT sur la table ;
- `authenticated` a USAGE sur le schéma mais n'a pas SELECT direct sur cette table ;
- aucun accès direct navigateur n'a donc été démontré par les privilèges examinés.

L'alerte reste ouverte comme défaut de défense en profondeur. Dans le cas étudié, l'absence de policy directe est intentionnelle si l'accès à la table reste exclusivement encapsulé par la fonction SECURITY DEFINER contrôlée. Il ne faut donc pas créer de policy SELECT pour les rôles navigateur. Avant activation, vérifier le propriétaire, BYPASSRLS, FORCE RLS et le comportement runtime du RPC ; l'activation RLS sans policy doit être testée sur copie.

### 18.5 SECURITY DEFINER du RPC sur le projet de test

Sur `MajestiOS-Test`, `public.complete_crm_reminder(uuid)` est SECURITY DEFINER et exécutable par `authenticated`, ce que signale le Security Advisor. Son corps vérifie `auth.uid()`, l'appartenance/permission via `private.can_edit_crm_org`, l'état de la relance et l'organisation de l'opportunité. Ces contrôles sont positifs à la lecture, mais l'exposition d'un RPC SECURITY DEFINER dans le schéma public nécessite une recette authentifiée négative et positive (non-membre, member, owner/admin, autre organisation) et une revue de l'EXECUTE. Ne pas révoquer ou déplacer le RPC sans vérifier les appels de l'application.

### 18.6 Autres alertes

- `majestios-crm` : Auth Advisor signale la protection contre les mots de passe compromis désactivée. À arbitrer avec le parcours d'inscription/OTP et le fournisseur Auth ; aucune modification Auth n'a été faite.
- `MajestiOS-Test` : Security Advisor signale le RPC SECURITY DEFINER et la table sans RLS ; ces alertes ne doivent pas être confondues avec une preuve d'exploitation.
- Les projets sont en PostgreSQL 17.11. Le changelog Supabase du 25 septembre 2026 signale une mise à jour mineure corrigeant 44 CVE et des précautions possibles concernant `ltree`, `pgcrypto`, `btree_gist` et les opérateurs personnalisés. Aucun problème d'extension précis n'a été établi par ce contrôle ; inventaire ciblé requis si ces extensions sont utilisées.

### 18.7 Actions à préparer, sans exécution distante

1. Décider si le RPC de relance du projet principal est réservé au VIP owner/admin ou s'il doit aussi accepter member.
2. Préparer une correction cohérente de `complete_crm_reminder` (helper + policy + GRANT + tests), sans modifier la base avant revue.
3. Préparer une migration idempotente de suppression d'un seul des deux triggers d'intégrité sur `MajestiOS-Test`, après test sur copie/jeu isolé et vérification des effets secondaires.
4. Examiner les droits du propriétaire de `private.consume_reputation_audit_quota` et la stratégie RLS de `private.reputation_audit_usage`.
5. Effectuer une recette inter-organisations owner/admin/member sur deux organisations de test, avec vérification REST directe et refus des accès croisés.
6. Planifier l'activation de la protection contre les mots de passe compromis seulement après recette du parcours d'authentification.

**Statut :** audit comparatif actualisé ; aucun correctif Supabase distant ni aucune migration Git n'a été appliqué dans cette étape.

## 19. Analyse ciblée des triggers et quotas — 13 novembre 2026 (lecture seule)

Cette vérification approfondit les deux alertes restantes du projet `MajestiOS-Test`. Elle n'a exécuté aucun DDL, aucun appel métier et aucune modification distante.

### 19.1 Origine exacte des triggers en double

La chaîne Git explique précisément le doublon :
- `20261105163953_enforce_tenant_relationship_integrity.sql` crée les triggers `*_tenant_integrity` sur les quatre tables ;
- `20261109210000_activate_crm_integrity_and_reminder_rpc.sql` crée ensuite `*_enforce_tenant_integrity` sans supprimer les triggers initiaux ;
- la migration tardive utilise `DROP TRIGGER IF EXISTS` uniquement sur le nom `*_enforce_tenant_integrity`, puis le recrée. Elle ne retire donc pas `*_tenant_integrity`.

Le catalogue distant `pg_trigger` confirme les deux objets sur chacune des quatre tables du projet de test. Les deux déclenchent la même fonction, en BEFORE INSERT OR UPDATE. Ce n'est pas une simple répétition de lignes liée aux événements.

**Correction candidate, non exécutée :** une migration additive et idempotente sur le projet de test peut supprimer les quatre anciens noms `*_tenant_integrity` et conserver les quatre noms `*_enforce_tenant_integrity` actuellement attachés. Avant toute application, vérifier à nouveau les définitions exactes, sauvegarder et tester les insertions/mises à jour valides et invalides sur une copie. Ne pas modifier les migrations historiques déjà appliquées.

```sql
drop trigger if exists businesses_tenant_integrity on public.businesses;
drop trigger if exists contacts_tenant_integrity on public.contacts;
drop trigger if exists opportunities_tenant_integrity on public.opportunities;
drop trigger if exists activities_tenant_integrity on public.activities;
```

Ce SQL n'est qu'une proposition de migration ciblée pour `MajestiOS-Test`, pas un ordre d'exécution ni une correction destinée au projet principal.

### 19.2 RLS de la table de quotas : contexte d'exécution vérifié

La table `private.reputation_audit_usage` appartient à `postgres`, RLS est désactivée et FORCE ROW LEVEL SECURITY est désactivé. Les rôles `authenticated` et `service_role` n'ont pas de SELECT direct sur la table.

La fonction `private.consume_reputation_audit_quota(uuid)` :
- appartient également à `postgres` ;
- est SECURITY DEFINER ;
- fixe `search_path` à vide ;
- vérifie `auth.uid()` et l'appartenance à l'organisation avec `private.is_org_member` ;
- exécute elle-même les lectures, suppressions et insertions de compteur ;
- est exécutable par authenticated.

Le rôle `postgres` du projet a `BYPASSRLS = true`. Le wrapper public `consume_reputation_audit_quota(uuid)` est SECURITY INVOKER et appelle la fonction privée ; le droit EXECUTE sur cette fonction privée est accordé à authenticated.

**Conclusion affinée :** l'activation de RLS sur la table sans policy destinée aux accès directs devrait bloquer l'accès direct des rôles ordinaires tout en laissant la fonction SECURITY DEFINER propriétaire-postgres effectuer son travail, puisque le propriétaire possède BYPASSRLS et que FORCE ROW LEVEL SECURITY est désactivé. C'est une conclusion issue des catalogues, pas une recette runtime. Il faut tout de même tester le wrapper public avec un membre valide, un non-membre et un appel non authentifié avant toute migration.

**Correction candidate, non exécutée :**

```sql
alter table private.reputation_audit_usage enable row level security;
```

Ne pas ajouter de policy SELECT pour authenticated ou anon. Recontrôler après activation que RLS est ON, FORCE RLS reste OFF, les privilèges directs restent absents et le parcours de quota fonctionne uniquement par le RPC autorisé.

### 19.3 Priorité opérationnelle proposée

1. Préparer deux migrations séparées, strictement limitées à `MajestiOS-Test` : nettoyage des triggers en double ; activation RLS de la table de quotas.
2. Les exécuter d'abord sur une copie isolée, avec tests de rejet inter-organisations et test quota positif/négatif.
3. Soumettre les migrations et le plan de retour arrière à revue avant toute application au projet distant.
4. Ne pas promouvoir ces changements vers `majestios-crm` : le principal n'a pas les doublons de triggers et n'est pas le projet de test.

**Statut :** causes identifiées et corrections candidates documentées ; aucune migration Git ajoutée, aucun SQL exécuté en écriture et aucun changement de configuration distante.

### 19.4 Matrice de recette obligatoire avant migration

Les essais doivent être exécutés sur une copie isolée de `MajestiOS-Test`, avec comptes et organisations synthétiques. Aucun de ces essais n'a été exécuté pendant l'audit.

**A. Nettoyage des triggers**

| Cas | Action | Résultat attendu |
|---|---|---|
| TRG-01 | INSERT d'une entreprise avec relations cohérentes dans la même organisation | accepté ; contrôle d'intégrité conservé |
| TRG-02 | INSERT avec relation vers un enregistrement d'une autre organisation | rejeté |
| TRG-03 | UPDATE d'un lien vers un enregistrement d'une autre organisation | rejeté |
| TRG-04 | UPDATE sans changement de relation | accepté si l'état initial est valide |
| TRG-05 | champs relationnels optionnels à NULL | accepté lorsque le modèle les autorise |
| TRG-06 | vérifier les triggers après migration sur les quatre tables | un seul trigger actif par table, nom `*_enforce_tenant_integrity`, événements BEFORE INSERT OR UPDATE |
| TRG-07 | vérifier les écritures métier et les erreurs retournées par l'API | aucun changement de sémantique ; pas de double exécution observable |

La recette doit couvrir `businesses`, `contacts`, `opportunities` et `activities`. Les cas positifs et négatifs doivent être répétés sur au moins deux organisations distinctes.

**B. Activation RLS des quotas**

| Cas | Identité / action | Résultat attendu |
|---|---|---|
| QUOTA-01 | rôle authenticated : SELECT direct sur la table privée | refusé |
| QUOTA-02 | rôle anon / appel non authentifié au wrapper | refusé |
| QUOTA-03 | membre autorisé : consommation via RPC | acceptée dans les limites |
| QUOTA-04 | utilisateur non membre de l'organisation | refusé |
| QUOTA-05 | tentative d'utiliser l'identifiant d'une autre organisation | refusée |
| QUOTA-06 | atteindre puis dépasser la limite utilisateur (5/jour) | seuil respecté, dépassement refusé |
| QUOTA-07 | atteindre puis dépasser la limite organisation (25/jour) | seuil respecté, dépassement refusé |
| QUOTA-08 | appels concurrents proches de la limite | compteur cohérent, pas de dépassement dû à une course |
| QUOTA-09 | contrôle catalogue après migration | RLS activée, FORCE RLS désactivé, aucune policy donnant accès direct à anon/authenticated |
| QUOTA-10 | rôle service_role et accès administratif | comportement explicite et documenté ; ne pas assimiler service_role à un utilisateur navigateur |

Les seuils 5/jour et 25/jour sont ceux de l'implémentation auditée et doivent être revalidés dans le code SQL de la copie avant de considérer les assertions comme contractuelles. La recette doit aussi contrôler les frontières de date/fuseau et le nettoyage des compteurs expirés.

### 19.5 Retour arrière et critères d'arrêt

**Nettoyage des triggers :**
- Avant migration, exporter les définitions des huit triggers et conserver une sauvegarde exploitable de la base de test.
- Si une régression apparaît, arrêter les essais métier et restaurer la définition antérieure exacte uniquement sur la copie isolée.
- Ne pas recréer automatiquement les quatre triggers en double comme stratégie de retour standard : cela réintroduirait le défaut. Toute restauration temporaire doit être explicitement qualifiée et suivie d'une nouvelle analyse.

**Activation RLS quotas :**
- Si le RPC échoue après activation, arrêter les appels de test et revenir sur la copie à l'état précédent avec `ALTER TABLE private.reputation_audit_usage DISABLE ROW LEVEL SECURITY;`, puis diagnostiquer avant une nouvelle tentative.
- Cette instruction est une procédure de laboratoire, pas une recommandation de désactivation sur le projet distant.
- Ne jamais compenser un échec en accordant SELECT direct à `anon` ou `authenticated`, ni en ajoutant une policy permissive.

**Critères d'arrêt communs :**
1. échec d'un cas d'isolation inter-organisations ;
2. accès direct inattendu à la table de quotas ;
3. perte d'accès pour un membre autorisé ou franchissement d'un quota ;
4. changement de comportement métier non expliqué ;
5. différence entre le schéma réellement testé et celui du projet distant.

Aucune migration ne doit être appliquée à `MajestiOS-Test` avant réussite de cette matrice, revue du SQL final, sauvegarde vérifiée et autorisation explicite. Ces propositions restent strictement séparées de `majestios-crm`.

**Statut de clôture documentaire au 14 novembre 2026 :** l'analyse statique et les causes racines sont consolidées ; les tests runtime, les migrations correctives et leur application restent NOT RUN / NOT APPLIED.
