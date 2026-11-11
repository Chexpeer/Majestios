# Audit de l'existant MajestiOS — préparation d'Evolution-8

**Date du contrôle :** 11 novembre 2026  
**Branche auditée :** `Evolution-7`  
**Commit de référence au démarrage de l'audit :** `88964626ea1db6af939d111960be867c8dd2570d`  
**Périmètre :** dépôt GitHub, site et navigation, CRM interne, espace membre, Supabase, Cheexpeer, Vercel et documentation.  
**Nature :** audit de préparation, principalement en lecture seule. Les limites de recette sont indiquées explicitement.

---

## 1. Conclusion exécutive

MajestiOS dispose déjà de fondations réelles : site statique construit par manifeste, navigation à tiroirs, CRM interne relié à Supabase, modèle multi-tenant, authentification OTP en code, premières fonctions Edge, registre de sources officielles et fondations d'exécution Cheexpeer.

Mais l'existant ne constitue pas encore un CRM tout-en-un client opérationnel. Le CRM visible dans le dépôt est le **CRM interne MajestiOS**. L'espace membre reste un parcours d'inscription et de présentation ; ses cartes « dossiers », « activité » et « échanges » ne sont pas un CRM client complet. Aucun cycle devis/factures/chantiers, aucune intégration de plateforme agréée et aucun connecteur universel vers les CRM externes n'ont été démontrés.

Le principal risque n'est pas l'absence de code : c'est la **divergence entre le code, les deux projets Supabase et les composants réellement déployés**. L'application web utilise un projet Supabase qui n'a pas les migrations Cheexpeer récentes ; le projet de test possède ces migrations et un worker de démonstration, mais n'est pas la cible du frontend.

**Décision recommandée :** ne pas démarrer la refonte technique sur une base de données supposée unifiée. Evolution-8 doit commencer par réconcilier les environnements et les contrats d'intégration, puis reconstruire l'expérience produit sans confondre CRM interne et CRM client.

## 2. Périmètre et méthode

Contrôles réalisés :
- lecture de fichiers de référence et de code sur la branche `Evolution-7` ;
- comparaison de la branche avec la branche par défaut du dépôt ;
- lecture des configurations de build, du manifeste de publication et des workflows CI ;
- consultation du projet Vercel, des déploiements récents, du dernier build et des erreurs runtime agrégées ;
- inventaire des projets Supabase, migrations, tables, RLS, politiques, fonctions Edge, avis de sécurité et de performance ;
- lecture des sources Edge et du worker Cheexpeer déployé sur l'environnement de test.

Aucune migration, politique RLS, donnée métier, configuration Auth, clé, secret, fonction Edge ou réglage Vercel n'a été modifié pendant l'audit. Aucun test d'envoi d'e-mail OTP, aucun test multi-utilisateur réel, aucun test navigateur complet et aucun test d'isolation inter-tenant n'a été exécuté dans le cadre de ce contrôle.

## 3. Dépôt Git et gouvernance des branches

- Dépôt : `Chexpeer/Majestios`, visibilité publique.
- Branche de travail auditée : `Evolution-7`.
- La branche par défaut est `main`.
- La comparaison de référence indique une branche fortement divergente : Evolution-7 est en avance de 1 181 commits et en retard de 17 commits par rapport au commit de référence de `main` observé pendant le contrôle.
- Le dépôt contient des workflows de vérification du site, d'anti-régression CRM et de contrat worker. Le statut du dernier commit audité ne présentait qu'un contrôle Vercel dans le statut combiné consulté ; l'API de runs interrogée n'a pas fourni de runs Actions pour ce commit. Les derniers succès CI cités dans le registre datent de commits antérieurs.

**Conséquence :** Evolution-8 doit être créée à partir du HEAD exact d'Evolution-7 après clôture documentaire de l'audit. Aucun rebase, merge ou réalignement avec `main` ne doit être fait automatiquement.

## 4. Site public, navigation et expérience

### État constaté

- Le site est un ensemble de pages HTML/CSS/JavaScript natifs, sans framework front-end imposé.
- La page d'accueil porte encore un message centré sur le développement commercial et la détection d'opportunités ; elle ne présente pas encore la promesse « CRM tout-en-un ».
- La rubrique Développement commercial regroupe prospection, veille des entreprises et suivi commercial.
- La page Accompagnement appels d'offres reste centrée sur la préparation des réponses. La thématique facturation électronique/dématérialisation n'est pas encore présentée comme un parcours dédié.
- La navigation actuelle est organisée en six familles et dix-huit entrées secondaires selon les tests de contrat. Le menu mobile et le lien VIP disposent de tests navigateur dédiés dans le dépôt.
- Le composant de navigation applique une barre compacte et des tiroirs, mais les styles actuels utilisent un fond bleu nuit, des bordures et des surfaces translucides. La cohérence visuelle finale devra être arbitrée sur une capture réelle, pas seulement sur le code CSS.
- Le manifeste `site-files.json` contient les ressources du site. Le build Vercel du commit audité indique 79 fichiers copiés et vérifiés ; la documentation Markdown est exclue du répertoire publié.
- `crm.html` est inclus dans le build, mais porte `noindex,nofollow` et reste protégé par authentification et autorisations côté Supabase. La protection réelle des données dépend donc des contrôles backend, pas du masquage de la page.

