# Lot CRM — poste de travail Entreprises

**Date :** 6 novembre 2026  
**Branche :** `evolution-5.0-admin-cockpit`  
**Nature :** amélioration ciblée de l'interface existante, sans évolution du schéma Supabase.

## Objectif

Faire du module Entreprises un véritable poste de travail opérationnel : retrouver rapidement une fiche, la filtrer selon sa qualification et son département, puis préparer progressivement les opérations de ciblage commercial.

## Réalisation de ce lot

- Recherche locale dans les entreprises déjà chargées par le CRM : raison sociale, nom commercial, SIREN, SIRET, APE/NAF, ville, département et notes de qualification.
- Filtre par statut de qualification : à examiner, en cours, qualifiée, non qualifiée, ne pas contacter.
- Filtre par département.
- Compteur de résultats affichés, mis à jour à chaque modification des critères.
- Affichage des principaux identifiants disponibles sous le nom de l'entreprise.
- Réapplication automatique des filtres après actualisation de la liste.
- Normalisation des accents pour rendre la recherche plus tolérante.

## Limites explicites

Cette recherche est un filtrage navigateur des fiches déjà présentes dans le CRM ; elle ne consulte aucun annuaire externe et ne lance aucune recherche SIRENE, RNE, BODACC ou BOAMP. La liste principale dispose désormais d'une recherche et d'une pagination serveur tenant-scoped. Les autres rubriques et sélecteurs CRM restent limités à 100 enregistrements.

Aucun enregistrement n'est créé, modifié ou supprimé par les filtres. Aucun e-mail n'est collecté ou envoyé. Les filtres ne changent pas les droits RLS et ne remplacent pas les contrôles Supabase.

## Prochaines briques logiques

1. Fiche entreprise détaillée avec ses établissements SIRET, ses contacts, ses opportunités et son historique associé.
2. Pagination et recherche serveur, avec tri explicite et indicateur du volume total.
3. Qualification enrichie : source, date de collecte, provenance des champs, niveau de confiance et justification humaine.
4. Ciblage depuis un appel d'offres : compétences requises → proposition APE/NAF → départements → entreprises candidates, avec validation humaine.
5. Préparation d'une campagne : sélection, exclusions, provenance des coordonnées, base légale, opposition et validation avant tout envoi.

## Protection du patrimoine

Le CRM Supabase existant est conservé. Aucune migration, table, colonne, politique RLS, fonction SQL/Edge, donnée, compte ou rôle n'a été modifié. Aucun déploiement, merge vers `main` ou promotion en production n'est effectué dans ce lot. L'immeuble interactif et tous ses composants restent strictement hors périmètre.

## Extension du lot — dossier entreprise détaillé

Le dossier dépliable d'une entreprise rassemble désormais, à partir des champs déjà présents dans la fiche : identité juridique et commerciale, SIREN/SIRET, TVA, APE/NAF, adresse, coordonnées territoriales, site web, source et lien source, responsable interne, qualification et notes. Il rapproche également les contacts, opportunités et activités dont le `business_id` correspond à l'entreprise.

Les liens externes sont rendus comme liens uniquement pour les protocoles HTTP/HTTPS et s'ouvrent dans un nouvel onglet avec les protections `noopener noreferrer`. Les contenus issus des fiches sont insérés comme texte, pas comme HTML.

**Limite de couverture importante :** chaque rubrique est actuellement chargée avec une limite de 100 enregistrements. Le dossier rapproche uniquement les relations présentes dans ces listes chargées. Un message explicite évite de confondre absence d'élément affiché et absence réelle de relation dans la base. Ce lot ne met pas en place de pagination, de recherche serveur ni de nouvelles requêtes relationnelles.

Aucun changement de schéma Supabase, aucune migration et aucune écriture de données n'ont été nécessaires.


## Extension — analyse lexicale du contenu d'un marché

