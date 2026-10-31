# MajestiOS — arborescence et dépendances de référence

Version : 2026-10-31  
Branche de travail : `correction-accueil-zone-industrielle`  
Objet : document de référence pour nettoyer le dépôt sans casser les pages, les interactions ni le build.

## 1. Structure obligatoire de la page d’accueil

`index.html` contient uniquement :
1. la barre de navigation principale composée exactement de : Accueil, Développement commercial, Salon virtuel, Nous rejoindre, Espace membre et FAQ ;
2. la zone artisanale virtuelle interactive intégrée directement à la page ;
3. le moteur de recherche avancé (mot-clé, catégorie, type de marché, localisation).

Ne doivent pas apparaître sur l’accueil : liste d’appels d’offres, annonces fictives en cartes, répertoire séparé des bâtiments, raccourcis redondants, blocs explicatifs, formulaires permanents, pied de page ou sections répétitives. Le bandeau de diffusion d’annonces en haut de page est prévu pour une étape ultérieure et ne doit pas être simulé comme un flux réel.

La zone interactive doit rester visible dès l’accueil. Le retrait de son entrée dans la navigation ne signifie pas que la zone ou ses fichiers sont supprimés.

## 2. Pages du site

### Pages communes
- `index.html` — accueil de référence.
- `nous-rejoindre.html` — contributions et coopérations.
- `espace-membre.html` — parcours personnel de démonstration, sans compte réel.
- `faq.html` — explications et limites actuelles.
- `zone-artisanale.html` — expérience immersive autonome encore référencée par les pages et contrôles. Ne supprimer qu’après migration de tous ses liens entrants.

### Douze pages métier correspondant aux bâtiments
1. Marchés publics — `marches-publics.html`
2. Marchés privés — `marches-prives.html`
3. Développement commercial — `developpement-commercial.html`
4. Prospection inversée — `prospection-inversee.html`
5. Intelligence économique — `intelligence-economique.html`
6. Réseaux et synergies — `reseaux-synergies.html`
7. Veille des marchés — `veille-marches.html`
8. Accompagnement aux appels d’offres — `accompagnement-appels-offres.html`
9. Sous-traitance — `sous-traitance.html`
10. Salons et séminaires — `salons-seminaires.html`
11. Veille BODACC — `bodacc-veille-entreprises.html`
12. Suivi commercial — `suivi-commercial.html`

Chaque bâtiment doit pointer vers sa propre page métier. Les destinations sont centralisées dans `catalogue-majestios.js`.

### Pages de catégories de recherche
- `categorie-services-numeriques.html`
- `categorie-travaux-amenagement.html`
- `categorie-conseil-etudes.html`
- `categorie-batiment.html`
- `categorie-renovation.html`
- `categorie-electricite.html`
- `categorie-plomberie-chauffage.html`
- `categorie-maintenance.html`

Ces pages sont des destinations de filtres, distinctes des douze pages métier. Les liens de retour vers le moteur doivent utiliser `index.html#recherche-avancee` (et non l’ancienne ancre `#flux-ao`).

## 3. Ressources et dépendances

Les fichiers HTML restent à la racine du dépôt pour préserver les liens relatifs du site statique. L’arborescence ci-dessous est une arborescence fonctionnelle (pages communes, métiers, catégories), pas une consigne de déplacer immédiatement les fichiers dans des répertoires physiques.

- `styles.css` — styles généraux et composants communs.
- `app.js` — navigation et comportement du moteur de recherche.
- `catalogue-majestios.js` — correspondance des douze bâtiments avec les pages métier.
- `zone-artisanale.css`, `zone-artisanale.js` — styles et scène 3D.
- `rubriques-immersives.css`, `rubriques-immersives.js` — présentation et interactions des pages immersives.
- `schema-majestios.svg` — ancien schéma SVG non utilisé par le build courant ; le conserver jusqu’à une vérification complète des références avant suppression.
- `build.js` — prépare `dist/` à partir de la liste des ressources déclarées.
- `verify-site.js` — contrôle structure, ancres, pages et destinations.
- `.github/workflows/verify-site.yml` — exécute les contrôles automatiques.
- `vercel.json` — configuration de publication.
- `README.md` — résumé opérationnel du prototype.
- `ARBORESCENCE-MAJESTIOS.md` — inventaire et règles de dépendances.

## 4. Règles de nettoyage du dépôt

1. Conserver les deux documents de référence : `README.md` et ce fichier.
2. Ne pas supprimer une page métier ou catégorie uniquement parce qu’elle n’apparaît pas sur l’accueil : elle peut être une destination d’un bâtiment, d’un filtre ou d’un lien interne.
3. Ne pas supprimer une ressource tant que les références dans les HTML, JS, CSS, `build.js`, `verify-site.js` et le workflow n’ont pas été retirées ou migrées.
4. Les fichiers visuellement anciens ne sont pas forcément inutilisés. Vérifier leurs références avant toute suppression.
5. Retirer les fonctions redondantes de l’accueil sans supprimer les fonctions requises dans leurs pages dédiées.
6. Ne pas considérer les exemples de résultats ou formulaires de démonstration comme des services connectés.

## 5. Recherche avancée et limites

Le moteur de recherche de démonstration prévoit les filtres mot-clé, catégorie, type de marché et localisation. Le formulaire oriente désormais une recherche avec type de marché explicite vers `marches-publics.html` ou `marches-prives.html`. Sans type de marché explicite, une catégorie active oriente vers la page `categorie-*.html` correspondante ; sans catégorie ni type explicite, le parcours par défaut mène à `marches-publics.html`. Les paramètres mot-clé et localisation sont transmis dans l’URL, mais ils ne signifient pas qu’un flux de résultats réels est connecté. Les annonces de test ne sont pas un flux réel d’appels d’offres ; aucune source de marchés publics ou privés n’est réputée connectée tant qu’un connecteur opérationnel n’a pas été installé et testé.

## 6. Critères de validation avant publication

- L’accueil ne contient que navigation, zone artisanale interactive et moteur de recherche avancé.
- La navigation principale contient uniquement : Accueil, Développement commercial, Salon virtuel, Nous rejoindre, Espace membre et FAQ. Aucun lien « Zone industrielle », « Panorama » ou « Opportunités » n’y apparaît.
- Les douze bâtiments ont douze destinations métier distinctes.
- Les filtres et pages de catégories restent accessibles.
- Les ressources locales existent et les liens internes ne sont pas cassés.
- `node build.js` puis `node verify-site.js` se terminent sans erreur.
- La scène 3D et la navigation sont vérifiées dans un navigateur, y compris sur mobile.
- La prévisualisation correspond au commit contrôlé avant toute mise en production.

Ce document décrit les exigences et dépendances du prototype ; il ne prétend pas que les intégrations métier sont déjà opérationnelles.
