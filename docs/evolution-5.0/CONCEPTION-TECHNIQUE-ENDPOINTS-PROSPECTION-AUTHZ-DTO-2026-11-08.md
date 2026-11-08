# Conception technique des endpoints de Prospection — autorisation serveur et DTO commun

Date : 2026-11-08  
Branche : `feature/crm-atomic-integration`  
Périmètre : conception technique, sans modification applicative ni Supabase

## 1. Décision d'architecture

Construire deux Edge Functions métier distinctes, partageant un noyau de recherche et de normalisation :

| Fonction cible | Accès plateforme | Rôle |
|---|---|---|
| `prospection-directory-public` | Public, sans JWT obligatoire | Annuaire généraliste borné |
| `prospection-search-member` | JWT obligatoire | Recherche avancée après autorisation organisationnelle |

Les deux fonctions appellent les mêmes modules partagés de validation, orchestration, normalisation et construction du DTO. Elles n'exposent pas les mêmes capacités ni les mêmes champs.

Le moteur global de recherche de l'accueil demeure hors périmètre. Les consommateurs concernés sont les pages de la rubrique Prospection et de qualification d'entreprises.

### Pourquoi deux fonctions et non un endpoint avec un paramètre `mode`

- La fonction publique doit accepter les appels sans session, alors que le parcours membre doit imposer un JWT valide.
- La configuration plateforme `verify_jwt` s'applique par fonction, avant l'exécution du code. Une séparation rend les frontières plus explicites et réduit le risque qu'un paramètre envoyé par le navigateur fasse basculer le niveau d'accès.
- Les deux fonctions partagent le même noyau métier ; ce ne sont donc pas deux moteurs indépendants.

Les noms sont des identifiants de conception, pas des fonctions déjà créées.

## 2. Arborescence technique cible

Structure proposée :

```text
supabase/
  config.toml                         # à créer/compléter dans un lot de code autorisé
  functions/
    _shared/
      prospection-contract.ts         # types et constantes DTO
      prospection-validation.ts       # validation stricte des entrées
      prospection-normalizer.ts       # normalisation des fiches
      prospection-search-core.ts      # orchestration et dédoublonnage
      prospection-authz.ts            # résolution du droit membre côté serveur
      prospection-errors.ts           # codes et réponses stables
    prospection-directory-public/
      index.ts
    prospection-search-member/
      index.ts
```

Le dossier `_shared` est du code serveur partagé ; il ne doit contenir aucun secret en dur. Les fonctions existantes `search-official-companies` et `import-official-company` restent inchangées dans cette étape. Leur migration ou leur dépréciation sera traitée après tests de compatibilité et recherche de tous leurs consommateurs.

## 3. Configuration d'authentification des fonctions

Configuration cible à examiner lors de l'implémentation :

```toml
[functions.prospection-directory-public]
verify_jwt = false

[functions.prospection-search-member]
verify_jwt = true
```

- Le parcours public doit pouvoir être appelé sans JWT ; le handler reste responsable de valider toutes les entrées, appliquer les quotas et ne retourner que le DTO public.
- Le parcours membre conserve la vérification JWT plateforme activée, puis vérifie à nouveau l'identité auprès de Supabase Auth dans le handler et applique l'autorisation métier.
- La clé publishable sert à initialiser un client limité par RLS ; elle n'est jamais une preuve d'identité.
- La clé `service_role` / secret ne doit pas être utilisée pour les lectures d'habilitation. Ne pas contourner RLS pour simplifier l'autorisation.
- Les appels au navigateur doivent transmettre le JWT de session dans `Authorization: Bearer <user-access-token>` et la clé publishable dans `apikey`, jamais la clé publishable comme bearer utilisateur.

Le dépôt ne contient actuellement pas de `supabase/config.toml` à la racine Supabase. Il faudra vérifier la configuration effective du projet et créer le fichier versionné avant tout déploiement. Ne pas supposer que le changement de configuration Git modifie la configuration hébergée.

## 4. Résolution de l'autorisation membre

### 4.1 Flux de contrôle serveur

Pour chaque appel à `prospection-search-member` :

