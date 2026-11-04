# Fondations du back-office MajestiOS 4.0

**Date :** 4 novembre 2026  
**Statut :** architecture cible et prototype ergonomique initial ; aucune fonction serveur n'est encore opérationnelle.  
**Branche de travail :** `foundation-backoffice-4.0`.

## 1. Intention

Le back-office doit devenir le cockpit depuis lequel le porteur du projet pilote MajestiOS et fait évoluer la plateforme avec BrainIOS. Il doit rester simple à comprendre, rapide à utiliser, discret visuellement et extensible sans refonte globale.

Le principe directeur est : **un noyau stable, des modules indépendants, des contrats explicites**.

L'interface ne doit pas devenir une accumulation de tableaux de bord. Chaque écran doit répondre à une question concrète : que se passe-t-il, que dois-je décider, qu'est-ce qui avance, qu'est-ce qui bloque et quelle est la prochaine action utile ?

## 2. Principes ergonomiques

- **Hiérarchie courte :** navigation principale stable, sous-navigation contextuelle uniquement si nécessaire.
- **Vue d'ensemble utile :** état du projet, éléments à arbitrer, activité récente et accès aux actions fréquentes.
- **Progressive disclosure :** ne montrer les paramètres avancés que lorsqu'un module ou une action le nécessite.
- **Densité maîtrisée :** informations synthétiques, espaces respirants, détails accessibles au second niveau.
- **Réactivité :** navigation clavier, focus visible, états de chargement/erreur/absence de données, respect de la réduction des animations.
- **Responsive :** barre latérale sur grand écran, navigation repliable sur mobile et tablette.
- **Cohérence :** composants, couleurs, espacements et statuts partagés entre modules.
- **Pas de fausse fonctionnalité :** les éléments non connectés sont explicitement identifiés et les actions indisponibles sont désactivées.

## 3. Architecture d'interface modulaire

Le prototype initial est volontairement autonome et sans dépendance :

```text
admin/
  index.html          # shell et points d'entrée
  admin.css           # tokens, layout, composants, responsive
  admin.js            # navigation et interactions de présentation
  README.md           # périmètre, limites et règles d'intégration
```

Le dossier `admin/` n'est pas référencé dans `build.js` et n'est donc pas copié dans le site public. Il ne doit pas être ajouté au build tant que l'authentification réelle et les protections serveur ne sont pas en place.

Modules fonctionnels prévus :

| Module | Responsabilité |
|---|---|
| Vue d'ensemble | Synthèse du projet, alertes et prochaines décisions |
| BrainIOS | Conversation, contexte et mémoire projet |
| Demandes & lots | Demandes, diagnostics, plans, priorités et critères d'acceptation |
| Atelier GitHub | Branches isolées, commits, diffs, PR et CI |
| Qualité & tests | Build, tests, sécurité, anti-régression et preuves |
| SEO & visibilité | Audit, surveillance, recommandations et suivi |
| Paramètres | Connexions, budgets, rôles, préférences et configuration |

Chaque module devra pouvoir être développé, testé et livré indépendamment. Les modules ne doivent pas s'importer mutuellement directement : ils passent par des services partagés et des contrats versionnés.

## 4. Architecture technique cible

Le dépôt actuel est un prototype statique en HTML/CSS/JavaScript avec un script Node de construction. Il ne faut pas imposer un changement de framework uniquement pour construire l'admin.

Socle cible à confirmer après vérification de compatibilité :

1. **Frontend :** shell modulaire intégré progressivement au projet, sans dupliquer les systèmes de design.
2. **Backend :** API HTTP versionnée, exécutée côté serveur sur Vercel Functions dans le même projet tant que les besoins restent compatibles.
3. **Identité :** fournisseur d'authentification maintenu, sessions sécurisées et rôle administrateur vérifié côté serveur.
4. **Données :** base relationnelle pour les demandes, décisions, tâches, journaux et paramètres non secrets ; migrations versionnées.
5. **IA :** passerelle serveur BrainIOS vers OpenAI. La clé dédiée reste dans les variables secrètes de l'environnement serveur.
6. **Intégrations :** adaptateurs isolés pour GitHub, SEO, OpenAI et autres services.
7. **Observabilité :** journaux structurés sans secrets, identifiants de corrélation, suivi des erreurs, quotas et coûts.

Le choix définitif de l'identité et de la base n'est pas figé par ce prototype. Il sera pris après examen des ressources déjà disponibles, du coût, de la portabilité, de la sécurité, des migrations et de la facilité d'exploitation. Aucune infrastructure externe n'est créée dans ce lot.

## 5. Contrats et frontières de sécurité

- Les routes d'administration sont regroupées sous `/api/v1/admin/`.
- Chaque route vérifie la session et le rôle administrateur côté serveur ; la protection visuelle du frontend ne suffit jamais.
- Les routes d'écriture valident schéma, taille, type et statut de la demande.
- Les opérations sensibles exigent une approbation distincte, vérifiable et historisée.
- Les secrets ne sont jamais renvoyés au navigateur, stockés dans la base métier ou inscrits dans les logs.
- Le frontend ne communique jamais directement avec OpenAI ou GitHub avec une clé privée.
- Les données d'administration, du CRM interne et des espaces clients sont cloisonnées.
- Les requêtes sensibles sont protégées contre les abus : limites de fréquence, quotas, contrôle d'origine/CSRF selon le mécanisme de session et validation des entrées.

