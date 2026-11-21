# Protocole de recette CRM — Evolution-9 / MajestiOS-Test

**Date de préparation :** 11 novembre 2026  
**Branche :** `Evolution-9`  
**Projet cible exclusif de la recette :** `MajestiOS-Test` (`qrlnnfjstoeliymxtkbk`)  
**Projet exclu :** `majestios-crm` (`qxaghcifdhugfskuscoc`)  
**Nature du document :** protocole préparatoire ; aucune recette distante n'est déclarée exécutée.

## 1. Objectif et décision de sécurité

Ce protocole doit démontrer, avant toute invitation de pilotes, que les opérations CRM essentielles sont cohérentes, historisées, autorisées par rôle et isolées entre organisations.

La recette est limitée à l'environnement **MajestiOS-Test**. Elle utilisera exclusivement des comptes, organisations et fiches synthétiques dédiés. Le projet `majestios-crm`, actuellement référencé par le frontend public, ne doit recevoir aucune donnée de test.

**Aucune écriture distante n'est autorisée par ce document.** La création de comptes ou de données de test, l'exécution de scénarios, la modification de configuration et le nettoyage nécessitent un plan d'exécution distinct et une validation explicite. Ne pas appliquer les migrations absentes du projet principal pour rendre les environnements artificiellement identiques.

## 2. Périmètre fonctionnel

La recette couvre :

1. authentification et appartenance à une organisation ;
2. création et lecture d'une entreprise ;
3. création et lecture d'un contact rattaché à cette entreprise ;
4. création et lecture d'une opportunité rattachée à l'entreprise et au contact ;
5. modification des fiches et historisation atomique ;
6. ajout d'une activité métier ;
7. cohérence des relations entre entreprise, contact, opportunité et activité ;
8. attribution à un membre de la même organisation ;
9. relances persistantes, matérialisation et clôture atomique ;
10. cloisonnement entre deux organisations ;
11. droits owner/admin/member/viewer ;
12. distinction entre CRM interne VIP et CRM client multi-tenant.

Hors périmètre de cette recette : facturation, émission ou réception de factures, transmission PA, consentement juridique complet, import massif, délivrabilité email, sauvegarde/restauration et autonomie métier de Cheexpeer. La facturation reste cadrée dans sa spécification phase 2.

## 3. Préconditions bloquantes

Avant d'exécuter le moindre scénario :

- [ ] confirmer dans le tableau de bord le projet actif : `MajestiOS-Test`, ID `qrlnnfjstoeliymxtkbk` ;
- [ ] confirmer que le projet n'est pas le projet principal `majestios-crm` ;
- [ ] relever le SHA de branche et les migrations réellement appliquées ;
- [ ] comparer les migrations nécessaires au scénario avec l'état distant, sans les appliquer ;
- [ ] vérifier les fonctions RPC, triggers, politiques RLS et privilèges réellement déployés ;
- [ ] disposer d'au moins deux identités de test indépendantes pour deux organisations clientes distinctes ;
- [ ] disposer de comptes owner/admin/member/viewer pour les tests de rôle, sans réutiliser les comptes personnels ;
- [ ] confirmer que les comptes et organisations sont synthétiques et identifiés comme données de recette ;
- [ ] définir qui peut créer et supprimer ces comptes de test, et comment les supprimer proprement ;
- [ ] désactiver tout envoi réel, toute intégration externe et toute notification non nécessaire ;
- [ ] conserver les preuves sans enregistrer de jetons, mots de passe, clés ou données personnelles réelles.

**Arrêt immédiat** si le projet, le rôle, la migration ou l'identité de test ne peuvent pas être établis sans ambiguïté.

## 4. Modèle de test

Créer, après autorisation, un jeu isolé :

| Élément | Organisation A | Organisation B |
|---|---|---|
| Organisation | `RECETTE-E9-A` | `RECETTE-E9-B` |
| Entreprise | `SOCIETE-TEST-A` | `SOCIETE-TEST-B` |
| Contact | `CONTACT-TEST-A` | `CONTACT-TEST-B` |
| Opportunité | `OPPORTUNITE-TEST-A` | `OPPORTUNITE-TEST-B` |
| Utilisateurs | owner, admin, member, viewer selon disponibilité | owner ou member indépendant |

