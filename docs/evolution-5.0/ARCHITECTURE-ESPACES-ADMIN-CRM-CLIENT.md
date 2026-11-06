# Architecture des espaces MajestiOS — cadrage et audit initial

> Branche auditée : `evolution-5.0-clean-preview`  
> Projet Supabase : `awtgrjnpckgxsdpfrnhg`  
> Date : 6 novembre 2026  
> Statut : audit initial en lecture seule — aucune modification applicative ou base de données effectuée.

## 1. Décisions de cadrage

- **MajestiOS est la plateforme / la caserne.**
- **L'administration générale** est le niveau de pilotage supérieur. Elle doit disposer d'une vue globale et des droits d'administration nécessaires sur l'ensemble de la plateforme.
- **Le CRM** est le centre opérationnel intégré à l'administration, et non une application concurrente ou indépendante.
- **Les espaces de travail des clients** sont distincts des espaces internes. Ils donnent accès uniquement aux données de leur organisation et aux fonctionnalités que l'administration leur ouvre.
- Chaque rubrique conserve **sa propre identité graphique et fonctionnelle pendant sa phase de construction et de stabilisation**. L'harmonisation transversale intervient ensuite, sans effacer les identités qui auront fait leurs preuves.
- L'immeuble interactif, ses visuels, son architecture, ses libellés, ses zones cliquables, ses liens et son intégration sont **hors périmètre et intouchables** dans ce chantier.

## 2. État vérifié dans le dépôt

### 2.1 CRM existant

Fichiers examinés :
- `crm.html` — blob SHA `c75dc3f94932c5d25a3d24caa0f6cf42c53eea32`
- `crm-page.js` — blob SHA `190c75135f91d2769e5ece9c8eaf1d10b2ffefe6`
- `crm-client.js` — blob SHA `1aecd591b95cb92cc7dcce52b8a8ccdb9bbc2f21`

Le CRM présente déjà :
- entreprises, contacts, opportunités et activités ;
- qualification et modification de fiches ;
- historique des activités ;
- relances persistantes et classement des échéances ;
- connexion Supabase et vérification de l'appartenance à une organisation interne.

Constat UX vérifié : `crm.html` reprend actuellement l'en-tête et la navigation du site public, avec un retour au site public et un retour à l'espace membre. Le CRM n'a donc pas encore une coque de navigation interne clairement distincte.

### 2.2 Espace client actuel

Fichier examiné :
- `espace-membre.html` — blob SHA `86a87fed22af04046b6189fb03582395c789994d`

L'espace actuel est principalement une page de présentation et d'inscription. Les rubriques « Vos dossiers », « Votre activité » et « Vos échanges » sont explicitement des aperçus, pas des outils opérationnels. La page contient aussi un accès interne au CRM, ce qui mélange les environnements client et équipe.

Le parcours d'inscription crée ou provisionne un espace d'organisation via la fonction Supabase `provision-client-workspace`, appelée depuis `auth-espace-membre.js`.

### 2.3 Charte graphique actuelle

Fichier examiné :
- `charte-majestios.css` — blob SHA `71f46c6bb1de3a670b5556e8729c3fae0e6a36a1`

La feuille définit une charte globale bleu nuit / acier / or et indique qu'elle est chargée en dernier sur 32 pages. Cette centralisation explique en partie pourquoi des rubriques différentes héritent d'une même ambiance. Pour le chantier actuel, il ne faut pas remplacer cette charte globalement : chaque espace devra être isolé et personnalisé progressivement, sans régression sur le site public ni sur l'immeuble.

## 3. État vérifié dans Supabase

### 3.1 Fondations existantes

Les migrations enregistrées comprennent notamment :
- `majestios_core_multitenant_foundation`
- `harden_private_authorization_and_fk_indexes`
- `enforce_tenant_relationship_integrity`
- `bootstrap_first_internal_admin`
- `enforce_crm_editor_roles`
- `atomic_client_workspace_provisioning`
- `persistent_crm_reminders`
- `sync_crm_reminder_lifecycle`
- `complete_crm_reminder_with_activity`
- `grant_crm_record_updates`

