# MajestiOS — Pré-cadrage du back-office, CRM et administration V0.1

**Statut :** proposition de cadrage, à confronter au référentiel maître avant implémentation.  
**Branche :** `architecture-v0-1`

## 1. Décision de périmètre

Le back-office est une zone professionnelle protégée, distincte du site public et de ses formulaires de découverte. Il est anticipé dès maintenant dans l'arborescence, mais livré progressivement : une base simple, cohérente et extensible, pas un ERP complet dès le MVP.

Trois espaces logiques sont distingués :
- **Espace professionnel / CRM** : suivi des entreprises, interlocuteurs, opportunités et actions commerciales d'une organisation cliente.
- **Tableau de bord administrateur de l'organisation** : gestion des membres, paramètres et indicateurs de l'organisation cliente, selon ses permissions.
- **Administration MajestiOS (plateforme)** : supervision technique et métier, gestion des sources, qualité des données, incidents et actions privilégiées. Cet espace est réservé aux rôles internes autorisés et ne doit jamais être confondu avec l'administrateur d'un client.

Les écrans et permissions de ces espaces ne doivent pas être mélangés simplement parce qu'ils se trouvent sous une même application.

## 2. Arborescence cible — préparation, pas création prématurée de tous les fichiers

```text
src/
├── app/
│   ├── (public)/                 # Site public et recherche d'opportunités
│   ├── (auth)/                   # Connexion, inscription, récupération
│   ├── (workspace)/              # Espace protégé des utilisateurs professionnels
│   │   ├── dashboard/            # Tableau de bord métier personnel/organisation
│   │   ├── entreprises/           # Entreprises suivies
│   │   ├── interlocuteurs/        # Contacts et décideurs
│   │   ├── opportunites/          # Opportunités et qualification
│   │   ├── activites/             # Appels, rendez-vous, tâches, notes
│   │   ├── prospection/           # Listes et campagnes autorisées
│   │   ├── connaissance/          # Mémoire d'entreprise et sources
│   │   ├── integrations/          # Connexions aux outils externes
│   │   └── parametres/            # Préférences et équipe
│   ├── (org-admin)/               # Administration de l'organisation cliente
│   │   └── administration/
│   └── (platform-admin)/          # Administration interne MajestiOS
│       └── administration/
├── components/
│   ├── ui/                        # Composants d'interface réutilisables
│   ├── layout/                    # Navigation, en-têtes, panneaux
│   └── forms/                     # Champs, validation, messages d'erreur
├── modules/
│   ├── entreprises/
│   ├── interlocuteurs/
│   ├── opportunites/
│   ├── activites/
│   ├── crm/
│   ├── connaissance-entreprise/
│   ├── administration/
│   └── integrations/
├── services/
│   ├── sources/                   # Connecteurs et collecte
│   ├── ia/                        # Abstraction fournisseur IA
│   ├── notifications/
│   └── integrations/              # Adaptateurs d'outils externes
├── lib/
│   ├── auth/
│   ├── permissions/
│   ├── validation/
│   └── audit/
└── types/
```

Les groupes de routes entre parenthèses sont des groupes Next.js et ne définissent pas, à eux seuls, une protection de sécurité. Chaque page et chaque opération doivent contrôler la session, l'appartenance à l'organisation et la permission côté serveur. Les chemins finaux seront adaptés à l'application existante et au cahier des charges ; ce plan n'implique pas la création immédiate de tous ces répertoires.

## 3. Back-office minimal du MVP

### Espace professionnel
- Tableau de bord simple : prochaines actions, opportunités récentes, tâches en retard et dernières activités.
- Fiche entreprise : informations de base, source, dernière vérification, notes internes et historique.
- Fiche interlocuteur/décideur : fonction, entreprise liée, coordonnées professionnelles autorisées, provenance et historique.
- Fiche opportunité : type, statut, priorité, source, échéance, entreprise liée et prochaine action.
- Activités : note, tâche, appel ou rendez-vous, tous réunis dans une chronologie.
- Recherche et filtres réutilisables.
- Import/export seulement si le périmètre, les droits et les contrôles de données sont définis.

### Administration de l'organisation cliente
- Membres et rôles autorisés.
- Paramètres de l'organisation et préférences de notification.
- Vue synthétique d'activité, sans accès aux données d'une autre organisation.
- Paramètres d'intégrations disponibles et statut de connexion.

### Administration MajestiOS
- État des collecteurs de sources, dernière collecte, erreurs et fraîcheur.
- Contrôle de la qualité, doublons, provenance et éléments à vérifier.
- Gestion des catégories de sources et des connecteurs activés.
- Journal d'audit des opérations sensibles.
- Gestion des signalements et abus selon une procédure documentée.
- Actions privilégiées protégées, confirmées et journalisées.

Le tableau de bord ne doit pas inventer des statistiques : chaque indicateur doit être calculé à partir de données effectivement disponibles et afficher la période et la définition de la mesure.

