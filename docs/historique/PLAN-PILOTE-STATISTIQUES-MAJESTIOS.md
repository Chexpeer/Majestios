# Plan pilote — statistiques et études commerciales MajestiOS

**Date :** 1er novembre 2026  
**Statut :** plan de travail proposé ; ne vaut pas validation du Fondateur, ni implémentation, ni autorisation de commercialiser.  
**Branche :** `chantier-recherche-donnees-gardes-fous-2026-11-01`

## 1. Objectif du pilote

Vérifier qu'un ensemble limité de données fiables peut produire des indicateurs utiles à des décisions commerciales, puis mesurer si ces indicateurs ont une valeur pour des utilisateurs professionnels. Le pilote doit produire des statistiques explicables et reproductibles, pas un score opaque.

## 2. Périmètre proposé

### Premier cas d'usage
Analyse d'un secteur professionnel sur un territoire pilote, avec comparaison des entreprises et des attributions de marchés publics sur une période définie. Le secteur et le territoire seront arrêtés après inventaire des données et validation du Fondateur.

### Sources prioritaires à évaluer
1. **DECP — données essentielles de la commande publique**, jeux publiés par la Direction des affaires juridiques / Ministère de l'Économie, avec licence affichée sur chaque jeu et périmètre temporel documenté.
2. **Sirene / Annuaire des Entreprises**, pour l'identité de l'unité légale et des établissements, activité et géographie.
3. **INPI / RNE — comptes annuels non confidentiels**, pour les données financières effectivement publiées et accessibles dans le cadre d'accès en vigueur.
4. **BODACC**, pour les événements d'entreprise publiés, traités séparément des données de marchés et du statut immobilier.
5. Sources statistiques territoriales et d'emploi, uniquement pour les indicateurs qui seront retenus dans le pilote.

