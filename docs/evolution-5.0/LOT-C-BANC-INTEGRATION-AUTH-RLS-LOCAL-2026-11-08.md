# Lot C — banc d’intégration Auth/RLS local

Date : 8 novembre 2026  
Branche : `feature/crm-atomic-integration`  
Périmètre : configuration et tests d’intégration sur stack Supabase locale éphémère. Aucun accès au projet hébergé.

## Livrables ajoutés

- `supabase/config.toml` : configuration locale isolée, projet local `majestios-local-auth-ci`, PostgreSQL 17, Auth activé, confirmations e-mail désactivées uniquement pour pouvoir créer des cas de test contrôlés. Aucun `project_id` hébergé, URL distante ou secret de production.
- `tests/prospection-authz.integration.mjs` : tests d’intégration utilisant `@supabase/supabase-js@2.119.0`, de vrais utilisateurs Auth locaux, de vraies sessions JWT et des lectures PostgREST soumises aux politiques RLS.
- `.github/workflows/prospection-auth-integration.yml` : workflow GitHub Actions séparé, CLI Supabase épinglée en version 2.122.1, démarrage de la stack locale, replay des migrations avec `supabase db reset --local`, exécution des tests et arrêt avec suppression des volumes.

## Scénarios exercés par le banc

- Sessions réelles avec rôles `owner`, `admin` et `member` : autorisées.
- Rôle `viewer` : refusé.
- Organisations `internal` et `partner` : refusées.
- Utilisateur sans appartenance : refusé.
- Utilisateur avec deux appartenances client : refusé.
- E-mail non confirmé : refusé par le résolveur.
- JWT altéré : refusé par Auth.
- Lecture effective des memberships et organisations sous JWT utilisateur : vérification des lignes visibles par RLS.
- Tentative d’envoyer `organization_id` ou `role` dans la requête navigateur : rejetée par le validateur.
- Les fixtures sont créées exclusivement avec la clé service_role générée par la stack locale ; les décisions d’accès sont vérifiées avec la clé anon locale et le JWT de chaque utilisateur.

## Isolation et sécurité

- Le workflow ne contient aucun secret GitHub et ne reçoit aucune variable du projet hébergé.
- Aucun `supabase link`, `--remote`, `--linked`, URL de base distante ou projet de production n’est configuré.
- Le replay des migrations s’effectue explicitement avec `--local`.
- Les comptes, organisations et appartenances sont créés dans le conteneur local éphémère, puis détruits par `supabase stop --no-backup`.
- Aucun appel à une API fournisseur de données n’est nécessaire.
- Aucun déploiement Edge Function, migration distante, changement Auth/RLS/grant/secrets ou raccordement frontend.

## Limites de couverture à ce stade

- Le test d’un JWT altéré est exécuté ; un JWT correctement signé mais expiré n’est pas encore fabriqué dans le banc, car le runtime local peut utiliser des clés de signature asymétriques. Ne pas confondre ces deux cas.
- Les tests RLS couvrent les lectures autorisées et la visibilité cloisonnée. Ils ne simulent pas une panne réseau PostgREST ou une erreur serveur forcée pendant la lecture de `organizations` ; le fail-closed sur erreur reste couvert par les tests unitaires simulés du résolveur.
- L’endpoint Edge `prospection-search-member` n’est pas démarré dans ce workflow. Le test porte sur son résolveur d’habilitation partagé avec Auth réel et RLS réel, pas sur l’intégralité du cycle HTTP Edge.
- Les quotas, rate limiting partagé, recherche amont, pagination avec fournisseur réel et appels réseau externes ne sont pas testés ici.
- Les 12 migrations historiques conservent des préfixes de version différents du registre distant. Le replay local vérifiera que les fichiers Git sont reconstructibles, mais ne prouvera pas à lui seul la parité exacte des identifiants de migrations hébergées.

## Statut d’exécution

Le workflow est versionné et sera déclenché par les changements ciblés sur la branche et les pull requests. Son résultat doit être consulté dans GitHub Actions avant de déclarer les tests réussis. Tant qu’un run complet n’est pas terminé avec succès, ce document décrit le banc et ses assertions, pas une validation exécutée.

## Prochaine étape

Consulter le premier run GitHub Actions, corriger tout échec de replay ou de test dans un lot dédié, puis compléter séparément les tests JWT expiré et runtime HTTP Edge. Aucune modification de production n’est autorisée par ce lot.