## 6. Modèle de données à préparer

Le schéma initial devra être normalisé autour des objets suivants :

- `admin_users` ou rôles associés au fournisseur d'identité ;
- `brainios_requests` : demandes et contexte ;
- `brainios_plans` : diagnostics et plans proposés ;
- `brainios_tasks` : lots, tâches, dépendances et statuts ;
- `brainios_decisions` : approbations, refus et arbitrages ;
- `brainios_runs` : exécutions, versions et résultats ;
- `brainios_artifacts` : rapports, diffs et preuves ;
- `brainios_memory_entries` : mémoire projet versionnée ;
- `brainios_usage` : modèle, tokens, coûts estimés, durée et corrélation ;
- `admin_audit_events` : journal append-only des actions importantes ;
- `admin_settings` : paramètres non secrets, budgets et préférences.

Règles : identifiants stables, dates UTC, statut explicite, auteur, provenance, version, suppression logique seulement si justifiée, durée de conservation documentée. Les données personnelles et CRM ne sont pas intégrées par défaut à la mémoire BrainIOS.

## 7. Contrat d'un module

Tout nouveau module doit préciser avant développement :

1. sa responsabilité et ce qui est hors périmètre ;
2. les vues et états UX (chargement, vide, erreur, succès, accès refusé) ;
3. les données qu'il lit et écrit ;
4. les routes API versionnées utilisées ;
5. les rôles et permissions nécessaires ;
6. les événements d'audit produits ;
7. les limites, quotas et dépendances externes ;
8. les tests unitaires, intégration, accessibilité et anti-régression ;
9. la procédure de désactivation et de retour arrière.

## 8. Niveaux d'autonomie BrainIOS

| Niveau | Autorisation |
|---|---|
| A — Observer | Lire les sources autorisées et produire des diagnostics |
| B — Conseiller | Proposer plans, priorités et recommandations |
| C — Préparer | Préparer une branche et des changements isolés, lancer les contrôles autorisés |
| D — Appliquer | Appliquer les changements réversibles explicitement autorisés |
| E — Publier | Fusion, déploiement, migration ou changement de permission après accord explicite distinct |

L'interface doit rendre visible le niveau courant et la portée exacte de chaque approbation. Une approbation de plan ne vaut pas approbation de déploiement.

## 9. Séquence de réalisation

### Lot 1 — Structure et ergonomie (ce lot)
- shell de navigation et vue d'ensemble ;
- design tokens et composants cohérents ;
- adaptation mobile ;
- séparation HTML/CSS/JS ;
- prototype isolé, non inclus dans le build public.

### Lot 2 — Socle serveur et identité
- choisir le fournisseur d'identité et la base après audit de compatibilité ;
- routes admin protégées ;
- rôle administrateur côté serveur ;
- sessions, révocation, CSRF/origine et limitation de fréquence ;
- tests d'accès anonyme, utilisateur non admin et admin.

### Lot 3 — Services et données
- schéma/migrations ;
- services d'accès aux données ;
- contrats API versionnés ;
- journal d'audit et sauvegardes ;
- états UX réels et gestion des erreurs.

### Lot 4 — BrainIOS
- passerelle OpenAI côté serveur ;
- modèle autorisé, quotas, budget et suivi des coûts ;
- conversation et mémoire projet ;
- demandes, plans, lots et décisions.

### Lot 5 — Atelier et pilotage
- GitHub sur branches isolées ;
- build, tests, CI et preuves ;
- SEO, rapports et surveillance ;
- gouvernance des actions et validations.

## 10. Critères de validation avant toute ouverture

- [ ] Le build public ne contient aucun fichier du prototype admin.
- [ ] L'accès anonyme aux routes admin est refusé côté serveur.
- [ ] Un utilisateur non administrateur est refusé côté serveur.
- [ ] Aucun secret n'est présent dans le bundle navigateur, le dépôt ou les logs.
- [ ] Les données admin sont isolées des données CRM et clients.
- [ ] Les opérations sont journalisées et les changements réversibles.
- [ ] Les modules disposent d'états UX complets et d'une navigation clavier.
- [ ] Le budget API est plafonné et les dépassements déclenchent une politique définie.
- [ ] La publication nécessite une approbation distincte.

## 11. État réel après le lot 1

**Réalisé :** prototype visuel autonome, navigation de présentation, design system de base, responsive desktop/tablette/mobile et documentation d'architecture.

**Non réalisé :** authentification, backend, base de données, API OpenAI, persistance, permissions, journaux serveur, connexion GitHub depuis l'admin, SEO automatisé et déploiement.

Le prototype n'est pas une interface d'administration sécurisée et ne doit pas être publié en l'état.
