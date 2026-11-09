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