Les valeurs SIREN/SIRET, emails et téléphones doivent être des valeurs fictives acceptées par les contraintes de test, jamais celles d'une vraie entreprise ou d'un vrai contact. Si un format valide est exigé, utiliser un jeu réservé aux tests et ne pas contacter les coordonnées.

Le modèle interne VIP est testé séparément : une identité owner/admin liée à une organisation de type `internal`. Un rôle member/viewer interne ne doit pas être considéré comme autorisé au CRM interne.

## 5. Matrice des rôles attendus

Les résultats doivent être établis à partir des politiques et fonctions réellement déployées sur `MajestiOS-Test`, pas seulement de l'interface.

| Type d'organisation | Rôle | Lecture CRM | Création / modification |
|---|---|---|---|
| Interne MajestiOS | owner | autorisée | autorisée |
| Interne MajestiOS | admin | autorisée | autorisée |
| Interne MajestiOS | member | refusée pour le CRM interne | refusée |
| Interne MajestiOS | viewer | refusée pour le CRM interne | refusée |
| Cliente / partenaire | owner | autorisée par `private.can_read_crm_org` | autorisée par `private.can_edit_crm_org` |
| Cliente / partenaire | admin | autorisée par `private.can_read_crm_org` | autorisée par `private.can_edit_crm_org` |
| Cliente / partenaire | member | autorisée par `private.can_read_crm_org` | autorisée par `private.can_edit_crm_org` |
| Cliente / partenaire | viewer | autorisée par `private.can_read_crm_org` | refusée par `private.can_edit_crm_org` |

La matrice ci-dessus correspond à la définition actuellement relue sur `MajestiOS-Test` : `can_read_crm_org` autorise tout membre d'un tenant non interne ; `can_edit_crm_org` autorise owner/admin/member pour un tenant client/partenaire, mais seulement owner/admin pour l'organisation interne. Les tests effectifs par JWT restent obligatoires.

Le frontend `crm-client.js` actuellement inspecté impose une organisation interne unique et les rôles owner/admin. Il ne constitue donc pas, à lui seul, une interface de recette du futur CRM client. Les tests multi-tenant client doivent exercer les API/RLS avec les JWT des utilisateurs synthétiques, ou un futur frontend client explicitement déployé en test.

## 6. Scénarios de recette

Pour chaque scénario, enregistrer : identifiant, date, environnement, SHA, identité/ rôle, organisation, action, résultat attendu, résultat observé, identifiants synthétiques, preuve expurgée et statut (PASS / FAIL / BLOCKED / NOT RUN).

### CRM-REC-01 — Accès et identité

- Sans session : accès CRM refusé.
- Session expirée ou utilisateur incohérent : accès refusé et reconnexion demandée.
- Utilisateur sans appartenance : accès refusé.
- Utilisateur membre de deux organisations internes : refus tant qu'une sélection explicite n'est pas configurée.
- Utilisateur membre d'une organisation interne avec rôle owner/admin : accès autorisé.
- Utilisateur interne member/viewer : accès refusé au CRM VIP.

**PASS :** aucun accès n'est accordé par simple présence d'une session ; l'organisation et le rôle sont vérifiés.

### CRM-REC-02 — Création entreprise

Avec un utilisateur autorisé dans l'organisation A :

- créer une entreprise synthétique avec raison sociale, SIREN/SIRET de test, ville et qualification `to_review` ;
- relire la fiche dans A ;
- vérifier `organization_id`, `created_by`, `created_at` et `updated_at` ;
- tenter une création avec un champ système fourni par le client (`id`, `organization_id`, `created_by`, horodatages) : la liste blanche frontend doit refuser le payload et les droits SQL doivent empêcher la modification des colonnes protégées ;
- tenter un doublon SIREN puis un doublon SIRET normalisé dans le même tenant : le résultat doit correspondre aux contraintes réellement déployées.

