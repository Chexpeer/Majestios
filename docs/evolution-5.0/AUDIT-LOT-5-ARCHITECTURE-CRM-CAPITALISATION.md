# Audit du lot 5 — Architecture CRM et capitalisation commerciale

**Branche examinée :** `evolution-5.0`

**Périmètre :** données des sources, normalisation, dédoublonnage, qualification, historique, préparation CRM, automatisation et cloisonnement.

**Nature :** audit documentaire et proposition d'architecture fonctionnelle ; aucune implémentation CRM n'est autorisée ou réalisée par ce document.

> **Actualisation de périmètre — 5 novembre 2026 :** ce rapport décrit l'état avant la création de la fondation Supabase. Depuis, six migrations et neuf tables avec RLS sont présentes, ainsi qu'une fonction serveur de provisionnement client ; cela ne constitue pas encore un CRM opérationnel, une passerelle BOAMP/BODACC ni une chaîne de prospection. Le statut courant et les limites sont consignés dans [État du backend Supabase](ETAT-BACKEND-SUPABASE.md). Les propositions conceptuelles de ce rapport restent à arbitrer avant toute extension.

## 1. Synthèse

Le dépôt contient les premiers composants de détection et d'identification : recherche BOAMP et BODACC, recherche d'entreprises DINUM, fonctions de normalisation et de rapprochement en mémoire, ainsi qu'un schéma JSON d'opportunité. Ces éléments constituent un prototype de collecte et de qualification indicative, pas une chaîne de capitalisation commerciale.

**Faits vérifiés :**

- Les connecteurs BOAMP et BODACC et l'API Recherche d'Entreprises sont appelés depuis le navigateur.
- Les résultats ne sont pas persistés ; aucun service CRM, compte utilisateur, backend, journal d'activité ou événement de transmission n'a été trouvé dans le code examiné.
- `schemas/opportunite.schema.json` décrit un contrat candidat, mais le rendu des résultats ne construit pas ces objets et aucune validation d'exécution par ce schéma n'est présente.
- La déduplication des entreprises est limitée aux résultats d'une recherche en mémoire ; aucune déduplication persistante ou résolution d'identité commune aux sources n'est présente.
- `crm.html`, `suivi-commercial.html` et `espace-membre.html` sont des pages de présentation et ne démontrent ni service CRM ni espace client opérationnel.
- Les documents historiques définissent déjà plusieurs principes utiles : séparation des faits et hypothèses, provenance, revue humaine, distinction du CRM interne et des espaces clients, et absence de transfert automatique par défaut.

**Conclusion :** l'étape suivante ne doit pas être le développement du CRM. Il faut d'abord arbitrer les finalités et frontières de données, l'identité des entreprises, les conditions d'usage des sources, les statuts de traitement, les accès et la conservation. Le modèle conceptuel ci-dessous est une proposition à valider, pas un modèle technique décidé.

## 2. État de réalisation observé

| Capacité | État vérifié dans le dépôt | Limite principale |
|---|---|---|
| Collecte BOAMP | Requête API côté navigateur, à la demande | Pas de collecte planifiée, d'instantané ni d'état de connecteur persistant |
| Collecte BODACC | Requête API côté navigateur, à la demande | La réponse est filtrée et rendue dans la page ; aucune fiche durable |
| Identification DINUM | Requêtes par APE/NAF et département ; normalisation, score et déduplication en mémoire | Résultats indicatifs et temporaires ; aucune relation enregistrée avec le signal déclencheur |
| Contrat d'opportunité | `schemas/opportunite.schema.json` est présent | Le runtime ne valide ni ne produit le contrat ; plusieurs champs CRM ne sont que réservés |
| Qualification | Filtres textuels BODACC et indicateurs de rapprochement existent | Pas de file humaine, de décision durable, de motif versionné ou d'historique de revue |
| CRM et suivi | Pages de présentation présentes | Pas d'écriture, de recherche CRM, de suivi d'interaction ni de persistance |
| Espace client | Page de présentation présente | Pas d'authentification, d'autorisation ou de séparation de tenants |
| Historique et audit | Principes dans la documentation | Aucun journal applicatif ni suppression propagée démontrés |
| Automatisation / IA | Cible V5 documentée | Aucun orchestrateur métier, déclencheur CRM ou action automatique opérationnel |

