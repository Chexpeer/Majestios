# Lot 2 — Audit de conformité fonctionnelle et de navigation

- **Date :** 4 novembre 2026
- **Branche examinée :** `evolution-5.0`
- **Commit de départ :** `af972d73141304dc8b3edbd8cf11e2d47ad01d68`
- **Périmètre :** 32 pages HTML racine, menus, liens internes, routes dynamiques du moteur de recherche et parcours utilisateur testables dans le navigateur.

> **Actualisation de périmètre — 5 novembre 2026 :** cet audit décrit les parcours et le code examinés le 4 novembre. Les changements ultérieurs du socle Auth et Supabase sont documentés séparément dans [État du backend Supabase](ETAT-BACKEND-SUPABASE.md) ; ils ne changent pas les constats de navigation ci-dessous.

## 1. Synthèse

L'arborescence des 32 pages est accessible, mais l'audit a révélé trois défauts fonctionnels qui n'apparaissaient pas dans le contrôle des liens locaux : les retours des pages de catégorie perdaient le type de marché, le moteur commun ne s'initialisait pas sur la page de résultats à cause d'une déclaration de menu en conflit, et cinq variantes de menus employaient des destinations ou des libellés différents.

Les corrections sont appliquées sans modifier l'immeuble, les images ou l'arborescence des fichiers. Après correction, le contrôle statique a vérifié **670 références locales `href`/`src`/`action`**, **0 fichier local manquant**, **0 ancre manquante**, **32 menus cohérents sur 32** et **52 ressources du manifeste présentes sur 52**. Des parcours public, privé et Réseau ont aussi été testés dans le navigateur intégré.

## 2. Périmètre fonctionnel et routes

### Destinations principales

Le tableau `destinations` de `index.html:394-402` définit les huit niveaux et leurs routes. Les huit destinations correspondent aux pages publiées dans `site-files.json`.

### Pages de second niveau et fonctions transversales

| Domaine | Pages et mode d'accès constaté |
|---|---|
| Marchés publics | `marches-publics.html` est une destination principale ; `veille-marches.html` et `accompagnement-appels-offres.html` sont des parcours associés. Les huit pages `categorie-*.html` sont ouvertes par le catalogue partagé, depuis le formulaire de recherche lorsque la catégorie publique possède une route dédiée. |
| Marchés privés | `marches-prives.html` est une destination principale ; les recherches BODACC sont accessibles depuis le formulaire et `bodacc-veille-entreprises.html`. |
| Résultats | `resultats-recherche.html` est une route dynamique appelée par `app.js` pour les recherches sans page de catégorie dédiée et les recherches privées. Son absence de lien HTML entrant ne la rend donc pas inaccessible. |
| Réseau | `reseaux-synergies.html` est une destination principale ; ses cartes conduisent à `sous-traitance.html` et `salons-seminaires.html`. |
| Développement commercial | `developpement-commercial.html` est une destination principale ; `prospection-active.html` est également une destination principale. `suivi-commercial.html`, `qualification-entreprises.html`, `crm.html`, `intelligence-economique.html` et `majestios-v5.html` sont des parcours ou fonctions transversales. |
| Réputation virtuelle | `reputation-virtuelle.html` est une destination principale ; l'intégration de services externes n'est pas démontrée par la seule présence de cette page. |
| Information et accès | `vision-majestios.html`, `faq.html`, `nous-rejoindre.html`, `espace-membre.html`, `mentions-legales.html` et `politique-confidentialite.html` sont accessibles par les menus, les appels à l'action ou le pied de page. |

**FAIT VÉRIFIÉ :** les pages présentes mais sans lien HTML entrant direct avant correction étaient les quatre pages de catégorie `categorie-electricite.html`, `categorie-maintenance.html`, `categorie-plomberie-chauffage.html`, `categorie-renovation.html`, ainsi que `resultats-recherche.html`. Le catalogue `catalogue-majestios.js:7-15` et la soumission décrite par `app.js:281-302` assurent les routes dynamiques des catégories et des résultats. Aucune page n'a été identifiée comme inaccessible après prise en compte de ces interactions.

**FAIT VÉRIFIÉ :** une page accessible n'est pas nécessairement une fonctionnalité métier opérationnelle. `crm.html`, `espace-membre.html` et `majestios-v5.html` présentent des capacités non connectées ; `suivi-commercial.html`, `salons-seminaires.html` et plusieurs parcours décrivent des fonctions ou services à développer. Le CRM persistant, les comptes et les demandes réellement transmises ne sont pas établis par cet audit.

## 3. Anomalies constatées et corrections

