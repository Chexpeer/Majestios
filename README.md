# MajestiOS — prototype public de référence

MajestiOS est un projet d’**intelligence commerciale proactive** et de **prospection inversée assistée par IA**. Ce dépôt contient le prototype statique servant à valider l’expérience, l’arborescence et les parcours avant raccordement des services métier.

## Structure de référence de l’accueil

La page `index.html` doit contenir uniquement :
1. la barre de navigation principale composée exactement de : Accueil, Développement commercial, Salon virtuel, Nous rejoindre, Espace membre et FAQ ;
2. la zone artisanale virtuelle interactive, visible directement sur l’accueil ;
3. le moteur de recherche avancé.

La liste d’appels d’offres, les blocs explicatifs, les répertoires redondants, les formulaires permanents et les pieds de page sont exclus de l’accueil. Le flux d’annonces défilant en haut de page est une évolution ultérieure, à ajouter seulement lorsqu’il sera prêt. Aucune annonce fictive ne doit être présentée comme un résultat réel.

## Pages et ressources à conserver

- `index.html` : accueil épuré, scène interactive et recherche avancée.
- `zone-artisanale.html`, `zone-artisanale.css`, `zone-artisanale.js` : page autonome de secours/visite et moteur 3D partagé tant que les liens des pages métier l’utilisent.
- `marches-publics.html`, `marches-prives.html` et les dix autres pages métier : destinations des douze bâtiments.
- `categorie-*.html` : pages de destination pour les catégories du moteur de recherche.
- `nous-rejoindre.html`, `espace-membre.html`, `faq.html` : rubriques secondaires accessibles par navigation.
- `styles.css`, `app.js`, `catalogue-majestios.js`, `rubriques-immersives.css`, `rubriques-immersives.js` : styles, interactions, correspondance des bâtiments et présentation commune.
- `build.js`, `verify-site.js`, `.github/workflows/verify-site.yml`, `vercel.json` : préparation, vérification et configuration de publication.
- `README.md` et `ARBORESCENCE-MAJESTIOS.md` : seules références documentaires de ce prototype. Le README explique l’état courant ; l’arborescence décrit les pages, dépendances et règles de validation.

Ne supprimer aucun fichier de page ou ressource avant d’avoir vérifié les références dans les scripts, les liens entrants et le processus de build. Les fichiers de prototype qui paraissent anciens peuvent encore être requis par le contrôle automatique ou par une page métier.

## Démarrer et vérifier

Aucune installation applicative n’est nécessaire. Lancer un serveur statique depuis ce dossier :

```sh
python -m http.server 8000
```

Puis ouvrir `http://localhost:8000`. Pour préparer le site et vérifier les liens :

```sh
node build.js
node verify-site.js
```

Le contrôle statique ne remplace pas un test dans un navigateur réel, notamment pour la scène 3D, les gestes tactiles et les interactions JavaScript.

## État fonctionnel réel

- La scène 3D et les filtres de recherche sont des fonctions du prototype ; vérifier leur rendu et leur comportement dans le navigateur.
- Les résultats de marché sont fictifs tant que des sources réelles ne sont pas connectées.
- Les formulaires peuvent prévisualiser une demande mais ne garantissent pas son envoi ni son enregistrement.
- L’espace membre ne crée pas de compte réel.
- Aucun lien de navigation ni écran de démonstration ne doit être interprété comme preuve qu’un service métier est opérationnel.

## Règles de travail

- La structure d’accueil ci-dessus est la référence : navigation + zone artisanale interactive + recherche avancée, rien d’autre.
- Une rubrique métier = une page dédiée ; ne pas remplacer des pages par des ancres vers de longs paragraphes de l’accueil.
- Préserver les douze destinations du catalogue et les formulaires requis par les parcours secondaires.
- Contrôler les liens, ressources copiées dans `dist/`, états interactifs et rendu mobile après chaque évolution.
- Ne pas publier en production une branche ou une prévisualisation qui n’a pas été vérifiée.
