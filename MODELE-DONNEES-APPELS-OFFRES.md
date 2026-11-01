# Modèle de données — résultats d’appels d’offres MajestiOS

Version : 2026-10-31  
Branche de travail : `correction-accueil-zone-industrielle`

## Objectif

Normaliser les annonces pour que les huit pages de catégories partagent le même contrat de données, quelle que soit la source consultée. Le schéma machine est défini dans `schemas/opportunite.schema.json`.

## Règles de publication

1. Une annonce présentée comme réelle doit provenir d'une source consultée et identifiable.
2. Conserver le nom de la source, son URL, l'identifiant source quand il existe, la date de publication et la date de dernière vérification.
3. Distinguer la date de publication, la date limite de réponse et la date de récupération.
4. Ne pas inventer l'acheteur, les coordonnées, les lots ou les échéances absentes de la source.
5. Une annonce expirée, retirée ou non vérifiée ne doit pas être présentée comme une opportunité ouverte.
6. Les pages affichent actuellement zéro annonce réelle : ce schéma prépare les intégrations, il ne signifie pas qu'un connecteur fonctionne déjà.

## Champs essentiels

- `id` : identifiant interne stable.
- `sourceId` : identifiant d'origine, si fourni.
- `title`, `summary`, `description` : contenu éditorial de l'annonce.
- `category` : une des huit catégories actives.
- `marketType` : `public` ou `private`.
- `buyerName` : acheteur ou donneur d'ordre publié par la source.
- `location` : libellé, commune, code postal, département et région lorsqu'ils sont connus.
- `publishedAt`, `deadlineAt` : dates normalisées au format date-heure ISO 8601.
- `source`, `sourceUrl`, `documentUrls` : traçabilité.
- `status` : `published`, `updated`, `closed`, `withdrawn` ou `to_verify`.
- `verifiedAt`, `lastSeenAt`, `provenance` : fraîcheur et auditabilité.
- `tags`, `lots` : recherche et granularité métier.

## Correspondance des catégories

| Valeur interne | Page |
| --- | --- |
| `services` | `categorie-services-numeriques.html` |
| `travaux` | `categorie-travaux-amenagement.html` |
| `conseil` | `categorie-conseil-etudes.html` |
| `batiment` | `categorie-batiment.html` |
| `renovation` | `categorie-renovation.html` |
| `electricite` | `categorie-electricite.html` |
| `plomberie` | `categorie-plomberie-chauffage.html` |
| `maintenance` | `categorie-maintenance.html` |

## Règles de filtrage prévues

Les critères sont combinés par intersection :
- catégorie exacte ;
- type de marché si `public` ou `private` est sélectionné ;
- zone uniquement si la donnée de localisation est suffisamment renseignée ;
- mots-clés recherchés dans le titre, le résumé, la description et les tags ;
- date limite future et statut exploitable pour les opportunités ouvertes.

La recherche textuelle devra être insensible à la casse et aux accents. Le moteur BOAMP utilise une correspondance explicite des régions administratives vers les codes départementaux et vérifie le département de prestation ou celui de l’acheteur. Le moteur BODACC filtre les régions métropolitaines avec son propre champ régional ; si une zone n’est pas prise en charge de manière fiable, la recherche doit le signaler explicitement au lieu de renvoyer des résultats non filtrés.

## Étapes d'intégration

1. Valider un premier connecteur de source et ses conditions d'accès.
2. Transformer les enregistrements entrants vers ce schéma.
3. Dédupliquer à partir de l'identifiant source et, en second recours, d'une empreinte contrôlée.
4. Vérifier la fraîcheur et les échéances.
5. Alimenter les pages de catégories par une API ou une requête de base de données.
6. Tester les filtres combinés et les états vide, erreur de source, résultat expiré et résultat non vérifié.

Aucun scraping, appel API ni collecte de coordonnées n'est réputé actif tant que l'intégration n'a pas été développée et testée.
