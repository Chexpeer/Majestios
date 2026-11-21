# MajestiOS — dossier technique du parcours appel d'offres → chantier → réseau

**Date :** 7 novembre 2026  
**Branche cible :** `evolution-5.0-admin-cockpit`  
**Statut :** conception technique fondée sur le schéma Supabase observé ; aucune migration ni modification applicative dans ce lot.  
**Référence fonctionnelle :** `ARCHITECTURE-REGISTRE-COMMERCIAL-ANNONCES-BESOINS-2026-11-06.md`

## 1. Décision d'architecture

Le parcours doit être conçu comme une chaîne de traitement traçable, et non comme un unique prompt IA ou une simple recherche par code APE :

1. **Acquérir** la consultation et ses pièces, avec leur provenance.
2. **Comprendre** le besoin réel et les lots.
3. **Traduire** les travaux en langage de chantier.
4. **Structurer** les exigences et les critères de recherche.
5. **Identifier** des entreprises potentiellement pertinentes.
6. **Comparer** les exigences et les éléments connus de chaque entreprise.
7. **Accompagner** l'entreprise dans la vérification et la constitution de son dossier.
8. **Convertir** la démarche en espace personnel et profil réseau, avec choix explicites.
9. **Capitaliser** les relations et les suites commerciales dans les espaces autorisés du CRM.

Aucune étape ne doit présenter une hypothèse IA comme un fait établi. Chaque résultat doit conserver sa source, sa date, son niveau de confiance et son statut de vérification.

## 2. État réel du backend observé le 7 novembre 2026

Le projet Supabase identifié est `majestios-backend` (région `eu-west-3`). Les tables publiques actuellement observées sont :

- `organizations` et `organization_members` : séparation multi-tenant et adhésions ;
- `profiles` : profil utilisateur ;
- `businesses` : fiches entreprises rattachées à une organisation ;
- `contacts` : contacts rattachés à une organisation et éventuellement à une entreprise ;
- `opportunities` : pipeline commercial, avec types de source incluant déjà `boamp`, `bodacc`, `private_market`, `partner`, `manual` et `other` ;
- `activities` et `crm_reminders` : historique et relances ;
- `client_requests` : demandes adressées à MajestiOS depuis les espaces clients ;
- `privacy_acknowledgments` : preuve de prise de connaissance d'une version de notice, qui n'est pas un consentement marketing.

Toutes les tables publiques listées ont RLS activé. Le schéma actuel ne contient pas de registre structuré des consultations, des lots, des pièces, des exigences extraites, des correspondances entreprise/lot ou des pré-diagnostics d'éligibilité.

**Conséquence :** les opportunités CRM existantes peuvent référencer une consultation comme piste commerciale, mais elles ne remplacent pas un dossier d'appel d'offres structuré. `client_requests` ne doit pas être détournée en registre d'annonces ou en registre de candidatures.

## 3. Point de vigilance majeur : modèle d'identité et inscription

Le backend distingue déjà les organisations (`internal`, `client`, `partner`) et leurs membres. Les adhésions sont provisionnées par des parcours administratifs de confiance ; un utilisateur ne peut pas simplement s'ajouter lui-même à une organisation.

Le futur parcours public ne doit donc pas contourner cette règle ni créer arbitrairement une organisation cliente depuis le navigateur.

Il faut distinguer au minimum :

- **compte utilisateur** : identité d'authentification ;
- **profil personnel** : nom et coordonnées de l'utilisateur ;
- **entreprise représentée** : entité légale ou commerciale revendiquée ;
- **espace de travail** : organisation et membres autorisés ;
- **profil réseau** : informations que l'entreprise choisit de rendre visibles ;
- **dossier de candidature** : données et pièces privées liées à une consultation et à un ou plusieurs lots.

Le parcours d'inscription devra passer par un endpoint serveur de confiance, vérifier l'identité et le droit de représentation selon le niveau requis, traiter les doublons et définir le bon statut de validation. La création d'un compte ne doit pas donner automatiquement accès au CRM interne ni à une organisation existante.

## 4. Modèle métier cible — objets à concevoir

Ce modèle est conceptuel ; les noms définitifs, clés, contraintes et politiques seront arrêtés après revue des migrations et des politiques RLS.

### 4.1 Consultation et lots

**Consultation**
- identifiant interne ;
- source et identifiant externe ;
- URL officielle et références documentaires ;
- acheteur, objet, procédure, dates et territoire ;
- statut de collecte et fraîcheur ;
- empreinte des documents et date de dernière vérification.

**Lot**
- consultation parente ;
- numéro et intitulé officiel ;
- description du besoin traduit ;
- lieux d'exécution ;
- échéances et contraintes propres au lot ;
- métiers et compétences structurés, avec leur provenance.

Une consultation peut comporter plusieurs lots. Une entreprise peut correspondre à un lot sans être pertinente pour les autres.

### 4.2 Pièces et exigences

**Document de consultation**
- fichier ou référence sécurisée ;
- type documentaire (RC, CCTP, CCAP, BPU, DQE, DPGF, plans, annexes…) ;
- version, date, empreinte, source et statut de traitement ;
- niveau de confidentialité et règles de conservation.

