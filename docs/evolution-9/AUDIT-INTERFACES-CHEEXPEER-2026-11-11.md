# Audit des interfaces et capacités Cheexpeer — Evolution-9

**Date :** 11 novembre 2026  
**Branche :** `Evolution-9`  
**Périmètre :** assistant MajestiOS, administration, CRM, recherche d'opportunités, scoring, rapports, réputation virtuelle et worker Cheexpeer.  
**Méthode :** lecture du code versionné et des contrats Edge ; aucune activation ni écriture Supabase.

## 1. Synthèse de maturité

| Interface / capacité | État prouvé dans le dépôt | Limite / décision |
|---|---|---|
| MajestiOS Bot | Guide conversationnel local à mots-clés, ouvert depuis la page Assistant | Ce n'est pas un chatbot IA connecté ; aucun accès CRM ni action métier |
| Cheexpeer Admin | Cockpit administratif authentifié, indicateurs et liens vers CRM/recherche | Pas encore de centre de commande relié aux missions durables, approbations et événements |
| CRM | CRUD encadré dans le client JS, relations, pagination, qualification et journal d'activité | Sécurité serveur distante et transitions restent à recetter ; score saisi manuellement |
| Recherche d'opportunités | BOAMP/BODACC, sources publiques, recherche limitée et affichage des résultats | Les résultats de l'espace Admin Recherche ne sont pas enregistrés dans le CRM ; pas de qualification persistante automatique |
| Scoring | Champ numérique `qualification_score` (0–100) et résumé éditable dans une opportunité | Pas de moteur de scoring démontré, ni critères/pondérations versionnés, ni explication calculée |
| Rapports | La réputation renvoie une synthèse structurée d'analyse si le fournisseur IA est configuré | Pas de générateur général de rapports CRM/appels d'offres ni de bibliothèque de rapports persistants démontrée |
| Vulgarisation appels d'offres | Rubrique éditoriale et parcours d'accompagnement présentés dans le site | Pas de pipeline document/PDF → extraction → synthèse sourcée → validation identifié dans ce contrôle |
| Réputation virtuelle | Edge Function authentifiée, quota, collecte identité officielle et contexte BODACC ; analyse IA facultative | Pas d'audit web/social/avis automatisé ; Google et réseaux sont manuels ou prévus ; aucun score global |
| Worker Cheexpeer | Worker durable et pont versionnés ; handlers bootstrap et self-check seulement | Les outils métier restent refusés faute de handler ; ne pas le présenter comme agent autonome opérationnel |

## 2. Assistant MajestiOS / Bot

La page `assistant-majestios.html` annonce explicitement un « Guide local actif · IA à raccorder ». Elle indique que le guide local est un outil d'orientation et ne transmet aucune donnée ni n'exécute d'action métier. La page rappelle les éléments à raccorder : moteur IA, contexte utilisateur, ressources autorisées, journalisation, quotas et transfert humain.

**Conclusion :** l'interface actuelle est un guide d'orientation, pas encore MajestiOS Bot augmenté par Cheexpeer. Il faut conserver cette transparence jusqu'à une intégration réelle.

## 3. Cheexpeer Admin / cockpit

`administration.js` vérifie la session, récupère l'identité authentifiée, trouve l'organisation interne et exige un rôle `owner` ou `admin`. Le cockpit charge le catalogue des sources et des compteurs d'organisation, sans afficher de chiffres fictifs.

**Écart fonctionnel :** l'interface n'est pas encore reliée au cycle des missions Cheexpeer : création de mission authentifiée, écran d'approbation, suivi des étapes, consultation du résultat, événements, erreurs et relance contrôlée. Le centre de commande demeure donc une cible à construire/recetter, non une capacité active.

## 4. Recherche d'opportunités et CRM

- Le moteur public `opportunity-search.js` interroge les sources BOAMP/BODACC et plafonne l'affichage à dix résultats par requête.
- L'espace de recherche administrative `admin-recherches.js` contrôle l'accès interne owner/admin et affiche clairement que les résultats ne sont pas enregistrés dans le CRM.
- Les familles privées non connectées restent signalées dans le code comme non raccordées.
- Le CRM impose le contexte de l'organisation interne et un rôle owner/admin côté interface ; les requêtes sont filtrées par `organization_id`.
- Les listes relationnelles sont paginées ; certains chemins historiques sont encore limités à 100 éléments.

