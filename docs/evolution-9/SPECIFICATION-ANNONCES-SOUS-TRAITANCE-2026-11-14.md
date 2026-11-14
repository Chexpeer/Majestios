# Annonces gratuites de sous-traitance — spécification et mise en œuvre préparée

**Date :** 14 novembre 2026 · **Statut :** préparé, **non appliqué** · **Références :** [architecture du registre d'annonces](../evolution-5.0/ARCHITECTURE-REGISTRE-COMMERCIAL-ANNONCES-BESOINS-2026-11-06.md) (§6 : aucune table avant validation du modèle et des scénarios de sécurité), [vision §7 bis](VISION-STRATEGIQUE-MAJESTIOS-2026-2028.md), registre §94–97.

## 1. Décision et principe

Les annonces publiées par les clients (offres et recherches de sous-traitance) sont des **appels d'offres privés** : cœur du site et de son référencement. Elles sont **gratuites**, **relues avant publication**, et **les coordonnées ne sont jamais publiques** : les mises en relation passent par MajestiOS.

## 2. Ce qui est prêt dans le dépôt

| Élément | Fichier | État |
|---|---|---|
| Modèle de données, fonctions et droits | `supabase/proposed/20261114210000_public_announcements.sql` | Écrit, **testé sur une base PostgreSQL 16 jetable** (hors Supabase), non appliqué |
| Scénarios de sécurité | `supabase/proposed/announcements.scenarios.sql` | Rejouables ; résultat obtenu : `SCENARIOS_OK` (voir §5) |
| Formulaire de dépôt | `sous-traitance.html#deposer`, `annonces-formulaire.(mjs\|js\|css)` | Visible en **prévisualisation** : valide la saisie, **n'envoie rien** |
| Interrupteur d'ouverture | `annonces-config.mjs` (`ANNONCES_OUVERTES = false`) | Fermé |
| Tests | `tests/annonces-formulaire.test.mjs`, `tests/annonces-formulaire.browser.cjs` | Réussis |

## 3. Modèle

- `public.announcements` : contenu publiable (type, titre, description, métier, département, validité, statut `pending / published / rejected / withdrawn / expired`, version de l'avis accepté, empreinte d'origine).
- `private.announcement_contacts` : nom, e-mail, téléphone de l'auteur — jamais lisibles par un visiteur ni par un compte client.
- `private.announcement_introductions` : demandes de mise en relation, relayées par l'équipe.
- `private.announcement_events` : journal append-only (dépôt, publication, refus, correction, retrait, expiration).

**Aucun accès direct** : RLS activée, droits retirés, politique « jamais » sur les quatre tables. Tout passe par des fonctions :

| Fonction | Qui | Rôle |
|---|---|---|
| `submit_announcement` | visiteur | Valide, limite le débit, enregistre en `pending` |
| `list_published_announcements` | visiteur | Annonces publiées non expirées, **sans coordonnées**, paginées (50 max) |
| `request_announcement_introduction` | visiteur | Dépose une demande de mise en relation |
| `moderation_queue` / `moderate_announcement` | **personnel interne (VIP) seulement** | Relire (avec coordonnées), corriger le texte, publier (60 jours max), refuser (motif obligatoire), retirer |
| `private.expire_announcements` | planification interne | Passe les annonces échues en `expired` |

## 4. Protections contre les abus

Piège à robots (champ caché) ; refus des liens, e-mails et téléphones **dans le texte public** ; 3 dépôts par jour et par origine, 3 par adresse e-mail, 5 demandes de mise en relation par jour et par origine ; 300 annonces en attente au maximum ; tailles bornées ; département et date contrôlés ; toute annonce relue par un humain avant publication.

## 5. Scénarios joués (base jetable)

Accès direct refusé aux visiteurs ; dépôt valide ; piège à robots ignoré ; consentement exigé ; coordonnées dans le texte refusées ; e-mail, département et type invalides refusés ; 4ᵉ dépôt refusé ; rien de visible avant relecture ; file de relecture interdite aux visiteurs et aux comptes client ; le personnel voit les coordonnées, corrige, publie, refuse (motif obligatoire), ne peut pas republier ; le visiteur ne voit **aucune coordonnée** dans la liste publique ; mise en relation acceptée et mal formée refusée ; expiration ; journal complet.

**Limite de ces essais :** base PostgreSQL locale avec une simulation minimale des rôles `anon` et `authenticated` et de `auth.uid()`. Ils ne remplacent pas un essai sur une copie Supabase réelle (en-têtes réels, rôles réels, avertissements du conseiller de sécurité).

## 6. Avant toute ouverture (checklist)

1. **Autorisation écrite du porteur** d'appliquer le SQL, d'abord sur `MajestiOS-Test` ou une branche Supabase.
2. Rejouer `announcements.scenarios.sql` sur cette copie ; lancer le conseiller de sécurité Supabase.
3. **Validation juridique (ANN-02)** : avis d'information et base légale, durée de conservation (annonces, coordonnées, demandes), droit de retrait, modération, responsabilité éditoriale, conditions d'utilisation. Remplacer `annonces-brouillon-2026-11` par la version validée.
4. Construire la page de relecture interne (liste, correction, publication, refus) au-dessus de `moderation_queue` / `moderate_announcement`, derrière l'accès VIP.
5. Construire la liste publique « Appels d'offres privés » au-dessus de `list_published_announcements` (distincte des appels d'offres publics), avec balisage pour le référencement.
6. Planifier `private.expire_announcements()`.
7. Passer `ANNONCES_OUVERTES` à `true`, puis recette réelle.

## 7. Ce que ce lot ne fait pas

N'applique rien à Supabase, n'ouvre pas le dépôt, ne publie aucune annonce, n'affiche aucune annonce réelle, ne modère pas : la page de relecture interne et la liste publique sont des étapes suivantes (§6, points 4 et 5), qui ne peuvent être testées honnêtement qu'une fois le SQL appliqué sur une copie.
