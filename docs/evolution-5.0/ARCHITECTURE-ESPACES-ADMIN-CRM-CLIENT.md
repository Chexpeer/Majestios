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


## 14. Registre des métaphores et principes exprimés par le porteur du projet

**Règle documentaire :** toute métaphore, image ou formule imagée formulée par le porteur du projet et liée à MajestiOS, au CRM, à son fonctionnement ou à sa stratégie doit être conservée dans cette documentation. Ces expressions ne sont pas de simples plaisanteries : elles portent une intention fonctionnelle, une vision d'architecture ou un principe de pilotage. Elles doivent être reprises sans les dénaturer, puis explicitées en exigences concrètes. Toute nouvelle métaphore exprimée dans les échanges futurs devra être ajoutée au présent registre ou à la section métier correspondante.

### 14.1 Le CRM-usine : les métaphores de transformation

Expression exacte du porteur du projet :

- **« Le CRM n'est pas seulement le moteur de traitement... c'est l'aspirateur de compétition... le composteur industriel, le malaxeur de l'intelligence artificielle, la bétonnière chinoise... l'imprimante 3D !!! »**

Interprétation fonctionnelle à préserver :
- aspirer : collecter largement et efficacement les données utiles ;
- composter : nettoyer, trier, normaliser et éliminer les éléments sans valeur ou les doublons ;
- malaxer : croiser les données, les règles métier et l'intelligence artificielle pour en tirer une qualification exploitable ;
- bétonner / orchestrer : faire travailler ensemble les flux, traitements, équipes et contributions ;
- imprimer en 3D : produire des résultats tangibles, structurés et adaptés à chaque usage (fichiers, dossiers, rapports, listes, recommandations et espaces de travail alimentés).

La formule « bétonnière chinoise » doit rester attribuée au porteur du projet et ne doit pas être remplacée par une expression édulcorée dans les citations. Son sens fonctionnel est celui d'une orchestration robuste et soutenue des opérations.

### 14.2 MajestiOS et son CRM : « une Rolls avec un moteur de F1 »

Expression exacte du porteur du projet :

- **« On a une Rolls avec un moteur de F1... on va pas se plaindre !!! »**

Cette image exprime la complémentarité entre :
- la plateforme MajestiOS, son architecture, ses espaces et son expérience globale — la « Rolls » ;
- le CRM et ses fondations Supabase, qui constituent le moteur opérationnel puissant — le « moteur de F1 ».

Conséquence de conception : ne pas opposer la plateforme et le CRM, ni reconstruire l'un à côté de l'autre. Il faut faire fonctionner ensemble la plateforme et le moteur existant, exploiter les fondations déjà construites et ne développer que les capacités manquantes. La métaphore n'autorise pas à considérer le moteur comme achevé : les connecteurs BODACC/BOAMP, le moteur de recherche, la transformation industrielle et la diffusion restent à construire et à vérifier.

### 14.3 La caserne et la chaîne de commandement

Métaphores d'organisation déjà formulées par le porteur du projet :
- **MajestiOS est la plateforme / la caserne.**
- **L'administration générale est le Général en chef.**
- **Le CRM est le Colonel et la « chaufferie qui alimente tous les étages ».**
- Les équipes et collaborateurs sont comparés à des officiers et personnels d'exécution.

Sens fonctionnel :
- l'administration fixe les objectifs, les règles, les autorisations et les destinataires ;
- le CRM centralise et exécute les opérations de transformation et de coordination ;
- les rubriques et espaces consomment les services et livrables auxquels ils sont autorisés.

Cette métaphore décrit l'organisation fonctionnelle, pas les rôles techniques de la base. Elle ne doit pas conduire à renommer ou détourner les rôles Supabase existants (owner, admin, member, viewer).

### 14.4 Première stratégie de recherche : apprendre avant d'industrialiser

Décision exprimée par le porteur du projet :
- les recherches seront **ponctuelles et ciblées au départ** ;
- l'administrateur commencera par **sa région et la région parisienne** ;
- les critères et méthodes seront adaptés en fonction des résultats observés ;
- l'extension à une exploitation industrielle interviendra ensuite, après cette phase d'apprentissage.

