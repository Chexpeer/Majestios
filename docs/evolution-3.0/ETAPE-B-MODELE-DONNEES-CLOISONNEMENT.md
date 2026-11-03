# MajestiOS 3.0 — Étape B : modèle conceptuel des données et cloisonnement

**Version :** 0.1  
**Date :** 3 novembre 2026  
**Branche :** evolution-3.0  
**Statut :** proposition de conception soumise à validation  
**Dépendance :** étape A — architecture fonctionnelle et frontières des modules  
**Nature :** modèle conceptuel logique ; ni schéma SQL définitif ni base implémentée.

## 1. Objectif

Définir les grandes familles de données de MajestiOS, leur propriétaire fonctionnel, leurs relations et les règles de cloisonnement avant toute création de base de données.

Le modèle doit protéger trois périmètres distincts :
- l'organisation interne MajestiOS, dont le CRM ;
- chaque espace client, isolé des autres clients et de MajestiOS interne ;
- BrainOS, corpus documentaire séparé et soumis à des autorisations propres.

**Principe directeur : la proximité technique de deux données ne crée jamais un droit d'accès ou de partage.**

## 2. Décisions de modélisation proposées

1. Séparer les entités métier des données provenant des sources externes.
2. Conserver une provenance pour chaque signal, donnée importée ou document.
3. Distinguer entreprise, établissement et personne/contact.
4. Séparer un rapprochement proposé d'un rapprochement validé.
5. Séparer opportunité, signal, action commerciale et interaction réellement réalisée.
6. Séparer annonce soumise, décision de modération et projection publique.
7. Séparer l'organisation interne MajestiOS des tenants clients.
8. Ne jamais fusionner automatiquement une donnée client avec le CRM interne.
9. Conserver les décisions de transfert et leur finalité dans un registre dédié.
10. Traiter les oppositions et restrictions d'usage comme des contrôles actifs, pas comme de simples notes CRM.

Ces décisions sont des propositions de conception à valider ; elles ne décrivent pas des tables déjà créées.

## 3. Carte conceptuelle des données