La documentation historique est cohérente sur le principe « audit et architecture avant persistance ». Elle n'est cependant pas homogène sur certains périmètres de catégories ; ce rapport ne choisit pas les catégories ni ne réactive de familles non connectées.

## 3. Données disponibles par source

Les champs ci-dessous sont ceux demandés ou utilisés par le prototype. Ils ne constituent pas une validation complète du schéma des fournisseurs ; les noms, formats, stabilité et droits de réutilisation doivent être vérifiés sur des réponses réelles et la documentation applicable avant ingestion durable.

| Source / module | Champs observés | Usage actuel | Écart avant CRM |
|---|---|---|---|
| BOAMP — `opportunity-search.js` | `idweb`, `id`, `objet`, `famille_libelle`, `dateparution`, `datelimitereponse`, `nomacheteur`, `code_departement`, `code_departement_prestation`, `type_marche`, `type_marche_facette`, `type_avis`, `descripteur_libelle`, `etat`, `url_avis` | Filtrage et affichage des annonces, acheteur, territoire, dates et URL officielle | Pas de mapping vers le schéma commun, d'observation source conservée, d'historique de statut ou de liaison à une entreprise |
| BODACC — `opportunity-search.js` | `id`, `publicationavis`, `dateparution`, `numeroannonce`, `typeavis_lib`, `familleavis[_lib]`, `departement_nom_officiel`, `commercant`, `ville`, `registre`, `listepersonnes`, `listeetablissements`, `jugement`, `acte`, `modificationsgenerales`, `divers`, `region_nom_officiel`, `url_complete` | Recherche sur un lot récent, filtrage textuel et affichage d'extraits | Pas de distinction structurée et persistée entre faits publiés et hypothèses ; les champs imbriqués et personnes doivent faire l'objet d'une minimisation et d'une revue spécifique avant stockage |
| API Recherche d'Entreprises — `company-targeting.js` | SIREN/SIRET, dénomination, APE/NAF, code postal/département, statut administratif, URL, identifiant source, date de collecte et critères de requête | Normalisation, classement indicatif et sélection de candidats | Pas de version de source, de statut de diffusion, d'observation historisée ou de lien durable entre unité légale, établissement, marché et signal |

Les recherches et filtres actuels sont exécutés à la demande dans le navigateur. Les paramètres de recherche sont donc visibles dans le navigateur ; aucune donnée confidentielle ne doit être saisie dans ces recherches avant décision sur le traitement et les protections appropriés.

## 4. Anomalies et écarts structurants

