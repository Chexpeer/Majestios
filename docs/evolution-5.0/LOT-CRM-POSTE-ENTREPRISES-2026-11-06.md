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

Cette recherche est un filtrage navigateur des fiches déjà présentes dans le CRM ; elle ne consulte aucun annuaire externe et ne lance aucune recherche SIRENE, RNE, BODACC ou BOAMP. La liste chargée par le client Supabase reste limitée à 100 enregistrements : pagination serveur et recherche sur l'ensemble du référentiel restent à construire avant d'utiliser ce module à grande échelle.

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
