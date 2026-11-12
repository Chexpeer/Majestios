# Correction de la navigation — 12 novembre 2026

## Périmètre

Branche : Evolution-9 uniquement.

Défaut signalé depuis l’aperçu mobile : tiroir blanc et translucide, contenu visible derrière, sous-rubriques peu contrastées et menu desktop à surface claire.

## Diagnostic

navigation-tiroirs.css contenait plusieurs couches correctives successives qui se contredisaient. Certaines rétablissaient un fond clair sur mobile ou sur les sous-menus desktop. Le test navigateur exigeait encore l’ancien fond clair.

## Correction appliquée

- Consolidation des surcharges finales dans une seule couche canonique.
- Bandeau, tiroir mobile et sous-menus desktop : fonds bleu nuit opaques, sans transparence blanche.
- Contrastes renforcés par famille de navigation : turquoise, bleu, vert, violet, or, ambre et gris clair.
- Relief renforcé : dégradés sombres, bordures or, ombres portées et états actifs en relief.
- Hamburger mobile : bleu nuit et or.
- Suppression des anciennes couches CSS correctives contradictoires à partir du marqueur de consolidation.

## Page d’accueil

Dans le lot de correction de navigation décrit par ce document, aucun contenu, bloc éditorial, visuel de fond, titre ou composition de `index.html` n’a été modifié. Cette phrase ne décrit pas les commits ultérieurs : le 12 novembre, `index.html` a ensuite été restauré séparément à partir du contenu de référence antérieur (commit `cdaa93952575078f7a0d9a87a2329accc3fee15a`).

## Moteur de recherche

Le moteur conserve un parcours progressif. Sur la page d’accueil, aucun bouton « Choisir une catégorie » ne doit être affiché. Dans les pages de rubrique, le choix de catégorie et les critères secondaires restent masqués au chargement et ne sont proposés qu'après interaction avec la recherche. Les rubriques Marchés publics et Marchés privés conservent leur type fixe.

## Tests et limites

- Le contrôle syntaxique JavaScript avait échoué sur un doublon de déclaration dans rubric-search.js ; le correctif précédent a supprimé ce conflit.
- Le parcours navigateur a ensuite révélé une assertion qui attendait encore un sous-menu clair. Le test a été réaligné sur le nouveau contrat bleu nuit.
- Workflow de vérification du commit `891f44a116122f588bf0107a76578af8e7fde9ed` : statut historique à consulter sur ce commit. Le workflow du HEAD `8472b3553eef5ef924a72ec835f00dea7c84ad6c` a échoué sur le contrôle d’architecture, qui attendait encore le texte CRM désormais absent de l’accueil restauré. Voir les entrées UX-HOME-01 et UX-SEARCH-01 du registre.
- Aucune validation visuelle sur appareil Android réel n’est revendiquée à ce stade.
- Aucun déploiement de production, changement Supabase ou modification d’une autre branche.

## Fichiers

- navigation-tiroirs.css
- tests/navigation-classique.browser.cjs
- rubric-search.js (correction JavaScript précédente du même lot)
