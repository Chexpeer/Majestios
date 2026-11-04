# Prototype du back-office MajestiOS

Ce dossier contient le **prototype d'interface** du futur cockpit d'administration.

## Ouvrir le prototype

Ouvrir `index.html` dans un navigateur ou servir le dépôt avec un serveur statique.

## Périmètre de ce lot

- structure visuelle responsive ;
- navigation modulaire ;
- vue d'ensemble et aperçu des futurs espaces BrainIOS ;
- styles et interactions isolés dans des fichiers dédiés.

## Limites de sécurité et de fonctionnement

Ce prototype est une maquette locale : il n'intègre **aucune authentification, aucun backend, aucune base de données et aucune API OpenAI**. Les chiffres et éléments affichés sont des exemples fictifs. Il ne doit pas être publié ni ajouté au build public.

L'intégration réelle devra commencer par l'authentification et l'autorisation côté serveur. Les modules ne devront appeler que des API versionnées et protégées. Aucun secret ne sera transmis au navigateur.

## Organisation cible

- `index.html` : structure et points d'entrée des modules ;
- `admin.css` : tokens, layout, composants et responsive ;
- `admin.js` : navigation et interactions de présentation.

Les futurs modules fonctionnels seront ajoutés séparément, sans transformer cette interface en monolithe.
