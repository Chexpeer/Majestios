# Écarts constatés entre Supabase live et Git

Contrôle du 7 novembre 2026 sur le projet `majestios-backend` (`awtgrjnpckgxsdpfrnhg`).

## Migrations appliquées en production

Supabase déclare 13 migrations appliquées. Le relevé exact est dans `applied-migrations.json`.

## Fichiers présents dans `supabase/migrations/`

Le dépôt contient 13 fichiers SQL, mais trois horodatages ne correspondent pas à ceux enregistrés dans Supabase :

| Fonction | Version appliquée dans Supabase | Fichier Git |
|---|---|---|
| bootstrap_first_internal_admin | 20261106085409 | 20261106031500_bootstrap_first_internal_admin.sql |
| enforce_crm_editor_roles | 20261106085411 | 20261106074500_enforce_crm_editor_roles.sql |
| atomic_client_workspace_provisioning | 20261106085415 | 20261106090000_atomic_client_workspace_provisioning.sql |

Les 10 autres horodatages et noms correspondent.

**Conséquence :** ne pas lancer aveuglément `supabase db push`, ne pas réinitialiser la base et ne pas supposer que les trois fichiers Git sont identiques au SQL réellement appliqué. Il faut comparer leurs définitions à l'état live et reconstituer les migrations exactes avant de préparer une base neuve.

## Inventaire plateforme capturé

- Projet actif sain, région `eu-west-3`, PostgreSQL 17.11.
- Une fonction Edge active : `provision-client-workspace`, version 3, JWT requis ; son source est sauvegardé.
- Un cron actif `majestios-crm-reminders`, toutes les 5 minutes.
- Aucun bucket Storage ni objet Storage recensé.
- Extensions installées et types TypeScript générés sauvegardés dans ce dossier.
- L'inventaire des tables a aussi relevé le schéma Auth ; il existe un utilisateur Auth et une identité liée.

## Blocages de la sauvegarde exhaustive

Les outils connectés disponibles ne proposent pas d'action d'export natif `pg_dump`, d'archive de sauvegarde Supabase, d'export/import Auth complet, ni de lecture/archivage des secrets Edge et paramètres privés du projet. L'inventaire SQL n'est pas un substitut à ces exports.

Avant toute suppression, il reste impératif de produire :
1. un dump PostgreSQL complet (schémas, données, rôles/grants et objets requis) ;
2. un export Auth officiellement pris en charge, en sachant que les sessions et secrets d'authentification peuvent ne pas être transférables ;
3. une copie sécurisée des secrets/variables d'environnement, hors dépôt Git ;
4. une vérification de restauration sur une base/projet séparé.

Aucun secret n'a été écrit dans GitHub. Aucun projet Supabase n'a été supprimé ou modifié par cette sauvegarde.
