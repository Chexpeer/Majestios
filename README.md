# MajestiOS

MajestiOS est un projet de plateforme web d’intelligence et de développement commercial. Il vise à aider les entreprises et les professionnels à repérer des marchés, suivre des signaux économiques, identifier des entreprises pertinentes et structurer leur prospection.

> **État du dépôt :** cette branche contient un prototype web statique en HTML, CSS et JavaScript. Certaines pages présentent des espaces ou fonctionnalités en cours de construction. Leur présence dans le site ne signifie pas qu’un service connecté ou une automatisation complète est déjà opérationnel.

## Aperçu

Le site regroupe plusieurs espaces fonctionnels :

- **Accueil et recherche transversale** : point d’entrée vers les rubriques du site.
- **Marchés publics et veille** : consultation et recherche d’opportunités, avec des contrôles de connexion aux sources BOAMP.
- **Marchés privés** : espace de recherche et de présentation des opportunités privées.
- **Développement commercial** : prospection, suivi commercial, réseaux et accompagnement.
- **Veille des entreprises** : informations issues notamment du BODACC.
- **Qualification des entreprises** : outils indicatifs de rapprochement par codes APE/NAF et département.
- **Espaces complémentaires** : CRM, espace membre, MajestiOS V.5, FAQ et informations légales.

Les résultats administratifs et les scores de rapprochement sont des aides à l’analyse. Ils ne prouvent pas la compétence, la capacité opérationnelle ou l’éligibilité d’une entreprise à un marché. Une vérification humaine reste nécessaire.

## Technologies

- HTML pour les pages ;
- CSS pour les styles ;
- JavaScript natif pour les interactions et les modules métier ;
- Node.js pour les scripts de construction et les tests ;
- Playwright pour les tests exécutés dans un navigateur ;
- Vercel pour la construction et l’hébergement du site statique.

Le projet ne nécessite pas de framework front-end pour construire le site statique.

## Lancer le site en local

Prérequis : Node.js 22 recommandé (la CI utilise Node.js 22).

Depuis la racine du dépôt :

```bash
node build.js
```

Cette commande vérifie les fichiers sources requis, puis copie les pages et ressources dans le dossier `dist/`.

Pour servir le résultat localement, avec Python :

```bash
python -m http.server 8000 --directory dist
```

Ouvrir ensuite [http://localhost:8000](http://localhost:8000).

Le dossier `dist/` est généré par le build ; les modifications doivent être faites dans les fichiers sources à la racine, puis reconstruites.

## Tests et contrôles

Les contrôles métier peuvent être exécutés séparément :

```bash
node tests/company-targeting.test.cjs
node tests/company-fit.test.cjs
node tests/naf-suggestions.test.cjs
```

Vérification de la syntaxe et de la construction :

```bash
node --check app.js
node --check opportunity-search.js
node --check rubric-search.js
node build.js
node verify-architecture.js
node verify-site.js
```

Les tests d’intégration BOAMP et BODACC interrogent des services externes et nécessitent un accès réseau :

```bash
node tests/boamp-live-smoke.cjs
node tests/bodacc-live-smoke.cjs
```

Les tests navigateur utilisent Playwright et Chromium. Dans un environnement où Playwright n’est pas déjà installé :

```bash
npm install --no-save --package-lock=false playwright
npx playwright install chromium
node tests/immeuble-interactif.browser.cjs
node tests/opportunity-search.browser.cjs
```

Le workflow GitHub Actions `.github/workflows/verify-site.yml` exécute ces contrôles lors des pushes et des pull requests.

## Construction et déploiement

La configuration `vercel.json` indique à Vercel de lancer :

```bash
node build.js
```

et de publier le dossier `dist`.

Un déploiement de prévisualisation doit être vérifié avant toute promotion en production. Ne pas confondre la branche de travail avec la branche de production.

## Structure du dépôt

- `*.html` : pages du site ;
- `styles.css`, `rubriques-immersives.css` : styles ;
- `*.js` : interactions, recherche, catalogue et modules métier ;
- `tests/` : tests unitaires, d’intégration et navigateur ;
- `verify-site.js`, `verify-architecture.js` : contrôles de cohérence ;
- `build.js` : construction du site statique ;
- `vercel.json` : configuration de déploiement ;
- `.github/workflows/` : automatisation des contrôles.

## Principes de contribution

1. Travailler sur une branche dédiée.
2. Préserver les pages, ressources et parcours existants sauf correction explicitement motivée.
3. Ne jamais ajouter de secrets, clés API privées ou données personnelles dans le dépôt.
4. Vérifier la construction, les routes et les tests concernés après chaque modification.
5. Documenter les fonctionnalités comme « opérationnelles » uniquement lorsqu’elles ont été réellement testées.
6. Ne pas fusionner ni promouvoir une branche en production sans validation explicite.

## Licence et informations légales

Aucune licence open source n’est déclarée dans ce dépôt. Les mentions légales et la politique de confidentialité publiées dans le site doivent être vérifiées et maintenues par le responsable du projet.
