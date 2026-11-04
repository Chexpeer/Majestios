# Arborescence cible MajestiOS V5

Statut : référence de travail établie le 4 novembre 2026 à partir du panorama `Ambisios.webp`, des quatre fonds de rubriques ajoutés et de l’inventaire du code. Les destinations et rattachements fonctionnels sont la cible documentaire ; les coordonnées interactives et la recette de navigation restent à valider.

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
  - Marchés publics : catégories métier BOAMP, dont « Nettoyage & propreté » ; les catégories sans page dédiée aboutissent aux résultats communs.
  - Marchés privés : familles BODACC actives (créations, cessions, modifications, procédures, radiations) ; immobilier, emploi et sous-traitance restent visibles comme parcours prévus mais désactivés tant que leurs sources ne sont pas connectées.
  - Les critères et catégories sont centralisés dans `catalogue-majestios.js` ; l’accueil et les pages de rubrique doivent lire ce catalogue plutôt que maintenir des listes divergentes.
  - Les résultats privés et publics restent séparés par source. Les liens des résultats renvoient vers les publications officielles ; le lien de navigation « Réseau » mène à `reseaux-synergies.html`.
- Administration, mémoire, orchestration et SEO assisté : fonctions transversales, pas des rubriques métier autonomes.

## Pages à conserver

Les pages de veille, accompagnement AO, BODACC, sous-traitance, qualification, salons-séminaires, CRM, suivi commercial, intelligence économique, MajestiOS V.5, vision, FAQ, recrutement et pages légales restent conservées. Elles sont rattachées à une rubrique ou à une fonction transverse ; elles ne sont pas supprimées parce qu'elles ne figurent pas dans la liste visuelle.

## Écarts constatés dans le code actuel

- Le catalogue historique contient dix entrées B01 à B10, dont CRM et Business Intelligence ; cette structure historique ne doit pas être confondue avec les huit destinations visibles d’Ambisios.
- Les zones interactives historiques ne correspondent pas encore de façon démontrée à la nomenclature des huit destinations ; leur mapping doit être audité sans ajouter d’étage transversal.
- Le libellé historique « IA & Business Intelligence » mélange des fonctions transversales distinctes et ne doit pas devenir une destination visible du bâtiment.
- L’accueil utilise `Ambisios.webp`. Les fonds `Développement-.webp`, `Marché-Public-.webp`, `Prospection-.webp` et `Marcheprive.webp` sont réservés à leurs rubriques respectives.
- Le menu principal de l’accueil et de la page de résultats a été réorienté vers « Réseau » ; les autres occurrences historiques restent à contrôler.
- Le texte alternatif de l’image d’accueil a été remplacé pour désigner le panorama Ambisios.

Ces écarts sont identifiés, mais le mapping SVG ne doit pas être modifié à l'aveugle : il faut mesurer les zones sur l'image réellement utilisée et relier chaque destination, la position de l'ascenseur et l'éclairage à un identifiant unique.

## Règles de nettoyage

1. Aucun étage autonome « Événements », « Communication », « Formation », « Salon » ou « Séminaires » n'est ajouté sans décision explicite.
2. CRM et Business Intelligence ne sont pas fusionnés dans un intitulé improvisé.
3. MajestiOS V.5 reste le nom du module intelligent, MajestiOS celui de la plateforme.
4. Aucun fichier métier, filtre, source ou formulaire n'est supprimé dans ce nettoyage.
5. Les archives V2/V3/V4 restent intactes ; cette référence s'applique au cadrage V5.

## Étape technique suivante

Créer un catalogue unique de destinations pour synchroniser libellé, zone interactive, position de l'ascenseur, éclairage et URL. Confirmer d'abord l'image d'accueil et mesurer ses zones ; aucune coordonnée ne doit être devinée.


## Mise à jour — image de référence et architecture visuelle (4 novembre 2026)

### Décision appliquée au dépôt

`Ambisios.webp` reste le panorama de l’accueil. Quatre fonds dédiés sont présents : `Développement-.webp`, `Marché-Public-.webp`, `Prospection-.webp` et `Marcheprive.webp`. Les cinq ressources WebP (panorama inclus) doivent être déclarées dans `site-files.json`. Leur affectation et leur rendu doivent être vérifiés avant de conclure à leur validation.

Le panorama Ambisios porte la navigation d’accueil. Les trois nouveaux fonds sont affectés respectivement aux pages Développement commercial, Marchés publics et Prospection. Chaque rubrique conserve ses contenus et ses interactions propres.

### Architecture visible et architecture transverse

Les huit destinations Ambisios constituent la couche de navigation spatiale. Recherche, CRM, Business Intelligence, administration, mémoire, orchestration et MajestiOS V.5 restent des capacités transversales. Aucun « dixième étage » ne doit être ajouté pour représenter le moteur de recherche sans décision explicite.

### Vérifications restantes

- contrôler toutes les zones cliquables sur `Ambisios.webp` ;
- garantir la correspondance entre destination, dossier réel, URL, étage éclairé et position de l’ascenseur ;
- vérifier les ressources publiées par le build ;
- exécuter les contrôles d’architecture et les tests navigateur après le nettoyage.
