# Registre des anomalies — Evolution-9

**Branche :** `Evolution-9`  
**Base :** commit `53a780e7f8c3817197611c4cb9948b3c544a90a5` d'Evolution-8  
**Statut initial :** reprise et requalification en cours.

## 1. Règle

Une anomalie n'est clôturée que si la cause est comprise, la correction est présente sur Evolution-9, le test pertinent a été exécuté, le résultat est conservé et les limites restantes sont écrites. Un correctif de code seul n'est pas une preuve de recette.

## 2. Anomalies héritées prioritaires

| ID | Priorité | Domaine | Constat hérité | Statut initial sur Evolution-9 |
|---|---|---|---|---|
| AUTH-01 | P0 ciblé | OTP / provisionnement | Le code source `supabase/functions/provision-client-workspace/index.ts` et la migration RPC sont présents dans le dépôt ; la fonction n'était pas déployée sur les deux projets Supabase inspectés lors de l'audit Evolution-7. Le parcours OTP reste non recetté de bout en bout. | Ouvert — vérifier le déploiement actuel et réaliser une recette E2E avant ouverture des comptes |
| AUTH-02 | P1 | Consentement / preuve | La fonction de provisionnement vérifie `user_metadata.privacy_notice_acknowledged` et `privacy_notice_version`, données modifiables par l'utilisateur ; l'enregistrement actuel ne constitue pas à lui seul une preuve robuste d'un consentement recueilli. | Ouvert — concevoir un reçu serveur horodaté, versionné et traçable, puis tester le parcours et les règles de conservation |
| AN-04 | P1 | Parité Supabase | 22 migrations sur `majestios-crm` contre 39 sur `MajestiOS-Test` au contrôle en lecture seule du 11 novembre 2026 ; le frontend pointe vers `majestios-crm` | Ouvert — comparaison détaillée requise |
| AN-14 | P1 critique | RLS / schéma privé | RLS désactivée sur `private.reputation_audit_usage` dans `MajestiOS-Test` ; ACL observée limitée à `postgres`, sans privilège direct `anon`/`authenticated` | Ouvert — vérifier exposition, privilèges et politiques |
| AN-07 | P1 | Auth | Protection contre les mots de passe compromis désactivée sur le projet utilisé par le site | Ouvert — arbitrage après recette OTP |
| AN-06 | P1 | Cheexpeer | Worker Edge `cheexpeer-worker` v1 déployé sur `MajestiOS-Test`, limité à `readiness_probe` ; pont Git `cheexpeer-worker-bridge` absent des déploiements observés ; aucun worker métier complet | Ouvert — non opérationnel métier |
| AN-02 | P1 | Multi-tenant | Tests réels owner/admin/member et inter-organisations non démontrés | Ouvert — tests d'intégration nécessaires |
| AN-13 | P1 | RPC CRM | `complete_crm_reminder` SECURITY DEFINER, recette réelle des rôles manquante | Ouvert — vérifier refus member et succès owner/admin |
| AN-05 | P1 | Dépôt public | Identifiant administrateur codé en dur dans une fonction d'initialisation | Ouvert — revue d'exposition et externalisation |
| AN-10 | P1 | Sauvegardes | Sauvegarde manuelle incomplète (Auth, paramètres, secrets, Storage non inclus) | Ouvert — définir et tester restauration |
| CRM-06 | P0 conditionnel | Import officiel VIP | Frontière VIP préparée dans le code, migration non appliquée et recette multi-rôles non démontrée | Bloqué avant activation de l'import privilégié |
| CHEEXPEER-01 à 04 | P1 | Agent IA | Appartenance, quotas, rapprochement entreprise, prompt injection et transparence ; déploiement/recette à vérifier | Ouverts selon preuves Evolution-7 |

Les constats proviennent des registres Evolution-7 et Evolution-8 ; ils doivent être revalidés sur le code et les environnements actuels avant toute correction ou clôture.

## 3. Anomalie corrigée dans la branche précédente

| ID | Priorité | Domaine | Cause | Correction Evolution-8 | Statut |
|---|---|---|---|---|---|
| NAV-01 | P1 CI | Navigation | Le menu comptait 20 entrées et 18 destinations uniques, mais `verify-architecture.js` attendait encore 18 et 17. | Vérificateur aligné, route facturation ajoutée ; commit `4f471c06e7bf5dbbf9c88339a2ea0ed23d2f03c8`. Build Vercel Evolution-8 READY sur commit ultérieur, 81 fichiers. | Code corrigé ; exécution du workflow GitHub Actions après correction non confirmée. Rejouer le contrôle sur Evolution-9. |

