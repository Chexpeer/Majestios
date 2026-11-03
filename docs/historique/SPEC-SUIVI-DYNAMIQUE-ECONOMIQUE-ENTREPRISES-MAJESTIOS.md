# Spécification — Suivi de la dynamique économique des entreprises ciblées

**Date :** 1er novembre 2026  
**Statut :** spécification fonctionnelle à valider par les tests et l'analyse des sources ; aucune connexion financière supplémentaire n'est déclarée opérationnelle par ce document.

## 1. Objectif

Enrichir la qualification des entreprises candidates à un marché par un suivi parallèle de leur dynamique économique, afin d'aider l'utilisateur à prioriser ses recherches commerciales et à contextualiser une prise de contact. Cette fonction complète le ciblage par APE/NAF, géographie et statut ; elle ne doit pas devenir un filtre automatique d'exclusion.

## 2. Données financières à distinguer

Pour chaque entreprise, conserver séparément, lorsque disponibles :

- chiffre d'affaires publié pour un exercice identifié ;
- date de clôture de l'exercice et date de publication/collecte ;
- évolution absolue et relative par rapport à l'exercice comparable précédent ;
- résultat net et autres indicateurs éventuels, dans des champs séparés du chiffre d'affaires ;
- source, URL de preuve, identifiant de l'entreprise, horodatage de collecte et statut de vérification ;
- état de disponibilité : publié, confidentiel/non publiable, absent de la source, non trouvé, à vérifier.

Ne jamais remplacer une donnée absente par zéro. Ne jamais mélanger CA, résultat net, estimation ou montant de marché. Une estimation éventuelle doit être explicitement étiquetée, documentée et exclue des chiffres présentés comme officiels.

## 3. Identification et rapprochement

- Utiliser le SIREN comme clé de rapprochement de l'entité juridique, en conservant les SIRET des établissements séparément.
- Contrôler les changements de dénomination, transformations, fusions, cessations et identifiants incohérents.
- Comparer des exercices comparables et afficher la période exacte ; ne pas comparer des exercices de durées différentes sans signalement.
- Préserver les données brutes de la source, la normalisation appliquée et la provenance.
- Gérer les dépôts de comptes confidentiels sans tenter de contourner les restrictions d'accès ou de publication.

## 4. Présentation à l'utilisateur

Sur la fiche entreprise, présenter si les données sont disponibles :
1. chiffre d'affaires et exercice ;
2. variation par rapport au précédent exercice comparable ;
3. date et source de la donnée ;
4. indicateur de confiance/provenance, sans score opaque ;
5. avertissement sur les limites et la fraîcheur.

Si la donnée n'est pas disponible, afficher « non disponible dans les sources consultées » avec le motif connu. Ne pas afficher « 0 € » pour signifier l'absence de données.

## 5. Interprétation et garde-fous

- Une hausse ou une baisse du CA n'établit pas à elle seule la santé financière, la rentabilité, la trésorerie, la capacité d'exécuter un marché ni la volonté de répondre.
- Une croissance rapide peut être liée à une acquisition, un changement de périmètre ou une variation comptable ; une baisse peut avoir des causes ponctuelles.
- Ne pas écarter automatiquement une petite entreprise, une entreprise en croissance, une structure récemment créée ou une entreprise dont les comptes sont confidentiels.
- Afficher des faits séparément des interprétations et des recommandations.
- Les recommandations de priorisation doivent rester explicables et paramétrables ; aucun contact ni message automatique ne découle de la seule observation du CA.
- Respecter les licences, conditions d'utilisation, droits de réutilisation, obligations de mise à jour et règles applicables aux données d'entreprise.

## 6. Sources à étudier et valider avant activation

Priorité à l'identification des sources officielles et de leurs conditions d'utilisation : comptes annuels et données ouvertes disponibles via les services publics compétents, données d'entreprises et annonces légales, et autres fournisseurs autorisés si un besoin de couverture demeure. Pour chaque source, documenter endpoint ou mode d'accès, champs, fréquence de mise à jour, limites de couverture, licence, restrictions de diffusion, coûts éventuels et méthode de preuve.

Le registre des ressources doit distinguer :
- source identifiée ;
- source analysée ;
- accès/API techniquement testé ;
- droits et conditions de réutilisation validés ;
- connecteur opérationnel surveillé.

Aucune source ne doit être présentée comme connectée avant validation de ces étapes.

## 7. Intégration au CRM

Prévoir à terme un historique daté des observations financières, la provenance, la période comptable, l'état de disponibilité, les modifications détectées, et la date du prochain contrôle. Les événements financiers ou administratifs ne doivent pas écraser les observations antérieures. Le CRM doit pouvoir différencier fait source, calcul dérivé, interprétation et action humaine.

## 8. Tests d'acceptation

- CA absent ou confidentiel : aucun zéro artificiel, aucune exclusion automatique.
- Une valeur sans exercice, source ou date : signalée comme incomplète.
- Exercices incomparables : variation non calculée ou accompagnée d'un avertissement explicite.
- Doublons et identifiants incohérents : rapprochés avec prudence, sans fusion silencieuse.
- Valeur officielle et estimation : affichées dans des catégories différentes.
- Baisse de CA : ne produit pas seule un diagnostic de difficulté ou un blocage commercial.
- Toute fiche présente la provenance et la fraîcheur de la donnée.
- Aucun appel externe, enregistrement CRM ou contact commercial n'est déclenché implicitement par l'analyse.

## 9. Séquencement recommandé

1. Inventorier les champs financiers déjà disponibles dans les sources existantes.
2. Vérifier les sources officielles, la couverture et les droits de réutilisation.
3. Définir le modèle de données et les états de disponibilité.
4. Construire des tests sur les cas confidentiels, absents, incomplets et non comparables.
5. Ajouter une vue de fiche entreprise sans rendre le CA obligatoire pour la qualification.
6. Brancher le suivi périodique seulement après validation de la fréquence, du coût et de la conformité.


## Actualisation du statut — 2 novembre 2026

La présente fonction demeure une spécification à valider. Le workflow du 2 novembre ne démontre aucune connexion financière nouvelle, aucun rapprochement persistant d'entreprises et aucun calcul de dynamique économique exploitable en production. Les contrôles BOAMP/BODACC réussis concernent la connectivité de ces deux sources seulement et ne prouvent pas l'accès aux comptes financiers. Les sources financières, leurs droits de réutilisation, la fraîcheur, la couverture et les règles de rapprochement doivent être validés séparément avant toute présentation de données ou recommandation. [Résultat CI consulté](https://github.com/Chexpeer/Majestios/actions/runs/41460016382).
