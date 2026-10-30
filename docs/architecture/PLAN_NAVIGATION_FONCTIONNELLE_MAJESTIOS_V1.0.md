# Plan de navigation fonctionnelle MajestiOS — V1.0

> **Signature : « MajestiOS — L’intelligence qui saute aux yeux ! »**

**Date :** 30 octobre 2026  
**Branche de référence :** `etoile-coeur-majestios`  
**Statut :** proposition de navigation pour cadrer le MVP, à vérifier par tests fonctionnels avant mise en production.

## 1. Périmètre prioritaire

Le chantier actuel porte exclusivement sur :
- le centre névralgique et le schéma interactif des six dossiers ;
- le moteur de recherche des opportunités ;
- les destinations dédiées des six dossiers ;
- les liens transversaux et les espaces de croisement nécessaires à ces parcours.

Le dossier EMPLOI est hors périmètre de cette phase.

## 2. Règles d'architecture non négociables

- **Principe d'efficacité :** la complexité doit être portée par le système, jamais imposée au client. L'interface doit montrer l'action utile, pas demander de lire de longues explications.
- **Navigation principale limitée à quatre entrées :** Accueil, Partenaires, Nous rejoindre, Espace personnel. Ne pas ajouter une seconde barre de navigation qui ferait doublon avec le schéma.
- **Le schéma est l'interface de navigation principale :** les six dossiers, leurs relations et leurs croisements sont découverts depuis lui. Les fonctions ne doivent pas être reléguées dans de longs menus ou dans une page d'accueil interminable.
- **Triangle = dossier MajestiOS.**
- **Côté = lien entre dossiers.**
- **Croisement = sous-dossier ou page d'information/documentation.**
- Le centre névralgique est un point de convergence et de navigation, pas un septième dossier.
- Le schéma explique l'écosystème ; le moteur de recherche sert à trouver et qualifier des opportunités.
- Chaque dossier possède une destination distincte, une identité visuelle cohérente et une navigation interne.
- Les liens transversaux peuvent ouvrir directement une destination d'un autre dossier ; il ne faut pas obliger l'utilisateur à repasser par l'accueil.
- Ne créer un sous-dossier ou une page que si cela apporte une fonction ou un contenu distinct. Ne pas multiplier les pages pour matérialiser chaque lien.
- Toute donnée d'opportunité doit distinguer la source, les informations vérifiées, l'analyse MajestiOS et les éléments inconnus.

## 3. Carte principale des destinations

| Niveau | Destination | Route proposée / existante | Rôle |
|---|---|---|---|
| Centre | Accueil et schéma interactif | `/` | Présenter MajestiOS, permettre la recherche et ouvrir les six dossiers. |
| Recherche | Explorer les opportunités | `/opportunites` | Entrée transversale vers les catégories d'opportunités. |
| Recherche | Résultats d'appels d'offres publics | `/opportunites/marches-publics/appels-offres` | Recevoir la requête et les filtres du moteur. |
| Dossier 1 | Développement commercial | `/developpement-commercial` | Intelligence commerciale, études et stratégie de développement. |
| Dossier 2 | Marchés publics | `/opportunites/marches-publics` | Recherche, compréhension, qualification et suivi des marchés publics. |
| Dossier 3 | Marchés privés | `/opportunites/marches-prives` | Opportunités privées et parcours de positionnement. |
| Dossier 4 | Qualification & prospection | `/developpement-commercial/prospection` | Qualification des opportunités et des entreprises, ciblage et prospection. |
| Dossier 5 | Salons & événements professionnels | `/opportunites/salons` | Repérage et exploitation commerciale des événements. |
| Dossier 6 | Accompagnement | `/developpement-commercial/accompagnement-appels-offres` | Accompagnement à la préparation et au positionnement. |

**État du contrôle initial :** les huit routes listées ci-dessus ont été retrouvées sous `src/app` sur la branche indiquée. Cela confirme l'existence des fichiers de page, mais pas encore la qualité de leur contenu, le bon fonctionnement de tous les liens, ni la présence de données réelles derrière chaque fonctionnalité.

## 4. Structure de la page d'accueil

La page d'accueil est un centre de commande visuel, pas un tableau de bord ni une page éditoriale longue.