## 4. Risques préventifs à contrôler

- branche, SHA et projet Vercel explicitement vérifiés avant chaque build ;
- un seul projet Vercel relié au dépôt pour la cible de travail, anciens projets non réactivés par erreur ;
- manifeste de publication et routes cohérents ;
- tous les fichiers de tests référencés par les workflows présents ;
- compteurs des menus synchronisés entre contrôles statiques et tests navigateur ;
- scripts Node et Edge Functions validés avec la version Node attendue ;
- secrets absents du dépôt et du navigateur ;
- aucune migration distante sans comparaison, revue et retour arrière ;
- aucune fonction métier déclarée opérationnelle sans preuve de déploiement et recette ;
- liens Markdown et liens HTML vérifiés après synthèse documentaire ;
- aucun document stratégique ne masque une anomalie critique.

## 5. Contrôle documentaire ajouté

Le script `verify-doc-links.js` vérifie les liens locaux des documents canoniques (README, AGENTS, index documentaire, registre critique et dossier Evolution-9). Il est appelé par le workflow `.github/workflows/verify-site.yml`. Son code et son intégration sont présents ; son exécution a été validée par GitHub Actions sur le commit `2438d8fd96f8e1d10676b8d193a5e99247096c67`.


## 6. Corrections réalisées dans Evolution-9 — 11 novembre 2026

| ID | Domaine | Cause constatée | Correction | Preuve |
|---|---|---|---|---|
| E9-CI-01 | Test navigateur | `tests/navigation-classique.browser.cjs` déclarait deux fois `devGroup` dans le même bloc, ce qui interrompait la vérification de syntaxe avant les tests. | Réutilisation de la variable déclarée dans le parcours desktop pour le parcours mobile. | Commit `c2d2e4d1c6bf18199a9bb80467b5f29d0e15696a` ; syntaxe passée ensuite. |
| E9-ARCH-01 | Contrat de page d'accueil | `verify-architecture.js` exigeait encore l'ancien titre SEO et des formulations retirées lors de la refonte. | Assertions alignées sur le titre CRM tout-en-un, la promesse actuelle et l'avertissement des exemples de démonstration. | Commits `b448d44d79b396fa9c9974f1acb506c767f90620` et `f799d217f637d89bda175abe390fe301544704b5` ; vérificateur passé ensuite. |
| E9-UX-01 | Contraste Accès VIP | Une règle CSS générale et une surcharge mobile imposaient un texte or/brun sur fond clair, malgré la signature prévue bleu nuit/or/chrome. | Couleur bleu nuit `#17324f`, filet or `#c5a45e`, fond transparent et repère chrome conservés ; surcharge mobile alignée. | Commits `8a93070600750cd4f112cfcddb73167fbaf8b31b`, `7f9e4f487ba2257fc7fac77dfb34d6e4e2c906b2` et `2438d8fd96f8e1d10676b8d193a5e99247096c67` ; test navigateur passé sur le dernier commit. |

**Validation globale :** GitHub Actions run `43010921140`, commit `f87cc16fa9c4c155b73483e2059a72c9f487ef31`, conclusion `success`. Le run précédent `43010656594` avait également réussi après les corrections de code. Les contrôles de syntaxe, tests unitaires, build, vérifications architecture/site/documentation, tests navigateur, BOAMP/BODACC et contrat de sécurité CRM ont réussi. Cela ne valide pas les migrations, politiques RLS ou parcours réels sur Supabase distant.

## 7. État de vérification

À l'ouverture de cette branche :
- les fichiers de tests appelés par `.github/workflows/verify-site.yml` ont été vérifiés présents par lecture GitHub ;
- le vérificateur de navigation Evolution-8 a été corrigé ;
- le build Vercel de prévisualisation Evolution-8 est READY ;
- la suite GitHub Actions complète a réussi sur le commit `2438d8fd96f8e1d10676b8d193a5e99247096c67` (run `43010656594`) ;
- les tests navigateur de navigation, recherche, Réputation virtuelle, contact et verrouillage sans session ont réussi dans ce run ;
- la recette réelle Supabase et les tests inter-organisations restent à confirmer.

Aucune donnée Supabase, migration distante, configuration Auth, secret ou production n'a été modifié dans cette reprise. Les vérifications de déploiement et de consentement restent en lecture seule.


## 8. Audit CRM / Supabase — contrôle distant du 11 novembre 2026

