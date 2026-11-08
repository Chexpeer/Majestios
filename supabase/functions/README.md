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
