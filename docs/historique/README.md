# MajestiOS — prototype de développement commercial assisté par IA

MajestiOS vise à aider les professionnels à détecter des marchés et projets, identifier des entreprises et contacts, qualifier des pistes et organiser leur développement commercial.

**Ce dépôt contient un prototype statique.** Il ne constitue pas encore une plateforme SaaS complète : les écrans, formulaires et démonstrations ne prouvent pas à eux seuls qu’un service métier, une sauvegarde CRM, une authentification ou une automatisation est opérationnel.

## Démarrer le prototype

Aucune installation applicative n’est requise. Depuis la racine du dépôt :

```sh
python -m http.server 8000
```

Ouvrir ensuite http://localhost:8000.

Pour préparer et contrôler le site :

```sh
node build.js
node verify-site.js
```

Les contrôles statiques ne remplacent pas les tests navigateur, notamment pour la scène interactive, les interactions tactiles et les parcours de recherche.

## État fonctionnel à ne pas surinterpréter

- Les recherches BOAMP et BODACC interrogent des sources externes à la demande ; disponibilité et résultats dépendent de ces sources.
- Le ciblage APE/NAF est une aide à la préqualification, pas une preuve de compétence ni une validation commerciale.
- Les données affichées par les prototypes ne sont pas nécessairement enregistrées dans un CRM.
- L’espace membre ne doit pas être considéré comme une authentification opérationnelle.
- Les formulaires de démonstration ne garantissent ni transmission ni conservation d’une demande.
- Les rubriques non connectées ne doivent pas afficher de résultats fictifs.

## Structure et règles de contribution

- Les pages HTML métier restent à la racine pour préserver les liens relatifs existants.
- Ne déplacer ni supprimer une page ou une ressource sans vérifier ses références, les liens entrants, le build et les tests.
- Une rubrique métier doit conduire à une page dédiée ; ne pas remplacer une page par une ancre vers un long contenu d’accueil.
- Ne pas publier en production une branche ou une prévisualisation qui n’a pas été vérifiée.
- Distinguer systématiquement documentation, maquette, prototype connecté et fonctionnalité réellement opérationnelle.

## Documentation

Le point d’entrée documentaire est **[docs/README.md](docs/README.md)**. Il classe les documents existants par sujet et donne l’ordre de lecture recommandé.

