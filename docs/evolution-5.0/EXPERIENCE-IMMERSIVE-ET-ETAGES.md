# Expérience immersive — panorama, immeuble et ascenseur

## 1. Concept

L'accueil actuel de MajestiOS combine le décor général Designer (2).png et la photographie détourée IMMEUBLE.jfif. La scène interactive 2D est la version effectivement présente ; une exploration 3D temps réel et un quartier navigable à 360° restent des évolutions possibles, non des fonctions actuellement livrées. Il ne s'agit pas de représenter uniquement le bâtiment : **tout l'environnement urbain doit être valorisé** et donner l'impression d'un véritable quartier économique international, spectaculaire, vivant et crédible. Sur ordinateur, le panorama doit occuper **le maximum de la surface utile de la page d'accueil**. Il doit dominer immédiatement l'écran et constituer l'expérience principale, pas une illustration secondaire, une petite bannière ou un bloc enfermé dans une mise en page classique. La cible indicative d'environ **70 % de l'espace visuel** devient un minimum de conception, pas un plafond : on peut aller au-delà si cela améliore l'immersion. Réduire au strict nécessaire les bandeaux, marges, cartes et blocs de texte concurrents. Le moteur de recherche, les destinations et les accès essentiels doivent être intégrés au panorama ou superposés avec discrétion, sans masquer le bâtiment, l'ascenseur ni les zones interactives. Le cadrage, la définition et le niveau de détail doivent permettre d'identifier clairement le bâtiment, ses accès et son environnement.

Un ascenseur panoramique extérieur, vitré et visible sur la façade, représente MajestiOS lui-même.

**L'immeuble représente l'écosystème ; l'ascenseur représente MajestiOS, l'intelligence qui accompagne la PME vers la destination choisie.**

## 2. Panorama et interaction spatiale attendue

Le panorama ne doit pas être une image figée simplement décorative. Il doit devenir une véritable zone interactive permettant au visiteur d'explorer le bâtiment dans son ensemble.

- Le visiteur doit pouvoir faire le tour de l'immeuble (exploration des différentes façades / rotation autour du bâtiment ou parcours équivalent) et découvrir progressivement le quartier qui l'entoure.
- L'exploration doit également permettre d'accéder visuellement à la toiture et, si son contenu est défini, de sélectionner un accès ou une destination située sur le toit.
- La toiture fait donc partie du périmètre d'exploration à concevoir ; son usage fonctionnel reste à préciser avant de lui attribuer une rubrique.
- L'interaction spatiale doit rester fluide, intuitive et utilisable à la souris, au tactile et au clavier. Prévoir des commandes ou repères visibles pour tourner, revenir à la vue principale et retrouver l'entrée.
- Le panorama doit conserver une vue de référence immédiatement compréhensible, sans obliger le visiteur à explorer pour trouver les destinations principales.
- Le panorama doit prendre la plus grande place possible dans la surface utile de l'accueil desktop ; les 70 % constituent un repère minimal indicatif et non une limite. Sur mobile, la composition doit également privilégier le panorama, avec une adaptation du cadrage et des commandes sans le réduire à une vignette ni masquer les accès essentiels.
- L'image / scène doit être de haute qualité, mais optimisée pour le chargement : formats modernes, variantes responsive, chargement différé des vues secondaires et budget de poids à définir après choix de la technologie.

### Ascenseur et sélection d'une destination

- À l'arrivée, l'ascenseur est positionné par défaut au niveau de l'accueil / rez-de-chaussée.
- Le visiteur survole une zone d'étage : le titre LED correspondant se stabilise et clignote, et l'ascenseur cylindrique vitré se déplace vers le centre de cette zone.
- Les intitulés longs sont composés sur deux lignes afin d'être lisibles intégralement dans leur bandeau.
- Un clic unique sur la zone ouvre directement le dossier ou la page correspondante ; aucun second clic ni délai artificiel n'est demandé.
- Le focus clavier sélectionne également l'étage et annonce le niveau à l'aide d'un statut accessible.
- L'expérience doit rester compréhensible et utilisable au clavier, au tactile et avec les technologies d'assistance.
- Sur mobile, prévoir une composition adaptée : le visiteur doit toujours pouvoir sélectionner les destinations sans précision excessive.

L'ascenseur n'est pas un menu permanent obligatoire dans chaque page. Le concept décrit un ascenseur présent sur l'accueil, servant à sélectionner une destination. Les pages internes conservent des moyens simples de retour à l'accueil et de navigation contextuelle.

## 4. Le moteur de recherche transversal

Le moteur de recherche est une capacité transversale accessible depuis l’accueil et les pages de rubrique. Il ne constitue pas un étage supplémentaire : les neuf destinations interactives de IMMEUBLE.jfif restent la référence spatiale.

