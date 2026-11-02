# Consignes de travail des assistants IA

Ces règles complètent le guide de reprise racine. En cas de conflit, appliquer la règle de gouvernance la plus stricte et signaler le conflit.

## Avant d'agir
- Lire `../DOCUMENTATION-REPRISE-IA-MAJESTIOS.md`, la matrice de traçabilité et le document métier concerné.
- Vérifier la branche, le commit courant et le contenu réel des fichiers.
- Ne pas demander au Fondateur de répéter une décision déjà documentée.
- Définir un lot réduit avec un résultat observable ; ne pas élargir le périmètre sans nécessité.

## Pendant le travail
- Travailler sur la branche autorisée.
- Ne pas fusionner, publier en production, déclencher de campagne ni modifier des données réelles sans accord explicite.
- Préserver les routes, les formulaires, les chemins relatifs et le manifeste de build.
- Ne pas déplacer ou supprimer une page avant vérification des liens entrants, scripts, build et tests.
- Ne pas ajouter de service payant, base de données ou fournisseur externe sans décision préalable.
- Ne pas remplacer une source réelle par des données inventées pour masquer une erreur.
- Séparer fait observé, interprétation commerciale et recommandation.

## Après le travail
- Relire les changements et vérifier les liens documentaires affectés.
- Exécuter les contrôles pertinents lorsque l'environnement le permet.
- Rapporter les fichiers et commits modifiés, les tests et leurs résultats, ainsi que les limites.
- Si un test n'a pas été exécuté, le dire explicitement.
- Mettre à jour la matrice de traçabilité si une exigence, son statut ou sa preuve a changé.

## Format d'une fiche de connaissance
Chaque nouvelle fiche doit indiquer :
- Titre et identifiant stable ;
- périmètre et objectif ;
- statut : brouillon, à vérifier, validé, expiré ou archivé ;
- propriétaire/responsable à désigner si inconnu ;
- date de création et date de dernière vérification ;
- sources et références précises ;
- faits établis ;
- limites, hypothèses et risques ;
- procédure ou action autorisée ;
- critères de révision.
