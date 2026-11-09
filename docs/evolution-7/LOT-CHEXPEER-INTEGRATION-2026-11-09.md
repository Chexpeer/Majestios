# Lot Cheexpeer — raccordement du parcours d’audit — 9 novembre 2026

**Branche :** `Evolution-7`  
**Périmètre :** code GitHub uniquement. Aucun déploiement Supabase, aucune configuration distante et aucune clé fournisseur ajoutée.

## 1. Résultat du lot

Le parcours de la page Réputation virtuelle est maintenant raccordé au handler Edge Function authentifié :

1. Le membre prépare le dossier entreprise dans la page.
2. Le bouton « Lancer l’audit Cheexpeer » devient actif.
3. Le navigateur vérifie la session Supabase et appelle `reputation-audit-context`.
4. L’Edge Function authentifie le JWT avec `auth.getUser(token)`.
5. Le serveur authentifie le JWT et vérifie l’appartenance à un espace MajestiOS via `organization_members` et les politiques RLS. Si plusieurs espaces sont associés au compte, l’audit est refusé (`409`) plutôt que de choisir arbitrairement le premier.
6. Le serveur collecte le contexte d’identité d’entreprise et les annonces BODACC.
7. Si le fournisseur IA est configuré côté serveur, le handler transmet les seules preuves collectées au module Cheexpeer.
8. Le module valide le schéma, les références de preuves et les liens entre constats et recommandations.
9. Le navigateur affiche les éléments, les constats, les recommandations et les lacunes avec insertion DOM en texte, sans interpréter les réponses comme du HTML.

## 2. Fichiers modifiés ou ajoutés

- `reputation-virtuelle.html` : module ES, champ SIREN facultatif, bouton de lancement et information sur la transmission au service.
- `reputation-virtuelle.js` : client Supabase, appel authentifié, restitution du rapport et activation conditionnelle du bouton.
- `supabase/functions/_shared/reputation-audit-handler.mjs` : orchestration collection → analyse optionnelle → DTO de restitution.
- `supabase/functions/_shared/reputation-audit-provider.mjs` : nouvel adaptateur serveur pour API compatible Chat Completions et JSON Schema strict.
- `supabase/functions/reputation-audit-context/index.ts` : lecture des variables d’environnement IA, contrôle d'appartenance et consommation du quota par RPC avec le client utilisateur.
- `supabase/migrations/20261109193000_cheexpeer_reputation_audit_quotas.sql` : quota atomique de 5 audits par membre et 25 par organisation, par jour UTC ; compteurs détaillés purgés après 90 jours ; logique privilégiée isolée dans `private`, avec wrapper RPC `SECURITY INVOKER` ; migration non appliquée.
- `tests/reputation-audit-access-contract.test.mjs` : test du contrôle d'appartenance serveur.\n- `tests/reputation-audit-connectors.test.mjs` et `tests/reputation-audit-analysis.test.mjs` : tests de rapprochement SIREN et de résistance aux instructions présentes dans les preuves.
- `tests/reputation-audit-handler.test.mjs` : cas analyse active et cas fournisseur absent.
- `tests/reputation-audit-provider.test.mjs` : authentification fournisseur, JSON Schema strict, erreurs et endpoint HTTPS.
- `tests/reputation-virtuelle.browser.cjs` : mock du SDK Supabase et tests d’état du bouton.
- `.github/workflows/verify-site.yml` : contrôles de syntaxe et tests fournisseur.

## 3. Configuration requise avant une analyse IA réelle

Variables d’environnement à définir comme secrets de l’Edge Function, jamais dans les fichiers publics :

- `CHEEXPEER_AI_API_KEY` : clé privée du fournisseur compatible.
- `CHEEXPEER_AI_MODEL` : identifiant exact d’un modèle prenant en charge la sortie JSON Schema stricte.
- `CHEEXPEER_AI_BASE_URL` : facultatif ; URL HTTPS du endpoint compatible. Par défaut, endpoint OpenAI Chat Completions.

Aucun fournisseur ni modèle n’a été activé par ce lot. En leur absence, la fonction retourne explicitement `collection_only`, avec les preuves et un message indiquant que l’analyse IA n’est pas configurée. Elle ne simule pas un rapport.

Le choix du fournisseur, du modèle, du budget, de la politique de conservation et des modalités contractuelles reste à valider avant configuration. La clé API ne doit jamais être placée dans `supabase-config.js`, dans un script navigateur ou dans le dépôt.

