# Audit ciblé — invisibilité des sources et séparation des DTO — 8 novembre 2026

**Dépôt :** `Chexpeer/Majestios`  
**Branche examinée :** `feature/crm-atomic-integration`  
**Périmètre :** code applicatif versionné dans la branche, fonctions Edge, accès Supabase direct et contrats de réponse.  
**Nature :** audit statique en lecture seule. Aucune modification SQL, RLS, Auth, Edge Function, secret, donnée hébergée, déploiement ou merge.

## 1. Conclusion exécutive

La règle produit « les sources de prospection restent invisibles aux utilisateurs » est **partiellement respectée par le nouvel endpoint membre, mais contredite par plusieurs chemins historiques et par les accès directs au CRM**.

Le constat se divise en quatre niveaux :

1. **Nouvel endpoint membre : bonne base.** `prospection-search-member` appelle un noyau serveur qui normalise les réponses amont puis applique une projection positive `toMemberCompanyDTO`. Le DTO n'inclut pas les fournisseurs, URL, payload brut ni identifiants techniques. Une liste de clés interdites est définie.
2. **Ancien endpoint de recherche : fuite explicite.** `search-official-companies` renvoie le nom de la source, son URL et le payload amont complet dans la réponse HTTP.
3. **Registre technique : exposition par accès direct.** La migration `20261107065956_official_company_registry_and_sources.sql` accorde SELECT aux utilisateurs authentifiés sur `official_data_sources` et `company_source_observations`, avec des policies `USING (true)`. La table des exécutions `official_source_sync_runs` est au contraire explicitement fermée aux authentifiés dans la migration suivante.
4. **CRM : les champs de provenance sont livrés au navigateur.** `crm-client.js` utilise `select("*")` pour les entreprises, contacts, opportunités et activités, et permet en outre la modification de plusieurs champs `source_*`. L'accès est limité à l'organisation par la requête et doit aussi l'être par RLS, mais cela ne retire pas les colonnes sensibles du JSON remis au navigateur.

**Décision technique recommandée :** conserver la provenance complète dans une couche serveur interne, et ne remettre aux interfaces membre que des DTO métier construits par projection positive. Ne pas considérer le masquage visuel comme un contrôle de sécurité.

## 2. Constat détaillé par composant

### 2.1 `prospection-search-member` — modèle cible à préserver

Fichiers examinés :
- `supabase/functions/prospection-search-member/index.ts`
- `supabase/functions/_shared/prospection-search-core.mjs`
- `supabase/functions/_shared/prospection-contract.mjs`
- `supabase/functions/_shared/prospection-validation.mjs`

Le handler membre :
- authentifie le Bearer JWT par le contrôle d'accès partagé ;
- vérifie les droits de l'organisation avant la recherche ;
- renvoie `items`, la pagination et l'indicateur `partial`, sans ajouter de métadonnées de fournisseur ;
- ne transmet pas le payload amont dans la réponse.

Le noyau serveur transforme les enregistrements amont en structure normalisée, puis appelle `toMemberCompanyDTO`. Le contrat utilise une projection positive : seuls les champs explicitement autorisés sont émis. La liste `FORBIDDEN_DTO_KEYS` bloque notamment `source`, `provider`, `source_url`, `raw`, `payload`, `upstream`, `debug` et les métadonnées de collecte.

**Appréciation :** c'est le modèle de référence pour les nouveaux moteurs. Il reste à vérifier par tests d'intégration HTTP et inspection du rendu frontend que les champs interdits ne réapparaissent pas dans un adaptateur, un cache, un journal ou un composant d'affichage.

### 2.2 `search-official-companies` — réponse HTTP non conforme

Fichier examiné : `supabase/functions/search-official-companies/index.ts`.

La réponse de succès inclut :
- `source` : identité explicite du fournisseur ;
- `source_url` : URL du fournisseur ;
- `data` : objet de réponse amont complet.

La réponse d'erreur peut aussi inclure `upstream_status` et `detail`. Le contrôle JWT n'empêche pas cette exposition aux utilisateurs authentifiés.