### Écart produit

La vitrine ne décrit pas encore les cinq dimensions de la promesse cible : développement commercial, CRM client, gestion opérationnelle, facturation/dématérialisation et accompagnement Cheexpeer/réseau. Il faudra réécrire les parcours publics après validation de la cible produit, et non annoncer dès maintenant des fonctions non livrées.

## 5. CRM interne et espace membre

### CRM interne

Le code de `crm.html`, `crm-page.js` et `crm-client.js` confirme un CRM interne connecté à Supabase. Les domaines métier visibles sont :
- entreprises ;
- contacts ;
- opportunités ;
- activités et historique ;
- relances commerciales persistantes.

Le client vérifie la session, l'appartenance à une organisation de type `internal` et un rôle `owner` ou `admin`. Le CRM n'est donc pas le CRM client annoncé dans la vision de phase 2.

Il ne comporte pas encore de cycle devis/factures, chantiers/interventions, gestion documentaire client ou connecteur PA démontré.

### Espace membre

Le formulaire utilise Supabase Auth avec OTP e-mail. Après validation du code, le front appelle explicitement la fonction Edge `provision-client-workspace` pour provisionner l'organisation et l'espace client.

**Écart confirmé :** cette fonction existe dans le dépôt, mais elle n'apparaît dans la liste des fonctions déployées ni sur le projet Supabase actuellement utilisé par le site, ni sur `MajestiOS-Test`. Le parcours peut donc créer/valider une identité Auth sans terminer le provisionnement de l'espace. Le test existant est un test de contrat statique ; il ne prouve ni l'envoi réel du code ni la réussite du provisionnement.

**Statut :** AUTH-01 reste P0 avant ouverture des inscriptions. Ne pas annoncer le parcours membre comme recetté.

## 6. Supabase — deux projets, deux états différents

### 6.1 Projet utilisé par le site

| Élément | Constat |
|---|---|
| Nom | `majestios-crm` |
| Référence | `qxaghcifdhugfskuscoc` |
| Région | `eu-west-3` |
| État | Active / healthy |
| Cible du frontend | Oui — `supabase-config.js` pointe vers ce projet |
| Migrations appliquées | 22 |
| Tables métier publiques | 15 |
| RLS sur les tables publiques | Activée sur les 15 tables |
| Politiques publiques | 29 |
| Fonctions Edge actives | 3 : recherche officielle, import officiel, bootstrap administrateur |
| Stockage Storage | Aucun bucket métier constaté |

Les données observées sont très limitées : une organisation, une appartenance, deux profils, un contact et huit sources officielles ; aucune entreprise CRM, opportunité ou activité CRM n'a été comptabilisée dans ce contrôle.

L'avis de sécurité Supabase signale la protection contre les mots de passe compromis désactivée. Cette configuration Auth doit être arbitrée après recette du parcours OTP.

### 6.2 Projet de test

| Élément | Constat |
|---|---|
| Nom | `MajestiOS-Test` |
| Référence | `qrlnnfjstoeliymxtkbk` |
| Région | `eu-central-1` |
| État | Active / healthy |
| Cible du frontend | Non — aucune référence dans `supabase-config.js` |
| Migrations appliquées | 38 |
| Tables publiques | 15 |
| Tables privées applicatives | 7, dont les tables de missions Cheexpeer |
| Fonction Edge active | `cheexpeer-worker`, version 1, JWT requis |
| Stockage Storage | Aucun bucket métier constaté |

Le projet de test contient cinq missions Cheexpeer, quinze événements de mission, une demande d'approbation en attente et un registre d'outils contenant un outil de test désactivé. Le worker déployé est explicitement en mode sûr : il ne traite que `readiness_probe`, refuse les types inconnus et ne réalise pas d'effet externe métier.

### 6.3 Écart de parité

Le projet utilisé par le site a 22 migrations appliquées ; le projet de test en a 38. Les migrations Cheexpeer et plusieurs durcissements CRM récents sont donc présents sur le projet de test mais absents du projet cible du frontend.