## 4. Limites fonctionnelles actuelles

- La collecte reste limitée aux connecteurs d’identité officielle et BODACC déjà présents.
- Il ne s’agit pas encore d’une couverture automatisée exhaustive de Google Web, Google Maps, des avis, des réseaux sociaux ou des sites concurrents.
- Le dossier est conservé dans `sessionStorage` ; aucun rapport durable ni historique par organisation n’est créé. Le CRM n’est pas encore alimenté par les audits : aucune fiche entreprise, activité ou opportunité n’est créée automatiquement.
- L’accès est authentifié par session Supabase ; un seul espace associé est accepté pour le moment, et les comptes multi-espaces reçoivent un refus explicite en attendant un sélecteur. Le quota journalier est préparé en SQL ; la migration n'est pas appliquée. Le stockage multi-tenant des dossiers/rapports, le rate limit à court terme, le suivi financier par jetons et la traçabilité durable des audits restent à construire.
- L’analyse, si configurée, est préparatoire et doit être validée humainement. Aucun score global ni action externe automatique n’est autorisé.
- Le fournisseur doit réellement prendre en charge le format strict demandé ; les incompatibilités remontent une erreur contrôlée et aucun rapport n’est produit.

## 5. Contrôles et recette

Tests ajoutés au workflow :

- analyse Cheexpeer active et absence de fournisseur ;
- adaptateur IA : secret côté serveur, schéma strict, endpoint HTTPS, réponses et erreurs ;
- interface : bouton actif après préparation du dossier et inactif après réinitialisation ;
- vérification de syntaxe du module navigateur, de l’adaptateur et des tests.

**Statut vérifié :** le workflow GitHub `42656483619` (run `4117`, commit `08eab8dec239f4b5abfd7d1806adc6df25a38561`) est terminé avec succès. Il couvre la syntaxe, les tests unitaires Cheexpeer, le contrôle d'appartenance, le quota persistant, les connecteurs, l'analyse et le parcours navigateur de Réputation virtuelle. Le workflow lancé après les mises à jour documentaires est encore en cours au moment de cette mise à jour. Cela valide les tests automatisés du dépôt, pas le déploiement ni la recette multi-comptes dans l'environnement Supabase réel. Aucun appel au fournisseur IA, aucune migration, aucun déploiement Edge Function et aucune modification du projet Supabase hébergé n’ont été réalisés.

## 6. Prochaine étape contrôlée

1. Choisir le fournisseur et le modèle compatibles avec JSON Schema strict.
2. Vérifier coûts, conditions d’utilisation, localisation et conservation des données, et exigences de confidentialité.
3. Définir les secrets dans l’environnement de test Supabase autorisé.
4. Déployer uniquement dans cet environnement après autorisation explicite.
5. Exécuter une recette avec compte membre de test, SIREN de test et preuves vérifiables ; vérifier les erreurs, les limites de débit et la restitution.
6. Définir ensuite le modèle de persistance des dossiers et rapports par organisation, avec RLS et durée de conservation.
7. Ajouter un sélecteur d’espace pour les comptes multi-organisations, puis un raccordement CRM explicite (fiche entreprise, preuves sourcées, activité d’audit, statut de validation) sans écriture automatique non validée.

**Ne pas annoncer « audit automatique opérationnel » avant la configuration du fournisseur, le déploiement et la recette réelle.**


## 7. Cartographie réelle des connexions de Cheexpeer

L'audit du code de la branche distingue l'interface, les services métier et l'agent. Ils ne doivent pas être confondus.

| Domaine | État réellement observé | Conclusion |
|---|---|---|
| Chatbot global | `app.js` contient une liste locale de mots-clés, de réponses et de liens. Il indique que le moteur IA sera connecté ultérieurement. | Guide de navigation uniquement ; ce chatbot n'est pas encore Cheexpeer génératif. |
| Réputation virtuelle | La page appelle `reputation-audit-context` avec la session du membre. L'Edge Function collecte l'identité officielle et les annonces BODACC ; l'analyse IA est optionnelle et dépend de secrets serveur non configurés dans ce lot. | Première capacité serveur de Cheexpeer, limitée à ce parcours. |
| Prospection | `prospection-search-member` est un service autonome avec authentification et contrôle d'appartenance à un espace client. Il recherche des entreprises officielles et renvoie des résultats. | Service métier existant, mais aucune orchestration Cheexpeer ni écriture CRM observée. |
| CRM | `crm-client.js` utilise directement Supabase pour les données CRM et les règles VIP. Aucun appel à Cheexpeer ni outil CRM dédié à l'agent n'a été trouvé dans le client CRM audité. | Cheexpeer n'est pas encore raccordé au CRM. |
| GitHub | Aucun connecteur GitHub ni secret d'accès dépôt n'a été trouvé dans le runtime applicatif audité. | GitHub n'est pas une connexion de l'agent dans le produit. L'accès GitHub utilisé pendant cet audit est un outil de développement distinct. |

