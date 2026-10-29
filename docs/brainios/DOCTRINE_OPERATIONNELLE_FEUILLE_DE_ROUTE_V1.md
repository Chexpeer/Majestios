# BrainiOS — doctrine opérationnelle et feuille de route V1

**Version :** 1.0  
**Date :** 29 octobre 2026  
**Statut :** doctrine produit et cible d'architecture ; les capacités décrites ne sont pas toutes implémentées.  
**Dossier :** `docs/brainios/`  
**Branche de travail :** `refonte-profondeur-flux`

## 1. La raison d'être de BrainiOS

**BrainiOS est la mémoire économique, documentaire et opérationnelle de MajestiOS.** Il doit permettre de recueillir, conserver, relier, qualifier et réutiliser les informations utiles au développement commercial des entreprises.

Il ne s'agit ni d'un simple répertoire de documents ni d'un flux d'annonces supplémentaire. Sa valeur vient de la capacité à rapprocher des informations provenant de sources différentes, à les mettre en relation avec des besoins et des compétences, puis à préparer des actions commerciales pertinentes.

MajestiOS porte l'expérience utilisateur et les parcours métier ; BrainiOS fournit progressivement la connaissance structurée qui les alimente.

### Promesse produit

> **MajestiOS ne se contente pas de vous présenter les opportunités sur un plateau. Il vous donne les moyens de les gagner, vous aide à rencontrer les bons interlocuteurs au bon moment et transforme chaque expérience exploitable en occasion de progresser.**

MajestiOS peut faciliter des résultats, mais ne doit jamais garantir l'attribution d'un marché, l'existence d'un besoin non confirmé ou la réussite d'une mise en relation.

## 2. Principes fondateurs

1. **Collecter pour agir, pas pour accumuler.** Toute famille de données doit répondre à des usages métier identifiés.
2. **Relier les signaux.** Un même signal économique peut intéresser plusieurs métiers, services ou entreprises.
3. **Préserver la provenance.** Source, référence, date de publication, date de collecte et dernière vérification sont conservées lorsque disponibles.
4. **Séparer faits, hypothèses et décisions.** Toute inférence est identifiable comme telle et assortie d'un niveau de confiance ou d'une incertitude.
5. **Transformer la connaissance en action.** Une piste qualifiée peut alimenter une tâche, une prise de contact, une recherche de partenaire ou une proposition de rendez-vous.
6. **Apprendre des résultats.** Les succès, refus, échecs, abandons et retours terrain peuvent améliorer les recommandations futures, sans présenter une corrélation comme une certitude.
7. **Progresser par niveaux d'autonomie.** Observer, analyser, préparer, puis exécuter uniquement les actions explicitement autorisées.
8. **Protéger les personnes et les entreprises.** Respecter les droits d'accès, la confidentialité, les conditions de réutilisation des sources et les règles applicables aux données personnelles.
9. **Rester modulaire.** Une nouvelle source ou un nouveau métier doit pouvoir être ajouté sans reconstruire l'ensemble de la plateforme.
10. **Dire la vérité sur l'état du produit.** Une spécification, une maquette ou une donnée de démonstration ne doit jamais être présentée comme une capacité opérationnelle.

## 3. Les couches logiques

### 3.1 Sources et documents

Recueillir les données autorisées : appels d'offres publics et privés, BODACC, publications officielles, informations d'entreprises, événements professionnels, offres d'emploi, signaux de marché et documents transmis par les clients.

Chaque source doit être documentée : couverture, format, fréquence, conditions d'utilisation, qualité attendue, limites et méthode de vérification. L'indisponibilité d'une source doit être visible, pas remplacée par des données fictives.

### 3.2 Référentiel des entités

Décrire et relier les objets connus :
- entreprises, établissements et organisations clientes ;
- personnes et interlocuteurs professionnels, avec les protections nécessaires ;
- marchés, consultations, attributions et candidatures ;
- événements économiques et annonces de cession, vente ou reprise ;
- documents, sources, signaux et observations ;
- besoins, compétences, métiers, missions et territoires ;
- contacts, rendez-vous, tâches, décisions et résultats.

Les rapprochements doivent conserver leurs critères et leur degré de certitude. Deux noms proches ne suffisent pas à conclure qu'il s'agit de la même entité.

### 3.3 Moteur de qualification et de rapprochement

Le moteur doit pouvoir :
- normaliser et dédupliquer les données ;
- détecter les nouveautés et changements significatifs ;
- relier les signaux aux entreprises et aux territoires pertinents ;
- comparer un signal aux besoins exprimés par un client ;
- proposer plusieurs usages métiers pour un même signal ;
- évaluer la fraîcheur, la fiabilité, l'urgence et la pertinence ;
- exposer les éléments qui justifient chaque recommandation.

