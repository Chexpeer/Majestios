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
- **Espaces complémentaires** : CRM, espace membre, Cheexpeer (IA intégrée), FAQ et informations légales.

Les résultats administratifs et les scores de rapprochement sont des aides à l’analyse. Ils ne prouvent pas la compétence, la capacité opérationnelle ou l’éligibilité d’une entreprise à un marché. Une vérification humaine reste nécessaire.

## Technologies

- HTML pour les pages ;
- CSS pour les styles ;
- JavaScript natif pour les interactions et les modules métier ;
- Node.js pour les scripts de construction et les tests ;
- Playwright pour les tests exécutés dans un navigateur ;
- Vercel pour la construction et l’hébergement du site statique.

Le projet ne nécessite pas de framework front-end pour construire le site statique.

## Backend Supabase — fondations en cours

Un backend Supabase séparé a été créé pour préparer l'authentification, les espaces clients et le CRM. Le socle multi-tenant (organisations, membres, entreprises, contacts, opportunités, activités et demandes) est versionné dans `supabase/migrations/`, avec RLS activé et règles de séparation des organisations.

**Important — état vérifié le 11 novembre 2026 :** le code du parcours OTP et de la fonction de provisionnement existe, mais la fonction Edge `provision-client-workspace` appelée après validation du code n'est déployée sur aucun des deux projets Supabase inspectés. Le provisionnement d'un espace client n'est donc pas considéré comme opérationnel et le parcours OTP n'a pas été recetté de bout en bout. Le frontend pointe actuellement vers `majestios-crm`, dont les migrations divergent de celles du projet `MajestiOS-Test`. Voir [l'audit de l'existant avant Evolution-8](docs/evolution-7/AUDIT-EXISTANT-PREPARATION-EVOLUTION-8-2026-11-11.md) avant toute intégration.


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
node verify-doc-links.js
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
- `site-files.json` : manifeste unique des fichiers publiés dans `dist/` ;
- `build.js` : construction du site statique à partir du manifeste ;
- `vercel.json` : configuration de déploiement ;
- `.github/workflows/` : automatisation des contrôles.

## Principes de contribution

1. Travailler sur une branche dédiée.
2. Préserver les pages, ressources et parcours existants sauf correction explicitement motivée.
3. Ne jamais ajouter de secrets, clés API privées ou données personnelles dans le dépôt.
4. Vérifier la construction, les routes et les tests concernés après chaque modification.
5. Documenter les fonctionnalités comme « opérationnelles » uniquement lorsqu’elles ont été réellement testées.
6. Ne pas fusionner ni promouvoir une branche en production sans validation explicite.

## Maintenance, sauvegardes et continuité

Le projet suit un protocole documenté de maintenance, de sauvegarde et de reprise : [Maintenance, sauvegardes et continuité](docs/evolution-5.0/MAINTENANCE-ET-CONTINUITE.md). Chaque lot doit partir d'un état identifié, disposer d'un point de retour adapté, être vérifié et laisser une documentation à jour. Aucune fusion vers `main` ni mise en production sans validation explicite.

## Licence et informations légales

Aucune licence open source n’est déclarée dans ce dépôt. Les mentions légales et la politique de confidentialité publiées dans le site doivent être vérifiées et maintenues par le responsable du projet.


## Épuration éditoriale — 11 novembre 2026

Trois passes d'épuration ont raccourci les textes et clarifié les limites des fonctions présentées. La troisième passe a également retiré des pages publiques les derniers repères de navigation en étages et remplacé un parcours visuel non opérationnel par une présentation fonctionnelle sobre. Les décisions et les pages concernées sont suivies dans [le rapport de la troisième passe](docs/evolution-9/EPURATION-EDITORIALE-PASSE-3-2026-11-11.md) et le [registre des anomalies Evolution-9](docs/evolution-9/REGISTRE-ANOMALIES-EVOLUTION-9.md). Les changements restent limités aux contenus HTML et à leur documentation ; aucune migration, donnée ou configuration distante n'a été modifiée.


La passe éditoriale a également retiré le dernier ancien parcours illustratif de la page Intelligence économique. Voir le rapport de la troisième passe et le registre des anomalies UX-EDITORIAL-12.


La page CRM distingue désormais la conservation des relances, leur création par traitement planifié et le rechargement de l'interface. L'affichage ne prétend plus se rafraîchir automatiquement toutes les cinq minutes. Voir UX-EDITORIAL-13 dans le registre Evolution-9.


L'introduction du CRM énumère désormais ses modules (entreprises, contacts, opportunités, activités et relances) sans promettre une historisation automatique générale. L'écart technique d'historisation sur le projet principal reste ouvert (UX-EDITORIAL-14).
