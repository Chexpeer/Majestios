# Contrat DTO de recherche unifiée et audit des consommateurs — 8 novembre 2026

## Décision d'architecture

Le contrat de sortie destiné au navigateur ne doit jamais exposer l'identité d'un fournisseur, son URL, son identifiant technique, son catalogue, le payload brut ou la structure propre à son API.

Les fournisseurs sont orchestrés exclusivement côté serveur. Le navigateur ne connaît qu'un moteur MajestiOS et un modèle métier commun. La provenance détaillée est conservée côté serveur dans une piste d'audit à accès restreint.

**Constat décisif :** modifier uniquement `search-official-companies` ne corrigerait pas le parcours principal actuellement utilisé par la page Prospection. Les scripts frontend interrogent directement des API publiques et ne consomment pas cette Edge Function. Il faut donc traiter le chemin réellement exécuté, pas seulement son endpoint restauré.

## 1. Cartographie des consommateurs inspectés

### Parcours principal Prospection

Fichiers :
- `prospection-active.html` charge `company-targeting.js` puis `company-targeting-page.js`.
- `qualification-entreprises.html` charge les mêmes composants.
- `company-targeting-page.js` appelle `MajestiosCompanyTargeting.searchCompanies()` ou `searchCompaniesNearPoint()`.

Constats dans `company-targeting.js` :
- appel navigateur direct à `https://recherche-entreprises.api.gouv.fr/search` ;
- appel navigateur direct à `https://geo.api.gouv.fr/communes` pour géocoder le rayon ;
- ajout des propriétés `source`, `source_url`, `collectedAt` et `query` aux enregistrements ;
- retour de `source`, `sourceUrl`, `requests` et `fetchedAt` au composant appelant ;
- conservation du record brut dans `normalizeCompany().raw` ;
- conservation d'un identifiant technique de source dans `sourceId`.

Dans `company-targeting-page.js`, le résumé d'écran affiche le nombre de fiches reçues, le nombre de fiches dédoublonnées et l'heure de recherche. Les cartes visibles ne montrent pas actuellement le nom de fournisseur, mais le contrat interne du navigateur transporte les métadonnées et les enregistrements bruts.

Dans `qualification-entreprises.html`, le texte introductif nomme explicitement l'API publique interrogée. Cette mention doit disparaître de l'interface au profit d'une description fonctionnelle neutre.

### Ressources complémentaires

`prospecting-resources.js` expose un tableau `SOURCES` contenant noms, URLs, états de connexion, couverture et clés de configuration. Il contient également `renderCatalog()`, qui affiche ces informations dans un catalogue lorsqu'un conteneur correspondant est présent. Les fonctions de recherche RGE et de qualification renvoient également des champs `source`, `sourceUrl`, `fields` et `fetchedAt`.

L'audit des pages ciblées n'a pas établi que ce catalogue était actuellement monté sur les deux pages Prospection inspectées. Le module constitue néanmoins un chemin d'exposition prêt à être rendu et ne doit pas être utilisé dans l'interface métier selon la doctrine retenue.

### Signaux d'entreprise

`prospecting-signals.js` interroge directement l'API de données BODACC depuis le navigateur. Son modèle de signal transporte `source`, `sourceUrl` et `officialUrl`, et son résultat global renvoie aussi `fetchedAt` et `returnedCount`.

Il faudra intégrer ce parcours au même contrat unifié. Une URL de document officiel ne doit pas être rendue directement si elle révèle le fournisseur ; les détails d'une annonce doivent être consultables à travers une route MajestiOS contrôlée, qui conserve la provenance côté serveur.

### Edge Functions existantes

`search-official-companies` renvoie actuellement `source`, `source_url`, `searched_at`, `page`, `per_page` et le payload amont complet `data`. Elle ne constitue pas, à ce jour, le chemin utilisé par les composants Prospection identifiés ci-dessus.

`import-official-company` renvoie aussi une propriété `source`, un horodatage d'import et un résultat technique. Son appelant frontend doit être recherché et aligné avant modification de ce contrat.

## 2. DTO cible — réponse métier

Contrat conceptuel recommandé pour toutes les recherches d'entreprises, signaux et ressources orchestrées :

