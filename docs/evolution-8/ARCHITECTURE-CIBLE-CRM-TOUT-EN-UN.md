# Architecture cible — MajestiOS CRM tout-en-un

**Branche :** `Evolution-8`  
**Statut :** architecture fonctionnelle et technique à arbitrer ; aucune nouvelle capacité n'est déclarée opérationnelle.

## 1. Principe directeur

MajestiOS doit offrir un environnement cohérent, mais ne doit pas imposer le même logiciel à toutes les entreprises.

Trois portes d'entrée doivent coexister :
1. **CRM MajestiOS** : l'entreprise adopte notre environnement natif.
2. **CRM externe** : l'entreprise conserve son outil et connecte les services MajestiOS compatibles.
3. **Parcours hybride** : elle utilise certains modules MajestiOS (par exemple Facturation ou accompagnement) sans migrer tout son système.

Le client doit pouvoir commencer petit, puis activer des modules au rythme de ses besoins.

## 2. Les cinq domaines produit

### A. Développement commercial
Prospection, veille, appels d'offres publics et privés, recherche d'entreprises, qualification, campagnes et suivi des opportunités.

### B. CRM & gestion quotidienne
Entreprises, contacts, activités, tâches, devis, interventions/chantiers, agenda, documents et suivi des règlements. Les fonctions seront priorisées avec les utilisateurs pilotes.

### C. MajestiOS Facturation
Noyau métier indépendant de l'écran CRM : devis, factures, avoirs, lignes, taxes, échéances, règlements, statuts, rejets, historique et pièces justificatives. Le module doit être accessible depuis le CRM MajestiOS ou par API/connecteur depuis un CRM externe compatible.

### D. MajestiOS Connect
Couche d'interopérabilité avec CRM tiers, logiciels métiers et plateformes agréées (PA). Elle porte l'authentification des partenaires, la transformation des formats, les validations, les webhooks, les reprises, l'idempotence, les journaux et la gestion des erreurs.

### E. Cheexpeer & Réseau
Cheexpeer assiste l'utilisateur dans le périmètre autorisé. Le Réseau référence les plateformes et prestataires avec un statut transparent : partenaire contractuel, partenaire technique, référencé ou à l'étude.

## 3. Séparation stricte des espaces

| Espace | Propriétaire des données | Usage |
|---|---|---|
| CRM interne MajestiOS | MajestiOS | Notre prospection, clients, partenaires et activité |
| CRM client MajestiOS | Entreprise cliente | Ses propres clients, devis, interventions et factures |
| CRM externe | Entreprise cliente et éditeur tiers | Système maître conservé par le client |
| Référentiel partenaires | MajestiOS | Catalogue, contrats, statut et connecteurs |
| Missions Cheexpeer | Organisation concernée | Tâches, résultats, validations et traces autorisées |

Un compte utilisateur peut appartenir à plusieurs organisations, mais le contexte d'organisation doit être explicite à chaque action. Aucun « premier tenant trouvé » ne doit être sélectionné arbitrairement.

## 4. Architecture applicative cible

Préconisation à confirmer après prototype :
- un **socle d'identité et d'autorisations** commun ;
- un **shell applicatif** unique pour les espaces de travail ;
- des domaines métier séparés par contrats d'API et services ;
- un noyau Facturation indépendant de la présentation ;
- une couche Connect pour les intégrations externes ;
- un orchestrateur Cheexpeer isolé des règles métier et limité par registre d'outils ;
- des tâches asynchrones persistantes pour les opérations longues ;
- des journaux métier et techniques consultables par les rôles autorisés.

Le choix d'un framework front-end ou d'une migration complète ne doit pas précéder un prototype comparé au site statique existant. L'objectif est une expérience unifiée, pas une réécriture technologique pour elle-même.

## 5. Modèle de données à instruire

### Noyau identité / organisation
- utilisateurs et profils ;
- organisations et membres ;
- rôles, invitations, droits et périmètres ;
- consentements et journaux d'accès.

### CRM
- entreprises, contacts ;
- opportunités, activités, tâches et rappels ;
- relations explicites entre les objets ;
- source, provenance et date de vérification des données.

### Opérations
- devis et versions ;
- chantiers/interventions et événements ;
- agenda, pièces et documents.

### Facturation
- documents de vente et d'achat ;
- lignes, taxes, totaux et devise ;
- références, numérotation, échéances et règlements ;
- avoirs, corrections, statuts PA et événements de transmission ;
- pièces originales et représentations lisibles.

### Connecteurs et Cheexpeer
- comptes de connexion partenaires et secrets côté serveur ;
- configuration par organisation ;
- événements entrants/sortants et clés d'idempotence ;
- missions, étapes, outils, approbations, résultats et journaux.

Toutes les tables contenant des données client doivent porter un périmètre d'organisation explicite ou une relation démontrable à celui-ci. Les contraintes SQL doivent empêcher les relations croisées entre tenants.

## 6. Supabase : stratégie d'environnements