### Architecture cible — un agent, quatre espaces

Cheexpeer conserve une identité unique et intervient dans quatre espaces complémentaires :

1. **Chat utilisateurs** — assistance et échanges avec les utilisateurs de MajestiOS, selon leurs droits et les fonctionnalités réellement disponibles.
2. **Tableau de bord admin** — poste de supervision privilégié : l'administrateur dialogue directement avec Cheexpeer, lui confie des tâches, suit leur avancement, consulte les alertes, l'historique et les anomalies, puis valide les actions qui le nécessitent. Le cockpit actuel (`administration.html` / `administration.js`) est un tableau de bord de pilotage, mais ne contient pas encore de fenêtre de dialogue Cheexpeer.
3. **Supabase / CRM** — consultation et opérations métier limitées à l'organisation et au rôle autorisés. Les écritures sont préparées puis exécutées selon des règles de validation adaptées.
4. **GitHub / développement** — audit du dépôt, suivi des anomalies, tests, propositions de correction sur branche de travail et mise à jour documentaire. Aucun merge, déploiement ou changement de production sans autorisation explicite.

Le cockpit admin est le centre de supervision de l'agent, pas un accès universel. Les quatre espaces partagent une orchestration et une capitalisation gouvernée, mais chaque connecteur conserve ses permissions, son contexte, ses journaux et ses limites. Aucun secret privilégié ne doit être transmis au modèle.

### Archivage, historisation et amélioration continue

Cheexpeer doit progressivement :
- archiver les échanges, dossiers, décisions, preuves, anomalies, corrections et résultats de tests ;
- historiser les actions avec date, auteur/agent, source, motif, statut et preuve ;
- retrouver les informations utiles et signaler les contradictions ;
- capitaliser les enseignements vérifiés et les retours autorisés ;
- détecter les anomalies et préparer des corrections réversibles ;
- analyser les frictions d'usage, proposer des simplifications ergonomiques et vérifier les non-régressions.

L'apprentissage désigne une capitalisation contrôlée des informations autorisées, pas un entraînement autonome du modèle, une modification autonome de ses règles ou un droit de publier/déployer sans validation.

### Priorités de réalisation

1. Stabiliser les parcours CRM et l'accès multi-espace avec un sélecteur simple plutôt qu'un refus systématique lorsqu'un compte possède plusieurs appartenances.
2. Construire le point d'entrée conversationnel Cheexpeer dans le cockpit admin, avec suivi des tâches, alertes, historique et validations.
3. Raccorder le chat utilisateurs à la même identité Cheexpeer, avec contexte et droits propres.
4. Ouvrir les outils CRM en lecture contrôlée, puis les actions métier validées.
5. Ouvrir le connecteur GitHub en lecture sur les dépôts/branches autorisés, puis les propositions de correction sur branche.
6. Mettre en place archivage, historisation, recherche et capitalisation communes, avec règles de conservation et cloisonnement.
7. Ajouter la boucle d'amélioration ergonomique fondée sur les retours, mesures et tests.

### État réel et décision

L'audit confirme que le chatbot global actuel est un guide à mots-clés, que le cockpit admin actuel ne comporte pas de dialogue Cheexpeer, que le CRM utilise directement Supabase sans outil Cheexpeer dédié et qu'aucun connecteur GitHub Cheexpeer n'est intégré au runtime applicatif. Le parcours Réputation virtuelle constitue la première capacité serveur limitée de l'agent, avec fournisseur IA non configuré dans ce lot.

L'architecture cible est donc **un Cheexpeer unique à quatre espaces**. Cette décision est actée dans la documentation ; elle ne signifie pas que les quatre connexions sont déjà opérationnelles.


