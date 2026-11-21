# Audit de parité Git / Supabase et revue de sécurité — 8 novembre 2026

## Périmètre et méthode

Contrôle en lecture seule du projet Supabase `qxaghcifdhugfskuscoc` et de la branche `feature/crm-atomic-integration`, après restauration des neuf migrations et des trois sources Edge Functions.

Contrôles effectués :
- liste des migrations appliquées dans Supabase et inventaire des fichiers SQL dans Git ;
- état, version, exigence JWT et empreinte de bundle des Edge Functions ;
- lecture des sources Edge Functions restaurées ;
- inspection des politiques RLS des tables de registre officiel, d'observations, des entreprises CRM et des demandes ;
- vérification de l'existence et des attributs de sécurité des RPC utilisées par les fonctions.

Aucune requête d'écriture, migration, modification de permission, changement de secret ou déploiement n'a été effectué. Aucun test fonctionnel ou d'intégration n'a été exécuté dans le cadre de cet audit.

## 1. Parité des migrations

- Supabase déclare **21 migrations appliquées**.
- Le dépôt contient **21 fichiers SQL**.
- Les **9 migrations restaurées** le 8 novembre portent les mêmes versions et noms que les neuf entrées correspondantes de Supabase.
- Les **12 migrations historiques** ont les mêmes noms fonctionnels dans les deux inventaires, mais leurs préfixes de version diffèrent : les fichiers Git commencent par `20261105...` / `20261106...`, tandis que le registre Supabase les identifie par des versions `202611070658...` à `20261107065914`.

**Conclusion :** parité de comptage et correspondance des noms, mais pas de parité stricte des identifiants de migration pour les douze premières migrations. Ce décalage doit être réconcilié avant toute nouvelle commande de migration. Ne pas renommer les fichiers ni modifier le registre Supabase à l'aveugle : comparer les corps SQL historiques, établir une table de correspondance et vérifier l'état du CLI/migration ledger avant de choisir une stratégie.

## 2. Parité des Edge Functions

Les trois fonctions sont actives dans Supabase, avec JWT obligatoire (`verify_jwt=true`) et sans import map. Les versions et empreintes de bundle observées correspondent au README restauré :

| Fonction | Version active | Bundle SHA-256 | JWT |
|---|---:|---|---|
| `search-official-companies` | 4 | `e91851a82639e45fcc9eb45e441905874650ca84ad82f92de233542f709dc5ad` | requis |
| `import-official-company` | 2 | `7cb5c723140719ea10f4db67708793b1ae3afb49bfa413003052bc37b3b90a5c` | requis |
| `bootstrap-internal-admin` | 3 | `331827cfdf8999eb4d2d861e7c7644fe99354c4fb0dd580cdb19ddbc4af606d4` | requis |

Les SHA Git des fichiers sources sont distincts des empreintes de bundle Supabase ; il ne faut pas les comparer comme s'il s'agissait du même artefact. Les fichiers restaurés dans Git sont ceux récupérés depuis les fonctions déployées lors de la restauration précédente.

## 3. Dépendances SQL des fonctions

Les RPC appelées par les Edge Functions existent dans la base :
- `public.can_import_official_company(uuid)` : fonction invoker, `search_path` vide ; elle délègue le contrôle au prédicat d'éditeur de l'organisation.
- `public.import_official_company_record(uuid,jsonb,jsonb,text)` : fonction `SECURITY DEFINER`, `search_path` vide ; exécution accordée au rôle `service_role`, avec contrôle interne de `auth.role()`.
- `public.bootstrap_first_internal_admin(uuid)` : wrapper public `SECURITY DEFINER`, `search_path` vide ; exécution accordée à `service_role`. L'implémentation privée est également `SECURITY DEFINER`, avec `search_path` vide et verrou consultatif pour sérialiser le bootstrap.

Le bootstrap est une initialisation du premier propriétaire interne, conditionnée à un compte Auth confirmé et à l'absence de propriétaire/administrateur interne existant. Ce n'est pas un système de délégation, transfert, révocation ou gestion continue des habilitations.

## 4. Écarts majeurs avec la doctrine MajestiOS

### P1 — Identité des sources exposée par la recherche

`search-official-companies` renvoie au navigateur les champs `source`, `source_url`, `searched_at` ainsi que le payload amont complet sous `data`. Le payload peut contenir des champs et métadonnées du fournisseur qui ne sont pas nécessaires à l'expérience unifiée.

C'est un écart direct avec la règle produit : les sources et fournisseurs restent invisibles dans l'interface. Il faut définir un contrat de réponse normalisé et minimal, stable pour le frontend, en conservant la provenance technique exclusivement côté serveur/administration autorisée. Les erreurs ne devraient pas non plus renvoyer de détails techniques internes non nécessaires.

### P1 — Lecture authentifiée globale du catalogue et des observations techniques