**PASS :** la fiche est créée dans A, les champs système sont maîtrisés par le serveur et les contraintes d'unicité fonctionnent.

### CRM-REC-03 — Contact et relations

- créer un contact synthétique rattaché à l'entreprise A ;
- vérifier qu'il apparaît dans la fiche entreprise A ;
- tenter de rattacher le contact à une entreprise de B ;
- tenter une relation vers une entreprise inexistante ;
- tester un contact sans entreprise si le modèle l'autorise.

**PASS :** les relations restent dans la même organisation ; les cas invalides sont refusés par la base, pas seulement masqués dans l'interface.

### CRM-REC-04 — Opportunité et contact principal

- créer une opportunité A liée à l'entreprise A et au contact A ;
- vérifier les statuts autorisés et un score de qualification entre 0 et 100 ;
- tenter un score inférieur à 0, supérieur à 100 ou non numérique ;
- tenter de lier un contact B à l'entreprise A ;
- tenter une entreprise A avec un contact principal rattaché à une autre entreprise ;
- tenter de changer `organization_id` après création.

**PASS :** les contraintes métier et tenant sont appliquées par PostgreSQL ; aucune réaffectation de tenant n'est possible.

### CRM-REC-05 — Historisation atomique

Sur entreprise, contact et opportunité :

- créer la fiche et rechercher l'activité de type système correspondante ;
- modifier un champ métier et vérifier une activité avec `metadata.event = updated`, le bon `entity_type`, le bon `entity_id` et les champs modifiés ;
- modifier uniquement un champ technique tel que `updated_at` : aucune activité métier parasite ne doit être créée ;
- provoquer une modification invalide : ni fiche partiellement modifiée ni activité orpheline ne doivent subsister ;
- vérifier l'acteur : utilisateur authentifié attendu ; pour les écritures service/system, acteur humain nul ou attribution système explicitement conçue, jamais un faux utilisateur.

**PASS :** fiche et historique sont atomiques ; chaque modification réelle est traçable et correctement attribuée.

### CRM-REC-06 — Activité manuelle

- ajouter une note ou un appel lié à l'entreprise A, au contact A et, si approprié, à l'opportunité A ;
- vérifier l'auteur, l'organisation, le type, l'objet et la date ;
- tenter une activité mélangeant des entités de A et B.

**PASS :** l'activité reste dans A et toute relation croisée est rejetée.

### CRM-REC-07 — Attribution

- attribuer une entreprise et une opportunité à un membre de A ;
- tenter d'attribuer à un utilisateur non membre de A ;
- vérifier le refus côté base.

**PASS :** `assigned_to` ne peut désigner qu'un membre du même tenant.

### CRM-REC-08 — Relances

- créer une opportunité ouverte avec une prochaine action et une échéance future ; vérifier qu'aucune relance échue n'est matérialisée prématurément ;
- après l'échéance, attendre le cycle planifié (la migration prévoit une matérialisation toutes les cinq minutes) et vérifier l'apparition d'une relance ;
- relancer la vérification : aucune relance en doublon pour le même tenant/opportunité/échéance ;
- modifier l'échéance ou fermer l'opportunité : vérifier l'annulation ou la non-création de l'ancienne relance selon le cycle de vie effectivement déployé ;
- clôturer une relance via le RPC autorisé ;
- vérifier que la relance passe à `read` et qu'une activité `task` est créée dans la même transaction ;
- appeler une seconde fois le RPC : refus attendu car la relance n'est plus `pending` ;
- essayer le RPC sans session, avec un viewer, un member non autorisé selon le contrat effectif, et depuis B sur un identifiant de A.

**PASS :** une seule relance cohérente, clôture idempotente au sens métier (pas de double activité), refus des rôles et tenants non autorisés.

**Attention :** la fréquence de cinq minutes dépend de `pg_cron` réellement activé et du job présent sur le projet de test. Ne pas appeler manuellement une fonction privilégiée pour simuler le cron sans autorisation séparée.

### CRM-REC-09 — Cloisonnement A / B (test négatif obligatoire)

