# MajestiOS — audit des frontières d'accès pour le futur parcours réseau

**Date du contrôle :** 7 novembre 2026  
**Projet Supabase :** `majestios-backend` — `awtgrjnpckgxsdpfrnhg`  
**Branche documentaire :** `evolution-5.0-admin-cockpit`  
**Nature :** constat en lecture seule ; aucune modification de schéma, politique, fonction ou stockage.

## 1. Constat des politiques RLS observées

Les tables métier CRM sont protégées par RLS et utilisent des fonctions privées de contrôle d'appartenance :

| Objet | Lecture observée | Écriture observée |
|---|---|---|
| `organizations` | Membres de l'organisation | Aucune écriture directe observée |
| `organization_members` | Membres de l'organisation | Aucune écriture directe observée |
| `businesses` | Membres du tenant | Création / modification par éditeurs ; suppression par admins |
| `contacts` | Membres du tenant | Création / modification par éditeurs ; suppression par admins |
| `opportunities` | Membres du tenant | Création / modification par éditeurs ; suppression par admins |
| `activities` | Membres du tenant | Ajout par éditeurs ; pas de politique de modification/suppression observée |
| `crm_reminders` | Membres du tenant | Mise à jour limitée à l'état lu par éditeurs |
| `client_requests` | Membres du tenant ou personnel interne | Soumission par membres ; statut modifiable par personnel interne |
| `profiles` | L'utilisateur sur son propre profil | Mise à jour de son propre profil |
| `privacy_acknowledgments` | Accès direct anon/authenticated bloqué | Accès direct anon/authenticated bloqué |

Les contrôles des données CRM reposent notamment sur `private.is_org_member`, `private.is_org_editor`, `private.is_org_admin` et `private.is_internal_staff`. Les rôles applicatifs ne doivent pas être déduits de métadonnées utilisateur modifiables.

## 2. Provisionnement et fonctions privilégiées observés

Les fonctions suivantes ont été recensées dans les schémas `private` et `public` :

- `public.provision_client_workspace(...)` : fonction `SECURITY DEFINER`, exécutable par `postgres` et `service_role` uniquement selon les privilèges observés ;
- `private.handle_new_auth_user()` : fonction `SECURITY DEFINER`, exécutable par `postgres` et `service_role` ;
- `private.bootstrap_first_internal_admin(...)` : fonction `SECURITY DEFINER`, privilèges limités à `postgres` et `service_role` ;
- fonctions privées de contrôle des rôles et de cohérence tenant ;
- `public.complete_crm_reminder(...)` : fonction `SECURITY DEFINER` également exécutable par `authenticated`, à ne pas réutiliser pour le provisionnement ou le partage de dossiers.

Ce constat confirme que le parcours de création d'espace doit passer par un endpoint serveur autorisé et non par un appel navigateur direct à une fonction de provisionnement. Le code des fonctions et les Edge Functions devront être relus avant de définir le nouveau contrat ; cet inventaire de privilèges ne constitue pas à lui seul un audit complet de leur logique.

## 3. Stockage

La requête en lecture seule sur `storage.buckets` n'a retourné aucun bucket existant au moment du contrôle.

**Conséquence :** le dépôt des pièces de candidature n'est pas prêt côté Storage. Il faudra concevoir les buckets, les chemins, les limites de taille et de type MIME, les politiques Storage et les règles de partage avant d'activer le dépôt de KBIS, assurances, attestations, comptes ou autres justificatifs. Aucun document sensible ne doit être placé dans un espace public.

## 4. Conséquences directes pour le registre d'appels d'offres

Le modèle actuel est principalement un CRM privé multi-tenant. Les politiques observées ne fournissent pas de lecture publique anonyme pour un registre de consultations ou d'annonces.

Il faudra donc distinguer les accès :

1. **Consultation publique** : données explicitement publiables, via une politique publique minimale ou un endpoint serveur contrôlé.
2. **Dossier interne MajestiOS** : accès réservé aux membres internes autorisés.
3. **Espace entreprise** : accès réservé aux membres vérifiés de l'organisation concernée.
4. **Dossier de candidature** : accès restreint aux personnes habilitées de l'entreprise et aux personnels internes strictement autorisés.
5. **Transmission externe** : partage explicite, limité à un destinataire, un périmètre documentaire et une finalité.

Il ne faut pas ouvrir les tables CRM existantes à `anon` pour rendre une consultation visible. Le contenu public doit être séparé des données internes, des coordonnées privées et des pièces de candidature.

## 5. Matrice de conception à appliquer aux futurs objets

| Futur objet | Public | Entreprise concernée | Interne MajestiOS | Partenaire / acheteur |
|---|---|---|---|---|
| Consultation publiée | Lecture des seuls champs publiables | Lecture | Lecture/gestion selon rôle | Selon publication |
| Pièce officielle publique | Lecture si la source et les droits l'autorisent | Lecture | Lecture | Selon source |
| Note interne d'analyse | Non | Non | Rôle habilité | Non |
| Exigence structurée publiée | Lecture de la version validée | Lecture | Gestion et validation | Selon publication |
| Profil réseau entreprise | Champs explicitement publics | Lecture/édition de ses champs | Selon finalité et rôle | Seulement si visibilité/partage autorisé |
| Document privé entreprise | Non | Membres habilités uniquement | Accès justifié et contrôlé | Seulement après partage explicite |
| Pré-diagnostic | Non | Entreprise concernée | Personnel habilité | Non par défaut |
| Dossier de candidature | Non | Membres habilités | Personnel autorisé | Uniquement éléments choisis et transmis |

Cette matrice est une cible de conception, pas la description d'autorisations déjà déployées.

## 6. Garde-fous avant toute migration

- Ne pas ajouter de politique `anon` large sur les tables CRM existantes.
- Ne pas permettre l'auto-adhésion à une organisation en contournant le provisionnement.
- Ne pas donner accès à une entreprise sur la seule base d'un SIREN saisi sans procédure de revendication.
- Ne pas supposer qu'un compte utilisateur représente automatiquement une entreprise.
- Ne pas confondre la prise de connaissance de la notice avec un consentement marketing ou un accord de partage.
- Pour chaque table exposée, définir SELECT, INSERT, UPDATE et DELETE séparément, avec `USING` et `WITH CHECK` lorsque requis.
- Pour chaque fonction `SECURITY DEFINER`, documenter le propriétaire, le `search_path`, les contrôles d'identité, les privilèges EXECUTE et les chemins d'appel.
- Pour chaque bucket, définir RLS Storage, chemins tenant-scoped, partage temporaire et tests de fuite inter-tenant.
- Tester explicitement les scénarios utilisateur anonyme, utilisateur authentifié sans organisation, membre viewer, membre éditeur, admin, personnel interne et tiers externe.

## 7. Prochaine étape technique recommandée

Avant d'écrire la première migration du registre, produire le diagramme entités-relations et la matrice de politiques détaillée à partir des migrations existantes et du code de provisionnement. La première implémentation doit être un registre de consultations/lots sans pièces sensibles, puis l'analyse sourcée ; le stockage privé et l'espace candidat viendront après validation des accès.

**Conclusion :** le socle CRM possède déjà une frontière multi-tenant et des rôles utiles. Le réseau public d'entreprises et le dossier de candidature nécessitent toutefois une couche d'accès dédiée. Il faut prolonger le modèle existant, pas l'affaiblir pour aller plus vite.