1. Exiger un en-tête Authorization de forme Bearer.
2. Construire un client Supabase avec la clé publishable et le JWT de l'appelant dans le contexte Authorization.
3. Appeler `auth.getUser(accessToken)` pour vérifier l'identité côté serveur. Ne pas prendre l'identité depuis le corps, les paramètres URL, `user_metadata` ou une valeur locale du navigateur.
4. Pour le parcours d'inscription par e-mail, exiger une confirmation d'adresse conformément au flux existant ; un compte sans confirmation est refusé. Le comportement pour d'éventuels comptes non-email doit être arbitré séparément avant de les accepter.
5. Lire les memberships de cet utilisateur dans `organization_members` avec le client utilisateur et RLS active. Filtrer par l'identifiant issu de `auth.getUser`.
6. Lire les organisations correspondantes dans `organizations`, également avec le client utilisateur et RLS active.
7. Résoudre les organisations de type `client` et leurs rôles. Exiger exactement une organisation cliente distincte.
8. Autoriser uniquement les rôles `owner`, `admin` ou `member`. Refuser `viewer`.
9. Ne jamais prendre `organization_id` ou `role` depuis la requête comme preuve ou comme source de vérité.
10. En cas d'erreur de lecture, de données incohérentes, d'absence ou d'ambiguïté, refuser par défaut sans lancer la recherche.

### 4.2 Pseudo-code de référence

```ts
async function resolveProspectionAccess(req: Request) {
  const token = readBearerToken(req);
  if (!token) return deny(401, "AUTH_REQUIRED");

  const userClient = createUserScopedClient(token);
  const { data, error } = await userClient.auth.getUser(token);
  if (error || !data.user) return deny(401, "AUTH_REQUIRED");

  if (requiresConfirmedEmail(data.user) && !hasConfirmedEmail(data.user)) {
    return deny(403, "ACCESS_DENIED");
  }

  const memberships = await loadOwnMemberships(userClient, data.user.id);
  if (memberships.error) return deny(403, "ACCESS_DENIED");

  const organizations = await loadVisibleOrganizations(
    userClient,
    unique(memberships.rows.map(row => row.organization_id))
  );
  if (organizations.error) return deny(403, "ACCESS_DENIED");

  const clientMemberships = joinMembershipsToOrganizations(memberships.rows, organizations.rows)
    .filter(item => item.organization.kind === "client");

  const uniqueClientOrganizations = uniqueBy(clientMemberships, item => item.organization.id);
  if (uniqueClientOrganizations.length !== 1) return deny(403, "ACCESS_DENIED");

  const roles = uniqueRolesFor(uniqueClientOrganizations[0]);
  if (roles.length !== 1 || !["owner", "admin", "member"].includes(roles[0])) {
    return deny(403, "ACCESS_DENIED");
  }

  return allow({
    userId: data.user.id,
    organizationId: uniqueClientOrganizations[0].organization.id,
    role: roles[0]
  });
}
```

Ce pseudo-code décrit la politique, pas une implémentation prête à compiler. Les fonctions de lecture doivent vérifier les erreurs Supabase, les résultats nuls, les doublons et les réponses inattendues. Si une jointure PostgREST est retenue, sa relation et ses noms doivent être vérifiés sur le schéma réel.

### 4.3 Pourquoi le client utilisateur est requis

Les policies RLS observées permettent à un membre de lire les memberships de son organisation via `private.is_org_member(organization_id)`, et ses organisations via le même helper. Un client attaché au JWT permet de faire ces lectures dans le contexte de l'appelant.

L'utilisation d'un client service-role pour résoudre le droit membre serait inutilement privilégiée et ferait perdre cette défense RLS. Le secret/service-role reste réservé à une opération serveur explicitement privilégiée, jamais à la simple vérification d'accès.

### 4.4 Limites connues du modèle de données

Le schéma observé de `organization_members` comporte `organization_id`, `user_id`, `role`, `created_at`, mais pas de statut `active` / `suspended` ni de permission dédiée à la Prospection.

