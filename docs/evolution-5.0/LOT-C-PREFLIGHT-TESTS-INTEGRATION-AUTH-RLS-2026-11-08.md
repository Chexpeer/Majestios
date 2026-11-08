# Lot C — prérequis des tests d’intégration Auth/RLS

Date : 8 novembre 2026  
Branche : `feature/crm-atomic-integration`  
Périmètre : préflight documentaire et lecture seule. Aucun changement Supabase distant.

## Objectif

Préparer des tests d’intégration reposant sur une véritable instance Supabase locale éphémère, avec Auth, Postgres et RLS réels. Aucun utilisateur de test ne doit être créé dans le projet de production `qxaghcifdhugfskuscoc`.

## État vérifié

- Le projet Supabase de production ne possède aucune branche de développement Supabase.
- Le dépôt ne contient pas encore `supabase/config.toml`.
- L’environnement d’exécution de cette session ne fournit ni Supabase CLI ni runtime Docker ; les tests locaux ne peuvent donc pas être lancés ici.
- Le registre Supabase de production contient 21 migrations.
- Le dépôt contient 21 fichiers de migration ; les 12 migrations historiques restaurées sous leurs noms conceptuels ont des préfixes de version différents de ceux du registre distant. Les neuf migrations restaurées plus récemment ont été vérifiées séparément dans le lot de restauration.
- Le point précédent impose de vérifier la reconstruction locale et la parité du schéma avant d’interpréter un test local comme une preuve de parité avec la production.
- L’endpoint `prospection-search-member` demeure uniquement dans Git et n’est pas déployé.

## Contrôle des tests déjà existants

Les tests Node actuels vérifient les règles pures d’habilitation et simulent les appels Supabase. Ils couvrent notamment les rôles autorisés, le refus de `viewer`, les organisations `internal` et `partner`, l’identité utilisateur, l’e-mail confirmé et une erreur de lecture des memberships.

Ils ne prouvent pas encore :
- qu’un vrai JWT Supabase est accepté ou refusé par Auth ;
- que les politiques RLS réelles filtrent les memberships et organisations ;
- le comportement avec plusieurs appartenances client réelles ;
- le refus d’un e-mail non confirmé dans une vraie session ;
- le fail-closed sur une erreur de lecture réelle de la table `organizations` ;
- le comportement HTTP de l’endpoint exécuté dans le runtime Edge local.

## Plan d’exécution isolé

1. Ajouter une configuration Supabase locale minimale et versionnée, sans URL de projet distant ni secret de production.
2. Installer une version CLI explicitement épinglée dans un job GitHub Actions dédié.
3. Démarrer la stack locale éphémère sur le runner ; ne pas exécuter de commande avec `--linked`, `--remote` ou une référence de projet hébergé.
4. Rejouer les migrations Git uniquement dans la base locale vierge et arrêter le lot si une migration échoue.
5. Vérifier les objets et politiques Auth/RLS reconstruits avant les tests.
6. Créer les utilisateurs et organisations de test exclusivement dans cette instance locale, puis supprimer les données en arrêtant le runner éphémère.
7. Obtenir de vraies sessions via Auth local et appeler le résolveur d’habilitation avec un client utilisateur portant le JWT.
8. Tester les rôles `owner`, `admin`, `member`, `viewer`, les types d’organisation, les appartenances absentes/multiples, les e-mails confirmés/non confirmés, les tokens invalides/expirés et les erreurs RLS.
9. Tester le contrat DTO et les limites HTTP avec des réponses fournisseurs simulées ; aucun appel aux API de production ne doit être nécessaire.
10. Publier un rapport séparant clairement les tests exécutés, les tests non exécutés et les écarts éventuels entre le schéma local reconstruit et le schéma hébergé.

## Garde-fous

- Aucun lien de projet distant ne doit être configuré dans le job.
- Aucun secret de production, clé `service_role` distante ou JWT utilisateur réel ne doit être utilisé.
- Les clés privilégiées éventuelles sont celles générées automatiquement par la stack locale et restent limitées au runner.
- Aucun déploiement Edge Function, migration distante, modification RLS/Auth/grant, changement de secret ou raccordement frontend.
- Le test local ne sera pas présenté comme preuve de parité de production tant que les différences de versions de migrations et le schéma n’auront pas été réconciliés.
- Si le replay des migrations échoue ou révèle un schéma incomplet, suspendre les tests Auth/RLS et corriger d’abord la reproductibilité documentaire, sans toucher au projet hébergé.

## Décision de ce préflight

La voie technique retenue est une stack Supabase locale éphémère exécutée dans GitHub Actions. La mise en œuvre du workflow et des tests d’intégration reste la prochaine sous-étape ; aucun test Auth/RLS réel n’est déclaré passé à ce stade.