```json
{
  "ok": true,
  "request_id": "opaque-request-id",
  "items": [
    {
      "id": "opaque-business-id",
      "siren": "123456789",
      "siret": "12345678900016",
      "name": "Entreprise exemple",
      "trade_name": null,
      "activity_code": "43.21A",
      "activity_label": "Travaux d'installation électrique",
      "legal_status": "active",
      "legal_form": null,
      "creation_date": null,
      "workforce_band": null,
      "workforce": null,
      "address": {
        "postal_code": "72000",
        "city": "Le Mans",
        "department": "72"
      },
      "qualification": {
        "score": 85,
        "label": "à examiner",
        "reasons": []
      },
      "last_verified_at": null
    }
  ],
  "page": {
    "number": 1,
    "size": 10,
    "has_more": false,
    "returned": 1,
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

Ce schéma est illustratif : les champs optionnels ne sont renvoyés que s'ils sont effectivement disponibles et normalisés. Le score est un indice de rapprochement, jamais une preuve de compétence, de capacité, de solvabilité ou d'éligibilité.

### Champs explicitement interdits dans le DTO navigateur

- `source`, `source_name`, `provider`, `authority`, `connector`, `source_id` ;
- `source_url`, URL d'API, URL directe du fournisseur ou URL de l'annonce révélant le fournisseur ;
- `raw`, `payload`, `upstream`, `response`, `debug`, `detail` technique ;
- structure de pagination ou filtres spécifiques à un fournisseur ;
- noms de champs, schémas ou documentation des API amont ;
- clés, jetons, en-têtes, identifiants de connecteur ou secrets ;
- liste des fournisseurs interrogés, y compris dans les erreurs ou les métadonnées.

Les champs `request_id` et `last_verified_at` sont des métadonnées MajestiOS. Ils ne doivent pas permettre de reconstruire la liste des fournisseurs.

## 3. Contrat d'erreur

Réponse métier stable, sans message brut du fournisseur :

```json
{
  "ok": false,
  "request_id": "opaque-request-id",
  "error": {
    "code": "SEARCH_TEMPORARILY_UNAVAILABLE",
    "message": "La recherche est momentanément indisponible. Réessayez dans quelques instants.",
    "retryable": true
  }
}
```

Codes applicatifs possibles : `INVALID_FILTERS`, `AUTH_REQUIRED`, `ACCESS_DENIED`, `RATE_LIMITED`, `SEARCH_TEMPORARILY_UNAVAILABLE`, `PARTIAL_RESULTS`, `INTERNAL_ERROR`.

Ne jamais renvoyer au navigateur un message d'exception, une URL amont, un statut détaillé de fournisseur, un corps d'erreur brut ou une stack trace. Les détails sont consignés côté serveur avec le `request_id`.

## 4. Frontière serveur / navigateur

### Serveur

- reçoit et valide les critères métier ;
- authentifie l'utilisateur et contrôle l'organisation et les habilitations ;
- choisit et orchestre les connecteurs sans révéler leur identité ;
- applique les limites, délais, quotas, dédoublonnages et normalisations ;
- conserve les données de provenance, réponses brutes, empreintes, horodatages et erreurs dans une zone technique non exposée ;
- renvoie uniquement le DTO métier ;
- fournit les détails documentaires via une route MajestiOS contrôlée, si nécessaire.

### Navigateur

- envoie des critères métier, jamais un nom de fournisseur ou un choix de connecteur ;
- consomme uniquement le DTO ;
- affiche les résultats, critères appliqués et avertissements fonctionnels ;
- ne construit aucune URL de fournisseur ;
- ne conserve aucun payload brut ;
- n'interroge directement aucun domaine fournisseur ;
- ne transforme pas une erreur technique en « zéro résultat ».

L'Edge Function de recherche existante peut servir de point de départ, mais elle devra être étendue pour couvrir les critères déjà utilisés par le ciblage : activité APE/NAF, départements, région, rayon, effectifs, ancienneté, forme juridique, chiffre d'affaires et labels lorsque les données le permettent. Les critères non supportés doivent être explicitement signalés comme non appliqués, jamais silencieusement ignorés.

## 5. Conservation de la traçabilité

La règle de confidentialité produit ne signifie pas supprimer la provenance.

Conserver dans le périmètre technique restreint :
- fournisseur/connecteur réellement interrogé ;
- identifiant de source et version du connecteur ;
- horodatage de collecte ;
- URL amont et identifiant externe ;
- empreinte du payload et, si nécessaire, payload brut soumis à une politique de rétention ;
- résultat, erreurs et motif de sélection du connecteur ;
- utilisateur, organisation et `request_id` ayant déclenché l'opération.

Cette traçabilité doit être inaccessible aux membres ordinaires via les tables publiques et les réponses de recherche. Les besoins d'audit interne seront servis par une interface Administration à habilitations explicites, pas par le moteur métier.

## 6. Tests de contrat obligatoires

1. Aucun champ interdit n'existe à la racine, dans `items`, dans `page`, dans `quality` ou dans les erreurs.
2. Aucun payload brut ni propriété inconnue du fournisseur ne traverse la frontière HTTP.
3. Aucun script frontend ne contacte directement un domaine fournisseur.
4. Aucun texte, lien, logo, catalogue, nom ou sélecteur de source n'apparaît dans les pages Prospection.
5. Les critères non appliqués sont listés dans `quality.warnings` et ne sont jamais présentés comme satisfaits.
6. Une indisponibilité ou un résultat partiel ne peut pas être affiché comme une absence de prospects.
7. Les résultats restent plafonnés à dix pour les écrans de ciblage concernés, sauf décision métier explicite.
8. Les résultats sont isolés par organisation lorsque des données CRM ou des enrichissements privés sont impliqués.
9. Le droit d'import est contrôlé côté serveur ; l'identifiant d'organisation fourni par le navigateur ne suffit jamais à autoriser l'import.
10. Les erreurs techniques détaillées sont consultables uniquement par les fonctions d'exploitation autorisées.

## 7. Ordre de réalisation proposé

1. Construire et tester un normaliseur/DTO serveur commun sans modifier le frontend.
2. Étendre le point d'entrée serveur pour couvrir les critères du moteur Prospection, y compris le géocodage et les recherches géographiques.
3. Basculer `company-targeting.js` sur l'Edge Function et retirer ses appels directs aux API d'entreprises et de géolocalisation.
4. Aligner `import-official-company` sur une réponse d'import métier sans provenance.
5. Basculer progressivement les modules de signaux et ressources complémentaires vers le même orchestrateur serveur ; supprimer le catalogue et les noms de fournisseurs de l'interface.
6. Ajouter les tests de non-divulgation, de permissions, de filtres réellement appliqués et de non-régression.
7. Seulement après validation, planifier les changements RLS/grants et le déploiement contrôlé. Aucun déploiement automatique.

## 8. Limites de cet audit

- Inspection statique des fichiers Git, pas un test dans un navigateur réel.
- Aucun test automatisé exécuté dans cette étape.
- Les appels frontend à l'API d'entreprises et au géocodeur sont confirmés par le code ; l'usage effectif de tous les modules complémentaires dans une page publiée n'est pas établi.
- Aucun changement applicatif, Edge Function, SQL, RLS ou déploiement n'a été effectué.
