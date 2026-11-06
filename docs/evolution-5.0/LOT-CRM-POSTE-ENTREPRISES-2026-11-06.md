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