Conséquences fonctionnelles :
1. première version centrée sur le lancement manuel de recherches BODACC et BOAMP ;
2. sélection précise des territoires et critères ;
3. restitution lisible des résultats et de leur provenance ;
4. mesure de la pertinence, des doublons et des opportunités réellement exploitables ;
5. ajustement des critères à partir des résultats ;
6. industrialisation seulement lorsque le fonctionnement aura été éprouvé.

Ne pas commencer par un dispositif de collecte massive ou des automatisations complexes. La priorité est un outil de recherche ponctuelle efficace, contrôlable et adaptable.

### 14.5 Consigne de conservation des formulations

Le registre doit être enrichi au fil du projet. Conserver les formulations originales entre guillemets lorsque leur sens dépend de leur expression exacte, puis ajouter une traduction fonctionnelle. Ne pas remplacer silencieusement les métaphores du porteur du projet par des slogans inventés par l'assistant. Distinguer systématiquement :
- la citation originale ;
- le sens métier compris ;
- les conséquences d'architecture ou de fonctionnement ;
- ce qui existe déjà et ce qui reste à construire.


### 14.7 Le septième ciel et les couleurs : une expérience qui émerveille

Formulations rappelées par le porteur du projet :

- **« Le septième ciel !! »**
- **« Des couleurs !! »**
- Formule de positionnement déjà exprimée dans le projet : **« MajestiOS, l'IA qui vous en fait voir de toutes les couleurs. »**

Sens métier à retenir, sans figer au-delà de ce qui a été exprimé :
- « Le septième ciel » évoque une expérience qui dépasse la simple satisfaction fonctionnelle : une impression d'élévation, de plaisir et d'accomplissement.
- « Des couleurs » rappelle que MajestiOS doit offrir une expérience vivante, expressive et riche, et ne pas être réduit à une interface uniforme ou austère.
- La formule « vous en faire voir de toutes les couleurs » porte une promesse de découverte, de diversité et d'efficacité visible. Elle appartient au ton et à l'identité de MajestiOS.

Conséquences de conception :
- préserver la personnalité visuelle des rubriques et leur diversité graphique ;
- faire des couleurs un langage utile à la compréhension, à l'orientation et à la mise en valeur des informations, pas un décor arbitraire ;
- rechercher une expérience enthousiasmante et fluide, sans sacrifier la lisibilité, l'accessibilité ni la cohérence fonctionnelle.

**Limite explicite :** cette métaphore ne constitue aucune autorisation de modifier l'immeuble interactif, ses couleurs, ses visuels, ses étages, ses liens ou son architecture. Elle documente une intention d'expérience et de personnalité visuelle ; sa traduction devra respecter les garde-fous déjà posés.

À ce stade, il s'agit d'une intention de conception, pas de la preuve qu'une expérience « septième ciel » est déjà livrée.

### 14.6 Le rétroviseur : apprendre de l'erreur avant toute marche arrière

Formulation originale exacte du porteur du projet :

- **« Si tu commets une erreur, regarde le rétroviseur avant de faire marche arrière. »**
- Formulation initiale spontanée : « si tu commet une erreur regarde le rétroviseur avant de faire marcher arrière ».

Sens métier et règle de conduite pour MajestiOS :
- avant toute correction, revenir sur l'origine de l'anomalie et comprendre ce qui l'a provoquée ;
- consulter l'historique des modifications, les décisions précédentes, la documentation et les contrôles déjà effectués ;
- préserver l'état existant et effectuer une sauvegarde avant une opération risquée ;
- corriger la cause sans détruire les éléments qui fonctionnent ;
- vérifier le résultat et les éventuelles régressions ;
- documenter la correction et conserver la trace de l'anomalie jusqu'à sa résolution et sa validation.