1. **Barre de navigation minimale :** Accueil · Partenaires · Nous rejoindre · Espace personnel.
2. **Schéma interactif au premier plan :** les six dossiers sont les portes d'entrée de l'écosystème. Le schéma rend visibles les liens et les croisements utiles.
3. **Recherche d'opportunités :** accessible immédiatement, intégrée à la composition sans concurrencer ni recouvrir le schéma. Les filtres avancés peuvent se déployer à la demande.
4. **Flux d'annonces discret :** annonces publiques et privées, sans transformer l'accueil en catalogue.
5. **Micro-explication contextuelle :** une seule accroche courte pour le dossier survolé ou sélectionné ; pas de blocs explicatifs permanents.

**Règle de sobriété :** aucun grand catalogue, aucune longue présentation sous le schéma et aucun menu parallèle. Les détails apparaissent dans le dossier concerné, au moment où ils deviennent utiles. Le schéma et la recherche restent distincts fonctionnellement, mais doivent former une composition visuelle cohérente.

## 5. Comportement du schéma interactif

Le schéma doit faire comprendre l'essentiel sans mode d'emploi : « Parce qu'un schéma vaut mille explications. »

### Ordinateur
- Au repos : schéma équilibré, six dossiers identifiables.
- Au survol d'un dossier : changement de couleur/contraste, titre renforcé et affichage d'une accroche courte.
- Les liens associés au dossier peuvent s'éclairer, à condition de conserver une lecture claire.
- Au clic : ouverture de la route dédiée du dossier, et non d'une ancre dans la page d'accueil.
- Le focus clavier doit produire un état actif équivalent au survol.

### Téléphone et écran tactile
- Le premier appui sélectionne le dossier et affiche son accroche.
- Un bouton explicite « Ouvrir le dossier » permet ensuite d'ouvrir sa destination. Éviter un double-tap implicite si celui-ci rend l'action peu compréhensible.
- Les zones interactives doivent être assez grandes et ne pas se chevaucher.

### Accroches initiales
- **Développement commercial :** « Transformez les signaux du marché en opportunités de croissance. »
- **Marchés publics :** « Repérez les appels d'offres pertinents et comprenez les exigences avant de vous positionner. »
- **Marchés privés :** « Découvrez des besoins moins visibles et développez votre réseau commercial. »
- **Qualification & prospection :** « Identifiez les entreprises pertinentes et concentrez vos efforts là où ils comptent. »
- **Salons & événements professionnels :** « Préparez les rencontres qui peuvent faire avancer votre activité. »
- **Accompagnement :** « Passez de l'opportunité à une démarche structurée et concrète. »

Les textes sont des propositions éditoriales ; ils ne doivent pas laisser croire qu'une fonctionnalité automatisée existe tant qu'elle n'est pas opérationnelle.

## 6. Parcours prioritaires du moteur de recherche

### Parcours A — Recherche publique
Accueil → saisie des mots-clés / localisation / catégorie → résultats → détail ou source de l'annonce → qualification → décision de suivi ou de préparation.

### Parcours B — Recherche privée
Accueil ou Explorer les opportunités → marchés privés → annonce synthétique → explication des informations disponibles et des conditions d'accès → création d'espace personnel si nécessaire → suivi de l'opportunité.

### Parcours C — De l'opportunité à l'entreprise
Opportunité → qualification du besoin → identification d'entreprises potentiellement pertinentes → vérification des informations disponibles → préparation d'une démarche de contact.

### Parcours D — De l'entreprise à l'opportunité
Qualification & prospection → définition du profil d'entreprise → recherche d'opportunités correspondantes → classement des résultats → action suivante.

### Parcours E — Accompagnement
Depuis une opportunité ou un dossier → accès direct à l'accompagnement concerné → conservation du contexte de l'opportunité, sans ressaisie inutile.

## 7. Espaces de croisement à prioriser

Ces croisements doivent d'abord être conçus comme des fonctions et des destinations réutilisables. Ils ne nécessitent pas tous une nouvelle page autonome.

