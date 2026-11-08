# Lot CRM atomique 06 — indicateurs CRM dans le cockpit

**Date :** 8 novembre 2026  
**Branche :** `feature/crm-atomic-integration`  
**Point de départ :** `0f905213244d88cddc432110637b4532cd771d0f`  
**Périmètre :** intégration d’indicateurs CRM en lecture seule dans le tableau de bord Administration générale.

## Objectif

Relier le cockpit au référentiel CRM interne par des données réelles, sans dupliquer les fonctions métier du CRM ni fusionner les deux interfaces.

## Changements

- Ajout de trois indicateurs : nombre d’entreprises, de contacts et d’opportunités dans l’organisation interne.
- Comptages Supabase exacts effectués côté client avec `head: true`, sans rapatrier les fiches.
- Chaque requête filtre explicitement `organization_id` avec l’identifiant de l’organisation interne vérifiée par le cockpit.
- Une erreur de lecture sur un indicateur affiche « — » et ne bloque pas le chargement des autres indicateurs.
- Le CRM complet demeure accessible par son lien de module ; les opérations de gestion restent dans le CRM.

## Sécurité et frontières

- Le cockpit reste réservé aux rôles `owner` et `admin`.
- Les compteurs ne remplacent pas les politiques RLS : les requêtes restent soumises aux droits de l’utilisateur authentifié.
- Aucun accès aux données des espaces clients, aucune écriture CRM, aucune modification du schéma ou des politiques Supabase.
- Aucun changement de l’immeuble interactif, du moteur de recherche public ou des sources de prospection.

## Vérifications

- Contrat statique enrichi pour vérifier la présence des trois compteurs et le filtre explicite par organisation.
- La CI précédente a confirmé le succès du test APE/NAF corrigé et du build (70 fichiers copiés).
- Le workflow s’arrête ensuite sur six incohérences préexistantes de `verify-architecture.js` : navigation publique absente/incohérente sur certaines pages, coordonnées/identifiants des destinations de l’accueil divergents du contrat codé, et ordre/titres de la page Prospection divergents. Le script de vérification et les pages concernées sont identiques à ceux de la branche de base ; ces constats ne sont pas provoqués par le présent lot. Aucune modification de l’immeuble ou de ces pages n’est incluse ici.
- Le résultat CI de ce lot sera consigné après exécution sur son commit.

## Point de retour

Le commit parent `0f905213244d88cddc432110637b4532cd771d0f` reste le point de retour. Aucun merge, déploiement ou changement de base de données n’est effectué.