**À concevoir :** action explicite « qualifier et ajouter au CRM », avec provenance, date de collecte, identifiant externe, dédoublonnage, consentements/usage autorisé et validation humaine. Ne jamais importer silencieusement les résultats d'une recherche.

## 5. Scoring et rédaction de rapports

Le champ `qualification_score` est un nombre borné de 0 à 100, modifiable par l'utilisateur, accompagné d'une synthèse. Ce champ ne prouve pas l'existence d'un calcul automatique.

Avant de construire un moteur :
- définir des scores distincts par finalité (adéquation entreprise/opportunité, priorité commerciale, maturité numérique, préparation facturation) ;
- documenter critères, pondérations, exclusions, version, fraîcheur et provenance ;
- conserver les facteurs qui expliquent le score ;
- afficher les lacunes et l'incertitude ;
- autoriser correction et validation humaine ;
- ne pas déduire une mauvaise réputation ou une incapacité d'une seule donnée administrative.

Aucun module général de rédaction et de conservation des rapports n'a été identifié dans le périmètre de code inspecté. Le rapport cible devra contenir période, périmètre, sources, faits, interprétations, hypothèses, limites, recommandations et validation/version.

## 6. Réputation virtuelle : protections et limites

Le code de l'Edge Function :
- vérifie le bearer token via `auth.getUser` ;
- contrôle l'appartenance à une organisation ;
- refuse le traitement automatique si plusieurs appartenances sont trouvées, en renvoyant HTTP 409 pour demander une sélection ;
- consomme un quota par organisation ;
- limite la taille du corps et les longueurs de champs ;
- collecte l'identité administrative et les annonces légales BODACC ;
- utilise un fournisseur IA uniquement si la clé et le modèle sont configurés ; sinon, retourne les preuves sans diagnostic IA ;
- exige des références d'éléments de preuve pour chaque constat, distingue fait/interprétation/hypothèse et interdit un score global de réputation dans cette version.

Le prompt système traite explicitement les contenus externes comme non fiables et interdit de suivre les instructions présentes dans les preuves. Le validateur contrôle les références, la correspondance d'identité et empêche de déduire la réputation des seules données administratives.

**Limites importantes :** Google Web, Google Maps et les plateformes sociales sont indiqués comme consultation manuelle ou planifiée. Le dossier et le journal du formulaire sont conservés en `sessionStorage`, pas dans un historique CRM persistant. L'analyse ne couvre donc pas encore une présence web/social complète et historisée.

**Point UX à traiter :** le backend exige une sélection si le compte possède plusieurs organisations, mais l'interface actuelle ne fournit pas encore un sélecteur de contexte explicite. Ne pas contourner ce contrôle en prenant arbitrairement la première organisation.

## 7. Worker et sécurité d'exécution

Le worker ne traite que les missions de bootstrap et `worker_self_check`. Tout autre type de mission est refusé avec `UNSUPPORTED_EXECUTOR`. Le pont serveur exige un secret dédié, borne les entrées et les résultats, et appelle les RPC du worker avec la clé de service côté serveur.

Le registre d'outils et les validations humaines doivent rester fail-closed. Avant tout outil métier : permissions par organisation, validation de l'acteur, approbation liée à la mission et à son contenu, idempotence, bail, limites de coût, journal append-only, tests d'accès négatifs et stratégie de révocation.

## 8. Parcours cible à la création d'une entreprise

À la création d'une entreprise, proposer dans le CRM un parcours progressif et non automatique :
1. diagnostic de présence virtuelle, avec données publiques et preuves datées ;
2. diagnostic de préparation à la facturation électronique, adapté au profil et aux flux ;
3. qualification activité/NAF/territoire et complétude des données ;
4. recherche d'opportunités adaptées ;
5. scores explicables par finalité ;
6. rapport de synthèse et plan d'action soumis à validation.