Références officielles de départ :
- DECP valides (Ministère de l'Économie) : https://data.economie.gouv.fr/explore/assets/decp-v3-marches-valides/
- DECP consolidées, licence et fichiers : https://www.data.gouv.fr/datasets/donnees-essentielles-de-la-commande-publique-fichiers-consolides
- INSEE / Sirene : https://www.insee.fr/fr/information/3591226
- INPI / accès API Entreprises et comptes annuels non confidentiels : https://data.inpi.fr/content/editorial/Acces_API_Entreprises
- BODACC / données ouvertes et API : https://www.bodacc.fr/pages/donnees-ouvertes-et-api/
- CNIL / réutilisation de données publiquement accessibles : https://www.cnil.fr/fr/recommandations-reutilisateurs-donnees-internet

Ces pages constituent des pistes documentaires. L'accès, la licence, les champs disponibles, la couverture réelle, la redistribution et le droit d'usage pour chaque finalité MajestiOS doivent être validés séparément. Une licence ouverte affichée pour un jeu ne règle pas automatiquement les questions relatives aux données personnelles ni les conditions d'autres sources enrichissantes.

## 3. Indicateurs de première version

### Groupe A — Structure du tissu économique
- Nombre d'unités légales / établissements identifiés dans le périmètre.
- Répartition par code APE/NAF et commune/département.
- Part des enregistrements dont l'identité et le statut sont suffisamment documentés.

### Groupe B — Présence dans les marchés publics
- Nombre de marchés attribués identifiés dans le périmètre et la période.
- Nombre de titulaires distincts identifiés.
- Nombre d'acheteurs publics distincts.
- Répartition par métier/territoire/acheteur lorsque les données sont comparables.
- Montants publiés, séparés selon leur définition exacte ; ne pas les assimiler au chiffre d'affaires réalisé.
- Part des enregistrements dont le titulaire peut être rapproché avec confiance d'une unité légale.

### Groupe C — Dynamique économique
- Chiffre d'affaires publié par exercice, si accessible et non confidentiel.
- Variation entre exercices comparables uniquement.
- Présence ou absence de données financières documentée avec un statut explicite.
- Mise en regard descriptive avec les marchés attribués, sans inférer une causalité.

### Groupe D — Signaux complémentaires
- Créations, cessations et procédures collectives publiées.
- Offres d'emploi ou compétences recherchées, si source autorisée.
- Signaux immobiliers explicites uniquement ; les événements d'entreprise restent des indices à vérifier.

## 4. Indicateurs interdits sans données suffisantes

- « Taux de réussite aux appels d'offres » sans données fiables sur les candidatures déposées et les résultats.
- « Entreprise jamais attributaire » à partir d'une simple absence de correspondance.
- « Entreprise en difficulté » déduite d'une baisse de chiffre d'affaires ou d'un événement isolé.
- « Solvabilité », « rentabilité » ou « capacité à exécuter un marché » déduites du seul chiffre d'affaires.
- « Local disponible à la vente/location » déduit d'une cessation ou d'une procédure collective.
- Tout score individuel sans définition, preuves, couverture et limites visibles.

## 5. Modèle de données minimal pour les statistiques

Pour chaque valeur calculée :
- `metric_id`, libellé et définition ;
- formule/version de calcul ;
- unité, périmètre géographique, secteur et période ;
- source(s), identifiants source et URL de référence ;
- dates de publication, collecte et mise à jour ;
- nombre d'enregistrements inclus/exclus et règles de dédoublonnage ;
- taux de rapprochement d'identité et limites de couverture ;
- distinction entre valeur observée, valeur calculée, estimation et commentaire ;
- statut qualité : provisoire, contrôlé, insuffisant ou retiré ;
- avertissements visibles pour l'utilisateur.

## 6. Méthode de contrôle qualité

1. Constituer un échantillon limité à partir de sources officiellement accessibles.
2. Examiner les champs, formats, doublons, périodes, identifiants de titulaire et données manquantes.
3. Rapprocher les entreprises par identifiants robustes (SIREN/SIRET lorsque disponibles), sans fusion sur le seul nom.
4. Vérifier manuellement un échantillon de rapprochements positifs et négatifs.
5. Comparer les agrégats avec les statistiques ou tableaux publiés par la source lorsque disponibles.
6. Documenter les biais : couverture des acheteurs, retards de publication, identifiants manquants, comptes confidentiels, différences de périodes.
7. Recalculer les indicateurs à partir de la même version de données et vérifier la reproductibilité.
8. Publier un tableau de bord seulement si les limites sont compréhensibles et le résultat suffisamment utile.

## 7. Hypothèse de produit à tester

Tester d'abord deux formats :
- **Rapport synthétique** : quelques graphiques, une carte, une synthèse méthodologique et des pistes d'action.
- **Tableau de bord professionnel** : filtres par secteur, territoire, période et acheteur, avec provenance et couverture visibles.

Ne pas engager la construction d'une API commerciale ni la vente de fichiers bruts avant validation de la demande, des coûts, des droits et de la gouvernance.

## 8. Critères de passage à l'étape suivante

Le pilote peut être considéré comme prêt pour une expérimentation utilisateur lorsque :
- le secteur et le territoire sont explicitement fixés ;
- les sources et conditions d'usage sont documentées ;
- les données d'exemple sont traçables ;
- les indicateurs sont définis et reproductibles ;
- les données manquantes ne sont pas transformées en zéros ;
- les résultats sont accompagnés d'indicateurs de couverture ;
- aucun taux ou classement trompeur n'est affiché ;
- les contraintes de confidentialité, de réutilisation et de diffusion ont été examinées ;
- un utilisateur cible peut expliquer quelle décision le rapport l'aide à prendre.

## 9. Ordre de travail

1. Finaliser l'inventaire des champs et sources disponibles dans le prototype.
2. Évaluer en priorité DECP, Sirene et INPI/RNE (comptes annuels non confidentiels).
3. Documenter couverture, licences, accès, identifiants, dates et restrictions.
4. Sélectionner un secteur et un territoire pilote.
5. Produire un petit jeu d'essai reproductible et vérifier manuellement les rapprochements.
6. Définir les formules et tests.
7. Générer le rapport prototype avant de construire une interface permanente.
8. Faire évaluer le rapport par des utilisateurs potentiels.
9. Décider ensuite du tableau de bord, de l'abonnement et des études payantes.

## 10. Garde-fous commerciaux et juridiques

- Ne pas vendre une information dont la source ou la méthode n'est pas traçable.
- Ne pas vendre une garantie de succès commercial.
- Ne pas diffuser des données personnelles ou fichiers de contacts sans examen de la finalité, base légale, information, opposition et règles de prospection applicables.
- Ne pas confondre licence de données ouvertes et autorisation générale de réutiliser n'importe quelle donnée personnelle.
- Ne pas automatiser la prise de contact uniquement à partir d'un signal statistique.
- Tenir compte des restrictions de diffusion partielle des données Sirene et de la confidentialité des comptes annuels.
- Toute commercialisation reste conditionnée à une validation juridique et à l'approbation du Fondateur.


## Actualisation du statut — 2 novembre 2026

Ce document reste un plan pilote proposé, non une étude exécutée ni une offre commercialisable. Le workflow CI consulté le 2 novembre ne fournit pas de preuve d'un jeu de données statistique consolidé, d'indicateurs calculés sur un périmètre représentatif, d'un tableau de bord validé ou d'une étude livrée à un client. Les connectivités BOAMP/BODACC testées ne suffisent pas à établir la qualité, la couverture ou la réutilisabilité de données statistiques. Le pilote devra expliciter période, territoire, population, dénominateurs, données manquantes, biais et provenance avant toute interprétation ou diffusion. [Résultat CI consulté](https://github.com/Chexpeer/Majestios/actions/runs/41460016382).