| # | Gravité | Emplacement / fait | Conséquence | Correction recommandée |
|---|---|---|---|---|
| 1 | **Bloquant avant CRM** | `opportunity-search.js` rend directement les réponses BOAMP/BODACC ; aucun adaptateur vers `schemas/opportunite.schema.json` n'est trouvé. | Les champs, identifiants, dates et statuts ne sont pas garantis par un contrat commun ; les résultats ne peuvent pas être ingérés de manière reproductible. | Après arbitrage, définir et tester un adaptateur par source, versionner le mapping, valider chaque objet au point d'entrée et conserver les erreurs de mapping sans produire de fiche trompeuse. |
| 2 | **Bloquant avant CRM** | Le schéma d'opportunité est documentaire dans le runtime ; `provenance`, `recordType`, `deduplicationKey`, `qualification` et `crmLink` ne sont pas alimentés par les connecteurs. | La présence du schéma peut laisser croire à une traçabilité ou une liaison CRM déjà assurée ; les données réelles ne possèdent pas encore ces garanties. | Traiter ce schéma comme un contrat candidat à compléter et arbitrer ; ne pas annoncer son application tant que validation, tests et preuve d'exécution n'existent pas. |
| 3 | **Élevé** | `company-targeting.js` préfère le SIRET comme clé de déduplication avant le SIREN. L'interface annonce des « entreprises uniques ». | Plusieurs établissements d'une même unité légale peuvent rester plusieurs résultats : l'unité comptée n'est pas nécessairement une entreprise au sens du libellé. | Décider si le parcours cible une unité légale, un établissement ou les deux ; afficher les deux niveaux et dédoublonner selon une clé explicitement choisie, sans supprimer les établissements distincts. |
| 4 | **Élevé** | La déduplication des entreprises se limite à une réponse de recherche ; aucune déduplication des avis, signaux ou historiques BOAMP/BODACC n'est présente. | Une même donnée peut réapparaître à chaque recherche ; une fusion approximative risquerait aussi de réunir des avis ou entités distincts. | Prévoir une clé forte `(source, identifiant source)` et une revue de candidats sur empreinte secondaire ; ne jamais fusionner automatiquement sur le seul nom ou sur une similarité textuelle. |
| 5 | **Élevé** | `qualification` du schéma rassemble un état et quelques métadonnées, mais aucune collection d'évaluations ni d'événements de revue n'est prévue ; le runtime ne journalise pas les changements. | Une correction ou un rejet peut écraser la décision précédente ; la justification, l'auteur, la méthode et la preuve ne sont pas reconstructibles. | Séparer l'état courant de l'historique des évaluations et décisions ; conserver acteur, horodatage, motif, preuves, version de règle/modèle et transitions. |
| 6 | **Bloquant avant données client** | Aucun tenant, rôle, propriétaire, politique d'accès ou journal d'audit n'est présent dans le prototype. | Impossibilité de garantir la séparation du CRM interne MajestiOS, des clients et des espaces clients ; risque de divulgation croisée si un service était ajouté sans ces contrôles. | Concevoir et tester l'autorisation côté serveur, les rôles et les frontières de tenant avant tout stockage de données clients ; refuser par défaut et vérifier les accès interdits. |
| 7 | **Bloquant avant conservation** | Les conditions d'usage, finalités et durées de conservation ne sont pas rattachées aux fiches en cours de recherche ; le schéma réserve seulement `sourceConditionsRef`. | Stocker, réutiliser, enrichir ou prospecter à partir d'une source pourrait dépasser les usages permis ; une suppression ou opposition ne pourrait pas être propagée. | Faire valider pour chaque source les champs, finalités, droits de stockage/réutilisation, fréquence, durée et procédure de retrait ; garder un registre de sources versionné et bloquer l'ingestion non autorisée. |
| 8 | **Élevé** | BODACC rend visibles des structures telles que `listepersonnes`, `listeetablissements`, `jugement` et `acte`, sans modèle de minimisation CRM démontré. | La collecte durable pourrait inclure des données personnelles ou des détails non nécessaires à la finalité commerciale. | Cartographier champ par champ la nécessité, la sensibilité, les droits et la durée ; exclure les champs non nécessaires et séparer les faits publiés des notes internes. L'évaluation juridique reste à effectuer par les responsables compétents. |
| 9 | **Élevé** | Le module DINUM calcule un score indicatif, mais le résultat n'est pas relié à un avis dans une fiche durable et les limites sont seulement présentées dans l'interface. | Une correspondance peut être interprétée hors contexte comme une preuve de capacité, d'éligibilité ou de lien commercial. | Stocker, si autorisé, le critère, la version de méthode, les éléments justificatifs, les données manquantes et l'avertissement ; garder les décisions d'éligibilité et de contact humaines. |
| 10 | **À résoudre avant automatisation** | La cible documentaire décrit MajestiOS V.5 comme intelligence centrale, mais aucun déclencheur, permission ou événement CRM effectif n'est présent. | Un transfert ou contact automatique pourrait être confondu avec une suggestion, ou être déclenché à partir d'une hypothèse non vérifiée. | Définir les événements comme propositions versionnées ; exiger une permission explicite, une validation adaptée et une journalisation avant toute écriture sensible ou action externe. |