Chaque proposition doit pouvoir être ignorée, différée ou refusée. Aucune publication, prospection, transmission à un partenaire, souscription, émission de facture ou dépense n'est exécutée sans autorisation appropriée.

## 9. Anomalies et prochaines vérifications

| ID | Priorité | Sujet | Suite |
|---|---|---|---|
| CHX-UI-01 | P1 | Bot local confondu potentiellement avec un agent IA | Garder le libellé transparent ; spécifier le futur bot et ses permissions |
| CHX-ADMIN-01 | P1 | Cockpit non raccordé aux missions et approbations | Auditer les API d'ouverture/approbation/consultation et concevoir l'écran de commande |
| CHX-SEARCH-01 | P1 | Recherche administrative sans persistance CRM | Définir l'import volontaire et le dédoublonnage sourcé |
| CHX-SCORE-01 | P1 | Score manuel sans moteur explicable | Spécifier le modèle avant tout calcul automatique |
| CHX-REPORT-01 | P2 | Générateur général de rapports non identifié | Définir modèle de rapport versionné et archivage |
| CHX-AO-01 | P1 | Chaîne de vulgarisation documentaire non démontrée | Auditer upload, extraction, références de pages, confidentialité et validation |
| CHX-REP-01 | P1 | Historique de réputation seulement en session | Concevoir persistance CRM sécurisée et rétention |
| CHX-REP-02 | P1 | Pas de sélecteur de tenant lorsque plusieurs appartenances existent | Ajouter un choix explicite et revalidation serveur ; ne jamais prendre le premier tenant |
| CHX-WORKER-01 | P0 avant activation métier | Aucun handler métier dans le worker | Conserver le refus par défaut ; n'activer aucun outil sans recette sécurité complète |

Ces identifiants sont des constats de maturité à suivre ; ils ne signifient pas que les fonctions correspondantes sont activées ou déployées.

## 10. État des modifications

Document d'audit uniquement. Aucun code applicatif, migration, donnée Supabase, paramètre Auth, secret, déploiement ou registre distant n'a été modifié.


## 11. Vérification runtime du socle d'exécution — MajestiOS-Test

**Contrôle SQL en lecture seule, 11 novembre 2026.**

- Les six tables privées `cheexpeer_*` sont présentes : missions, étapes, événements, approbations, plannings et registre des outils.
- Les six tables ont des politiques RLS explicites `USING false / WITH CHECK false` pour `anon` et `authenticated`. Les privilèges directs observés sur les tables et les fonctions privées sont attribués à `service_role`.
- Les RPC privées de soumission et de décision, ainsi que les fonctions de cycle de vie, ne sont exécutables que par `service_role` dans les grants observés.
- Le registre distant contient seulement `test_executor` (désactivé, autonomie 0). Il ne contient pas `worker_self_check`.
- Le dernier numéro de migration observé dans `supabase_migrations.schema_migrations` est `20261109205855`. La migration versionnée dans Evolution-9 `20261111160000_cheexpeer_worker_self_check_tool.sql` n'est pas enregistrée dans cette base de recette au moment du contrôle.

**Conclusion :** le socle durable est présent, mais le registre et l'historique des migrations distants ne correspondent pas au dernier état du dépôt. Ne pas lancer le worker avec un code plus récent ni activer un outil par simple insertion manuelle. Avant toute synchronisation, comparer toutes les migrations manquantes et les objets réels, préparer une sauvegarde et appliquer un plan contrôlé sur la seule base de recette.

## 12. Frontière API utilisateur : blocage d'activation

La spécification de première mission indique que les endpoints utilisateur de soumission, approbation et consultation sont absents. La lecture du dépôt Evolution-9 confirme qu'aucune Edge Function dédiée d'orchestration utilisateur n'est présente dans l'arborescence inspectée. Le pont `cheexpeer-worker-bridge` est protégé par secret worker et service_role : il est strictement serveur-à-serveur, jamais destiné au navigateur.

La RPC de décision reçoit `p_decision_by`. La base vérifie que cet identifiant est owner/admin de l'organisation de la mission, mais l'identifiant doit être dérivé d'une session utilisateur vérifiée par une future API ; il ne doit jamais provenir d'un champ libre envoyé par le navigateur. La RPC privée ne doit pas être exposée directement.