**Exigence**
- consultation et, si possible, lot ;
- formulation officielle exacte ou extrait référencé ;
- catégorie : compétence, qualification, assurance, référence, moyen, capacité financière, pièce administrative, délai, visite, critère de jugement, etc. ;
- caractère obligatoire, souhaité ou simplement informatif ;
- page/section/paragraphe source ;
- traduction pédagogique ;
- statut d'interprétation et éventuel point à confirmer.

Ne jamais écraser la formulation officielle par la traduction IA. Les deux doivent rester consultables côte à côte.

### 4.3 Analyse IA et traçabilité

**Analyse de consultation**
- version du moteur/modèle et date d'exécution ;
- liste des documents effectivement analysés ;
- résultats structurés ;
- avertissements, pages non lues et limites ;
- état : en attente, en cours, terminé, à revoir, échec.

**Élément extrait**
- valeur structurée ;
- extrait source et emplacement ;
- type : fait du document, reformulation, hypothèse ou point à confirmer ;
- confiance technique ;
- validation humaine éventuelle.

Une correction humaine doit créer une trace de révision, pas effacer silencieusement la sortie initiale.

### 4.4 Entreprises et adéquation

Le moteur de recherche doit combiner plusieurs indices sans réduire la compétence à un code APE/NAF :

- métiers et savoir-faire déclarés ;
- réalisations et références ;
- qualifications/certifications et périmètre de validité ;
- territoire d'intervention et capacité de déplacement ;
- moyens humains et matériels ;
- assurances et capacités demandées ;
- signaux légaux et financiers disponibles, datés et sourcés.

**Correspondance entreprise / lot** :
- entreprise et lot ;
- critères évalués ;
- preuves et sources utilisées ;
- éléments manquants ;
- statut explicable : « semble correspondre », « à compléter / à vérifier », « ne semble pas correspondre » ;
- date et version de l'analyse ;
- validation ou correction humaine.

Le score éventuel ne doit jamais masquer les critères déterminants. Afficher les raisons, les inconnues et les preuves. Un code APE/NAF est un indice de découverte, non une preuve de capacité.

### 4.5 Pré-diagnostic et dossier entreprise

Le pré-diagnostic est propre à une consultation et à un lot. Il doit générer une checklist dynamique :

- exigence ;
- pièce ou donnée attendue ;
- élément déjà disponible dans le profil ;
- élément à fournir ;
- état de contrôle ;
- responsable et date de mise à jour.

Les pièces privées ne doivent pas devenir publiques par défaut. L'entreprise choisit les documents qu'elle joint et confirme explicitement toute transmission externe.

## 5. Recherche des entreprises : méthode en plusieurs étages

1. **Interprétation du chantier** : extraire les corps d'état, travaux, contraintes et lots.
2. **Élargissement contrôlé** : rechercher des codes APE/NAF pertinents, synonymes métiers et compétences associées.
3. **Découverte territoriale** : annuaires et sources autorisées, département d'exécution et zone d'intervention.
4. **Qualification métier** : vérifier activité réelle, références, qualifications et assurances pertinentes.
5. **Qualification de capacité** : taille, moyens et éléments financiers légalement accessibles.
6. **Déduplication** : SIREN/SIRET, établissement, raison sociale et rapprochement prudent.
7. **Revue humaine** : valider les candidats avant toute démarche de contact.

RGE n'est exigé ou recherché que lorsque la nature des travaux le justifie ou que les pièces du marché le demandent. Le domaine exact et la période de validité doivent être vérifiés.

« Comptabilité saine » doit être traduit en indicateurs objectifs et prudents : comptes disponibles, évolution de résultats, capitaux propres ou endettement lorsque calculables, procédures collectives connues et fraîcheur des données. L'absence de comptes publiés n'est pas un signal négatif en soi. MajestiOS ne prétend ni auditer ni garantir la solvabilité.

## 6. Cloisonnement des données et sécurité

Avant toute migration, chaque objet devra être classé :

- données de consultation publiques ;
- documents de consultation soumis à des conditions d'accès ;
- données de profil d'entreprise ;
- données personnelles de contact ;
- pièces administratives et financières privées ;
- données internes du CRM MajestiOS ;
- données de candidature partagées avec un acheteur ou un partenaire.

Principes obligatoires :

- aucune pièce privée exposée dans un bucket public ;
- politiques RLS explicites par objet et par rôle ;
- contrôle serveur des droits de représentation et de partage ;
- vérification des relations entre consultation, lot, entreprise, organisation et utilisateur ;
- pas de confiance dans les métadonnées utilisateur modifiables pour attribuer des rôles ;
- journalisation des accès et transmissions sensibles ;
- URLs de téléchargement temporaires lorsque pertinentes ;
- consentements distincts selon la finalité ; la prise de connaissance de la notice ne vaut pas consentement à la prospection ;
- retrait, correction, expiration et suppression encadrés ;
- aucune campagne ni transmission automatique déclenchée par la seule création d'un compte.

