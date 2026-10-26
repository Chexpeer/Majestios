# Supabase — MajestiOS

## Initialisation
1. Créez un projet Supabase de développement.
2. Dans **SQL Editor**, exécutez uniquement `migrations/0001_initial_schema.sql`.
3. Configurez ensuite les variables `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` à partir du projet.
4. Ne placez jamais la clé `service_role` dans une variable `NEXT_PUBLIC_*` ni dans le navigateur.

## Modèle de données
- `staging` : imports et données brutes avec provenance et statut de revue.
- `memory` : entreprises, contacts, décideurs, opportunités et activités.
- `analysis` : signaux, hypothèses, scores et recommandations.
- `ops_coach` : missions, campagnes, rapprochements en attente et décisions humaines.

Les fichiers de `schemas/` sont des repères de séparation fonctionnelle ; ils ne doivent pas être exécutés individuellement. La migration est le point d’entrée exécutable unique.

## Sécurité et limites
- L'isolation par organisation est appliquée par RLS aux tables métier.
- La création d'une organisation ajoute automatiquement son créateur comme `TENANT_ADMIN`.
- Les schémas métier ne sont pas accordés à l'API Data par cette migration. Il faudra les exposer explicitement si l'application doit les interroger via PostgREST, en gardant RLS actif et en vérifiant les permissions.
- Cette migration est versionnée mais **n'a pas été exécutée sur une base Supabase réelle** dans ce dépôt. Testez-la sur un projet de développement avant toute donnée réelle.
- La gestion des invitations/membres, la validation des rôles et les flux d'onboarding complets restent à implémenter.
