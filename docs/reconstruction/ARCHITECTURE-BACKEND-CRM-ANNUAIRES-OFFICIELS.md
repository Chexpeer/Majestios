# Architecture de reconstruction du backend MajestiOS
Date : 7 novembre 2026
Branche : rebuild/supabase-clean-2026-11-07

## Décision d'architecture

Repartir d'un projet Supabase vierge, sans importer les anciennes données. Le dépôt GitHub reste la source de vérité pour le code, les migrations versionnées et la documentation. Le CRM interne MajestiOS, les espaces clients et le référentiel partagé des entreprises doivent rester séparés par des règles d'accès explicites.

Le CRM est conçu comme une caserne opérationnelle : centre de commandement, accès VIP, moteurs de recherche spécialisés, BOAMP/BODACC, inspection et équipes spécialisées. Cette métaphore décrit l'organisation des fonctions et des permissions, pas un système de surveillance.

## Périmètres fonctionnels

1. Identité et accès : utilisateurs, profils, organisations, appartenances, rôles, habilitations et journal d'audit.
2. Référentiel entreprises : identité légale, SIREN/SIRET, établissements, activités NAF, adresses et identifiants externes.
3. Relations commerciales : prospect, client, partenaire, fournisseur, à qualifier, exclu du contact. Ces statuts sont indépendants du type d'organisation et des rôles utilisateurs.
4. CRM : contacts, opportunités, activités, tâches, relances, dossiers, notes, historique et affectations.
5. Sources officielles : registre des sources, connecteurs, exécutions, observations brutes, rapprochement, provenance, date de collecte et statut de fraîcheur.
6. Recherche : requêtes par entreprise, SIREN/SIRET, activité, département, statut légal et événements ; résultats limités et traçables.
7. Gouvernance : consentement lorsque requis, finalités, base légale, durée de conservation, opposition, liste d'exclusion et journal des accès.
8. Documents : stockage privé seulement après définition des règles d'accès, de conservation et de suppression.

## Catalogue initial de sources françaises

Les connecteurs sont activés progressivement après vérification de l'API ou du flux officiel, des conditions d'utilisation, des quotas, de l'authentification, de la licence et des champs réellement disponibles.

- Annuaire des Entreprises : recherche et identification des unités légales et établissements.
- SIRENE / INSEE : données d'identification, établissements, activité et état administratif selon les droits et modalités de diffusion.
- Registre national des entreprises / INPI : données et actes du registre selon les services et conditions d'accès.
- BODACC : annonces de création, modification, vente, procédures collectives et radiation.
- BOAMP : avis de marchés publics.
- data.gouv.fr : catalogue et métadonnées des jeux de données publics pertinents.
- INSEE (données statistiques) : contexte sectoriel et territorial, sans confondre statistiques et données de prospection individuelles.
- Journal officiel / DILA : publications officielles pertinentes.
- Sources complémentaires à qualifier : données ouvertes des collectivités, plateformes de marchés et répertoires professionnels institutionnels.

« Tous les annuaires officiels » est un catalogue extensible, pas une promesse d'accès universel : certaines sources n'ont pas d'API, imposent une licence, une authentification, des quotas ou interdisent certains usages. Aucun scraping ni contournement d'accès ne sera mis en place.

## Modèle de données cible

Le schéma initial sera organisé autour de tables dédiées, avec UUID internes et contraintes d'intégrité :

- organisations, profils, membres, rôles et permissions ;
- entreprises et établissements, identifiants légaux et alias ;
- relations commerciales et liste d'exclusion ;
- contacts et rattachements vérifiés ;
- opportunités et événements de source ;
- activités, tâches, rappels et dossiers ;
- sources, connecteurs, exécutions, observations et rapprochements ;
- journal d'audit et règles de conservation.

Les observations provenant des annuaires ne doivent jamais écraser silencieusement les données CRM saisies ou validées par un utilisateur. Chaque champ importé conserve sa source, sa date, son identifiant externe et, si possible, son historique. Les conflits sont signalés pour arbitrage.

## Sécurité et isolation

- RLS activé sur toutes les tables exposées.
- Données de chaque espace client isolées par organisation.
- Données de référence publiques et données CRM privées séparées logiquement.
- Rôles d'administration gérés côté serveur, jamais depuis user_metadata.
- Clés secrètes et accès aux API sources uniquement côté serveur.
- Connecteurs externes exécutés par tâches serveur avec quotas, reprises contrôlées et journalisation.
- Les fonctions privilégiées sont minimales, non exposées publiquement et testées.
- Tests obligatoires : accès inter-tenant, rôle viewer, élévation de privilèges, doublons, suppression et conservation.

## Ordre de construction

Lot 1 — créer le projet Supabase vierge, valider région et accès, puis établir les migrations de base.
Lot 2 — identité, organisations, habilitations et isolation multi-tenant.
Lot 3 — référentiel entreprises, établissements, relations commerciales et liste d'exclusion.
Lot 4 — CRM interne : contacts, opportunités, activités, dossiers, tâches et relances.
Lot 5 — registre des sources et connecteurs officiels, en commençant par Annuaire des Entreprises/SIRENE, puis BODACC et BOAMP.
Lot 6 — recherche unifiée, rapprochement, déduplication et traçabilité.
Lot 7 — espace client, documents privés et automatisations après tests de sécurité.

## Règles de livraison

Chaque lot doit être commité sur cette branche, testé et documenté avant le suivant. Aucun déploiement de production ni aucune modification de l'ancienne branche de sauvegarde. Pas de copie des données de l'ancien Supabase. Les secrets ne sont jamais committés.
