# État du backend MajestiOS — 5 novembre 2026

## Décision et périmètre

Le projet Supabase `majestios-backend` a été créé dans l'organisation Chexpeer's Org, région Paris (`eu-west-3`). Son identifiant projet est `awtgrjnpckgxsdpfrnhg`.

Le socle de base de données a été appliqué et contrôlé. Il ne s'agit pas encore d'un CRM utilisable par les visiteurs : les pages HTML, les formulaires, l'authentification et les fonctions métier du site ne sont pas encore raccordés à ce backend.

Aucune donnée client, annonce ou donnée personnelle n'a été importée.

## Migrations appliquées

Les migrations versionnées sont conservées dans `supabase/migrations/` :

1. `20261105163901_majestios_core_multitenant_foundation.sql`
2. `20261105163922_harden_private_authorization_and_fk_indexes.sql`
3. `20261105163940_enforce_tenant_relationship_integrity.sql`

La première migration crée le socle métier ; la deuxième déplace les fonctions sensibles dans le schéma non exposé `private`, ferme leur exécution anonyme et ajoute les index de clés étrangères ; la troisième bloque les relations inter-organisations et interdit le déplacement d'une ligne d'un tenant à un autre.

## Tables créées

| Table | Finalité |
|---|---|
| `organizations` | Frontière d'isolation : MajestiOS interne, client ou partenaire |
| `profiles` | Profil minimal lié à `auth.users` |
| `organization_members` | Appartenance et rôle dans un espace |
| `businesses` | Fiches entreprises et qualification |
| `contacts` | Interlocuteurs professionnels |
| `opportunities` | Opportunités et pipeline commercial, avec provenance de source |
| `activities` | Historique append-only des actions commerciales |
| `client_requests` | Demandes transmises depuis un espace client authentifié |

Une organisation interne `majestios-interne` est créée. Aucun utilisateur n'y est rattaché pour le moment : l'identité du premier administrateur doit être confirmée et provisionnée par un canal privilégié. Aucun utilisateur ne peut s'ajouter lui-même à une organisation.

## Séparation et sécurité

- RLS activé sur les huit tables du schéma `public`.
- Aucune lecture ou écriture anonyme accordée sur les données métier.
- Les profils sont lisibles par leur propriétaire ; seuls nom affiché et téléphone sont modifiables par l'utilisateur.
- Les fiches entreprises, contacts et opportunités sont limitées aux membres de leur organisation.
- Les suppressions de fiches sont réservées aux administrateurs de l'organisation.
- Les activités sont en lecture et ajout uniquement, sans modification/suppression par les rôles applicatifs.
- Les demandes client peuvent être lues par leur organisation et par l'équipe interne MajestiOS ; leur statut est modifiable uniquement par l'équipe interne.
- Les appartenances sont provisionnées par un workflow de confiance ; pas d'auto-inscription à un tenant.
- Des triggers vérifient que les entreprises, contacts, opportunités et activités liées appartiennent au même tenant.
- Les fonctions SECURITY DEFINER d'autorisation sont placées dans `private`, non exposées par l'API publique, avec exécution anonyme révoquée.

## Contrôles effectués

- Projet Supabase : `ACTIVE_HEALTHY`.
- Trois migrations enregistrées dans l'historique Supabase.
- Huit tables recensées, toutes avec RLS activé.
- Contrôle SQL des privilèges : rôle `anon` incapable d'appeler les fonctions privées d'autorisation et le trigger de profil ; `authenticated` peut utiliser les fonctions d'autorisation dans les politiques.
- Conseiller sécurité Supabase : aucun avertissement restant après durcissement.
- Conseiller performance : aucun avertissement de clé étrangère non indexée ; les index récemment créés sont signalés « unused » car la base est encore vide, ce qui est attendu à ce stade.

## Limites explicites — rien n'est encore raccordé au site

- Aucun formulaire HTML n'envoie encore de données au backend.
- Aucun compte client ne peut encore être créé depuis le site.
- Aucun mécanisme d'invitation ou d'affectation à une organisation n'est encore livré.
- Aucun premier administrateur MajestiOS n'est provisionné.
- Aucune passerelle BOAMP/BODACC vers `opportunities` n'est active.
- Aucun fichier CV/Kbis n'est stocké ; aucun bucket Storage n'est créé.
- Les formulaires publics devront passer par une fonction serveur protégée contre le spam, avec validation, minimisation et politique de conservation avant stockage.

## Étapes suivantes

1. Confirmer et provisionner le premier administrateur interne.
2. Configurer Auth (confirmation d'adresse, récupération, règles de mot de passe et CAPTCHA selon les parcours).
3. Créer un workflow d'invitation et de création contrôlée des organisations clientes.
4. Définir les contrats des formulaires publics et leur endpoint serveur avant de collecter des données.
5. Raccorder progressivement les formulaires, puis la qualification et les opportunités, avec tests RLS multi-tenant et tests navigateur.
6. Ajouter Storage uniquement lorsque les règles de dépôt, d'accès, de durée de conservation et de suppression des pièces sont établies.

## Règle de gouvernance

Le schéma de données est une fondation technique versionnée, pas une validation définitive de toutes les règles métier ou RGPD. Toute extension doit conserver la séparation CRM interne / espace client / moteur de qualification, la provenance des informations, les décisions humaines et les tests anti-régression.
