# Lot A — fondations partagées de Prospection

Date : 8 novembre 2026  
Branche : `feature/crm-atomic-integration`

## Résultat

Ajout de quatre modules purs dans `supabase/functions/_shared/` :

- `prospection-contract.mjs` : codes d'erreur, rôles, projections positives des DTO visiteur/membre et détection récursive des clés de provenance interdites ;
- `prospection-validation.mjs` : validation stricte des deux parcours, listes blanches de filtres, formats, bornes et pagination ;
- `prospection-authz.mjs` : décision d'habilitation et résolution serveur via `auth.getUser`, puis lectures memberships/organisations avec le client utilisateur soumis à RLS ;
- `prospection-errors.mjs` : erreurs publiques stables, messages non techniques et statuts HTTP.

Les modules sont en ESM `.mjs` afin d'être importables par Deno et testables avec Node sans dépendance de transpilation.

## Politique d'autorisation codée

Le résolveur exige un jeton, vérifie l'identité avec Supabase Auth, exige une adresse e-mail confirmée dans le parcours e-mail, lit les appartenances en filtrant sur l'identifiant Auth vérifié, puis exige exactement une appartenance et une organisation de type `client`. Seuls les rôles `owner`, `admin` et `member` sont autorisés.

Les rôles `viewer`, organisations `internal` ou `partner`, absences, doublons, rattachements supplémentaires, erreurs de lecture et incohérences sont refusés par défaut. Aucun identifiant d'organisation ni rôle fourni par le navigateur n'est pris en compte. Le résolveur n'utilise aucun client `service_role`.

Le modèle actuel ne permet toujours pas de gérer un statut suspendu ni une permission Prospection spécifique.

## Contrats et validation

- Le visiteur ne peut envoyer que `query` ; critères avancés, pagination et identifiants d'organisation sont rejetés.
- Le membre ne peut envoyer que les propriétés prévues dans les listes blanches ; pagination bornée à 50 pages et 10 résultats par page.
- Les dates, départements, codes APE/NAF, tranches d'effectif et rayons sont validés.
- Les DTO sont construits par projection positive ; les objets amont ne sont jamais propagés.
- Le DTO public n'inclut pas le SIRET ni les enrichissements de qualification.
- Les erreurs n'exposent aucun détail technique amont.

## Tests ajoutés

Commande depuis la racine :

```bash
node tests/prospection-contract.test.cjs
```

Couverture : validation des deux parcours, rejet des paramètres interdits, projection DTO, détection des champs de provenance, erreurs stables, rôles et organisations autorisés/refusés, identité confirmée, session invalide et refus fermé en cas d'erreur RLS.

## Fichiers

- `supabase/functions/_shared/prospection-contract.mjs`
- `supabase/functions/_shared/prospection-validation.mjs`
- `supabase/functions/_shared/prospection-authz.mjs`
- `supabase/functions/_shared/prospection-errors.mjs`
- `tests/prospection-contract.test.cjs`
- `docs/README.md`
- présent compte rendu

## Hors périmètre

Aucune fonction Edge existante, page frontend, moteur de recherche global d'accueil, migration SQL, table, fonction SQL, policy RLS, grant, secret, configuration hébergée ou déploiement n'a été modifié. Aucun endpoint n'est créé dans ce lot.

## Vérification et limites

Le code et les tests sont ajoutés au dépôt. L'environnement de cette intervention ne dispose pas d'un checkout local permettant d'exécuter Node, le build ou les tests. **Aucun résultat d'exécution n'est donc revendiqué.** Les tests devront être exécutés et la CI GitHub consultée avant le lot B.

Le résolveur s'appuie sur l'audit lecture seule du schéma et des policies daté du 8 novembre 2026 ; il devra être validé par des tests d'intégration authentifiés avant son utilisation par un endpoint.
