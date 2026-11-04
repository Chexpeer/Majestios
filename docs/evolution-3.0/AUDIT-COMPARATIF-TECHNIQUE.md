# MajestiOS 3.0 — Audit comparatif des choix techniques

**Version :** 0.1  
**Date :** 3 novembre 2026  
**Branche :** `evolution-3.0`  
**Statut :** recommandation d'architecture soumise à validation — aucune technologie n'est définitivement choisie et rien n'est implémenté par ce document.

## 1. Objet et méthode

Ce dossier compare les options techniques nécessaires pour faire évoluer le prototype statique MajestiOS vers une plateforme avec API, persistance, authentification, CRM interne, espaces clients cloisonnés et flux métier traçables.

La comparaison part de l'existant observé dans le dépôt et de l'architecture cible de `ARCHITECTURE-API-CIBLE.md`. Elle distingue :
- **constat** : capacité ou contrainte observée dans le dépôt ;
- **recommandation** : option qui paraît la plus proportionnée ;
- **arbitrage** : décision qui appartient au porteur du projet ;
- **condition préalable** : vérification nécessaire avant implémentation.

Les fonctionnalités de l'architecture cible ne sont pas réputées opérationnelles parce qu'elles sont décrites ici.

## 2. État de départ et contraintes

L'application actuelle est un site statique HTML/CSS/JavaScript, construit par Node.js et publié par Vercel. Le dépôt ne contient pas de `package.json` à sa racine. Le README décrit un build via `node build.js`, des contrôles Node et des tests Playwright. L'audit 2.0 indique l'absence de serveur applicatif, base de données, authentification et persistance.

Conséquences :
1. Il n'y a pas de backend existant à migrer ; il faut créer un socle sans casser le site.
2. Le frontend actuel peut être conservé pendant la première phase.
3. Les appels aux fournisseurs externes doivent progressivement quitter le navigateur.
4. Le CRM interne et les espaces clients exigent des frontières de sécurité avant l'ouverture à des données réelles.
5. Le prototype et ses parcours doivent rester utilisables pendant la construction du backend.

## 3. Principes d'architecture recommandés

### 3.1 Monolithe modulaire, pas microservices au départ

Recommandation : un backend applicatif unique, organisé en modules métier séparés et exposant une API versionnée. Les modules doivent avoir des responsabilités, contrats et règles d'accès explicites. Les modules peuvent être extraits ultérieurement si un besoin mesuré le justifie.

Avantages : déploiement et diagnostic plus simples, transactions cohérentes, coût opérationnel initial limité, moins de réseau interne et moins de duplication de sécurité.

Risques à maîtriser : couplage entre modules, migrations de schéma coordonnées, déploiement commun. Les frontières de modules, dépendances autorisées et tests de contrat doivent être documentés dès le départ.

Les microservices sont écartés pour la première version : ils ajouteraient orchestration, observabilité distribuée, gestion des pannes et coûts avant que les volumes et les frontières opérationnelles soient connus.

### 3.2 API comme frontière de confiance

Le navigateur ne doit pas détenir de secret fournisseur ni décider seul des droits d'accès, de la finalité d'un traitement ou de l'autorisation d'une transmission. Les appels BOAMP, BODACC et Recherche d'Entreprises passent par des adaptateurs côté serveur. Les contrats API sont versionnés et validés côté serveur.

### 3.3 Séparation des périmètres

Le CRM interne MajestiOS n'est pas une vue client. Chaque espace client est isolé des autres espaces et du CRM interne. Le corpus documentaire reste indépendant. Aucun transfert entre Publication, Veille, CRM et Prospection n'est implicite. Chaque transfert conserve sa provenance, sa finalité, son autorisation, sa destination, son statut et son résultat.

## 4. Comparaison des options