## 5. Modèle conceptuel recommandé — proposition à arbitrer

Le modèle doit représenter séparément les faits des sources, les entités commerciales, les analyses et les actions. Il ne prescrit ni base de données, ni framework, ni découpage de services.

### Objets de référence

1. **RegistreSource** — producteur, jeu, endpoint/documentation, schéma/version, licence et conditions, champs autorisés, finalités, limites, fréquence, date de validation et état d'intégration.
2. **ObservationSource** — source et identifiant natif, URL officielle, horodatages de publication/événement/collecte, version du mapping, empreinte du contenu si autorisée, état de collecte et référence à la politique applicable. Le contenu brut complet n'est conservé que si nécessaire et permis.
3. **UnitéLégale** et **Établissement** — objets distincts ; SIREN identifie l'unité légale et SIRET l'établissement. Les valeurs publiées et leurs observations restent traçables ; le nom seul n'est jamais une clé de fusion.
4. **OpportunitéMarché** — consultation et lots, échéance, acheteur publié, dates, source et état officiel. Un lot, une attribution et un contrat exécuté restent des objets ou relations distincts.
5. **SignalEntreprise** — événement BODACC ou autre signal autorisé, conservé distinct d'un marché public ; une hypothèse commerciale n'est pas un attribut factuel de la source.
6. **Évaluation / Qualification** — objet daté et révisable, lié à une opportunité, un signal ou une entreprise ; conserve critères, justification, preuves, données manquantes, auteur ou méthode, niveau de confiance et version.
7. **RelationCible** — rapprochement entre une opportunité/signal et une entreprise/établissement ; conserve méthode, score indicatif, statut de revue et preuve. Une correspondance incertaine reste une suggestion.
8. **ActivitéCRM** — tâche, note, interaction ou résultat ; finalité, responsable, statut, échéance, références, autorisation applicable et historique. Une campagne ou un contact externe n'est jamais créé par simple détection d'un signal.
9. **ÉvénementAudit / Transmission** — acteur, date, objet, action, motif, finalité, règle d'autorisation, destination, résultat et référence de corrélation ; couvre également refus, erreur, retrait et suppression.
10. **Espace / Tenant / Rôle** — périmètre d'accès séparant le CRM interne des espaces clients et chaque espace client des autres ; les associations et permissions sont vérifiées côté serveur.

### Relations conceptuelles

- Une observation source justifie un ou plusieurs faits normalisés ; le fait conserve la référence à cette observation.
- Une même unité légale peut avoir plusieurs établissements ; une recherche par établissement ne doit pas être présentée comme un nombre d'entreprises uniques sans agrégation.
- Une opportunité ou un signal peut avoir plusieurs observations et plusieurs évaluations successives.
- Une entreprise peut être rapprochée de plusieurs opportunités ; chaque rapprochement conserve sa propre justification et son propre statut.
- Une activité CRM est reliée aux objets qu'elle concerne et à son auteur/responsable ; ses changements n'effacent pas l'historique.
- Une transmission vers publication, veille, CRM interne, espace client ou prospection est un passage de circuit explicite, soumis à finalité et autorisation — pas une relation implicite créée par une clé CRM.

### Pipeline fonctionnel cible

```text
Source autorisée
  → réception et horodatage
  → contrôle de schéma et de provenance
  → normalisation non destructive
  → détection de doublons et rapprochements proposés
  → vérification de fraîcheur et de statut source
  → qualification humaine / assistée, avec preuves
  → décision explicite sur le circuit et la finalité
  → création ou mise à jour CRM autorisée
  → activité suivie, résultat et historique
```

Les catégories non connectées ne doivent pas entrer dans le pipeline comme si elles avaient fourni des résultats. Les recherches exploratoires restent temporaires tant qu'une décision de persistance n'a pas été prise.

## 6. Règles de normalisation et de dédoublonnage

