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
