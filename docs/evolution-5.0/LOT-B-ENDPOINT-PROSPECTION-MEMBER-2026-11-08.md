# Lot B — premier endpoint authentifié de Prospection

Date : 8 novembre 2026  
Branche : feature/crm-atomic-integration  
Endpoint source : supabase/functions/prospection-search-member/index.ts

## Objectif et périmètre

Création du premier endpoint serveur de recherche avancée réservé aux membres d'une organisation cliente. Il réutilise les contrats, validateurs, DTO et le résolveur d'habilitation du lot A.

Le point d'entrée est exclusivement POST, exige un JWT utilisateur, confirme l'identité auprès de Supabase Auth, puis applique la politique d'appartenance via le client utilisateur soumis à RLS. Il ne reçoit ni ne fait confiance à un organization_id ou à un rôle fourni par le navigateur.

## Fonctionnement

1. Vérification de la méthode, de l'origine CORS, du type et de la taille du corps.
2. Vérification du bearer JWT et de l'e-mail confirmé.
3. Résolution serveur d'une seule appartenance cliente avec rôle owner, admin ou member.
4. Validation stricte des critères.
5. Appel serveur à l'API officielle de recherche d'entreprises, avec une requête unique par recherche.
6. Normalisation des fiches et projection vers le DTO membre.
7. Retour de 10 résultats maximum par page, avec identifiant de requête, pagination et indicateur de résultat partiel.

Les appels au fournisseur et la géolocalisation éventuelle restent exclusivement côté serveur. Aucun nom de fournisseur, URL amont, payload brut, paramètre technique, détail d'erreur amont ou identifiant de connecteur n'est retourné.

## Filtres effectivement couverts

- Recherche textuelle.
- Codes APE/NAF.
- Départements et régions.
- Tranches d'effectif via les codes administratifs officiels.
- Formes juridiques via leur code.
- Labels RGE, Qualiopi, EPV et ESS.
- Dates de création, appliquées côté serveur après récupération.
- Recherche géographique par commune ou code postal, avec rayon de 1 à 50 km et code APE/NAF obligatoire.

Les critères incompatibles avec le mode géographique sont rejetés. Les recherches directes par SIREN/SIRET ne peuvent pas être combinées avec d'autres filtres, car l'API officielle ignore ces filtres dans ce cas.

**Chiffre d'affaires :** le filtre revenue_bands est explicitement refusé dans ce premier endpoint. L'API renvoie des données financières dans certains résultats, mais le contrat de tranches de CA et les règles de fraîcheur/exercice doivent être définis avant de prétendre filtrer correctement. Le critère n'est jamais silencieusement ignoré.

## Gestion des erreurs

Les réponses utilisent des codes MajestiOS stables. Les erreurs HTTP amont, messages techniques, URL, stack traces et corps de réponse amont ne sont jamais transmis. Le statut 429 est converti en erreur MajestiOS de limitation temporaire.

## Fichiers

- supabase/functions/prospection-search-member/index.ts — nouvel endpoint.
- supabase/functions/_shared/prospection-search-core.mjs — orchestration, géocodage, paramètres API et normalisation.
- supabase/functions/_shared/prospection-validation.mjs — critères réellement supportés et incompatibilités explicites.
- supabase/functions/_shared/prospection-contract.mjs — codes d'erreur de méthode et de taille.
- supabase/functions/_shared/prospection-errors.mjs — statuts HTTP.
- tests/prospection-search-core.test.cjs — tests du moteur serveur.
- .github/workflows/verify-site.yml — contrôles et tests du lot B.
- supabase/functions/README.md — inventaire des fonctions et statut de déploiement.
- présent compte rendu.
- docs/README.md — index documentaire.

## Sécurité et limites

- Aucun client service_role n'est utilisé.
- Aucune appartenance ou organisation n'est choisie par le navigateur.
- CORS restreint les origines web connues et les previews MajestiOS ; CORS n'est pas considéré comme un contrôle d'accès.
- Pas de limitation globale inter-instances : elle nécessite un mécanisme partagé (base de données, gateway ou service dédié) et reste un prérequis avant ouverture à grande échelle.
- Pas de cache applicatif.
- Aucun export, sauvegarde CRM ou écriture en base.
- Aucun appel au moteur global de recherche de l'accueil.
- Aucun consommateur frontend migré.
- Aucun changement SQL, RLS, grant, Auth, secret ou configuration hébergée.

## Vérifications attendues

La CI exécute les tests unitaires du noyau de recherche et l'ensemble des vérifications existantes. Ces tests utilisent des réponses simulées et ne constituent pas un test d'intégration authentifié avec le projet Supabase. L'endpoint n'est pas déployé ; son activation exige une validation distincte des tests d'intégration, de la configuration de fonction et de la stratégie de limitation globale.
