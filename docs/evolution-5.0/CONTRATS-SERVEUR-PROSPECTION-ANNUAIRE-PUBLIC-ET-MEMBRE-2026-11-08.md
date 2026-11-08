# Contrats serveur de Prospection — annuaire public et recherche membre

Date : 2026-11-08  
Branche cible : `feature/crm-atomic-integration`  
Nature du lot : contrat fonctionnel et technique documentaire uniquement

## 1. Objet et décisions structurantes

Le moteur de Prospection reste un moteur métier unique. Il expose deux niveaux de capacité, déterminés côté serveur :

- **Visiteur** : annuaire généraliste réel, recherche simple et fiche publique synthétique.
- **Membre** : recherche multicritère et fonctions B2B après authentification et autorisation serveur.

Il ne s'agit ni de deux moteurs indépendants, ni d'un accès avancé simplement masqué dans l'interface. Les deux parcours partagent l'orchestration, la normalisation, le dédoublonnage et les règles de non-divulgation des fournisseurs.

**Hors périmètre strict :** le moteur global de recherche de la page d'accueil ne doit subir aucune modification, ni directe ni indirecte dans ce lot.

Les fournisseurs, annuaires amont, connecteurs, logos, URLs, identifiants et détails de provenance restent invisibles dans tous les écrans et toutes les réponses navigateur. La traçabilité technique demeure côté serveur, dans un périmètre restreint.

## 2. Contrats HTTP logiques

Les chemins ci-dessous sont des noms contractuels indicatifs, pas des endpoints déjà créés :

| Parcours | Opération logique | Authentification | Autorisation |
|---|---|---|---|
| Visiteur | `POST /api/prospection/directory/search` | Aucune session obligatoire | Politique publique, paramètres et quotas stricts |
| Visiteur | `GET /api/prospection/directory/companies/{opaque_id}` | Aucune session obligatoire | Fiche publique synthétique uniquement |
| Membre | `POST /api/prospection/search` | JWT Supabase valide | Appartenance client et rôle autorisés résolus côté serveur |
| Membre | Sauvegarde / préparation / transmission CRM | JWT Supabase valide | Contrôle serveur distinct selon l'action et les droits CRM |

Le navigateur ne choisit jamais le fournisseur, le connecteur, l'organisation de travail ou la route amont. Il transmet des critères métier autorisés. Le serveur détermine le parcours d'après la session vérifiée et la politique d'accès, jamais d'après un booléen ou un rôle déclaré par le navigateur.

## 3. Contrat visiteur — annuaire généraliste

### 3.1 Requête

Exemple conceptuel :

```json
{
  "query": "atelier martin"
}
```

Règles :
- `query` est obligatoire, chaîne nettoyée et normalisée ;
- longueur minimale proposée : 2 caractères ; longueur maximale : 120 ;
- recherche limitée à l'identification généraliste par nom ou terme ;
- aucun filtre APE/NAF, effectif, ancienneté, forme juridique, chiffre d'affaires, label, rayon, département ou région n'est accepté sur ce parcours ;
- aucun champ `organization_id`, `provider`, `source`, `connector`, `url` ou paramètre libre amont n'est accepté ;
- les paramètres inconnus ou avancés provoquent `INVALID_FILTERS`, ils ne sont pas ignorés silencieusement.

### 3.2 Réponse

Exemple conceptuel, champs optionnels omis lorsqu'ils ne sont pas disponibles :

```json
{
  "ok": true,
  "request_id": "opaque-request-id",
  "items": [
    {
      "id": "opaque-company-id",
      "siren": "123456789",
      "name": "Entreprise exemple",
      "activity_label": "Travaux d'installation électrique",
      "legal_status": "active",
      "address": {
        "postal_code": "72000",
        "city": "Le Mans",
        "department": "72"
      }
    }
  ],
  "page": {
    "number": 1,
    "size": 10,
    "returned": 1,
    "has_more": false,
    "total": null
  }
}
```

