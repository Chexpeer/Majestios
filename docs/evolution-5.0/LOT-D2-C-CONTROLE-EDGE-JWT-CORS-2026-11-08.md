# Lot D2-C — contrôle de disponibilité hébergée, JWT et CORS — 8 novembre 2026

**Branche contrôlée :** `feature/crm-atomic-integration`  
**Projet Supabase :** `majestios-crm` (`qxaghcifdhugfskuscoc`), région `eu-west-3`  
**Nature du contrôle :** lecture seule — aucun appel à l'endpoint membre, aucune écriture Supabase, aucun déploiement.

## 1. État réel de l'Edge Function hébergée

La liste des fonctions Edge du projet hébergé a été interrogée directement.

Fonctions présentes et actives :
- `search-official-companies` — version 4, JWT requis ;
- `import-official-company` — version 2, JWT requis ;
- `bootstrap-internal-admin` — version 3, JWT requis.

**Constat : `prospection-search-member` est absente de la liste hébergée.** La récupération de son détail renvoie également « Function not found ».

Conséquences :
- aucune version hébergée ne peut être attribuée à `prospection-search-member` ;
- son réglage `verify_jwt` hébergé n'est pas vérifiable puisqu'elle n'existe pas sur ce projet ;
- l'endpoint n'est pas disponible pour une recette live ;
- aucun appel fonctionnel ni préflight CORS réel n'a été tenté.

Le statut actif des trois autres fonctions ne prouve pas le déploiement de la fonction membre.

## 2. Correspondance du client web avec le projet

Contrôles en lecture seule :
- l'URL de projet présente dans `supabase-config.js` correspond à l'URL renvoyée par le projet hébergé ;
- la clé publique de type publishable configurée dans le dépôt correspond à une clé publishable active du même projet ;
- le client navigateur et la fonction serveur épinglent tous deux `@supabase/supabase-js@2.119.0` ;
- aucun secret `service_role` n'est présent dans le client navigateur inspecté.

La configuration de liaison locale `supabase/config.toml` déclare toutefois `project_id = "majestios-local-auth-ci"`. Elle correspond à un environnement local/de test et non au ref du projet hébergé. Ne pas lancer un déploiement depuis cette configuration sans une liaison explicite, vérifiée et autorisée vers le projet cible.

## 3. Contrôle statique du contrat CORS dans le code source

Le code source de `supabase/functions/prospection-search-member/index.ts` prévoit :
- le traitement de `OPTIONS` avant le contrôle du jeton ;
- les méthodes `POST, OPTIONS` ;
- les en-têtes usuels `authorization`, `x-client-info`, `apikey` et `content-type` ;
- une origine renvoyée uniquement si elle satisfait la règle d'autorisation ;
- les origines fixes `https://majestios.com`, `https://www.majestios.com` et un aperçu Vercel précis ;
- une variable d'environnement `ALLOWED_ORIGINS` ;
- une expression régulière autorisant les sous-domaines de prévisualisation de forme `majestios-…-majistr.vercel.app`.

Le code ne renvoie pas `Access-Control-Allow-Origin` pour une origine refusée et répond alors par un refus 403. Le comportement de préflight est cohérent dans son principe avec une fonction qui gère elle-même CORS.

**Point à corriger ou à valider avant mise en service :** la liste `Access-Control-Allow-Headers` est codée en dur et ne comprend pas `x-retry-count`. La documentation Supabase actuelle recommande, avec les versions récentes de `supabase-js`, d'importer les `corsHeaders` du SDK pour suivre la liste d'en-têtes attendue. Les en-têtes de propagation de trace (`traceparent`, `tracestate`, `baggage`) ne sont nécessaires que si la propagation de traces est activée côté client. Le client MajestiOS inspecté ne l'active pas explicitement. Il faudra néanmoins aligner le CORS sur le SDK réellement déployé et tester le préflight depuis les origines de production et de prévisualisation retenues.

La règle regex de prévisualisation autorise une famille de sous-domaines Vercel, plus large qu'une liste de déploiements nommés. C'est un choix de périmètre à confirmer : préférer une liste maîtrisée si tous les aperçus n'ont pas vocation à appeler l'API.

La valeur effective de `ALLOWED_ORIGINS` n'a pas été inspectée ; aucun secret ou paramètre d'environnement n'a été lu. Les origines réellement servies par le projet ne peuvent donc pas être certifiées à partir du seul dépôt.

## 4. Authentification et habilitations prévues par le code

Le code source prévoit deux couches complémentaires :
1. le contrôle JWT au niveau de la passerelle Supabase, à conserver avec `verify_jwt: true` lors du futur déploiement ;
2. la vérification applicative du jeton avec Supabase Auth, puis le contrôle des appartenances et de l'organisation cliente avec le client utilisateur soumis à RLS.

Le contrôle applicatif exige une adresse e-mail confirmée et exactement une appartenance à une organisation de type client, avec un rôle membre accepté. Cette logique est présente dans les fichiers source consultés, mais n'a pas été exécutée sur le projet hébergé puisque la fonction est absente.

## 5. Décision de recette et de raccordement

**D2-C ne valide pas le passage en recette live.** Le prérequis principal échoue : l'Edge Function membre n'est pas déployée sur le projet Supabase ciblé.

Ordre recommandé pour la suite :
1. préparer un lot de mise en service distinct, avec vérification du contenu exact de la fonction et de toutes ses dépendances partagées ;
2. aligner les en-têtes CORS avec `supabase-js@2.119.0`, choisir précisément les origines autorisées et contrôler la valeur de configuration correspondante sans l'exposer ;
3. confirmer explicitement le projet cible et la liaison de déploiement ; conserver `verify_jwt: true` ;
4. obtenir une autorisation explicite avant tout déploiement de l'Edge Function ;
5. après déploiement autorisé, vérifier sa version hébergée, effectuer le préflight CORS depuis les origines retenues, puis conduire une recette authentifiée encadrée avec un compte membre autorisé et un compte non autorisé ;
6. seulement après validation, préparer une bascule frontend distincte et autorisée, avec comparaison interne des résultats et sans exposition des fournisseurs ou de la provenance.

## 6. Périmètre préservé

- aucune requête HTTP à `prospection-search-member` ;
- aucune lecture ou modification de secret ;
- aucune écriture SQL, migration, modification RLS ou Auth ;
- aucun déploiement ou redéploiement Edge Function ;
- aucun raccordement du module navigateur à `qualification-entreprises.html` ;
- aucun merge ni déploiement Vercel ;
- aucune exposition de source, fournisseur, URL ou métadonnée technique à l'interface membre.

## 7. Références techniques

- [Guide Supabase — CORS pour les Edge Functions](https://supabase.com/docs/guides/functions/cors) : préflight et en-têtes attendus par les clients récents.
- [Guide Supabase — authentification des Edge Functions](https://supabase.com/docs/guides/functions/auth) : validation JWT au niveau de la passerelle et authentification applicative.
- [Changelog Supabase — changements récents](https://supabase.com/changelog?types=breaking-change) : le changement CLI v3 du 4 novembre 2026 concerne les opérations CLI locales/hébergées ; aucun CLI ni déploiement n'a été utilisé dans ce lot.

**Critère de sortie D2-C :** statut hébergé établi, compatibilité de configuration vérifiée, écarts CORS documentés et absence de déploiement/recette live justifiée. Le statut de disponibilité est établi : fonction absente ; la recette et la bascule restent bloquées jusqu'à un lot de mise en service autorisé.
