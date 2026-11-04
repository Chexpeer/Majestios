# Module Administration piloté par l'IA — MajestiOS 5.0

## 1. Vision

MajestiOS doit disposer d'un véritable **cockpit d'administration assisté et piloté par l'IA**. Il ne s'agit pas d'une simple page de paramètres ni d'un chatbot décoratif : c'est le poste de pilotage opérationnel de la plateforme.

L'administrateur humain conserve l'autorité. L'IA observe les signaux autorisés, comprend l'état du système, explique, alerte, recommande, prépare des opérations et exécute uniquement les tâches explicitement permises par sa politique d'autonomie.

Le module doit être conçu comme une interface d'administration dédiée, sécurisée, distincte de l'expérience publique et des espaces clients.

## 2. Missions de l'IA administratrice

### A. Superviser la plateforme
- surveiller la disponibilité des pages, routes, services et connecteurs ;
- suivre les erreurs, journaux, files de tâches et échecs de synchronisation ;
- détecter les anomalies, régressions et comportements inhabituels ;
- contrôler les quotas, consommations et coûts des services IA et API ;
- présenter un état de santé compréhensible avec preuves et horodatage.

### B. Gérer la qualité des données
- détecter doublons, incohérences, champs manquants et données périmées ;
- signaler les sources indisponibles ou les enrichissements incertains ;
- proposer des corrections et fusions, sans écraser silencieusement les données ;
- suivre provenance, fraîcheur, confiance et historique.

### C. Piloter les contenus et le SEO
- réaliser des audits techniques SEO récurrents ;
- surveiller indexation, sitemap, robots, canonicals, redirections, métadonnées, données structurées, liens internes, performance et Core Web Vitals ;
- identifier les contenus faibles, dupliqués ou obsolètes ;
- suivre les évolutions des moteurs de recherche et de la recherche générative ;
- préparer des recommandations et modifications proposées, avec aperçu et comparaison avant/après.

L'IA ne doit pas promettre un classement, manipuler artificiellement les avis, produire du contenu trompeur ni publier massivement sans contrôle éditorial.

### D. Assister le développement et la maintenance
- analyser les rapports d'erreur et les résultats des tests ;
- proposer des correctifs isolés ;
- préparer des branches ou lots de travail, documenter les changements et lancer les tests autorisés ;
- contrôler les liens, routes, formulaires et correspondances entre l'arborescence et l'interface ;
- tenir à jour la documentation et le registre des décisions ;
- signaler les régressions avant toute mise en circulation.

L'accès au dépôt et aux environnements doit passer par des identités techniques limitées, traçables et révocables.

### E. Administrer les opérations métier
- assister la gestion des utilisateurs, rôles et demandes d'accès ;
- surveiller les traitements de recherche, d'enrichissement et de qualification ;
- repérer les tâches bloquées et préparer leur reprise ;
- produire des rapports de pilotage et synthèses d'activité ;
- aider l'administrateur à comprendre les événements importants.

L'IA ne peut pas s'accorder elle-même des permissions, ni consulter les données d'un client hors du périmètre autorisé.

### F. Gérer sa propre mémoire opérationnelle
- retrouver les décisions et échanges liés à un incident ou un chantier ;
- relire les conversations et documents autorisés ;
- distinguer décisions validées, hypothèses et anciennes pistes ;
- maintenir un journal de travail et des tâches en cours ;
- signaler les contradictions et demander arbitrage lorsque nécessaire.

## 3. Interface du cockpit

Éléments à étudier :
- tableau de santé général et alertes prioritaires ;
- assistant conversationnel d'administration ;
- centre de notifications et incidents ;
- tâches et recommandations en attente ;
- suivi des coûts, quotas et consommation IA ;
- qualité des données et connecteurs ;
- SEO et visibilité ;
- documentation, décisions et mémoire du projet ;
- atelier de développement, tests et contrôle des versions ;
- historique des actions de l'IA et des validations humaines.

L'interface doit permettre de comprendre pourquoi l'IA recommande une action, quelles données elle a consultées, quels changements seraient réalisés, et comment revenir en arrière.

## 4. Niveaux d'autonomie et approbations