Le moteur doit conserver une logique de sélection progressive et cohérente avec les sources :
- choix du type d'opportunité (public / privé lorsque pertinent) ;
- choix de la catégorie ;
- choix du département ;
- saisie de mots-clés et lancement de la recherche.

Les catégories, sources, filtres et pages de résultats doivent être spécifiés dans le dossier fonctionnel du moteur. La catégorie Nettoyage reste à cadrer précisément. Les résultats sont traçables et ne doivent pas être présentés comme vérifiés si la source ne le garantit pas.

### Moteur de recherche sur la page d'accueil — apparence et interaction à respecter

Le moteur affiché sur l'accueil doit reprendre **exactement le principe visuel de la barre de recherche de l'image de référence** : un champ unique, compact, arrondi, avec une icône de loupe et un texte d'invitation du type « Rechercher sur le site ou dans vos données… ». Il doit rester extrêmement simple et discret, sans panneau de catégories affiché en permanence, sans succession de cartes, sans filtres visibles dès le départ et sans formulaire encombrant.

**Ce sont les clics de l'utilisateur qui font apparaître les choix, progressivement.** Le comportement attendu est le suivant :

1. État initial : seule la barre de recherche est visible.
2. Premier clic dans la barre : afficher le premier choix nécessaire, notamment le type de recherche (marché public ou marché privé lorsque la recherche concerne les opportunités).
3. Clic sur le type : afficher uniquement les catégories correspondantes.
4. Clic sur une catégorie : afficher l'étape suivante pertinente, notamment le département.
5. Les mots-clés et le lancement de la recherche restent accessibles dans ce parcours sans transformer la barre initiale en formulaire complexe.

À chaque étape, ne montrer que les choix utiles à cette étape. Les choix précédents restent identifiables et modifiables. Le parcours doit être rapide, lisible et réversible ; un clic en dehors peut refermer les choix sans effacer une recherche déjà saisie. Les catégories proposées dépendent du type choisi et ne doivent jamais mélanger les catégories publiques et privées. Le comportement exact des recherches générales « sur le site » et « dans vos données » devra être raccordé au moteur transversal existant, sans inventer de catégories.

L'interface doit rester fidèle à la sobriété de l'image de référence : **la complexité est dans le moteur et son orchestration, pas dans ce que l'utilisateur voit au premier regard.**

## 5. Nomenclature de référence — immeuble interactif V5

Le prototype actuel utilise Designer (2).png comme décor général, IMMEUBLE.jfif comme photographie de la tour et immeuble-masque.png pour le détourage. Neuf zones SVG natives sont superposées à la façade. Les titres LED sont dessinés en matrice de points, avec une couleur propre à chaque étage ; le survol les fige et les fait clignoter. Les titres longs sont répartis sur deux lignes.

| Niveau | ID SVG | Intitulé LED | Route |
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

L'ascenseur visible est un cylindre SVG vitré avec anneaux elliptiques, reflets et structure métallique. Il se déplace au survol et au focus, puis le clic unique ouvre la destination. Cette réalisation donne une perception cylindrique et volumétrique ; elle n'est pas un modèle 3D temps réel.

CRM, Business Intelligence, suivi commercial, recherche, administration, mémoire, orchestration et MajestiOS V.5 sont traités comme des fonctions transversales. « Salon » et « Séminaires » restent des parcours associés à Réseau, pas des étages autonomes.

## 6. Direction artistique

Référence visuelle transmise le 4 novembre 2026 : une tour contemporaine à structure vitrée et métallique, présentée en coupe / grande ouverture architecturale, laissant voir plusieurs niveaux intérieurs et un axe vertical central de circulation. Cette image est une référence de style et de lisibilité des étages ; elle ne constitue pas le fichier source du futur bâtiment ni un plan technique définitif de l'ascenseur.

Direction artistique enrichie :
- **un quartier d'affaires complet**, inspiré par l'ampleur et la densité de La Défense et par la modernité urbaine de Singapour ;
- skyline de tours contemporaines, immeubles tertiaires, voies de circulation, espaces publics, végétation et aménagements paysagers ;
- environnement cohérent à 360° : le quartier doit rester valorisant lorsqu'on tourne autour du bâtiment, et ne pas se réduire à une façade ou à un décor plaqué ;
- un immeuble MajestiOS identifiable et central, avec des niveaux lisibles et des espaces intérieurs visibles ;
- l'ascenseur est un élément architectural et fonctionnel majeur de l'expérience : sa position, sa structure, sa cabine et son mouvement doivent être conçus pour rendre la navigation entre les étages immédiatement compréhensible ;
- ne pas figer à ce stade le choix entre ascenseur extérieur vitré et axe vertical intégré / apparent : le modèle final devra respecter la référence architecturale et surtout permettre une animation crédible ;
- atmosphère lumineuse, premium et réaliste, sans basculer dans une ville futuriste irréaliste ;
- bleu nuancé, non monochrome ni saturé, associé au blanc, à des tons neutres et à des accents dorés ;
- intérieurs distincts par étage, cohérents dans une même identité graphique ;
- ambiance crédible et accueillante plutôt que science-fiction excessive.

