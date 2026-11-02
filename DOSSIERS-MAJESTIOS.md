# MajestiOS — nouvelle arborescence fonctionnelle

Version : 2026-11-01  
Branche : `refonte-architecture-dossiers-charte-majestios-2026-11-01`  
Statut : nouvelle base de travail isolée ; aucune publication en production.

## Principe d'architecture

Cette refonte distingue explicitement **les dossiers fonctionnels** des **pages HTML**. Les dossiers ci-dessous organisent le produit, ses responsabilités et sa documentation. Les pages HTML statiques restent provisoirement à la racine du dépôt afin de préserver les chemins relatifs, le moteur de recherche et le build Vercel existants. Aucun fichier de page n'est renommé ni déplacé dans ce lot.

## Les dix dossiers thématiques

Ordre d'affichage de l'immeuble, du bas vers le haut :

1. `dossiers/01-marches-publics/` — Marchés publics
2. `dossiers/02-marches-prives/` — Marchés privés
3. `dossiers/03-veille-economique/` — Veille économique
4. `dossiers/04-prospection/` — Prospection active
5. `dossiers/05-developpement-commercial/` — Développement commercial
6. `dossiers/06-accompagnement-appels-offres/` — Accompagnement aux appels d'offres
7. `dossiers/07-salon-virtuel/` — Salon virtuel
8. `dossiers/08-espace-entreprises/` — Espace entreprises
9. `dossiers/09-crm/` — CRM
10. `dossiers/10-business-intelligence/` — Business Intelligence

Le rez-de-chaussée est réservé à **Accueil MajestiOS** et n'est pas compté comme un onzième thème. L'assistance et la FAQ restent des fonctions transversales, accessibles depuis la navigation générale.

## Correspondance provisoire avec les pages déjà existantes

| Dossier fonctionnel | Page HTML existante | Remarque |
|---|---|---|
| Marchés publics | `marches-publics.html` | Recherche et qualification des consultations publiques |
| Marchés privés | `marches-prives.html` | Opportunités privées ; distinguer les signaux BODACC des appels d'offres |
| Veille économique | `bodacc-veille-entreprises.html`, `veille-marches.html` | Sources et signaux clairement identifiés |
| Prospection | `prospection-active.html` | Libellé et page canoniques : « Prospection active » |
| Développement commercial | `developpement-commercial.html` | Domaine général et orchestration des démarches |
| Accompagnement aux appels d'offres | `accompagnement-appels-offres.html` | Analyse du dossier, pièces, candidature, offre et échéances |
| Salon virtuel | `salons-seminaires.html` | Page existante à faire évoluer vers le showroom collectif |
| Espace entreprises | `espace-membre.html` | Parcours de démonstration ; ne pas présenter comme compte réel |
| CRM | `crm.html`, `suivi-commercial.html` | Distinguer la fiche relationnelle, le pipeline et la capitalisation |
| Business Intelligence | `intelligence-economique.html`, `brainos.html` | Dossier d'analyse ; préciser les fonctions réelles et ne pas promettre d'automatisation non disponible |

## Règles de conception

- Une seule taxonomie canonique : les mêmes dix intitulés sont utilisés dans la scène d'accueil, le catalogue de navigation et cette arborescence.
- Les dossiers peuvent accueillir plus tard des sous-dossiers tels que Sources, Méthodes, Données, Parcours et Contrôles ; ne pas créer de pages HTML par simple effet de remplissage.
- Le nombre de liens affichés dans un étage dépend des pages réellement utiles : ne pas imposer trois accès artificiels. Les accès transversaux (FAQ, contact, rejoindre MajestiOS) restent dans la navigation générale ; les raccourcis entre dossiers ne sont ajoutés que lorsqu'ils servent un parcours métier clair.
- Le moteur de recherche reste un composant partagé, avec ses paramètres `q`, `categorie`, `marche` et `zone`, ses sources identifiées et ses limites explicites.
- Le style de référence est le thème sombre bleu nuit, les accents or, les contrastes élevés, les interactions discrètes et une mise en page responsive.
- La zone/immeuble reste une porte d'entrée visuelle ; le moteur de recherche reste un outil distinct, immédiatement accessible.
- Les pages métier et pages de résultats ne sont pas interchangeables. Une recherche doit aboutir à une destination de résultats adaptée à la source et aux filtres.
- Les données de démonstration ne doivent jamais être présentées comme des annonces réelles.
- Aucun changement n'est promu en production depuis cette branche. Les modifications seront testées avant toute demande de déploiement.

## Critères anti-régression

1. Le build statique copie les ressources déclarées, y compris l'image de référence.
2. Le moteur conserve ses filtres, les paramètres d'URL et les destinations existantes.
3. Chaque étage ouvre une destination cohérente et chaque dialogue est utilisable au clavier.
4. L'affichage fonctionne sur mobile et ordinateur, sans texte tronqué ni zones cliquables trop petites.
5. Les dix dossiers sont présents et les anciens documents de référence sont conservés.
6. Aucun fichier HTML n'est déplacé ou renommé par le seul fait de créer cette arborescence.