Les politiques RLS actuellement actives autorisent tout utilisateur authentifié à lire sans restriction (`USING (true)`) :
- `official_data_sources` ;
- `company_source_observations` ;
- `company_registry` ;
- `company_registry_establishments`.

Les deux premières tables contiennent explicitement le catalogue de fournisseurs et les observations techniques (URL source, identifiant externe, payload brut, horodatage). RLS activée ne signifie donc pas que ces données sont isolées ou invisibles : les politiques autorisent une lecture globale aux rôles authentifiés.

Le registre normalisé des entreprises peut être un référentiel partagé voulu ; il doit être distingué des métadonnées techniques. Il faut séparer clairement données métier consultables et provenance/payload technique, puis définir les accès internes nécessaires sans exposer les fournisseurs à l'interface utilisateur.

### P1 — Provenance copiée dans les fiches CRM

La fonction d'import écrit une étiquette de fournisseur dans `businesses.source_label` et une URL dans `businesses.source_url`. La migration de rôles autorise les utilisateurs authentifiés éditeurs à mettre à jour ces champs. Les membres de l'organisation disposent d'une politique de lecture sur les entreprises.

Il existe donc un chemin de persistance et de lecture de la provenance dans les données CRM. La correction doit porter sur le contrat d'affichage et la séparation des métadonnées techniques ; ne pas supprimer la traçabilité interne nécessaire à l'audit.

### P2 — Portée des demandes internes trop générique pour le futur modèle Administration

La politique de lecture de `client_requests` autorise les membres de l'organisation demandeuse et les utilisateurs reconnus par `private.is_internal_staff()`. La fonction `is_internal_staff` inclut les rôles internes `owner`, `admin` et `member`. La politique de mise à jour limite les colonnes modifiables à `status`, mais la capacité de lecture interne n'est pas une matrice d'habilitations Administration différenciées.

Cela ne prouve pas qu'un membre interne peut approuver, attribuer ou administrer les autres fonctions. En revanche, cela confirme que le modèle actuel ne sépare pas encore explicitement demandeur, bénéficiaire, préparateur, collaborateur affecté, validateur et administrateur selon le contrat transversal défini dans la documentation.

### P2 — Bootstrap administratif à usage unique

La fonction de bootstrap applique une adresse autorisée codée en dur, exige une adresse confirmée et utilise la clé service-role côté serveur. La procédure SQL vérifie l'absence de propriétaire/administrateur interne et sérialise les tentatives concurrentes. Le périmètre observé est celui d'une initialisation unique, pas d'une administration déléguée.

Le code source restauré doit rester protégé et les mécanismes de gestion ultérieure des administrateurs devront être conçus séparément. Ne pas transformer le bootstrap en endpoint général de gestion des rôles.

## 5. Points positifs constatés

- Les trois Edge Functions exigent un JWT et revérifient l'utilisateur avec `auth.getUser(token)`.
- La recherche limite la longueur du terme, la pagination et le nombre de résultats, et applique un timeout réseau.
- L'import valide le format du SIREN, exige une correspondance exacte, vérifie le droit d'import au niveau de l'organisation, puis appelle la RPC serveur.
- La RPC d'import est réservée à `service_role` et vérifie le rôle d'exécution.
- Les fonctions sensibles SQL inspectées utilisent un `search_path` vide.
- Les activités CRM restent un journal append-only dans le modèle observé ; elles ne remplacent pas le futur journal universel des transmissions.

Ces constats ne constituent pas une certification complète de sécurité ni une preuve de tests réussis.

## 6. Ordre de correction recommandé

1. **Réconcilier les 12 identifiants historiques de migration** sans toucher au registre de production avant comparaison des corps SQL et validation de la stratégie.
2. **Définir le DTO de recherche unifiée** : champs métier normalisés uniquement, aucun nom de fournisseur, URL source ou payload amont dans la réponse destinée au navigateur.
3. **Revoir les accès RLS/grants** du catalogue et des observations techniques ; conserver une traçabilité serveur interne et préserver l'accès métier au registre normalisé.
4. **Auditer les composants frontend** qui consomment les réponses de recherche/import et les colonnes CRM de provenance, pour éviter les régressions de contrat.
5. **Concevoir les habilitations Administration** autour des rôles et responsabilités distincts, sans confondre validation métier, accès technique et RLS.
6. Ajouter des tests de contrat, de non-divulgation des sources, de séparation inter-organisations et de permissions avant toute correction ou tout redéploiement.

## 7. État des opérations

- Audit réalisé en lecture seule.
- Aucun changement Supabase.
- Aucun déploiement Edge Function.
- Aucune migration appliquée.
- Aucun secret lu ou écrit.
- Aucun test automatisé déclaré comme exécuté.
- Ce document est une trace d'audit et une feuille de route, pas une autorisation de modifier la production.
