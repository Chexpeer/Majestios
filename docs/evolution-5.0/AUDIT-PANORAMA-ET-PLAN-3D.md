# Audit du panorama et trajectoire 3D — 4 novembre 2026

## Objet

Préparer l'évolution de l'accueil MajestiOS vers une expérience spatiale réellement immersive, sans dégrader les huit destinations existantes, le moteur de recherche ni les parcours métier.

## État constaté dans `evolution-5.0`

### Ce qui existe déjà dans le code

- L'accueil affiche `Ambitios.webp` dans un élément `figure`, avec un SVG superposé.
- Huit liens SVG natifs ouvrent les huit routes officielles : Espace privé, Réseau, Développement commercial, Prospection, Marchés publics, Marchés privés, Réputation virtuelle et Accueil.
- Le survol et le focus éclairent la zone SVG correspondante.
- Une cabine d'ascenseur SVG est dessinée au-dessus de l'image et déplacée par transformation CSS.
- Deux boutons permettent de faire varier l'étage indiqué par l'ascenseur.
- Le panorama conserve une alternative de navigation par liens accessibles au clavier.

### Limites vérifiées

- `Ambitios.webp` est une image 2D : elle ne contient ni géométrie 3D, ni façades latérales, ni profondeur de scène exploitable.
- Les huit zones SVG sont des rectangles positionnés sur l'image ; elles ne représentent pas une géométrie architecturale 3D.
- L'ascenseur actuel est un élément SVG superposé. Son animation ne prouve pas qu'une cabine circule dans une gaine architecturale réelle.
- Le clic sur une destination suit immédiatement son lien. Le mouvement de l'ascenseur n'est donc pas garanti visible avant la navigation.
- L'initialisation actuelle sélectionne l'index zéro (Espace privé), alors que la doctrine de l'expérience prévoit un départ à l'accueil / rez-de-chaussée.
- Les boutons haut/bas déplacent l'indicateur, mais ne constituent pas encore une commande complète de destination avec annonce accessible et ouverture de la rubrique à l'arrivée.
- Il n'existe pas encore de visite 360° autour du bâtiment, de vues de façades latérales, ni d'exploration de toiture.
- Le fichier `rubriques-immersives.js` anime une inclinaison/parallaxe des espaces intérieurs ; ce n'est pas un moteur de visite 3D du bâtiment d'accueil.

## Expérience cible validée

1. **Étage lumineux** : au survol, au focus ou à la sélection, l'étage concerné s'éclaire progressivement. L'état sélectionné reste identifiable.
2. **Visite 3D** : le visiteur peut tourner autour de l'immeuble et découvrir ses façades, son entrée, son environnement urbain et, dans une vue dédiée, la toiture. Commandes souris, tactiles et clavier.
3. **Ascenseur animé** : une cabine visible circule réellement le long de la façade ou dans une gaine architecturale. L'accueil est la position initiale. La sélection d'un étage par la façade ou par les commandes de l'ascenseur conduit à la même destination.
4. **Navigation sans détour** : après l'arrivée de la cabine, ouverture directe du dossier correspondant ; aucun écran modal ou étape intermédiaire.
5. **Cohérence** : exactement huit destinations, reliées à l'arborescence et aux routes existantes. Recherche, CRM, Business Intelligence, mémoire et orchestration restent transversaux.
6. **Accessibilité et performance** : alternative de navigation HTML, focus visible, commandes tactiles suffisamment grandes, prise en charge de `prefers-reduced-motion`, chargement progressif et solution de repli légère.

## Décision technique — ne pas simuler une fausse 3D

Une rotation CSS de l'image actuelle ou un simple panoramique horizontal ne doit pas être présenté comme une visite 3D. Pour obtenir une vraie visite autour du bâtiment, il faut une source spatiale adaptée :

- **Option privilégiée à évaluer :** modèle architectural 3D du bâtiment et d'un environnement urbain, exporté en glTF/GLB, rendu dans une scène WebGL (par exemple Three.js).
- **Option de transition :** série cohérente de vues 3D pré-rendues ou panorama équirectangulaire 360°, avec exploration limitée et clairement décrite. Cette option ne permet pas nécessairement de faire le tour librement ni d'animer une cabine dans la géométrie.
- **À ne pas faire :** remplacer `Ambitios.webp`, redessiner le bâtiment ou fabriquer des façades supposées sans source validée.

