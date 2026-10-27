# MajestiOS — Feuille de route technique MVP V0.1

**Date :** 27 octobre 2026  
**Statut :** Proposition de séquencement, à valider avec le référentiel maître  
**Branche :** architecture-v0-1

## Objectif

Construire progressivement une première version professionnelle utilisable, testable et extensible. Les étapes ci-dessous sont des jalons de travail, pas une promesse de fonctionnalités déjà implémentées.

## Phase 0 — Audit et cadrage

### Travaux
- Auditer les branches et fichiers du dépôt actuel.
- Préserver le site public statique pendant la préparation de l'application.
- Relier les exigences des dix tomes et des annexes aux modules envisagés.
- Identifier les règles fonctionnelles ambiguës ou contradictoires.
- Définir le périmètre précis du MVP et les critères d'acceptation.

### Livrables
- Inventaire de l'existant.
- Matrice exigences → modules → tests.
- Liste des décisions à prendre.
- Plan de migration et de retour arrière.

### Critère de sortie
Aucun remplacement du site existant avant qu'une stratégie de déploiement séparant le site public et l'application ait été décidée.

## Phase 1 — Fondations techniques

### Travaux
- Confirmer le choix du framework et la configuration de déploiement.
- Mettre en place le projet applicatif dans une branche dédiée.
- Définir les environnements développement, préproduction et production selon les moyens disponibles.
- Préparer les variables d'environnement sans inclure de secrets dans Git.
- Définir les migrations versionnées de base de données.
- Mettre en place les contrôles de qualité et les tests automatisés essentiels.

### Critères de sortie
- Installation documentée et reproductible.
- Application de base exécutable.
- Aucun secret dans le dépôt.
- Déploiement de test vérifié avant toute bascule de production.

## Phase 2 — Identité, organisations et sécurité

### Travaux
- Inscription, connexion et gestion de session.
- Création ou rattachement à une organisation.
- Gestion des membres et des rôles.
- Politiques RLS pour les données propres à une organisation.
- Journalisation des opérations sensibles.
- Tests d'isolation entre organisations.

### Critères de sortie
Un utilisateur autorisé peut accéder à son espace ; un utilisateur non autorisé ne peut pas lire ni modifier les données d'une autre organisation, y compris en appelant directement les API.

## Phase 3 — Parcours commercial central

### Travaux
- Fiches entreprises.
- Interlocuteurs et rattachement aux entreprises.
- Flux d'opportunités.
- Provenance des opportunités.
- Historique des activités et tâches.
- Recherche, filtres et états de traitement essentiels.

### Critères de sortie
Un utilisateur peut consulter une opportunité, retrouver l'entreprise concernée, rattacher un interlocuteur et enregistrer une action commerciale, dans le respect des permissions.

## Phase 4 — Sources et qualification initiales

### Travaux
- Sélectionner un petit nombre de sources adaptées au MVP.
- Normaliser les données importées.
- Dédupliquer les entrées lorsque possible.
- Conserver la source et les dates utiles.
- Ajouter une qualification simple et explicable.
- Signaler les informations incertaines ou obsolètes.

### Critères de sortie
Les utilisateurs peuvent comprendre d'où vient une opportunité et distinguer les informations publiées des suggestions automatisées.

## Phase 5 — Vérification et pilote

### Travaux
- Tests fonctionnels des parcours.
- Tests d'isolation et de permissions.
- Vérification des erreurs et journaux.
- Tests du déploiement et des migrations.
- Pilote limité avec des utilisateurs représentatifs.
- Recueil des retours et correction des défauts prioritaires.

### Critères de sortie
Le parcours MVP est suffisamment stable pour un pilote commercial contrôlé et les problèmes critiques de sécurité sont corrigés.

## Après le MVP — évolutions à arbitrer

- Plus de sources et de catégories d'opportunités.
- Enrichissement des entreprises et identification des décideurs.
- Qualification IA plus avancée.
- Analyse des pièces de marchés et rapprochement entre lots, entreprises et sous-traitants.
- Détection des opportunités indirectes issues de grands projets.
- Études de marché automatisées.
- Téléphonie/IP et IA intégrée, après étude de faisabilité, coûts, qualité et obligations applicables.
- Expansion internationale.

Ces extensions ne font pas partie du périmètre de livraison initial. Leur priorité dépendra des retours des utilisateurs, des coûts réels et des résultats commerciaux.

## Risques à traiter dès le départ

| Risque | Mesure prévue |
|---|---|
| Perte ou régression du site public actuel | Branche dédiée, déploiement distinct ou migration contrôlée |
| Fuite de données entre organisations | RLS, tests négatifs et contrôles serveur |
| Coût IA imprévisible | Services IA centralisés, suivi des consommations et limites |
| Informations commerciales périmées | Provenance, dates et statut de vérification |
| Confusion entre faits et inférences IA | Étiquetage et traçabilité des suggestions |
| Périmètre trop large | Critères d'acceptation et report des fonctions avancées |
| Déploiement instable | Environnements séparés, vérifications et retour arrière |

## Règle de conduite

Une phase ne doit être déclarée terminée que lorsque ses critères de sortie ont été vérifiés. L'existence d'un fichier, d'une page ou d'une migration ne suffit pas à prouver que la fonctionnalité est opérationnelle.

---
**Fin du document — Feuille de route MVP V0.1**
