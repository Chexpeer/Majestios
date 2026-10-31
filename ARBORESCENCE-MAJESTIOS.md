# Arborescence MajestiOS — référence de travail

Version : 2026-10-31
Branche de référence : prototype-zone-artisanale
Nature : audit de structure et feuille de route du prototype statique.

## 1. Architecture cible du site public

### A. Entrée principale
- index.html — accueil compact, doctrine de présentation, panorama noir et or interactif à douze surfaces, fil AO fictif avec recherche et filtres, formulaires de demande.
- zone-artisanale.html — univers virtuel 3D, répertoire des douze espaces, raccourcis vers la recherche d’opportunités et les formulaires.
- faq.html — explication du concept et limites actuelles.
- nous-rejoindre.html — contributions, compétences et coopérations envisagées.
- espace-membre.html — préfiguration du parcours personnel, sans compte réel.

### B. Douze rubriques métier
Le schéma de l’accueil et les douze bâtiments de la zone doivent conserver une correspondance univoque avec les fichiers suivants :

1. Marchés publics — marches-publics.html
2. Marchés privés — marches-prives.html
3. Développement commercial — developpement-commercial.html
4. Prospection inversée — prospection-inversee.html
5. Intelligence économique — intelligence-economique.html
6. Réseaux et synergies — reseaux-synergies.html
7. Veille des marchés — veille-marches.html
8. Accompagnement aux appels d’offres — accompagnement-appels-offres.html
9. Sous-traitance et débordement de marchés — sous-traitance.html
10. Salons et séminaires — salons-seminaires.html
11. Veille des entreprises BODACC — bodacc-veille-entreprises.html
12. Suivi commercial et capitalisation — suivi-commercial.html

Les rubriques sont des pages distinctes. Chaque page doit proposer une navigation commune, un retour à la zone artisanale, un retour à l’accueil et des liens vers des rubriques connexes. Les illustrations interactives ne doivent pas être présentées comme des services connectés.

## 2. Règles de navigation

Navigation commune des pages éditoriales :
- Accueil → index.html
- Opportunités → index.html#flux-ao
- Univers virtuel → zone-artisanale.html
- Nous rejoindre → nous-rejoindre.html
- Espace membre → espace-membre.html
- FAQ → faq.html

La zone artisanale conserve une navigation adaptée à son interface, avec accès visibles à la recherche, au formulaire de contact et à l’accueil. Les douze bâtiments doivent pointer vers les pages métier correspondantes.

Les catégories de recherche sont définies dans `catalogue-majestios.js`. Toute catégorie active doit posséder une page HTML existante et tout résultat catégorisé doit renvoyer vers cette page. Les catégories prévues restent désactivées jusqu’à ce que le moteur dispose de données adaptées.\n\nLes liens internes doivent être vérifiés après chaque modification. Un lien « # » peut être utilisé temporairement par un contrôle désactivé avant sélection, mais ne doit jamais être présenté comme une destination active. Sur la zone artisanale, le bouton « Découvrir » est volontairement désactivé tant qu’aucun bâtiment n’est sélectionné.

## 3. Fichiers et responsabilités

- index.html : structure de l’accueil et points d’entrée vers les parcours.
- styles.css : styles communs, navigation, accueil, formulaires et pages éditoriales.
- catalogue-majestios.js : source de référence partagée pour les douze rubriques, les destinations du panorama, les routes des bâtiments 3D et la taxonomie du moteur de recherche.
- app.js : interactions de l’accueil, filtres du flux fictif, scénarios et prévisualisation des demandes. Les destinations et menus de catégories sont construits depuis le catalogue partagé.
- schema-majestios.svg : surfaces du schéma interactif.
- rubriques-immersives.css / rubriques-immersives.js : présentation et interactions visuelles communes aux douze pages métier.
- zone-artisanale.html / zone-artisanale.css / zone-artisanale.js : scène 3D, panneau de bâtiment, répertoire et contrôles de visite.
- build.js : liste des fichiers à copier dans dist/. Tout fichier chargé par une page doit être inclus dans cette liste.
- README.md : mode d’emploi et état fonctionnel véridique du prototype.

## 4. État fonctionnel — à ne pas confondre

### Présent dans le prototype
- Schéma SVG panoramique noir et or interactif avec douze destinations métier.
- Douze pages dédiées, avec espaces visuels propres à chaque rubrique.
- Zone artisanale 3D avec sélection de bâtiment, déplacements et solution de secours en cas d’échec de chargement.
- Fil AO avec recherche par texte, filtres catégorie/type de marché/localisation, sur cinq exemples fictifs.
- Catalogue commun reliant les douze surfaces du panorama aux destinations des bâtiments 3D.
- Taxonomie de recherche avec catégories de démonstration actives et catégories futures explicitement désactivées tant que les sources ne sont pas connectées.
- Formulaire de demande avec champs adaptés à l’intention choisie et prévisualisation locale.
- Formulaire de préfiguration de l’espace membre.

### Non opérationnel / à connecter
- Aucun flux d’appels d’offres réels ni connexion aux plateformes publiques ou privées.
- Aucun enregistrement ou envoi des formulaires.
- Aucun compte utilisateur, authentification ou espace client réel.
- Aucune connexion opérationnelle aux sources BODACC, emploi, réseaux professionnels, CRM ou notifications.
- Les pages métier sont des présentations structurées et des parcours visuels, pas encore des applications métier complètes.