La configuration Git locale `supabase/config.toml` porte un identifiant de projet local de test CI ; elle ne suffit pas à identifier le projet distant. La référence distante réellement utilisée par le navigateur est celle de `supabase-config.js`.

**Risque :** appliquer les migrations du projet de test au projet actif sans rapprochement du ledger, des schémas, des fonctions et des données pourrait créer une dérive supplémentaire. Aucune commande de synchronisation ne doit être lancée avant une procédure de parité et de retour arrière validée.

### 6.4 Sécurité et autorisations

- Les 15 tables publiques du projet `majestios-crm` ont RLS activée ; le contrôle SQL a recensé 29 politiques.
- Sur `MajestiOS-Test`, Supabase signale une alerte critique : RLS est désactivée sur `private.reputation_audit_usage`.
- Le contrôle des privilèges n'a pas trouvé de droit direct SELECT/INSERT/UPDATE sur cette table pour `anon` ou `authenticated` ; le rôle authenticated dispose néanmoins de l'usage du schéma privé. L'alerte Supabase doit être traitée comme un défaut de défense en profondeur et l'exposition effective du schéma doit être vérifiée. Ne pas activer RLS sans concevoir les politiques ou le chemin d'accès serveur attendu.
- L'avis performance remonte des index non utilisés sur les deux projets. Vu le faible volume de données et la jeunesse des environnements, ce signal ne justifie pas de supprimer des index sans mesure de charge et analyse des requêtes.
- Sur le projet de test, l'avis sécurité signale `public.complete_crm_reminder(uuid)` comme fonction SECURITY DEFINER exécutable par authenticated. La migration inspectée montre un `search_path` vide, un retrait des droits PUBLIC/anon et un contrôle interne `private.is_org_admin()`. Le garde-fou est présent dans le code, mais un test réel avec les rôles owner/admin/member reste nécessaire.
- Aucun bucket Storage n'est configuré dans les deux projets : l'archivage de devis, factures, dossiers et pièces clients n'est pas encore prêt côté stockage.

## 7. Cheexpeer — conception avancée, exécution encore limitée

Le dépôt contient une architecture d'exécution par missions persistantes, étapes, registre d'outils, files de réveil, validations humaines, journal et worker séparé.

État réel constaté :
- le projet `MajestiOS-Test` possède un worker Edge `cheexpeer-worker` en mode sûr ;
- le projet `majestios-crm` ne possède aucune fonction Cheexpeer ;
- le pont `cheexpeer-worker-bridge` est présent dans Git mais n'est pas listé comme fonction déployée sur l'un ou l'autre projet ;
- le worker Node conteneurisé est présent dans le dépôt, mais aucun hôte worker n'est provisionné et aucun secret runtime n'est configuré selon le document de déploiement ;
- aucun outil métier n'est activé dans le registre de test.

**Conclusion :** Cheexpeer est spécifié et partiellement implémenté ; il n'est pas encore un agent métier opérationnel raccordé au CRM de production. Il ne doit pas être invité à exécuter des missions commerciales, administratives ou de facturation avant la parité des environnements, le déploiement contrôlé des composants et les recettes de sécurité.

## 8. Vercel et livraison

- Un seul projet Vercel correspondant au dépôt a été retrouvé : `majestios`.
- Le projet est relié au dépôt `Chexpeer/Majestios`.
- Le déploiement observé du commit audité est `READY`, avec la cible `production`, issu de la branche `Evolution-7`.
- Les alias retournés sont `majestios.vercel.app` et `majestios-git-evolution-7-majistr.vercel.app`. Aucun domaine personnalisé n'apparaît dans la liste du projet au moment du contrôle.
- Le build exécute `node build.js`, copie 79 fichiers depuis le manifeste et s'est terminé avec succès.
- Aucun cluster d'erreurs runtime n'a été trouvé sur les dernières 24 heures. La recherche de logs individuels sur les 30 dernières minutes n'a retourné aucune ligne pour les critères demandés ; ce résultat ne prouve pas l'absence générale d'erreurs côté navigateur ou services tiers.
- Le statut combiné du commit consulté ne contenait que le contrôle Vercel ; les workflows GitHub n'ont pas été confirmés sur ce commit précis.

**Conséquence :** Evolution-7 est actuellement configurée pour produire un déploiement de production. La branche Evolution-8 devra rester une branche de prévisualisation ; aucune promotion ou modification de branche de production ne doit être faite sans validation explicite.

## 9. Documentation — écarts à corriger

La documentation est riche et distingue souvent les états spécifié / implémenté / déployé / recetté. Elle comporte néanmoins des références historiques qui décrivent des branches et projets Supabase antérieurs.

