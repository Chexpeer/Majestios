# Registre central des erreurs critiques et risques — MajestiOS Evolution-7

<badge>DOCUMENT DE SUIVI PRIORITAIRE</badge>

**Date :** 9 novembre 2026  
**Branche :** `Evolution-7`

> **À consulter avant toute intervention sur MajestiOS.** Ce registre doit rester visible depuis l'index général, être actualisé au fil des audits et conserver l'historique des corrections. Une synthèse stratégique ne doit jamais masquer ni supprimer une anomalie critique.

## Tableau de bord immédiat

| Niveau | Anomalies inscrites | Traitement |
|---|---:|---|
| P0 — bloquant avant ouverture | 2 | Sécurité / recette impérative avant ouverture aux membres |
| P1 — important | 9 | Correction ou vérification prioritaire |

**À traiter en premier :**
1. **AUTH-01 — OTP / espace membre (P0) :** recette réelle d'envoi, validation, expiration, limites de débit et provisionnement encore manquante.
2. **CRM-06 — import officiel (P0) :** correctif de la frontière VIP préparé et testé en CI ; migration non appliquée, recette multi-rôles obligatoire.
3. **AUTH-02 — consentement (P1) :** contrôle des métadonnées ajouté dans l'Edge Function et test de contrat ; CI à confirmer, preuve juridique forte non établie.
4. **CRM-02 — traçabilité (P1) :** correction atomique préparée et testée ; migration non appliquée, recette transactionnelle requise.
5. **CRM-03 — privilèges CRM (P1) :** restriction des colonnes préparée et testée ; privilèges distants à vérifier.
6. **CRM-04 — RPC des relances (P1) :** contrôle VIP corrigé dans le code ; migration non appliquée, recette multi-rôles requise.
7. **CRM-05 — cohérence relationnelle (P1) :** correctif préparé et testé ; doublons préexistants et migration à traiter avant clôture.
8. **CHEEXPEER-01 — accès et quotas (P1) :** contrôle d'appartenance et quota préparés/testés ; migration non appliquée, rate limit et suivi financier encore absents.
9. **CHEEXPEER-02 — identification des entreprises (P1) :** règles de rapprochement SIREN/BODACC corrigées dans le code ; recette réelle multi-entreprises requise.
10. **CHEEXPEER-03 — injection d'instructions (P1) :** garde-fous prompt ajoutés et tests automatisés passés.
11. **CHEEXPEER-04 — information des utilisateurs (P1) :** notice de transparence à compléter avant activation d'un fournisseur IA et ouverture élargie.

**Consigne aux agents :** traiter les P0 avant les P1. Après chaque découverte ou correction, préciser l'ID, le statut, les fichiers concernés, le commit, les tests exécutés et la preuve. Une modification de code seule ne suffit pas à déclarer une anomalie corrigée.

Ce document ne doit pas devenir une liste de toutes les fonctionnalités manquantes. Il distingue :
- **Anomalies / risques à traiter** : défauts constatés ou contrôles indispensables avant ouverture.
- **Évolutions produit** : capacités non encore prévues ou non développées ; elles relèvent de la feuille de route, pas d'une correction urgente.
- **Recettes à effectuer** : vérifications nécessitant un environnement réel et une autorisation.

## A. Anomalies et risques à traiter