**Risque : élevé au regard de la doctrine produit.** Tant que cet endpoint est déployé et accessible, il constitue un chemin distinct du nouveau DTO membre. Le fait qu'il soit ancien ou qu'un nouveau moteur existe dans Git ne neutralise pas sa réponse.

**À faire avant remplacement :** inventorier ses consommateurs et contrats frontend, établir si une page en production l'appelle encore, puis migrer ces consommateurs vers un endpoint métier compatible. Ne pas supprimer ni remplacer le endpoint sans cette vérification et sans recette.

### 2.3 `import-official-company` — provenance dans la réponse et service privilégié

Fichier examiné : `supabase/functions/import-official-company/index.ts`.

Le handler vérifie l'identité et appelle `can_import_official_company` avant d'utiliser un client `service_role` pour exécuter `import_official_company_record`. La réponse de succès contient encore le libellé `source` et les informations de résultat d'import.

La présence de `service_role` dans une fonction serveur n'est pas en soi une fuite navigateur ; le risque dépend de la réponse renvoyée et du contrôle de chaque paramètre. Le handler accepte `organization_id) fourni par le client, mais vérifie l'autorisation via la fonction SQL avant l'import.

**À faire :** conserver l'exécution privilégiée côté serveur, ne jamais déplacer la clé vers le client, réduire la réponse HTTP à un résultat métier minimal et vérifier que les erreurs ne renvoient ni payload amont ni détails internes. La provenance complète doit être enregistrée côté serveur et non affichée dans l'espace membre.

### 2.4 Tables de registre et politiques RLS

Fichiers examinés :
- `supabase/migrations/20261107065956_official_company_registry_and_sources.sql`
- `supabase/migrations/20261107070006_restrict_source_sync_run_visibility.sql`

La migration du registre :
- active RLS sur les cinq tables du registre ;
- révoque initialement les droits à `anon` et `authenticated` ;
- réaccorde ensuite SELECT à `authenticated` sur `official_data_sources`, `company_registry`, `company_registry_establishments` et `company_source_observations` ;
- crée des policies de lecture `USING (true)` sur ces quatre tables.

La migration suivante crée une policy `USING (false)` sur `official_source_sync_runs`.

Conséquences :
- `official_data_sources` expose le catalogue technique : clés, noms de fournisseurs, autorités, catégories, URL, documentation API, conditions d'accès, état du connecteur et notes ;
- `company_source_observations` expose les observations, dont `source_id`, `source_url`, identifiants externes, payload JSON brut et références aux synchronisations ;
- `company_registry` et `company_registry_establishments` sont des données normalisées d'identification d'entreprise. Leur accès peut rester envisageable selon la finalité et le cloisonnement retenus, mais il ne doit pas entraîner l'accès au registre de fournisseurs ou aux observations brutes.

La présence de RLS activé ne signifie donc pas que les tables sont confidentielles : une policy permissive `USING (true)` rend les lignes lisibles à tous les rôles ciblés par la policy, ici les utilisateurs authentifiés disposant du grant.

**Limite de preuve :** ce rapport confirme les droits décrits dans les migrations versionnées. Il ne remplace pas un nouveau relevé des grants et policies actuellement hébergés, qui n'a pas été exécuté dans ce lot.

### 2.5 CRM — provenance renvoyée au navigateur

Fichier examiné : `crm-client.js`.

Constats :
- `listBusinessesPage`, `listWorkspaceRecordsPage`, `listBusinessRelatedPage` et `list` effectuent des lectures `select("*")` ;
- les requêtes filtrent l'organisation dans le client, mais la garantie de cloisonnement doit rester dans les policies RLS ;
- `editableColumns` autorise notamment `businesses.source_label`, `businesses.source_url`, `contacts.source_label`, `opportunities.source_type`, `opportunities.source_external_id` et `opportunities.source_url`.