Les tables CRM déjà présentes incluent `organizations`, `organization_members`, `businesses`, `contacts`, `opportunities`, `activities`, `client_requests`, `privacy_acknowledgments` et `crm_reminders`.

Les tables métier examinées ont RLS activé. Les politiques consultées s'appuient notamment sur `private.is_org_member`, `private.is_org_editor`, `private.is_org_admin` et `private.is_internal_staff`. La séparation par organisation existe donc déjà dans le socle ; elle doit être préservée et testée, pas remplacée par un simple masquage d'interface.

### 3.2 Modèle d'appartenance

- `organizations` porte notamment `name`, `slug` et `kind`.
- `organization_members` relie `user_id` et `organization_id`, avec un champ `role`.
- `profiles` porte le nom d'affichage et le téléphone.

Le client CRM actuel recherche une organisation de type `internal` et vérifie le rôle de l'utilisateur. Il bloque explicitement le rôle `viewer` pour les opérations d'écriture. Les valeurs complètes de rôles et les règles d'habilitation doivent être auditées avant de définir la matrice finale.

### 3.3 Alertes de sécurité à traiter dans le bon ordre

L'analyse Supabase a remonté deux avertissements :
1. La fonction `public.complete_crm_reminder(uuid)` est une fonction `SECURITY DEFINER` exécutable par le rôle `authenticated`. Son exposition doit être vérifiée au regard de son contrôle interne et de son usage métier.
2. La protection contre les mots de passe compromis est désactivée.

Ces avertissements ne justifient pas une modification précipitée. Ils doivent être documentés, évalués et corrigés de façon contrôlée avant d'élargir les accès.

## 4. Architecture cible des environnements

### A. Administration générale

Une coque d'administration dédiée, avec sa propre navigation et son identité visuelle temporaire :
- vue générale et indicateurs de pilotage ;
- gestion des utilisateurs, organisations et rôles ;
- attribution des accès aux modules CRM ;
- gestion des demandes et dossiers clients ;
- accès aux fonctions internes et aux paramètres de la plateforme ;
- accès complet aux données dans le cadre des droits administrateur, avec journalisation des opérations sensibles.

### B. CRM — centre opérationnel

Le CRM devient un module de l'administration :
- entreprises et contacts ;
- pipeline d'opportunités ;
- activités et historique ;
- relances ;
- affectation des dossiers et collaborateurs ;
- suivi des missions confiées aux équipes.

Les intitulés militaires sont une métaphore d'organisation. Les rôles techniques doivent rester explicites et compréhensibles dans l'interface ; ils ne doivent pas être confondus avec les rôles Supabase déjà en place.

### C. Espace client

Une application de travail distincte, avec une identité visuelle propre et une navigation adaptée :
- **Entreprise** : profil, informations administratives et documents ;
- **Documents** : consultation et téléchargement à nouveau des pièces déposées, dont le Kbis ;
- **Dossiers d'appels d'offres** : création d'un dossier, checklist des pièces, dépôt de documents, références et éléments de candidature, progression et échanges ;
- **Développement commercial** : accès aux opportunités, contacts, demandes ou suivis expressément partagés par l'équipe ;
- **Échanges et demandes** : communication avec MajestiOS.

L'administration configure les fonctionnalités accessibles et les données partagées. L'isolation des données entre organisations doit être garantie par RLS côté base, jamais seulement par l'interface.

## 5. Règles graphiques pendant la construction

1. Ne pas imposer le bleu nuit à tous les espaces.
2. Ne pas inventer maintenant une palette finale commune.
3. Définir une identité propre à chaque rubrique au moment où ses fonctions sont construites : ambiance, fonds, couleurs, navigation, composants et densité d'information.
4. Ne pas réutiliser automatiquement les mêmes cartes, barres ou menus si cela nuit à la compréhension de la mission.
5. Après stabilisation fonctionnelle, établir une harmonisation de second niveau : typographie, accessibilité, cohérence des interactions et qualité des composants, tout en conservant des identités distinctes.