Le dépôt consulté ne contient pas de modèle GLB/glTF ni de série de vues 3D. La création ou la fourniture de cet actif est donc un prérequis pour la visite 3D complète. Le visuel actuel doit rester intact pendant la préparation technique.

## Lots de réalisation

### Lot A — fiabiliser l'interaction actuelle en 2D
- Corriger la position initiale de l'ascenseur pour qu'elle corresponde à Accueil.
- Distinguer survol (prévisualisation lumineuse) et sélection.
- Au clic, lancer le déplacement de cabine, puis ouvrir la route après la transition ; respecter la réduction des animations.
- Rendre les commandes haut/bas cohérentes avec l'ordre vertical réel des huit destinations et annoncer l'étage courant.
- Tester clavier, tactile, mobile et liens directs.

Ce lot améliore l'expérience existante mais ne doit pas être qualifié de visite 3D.

### Lot B — préparer et intégrer la scène 3D
- Obtenir/valider un modèle 3D du bâtiment, de ses huit niveaux, de la gaine/cabine d'ascenseur et du quartier environnant.
- Vérifier les droits d'utilisation, la topologie, l'échelle, les matériaux, les points d'ancrage des niveaux et le poids des fichiers.
- Définir les caméras : vue principale, orbite 360°, entrée et toiture.
- Relier les huit niveaux du modèle au catalogue unique des destinations, sans créer d'étages supplémentaires.
- Prévoir une solution de repli vers l'image actuelle si WebGL est indisponible ou si l'appareil est peu performant.

### Lot C — recette immersive
- Vérifier rotation complète, façades, toiture, éclairage des niveaux et déplacement continu de la cabine.
- Vérifier que clic sur étage et sélection dans l'ascenseur aboutissent à la même route.
- Mesurer temps de chargement, fluidité, mémoire GPU et comportement mobile.
- Valider le rendu visuel avec le fondateur avant remplacement de la vue d'accueil.

## Garde-fous

- Ne pas supprimer ni remplacer `Ambitios.webp` avant validation du nouveau rendu.
- Ne pas inventer de destinations : le catalogue officiel reste limité aux huit routes documentées.
- Ne pas modifier les moteurs de recherche, les formulaires ou les pages de destination dans le seul but de construire la scène 3D.
- Ne pas fusionner ni déployer en production sans accord explicite.
- Tout nouvel actif doit être ajouté à `site-files.json` et couvert par `verify-architecture.js`.
- La visite 3D ne sera déclarée opérationnelle qu'après présence de l'actif 3D, intégration réelle et recette sur desktop et mobile.

## Conclusion d'audit

La branche possède déjà un prototype 2D avec éclairage de zones et cabine SVG animée. Elle ne possède pas encore la visite 3D autour du bâtiment demandée. La trajectoire correcte est de fiabiliser d'abord les interactions existantes, puis d'intégrer un véritable actif 3D ; il serait trompeur de qualifier une parallaxe ou une rotation d'image de visite 3D.


## Avancement du lot A — interaction 2D fiabilisée

Après l'audit initial, un premier correctif a été appliqué à l'accueil :

- la cabine démarre désormais sur Accueil (01), au rez-de-chaussée ;
- les commandes haut/bas partent de cette position ;
- lorsqu'une destination est cliquée, la cabine rejoint son niveau avant l'ouverture de la route ;
- la durée d'attente est supprimée lorsque `prefers-reduced-motion: reduce` est actif ;
- le contrôle d'architecture vérifie ces invariants.

**Portée exacte :** il s'agit d'une amélioration du prototype 2D existant. La visite 3D à 360°, les façades latérales, la toiture et la cabine intégrée à une vraie géométrie 3D restent à réaliser après obtention d'un modèle architectural adapté. Le correctif n'a pas remplacé ni modifié `Ambitios.webp`.