| Priorité | Avant | Conséquence | Correction appliquée |
|---|---|---|---|
| P2 — restauration des critères | Les huit pages de catégorie renvoyaient vers `index.html?categorie=…#recherche-avancee` sans `marche=public`. Le formulaire ne pouvait pas restaurer la catégorie sans connaître le type de marché. | Le retour affichait une catégorie vide ou demandait de reprendre le parcours, et pouvait perdre le contexte de recherche. | Les huit liens HTML portent maintenant `marche=public`. `category-results.js:29-31,81-86` normalise aussi le marché des pages de catégorie et transmet le contexte au lien généré. |
| P2 — initialisation du formulaire de résultats | `resultats-recherche.html` contenait un script de menu déclarant au niveau global `const menuToggle` et `const navigation`, déjà déclarés par le script différé `app.js`. Le navigateur exécutait le script en ligne pendant l'analyse HTML avant les scripts différés ; l'initialisation de `app.js` échouait sur cette page. Le formulaire apparaissait sans catégories restaurées ni filtre de type visible. | L'affinage depuis les résultats n'exposait pas correctement les filtres et le menu dépendait d'un second contrôleur. | Le contrôleur inline redondant a été retiré de `resultats-recherche.html`. `app.js` est l'unique contrôleur du menu et initialise désormais le formulaire commun et ses filtres à partir des paramètres d'URL. |
| P2 — cohérence du menu | Les 32 pages utilisaient cinq variantes de menus. Certaines omettaient « Réputation virtuelle », remplaçaient « Réseau » par « Salon virtuel » ou affichaient « Espace membre » au lieu de « Espace privé ». Plusieurs éléments `aria-current="page"` pointaient vers une page différente de celle affichée. | Parcours divergents, terminologie incohérente et état courant incorrect pour les technologies d'assistance. | Les menus des 18 pages divergentes ont été alignés sur les sept destinations de l'accueil. Les liens vers `salons-seminaires.html` restent dans le parcours Réseau. Les marqueurs `aria-current` inexacts ont été retirés. |
| P3 — libellé du critère département | Quand aucune zone n'était choisie, la page de résultats affichait la valeur technique `all`. | Le récapitulatif exposait une valeur interne au lieu d'un libellé utilisateur. | `search-results.js` affiche maintenant « Tous les départements » pour le filtre par défaut. |

Les changements de menus concernent : `categorie-maintenance.html`, `categorie-plomberie-chauffage.html`, `categorie-renovation.html`, `categorie-services-numeriques.html`, `categorie-travaux-amenagement.html`, `crm.html`, `espace-membre.html`, `intelligence-economique.html`, `majestios-v5.html`, `mentions-legales.html`, `nous-rejoindre.html`, `politique-confidentialite.html`, `resultats-recherche.html`, `salons-seminaires.html`, `sous-traitance.html`, `suivi-commercial.html`, `veille-marches.html` et `vision-majestios.html`.

## 4. Contrôles avant / après

| Contrôle | Avant | Après |
|---|---|---|
| Retour catégorie publique → moteur | `marche` absent ; catégorie non restaurée dans le moteur | Type « Marchés publics » et catégorie restaurés |
| Affinage sur `resultats-recherche.html` | Filtre de type masqué ; catégories non chargées dans le formulaire ; département affiché `all` | Type, catégorie et département chargés selon les paramètres ; département par défaut libellé « Tous les départements » |
| Menus principaux | Cinq variantes repérées | Un seul jeu de sept destinations sur 32 pages |
| État `aria-current` dans le menu | Certains marqueurs désignaient une autre route | Au plus un marqueur, uniquement quand il correspond à la page affichée |
| Cibles locales et ancres | Contrôle antérieur : aucun lien local cassé | 670 attributs `href`/`src`/`action` contrôlés ; 0 cible locale absente et 0 ancre manquante |
| Manifeste du site | 52 ressources déclarées | 52/52 ressources présentes |

## 5. Parcours exécutés dans le navigateur

Les parcours suivants ont été exécutés dans le navigateur intégré sur les fichiers du worktree, le 4 novembre 2026 :

1. **Catégorie publique :** retour depuis la page Électricité vers l'accueil ; vérification que `marche=public`, `categorie=electricite` et les trois étapes de filtre sont restaurés.
2. **Recherche publique :** soumission depuis le formulaire vers la page Électricité ; le flux BOAMP a rendu 8 avis au moment du test. Le nombre varie avec la source et l'heure.
3. **Recherche privée :** recherche `marche=private&categorie=bodacc-creations` vers `resultats-recherche.html` ; le formulaire de raffinement a restauré ses catégories et le flux BODACC a rendu 10 signaux au moment du test.
4. **Retour des résultats :** retour vers l'accueil avec `marche=private` et `categorie=bodacc-creations` conservés.
5. **Menu :** ouverture du menu sur une page de vision et sur la page de résultats ; les sept destinations canoniques étaient présentes et le menu s'ouvrait.
6. **Réseau :** clic depuis la page Réseaux et synergies vers `salons-seminaires.html` ; la page associée s'est ouverte sans en faire un étage autonome.

