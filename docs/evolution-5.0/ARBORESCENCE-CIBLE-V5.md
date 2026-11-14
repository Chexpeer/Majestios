# Arborescence cible MajestiOS V5

Statut : référence fonctionnelle et visuelle au 5 novembre 2026. Les neuf destinations, leurs routes et leurs coordonnées sont vérifiées dans index.html et les tests navigateur ; toute évolution doit mettre à jour simultanément le schéma, les tests et cette référence.

> Note du 14 novembre 2026 : le menu de la branche de test `test-ecriture-claude` regroupe les pages en cinq rubriques (voir `docs/evolution-9/ETAT-REEL-SITE-ET-TRAJECTOIRE-2026-11-14.md`). L'immeuble interactif de l'accueil n'est pas modifié.

## Rubriques visibles sur l'immeuble interactif MajestiOS

Les neuf destinations ci-dessous correspondent à l'ordre réel des zones SVG de l'accueil, du haut vers le rez-de-chaussée.

| Niveau | Identifiant | Destination | Route |
|---|---|---|---|
| 08 | 08 | Espace privé | espace-membre.html |
| 07 | 07 | Réseau | reseaux-synergies.html |
| 06 | 06 | Développement commercial | developpement-commercial.html |
| 05 | 05 | Prospection | prospection-active.html |
| 04 | 04 | Accompagnement appels d'offres | accompagnement-appels-offres.html |
| 03 | 03 | Marchés publics | marches-publics.html |
| 02 | 02 | Marchés privés | marches-prives.html |
| 01 | 01 | Réputation virtuelle | reputation-virtuelle.html |
| RDC | RDC | Accueil | index.html#accueil |

Le moteur de recherche, le CRM et la Business Intelligence sont des fonctions transversales, pas des étages. Le survol d'un étage appelle l'ascenseur cylindrique et stabilise/clignote son intitulé LED ; les noms longs sont répartis sur deux lignes. Un clic unique ouvre directement la page liée.

## Fonctions transversales, non assimilées à des étages

- CRM MajestiOS : `crm.html`, structuration des entreprises, contacts, opportunités, activités et historique.
- Business Intelligence : analyses et aide à la décision, dont `intelligence-economique.html`.
- Cheexpeer : IA intégrée à MajestiOS, destinée à la surveillance, à l’analyse, aux rapports, aux alertes et au scoring explicable des opportunités. Son activation reste différée pendant la préparation des fondations.
- Suivi commercial : `suivi-commercial.html`, rattaché au développement commercial et au CRM.
- Recherche : moteur transversal ; les choix apparaissent progressivement.
  - Marchés publics : catégories métier BOAMP, dont « Nettoyage & propreté » ; les catégories sans page dédiée aboutissent aux résultats communs.
  - Marchés privés : familles BODACC actives et autres familles prévues. Immobilier, emploi et sous-traitance ne doivent pas être présentés comme alimentés tant que leurs sources ne sont pas réellement connectées.
  - Les critères et catégories sont centralisés dans `catalogue-majestios.js` ; accueil et rubriques doivent lire ce catalogue.
  - Les résultats publics et privés restent séparés par source. Les résultats doivent préserver provenance, date et lien vers la publication.
- Administration, mémoire, orchestration et SEO assisté : fonctions transversales, pas des rubriques métier autonomes.

## Pages et capacités à préserver

Les pages de veille, accompagnement AO, BODACC, sous-traitance, qualification, salons-séminaires, CRM, suivi commercial, intelligence économique, MajestiOS V.5, vision, FAQ, recrutement et pages légales restent dans le patrimoine actif tant que leurs dépendances et leur valeur n'ont pas été auditées. Elles sont rattachées à une rubrique ou à une fonction transverse ; elles ne sont pas supprimées parce qu'elles ne figurent pas dans la liste visuelle.

## Écarts et contrôles à conduire

- Distinguer les destinations de premier niveau des anciens dossiers historiques B01 à B10.
- Vérifier chaque zone interactive et chaque URL sur le visuel réellement retenu ; ne pas inventer de coordonnées.
- Ne pas transformer une fonction transverse (CRM, BI, recherche, administration, mémoire, orchestration) en étage improvisé.
- Le menu doit employer « Réseau » tout en conservant les parcours salons et séminaires.
- Le libellé « Réputation virtuelle » remplace l'ancien « e-Réputation » dans l'interface cible.
- Le mapping doit relier chaque destination, dossier, URL, étage éclairé et position de l'ascenseur avec des identifiants communs.

## Ressources visuelles présentes dans la branche

- `Designer (2).png` : décor général de l'accueil.
- `IMMEUBLE.jfif` : photographie de la tour affichée au premier plan.
- `immeuble-masque.png` : masque de détourage de la tour.
- `Majestios.developpement-commercial.jpg` : Développement commercial.
- `Marché-Public-.webp` : Marchés publics.
- `Prospection-.webp` : Prospection.
- `Marcheprive.webp` : Marchés privés.
- `Reseau.webp` : Réseau.

La présence d'un fichier ne certifie pas son rendu ni son affectation correcte. Vérifier CSS, manifeste, build, contraste et recadrage avant de déclarer une rubrique terminée.

## Règles de nettoyage

1. Aucun étage autonome « Événements », « Communication », « Formation », « Salon » ou « Séminaires » sans décision explicite.
2. CRM et Business Intelligence restent distincts.
3. Distinguer le rôle central décidé pour MajestiOS V.5 des choix techniques et du périmètre détaillé qui restent à valider.
4. Aucun fichier métier, filtre, source ou formulaire n'est supprimé avant inventaire des dépendances et validation du plan.
5. Les archives V2/V3/V4 restent intactes ; cette référence s'applique au cadrage V5.

## Étape technique suivante

Maintenir la matrice destination → dossier → sous-dossier → page → fonction. Les coordonnées actuelles sont définies et testées ; toute modification de l'image ou de la façade impose une nouvelle mesure et une recette complète desktop/mobile.