Rapport détaillé : [AUDIT-CRM-SUPABASE-LECTURE-SEULE-2026-11-11.md](AUDIT-CRM-SUPABASE-LECTURE-SEULE-2026-11-11.md).

Constats confirmés en lecture seule :
- Le frontend pointe vers `majestios-crm` (`qxaghcifdhugfskuscoc`) : 22 migrations appliquées, dernière migration `20261108181246_vip_only_crm_access`.
- `MajestiOS-Test` (`qrlnnfjstoeliymxtkbk`) : 39 migrations appliquées, jusqu'à `20261109250000_cheexpeer_worker_server_bridge`.
- La cible frontend n'a pas les migrations récentes d'historisation CRM, d'intégrité des relations et de fondation Cheexpeer présentes sur le projet de test.
- `majestios-crm` expose actuellement trois fonctions Edge actives : recherche officielle, import officiel et bootstrap admin. Le provisionnement client et les fonctions Cheexpeer ne sont pas déployés sur cette cible.
- `MajestiOS-Test` possède `cheexpeer-worker` v1, mais son exécuteur reste limité à `readiness_probe` sans effet externe métier. Le pont `cheexpeer-worker-bridge` du dépôt n'est pas déployé sous ce nom.
- `private.reputation_audit_usage` garde RLS désactivée ; les privilèges directs relevés sont limités à `postgres`. Risque de défense en profondeur, sans preuve d'accès navigateur direct.
- L'advisor du projet cible signale la protection contre les mots de passe compromis désactivée. L'advisor du projet de test signale le RPC `complete_crm_reminder` SECURITY DEFINER exécutable par `authenticated`, avec contrôle interne owner/admin à tester.

**Aucune migration, donnée, fonction Edge, politique RLS, configuration Auth, clé ou secret distant n'a été modifié.** La convergence est bloquée jusqu'à décision sur le projet Supabase de référence et validation d'un plan de migration.


## 9. Clarification de l'audit Supabase — 11 novembre 2026

- **AN-04 — parité des environnements :** conserver le constat de 39 migrations sur `MajestiOS-Test` et 22 sur `majestios-crm`, mais requalifier : l'écart n'est pas en soi une anomalie de synchronisation ; il traduit deux rôles distincts (test/recette et projet ciblé par le frontend). Ouvert uniquement pour formaliser la gouvernance des promotions, pas pour synchroniser automatiquement.
- **AN-14 — `private.reputation_audit_usage` :** RLS désactivée sur le projet de test, sans politique ; droits directs observés exclusivement pour `postgres`. Maintenir comme faiblesse de défense en profondeur, sans affirmer qu'un accès navigateur est démontré.
- **AN-13 — RPC de relance :** sur `MajestiOS-Test`, `complete_crm_reminder` est SECURITY DEFINER, `authenticated` oui / `anon` non, et vérifie `auth.uid()` ainsi que `private.can_edit_crm_org`. Le rapport antérieur qui indiquait `is_org_admin` est corrigé. Sur `majestios-crm`, RPC SECURITY INVOKER via `private.is_org_editor`, avec RLS VIP owner/admin.
- **CRM / accès pilote :** le frontend `crm-client.js` et les politiques de `majestios-crm` imposent actuellement l'accès interne owner/admin. Le CRM client ouvert aux entreprises pilotes n'est pas encore activé sur le projet principal.
- **Cheexpeer :** le worker `cheexpeer-worker` v1 sur `MajestiOS-Test` est strictement en mode test et n'exécute que `readiness_probe`, sans effet externe métier.

Ces précisions sont établies par lecture seule des projets le 11 novembre 2026. Aucune migration, donnée, politique, fonction ou configuration distante n'a été modifiée.

## 10. Privilèges et historisation CRM — vérification distante

- **CRM-03 / privilèges UPDATE :** la migration de restriction des colonnes est présente dans le socle de test mais pas sur majestios-crm. Sur le projet principal, authenticated peut encore modifier les colonnes id, organization_id, created_by, created_at et updated_at des tables businesses, contacts et opportunities, en plus des champs métier. Les contrôles RLS et triggers existants limitent certains scénarios, mais la protection frontend seule ne suffit pas. Priorité P1 avant pilote client ; préparer la migration, la tester et demander validation avant application distante.
- **CRM-02 / historisation :** les triggers record_crm_activity() après INSERT/UPDATE sont présents sur MajestiOS-Test, absents sur les tables businesses, contacts et opportunities de majestios-crm. Le code frontend vérifie la présence de l'historique et peut afficher « Fiche modifiée, mais l'historique n'a pas pu être enregistré ». La migration d'historisation atomique est requise pour aligner le comportement du projet principal.
- **AN-15 / triggers redondants de test :** dans MajestiOS-Test, deux triggers BEFORE INSERT/UPDATE par table CRM appellent la même fonction d'intégrité tenant (*_enforce_tenant_integrity et *_tenant_integrity). Dette de nettoyage P2, sans impact fonctionnel démontré ; ne pas supprimer avant analyse des migrations et des dépendances.