**Règle opérationnelle :** aucune marche arrière précipitée, aucun retour de branche ou remplacement de version sans examen du rétroviseur. Une anomalie documentée n'est pas une anomalie résolue : elle reste suivie jusqu'à correction et validation.

Cette métaphore complète les garde-fous de sauvegarde, de réversibilité, d'historisation et de contrôle anti-régression du projet.

## 15. Schéma directeur opérationnel de l'administration générale et du CRM intégré

Cette section transforme les décisions précédentes en organisation cible exploitable pour la conception des écrans. Elle ne constitue pas une déclaration de fonctionnalités déjà livrées.

### 15.1 Principe d'organisation : une administration, un CRM intégré

Le CRM est un module central de l'administration générale, et non une application concurrente à côté d'elle.

Conséquences :
- l'administrateur entre dans un environnement d'administration unique ;
- il accède au CRM depuis la navigation de cette administration ;
- le CRM conserve ses propres fonctions métier, ses écrans et ses données existantes ;
- les outils de pilotage (utilisateurs, équipes, permissions, recherches, automatisations, diffusion et supervision) relèvent de l'administration ;
- le CRM fournit les données et opérations commerciales nécessaires à ces outils ;
- les accès clients restent dans un environnement séparé et ne donnent jamais accès à la navigation ni aux données internes du CRM.

L'intégration est donc une intégration fonctionnelle et de navigation. Elle n'implique ni fusion des bases, ni duplication du CRM, ni refonte de ses fondations Supabase.

### 15.2 Navigation cible de l'administration

La navigation d'administration doit répondre à trois questions en permanence : **où suis-je, sur quel périmètre j'agis, quelle action suis-je autorisé à effectuer ?**

Organisation fonctionnelle proposée :

1. **Vue générale** — état de la plateforme, activité récente, alertes et éléments nécessitant une décision.
2. **CRM** — entreprises, contacts, opportunités, activités, relances et affectations. C'est le centre opérationnel intégré.
3. **Recherches et sources** — recherches ponctuelles BODACC/BOAMP, critères, territoires, résultats, provenance et historique. Au démarrage, lancement manuel et ciblé.
4. **Production et fichiers** — sélections qualifiées, exports, dossiers et livrables. La génération et la diffusion ne seront activées qu'après définition des contrôles.
5. **Diffusion et destinataires** — choix des personnes, équipes, clients ou groupes autorisés, aperçu, validation et historique.
6. **Utilisateurs et organisations** — comptes, rattachements, invitations et état des organisations, selon les droits.
7. **Équipes et permissions** — affectations, responsabilités et droits par fonction.
8. **Supervision et journal** — traitements, erreurs, décisions, actions sensibles et historique.

Cette liste décrit des domaines de navigation. Elle ne commande pas de créer huit applications ou huit tables. Les écrans peuvent être livrés progressivement et certains domaines resteront masqués ou indiqués comme non disponibles tant qu'ils ne seront pas opérationnels.

### 15.3 Matrice métier de départ — à implémenter et tester ultérieurement

Les rôles techniques existants restent inchangés : `owner`, `admin`, `member`, `viewer`. La matrice ci-dessous est une proposition métier de départ, à valider contre les usages réels et à traduire côté serveur avant toute ouverture de droits.

| Capacité | Owner interne | Admin interne | Member interne | Viewer interne |
|---|---|---|---|---|
| Consulter le cockpit et les indicateurs | Oui | Oui | Selon affectation | Lecture autorisée |
| Consulter le CRM | Oui | Oui | Selon périmètre | Lecture seule |
| Créer et modifier des fiches CRM | Oui | Oui | Selon périmètre | Non |
| Qualifier et affecter une opportunité | Oui | Oui | Selon délégation | Non |
| Lancer une recherche ponctuelle | Oui | Oui si habilité | Non par défaut | Non |
| Configurer ou automatiser une recherche | Oui | Oui si habilité | Non | Non |
| Préparer un fichier ou livrable | Oui | Oui si habilité | Selon délégation | Non |
| Valider une diffusion | Oui | Oui si habilité | Non par défaut | Non |
| Gérer utilisateurs et organisations | Oui | Selon délégation | Non | Non |
| Modifier les permissions | Oui | Selon délégation explicite | Non | Non |
| Consulter les journaux de supervision | Oui | Oui | Selon périmètre | Non par défaut |
| Accéder aux données d'un espace client | Selon habilitation et besoin | Selon habilitation et besoin | Seulement si autorisé | Seulement si autorisé |

