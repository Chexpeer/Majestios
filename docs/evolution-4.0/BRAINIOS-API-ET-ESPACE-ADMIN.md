# BrainIOS — API OpenAI et cockpit d'évolution MajestiOS

**Version :** 4.0  
**Date :** 4 novembre 2026  
**Statut :** décision de conception validée par le porteur du projet ; implémentation progressive à réaliser.  
**Branche :** `evolution-4.0`

## 1. Décision produit

BrainIOS sera alimenté par une API OpenAI payante, appelée depuis le serveur MajestiOS. Le porteur du projet fera évoluer MajestiOS principalement depuis l'espace d'administration : il dialoguera avec BrainIOS, formulera ses demandes, arbitrera les priorités, examinera les propositions et suivra les réalisations.

L'espace admin devient le cockpit de pilotage et l'atelier d'évolution du produit. Il ne s'agit pas uniquement d'un panneau de statistiques ou d'une interface de gestion des comptes.

## 2. Ce que le porteur du projet pourra faire depuis l'admin

- demander une nouvelle fonctionnalité ou une modification ;
- demander un audit ciblé ou complet ;
- corriger et enrichir la vision, la documentation et la mémoire projet ;
- gérer les priorités et le backlog ;
- modifier les contenus, catégories et paramètres métier autorisés ;
- demander à BrainIOS de préparer un lot de développement ;
- consulter les fichiers et changements proposés ;
- suivre les branches, commits, PR et workflows GitHub ;
- lancer ou consulter les tests et les contrôles anti-régression ;
- consulter les rapports journaliers et les alertes ;
- piloter le SEO et valider les optimisations ;
- surveiller la consommation API et les budgets.

## 3. Architecture logique

```text
Espace Admin MajestiOS
        |
        | session admin + autorisations serveur
        v
API BrainIOS (backend MajestiOS)
        |
        +--> Orchestrateur de demandes
        |       +--> Mémoire projet / documentation
        |       +--> Contexte code et architecture
        |       +--> Backlog / priorités / décisions
        |       +--> Outils autorisés (GitHub, tests, SEO)
        |
        +--> Passerelle OpenAI
        |       +--> OPENAI_API_KEY (secret serveur uniquement)
        |       +--> modèle configurable côté serveur
        |       +--> limites de tokens / requêtes / budget
        |       +--> métriques d'usage et coûts
        |
        +--> Registre d'actions
                +--> propositions
                +--> approbations
                +--> exécutions isolées
                +--> résultats et preuves
```

Le navigateur ne communique jamais directement avec OpenAI avec la clé secrète. Il dialogue uniquement avec l'API authentifiée de MajestiOS.

## 4. Gestion de la clé API

### 4.1 Provisionnement

- Créer une clé de projet dédiée à BrainIOS, idéalement associée à un compte de service plutôt qu'à l'identité personnelle d'un développeur.
- Installer la clé comme secret d'environnement serveur, par exemple `OPENAI_API_KEY`, dans l'environnement Vercel ou le gestionnaire de secrets retenu.
- Séparer les environnements de test et de production avec des projets/identifiants distincts lorsque cela est pertinent.
- Prévoir une expiration et une rotation de clé.
- Ne jamais demander au porteur du projet de coller la clé dans une conversation BrainIOS, un formulaire web, GitHub ou un champ de base de données.
- L'interface admin affiche uniquement l'état de configuration (disponible / absent / erreur), jamais la valeur ni un extrait de la clé.

### 4.2 Facturation et budgets

La facturation API est indépendante de l'abonnement ChatGPT. Le compte API doit avoir sa propre configuration de facturation ou ses crédits actifs. Le coût varie selon le modèle, les jetons et les outils utilisés.

Contrôles applicatifs à prévoir :
- budget mensuel BrainIOS ;
- plafond journalier et plafond par tâche ;
- limites de tokens d'entrée et de sortie ;
- modèles autorisés selon le type de tâche ;
- alertes à plusieurs seuils ;
- arrêt contrôlé des tâches non prioritaires lorsque le budget est atteint ;
- tableau de bord de consommation par fonctionnalité, modèle et période ;
- estimation avant les tâches volumineuses ;
- suivi des erreurs, délais et limites de débit.

