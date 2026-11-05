# Expérience immersive — immeuble interactif, étages et ascenseur

**Mise à jour :** 5 novembre 2026  
**Référence :** branche evolution-5.0  
**Statut :** description du prototype réellement intégré et distinction des évolutions futures.

## 1. Principe

L'immeuble interactif est la représentation visuelle de l'écosystème MajestiOS. Il ne remplace ni l'arborescence du site, ni les véritables pages et dossiers : il en constitue le point d'accès visuel.

Le principe directeur est non négociable : **le schéma reflète l'arborescence réelle**. Chaque étage doit correspondre à une rubrique existante, chaque clic doit conduire à sa véritable destination et chaque modification de l'arborescence doit être répercutée dans le schéma, les tests et la documentation.

## 2. Composition visuelle actuellement intégrée

L'accueil combine trois éléments distincts :

- Designer (2).png : décor général de la page d'accueil ;
- IMMEUBLE.jfif : photographie de la tour affichée au premier plan ;
- immeuble-masque.png : masque qui détoure la tour afin de l'intégrer au décor.

Les neuf zones interactives sont des liens SVG natifs positionnés dans le repère de l'image. Les afficheurs LED sont des canvases superposés à la façade par homographie ; ils ne captent jamais les événements de souris et ne modifient ni la photographie, ni les zones de navigation.

La réalisation actuelle est une scène web 2D avec effets de perspective et de volume. Une exploration 3D temps réel, un parcours autour du bâtiment, plusieurs façades et une toiture navigable restent des évolutions possibles ; elles ne doivent pas être décrites comme déjà livrées.

## 3. Comportement des afficheurs LED

Chaque étage possède son propre intitulé et sa propre couleur.

- Hors survol, le texte défile lentement dans le bandeau LED.
- Au survol de l'étage, le texte se stabilise, se centre et clignote.
- Le nom complet doit être lisible : les intitulés longs sont répartis sur deux lignes et leur taille s'adapte à la largeur disponible.
- En quittant l'étage, le défilement reprend.
- Les slogans ne sont pas affichés sur les bandeaux : seul le nom de la rubrique y figure. Les promesses et explications sont réservées à la page de destination.

Les afficheurs sont décoratifs et portent aria-hidden="true" ; les vrais intitulés restent disponibles dans les libellés accessibles des liens SVG.

## 4. Ascenseur cylindrique

L'ascenseur est représenté par une cabine cylindrique panoramique en verre, avec flancs, anneaux elliptiques, reflets et structure métallique. Les éléments du cylindre se déplacent ensemble.

Comportement attendu et intégré :

1. Le survol d'une zone d'étage appelle la cabine.
2. Le centre de la cabine s'aligne sur le centre réel de la zone SVG survolée.
3. Le bandeau de statut annonce le nom de la destination.
4. Le focus clavier sélectionne également l'étage.
5. Un seul clic ouvre directement la page liée ; aucun second clic ni délai artificiel n'est nécessaire.

Le calcul des arrêts est dérivé des coordonnées et dimensions des zones cliquables, et non d'une liste de positions indépendante. Cela évite que l'ascenseur se décale lorsque les zones sont ajustées.

Le cylindre actuel est un rendu SVG volumétrique ; ce n'est pas un modèle 3D temps réel. La sensation de profondeur, la transparence et la lisibilité doivent rester perceptibles sur desktop comme sur mobile.

## 5. Nomenclature de référence — neuf destinations

L'ordre ci-dessous correspond aux neuf liens SVG natifs de l'accueil, du haut de la façade au rez-de-chaussée.

| Niveau | Identifiant | Intitulé affiché | Route |
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

CRM, Business Intelligence, suivi commercial, recherche, administration, mémoire et orchestration sont des fonctions transversales : elles ne deviennent pas des étages autonomes sans décision explicite. Salon et Séminaires restent des parcours associés à Réseau.

## 6. Recherche transversale

Le moteur de recherche est accessible depuis l'accueil et les pages de rubrique. Il ne constitue pas un étage supplémentaire.

Son apparence reste compacte et cohérente sur toutes les pages. Les choix apparaissent progressivement selon l'interaction : saisie du mot-clé, type de marché, catégorie, département puis recherche. Les catégories publiques et privées restent distinctes et les résultats doivent préserver la source, la date et le lien vers la publication.

Le formulaire commun et sa logique métier ne doivent pas être modifiés au seul motif d'une évolution graphique de l'immeuble.

## 7. Harmonisation visuelle du site

L'accueil et les pages intérieures doivent être perçus comme un seul univers MajestiOS.

Socle commun :

- bleu nuit et bleu profond, matières vitrées et métalliques ;
- accents or/ambre utilisés avec mesure pour les repères, actions et états actifs ;
- typographies, échelles de titres, espacements, rayons, bordures et ombres cohérents ;
- en-tête, navigation, boutons, formulaires, cartes, recherche et pied de page harmonisés ;
- contraste suffisant sur tous les fonds, sans texte essentiel incrusté dans les images ;
- adaptation desktop et mobile, sans débordement horizontal.

L'harmonisation ne signifie pas uniformité : chaque rubrique peut conserver un décor et une personnalité propres, dans le même langage visuel.

## 8. Fonds visuels de rubriques actuellement présents

| Rubrique | Ressource |
|---|---|
| Accueil — décor général | Designer (2).png |
| Accueil — immeuble au premier plan | IMMEUBLE.jfif |
| Détourage de l'immeuble | immeuble-masque.png |
| Développement commercial | Majestios.developpement-commercial.jpg |
| Marchés publics | Marché-Public-.webp |
| Prospection | Prospection-.webp |
| Marchés privés | Marcheprive.webp |
| Réseau | Reseau.webp |

Les fonds de rubrique sont des arrière-plans. Les titres, explications, liens, formulaires et commandes restent des éléments HTML accessibles. La présence d'un fichier dans le dépôt ne suffit pas à certifier son rendu : il doit être référencé dans le manifeste, chargé par le CSS et vérifié dans le navigateur.

## 9. Accessibilité, performance et anti-régression

- Chaque zone d'étage est un lien SVG natif avec un nom accessible.
- Le focus clavier sélectionne l'étage ; le statut de l'ascenseur est annoncé poliment aux technologies d'assistance.
- Les zones SVG doivent couvrir exactement la photographie et rester cliquables sur desktop et mobile.
- Le mouvement de l'ascenseur et l'animation LED respectent prefers-reduced-motion.
- Les afficheurs LED restent pointer-events:none afin de ne jamais bloquer les clics.
- Les coordonnées des arrêts de l'ascenseur sont calculées depuis les véritables zones d'étage.
- Les tests navigateur vérifient les neuf identifiants, intitulés, lignes LED, arrêts, routes, clics directs, focus clavier et tailles d'écran.
- Toute modification de la photographie, du masque, des coordonnées, des intitulés ou des routes impose une mise à jour des tests et de la documentation.

## 10. Évolutions futures — non livrées

Les pistes suivantes peuvent être étudiées séparément, sans remettre en cause la version actuelle :

- exploration 3D temps réel du bâtiment ;
- rotation autour de plusieurs façades et découverte du quartier ;
- accès visuel à la toiture et à ses éventuelles fonctions ;
- amélioration progressive de la cabine et de ses effets volumétriques.

Le choix d'une technologie 3D doit être précédé d'une comparaison du bénéfice utilisateur, de la performance, de l'accessibilité, de la compatibilité mobile et du coût de maintenance. Aucune évolution de ce type ne doit dégrader les neuf accès actuels ni modifier l'arborescence sans validation.