Le détail des contrôles et des limites figure dans la section 11.7 du rapport d'audit. Aucun changement distant n'a été effectué.


## 11. Complément audit CRM métier — 11 novembre 2026

| ID | Priorité | Domaine | Constat | Statut / traitement |
|---|---|---|---|---|
| CRM-04 | P2 | Robustesse des écritures frontend | Les fonctions create* du client CRM acceptaient des objets sans liste blanche explicite par table. | **Corrigé dans Evolution-9** : listes blanches par table, champs d'organisation/auteur imposés côté client, test de contrat ajouté. Le contrôle « Vérifier le contrat de sécurité du CRM » a réussi sur le commit 5976681bc72f089c9bdb94a26951a7622254267a. Cette correction ne remplace pas les protections SQL. |
| CRM-05 | P1 avant pilote | Recette fonctionnelle et multi-tenant | Aucun parcours E2E complet du CRM n'est actuellement exécuté dans le workflow : création, édition, historique, relance et refus inter-organisations ne sont pas testés ensemble contre une base de test avec plusieurs identités. | **Ouvert** : préparer une recette automatisée sur MajestiOS-Test, avec organisations et comptes synthétiques, sans toucher au projet principal. |
| CRM-06 | P2 avant automatisation serveur | Traçabilité des écritures système | Le trigger d'historisation utilise auth.uid() pour actor_user_id ; une écriture déclenchée avec le rôle service peut donc être historisée sans acteur humain identifié. | **À concevoir** : ajouter une attribution système/mission explicite et traçable avant les imports automatisés et les missions Cheexpeer. Ne jamais attribuer artificiellement l'action à un utilisateur humain. |

Le CRM interne reste limité aux rôles owner et admin. Le chemin d'interface viewer actuellement présent est inaccessible avec cette règle ; il ne constitue pas une activation du CRM client. Les rôles du futur CRM client devront être définis séparément et testés par tenant.


## 12. Exigence structurante phase 2 — CRM et facturation électronique

| ID | Priorité | Domaine | Constat / risque | Statut / traitement |
|---|---|---|---|---|
| FACT-01 | P1 avant conception du schéma phase 2 | CRM / facturation / interopérabilité | Aucun domaine de facturation opérationnel ni cycle complet PA n'est démontré dans les environnements audités. Le risque est de concevoir un CRM qui ne pourrait pas relier proprement devis, prestations, factures, transmission, règlements et CRM externes, ou de créer des doubles sources de vérité. | **Évolution phase 2 cadrée** : spécification cible créée dans Evolution-9. Préserver les identifiants et liens métier dès le CRM actuel ; concevoir le domaine de facturation séparément ; définir les modes natif/connecté/hybride, la source de référence par objet et l'idempotence avant développement. Aucun connecteur PA ni module n'est déclaré opérationnel. |

Référence canonique : [Spécification cible CRM, facturation et facturation électronique](SPECIFICATION-CIBLE-FACTURATION-CRM-ELECTRONIQUE.md). Le client ne doit pas être contraint d'abandonner son CRM existant ; les factures ne doivent jamais être créées en double dans deux systèmes.

## 13. Préparation de la recette CRM — 11 novembre 2026

| ID | Priorité | Domaine | Action préparatoire | Statut |
|---|---|---|---|---|
| CRM-05 | P1 avant pilote | Recette fonctionnelle / multi-tenant | Protocole détaillé ajouté : rôles, entreprises, contacts, opportunités, activités, historisation, relances, permissions SQL et tests négatifs entre deux tenants sur `MajestiOS-Test`. | **Protocole préparé — NOT RUN** ; exécution conditionnée à des comptes et données synthétiques et à une autorisation explicite d'écriture sur le projet de test. |

Référence : [Protocole de recette CRM sur MajestiOS-Test](PROTOCOLE-RECETTE-CRM-MAJESTIOS-TEST.md). Ce livrable ne clôt pas CRM-05 et ne constitue pas une validation de sécurité ou d'ouverture des pilotes.
