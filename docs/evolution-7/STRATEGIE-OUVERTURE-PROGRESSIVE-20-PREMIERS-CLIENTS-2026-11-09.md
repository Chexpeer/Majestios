# Stratégie d'ouverture progressive — MajestiOS

**Version :** 1.0 — 9 novembre 2026  
**Branche :** `Evolution-7`  
**Statut :** décision fonctionnelle validée pour cadrer la phase de lancement ; modalités techniques à implémenter et tester.

## 1. Décision de lancement

MajestiOS ne doit pas devenir une citadelle imprenable. Pendant la phase pilote, les premiers clients doivent pouvoir découvrir, parcourir, tester et évaluer les différentes rubriques et les fonctionnalités disponibles, sans être enfermés dans un parcours trop étroit ni bloqués par des cloisonnements fonctionnels prématurés.

**Seuil de réévaluation : les 20 premiers clients.** Jusqu'à ce seuil, la règle est l'ouverture fonctionnelle par défaut. Une fois ce premier groupe atteint, la stratégie pourra être réexaminée à partir des usages, des retours, des coûts, des incidents et des besoins réels. Le seuil de 20 est un point de réévaluation, pas une fermeture automatique ni une promesse de changement.

Pour le suivi initial, le compteur porte provisoirement sur les comptes clients distincts (et non sur le nombre de rubriques consultées ou de sessions). Cette convention devra être confirmée au moment de l'instrumentation.

## 2. Ce qui doit être ouvert pendant la phase pilote

Pour les comptes clients actifs de la cohorte initiale :

- accès de navigation à toutes les rubriques métier ouvertes au test ;
- passage libre d'une rubrique à l'autre, sans devoir créer un compte distinct ni demander une habilitation à chaque changement ;
- accès aux parcours de découverte et aux outils d'évaluation disponibles ;
- possibilité de tester les fonctions sur ses propres informations et, lorsque cela est utile, sur des données de démonstration clairement identifiées ;
- possibilité de revenir d'une rubrique à l'autre sans perdre inutilement le contexte de navigation ;
- remontée simple des observations, difficultés, erreurs et suggestions ;
- activation progressive des fonctionnalités en fonction de leur état réel, sans afficher comme opérationnel ce qui ne l'est pas.

L'objectif est de tester le produit dans son ensemble, pas seulement une rubrique isolée.

## 3. Ouverture fonctionnelle ≠ accès universel aux données

La liberté de circulation concerne d'abord les **rubriques et les fonctionnalités**. Elle ne donne pas à un client le droit de consulter les données privées d'un autre client, les conversations confidentielles de l'administrateur ou les opérations réservées à l'administration.

Les frontières minimales suivantes restent en place :

- chaque client consulte et modifie ses propres données et celles auxquelles son organisation a légitimement accès ;
- les données privées d'une autre organisation restent inaccessibles ;
- le CRM interne MajestiOS est prioritaire et doit être éprouvé par l'administrateur avant toute promotion d'un CRM client ;
- le CRM destiné aux organisations clientes n'est pas un prérequis à l'ouverture pilote générale : son lancement intervient dans une phase ultérieure, après maîtrise de l'outil interne et validation de ses usages ; sa première version est minimale, modulaire et limitée aux besoins réellement identifiés ;
- lorsqu'un module CRM client sera ouvert, ses utilisateurs autorisés agiront uniquement dans les données de leur propre organisation ; les droits techniques tenant-scoped ne valent pas activation automatique du produit CRM client ;
- l'accès VIP / Administration reste distinct et réservé aux personnes habilitées ;
- le centre de commande privé de Cheexpeer, ses captures, archives et échanges administrateur ne sont jamais inclus dans l'ouverture pilote ;
- les secrets, identifiants techniques et configurations d'exploitation ne sont jamais exposés dans l'interface client.

Il faut donc éviter de confondre **cloisonnement des données** et **cloisonnement des rubriques**. Le premier protège les clients ; le second ne doit pas empêcher prématurément l'évaluation du produit.

## 4. Authentification et création de compte

La sécurité doit être concentrée au bon endroit : l'identification et la création du compte, puis la protection des données auxquelles ce compte accède.

Le parcours de création de compte doit notamment prévoir, selon le niveau de risque et les obligations applicables :

- vérification de l'adresse électronique et authentification adaptée ;
- information claire sur les conditions d'utilisation et la confidentialité ;
- collecte limitée aux informations réellement nécessaires ;
- prévention raisonnable des inscriptions abusives et des prises de contrôle de compte ;
- création fiable du profil et rattachement au bon espace client ;
- possibilité de récupérer l'accès et de fermer le compte selon un parcours explicite.

Une fois le compte créé et son espace établi, l'utilisateur ne doit pas subir de demandes répétées d'autorisation pour simplement explorer les rubriques. Les actions sensibles — accès administratif, partage externe, campagne de prospection, dépense, suppression importante ou modification des droits — conservent une validation adaptée.

