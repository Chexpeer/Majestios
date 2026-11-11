# Épuration éditoriale — troisième passe — Evolution-9

**Date :** 11 novembre 2026  
**Branche :** `Evolution-9`  
**Pages modifiées :** `developpement-commercial.html`, `reputation-virtuelle.html`, `nous-rejoindre.html`, `prospection-active.html`

## Constat

La page conservait une mention « ÉTAGE 06 · ORCHESTRER », vestige de l'ancienne représentation du site en étages, qui ne correspond plus à l'orientation documentaire actuelle.

## Correction

- Suppression de la mention d'étage.
- Conservation du titre « Des pistes aux actions ».
- Réécriture du texte en une phrase courte : « Repérez les informations utiles, définissez vos priorités et organisez votre suivi commercial. »
- Suppression de la phrase redondante « Votre bénéfice ».
- Conservation de la section et de sa structure visuelle ; aucun lien, formulaire, script ou parcours n'a été retiré.

## Deuxième correction de la passe

Sur `reputation-virtuelle.html` :
- Titre et introduction raccourcis et recentrés sur l'image en ligne de l'entreprise.
- Textes des trois axes simplifiés : présence locale, avis et confiance, référencement naturel.
- La condition préalable d'accord de l'entreprise avant consultation des avis est explicitement conservée, ainsi que la validation humaine des réponses.
- Les avertissements sur l'absence de connexion Google active et la vérification des constats restent inchangés.

**Commits des pages :**
- `developpement-commercial.html` : `04d78d50e904c86c2d06e38152f7c6da49ba84e0`.
- `reputation-virtuelle.html` : `b911d0ee6f410bd79c4718b1830ffb2f54e601ab`.
- `nous-rejoindre.html` : `bd9ce119afdb856c492cd35a195de672ca6051c9`.
- `prospection-active.html` : `1e4ccb6964a5b5e8288623e15932b6cec8568bb4`.

## Troisième correction de la passe

Sur `nous-rejoindre.html` :
- Introduction et présentations des trois publics raccourcies.
- Les modalités non disponibles restent explicitement signalées : dépôt de CV et envoi des demandes non activés ; aucun CV n'est collecté.
- Les liens de contact et d'espace membre sont conservés.

## Quatrième correction de la passe

Sur `prospection-active.html` (rubrique affichée sous le libellé « Prospection ») :
- Accroche réécrite pour décrire la fonction réelle de recherche et de qualification, sans laisser entendre que MajestiOS réalise une prestation de prospection déléguée.
- Mention obsolète « ÉTAGE 05 · IDENTIFIER » supprimée.
- Bloc de présentation raccourci ; moteur de recherche, critères, résultats, avertissements et liens vers les autres rubriques conservés.
- Aucun intitulé de navigation modifié.

## Contrôles et limites

Les contenus sources ont été relus après modification. La validation automatisée du site doit être confirmée sur le HEAD final de cette passe par GitHub Actions. Aucun test navigateur n'est déclaré réussi avant lecture de ce résultat.

Aucune migration, donnée, configuration, permission, secret, intégration externe ou déploiement n'a été modifié.


## Cinquième correction de la passe

Sur `faq.html` :
- Le bloc de découverte évoquait encore un « schéma interactif », alors que l'orientation actuelle repose sur une navigation classique.
- Le texte et le lien ont été remplacés par une invitation à explorer les rubriques et les fonctionnalités présentées sur le site.
- Les questions, réponses, liens de navigation et contrôles d'accès décrits dans la FAQ sont conservés.
- Correction versionnée sur Evolution-9, commit `19f88757699c95a13b533ab114f4335f58072610`.
