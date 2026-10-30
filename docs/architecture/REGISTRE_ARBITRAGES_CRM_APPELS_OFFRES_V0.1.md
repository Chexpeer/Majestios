# MajestiOS — Registre des arbitrages CRM et appels d’offres V0.1

- **Date :** 30 octobre 2026
- **Branche :** `refonte-profondeur-flux`
- **Statut :** registre de travail ; les recommandations ne valent pas validation du référentiel maître.
- **Objet :** éviter de transformer des ambiguïtés métier en contraintes de base de données difficiles à corriger.

## 1. Lecture des statuts

- **À confirmer dans le référentiel maître** : vérifier les tomes faisant autorité avant de trancher.
- **Recommandation technique** : proposition à retenir si elle ne contredit pas le référentiel.
- **Bloquant avant migration** : aucune migration physique ne doit être créée tant que le point n’est pas résolu ou explicitement reporté avec une solution sûre.

## 2. Registre des décisions

| ID | Sujet | Recommandation de travail | Statut | Pourquoi c’est important |
|---|---|---|---|---|
| CRM-01 | Organisation cliente / entreprise prospectée | Deux concepts distincts. L’organisation cliente porte les membres et les données privées ; l’entreprise référencée représente une entité commerciale suivie ou détectée. | Bloquant avant migration | Évite les confusions d’identité et les fuites de données. |
| CRM-02 | Utilisateur / membre | L’identité d’un utilisateur est globale ; son appartenance et son rôle sont définis par une adhésion active à une organisation. Un compte seul ne donne pas accès à un espace client. | À confirmer dans le référentiel maître | Permet plusieurs membres et, si autorisé, plusieurs organisations par utilisateur. |
| CRM-03 | Référentiel d’entreprises partagé | Ne pas rendre le référentiel global accessible par défaut. Commencer par une séparation explicite entre données de source partageables et annotations privées du client ; décider ensuite si une référence commune est juridiquement et techniquement justifiée. | Bloquant avant migration | La provenance publique ne rend pas toutes les données dérivées librement partageables. |
| CRM-04 | Avis source / opportunité suivie | L’avis source est un enregistrement externe normalisé ; l’opportunité suivie est le dossier de travail propre à une organisation cliente. Un avis peut être suivi séparément par plusieurs clients. | Recommandation technique | Sépare la donnée détectée du travail, des notes et des décisions du client. |
| CRM-05 | Dossier de consultation | Créer un objet métier distinct, relié à l’opportunité suivie, seulement lorsqu’il existe un véritable travail de préparation d’une réponse. | À confirmer dans le référentiel maître | Évite de transformer chaque résultat de recherche en dossier de réponse complet. |
| CRM-06 | Mission / tâche | Ne pas les fusionner par défaut. Une tâche est une action ponctuelle ; une mission est un ensemble opérationnel avec responsable, état et éventuellement plusieurs tâches. | À confirmer dans le référentiel maître | Les cycles de vie, responsabilités et permissions peuvent différer. |
| CRM-07 | Activité commerciale | Prévoir une chronologie d’activités reliées au contexte autorisé (entreprise, interlocuteur, opportunité ou dossier) ; vérifier côté serveur la cohérence de toutes les relations. | Recommandation technique | Empêche les liens croisés incohérents et conserve l’historique commercial. |
| CRM-08 | Documents | Métadonnées en base, fichiers dans un stockage privé, accès par autorisation ; prévoir versions et traçabilité avant le dépôt de documents client. | Bloquant avant tout dépôt réel | Un formulaire de téléchargement n’est pas sûr sans contrôle d’accès et politique de conservation. |
| CRM-09 | Sources et faits | Chaque fait externe garde sa source, son identifiant, son URL lorsqu’elle existe, ses dates et sa valeur d’origine. Les rapprochements et hypothèses IA sont étiquetés séparément. | Recommandation technique | Rend la qualification explicable et permet de corriger les erreurs sans perdre la provenance. |
| CRM-10 | Attribution d’un marché | Une attribution publiée est un signal sourcé ; un besoin potentiel de sous-traitance reste une hypothèse jusqu’à confirmation. Aucun statut de client n’est déduit automatiquement d’une attribution. | Recommandation technique | Protège la fiabilité commerciale et évite les affirmations non démontrées. |
| CRM-11 | Rôles et permissions | Établir une matrice rôle × action, puis l’implémenter côté serveur et dans les politiques de base ; les contrôles d’interface ne sont qu’un complément. | Bloquant avant ouverture de l’espace client | Les rôles client, administrateur client et administrateur plateforme doivent rester distincts. |
| CRM-12 | Isolation multi-organisation | Toute donnée de travail privée est rattachée à une organisation. Les politiques de base et les tests négatifs doivent prouver qu’un membre d’une organisation ne peut pas lire ou modifier les données d’une autre. | Bloquant avant ouverture de l’espace client | Une simple colonne `tenant_id` ou un UUID ne suffit pas sans politiques vérifiées. |
| CRM-13 | Authentification et fournisseur de données | Le dépôt contient un `.env.example` préparé pour Supabase, mais l’application ne déclare pas actuellement les dépendances Supabase dans `package.json`. Confirmer le projet DEV, les accès et le fournisseur avant d’ajouter la configuration réelle. | Bloquant avant intégration | Évite de coder contre un service supposé disponible ou de toucher par erreur à la production. |
| CRM-14 | Audit et rétention | Définir les événements sensibles à journaliser, les durées de conservation et les droits d’export/suppression avant la mise en service. Exclure les secrets des journaux. | À confirmer dans le référentiel maître | La traçabilité ne doit ni divulguer de secrets ni conserver sans limite. |
| CRM-15 | Coûts et interactions IA | Une interaction IA doit pouvoir être reliée à son organisation et à son contexte autorisé, avec modèle, horodatage, statut et consommation lorsque connue ; ne jamais enregistrer de clé secrète. | À confirmer dans le référentiel maître | Nécessaire pour diagnostiquer les erreurs et maîtriser les coûts sans surcollecter les données. |