Le modèle cible est un projet Supabase distinct par environnement (développement/test/production), et non un projet par client. Chaque entreprise cliente est isolée par tenant et politiques RLS.

Avant tout choix de projet de production :
1. comparer les 22 migrations du projet `majestios-crm` aux 38 migrations de `MajestiOS-Test` ;
2. comparer schémas, fonctions, politiques, extensions, cron, queues et données ;
3. identifier les migrations déjà appliquées avec des horodatages réécrits ;
4. corriger les écarts et valider les tests sur un environnement isolé ;
5. définir sauvegarde et restauration ;
6. décider explicitement quel projet devient la cible de production.

Aucun `db push`, reset, merge de branche Supabase ou migration distante n'est autorisé dans le lot de conception.

## 7. Sécurité et multi-tenant

Exigences minimales :
- RLS activée sur toutes les tables applicatives contenant des données privées ;
- schéma `private` non exposé au Data API, avec droits minimaux ;
- politiques testées pour anon, authenticated, owner, admin, member et viewer ;
- fonctions SECURITY DEFINER avec `search_path` contrôlé, droits EXECUTE minimaux et contrôle métier interne ;
- clés service_role uniquement dans les environnements serveur ;
- séparation des secrets par environnement et partenaire ;
- validation des entrées, limites de débit et quotas ;
- journaux sans données sensibles inutiles ;
- tests d'accès croisés entre deux organisations ;
- export, suppression et réversibilité.

Le défaut RLS de `private.reputation_audit_usage` dans l'environnement de test est un préalable à traiter, pas un modèle à reproduire.

## 8. Stockage documentaire

Aucun bucket Storage métier n'est présent dans les projets inspectés. Avant d'activer documents, devis ou factures, définir :
- buckets privés ;
- chemins contenant un identifiant d'organisation vérifié côté serveur ;
- politiques d'accès par rôle et tenant ;
- limites de taille et types MIME ;
- versions et empreintes ;
- rétention, archivage et suppression ;
- liens temporaires et audit des téléchargements ;
- export complet et stratégie de restauration.

## 9. Facturation électronique et PA

MajestiOS n'est pas une PA. Le module doit être une solution de gestion/compatible reliée à une ou plusieurs PA partenaires lorsque les contrats et API le permettent.

Flux cibles :
1. préparation et validation du document ;
2. génération d'un format structuré conforme au flux retenu ;
3. transmission par Connect à la PA choisie ;
4. réception des accusés, statuts, rejets et demandes de correction ;
5. synchronisation du statut dans le CRM ;
6. conservation des preuves et de l'historique ;
7. réception et traitement des factures fournisseurs selon les capacités du partenaire.

Un export PDF ne vaut pas transmission réglementaire. Chaque PA doit être qualifiée selon ses API, formats, responsabilités, tarifs, SLA, gestion des rejets, sécurité et réversibilité. Aucun partenaire n'est choisi à ce stade.

## 10. Source de référence et absence de doubles saisies

Pour chaque client, chaque domaine doit désigner un système maître :
- si le client conserve son CRM externe, celui-ci reste maître des données CRM convenues ;
- si le client adopte MajestiOS CRM, MajestiOS devient le référentiel de ce périmètre ;
- le module Facturation doit déclarer clairement la source de référence des numéros, documents et statuts.

Les connecteurs doivent utiliser des identifiants externes stables, des règles de synchronisation explicites, des clés d'idempotence et des conflits remontés à l'utilisateur. Ne jamais écraser silencieusement une donnée source.

## 11. Rôle et limites de Cheexpeer

Cheexpeer est transversal mais non omnipotent :
- lecture et synthèse dans le périmètre autorisé ;
- préparation de devis, factures et dossiers sans validation implicite ;
- proposition d'actions et d'automatisations ;
- approbation humaine obligatoire pour actions externes, financières, juridiques, destructives ou engageant la marque ;
- historique complet des missions, outils utilisés, sources et validations.

Les outils restent désactivés par défaut. Chaque outil possède un schéma d'entrée/sortie, un niveau d'autonomie, des effets, un coût maximal, un délai et une politique d'approbation.

## 12. Découpage recommandé

| Lot | Livrable | Critère de sortie |
|---|---|---|
| E8-A | Environnements Supabase cartographiés | Parité et cible de référence décidées |
| E8-B | Socle Auth / tenant / Storage | Tests multi-rôles et restauration réussis |
| E8-C | Shell applicatif et navigation | Parcours responsive et routes testés |
| E8-D | CRM client minimal | Testé avec 5 à 7 utilisateurs pilotes |
| E8-E | Noyau Facturation | Devis/facture/avoir testés hors PA |
| E8-F | Connecteur PA | Sandbox, statuts, rejets et reprise testés |
| E8-G | Connecteurs CRM externes | Synchronisation documentée par éditeur |
| E8-H | Cheexpeer transversal | Outils contrôlés et validations vérifiées |

**Règle :** aucune phase ne passe à la suivante sur la seule présence de fichiers ou de tables ; une recette du parcours complet est nécessaire.