| Domaine | Option A | Option B | Option C | Lecture pour MajestiOS |
|---|---|---|---|---|
| Backend | Vercel Functions Node.js/TypeScript | Serveur Node dédié (conteneur/VM) | Backend managé externe | A proportionnée au site déjà hébergé sur Vercel ; B si besoin durable/long-running ; C si contraintes d'hébergement spécifiques |
| Base relationnelle | Supabase PostgreSQL | PostgreSQL managé (ex. Neon) | PostgreSQL auto-hébergé | PostgreSQL adapté aux relations CRM ; A réduit le travail initial ; B dissocie davantage les fournisseurs ; C augmente l'exploitation |
| Authentification | Supabase Auth | Fournisseur spécialisé (Clerk/Auth0/équivalent) | Auth développée en interne | A intégrée au choix Supabase ; B si exigences IAM avancées ; C déconseillée |
| Isolation clients | PostgreSQL RLS + contrôles API | Isolation logique par schéma/base | Contrôles applicatifs seuls | RLS + contrôles serveur comme défense en profondeur ; le cloisonnement doit être testé négativement |
| Fichiers | Supabase Storage | Vercel Blob ou stockage objet compatible S3 | Stockage auto-hébergé | À comparer selon droits, taille, rétention, coûts et portabilité |
| Tâches asynchrones | Outbox PostgreSQL + worker planifié | Vercel Queues / Workflow | Broker dédié | Commencer simple ; adopter une file externe lorsque les besoins de reprise, débit ou fan-out sont démontrés |
| Cache | Cache applicatif contrôlé | Redis managé | Aucun cache initial | Aucun cache pour les données sensibles sans politique d'invalidation ; cache ciblé pour sources publiques si conditions autorisées |
| Observabilité | Logs plateforme + journal métier en base | Outil APM externe | Stack auto-hébergée | Logs techniques et journal d'audit métier doivent être distincts |
| Déploiement | Vercel | Plateforme de conteneurs | Infrastructure dédiée | Réutiliser Vercel au départ, sous réserve de vérifier limites, régions, durée et coûts des fonctions |

Les produits cités sont des candidats, pas des décisions contractuelles. Les fonctionnalités, limites, régions, tarifs, conditions et intégrations doivent être vérifiés au moment de l'arbitrage.

## 5. Recommandation de référence à approfondir

La piste la plus proportionnée à ce stade est :

- frontend existant conservé et migré progressivement ;
- API serveur Node.js/TypeScript sur Vercel Functions ;
- PostgreSQL managé, avec Supabase comme candidat prioritaire ;
- Supabase Auth comme candidat pour l'identité ;
- politiques PostgreSQL RLS complétées par une autorisation métier côté serveur ;
- stockage objet à sélectionner après définition des documents et des règles de conservation ;
- outbox transactionnelle en PostgreSQL pour fiabiliser les événements au démarrage ;
- adaptateurs de sources côté serveur ;
- monolithe modulaire avec API REST versionnée.

Cette recommandation n'est pas une validation de Supabase ou Vercel comme fournisseurs définitifs. Une preuve de concept de sécurité et une comparaison des coûts/limites sont requises avant engagement.

## 6. Analyse des risques et garde-fous

### 6.1 Cloisonnement multi-tenant — risque critique

Risque : une erreur d'autorisation permettrait à un client de lire ou modifier les données d'un autre client, ou d'accéder au CRM interne.

Garde-fous obligatoires :
- identité et rôle vérifiés côté serveur sur chaque opération ;
- tenant déterminé à partir d'un contexte authentifié et contrôlé, jamais accepté aveuglément depuis le navigateur ;
- RLS activée sur toutes les tables exposées ;
- politiques spécifiques par opération et par relation ;
- tests négatifs avec deux clients distincts, un utilisateur non authentifié et un opérateur interne ;
- contrôle des vues, fonctions SQL, tâches asynchrones et exports ;
- aucune clé privilégiée dans le frontend ;
- audit des accès et transferts sensibles.

Une politique RLS ne remplace pas l'autorisation métier. Un rôle authentifié ne doit jamais suffire à donner accès à toutes les lignes.

### 6.2 CRM interne

Le CRM interne doit être protégé par un périmètre d'autorisation distinct. Ne pas représenter le CRM comme un simple tenant parmi les tenants clients sans modèle d'accès explicite. Les comptes opérateurs, administrateurs et clients doivent avoir des rôles et permissions distincts, avec séparation des tâches lorsque nécessaire.

### 6.3 Sources externes et données

Avant automatisation : vérifier conditions d'utilisation, quotas, fréquence permise, attribution, droits de réutilisation, données personnelles, conservation et mécanismes de suppression. Conserver les identifiants source et la date de collecte. Définir une politique de cache par source. Une panne de fournisseur doit être explicite et ne doit jamais fabriquer des résultats.

### 6.4 Événements et transmissions

L'outbox transactionnelle est recommandée pour éviter qu'une modification métier soit enregistrée sans son événement associé. Les consommateurs doivent être idempotents, avec identifiant d'événement, tentatives, état d'échec et procédure de reprise. Un événement technique ne constitue pas une autorisation juridique ou métier de transmettre des données.