## 6. Plan de travail contrôlé

### Lot 1 — Cartographie complète (lecture seule)
- retrouver toutes les routes et pages d'administration déjà existantes ;
- inventorier les rôles, fonctions, contrôles d'accès et Edge Functions ;
- vérifier les politiques RLS et les fonctions privées ;
- dresser la liste des fonctionnalités réellement opérationnelles et des aperçus non fonctionnels ;
- relever les dépendances et les risques de régression.

### Lot 2 — Administration générale
- définir une navigation et une coque propres à l'administration ;
- intégrer le CRM comme module dans cette navigation ;
- établir la matrice des rôles et des permissions ;
- préserver les routes et les fonctions existantes utiles.

### Lot 3 — CRM
- corriger l'orientation et la navigation ;
- organiser les modules par missions ;
- vérifier chaque action, historique, affectation et relance ;
- ne pas créer de tables parallèles si le modèle existant suffit.

### Lot 4 — Espace client
- séparer clairement le parcours client du parcours interne ;
- construire les fonctionnalités documentaires et le dossier d'appel d'offres ;
- ouvrir les fonctions CRM au cas par cas ;
- vérifier l'isolation entre organisations.

### Lot 5 — Stabilisation et harmonisation
- tests de navigation, permissions, responsive et accessibilité ;
- vérification des liens et parcours de bout en bout ;
- harmonisation graphique seulement après validation des rubriques.

## 7. Garde-fous non négociables

- Aucun changement sur l'immeuble interactif ou ses dépendances.
- Aucune migration, modification de données, de fonction ou de politique Supabase sans validation explicite.
- Aucun déploiement de production ni fusion sans validation explicite.
- Pas de refonte générale : conserver les fondations utiles et intervenir par lots réversibles.
- Chaque affirmation sur l'existant doit distinguer le vérifié, le déduit et l'hypothèse.
- Chaque lot doit comporter un contrôle anti-régression.

## 8. Prochaine action technique

Terminer le Lot 1 en retrouvant et cartographiant les routes d'administration existantes, les fonctions de provisionnement et la matrice réelle des rôles. À ce stade, les éléments inspectés prouvent la présence d'un CRM et d'un socle multi-organisation, mais ne suffisent pas encore à déclarer l'administration générale complète ni les fonctionnalités client opérationnelles.


## 9. Principe directeur ajouté — le CRM comme usine transversale d'intelligence

Le CRM ne se limite ni à un carnet d'adresses, ni à un pipeline commercial, ni à un simple moteur de traitement. Il constitue le **centre opérationnel, industriel et transversal de transformation de l'information en intelligence commerciale** de MajestiOS.

Il remplit deux fonctions indissociables :

1. **Le centre opérationnel** : piloter les entreprises, contacts, opportunités, activités, équipes, affectations, relances et historiques.
2. **La chaufferie transversale de MajestiOS** : fournir aux rubriques et espaces autorisés les données, analyses, documents, services et productions dont ils ont besoin, selon les habilitations définies par l'administration.

### 9.1 Chaîne de transformation

Les métaphores formulées par le porteur du projet décrivent les capacités attendues :