Les plafonds applicatifs complètent les contrôles de facturation et de dépenses du projet API ; ils ne les remplacent pas.

### 4.3 Confidentialité technique

- Aucun secret dans le code source, les commits, les logs, le navigateur ou les rapports.
- Les requêtes et réponses sont journalisées de façon minimisée.
- Les données CRM, conversations privées et données clients ne sont transmises au modèle que si le cas d'usage, les permissions et la finalité l'autorisent.
- Les identifiants de requête et métriques techniques sont conservés sans exposer les charges utiles sensibles.
- Les outils accessibles au modèle sont explicitement déclarés et limités par rôle.

## 5. Le cycle d'évolution piloté par BrainIOS

1. **Demande** — le porteur décrit ce qu'il veut faire évoluer.
2. **Compréhension** — BrainIOS consulte la vision, les décisions, le code et l'état du projet autorisés.
3. **Diagnostic** — BrainIOS identifie l'existant, les dépendances, les risques et les éléments à préserver.
4. **Proposition** — BrainIOS présente une solution, un découpage en lots et des critères de validation.
5. **Arbitrage** — le porteur ajuste ou valide le périmètre.
6. **Préparation** — BrainIOS travaille sur une branche isolée ou prépare les changements réversibles autorisés.
7. **Vérification** — tests, build, liens, architecture, sécurité et contrôles anti-régression.
8. **Compte rendu** — résultats, fichiers modifiés, commits, limites et risques résiduels sont affichés dans l'admin.
9. **Mise en service** — étape distincte, déclenchée uniquement selon le niveau d'autorisation choisi.

## 6. Niveaux d'autonomie

| Niveau | Capacités | Règle |
|---|---|---|
| A — Observer | Lire les sources autorisées, auditer, surveiller, produire des rapports | Autorisé dans le périmètre admin |
| B — Conseiller | Proposer des améliorations, plans, priorités et critères | Proposition visible, aucune mutation |
| C — Préparer | Créer des lots, branches et modifications isolées, exécuter les tests | Périmètre de tâche défini et traçabilité obligatoire |
| D — Appliquer | Modifier contenus et paramètres réversibles explicitement autorisés | Journal, version précédente et retour arrière |
| E — Publier | Fusionner, déployer, migrer des données ou modifier des permissions sensibles | Autorisation explicite distincte et confirmation avant exécution |

L'objectif est de rendre BrainIOS réellement utile et capable de faire avancer le projet, sans confondre autonomie de travail et droit de modifier la production.

## 7. Modules du cockpit admin

### 7.1 Assistant BrainIOS
Conversation avec contexte projet, références consultables, demandes en cours et historique des décisions.

### 7.2 Vision et mémoire
Documents de référence, lexique, doctrine, décisions validées, hypothèses, questions ouvertes et historique de versions.

### 7.3 Backlog et feuille de route
Demandes, lots, priorités, dépendances, critères d'acceptation, statut et responsable.

### 7.4 Atelier GitHub
Branches, commits, fichiers modifiés, diffs, pull requests, contrôles CI et état des workflows. Les permissions GitHub sont limitées au strict nécessaire.

### 7.5 Laboratoire qualité
Build, tests unitaires, tests d'intégration, tests navigateur, vérifications d'architecture, liens, SEO et sécurité. Chaque résultat conserve la version testée.

### 7.6 Surveillance et rapports
Santé des modules, anomalies, erreurs, événements utiles, synthèses quotidiennes et recommandations confidentielles.

### 7.7 SEO et visibilité
Audit technique, sitemap, robots, canonical, redirections, erreurs HTTP, métadonnées, données structurées, maillage interne, mobile, performances, Search Console et Bing Webmaster Tools lorsque connectés. BrainIOS prépare les corrections et mesure les résultats ; aucune promesse de classement garanti.

