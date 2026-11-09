# Architecture d'exécution de Cheexpeer — du besoin au résultat

**Mise à jour :** 9 novembre 2026, 21:50 Europe/Paris  
**État de recette Supabase :** MajestiOS-Test (Frankfurt)  
**Branche :** Evolution-7

## 13.7 Résultat de préparation — état distant vérifié

Cette section actualise les constats historiques des sections 13.1 à 13.6. Les sections précédentes décrivent l'inventaire initial ; elles ne représentent plus l'état actuel de MajestiOS-Test.

### Socle installé

- Les 32 migrations de fondation MajestiOS/CRM/Cheexpeer présentes dans Evolution-7 ont été appliquées dans l'ordre sur MajestiOS-Test.
- Trois migrations complémentaires ont ensuite été appliquées : refus explicite des rôles navigateur et index des clés étrangères Cheexpeer ; activation de PGMQ et création de la file ; droits PGMQ réservés au serveur.
- La base distante enregistre donc 35 migrations correspondant à cette préparation.
- public contient les 15 tables du modèle CRM et référentiel.
- Les six tables private.cheexpeer_* sont créées : missions, étapes, événements, validations, registre d'outils et planifications.
- Les six tables ont RLS activé, six politiques explicites refusent toutes les opérations à anon et authenticated, et les droits SQL directs navigateur sont révoqués.
- Le journal d'événements est append-only, avec trigger bloquant UPDATE et DELETE.
- Les index de clés étrangères du nouveau modèle ont été ajoutés.

### Transport PGMQ

- Extension pgmq 1.5.1 installée.
- File durable cheexpeer_missions créée ; tables actives et archives présentes.
- Schéma pgmq inaccessible à anon et authenticated.
- Usage, exécution des fonctions et droits de tables PGMQ accordés au seul rôle serveur service_role.
- Test réel réalisé sur la base : envoi d'un message de contrôle, lecture avec fenêtre de visibilité, puis archivage réussi.
- Aucun schéma pgmq_public n'a été exposé à la Data API.

pg_cron est installé et le job CRM existant est toujours présent (un job observé). supabase_vault est installé. Leur présence ne signifie pas encore qu'un ordonnanceur Cheexpeer, un secret de connecteur ou un worker est configuré.

### Contrôles et réserves

- Vérification SQL : 6/6 tables Cheexpeer avec RLS ; 6/6 politiques de refus navigateur ; 15 tables publiques ; 1 job Cron CRM.
- Advisor sécurité : aucun signal RLS « table sans politique » après ajout des refus explicites. Un avertissement subsiste sur public.complete_crm_reminder : fonction SECURITY DEFINER appelable par authenticated. Cet accès est intentionnel pour traiter les relances depuis le CRM ; la fonction contrôle l'identité et le droit tenant-scoped avant toute écriture. À conserver sous tests de rôles.
- Advisor performance : plus aucun avertissement de clé étrangère Cheexpeer non indexée. Les index inutilisés signalés sont attendus sur une base de test encore vide ; ne pas les supprimer avant une charge représentative.
- Le test PGMQ valide le transport, pas la consommation par un worker.
- Aucun worker, dispatcher, API de mission, cockpit Cheexpeer, connecteur Drive ou mission réelle n'a été déployé ou testé.
- Le projet majestios-crm n'a fait l'objet d'aucune modification.

### Prochaine séquence technique

1. Définir et tester les fonctions SQL atomiques de prise de mission, bail, renouvellement, reprise et transitions d'état.
2. Construire le dispatcher : priorité, urgence, planification, dépendances, quotas, échéances et équité.
3. Construire un worker persistant qui consomme PGMQ, vérifie les permissions et écrit les événements.
4. Exécuter une mission inoffensive de bout en bout, puis un connecteur en lecture seule.
5. Ajouter les validations humaines et les écritures métier uniquement après tests d'isolation et d'idempotence.

**Statut à retenir :** fondation de données et transport installés et testés sur MajestiOS-Test ; moteur d'exécution Cheexpeer encore à construire. Aucune mise en production, aucun déploiement d'Edge Function et aucune modification de majestios-crm.