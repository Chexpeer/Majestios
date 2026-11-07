# Sauvegarde Supabase — 7 novembre 2026

Projet : majestios-backend
Référence : awtgrjnpckgxsdpfrnhg
Branche GitHub de conservation : evolution-5.0-clean-preview

## Éléments capturés dans ce dossier
- `snapshot-public-schema-and-data.json` : instantané JSON de la structure des tables publiques, colonnes, politiques RLS, fonctions public/private, triggers et lignes des 10 tables CRM publiques.
- `edge-functions/provision-client-workspace/index.ts` : source de la fonction Edge active, version 3 (JWT requis).
- Les migrations versionnées sont conservées dans le dépôt sous `supabase/migrations/` (à rapprocher des versions réellement appliquées avant toute reconstruction).

## Limites importantes — sauvegarde non exhaustive
Cette capture n'est PAS un dump PostgreSQL complet et ne permet PAS, à elle seule, de recréer à l'identique le projet Supabase.
Ne sont pas inclus : les utilisateurs et identités Auth, sessions/tokens, paramètres Auth, secrets Edge, clés API, variables d'environnement, configuration réseau, paramètres du projet, éventuels objets Storage, réglages/extensions complets et état des tâches Cron au format restaurable. Les schémas internes gérés par Supabase ne doivent pas être reconstruits manuellement à partir d'un inventaire SQL.
Aucun secret n'est copié dans GitHub.

## Règle
Ne supprimer ni réinitialiser aucun projet Supabase sur la base de cette capture seule. Compléter l'export natif PostgreSQL/Auth/Storage et les paramètres sensibles depuis Supabase avant toute suppression.