Le prototype de préqualification accepte désormais, en plus de l'intitulé, un texte descriptif pouvant contenir les prestations, le contenu d'un lot et les compétences attendues. Le moteur de suggestions APE/NAF analyse conjointement ces éléments et restitue les mots-clés qui motivent chaque proposition.

**Nature du résultat :** suggestion lexicale explicable uniquement. Ce mécanisme n'extrait pas encore automatiquement les lots d'un avis BOAMP, ne lit pas les pièces PDF du dossier de consultation, ne comprend pas les exigences juridiques ou techniques et ne valide aucune compétence. Le code proposé doit être contrôlé par un opérateur avant recherche d'entreprises.

**Périmètre technique de ce sous-lot :** évolution du prototype `qualification-entreprises.html` et de ses modules JavaScript/tests. Il ne raccorde pas encore le parcours au poste CRM authentifié et ne crée aucune fiche dans Supabase. Il ne modifie ni schéma, ni données, ni habilitations. L'immeuble interactif reste hors périmètre.


## Extension — ciblage marché intégré au CRM authentifié

Le parcours de ciblage est proposé dans le poste Entreprises du CRM, derrière la session et l'appartenance interne déjà exigées par le client Supabase existant. Il réutilise le moteur DINUM et les suggestions lexicales APE/NAF déjà présents, sans créer de second référentiel.

L'opérateur saisit l'intitulé et le descriptif du marché, vérifie les codes APE/NAF suggérés, définit les départements, lance une recherche, examine les candidats et coche ceux qu'il souhaite intégrer. Les fiches choisies sont créées dans la table businesses existante via MajestiosCRM.createBusiness, avec le statut « à examiner », la provenance et les motifs de rapprochement dans les notes.

**Droits et limites :** le rôle viewer ne peut pas lancer le ciblage ni intégrer de fiches ; les autres rôles restent soumis aux contrôles du client et de Supabase RLS. La recherche ne crée aucune fiche automatiquement. Le contrôle de doublons utilise désormais une recherche serveur SIREN/SIRET sur l'ensemble des fiches visibles dans le tenant ; la contrainte unique SIREN en base demeure la protection finale. Les erreurs individuelles d'insertion sont comptabilisées.

Aucune table, colonne, migration, politique RLS, fonction SQL/Edge, donnée préexistante, identité ou rôle n'a été modifié. Aucun courriel n'est envoyé. Aucun déploiement, merge vers main ou promotion en production n'est effectué. L'immeuble interactif reste strictement hors périmètre.

## Extension — indicateurs de structure, provenance et contrôle des doublons

Le parcours de ciblage affiche désormais, lorsqu'ils sont présents dans la réponse de l'API Recherche d’Entreprises, la tranche d’effectif et son année de référence, le nombre d’établissements, le statut administratif et la date de création. Ces valeurs sont présentées comme des déclarations de source, jamais comme une preuve de capacité à exécuter un marché. Une donnée absente reste explicitement « non renseignée ».

Le rapprochement préalable compare les SIREN et SIRET des candidats à l'ensemble des fiches de l'organisation via `findBusinessesByIdentifiers()`, sans se limiter aux 100 lignes chargées pour les sélecteurs. Le nombre de candidats déjà connus est signalé ; ils ne sont pas proposés à l'import. Un second contrôle serveur est exécuté juste avant chaque insertion. La contrainte unique existante sur `(organization_id, siren)` protège également contre une insertion concurrente portant le même SIREN. Les erreurs retournées par Supabase sont désormais restituées dans le bilan d'import au lieu d'être silencieusement comptabilisées.

Les fiches nouvelles conservent dans qualification_notes les indicateurs disponibles, l'identifiant source, la date de collecte, les critères APE/NAF et départementaux, le score indicatif et les motifs de rapprochement. Elles sont créées au statut « à examiner ». Aucune mise à jour, fusion ou écrasement automatique d'une fiche existante n'est autorisé.