| ID | Priorité | Domaine | Constat vérifié | Action / statut |
|---|---|---|---|---|
| CRM-06 | **P0 — privilèges / import privilégié** | L’Edge Function d’import officiel peut contourner la frontière VIP du CRM | `import-official-company/index.ts` vérifie `can_import_official_company()` avec le client utilisateur, puis écrit via `service_role`. La définition actuelle de cette fonction appelle encore `private.is_org_editor()`, qui accepte `owner/admin/member`, alors que la migration VIP `20261108181246_vip_only_crm_access.sql` réserve désormais les écritures CRM à `owner/admin`. Un membre peut donc déclencher une écriture CRM privilégiée par l’Edge Function. | **Correction préparée sur Evolution-7.** Migration `20261109194500_harden_official_import_vip_permissions.sql` remplace le contrôle par `private.is_org_admin()`, conserve `SECURITY INVOKER` et restreint l’exécution à `authenticated`. Test de contrat ajouté pour vérifier que le contrôle utilisateur précède la création du client `service_role`. Migration non appliquée ; déploiement/recette multi-rôles requis avant clôture. |
| AUTH-01 | **P0 — avant ouverture aux membres** | OTP / espace membre | Le front appelle `signInWithOtp()` et `verifyOtp()`, mais aucun test de bout en bout ne prouve l'envoi réel, la validation, l'expiration, les limites de débit et le provisionnement de l'espace. Le déploiement de `provision-client-workspace` en environnement de test n'est pas confirmé. | **À vérifier — recette E2E isolée.** Aucun changement Auth, migration, déploiement de fonction ou donnée de test dans Supabase métier sans autorisation. |
| CRM-02 | **P1 — traçabilité** | Création et modification de fiches CRM | Avant correction, `create()` n'enregistrait aucune activité ; `update()` modifiait la fiche puis tentait une seconde insertion d'activité, pouvant échouer après la modification. Les imports via `createBusiness()` étaient également concernés. | **Correction préparée sur Evolution-7 — test de contrat CRM inclus dans le workflow vert `42656483619` (run `4117`).** La migration `20261109170000_atomic_crm_activity_history.sql` ajoute un trigger SQL après insertion/modification des entreprises, contacts et opportunités ; le client ne crée plus de doublon d'historique. Cette CI ne vaut pas recette transactionnelle en environnement réel. La migration n'est pas appliquée à Supabase. Recette transactionnelle autorisée encore requise avant clôture. |
| CRM-03 | **P1 — intégrité des données** | Colonnes d’audit CRM | `20261107065916_grant_crm_record_updates.sql` réintroduit un `UPDATE` table-level sur entreprises, contacts et opportunités. La migration `20261109160000_restrict_crm_update_columns.sql` révoque ce droit puis restaure exactement les listes blanches de `20261106074500_enforce_crm_editor_roles.sql`. | **Corrigé dans Evolution-7 — à vérifier en environnement autorisé.** Migration et test de non-régression ajoutés ; workflow GitHub vert. Aucun privilège distant lu ni migration appliquée. Les champs d’audit ne sont donc pas déclarés protégés en production tant que la migration n’est pas appliquée et contrôlée. |
| CHEEXPEER-04 | **P1 — transparence / données** | Information préalable insuffisamment détaillée | La page indique que les données sont transmises au service sécurisé Cheexpeer, mais ne détaille pas encore les catégories de sources consultées, les destinataires éventuels si un fournisseur IA est activé, la durée de conservation ni le point d'accès aux informations de confidentialité. | **À compléter avant activation du fournisseur IA et ouverture élargie.** Ajouter une information claire et accessible décrivant finalités, données transmises, sources, destinataires/sous-traitants, localisation, durée de conservation, droits et contact. Ne pas afficher de promesse de traitement IA tant que le fournisseur n'est pas configuré. |
| CHEEXPEER-03 | **P1 — sécurité de l'analyse IA** | Injection d'instructions dans les champs du dossier | Les champs utilisateur `subject`, `website`, `territory`, `activity` et `objectives` étaient transmis au modèle comme données, mais le prompt système ne précisait pas explicitement qu'ils étaient non fiables et ne constituaient jamais des instructions. | **Correction préparée sur Evolution-7 — CI globale réussie, workflow `42656483619` (run `4117`).** Le prompt système précise désormais que les champs du dossier sont des données et non des instructions, et qu'une URL ne constitue pas une autorisation de navigation. Tests ajoutés avec des champs contenant des consignes simulées. Aucune navigation ni action externe n'est permise au modèle. |
| CHEEXPEER-02 | **P1 — fiabilité des analyses** | Confirmation erronée de l’identité d’une entreprise | Le connecteur identité officielle marquait `confirmed` une correspondance de nom exacte, même sans SIREN fourni. Le connecteur BODACC marquait également `confirmed` une égalité de nom normalisée. Des homonymes pouvaient ainsi être associés à tort au dossier. | **Correction préparée sur Evolution-7 — CI globale réussie** dans le workflow `42656483619` (run `4097`), incluant les tests connecteurs, analyse et navigateur ; recette réelle multi-entreprises encore requise. Le connecteur officiel exige maintenant un SIREN fourni et concordant pour `confirmed` ; nom seul = `probable`, SIREN divergent = `rejected`. BODACC lit désormais le champ `registre` : SIREN concordant = `confirmed`, divergent = `rejected`, nom seul = `probable`. Les preuves `rejected` ne peuvent plus soutenir aucun constat. Tests de contrat couvrant SIREN concordant/divergent/absent et preuve rejetée ajoutés. |
| CHEEXPEER-01 | **P1 — contrôle d’accès / coûts** | Accès à l’audit Cheexpeer | Le handler vérifiait seulement qu’un JWT Supabase correspond à un utilisateur ; aucune appartenance à `organization_members` n’était exigée. Un compte authentifié sans espace MajestiOS pouvait donc appeler directement l’endpoint et déclencher les collectes publiques, puis l’analyse IA si elle est configurée. Un quota journalier persistant est maintenant préparé ; la logique privilégiée est isolée dans le schéma `private` et exposée via un wrapper RPC `SECURITY INVOKER`. Les comptes multi-espaces sont refusés tant qu'un espace explicite n'est pas sélectionné. Une limitation de débit à court terme (rate limit) et un suivi financier par jetons restent à concevoir. La sortie du fournisseur est plafonnée à 4 096 tokens par appel. | **Contrôle d’appartenance ajouté sur Evolution-7 — CI globale réussie** dans le workflow `42656483619` ; recette réelle multi-comptes encore requise. `reputation-audit-context/index.ts` vérifie maintenant l’appartenance via le client utilisateur et RLS avant de lancer la collecte. Il refuse les comptes avec plusieurs appartenances plutôt que d'associer l'audit arbitrairement au premier espace. La logique `SECURITY DEFINER` du quota est confinée au schéma `private` ; seul un wrapper `SECURITY INVOKER` est exposé en RPC. Test de contrat ajouté et intégré au workflow. Un quota persistant est préparé dans `20261109193000_cheexpeer_reputation_audit_quotas.sql` : 5 audits par membre et par jour UTC, 25 par organisation et par jour UTC ; les compteurs détaillés sont purgés après 90 jours. Le handler échoue fermé si le contrôle de quota est indisponible. Migration non appliquée ; rate limit à court terme et suivi financier par jetons restent à concevoir. |
| CRM-05 | **P1 — intégrité relationnelle** | Cohérence des rattachements CRM et doublons SIRET | Le trigger `enforce_tenant_relationship_integrity()` vérifie l’appartenance au même tenant, mais n’impose pas que le contact principal d’une opportunité appartienne à l’entreprise liée à cette opportunité. Le schéma garantit l’unicité du SIREN par organisation, mais pas celle du SIRET. L’import contrôle les doublons avant insertion côté navigateur, contrôle exposé à une course entre deux imports simultanés. | **Correction préparée sur Evolution-7 — test de contrat CRM inclus dans le workflow vert `42656483619`.** Migration `20261109190000_enforce_crm_business_relationships.sql` : vérifie la cohérence entreprise/contact pour opportunités et activités, ajoute un index unique sur le SIRET normalisé (chiffres seuls) par organisation, ignore les valeurs vides et contrôle les doublons normalisés préexistants. Migration non appliquée à Supabase ; vérifier les doublons préexistants et effectuer une recette multi-rôles avant clôture. |
| CRM-04 | **P1 — contrôle d’accès** | RPC de traitement des relances CRM | `complete_crm_reminder()` est une fonction `SECURITY DEFINER` qui vérifie encore `private.is_org_editor()`, lequel accepte `owner`, `admin` et `member`. La migration VIP appliquée remplace les politiques des tables par une frontière `owner/admin`, mais ne remplace pas ce contrôle RPC. Un membre peut donc tenter un appel direct par identifiant de relance et contourner la restriction d’interface et les politiques RLS. | **Correction préparée sur Evolution-7 — CI verte.** Migration `20261109180000_harden_crm_reminder_vip_rpc.sql` : le RPC vérifie `private.is_org_admin()` avant toute écriture, avec test de contrat. CI réussie sur le commit `91c9d0ec991ea92dff0f78ec50526019487f0c04` (run `42656483619`). Migration non appliquée à Supabase ; recette directe multi-rôles nécessaire avant clôture. |
| AUTH-02 | **P1 — conformité / traçabilité** | Consentement lors du provisionnement | Le parcours OTP transmet les métadonnées de prise de connaissance ; l'Edge Function vérifiait initialement uniquement le booléen du corps HTTP. | **Correction ajoutée dans Evolution-7 — CI à confirmer.** Le serveur exige désormais `user.user_metadata.privacy_notice_acknowledged === true` et `privacy_notice_version === NOTICE_VERSION` avant l'appel RPC ; le test de contrat couvre les deux contrôles. Limite : les métadonnées utilisateur sont modifiables par leur propriétaire ; ce contrôle assure la cohérence du parcours, pas une preuve juridique infalsifiable du clic. Aucun déploiement Supabase effectué. |

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
| ROADMAP-11 | Cheexpeer / historique d'audit | Les dossiers et rapports ne sont conservés que dans `sessionStorage`, sans historique durable par organisation. | Concevoir une persistance multi-tenant des dossiers, preuves, analyses et journaux d'accès avec RLS, durée de conservation, export et suppression contrôlée. |
| ROADMAP-10 | Assistant conversationnel | Le chatbot présent dans `app.js` est un guide de navigation à mots-clés ; il n'est pas relié au moteur IA Cheexpeer. | Le remplacer progressivement par l'interface conversationnelle Cheexpeer, avec réponses fondées sur les capacités réellement disponibles et permissions adaptées à l'espace. |
| ROADMAP-12 | Cheexpeer / cockpit administrateur | `administration.html` et `administration.js` fournissent un cockpit de pilotage et des indicateurs, mais aucune fenêtre de dialogue direct avec Cheexpeer, aucun suivi de tâches de l'agent ni centre de validation. | Ajouter au cockpit une fenêtre de dialogue Cheexpeer, le suivi des tâches, alertes, historique, anomalies et validations ; conserver le cockpit comme centre de supervision privilégié. |
| ROADMAP-13 | Cheexpeer / quatre espaces | Les capacités sont aujourd'hui dispersées : chatbot local, audit Réputation virtuelle, CRM direct Supabase et outils GitHub externes au runtime applicatif. | Orchestrer une identité Cheexpeer unique à travers chat utilisateurs, cockpit admin, Supabase/CRM et GitHub, avec permissions, contextes et journaux distincts. |
| ROADMAP-14 | Cheexpeer / archivage et apprentissage | Les rapports d'audit restent dans `sessionStorage` ; aucun historique transversal durable et gouverné n'est démontré. | Construire archivage, historisation, recherche et capitalisation des enseignements vérifiés, avec provenance, droits, conservation et suppression contrôlée ; pas d'entraînement autonome du modèle. |
| ROADMAP-15 | Cheexpeer / optimisation ergonomique | Aucun cycle transversal de détection des frictions d'usage, proposition d'amélioration et mesure avant/après n'est démontré. | Permettre à Cheexpeer d'analyser les parcours, proposer des simplifications et vérifier les non-régressions avant validation. |
| ROADMAP-16 | Accès multi-espace / ergonomie | `espace-interne.js`, `administration.js` et le handler Réputation virtuelle refusent les comptes avec plusieurs appartenances internes au lieu de proposer un choix explicite. | Ajouter un sélecteur d'espace clair, mémoriser le dernier espace autorisé et permettre de le changer sans reconnexion ; chaque requête doit continuer à vérifier l'appartenance côté serveur. |
| ROADMAP-17 | Cheexpeer / compréhension des appels d'offres | La documentation de vision décrit l'analyse et la qualification, mais ne formalise pas assez la restitution opérationnelle destinée aux professionnels de chantier. | Produire une lecture vulgarisée et structurée des dossiers : travaux attendus, contraintes, compétences/moyens, pièces, critères, délais et points de vigilance ; citer les passages sources, distinguer obligation et interprétation, signaler les ambiguïtés et ne jamais inventer d'exigence. |
| ROADMAP-18 | Cheexpeer / veille et actualisation SEO | La doctrine SEO existe dans la référence V5, mais le cycle périodique d'audit, de priorisation, d'actualisation et de mesure n'est pas raccordé à Cheexpeer sur Evolution-7. | Mettre en place une veille périodique technique, éditoriale et d'indexation ; proposer puis réaliser les mises à jour réversibles dans un périmètre préautorisé ; mesurer les effets et demander validation avant publication sensible ou changement de production. |
| ROADMAP-19 | Cheexpeer / centre de commande confidentiel | Le cockpit VIP vérifie la session et le rôle, mais ne comporte ni chat Cheexpeer, ni historique persistant, ni dépôt de captures ; aucun stockage privé dédié aux échanges admin n'a été identifié dans les éléments audités. Le dossier Réputation virtuelle utilise seulement `sessionStorage`. | Concevoir les fils/messages et pièces jointes isolés par administrateur et organisation, stockage privé, RLS et contrôles serveur, liens signés, rétention/suppression, historique des tâches et mémoire métier uniquement après validation. Ne pas recevoir de captures confidentielles avant recette de ces protections. |
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

