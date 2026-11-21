# Audit des habilitations Supabase pour la Prospection — 2026-11-08

Branche : `feature/crm-atomic-integration`  
Projet inspecté en lecture seule : `qxaghcifdhugfskuscoc` (région eu-west-3)

## Résultat exécutif

Le modèle actuel permet déjà de distinguer les organisations internes, clientes et partenaires, et de vérifier l'appartenance d'un utilisateur à une organisation. Il ne comporte toutefois pas de statut d'appartenance (active/suspendue), ni de permission métier dédiée à la recherche avancée de Prospection.

Il est donc possible de construire un premier contrôle d'accès prudent à partir des données actuelles, mais il ne faut pas présenter ce contrôle comme un système complet de permissions fines ou de suspension de membres.

## Structure vérifiée

### `public.organizations`
- RLS activée.
- Colonnes métier pertinentes : `id`, `name`, `slug`, `kind`.
- Contrainte `kind` : `internal`, `client`, `partner`.

### `public.organization_members`
- RLS activée.
- Colonnes : `id`, `organization_id`, `user_id`, `role`, `created_at`.
- Rôles autorisés : `owner`, `admin`, `member`, `viewer`.
- Aucun champ `status`, `active`, `suspended`, `permissions` ou équivalent observé.
- Commentaire de table : les appartenances sont provisionnées par des workflows administratifs de confiance ; les utilisateurs ne peuvent pas s'ajouter eux-mêmes.

### `public.profiles`
- RLS activée.
- Contient uniquement les données de profil usuelles ; aucune habilitation Prospection.

## Politiques et fonctions vérifiées

- Les membres authentifiés peuvent lire les appartenances de leur organisation via la politique « Members can read organization memberships », fondée sur `private.is_org_member(organization_id)`.
- Les membres authentifiés peuvent lire leurs organisations via « Members can read their organizations », fondée sur la même fonction.
- `private.is_org_member(uuid)` vérifie l'existence d'une ligne de membership pour l'utilisateur courant.
- `private.is_org_editor(uuid)` accepte les rôles `owner`, `admin`, `member`, mais pas `viewer`.
- `private.is_internal_staff()` ne reconnaît que les rôles `owner`, `admin`, `member` d'une organisation de type `internal`.
- Ces fonctions ne vérifient pas de statut d'activation/suspension, car aucun statut correspondant n'existe dans la table.

## Provisionnement client existant

La fonction `provision_client_workspace` :
- est `SECURITY DEFINER`, avec `search_path` vide ;
- refuse l'appel hors `service_role` ;
- exige un utilisateur Auth existant avec e-mail confirmé ;
- vérifie la version de l'avis de confidentialité ;
- refuse un compte déjà rattaché à une organisation interne ou partenaire ;
- refuse les rattachements multiples à des organisations clientes ;
- crée une organisation de type `client` et un membership de rôle `owner` ;
- en cas de membership client existant unique, retourne l'organisation existante.

Le parcours d'inscription gratuit existant peut donc fournir à un nouveau membre une organisation cliente et une appartenance `owner`, sous réserve de confirmation de l'e-mail et de réussite du provisionnement.

## Règle d'autorisation provisoire recommandée

Pour le premier niveau avancé gratuit, avant l'introduction éventuelle de permissions fines :
1. valider le JWT et l'identité avec Supabase Auth côté serveur ;
2. rechercher les appartenances de l'utilisateur côté serveur ;
3. n'autoriser que si une et une seule organisation de type `client` correspond à une appartenance de rôle `owner`, `admin` ou `member` ;
4. refuser les organisations `internal` et `partner` pour ce parcours client ;
5. refuser les rôles `viewer` ;
6. refuser les comptes sans organisation cliente ou avec des rattachements ambigus ;
7. ne jamais accepter un `organization_id` fourni par le navigateur comme preuve d'autorisation : l'organisation autorisée doit être résolue côté serveur à partir de l'utilisateur authentifié.

Cette règle est une première barrière d'accès fondée sur le modèle actuel. Elle ne permet pas de suspendre une appartenance sans la supprimer et ne distingue pas les permissions de prospection des autres capacités du rôle `member`. Une permission dédiée et un statut d'appartenance pourront être proposés dans un lot de schéma ultérieur, après arbitrage et autorisation explicite.

## Conséquences pour les deux niveaux du moteur

- **Visiteur** : endpoint public séparé, strictement borné à l'annuaire généraliste ; aucune fonction avancée accessible par simple manipulation du navigateur.
- **Membre** : endpoint avancé avec JWT obligatoire et autorisation serveur fondée sur l'organisation cliente et le rôle ci-dessus.
- Les deux endpoints doivent retourner des DTO MajestiOS normalisés, sans identité de fournisseur, URL technique, identifiant de source ni payload brut.
- Aucun appel direct aux fournisseurs depuis le navigateur.
- L'authentification côté interface sert à adapter l'expérience ; elle ne remplace jamais l'autorisation serveur.

## Limites et sécurité du présent audit

- Lecture seule : aucune table, politique RLS, fonction, secret ou configuration n'a été modifié.
- Aucun utilisateur ni membership n'a été inspecté individuellement.
- Aucun déploiement Edge Function ou Vercel n'a été effectué.
- Aucun test d'autorisation runtime n'a été exécuté.
- L'audit décrit le schéma et les définitions SQL observés au moment de la consultation ; il ne certifie pas à lui seul l'ensemble des permissions effectives ni les contrôles de tous les endpoints.

## Étape suivante

Avant de coder l'endpoint avancé, confirmer le contrat d'autorisation provisoire ci-dessus, puis implémenter et tester côté serveur la résolution de l'organisation cliente. En parallèle, définir le contrat public de l'annuaire généraliste et ses quotas. Aucun changement de schéma n'est nécessaire pour commencer ce travail dans une branche de code, mais aucun déploiement ne doit intervenir sans validation distincte.
