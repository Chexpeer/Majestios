# Stratégie d'ouverture progressive — premier cercle de 5 à 7 personnes

**Version :** 1.0 — 9 novembre 2026  
**Branche :** `Evolution-7`  
**Statut :** décision fonctionnelle validée pour cadrer la phase de lancement ; modalités techniques à implémenter et tester.

## 1. Décision de lancement

MajestiOS ne doit pas devenir une citadelle imprenable. La première phase est un **cercle de mise au point de 5, 6 ou 7 personnes de confiance** — amis, collègues et investisseurs — et non une cohorte de clients recrutés ni un lancement commercial. Ces participants doivent pouvoir découvrir, parcourir et tester largement les rubriques et fonctionnalités disponibles, afin de contribuer à poser les bases d'un outil efficace et de donner des avis concrets.

**Repère de constitution du premier cercle : 5, 6 ou 7 personnes**, sans obligation d'atteindre un nombre précis. Leur rôle est de tester l'outil, aider à en établir les bases et formuler des retours ; leur participation ne leur confère pas automatiquement le statut de client, d'investisseur au capital ou d'administrateur. Il n'existe aucun seuil commercial ou mécanisme de fermeture lié à ce groupe. La suite dépendra de la qualité des retours, de la maturité du produit, des usages, des coûts, des incidents et des besoins constatés.

## 2. Ce qui doit être ouvert pendant la phase pilote

Pour les participants identifiés du premier cercle :

- accès de navigation à toutes les rubriques métier ouvertes au test ;
- passage libre d'une rubrique à l'autre, sans devoir créer un compte distinct ni demander une habilitation à chaque changement ;
- accès aux parcours de découverte et aux outils d'évaluation disponibles ;
- possibilité de tester les fonctions sur ses propres informations et, lorsque cela est utile, sur des données de démonstration clairement identifiées ;
- possibilité de revenir d'une rubrique à l'autre sans perdre inutilement le contexte de navigation ;
- remontée simple des observations, difficultés, erreurs et suggestions ;
- activation progressive des fonctionnalités en fonction de leur état réel, sans afficher comme opérationnel ce qui ne l'est pas.

L'objectif est de tester le produit dans son ensemble, pas seulement une rubrique isolée.

## 3. Ouverture fonctionnelle ≠ accès universel aux données

La liberté de circulation et l'ouverture initiale des droits concernent d'abord les **rubriques et les capacités de test**. Elles ne donnent pas accès aux données privées d'autres organisations, aux conversations confidentielles de l'administrateur, aux secrets techniques ni aux opérations d'administration qui doivent rester protégées.

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

## 5. Règles de conception et d'évolution des droits

Au démarrage, l'attribution des droits aux 5 à 7 participants de confiance doit être **ouverte et suffisamment large** pour qu'ils puissent tester l'ensemble des parcours et fonctions disponibles, sans habilitations répétitives à chaque changement de rubrique. Il s'agit d'une ouverture volontaire, organisée et réversible pour le cercle initial — pas d'une ouverture publique ni d'un accès universel à toutes les données.

Cette ouverture sera ensuite **réduite et affinée progressivement**, à partir des retours, des rôles réellement tenus, des besoins constatés et de la préparation à une ouverture plus large. Les droits deviendront alors différenciés selon les profils et les responsabilités, en évitant les privilèges inutiles.

Dès le départ, les garde-fous suivants restent non négociables :

- un compte nominatif par personne ; aucun partage d'identifiants ;
- cloisonnement des données entre organisations et espaces privés ;
- accès VIP / Administration et secrets techniques réservés aux personnes expressément habilitées ;
- actions sensibles ou irréversibles soumises à une validation adaptée ;
- droits traçables, révocables et révisables individuellement.

Un simple changement de rubrique ne doit pas provoquer un refus d'autorisation. Les restrictions doivent correspondre à une frontière réelle de données, à une action sensible, à un risque concret ou à une obligation applicable.

## 6. Révision des droits après le premier cercle

À l'issue des premiers tests, organiser une revue avant d'ouvrir plus largement MajestiOS :

- rubriques réellement utilisées et parcours les plus fréquents ;
- fonctions qui apportent une valeur démontrée ;
- demandes d'accès et blocages rencontrés ;
- retours des participants et difficultés d'appropriation ;
- charge opérationnelle, coûts de collecte et d'IA ;
- incidents, erreurs et besoins de confidentialité ;
- différences pertinentes entre catégories de clients.

La revue devra notamment décider quels droits conserver, réduire ou séparer, quelles fonctions nécessitent des profils distincts et quels points doivent être corrigés avant une ouverture plus large. La réduction des droits sera progressive, motivée et vérifiée ; elle ne doit pas empêcher les personnes de confiance de contribuer utilement à la phase de mise au point.

## 7. Critères de recette de la phase pilote

- Chaque participant du premier cercle peut ouvrir les rubriques métier déclarées disponibles pour le test.
- Il peut passer d'une rubrique à l'autre sans nouvelle habilitation ni reconnexion injustifiée.
- Les fonctions disponibles sont testables dans son propre espace ou dans un environnement de démonstration clairement signalé.
- Un client ne peut pas consulter les données privées d'une autre organisation en changeant d'URL, d'identifiant ou de rubrique.
- L'accès VIP / Administration et le centre de commande privé restent inaccessibles aux comptes clients ordinaires.
- Les fonctions non disponibles sont indiquées honnêtement ; aucun bouton ne simule une action réussie.
- Les retours et anomalies du premier cercle peuvent être enregistrés et suivis.
- Les droits accordés à chaque participant sont identifiables, traçables et révocables.
- La revue de fin de phase peut conduire à une réduction ou une différenciation des droits avant l'ouverture élargie.

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

Aucune règle RLS, migration Supabase, authentification, permission distante ni code d'accès n'a été modifié par cette mise à jour documentaire. L'ouverture initiale des droits reste une décision de conception à implémenter et à tester ; elle ne constitue pas une autorisation de supprimer les frontières de sécurité.