### 7.8 Paramètres IA et coûts
État de connexion, modèle autorisé, plafonds, budgets, métriques, alertes et historique de consommation. La clé elle-même reste exclusivement dans le coffre de secrets serveur.

## 8. Modèle de données minimal à prévoir

- `brainios_requests` : demandes formulées depuis l'admin ;
- `brainios_plans` : diagnostics, plans et critères d'acceptation ;
- `brainios_tasks` : lots, dépendances et statuts ;
- `brainios_decisions` : décisions et approbations de l'administrateur ;
- `brainios_runs` : exécutions, versions, résultats et erreurs ;
- `brainios_artifacts` : rapports, diffs, liens GitHub et preuves ;
- `brainios_memory_entries` : éléments de mémoire projet versionnés ;
- `brainios_usage` : modèle, tokens, coût estimé, durée et identifiant de requête ;
- `brainios_settings` : paramètres non secrets et budgets ;
- `brainios_audit_events` : journal des actions et changements de statut.

Les noms sont indicatifs ; le schéma physique sera défini avec le socle de données et les autorisations.

## 9. API interne indicative

- `POST /api/v1/admin/brainios/conversations`
- `POST /api/v1/admin/brainios/requests`
- `GET /api/v1/admin/brainios/requests/{id}`
- `POST /api/v1/admin/brainios/requests/{id}/approve-plan`
- `POST /api/v1/admin/brainios/tasks/{id}/run`
- `GET /api/v1/admin/brainios/runs/{id}`
- `GET /api/v1/admin/brainios/usage`
- `GET /api/v1/admin/brainios/health`
- `GET /api/v1/admin/brainios/memory`
- `POST /api/v1/admin/brainios/memory`

Ces routes sont des contrats à concevoir, pas des endpoints actuellement disponibles.

## 10. Séquence d'implémentation

1. Authentification et rôle administrateur réel, appliqués côté serveur.
2. Backend et passerelle OpenAI avec secret d'environnement.
3. Conversation admin minimale avec quotas et journal d'usage.
4. Mémoire projet et documents de référence.
5. Demandes, plans, backlog et décisions.
6. Atelier GitHub sur branche isolée et lecture des résultats CI.
7. Laboratoire de tests et rapports.
8. Paramètres de contenu et taxonomies depuis l'admin.
9. Surveillance, rapports journaliers et SEO.
10. Niveaux d'autonomie supplémentaires après tests de sécurité et de retour arrière.

## 11. Critères de validation du MVP BrainIOS Admin

- [ ] Une personne non authentifiée ne peut pas accéder à l'espace admin ni à l'API BrainIOS.
- [ ] Un utilisateur non administrateur ne peut pas appeler les routes admin.
- [ ] La clé OpenAI n'apparaît jamais dans le frontend, les logs, la base ou Git.
- [ ] BrainIOS répond via le backend et l'API OpenAI.
- [ ] Les appels sont bornés par modèle, taille, fréquence et budget.
- [ ] Les coûts et erreurs sont traçables.
- [ ] Les demandes admin sont conservées et retrouvables.
- [ ] BrainIOS sait consulter les documents de référence autorisés.
- [ ] Une demande produit produit un plan, des tâches et des critères de validation.
- [ ] Aucune fusion ou mise en production ne peut être déclenchée sans autorisation distincte.
- [ ] Les données CRM et clients ne sont pas accessibles par défaut au moteur BrainIOS admin.

## 12. Références officielles

- [Clés API et comptes de service OpenAI](https://developers.openai.com/api/docs/guides/api-keys)
- [Bonnes pratiques de production OpenAI](https://developers.openai.com/api/docs/guides/production-best-practices)
- [Sécurité des clés API OpenAI](https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety)
- [Facturation ChatGPT et API séparée](https://help.openai.com/en/articles/9039756-managing-billing-for-chatgpt-and-the-api-platform)

---
**Règle de vérité :** ce document décrit la cible BrainIOS 4.0. L'API OpenAI, le backend, l'authentification, les écrans admin et les outils de développement ne sont pas déclarés opérationnels tant que leurs implémentations et tests ne le prouvent pas.
