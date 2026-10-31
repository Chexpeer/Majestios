# MajestiOS — prototype public

MajestiOS est un projet d’**intelligence commerciale proactive** et de **prospection inversée assistée par IA**. Ce dépôt contient une vitrine statique interactive en français. Il sert à valider l’arborescence, les parcours visuels et la navigation avant le raccordement des services métier.

## Parcours principal

- **Accueil** (index.html) : présentation, schéma interactif à douze surfaces, recherche illustrative d’appels d’offres, démonstration de qualification et formulaires de demande.
- **Univers virtuel** (zone-artisanale.html) : visite 3D expérimentale avec douze bâtiments, liens vers les rubriques métier et accès rapide à la recherche et aux formulaires.
- **Douze rubriques métier** : marchés publics, marchés privés, développement commercial, prospection inversée, intelligence économique, réseaux et synergies, veille des marchés, accompagnement aux appels d’offres, sous-traitance, salons et séminaires, veille BODACC et suivi commercial.
- **Espace membre** (espace-membre.html) : parcours de prévisualisation d’une demande, sans création réelle de compte.
- **Nous rejoindre** (nous-rejoindre.html) : présentation des contributions et coopérations envisagées.
- **FAQ** (faq.html) : repères sur le concept et les limites actuelles du prototype.

La carte d’arborescence détaillée et les priorités d’évolution sont décrites dans ARBORESCENCE-MAJESTIOS.md.

## Démarrer en local

Aucune installation applicative n’est nécessaire. Depuis ce dossier, lancer un serveur statique :

    python -m http.server 8000

Puis ouvrir http://localhost:8000. Un serveur local est préférable à l’ouverture directe des fichiers, notamment pour le chargement du SVG interactif et des modules 3D.

## Préparer le dossier statique

Le script build.js copie les pages et tous les fichiers nécessaires dans dist/, dont les scripts et styles des douze rubriques et de la zone artisanale.

    node build.js

## État réel des fonctionnalités

### Présent et interactif dans le prototype
- Navigation entre l’accueil, le schéma, les rubriques et la zone artisanale.
- Fil de démonstration avec recherche par texte et filtres secteur/localisation.
- Scénarios illustratifs de qualification.
- Formulaires avec validation et prévisualisation locale.
- Visite 3D avec répertoire de bâtiments et vue de secours en cas d’échec du chargement.

### Non connecté ou à développer
- Le flux AO utilise **cinq annonces fictives** : aucune source d’appels d’offres n’est interrogée.
- Les formulaires n’envoient ni n’enregistrent de données.
- L’espace membre ne crée pas de compte.
- Les sources BODACC, marchés publics/privés, emploi et réseaux ne sont pas raccordées.
- Pas de base métier, de CRM opérationnel, d’authentification, de notifications ou d’envoi externe.

Une rubrique visuelle ou un lien de navigation ne doit jamais être interprété comme la preuve qu’un service métier est déjà opérationnel. Les données fictives doivent rester explicitement signalées jusqu’à la mise en place de connecteurs réels.

## Principes de travail

- Garder la recherche d’opportunités, les filtres, les formulaires et les accès de contact visibles malgré l’expérience immersive.
- Une rubrique = une page dédiée, avec navigation cohérente et liens retour.
- Ne pas remplacer des fonctions réelles par une simulation sans l’indiquer clairement.
- Tester les liens locaux, les destinations d’ancrage, les assets copiés dans dist/ et les interactions clavier/mobile après chaque évolution.
