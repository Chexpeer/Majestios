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