**Décision :** aucun centre de commande ne doit proposer un bouton « exécuter » tant que l'API utilisateur authentifiée, les vérifications de tenant, la validation d'approbation et la consultation filtrée ne sont pas livrées et testées. Le pont worker demeure fermé aux navigateurs.

## 13. Séquence de mise en service sûre

1. Réconcilier le journal de migrations dépôt/base de recette sans appliquer de SQL à l'aveugle.
2. Vérifier les fonctions SQL, grants, policies et triggers du worker après réconciliation.
3. Créer trois Edge Functions ou routes serveur distinctes : soumission, décision d'approbation, lecture de mission/historique.
4. Dériver l'acteur exclusivement du JWT validé ; vérifier owner/admin sur l'organisation cible à chaque requête.
5. Tester les refus member, utilisateur externe, tenant différent, actor falsifié, mission expirée, approbation déjà décidée et double idempotence.
6. Déployer le pont et le worker dans un environnement contrôlé ; garder le registre désactivé.
7. Activer seulement `worker_self_check` après tests de bout en bout et procédure de désactivation.
8. Construire le cockpit en lecture/commande à partir des API validées ; aucune clé service_role côté navigateur.


## 14. Pont serveur et runtime du worker — revue complémentaire

### Protections observées

- Le pont exige le secret `CHEEXPEER_WORKER_SECRET` dans un en-tête dédié, comparé en temps constant.
- Il n'accepte que POST, borne le corps à 64 Kio et les résultats à 32 Kio.
- La liste des actions RPC est fermée ; les identifiants mission/worker et les paramètres numériques sont contrôlés.
- Les appels Supabase utilisent la clé `service_role` exclusivement côté Edge Function ; aucune clé de service n'est fournie au navigateur par le worker.
- Le worker n'exécute que `readiness_probe` et `worker_self_check`. Toute autre mission est explicitement refusée avec `UNSUPPORTED_EXECUTOR`.
- Le diagnostic self-check renouvelle le bail avant de produire son résultat et refuse de finaliser si le bail n'est plus détenu.
- Le endpoint de santé n'expose pas de secret, mais renvoie sans authentification `workerId`, `inFlight`, `lastSuccessAt` et `lastErrorAt`.

### Points de vigilance

| ID | Priorité | Constat | Mesure recommandée |
|---|---|---|---|
| CHX-WORKER-03 | P2 | Le endpoint `/health` expose des métadonnées opérationnelles et un identifiant worker. | Ne retourner que l'état minimal requis par l'orchestrateur ; protéger les diagnostics détaillés ou les réserver au réseau interne. |
| CHX-WORKER-04 | P2 avant multi-worker | Le `worker_id` est validé en format, mais le pont s'appuie sur un secret partagé ; aucune identité individuelle de worker n'est démontrée. | Avant plusieurs workers, associer identité, secret, périmètre et révocation à chaque instance ; journaliser l'identité authentifiée côté serveur. |
| CHX-WORKER-05 | P1 | Le handler `readiness_probe` est une exception au registre dans la fonction de claim SQL ; l'exception est limitée au type et à l'autonomie 0, pas à une version de handler ni à un schéma d'entrée spécifique. | Garder la création de mission exclusivement serveur ; borner strictement input/context et prévoir une désactivation centrale de cette exception après bootstrap. |

Le worker journalise les identifiants de mission, le type et l'état, sans afficher de secret dans les logs applicatifs observés. Les erreurs RPC brutes sont envoyées aux logs du pont côté serveur : vérifier leur politique de rétention et leur accès, et éviter d'y inclure des payloads ou données personnelles.

**Aucune modification du pont, du worker, des secrets, des migrations ou du déploiement n'a été effectuée pendant cette revue.**


## 15. Vulgarisation des appels d'offres et cohérence de la recherche

### Accompagnement aux appels d'offres