**Correction ajoutée dans Evolution-7 :** `supabase/functions/provision-client-workspace/index.ts` vérifie maintenant, avant tout appel RPC, que le parcours est une inscription, que le booléen de requête est vrai, que `user.user_metadata.privacy_notice_acknowledged === true` et que `user.user_metadata.privacy_notice_version === NOTICE_VERSION`. Le test de contrat `tests/crm-security-contract.test.cjs` vérifie la présence de ces deux contrôles serveur.

**Limite importante :** les métadonnées utilisateur Supabase peuvent être modifiées par le propriétaire du compte. Cette vérification ferme le contournement trivial par appel direct de l'Edge Function sans métadonnées cohérentes ; elle ne constitue pas, à elle seule, une preuve juridique infalsifiable du clic. Une preuve plus forte nécessiterait un flux de consentement serveur dédié et horodaté. Aucun déploiement, changement Auth distant, migration ou écriture dans le projet Supabase n'a été effectué. La CI doit confirmer le test après cette correction.

## G. Détail du risque CRM-03 — privilèges de colonnes

La migration historique `20261107065916_grant_crm_record_updates.sql` réintroduit un droit `UPDATE` au niveau table sur `businesses`, `contacts` et `opportunities`. La migration `20261109160000_restrict_crm_update_columns.sql` révoque ce droit global puis réaccorde les seules colonnes métier autorisées.