- **Aspirateur de compétition — collecte** : agréger des informations issues de sources externes et internes (notamment BODACC, BOAMP, marchés publics et privés, données d'entreprises, contacts, documents et historiques).
- **Composteur industriel — préparation** : nettoyer, normaliser, dédoublonner, rapprocher et structurer les données brutes.
- **Malaxeur d'intelligence artificielle — enrichissement et analyse** : croiser les informations, détecter les signaux, qualifier les entreprises et opportunités, produire des synthèses et recommandations.
- **Bétonnière — orchestration** : combiner en continu données, règles métier, tâches et contributions humaines pour alimenter les processus opérationnels.
- **Imprimante 3D — production** : fabriquer des livrables concrets adaptés aux besoins : fichiers ciblés, listes de prospection, dossiers commerciaux, dossiers de candidature et de réponse aux appels d'offres, rapports, tableaux de suivi, recommandations et contenus destinés aux espaces autorisés.

Cette chaîne doit rester contrôlable : provenance des données, date de collecte, transformations appliquées, niveau de confiance, validation humaine lorsque nécessaire, historique des traitements et traçabilité des diffusions.

### 9.2 Administration des recherches et automatisations

L'administration générale doit pouvoir piloter, depuis son environnement et en s'appuyant sur le CRM :

- des recherches ponctuelles dans les sources connectées, en premier lieu BODACC et BOAMP ;
- des recherches enregistrées et automatisées selon des critères configurables (activité/APE-NAF, département, type d'annonce ou de marché, taille d'entreprise et autres critères pertinents) ;
- la fréquence, le périmètre, les règles de qualification et les conditions d'arrêt ou de reprise des traitements ;
- la constitution de fichiers et sélections à partir des résultats collectés et qualifiés ;
- la diffusion d'un fichier ou d'un jeu de données choisi vers les destinataires choisis par l'administrateur : collaborateurs, équipes, clients ou groupes autorisés.

Le CRM exécute et coordonne la collecte, la préparation, l'enrichissement, la qualification, la production, l'historisation et la mise à disposition. L'administration définit les objectifs, critères, règles, destinataires et habilitations.

La diffusion doit être gouvernée : aperçu avant envoi, choix précis des colonnes et pièces, contrôle des droits par destinataire, journal de diffusion, date/version du fichier et possibilité de révoquer un accès lorsque le mode de partage le permet. Les données personnelles et les conditions d'utilisation des sources doivent être respectées.

### 9.3 Modèle de services transversaux

Le CRM ne doit pas devenir un accès universel et indistinct à toutes les données. Il expose des **services et ensembles de données autorisés** à chaque rubrique. Chaque espace ne reçoit que ce qui est nécessaire à sa mission et permis par les droits de l'utilisateur et de son organisation.

À distinguer dans la conception :
- collecte et connecteurs de sources ;
- stockage des données brutes et provenance ;
- normalisation et dédoublonnage ;
- qualification métier et enrichissement IA ;
- production de fichiers, dossiers et rapports ;
- distribution et partage contrôlés ;
- journalisation, audit et gouvernance des accès.

Ces blocs constituent une cible fonctionnelle à concevoir progressivement ; ils ne sont pas déclarés comme déjà implémentés dans le dépôt.

## 10. Clarification des responsabilités

- **Administration générale** : autorité de pilotage ; définit les recherches, automatisations, règles de diffusion, destinataires et habilitations ; dispose de la vue globale et des outils de contrôle.
- **CRM** : usine de transformation et centre de coordination ; collecte, prépare, rapproche, analyse, qualifie, produit et distribue les informations et livrables autorisés ; conserve les historiques utiles.
- **Intelligence artificielle** : capacité d'assistance au croisement, à l'analyse, à la qualification et à la production ; elle ne remplace pas la décision humaine sur les actions sensibles ou les partages.
- **Espaces de rubriques et espace client** : consomment les services et livrables qui leur sont explicitement ouverts, sans accès implicite au reste du CRM.
- **Utilisateur humain** : fixe les objectifs, arbitre, valide les décisions métier et conserve la maîtrise des actions engageantes.

## 11. Complément au plan de cartographie

Le Lot 1 doit également identifier, en lecture seule :
- les connecteurs, imports, fonctions ou tâches déjà présents pour BODACC, BOAMP et les autres sources ;
- les traitements de collecte, planifications, automatisations et éventuels cron/jobs ;
- les formats d'export, génération de fichiers et mécanismes de partage existants ;
- les journaux de collecte, de transformation, de génération et de diffusion ;
- les permissions permettant à l'administration de créer, exécuter, suspendre et distribuer des recherches ou fichiers.

Aucune de ces capacités ne doit être considérée comme opérationnelle avant vérification dans le code et dans les services connectés.


## 12. Résultats complémentaires du Lot 1 — contrôle du dépôt et du backend

Contrôle en lecture seule effectué après l'ajout du principe d'usine transversale. Les constats ci-dessous décrivent l'état observé au 6 novembre 2026 ; ils ne constituent pas une recette fonctionnelle complète.

### 12.1 Administration générale : interface non retrouvée

- [Vérifié — dépôt] L'arborescence de la branche evolution-5.0-clean-preview ne contient pas de page ou module applicatif identifié comme administration générale, tableau de bord admin ou cockpit. Les seuls éléments explicitement nommés administration sont des documents de cadrage et la migration de bootstrap du premier administrateur.
- [Vérifié — dépôt] MODULE-ADMIN-IA.md décrit un cockpit cible, ses niveaux d'autonomie et ses garde-fous. Il s'agit d'une spécification, pas d'une interface déjà livrée.
- [Conclusion] Il ne faut donc pas présenter le tableau de bord administrateur comme déjà opérationnel. Il reste à construire en préservant les fondations existantes.

### 12.2 État réel du backend au contrôle

- [Vérifié — Supabase] Les treize migrations du dépôt sont maintenant présentes dans l'historique du projet Supabase, dont le bootstrap administrateur, les rôles CRM, le provisionnement atomique et les relances persistantes. Cela actualise l'ancien état décrit dans ETAT-BACKEND-SUPABASE.md, qui signalait encore certaines migrations comme en attente.
- [Vérifié — Supabase] Une appartenance interne existe actuellement avec le rôle owner. Le rôle technique d'administration initiale est donc provisionné dans l'organisation internal.
- [Vérifié — Supabase] La seule Edge Function actuellement déployée est provision-client-workspace, active en version 3 avec vérification JWT activée.
- [Vérifié — Supabase] Le seul job pg_cron observé est la matérialisation des relances CRM toutes les cinq minutes (private.materialize_crm_reminders). Ce job n'est pas un moteur de recherches externes.
- [Vérifié — Supabase] Les tables métier observées restent celles du socle CRM et des espaces : organisations, membres, profils, entreprises, contacts, opportunités, activités, demandes client, accusés de prise de connaissance et relances. Aucun registre de collecte BODACC/BOAMP, de campagnes de recherche, de traitements d'import ou de lots de diffusion n'a été observé dans ces schémas.

### 12.3 Rôles et contrôles observés

- [Vérifié — Supabase] Les rôles stockés dans organization_members sont owner, admin, member et viewer.
- [Vérifié — Supabase] private.is_internal_staff() reconnaît comme équipe interne les membres owner, admin et member d'une organisation internal.
- [Vérifié — Supabase] private.is_org_admin() reconnaît owner et admin au sein d'une organisation donnée ; private.is_org_editor() reconnaît owner, admin et member.
- [Vérifié — Supabase] Les politiques RLS des tables métier cloisonnent la lecture par appartenance à l'organisation. Les écritures sont généralement réservées aux éditeurs ; les suppressions sont réservées aux administrateurs de l'organisation.
- [Vérifié — code] crm-client.js exige une appartenance à une organisation internal pour ouvrir le CRM interne et bloque les écritures pour viewer. Il n'implémente pas encore une matrice granulaire de permissions par rubrique, service ou action.
- [Point de vigilance] La métaphore Général / Colonel / officiers / équipes ne doit pas être traduite directement en renommant les rôles techniques existants. Il faudra définir une matrice métier claire, puis la faire appliquer côté serveur et par RLS.

### 12.4 Connecteurs, recherches et diffusion : capacités non livrées

- [Vérifié — code et backend observés] Le modèle opportunities.source_type prévoit les valeurs boamp et bodacc, et conserve une identité externe ainsi qu'une URL de source. Cela prépare la traçabilité des opportunités, mais ne prouve pas l'existence d'une collecte.
- [Vérifié — backend observé] Aucun connecteur BOAMP/BODACC, recherche automatisée, planificateur de collecte, dédoublonnage d'import, générateur de fichiers ou mécanisme de diffusion à des destinataires n'a été retrouvé dans les Edge Functions, tables métier et tâches planifiées observées.
- [Conclusion] La vision de l'aspirateur / composteur / malaxeur / bétonnière / imprimante 3D est une cible fonctionnelle à construire. Le CRM actuel est une fondation de gestion commerciale et de suivi, pas encore l'usine de collecte, d'intelligence et de distribution décrite par le projet.

### 12.5 Découpage recommandé pour le futur moteur d'intelligence

Sans créer de tables ni de fonctions à ce stade, la conception devra distinguer les domaines suivants :

1. Connecteurs et sources : registre des sources, conditions d'utilisation, méthodes d'accès, quotas et état de disponibilité.
2. Recherches et règles : critères, périmètres, fréquences, propriétaire, statut, date de prochaine exécution et limites.
3. Collecte brute : réponse source conservée avec identifiant externe, URL, date de publication et date de collecte.
4. Préparation : normalisation, dédoublonnage, rapprochement et journal des transformations.
5. Qualification et IA : scores, explications, signaux, niveau de confiance et validation humaine.
6. Production : sélections, exports, dossiers, rapports et fichiers versionnés.
7. Diffusion : destinataires, autorisations, aperçu, historique, expiration et révocation du partage.
8. Pilotage et audit : état des tâches, erreurs, reprises, coûts, quotas et journal des décisions.

Ces domaines sont des frontières de conception, pas une proposition de créer immédiatement huit modules ou huit tables. Leur découpage technique devra être établi après cartographie des usages et des sources.

### 12.6 Garde-fou de diffusion

La capacité donnée à l'administrateur de choisir qui reçoit quoi doit être puissante mais gouvernée. Une diffusion à un client ne doit jamais ouvrir par effet de bord l'accès à la base CRM interne. Il faut partager un livrable ou une vue précisément définie, avec un périmètre, une durée, une version et des droits explicites. Les exports contenant des données personnelles devront respecter les finalités, bases légales, droits des personnes et conditions d'utilisation des sources.


## 13. Cartographie détaillée des parcours et des limites d'autorisation — Lot 1

### 13.1 Parcours espace membre

- [Vérifié — dépôt] `espace-membre.html` charge `auth-espace-membre.js` et expose un dialogue d'inscription, de connexion et de récupération de mot de passe via Supabase Auth.
- [Vérifié — dépôt] Le provisionnement client passe par l'Edge Function `provision-client-workspace`. Le code versionné vérifie le jeton utilisateur côté serveur, l'adresse e-mail confirmée, l'origine autorisée et les données minimales avant d'appeler la RPC atomique `provision_client_workspace`.
- [Vérifié — Supabase] La fonction Edge déployée est active (version 3) et la RPC de provisionnement figure dans les migrations appliquées. Le parcours complet de bout en bout (e-mails, redirections, consentement, création et accès) reste à tester avec un compte de test dédié.
- [Point de vigilance — code] La fonction Edge versionnée vérifie aussi des valeurs de `user_metadata` pour la prise de connaissance de la notice. Ces métadonnées sont modifiables par l'utilisateur ; elles ne doivent pas être considérées seules comme une preuve forte de consentement. La procédure doit être revue avant de donner à cette trace une portée juridique.

### 13.2 Parcours CRM interne

- [Vérifié — dépôt] `crm.html` et `crm-page.js` constituent une première interface CRM ; `crm-client.js` expose les opérations sur entreprises, contacts, opportunités, activités et relances.
- [Vérifié — dépôt] Le client CRM exige une session authentifiée et une appartenance à une organisation de type `internal`. Il sélectionne cette organisation puis limite ses lectures à son identifiant.
- [Vérifié — dépôt] Le contrôle de rôle côté navigateur bloque les écritures pour `viewer`. Ce contrôle améliore l'expérience, mais la véritable autorité reste RLS et les fonctions PostgreSQL : un contrôle dans le navigateur n'est jamais une frontière de sécurité suffisante à lui seul.
- [Vérifié — dépôt] Les rôles `owner`, `admin`, `member` et `viewer` sont les rôles techniques actuellement utilisés. Il n'existe pas encore de permissions détaillées par fonction (recherche, export, diffusion, administration d'une équipe, gestion de connecteurs, etc.).
- [Limite fonctionnelle] Le CRM actuel est une interface opérationnelle de premier niveau, non un cockpit de commandement, ni un moteur de collecte, ni un atelier de production et diffusion de fichiers.