La page `accompagnement-appels-offres.html` est actuellement une page de présentation et de parcours éditorial. Elle décrit la préparation des critères, des pièces et d'une réponse structurée, et précise que les connexions aux sources et services seront activées progressivement. Aucun formulaire de dépôt de DCE, lecteur PDF, extraction de pièces, synthèse sourcée, matrice de conformité ou rédaction de mémoire technique n'est présent dans cette page.

La page contient encore une scène `virtual-space` avec bâtiment et cartes flottantes, ainsi que des libellés d'étage. Ce visuel contredit la décision documentaire de privilégier la navigation classique tant que les fondations fonctionnelles et pédagogiques ne sont pas validées. Il faut harmoniser cette page lors du lot UI, sans supprimer le contenu pédagogique utile.

**Parcours cible de vulgarisation :** dépôt volontaire et sécurisé du DCE → inventaire des pièces et pages → extraction avec références vérifiables → explication en langage de chantier → exigences obligatoires / critères / délais / risques → liste des pièces à réunir → plan de réponse → brouillon de mémoire technique → revue et validation humaine. Les documents doivent rester cloisonnés par organisation, avec contrôle d'accès, rétention et suppression maîtrisée.

### Recherche et publication d'annonces

Le code de `opportunity-search.js` confirme un moteur unique avec un paramètre de routage `marche`, des sources BOAMP pour les marchés publics et BODACC pour les signaux d'entreprise privés. La recherche mixte « Publics et privés » interroge les deux sources en parallèle, en blocs distincts, avec cinq résultats maximum par source ; une recherche sur une seule source peut afficher jusqu'à dix résultats. Le code précise à juste titre que les annonces BODACC sont des signaux légaux, pas des appels d'offres.

Écart de taxonomie à revoir : le moteur conserve encore `immobilier`, `emploi`, `sous-traitance-offres` et `sous-traitance-recherche` comme catégories privées non connectées. Le parcours de publication « Je publie mon annonce » et les catégories cible `emploi`, `sous-traitance`, `demande-offre`, `autres` ne sont pas démontrés dans le périmètre inspecté. Les annonces emploi internes MajestiOS ne doivent pas être confondues avec une source d'emploi externe.

La page de préqualification par APE/NAF indique clairement que les critères ne sont pas enregistrés dans un CRM. Elle rappelle aussi qu'un code APE/NAF et un score de rapprochement ne prouvent pas les compétences ou l'éligibilité : cette réserve doit être conservée dans tout futur scoring.

**Décision :** maintenir le moteur unique et la distinction des sources ; aligner la taxonomie avec la décision métier la plus récente avant de connecter de nouvelles sources ou la publication d'annonces.


## 16. Création d'entreprise : déclenchement de l'accompagnement prioritaire

### État observé

Le formulaire CRM de création d'entreprise permet de saisir les données d'identification et de qualification de la fiche. Après enregistrement, le parcours actuel revient à la liste / fiche CRM ; aucun déclencheur de recommandations prioritaires n'a été identifié dans `crm-page.js` ou `crm-client.js`.

La page `facturation-electronique.html` décrit correctement un accompagnement futur : MajestiOS n'est pas une plateforme agréée, aucun partenaire PA ni connecteur n'est annoncé comme opérationnel et le module de facturation/CRM client est indiqué comme non disponible en production. La page Réputation virtuelle présente un dossier de diagnostic et une analyse Cheexpeer sécurisée, mais le suivi reste à ce stade lié à la session et non à un historique CRM durable.

### Exigence fonctionnelle à intégrer

À la création d'une nouvelle entreprise, proposer immédiatement — sans les exécuter automatiquement — deux parcours prioritaires :

1. **Diagnostic de présence virtuelle** : vérifier l'identité et les établissements, la cohérence du site et des informations publiques, la présence locale, les avis et les canaux numériques disponibles ; chaque constat doit être daté, sourcé et distingué d'une hypothèse.
2. **Préparation à la facturation électronique** : identifier la taille de l'entreprise, son assujettissement à la TVA (y compris franchise en base), ses flux B2B/B2C, ses pratiques de facturation, son logiciel et ses besoins de réception/émission/e-reporting ; proposer ensuite un parcours d'accompagnement et des solutions partenaires compatibles, sans prétendre à une conformité automatique.

