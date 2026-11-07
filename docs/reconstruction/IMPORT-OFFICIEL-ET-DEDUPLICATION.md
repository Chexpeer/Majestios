# Import officiel et dédoublonnage du référentiel MajestiOS

## Composants livrés

- Recherche : `search-official-companies` (JWT requis).
- Import : `import-official-company` (JWT requis).
- Autorisation : `public.can_import_official_company(organization_id)`, qui exige un rôle owner/admin/member dans l'organisation ciblée.
- Écriture atomique : `public.import_official_company_record(...)`, exécutable uniquement par le rôle serveur Supabase.
- Référentiel central : une ligne par SIREN dans `company_registry`.
- Établissements : une ligne par SIRET dans `company_registry_establishments`.
- Rattachement CRM : une fiche `businesses` par couple organisation/SIREN.
- Provenance : observation de la source conservée dans `company_source_observations`.

## Règles de rapprochement

1. Le SIREN est la clé de rapprochement de l'unité légale.
2. Le SIRET est la clé de rapprochement de chaque établissement.
3. Une entreprise déjà connue dans le référentiel est mise à jour, pas dupliquée.
4. Une entreprise déjà présente dans le CRM de l'organisation est rapprochée par la contrainte unique `(organization_id, siren)`.
5. Les champs commerciaux (qualification, notes, affectation, contacts, opportunités) ne sont pas écrasés par la synchronisation officielle.
6. Les données importées sont initialement classées `to_review`; aucune prospection ni prise de contact n'est déclenchée automatiquement.
7. Le connecteur importe au maximum 200 établissements retournés par la recherche ; les résultats non retournés ne sont pas inventés.

## Sécurité

- Les deux fonctions Edge exigent un JWT Supabase valide.
- L'import vérifie d'abord l'identité du demandeur et son habilitation dans l'organisation.
- La clé service_role reste côté serveur et n'est jamais renvoyée au navigateur.
- La fonction SQL d'écriture refuse tout appel qui n'est pas effectué avec le rôle service_role.
- Les clients ne peuvent pas appeler directement la fonction SQL d'écriture.
- Les accès aux données restent soumis aux politiques RLS pour les opérations navigateur.

## État opérationnel / prérequis

Le nouveau projet ne contient actuellement aucun utilisateur Auth ni membre d'organisation (contrôle du 7 novembre 2026). La procédure sécurisée `private.bootstrap_first_internal_admin(uuid)` est installée mais volontairement non exécutée : elle exige un utilisateur Auth existant avec adresse e-mail confirmée et ne crée aucun compte.

En conséquence, le code de recherche et d'import est déployé, mais un import réel ne peut pas être autorisé tant que le premier compte administrateur MajestiOS n'a pas été créé/confirmé puis explicitement rattaché à l'organisation interne. Ne pas contourner cette étape en accordant un rôle au premier compte venu.

## Appels

Recherche :
`GET /functions/v1/search-official-companies?q=...`

Import par SIREN :
`POST /functions/v1/import-official-company`
JSON : `{"organization_id":"<uuid>","siren":"<9 chiffres>"}`

Le JWT de l'utilisateur doit être transmis dans `Authorization: Bearer <access_token>`.