Conséquences :
- une ligne existante est considérée comme une appartenance existante ; aucune suspension logique ne peut être vérifiée ;
- `member` est accepté selon la règle provisoire validée, mais ce rôle ne représente pas une permission Prospection spécifique ;
- une suspension fiable et des droits métier fins nécessiteront une évolution de schéma, RLS et workflows, hors de ce lot et après autorisation distincte ;
- une appartenance supprimée doit être refusée dès la requête suivante, sous réserve de la fraîcheur de la lecture serveur.

Les organisations `internal` et `partner` ne confèrent jamais le droit d'utiliser le parcours client. Le droit est exclusivement fondé sur l'unique appartenance `client` autorisée.

## 5. Contrat DTO commun

Le noyau de recherche transforme les réponses amont en objets métier internes, puis projette explicitement les champs autorisés vers le DTO. Ne jamais faire `return {...upstreamRecord}` ou propager un objet amont avec suppression de quelques clés interdites : utiliser une liste blanche positive.

### 5.1 Types conceptuels

```ts
type SearchErrorCode =
  | "INVALID_QUERY"
  | "INVALID_FILTERS"
  | "AUTH_REQUIRED"
  | "ACCESS_DENIED"
  | "RATE_LIMITED"
  | "SEARCH_TEMPORARILY_UNAVAILABLE"
  | "PARTIAL_RESULTS"
  | "INTERNAL_ERROR";

type DirectoryCompanyDTO = {
  id: string;                    // identifiant opaque MajestiOS
  siren?: string;
  name: string;
  activity_label?: string;
  legal_status?: "active" | "inactive" | "unknown";
  address?: {
    postal_code?: string;
    city?: string;
    department?: string;
  };
};

type MemberCompanyDTO = DirectoryCompanyDTO & {
  siret?: string;
  trade_name?: string;
  activity_code?: string;
  legal_form?: string;
  creation_date?: string;
  workforce_band?: string;
  qualification?: {
    score: number | null;
    label: string;
    reasons: string[];
  };
  last_verified_at?: string;
};

type SearchSuccess<T> = {
  ok: true;
  request_id: string;
  items: T[];
  page: {
    number: number;
    size: number;
    returned: number;
    has_more: boolean;
    total: number | null;
  };
  applied_filters?: Record<string, unknown>;
  quality?: {
    partial: boolean;
    warnings: string[];
  };
};

type SearchFailure = {
  ok: false;
  request_id: string;
  error: {
    code: SearchErrorCode;
    message: string;
    retryable: boolean;
  };
};
```

Les types ci-dessus sont conceptuels. Les valeurs réelles doivent être validées, les champs absents omis ou représentés selon un schéma uniforme, et les valeurs d'énumération maintenues par le code MajestiOS.

### 5.2 Projection publique

La fonction publique projette uniquement :
- identifiant opaque MajestiOS ;
- SIREN, si disponible et nécessaire à l'identification ;
- dénomination ;
- libellé d'activité ;
- état administratif normalisé ;
- adresse synthétique (code postal, commune, département).

Elle ne retourne jamais SIRET détaillé, effectifs, chiffres d'affaires, labels, raisons de qualification, score, signaux, informations privées, enrichissements CRM ou détails techniques. Le détail exact de la fiche publique doit être revu au regard de la finalité et de la base légale avant mise en production.

### 5.3 Projection membre

Le DTO membre ajoute les attributs B2B utiles au ciblage seulement s'ils sont disponibles, normalisés et autorisés : SIRET, code activité, forme juridique, date de création, tranche d'effectif et indicateurs de qualification. Les chiffres d'affaires, labels et signaux complémentaires doivent rester des critères/attributs distincts, avec indication explicite de disponibilité et de qualité.

Le score n'est jamais une preuve de capacité technique, de solvabilité, de compétence ou d'éligibilité. Les données inconnues ne doivent pas être assimilées à des valeurs négatives.

### 5.4 Champs interdits

Interdiction de transmettre, à toute profondeur et dans toute réponse :
`source`, `source_name`, `provider`, `authority`, `connector`, `source_id`, `source_url`, URL amont, `raw`, `payload`, `upstream`, `debug`, `response`, schéma fournisseur, identifiants de connecteur, erreurs externes brutes, secrets ou métadonnées permettant d'identifier les fournisseurs.

