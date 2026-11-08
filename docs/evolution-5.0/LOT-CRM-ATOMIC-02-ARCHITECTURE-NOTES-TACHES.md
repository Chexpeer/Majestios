# Lot CRM — architecture des notes, interactions et tâches

**Branche :** `feature/crm-atomic-integration`  
**Lot :** 02 — cadrage fonctionnel et données, sans écriture Supabase  
**Statut :** audit du code et du modèle existant effectué ; proposition documentée ; aucune migration ni modification applicative dans ce lot.

## 1. Décision d'architecture

MajestiOS doit distinguer trois objets métier qui ne sont pas interchangeables :

1. **Note** — information durable à conserver dans un dossier (entreprise, contact ou opportunité).
2. **Interaction / activité** — événement réellement survenu ou changement enregistré dans la chronologie : appel passé, e-mail envoyé, rendez-vous tenu, qualification modifiée, tâche terminée.
3. **Tâche** — action future ou en cours, assignable, avec échéance et état propre.

La chronologie `activities` reste le journal append-only. Elle ne devient ni un bloc-notes modifiable ni un gestionnaire de tâches. Une note ne doit pas être artificiellement présentée comme un appel ou une interaction. Une tâche ouverte ne doit pas être confondue avec l'activité `task` qui sera créée à sa clôture.

## 2. État réel du socle MajestiOS audité

### `activities`

Table existante, multi-tenant, avec liens facultatifs vers `businesses`, `contacts` et `opportunities`, auteur, type, objet, corps, date de survenue et métadonnées JSON.

Types déjà admis : `note`, `call`, `email`, `meeting`, `task`, `status_change`, `qualification`, `system`.

**Usage recommandé :** journal chronologique non destructif. Une activité est un fait historique. Une correction doit être ajoutée comme nouvel événement explicatif plutôt que réécrire silencieusement le passé.

**Limite constatée :** aucune notion de statut, d'assignation ou d'échéance de tâche dans cette table ; aucune vraie fiche de note avec cycle de vie et recherche dédiée.

### `opportunities.next_action` et `next_action_at`

Ces champs représentent la prochaine action principale d'une opportunité. Ils sont déjà exploités par les vues de relance et par le cycle de vie des rappels persistants.

**Usage recommandé :** conserver ces champs comme résumé de la prochaine étape commerciale de l'opportunité, et non comme gestionnaire universel de toutes les tâches du CRM.

### `crm_reminders`

Table existante dédiée aux rappels dérivés de la prochaine action des opportunités. Elle est liée à `opportunity_id`, matérialisée par un traitement planifié, et sa clôture passe par une fonction transactionnelle qui ajoute une activité `task`.

**Usage recommandé :** ne pas la détourner en table générique de tâches. Elle reste un mécanisme de notification/relance pour les prochaines actions d'opportunité. Un rappel n'est pas la tâche elle-même.

### Interface existante

- Le formulaire Activité permet déjà d'enregistrer note, appel, e-mail, rendez-vous, tâche, qualification.
- Le formulaire ne propose pas de date d'échéance ni d'assignation pour une tâche.
- Les fiches Entreprise exposent les contacts, opportunités et activités associées.
- Les fiches Contacts et Opportunités sont éditables ; la chronologie est consultative.
- Les relances persistantes sont liées aux opportunités et ne couvrent pas les actions générales liées à un contact ou une entreprise.

## 3. Modèle cible proposé — additif, sans recopier Atomic CRM

MajestiOS conserve ses UUID, `organization_id`, rôles, fonctions privées et politiques RLS. Aucun identifiant bigint ni modèle `sales_id` d'Atomic CRM ne doit être importé.

### A. Table `crm_notes`

Champs proposés :

| Champ | Rôle |
| --- | --- |
| `id uuid` | Identifiant |
| `organization_id uuid not null` | Cloisonnement tenant |
| `business_id uuid null` | Dossier entreprise éventuel |
| `contact_id uuid null` | Dossier contact éventuel |
| `opportunity_id uuid null` | Dossier opportunité éventuel |
| `title text not null` | Titre court |
| `body text not null` | Contenu de la note |
| `created_by uuid` | Auteur initial |
| `updated_by uuid` | Dernier éditeur |
| `created_at / updated_at timestamptz` | Dates système |
| `archived_at timestamptz null` | Archivage réversible |