Avec le JWT de l'utilisateur B, tenter directement via l'API :

- lire l'entreprise, le contact, l'opportunité, l'activité et la relance de A par identifiant connu ;
- modifier une fiche A ;
- créer une fiche dans A en fournissant son `organization_id` ;
- lier une fiche B à une entité A ;
- appeler le RPC de clôture sur une relance A.

**PASS :** aucune donnée A n'est révélée ou modifiée par B ; les refus sont vérifiés côté RLS / fonction SQL. Un simple filtre `organization_id` dans le navigateur ne suffit pas comme preuve.

### CRM-REC-10 — Permissions SQL et champs protégés

Avec un JWT utilisateur (jamais service_role dans le test d'autorisation) :

- lire les privilèges effectifs UPDATE sur `businesses`, `contacts`, `opportunities` ;
- confirmer que seules les colonnes métier autorisées sont modifiables ;
- tenter de modifier `id`, `organization_id`, `created_by`, `created_at`, `updated_at` ;
- vérifier que les politiques UPDATE ont un contrôle `USING` et `WITH CHECK` adapté au rôle et au tenant.

**PASS :** les colonnes système ne sont pas modifiables par authenticated et les politiques SQL restent l'autorité.

## 7. Vérifications techniques avant la première écriture

Ces contrôles sont des lectures uniquement et doivent être consignés :

- versions de migrations présentes et appliquées ;
- présence des triggers `businesses_record_crm_activity`, `contacts_record_crm_activity`, `opportunities_record_crm_activity` ;
- absence de doublons de triggers d'intégrité appelant deux fois la même fonction ;
- privilèges UPDATE par colonne sur les trois tables ;
- définition, propriétaire, mode de sécurité et EXECUTE de `public.complete_crm_reminder(uuid)` ;
- définition des fonctions `private.can_read_crm_org` / `private.can_edit_crm_org` et politiques RLS correspondantes ;
- job `majestios-crm-reminders` et extension `pg_cron` ;
- absence de clés `service_role` dans le navigateur, les journaux ou les captures ;
- advisors sécurité/performance, sans suppression automatique des index signalés inutilisés.

Un résultat de lecture qui ne correspond pas au présent document bloque le scénario dépendant jusqu'à analyse.

## 8. Preuves et conservation

Pour chaque test :

- conserver le SHA Git exact et la version des migrations ;
- conserver les identifiants UUID synthétiques, jamais les secrets ;
- exporter les résultats SQL expurgés et les captures utiles ;
- consigner le rôle réellement utilisé et l'organisation associée ;
- consigner les erreurs attendues comme des résultats positifs lorsque le refus est correct ;
- ne jamais stocker de JWT, mot de passe, clé API, adresse personnelle ou donnée client réelle dans GitHub.

Les captures doivent masquer les emails et téléphones de test si ceux-ci peuvent être réutilisés. Les preuves sont déposées dans un dossier de recette dédié après autorisation, avec un résumé PASS/FAIL/BLOCKED.

## 9. Nettoyage et retour arrière

- utiliser uniquement des identifiants synthétiques explicitement inventoriés ;
- préférer un environnement jetable ou une transaction annulée lorsque le scénario le permet ;
- ne pas supprimer une organisation de test avant d'avoir vérifié les dépendances et exporté les preuves ;
- ne jamais lancer de suppression globale, de truncate ou de cascade sur un environnement partagé ;
- établir la liste exacte des UUID à nettoyer et demander validation ;
- conserver les preuves et le rapport avant nettoyage ;
- aucun nettoyage sur `majestios-crm`.

## 10. Critères de sortie

La recette CRM est considérée comme concluante uniquement si :

1. tous les scénarios P0 sont PASS ;
2. les tests négatifs inter-organisations sont PASS avec deux identités distinctes ;
3. les permissions SQL et les triggers sont vérifiés sur l'environnement cible ;
4. les relances sont testées de bout en bout, cron compris ;
5. les résultats sont reproductibles et rattachés à un SHA et à un état de migrations ;
6. aucun FAIL critique ou BLOCKED non arbitré ne subsiste ;
7. les limites fonctionnelles sont documentées ;
8. le CRM client n'est pas annoncé comme opérationnel tant que son parcours utilisateur complet n'a pas été validé ;
9. aucun changement n'a été propagé vers `majestios-crm` ou la production.

**Statut actuel : PRÉPARÉ — NOT RUN.** Ce protocole ne prouve pas que les tests ont été exécutés. Il ne vaut ni autorisation de créer des données, ni autorisation d'appliquer une migration, ni feu vert d'ouverture des pilotes.

## 11. Références techniques

- [Audit CRM et Supabase en lecture seule](AUDIT-CRM-SUPABASE-LECTURE-SEULE-2026-11-11.md)
- [Registre des anomalies Evolution-9](REGISTRE-ANOMALIES-EVOLUTION-9.md)
- [Spécification cible CRM, facturation et facturation électronique](SPECIFICATION-CIBLE-FACTURATION-CRM-ELECTRONIQUE.md)
- Migrations concernées : socle multi-tenant, rôles CRM, relations inter-tenant, relances, durcissement des colonnes UPDATE, historisation atomique et durcissement du RPC.


## 12. État distant recontrôlé en lecture seule — 11 novembre 2026

Un contrôle complémentaire du projet `MajestiOS-Test` a été réalisé après la préparation du protocole, sans écriture :

- **39 migrations appliquées**, jusqu'à `20261109250000_cheexpeer_worker_server_bridge` ; les migrations CRM de restriction UPDATE, historisation, durcissement du RPC et intégrité des relations sont présentes dans l'historique distant.
- Les tables CRM `businesses`, `contacts`, `opportunities`, `activities` et `crm_reminders` sont vides au moment du contrôle ; aucune donnée métier de recette n'est donc déjà disponible.
- Une seule organisation existe : `MajestiOS — CRM interne`, de type `internal`, avec **zéro membre**. Aucun tenant client/partenaire et aucun compte de recette ne sont actuellement prêts pour les tests.
- Les tables CRM contrôlées ont RLS activée. Les politiques observées appellent `private.can_read_crm_org` et `private.can_edit_crm_org`.
- Définitions vérifiées : `can_read_crm_org` permet la lecture à tout membre d'un tenant client/partenaire, et aux seuls owner/admin pour le tenant interne ; `can_edit_crm_org` permet l'écriture owner/admin/member sur les tenants client/partenaire, owner/admin sur le tenant interne.
- Les privilèges UPDATE du rôle `authenticated` sont limités aux colonnes métier prévues sur les trois tables ; les colonnes système `id`, `organization_id`, `created_by`, `created_at`, `updated_at` ne sont pas accordées.
- Les trois triggers `*_record_crm_activity` sont présents et actifs.
- Le job `majestios-crm-reminders` est présent, actif, planifié toutes les cinq minutes.
- Le RPC `public.complete_crm_reminder(uuid)` est SECURITY DEFINER et exécutable par `authenticated`, avec contrôle interne de session et de `private.can_edit_crm_org`, et vérification de l'existence de l'opportunité. Il reste à tester par JWT pour chaque rôle et tenant.
- **AN-15 est confirmé** : deux triggers d'intégrité distincts appellent la même fonction `enforce_tenant_relationship_integrity` sur chacune des tables businesses, contacts, opportunities et activities. C'est une redondance P2 à traiter après analyse, pas une raison de supprimer des triggers à chaud.

**Conséquence :** le projet de test possède le socle SQL nécessaire pour préparer une recette, mais pas les identités ni les tenants nécessaires à son exécution. Le prochain lot opérationnel doit être un plan de création contrôlée de comptes et organisations synthétiques, puis des tests API sous JWT utilisateur. Le CRM interne frontend ne peut pas être recetté tant qu'aucun owner/admin interne de test n'est provisionné.

Statut inchangé : **PRÉPARÉ — NOT RUN**. Ces lectures ne créent ni comptes, ni organisations, ni fiches, et ne valent pas autorisation d'écriture.