| Croisement | Dossiers liés | Priorité | Destination fonctionnelle |
|---|---|---:|---|
| Qualification d'une opportunité | Public, privé, prospection | P0 | Vue d'analyse associée à une opportunité. |
| Identification d'entreprises | Développement commercial, prospection | P0 | Recherche et fiche synthétique d'entreprise, selon données disponibles. |
| Préparation d'une réponse | Marchés publics, accompagnement | P0 | Checklist/documentation liée à un marché. |
| Suivi d'opportunité | Public, privé, développement commercial | P1 | Liste des opportunités suivies et de leurs états. |
| Analyse sectorielle | Développement commercial, public, privé | P1 | Ressource ou vue d'analyse sectorielle. |
| Documentation commerciale | Développement commercial, prospection, accompagnement | P1 | Bibliothèque de ressources contextualisées. |
| Réseautage professionnel | Événements, développement commercial, prospection | P2 | Suivi des contacts et actions après événement. |
| Besoins de sous-traitance | Public, privé, prospection | P2 | Vue de rapprochement entre besoins et capacités potentielles. |

P0 = nécessaire au parcours initial ; P1 = amélioration importante ; P2 = évolution après stabilisation du noyau.

## 8. Navigation globale et identité visuelle des dossiers

- **Accueil :** retour au centre névralgique et au schéma.
- **Partenaires :** accès au réseau et aux relations professionnelles de MajestiOS.
- **Nous rejoindre :** contribution au projet, compétences et opportunités pour rejoindre les équipes.
- **Espace personnel :** compte, démarches et dossiers de l'utilisateur.
- Les six dossiers et leurs fonctions sont accessibles depuis le schéma ; ils ne doivent pas être dupliqués dans la barre principale.

### Identité visuelle des dossiers

- Conserver une charte globale commune MajestiOS, avec des variations discrètes par dossier.
- Donner à chaque page un symbole ou filigrane propre, en arrière-plan, sans nuire à la lecture.
- Maintenir une navigation cohérente, un titre clair, un repère de dossier et des liens transversaux utiles.
- Garder le schéma central comme outil de découverte et de retour rapide, sans l'imposer à chaque déplacement.
- Préserver les codes visuels convenus pour les annonces publiques et privées.

## 9. Critères d'acceptation avant de considérer la V1 fonctionnelle

- Les six zones du schéma sont accessibles à la souris, au clavier et au tactile.
- Chaque zone mène à sa destination dédiée.
- Chaque destination possède un contenu propre et n'est pas un simple renvoi vers une section de l'accueil.
- La recherche transmet les critères saisis aux résultats et ceux-ci influencent réellement la liste affichée.
- Les filtres non implémentés ne sont pas présentés comme opérationnels.
- Chaque annonce affiche sa source et, lorsqu'elle est connue, sa date et son échéance.
- Les erreurs, résultats vides et données indisponibles sont explicitement traités.
- Les liens transversaux ne créent pas de boucles, de pages mortes ou de destinations trompeuses.
- Le schéma reste lisible sur mobile et ne chevauche pas le moteur de recherche.
- La navigation principale contient exclusivement Accueil, Partenaires, Nous rejoindre et Espace personnel.
- Aucun menu secondaire ne duplique la navigation fonctionnelle déjà portée par le schéma.
- Les explications permanentes sont remplacées par des accroches courtes et des contenus contextuels.
- Les flux d'annonces restent discrets et ne dominent pas la page d'accueil.

## 10. Ordre de réalisation

1. Auditer le schéma et toutes les destinations de ses six liens.
2. Auditer le moteur actuel : critères acceptés, transmission, filtres réellement appliqués et états d'erreur.
3. Corriger les incohérences de navigation et les destinations manquantes.
4. Stabiliser les interactions du schéma (survol, focus clavier, tactile, clic).
5. Relier les résultats de recherche aux fonctions de qualification et d'accompagnement.
6. Vérifier les critères d'acceptation ci-dessus avant toute déclaration de mise en production.

## 11. Limites de cette V1

Ce document constitue un plan fonctionnel de navigation. Il ne certifie pas que toutes les fonctions sont déjà développées, connectées à des sources externes ou alimentées par des données en temps réel. Ces points devront être vérifiés dans le code et par des tests dédiés avant de les présenter comme disponibles.
