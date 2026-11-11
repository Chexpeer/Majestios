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


## 14. Recontrôle lecture seule du projet de recette — 11 novembre 2026

| ID | Priorité | Domaine | Constat actualisé | Statut |
|---|---|---|---|---|
| CRM-05 | P1 avant pilote | Recette multi-tenant | 39 migrations présentes ; tables CRM vides ; une seule organisation interne sans membre ; aucun tenant client/partenaire ni utilisateur synthétique. | Protocole prêt, exécution bloquée par l'absence d'identités/tenants de recette. Préparer un provisionnement synthétique contrôlé avant tests JWT. |
| AN-15 | P2 | Triggers d'intégrité redondants | Deux triggers par table businesses, contacts, opportunities et activities appellent `enforce_tenant_relationship_integrity`. | Confirmé en lecture seule sur MajestiOS-Test ; analyser les migrations et dépendances avant toute suppression. |
| CRM-03 | P1 avant pilote | Privilèges UPDATE | Le projet de test possède les privilèges UPDATE limités aux colonnes métier ; les colonnes système ne sont pas accordées à authenticated. | Présence distante confirmée sur MajestiOS-Test ; le projet principal reste à part et n'est pas modifié. |
| CRM-02 | P1 avant pilote | Historisation | Triggers d'historisation présents et actifs sur businesses, contacts et opportunities dans le projet de test. | Présence distante confirmée ; recette transactionnelle réelle encore requise. |
| CRM-REM-01 | P1 avant pilote | Relances | Job pg_cron actif toutes les cinq minutes ; RPC SECURITY DEFINER authentifié avec contrôle de droits tenant dans le corps. | Configuration présente ; tests de rôles, tenant, doublons et clôture atomique non exécutés. |