Deux points exigent une actualisation :
1. Le README racine indique que le provisionnement de l'espace client est raccordé au backend ; ce n'est pas confirmé dans les projets distants consultés, puisque la fonction appelée par le front n'est déployée sur aucun des deux.
2. Les anciens audits de parité Supabase doivent être lus comme des constats datés. Ils ne remplacent pas le contrôle actuel des deux projets et de leurs 22/38 migrations.

La nouvelle vision « CRM tout-en-un » doit être indexée comme cadrage produit préparatoire, sans remplacer le cahier des charges fonctionnel actuel tant que les arbitrages Evolution-8 ne sont pas validés.

## 10. Registre de risques et priorités

| Priorité | Sujet | Constat / action attendue |
|---|---|---|
| P0 | AUTH-01 — OTP et provisionnement | Fonction `provision-client-workspace` absente des deux projets ; recette réelle du flux et du provisionnement avant ouverture membre |
| P1 | Parité Supabase | 22 migrations sur le projet web contre 38 sur le projet de test ; établir le ledger, le diff de schéma et la stratégie de migration |
| P1 | RLS test | Corriger le défaut RLS de `private.reputation_audit_usage` avec politiques adaptées et preuve d'accès |
| P1 | Cible d'intégration Cheexpeer | Choisir explicitement le projet de référence, déployer le pont et le worker uniquement après tests et autorisation |
| P1 | Protection Auth | Arbitrer la protection contre les mots de passe compromis sur le projet utilisé par le site |
| P1 | Stockage documentaire | Définir buckets, politiques, chemins tenant-scoped, quotas, rétention et réversibilité avant devis/factures/documents |
| P1 | Sécurité du dépôt public | Examiner les identifiants de compte codés en dur et les détails d'architecture sensibles ; aucun secret service_role n'a été recherché ni exposé pendant cet audit |
| P2 | Facturation électronique | Aucun module, PA partenaire, connecteur ou flux réglementaire opérationnel démontré |
| P2 | Parcours tout-en-un | Reconcevoir le site et l'espace client après validation des modules, statuts et parcours |
| P2 | CI et recettes | Confirmer les runs GitHub sur les commits Evolution-8 et ajouter des tests d'intégration Auth/RLS multi-tenant |

Les identifiants AUTH-01 et AN-01 à AN-13 du registre existant restent la référence historique. Les constats nouveaux doivent être ajoutés au registre sans effacer les anomalies ouvertes.

## 11. Décisions recommandées pour Evolution-8

1. **Créer Evolution-8 depuis le HEAD exact d'Evolution-7** après enregistrement du présent audit et de ses liens documentaires.
2. **Conserver Evolution-7 comme référence et base de retour**, sans réécriture ni merge automatique vers `main`.
3. **Établir une matrice des environnements** : projet Supabase de production, projet de test, migrations, fonctions Edge, secrets, Auth, Storage et domaines autorisés.
4. **Réconcilier les 22/38 migrations** par comparaison des fichiers SQL, du ledger et du schéma distant ; ne pas appliquer de migration en production dans ce lot d'audit.
5. **Rétablir le parcours Auth** : déployer la fonction de provisionnement sur un environnement de test, corriger ses origines autorisées, exécuter les tests OTP/RLS avec plusieurs identités, puis seulement décider de l'ouverture.
6. **Séparer les domaines métier** : CRM interne, CRM client natif, CRM externe connecté, noyau facturation et couche Connect/PA.
7. **Concevoir le stockage documentaire et la sécurité multi-tenant** avant les modules devis/factures.
8. **Construire la nouvelle expérience UX** sur les parcours client, sans présenter les modules futurs comme disponibles.
9. **Garder Cheexpeer en mode lecture/préparation/validation** tant que ses connecteurs métier ne sont pas déployés et recettés.
10. **Utiliser les déploiements Vercel Evolution-8 comme previews**, sans changer la branche de production ni promouvoir un déploiement sans validation.

## 12. Limites de cet audit

Cet audit ne certifie pas :
- le fonctionnement réel de l'envoi et de la réception des OTP ;
- la conformité juridique complète des parcours de consentement ;
- l'isolation RLS par tests multi-utilisateurs réels ;
- la sécurité complète de toutes les fonctions Edge ;
- la restauration d'une sauvegarde ;
- les performances sous charge ;
- le fonctionnement de tous les parcours navigateur et mobiles ;
- le statut contractuel ou réglementaire d'un partenaire de facturation ;
- la disponibilité d'un CRM client ou d'un module de facturation en production.

**Conclusion :** Evolution-8 doit être une refonte guidée par l'état réel des systèmes. La priorité n'est pas d'ajouter immédiatement des écrans de facturation, mais de rendre cohérents le produit, les environnements, les données, les droits et les parcours avant de construire le véritable CRM tout-en-un.