**Limites non levées :** la recherche des identifiants est globale dans le tenant, mais le dossier détaillé ne rapproche encore que les relations présentes dans les 100 lignes chargées de chaque rubrique. La source publique ne garantit pas que chaque fiche comporte effectif, nombre d'établissements ou toutes les données de structure. Les informations sont conservées dans les notes faute de colonnes dédiées déjà présentes dans le schéma ; aucune colonne, table, migration, politique RLS ou donnée Supabase n'a été modifiée. La pagination serveur et une procédure de rapprochement contrôlée restent des lots distincts.

## Extension — recherche globale et pagination serveur des entreprises

Le poste Entreprises dispose maintenant d’une recherche paginée directement sur la table `businesses` via le client Supabase déjà authentifié. La requête applique explicitement `organization_id` du membre vérifié, laisse les politiques RLS existantes s’appliquer, demande un décompte exact (`count: exact`) et utilise `range()` pour charger 25 fiches par page. L’ordre est stable sur `created_at` décroissant puis `id` croissant.

La recherche serveur par sous-chaîne couvre raison sociale, nom commercial, SIREN, SIRET, code APE/NAF et ville. Les filtres qualification et département sont également appliqués côté serveur lors de la soumission de la recherche ou du changement de page. Les filtres instantanés existants restent locaux et ne masquent que les 25 fiches de la page affichée.

**Périmètre et limites :** la recherche paginée interroge l’ensemble des fiches visibles dans le tenant selon RLS, sans limite applicative de 100 résultats. Elle reste une recherche lexicale par sous-chaîne, pas une recherche sémantique. Les listes historiques de contacts, opportunités, activités et les sélecteurs de relations restent limités à 100 lignes ; leurs limites ne sont donc pas résolues par ce lot. Le rapprochement de candidats SIREN/SIRET, lui, consulte bien l'ensemble du tenant. Le dédoublonnage global s’appuie toujours en dernier ressort sur la contrainte unique SIREN déjà existante. La pagination par offset peut voir ses positions évoluer si des fiches sont créées pendant la navigation ; l’ordre déterministe réduit l’instabilité sans fournir un instantané transactionnel.

Aucune table, colonne, index, fonction SQL, migration, politique RLS, donnée ni configuration Supabase n’a été modifiée. Le lot utilise uniquement les capacités de lecture existantes de PostgREST / supabase-js.

Le contrôle global d'identifiants est effectué par deux requêtes `IN` ciblées, l'une sur les SIREN et l'autre sur les SIRET, toutes deux filtrées par `organization_id` et soumises aux politiques RLS. L'import répète ce contrôle pour chaque candidat juste avant l'insertion. Aucun SIREN/SIRET absent n'est accepté pour import. L'index unique `businesses_organization_id_siren_key` a été confirmé par une lecture des index existants ; il n'a pas été créé ou modifié dans ce lot.

## Extension — pagination serveur des Contacts, Opportunités et Activités

Les espaces Contacts, Opportunités et Activités disposent désormais de leur propre recherche serveur et pagination de 25 enregistrements. Le client `listWorkspaceRecordsPage()` n’accepte que ces trois tables via une liste blanche, récupère le membre authentifié avec `requireWorkspace()`, filtre explicitement `organization_id`, demande le compte exact et utilise `range()`. Les politiques RLS existantes restent actives.

- **Contacts :** recherche sur prénom, nom, fonction, e-mail et téléphone ; tri `created_at DESC, id ASC`.
- **Opportunités :** recherche sur intitulé, description, identifiant externe et type de source ; tri `updated_at DESC, id ASC`.
- **Activités :** recherche sur objet, détail et type ; tri `occurred_at DESC, id ASC`. Le rendu chronologique est conservé.

Chaque rubrique possède son propre champ de recherche, son compteur exact et ses boutons Précédent/Suivant. Une nouvelle recherche revient à la première page ; si une page devient invalide après une suppression ou un changement de filtre, le chargement revient automatiquement à la dernière page disponible.