### Opportunités et signaux

- Clé forte : identifiant natif qualifié par la source (`source + sourceId`), si l'identifiant est stable et validé.
- En l'absence de clé forte : conserver les observations séparées et proposer un rapprochement ; une empreinte de titre, acteur, dates et territoire peut aider à la revue, mais n'autorise pas une fusion silencieuse.
- Les avis liés (rectificatif, renouvellement, lots, attribution) doivent être reliés comme tels, sans être considérés par défaut comme doublons.
- Une mise à jour de la source crée une nouvelle observation/version lorsque cela est nécessaire à la traçabilité ; elle ne doit pas effacer l'état antérieur.

### Entreprises et établissements

- Normaliser les identifiants en chaînes et vérifier leur format ; SIREN et SIRET ont des rôles différents.
- Distinguer unité légale, établissement et établissement siège ; documenter les identifiants absents ou invalides plutôt que d'inventer une clé.
- Les rapprochements sans identifiant fort restent candidats à revue. Un nom normalisé ou une adresse partielle ne suffit pas à fusionner.
- Définir les indicateurs selon leur unité de compte : établissements distincts ou unités légales distinctes.

## 7. Séparation des circuits et contrôles humains

Le CRM interne MajestiOS est le référentiel commercial propre à MajestiOS ; il ne se confond ni avec une offre de CRM destinée aux clients ni avec leurs espaces de travail. La publication, la veille, le CRM et la prospection active restent des circuits distincts. Aucune fiche collectée n'est transmise automatiquement à un client ou à une campagne.

La recherche d'un signal, son éventuelle sauvegarde personnelle, sa qualification interne, sa transmission à un espace client et une prise de contact sont des actes différents. Pour chaque transmission future, les exigences de `AGENTS.md` s'appliquent : provenance, date, motif, finalité, autorisation, destination, statut et résultat.

L'IA peut proposer une classification, un rapprochement, une synthèse ou une prochaine action ; une proposition doit rester identifiable comme telle, avec provenance et version. L'autorisation, les transitions métier et l'exécution des actions restent déterministes et soumises aux permissions. Tout contact externe, export, publication, fusion sensible, changement de droits ou usage marketing doit suivre une approbation explicite adaptée.

## 8. Conservation, retrait et sécurité — exigences avant données réelles

- Définir une finalité et une durée par catégorie : données source, rapprochements, notes internes, demandes, interactions, pièces et journaux.
- Déterminer si la réponse brute est nécessaire ; préférer une référence ou une empreinte quand les droits et le besoin le permettent.
- Prévoir correction, opposition, retrait, expiration et suppression, avec propagation aux copies, index, caches, exports et données dérivées concernés.
- Définir les rôles internes, les accès clients, les limites d'export et les journaux d'accès ; appliquer le moindre privilège.
- Séparer les données internes de prospection, les données client confiées sous mandat et les données publiques ; ne pas réutiliser un jeu dans un autre circuit sans base et autorisation documentées.
- Évaluer les informations personnelles et les conditions applicables à la prospection avec les responsables compétents ; le présent audit ne constitue pas un avis juridique.
- Ne pas envoyer de données CRM/confidentielles aux fournisseurs IA avant définition des permissions, finalités, minimisation, contrats et règles de rétention.
- Prévoir sauvegarde, restauration, gestion d'incident, observabilité et contrôle des accès avant mise en production.

## 9. Décisions indispensables avant l'étape D

Les points ci-dessous sont des prérequis fonctionnels et de gouvernance ; le choix de fournisseur ou de base ne doit pas les précéder.

