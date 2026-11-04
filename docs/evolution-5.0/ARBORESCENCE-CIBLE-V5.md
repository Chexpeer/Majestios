# Arborescence cible MajestiOS V5

Statut : référence de travail établie le 4 novembre 2026 à partir de l'image `Ambisios.webp` et de l'inventaire du code. Cette nomenclature ne vaut pas validation des coordonnées de navigation.

## Rubriques visibles sur Ambisios

1. Espace privé — destination existante : `espace-membre.html`.
2. Réseau — destination à privilégier : `reseaux-synergies.html`. La page `salons-seminaires.html` devient un parcours associé de type showroom, pas un étage autonome par défaut.
3. Développement commercial — `developpement-commercial.html`; démarche globale Détecter → Qualifier → Identifier → Contacter → Transformer → Capitaliser.
4. Prospection — `prospection-active.html`. Employer « Prospection » sur le bâtiment, sans réintroduire « prospection inversée ».
5. Marchés publics — `marches-publics.html`; parcours associés : `veille-marches.html` et `accompagnement-appels-offres.html`.
6. Marchés privés — `marches-prives.html`; parcours associés : BODACC, sous-traitance et qualification selon disponibilité réelle des sources.
7. Réputation virtuelle — visibilité en ligne, présence locale, avis et SEO.
8. Accueil — panorama et barre de recherche minimale.

## Fonctions transversales, non assimilées à des étages

- CRM MajestiOS : `crm.html`, structuration des entreprises, contacts, opportunités, activités et historique.
- Business Intelligence : analyses et aide à la décision, dont `intelligence-economique.html`.
- MajestiOS V.5 : module intelligent transversal remplaçant BrainIOS ; ce n'est ni le nom du site ni un étage.
- Suivi commercial : `suivi-commercial.html`, rattaché au développement commercial et au CRM.
- Recherche : moteur transversal. La barre reste simple ; les catégories et filtres apparaissent progressivement au clic.
- Administration, mémoire, orchestration et SEO assisté : fonctions transversales, pas des rubriques métier autonomes.

## Pages à conserver

Les pages de veille, accompagnement AO, BODACC, sous-traitance, qualification, salons-séminaires, CRM, suivi commercial, intelligence économique, MajestiOS V.5, vision, FAQ, recrutement et pages légales restent conservées. Elles sont rattachées à une rubrique ou à une fonction transverse ; elles ne sont pas supprimées parce qu'elles ne figurent pas dans la liste visuelle.

## Écarts constatés dans le code actuel

- `index.html` contient dix entrées de catalogue B01 à B10, dont CRM et Business Intelligence.
- Les zones SVG cliquables sont au nombre de neuf et ne correspondent pas à toutes les entrées ; CRM est omis du mapping.
- Le niveau supérieur est affiché « IA & Business Intelligence », intitulé qui ne figure pas dans Ambisios et mélange des fonctions distinctes.
- L'accueil utilise actuellement `IMMEUBLE MajestiOS .webp`, pas `Ambisios.webp`.
- Le menu principal affiche encore « Salon virtuel », alors que l'image de référence affiche « Réseau ».
- Le texte alternatif de l'image actuelle annonce neuf étages et un rez-de-chaussée ; il doit être recalé lors du remplacement de l'actif.

Ces écarts sont identifiés, mais le mapping SVG ne doit pas être modifié à l'aveugle : il faut mesurer les zones sur l'image réellement utilisée et relier chaque destination, la position de l'ascenseur et l'éclairage à un identifiant unique.

## Règles de nettoyage

1. Aucun étage autonome « Événements », « Communication », « Formation », « Salon » ou « Séminaires » n'est ajouté sans décision explicite.
2. CRM et Business Intelligence ne sont pas fusionnés dans un intitulé improvisé.
3. MajestiOS V.5 reste le nom du module intelligent, MajestiOS celui de la plateforme.
4. Aucun fichier métier, filtre, source ou formulaire n'est supprimé dans ce nettoyage.
5. Les archives V2/V3/V4 restent intactes ; cette référence s'applique au cadrage V5.

## Étape technique suivante

Créer un catalogue unique de destinations pour synchroniser libellé, zone interactive, position de l'ascenseur, éclairage et URL. Confirmer d'abord l'image d'accueil et mesurer ses zones ; aucune coordonnée ne doit être devinée.
