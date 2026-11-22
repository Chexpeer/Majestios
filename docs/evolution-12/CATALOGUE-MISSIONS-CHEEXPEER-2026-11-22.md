# Catalogue de missions de Cheexpeer — décision du 22 novembre 2026

*Décision du propriétaire, mise par écrit avant toute construction. Elle répond à la question « comment simplifier le travail de Cheexpeer ». Elle s'inscrit dans le [périmètre d'action de Cheexpeer](PERIMETRE-ACTION-CHEEXPEER-2026-11-22.md) et dans l'[objectif d'accompagnement du cycle d'un appel d'offres](OBJECTIF-ACCOMPAGNEMENT-CYCLE-APPEL-OFFRES-2026-11-22.md).*

## Les mots du propriétaire
> Cheexpeer aura une quinzaine de missions au total, préenregistrées dans la base admin, qui seront sélectionnées dans la partie « Objet » et par menus déroulants dans le chat avec lui. « Objet » est un menu déroulant qui proposera un choix entre 10 et 15 missions, avec un menu « Autre » pour les messages libres.

## Ce qui est décidé
1. Cheexpeer dispose d'un **catalogue de 10 à 15 missions**, **préenregistrées dans la base de l'administration**.
2. Dans le Centre de commande, le champ **« Objet » devient un menu déroulant** qui liste ces missions.
3. Le menu contient une entrée **« Autre »** pour les messages libres, quand la demande ne correspond à aucune mission du catalogue.
4. Les missions peuvent aussi être choisies par **menus déroulants dans le chat** avec Cheexpeer (formulation du propriétaire, à préciser au moment de la conception : même catalogue, mêmes missions).
5. Choisir une mission du catalogue suffit : elle est **déjà définie**. On n'écrit plus la consigne à chaque fois.

## Ce que contient la définition d'une mission du catalogue
Chaque mission est une fiche enregistrée en base, avec :
| Champ | Rôle |
|---|---|
| Nom court (celui du menu) | Ce que l'administrateur voit et choisit |
| Phase du cycle | Avant · Après l'attribution · Après les travaux · Administration |
| Ce que Cheexpeer fait | Description claire, en une ou deux phrases |
| Informations à fournir | Les seuls champs à remplir (ex. code NAF, département) |
| Données utilisées | Sources autorisées, et seulement elles |
| Résultat attendu | Liste, tableau téléchargeable, brouillon, rapport |
| Limites | Lecture seule, aucun envoi, plafonds de taille |
| Validation | Toujours une validation humaine avant le lancement |
| Interrupteur | Outil activé ou désactivé (fermé par défaut) |

Elles reposent sur le **registre d'outils** déjà en place : une mission du catalogue n'agit que si son outil est activé par le propriétaire.

## Le menu « Autre »
- C'est le seul endroit où l'on écrit librement.
- Une demande libre **ne donne aucun pouvoir supplémentaire** : mêmes limites que les autres missions, lecture seule, validation humaine, aucun envoi.
- À décider avec le propriétaire : si une demande « Autre » est simplement transmise comme proposition à relire, ou traitée par Cheexpeer comme brouillon de mission.

## État au 22 novembre 2026
| Élément | État |
|---|---|
| Catalogue en base | **Non construit** |
| Champ « Objet » en menu déroulant | **Non construit** (aujourd'hui : zone de texte libre) |
| Menus déroulants dans le chat | **Non construits** (aujourd'hui : chat libre) |
| Missions déjà construites | Diagnostic (inerte) ; **mission n°1 « prospects de sous-traitance »**, sur Test, outil désactivé |
| Liste des 10 à 15 missions | **À fixer avec le propriétaire** (aucune liste arrêtée) |

## Missions candidates connues (non arrêtées)
Reprise de ce qui a déjà été évoqué, pour servir de base de discussion, sans aucune décision :
- **Après l'attribution** : prospects de sous-traitance (construite sur Test) ; pitch et façon de contacter les entreprises (plus tard) ; accompagnement des entreprises intéressées par une sous-traitance (plus tard).
- **Avant** : veille quotidienne des marchés selon les alertes ; fiche entreprise complète (clé SIREN) ; préparation d'un dossier de réponse.
- **Administration** : relecture préparatoire des annonces ; bilan hebdomadaire ; surveillance des changements d'une entreprise suivie.
- **Après les travaux** : à définir par le propriétaire.

## Ordre de travail prévu
1. Le propriétaire fixe la liste des missions du catalogue, avec leur phase.
2. Création de la table du catalogue en base (base de test d'abord), avec les fiches ci-dessus.
3. Le champ « Objet » lit ce catalogue ; l'entrée « Autre » reste libre.
4. Les menus déroulants du chat lisent le même catalogue.
5. Les missions s'ajoutent une par une, chacune avec sa fiche, ses tests et la décision d'activation du propriétaire.
6. Mise en production seulement sur décision explicite du propriétaire.