### 6.5 Secrets et chaîne logicielle

Secrets uniquement dans les variables d'environnement serveur et les gestionnaires adaptés. Aucun secret privé dans le dépôt ou le bundle navigateur. Dépendances épinglées, lockfile versionné, mises à jour contrôlées, vérification des workflows CI et permissions minimales des jetons.

### 6.6 Sauvegardes et continuité

Définir RPO/RTO attendus, fréquence de sauvegarde, rétention, chiffrement, accès, restauration testée et export de réversibilité. Une sauvegarde non restaurée lors d'un exercice n'est pas une garantie suffisante.

## 7. Questions de coût, d'exploitation et de réversibilité

Avant de choisir les fournisseurs, établir trois scénarios : prototype fermé, lancement avec premiers clients, montée en charge. Pour chacun, estimer :
- nombre d'utilisateurs internes et clients actifs ;
- volume de sociétés, établissements, contacts, annonces et signaux ;
- fréquence des collectes et appels externes ;
- taille et nombre de documents ;
- appels API, exécutions serveur, stockage, transfert réseau et sauvegardes ;
- coût de supervision, support et temps d'exploitation.

Prévoir la portabilité : schéma PostgreSQL versionné en migrations SQL, exports réguliers, fichiers dans un stockage exportable, adaptateurs fournisseurs isolés et contrats API indépendants du fournisseur. Évaluer les coûts de sortie et les dépendances spécifiques avant signature.

Aucun tarif n'est estimé ici : les volumes, régions et plans n'ont pas été fixés et les prix peuvent évoluer.

## 8. Décisions à obtenir du porteur du projet

Les décisions suivantes sont ouvertes :

1. Confirmer ou non le principe du monolithe modulaire.
2. Confirmer Vercel Functions comme cible backend initiale, ou demander une comparaison avec un serveur Node indépendant.
3. Retenir Supabase comme candidat de preuve de concept, ou comparer formellement avec Neon + fournisseur d'identité séparé.
4. Définir les rôles opérateurs, administrateurs, clients, contributeurs et modérateurs.
5. Définir le niveau d'isolation des données client : tenant logique, schémas séparés ou bases séparées.
6. Définir les volumes et le budget cible pour établir le coût total.
7. Définir RPO/RTO, rétention, suppression et exigences de résidence des données.
8. Définir les besoins réels de stockage documentaire et de tâches asynchrones.

**Aucune de ces décisions n'est présumée validée par l'ajout de ce document.**

## 9. Séquence de preuve de concept proposée

Après validation des choix :
1. Créer un environnement isolé de développement, sans données réelles.
2. Mettre en place un endpoint de santé et une API minimale.
3. Créer un modèle minimal tenant/utilisateur avec rôles provisoires validés.
4. Démontrer les tests d'isolation : client A ne lit ni ne modifie client B ; client ne lit pas le CRM interne ; utilisateur non authentifié n'accède pas aux ressources protégées.
5. Tester les migrations, sauvegardes et restauration.
6. Mesurer latence, coûts et logs.
7. Faire une revue de sécurité avant d'intégrer des données réelles.
8. Décider ensuite du lot suivant.

Critère de sortie : preuve documentée, tests reproductibles et arbitrage explicite. Pas de déploiement de production.

## 10. Références techniques à vérifier avant implémentation

- Vercel Functions : https://vercel.com/docs/functions
- Vercel Queues : https://vercel.com/docs/queues
- Vercel Workflows : https://vercel.com/docs/workflows
- Supabase Auth : https://supabase.com/docs/guides/auth
- Supabase Row Level Security : https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase sécurité API : https://supabase.com/docs/guides/api/securing-your-api
- Supabase intégration Vercel : https://supabase.com/docs/guides/integrations/vercel-marketplace

Les documentations et limites doivent être reconsultées au moment de la mise en œuvre, car les produits évoluent.

## 11. État de réalisation

- Audit comparatif documentaire : rédigé.
- Recommandation : monolithe modulaire, API serveur, PostgreSQL managé ; Vercel Functions et Supabase sont les candidats privilégiés.
- Validation par le porteur : en attente.
- Backend, base, authentification et stockage : non implémentés.
- Tests de preuve de concept : non exécutés.
- Déploiement ou modification de production : aucun.
