# MajestiOS — arborescence et dépendances de référence

Version : 2026-10-31  
Branche de travail : `reprise-zone-industrielle-avancee-2026-10-31`  
Objet : document de référence pour nettoyer le dépôt sans casser les pages, les interactions ni le build.

## 1. Structure obligatoire de la page d’accueil

`index.html` contient uniquement :
1. la barre de navigation principale composée exactement de : Accueil, Développement commercial, Salon virtuel, Nous rejoindre, Espace membre et FAQ ;
2. la zone artisanale virtuelle interactive intégrée directement à la page ;
3. le moteur de recherche avancé (mot-clé, catégorie, type de marché, localisation).

Ne doivent pas apparaître sur l’accueil : liste d’appels d’offres, annonces fictives en cartes, répertoire séparé des bâtiments, raccourcis redondants, blocs explicatifs, formulaires permanents, pied de page ou sections répétitives. Le bandeau de diffusion d’annonces en haut de page est prévu pour une étape ultérieure et ne doit pas être simulé comme un flux réel.

La zone interactive doit rester visible dès l’accueil. Le retrait de son entrée dans la navigation ne signifie pas que la zone ou ses fichiers sont supprimés.

## 2. Pages du site

### Showroom virtuel — pilier commercial
Le showroom virtuel est une offre transversale de présentation et de mise en relation, distincte de la veille des marchés. La zone artisanale sert de porte d’entrée collective ; chaque entreprise pourra disposer d’un showroom présentant ses savoir-faire, réalisations, capacités, références, certifications et possibilités de coopération. Le parcours cible est : Découverte → Visite → Compréhension → Confiance → Contact → Relation commerciale.

- **Showroom Essentiel** : fiche enrichie, activité, photos, coordonnées et liens utiles (offre à définir).
- **Showroom Immersif** : visite des locaux, vidéos, démonstrations, projets commentés et visite guidée (évolution à concevoir).
- **Modes de découverte** : parcours au sol de type « Tesla », survol stratégique de type hélicoptère et guidage « Majest COYOT » ; ce sont des concepts d’expérience, pas des services annoncés comme opérationnels.
- **Showroom augmenté par l’IA** : présentation, réponses aux questions et suggestions de partenaires à envisager ultérieurement ; les décisions restent humaines.

La page actuellement rattachée à la navigation « Salon virtuel » porte cette orientation showroom tout en conservant la dimension d’espace collectif d’exposition. Aucune tarification ni disponibilité n’est promise avant validation.



### Pages communes
- `index.html` — accueil de référence.
- `nous-rejoindre.html` — contributions et coopérations.
- `espace-membre.html` — parcours personnel de démonstration, sans compte réel.
- `faq.html` — explications et limites actuelles.
- `zone-artisanale.html` — ancienne expérience immersive autonome, conservée provisoirement pour compatibilité. Les retours des douze pages métier renvoient désormais vers `index.html#accueil`, où la zone industrielle est intégrée. Ne supprimer cette page qu’après un scan complet des références restantes et du build.

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

**État réel de la profondeur de navigation (mise à jour du 31/10/2026).** La sélection d’un bâtiment affiche désormais trois niveaux navigables : la rubrique principale, un premier parcours associé et un second parcours associé. Les douze bâtiments ont chacun deux destinations complémentaires vers des pages HTML existantes ; le panneau est visible aussi sur l’accueil, et les liens disposent d’un état de focus clavier. Ces parcours sont des liens contextuels vers des pages métier existantes : ils ne constituent pas encore douze arborescences indépendantes avec des pages enfant dédiées. Ne pas présenter la profondeur dossier/sous-dossier/page comme totalement achevée avant la création éventuelle de pages enfant spécifiques.

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
- `schemas/opportunite.schema.json` — contrat de données normalisé des annonces.
- `MODELE-DONNEES-APPELS-OFFRES.md` — règles de provenance, catégories, filtrage et intégration des sources.

## 4. Règles de nettoyage du dépôt

1. Conserver les deux documents de référence : `README.md` et ce fichier.
2. Ne pas supprimer une page métier ou catégorie uniquement parce qu’elle n’apparaît pas sur l’accueil : elle peut être une destination d’un bâtiment, d’un filtre ou d’un lien interne.
3. Ne pas supprimer une ressource tant que les références dans les HTML, JS, CSS, `build.js`, `verify-site.js` et le workflow n’ont pas été retirées ou migrées.
4. Les fichiers visuellement anciens ne sont pas forcément inutilisés. Vérifier leurs références avant toute suppression.
5. Retirer les fonctions redondantes de l’accueil sans supprimer les fonctions requises dans leurs pages dédiées.
6. Ne pas considérer les exemples de résultats ou formulaires de démonstration comme des services connectés.

## Pages de résultats par catégorie

Les huit catégories actives disposent chacune d’une page dédiée, alimentée par le script commun `category-results.js` :
- `categorie-services-numeriques.html`
- `categorie-travaux-amenagement.html`
- `categorie-conseil-etudes.html`
- `categorie-batiment.html`
- `categorie-renovation.html`
- `categorie-electricite.html`
- `categorie-plomberie-chauffage.html`
- `categorie-maintenance.html`

Le parcours transmet les paramètres `q` (mots-clés), `marche` (public/privé) et `zone` (localisation). Une catégorie choisie est prioritaire pour la destination : le filtre de marché reste appliqué comme critère sur sa page, plutôt que de détourner l’utilisateur vers une page générique. Chaque page expose une zone de résultats, récapitule les critères reçus et indique clairement qu’aucune annonce réelle n’est affichée tant que les sources ne sont pas connectées. Les catégories prévues mais désactivées ne doivent pas être présentées comme fonctionnelles.

## 5. Recherche avancée et limites

Le moteur de recherche de démonstration prévoit les filtres mot-clé, catégorie, type de marché et localisation. **Priorité de destination actuelle :** si une catégorie active est choisie, le formulaire ouvre la page `categorie-*.html` correspondante, même si un type de marché est également choisi ; le filtre de marché est transmis comme critère. Sans catégorie active, le formulaire ouvre `resultats-recherche.html`, quel que soit le type de marché choisi. Les paramètres `q`, `categorie`, `marche` et `zone` sont conservés dans l’URL et récapitulés sur la page générale de résultats. Ce récapitulatif ne constitue pas encore un filtrage de données réelles. Les choix géographiques d’exemple (Nord/Ouest/Sud) et les régions non raccordées sont désactivés dans le formulaire pour ne pas laisser croire qu’un filtrage territorial réel existe déjà ; seule l’option « Toutes les zones » reste sélectionnable jusqu’à la connexion des données géographiques. Les pages métier génériques Marchés publics/privés restent des pages de présentation : elles ne constituent pas encore un moteur de résultats filtrés. Les huit pages de catégories récapitulent les critères, mais affichent zéro annonce tant que les sources ne sont pas connectées. Aucune source de marchés publics ou privés n’est réputée connectée tant qu’un connecteur opérationnel n’a pas été installé et testé.

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