## 8. Audit du centre de commande confidentiel — 9 novembre 2026

### Constat vérifié sur Evolution-7

- `administration.html` et `administration.js` présentent une cabine VIP avec vérification de session, appartenance à l'organisation interne et rôle `owner/admin`. L'écran affiche le catalogue des sources et des indicateurs ; il ne contient ni conversation Cheexpeer, ni historique de fils, ni formulaire de dépôt de capture.
- Les requêtes CRM du cockpit restent soumises aux politiques RLS. La migration VIP réserve la lecture et les écritures des fiches CRM aux rôles `owner/admin`. Le contrôle d'affichage dans le navigateur ne doit jamais être considéré comme une protection suffisante pour une future API ou action privilégiée.
- Aucun stockage de conversations, de messages, de pièces jointes ou de mémoire privée du cockpit n'a été identifié dans les fichiers d'interface et migrations examinés pour ce lot. Aucun parcours d'upload de capture n'est présent dans le cockpit.
- Le dossier de Réputation virtuelle et son journal de recherche utilisent `sessionStorage` (`majestios.reputation.auditDossier.v1`, `majestios.reputation.searchLog.v1`). Ce mécanisme est limité à la session du navigateur : il ne constitue ni une archive durable, ni une mémoire centrale, ni un stockage confidentiel administré. Le lot Cheexpeer précise déjà qu'aucun historique durable par organisation n'est créé.
- La première Edge Function Cheexpeer ne traite que des données d'identité officielle et des annonces BODACC. Le fournisseur IA reste optionnel et non configuré dans l'état documenté ; ce parcours ne fournit pas le chat privé attendu.

### Exigences obligatoires avant d'activer le centre de commande

1. **Identité et cloisonnement** : chaque fil, message, capture, tâche et élément de mémoire doit être lié à l'utilisateur administrateur et à l'organisation interne. Autorisation contrôlée côté serveur à chaque lecture, écriture, téléchargement et action ; aucune confiance dans un simple masquage d'interface.
2. **Captures et documents** : stockage privé non accessible publiquement, contrôle du type réel et de la taille, noms de fichiers neutralisés, liens signés à durée courte, accès journalisé et suppression selon une durée de conservation définie. Les captures ne doivent jamais être copiées vers le chat utilisateur ou un espace client.
3. **Conversations et reprise** : fils persistants, historique daté, statut des tâches, reprise de conversation et recherche réservée aux personnes habilitées. Les messages bruts et pièces jointes restent distincts des connaissances durables.
4. **Mémoire métier validée** : consignes et préférences ne deviennent réutilisables que lorsqu'elles sont explicitement validées ; conserver auteur, date, portée, version et possibilité de correction ou retrait. Aucune ingestion automatique de captures ou de conversations privées dans le contexte des utilisateurs.
5. **Actions et CRM** : Cheexpeer consulte uniquement les données nécessaires ; les permissions sont vérifiées à nouveau côté serveur. Toute modification CRM, export, contact externe, publication ou action irréversible suit une validation adaptée et laisse une trace.
6. **Confidentialité opérationnelle** : ne pas exposer le contenu sensible dans les journaux techniques, erreurs ou métriques ; prévoir une politique de rétention et de suppression des conversations, fichiers et sauvegardes, ainsi qu'une procédure d'incident.

### Décision d'audit

Le centre de commande confidentiel est une **évolution structurante non développée**, et non une anomalie de sécurité d'un chat existant : aucun chat admin ni stockage de capture n'est actuellement offert dans le cockpit. Ne pas ouvrir de dépôt de captures ou de conversations réelles avant réalisation et tests des protections ci-dessus. La priorité suivante est de concevoir le modèle de données privé, le stockage, les politiques RLS et les contrats d'API avant l'interface de chat.


## 9. Architecture cible — centre de commande, archives et veille outillée

**Statut : conception issue de l'audit du 9 novembre 2026 ; aucune intégration externe activée.**

### 9.1 Principe directeur

MajestiOS et Cheexpeer forment un binôme technico-commercial, scientifique et économique. MajestiOS porte les espaces métier, les données et les parcours utilisateurs ; Cheexpeer est l'agent transversal qui recherche, collecte, rapproche, analyse, alerte et prépare les actions. Il doit pouvoir sélectionner le meilleur outil adapté à une mission, sans dépendance exclusive à un fournisseur.