**Précaution :** les mentions « selon affectation », « selon délégation » et « si habilité » impliquent des permissions métier supplémentaires qui ne sont pas démontrées dans le backend actuel. Elles ne doivent pas être simulées par de simples conditions JavaScript ou par le masquage de boutons. Elles nécessiteront une conception et des contrôles serveur/RLS adaptés, après validation.

Les permissions de l'administration interne ne doivent pas être confondues avec celles des organisations clientes. Les clients ne deviennent pas membres de l'organisation internal et n'héritent d'aucun droit d'administration.

### 15.4 Repères de navigation obligatoires

Chaque écran d'administration doit afficher clairement :
- l'environnement actif : **Administration** ;
- la rubrique et le sous-dossier actifs ;
- le périmètre de données concerné (plateforme, équipe, organisation ou dossier) ;
- l'utilisateur et son niveau d'accès ;
- une navigation principale stable et une navigation locale cohérente ;
- une action de retour unique, explicite et prévisible.

Le CRM doit afficher le même cadre d'administration lorsqu'il est ouvert comme module, tout en conservant une navigation locale propre à ses fonctions. Il ne doit pas reprendre la navigation du site public ni afficher plusieurs flèches concurrentes. L'espace client conserve son propre cadre et ne montre jamais les repères internes.

### 15.5 État des capacités : ne pas confondre cible et existant

| Domaine | État établi dans l'audit | Traitement prévu |
|---|---|---|
| CRM entreprises, contacts, opportunités, activités, relances | Socle et première interface présents | Préserver, intégrer à la navigation admin, tester |
| Administration générale | Cockpit applicatif non retrouvé | Concevoir puis construire par lots |
| Utilisateurs et organisations | Fondations Supabase présentes | Construire l'interface admin sans casser le modèle |
| Permissions fines par fonction | Non retrouvées | Définir puis sécuriser côté serveur |
| Recherche BODACC/BOAMP | Sources non connectées dans le backend observé | Commencer par des recherches manuelles ciblées |
| Automatisation des recherches | Non retrouvée | Après validation des recherches ponctuelles |
| Production de fichiers | Pas de chaîne complète retrouvée | Concevoir après qualification |
| Diffusion contrôlée | Pas de mécanisme complet retrouvé | Concevoir avec aperçu, droits et journal |
| Espace client opérationnel complet | Parcours partiel / écrans de présentation | Développer séparément et progressivement |

### 15.6 Ordre de réalisation recommandé

1. Valider cette organisation fonctionnelle et la matrice de départ.
2. Cartographier les routes et composants existants afin de réutiliser ce qui fonctionne.
3. Concevoir la coque de navigation Administration, sans toucher au site public ni à l'immeuble.
4. Intégrer le CRM existant dans cette coque, sans réécrire ses fonctions métier.
5. Tester les parcours et les droits existants avec des comptes de test.
6. Ajouter ensuite les capacités d'administration manquantes, une par une.
7. Ouvrir les recherches BODACC/BOAMP manuelles après définition de leur contrat et de leur traçabilité.
8. N'ajouter automatisation, production et diffusion qu'après validation de la première chaîne manuelle.

**Périmètre de cette étape documentaire :** aucun code applicatif, aucune migration, aucune donnée Supabase, aucune politique RLS, aucun déploiement et aucun élément de l'immeuble interactif ne sont modifiés par cette proposition.



## 10. Réaudit du code applicatif — 6 novembre 2026, 20 h 33

Cette section actualise les constats à partir du code réellement présent sur le HEAD de la branche. Elle prévaut sur les audits antérieurs lorsqu'ils décrivent un état plus ancien.

