# Initialisation du premier administrateur interne MajestiOS

Date : 7 novembre 2026
Projet Supabase : `majestios-crm` (`qxaghcifdhugfskuscoc`)

## Objectif

Attribuer le rôle `owner` de l'organisation interne « MajestiOS — CRM interne » au premier compte Auth confirmé dont l'adresse est `szineddine174@gmail.com`.

Cette procédure ne crée pas elle-même le compte Auth et ne confirme pas l'adresse à la place de son titulaire.

## Parcours

1. Le titulaire crée son compte depuis le formulaire sécurisé de `espace-membre.html`, avec l'adresse désignée.
2. Supabase envoie le message de confirmation selon la configuration Auth du projet.
3. Après confirmation et connexion, le navigateur appelle la fonction Edge `bootstrap-internal-admin` avec le JWT de la session.
4. La fonction relit l'identité auprès de Supabase Auth, contrôle l'adresse exacte et `email_confirmed_at`, puis appelle la RPC privilégiée.
5. La RPC vérifie qu'aucun administrateur interne n'a déjà été initialisé, puis attribue `owner` à ce seul utilisateur dans l'organisation interne existante.

## Barrières de sécurité

- La fonction Edge exige un JWT valide (`verify_jwt=true`).
- L'identité et l'adresse proviennent de `auth.getUser(token)`, jamais d'un champ fourni par le navigateur.
- L'adresse doit correspondre exactement à `szineddine174@gmail.com`, sans distinction de casse.
- L'adresse doit être confirmée.
- Le bootstrap est atomique et protégé contre deux initialisations concurrentes.
- La fonction SQL privée n'est exécutable que par `service_role`.
- La RPC publique relais est également exécutable uniquement par `service_role`; `anon` et `authenticated` ont été vérifiés sans droit EXECUTE.
- La clé `service_role` reste exclusivement dans l'environnement serveur Supabase.
- Aucun utilisateur n'est créé directement dans `auth.users`.
- Aucun compte ni membership administrateur n'a été créé à la date de ce document.

## Éléments déployés

- Migration : `20261107070905_expose_internal_admin_bootstrap_service_role_only` (version Supabase appliquée).
- Source versionnée : `supabase/migrations/20261107081000_expose_internal_admin_bootstrap.sql`.
- Fonction Edge : `bootstrap-internal-admin`, version 1, ACTIVE, JWT obligatoire.
- Source versionnée : `supabase/functions/bootstrap-internal-admin/index.ts`.
- Client web : `supabase-config.js` pointe désormais vers le projet Supabase vierge `majestios-crm`.
- `auth-espace-membre.js` distingue le compte interne désigné des comptes clients et n'envoie pas ce compte dans le provisionnement client.

## Limite de recette

Le parcours n'est pas encore validé de bout en bout : aucun utilisateur Auth n'existe actuellement. La confirmation par e-mail et la redirection doivent être vérifiées avec la configuration Auth réelle et le domaine web effectivement utilisé. Aucun e-mail n'a été envoyé et aucun compte n'a été créé par cette intervention.