Le système doit réutiliser les données déjà saisies (raison sociale, SIREN, SIRET, APE/NAF, site, adresse) sans redemander inutilement les mêmes informations. Les données fiscales ou commerciales manquantes doivent être demandées à l'entreprise. Un code APE, une forme juridique ou un effectif estimé ne suffisent pas à établir seuls les obligations exactes.

Chaque proposition est facultative : démarrer, différer, ignorer ou refuser. Les résultats et décisions doivent être historisés dans le CRM, sous le tenant concerné, avec consentement/base légale et politique de conservation adaptés. Aucune souscription, transmission à un partenaire, publication, émission de facture ou action externe sans validation explicite.

**Positionnement produit :** ces deux parcours deviennent les premiers services d'accueil d'une nouvelle entreprise, avant les modules plus avancés de scoring, prospection et opportunités. Ils donnent à MajestiOS un point d'entrée utile et mesurable, tout en préparant la relation client et le futur CRM de facturation.


## 17. Facturation et intégration CRM — audit du périmètre réel

### Éléments effectivement présents

- La page `facturation-electronique.html` est une page d'information et d'orientation : calendrier, rôle des plateformes agréées, distinction PDF/facture électronique, sources officielles et positionnement MajestiOS.
- Elle indique explicitement que MajestiOS n'est pas une plateforme agréée et qu'aucun partenaire ni connecteur n'est opérationnel.
- Le document `SPECIFICATION-CIBLE-FACTURATION-CRM-ELECTRONIQUE.md` décrit une architecture cible cohérente : CRM commercial, domaine Facturation indépendant de l'écran CRM et couche Connect vers les plateformes agréées ; modes natif, connecté et hybride ; source de référence par objet ; idempotence, historisation, export et réversibilité.
- La page facturation contenait une référence obsolète à Evolution-8. Correction effectuée sur Evolution-9 : elle indique désormais que le cadrage est en cours dans Evolution-9, tout en maintenant clairement l'absence de module et de connecteurs en production.

### Absences vérifiées dans le dépôt inspecté

- Aucun module applicatif de devis, facture, avoir, règlement, échéancier ou rapprochement n'a été identifié.
- Aucun schéma ou migration SQL de facturation n'a été identifié dans le périmètre Evolution-9.
- Aucun connecteur PA, webhook de statut, bac à sable partenaire ou traitement d'e-reporting n'est présent dans le périmètre inspecté.
- Le CRM courant ne contient pas de tables ni de fonctions de facturation. Les listes blanches de création/modification couvrent entreprises, contacts et opportunités ; les activités sont append-only. Aucun champ de facturation ni action devis/facture n'est proposé.
- Le formulaire de création d'entreprise ne déclenche pas encore les deux diagnostics facultatifs définis en section 16. Le parcours de facturation n'est donc pas relié à l'onboarding CRM.
- La page d'information ne propose pas de formulaire dédié permettant de qualifier le besoin, de demander un diagnostic ou de transmettre une demande d'accompagnement ; elle renvoie essentiellement vers des ressources et pages internes.

### Décisions et garde-fous

1. Ne pas ajouter quelques colonnes de facture au CRM actuel : conserver un domaine Facturation distinct, avec des identifiants stables et des contrats API.
2. Avant toute table, préciser les modèles de devis, facture, lignes, taxes, avoirs, échéances, paiements, événements, pièces et statuts ; faire valider les règles fiscales, comptables et de conservation.
3. Définir la source de référence pour chaque objet dans les modes natif, connecté et hybride ; empêcher la double création et les synchronisations non idempotentes.
4. Préparer d'abord un prototype entièrement synthétique, sans émission réelle ni transmission PA.
5. Ne choisir une PA qu'après étude de son statut officiel à date, couverture des flux, API/sandbox, coûts, contrat, responsabilités et réversibilité.
6. Relier le diagnostic de préparation à la facturation électronique à la création CRM, mais en mode facultatif et avec données manquantes confirmées par le client ; ne pas déduire une obligation fiscale du seul code APE/NAF.
7. Distinguer dans l'interface la préparation et le conseil MajestiOS des opérations réglementaires réellement assurées par une PA.