Règles proposées :

- Une note appartient à une organisation et peut être rattachée à une ou plusieurs dimensions métier (entreprise, contact, opportunité).
- Au moins un lien métier doit être renseigné.
- Les liens doivent appartenir à la même organisation que la note ; une simple contrainte FK ne suffit pas à garantir cette cohérence tenant.
- Une note est éditable par les rôles autorisés ; son archivage est préférable à une suppression physique.
- Les pièces jointes sont hors premier incrément. Ne pas ajouter de stockage ni de table d'attachements sans besoin validé.
- Toute création, modification ou archive peut produire une activité d'audit correspondante dans `activities`, avec `metadata.source = 'crm_note'` et l'identifiant de la note.
- Le contenu de la note ne doit pas être dupliqué intégralement dans l'activité d'audit : conserver un résumé et l'identifiant.

### B. Table `crm_tasks`

Champs proposés :

| Champ | Rôle |
| --- | --- |
| `id uuid` | Identifiant |
| `organization_id uuid not null` | Cloisonnement tenant |
| `business_id uuid null` | Entreprise liée |
| `contact_id uuid null` | Contact lié |
| `opportunity_id uuid null` | Opportunité liée |
| `title text not null` | Action à réaliser |
| `description text null` | Consignes |
| `task_type text not null` | call, email, meeting, follow_up, other |
| `status text not null` | open, in_progress, done, cancelled |
| `priority text not null` | low, normal, high |
| `due_at timestamptz null` | Échéance |
| `assigned_to uuid null` | Collaborateur responsable |
| `created_by uuid` | Auteur |
| `completed_at timestamptz null` | Date de clôture |
| `created_at / updated_at timestamptz` | Dates système |

Règles proposées :

- Une tâche peut concerner une entreprise, un contact, une opportunité, ou plusieurs liens cohérents entre eux ; au moins un lien métier est requis.
- Les liens doivent être validés côté base pour empêcher le rattachement inter-organisation.
- `done` impose `completed_at` ; le retour de `done` vers un état actif doit remettre `completed_at` à null et laisser une trace d'audit.
- `cancelled` n'est pas équivalent à `done`.
- La modification d'une échéance ne doit pas créer plusieurs tâches : la tâche garde son identité ; seul son échéancier change.
- La clôture d'une tâche crée une seule activité `task` dans `activities`, liée aux mêmes objets et contenant l'identifiant de tâche dans `metadata`. Cette opération doit être atomique et protégée contre les doubles clics.
- La tâche est la source de vérité de son statut et de son échéance. L'activité générée à la clôture est le fait historique.

### C. Rappels : ne pas créer une troisième source de vérité

Au premier incrément, les tâches peuvent être listées par échéance dans l'interface sans notification persistante dédiée.

Dans un incrément ultérieur, si les notifications des tâches générales sont nécessaires, ajouter un mécanisme de rappel lié à `crm_tasks` (ou une table de rappels polymorphe soigneusement contrainte). Ne pas élargir implicitement `crm_reminders`, dont le contrat actuel est centré sur `opportunities.next_action`.

## 4. Matrice d'usage — éviter les doublons

| Situation | Objet source | Événement historique |
| --- | --- | --- |
| « Le client préfère être rappelé le matin » | Note liée au contact | Activité `note` facultative à la création |
| « Appeler Mme X mardi » | Tâche liée au contact | Activité `task` à la clôture uniquement |
| « Appel réalisé ce matin » | Activité `call` | L'activité est elle-même l'événement |
| « Envoyer le devis avant vendredi » | Tâche liée à l'opportunité | Activité `task` à la clôture |
| « Le devis a été envoyé » | Activité `email` | L'activité est elle-même l'événement |
| Prochaine étape principale d'une opportunité | `opportunities.next_action` + `next_action_at` | Rappel persistant existant selon son cycle |
| Tâche terminée | `crm_tasks.status = done` | Une activité `task` créée atomiquement |