**Limites restantes :** les formulaires relationnels (listes déroulantes entreprise/contact/opportunité), les rappels et certains traitements transverses utilisent encore les listes historiques limitées à 100 enregistrements. Les pages principales des quatre rubriques sont désormais paginées côté serveur, mais cette extension ne transforme pas encore les sélecteurs relationnels en recherche dédiée. La pagination offset reste non transactionnelle en cas d’insertions concurrentes.

Aucun schéma, index, migration, rôle, utilisateur, politique RLS ou donnée Supabase n’a été modifié.


## Extension — pagination des relations du dossier entreprise

Le dossier détaillé ne dépend plus des seules listes auxiliaires limitées à 100 enregistrements pour afficher ses contacts, opportunités et activités associés. À l'ouverture du dossier, chaque rubrique relationnelle interroge directement la table autorisée correspondante, avec le business_id de l'entreprise, le organization_id du membre authentifié, les politiques RLS existantes, un décompte exact et une pagination de 10 lignes.

Les trois rubriques sont chargées à la demande et indépendamment. Les tris sont déterministes : contacts par création décroissante, opportunités par mise à jour décroissante et activités par date d'occurrence décroissante, avec id ASC comme départage. Les erreurs de chargement restent visibles dans la rubrique concernée et peuvent être retentées à la réouverture du dossier.

**Effet fonctionnel :** le dossier entreprise peut maintenant parcourir ses relations au-delà des 100 lignes auxiliaires utilisées par les sélecteurs et autres vues. Il ne confond plus « absent de la première page » avec « inexistant ».

**Protection du patrimoine :** aucune table, colonne, migration, politique RLS, fonction SQL/Edge, donnée, compte ou rôle n'a été modifié. Les requêtes restent strictement limitées au tenant authentifié et aux trois tables explicitement autorisées. Aucun envoi externe, merge vers main, déploiement ou promotion en production n'est effectué. L'immeuble interactif reste hors périmètre.

**Contrôles ajoutés :** le contrat statique vérifie la liste blanche relationnelle, le filtre tenant, le filtre business_id, le chargement à la demande et l'affichage du décompte paginé. Ces assertions ne remplacent pas l'exécution des tests navigateur ni une validation CI réelle.


## Extension — sélecteurs relationnels avec recherche et pagination serveur

Les champs d'association des formulaires Contact, Opportunité et Activité ne sont plus alimentés uniquement par les tableaux historiques limités à 100 enregistrements. Chaque sélecteur dispose maintenant d'une recherche dédiée et d'une pagination serveur de 25 résultats :

- Entreprises : méthode listBusinessesPage avec recherche sur les champs métier déjà autorisés.
- Contacts : méthode listWorkspaceRecordsPage avec table contacts.
- Opportunités : méthode listWorkspaceRecordsPage avec table opportunities.

Les requêtes réutilisent les contrôles d'authentification, le filtrage organization_id, les listes blanches de tables, le compte exact et les tris déterministes déjà présents dans le client CRM. Les sélecteurs sont indépendants : recherche, page et résultats d'un champ ne modifient pas les autres. Un compteur accessible annonce le nombre de résultats et la page courante. Les contrôles de recherche ne portent pas d'attribut name et ne sont donc pas transmis dans FormData.

Lorsqu'une page ou une recherche change, la valeur déjà sélectionnée est conservée même si elle n'appartient plus aux 25 résultats affichés. Aucun schéma, aucune table, colonne, politique RLS, fonction SQL/Edge, donnée, compte ou rôle Supabase n'est modifié.

**Limites et contrôles :** la recherche reste lexicale et limitée aux colonnes explicitement déclarées par les méthodes de pagination. Le chargement initial des formulaires interroge chaque sélecteur indépendamment. Les tests de contrat statiques couvrent le raccordement des sélecteurs, les appels paginés et les attributs d'accessibilité ; ils ne remplacent pas une exécution des tests ni une validation navigateur/CI. Aucun merge, déploiement ou changement de l'immeuble interactif n'est effectué.