Le CRM interne et le réseau d'entreprises ne doivent pas être confondus dans une même frontière de tenant. Les modalités de visibilité inter-entreprises doivent être conçues explicitement.

## 7. Parcours utilisateur cible

### Depuis l'appel d'offres

1. La personne ouvre une consultation.
2. MajestiOS explique le chantier et ses lots.
3. Elle voit les exigences officielles, leur traduction et les points à confirmer.
4. Elle découvre les métiers et compétences recherchés.
5. Elle peut consulter les entreprises pertinentes ou proposer son entreprise.
6. Elle choisit « Vérifiez votre éligibilité et construisez votre dossier — Créez votre espace personnel. »

### À la création de l'espace

1. Authentification et vérification du compte.
2. Identification ou revendication de l'entreprise.
3. Vérification des doublons et du droit de représentation.
4. Création/provisionnement sécurisé de l'espace adapté.
5. Profil progressif : métiers, territoire, références, qualifications et moyens.
6. Pré-diagnostic par lot.
7. Checklist des pièces et compléments.
8. Validation explicite de tout partage ou dépôt.

L'entreprise peut conserver son espace même si elle ne candidate pas au marché d'origine. Elle peut ensuite, selon ses paramètres, consulter des opportunités pertinentes et accepter des mises en relation.

## 8. Intégration CRM : ne pas polluer le pipeline

Le CRM interne doit conserver les pistes commerciales, les entreprises qualifiées et les activités de suivi. Les objets de consultation, lots, analyses, exigences, correspondances et candidatures doivent rester des objets métier distincts.

Les liens CRM seront ajoutés explicitement :
- une opportunité peut être issue d'une consultation ;
- une entreprise peut être candidate, cotraitante ou sous-traitante potentielle ;
- une activité peut documenter une vérification ou une mise en relation ;
- une candidature peut donner lieu à des suites commerciales ;
- un profil réseau ne doit pas être assimilé à une entreprise qualifiée par le CRM interne.

Toute synchronisation entre espace client et CRM interne devra passer par un service autorisé, avec provenance, finalité et droits adaptés.

## 9. Découpage d'implémentation proposé

**Lot 1 — Contrats et sécurité**
- cartographier les politiques RLS, fonctions de provisionnement et stockage ;
- définir les rôles et frontières de données ;
- valider les parcours de revendication d'entreprise ;
- produire les scénarios de tests d'isolation.

**Lot 2 — Registre consultation / lots / documents**
- créer les objets de consultation et de lot ;
- stocker les références et métadonnées documentaires ;
- gérer versions, fraîcheur, doublons et erreurs d'import ;
- ne pas lancer de recherche d'entreprise tant que les pièces n'ont pas été analysées.

**Lot 3 — Analyse et traduction chantier**
- extraction sourcée des exigences ;
- traduction pédagogique liée aux passages ;
- traitement des documents manquants ou illisibles ;
- validation humaine et versionnement.

**Lot 4 — Découverte et rapprochement d'entreprises**
- dictionnaire métiers/compétences ;
- connecteurs de sources autorisées ;
- recherche territoriale ;
- correspondance explicable par lot ;
- contrôle humain et anti-doublons.

**Lot 5 — Espace personnel et pré-diagnostic**
- parcours d'inscription sécurisé ;
- revendication de l'entreprise ;
- profil progressif ;
- checklist et pièces privées ;
- consentements et partage explicite.

**Lot 6 — Capitalisation réseau et CRM**
- mises en relation acceptées ;
- suivi des coopérations ;
- liens contrôlés avec les opportunités et activités CRM ;
- indicateurs de valeur du réseau.

## 10. Critères de sortie avant développement

Aucun développement de schéma ne commence avant que les éléments suivants soient écrits et relus :

- diagramme entités-relations ;
- matrice rôles × opérations × objets ;
- matrice de visibilité des données ;
- politiques RLS par table ;
- modèle de stockage et de partage des pièces ;
- contrat de l'endpoint de création/revendication d'espace ;
- contrat d'analyse IA avec provenance et versionnement ;
- jeux de tests inter-tenant, utilisateur non autorisé, doublon, retrait de consentement, partage refusé et documents manquants.

Aucune migration Supabase, aucun changement de RLS, aucune donnée réelle et aucun déploiement ne sont inclus dans ce document.

## 11. Indicateurs de pilotage

Le succès doit se lire à plusieurs niveaux :

- consultations et lots correctement analysés ;
- exigences avec référence source exploitable ;
- taux de documents incomplets ou illisibles ;
- entreprises découvertes puis vérifiées ;
- pertinence des correspondances confirmée par revue ;
- espaces personnels créés depuis les parcours de consultation ;
- profils complétés et qualifications vérifiées ;
- pré-diagnostics terminés ;
- mises en relation acceptées ;
- coopérations, candidatures et retours d'expérience.

**Mesure stratégique : chaque consultation doit pouvoir créer de la compréhension, une opportunité de coopération et une relation durable — même sans candidature immédiate.**
