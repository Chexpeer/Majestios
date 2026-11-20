# Evolution-10 — Journal de synchronisation dépôt ↔ MajestiOS-Test (15 novembre 2026)

**Règle :** evolution-10 est le prototype le plus avancé, déployé sur Vercel et branché sur **MajestiOS-Test** uniquement. **Rien ici n'est promu vers majestios-crm ni vers la production.**

## Migrations : dépôt et base de test

| Migration appliquée sur Test | Fichier du dépôt | Contrôle |
|---|---|---|
| 38 premières (fondations → `cheexpeer_worker_server_bridge`) | `supabase/migrations/2026110*…` à `20261109250000…` | Mêmes noms |
| `remove_duplicate_tenant_integrity_triggers` | `20261114120100_dedupe_crm_tenant_integrity_triggers.sql` | Mêmes quatre suppressions, ordre différent (équivalent) |
| `enable_rls_reputation_audit_usage` | `20261114163838_enable_rls_reputation_audit_usage.sql` | **Fichier ajouté le 15/11** (il manquait au dépôt) |
| `cheexpeer_worker_self_check_tool` | `20261111160000_…` | Identique (hors commentaires) |
| `cheexpeer_api_security_fixes` | `20261111200000_…` | Identique (hors commentaires) |
| `public_announcements` | `supabase/proposed/20261114210000_public_announcements.sql` | Identique (hors commentaires). Reste dans `proposed/` : c'est un candidat, pas encore une migration de la chaîne |
| `fix_crm_activity_trigger_old_status` | `20261114120000_…` | Identique (hors commentaires) |
| `admin_invitations` | `20261115010000_…` | Identique (hors commentaires) |
| `cheexpeer_chat` | `20261115020000_…` | Identique (hors commentaires) |

Méthode : empreinte du SQL sans commentaires ni espaces, calculée sur la base de test et sur le fichier du dépôt.

## Fonctions serveur sur Test

`cheexpeer-worker` (v2, dépôt : `cheexpeer-worker-bridge`, écart de nom CHX-01 connu), `cheexpeer-mission-submit`, `cheexpeer-approval-decision`, `cheexpeer-mission-read`, `reputation-audit-context` (v5), **`admin-invite-user`** (v2) et **`cheexpeer-chat`** (v1), toutes avec vérification du jeton.

Présentes dans le dépôt mais **non déployées sur Test** : `bootstrap-internal-admin`, `import-official-company`, `prospection-search-member`, `search-official-companies`. À déployer sur décision, au moment où leur recette sera faite.

**Mise à jour du 2026-11-20 :** `provision-client-workspace` (v2) est **déployée sur Test** (avec vérification du jeton). Elle refuse (403) toute demande dont le compte n'a pas accepté la politique de confidentialité ; elle est appelée à l'activation de l'espace. `cheexpeer-chat` est en v2.

## Configuration du site (evolution-10)

`supabase-config.js` et `annonces-config.mjs` pointent sur **MajestiOS-Test**. **Avant toute fusion vers la production, remettre `supabase-config.js` sur majestios-crm.** À ne jamais oublier.

## Migration appliquée sur Test le 2026-11-20

- `20261120190000_announcements_more_kinds` : quatre types d'annonces ajoutés (`real_estate_offer`, `real_estate_wanted`, `business_sale`, `business_wanted`) dans la règle `announcements_kind_check` et dans les fonctions `submit_announcement` et `publish_announcement_admin`. Appliquée sur MajestiOS-Test uniquement ; **à rejouer sur la production avec le reste des migrations lors de la fusion décidée par le propriétaire.** `majestios-crm` n'est pas modifié.
