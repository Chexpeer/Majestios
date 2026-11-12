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

Aucun contenu, bloc éditorial, visuel de fond, titre ou composition de index.html n’a été modifié. La règle commune de navigation s’applique aussi à l’accueil, sans retoucher son contenu ni son visuel principal.

## Moteur de recherche

Le moteur conserve son parcours progressif : les critères secondaires, dont le choix de catégorie, restent masqués au chargement et sont révélés par le bouton « Choisir une catégorie ». Les rubriques Marchés publics et Marchés privés conservent leur type fixe. La page d’accueil n’a pas été réécrite.

## Tests et limites

- Le contrôle syntaxique JavaScript avait échoué sur un doublon de déclaration dans rubric-search.js ; le correctif précédent a supprimé ce conflit.
- Le parcours navigateur a ensuite révélé une assertion qui attendait encore un sous-menu clair. Le test a été réaligné sur le nouveau contrat bleu nuit.
- Workflow de vérification du commit 891f44a116122f588bf0107a76578af8e7fde9ed : déclenché, résultat à confirmer.
- Aucune validation visuelle sur appareil Android réel n’est revendiquée à ce stade.
- Aucun déploiement de production, changement Supabase ou modification d’une autre branche.

## Fichiers

- navigation-tiroirs.css
- tests/navigation-classique.browser.cjs
- rubric-search.js (correction JavaScript précédente du même lot)