### 10.1 Rectification importante : le CRM est déjà opérationnel sur son périmètre actuel

La lecture de `crm.html`, `crm-page.js` et `crm-client.js` confirme que le CRM ne se limite plus à une page de présentation. L'interface contient des formulaires et des traitements raccordés au backend Supabase pour :

- créer et consulter des entreprises ;
- créer et consulter des contacts ;
- créer et consulter des opportunités ;
- enregistrer et consulter des activités ;
- modifier et qualifier les fiches entreprises, contacts et opportunités ;
- historiser les modifications sous forme d'activités ;
- afficher les relances persistantes, les classer par échéance et les marquer comme traitées ;
- vérifier la session et l'appartenance à une organisation de type `internal` ;
- empêcher les écritures depuis l'interface pour le rôle `viewer`, en complément des politiques RLS.

**Conséquence documentaire :** le constat F-04 de l'ancien audit du lot 6 (« CRM informatif, sans fiches opérationnelles ») est désormais obsolète au regard du code actuel. Il ne doit plus être repris comme description de l'état présent. Cela ne vaut toutefois pas recette de bout en bout avec un compte interne réel ni validation de toutes les règles RLS.

### 10.2 Ce qui manque encore au CRM

Le périmètre CRUD actuel ne prouve pas l'existence des capacités industrielles cibles. Aucun écran ni flux opérationnel complet n'a été établi ici pour :

- lancer des recherches BODACC/BOAMP depuis l'administration ;
- enregistrer et rejouer des recherches ciblées ;
- importer, normaliser et dédoublonner des lots ;
- qualifier automatiquement des résultats et les affecter à des collaborateurs ;
- générer des fichiers de prospection ou des dossiers ;
- choisir les destinataires et diffuser des livrables avec aperçu et journal ;
- exposer des services CRM gouvernés aux différentes rubriques.

Ces capacités restent à construire ou à vérifier séparément. La présence des valeurs `boamp` et `bodacc` dans le champ d'origine des opportunités n'est pas une preuve de connecteur actif.

### 10.3 Administration générale : absence d'interface applicative identifiée

La recherche dans les fichiers racine et l'examen des pages internes ont identifié les routes `crm.html` et `espace-membre.html`, mais aucune page applicative dédiée à une administration générale. Le document `MODULE-ADMIN-IA.md` est une spécification, pas une interface livrée.

La navigation de `crm.html` reprend encore l'en-tête du site public et propose un retour au site public ainsi qu'un retour à l'espace personnel. Il manque donc une coque interne d'administration qui fournisse un repère stable entre le poste de commandement et les modules qu'il pilote.

### 10.4 Espace client : parcours Auth présent, espace de travail incomplet

`espace-membre.html` et `auth-espace-membre.js` portent le parcours d'inscription/connexion et le provisionnement client. Les fonctions métier annoncées — documents, dossiers d'appels d'offres, échanges, demandes et opportunités partagées — ne sont pas encore démontrées comme un espace de travail opérationnel complet.

### 10.5 Périmètre de réalisation retenu pour le premier lot applicatif

Le premier lot applicatif doit se limiter à une coque de navigation d'administration et à son raccordement non destructif au CRM existant :

1. créer une entrée d'administration distincte du site public et de l'espace client ;
2. présenter le CRM comme module interne accessible depuis cette administration ;
3. conserver `crm.html`, `crm-page.js`, `crm-client.js`, les contrats Supabase et les tables existantes ;
4. ne modifier ni les migrations, ni les données, ni les politiques RLS, ni les fonctions Supabase ;
5. ne toucher à aucun fichier, ressource, lien, destination ou zone de l'immeuble interactif ;
6. ne pas activer de déploiement automatique, ne pas fusionner et ne pas promouvoir en production.