Le boss fixe le cap. Cheexpeer agit avec initiative, mais signale les contradictions, erreurs, incertitudes et risques ; il ne suit jamais aveuglément une consigne manifestement erronée ou contraire aux autorisations, à l'éthique ou à la réglementation.

### 9.2 Quatre espaces d'interaction, un agent transversal

1. Chat utilisateurs MajestiOS : assistance et fonctions autorisées, sans accès aux conversations ni archives administrateur.
2. Outils métier CRM/Supabase : données structurées, activités, opportunités et actions selon les rôles et les droits serveur.
3. Espace technique GitHub : audit, tests, corrections et suivi des changements sur les branches autorisées.
4. Centre de commande administrateur : dialogue privé, consignes, captures, historique des tâches, alertes, validations et mémoire métier explicitement approuvée.

### 9.3 Google Workspace / Drive

Google Drive est envisagé comme dépôt d'archives confidentielles : dossiers d'audit, pièces sources, rapports, synthèses, exports autorisés et historique documentaire. L'intégration devra utiliser OAuth et les autorisations minimales nécessaires, limiter le périmètre aux dossiers explicitement autorisés, journaliser les accès et prévoir révocation, rétention et suppression.

La base MajestiOS conserve les métadonnées nécessaires (organisation propriétaire, auteur, catégorie, source, date, statut de confidentialité, identifiant Drive, version, durée de conservation) et les liens de référence ; elle ne doit pas recopier les contenus confidentiels dans les tables métier par défaut. Les identifiants OAuth et jetons de rafraîchissement restent côté serveur dans un stockage de secrets adapté, jamais dans le navigateur ni le dépôt. Les contenus du centre de commande ne sont jamais réutilisés dans le chat utilisateur.

### 9.4 Veille, scraping et connecteurs

Cheexpeer doit pouvoir combiner API officielles, jeux de données ouverts, flux, pages web accessibles, outils de navigation et utilitaires d'extraction. Instant Data Scraper peut servir d'outil ponctuel d'extraction assistée par un opérateur ; ce n'est pas, à lui seul, un connecteur serveur durable ni une garantie d'automatisation planifiée. Pour une veille récurrente, privilégier les API/flux officiels et des collecteurs contrôlés ; utiliser l'automatisation de navigateur lorsque nécessaire et autorisée.

Chaque collecte doit conserver la source exacte, l'URL, la date/heure d'observation, la date de publication lorsqu'elle existe, la méthode, la licence/conditions d'utilisation, les champs extraits et le niveau de confiance. Respecter les conditions d'accès, les droits de réutilisation, le RGPD et les restrictions techniques ; ne pas contourner authentification, CAPTCHA, paywall ou mesures de sécurité. Prévoir limitation de débit, déduplication, détection des changements, journal d'exécution et mécanisme d'arrêt.

### 9.5 Chaîne de traitement commune

Collecter → vérifier la provenance et la qualité → normaliser/dédupliquer → rapprocher les entités → analyser et qualifier → archiver les preuves → présenter les résultats et incertitudes → proposer une action → obtenir l'approbation requise → exécuter dans le périmètre autorisé → historiser le résultat.

Les faits sourcés, les inférences et les recommandations doivent rester distingués. Une donnée collectée n'est pas automatiquement une vérité, une qualification CRM ni une autorisation de contacter un tiers.

### 9.6 Séparation des données et contrôles

- Conversations privées, fichiers confidentiels, mémoire métier validée, données CRM et données publiques collectées sont des catégories distinctes.
- Chaque ressource privée est cloisonnée par organisation et utilisateur habilité ; contrôle côté serveur à chaque lecture, écriture, téléchargement et action.
- Les fichiers sensibles sont stockés dans un bucket privé ou un Drive restreint, avec liens temporaires, contrôle du type réel, taille maximale, antivirus/inspection lorsque disponible, journalisation et suppression vérifiable.
- La mémoire durable n'est alimentée qu'après validation explicite ; chaque élément conserve auteur, date, portée, version et possibilité de retrait.
- Les actions externes, publications, démarchages, exports massifs, dépenses, suppressions et changements de droits requièrent une approbation adaptée.
- Ne jamais exposer contenu confidentiel, jetons, secrets ou données personnelles dans les journaux techniques, prompts non nécessaires ou métriques.

### 9.7 Séquence de réalisation

