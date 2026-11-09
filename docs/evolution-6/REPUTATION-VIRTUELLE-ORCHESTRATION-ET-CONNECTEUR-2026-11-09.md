# Orchestration initiale et premier connecteur de contexte — 9 novembre 2026

## Résultat de ce lot

Ce lot ajoute le premier connecteur automatique utilisable par le futur audit Cheexpeer : une consultation du référentiel public Recherche d'Entreprises (DINUM) pour vérifier l'identité administrative de l'entité auditée.

**Ce connecteur n'est pas un audit de réputation.** Il fournit un contexte de désambiguïsation (dénomination, SIREN, état administratif, activité et commune) qui permettra d'éviter d'attribuer à la mauvaise entreprise des résultats web, avis ou profils sociaux.

## Registre interne des sources

Le module `reputation-audit-connectors.mjs` contient un registre de capacités :
- identité administrative officielle : `ready`, connecteur implémenté ;
- recherche web et Maps : `manual_only`, pas de collecte automatique ;
- BODACC : `assessment`, intégration d'audit à qualifier ;
- plateformes sociales : `planned`, aucune connexion automatisée.

Le registre est interne. Le DTO remis à l'interface n'expose ni identifiant de fournisseur, ni statut technique, ni catalogue de connecteurs.

## Orchestration

`runReputationCollection` :
- ne sélectionne que les sources dont le statut est `ready` et dont le périmètre est demandé ;
- appelle uniquement un adaptateur explicitement fourni ;
- normalise les observations via le contrat commun `normalizeEvidence` ;
- borne la collecte à 20 preuves par source ;
- distingue les états `completed`, `partial` et `blocked` ;
- conserve les codes d'erreur et identifiants techniques dans le résultat interne.

Le connecteur d'identité appelle un endpoint fixe de l'API Recherche d'Entreprises. Il n'accepte aucune URL fournie par l'utilisateur et ne permet donc pas de transformer le service en proxy HTTP arbitraire.

## Limites

- Le connecteur ne collecte ni avis clients, ni résultats de recherche web, ni contenus de réseaux sociaux.
- Il n'établit aucun score, diagnostic ou jugement de réputation.
- Le connecteur est une brique backend testée par injection d'un transport simulé ; il n'est pas encore raccordé à une Edge Function déployée ni à l'interface Réputation virtuelle.
- Aucune migration, modification RLS, accès CRM VIP ou déploiement Supabase n'est inclus.

## Tests

Les tests couvrent :
- l'appel au domaine officiel fixe ;
- la normalisation des données administratives ;
- la correspondance au sujet ;
- la gestion du statut HTTP 429 ;
- l'exécution exclusive des sources marquées `ready` ;
- l'exclusion des identifiants internes du DTO UI ;
- le non-déclenchement des sources manuelles ou planifiées.

## Étape suivante

Créer une Edge Function authentifiée dédiée à l'audit, qui invoque ce connecteur côté serveur, applique les contrôles d'accès appropriés, puis retourne uniquement le DTO normalisé. Cette fonction devra rester non déployée jusqu'à validation de ses tests, de son contrat d'accès et des conditions d'utilisation de chaque source.