## 5. Corrections issues de l’audit du 31 octobre 2026

- L’accueil a été resserré : le panorama interactif, le fil AO avec recherche/filtres et les formulaires restent présents ; les anciennes sections éditoriales et démonstratives ont été retirées de la page d’entrée.
- Les styles de l’accueil ont été harmonisés autour de l’identité noire et or du panorama, y compris les zones de recherche et de formulaire.

- Le script build.js ne copiait pas les fichiers rubriques-immersives.css et rubriques-immersives.js, pourtant référencés par les douze pages métier. Les deux fichiers doivent rester dans la liste de compilation.
- La FAQ décrivait à tort les destinations du schéma comme restant à relier. Le texte a été corrigé : les douze destinations existent, mais les connexions métier restent à construire.
- La navigation éditoriale a été harmonisée afin de garder un accès aux opportunités et à la zone artisanale depuis les pages.
- La documentation de projet a été remise en cohérence avec les fichiers et les fonctions présentes.

## 6. Prochaines améliorations recommandées — dans cet ordre

### Priorité 1 — fiabilité structurelle
1. Vérifier automatiquement les liens locaux, ancres, IDs dupliqués et destinations de schéma à partir de catalogue-majestios.js.
2. Exécuter le script de préparation et confirmer que chaque fichier référencé par le HTML est présent dans dist/, y compris le catalogue partagé.
3. Vérifier le fonctionnement des menus sur mobile et l’état aria-expanded.
4. Vérifier les erreurs JavaScript et le fallback 3D avec un serveur local.

### Priorité 2 — parcours commercial
1. Garder le flux de recherche accessible depuis toutes les rubriques.
2. Concevoir une vraie page de recherche dédiée lorsque les filtres dépasseront le besoin de démonstration de l’accueil.
3. Préparer un modèle commun de demande de contact pour éviter les formulaires divergents.
4. Prévoir états explicites : exemple fictif, source réelle vérifiée, action indisponible, demande envoyée.

### Priorité 3 — données et sécurité
1. Choisir les sources de données et leurs conditions d’utilisation avant d’implémenter les connecteurs.
2. Définir le schéma des opportunités : source, référence, date de publication, échéance, acheteur, secteur, zone, statut de vérification, URL source.
3. Définir le traitement des demandes, le consentement, la confidentialité et la durée de conservation avant de collecter des données réelles.
4. Ajouter authentification et stockage uniquement après définition des rôles, permissions et parcours utilisateur.

### Priorité 4 — immersion utile
1. Améliorer la visite mobile, le panoramique et la sélection tactile sans empêcher la navigation par glissement.
2. Relier les bâtiments aux tâches réellement disponibles dans chaque espace.
3. Réserver les animations aux informations utiles ; réduire les effets si l’utilisateur demande moins de mouvement.
4. Ne pas ajouter de décor immersif au détriment du moteur de recherche, des filtres, des formulaires ou de la lisibilité.

## 7. Règle de validation

Une évolution est considérée comme terminée seulement si :
- ses fichiers sont présents et inclus dans la préparation du site ;
- ses liens et ses états interactifs ont été vérifiés ;
- les fonctions fictives sont étiquetées comme telles ;
- la navigation principale reste cohérente ;
- aucune fonctionnalité métier non implémentée n’est annoncée comme opérationnelle.

Ce document est une référence d’arborescence et de contrôle, pas une déclaration que les intégrations métier sont déjà réalisées.


## 7. Fondations du moteur de recherche — 31 octobre 2026

- Le catalogue partagé `catalogue-majestios.js` définit les douze destinations, leur identifiant de bâtiment, leur surface SVG et leur page cible.
- Le schéma d'accueil et la scène 3D lisent leurs destinations depuis ce catalogue, afin de limiter les divergences lors de futures évolutions.
- Le moteur de démonstration distingue désormais le texte recherché, la catégorie, le type de marché et la localisation.
- Les catégories actuellement représentées par les cinq annonces fictives restent activées : services numériques, travaux et aménagement, conseil et études.
- Les futures catégories (fournitures, lots BTP, maintenance, logistique, formation/recrutement, communication/événementiel) sont préparées mais désactivées. Elles ne seront activées qu'après ajout de données et de sources adaptées.
- Le filtre « marchés privés » existe dans la structure mais ne renvoie aucune annonce dans le jeu de démonstration actuel, composé d'exemples publics fictifs. Ce n'est pas une recherche connectée aux marchés privés.
- Le catalogue est copié dans `dist/` et vérifié par le contrôle anti-régression.


## 8. Pages dédiées aux catégories d'appels d'offres — préparation

Les catégories actives disposent désormais de pages de destination distinctes :
- Services numériques — `categorie-services-numeriques.html`
- Travaux et aménagement — `categorie-travaux-amenagement.html`
- Conseil et études — `categorie-conseil-etudes.html`
- Bâtiment et construction — `categorie-batiment.html`
- Rénovation — `categorie-renovation.html`
- Électricité — `categorie-electricite.html`
- Plomberie et chauffage — `categorie-plomberie-chauffage.html`
- Maintenance et exploitation — `categorie-maintenance.html`

Chaque page présente le périmètre de sa spécialité et transmet le filtre au moteur d'accueil par le paramètre `?categorie=`. Les cartes du fil proposent également un accès à la page de leur catégorie. Les résultats affichés restent des exemples fictifs ; aucun connecteur réel de marchés publics ou privés n'est activé.