Ces tests prouvent le comportement observé dans ce navigateur et pour ces critères, pas la disponibilité permanente des API, l'exactitude de toutes les annonces, ni le rendu de production.

## 6. Tests et limites

**Contrôles exécutés :**

- Analyse PowerShell des 32 pages HTML : 670 références locales `href`/`src`/`action`, aucun fichier ou fragment local manquant.
- Comparaison des menus : 32 pages, 0 menu divergent.
- Contrôle du manifeste : 52 ressources déclarées, 0 absente.
- Parcours navigateur intégrés énumérés ci-dessus.
- `git diff --check`.

**Contrôles non exécutés :**

- `node build.js`, `node verify-site.js`, `node verify-architecture.js`, les tests unitaires et Playwright : Node.js n'est pas installé dans l'environnement.
- Vérification exhaustive des URL externes : les requêtes BOAMP et BODACC ont répondu pendant les scénarios, mais tous les liens d'annonces externes n'ont pas été ouverts individuellement.
- Tests navigateurs systématiques sur tous les viewports, clavier et technologies d'assistance.
- Validation sur l'artefact `dist/` : le build n'a pas pu être produit dans cet environnement.

`verify-architecture.js` a été renforcé pour contrôler les sept liens principaux sur toutes les pages, les marqueurs `aria-current`, les liens de retour de catégories publiques, le libellé du département par défaut et l'absence de déclaration globale concurrente du menu.

**État actualisé du menu contextuel — contrôle du 5 novembre 2026 :** le constat ci-dessus est désormais dépassé par le contrôleur partagé `app.js`. La navigation principale conserve ses sept portes d'entrée, et le contrôleur ajoute deux sous-menus contextuels :
- sous « Développement commercial » : « Prosp'active », « Marchés publics » et « Marchés privés » ;
- sous « Espace privé » : « Suivi commercial », « CRM MajestiOS » et « Qualification entreprises ».

Les trois destinations de l'immeuble qui ne sont pas des liens principaux (Prospection, Marchés publics et Marchés privés) sont ainsi accessibles depuis le menu contextuel « Développement commercial » sur les pages qui partagent la navigation canonique. Le logo conserve le retour à l'accueil et à l'immeuble interactif. Le panorama définit huit étages numérotés plus le rez-de-chaussée, soit neuf destinations cliquables. Le code de création, les routes et les états ARIA du sous-menu ont été inspectés ; un parcours navigateur exhaustif du sous-menu sur mobile, clavier et tous les gabarits reste à ajouter à la recette.

## 7. Suite recommandée

1. Exécuter le build, `verify-site.js`, `verify-architecture.js`, les tests unitaires et les tests Playwright dans l'environnement Node 22 prévu par le dépôt.
2. Rejouer les parcours public et privé sur `dist/`, y compris mobile, clavier et préférence de réduction des animations.
3. Vérifier les liens externes d'annonces sur la source officielle et distinguer une indisponibilité réseau d'une erreur de route.
4. Poursuivre la recette des pages CRM, espace privé, suivi commercial, salons et fonctions transversales sans les présenter comme des services connectés.
5. Conserver la distinction entre pages accessibles, fonctions simulées et services réellement opérationnels ; aucune action de production n'a été entreprise.


## 8. Revue complémentaire des routes d'accueil — 5 novembre 2026

La règle de navigation « une action ouvre une vraie page, pas une ancre locale utilisée comme fausse destination » a été appliquée aux retours et accès suivants :

- logo d'accueil et logo de pied de page : `index.html`, sans fragment `#accueil` ;
- destination « Accueil » du rez-de-chaussée de l'immeuble : `index.html`, sans fragment ;
- aide « Rechercher une opportunité » : `developpement-commercial.html`, qui expose le moteur transversal, au lieu d'un renvoi vers `#recherche-avancee` sur la page courante ;
- retour depuis les résultats de recherche : `index.html` avec conservation des paramètres de recherche, sans fragment ;
- retour à l'accueil depuis « Suivi commercial » : `index.html`.

Le contrat d'architecture `verify-architecture.js` et les tests navigateur ont été alignés sur la route réelle du RDC et sur l'absence de fragment au retour des résultats.

**Validation sur le HEAD `35ff7e9c96ae4ab1c91160487ce7344f43a44b81` :**
- workflow PR « Vérification du site MajestiOS » — run `42089279602` : succès complet ;
- workflow PR « Vérification anti-régression MajestiOS » — run `42089279780` : succès complet.

Les contrôles couvrent la structure de l'immeuble, ses neuf routes, le retour de recherche et les parcours mobile/ordinateur. Cette revue ne prétend pas qu'aucun lien d'ancrage n'existe sur toutes les pages : elle clôt les renvois d'accueil et de recherche identifiés dans ce lot. Les ancres éditoriales internes éventuelles restent à examiner au cas par cas.
