# Annonces gratuites de sous-traitance — spécification et mise en œuvre préparée

**Date :** 14 novembre 2026 · **Statut :** SQL **appliqué sur MajestiOS-Test** (jamais sur majestios-crm) · **Références :** [architecture du registre d'annonces](../evolution-5.0/ARCHITECTURE-REGISTRE-COMMERCIAL-ANNONCES-BESOINS-2026-11-06.md) (§6 : aucune table avant validation du modèle et des scénarios de sécurité), [vision §7 bis](VISION-STRATEGIQUE-MAJESTIOS-2026-2028.md), registre §94–97.

## 1. Décision et principe

Les annonces publiées par les clients (offres et recherches de sous-traitance) sont des **appels d'offres privés** : cœur du site et de son référencement. Elles sont **gratuites**, **relues avant publication**, et **les coordonnées ne sont jamais publiques** : les mises en relation passent par MajestiOS.

## 2. Ce qui est prêt dans le dépôt

| Élément | Fichier | État |
|---|---|---|
| Modèle de données, fonctions et droits | `supabase/proposed/20261114210000_public_announcements.sql` | Écrit, testé sur PostgreSQL 16 jetable, puis **appliqué sur MajestiOS-Test** le 14/11 (migration `public_announcements`) |
| Scénarios de sécurité | `supabase/proposed/announcements.scenarios.sql` | Rejouables ; résultat obtenu : `SCENARIOS_OK` (voir §5) |
| Formulaire de dépôt | `sous-traitance.html#deposer`, `annonces-formulaire.(mjs\|js\|css)` | Envoie vers **MajestiOS-Test** (valide la saisie, limites anti-abus côté base) |
| Interrupteur d'ouverture | `annonces-config.mjs` (`ANNONCES_OUVERTES = true`) | Ouvert sur la branche de test seulement ; à décider avant tout passage en production |
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

## 7. Décision du propriétaire du 16 novembre 2026 (documentation d'abord, puis Test)

**1. Dépôt réservé aux titulaires d'un espace personnel.** La publication d'annonces gratuites est conditionnée à la création (et à la connexion) d'un espace personnel : c'est le premier « appât » pour attirer les clients, juste avant les appels d'offres. Un visiteur non connecté voit les annonces publiées, mais pour déposer il doit créer son espace ou se connecter.
- Serveur : `submit_announcement` exige une session, un compte à e-mail confirmé rattaché à une organisation ; l'e-mail de contact est celui du compte (non saisi) ; droit d'exécution retiré à `anon`. Limites anti-abus par compte (5 dépôts / 24 h) en plus des limites existantes.
- Colonne `author_user_id` ajoutée (traçabilité, jamais publique).

**2. Annonces élargies : pas seulement la sous-traitance.** Huit types : `subcontract_need`, `subcontract_offer` (sous-traitance) ; `job_offer` (offre d'emploi), `job_seeker` (demande d'emploi) ; `equipment_offer` (location de matériel, ex. BTP), `equipment_wanted` (recherche de matériel à louer) ; `other_offer`, `other_request` (autres). Liste modifiable sur décision du propriétaire.

**Points à valider par le propriétaire (juridique, hors technique) :** conditions des annonces d'emploi (offres et demandes de personnes physiques : données personnelles, conservation, modération renforcée) ; avis d'information (`NOTICE_VERSION`) à adapter aux nouveaux types ; durée de conservation. Rien de cela n'est ouvert au public : MajestiOS-Test uniquement.

**Retour arrière :** migration `20261116170000_announcements_require_account_and_kinds.sql` — rétablir la liste de types d'origine et `grant execute … to anon` (la colonne `author_user_id` peut rester).
