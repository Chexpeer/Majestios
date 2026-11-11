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