### Correction de contenu effectuée

La référence « conception dans Evolution-8 » de la page `facturation-electronique.html` a été remplacée par une référence exacte à Evolution-9. Aucun calendrier légal, lien officiel ou statut de disponibilité n'a été modifié par ce correctif.

**Conclusion :** le cadrage cible est déjà documenté ; la fonctionnalité applicative de facturation n'est pas encore construite. La priorité actuelle est la qualification d'onboarding et la validation de l'architecture phase 2, pas la création prématurée de tables ou d'un bouton « facturer ».


## 18. Revue approfondie des RPC d'orchestration et des futurs endpoints — 11 novembre 2026

### 18.1 Authentification et séparation des rôles

Le dépôt contient déjà des modèles d'authentification Edge Function réutilisables :
- `prospection-search-member` vérifie le JWT avec un client utilisateur et une clé publishable, puis résout les appartenances via RLS ;
- `reputation-audit-context` vérifie la session et refuse les appartenances ambiguës ;
- `provision-client-workspace` valide le JWT côté serveur avec `auth.getUser(token)`, puis effectue une opération administrative avec `service_role`.

Le pont `cheexpeer-worker-bridge` est distinct : secret technique partagé, liste fermée d'actions, appels RPC avec `service_role`. Il ne constitue pas une API utilisateur.

**Contrat à respecter pour les trois endpoints à construire :**
1. soumission d'une mission ;
2. décision d'approbation ;
3. lecture de mission, résultat et événements.

Chaque endpoint doit authentifier le JWT utilisateur, obtenir l'identité depuis `auth.getUser(token)`, vérifier l'appartenance et le rôle owner/admin de l'organisation concernée, puis seulement effectuer les opérations serveur. L'identifiant utilisateur ne doit jamais provenir d'un champ de requête. La clé `service_role` ne doit jamais être exposée au navigateur. Les lectures doivent filtrer explicitement sur l'organisation validée et ne retourner qu'une liste blanche de champs.

### 18.2 Défaut d'isolation latent dans l'idempotence de soumission

La RPC `private.cheexpeer_submit_mission` utilise une contrainte unique globale sur `idempotency_key`. En cas de conflit, elle relit la mission uniquement par cette clé et retourne son identifiant et son statut sans comparer `organization_id` à `p_organization_id`.

La RPC est actuellement réservée à `service_role` et aucune API utilisateur ne l'expose : aucune fuite inter-tenant effective n'est démontrée. Toutefois, une future API qui retournerait directement cette réponse pourrait révéler l'existence et l'identifiant d'une mission d'une autre organisation en cas de collision ou de réutilisation de clé.

**Correction requise avant raccordement :** vérifier l'organisation sur la ligne retrouvée et retourner une erreur générique sans donnée de mission en cas de mismatch ; idéalement, décider si la clé doit être unique globalement ou par organisation et faire évoluer contrainte + tests en cohérence. Tester même clé dans deux organisations, même clé dans la même organisation, nouvelle clé et répétition concurrente.

### 18.3 Défaut de persistance des approbations expirées

Dans `private.cheexpeer_decide_approval`, le chemin d'expiration met à jour `cheexpeer_approvals.status = 'expired'`, puis lève immédiatement une exception. En PostgreSQL, l'exception annule la transaction de la fonction : la mise à jour du statut est donc annulée elle aussi. La décision est refusée, mais l'approbation peut rester durablement `pending`.

**Correction requise :** traiter l'expiration comme un résultat métier normal (retour explicite `expired` sans exception après mise à jour), ou effectuer une transition atomique distincte compatible avec le contrat RPC. Ajouter un test SQL prouvant que le statut `expired` est effectivement conservé et qu'aucune mission n'est mise en file.

### 18.4 Ordre de réalisation et tests bloquants