**Correction préparée dans Evolution-7 — CI verte** (`42656483619`, run `4117`). La migration n'a pas été appliquée à Supabase et les privilèges distants n'ont pas été lus. Statut : corrigé dans le code, validation distante requise.

## H. Vérification du lot Cheexpeer — intégration au parcours membre

Le parcours Réputation virtuelle appelle l'Edge Function authentifiée `reputation-audit-context`. Le serveur vérifie l'appartenance à un espace MajestiOS ; les comptes associés à plusieurs espaces sont refusés (`409`) tant qu'un sélecteur explicite n'existe pas. Le moteur collecte l'identité officielle et le contexte BODACC. L'analyse IA n'est possible que si un fournisseur est configuré côté serveur ; aucun fournisseur, modèle ou secret n'a été choisi ou configuré.

Le quota est préparé dans `20261109193000_cheexpeer_reputation_audit_quotas.sql` : 5 audits par membre et 25 par organisation, par jour UTC ; compteurs détaillés purgés après 90 jours. La logique privilégiée est confinée au schéma `private`, avec wrapper RPC `SECURITY INVOKER`. La sortie fournisseur est plafonnée à 4 096 tokens. La migration n'est pas appliquée.

Le workflow `42656483619` (run `4117`, commit `08eab8dec239f4b5abfd7d1806adc6df25a38561`) est vert. Cela valide les tests automatisés du dépôt, pas le déploiement Supabase ni une recette réelle. Les dossiers et rapports restent dans `sessionStorage`, sans historique durable par organisation ni écriture CRM.

