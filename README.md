# MajestiOS — site public (prototype)

Site vitrine statique en français pour les visiteurs, prospects et clients. L’accueil présente MajestiOS ; la navigation ouvre des pages dédiées au flux BOAMP, aux services, au contact et au parcours client. Le site n’est pas un tableau de bord métier.

## Parcours et pages

- `index.html` : présentation, accès aux services, exemples et aperçu du flux d’annonces.
- `opportunites/` : avis de marchés BOAMP ouverts à la réponse, recherche par mots-clés, filtres par type et département, actualisation et chargement progressif.
- `opportunites/avis/?id=…` : détail d’un avis et lien vers sa publication officielle.
- `services/` : pages distinctes de développement commercial, partenariats, coach et Double Dossier, devis/facturation, prospection/secrétariat et business.
- `contact/` : formulaire de démonstration pour visiteurs, prospects et clients.
- `espace-client/` : explication du parcours client et des limites du prototype.

Le flux interroge dans le navigateur le jeu de données public BOAMP diffusé par la DILA via Opendatasoft. Il dépend de la disponibilité de cette API et de l’accès réseau du navigateur. Les avis et dates affichés restent à vérifier sur la publication officielle ; un avis ne prouve pas un besoin commercial ni l’éligibilité d’une entreprise.

## Démarrer

Aucune dépendance applicative ni aucun backend ne sont requis. Ouvrez `index.html` dans un navigateur. Pour servir les routes et liens localement, exécutez `python -m http.server 8000` à la racine du dépôt puis ouvrez `http://localhost:8000`.

## Déploiement Vercel

Vercel exécute `node build.js`. Le script prépare `dist/` en copiant les fichiers du site et les routes statiques (`opportunites`, `services`, `contact`, `espace-client`). `vercel.json` indique `dist` comme répertoire de sortie. Pour publier une version, pousser d’abord les changements sur GitHub afin que l’intégration GitHub–Vercel construise une prévisualisation ; aucun déploiement direct par CLI n’est prévu.

## Limites du prototype

Les formulaires valident et prévisualisent localement les champs, mais ne transmettent ni ne sauvegardent de demande. Aucun compte client, authentification, espace sécurisé, API MajestiOS, base de données, intégration métier, action externe, service de devis/facturation ou mise en relation n’est implémenté. Les descriptions de services et de concepts n’attestent pas de leur disponibilité opérationnelle. Les scénarios de démonstration restent explicitement fictifs.