Avant toute écriture applicative, le statut de la branche et de la PR doit être vérifié : la PR #38 est désormais fermée et fusionnée. La branche de prévisualisation n'est donc plus à traiter comme une PR en brouillon. La branche source V5 reste à préserver. Toute intervention doit rester cantonnée au périmètre explicitement autorisé et être accompagnée d'un point de retour ainsi que des contrôles adaptés.

**Statut de cette réaudit :** lecture du dépôt uniquement. Aucun fichier applicatif, aucune donnée, aucun schéma ou paramètre Supabase et aucun déploiement n'ont été modifiés.


## 11. Identité visuelle du poste de commandement — décision du 6 novembre 2026

**Décision validée par le porteur du projet :** l'administration générale (poste de commandement) adoptera une identité visuelle **gris chrome et gold**.

Cette palette caractérise l'environnement d'administration générale. Elle ne doit pas être étendue automatiquement au CRM, à l'espace client ou aux rubriques du site : chaque environnement conserve sa personnalité graphique et fonctionnelle.

Principes d'application à respecter lors de la réalisation :
- gris chrome comme base structurante de l'interface ;
- gold comme accent de hiérarchie, de repérage et d'action ;
- contraste, lisibilité et accessibilité prioritaires ;
- navigation sobre, précise et stable, sans surcharge décorative ;
- identité propre au poste de commandement, distincte de la charte du site public ;
- aucune modification de l'immeuble interactif, de son image, de ses libellés, de ses liens ou de ses zones cliquables.

**Statut :** choix graphique décidé ; palette détaillée, composants et déclinaisons d'états à définir lors de la construction de la coque d'administration.


## 16. Premier lot applicatif — poste de commandement chrome et gold

**Branche de réalisation :** `evolution-5.0-admin-cockpit`, créée depuis le `main` courant après fusion de la PR #38.  
**Périmètre :** coque de navigation et premier raccordement contextuel du CRM ; aucun changement de schéma ou de données.

### 16.1 Éléments livrés dans le code

- `administration.html` : entrée distincte pour le poste de commandement.
- `administration.css` : identité gris chrome et gold, navigation latérale responsive et cartes de modules.
- `administration.js` : vérification de session, appartenance à une organisation de type `internal` et rôle `owner` ou `admin` avant affichage du cockpit.
- `crm.html` : retrait de la navigation du site public au profit d'un repère interne « Administration générale / CRM interne » et d'un retour unique au poste de commandement.
- `site-files.json` : déclaration des trois nouvelles ressources pour le build statique.
- `verify-site.js`, `verify-architecture.js` et le workflow de vérification : contrôles de présence, de navigation, de syntaxe et test navigateur du verrouillage sans session via `tests/administration-access.browser.cjs`.

Le CRM reste servi par `crm.html`, `crm-page.js` et `crm-client.js`. Aucune fonction métier existante n'a été réécrite. Le cockpit présente le CRM comme premier module opérationnel ; les autres modules sont explicitement étiquetés « À construire ».

### 16.2 Contrôle d'accès et limites

Le navigateur confirme l'utilisateur avec Supabase Auth, lit ses appartenances, vérifie l'organisation interne et n'affiche le cockpit qu'aux rôles `owner` et `admin`. Ce contrôle d'interface améliore le parcours, mais **ne constitue pas à lui seul une frontière de sécurité** : toute future action d'administration devra être autorisée côté serveur et protégée par des politiques ou fonctions adaptées. Aucun bouton de recherche, d'export, de diffusion, de gestion des rôles ou de maintenance n'exécute une opération dans ce lot.

Le provisionnement du premier administrateur reste une opération distincte. La procédure de bootstrap versionnée n'est pas exécutée par cette interface ; aucune création de compte, attribution de rôle ou migration n'est réalisée ici. Si aucun membre interne avec rôle `owner` ou `admin` n'existe, le cockpit reste verrouillé.

### 16.3 Hors périmètre préservé

- aucune modification de table, migration, politique RLS, fonction Edge ou donnée Supabase ;
- aucun changement de `crm-page.js` ou `crm-client.js` ;
- aucune collecte BODACC/BOAMP, automatisation, génération de fichier ou diffusion ;
- aucune modification de l'immeuble interactif, de ses ressources, de ses libellés, de ses zones ou de ses liens ;
- aucune fusion vers `main` ni promotion en production.