1. Terminer la cartographie des helpers d'autorisation, tables, politiques RLS, triggers, Storage et conventions de migration existantes.
2. Établir un modèle de données minimal pour fils/messages, tâches/approbations, références documentaires et mémoire validée ; définir les tests d'isolation multi-tenant avant toute migration.
3. Concevoir l'API serveur et le stockage privé des pièces jointes ; tester les accès autorisés/refusés et la suppression.
4. Réaliser l'interface du centre de commande et son journal d'activité.
5. Connecter Google Workspace en environnement de test, avec OAuth à portée limitée et dossier de test dédié.
6. Ajouter les connecteurs de veille par source, en privilégiant API et données ouvertes ; encadrer les collectes web assistées.
7. Étendre progressivement les missions de Cheexpeer (dont analyse des appels d'offres en langage de chantier et veille SEO périodique), avec validation et mesure des résultats.

**Limite de l'audit à cette date :** les migrations examinées montrent des contrôles CRM VIP, des helpers privés et un quota Cheexpeer préparé, mais ne suffisent pas à certifier l'ensemble du schéma de production ni les politiques Storage. Aucune migration ou configuration distante n'est autorisée par cette note.


## 10. Audit complémentaire — autorisations, cloisonnement et Storage

**Périmètre :** migrations versionnées sur Evolution-7, fonctions Edge et configuration Supabase du dépôt. Il s'agit d'une analyse du code versionné, pas d'une inspection de la base distante.

### 10.1 Socle multi-tenant confirmé dans le dépôt

- La migration fondatrice crée les organisations, membres, profils et tables CRM ; RLS est activé sur les tables métier listées.
- Les fonctions d'autorisation ont été déplacées vers le schéma `private`, dont l'usage est accordé aux utilisateurs authentifiés ; la configuration API locale n'expose que `public` et `graphql_public`.
- Les politiques VIP versionnées réservent la lecture et l'écriture des entreprises, contacts, opportunités, activités et relances aux rôles `owner/admin`. Les membres ordinaires ne doivent pas être assimilés à des administrateurs.
- Les tables de consentement sont fermées aux accès directs anon/authenticated dans les migrations consultées ; elles doivent rester alimentées côté serveur.
- Le registre des sources et le référentiel officiel sont volontairement lisibles par les utilisateurs authentifiés : ces données ne constituent pas des archives privées.

### 10.2 Constat Storage : aucun socle de fichiers confidentiels identifié

La recherche dans le dépôt Evolution-7 n'a trouvé ni migration créant un bucket privé, ni politique `storage.objects`, ni configuration de bucket pour les archives Cheexpeer. Aucun stockage de pièces jointes du centre de commande n'est donc démontré. Ce constat signifie « non implémenté dans le code audité », et non « fuite de fichiers existants ».

Avant tout upload confidentiel, il faudra définir bucket privé, chemins tenant-scoped, RLS Storage, limites de taille, validation du type réel, contrôle antivirus/inspection, liens signés courts, suppression, rétention, sauvegardes et tests d'accès croisés. Les URLs publiques sont exclues pour ces documents.

### 10.3 Frontière de sécurité de l'import officiel utilisant service_role

La fonction `import-official-company` vérifie le jeton utilisateur puis appelle `can_import_official_company` avec le client utilisateur avant d'utiliser la clé `service_role` pour l'import. Cette frontière reste sensible : le contrôle d'autorisation doit être effectivement présent sur la base cible et strictement aligné sur les politiques CRM VIP (`owner/admin`). La migration de durcissement versionnée le 9 novembre définit ce RPC en `security invoker`, mais son application distante n'est pas confirmée.

**Durcissement du code effectué sur Evolution-7 :**
- CORS limité à `https://majestios.com`, `https://www.majestios.com` et aux origines explicitement listées dans `ALLOWED_ORIGINS` ; les autres origines sont refusées.
- Message d'autorisation cohérent avec les administrateurs VIP.
- Suppression des détails d'erreur RPC, des statuts techniques du service upstream et des exceptions brutes dans les réponses HTTP.
- Ajout de contrôles contractuels dans `tests/crm-security-contract.test.cjs`.

**Limites restantes :** le test de contrat n'a pas encore été exécuté dans cette session ; les tests réels avec member/viewer, owner/admin et organisation tierce restent à faire. Les origines de preview nécessaires doivent être configurées explicitement dans `ALLOWED_ORIGINS`. L'application de la migration sur Supabase n'est pas vérifiée.

### 10.7 Activation effective des contrôles d'intégrité CRM

La migration `20261109190000_enforce_crm_business_relationships.sql` définissait une fonction de contrôle tenant-scoped mais n'attachait pas de triggers aux tables : la fonction restait inactive. Par ailleurs, le droit SQL `UPDATE(state, read_at)` accordé aux utilisateurs authentifiés permettait théoriquement de marquer une relance comme traitée sans passer par le RPC qui inscrit l'activité d'historique.

**Correction préparée sur Evolution-7 :** `20261109210000_activate_crm_integrity_and_reminder_rpc.sql` attache les contrôles BEFORE INSERT/UPDATE aux entreprises, contacts, opportunités et activités ; retire le droit UPDATE direct sur `crm_reminders` ; maintient le RPC comme chemin unique de clôture et ajoute une vérification de l'opportunité liée avant écriture de l'activité.

Le test de contrat couvre désormais ces points. Son exécution et les tests d'intégration restent à effectuer. Aucun déploiement ni changement Supabase distant n'a été effectué.



**Qualification :** risque de configuration/autorisation à vérifier avant extension du flux privilégié ; pas de preuve d'exploitation ni de contournement démontré. Aucun déploiement ni changement de base distante n'a été effectué.

### 10.4 Tests de sécurité obligatoires pour le centre de commande

- utilisateur non connecté : aucun accès ;
- membre viewer/member : refus des conversations et fichiers administrateur ;
- admin d'une autre organisation : refus de lecture, écriture, recherche et téléchargement ;
- admin autorisé : accès limité à son périmètre ;
- lien signé expiré/révoqué : refus ;
- identifiant de fichier substitué : refus ;
- suppression/rétention : absence d'accès après suppression selon politique ;
- appel direct API/RPC : mêmes contrôles que l'interface ;
- clé service_role : jamais exposée au navigateur ni utilisée sans autorisation utilisateur vérifiée côté serveur.

### 10.5 CORS du provisionnement des espaces clients

La fonction `provision-client-workspace` utilisait auparavant un motif générique autorisant une famille de previews Vercel. Ce motif a été supprimé sur `Evolution-7`. Les origines admises sont désormais les deux domaines de production, la preview explicitement déclarée dans le code et les origines additionnelles listées dans `ALLOWED_ORIGINS`.

Un contrôle contractuel vérifie que le motif générique n'est plus présent. Il reste à configurer les previews réellement utilisées dans l'environnement de test et à exécuter les tests CORS. Cette correction ne change pas la politique d'autorisation métier du RPC de provisionnement.

### 10.6 Cohérence finale des droits CRM entre organisations

L'ordre des migrations révélait une contradiction : `20261108151400_enforce_vip_boundary_for_internal_crm.sql` distingue l'organisation interne des tenants clients/partenaires, puis `20261108181246_vip_only_crm_access.sql` remplace les politiques des tables CRM par une règle `owner/admin` globale. Les migrations ultérieures durcissent les colonnes et le RPC de relance, sans restaurer la différenciation attendue par le contrat métier.

**Correction préparée sur Evolution-7 :** `20261109200000_restore_tenant_scoped_crm_permissions.sql` rétablit :
- organisation interne MajestiOS : lecture et écriture réservées à `owner/admin` ;
- organisations client/partenaire : lecture selon appartenance et écriture `owner/admin/member` dans le tenant propre ; `viewer` reste en lecture seule ;
- suppression des fiches : réservée à `owner/admin` ;
- clôture des relances par RPC : même contrôle tenant-scoped que les politiques des tables.

Le test de contrat contrôle maintenant la migration finale, et non seulement la migration historique. Cette migration élargit les droits des membres clients par rapport à la migration VIP globale ; elle est cohérente avec le contrat déjà présent dans le dépôt, mais doit être validée en environnement de test avant toute application distante. Aucun changement Supabase n'a été effectué. Le statut Vercel des commits de cette série signale `build-rate-limit` ; il ne fournit donc pas de résultat exploitable sur l'exécution du test de contrat.

**Suite :** vérifier les migrations et politiques réellement appliquées à l'environnement Supabase avant d'affirmer que le runtime est conforme. Aucune connexion ni mutation distante n'a été effectuée.
