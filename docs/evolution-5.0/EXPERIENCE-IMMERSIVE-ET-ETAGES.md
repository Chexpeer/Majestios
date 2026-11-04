# Expérience immersive — panorama, immeuble et ascenseur

## 1. Concept

L'accueil de MajestiOS devient un panorama immersif d'une zone d'activités / zone industrielle. Un immeuble principal sert de repère visuel. Un ascenseur panoramique extérieur, vitré et visible sur la façade, représente MajestiOS lui-même.

**L'immeuble représente l'écosystème ; l'ascenseur représente MajestiOS, l'intelligence qui accompagne la PME vers la destination choisie.**

## 2. Interaction attendue

- À l'arrivée, l'ascenseur est positionné par défaut au niveau de l'accueil / rez-de-chaussée.
- Le visiteur clique sur une destination clairement identifiée dans le panorama ou sur l'immeuble.
- L'ascenseur se déplace vers l'étage correspondant en environ deux secondes (durée cible à tester, pas une garantie technique).
- À l'arrivée, la destination s'ouvre directement sur le véritable dossier ou la véritable page.
- Le mouvement doit donner une sensation de montée et de déplacement, sans retarder inutilement l'accès au contenu.
- L'expérience doit rester compréhensible et utilisable au clavier, au tactile et avec les technologies d'assistance.
- Sur mobile, prévoir une composition adaptée : le visiteur doit toujours pouvoir sélectionner les destinations sans précision excessive.

L'ascenseur n'est pas un menu permanent obligatoire dans chaque page. Le concept décrit un ascenseur présent sur l'accueil, servant à sélectionner une destination. Les pages internes conservent des moyens simples de retour à l'accueil et de navigation contextuelle.

## 3. Le dixième étage : moteur de recherche

Le 10e étage est destiné au moteur de recherche transversal. Il s'agit d'un espace à part entière, pas seulement d'un champ posé sur la page d'accueil.

Le moteur doit conserver une logique de sélection progressive et cohérente avec les sources :
- choix du type d'opportunité (public / privé lorsque pertinent) ;
- choix de la catégorie ;
- choix du département ;
- saisie de mots-clés et lancement de la recherche.

Les catégories, sources, filtres et pages de résultats doivent être spécifiés dans le dossier fonctionnel du moteur. La catégorie Nettoyage reste à cadrer précisément. Les résultats sont traçables et ne doivent pas être présentés comme vérifiés si la source ne le garantit pas.

## 4. Ébauche de nomenclature — non validée

Le premier visuel généré a proposé cette organisation de bas en haut :

| Niveau | Intitulé de travail |
|---|---|
| 10 | Moteur de recherche |
| 9 | Réseau |
| 8 | Salon |
| 7 | Séminaires |
| 6 | Réputation virtuelle |
| 5 | CRM & Business Intelligence |
| 4 | Prosp'active / Prospection |
| 3 | Accompagnement AO |
| 2 | Développement commercial |
| 1 | Informations & Services |
| 0 | Accueil |

Cette liste est une hypothèse de mise en scène, pas une décision d'arborescence. Elle contient potentiellement des recouvrements : Réseau / Salon / Séminaires ; CRM / BI / IA ; Développement commercial / Prosp'active / Accompagnement AO. Elle doit être auditée avant toute validation.

Le visuel généré est une maquette d'intention, pas une maquette technique de précision et ne constitue pas une source fiable pour les textes fins ou les coordonnées des zones interactives.

## 5. Direction artistique

Référence de style issue des échanges :
- architecture contemporaine en verre et métal ;
- panorama de zone industrielle / parc d'activités, bâtiments et infrastructures ;
- ascenseur extérieur vitré, vertical, lisible et animé ;
- atmosphère lumineuse et premium ;
- bleu nuancé, non monochrome ni saturé, associé au blanc, à des tons neutres et à des accents dorés ;
- intérieurs distincts par étage, cohérents dans une même identité graphique ;
- ambiance crédible et accueillante plutôt que science-fiction excessive.

Slogans :
- « Donner de la hauteur à vos ambitions. »
- « MajestiOS, pour une ascension magique et exponentielle. »

## 6. Une image intérieure par étage

Chaque destination doit disposer d'un visuel de l'intérieur de l'étage, et non d'une simple vignette de façade répétée.

Chaque visuel doit :
- représenter concrètement l'activité de l'étage ;
- respecter une direction artistique commune ;
- intégrer une hiérarchie claire entre titre, promesse, sous-rubriques et actions ;
- laisser la priorité aux véritables éléments d'interface HTML accessibles plutôt qu'à du texte essentiel incrusté dans l'image ;
- être conçu pour desktop et décliné / recadré pour mobile ;
- être optimisé en poids et formats ;
- être validé par le porteur du projet avant intégration.

Le 10e étage (Moteur de recherche) et le 9e étage (Réseau) ont reçu une première direction visuelle approuvée dans son principe ; le bleu doit être nuancé. Les autres étages restent à concevoir un par un, après validation de la nomenclature.

## 7. Navigation et accessibilité

- La barre de navigation classique peut être supprimée de l'accueil si le panorama rend toutes les destinations essentielles accessibles.
- Ne pas supprimer les accès utilitaires indispensables : accueil, contact, compte / espace personnel, aide et mentions légales doivent rester trouvables.
- Les rubriques Appels d'offres peuvent devenir des fonctionnalités ou sous-dossiers plutôt que des destinations de premier niveau, sous réserve de conserver tous les parcours utiles.
- Les pages internes doivent proposer un retour clair à l'accueil et des liens contextuels.
- Prévoir navigation clavier, focus visible, libellés accessibles, alternatives textuelles et préférence de réduction des animations.
- Le mouvement de l'ascenseur ne doit pas être l'unique moyen de comprendre la destination.

## 8. Architecture technique à étudier

Comparer avant de choisir :
- image de fond responsive + zones SVG ;
- scène SVG / HTML composée d'éléments séparés ;
- rendu 3D léger si le bénéfice justifie le coût ;
- animation CSS / Web Animations API pour le déplacement de l'ascenseur.

Éviter les coordonnées fixes en pixels. Les zones interactives doivent être définies dans un repère normalisé ou vectoriel, testées sur plusieurs ratios d'écran, et reliées à un catalogue de destinations unique.

## 9. Critères d'acceptation

- chaque étage affiché correspond à un dossier existant et documenté ;
- aucune destination n'est fictive ;
- chaque clic sélectionne la bonne destination ;
- l'ascenseur démarre au niveau accueil et se déplace vers l'étage demandé ;
- la transition reste proche de la durée cible sans bloquer l'interface ;
- aucun chevauchement ou perte de zone tactile sur mobile ;
- fonctionnement au clavier et réduction du mouvement ;
- tests automatisés des correspondances étage → route ;
- aucun changement des moteurs ou formulaires métier causé par le seul changement de présentation.