## 3. Contrôle du dépôt au 30 octobre 2026

L’inspection de la branche `refonte-profondeur-flux` a établi les points suivants :

- `package.json` contient Next.js, React, TypeScript, ESLint et Vitest ; aucune dépendance Supabase n’y est déclarée.
- `.env.example` contient des variables d’exemple Supabase vides. Cela ne prouve ni qu’un projet Supabase existe, ni que les identifiants sont configurés.
- L’arborescence examinée ne montre pas de dossier `supabase/`, de migrations SQL ou de tests RLS.
- Le code de recherche BOAMP est distinct du futur CRM persistant ; sa présence ne prouve pas l’existence de stockage client.
- Aucun test local, build, test navigateur ou contrôle de sécurité n’a été exécuté dans le cadre de ce relevé.

Ces constats sont limités au dépôt et à la branche examinés ; ils ne permettent pas de conclure sur d’éventuels services externes non visibles dans le code.

## 4. Séquence de mise en œuvre recommandée

1. Confronter les décisions CRM-01 à CRM-15 aux tomes du référentiel maître et consigner les écarts.
2. Confirmer le fournisseur de données et identifier un environnement DEV sans toucher à la production.
3. Définir le modèle relationnel, les contraintes et les transitions d’état à partir des décisions validées.
4. Implémenter identité, organisation, adhésion et permissions avant les données métier.
5. Ajouter un parcours vertical minimal : entreprise → interlocuteur → opportunité suivie → activité, persistant après rechargement.
6. Écrire les tests d’isolation et les tests d’accès négatifs avant d’ouvrir le parcours à des utilisateurs.
7. Étendre aux dossiers de consultation, échéances et documents, puis à l’enrichissement par avis d’attribution.

## 5. Critère de passage à la conception SQL

La conception SQL ne démarre que lorsque :
- les entités organisation cliente, entreprise référencée, avis source, opportunité suivie et dossier de consultation sont distinctes et validées ;
- les rôles et permissions sont définis ;
- le périmètre de partage des données est décidé ;
- l’environnement DEV et le fournisseur sont confirmés ;
- les exigences d’isolation, d’audit, de fichiers et de rétention sont traduites en contraintes et tests.

**Ce registre ne constitue pas une validation du modèle physique et ne crée aucune migration.**