**Statut :** code du premier lot présent sur la branche de réalisation ; validation CI et recette visuelle/authentifiée à effectuer avant toute ouverture ou promotion.

## 17. Premier écran de recherches ponctuelles BODACC / BOAMP — 6 novembre 2026

### 17.1 Vérification préalable des fondations

La lecture du schéma Supabase réel confirme que le CRM conserve les tables organizations, organization_members, businesses, contacts, opportunities, activities et crm_reminders, toutes avec RLS activée. La table opportunities possède les champs de provenance source_type, source_external_id, source_url, source_published_at et department_code. Les types de source acceptent déjà bodacc et boamp. Aucun connecteur BODACC ou BOAMP n'est présent dans les fonctions Edge actuellement déployées ; la seule fonction recensée est provision-client-workspace.

**Décision de préservation :** ne pas créer de table de recherche ou de résultats, ne pas ajouter de migration, ne pas modifier les politiques RLS, ne pas déployer de fonction Edge et ne pas écrire dans le CRM dans ce premier lot.

### 17.2 Écran livré sur la branche de réalisation

Les fichiers admin-recherches.html et admin-recherches.js ajoutent un écran interne accessible depuis le menu du poste de commandement et la carte « Recherches ciblées ». Le script est séparé pour être contrôlé par la vérification de syntaxe JavaScript de la CI.

Fonctions : choix BODACC/BOAMP ; territoires de départ Pays de la Loire et Île-de-France, avec option France entière ; département précis ; mot-clé ; filtre de famille BODACC ; aperçu de 10, 20 ou 50 résultats ; date, territoire, nature, résumé et lien officiel ; état explicite de requête ; contrôle d'accès session + appartenance à l'organisation interne + rôle owner/admin.

Sources raccordées en lecture : BODACC, jeu annonces-commerciales, API Explore v2.1 sur bodacc-datadila.opendatasoft.com ; BOAMP, jeu boamp, API Explore v2.1 sur boamp-datadila.opendatasoft.com. Les fiches officielles DILA mentionnent la Licence Ouverte 2.0 et signalent que les données peuvent contenir des données personnelles : la réutilisation doit respecter les conditions applicables et les règles de protection des données.

Les recherches sont manuelles. Aucun traitement périodique, export, import CRM, partage, e-mail ou diffusion n'est déclenché. Les résultats ne sont pas persistés ; « À qualifier » est un repère de travail et non une qualification enregistrée.

### 17.3 Limites métier explicites

BODACC et BOAMP sont des sources d'annonces et d'avis, pas un référentiel exhaustif des effectifs et codes APE/NAF. Le critère 5 à 15 salariés, l'exclusion des entreprises de plus de 15 salariés et l'enrichissement APE/NAF nécessiteront une étape de rapprochement distincte, notamment à partir de sources d'identification d'entreprises, avant intégration au CRM.

La sélection initiale des territoires est une configuration modifiable par l'administrateur ; elle ne constitue pas une géolocalisation automatique.

### 17.4 Contrôles et points restant à valider

Le manifeste inclut la page et son script ; le workflow vérifie la syntaxe du script. verify-site.js contrôle leur présence, l'exclusion de la page de l'indexation, les sources et le contrôle d'accès. Le test navigateur administration-access.browser.cjs vérifie aussi que la page de recherche et sa navigation restent masquées sans session. La validation réelle des requêtes dépend encore d'un essai navigateur authentifié avec un compte owner/admin et de la disponibilité/CORS des API DILA depuis la prévisualisation. Le dédoublonnage, le rapprochement SIREN/SIRET et l'import CRM restent hors périmètre.

Aucun changement de table, migration, RLS, fonction Edge, donnée Supabase ou immeuble interactif n'est effectué. Aucun déploiement Vercel, fusion dans main ou promotion en production n'est lancé.
