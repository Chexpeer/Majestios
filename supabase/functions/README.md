# Supabase Edge Functions — sources restaurées

Sources récupérées depuis le projet Supabase `qxaghcifdhugfskuscoc` le 8 novembre 2026. Les empreintes ci-dessous sont les identifiants de bundle communiqués par Supabase ; elles ne sont pas les SHA Git des fichiers.

| Fonction | Version déployée | Bundle SHA-256 | JWT |
|---|---:|---|---|
| `search-official-companies` | 4 | `e91851a82639e45fcc9eb45e441905874650ca84ad82f92de233542f709dc5ad` | requis |
| `import-official-company` | 2 | `7cb5c723140719ea10f4db67708793b1ae3afb49bfa413003052bc37b3b90a5c` | requis |
| `bootstrap-internal-admin` | 3 | `331827cfdf8999eb4d2d861e7c7644fe99354c4fb0dd580cdb19ddbc4af606d4` | requis |

Chaque répertoire contient le `index.ts` récupéré. Aucun déploiement n'a été effectué par cette restauration Git.

## Variables d'environnement référencées
- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEYS`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Seuls les noms sont documentés ; aucune valeur secrète n'est enregistrée dans Git.

## Points de contrôle avant évolution
- Comparer les sources récupérées avec les bundles déployés avant toute modification/redéploiement.
- La recherche expose actuellement l'identité du fournisseur, son URL, l'horodatage et le payload amont. Cela contrevient à la règle MajestiOS : les sources restent invisibles dans l'interface. Le code est restauré à l'identique ; aucune correction fonctionnelle n'est incluse.
- Le bootstrap est une initialisation initiale, pas un mécanisme de délégation, transfert ou révocation des droits d'administration.
- La restauration Git ne signifie pas que les tests d'intégration ont été exécutés ni que les droits/RLS sont conformes.

## Nouvelle fonction en préparation — 8 novembre 2026

| Fonction | Statut Git | Statut Supabase |
|---|---|---|
| prospection-search-member | Source créée dans prospection-search-member/index.ts | **Non déployée** |

Cette fonction est un endpoint authentifié de recherche avancée. Elle réutilise les modules partagés _shared/prospection-*.mjs, vérifie l'appartenance cliente par RLS et normalise les résultats avant retour. Elle n'utilise pas service_role. Les critères de chiffre d'affaires sont explicitement refusés à ce stade. Ne pas confondre la présence de la source dans Git avec un déploiement ou une activation dans Supabase.


## Nouvelle fonction en préparation — Réputation virtuelle — 9 novembre 2026

| Fonction | Statut Git | Statut Supabase |
|---|---|---|
| `reputation-audit-context` | Handler authentifié et tests ajoutés dans `reputation-audit-context/index.ts` | **Non déployée** |

L'endpoint vérifie la session de l'utilisateur, valide le nom et le SIREN, puis retourne un contexte d'identité administrative et des annonces commerciales BODACC normalisés. Il n'effectue pas d'audit de réputation en ligne, ne stocke rien en base et n'utilise pas `service_role`. Les sources partagées sont placées sous `_shared/`. La recherche BODACC filtrée dispose d'un smoke test dédié dans la CI. Ne pas présenter la fonction comme active avant déploiement et test authentifié en environnement non-production.


## Worker Cheexpeer — 9 novembre 2026

| Fonction | Statut Git | Statut Supabase |
|---|---|---|
| `cheexpeer-worker-bridge` | Handler ajouté dans `cheexpeer-worker-bridge/index.ts` | **Non déployée** |

Cette fonction est un pont serveur-à-serveur très limité. Elle vérifie un secret indépendant `CHEXPEER_WORKER_SECRET`, puis appelle uniquement les RPC de la file et du cycle de vie Cheexpeer. La vérification JWT de la passerelle Edge doit rester activée ; le worker présente une clé serveur dans l'en-tête Authorization. Le secret partagé supplémentaire est obligatoire. Son nom canonique est `CHEXPEER_WORKER_SECRET`, identique côté worker et côté Edge.

Actions autorisées : dispatch des missions dues, lecture des réveils PGMQ, claim, archivage d'un réveil, renouvellement du bail, clôture ou échec d'une mission. Aucun endpoint générique SQL, aucune lecture de table libre et aucun accès navigateur ne sont fournis.

Le paquet conteneurisé `services/cheexpeer-worker` n'est pas encore déployé. Il ne sait exécuter que `readiness_probe` au niveau d'autonomie 0 ; les autres types sont refusés. Aucun outil métier n'est activé dans le registre.

Avant tout déploiement :
- définir `CHEXPEER_WORKER_SECRET` dans les secrets Edge Supabase ;
- définir `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` et le même secret dans le gestionnaire de secrets du worker ;
- déployer la fonction Edge en environnement de test, puis vérifier les refus sans secret et avec un mauvais secret ;
- démarrer un seul worker de recette et exécuter une mission readiness_probe ;
- ne jamais utiliser la clé service_role côté navigateur.


### Contrôles d'entrée ajoutés au pont Cheexpeer — 9 novembre 2026

La source Git actuelle du pont ajoute des validations avant tout appel RPC : UUID de mission, identifiant worker non vide et borné, identifiant de message PGMQ entier positif sûr, corps de requête plafonné à 64 Ko et résultat JSON objet plafonné à 32 Ko. Ces contrôles sont couverts par les tests contractuels du worker.

**Ces protections sont présentes dans Git mais pas encore déployées sur Supabase.** La fonction Edge reste absente de l'environnement distant et aucun secret n'est configuré.


La limite du corps est appliquée en lecture progressive du flux Request : la lecture est annulée dès que le seuil de 64 Ko est dépassé, y compris si le client ne fournit pas un en-tête `Content-Length` fiable. Cette protection reste dans la source Git, non déployée.


## API utilisateur Cheexpeer — préparation Git Evolution-9

| Fonction | Responsabilité | Statut |
|---|---|---|
| `cheexpeer-mission-submit` | Soumettre une mission pour l'organisation validée | Source Git uniquement — non déployée |
| `cheexpeer-approval-decision` | Approuver/refuser une demande, acteur dérivé du JWT | Source Git uniquement — non déployée |
| `cheexpeer-mission-read` | Lire mission, approbations et événements dans le tenant autorisé | Source Git uniquement — non déployée |

Les trois fonctions exigent un bearer JWT, vérifient l'identité avec `auth.getUser(token)`, contrôlent une appartenance owner/admin à l'organisation demandée et n'acceptent aucun identifiant d'acteur du navigateur. Elles utilisent la clé `SUPABASE_SERVICE_ROLE_KEY` exclusivement côté serveur. Les payloads sont strictement validés, les corps limités, les origines contrôlées par `ALLOWED_ORIGINS` et les réponses portent `Cache-Control: no-store`.

La migration additive `20261111200000_cheexpeer_api_security_fixes.sql` ajoute les façades RPC réservées à `service_role`, une lecture explicitement filtrée par `mission_id` ET `organization_id`, l'idempotence par organisation et la persistance des approbations expirées.

**Aucun déploiement, aucune migration appliquée, aucun secret configuré et aucune donnée Supabase modifiée.** Avant la recette sur MajestiOS-Test, exécuter la migration et les tests transactionnels sur une base locale jetable, puis réaliser les tests Auth/RLS avec deux organisations et des comptes synthétiques. L'autorisation explicite reste nécessaire avant toute écriture sur MajestiOS-Test.


### Renforcement de l'isolation de la décision — 11 novembre 2026

La RPC de décision reçoit désormais également `p_organization_id` et vérifie par jointure que l'approbation appartient bien à cette organisation avant d'appeler la fonction de décision interne. Ce contrôle complémentaire ferme le cas où un utilisateur serait administrateur de plusieurs organisations et tenterait de fournir l'identifiant d'approbation d'un autre tenant. Le handler transmet exclusivement l'organisation préalablement autorisée depuis le contrôle d'appartenance.

Le test de contrat SQL vérifie la présence de ce filtre. Une recette PostgreSQL réelle à deux organisations reste nécessaire avant activation.