## 5. Règles de conception des droits

Les droits doivent être organisés en trois dimensions distinctes :

1. **Accès aux rubriques :** largement ouvert à la cohorte pilote.
2. **Capacités fonctionnelles :** activées selon l'état du service ; les opérations d'essai doivent être possibles dans un périmètre maîtrisé.
3. **Accès aux données et actions privilégiées :** limité par utilisateur, organisation et rôle.

Un refus d'accès doit être réservé à une véritable raison : donnée appartenant à un tiers, action administrative, fonction non activée, risque concret ou obligation applicable. Un simple changement de rubrique ne doit pas provoquer un refus d'autorisation.

Les profils ne doivent pas être multipliés artificiellement pour reproduire chaque rubrique. Un même compte client doit pouvoir tester plusieurs domaines métier.

## 6. Après les 20 premiers clients

À l'atteinte du seuil, organiser une revue avant toute restriction nouvelle :

- rubriques réellement utilisées et parcours les plus fréquents ;
- fonctions qui apportent une valeur démontrée ;
- demandes d'accès et blocages rencontrés ;
- retours des clients et difficultés d'appropriation ;
- charge opérationnelle, coûts de collecte et d'IA ;
- incidents, erreurs et besoins de confidentialité ;
- différences pertinentes entre catégories de clients.

La revue pourra conduire à conserver l'ouverture, à simplifier certains parcours, à introduire des niveaux de service ou à restreindre certaines fonctions coûteuses ou sensibles. Aucune restriction générale ne doit être décidée sur le seul fait que le seuil de 20 est atteint.

## 7. Critères de recette de la phase pilote

- Un compte client pilote peut ouvrir chaque rubrique métier déclarée disponible.
- Il peut passer d'une rubrique à l'autre sans nouvelle habilitation ni reconnexion injustifiée.
- Les fonctions disponibles sont testables dans son propre espace ou dans un environnement de démonstration clairement signalé.
- Un client ne peut pas consulter les données privées d'une autre organisation en changeant d'URL, d'identifiant ou de rubrique.
- L'accès VIP / Administration et le centre de commande privé restent inaccessibles aux comptes clients ordinaires.
- Les fonctions non disponibles sont indiquées honnêtement ; aucun bouton ne simule une action réussie.
- Les retours et anomalies de la cohorte pilote peuvent être enregistrés et suivis.
- Le nombre de comptes clients pilotes est mesurable afin de déclencher la revue au seuil de 20.

## 8. Conséquences pour l'audit et la feuille de route

Les contrôles de sécurité ne doivent plus être traités comme un blocage global indifférencié. Chaque anomalie doit être reliée à la fonction qu'elle affecte et classée selon son impact réel :

- **bloquante pour la création de compte** ;
- **bloquante pour une fonction sensible précise** ;
- **bloquante pour l'accès aux données d'un tiers** ;
- **à corriger avant montée en charge** ;
- **amélioration ou durcissement ultérieur**.

Les défauts de cloisonnement entre organisations, les accès au cockpit VIP et les fuites de données restent prioritaires. En revanche, une règle trop restrictive qui empêche un client de naviguer entre deux rubriques sans protéger de donnée ni prévenir de risque concret doit être simplifiée.

Cette stratégie guide la conception fonctionnelle de MajestiOS et l'audit de la branche `Evolution-7`. Elle ne vaut pas autorisation de déployer des changements distants ni de désactiver indistinctement les politiques de sécurité existantes.

## 9. Premier constat sur le code Evolution-7

Le contrôle ciblé effectué après la décision montre déjà une distinction importante :

- `navigation-tiroirs.js` construit les rubriques et leurs sous-menus sans filtrage par rôle : la navigation générale n'est donc pas, à ce stade, le principal verrou identifié.
- `espace-interne.js` vérifie l'appartenance à l'organisation interne MajestiOS et distingue l'espace client de l'espace collaborateurs. Cette séparation ne doit pas être supprimée pour ouvrir les rubriques métier.
- `crm-client.js` réserve le CRM interne à `owner/admin`. Cette règle concerne le poste CRM interne ; elle ne doit pas être confondue avec l'accès d'un client pilote à ses propres services.
- `administration.js` réserve le cockpit à `owner/admin`. Cette frontière VIP reste volontairement intacte.

**Conséquence :** ne pas supprimer ces contrôles par réflexe. La prochaine vérification fonctionnelle doit porter sur les parcours réellement proposés aux comptes clients, les éventuels contrôles de rôle propres à chaque page ou API et l'existence d'un espace de test client. Les assouplissements doivent porter sur les restrictions de navigation et d'usage qui bloquent sans raison les tests, pas sur la séparation des espaces internes, les données des autres organisations ou le cockpit privé.

Aucune règle RLS, migration Supabase, authentification, permission distante ni code d'accès n'a été modifié par la création de cette stratégie documentaire.
