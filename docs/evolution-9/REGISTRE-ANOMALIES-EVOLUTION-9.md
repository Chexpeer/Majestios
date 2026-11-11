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