~~~mermaid
erDiagram
    PRINCIPAL ||--o{ MEMBERSHIP : possède
    ROLE ||--o{ MEMBERSHIP : attribue
    TENANT ||--o{ MEMBERSHIP : regroupe
    TENANT ||--o{ CLIENT_WORKSPACE : contient
    CLIENT_WORKSPACE ||--o{ WORKSPACE_ITEM : expose
    PRINCIPAL ||--o{ WORKSPACE_ITEM : contribue

    SOURCE ||--o{ SOURCE_RECORD : publie
    SOURCE_RECORD ||--o{ SIGNAL : produit
    SIGNAL ||--o{ COMPANY_MATCH : rapproche
    COMPANY ||--o{ ESTABLISHMENT : comprend
    COMPANY ||--o{ CONTACT_RELATIONSHIP : entretient
    CONTACT ||--o{ CONTACT_RELATIONSHIP : est lié
    COMPANY ||--o{ COMPANY_MATCH : cible
    OPPORTUNITY ||--o{ SIGNAL : est documentée par

    COMPANY ||--o{ CRM_ACTIVITY : concerne
    CONTACT ||--o{ CRM_ACTIVITY : concerne
    CAMPAIGN ||--o{ COMMERCIAL_ACTION : planifie
    COMMERCIAL_ACTION ||--o{ CRM_ACTIVITY : génère

    PRINCIPAL ||--o{ ANNOUNCEMENT : soumet
    ANNOUNCEMENT ||--o{ MODERATION_DECISION : reçoit

    DATA_PURPOSE ||--o{ TRANSFER_DECISION : encadre
    SOURCE_RECORD ||--o{ TRANSFER_DECISION : origine
    TRANSFER_DECISION ||--o{ TRANSFER_FIELD : autorise

    PRINCIPAL ||--o{ AUDIT_EVENT : agit
    BRAIN_CORPUS ||--o{ DOCUMENT : contient
    DOCUMENT ||--o{ DOCUMENT_VERSION : versionne
~~~

Ce schéma est volontairement conceptuel. Il ne fixe ni les clés physiques, ni les cardinalités exhaustives, ni les contraintes SQL, ni le stockage des fichiers. Les relations d'appartenance et les frontières de sécurité doivent être précisées dans le modèle logique détaillé.

## 4. Domaines de données et propriété

| Domaine de données | Objets conceptuels | Propriétaire fonctionnel | Périmètre de sécurité |
|---|---|---|---|
| Identité | Principal, compte, session, rôle, permission | Identité et accès | Global, avec séparation des rôles internes et clients |
| Organisation cliente | Tenant, membre, invitation, appartenance | Gestion des espaces clients | Un tenant à la fois ; aucune visibilité croisée |
| Référentiel CRM | Entreprise, établissement, contact, relation, activité | CRM interne MajestiOS | Interne MajestiOS exclusivement |
| Sources | Source, enregistrement source, collecte, normalisation | Collecte | Accès opérateur / services autorisés |
| Veille | Signal, analyse, rapprochement, revue | Veille | Interne MajestiOS |
| Opportunités | Opportunité, avis, échéance, catégorie, rattachement source | Découverte / opportunités | Projection publique ou interne selon les champs |
| Prospection | Campagne, action, éligibilité, opposition, résultat | Prospection active | Interne MajestiOS exclusivement |
| Publication | Annonce, pièce, décision de modération, projection publique | Publication / modération | Auteur, modérateur, public selon état et champs |
| Espace client | Dossier, élément partagé, document, commentaire | Tenant client concerné | Tenant propriétaire, avec partage explicite |
| BrainOS | Corpus, document, version, métadonnée, droit documentaire | BrainOS | Corpus autorisé, indépendant |
| Gouvernance | Finalité, règle, décision de transfert, champ transféré | Gouvernance des données | Accès restreint et journalisé |
| Audit | Événement d'accès, mutation, décision, transfert | Fonction transversale d'audit | Lecture réservée aux rôles habilités |

La propriété fonctionnelle désigne le domaine responsable de la qualité et du cycle de vie. Elle ne donne pas automatiquement à tous les utilisateurs de ce domaine le droit de lire ou modifier chaque enregistrement.

## 5. Modèle de séparation : interne, client et documentaire

### 5.1 CRM interne MajestiOS

Le CRM interne constitue un périmètre organisationnel distinct. Ses entreprises, contacts, relations, activités, campagnes, résultats et notes internes ne sont pas accessibles depuis un espace client.

Un client ne reçoit pas un accès en lecture au CRM parce qu'une entreprise ou une opportunité le concerne. Il ne reçoit que les éléments explicitement partagés, sous forme de projection limitée.

### 5.2 Données propres à chaque client

Chaque enregistrement appartenant à un client doit être rattaché à un tenant contrôlé côté serveur. La règle d'accès est fondée sur l'appartenance vérifiée de l'utilisateur et les permissions applicables à l'objet.

Le modèle logique doit prévoir :
- un identifiant de tenant sur chaque objet métier appartenant à un espace client ;
- une appartenance utilisateur/tenant avec état et dates de validité ;
- des rôles et permissions limités au tenant ;
- une vérification serveur sur chaque lecture, écriture, recherche, export et tâche asynchrone ;
- des tests inter-tenant négatifs systématiques ;
- une gestion explicite des invitations, départs, suspensions et révocations.

Un identifiant de tenant envoyé par le navigateur n'est jamais une preuve d'autorisation.

### 5.3 Partage CRM vers client

Un partage n'est pas une copie libre ni une ouverture de l'enregistrement CRM. Il doit être représenté par un objet de partage ou de projection qui conserve :
- la référence à l'objet interne source ;
- le tenant destinataire ;
- les champs ou documents partagés ;
- la finalité et le motif ;
- l'acteur ayant autorisé le partage ;
- la date de début et, si nécessaire, d'expiration ;
- le statut et la possibilité de révocation ;
- la trace des accès et modifications éventuelles.

Le client ne peut pas remonter de cette projection vers d'autres champs du CRM. Les modifications du client sont enregistrées dans son propre espace et ne modifient pas directement la source interne.

### 5.4 BrainOS

BrainOS possède son propre périmètre documentaire : corpus, documents, versions, métadonnées, droits et index. Un document n'est indexable que si son origine, son propriétaire et les droits d'usage sont connus.

L'index vectoriel éventuel ne doit pas être considéré comme une frontière de sécurité. Chaque résultat doit être filtré et autorisé selon le corpus et les droits du demandeur. Aucun accès implicite au CRM ou aux documents des tenants.

## 6. Référentiel entreprise : éviter les mélanges de propriété

Le modèle doit distinguer trois notions :

1. **Identité de l'entreprise** : personne morale, identifiée notamment par SIREN lorsqu'il existe.
2. **Établissement** : implantation ou unité identifiée notamment par SIRET.
3. **Relation commerciale** : lien entre une entreprise, un contact et une organisation, avec rôle, période et source.

Une même entreprise peut être connue de MajestiOS et apparaître dans les données privées d'un client. Cela ne rend pas les deux dossiers identiques du point de vue des droits.

### Recommandation de prudence

- Le référentiel CRM interne conserve ses propres fiches et sa provenance.
- Les espaces clients conservent leurs propres dossiers, pièces, notes et relations.
- Un rapprochement entre deux fiches peut être proposé par identifiant légal ou critères documentés.
- Aucun rapprochement ne fusionne les données, les notes, les contacts ou les pièces sans décision explicite et contrôle des droits.
- Les données d'un client ne servent pas à enrichir le CRM interne par défaut.
- Les données publiques ou issues de sources externes restent soumises aux conditions de réutilisation et à leur finalité.

Les identifiants légaux aident au rapprochement mais ne prouvent pas à eux seuls la pertinence commerciale, la compétence ou la capacité à répondre à un marché.

## 7. Entités conceptuelles à détailler

### 7.1 Identité et appartenance

- **Principal** : identité d'un utilisateur ou d'un compte de service.
- **Role / Permission** : rôle et capacité précise ; éviter les rôles « tout puissant » cumulés par défaut.
- **Membership** : appartenance d'un principal à un tenant, avec statut, période et rôle.
- **Tenant** : frontière d'un espace client.
- **ClientWorkspace** : espace ou dossier de travail appartenant à un tenant.

Un compte interne MajestiOS doit être identifié comme tel et ne doit pas acquérir automatiquement des droits clients. Les comptes de service sont identifiables, limités à une fonction, révocables et journalisés.

### 7.2 Référentiel et activité CRM

- **Company** : personne morale ou organisation.
- **Establishment** : établissement rattaché à une entreprise.
- **Contact** : personne physique et coordonnées, avec règles de minimisation.
- **ContactRelationship** : fonction, relation et période d'un contact auprès d'une entreprise.
- **CRMActivity** : activité ou interaction réellement réalisée, avec auteur, date, canal et résultat.
- **Campaign** : campagne interne et finalité.
- **CommercialAction** : action planifiée ou exécutée, distincte de l'interaction réelle.

Une adresse email n'est pas un identifiant universel immuable. Les changements de fonction et d'entreprise doivent être historisés.

### 7.3 Sources, signaux et opportunités

- **Source** : fournisseur ou origine d'un jeu de données.
- **SourceRecord** : enregistrement externe conservé sous forme brute contrôlée ou référence, avec identifiant externe, URL, dates, empreinte et version de normalisation.
- **Signal** : élément interprété comme un indice à examiner.
- **CompanyMatch** : rapprochement proposé entre un signal et une entreprise, avec critères, score explicable, version et état de revue.
- **Opportunity** : opportunité normalisée, distincte de son signal source.

Les doublons doivent être détectés de manière idempotente. Une ambiguïté entraîne une revue, pas une fusion automatique.

### 7.4 Annonces et modération

- **Announcement** : contenu soumis, auteur, type, état et échéance.
- **AnnouncementAsset** : pièce jointe, métadonnées, analyse de sécurité et droits.
- **ModerationDecision** : décision, motif, modérateur, horodatage et version du contenu examiné.
- **PublicationProjection** : champs effectivement visibles publiquement, sans exposer le contenu privé ou les coordonnées non autorisées.

La publication, la transmission au CRM et l'exploitation en prospection sont trois décisions différentes.

### 7.5 Finalités et transmissions

- **DataPurpose** : finalité documentée, périmètre, statut et règles applicables.
- **TransferDecision** : décision d'autoriser, refuser ou mettre en attente une transmission.
- **TransferField** : liste ou projection des champs strictement nécessaires.
- **Restriction / Objection** : opposition, retrait, interdiction ou restriction d'usage, portée, source, date d'effet et statut.

Une décision ancienne ne dispense pas de recontrôler les restrictions au moment d'une nouvelle action. La règle la plus restrictive applicable doit prévaloir jusqu'à résolution.

### 7.6 Documents et audit

- **Document / DocumentVersion** : fichier, version, origine, empreinte, classification, droits et cycle de vie.
- **BrainCorpus** : corpus documentaire autorisé, avec règles d'accès et d'indexation.
- **AuditEvent** : acteur, action, ressource, résultat, date, motif et identifiant de corrélation.

Le journal d'audit doit éviter de copier les contenus sensibles. Il ne doit pas être modifiable par les utilisateurs dont les actions sont auditées. Les accès au journal sont eux-mêmes journalisés.

## 8. Classification et cycle de vie des données

### 8.1 Niveaux de visibilité proposés

| Niveau | Exemples | Accès de principe |
|---|---|---|
| Public validé | Annonce publiée, champs explicitement publics | Tout visiteur, selon l'état de publication |
| Compte utilisateur | Profil, annonces brouillon, préférences | Utilisateur concerné et rôles limités |
| Tenant client | Dossiers, pièces, commentaires d'un client | Membres autorisés du tenant concerné |
| Interne MajestiOS | CRM, qualification, Veille, Prospection, notes internes | Collaborateurs internes habilités |
| Restreint / sensible | Secrets, justificatifs d'identité, oppositions, pièces confidentielles, traces de sécurité | Rôles nommément autorisés, accès minimisé |

Cette classification est fonctionnelle. La qualification juridique des données, les bases légales, les durées et les obligations réglementaires devront être validées séparément.

### 8.2 Cycle de vie obligatoire

Chaque famille de données doit disposer d'une règle documentée couvrant :
- collecte ou création ;
- propriétaire et finalité ;
- contrôle de qualité et classification ;
- accès, modification et partage ;
- durée ou critère de conservation ;
- archivage, retrait, suppression ou anonymisation ;
- propagation des restrictions et oppositions ;
- sauvegardes et délais d'effacement associés ;
- preuve de l'opération.

Il n'est pas proposé de durée chiffrée à ce stade : elle dépend de la nature des données, des finalités et des obligations applicables.

## 9. Cloisonnement technique : modèle cible à éprouver

### 9.1 Recommandation conceptuelle

Pour les espaces clients, le modèle de départ à évaluer est une base relationnelle partagée avec séparation logique stricte par tenant, identifiant de tenant obligatoire, politiques de sécurité au niveau des lignes lorsque disponibles, et contrôles d'autorisation côté serveur.

Ce choix n'est pas encore validé. Il doit être comparé à des schémas ou bases séparés selon les exigences de confidentialité, de résidence, de sauvegarde, de restauration et de coût.

Le CRM interne ne doit pas être traité comme un tenant client standard. Il doit posséder une frontière d'autorisation distincte, avec des tests démontrant qu'aucun utilisateur client ne peut atteindre ses données.

BrainOS doit disposer d'une frontière de données et de permissions propre. Le choix entre base séparée, schéma séparé ou autre cloisonnement reste ouvert et dépendra du niveau d'indépendance requis.

### 9.2 Défense en profondeur

Le cloisonnement ne repose jamais sur une seule condition dans l'interface. Il combine :
1. authentification et état du compte ;
2. autorisation serveur par action et ressource ;
3. appartenance et rôle vérifiés ;
4. contrôle de tenant sur chaque requête ;
5. politiques de base de données, si le moteur le permet ;
6. séparation des secrets et comptes de service ;
7. contrôles spécifiques des exports, recherches, tâches et fichiers ;
8. journalisation des accès sensibles ;
9. tests automatisés positifs et négatifs.

Les opérations privilégiées doivent utiliser des identités de service distinctes, aux droits minimaux. Une tâche planifiée ne contourne pas les règles d'accès sous prétexte qu'elle s'exécute en arrière-plan.

## 10. Matrice minimale des accès à éprouver

| Acteur | CRM interne | Tenant A | Tenant B | BrainOS |
|---|---:|---:|---:|---:|
| Visiteur non authentifié | Refus | Refus | Refus | Refus |
| Utilisateur client A | Refus | Selon rôle | Refus | Selon corpus autorisé |
| Utilisateur client B | Refus | Refus | Selon rôle | Selon corpus autorisé |
| Opérateur CRM MajestiOS | Selon rôle interne | Pas d'accès implicite | Pas d'accès implicite | Pas d'accès implicite |
| Modérateur | Selon habilitation distincte | Pas d'accès implicite | Pas d'accès implicite | Refus par défaut |
| Administrateur technique | Aucun accès métier automatique | Aucun accès métier automatique | Aucun accès métier automatique | Aucun accès métier automatique |
| Compte de service | Périmètre strictement déclaré | Périmètre strictement déclaré | Périmètre strictement déclaré | Périmètre strictement déclaré |

« Selon rôle » ne signifie pas accès global : chaque opération est contrôlée par ressource, finalité et périmètre. Les accès d'urgence doivent être temporaires, motivés, approuvés et audités.

## 11. Scénarios de tests de sécurité obligatoires

Avant toute donnée réelle, la preuve de concept devra démontrer au minimum :

1. Client A ne peut ni lire, ni modifier, ni supprimer les données de B.
2. Client B ne peut pas accéder aux données de A.
3. Un client ne peut pas consulter le CRM interne, même en devinant un identifiant valide.
4. Un visiteur non authentifié ne peut accéder à aucune ressource privée.
5. Un utilisateur retiré d'un tenant perd immédiatement ses droits selon la politique de session.
6. Un opérateur sans permission CRM ne peut pas consulter ou modifier le CRM.
7. Un modérateur ne reçoit pas automatiquement des droits CRM ou BrainOS.
8. Un export, une recherche globale et une tâche asynchrone respectent les mêmes restrictions.
9. Un fichier privé ne peut être téléchargé par un autre tenant en modifiant son URL ou son identifiant.
10. Une projection partagée ne révèle aucun champ non autorisé de l'objet CRM source.
11. Une opposition ou restriction bloque une action commerciale même si une ancienne éligibilité était positive.
12. Un compte de service ne peut accéder qu'aux ressources et actions explicitement autorisées.

Les tests doivent être reproductibles, intégrés au contrôle qualité et exécutés à chaque changement touchant les permissions ou les données.

## 12. Arbitrages requis avant le modèle logique détaillé

| ID | Décision | Recommandation | Statut |
|---|---|---|---|
| B-01 | Modèle de tenant client | Base partagée et séparation logique renforcée comme hypothèse de départ, à comparer | À valider |
| B-02 | CRM interne | Périmètre organisationnel distinct, jamais un tenant client standard | À valider |
| B-03 | BrainOS | Frontière de données et de permissions indépendante | À valider |
| B-04 | Fiches entreprise entre CRM et tenants | Aucune fusion ni enrichissement croisé automatique | À valider |
| B-05 | Partage CRM vers client | Projection limitée, explicite, révocable et historisée | À valider |
| B-06 | Données d'annonce | Séparer contenu privé, décision de modération et champs publics | À valider |
| B-07 | Rapprochements | Proposition explicable puis validation selon les règles métier | À valider |
| B-08 | Restrictions et oppositions | Registre central de restrictions consulté avant chaque action pertinente | À valider |
| B-09 | Audit | Journal append-only logique, accès restreint et contenu minimisé | À valider |
| B-10 | Conservation | Durées définies par catégorie et finalité avant données réelles | À valider |

### Questions complémentaires à trancher

- Faut-il autoriser plusieurs utilisateurs et plusieurs rôles par espace client dès la première version ?
- Un client peut-il posséder plusieurs espaces ou dossiers indépendants dans son tenant ?
- Les clients pourront-ils déposer des fichiers dès le premier lot, ou cette capacité doit-elle attendre la politique documentaire ?
- Quel niveau d'isolation BrainOS est nécessaire : corpus par utilisateur, par organisation, ou corpus MajestiOS partagé avec droits documentaires ?
- Qui peut valider un partage d'une donnée CRM vers un client ?

## 13. Critères d'acceptation de l'étape B

L'étape B est validée lorsque :
- les périmètres de propriété et de visibilité sont confirmés ;
- le traitement des fiches entreprise communes et des données propres aux clients est décidé ;
- le modèle de partage CRM/client est défini ;
- les frontières BrainOS sont confirmées ;
- la stratégie d'isolation cible est retenue comme exigence, sans confondre exigence et fournisseur ;
- les scénarios de tests négatifs sont acceptés ;
- les règles de cycle de vie et de conservation sont attribuées à un chantier de conformité avant données réelles.

L'étape B ne nécessite pas de choisir Supabase, Vercel ou un autre fournisseur. Elle doit rester portable et indépendante de la technologie.

## 14. Hors périmètre

Aucun schéma SQL définitif, migration, table, politique RLS, compte utilisateur, authentification, stockage, index vectoriel, API ou backend n'est créé ici. Aucun fournisseur n'est choisi. Aucun test technique n'est prétendu exécuté. Aucun déploiement ou changement de production n'est effectué.

Le passage à l'étape C dépend de la validation des arbitrages B-01 à B-10 et de la résolution des points bloquants de propriété et de partage.