- Corriger les deux contrats SQL dans une migration additive, sans modifier ni réécrire une migration déjà appliquée.
- Créer les trois endpoints distincts avec validation stricte du payload, CORS en liste autorisée, réponses `no-store`, limites de taille et journalisation sans secrets.
- Tester owner/admin, member, utilisateur non membre, organisation A vers mission B, UUID d'acteur falsifié, approbation déjà décidée, approbation expirée, collision d'idempotence inter-tenant et concurrence.
- Ajouter ces fichiers et tests à la CI statique ; ne pas confondre syntaxe/contrats simulés avec recette SQL réelle.
- Garder le registre du tool désactivé et ne déployer aucun endpoint ni migration tant que la recette contrôlée n'est pas autorisée.

**État de cette revue :** analyse du code versionné uniquement. Aucun fichier applicatif ou SQL, aucune base Supabase et aucun déploiement n'ont été modifiés pendant cette revue.


## 19. Première implémentation des API authentifiées — 11 novembre 2026

### Éléments versionnés sur Evolution-9

- Migration additive `20261111200000_cheexpeer_api_security_fixes.sql` :
  - remplace l'unicité globale de `idempotency_key` par une unicité composée `(organization_id, idempotency_key)` ;
  - limite la relecture d'une mission idempotente à l'organisation d'origine ;
  - transforme l'expiration d'une approbation en résultat métier `expired` persistant, journalisé, sans exception qui annulerait la transaction et sans mise en file ;
  - ajoute des façades RPC publiques réservées à `service_role` pour soumission, décision et consultation tenant-scoped.
- Module partagé `supabase/functions/_shared/cheexpeer-api.mjs` : validation stricte des payloads, limite de corps, CORS allowlist, réponses no-store et résolution du rôle owner/admin à partir de `auth.getUser(token)`.
- Trois Edge Functions distinctes créées : `cheexpeer-mission-submit`, `cheexpeer-approval-decision`, `cheexpeer-mission-read`.
- Tests de contrat Node couvrant JWT falsifié/non confirmé, acteur falsifié, rôles, organisation A/B, payloads et contrat de migration SQL ; ajoutés à `verify-site.yml`.

### Limites et conditions de recette

Ces fichiers sont présents dans Git uniquement. **La migration n'a pas été appliquée, les Edge Functions ne sont pas déployées et aucune écriture n'a été faite sur MajestiOS-Test ni en production.** Les tests Node de contrat ne remplacent pas les tests PostgreSQL transactionnels et l'intégration Auth/RLS réelle.

Avant toute mise en service sur MajestiOS-Test :
1. exécuter la migration sur une base locale jetable avec les migrations précédentes dans l'ordre ;
2. vérifier même clé même tenant, même clé tenant A/B, appels concurrents et conservation de l'état `expired` après commit ;
3. exécuter les trois fonctions avec comptes synthétiques owner/admin/member/non-membre de deux organisations ;
4. tester UUID acteur falsifié, tentative A→B, approbation expirée/déjà décidée, refus sans fuite d'existence ;
5. contrôler les grants, le schéma exposé, les variables Edge, les limites de taille, CORS et les journaux sans secrets ;
6. obtenir une autorisation explicite avant toute application sur MajestiOS-Test.

**Statut :** implémentation Git préparée ; CI en attente de preuve sur le HEAD final ; aucune mise en service.


## 20. Renforcement du contrôle tenant sur les décisions d'approbation

La revue après première implémentation a identifié un cas limite important : un même utilisateur peut être owner/admin de plusieurs organisations. Le handler vérifiait son rôle dans l'organisation déclarée, tandis que l'ancienne RPC interne vérifiait son rôle dans l'organisation réelle de la mission. Sans comparaison explicite entre les deux, un administrateur multi-tenant aurait pu présenter un identifiant d'approbation d'un autre tenant.

Correction ajoutée à la migration additive : la façade `public.cheexpeer_api_decide_approval` reçoit `p_organization_id`, joint approbation et mission, exige l'égalité entre `m.organization_id` et l'organisation autorisée, puis seulement appelle la RPC interne. Le handler transmet l'organisation issue du contrôle JWT/membership. Le test de contrat SQL couvre ce filtre.

**Statut :** correction présente dans Git Evolution-9 ; CI du HEAD final à vérifier ; aucun déploiement ni test PostgreSQL/Auth réel. Le scénario à deux organisations où le même utilisateur est administrateur des deux doit être inclus dans la recette locale.