Le DTO public ne contient que les données générales nécessaires à l'identification et à la consultation d'une entreprise. Il ne contient pas de scoring, de qualification commerciale, de coordonnées privées, de signaux enrichis, de données CRM ni de liens documentaires amont.

### 3.3 Limites publiques initiales proposées

Ces valeurs sont des paramètres de politique à implémenter et à ajuster après observation ; elles ne décrivent pas des quotas déjà actifs :

- maximum 10 fiches par réponse ;
- une seule page publique (pas de pagination permettant l'extraction massive) ;
- pas de total global exact ni d'indication exploitable du volume complet ;
- limitation de fréquence par IP et, si disponible, par session anonyme signée ;
- valeur initiale proposée : 5 recherches par minute et 30 par heure par clé de limitation, avec réponses `429 RATE_LIMITED` et temporisation ;
- délais amont plafonnés, taille de requête bornée, protection contre les requêtes vides, jokers et énumérations systématiques ;
- cache public court possible, sans exposer les métadonnées de collecte ni les clés internes ;
- journalisation sécurité avec minimisation des données et durée de conservation définie avant mise en production.

La limitation IP ne doit pas être considérée comme une identité fiable : elle se combine à des protections anti-automatisation et à une surveillance des abus. Aucun endpoint public ne doit devenir un proxy générique.

## 4. Contrat membre — recherche avancée

### 4.1 Précondition d'autorisation

Chaque requête avancée doit :
1. valider le JWT avec Supabase Auth côté serveur et obtenir l'identité réelle ;
2. vérifier que l'utilisateur est confirmé conformément au parcours d'inscription ;
3. résoudre les memberships depuis la base côté serveur ;
4. trouver exactement une organisation de type `client` liée à cet utilisateur ;
5. vérifier que le rôle associé est `owner`, `admin` ou `member` ;
6. refuser les rôles `viewer`, les organisations `internal` et `partner`, l'absence d'organisation cliente et toute situation ambiguë.

Le navigateur ne peut pas imposer l'`organization_id` retenu. Le serveur le résout à partir de l'identité authentifiée. L'accès ne repose jamais sur la seule présence d'un JWT, sur un rôle fourni dans le corps HTTP ou sur l'affichage de contrôles avancés.

**Limite du schéma actuel :** `organization_members` ne possède pas de statut actif/suspendu ni de permission dédiée à la Prospection. La règle ci-dessus est donc une autorisation provisoire fondée sur les colonnes actuellement observées ; elle ne permet pas de prétendre gérer une suspension ou une granularité métier inexistante. Une évolution de schéma et de RLS nécessitera un arbitrage et une autorisation distincte.

### 4.2 Requête

Exemple conceptuel :

```json
{
  "query": "électricité",
  "filters": {
    "activity_codes": ["43.21A"],
    "departments": ["72"],
    "workforce_bands": ["1-5", "6-10", "11-15"],
    "creation_after": "2018-01-01",
    "legal_forms": [],
    "revenue_bands": [],
    "labels": []
  },
  "page": {
    "number": 1,
    "size": 10
  }
}
```

Critères métier prévus, sous réserve de disponibilité et de qualité des données : activité APE/NAF, département, région, rayon, effectif, ancienneté, forme juridique, chiffre d'affaires et labels. Les catégories et plages admises doivent être définies par listes blanches côté serveur. Les bornes numériques, formats, cardinalités de tableaux et dates doivent être validés.

- maximum 10 résultats par réponse dans les écrans de ciblage concernés ;
- pagination bornée côté serveur, sans permettre une extraction illimitée ;
- les filtres réellement appliqués sont retournés sous forme normalisée ;
- tout filtre non supporté ou non appliqué est signalé explicitement dans `quality.warnings` ;
- aucune absence de résultat ne doit masquer une panne, un résultat partiel ou un filtre ignoré ;
- les fonctions de sauvegarde, export, qualification et transmission CRM ne sont pas implicitement accordées par le droit de recherche : chacune garde son propre contrôle serveur.

### 4.3 Réponse membre

Le DTO membre peut contenir les champs normalisés nécessaires au ciblage B2B, selon les données effectivement disponibles et les finalités autorisées :

```json
{
  "ok": true,
  "request_id": "opaque-request-id",
  "items": [
    {
      "id": "opaque-company-id",
      "siren": "123456789",
      "siret": "12345678900016",
      "name": "Entreprise exemple",
      "trade_name": null,
      "activity_code": "43.21A",
      "activity_label": "Travaux d'installation électrique",
      "legal_status": "active",
      "legal_form": null,
      "creation_date": null,
      "workforce_band": "1-5",
      "address": {
        "postal_code": "72000",
        "city": "Le Mans",
        "department": "72"
      },
      "qualification": {
        "score": null,
        "label": "à examiner",
        "reasons": []
      },
      "last_verified_at": null
    }
  ],
  "page": {
    "number": 1,
    "size": 10,
    "returned": 1,
    "has_more": false,
    "total": null
  },
  "applied_filters": {
    "activity_codes": ["43.21A"],
    "departments": ["72"]
  },
  "quality": {
    "partial": false,
    "warnings": []
  }
}
```

Le score éventuel est un indice d'aide au tri, jamais une preuve de compétence, de capacité, de solvabilité ou d'éligibilité. Les champs indisponibles restent absents ou nuls selon le schéma convenu ; ils ne sont jamais inventés.

## 5. Contrat d'erreur commun

Exemple :

```json
{
  "ok": false,
  "request_id": "opaque-request-id",
  "error": {
    "code": "ACCESS_DENIED",
    "message": "Vous ne disposez pas des droits nécessaires pour cette recherche.",
    "retryable": false
  }
}
```

Codes stables :
- `INVALID_QUERY` : requête absente ou invalide ;
- `INVALID_FILTERS` : filtre ou paramètre non autorisé ;
- `AUTH_REQUIRED` : session absente, invalide ou expirée ;
- `ACCESS_DENIED` : organisation ou rôle non autorisé ;
- `RATE_LIMITED` : limite d'usage atteinte ;
- `SEARCH_TEMPORARILY_UNAVAILABLE` : recherche indisponible ;
- `PARTIAL_RESULTS` : résultats incomplets, accompagnés d'un indicateur de qualité ;
- `INTERNAL_ERROR` : erreur interne générique.

Aucune exception brute, URL amont, nom de fournisseur, statut détaillé de connecteur, corps d'erreur externe ou stack trace ne traverse la frontière HTTP. Les détails techniques sont corrélés au `request_id` dans les journaux serveur restreints.

## 6. Règles de non-divulgation et séparation des données

### Interdictions dans toute réponse navigateur

Aucun champ ou contenu ne doit révéler :
- nom, marque, logo, catégorie ou identifiant d'un fournisseur ;
- `source`, `source_name`, `provider`, `authority`, `connector`, `source_id` ;
- URL d'API, URL source, URL directe d'annonce ou URL technique ;
- `raw`, `payload`, `upstream`, réponse externe ou structure propre à une API ;
- liste de connecteurs, choix de fournisseur, clé, secret, en-tête ou jeton ;
- détails d'erreurs amont, pagination amont ou paramètres propres à un fournisseur.

Cette règle s'applique aux réponses de succès, aux erreurs, aux métadonnées, aux journaux accessibles depuis le navigateur, aux exports et aux composants d'interface. Les URL de consultation doivent être des routes MajestiOS contrôlées, si une telle consultation est nécessaire.

### Frontière technique

**Serveur :** authentification, autorisation, résolution organisationnelle, validation, orchestration invisible, quotas, normalisation, dédoublonnage, provenance restreinte, audit et DTO.

**Navigateur :** critères métier autorisés, DTO MajestiOS, état fonctionnel de recherche. Aucun appel direct à un fournisseur, aucun stockage de payload brut, aucune clé technique ni catalogue de sources.

La provenance technique et les payloads nécessaires à l'audit ne doivent pas être placés dans des tables ou politiques lisibles par les membres ordinaires. Leur stockage, accès et rétention sont à traiter dans un lot de sécurité dédié.

## 7. Tests d'acceptation obligatoires

### Visiteur
1. Une recherche simple valide retourne au plus 10 fiches publiques synthétiques.
2. Une requête vide, trop courte, trop longue ou malformée est rejetée.
3. Un filtre avancé ou paramètre fournisseur est rejeté, jamais ignoré.
4. Le visiteur ne peut obtenir ni résultats avancés, ni qualification, ni export, ni sauvegarde, ni transmission CRM.
5. La pagination publique ne permet pas l'extraction en masse.
6. Les quotas et protections anti-abus produisent une réponse stable et non bavarde.

### Membre et autorisation
7. Un membre client avec rôle `owner`, `admin` ou `member`, rattaché à une unique organisation cliente, peut accéder au contrat avancé.
8. Un rôle `viewer`, un compte interne/partenaire, un compte sans organisation cliente ou un rattachement ambigu est refusé.
9. Un JWT expiré, invalide ou appartenant à un utilisateur non confirmé est refusé.
10. Modifier `organization_id`, `role` ou un indicateur d'accès dans le navigateur ne change jamais l'autorisation serveur.
11. Une erreur ou une indisponibilité amont ne se transforme pas en liste vide présentée comme exhaustive.
12. Les fonctions d'export, de sauvegarde et de transmission CRM vérifient leurs droits indépendamment.

### Non-divulgation et non-régression
13. Aucun champ interdit n'existe dans les DTO, erreurs, exports ou réponses partielles.
14. Aucun script des pages Prospection ne contacte directement un domaine fournisseur.
15. Aucun écran ne présente de source, fournisseur, connecteur, logo ou catalogue.
16. Les filtres non appliqués sont signalés ; aucune qualification ne prétend prouver une capacité réelle.
17. Les données privées et enrichissements sont isolés par organisation.
18. Le moteur global de recherche de la page d'accueil reste strictement inchangé.

## 8. Plan de mise en œuvre contrôlé

1. Faire relire et valider les présents contrats et les valeurs initiales de quotas.
2. Concevoir les handlers serveur et leurs tests unitaires/intégration, sans encore modifier le schéma.
3. Implémenter le contrôle d'accès avancé à partir du modèle actuel, en documentant explicitement l'absence de statut et de permission dédiée.
4. Construire les deux DTO et le normaliseur commun ; ajouter une liste blanche de champs et un test récursif de non-divulgation.
5. Implémenter le parcours public borné et le parcours membre autorisé côté serveur.
6. Migrer les consommateurs réels de Prospection, notamment `company-targeting.js`, sans toucher au moteur global d'accueil.
7. Intégrer progressivement les signaux et ressources complémentaires au même orchestrateur, sans exposition de provenance.
8. Exécuter les tests d'accès, de quotas, de non-divulgation, de filtres appliqués et de non-régression.
9. Effectuer une revue séparée des RLS/grants et du stockage de provenance avant toute évolution de base.
10. Demander une autorisation distincte avant tout changement SQL, RLS, secret, Edge Function déployée ou déploiement Vercel/Supabase.

## 9. État et limites de ce lot

- Contrat documentaire proposé à partir des audits Git et Supabase du 8 novembre 2026.
- Les valeurs de quotas sont des recommandations initiales, pas des limites déjà actives.
- Les chemins HTTP sont logiques et ne correspondent pas à des routes déployées.
- Les champs réellement disponibles et leur base légale doivent être vérifiés avant implémentation.
- Aucun code applicatif, SQL, schéma, policy RLS, secret ou configuration n'a été modifié.
- Aucun test runtime, build ou déploiement n'a été exécuté dans ce lot.