Le contrôle est documenté dans le [rapport d'audit](AUDIT-CRM-SUPABASE-LECTURE-SEULE-2026-11-11.md) et le [protocole de recette](PROTOCOLE-RECETTE-CRM-MAJESTIOS-TEST.md). Aucune écriture distante n'a été effectuée.


## 15. Non-régression et harmonisation visuelle — 11 novembre 2026

| ID | Priorité | Domaine | Constat / correction | Statut |
|---|---|---|---|---|
| HOME-01 | P1 | Accueil / moteur de recherche | L'accueil centré sur la recherche d'Evolution-7 avait été remplacé par une présentation conceptuelle CRM. `index.html` restauré depuis Evolution-7. | Corrigé ; CI et test navigateur réussis |
| NAV-01 | P1 | Navigation multi-pages | Les menus doivent utiliser le chargeur partagé et rester accessibles depuis toutes les pages publiques. Les contrôles statiques et navigateurs couvrent desktop et mobile. | Contrôle CI réussi |
| VIS-01 | P1 | Harmonisation graphique | Socle commun ajouté pour géométrie, typographie, espacements, états, focus clavier et cibles tactiles dans `navigation-tiroirs.css`. | Socle livré ; revue visuelle détaillée page par page encore requise |

La matrice et les limites de recette sont documentées dans [l'audit de non-régression Evolution-7](AUDIT-NON-REGRESSION-FONCTIONNELLE-EVOLUTION-7.md). La réussite des tests du site ne vaut pas recette CRM multi-identités ni validation visuelle exhaustive. Aucune promotion production n'est autorisée par ce constat.


## 16. Assistant MajestiOS — visibilité et espace dédié — 11 novembre 2026

| ID | Priorité | Domaine | Constat / cause | Correction Evolution-9 | Statut |
|---|---|---|---|---|---|
| CHAT-01 | P1 | Assistant / visibilité | Le guide conversationnel de première génération existait dans `app.js`, mais ses styles étaient isolés dans `navigation-majestios.css`, une feuille non chargée par le socle commun et mêlée à d'anciennes règles de navigation. | Extraction des seuls styles du chatbot dans `majestios-chat.css`, chargement commun par `app.js`, ajout d'un espace dédié `assistant-majestios.html` et d'une entrée de navigation. | Code et tests ajoutés ; résultat CI à confirmer |
| CHAT-02 | P1 | Capacité IA | Le guide actuel répond à partir de mots-clés et de réponses prédéfinies. Il ne constitue pas un agent IA connecté ; aucun fournisseur conversationnel n'est configuré dans ce parcours. | L'espace dédié indique explicitement la limite et réserve les points de raccordement : moteur, contexte utilisateur, autorisations, journalisation et transfert humain. | Ouvert — intégration IA à concevoir et recetter |

Le chatbot de première génération reste un guide d'orientation local, accessible par le bouton flottant « Parler à MajestiOS ». Il ne doit pas être présenté comme Cheexpeer ni comme un agent autonome. L'espace dédié le signale comme actif, tout en indiquant que le moteur IA avancé reste à raccorder ; aucune action métier n'est déclenchée.


## 17. Consolidation de la navigation — 11 novembre 2026

La feuille `navigation-tiroirs.css` a été réécrite en une seule source de styles afin de supprimer les couches contradictoires héritées. Elle conserve une barre transparente et compacte, des sous-menus clairs avec profondeur, des accents par rubrique, un accès VIP distinctif et un tiroir mobile avec overlay. Les états clavier, tactile, actif et réduction des animations sont conservés.

Les tests navigateur couvrent désormais la hauteur de barre, la typographie desktop, le fond des sous-menus, la largeur du tiroir mobile et l'accès à l'espace Assistant. **La validation visuelle par captures sur plusieurs pages et tailles d'écran reste à effectuer avant clôture.**

## 18. Revue complémentaire du code UI — pré-audit visuel du 11 novembre 2026

Cette revue est réalisée à partir des sources de la prévisualisation Evolution-9. Elle permet de relever des risques de comportement et de cohérence ; elle ne remplace pas une inspection réelle du rendu sur plusieurs navigateurs et tailles d'écran.

| ID | Priorité | Domaine | Constat vérifiable dans le code | Amélioration / contrôle demandé | Statut |
|---|---|---|---|---|---|
| NAV-02 | P1 | Menu desktop / survol | Dans `navigation-tiroirs.css`, le sous-menu commence à `top: calc(100% + 5px)`. Dans `navigation-tiroirs.js`, sa fermeture est déclenchée dès le `mouseleave` de la rubrique parente. L'espace de 5 px peut donc provoquer la fermeture pendant le déplacement du pointeur vers le sous-menu. | Supprimer la zone morte (sous-menu à `top: 100%` ou pont de survol) et ajouter un test navigateur qui déplace réellement le pointeur du titre vers plusieurs liens du sous-menu. | À corriger / tester |
| CHAT-03 | P1 | Espace Assistant / ergonomie | `assistant-majestios.html` affiche une zone de saisie et un bouton Envoyer désactivés, alors que le guide local fonctionnel est uniquement accessible via le bouton flottant injecté par `app.js`. L'utilisateur voit donc une fausse zone de conversation inactive sur la page dédiée. | Remplacer le formulaire inactif par un accès explicite et fonctionnel au guide local, ou intégrer réellement le guide dans cette page. Garder une séparation claire entre guide local et futur Cheexpeer IA. | À améliorer |
| VIS-02 | P1 | Cohérence visuelle multi-pages | Le socle de navigation est commun, mais les pages chargent des feuilles de style propres à leur rubrique et dans des ordres différents. La seule réussite du build et des tests ciblés ne prouve pas l'harmonisation de toutes les pages. | Faire une revue page par page : accueil, appels d'offres public/privé, développement commercial, réseau, réputation virtuelle, CRM, espaces privés/VIP, facturation électronique, assistant, contact et pages d'information. Contrôler desktop/tablette/mobile, contraste, tailles, marges, cartes, formulaires, tableaux et états interactifs. | Ouvert — recette visuelle requise |
| NAV-03 | P2 | Navigation / repérage | Les sept familles et leurs sous-rubriques sont générées par JavaScript, qui remplace le contenu initial du menu HTML. Une erreur de chargement du script peut donc laisser une navigation différente de celle attendue. | Ajouter un contrôle de secours sans JavaScript ou un état de repli accessible, et vérifier que chaque page publique charge bien le script partagé. | À vérifier |

**Limite de preuve :** la prévisualisation Vercel est READY sur le commit `034350087656a981755c22b2cff64550d001433b`, mais aucune capture ni recette visuelle réelle n'a encore été produite. Les éléments ci-dessus sont des constats de code ou des contrôles à réaliser, pas des défauts visuels prétendument observés à l'écran.


## 19. Harmonisation de l'accès VIP — 11 novembre 2026

| ID | Priorité | Domaine | Constat / exigence | Traitement Evolution-9 | Statut |
|---|---|---|---|---|---|
| VIP-VIS-01 | P1 | Espace privé / Accès VIP | La page de choix des accès (espace-prive.html) possédait une présentation autonome et ne chargeait pas explicitement la charte graphique commune, contrairement aux pages publiques harmonisées. L'accès VIP doit être identifiable comme un espace MajestiOS, sans rupture visuelle avec le site. | Chargement explicite de charte-majestios.css après styles.css, tout en conservant la distinction visuelle VIP bleu nuit/or et les deux parcours sécurisés. Ajout d'une assertion dans verify-site.js pour empêcher la régression. | Correction de code et contrôle statique ajoutés ; CI et recette visuelle à confirmer. |

**Périmètre :** harmoniser la page d'entrée et ses repères de marque, sans modifier les règles d'authentification, les rôles, les liens d'accès ni les protections de l'espace interne. Le cockpit d'administration conserve sa mise en page dédiée, mais doit rester dans le même langage bleu nuit / or / chrome. Aucune capture ni validation visuelle réelle n'est revendiquée à ce stade.


## 20. Facturation électronique — conformité réglementaire et liens officiels — 11 novembre 2026

| ID | Priorité | Domaine | Constat / risque | Traitement Evolution-9 | Statut |
|---|---|---|---|---|---|
| FE-01 | P1 | Information réglementaire | La page expliquait le calendrier et les plateformes agréées, mais le message de mise en conformité et l'appel à l'action pour les entreprises n'étaient pas assez visibles. | Ajout d'un bloc prioritaire rappelant que les entreprises assujetties à la TVA doivent se préparer, y compris les micro-entrepreneurs en franchise en base ; clarification de la réception dès septembre 2026 et de l'émission/e-reporting PME au 1er septembre 2027 ; ajout du simulateur officiel. | Correction de contenu enregistrée ; CI à confirmer |
| FE-02 | P1 | Liens externes | Les liens officiels doivent mener vers les pages actives et faire comprendre leur objet. | Vérification web le 11 novembre 2026 des cinq URL déjà présentes : découverte de la réforme, liste des plateformes agréées, calendrier, modalités d'émission/réception et définition d'une facture envoyée par mail. Les cinq pages officielles impots.gouv.fr s'ouvrent. Ajout du lien vers le simulateur officiel. | Liens contrôlés individuellement ; contrôle périodique recommandé |
| FE-03 | P1 | Exactitude / positionnement | Risque de confusion entre logiciel compatible et plateforme agréée, ou de présenter MajestiOS comme opérateur réglementaire. | Conservation de la mention explicite : MajestiOS n'est pas une plateforme agréée ; aucun partenaire ni connecteur PA n'est présenté comme opérationnel. | Conforme au positionnement de conception |

**Références officielles contrôlées :** impots.gouv.fr — « Je découvre la facturation électronique » (mise à jour du 26 mai 2026), « Je consulte la liste des plateformes agréées » (mise à jour du 9 novembre 2026), questions relatives au calendrier, aux modalités d'émission/réception et au PDF envoyé par e-mail. Les échéances et obligations doivent toujours être relues sur les sources officielles avant toute nouvelle publication ou évolution du parcours.


## 21. Corrections après inventaire transversal — 11 novembre 2026

| ID | Priorité | Domaine | Constat confirmé | Traitement Evolution-9 | Statut |
|---|---|---|---|---|---|
| REP-UI-01 | P1 | Réputation virtuelle / interface publique | La page exposait le formulaire principal de préparation d'audit ainsi que les formulaires Google Web et Maps, contrairement à la consigne du porteur de projet. | Les trois contrôles sont masqués dans l'interface publique ; les traitements et sélecteurs internes sont conservés dans le DOM pour éviter une suppression fonctionnelle prématurée. Le panneau visible devient un espace de suivi des analyses et constats vérifiés. | Code et assertions statiques/navigateur ajoutés ; recette navigateur à exécuter. |
| NAV-02 | P1 | Navigation desktop | Le sous-menu était décalé de 5 px sous son parent, avec fermeture au `mouseleave`, créant une zone morte possible. | Alignement du sous-menu à `top: 100%` et ajout d'un test qui déplace le pointeur du titre vers un lien du sous-menu. | Correction de code et test ajoutés ; recette navigateur à exécuter. |
| CI-01 | P1 CI | Installation Playwright | Le dernier run `43032901155` échoue à l'étape d'installation Chromium : `playwright install --with-deps` déclenche APT, dont les miroirs Ubuntu sont injoignables (`Temporary failure resolving`). Les contrôles syntaxe, tests Node, build, architecture, site et liens documentaires précédant cette étape ont réussi ; les tests navigateur suivants ont été ignorés. | Suppression de `--with-deps` pour utiliser les dépendances déjà présentes sur le runner GitHub standard et éviter l'étape APT réseau. | Correction du workflow à vérifier sur une nouvelle exécution CI. |

**Limite :** aucune validation visuelle réelle n'est revendiquée. La modification de la commande Playwright ne prouve pas encore que Chromium démarre correctement sur le runner ; le prochain run doit le confirmer.


## 22. Exigence utilisateur — navigation strictement identique sur toutes les pages — 11 novembre 2026

| ID | Priorité | Domaine | Constat vérifié | Exigence / traitement | Statut |
|---|---|---|---|---|---|
| NAV-04 | P1 | Parité de navigation multi-pages | Le menu public est généré par `navigation-tiroirs.js` et ses styles sont centralisés dans `navigation-tiroirs.css`, chargés directement ou via `app.js`. Le test navigateur contrôlait surtout l'accueil et quelques destinations, sans comparer la structure complète sur chaque page publiée. Le CRM (`crm.html`) possède une navigation métier dédiée ; les écrans `administration.html`, `admin-recherches.html` et `espace-interne.html` ont des interfaces privées dédiées. | Une seule barre publique de référence partout où la navigation publique est attendue : mêmes familles, libellés, ordre, liens, dimensions, styles, états actifs, sous-menus et comportements desktop/mobile. Toute exception privée doit être explicitement identifiée, cohérente avec la charte MajestiOS et ne pas être confondue avec une divergence accidentelle. | Test navigateur étendu sur toutes les pages HTML publiques du manifeste ; exécution CI et contrôle visuel encore requis. La parité CRM/cockpit privé reste à examiner séparément avant clôture. |

### Critères de recette NAV-04

- [ ] Inventorier chaque page HTML du manifeste et classer les pages publiques, l'entrée VIP, le CRM et les cockpits privés.
- [ ] Comparer automatiquement sur chaque page publique la liste ordonnée des familles, les libellés, les destinations, la hauteur de barre et la présence du hamburger.
- [ ] Vérifier les états actif, survol, focus clavier, ouverture/fermeture des sous-menus et navigation tactile.
- [ ] Répéter la recette à 1440 px et 390 px au minimum ; ajouter tablette si le runner le permet.
- [ ] Vérifier visuellement les pages d'entrée VIP et CRM : même langage de marque, contraste, compacité et absence de conflit entre navigation globale et navigation métier.
- [ ] Ne pas considérer un contrôle statique ou un build réussi comme une preuve de rendu visuel.
- [ ] Ne clôturer NAV-04 qu'après CI verte, captures comparatives et revue des exceptions privées.

**Modification de test :** le test `tests/navigation-classique.browser.cjs` compare désormais la structure complète du menu sur les pages HTML publiques présentes dans `site-files.json`, puis revient à l'accueil pour poursuivre les scénarios existants. Modifications desktop et mobile enregistrées dans les commits `8244bead2394a4ca5cd0849df9fbef25cb810243` et `3bdc29cb35a9146c8a010bce56438c3758f38d5c`. Le registre et le README ont été mis à jour dans les commits `662fb4abab3ef66c3a7826931e99cf1f3000cacc` et `daaa209ef4faf52a2cca9156e55d359eaa369c5a`. Les écrans CRM et cockpits privés sont exclus de cette comparaison publique et restent explicitement dans le périmètre de revue dédié. Cette exclusion est provisoire : elle ne vaut pas dérogation à la demande d'une navigation cohérente sur toutes les pages ; il reste à harmoniser leur navigation spécifique sans supprimer leurs accès métier.

**Limite de preuve :** le test a été modifié sur Evolution-9 ; il n'a pas encore été exécuté après cette modification. Aucune correction visuelle ou déploiement n'est déclaré à ce stade.


## 23. Exigence utilisateur — harmonisation de la charte graphique multi-espaces — 11 novembre 2026

| ID | Priorité | Domaine | Constat vérifié | Exigence / traitement | Statut |
|---|---|---|---|---|---|
| UX-02 | P1 | Identité graphique transversale | Une feuille centrale `charte-majestios.css` définit déjà des variables bleu nuit/or et des composants communs. Elle est chargée sur le CRM et l'espace privé, mais les interfaces `administration.html` et `espace-interne.html` reposent sur leurs propres palettes et feuilles CSS. Le CRM utilise aussi plusieurs surfaces claires et styles métier spécifiques. La présence d'une feuille commune ne prouve donc pas l'uniformité visuelle de toutes les pages. | Harmoniser toutes les pages publiques et privées autour d'un langage visuel MajestiOS commun : bleu nuit, or, chrome/acier, typographies et échelles cohérentes, rayons, bordures, ombres, boutons, champs, cartes, états actifs/focus/erreur/succès et responsive. Conserver des variations de surface justifiées par l'usage (cockpit sombre, formulaires clairs, etc.) uniquement si elles restent dans la même grammaire graphique et respectent le contraste. | Ouvert — audit comparatif et recette visuelle à réaliser avant toute clôture. |

### Critères de recette UX-02

- [ ] Définir les tokens canoniques (couleurs, surfaces, textes, typographies, espacements, rayons, ombres, bordures, focus et états) dans la charte centrale, sans multiplier les sources de vérité.
- [ ] Inventorier les feuilles CSS globales, spécifiques et styles inline ; repérer les couleurs concurrentes, doublons et surcharges qui contredisent la charte.
- [ ] Harmoniser l'identité de l'accueil, des pages publiques, de l'espace privé/VIP, du CRM, de l'administration et de l'espace collaborateurs.
- [ ] Garder les contrastes accessibles : le chrome est un accent et non un texte pâle sur fond clair ; les textes et commandes restent lisibles.
- [ ] Unifier boutons, champs, cartes, tableaux, alertes, badges, liens, focus clavier et états désactivés, sans supprimer de fonction ni d'information.
- [ ] Vérifier desktop (1440 px), tablette et mobile (390 px), y compris débordements, densité, tailles tactiles et hiérarchie visuelle.
- [ ] Contrôler ensemble navigation et charte : même barre globale, même signature de marque, sous-menus lisibles ; espaces métier gardant uniquement les adaptations nécessaires.
- [ ] Comparer des captures avant/après sur les pages de référence et vérifier les parcours réels ; une simple présence de `charte-majestios.css` ou un build réussi ne suffit pas.
- [ ] Ne clôturer UX-02 qu'après tests automatisés, revue visuelle multi-pages et validation de non-régression fonctionnelle.

**Pages à inclure explicitement dans la comparaison :** accueil, une page de rubrique publique, résultats de recherche, espace privé (entrée VIP), espace collaborateurs, CRM interne, administration et recherches ciblées.

**Garde-fou :** ne pas imposer un fond sombre uniforme à toutes les pages. L'objectif est une identité cohérente et premium, pas une uniformisation qui dégrade la lecture, les formulaires ou l'ergonomie. Aucun changement de données, de droits ou de services distants n'est autorisé par cette exigence graphique.


## 24. Correction de recette et harmonisation initiale des espaces — 11 novembre 2026

| ID | Priorité | Domaine | Cause / correction | Statut |
|---|---|---|---|---|
| CI-02 | P1 CI | Test de navigation mobile | Le tableau `publicPages` était déclaré après sa première utilisation dans le parcours mobile, provoquant une erreur TDZ. Sa déclaration a été remontée avant les parcours. | Corrigé dans le code ; run de confirmation en cours. |
| NAV-05 | P2 | Passerelle d'accès privé | `espace-prive.html` est une page autonome `noindex` de choix d'accès, sans barre publique. Elle est explicitement exclue de la recette de parité publique ; la page et ses parcours d'accès sont conservés. | Exception documentée dans le filtre de recette. |
| UX-03 | P1 | Tokens graphiques privés | Une couche `charte-majestios-espaces.css` harmonise les accents or, les familles typographiques, les rayons de contrôles et le focus clavier pour CRM, administration, recherches ciblées et espace collaborateurs. Les fonds restent adaptés à chaque usage. | Première couche de code intégrée ; recette visuelle et CI à confirmer. |

**Limite de preuve :** le premier correctif a supprimé l'erreur TDZ ; le run suivant a révélé l'absence normale de hamburger sur la passerelle autonome `espace-prive.html` et le sélecteur trop restrictif `#menu-toggle`. La recette utilise désormais `.menu-toggle`, conformément au script partagé. Aucune validation visuelle multi-pages n'est revendiquée à ce stade.


## 25. Source unique des tokens et correction NAV-06 — 11 novembre 2026

| ID | Priorité | Domaine | Cause / correction | Statut |
|---|---|---|---|---|
| NAV-06 | P1 | Contrat du bouton mobile | Certaines pages historiques utilisent la classe `.menu-toggle` sans identifiant `menu-toggle`. Le script partagé accepte les deux formes ; le test a été aligné sur ce contrat et la modification inutile de `majestios-v5.html` a été annulée. | Corrigé ; CI verte sur HEAD 905041b. |
| UX-04 | P1 | Source des tokens | La première couche privée consommait des variables définies uniquement par `charte-majestios.css`, absente de certains espaces privés. Les valeurs communes sont maintenant extraites dans `charte-majestios-tokens.css`, importée par les deux feuilles de composants. | Source commune intégrée ; build et recette à confirmer. |

**Garde-fou :** les pages privées ne chargent pas la feuille de composants publics complète ; elles consomment uniquement les tokens partagés et leur couche d'adaptation. Les surfaces et mises en page spécifiques sont conservées.


## 26. Correction de l'assertion URL Assistant — 11 novembre 2026

| ID | Priorité | Domaine | Cause / correction | Statut |
|---|---|---|---|---|
| CI-03 | P1 CI | Recette de navigation Assistant | L'assertion finale utilisait un antislash supplémentaire dans son expression régulière : le navigateur ouvrait correctement `assistant-majestios.html`, mais le test rejetait l'URL. L'expression est alignée sur la forme utilisée par les autres assertions. | Corrigé dans le test ; exécution CI complète à confirmer. |

**Preuve intermédiaire :** le parcours mobile a dépassé l'ensemble des pages publiques jusqu'au contrôle du menu Assistant ; l'échec était une assertion URL, pas une panne de navigation. La recette complète reste ouverte jusqu'au run vert.


## 27. Résultat de la recette automatisée — 11 novembre 2026

**CI-04 — SUCCESS** Le workflow `verify-site.yml` est entièrement vert sur le commit `92344c68f075c5631493f451123959dc850f78f3` : [run 43042242471](https://github.com/Chexpeer/Majestios/actions/runs/43042242471).

- Build : 86 ressources copiées depuis le manifeste, sans différence avec les sources.
- Architecture : 39 pages HTML et 86 ressources vérifiées.
- Site : liens locaux et identifiants contrôlés.
- Documentation : 14 fichiers canoniques et liens présents.
- Navigateurs : Prospection, navigation desktop/mobile et chatbot réussis ; moteur de recherche et Réputation virtuelle réussis ; contact sans transmission et verrouillage du cockpit sans session réussis.
- APIs publiques : contrôles BOAMP et BODACC réussis sur les échantillons du test.

**Statut des anomalies :** les erreurs de recette CI-02/CI-03 sont corrigées ; NAV-04 passe désormais ses contrôles automatisés. UX-02/UX-03/UX-04 disposent d'une première couche de tokens commune intégrée. La recette visuelle multi-pages, les captures comparatives et l'inspection des états interactifs restent ouvertes. La CI verte ne vaut pas validation visuelle ni déploiement.


## 28. Prévisualisation Evolution-9 après recette CI — 11 novembre 2026

**Déploiement Vercel : READY**  
URL unique : https://majestios-q75r1hk52-majistr.vercel.app  
Alias de branche : https://majestios-git-evolution-9-majistr.vercel.app  
Commit : `2c2bc988c71f3178b3ea33ab1bebcde725dba5cf`  
Projet : `majestios` (`prj_efmheKwiXnsncdhJYLmNIWN9QYQL`)  
Cible : Preview, aucune promotion production.

Le déploiement est prêt et correspond exactement au commit de la recette CI verte. La protection SSO du projet reste activée. L'ouverture non authentifiée du preview depuis l'outil web n'a pas permis d'inspecter le rendu ; aucune validation visuelle n'est donc revendiquée. Ne pas désactiver la protection : la revue visuelle doit être faite depuis une session autorisée.


## 29. Garde-fous automatiques de la charte — 11 novembre 2026

| ID | Priorité | Domaine | Contrôle ajouté | Statut |
|---|---|---|---|---|
| UX-05 | P1 | Régression des tokens graphiques | `verify-architecture.js` contrôle désormais la présence des tokens centraux dans le manifeste, leur import par les deux feuilles de composants et le chargement de la couche privée sur CRM, administration, recherches ciblées et espace collaborateurs. | Contrôle statique ajouté ; CI à confirmer. |

Ce contrôle vérifie le contrat de chargement et de source unique ; il ne remplace pas la recette du contraste, du rendu, des tailles et des états interactifs dans un navigateur.


## 30. CI verte et reprise CRM — 11 novembre 2026

| ID | Priorité | Domaine | Cause / correction | Statut |
|---|---|---|---|---|
| CI-05 | P1 CI | Validation globale Evolution-9 | Le workflow `verify-static-site` a réussi sur le HEAD `905041b6c736a1c66adade91561beb623c67a1fe` (run 43042947816). Les tests navigateur desktop/mobile et les contrôles CRM statiques sont inclus. | CI verte (SUCCESS). |
| CRM-06 | P0 | Sécurité du CRM sur le projet principal | L'audit lecture seule constate encore des privilèges UPDATE trop larges et l'absence des triggers d'historisation sur `majestios-crm`. Les migrations correctives sont présentes dans Git mais non appliquées à distance. | Bloqué : plan et autorisation Supabase requis. |
| CRM-07 | P1 | Recette multi-tenant | Le protocole de test existe, mais les identités/organisations synthétiques et scénarios JWT multi-rôle ne sont pas exécutés. | Préparé, NOT RUN. |
| F2-01 | P2 | Préparation facturation CRM | Le CRM actuel ne possède pas de domaine facture opérationnel ni d'adresse/contact de facturation distincts. La cible est cadrée en phase 2, domaine séparé relié au CRM. | Cadrage documenté ; aucune implémentation revendiquée. |

**Limite :** la CI verte ne prouve ni la sécurité effective du projet Supabase distant, ni une recette métier multi-utilisateur, ni la validation visuelle. Aucun changement Supabase/Vercel n'a été effectué.


## 12. Audit Cheexpeer — worker et pont serveur — 11 novembre 2026

| ID | Priorité | Domaine | Constat vérifié dans le code Evolution-9 | Traitement / statut |
|---|---|---|---|---|
| CHX-05 | P1 CI | Déclenchement des tests worker | `.github/workflows/cheexpeer-worker.yml` ne déclenchait les tests push que sur Evolution-7 et Evolution-8. Les modifications du worker sur la branche active Evolution-9 pouvaient donc échapper à cette suite spécialisée. | **Corrigé dans le code** : Evolution-9 ajouté au filtre de branches ; test de contrat ajouté pour empêcher la régression. Exécution de la nouvelle suite encore attendue. |
| CHX-06 | P1 produit | Exécution métier Cheexpeer | `services/cheexpeer-worker/src/index.mjs` ne possède qu'un exécuteur réel : `readiness_probe` avec autonomie 0, sans effet externe. Toute autre mission est explicitement refusée avec `UNSUPPORTED_EXECUTOR`. | Garde-fou fail-closed présent ; **aucune capacité métier autonome n'est livrée par ce worker**. Construire et recetter un premier handler avant toute promesse opérationnelle. |
| CHX-07 | P1 fiabilité | Missions longues / bail de traitement | Le pont expose `renew_lease` et la RPC SQL correspondante, mais le worker Node ne renouvelle pas le bail pendant l'exécution. | Sans impact démontré sur le probe bref actuel. Bloquant pour les handlers longs : implémenter heartbeat/renouvellement, arrêt propre et test d'expiration avant de les activer. |
| CHX-08 | P1 exploitation | Déploiement et raccordement | Le code du pont Edge est présent dans Git. Le dernier audit distant en lecture seule consignait le worker v1 sur `MajestiOS-Test`, limité au probe, et l'absence du pont sous le nom attendu. | **Non vérifié à nouveau dans cette passe** ; aucun déploiement, secret ou paramètre distant modifié. Vérifier explicitement les versions et variables sur le projet de test avant recette. |

### Contrôles de sécurité constatés dans le code

- Le pont Edge exige un secret partagé indépendant avant de créer le client Supabase de service ; comparaison en temps constant.
- Les actions RPC sont limitées à une liste explicite ; aucune méthode RPC n'est construite à partir d'une chaîne libre fournie par le client.
- Les identifiants worker/mission et identifiants de messages sont validés ; corps et résultat sont plafonnés ; le pont n'active pas CORS navigateur.
- Le worker utilise la clé service-role uniquement côté serveur. Son absence de configuration provoque un arrêt au démarrage ; ne jamais exposer ces variables au frontend ou au dépôt.
- Le registre SQL refuse de réclamer une mission métier sans outil activé et approuvé ; le probe autonomie 0 est l'unique exception observée.

**Limite de preuve :** lecture statique du code et des migrations uniquement. Les tests unitaires/contrats ne prouvent ni le déploiement du pont, ni l'exécution réelle sur Supabase, ni la sécurité de la configuration distante. Aucune donnée, migration, fonction Edge, clé ou secret Supabase n'a été modifié.


**Preuve CI CHX-05 — 11 novembre 2026 :** le workflow spécialisé `Cheexpeer worker contract` a réussi sur le commit `e401eb13be6ad395d4f63a596f2761efd07aefe5` (run [43044831310](https://github.com/Chexpeer/Majestios/actions/runs/43044831310)). Les étapes `Syntax check` et `Policy tests` sont toutes deux `success`. Cette preuve confirme l'exécution de la suite de contrats sur Evolution-9 ; elle ne prouve pas le déploiement du worker ni sa recette Supabase distante.


## 13. Audit des surfaces produit et des capacités spécialisées — 11 novembre 2026

| ID | Priorité | Domaine | Constat vérifié | Statut / conséquence |
|---|---|---|---|---|
| CHX-09 | P1 produit | Assistant conversationnel | `assistant-majestios.html` annonce explicitement « Guide local actif · IA à raccorder » et désactive la saisie de sa console. Le widget généré par `app.js` répond à partir d'une liste locale de mots-clés/rubriques ; il n'appelle pas de modèle IA, ne crée pas de mission et ne réalise aucune action métier. | Comportement transparent et cohérent avec un guide de première génération. **Ce chatbot n'est pas Cheexpeer** et ne doit pas être présenté comme l'agent transversal livré. |
| CHX-10 | P1 capacité | Réputation virtuelle | Le registre des sources classe l'identité officielle et BODACC comme sources automatisées disponibles dans le code ; Google Web/Maps sont manuels ; les plateformes sociales sont planifiées et sans connexion automatisée. L'analyse IA est conditionnée à la présence de clé, modèle et endpoint serveur ; sinon la fonction retourne une collecte seule, sans diagnostic. | Brique spécialisée partiellement implémentée ; aucune couverture exhaustive de réputation web/sociale ni score global. Le déploiement et le fournisseur actif restent à vérifier à distance. |
| CHX-11 | P1 stratégie | Community management LinkedIn | La vision stratégique Evolution-9 prévoit que Cheexpeer prépare et pilote le community management MajestiOS. Dans le périmètre de code Evolution-9 inspecté, aucun connecteur LinkedIn/OAuth, calendrier éditorial exécutable, publication, gestion d'interactions ou mesure d'audience n'a été identifié. | **Objectif spécifié, capacité non démontrée**. Avant raccordement : définir les autorisations LinkedIn, limites API, séparation lecture/rédaction/publication, journal d'activité, validation humaine des contenus et actions engageantes. |
| CHX-12 | P2 capacité | Drive, SEO et planification | Les documents décrivent archivage Drive et veille SEO périodique comme objectifs ; aucun connecteur Drive opérationnel ni planificateur SEO transversal n'a été identifié dans les composants d'exécution inspectés. | À construire après le noyau mission/worker et les premiers connecteurs métier ; ne pas annoncer comme automatisations disponibles. |

### Synthèse de maturité Cheexpeer

- **Présent dans le dépôt :** fondation SQL des missions, étapes/événements, file durable, approbations humaines, registre fail-closed, pont serveur, worker bootstrap et brique spécialisée d'analyse de contexte administratif.
- **Démontré par tests :** syntaxe du worker et du pont, règles de probe, disponibilité de santé, contrat du secret, liste blanche RPC, validation des identifiants et plafonds de taille.
- **Non démontré en environnement :** exécution métier complète, raccordement du pont au projet de test, interface de commande reliée aux missions, persistance conversationnelle, fournisseur IA actif, connecteurs LinkedIn/Drive/SEO et planificateur général.
- **Règle d'activation :** aucune mission métier ne doit être activée avant handler explicite, outil autorisé, contexte organisationnel, validation adaptée, journal de preuve, gestion des baux et recette sur environnement de test.

Cette synthèse est une lecture du dépôt et des derniers constats distants consignés ; elle ne remplace pas une nouvelle vérification des versions déployées. Aucun accès distant, déploiement ou changement Supabase n'a été effectué dans cette passe.


## 14. Garde-fou préventif sur les décisions d'approbation — 11 novembre 2026

| ID | Priorité | Domaine | Constat | Exigence avant raccordement |
|---|---|---|---|---|
| CHX-13 | P1 sécurité | Identité de l'approbateur | La RPC privée `cheexpeer_decide_approval` reçoit un paramètre `p_decision_by` puis vérifie que cet UUID appartient à l'organisation avec le rôle owner/admin. La fonction est réservée à `service_role` ; elle ne lie donc pas elle-même ce paramètre à un JWT utilisateur. Le pont worker actuel ne publie pas cette action, ce qui évite son exposition directe par ce pont. | Toute future API d'approbation doit authentifier la session, dériver l'UUID côté serveur à partir du JWT vérifié, ignorer tout UUID d'acteur fourni par le navigateur, vérifier l'organisation et journaliser la décision. Ajouter tests négatifs de falsification d'identité et tests inter-organisations avant activation. |

**Qualification :** point de conception préventif, pas preuve d'une exposition actuelle. Ne pas ajouter la décision d'approbation à la liste d'actions du worker. L'approbation est une décision utilisateur, distincte de l'exécution technique du worker.


## 15. Première mission Cheexpeer — 11 novembre 2026

| ID | Priorité | Domaine | Constat / risque | Traitement / statut |
|---|---|---|---|---|
| CHX-14 | P1 | API de missions | Le pont worker est exclusivement serveur et n'offre ni soumission authentifiée par JWT utilisateur, ni décision d'approbation utilisateur, ni consultation tenant-scoped des résultats. | Ouvert — créer une API d'orchestration séparée du pont, avec identité dérivée du JWT et contrôle owner/admin par organisation. |
| CHX-15 | P1 | États et étapes | Le schéma SQL utilise succeeded, tandis que des documents historiques parlent de completed. La table des étapes existe, mais le worker ne les réclame ni ne les exécute. | Normalisation documentaire Evolution-9 : succeeded est le statut persistant canonique ; « Terminée » est le libellé UI. Première mission atomique ; moteur multi-étapes non livré. |
| CHX-16 | P1 sécurité | Premier outil worker | Un premier handler de diagnostic local worker_self_check a été ajouté. Son activation pourrait être prématurée si le déploiement, les API utilisateur, l'approbation et les tests d'isolation ne sont pas prêts. | Handler et tests présents ; entrée au registre préparée avec enabled=false, A0, approbation obligatoire et effet read. Aucune migration appliquée ni mission distante créée. |
| CHX-17 | P1 fiabilité | Bail de mission | Le worker ne renouvelait pas le bail avant ses traitements ; le premier handler ajoute un renouvellement préalable et refuse la complétion si le renouvellement est rejeté. Le heartbeat périodique pour les missions longues reste absent. | Correction limitée au premier handler bref ; heartbeat nécessaire avant tout handler long. |

La spécification de référence est [SPECIFICATION-PREMIERE-MISSION-CHEEXPEER.md](SPECIFICATION-PREMIERE-MISSION-CHEEXPEER.md). La migration d'outil reste volontairement désactivée. Aucune donnée, migration, fonction Edge, configuration ou secret Supabase n'a été modifié à distance.


## 7. Régressions visuelles constatées sur la prévisualisation Evolution-9 — 11 novembre 2026

| ID | Priorité | Domaine | Constat / cause | Correction engagée | Statut |
|---|---|---|---|---|---|
| E9-UX-02 | P1 | Réputation virtuelle | Les formulaires Google Web et Google Maps étaient visibles, contrairement à la consigne produit : aucun formulaire apparent dans cette rubrique. Le dossier d'audit est déjà masqué. | Masquage du conteneur Google Web/Maps sans supprimer les formulaires, leurs écouteurs ni leurs traitements. Le test navigateur vérifie l'absence d'affichage public puis révèle les contrôles uniquement dans le contexte de test pour exercer leur logique. | Code et test mis à jour sur Evolution-9 ; exécution CI et recette visuelle réelle à confirmer. |
| E9-UX-03 | P1 | Navigation transversale | La page Réputation virtuelle et la page Prospection ne chargeaient pas directement les ressources communes `navigation-tiroirs.js` et `navigation-tiroirs.css` ; le menu pouvait donc rester dans son ancien rendu sur ces surfaces. | Chargement des deux ressources communes sur Réputation virtuelle et Prospection ; aucun lien ni rubrique métier supprimé. | Code présent sur Evolution-9 ; recette desktop/mobile multi-pages à confirmer. |
| E9-UX-04 | P1 | Accueil | Le visuel de fond pouvait dominer les dégradés et rendre le premier écran trop clair. | Fond bleu nuit de secours et voiles sombres renforcés, sans supprimer le visuel décoratif. | Code corrigé ; recette desktop/mobile à confirmer. |
| E9-UX-05 | P1 | Accès VIP | L'accès VIP n'était pas présenté avec un traitement homogène entre les menus. | Signature VIP bleu nuit/or/chrome dans le tiroir « Espaces privés ». | Code corrigé ; recette sur toutes les pages à confirmer. |

**Règle de prévention ajoutée :** les tests ne doivent jamais considérer la disparition d'une fonction visible comme un état attendu uniquement parce que le HTML la masque. Les contrôles de non-régression doivent vérifier la présence, la visibilité et l'accès réel aux fonctions métier demandées.


## 16. Visibilité maîtrisée et navigation commune — 11 novembre 2026

- Réputation virtuelle : les trois formulaires de la rubrique (dossier d'audit, Google Web, Google Maps) restent dans le document mais aucun n'est affiché au chargement public. Le dossier d'audit conserve son attribut `hidden` ; le conteneur des deux recherches Google est également masqué. Les handlers JavaScript, la collecte, le journal de session, les liens de secours et le rendu de résultats sont conservés. Les tests révèlent les contrôles uniquement après avoir vérifié qu'ils sont masqués, afin de tester leur logique sans les rendre publics.
- Navigation : `navigation-tiroirs.css` et `navigation-tiroirs.js` sont désormais chargés par `reputation-virtuelle.html` et `prospection-active.html`. Le script conserve les liens de sous-menu et le comportement tactile/desktop déjà défini dans le composant partagé.
- Non-régression : comparaison de référence effectuée avec Evolution-7 avant modification ; aucun fichier Evolution-7 n'a été écrit. Les modifications portent sur les deux pages, le test navigateur de Réputation virtuelle et ce registre.
- Limite de preuve : les mises à jour GitHub sont confirmées sur Evolution-9. Le statut combiné du commit contrôlé ne retournait aucun statut CI ; aucune exécution Playwright locale ni vérification visuelle desktop/mobile n'est revendiquée dans cette passe.


## 17. Accès VIP — vérification du parcours et preuve de prévisualisation — 11 novembre 2026

- Point d'entrée : le menu commun « Accès VIP · Administration » mène à `espace-interne.html`, qui affiche le formulaire de connexion dans le HTML initial. Le formulaire reste visible même si le module JavaScript échoue ; un message de secours est prévu et le bouton est neutralisé. Le sas n'ouvre aucun outil sans session et appartenance interne confirmées.
- Parcours : après authentification, `espace-interne.js` contrôle l'identité, l'organisation `kind=internal` et le rôle. Seuls `owner` et `admin` peuvent être redirigés vers `administration.html`. Le cockpit refait un contrôle indépendant avant d'afficher ses données.
- Contrôle statique : `verify-site.js` a été corrigé pour correspondre à la consigne de masquage des formulaires Réputation virtuelle ; il vérifie aussi la présence du formulaire de secours VIP et la destination du lien de navigation. Le test navigateur `administration-access.browser.cjs` couvre les états sans session et les rôles owner/admin/member/viewer, mais son exécution n'a pas été obtenue dans cette passe.
- Déploiement de prévisualisation : Vercel a construit le commit `a02682f71f644a4d2a826e309965015847855942` depuis `Evolution-9`, état READY, URL `https://majestios-git-evolution-9-majistr.vercel.app`. Les journaux confirment le build statique (86 fichiers) et le déploiement.
- Production : l'alias `majestios.vercel.app` reste rattaché au déploiement de production du commit `6256d6aee38de7fc9ed1c4cb600cf12d73836b6c`. Le nouveau commit n'a pas été promu en production.
- Limite : la prévisualisation n'a pas pu être ouverte avec l'outil de consultation utilisé ; le statut READY prouve le build et la publication, pas le rendu ni le parcours réel dans un navigateur. L'anomalie « page blanche et or » n'est donc pas déclarée résolue. Il reste à reproduire le clic depuis l'appareil de l'utilisateur et à inspecter la console/réseau si le formulaire ne s'affiche pas.


## 18. Navigation globale et accès VIP depuis toutes les pages — 11 novembre 2026

| ID | Priorité | Domaine | Cause | Correction | Statut |
|---|---|---|---|---|---|
| E9-NAV-02 | P1 | Accès global / navigation | De nombreuses pages HTML conservaient une navigation locale historique sans charger `navigation-tiroirs.js` ni ses styles. Certaines pages internes (CRM, cockpit, recherche ciblée et sas VIP) ne possédaient pas de barre publique commune. Le lien VIP ne pouvait donc pas être garanti depuis toutes les pages. | Chargement du script commun sur toutes les pages HTML déclarées ; le script injecte la feuille de style commune et crée une barre de navigation de secours si la page n'en possède pas. Le menu conserve le lien « Accès VIP · Administration » dans « Espaces privés » et cible `espace-interne.html`. | **Code propagé sur Evolution-9 ; vérification statique ajoutée.** La recette visuelle desktop/mobile et la vérification de toutes les routes sur le déploiement restent à exécuter. Aucun changement Supabase. |


**Recette de la correction E9-NAV-02 — 11 novembre 2026 :**
- Le premier passage CI a révélé un ordre incorrect de feuilles de style sur `prospection-active.html` et `reputation-virtuelle.html`. Les liens CSS redondants ont été retirés ; le bootstrap partagé vérifie désormais si la feuille existe déjà avant de l'ajouter.
- Le bootstrap ajoute également le bouton hamburger si une page possède une barre de navigation sans commande mobile.
- **GitHub Actions :** run `43062042202`, commit `125f23e2082e1917c848cec0d590ec7565647c68`, conclusion **success**. Architecture/routes, liens locaux et identifiants, navigateur, menus desktop/mobile, Réputation virtuelle, contact, verrouillage sans session et contrat de sécurité CRM : réussis.
- **Vercel Preview :** déploiement `dpl_9otSDEzYC7uEwmpphw6LfnMbg9QR`, statut **READY**, branche `Evolution-9`, commit `125f23e2082e1917c848cec0d590ec7565647c68`, URL https://majestios-khtvxe91o-majistr.vercel.app.
- La prévisualisation n'a pas été promue en production. L'alias de production reste indépendant. Aucun changement Supabase.

## 31. Ciblage APE/NAF — validation des critères — 11 novembre 2026

| ID | Priorité | Domaine | Constat / correction | Statut |
|---|---|---|---|---|
| CRM-08 | P1 | Ciblage entreprises | Les regex du formulaire doublaient les antislashs et rejetaient les formats usuels APE/NAF (43.21A) et département (72). Les deux motifs sont corrigés dans crm-page.js ; des assertions statiques de non-régression sont ajoutées à verify-site.js. | Corrigé dans le code ; CI à confirmer. |
| CRM-09 | P2 | Exhaustivité du ciblage | L'appel API limite explicitement la collecte à une page (maxPages: 1) et au plus 10 candidats. Les résultats ne doivent pas être présentés comme exhaustifs. | Limite connue ; évolution à cadrer selon quotas et coût. |

CRM-06 (sécurité distante) et CRM-07 (recette multi-tenant) restent ouverts. Cette correction frontend ne remplace pas les restrictions SQL ni les tests d'isolation réels.

## 32. Gouvernance documentaire IA et audit SEO — 11 novembre 2026

| ID | Priorité | Domaine | Constat / action | Statut |
|---|---|---|---|---|
| DOC-01 | P1 | Onboarding IA / gouvernance | La hiérarchie active et les consignes opérationnelles étaient contradictoires : AGENTS.md renvoyait encore à la référence V5 comme source active alors que le chantier autorisé est Evolution-9. Création d'un guide de prise en main IA, mise à jour de la hiérarchie dans AGENTS.md et ajout des liens dans docs/README.md. | Correction documentaire intégrée ; vérification automatique des liens à exécuter. |
| SEO-01 | P1 | Canonical / domaine | Aucun canonical détecté dans les dix pages de l'échantillon. Le domaine public de référence n'est pas confirmé dans cette passe. | Ouvert — ne pas inventer le domaine. |
| SEO-02 | P2 | Robots / sitemap | robots.txt et sitemap.xml absents du dépôt à la date de vérification ; présence éventuelle côté hébergeur non vérifiée. | Ouvert — créer après confirmation du domaine et inventaire des routes publiques. |
| SEO-03 | P1 | Indexation des espaces privés | CRM et administration ont noindex,nofollow dans l'échantillon ; autres espaces privés à contrôler. noindex ne remplace jamais l'authentification. | Partiellement contrôlé. |
| SEO-04 | P2 | Qualité on-page | Titles, descriptions et un H1 présents sur les dix pages échantillonnées ; unicité, couverture totale, alt, liens internes et données structurées non encore audités. | Audit partiel. |
| SEO-05 | P2 | Performance / accessibilité | Aucun score Lighthouse, Core Web Vitals ou audit accessibilité n'a été exécuté dans cette passe. | Ouvert. |
| GEO-01 | P2 | Visibilité moteurs IA | Besoin de cohérence entre promesse, fonctionnalités réelles, sources et documentation structurée. | À développer par lots. |

Le guide transversal est docs/GUIDE-PRISE-EN-MAIN-IA-MAJESTIOS.md ; l'audit SEO détaillé est docs/evolution-9/AUDIT-SEO-EVOLUTION-9.md. Ces documents ne remplacent pas AGENTS.md ni le registre critique central.

## 33. Protection d'indexation — espaces membre et résultats — 11 novembre 2026

| ID | Priorité | Domaine | Constat / correction | Statut |
|---|---|---|---|---|
| SEO-06 | P1 | Espace membre | espace-membre.html ne portait pas de noindex malgré son parcours de création/connexion de compte. Directive noindex,nofollow ajoutée et assertion verify-site.js créée. | Corrigé dans le code ; CI à confirmer. |
| SEO-07 | P2 | Résultats dynamiques | resultats-recherche.html ne portait pas de noindex alors qu'elle affiche des résultats liés à une requête dynamique. Directive noindex,nofollow ajoutée et assertion verify-site.js créée. | Corrigé dans le code ; CI à confirmer. |

Le noindex n'est pas un contrôle d'accès. Les données personnelles et résultats non publics doivent rester protégés par les contrôles applicatifs et serveur.

## 34. Assistant et transparence Cheexpeer — 11 novembre 2026

| ID | Priorité | Domaine | Constat / correction | Statut |
|---|---|---|---|---|
| CHAT-03 | P1 | Espace Assistant / ergonomie | La page assistant-majestios.html présentait un champ de saisie et un bouton Envoyer désactivés alors que le guide local était disponible via le bouton flottant. Le faux formulaire a été remplacé par un bouton fonctionnel qui ouvre le guide partagé ; assertions ajoutées à verify-site.js. | Corrigé dans le code ; CI et recette navigateur à confirmer. |
| CHX-DOC-01 | P1 | Cohérence documentation / worker | Des documents résumaient le worker comme limité à readiness_probe, alors que le code Evolution-9 contient deux handlers de diagnostic (bootstrap et worker_self_check). Le dernier audit distant décrivait le worker déployé sur MajestiOS-Test comme limité à readiness_probe. La distinction code Git / version déployée est explicitée dans le guide IA et le référentiel. | Documentation clarifiée ; version distante à recontrôler avant toute activation. |
| GEO-02 | P2 | Exactitude des métadonnées Cheexpeer | La meta description de majestios-v5.html pouvait faire croire que les capacités prévues de surveillance, analyse, rapports, alertes et scoring étaient déjà disponibles. Reformulation pour préciser qu'il s'agit d'un agent en préparation. | Corrigé dans le code ; CI à confirmer. |

La page Assistant reste un guide local à mots-clés ; cette correction d'ergonomie ne la transforme pas en agent IA. Les missions métier, outils et connecteurs Cheexpeer restent non activés.


## 35. Balayage SEO des 39 pages HTML — 11 novembre 2026

Le contrôle de présence a parcouru les 39 pages HTML du manifeste : title, meta description et au moins un H1 sont présents sur chaque page inspectée. Aucun canonical n'a été trouvé dans les 39 pages. L'unicité des titres/descriptions et les audits Lighthouse/accessibilité restent à exécuter. Les directives noindex ont été ajoutées à espace-membre.html et resultats-recherche.html ; CRM, administration, espace-prive, espace-interne et admin-recherches les possédaient déjà. L'indexation n'est jamais une barrière de sécurité.

## 36. Couverture des compteurs et relances CRM — 11 novembre 2026

| ID | Priorité | Domaine | Constat / correction | Statut |
|---|---|---|---|---|
| CRM-10 | P1 avant usage intensif | Compteurs et tableau de relances | Les listes CRM historiques plafonnent à 100 lignes. Les compteurs Contacts, Opportunités et Activités pouvaient donc afficher un volume partiel ; le tableau de relances et les notifications navigateur ne traitent que les 100 premières opportunités retournées. | Compteurs exacts tenant-scoped ajoutés avec count/head ; l'aperçu des relances affiche désormais explicitement sa couverture partielle quand le total dépasse les lignes chargées. La complétude fonctionnelle des alertes au-delà de 100 reste à concevoir. |
| CRM-11 | P2 | Relances persistantes | La liste des relances persistantes reste plafonnée à 100 éléments. | Compteur exact tenant-scoped et avertissement de troncature ajoutés ; pagination de la liste à prévoir si le volume augmente. Tests CI à confirmer. |

Les contrôles countWorkspaceRecords sont tenant-scoped et ne téléchargent pas les fiches. Ils ne remplacent pas les politiques RLS ni les tests inter-organisations. Aucun appel d'écriture ou changement distant Supabase n'a été effectué.


## 37. Relations CRM, historisation et transitions — approfondissement du 11 novembre 2026

| ID | Priorité | Domaine | Constat vérifié sur MajestiOS-Test | Action / statut |
|---|---|---|---|---|
| CRM-12 | P1 | Intégrité SQL | Deux triggers identiques appellent `private.enforce_tenant_relationship_integrity()` sur businesses, contacts, opportunities et activities. | Doublon confirmé ; préparer une migration de nettoyage après test et revue des migrations. Aucun trigger supprimé. |
| CRM-13 | P1 | Historisation | Les activités conservent les champs modifiés et les statuts avant/après, mais pas les valeurs avant/après des autres champs. | Concevoir une historisation ciblée par liste blanche, minimisant les données personnelles. |
| CRM-14 | P1 | Transitions commerciales | Le CHECK autorise une liste de statuts mais ne contrôle pas les transitions métier autorisées. | Formaliser et tester une machine à états, y compris réouverture et motifs de clôture. |
| CRM-15 | P1 | Conservation | Suppression d'organisation en CASCADE ; suppression de fiches détache les activités via SET NULL. | Définir archivage, export, suppression et conservation avant ouverture client. |
| CRM-16 | P1 | Tests multi-tenant | Tables CRM sans données de recette et scénarios authentifiés multi-rôles non exécutés. | Préparer des fixtures synthétiques isolées et tests owner/admin/member sur deux organisations. |

La fonction de traitement de relance fixe un `search_path` vide, verrouille la relance, vérifie l'identité et l'organisation, et refuse une relance déjà traitée. Ces protections sont confirmées dans le code SQL distant ; la recette multi-rôle reste ouverte. Le déclencheur de synchronisation annule les relances en attente des opportunités gagnées, perdues ou archivées. Aucun changement distant n'a été effectué.


## 38. Interfaces Cheexpeer et capacités transversales — 11 novembre 2026

| ID | Priorité | Domaine | Constat confirmé dans le code Evolution-9 | Statut / suite |
|---|---|---|---|---|
| CHX-UI-01 | P1 | MajestiOS Bot | La page Assistant ouvre un guide local à mots-clés ; le moteur IA est explicitement indiqué comme non raccordé. | Capacité transparente, pas un agent IA ; spécifier le futur bot |
| CHX-ADMIN-01 | P1 | Cheexpeer Admin | Le cockpit vérifie owner/admin interne et affiche des indicateurs, mais n'est pas raccordé au cycle durable des missions et approbations. | Centre de commande métier à construire/recetter |
| CHX-SEARCH-01 | P1 | Recherche d'opportunités | La recherche BOAMP/BODACC affiche les résultats mais indique qu'ils ne sont pas enregistrés dans le CRM. | Définir import volontaire, provenance et dédoublonnage |
| CHX-SCORE-01 | P1 | Scoring | Le score opportunité est un champ manuel 0–100, sans moteur de calcul démontré. | Définir critères, pondérations et explications avant automatisation |
| CHX-REPORT-01 | P2 | Rapports | Aucun générateur général de rapports CRM/appels d'offres n'a été identifié dans le périmètre inspecté. | Définir format versionné, sources et archivage |
| CHX-AO-01 | P1 | Vulgarisation appels d'offres | La rubrique éditoriale existe ; chaîne automatisée d'analyse de pièces et de synthèse sourcée non démontrée. | Auditer dépôt, extraction, confidentialité et validation |
| CHX-REP-01 | P1 | Réputation virtuelle | Collecte identité/BODACC et analyse IA facultative ; dossier et recherches conservés en session navigateur, pas en historique CRM persistant. | Concevoir persistance et rétention sécurisées |
| CHX-REP-02 | P1 | Contexte multi-organisation | L'Edge Function refuse plusieurs appartenances par HTTP 409 ; le frontend ne propose pas encore de sélecteur explicite. | Ajouter sélection explicite et revalidation serveur |
| CHX-WORKER-01 | P0 avant activation métier | Worker | Seuls bootstrap/self-check sont exécutables ; les autres outils sont refusés faute de handler. | Maintenir fail-closed jusqu'à recette métier et sécurité |

Le détail et les limites de preuve figurent dans `AUDIT-INTERFACES-CHEEXPEER-2026-11-11.md`. Aucun outil métier n'a été activé.


## 39. Réparation du vérificateur de site — 11 novembre 2026

| ID | Priorité | Domaine | Constat | Correction / statut |
|---|---|---|---|---|
| E9-CI-02 | P1 CI | `verify-site.js` | Le script déclarait deux fois `assistantPage`, ce qui bloquait la syntaxe. Après correction, une assertion lisait `sharedNavigation` avant son initialisation, puis la vérification cherchait le gestionnaire du bouton Assistant dans `navigation-tiroirs.js` alors qu'il est dans `app.js`. | Redéclaration supprimée, assertion réordonnée puis ciblée sur `app.js`. Les étapes syntaxe, tests unitaires, build et architecture ont ensuite passé ; le dernier run observé échouait encore sur l'assertion Assistant avant son dernier ajustement. Une CI complète sur le dernier commit reste à obtenir. |

Ne pas déclarer la CI verte tant que le dernier commit Evolution-9 n'a pas terminé tous les contrôles. Les tests non exécutés après un échec précoce ne constituent pas des résultats.


## 40. Socle d'exécution Cheexpeer — écarts runtime du 11 novembre 2026

| ID | Priorité | Domaine | Constat vérifié | Action / statut |
|---|---|---|---|---|
| CHX-API-01 | P0 avant activation | API utilisateur | Pas d'endpoint utilisateur authentifié pour soumettre, approuver et consulter une mission ; les RPC sont réservées à `service_role`. | Bloquant. Créer des endpoints serveur distincts ; dériver l'acteur du JWT, jamais du client. |
| CHX-WORKER-02 | P1 | Dérive dépôt/base | MajestiOS-Test possède le socle privé mais son dernier numéro de migration est `20261109205855`; la migration `20261111160000` du tool self-check n'est pas appliquée. Le registre distant ne contient que `test_executor` désactivé. | Réconcilier migrations et objets avant déploiement coordonné ; ne pas activer ni modifier manuellement. |
| CHX-SEC-03 | P0 avant activation | Approbation | La RPC de décision vérifie le rôle de `p_decision_by`, mais ce paramètre ne prouve pas à lui seul l'identité de l'appelant. | Seule une API serveur vérifiant le JWT peut fournir l'acteur ; ne jamais exposer la RPC ni accepter l'UUID client. |

Le contrôle runtime confirme les politiques RLS de refus navigateur sur les tables privées et les grants réservés à `service_role`. Voir la section 11–13 de l'audit des interfaces.