### 3.4 Actions commerciales

Les analyses doivent pouvoir déboucher, selon les autorisations, sur :
- une piste à vérifier ;
- une liste de prospects à qualifier ;
- une tâche assignée à un business developer ;
- un projet de message ou un plan de prise de contact ;
- une recherche de partenaire ou de sous-traitant ;
- une proposition de mise en relation ou de rendez-vous ;
- un dossier de préparation d'appel d'offres ;
- une alerte sur une échéance ou une action à réaliser.

Une recommandation n'est pas une action exécutée. Les deux statuts doivent être distincts et traçables.

### 3.5 Mémoire des résultats

Enregistrer les résultats utiles : contact établi ou non, rendez-vous accepté ou refusé, besoin confirmé ou infirmé, candidature complète ou incomplète, marché remporté ou perdu, motif connu, partenariat créé et prochaine action.

Ne collecter que les informations nécessaires et autorisées. Un refus de contact doit être respecté et empêcher les relances incompatibles avec ce refus.

## 4. Le BODACC : une source transversale, pas une rubrique isolée

Le BODACC peut alimenter plusieurs parcours de MajestiOS, sous réserve de vérifier la nature exacte de chaque publication, son actualité et les droits de réutilisation.

Exemples d'usages possibles à qualifier :
- **cession, vente ou reprise d'entreprise :** pistes pour les entrepreneurs, repreneurs, intermédiaires et experts concernés ;
- **création, évolution ou changement d'établissement :** signaux potentiels pour des fournisseurs, prestataires, acteurs de l'immobilier d'entreprise, de l'aménagement ou du déménagement ;
- **croisement avec un marché attribué :** pistes de fournisseurs, de sous-traitance, de recrutement ou d'équipement, sans supposer que ces besoins existent avant vérification.

La publication d'un événement ne prouve pas, à elle seule, qu'une entreprise cherche un prestataire, souhaite vendre, dispose d'un budget ou accepte d'être contactée. BrainiOS doit présenter les possibilités comme des pistes à qualifier.

La même logique transversale doit s'appliquer aux autres sources : la donnée est conservée une seule fois dans le référentiel partagé, puis mobilisée par les modules autorisés qui en ont besoin.

## 5. Appels d'offres : aider à se donner les moyens de gagner

Le parcours ne doit pas s'arrêter à la découverte d'un avis. MajestiOS doit progressivement aider l'entreprise à comprendre si elle peut répondre et comment renforcer sa candidature.

Capacités cibles, à développer et tester progressivement :
1. filtrer les avis selon les capacités, les métiers, le territoire et les critères de l'entreprise ;
2. extraire et structurer les exigences, échéances et pièces attendues à partir de documents autorisés ;
3. signaler les critères non couverts, les pièces manquantes et les risques de non-conformité ;
4. identifier les compétences, références ou moyens potentiellement manquants ;
5. rechercher des partenaires ou sous-traitants complémentaires ;
6. aider à préparer une liste de contrôle et un dossier de réponse ;
7. suivre les résultats et les motifs de non-sélection lorsqu'ils sont connus ;
8. transformer les enseignements en actions correctives pour les candidatures suivantes.

L'outil aide à la préparation et au contrôle ; le candidat reste responsable du contenu final et de sa soumission.

## 6. L'échec comme matière d'apprentissage

**Un échec ne doit pas être une impasse : c'est une occasion de comprendre, de corriger et de progresser.**

Pour chaque résultat commercial exploitable, BrainiOS peut conserver :
- le contexte et l'objectif initial ;
- les informations effectivement disponibles au moment de la décision ;
- l'action réalisée et son statut ;
- le résultat connu et sa source ;
- le motif déclaré, s'il existe ;
- les facteurs confirmés, les hypothèses et les points inconnus ;
- les mesures correctives proposées ;
- le résultat d'une éventuelle action corrective ultérieure.

Un motif ne doit pas être inventé lorsque le donneur d'ordre n'a pas fourni d'explication. Le système doit aussi apprendre des succès : comprendre les facteurs associés aux résultats favorables, sans conclure automatiquement qu'ils en sont la cause.

Les leçons doivent être réutilisées dans le respect des droits d'accès : l'expérience confidentielle d'un client ne devient pas automatiquement visible aux autres clients. Les connaissances agrégées ou anonymisées nécessitent des règles spécifiques.

## 7. Niveaux d'autonomie