Slogans :
- « Donner de la hauteur à vos ambitions. »
- « MajestiOS, pour une ascension magique et exponentielle. »

## 7. Une image intérieure par étage

Chaque destination doit disposer d'un visuel de l'intérieur de l'étage, et non d'une simple vignette de façade répétée.

Chaque visuel doit :
- représenter concrètement l'activité de l'étage ;
- respecter une direction artistique commune ;
- intégrer une hiérarchie claire entre titre, promesse, sous-rubriques et actions ;
- laisser la priorité aux véritables éléments d'interface HTML accessibles plutôt qu'à du texte essentiel incrusté dans l'image ;
- être conçu pour desktop et décliné / recadré pour mobile ;
- être optimisé en poids et formats ;
- être validé par le porteur du projet avant intégration.

Le moteur de recherche reste transversal et ne reçoit pas de numéro d’étage. Réseau fait partie des huit destinations visibles ; ses espaces intérieurs restent à concevoir et valider selon la direction artistique commune. Les autres étages restent à concevoir un par un, après validation de la nomenclature.

## 8. Harmonisation visuelle de l'ensemble du site et décors des étages

La direction artistique de l'accueil devient le **socle visuel commun de toutes les pages MajestiOS**. L'utilisateur doit sentir qu'il reste dans le même univers lorsqu'il quitte le panorama pour entrer dans un étage, un dossier, une sous-rubrique ou une page de service.

### Règles communes à toutes les pages

- Conserver une identité cohérente avec le panorama : bleu nuancé, verre, lumière, matières contemporaines, blancs et tons neutres, accents lumineux ou dorés avec mesure.
- Harmoniser les en-têtes, titres, boutons, champs de recherche, menus, cartes, pieds de page, états actifs et interactions.
- Garder une hiérarchie typographique, des espacements, des rayons, des ombres et des comportements cohérents.
- Maintenir le moteur de recherche compact et progressif, sans lui substituer des variantes visuelles différentes selon les pages.
- Préserver la lisibilité et le contraste : les effets lumineux et les arrière-plans ne doivent jamais gêner la lecture.
- Les pages intérieures doivent donner l'impression d'entrer dans un espace du bâtiment, pas d'ouvrir un site indépendant.
- Harmonisation ne signifie pas uniformité : chaque rubrique peut avoir son propre décor et sa personnalité, dans le même langage visuel.

### Un décor identifiable pour chaque étage

Nous pouvons commencer à sélectionner les ambiances et fonds d'écran étage par étage. Chaque décor doit illustrer l'activité réelle de la rubrique et prolonger l'architecture du bâtiment. Il doit être conçu comme un arrière-plan ou une scène d'ambiance, avec les contenus, textes et commandes réalisés en HTML accessibles au premier plan.

Pistes créatives à étudier — **propositions de travail, non décisions définitives** :

- Développement commercial : espace de stratégie et de croissance, vue sur le quartier d'affaires.
- Prosp'active : espace de prospection contemporain, postes de travail et écrans de suivi discrets.
- Marchés publics : environnement institutionnel et salle de consultation professionnelle.
- Marchés privés : espace de projets, échanges entre entreprises et maquettes de réalisations.
- Réputation virtuelle : studio de visibilité numérique, avis, présence locale et identité de marque.
- Réseau : salon professionnel / showroom collectif et espaces de rencontres, sans créer des étages autonomes Salon, Séminaires ou Événements.
- Réseau : salon exécutif ouvert, espaces de rencontre et connexions entre acteurs.
- CRM et Business Intelligence, si cette destination est confirmée dans l'arborescence : centre de pilotage sobre, visualisations et relations clients.
- Moteur de recherche : espace clair et épuré, où la recherche reste l'élément central.

Cette liste ne valide ni le nombre d'étages, ni leur ordre, ni l'existence d'une rubrique autonome. **Aucun décor ne doit créer ou imposer une rubrique** : le catalogue des destinations et l'arborescence approuvée restent prioritaires.

### Méthode de sélection et de validation

1. Utiliser la nomenclature de `Majestios.immeuble.jpg` comme référence et vérifier chaque destination dans l'arborescence réelle.
2. Définir pour chaque étage une intention visuelle, une palette secondaire et une ambiance.
3. Présenter les propositions de fonds d'écran pour validation avant intégration.
4. Décliner chaque décor en formats desktop et mobile, avec des zones de sécurité pour les contenus.
5. Vérifier contraste, lisibilité, poids des images, temps de chargement et cohérence entre pages.
6. Réutiliser le même décor ou ses variantes cohérentes dans les pages d'un même étage, plutôt que de donner un univers sans rapport à chaque sous-page.