Un test récursif de non-divulgation doit parcourir le JSON complet, y compris les objets imbriqués, erreurs et avertissements. Une liste blanche positive doit constituer la protection principale ; le test récursif est une défense supplémentaire.

## 6. Noyau de recherche partagé

Le noyau partagé reçoit une intention métier validée et un contexte de capacités construit par le serveur. Il ne reçoit jamais un mode d'accès ou une organisation décidés par le navigateur.

Responsabilités :
1. valider les critères métier et les listes blanches ;
2. déterminer les capacités autorisées à partir du handler appelant ;
3. orchestrer les fournisseurs côté serveur sans exposer leur identité ;
4. appliquer délais, limites, dédoublonnage et normalisation ;
5. produire un résultat de qualité : complet, partiel ou indisponible ;
6. projeter les champs vers le DTO public ou membre ;
7. écrire la provenance et les détails techniques uniquement dans une couche d'audit serveur restreinte, si cette couche existe et a été approuvée.

Ne pas implémenter de persistance technique dans une table publique tant que les droits RLS/grants et la rétention n'ont pas fait l'objet d'une revue dédiée.

## 7. Sécurité de l'endpoint public et limites opérationnelles

Un endpoint sans JWT est volontairement accessible à tout appelant. CORS ne constitue pas un contrôle d'accès et n'empêche pas les appels directs hors navigateur.

Avant mise en production, il faut donc un mécanisme partagé et fiable de limitation de fréquence et de protection contre l'extraction massive. Un compteur en mémoire dans une instance Edge Function n'est pas suffisant, car les instances sont distribuées et éphémères.

Options à arbitrer avant le code :
- limitation au niveau d'une passerelle/WAF si l'infrastructure existante permet de compter par IP ou clé ;
- compteur partagé serveur, avec table dédiée et politiques/grants strictement conçus, ce qui demanderait une autorisation de changement SQL/RLS ;
- service de rate limiting externe déjà approuvé par le projet.

Ne pas prétendre que les valeurs indicatives du contrat précédent sont garanties tant qu'un mécanisme partagé n'est pas choisi et testé. Ne pas faire confiance à un `X-Forwarded-For` fourni directement par le client ; utiliser uniquement une information IP documentée comme injectée par la passerelle de confiance. Les limites doivent aussi couvrir la taille de réponse, les délais, les recherches répétitives et les patterns d'énumération.

CORS doit autoriser les origines MajestiOS nécessaires, mais la liste des origines n'est pas une barrière contre les appels serveur-à-serveur. Les réponses doivent rester protégées par les règles applicatives et les quotas.

## 8. Correspondance avec le code observé

Inspection statique de la branche `feature/crm-atomic-integration` :

- `supabase/functions/search-official-companies/index.ts` exige actuellement un JWT, mais renvoie le nom du fournisseur, son URL, le payload complet et un statut amont. Il ne vérifie pas l'appartenance à une organisation cliente.
- `company-targeting.js` appelle directement les API d'entreprises et de géolocalisation depuis le navigateur ; il transporte `sourceUrl`, `sourceId`, `raw`, les requêtes et les horodatages.
- `prospection-active.html` et `qualification-entreprises.html` chargent le moteur côté navigateur. La page de qualification nomme encore le service technique dans son texte introductif.
- `import-official-company/index.ts` reçoit actuellement `organization_id` depuis le navigateur et s'appuie sur `can_import_official_company`. Ce parcours d'import devra être revu séparément ; il ne doit pas être utilisé comme preuve d'autorisation pour la recherche.
- Le dossier Supabase versionné ne contient pas actuellement `supabase/config.toml`.
- Le frontend CRM utilise Supabase JS 2.119.0 via esm.sh. Les Edge Functions restaurées importent `npm:@supabase/supabase-js@2`.

Aucun de ces constats n'a été corrigé dans ce document.

## 9. Plan de réalisation en lots sûrs