1. **Périmètre initial :** premier cas d'usage, territoire, catégories et populations d'utilisateurs ; distinguer explicitement recherche publique, signaux privés, CRM interne et espaces clients.
2. **Frontières de données :** propriétaire/responsable de chaque donnée, règles de partage entre MajestiOS et un client, et existence éventuelle d'un CRM client distinct.
3. **Sources et droits :** champs autorisés, finalités, stockage/caching, fréquence, attribution, réutilisation commerciale, restrictions et conditions de retrait, source par source.
4. **Identité canonique :** rôle respectif de SIREN, SIRET et identifiants natifs ; unité de compte des recherches ; règles de rapprochement et de résolution manuelle.
5. **Cycle de vie :** états distincts pour collecte, statut officiel, qualification, publication, CRM et prospectabilité ; acteur habilité à chaque transition.
6. **Historique probant :** informations à conserver lors d'une modification, d'un rejet, d'une fusion, d'une correction ou d'une suppression ; durée et accès aux journaux.
7. **Transmissions :** cas qui peuvent créer un lien CRM ou alimenter une veille/espace client ; finalité, autorisation requise, contrôleur et résultat attendu.
8. **Actions commerciales :** conditions de ciblage, gestion des oppositions, revue humaine, validation des contacts et interdiction des envois automatiques par défaut.
9. **Rétention et suppression :** durées par donnée et événement, exceptions documentées, demandes de retrait et propagation aux dérivés.
10. **Rôle de l'IA :** tâches permises, sources accessibles, présentation de l'incertitude, approbation des écritures et actions interdites sans validation.
11. **Critères techniques :** exigences de disponibilité, volumes, latence, sauvegarde/restauration, audit, coût et portabilité. Les comparer avant de décider monolithe/services, base, hébergement, identité, file de tâches ou fournisseur IA.
12. **Acceptation du contrat :** décider si `schemas/opportunite.schema.json` est le point de départ, puis préciser versionnement, validation, champs obligatoires conditionnels, observations multiples et modèle d'historique.

**Porte de sortie recommandée :** ne commencer l'étape D (socle serveur et persistance) qu'après arbitrage des points 1 à 9, validation du modèle conceptuel et d'un scénario de bout en bout, puis définition des tests d'isolation, d'autorisation, de rétention, de retrait et de restauration. Le choix technique peut alors être comparé sur des critères mesurables.

## 10. Plan de travail recommandé après arbitrage

1. **Contrat et échantillon** — obtenir des exemples autorisés par source, établir un mapping, tester les champs manquants et versionner les contrats ; ne pas stocker de données réelles au-delà de l'échantillon autorisé.
2. **Scénario vertical documentaire/test** — suivre une annonce BOAMP et un signal BODACC depuis la source jusqu'à une qualification et une action CRM simulées, avec les preuves, erreurs et refus attendus.
3. **Modèle de permissions et de cycle de vie** — définir les acteurs, transitions, circuits et contrôles avant le backend.
4. **Comparaison technique** — comparer options serveur, données, identité, journalisation et tâches sur les exigences décidées, sans présélectionner un fournisseur.
5. **Prototype serveur isolé** — seulement après validation explicite de l'architecture et du périmètre ; commencer par un environnement de test, des données minimales autorisées et des contrôles d'accès vérifiables.
6. **CRM opérationnel** — procéder par lots testables ; aucune campagne, écriture IA ou transmission client n'est activée par défaut.

## 11. Contrôles et limites de cet audit

**Contrôles effectués :** lecture des contrats et modules de recherche/qualification, des pages CRM et espace membre via les références V5, des documents de modèle de données et de traitement BODACC, des règles de gouvernance et des audits des lots précédents ; recherche ciblée de stockage, base, authentification, tenant et références CRM dans les fichiers JavaScript/JSON/HTML.

**Non exécutés :** tests unitaires, tests Playwright, appels réels aux APIs, validation de licence/conditions d'utilisation, revue juridique, test d'authentification ou de cloisonnement, test de persistance et test d'un parcours CRM. Ces capacités n'existent pas encore ou nécessitent des vérifications distinctes.

**Conclusion de validation :** aucun changement métier, connecteur, stockage, backend, schéma exécutable ou choix technologique n'a été ajouté dans ce lot. Ce document décrit l'existant observé et une proposition d'architecture fonctionnelle à arbitrer.
