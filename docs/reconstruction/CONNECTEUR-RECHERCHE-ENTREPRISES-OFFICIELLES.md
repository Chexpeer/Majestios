# Connecteur de recherche des entreprises officielles

## État

- Fonction Supabase : `search-official-companies`
- Projet : `majestios-crm`
- État : déployée et active
- Authentification : JWT Supabase obligatoire (`verify_jwt = true`)
- Version actuellement déployée : 2
- Code source : `supabase/functions/search-official-companies/index.ts`

## Fonctionnement

La fonction relaie les recherches authentifiées vers l'API ouverte Recherche d’Entreprises de la DINUM :

`https://recherche-entreprises.api.gouv.fr/search`

Paramètres acceptés :
- `q` : terme de recherche, raison sociale, adresse, SIREN ou SIRET (obligatoire, 2 à 120 caractères)
- `page` : pagination
- `per_page` : 1 à 25 résultats
- `departement` : code département à deux ou trois chiffres
- `activite_principale` : code APE/NAF

La fonction valide la session utilisateur, borne les paramètres, applique un délai maximal de 10 secondes, transmet un User-Agent descriptif et relaie proprement les limitations HTTP 429 du fournisseur. Elle ne détient aucune clé privée d'API externe et ne contourne aucune restriction.

## Distinction importante : recherche ouverte et API SIRENE

L'API Recherche d’Entreprises est une API ouverte qui agrège notamment des données issues de SIRENE et du RNE. Elle permet la recherche textuelle, mais ne donne pas accès à l'intégralité du répertoire SIRENE ; les entreprises non diffusibles ne sont notamment pas accessibles.

L'API SIRENE de l'INSEE est un service distinct, à souscription, à intégrer séparément si MajestiOS doit accéder à des données plus complètes ou à des fonctionnalités spécifiques. Aucun secret INSEE n'est nécessaire pour le connecteur de recherche ouvert livré ici.

## Limites et règles

- Quota fournisseur documenté : jusqu'à 7 requêtes/seconde par adresse IP ; ce maximum n'est pas un débit garanti.
- Le connecteur ne réalise pas encore d'import automatique dans `company_registry`.
- Aucun résultat n'est ajouté au CRM sans étape de rapprochement et de validation.
- Les données diffusibles et les conditions de réutilisation doivent être respectées.
- Les observations, la date de consultation et la provenance devront être conservées lors du futur mécanisme d'import.

## Invocation

`GET /functions/v1/search-official-companies?q=...&page=1&per_page=10`

L'appel doit inclure un JWT Supabase valide dans `Authorization: Bearer <access_token>`.

## Sources officielles

- INSEE, consulter et télécharger la base SIRENE : https://www.insee.fr/fr/information/3591226
- Catalogue des API INSEE : https://www.insee.fr/fr/information/8184146
- API Recherche d’Entreprises, documentation : https://recherche-entreprises.api.gouv.fr/docs/
- Présentation comparative des API : https://annuaire-entreprises.data.gouv.fr/donnees/api-entreprises