## 9. Navigation et accessibilité

- La barre de navigation classique peut être supprimée de l'accueil si le panorama rend toutes les destinations essentielles accessibles.
- Ne pas supprimer les accès utilitaires indispensables : accueil, contact, compte / espace personnel, aide et mentions légales doivent rester trouvables.
- Les rubriques Appels d'offres peuvent devenir des fonctionnalités ou sous-dossiers plutôt que des destinations de premier niveau, sous réserve de conserver tous les parcours utiles.
- Les pages internes doivent proposer un retour clair à l'accueil et des liens contextuels.
- Prévoir navigation clavier, focus visible, libellés accessibles, alternatives textuelles et préférence de réduction des animations.
- Le mouvement de l'ascenseur ne doit pas être l'unique moyen de comprendre la destination.

## 10. Architecture technique à étudier

Comparer avant de choisir :
- image de fond responsive + zones SVG ;
- scène SVG / HTML composée d'éléments séparés ;
- rendu 3D léger si le bénéfice justifie le coût ;
- animation CSS / Web Animations API pour le déplacement de l'ascenseur.

Éviter les coordonnées fixes en pixels. Les zones interactives doivent être définies dans un repère normalisé ou vectoriel, testées sur plusieurs ratios d'écran, et reliées à un catalogue de destinations unique.

## 11. Critères d'acceptation

- le panorama domine la page d'accueil et occupe le maximum raisonnable de sa surface utile ; la cible indicative de 70 % est un minimum de conception, non un plafond ;
- le bâtiment peut être exploré sur plusieurs façades et la toiture est accessible dans l'expérience ;
- la vue principale reste immédiatement lisible et les destinations principales sont repérables ;
- les performances de chargement restent acceptables sur desktop et mobile ;
- chaque étage affiché correspond à un dossier existant et documenté ;
- aucune destination n'est fictive ;
- chaque clic sélectionne la bonne destination ;
- l'ascenseur démarre au niveau accueil et se déplace vers l'étage demandé ;
- la transition reste proche de la durée cible sans bloquer l'interface ;
- aucun chevauchement ou perte de zone tactile sur mobile ;
- fonctionnement au clavier et réduction du mouvement ;
- tests automatisés des correspondances étage → route ;
- aucun changement des moteurs ou formulaires métier causé par le seul changement de présentation.


## 10. Architecture visuelle effective — référence `Majestios.immeuble.jpg`

Le panorama de l'accueil et le fond de Développement commercial utilisent les dérivés `Majestios.immeuble.jpg` et `Majestios.developpement-commercial.jpg`. Leurs originaux JFIF (`Majestios.immeuble.jfif` et `Majestios.developpement-commercial.jfif`) sont conservés hors du manifeste publié. L'ancien original commercial `devellopement.jfif`, signalé comme erroné, est conservé mais n'est plus utilisé. Quatre autres fonds WebP restent déclarés : `Marché-Public-.webp`, `Prospection-.webp`, `Marcheprive.webp` et `Reseau.webp`.

Les huit zones actives correspondent aux niveaux 8 à 1 et aux routes V5. Le libellé Accueil est au niveau 1 ; le RDC représenté dans l'image ne crée pas une neuvième destination. L'image de l'immeuble est conservée à sa définition source de 843 × 1264 px ; le nouveau visuel commercial est conservé à sa définition source de 1408 × 768 px. Aucun des deux n'est agrandi artificiellement. Le fond de Développement commercial est plafonné à sa largeur native et se réduit sur les petits écrans.

**État de validation :** les ressources, le manifeste, les coordonnées SVG et le test navigateur ont été mis à jour. La recette automatisée reste à exécuter dans un environnement disposant de Node.js et Playwright ; la validation visuelle desktop/mobile finale doit également être consignée.


## 7. Fonds visuels dédiés aux rubriques

Le panorama `Majestios.immeuble.jpg` est l'image de navigation de l'accueil. Les fonds de rubrique présents au dépôt sont affectés ainsi :
- Développement commercial : `Majestios.developpement-commercial.jpg` ;
- Marchés publics : `Marché-Public-.webp` ;
- Prospection : `Prospection-.webp` ;
- Marchés privés : `Marcheprive.webp` ;
- Réseau : `Reseau.webp`.

Ces fonds ne remplacent pas le panorama et ne créent pas de nouvelles destinations. Ils sont déclarés dans `site-files.json` afin d'être inclus dans le build. Les contrastes, le recadrage et la lisibilité des contenus doivent être contrôlés sur desktop et mobile.