| Niveau | Capacité | Règle |
|---|---|---|
| 0 — Observer | Lire les métriques et sources autorisées | Lecture seule |
| 1 — Analyser | Diagnostiquer et expliquer | Pas de modification |
| 2 — Recommander | Proposer une action et son impact | Validation humaine |
| 3 — Préparer | Préparer patch, rapport, branche ou tâche isolée | Rien n'est publié |
| 4 — Exécuter dans un périmètre limité | Actions réversibles préautorisées, par exemple relancer un traitement idempotent | Politique explicite, journalisation et limites |
| 5 — Opérations sensibles | Déploiement production, merge, migration, suppression, export, changement de droits, contact externe, dépense ou engagement | Approbation humaine spécifique avant chaque action |

Aucune autorisation générale ne doit être interprétée comme un blanc-seing. Les permissions sont limitées par action, ressource, environnement, durée et budget. Les actions sensibles sont soumises à une confirmation distincte.

## 5. Sécurité et séparation des rôles

- authentification forte et rôles d'administration ;
- séparation stricte entre cockpit interne, visiteurs et espaces clients ;
- moindre privilège et permissions vérifiées côté serveur ;
- journal d'audit immuable ou protégé contre l'altération ;
- secrets conservés dans un coffre serveur, jamais dans le navigateur ou Git ;
- séparation développement, preview, staging et production ;
- limites de taux, budgets et coupe-circuits ;
- approbation à deux étapes pour opérations critiques si le risque le justifie ;
- possibilité de suspendre immédiatement les capacités d'action de l'IA ;
- contrôle des injections de prompt et des instructions contenues dans des contenus externes ;
- tests réguliers d'accès croisé, d'escalade de privilèges et de fuite de données.

## 6. Architecture logique

Le module est à concevoir autour de composants séparés :
1. **Interface cockpit** : commandes, état, rapports et validations.
2. **Orchestrateur IA** : compréhension de la demande, planification et sélection des outils.
3. **Registre de politiques** : autorisations, périmètres, budgets et approbations.
4. **Adaptateurs d'outils** : métriques, logs, Git, CI, SEO, données et connecteurs.
5. **Journal d'audit** : demandes, contexte, propositions, validations, résultats et erreurs.
6. **Mémoire opérationnelle** : décisions, incidents, tâches et documentation référencés.
7. **Moteur de tâches** : exécution asynchrone, idempotence, reprise, annulation et retour arrière.

L'IA ne doit jamais appeler directement un outil privilégié sans passer par le contrôle de politique et de permission.

## 7. MVP recommandé

Démarrer par un cockpit en lecture seule :
- état des services et routes ;
- erreurs et résultats de tests ;
- suivi des quotas et coûts ;
- état SEO et qualité des données ;
- recherche dans la documentation et les décisions ;
- synthèse IA avec liens vers les preuves.

Deuxième étape : préparation de correctifs et recommandations avec aperçu, sans publication.

Troisième étape : automatisation de quelques tâches réversibles, à faible risque, explicitement préautorisées et journalisées.

Les opérations de production restent soumises à approbation humaine.

## 8. Critères d'acceptation

- aucune action hors des permissions attribuées ;
- aucune élévation de privilège par l'IA ;
- chaque recommandation cite ses éléments de preuve ;
- chaque action possède un identifiant, un auteur, un horodatage, un périmètre et un résultat ;
- simulation/preview clairement distinguée de la production ;
- arrêt d'urgence disponible ;
- opérations réversibles testées ;
- approbation obligatoire des opérations sensibles ;
- tests de cloisonnement et de sécurité réussis ;
- aucun secret exposé dans le code client, le dépôt ou les logs.

## 9. Décisions à arbitrer

- cockpit réservé à l'équipe MajestiOS ou possibilité de déclinaisons pour les clients ;
- outils et services auxquels l'IA peut accéder ;
- niveaux d'autonomie autorisés par catégorie de tâche ;
- budget et limites d'exécution ;
- intégration GitHub, Vercel, monitoring, outils SEO et fournisseurs IA ;
- modalités de supervision humaine et astreinte.