Le navigateur reçoit donc les champs de provenance présents sur les lignes CRM auxquelles il a accès, même si aucun composant ne les affiche. Une colonne non rendue dans l'interface reste accessible via l'API et les outils développeur.

**Distinction métier à préserver :**
- informations utiles à l'utilisateur : nom, identifiants entreprise, activité, localisation, statut, qualification et historique commercial autorisé ;
- métadonnées internes : fournisseur, URL de collecte, identifiant technique amont, payload, trace de synchronisation, détails de connecteur.

Il ne faut pas supprimer toute provenance du système : elle est nécessaire à la traçabilité, à la qualité et à l'audit. Il faut la sortir du DTO membre et la conserver dans une couche interne à privilèges contrôlés.

### 2.6 Moteur historique côté navigateur

Fichier examiné : `company-targeting.js`.

La fonction de recherche interroge directement l'API de l'annuaire depuis le code navigateur, puis enrichit les enregistrements avec des propriétés `source`, `source_url`, `collectedAt` et `query`. La normalisation conserve aussi `sourceUrl), `sourceId` et l'objet complet `raw`.

Cela ne prouve pas que ces propriétés sont toutes affichées dans l'interface, mais elles sont présentes dans les objets transmis aux consommateurs de la brique. Cette architecture contourne le principe d'une orchestration serveur totalement invisible et expose la provenance dans les outils développeur.

**À faire :** vérifier tous les appels à `MajestiosCompanyTargeting.searchCompanies` et les écrans qui consomment `candidates`. Migrer le chemin membre vers l'endpoint serveur unifié, puis retirer la collecte directe navigateur uniquement après preuve qu'aucun autre parcours ne dépend de son contrat.

## 3. Cartographie des risques

| Surface | Constat vérifié | Risque | Traitement recommandé |
|---|---|---|---|
| Nouveau endpoint membre | Projection DTO positive sans provenance | Faible à ce stade ; tests HTTP/frontend manquants | Préserver et renforcer par tests anti-fuite |
| Ancien endpoint de recherche | Source, URL et payload renvoyés | Élevé | Inventorier consommateurs puis migrer vers DTO métier |
| Registre `official_data_sources` | SELECT authenticated + policy vraie | Élevé | Retirer l'accès direct membre ; accès serveur/admin technique |
| Observations brutes | SELECT authenticated + policy vraie | Critique | Retirer l'accès direct membre ; accès serveur/admin technique |
| Exécutions de synchronisation | Policy authenticated fausse | Mesure déjà présente dans la migration | Recontrôler grants/policies hébergés |
| Référentiel normalisé | SELECT authenticated + policy vraie | À arbitrer | Décider d'une projection métier cloisonnée plutôt qu'un accès brut généralisé |
| Tables CRM | `select("*")` renvoie les colonnes de provenance | Élevé | DTO explicite par rôle et écran |
| Écriture CRM | Colonnes `source_*` modifiables côté navigateur | Élevé | Provenance gérée par serveur ; retirer des champs éditables membre |
| Moteur historique navigateur | URL, identifiant, payload brut conservés | Élevé | Basculer vers le moteur serveur unifié après inventaire des consommateurs |

## 4. Architecture cible recommandée

### Couche A — acquisition et provenance internes

Les connecteurs et moteurs serveur conservent, pour chaque observation, les informations nécessaires à l'audit :
- identifiant interne de source et version du connecteur ;
- identifiant externe du record ;
- URL de référence lorsque les conditions de réutilisation le permettent ;
- date de publication, date d'observation et date de collecte ;
- payload brut ou empreinte, selon nécessité et minimisation ;
- statut de collecte, erreurs techniques, quotas et historique de synchronisation.

Cette couche n'est pas directement accessible aux clients authentifiés. Les opérations de lecture passent par des fonctions serveur dédiées et contrôlées. Les accès techniques d'administration doivent être distincts des rôles CRM ordinaires, journalisés et limités au besoin.

### Couche B — référentiel métier normalisé

Le référentiel entreprise conserve les attributs nécessaires à l'identification et à la qualification : SIREN/SIRET, raison sociale, activité, statut, date de création, établissement, adresse et dates de vérification.

Il ne doit pas exposer automatiquement les tables de provenance. Les écrans métier reçoivent une projection adaptée à leur finalité et à leur rôle. La fraîcheur peut être communiquée par une date de vérification, sans divulguer le fournisseur ou l'URL technique.

### Couche C — DTO par destination et rôle

Créer des projections positives distinctes, versionnées et testées :
- DTO visiteur : champs strictement nécessaires à la recherche publique ;
- DTO membre : données de qualification autorisées, sans fournisseur, URL de source, payload ou détails techniques ;
- DTO CRM : données commerciales et historiques autorisées, sans provenance technique brute ;
- DTO Administration métier : informations de contrôle et qualité nécessaires à la décision, sans privilège technique implicite ;
- DTO administration technique : provenance et synchronisation, réservé à une habilitation technique dédiée, avec audit d'accès.

Éviter `select("*")`, les objets amont propagés et les suppressions de champs uniquement dans le rendu. Utiliser des listes explicites de colonnes côté requête et une projection positive côté serveur.

### Couche D — accès et autorisation

- Les utilisateurs membres ne lisent pas directement les tables de catalogue de sources, d'observations brutes ou de synchronisation.
- Les moteurs appellent une couche serveur qui orchestre les fournisseurs invisiblement.
- Le client n'envoie jamais un rôle, un identifiant d'organisation ou une permission comme preuve d'autorisation.
- Le serveur dérive l'identité du JWT et contrôle le tenant et la capacité métier pour chaque action.
- Les fonctions privilégiées valident les entrées, minimisent les réponses, ne divulguent jamais les secrets et journalisent les accès sensibles.
- RLS demeure une défense en profondeur, mais ne remplace pas la projection DTO.

### Point à arbitrer

La doctrine actuelle rend les sources invisibles aux membres dans tous les écrans. Elle n'interdit pas nécessairement leur visibilité à un administrateur technique habilité dans un écran interne d'audit. Il faut donc définir explicitement la capacité « consulter la provenance technique », distincte des rôles génériques `owner`, `admin`, `member` et `viewer`. Aucun rôle générique ne doit recevoir ce droit par défaut.

## 5. Plan de correction ordonné

### Lot 1 — cartographie des consommateurs (sans changement fonctionnel)

1. Rechercher tous les appels à `search-official-companies`, `import-official-company` et `MajestiosCompanyTargeting`.
2. Identifier les pages, composants, scripts et environnements encore actifs.
3. Tracer les champs `source_*` du CRM jusqu'aux écrans, exports, journaux et formulaires.
4. Déterminer les dépendances contractuelles et préparer la migration sans rupture.
5. Confirmer la liste des routes qui utilisent déjà `prospection-search-member`.

### Lot 2 — DTO et contrat de réponse

1. Remplacer les `select("*")` du CRM par des listes explicites de colonnes non techniques, après cartographie des besoins des écrans.
2. Retirer les champs `source_*` des DTO membre et des listes de champs modifiables par les utilisateurs ordinaires.
3. Normaliser les réponses de recherche et d'import sur des DTO métier à projection positive.
4. Conserver la provenance dans les tables internes et dans les réponses d'administration technique uniquement.
5. Définir les contrats de chaque écran et leur version pour éviter les régressions.

### Lot 3 — droits d'accès Supabase

1. Préparer une migration qui retire SELECT à `authenticated` sur `official_data_sources` et `company_source_observations`, puis ferme les policies permissives.
2. Vérifier si `company_registry` et `company_registry_establishments` doivent rester lisibles aux membres ; préférer une vue ou une fonction de projection métier si cet accès est nécessaire.
3. Vérifier grants, policies, vues, fonctions SECURITY DEFINER/INVOKER et exposition Data API.
4. Prévoir les lectures privilégiées via serveur/service role ou schéma non exposé, sans exposer la clé au navigateur.
5. Exécuter les tests de régression en base locale avant toute demande de changement distant.

**Aucune migration ne doit être appliquée au projet hébergé dans le cadre de ce rapport.** Le rapprochement des 21 migrations et de leur contenu doit rester un prérequis aux changements de schéma.

## 6. Tests anti-fuite obligatoires

### Tests unitaires DTO

- Injecter dans les réponses simulées des propriétés `source`, `provider`, `source_url`, `source_id`, `payload`, `raw`, `requests`, `debug`, `upstream` et des propriétés imbriquées.
- Vérifier que les DTO membre, visiteur et CRM ne contiennent aucune de ces clés, y compris dans les tableaux et objets imbriqués.
- Vérifier que les champs métier autorisés sont conservés et validés.
- Tester les noms de clés avec casse, tirets, espaces et variantes usuelles.

### Tests HTTP Edge

- Appeler chaque endpoint avec utilisateur anonyme, viewer, membre autorisé, admin, tenant différent et JWT invalide/expiré.
- Inspecter la réponse JSON complète, les en-têtes, les erreurs et les réponses partielles.
- Vérifier qu'aucune réponse ne contient fournisseur, URL source, identifiant de connecteur, payload amont, détail d'exception ou statut technique interne.
- Vérifier les limites de taille, CORS, pagination, quotas et comportement upstream 429/5xx.
- Vérifier que le endpoint d'import renvoie un résultat métier minimal et ne renvoie jamais de payload source.

### Tests d'accès Supabase

- Depuis un JWT membre, tenter SELECT direct sur les cinq tables de registre et vérifier les refus attendus.
- Vérifier que les lectures métier nécessaires restent disponibles par la projection prévue.
- Vérifier les rôles internes et l'administration technique séparément, sans élargissement implicite.
- Tester l'isolation inter-organisation et les accès sans appartenance.
- Inspecter les grants et policies effectifs, pas uniquement les fichiers SQL.

### Tests frontend et non-régression

- Inspecter les réponses réseau et l'état applicatif, pas seulement les éléments visibles.
- Vérifier que le DOM, les attributs, les états React/JS, les caches locaux, exports, logs et erreurs ne contiennent pas de provenance interdite.
- Vérifier qu'aucun écran membre ne permet de reconstruire le catalogue des fournisseurs.
- Vérifier que les parcours de recherche, qualification, sélection et préparation CRM fonctionnent sans métadonnées techniques.
- Ajouter une assertion automatisée sur les DTO à chaque route de recherche et de CRM.

## 7. Limites de cet audit

- Analyse statique de fichiers versionnés dans la branche indiquée ; aucune exécution des pages ni inspection réseau navigateur.
- Aucun nouvel appel de lecture aux catalogues PostgreSQL hébergés dans ce lot ; les constats de policies hébergées sont corroborés par les migrations présentes et l'audit distant antérieur.
- Le déploiement actuel des fonctions Edge et les versions de bundles n'ont pas été recontrôlés pendant ce lot.
- Les consommateurs frontend des fonctions historiques restent à cartographier avant toute migration.
- Aucun test HTTP, test navigateur, test RLS distant ou test d'intégration n'a été exécuté ici.
- Aucune correction de code, migration, modification de données, de secret, de permission ou de déploiement n'a été effectuée.

## 8. Décision de sécurité

**Ne pas exposer les sources, fournisseurs, connecteurs, URL ou payloads amont aux membres, même si les informations sont masquées visuellement.** La couche membre reçoit exclusivement un résultat métier normalisé et projeté. La provenance reste conservée côté serveur, avec un accès technique séparé et audité.

La prochaine intervention doit commencer par la cartographie exhaustive des consommateurs des anciens endpoints et du moteur navigateur. Elle pourra ensuite préparer les DTO et les tests anti-fuite en local. Les corrections de grants/RLS ne seront proposées qu'après vérification des consommateurs et réconciliation de l'historique des migrations, et ne seront appliquées en production qu'avec une autorisation explicite.
