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
| Liste des 10 à 15 missions | **Proposée** (14 missions + « Autre »), à valider par le propriétaire |

## Liste proposée des missions — à valider par le propriétaire
*Établie le 22 novembre 2026 à la demande du propriétaire (« tu te bases sur la documentation pour établir les missions de Cheexpeer »). Chaque mission vient d'un texte déjà écrit ; la dernière colonne dit lequel. Rien n'est construit sauf la n°5. Toutes : lecture seule, aucun envoi, validation humaine, niveaux N1 à N3 du cahier des charges.*

| N° | Phase | Mission (nom du menu) | Ce que Cheexpeer fait | Source dans la documentation |
|---|---|---|---|---|
| 1 | Avant | Analyser un appel d'offres | Lit l'appel d'offres : lots, métiers, qualifications, lieu, calendrier | Cadrage 6 nov., §2.1 (étapes 1-2) |
| 2 | Avant | Proposer les codes NAF d'un appel d'offres | Propose des codes d'activité : correspondance forte, complémentaire ou incertaine, avec justification | Cadrage 6 nov., §2.2 |
| 3 | Avant | Constituer un dossier de ciblage | Entreprises retenues pour répondre ou sous-traiter, avec raison, source, date et champs à vérifier | Cadrage 6 nov., §2.3 |
| 4 | Avant | Veille des opportunités | Surveille chaque jour les marchés et signaux selon les alertes, sans répétition inutile | Cahier des charges Cheexpeer, §3.1 |
| 5 | Après l'attribution | **Prospects de sous-traitance** *(construite sur Test, outil fermé)* | 20 à 30 entreprises du même métier et de la même région qu'un marché gagné | Mission n°1, 22 nov. |
| 6 | Après l'attribution | Fiche entreprise (SIREN) | Une page par entreprise : marchés gagnés, annuaire, RGE, annonces | Cahier des charges, §3.5 ; périmètre §9 |
| 7 | Après l'attribution | Surveiller une entreprise suivie | Signale les changements importants : cession, procédure collective, nouveau marché | Cahier des charges, §3.1 ; périmètre §9 |
| 8 | Après l'attribution | Priorité d'un contact (score expliqué) | Propose un score de priorité avec ses raisons ; jamais une décision automatique | Cahier des charges, §3.3 |
| 9 | Autres entrées | Détecter les créations d'entreprises | Repère les ouvertures récentes et prépare un diagnostic prudent de leur présence en ligne | Cadrage 6 nov., §3 |
| 10 | Autres entrées | Audit de réputation d'une entreprise | Rapport sur la réputation en ligne d'une entreprise | Cadrage 6 nov., §3.4 (installé sur Test) |
| 11 | Administration | Audit SEO de MajestiOS | Diagnostic du site, recommandations classées, aucune publication sans validation | Cahier des charges, §3.6 |
| 12 | Administration | Relire les annonces avant publication | Prépare l'avis de l'administrateur sur une annonce | Périmètre §9 |
| 13 | Administration | Bilan hebdomadaire | Nouveautés, alertes, état des sources, santé de la plateforme | Cahier des charges, §3.4 et §3.7 |
| 14 | Après les travaux | *À définir par le propriétaire* | Reprise de travaux mal faits ou en retard : ce qu'il faut surveiller reste à préciser | Objectif du cycle d'appel d'offres |
| — | — | **Autre** | Message libre, sans pouvoir supplémentaire | Décision du 22 nov. |

**Plus tard, à réfléchir ensemble** (non comptées) : le message et la façon de contacter les entreprises ; l'accompagnement des entreprises intéressées par une sous-traitance.

## Ordre de travail prévu
1. Le propriétaire valide ou corrige la liste proposée ci-dessus, avec leur phase.
2. Création de la table du catalogue en base (base de test d'abord), avec les fiches ci-dessus.
3. Le champ « Objet » lit ce catalogue ; l'entrée « Autre » reste libre.
4. Les menus déroulants du chat lisent le même catalogue.
5. Les missions s'ajoutent une par une, chacune avec sa fiche, ses tests et la décision d'activation du propriétaire.
6. Mise en production seulement sur décision explicite du propriétaire.
