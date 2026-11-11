# Plan de réalisation et moyens — MajestiOS Evolution-9

Ce document transforme la vision stratégique en trajectoire de construction. Les lots décrivent des objectifs et des critères de passage ; ils ne signifient pas que les capacités sont déjà réalisées.

## 1. Principe de pilotage

Chaque lot doit répondre à cinq questions :
1. Quel problème utilisateur résout-il ?
2. Quelle capacité minimale faut-il livrer ?
3. Quelles dépendances techniques, réglementaires ou partenaires existent ?
4. Comment prouver que cela fonctionne ?
5. Quel indicateur dira si cela crée de la valeur ?

Ne pas lancer un lot dépendant d'une sécurité, d'un contrat API, d'un choix partenaire ou d'une migration qui n'a pas été vérifiée.

## 2. Trajectoire proposée

| Étape | Priorité | Contenu | Condition de passage |
|---|---|---|---|
| A. Assainir l'existant | Immédiate | Anomalies, CI, build, navigation, audit du site, documentation | Contrôles reproductibles et registre à jour |
| B. Stabiliser le socle | Critique | Parité Supabase, Auth OTP, multi-tenant, RLS, RPC, Storage, sauvegardes | Tests réels multi-rôles et inter-organisations |
| C. Valider les usages | Haute | Entretiens et tests avec 5 à 7 pilotes ; parcours artisan ; priorisation | Retours observés, tâches et besoins classés |
| D. Construire le CRM client minimal | Haute | Clients, contacts, tâches, rappels, devis, documents et activité selon priorité | Parcours métier complet, export, isolation et recette |
| E. Concevoir le noyau Facturation | Haute | Modèle de facture, lignes, taxes, statuts, règlements, avoirs, événements | Règles métier, tests et audit de conformité |
| F. Sélectionner et intégrer une PA | Conditionnelle | Étude comparative, contrats, sandbox, API, flux et coûts | Partenaire vérifié, test émission/réception/rejets |
| G. Construire Connect | Progressive | Connecteurs CRM externes et logiciels métier | Contrats par connecteur, reprise, idempotence, monitoring |
| H. Étendre Cheexpeer | Progressive | Chat, centre de commande, CRM, GitHub, missions, outils | Droits minimaux, quotas, traces, validations, tests |
| I. Développer le Réseau | Progressive | Partenaires et solutions référencés, statuts transparents | Vérification contractuelle et critères de qualité |
| J. Ouvrir progressivement | Conditionnelle | Pilote, support, tarification, onboarding et extension | Recette globale et indicateurs suivis |

## 3. Socle technique préalable

### Identité et organisations
- un utilisateur peut appartenir à plusieurs organisations ;
- le contexte d'organisation est explicite à chaque action ;
- rôles et permissions sont testés côté serveur ;
- aucune sélection arbitraire du premier tenant ;
- aucune clé privilégiée côté navigateur.

### Supabase
- comparer le projet cible du frontend et le projet de test : migrations, schémas, fonctions, politiques, extensions et données ;
- établir une matrice de parité et identifier les migrations divergentes ou rejouées ;
- définir un environnement de développement/test isolé ;
- prévoir un plan de sauvegarde et une procédure de restauration vérifiée ;
- ne pas lancer de migration distante avant revue SQL, test et plan de retour arrière.

### Données et CRM
- organisation obligatoire sur chaque donnée client ;
- contraintes relationnelles empêchant les liens inter-tenant ;
- identifiants SIREN/SIRET normalisés et provenance des données ;
- dédoublonnage explicable et historisé ;
- journaux d'activité atomiques ;
- exports structurés et réversibilité.

### Facturation et intégrations
- séparer le modèle métier du rendu PDF et du connecteur PA ;
- conserver les versions originales et les événements de transmission ;
- idempotence des envois et webhooks ;
- reprise des erreurs et file d'attente ;
- journal de statut, rejet, correction et rapprochement ;
- séparation des secrets par environnement et partenaire ;
- aucun flux réglementaire déclaré actif avant tests en sandbox puis recette contrôlée.

### Cheexpeer
- registre d'outils explicite ;
- chaque outil porte son périmètre, ses permissions, ses quotas et ses risques ;
- séparation des contextes utilisateur, organisation, admin, CRM et GitHub ;
- journal des missions, étapes, résultats, approbations et erreurs ;
- appels externes et écritures engageantes soumis à validation ;
- coût par mission mesuré et limites configurables ;
- capitalisation gouvernée : décisions et preuves, pas apprentissage autonome non contrôlé.

## 4. Méthode UX pour les petites entreprises

L'interface doit partir des tâches et non de l'organigramme technique.

Parcours cible :
1. retrouver ou créer un client ;
2. qualifier le besoin ;
3. créer un devis ;
4. planifier une intervention ;
5. produire une facture ;
6. transmettre via la PA configurée ;
7. suivre le statut et le règlement ;
8. retrouver l'historique et les pièces.

Chaque étape doit comporter des libellés simples, des aides contextuelles, des erreurs compréhensibles, une sauvegarde explicite et la possibilité de revenir en arrière. Le produit doit rester modulaire : l'utilisateur n'a pas à activer toutes les fonctions.

## 5. Gouvernance des partenaires

Avant d'annoncer un partenaire :
- vérifier l'identité et le statut officiel ;
- distinguer PA, solution compatible, logiciel métier et prestataire ;
- documenter les API, formats, flux et limites ;
- comparer coûts, support, SLA, réversibilité et conditions contractuelles ;
- faire un test technique et fonctionnel ;
- afficher le statut réel du lien avec MajestiOS.

## 6. Stratégie de tests

Chaque lot doit combiner selon son périmètre :
- tests unitaires et contrats ;
- vérification de syntaxe ;
- build complet depuis le manifeste ;
- vérification des liens et routes ;
- tests navigateur desktop et mobile ;
- tests de formulaires et parcours de recherche ;
- tests d'accès autorisés et refusés ;
- tests multi-tenant avec au moins deux organisations ;
- tests de reprise après erreur et d'idempotence pour les intégrations ;
- contrôle de non-régression des pages et fonctionnalités historiques.

Les tests réseau externes doivent être distingués des tests déterministes et disposer de conditions d'exécution explicites.

## 7. Indicateurs de pilotage

Suivre au minimum :
- anomalies ouvertes par priorité et âge ;
- taux de succès CI et nombre de tests non exécutés ;
- taux de pages/routes vérifiées ;
- parité des migrations et fonctions par environnement ;
- couverture des tests RLS par rôle et tenant ;
- temps d'onboarding pilote ;
- réussite des parcours client ;
- taux d'échec des transmissions et connecteurs ;
- coût IA moyen par mission ;
- retours utilisateurs et demandes d'assistance.

## 8. Décisions encore ouvertes

Ne pas inventer de réponse. Les décisions suivantes nécessitent une étude ou un arbitrage :
- périmètre exact du premier CRM client ;
- modèle économique et éventuelle gratuité du socle ;
- partenaire PA et coûts ;
- connecteurs CRM externes prioritaires ;
- durée et politique d'archivage des documents ;
- niveau d'autonomie de Cheexpeer par action ;
- choix de l'environnement Supabase de référence après audit de parité.

## 9. Règle de passage en production

Aucun lot n'est promu en production par simple achèvement du code. Il faut une revue de sécurité, une recette fonctionnelle, une preuve d'isolation des données, une stratégie de sauvegarde et de retour arrière, une validation des coûts et une autorisation explicite du responsable du projet.