## 4. Architecture d'extensions et d'applications

Prévoir une interface d'intégration stable plutôt que des liens externes dispersés dans les composants de l'interface. Chaque intégration doit posséder :
- un identifiant et un nom ;
- une catégorie (communication, productivité, données, cartographie, CRM, etc.) ;
- un statut (non configurée, connectée, erreur, suspendue) ;
- une page officielle et une documentation ;
- une méthode d'authentification documentée, sans exposer les secrets au navigateur ;
- les permissions demandées et l'organisation propriétaire ;
- un contrôle de santé, un message d'erreur exploitable et une procédure de déconnexion ;
- des limites de coûts, quotas et conditions de réutilisation si applicables.

Les intégrations sont des adaptateurs isolés : l'échec d'un service tiers ne doit pas bloquer le CRM principal. L'ajout d'une application doit se faire par configuration ou module clairement séparé, pas par accumulation de conditions dans les pages centrales.

## 5. Prévoir les liens Google, Business Profile et outils bureautiques

Préparer la possibilité de liens et d'intégrations avec :
- Google Drive et Google Sheets pour les documents ou données que l'utilisateur choisit de relier ;
- Google Calendar pour les rendez-vous si le cas d'usage est validé ;
- Google Maps ou des services cartographiques pour la localisation d'entreprises ;
- Google Business Profile pour les informations de présence locale, uniquement via les accès et API autorisés et selon les permissions et règles de Google.

**Important :** « prévoir un lien » et « intégrer techniquement » sont deux niveaux différents. Un lien externe peut être ajouté sans connexion de compte. Une intégration API exige une application enregistrée, des autorisations explicites, une gestion sûre des jetons et la vérification des conditions du fournisseur. Ne pas supposer que les données Google Business Profile sont librement accessibles ou qu'un lien suffit pour les synchroniser.

Les connecteurs Google doivent être optionnels. MajestiOS doit rester utilisable par un client qui ne connecte aucun compte Google.

## 6. Principes CRM et modèle métier

Conserver la logique métier centrale : **Entreprise → Interlocuteur → Décideur**, puis lier l'opportunité, l'activité commerciale et la mémoire d'entreprise. Une activité peut être un appel, un rendez-vous, une note, une tâche, un e-mail ou une visioconférence future. Les types d'activités doivent être extensibles et partager une chronologie commune.

Ne pas dupliquer les mêmes données dans chaque module. Les entreprises, interlocuteurs, opportunités, sources et activités sont des objets métier liés, pas des mini-CRM indépendants. Les champs et relations physiques seront arrêtés après vérification des tomes et du modèle maître.

## 7. Sécurité, isolation et audit

- Isolation stricte des données entre organisations, contrôlée en base et côté serveur.
- Permissions explicites par rôle et action ; masquer un bouton ne constitue pas une protection.
- Administration plateforme séparée de l'administration client.
- Secrets API conservés côté serveur ou dans un coffre adapté ; jamais dans le code livré au navigateur.
- Journaliser les opérations sensibles sans enregistrer inutilement des données personnelles ou secrets.
- Valider côté serveur toutes les données de formulaire.
- Protéger les changements de rôles, suspensions, suppressions et exports.
- Tests obligatoires : un membre d'une organisation ne peut ni lire ni modifier les données d'une autre.

## 8. Étapes de livraison recommandées

1. **Maintenant — cadrage** : valider ce découpage avec le référentiel maître et le registre des écarts.
2. **MVP — structure** : poser la navigation protégée, les contrôles d'accès et des pages métier minimales, sans fausses données présentées comme réelles.
3. **MVP — CRM essentiel** : entreprises, interlocuteurs, opportunités, activités et tâches avec persistance réelle, seulement après validation du schéma et de l'environnement de développement.
4. **Administration client** : équipe, permissions et paramètres essentiels.
5. **Administration MajestiOS** : santé des sources, qualité, audit et gestion des incidents.
6. **Extensions** : connecter les outils au besoin, une intégration à la fois, avec tests et documentation.

Ne pas créer les tables, exécuter des migrations ou connecter les comptes Google à ce stade sur la seule base de cette ébauche. Il faut d'abord vérifier le référentiel maître, les règles d'accès et l'environnement DEV.

## 9. Points à confirmer avant codage

- Distinguer exactement le rôle « administrateur d'organisation cliente » du rôle « administrateur MajestiOS ».
- Valider les parcours CRM et les champs avec les tomes du cahier des charges.
- Confirmer le nom et le périmètre de chaque module métier.
- Confirmer les services Google nécessaires au MVP, plutôt que de connecter tous les services par défaut.
- Définir les données et permissions exigées par chaque connecteur.
- Décider si le tableau de bord est personnel, collectif, ou les deux.
- Valider l'architecture de déploiement avant d'ajouter des routes protégées.

---
**Fin du pré-cadrage — document de travail non validé.**