### 13.3 Séparation des espaces : problèmes d'expérience constatés

- [Vérifié — dépôt] `crm.html` conserve l'en-tête et la navigation du site public, ainsi qu'un lien de retour au site. L'espace interne n'a donc pas encore une navigation autonome et clairement identifiée.
- [Vérifié — dépôt] `espace-membre.html` conserve également la navigation publique et présente des cartes de prévisualisation, tandis que le CRM interne est exposé comme un lien. Les fonctions de consultation, de gestion des dossiers et d'échanges clients restent largement des éléments de présentation plutôt qu'un espace client complet.
- [Déduit] Ce mélange explique une partie de la désorientation déjà relevée : les trois environnements (site public, cockpit d'administration, CRM interne et espace client) ne sont pas encore séparés par des cadres de navigation et des identités fonctionnelles suffisamment explicites.
- [Décision de conception recommandée] Prévoir des cadres d'application distincts pour administration générale, CRM interne et espace client. Chaque cadre possède son propre repère de position, sa navigation contextuelle, son tableau de bord et ses actions principales. Les liens entre espaces doivent être explicites et soumis aux autorisations ; éviter les doubles flèches de retour et les navigations qui renvoient vers le site public sans raison métier.

### 13.4 Matrice de permissions à définir avant tout développement admin

Les rôles techniques actuels ne suffisent pas à représenter la hiérarchie métier souhaitée. La prochaine conception devra distinguer au minimum :

| Domaine | Questions de permission à trancher |
|---|---|
| Administration générale | Voir l'ensemble, inviter/suspendre, gérer les rôles, configurer les services, superviser les traitements |
| Recherches et sources | Créer, lancer, planifier, modifier, suspendre et consulter les recherches ; gérer les connecteurs et leurs quotas |
| Données CRM | Consulter, créer, qualifier, modifier, fusionner, archiver et exporter |
| Production | Générer, valider, versionner et télécharger les fichiers ou dossiers |
| Diffusion | Choisir les destinataires, partager, limiter la durée, révoquer et consulter le journal de diffusion |
| Espace client | Voir et modifier ses propres documents/dossiers ; consulter uniquement les opportunités, contacts et livrables explicitement partagés |
| IA et automatisations | Observer, analyser, recommander, préparer ou exécuter dans un périmètre autorisé ; demander une validation pour les actions sensibles |

Cette matrice doit être traduite en permissions côté serveur, contrôles RLS et tests d'accès croisé. Ne pas se contenter de masquer des boutons dans l'interface.

### 13.5 Ordre de travail proposé après la cartographie

1. Valider le modèle conceptuel des espaces et des responsabilités (administration générale, CRM-usine, espaces de rubriques, espace client).
2. Établir la matrice de permissions et les parcours de navigation, sans modifier l'immeuble interactif.
3. Concevoir l'intégration du cockpit d'administration au-dessus des fondations existantes.
4. Définir les contrats des connecteurs et du moteur de recherches BODACC/BOAMP avant de choisir les tables ou les tâches d'exécution.
5. Concevoir les services transversaux CRM et les formats de production/diffusion.
6. Développer en lots réversibles, avec tests RLS multi-tenant, tests de parcours et contrôle anti-régression.

Aucun changement applicatif, migration, déploiement ou modification de l'immeuble n'a été réalisé pendant cette cartographie.