**Règle anti-doublon :** ne jamais créer automatiquement une activité à chaque affichage, report ou simple consultation d'une tâche. Les événements d'audit de modification peuvent être ajoutés de manière ciblée, mais l'activité de clôture doit être unique.

## 5. Sécurité et intégrité à exiger avant toute migration

1. RLS activée sur chaque nouvelle table.
2. Lecture limitée aux membres de `organization_id`.
3. Création et modification réservées aux rôles CRM éditeur/admin définis par le socle ; le rôle `viewer` reste strictement consultatif.
4. `created_by`, `updated_by` et `assigned_to` ne doivent pas permettre d'usurper un utilisateur ou d'assigner à un membre d'une autre organisation.
5. Contrôle de cohérence tenant des relations entreprise/contact/opportunité, y compris lorsque plusieurs liens sont renseignés.
6. Index sur `(organization_id, status, due_at)` pour les tâches et sur les clés de relation utilisées par les dossiers.
7. Fonctions transactionnelles avec `search_path` verrouillé, vérification explicite de `auth.uid()` et révocation des droits par défaut si une fonction privilégiée est réellement indispensable.
8. Aucun accès `service_role` dans le navigateur.
9. Tests RLS croisés entre deux organisations, rôles viewer/editor/admin, liens incohérents et double clôture.
10. Ne pas supposer qu'une FK simple empêche une relation entre deux tenants différents.

## 6. Parcours UI cible

- Ajouter une zone **Notes** dans les dossiers Entreprise, Contact et Opportunité.
- Ajouter une zone **Tâches** dans ces mêmes dossiers, avec état, priorité, responsable et échéance.
- Conserver **Activités et historique** séparé, en lecture chronologique.
- Ajouter un espace transversal **Mes tâches** / **Tâches de l'équipe** avec filtres statut, échéance, responsable et recherche.
- Garder les relances automatiques d'opportunités dans leur zone actuelle ; les distinguer visuellement des tâches créées manuellement.
- Les liens entre objets doivent ouvrir le dossier concerné, sans créer de doublon de fiche.

## 7. Plan d'implémentation recommandé

| Lot | Travail | Condition de passage |
| --- | --- | --- |
| 02 — présent | Audit et architecture documentés | Validé par le propriétaire du produit |
| 03 | Migration additive `crm_notes` + tests SQL/RLS | Relations tenant vérifiées ; advisors sans alerte critique |
| 04 | Notes dans dossiers Entreprise / Contact / Opportunité | CRUD, archivage, recherche et droits vérifiés |
| 05 | Migration additive `crm_tasks` + clôture transactionnelle | Tests de concurrence, d'assignation et de double clôture |
| 06 | UI tâches dans les dossiers + espace transversal | Parcours desktop/mobile et rôles validés |
| 07 | Rappels de tâches si besoin démontré | Aucun conflit avec `crm_reminders` d'opportunités |

Ne pas fusionner les lots 03 à 07 en un refactoring unique. Chaque lot doit rester réversible et vérifiable.

## 8. Décisions non prises

Les points suivants restent volontairement ouverts et ne doivent pas être codés par supposition :

- Une note est-elle strictement privée à son auteur ou visible par toute l'organisation ?
- Faut-il permettre plusieurs responsables sur une tâche, ou un seul `assigned_to` ?
- Les tâches sans échéance sont-elles autorisées ?
- Une tâche peut-elle être liée simultanément à plusieurs opportunités, ou à un seul triplet entreprise/contact/opportunité ?
- Quel niveau d'historisation est souhaité pour les modifications de notes ?
- Les rappels de tâches doivent-ils être locaux à l'interface, persistants côté serveur, ou les deux ?

## 9. Périmètre effectivement exécuté dans le lot 02

- Lecture du schéma initial multi-tenant et des usages de `activities`.
- Lecture des accès et fonctions client pour les listes, créations, modifications et relances.
- Lecture des formulaires et du rendu des activités, fiches et relances.
- Lecture des migrations du cycle de vie des relances persistantes dans le dépôt.
- Rédaction de la présente architecture.

**Aucun** code applicatif, schéma Supabase, donnée, politique RLS, fonction SQL, déploiement ou branche de production n'a été modifié dans ce lot.