Détails : [Lot Cheexpeer — raccordement du parcours d'audit](LOT-CHEXPEER-INTEGRATION-2026-11-09.md).

## I. Détail du risque CRM-02 — historique atomique

Avant correction, la création d'une entreprise, d'un contact ou d'une opportunité ne produisait pas automatiquement d'activité ; la modification de la fiche et l'insertion de son historique étaient deux requêtes distinctes.

**Correction préparée dans Evolution-7 :** la migration `20261109170000_atomic_crm_activity_history.sql` ajoute des triggers après insertion/modification sur `businesses`, `contacts` et `opportunities`. L'activité est écrite dans la même transaction que la fiche. Le client ne crée plus une seconde activité lors d'une modification et vérifie celle générée par le trigger.

**CI verte** dans le workflow `42656483619` (run `4117`). La migration n'est pas appliquée à Supabase. Une recette transactionnelle reste nécessaire pour vérifier création, modification, rollback si la journalisation échoue et absence de doublon.

## J. Détail du risque CRM-04 — contrôle du RPC de relance

La migration `20261106120000_complete_crm_reminder_with_activity.sql` crée `public.complete_crm_reminder(uuid)` en `SECURITY DEFINER`. Son contrôle historique utilise `private.is_org_editor()`, qui autorise les rôles `owner`, `admin` et `member`. La migration `20261108181246_vip_only_crm_access.sql`, indiquée comme appliquée, a ensuite restreint les politiques des tables CRM aux rôles `owner/admin`, sans redéfinir ce RPC. Or une fonction `SECURITY DEFINER` effectue ses écritures avec les privilèges de son propriétaire ; les politiques RLS ne constituent donc pas une protection suffisante si le contrôle interne du RPC reste plus permissif.

**Correction préparée dans Evolution-7 :** la migration `20261109180000_harden_crm_reminder_vip_rpc.sql` remplace le contrôle par `private.is_org_admin(v_reminder.organization_id)`, cohérent avec la frontière VIP des tables, et refuse aussi une relance dont l'opportunité associée est absente. Le test de contrat vérifie explicitement l'absence de l'ancien contrôle permissif.

**Limite de validation :** aucune migration n'a été appliquée à Supabase. Après CI, une recette autorisée doit tenter le RPC avec un rôle `member` puis `owner/admin` et vérifier le refus/acceptation, ainsi que l'absence de modification de la relance et d'insertion d'activité lors du refus. Ne pas déclarer le risque corrigé en environnement réel avant cette preuve.

## K. Détail du risque CRM-05 — cohérence des relations et unicité SIRET

La migration historique vérifiait le rattachement au même tenant, mais pas toujours la concordance entre l'entreprise d'une opportunité et celle de son contact principal. Le schéma initial ne garantissait pas l'unicité du SIRET normalisé par organisation ; le contrôle navigateur seul était exposé aux imports concurrents.

**Correction préparée dans Evolution-7 :** `20261109190000_enforce_crm_business_relationships.sql` vérifie la cohérence des rattachements et ajoute un index unique partiel sur le SIRET normalisé par organisation. La migration interrompt son exécution si des doublons préexistants sont détectés.

**CI verte** dans le workflow `42656483619` (run `4117`). Migration non appliquée ; les doublons éventuels doivent être traités manuellement avant application, puis les relations et imports concurrents doivent être testés en environnement autorisé.

## L. Détail du risque CHEEXPEER-01 — accès à l'audit et maîtrise des coûts

L'endpoint vérifie désormais le JWT et l'appartenance à `organization_members` avec le client utilisateur et les politiques RLS. Si le compte a plusieurs appartenances, le serveur refuse de choisir arbitrairement un espace et retourne `409` ; un sélecteur explicite reste à construire.

Le quota préparé dans `20261109193000_cheexpeer_reputation_audit_quotas.sql` applique 5 audits par membre et 25 par organisation, par jour UTC. La purge des compteurs détaillés est prévue après 90 jours. La fonction privilégiée réside dans le schéma `private` et le wrapper public est `SECURITY INVOKER`. Le handler échoue fermé si le contrôle de quota est indisponible ; la sortie IA est plafonnée à 4 096 tokens.

**CI verte** dans le workflow `42656483619` (run `4117`). Migration non appliquée, aucun test réel multi-comptes, aucun rate limit court terme ni suivi financier effectif des coûts/tokens. Ces points restent ouverts avant activation d'un fournisseur IA en production.

## M. Détail du risque CHEEXPEER-02 — homonymie et fausse confirmation d'identité

Avant correction, une égalité de nom pouvait être présentée comme une identité confirmée, aussi bien dans le référentiel officiel que dans BODACC. Des homonymes pouvaient donc être rapprochés à tort.

**Correction préparée dans Evolution-7 :** le référentiel officiel exige un SIREN fourni et concordant pour le statut `confirmed` ; un nom seul vaut `probable`, un SIREN divergent vaut `rejected`. BODACC utilise le champ `registre` : SIREN concordant = `confirmed`, divergent = `rejected`, nom seul = `probable`. Les preuves rejetées ne peuvent pas soutenir un constat.

**CI verte** dans le workflow `42656483619` (run `4117`). La recette réelle sur plusieurs entreprises et homonymes reste à effectuer.

## N. Détail du risque CRM-06 — import officiel et frontière VIP

L'Edge Function `import-official-company/index.ts` vérifie le droit d'import avec le client utilisateur, puis effectue l'écriture au moyen de `service_role`. La définition historique de `can_import_official_company()` utilisait `private.is_org_editor()`, qui inclut le rôle `member`, alors que la frontière VIP des écritures CRM est désormais réservée à `owner/admin`. Cette divergence permettait à un membre d'atteindre une écriture privilégiée via l'Edge Function.

**Correction préparée dans Evolution-7 :** la migration `20261109194500_harden_official_import_vip_permissions.sql` remplace le contrôle par `private.is_org_admin()`, conserve `SECURITY INVOKER` et réserve l'exécution à `authenticated`. Le test de contrat vérifie que le contrôle avec le client utilisateur intervient avant la création du client `service_role`.

**CI verte** dans le workflow `42656483619` (run `4117`). La migration n'est pas appliquée à Supabase ; un test réel avec rôles `member`, `owner` et `admin` reste obligatoire avant clôture.


## ROADMAP-20 — Écosystème de veille outillée et archives Google Workspace

**Nature : évolution stratégique structurante — non développée.**

- **Objectif :** permettre à Cheexpeer d'orchestrer des sources officielles, API, flux, collecte web autorisée, utilitaires d'extraction et Google Workspace/Drive pour produire une veille sourcée, historisée et exploitable par MajestiOS.
- **État vérifié :** aucun connecteur Google Drive/Workspace ni orchestrateur de scraping général n'a été identifié dans le runtime audité. Instant Data Scraper est à considérer comme utilitaire ponctuel assisté, pas comme connecteur serveur récurrent.
- **Prérequis :** modèle de droits par organisation, OAuth à portée minimale, stockage serveur des secrets, registre des sources/licences, traçabilité des collectes, déduplication, limites de débit, rétention/suppression et séparation stricte des archives administrateur et du chat utilisateur.
- **Règle :** ne pas contourner authentification, CAPTCHA, paywall ou restrictions ; distinguer faits, inférences et recommandations ; toute action externe sensible reste soumise à validation.
- **Étapes :** cartographie RLS/Storage → modèle conversations et pièces jointes → tests d'isolation → centre de commande → Drive en environnement de test → connecteurs de veille progressifs.
- **Statut :** conception documentée dans la section 9 du lot Cheexpeer ; aucun connecteur activé, aucune migration distante, aucun déploiement.


## SEC-04 — Préparer et vérifier le stockage confidentiel Cheexpeer

**Type :** prérequis sécurité avant développement du centre de commande — non résolu, non incident avéré.

- **Constat :** aucune migration bucket privé/politique `storage.objects` ni configuration Storage n'a été identifiée dans le dépôt Evolution-7.
- **Risque :** impossible de garantir le cloisonnement et la confidentialité des captures/archives tant que bucket, RLS Storage, liens temporaires, rétention et suppression ne sont pas conçus et testés.
- **Action :** spécifier le stockage privé tenant-scoped ; tester les accès anon, viewer/member, autre organisation et admin autorisé ; vérifier expiration/révocation des liens et suppression.
- **Dépendance :** ne pas accepter de captures confidentielles dans le centre de commande avant validation de ces tests.
- **État :** documenté dans la section 10 du lot Cheexpeer ; aucun bucket créé et aucune migration distante appliquée.

## SEC-05 — Vérifier la frontière d'autorisation de l'import entreprise privilégié

**Type :** durcissement d'un flux existant utilisant `service_role` — vérification requise avant extension.

- **Constat :** la fonction Edge `import-official-company` valide l'utilisateur, appelle `can_import_official_company`, puis utilise `service_role` pour l'écriture. La migration versionnée aligne le RPC sur owner/admin en `security invoker`, mais son application sur la base cible n'est pas confirmée.
- **Écarts constatés dans le code :** message utilisateur mentionnant encore « éditeur » ; détails techniques RPC/catch renvoyés dans la réponse ; CORS générique `*`.
- **Action :** vérifier l'état distant avant toute activation ; durcir CORS, supprimer les détails techniques des réponses, aligner le message owner/admin et ajouter tests member/viewer, autre tenant, RPC direct et import autorisé.
- **Qualification :** risque à contrôler, pas de contournement ni fuite avérée démontrés.
- **État :** audit documenté ; aucun changement de fonction Edge ni de base distante dans ce lot.