| Niveau | Capacité | Garde-fou |
|---|---|---|
| A0 — Documenter | Décrire une source, une règle ou une idée | Aucun effet opérationnel |
| A1 — Observer | Collecter et archiver dans un périmètre autorisé | Provenance, fréquence et erreurs tracées |
| A2 — Analyser | Dédupliquer, comparer, classer et proposer des pistes | Incertitudes et justification visibles |
| A3 — Préparer | Préparer tâches, dossiers, messages et rendez-vous proposés | Aucune action externe implicite |
| A4 — Agir sous autorisation | Exécuter certaines actions explicitement permises | Permissions, limites, journal et arrêt possible |
| A5 — Optimiser sous contrôle | Adapter les recommandations à partir de résultats vérifiés | Évaluation, supervision, versionnage et retour arrière |

Le passage à un niveau supérieur doit être explicite, testé et limité par type d'action. La prise de rendez-vous, l'envoi de messages, le partage de données et les engagements au nom d'un client nécessitent des permissions adaptées.

## 8. Architecture de données : exigences avant toute migration

Avant de créer des tables ou des migrations, définir et valider les objets métier, leurs relations, les règles de conservation et les autorisations. Les objets candidats comprennent notamment :
- `sources` et `source_observations` ;
- `documents` et leurs versions ;
- `entities` et les liens entre entités ;
- `economic_signals` ;
- `opportunities` ;
- `qualification_assessments` ;
- `business_needs` et `capabilities` ;
- `recommendations` et `commercial_actions` ;
- `outcomes` et `learning_records` ;
- `audit_events`.

Cette liste est conceptuelle, pas un schéma SQL validé. Il faudra éviter les doublons entre objets existants et futurs. Toute donnée rattachée à un client doit respecter l'isolation entre organisations, les permissions serveur et les règles de sécurité de la base.

## 9. Feuille de route priorisée

### Lot 1 — Fondations et vérité fonctionnelle
- stabiliser la navigation et les pages distinctes ;
- vérifier les parcours réels, les formulaires et les destinations ;
- distinguer visiblement fonctions actives, en préparation et exemples ;
- confirmer le fonctionnement du connecteur BOAMP de bout en bout ;
- conserver une sauvegarde identifiable avant chaque lot significatif.

### Lot 2 — Modèle de connaissance
- inventorier les sources et les conditions d'utilisation ;
- définir le vocabulaire partagé des entreprises, sources, signaux, opportunités, besoins et résultats ;
- spécifier provenance, fraîcheur, confiance, déduplication et historique ;
- documenter le BODACC comme source transversale ;
- ne pas lancer de migration avant validation des objets et des règles d'accès.

### Lot 3 — Premier cycle vérifiable
- commencer par une collecte en lecture seule d'une source fiable ;
- conserver les références et dates ;
- comparer deux collectes successives ;
- produire une synthèse des nouveautés et des incertitudes ;
- mesurer les erreurs, doublons et faux positifs.

### Lot 4 — Qualification et réseau commercial
- relier les pistes à des besoins clients explicites ;
- préparer les tâches de qualification pour les business developers ;
- suivre les contacts et les rendez-vous sans inventer de résultats ;
- respecter les consentements, refus et permissions.

### Lot 5 — Préparation et apprentissage des candidatures
- structurer les exigences d'un dossier d'appel d'offres ;
- créer des contrôles de complétude et de conformité ;
- enregistrer les résultats et motifs connus ;
- produire des recommandations correctives explicables.

### Lot 6 — Automatisation contrôlée
- définir les actions autorisées et leurs limites ;
- commencer par des brouillons et validations ;
- tester les erreurs, reprises, doublons et mécanismes d'arrêt ;
- n'activer l'exécution externe qu'après preuve de fonctionnement et autorisation explicite.

## 10. Critères de réussite

BrainiOS progresse lorsque les résultats sont démontrables, pas seulement lorsque davantage de documents sont stockés. Mesures à prévoir :
- proportion des éléments avec source et dates vérifiables ;
- taux de doublons et de données périmées ;
- précision des pistes qualifiées et taux de faux positifs ;
- temps entre détection et qualification ;
- proportion de recommandations acceptées par les équipes ;
- contacts et rendez-vous effectivement obtenus ;
- complétude des candidatures et erreurs détectées avant soumission ;
- motifs d'échec documentés lorsqu'ils sont disponibles ;
- amélioration mesurable des processus sans exposition indue des données ;
- coût et fiabilité de chaque automatisation.

## 11. Règle de gouvernance

Ce document fixe une direction produit et des exigences de conception. Il ne prouve pas que ces fonctions sont déjà disponibles. Toute implémentation doit être liée à des tâches, des tests d'acceptation et une preuve de fonctionnement. Aucune action en production, modification de déploiement ou migration de données n'est autorisée par ce document seul.
