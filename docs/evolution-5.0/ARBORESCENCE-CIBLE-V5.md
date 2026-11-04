# Arborescence cible MajestiOS V5

Statut : référence de travail au 4 novembre 2026. Les destinations et rattachements fonctionnels décrivent la cible ; les coordonnées interactives, le rôle de l'ascenseur et la recette de navigation doivent être validés sur le rendu réel.

## Rubriques visibles sur Ambitios

1. Espace privé — destination existante : `espace-membre.html`.
2. Réseau — destination : `reseaux-synergies.html`. La page `salons-seminaires.html` est un parcours associé, pas un étage autonome par défaut.
3. Développement commercial — `developpement-commercial.html` ; démarche globale Détecter → Qualifier → Identifier → Contacter → Transformer → Capitaliser.
4. Prospection — `prospection-active.html`. Employer « Prospection » sur le bâtiment ; « Prosp'active » peut être utilisé comme signature de marque selon le contexte.
5. Marchés publics — `marches-publics.html` ; parcours associés : `veille-marches.html` et `accompagnement-appels-offres.html`.
6. Marchés privés — `marches-prives.html` ; parcours associés : BODACC, sous-traitance et qualification selon disponibilité réelle des sources.
7. Réputation virtuelle — visibilité en ligne, présence locale, avis et SEO.
8. Accueil — panorama et accès à la recherche.

## Fonctions transversales, non assimilées à des étages

- CRM MajestiOS : `crm.html`, structuration des entreprises, contacts, opportunités, activités et historique.
- Business Intelligence : analyses et aide à la décision, dont `intelligence-economique.html`.
- MajestiOS V.5 : intelligence centrale du site, qui coordonne les capacités transversales sous gouvernance ; son implémentation reste une cible non opérationnelle dans le prototype actuel.
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

- `Ambitios.webp` : panorama d'accueil.
- `Développement-.webp` : Développement commercial.
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

Établir la matrice destination → dossier → sous-dossier → page → fonction, puis tester les liens et l'expérience d'ascenseur. Mesurer les zones sur l'image finale plutôt que de déduire leurs coordonnées.