### Lot A — autorisation et contrat commun (prochaine étape de code)
- créer les types DTO, codes d'erreur et validateurs ;
- créer `prospection-authz.ts` et tests unitaires sur les cas autorisés/refusés ;
- créer des helpers de client utilisateur et de lecture RLS ;
- ne pas ajouter de table, policy, fonction SQL ou secret ;
- ne pas utiliser de client service-role pour l'autorisation.

### Lot B — endpoint membre isolé
- créer `prospection-search-member` avec JWT obligatoire ;
- appeler le contrôle d'autorisation avant toute recherche ;
- ne pas accepter l'organisation depuis le navigateur ;
- utiliser le noyau de recherche et le DTO commun ;
- tests d'accès et de non-divulgation.

### Lot C — endpoint public
- arbitrer le mécanisme partagé de quotas avant implémentation ;
- configurer `verify_jwt = false` uniquement pour la fonction publique ;
- créer le contrat de recherche simple et la projection synthétique ;
- tester les appels anonymes, paramètres interdits, quotas et limites d'extraction.

### Lot D — migration des consommateurs
- basculer `company-targeting.js` vers les endpoints MajestiOS ;
- supprimer appels directs, données brutes et métadonnées de provenance du navigateur ;
- migrer la géolocalisation côté serveur ;
- adapter les pages Prospection et qualification aux deux niveaux ;
- ne pas modifier le moteur de recherche global de l'accueil.

### Lot E — vérification et déploiement
- tests automatisés, tests de sécurité et build ;
- revue RLS/grants, quotas, CORS, journalisation et rétention ;
- comparaison des sources locales avec les fonctions déployées ;
- déploiement uniquement après autorisation explicite distincte.

## 10. Tests techniques prioritaires

### Autorisation
- JWT absent, invalide ou expiré : 401 ;
- identité Auth introuvable : 401 ;
- e-mail non confirmé sur le parcours d'inscription par e-mail : 403 ;
- erreur de lecture memberships/organisations : refus fermé ;
- aucune organisation cliente : 403 ;
- plusieurs organisations clientes : 403 ;
- rôle `viewer` : 403 ;
- rôle `owner`, `admin`, `member` sur une unique organisation cliente : autorisé ;
- organisation `internal` ou `partner` seule : 403 ;
- organisation ou rôle falsifié dans le corps : sans effet ;
- appartenance supprimée : refus à la prochaine résolution serveur.

### DTO
- liste blanche positive uniquement ;
- aucun champ interdit, même imbriqué ;
- aucun message d'erreur ou détail fournisseur transmis ;
- réponse partielle distincte d'une réponse vide complète ;
- résultat de score non présenté comme preuve de compétence ;
- champs manquants traités explicitement.

### Public
- appel sans Authorization accepté uniquement par la fonction publique ;
- appel public avec critères avancés rejeté ;
- quota partagé et extraction massive testés avant mise en production ;
- CORS et préflight corrects, sans les considérer comme une autorisation.

## 11. Références et limites

- Contrat de données : `docs/evolution-5.0/CONTRATS-SERVEUR-PROSPECTION-ANNUAIRE-PUBLIC-ET-MEMBRE-2026-11-08.md`.
- Audit des habilitations : `docs/evolution-5.0/AUDIT-HABILITATIONS-SUPABASE-PROSPECTION-2026-11-08.md`.
- Audit DTO et consommateurs : `docs/evolution-5.0/CONTRAT-DTO-RECHERCHE-UNIFIEE-ET-AUDIT-CONSOMMATEURS-2026-11-08.md`.

Cette étape est une conception fondée sur l'état Git et les audits Supabase antérieurs. Les signatures SQL, relations PostgREST, policies et configuration hébergée doivent être revalidées pendant l'implémentation. Aucun test runtime, build ou déploiement n'a été exécuté ici.

## 12. Garde-fous

- Aucun code applicatif ou Edge Function modifié dans cette étape.
- Aucun changement SQL, migration, RLS, grants, secret ou configuration hébergée.
- Aucun déploiement Supabase ou Vercel.
- Aucune modification du moteur global de recherche de l'accueil.
- Aucune exposition de source, fournisseur, connecteur ou provenance au navigateur.
