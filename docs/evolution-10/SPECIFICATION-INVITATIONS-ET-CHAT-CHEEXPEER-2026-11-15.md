# Spécification — invitations depuis l'administration et chat Cheexpeer (15 novembre 2026)

Décision du propriétaire (15/11) : **les membres et les clients sont invités depuis la surface d'administration**, pas depuis le tableau de bord Supabase ; **le chat avec Cheexpeer** vit aussi dans cette surface. Méthode : documentation → MajestiOS-Test → MajestiOS-CRM (voir `METHODE-DE-TRAVAIL-DOCUMENTATION-TEST-CRM.md`). Rien n'est promu vers le CRM sans décision explicite.

Sources relues : `ARCHITECTURE-ESPACES-ADMIN-CRM-CLIENT.md` (§ « Administration générale : inviter/suspendre, gérer les rôles »), `ETAT-BACKEND-SUPABASE.md` (aucun workflow d'invitation livré), `PROVISIONNEMENT-IDENTITES-RECETTE-CRM.md`, `LOT-CHEEXPEER-INTEGRATION` (§ chat, conversations, mémoire), `CAHIER-DES-CHARGES-CHEEXPEER.md` §5.

## A. Invitations

### A.1 Parcours
1. Page `admin-utilisateurs.html` (cockpit, réservée aux owner/admin internes) : liste des membres et des invitations, formulaire « Inviter ».
2. Formulaire : adresse e-mail ; **type** = membre interne | client ; rôle ; pour un client : nouvel espace (nom) ou espace existant.
3. Une Edge Function serveur envoie l'e-mail d'invitation. Le navigateur n'a **jamais** de clé privilégiée.
4. L'invité clique, arrive sur une page d'acceptation, **donne son consentement** (clients), puis reçoit son rattachement. Aucun droit n'est accordé avant l'acceptation.
5. L'administrateur peut **révoquer** une invitation en attente ; elle expire seule au bout de 7 jours.

### A.2 Règles de droits (côté serveur uniquement)
| Qui | Peut inviter |
|---|---|
| Owner interne | membres internes (admin, member, viewer), clients |
| Admin interne | membres internes (member, viewer), clients |
| Autres | rien |
Nul ne peut s'accorder un rôle supérieur au sien ; le rôle **owner interne** n'est jamais attribuable par l'interface ; un client ne peut jamais être rattaché à l'organisation interne et inversement.

### A.3 Éléments techniques (candidats, à valider avant de construire)
- Table `private.invitations` (e-mail normalisé, organisation, rôle, type, invitant, statut `pending|accepted|revoked|expired`, échéance) + journal des événements ; RLS activée, aucun accès direct client.
- Edge Function `admin-invite-user` (JWT vérifié, origine contrôlée, quota **10 invitations/jour/invitant**, idempotence) et RPC d'acceptation `accept_invitation()` : vérifie que l'e-mail de la session est celui de l'invitation, qu'elle est en attente et non expirée, puis crée le rattachement (et l'organisation client).
- Réponses **non énumérantes** (jamais « ce compte existe déjà » à un tiers) ; journaux sans donnée inutile ; tests SQL locaux rejouables comme `tests/sql/crm-recette-locale.sql` + test navigateur à API simulées.

### A.4 Prérequis à décider par le propriétaire
1. **Envoi d'e-mails réel (SMTP dédié)** : le service par défaut de Supabase est limité à quelques envois par heure (déjà rencontré). Pour inviter de vrais clients il faut un expéditeur dédié (fournisseur d'e-mails + adresse d'expédition du domaine). Coût : gratuit à faible volume chez plusieurs fournisseurs. **À choisir avant toute invitation réelle.**
2. **Modèle d'e-mail d'invitation en français** (lien unique, sans code).
3. **Site URL / Redirect URLs** de l'environnement concerné.

## B. Chat avec Cheexpeer (cockpit)

### B.1 Périmètre de la première version (niveaux N0–N2)
- Dialogue en français avec Cheexpeer dans le cockpit : répondre, expliquer, retrouver l'état du site et des missions, **préparer** des demandes.
- **Aucune action directe.** Toute demande d'action devient une **proposition de mission** soumise par les API existantes, avec validation humaine.
- Lecture seule, via des fonctions serveur autorisées ; jamais d'accès libre à la base.

### B.2 Éléments techniques (candidats)
- Tables privées `cheexpeer_conversations` et `cheexpeer_messages` (organisation, auteur, horodatage, coût estimé), RLS, rétention définie, suppression possible.
- Edge Function `cheexpeer-chat` : JWT, rôle owner/admin interne vérifié côté serveur, fournisseur Anthropic (adaptateur natif existant), clé dédiée, contexte minimal, contenus externes traités comme des données.
- **Garde-fous de coût** : plafond de messages par jour, plafond mensuel, coût suivi par conversation, **interrupteur** (`chat_enabled`, désactivé par défaut dans le registre).
- Aucun secret ni donnée sensible dans le contexte ni dans les journaux.

### B.3 Ordre recommandé
1. Invitations sur Test (spécification A) — nécessaires pour faire entrer les vraies personnes.
2. Chat minimal, interrupteur éteint, activé seulement après recette sur Test.
3. Promotion progressive vers MajestiOS-CRM, élément par élément, sur décision explicite.

## C. Ce que cette spécification ne décide pas
Le choix du fournisseur d'e-mails et de l'adresse d'expédition ; l'activation du chat ; toute promotion vers MajestiOS-CRM ; l'extension des rôles internes.
