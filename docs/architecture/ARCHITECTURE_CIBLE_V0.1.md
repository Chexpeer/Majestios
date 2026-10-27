# MajestiOS — Architecture cible V0.1

**Date :** 27 octobre 2026  
**Statut :** Ébauche de travail, non validée  
**Branche :** architecture-v0-1

## 1. Objet

Ce document pose une première architecture technique cible pour faire évoluer MajestiOS du prototype public statique vers une plateforme professionnelle d'intelligence commerciale.

Il complète le cahier des charges existant : il ne remplace ni les dix tomes ni leurs règles. Tout conflit entre ce document provisoire et le référentiel maître doit être signalé et arbitré avant implémentation.

## 2. Principes directeurs

1. Préserver le site public existant tant qu'une migration n'a pas été décidée et testée.
2. Livrer un MVP commercial utile avant de développer les fonctions avancées.
3. Séparer interface, logique métier, accès aux données et intégrations externes.
4. Appliquer l'isolation des données entre organisations au niveau de la base de données.
5. Conserver la provenance des informations et distinguer les faits vérifiés des déductions produites par l'IA.
6. Préparer les extensions futures sans les construire prématurément.
7. Versionner les décisions d'architecture et les migrations de base de données.

## 3. Stack proposée — à confirmer

- **Application :** Next.js et TypeScript.
- **Interface :** React.
- **Données :** PostgreSQL via Supabase.
- **Authentification :** Supabase Auth.
- **Autorisation et isolation :** Row Level Security (RLS), complétée par des contrôles de permissions côté serveur.
- **Hébergement :** Vercel, sous réserve de compatibilité avec la configuration de déploiement retenue.
- **Code et historique :** GitHub.

Ces choix sont des propositions techniques et non la description de l'état actuel du dépôt. Ils devront être confirmés après audit du référentiel fonctionnel et des contraintes de déploiement.

## 4. Architecture logique

### 4.1 Interface
- Site public et pages de présentation.
- Authentification.
- Espace professionnel protégé.
- Interfaces métier organisées par module.

### 4.2 Modules métier
- Organisations et membres.
- Opportunités.
- Entreprises.
- Interlocuteurs et décideurs.
- Activités commerciales.
- Prospection.
- Connaissance d'entreprise.

### 4.3 Services applicatifs
- Collecte et normalisation de sources.
- Qualification d'opportunités.
- Recherche et rapprochement.
- Notifications.
- Services IA derrière une interface indépendante du fournisseur.

### 4.4 Sécurité et gouvernance
- Authentification et contrôle des sessions.
- Rôles et permissions.
- Isolation par organisation.
- Journalisation des opérations sensibles.
- Gestion des secrets exclusivement côté serveur.
- Contrôles des actions administratives à privilèges élevés.

## 5. Modèle de données initial à étudier

Entités candidates, à valider avec les tomes et les parcours :

- `organizations` : organisations clientes.
- `memberships` : appartenance des utilisateurs aux organisations et rôle associé.
- `companies` : entreprises suivies ou prospectées.
- `contacts` : interlocuteurs professionnels.
- `opportunities` : opportunités détectées ou saisies.
- `opportunity_sources` : sources et provenance des opportunités.
- `activities` : appels, rendez-vous, notes et autres événements métier.
- `tasks` : actions à réaliser.
- `knowledge_items` : éléments de connaissance rattachés à une entreprise ou à une source.
- `audit_logs` : traces des opérations sensibles.

Cette liste n'est pas un schéma SQL validé. Les cardinalités, champs, contraintes, règles de conservation et règles d'accès doivent être spécifiés avant la création des migrations.

## 6. Provenance et fiabilité des opportunités

Chaque opportunité importée ou créée devrait permettre, selon le type de source :
- d'identifier sa source d'origine ;
- de conserver l'URL ou la référence source lorsque disponible ;
- d'enregistrer la date de collecte et la date de publication si connue ;
- de suivre la dernière vérification et le statut de l'information ;
- de distinguer les informations publiées des rapprochements ou hypothèses générés par l'IA.

Le flux MajestiOS ne doit pas laisser croire que toutes les catégories d'opportunités proviennent d'une même source officielle. BOAMP est une source parmi d'autres et concerne les annonces de marchés publics.

## 7. Piliers métier et historique

Les notions ACT, KNB, PIP et DMH doivent être traitées comme des piliers logiques du modèle métier, selon les spécifications déjà établies, et non présumées être quatre applications autonomes. Leur définition exacte et leur correspondance aux entités physiques doivent être confirmées dans le référentiel maître avant d'arrêter le schéma.

L'historique des activités doit pouvoir relier une action à son contexte commercial sans imposer que la téléphonie ou la visioconférence soient présentes dans le MVP.

## 8. Sécurité minimale attendue

- Activer RLS sur toutes les tables exposées aux clients.
- Écrire et tester des politiques d'accès explicites par organisation.
- Ne jamais exposer une clé Supabase privilégiée ou une clé fournisseur IA dans le navigateur.
- Ne pas utiliser des métadonnées modifiables par l'utilisateur comme unique source d'autorité pour les permissions.
- Vérifier côté serveur les opérations privilégiées.
- Tester qu'un membre d'une organisation ne peut pas lire ou modifier les données d'une autre.
- Protéger les actions de suspension, suppression et modification de rôle par des permissions dédiées et une journalisation.

## 9. Arborescence cible proposée

```text
Majestios/
├── README.md
├── docs/
│   ├── cahier-des-charges/
│   ├── annexes/
│   ├── architecture/
│   └── decisions/
├── public/
├── src/
│   ├── app/
│   ├── components/
│   ├── core/
│   ├── modules/
│   │   ├── entreprises/
│   │   ├── opportunites/
│   │   ├── interlocuteurs/
│   │   ├── activites/
│   │   ├── prospection/
│   │   └── connaissance-entreprise/
│   ├── services/
│   │   ├── ia/
│   │   ├── sources/
│   │   └── notifications/
│   ├── lib/
│   ├── types/
│   └── config/
├── supabase/
│   ├── migrations/
│   ├── functions/
│   └── tests/
└── tests/
    ├── unit/
    ├── integration/
    └── e2e/
```

Cette arborescence est une cible. Elle ne doit pas être créée en totalité avant validation et planification de la migration depuis le site statique actuel.

## 10. Extensions futures à ne pas développer prématurément

- Analyse approfondie des pièces de marchés.
- Détection systématique des opportunités indirectes liées à des marchés importants.
- Études de marché avancées.
- Téléphonie/IP et orchestration d'appels par IA.
- Couverture internationale élargie et traduction en temps réel.

Le MVP doit préserver la possibilité d'ajouter ces fonctions, notamment par une bonne gestion des sources, des activités et des relations entre opportunités et entreprises. Il ne doit pas tenter d'implémenter dès maintenant ces moteurs complexes.

## 11. Conditions de validation

Avant de figer l'architecture :
1. confronter les modules et parcours aux dix tomes ;
2. repérer les contradictions ou décisions manquantes ;
3. valider le périmètre du MVP ;
4. valider le modèle de données et les règles d'accès ;
5. définir une stratégie de migration et de déploiement réversible ;
6. documenter les décisions dans `docs/decisions/`.

---
**Fin du document — Architecture cible V0.1**
