# BIO-001 — Vérification documentaire et premiers exemples BOAMP

- **Version :** 0.2
- **Date :** 27 octobre 2026
- **Branche :** `architecture-v0-1`
- **Nature :** vérification documentaire en lecture seule et inspection d'exemples publiquement visibles
- **Statut :** avancée partielle ; aucun test de bout en bout de MajestiOS, aucune modification du code applicatif

## 1. Sources consultées

- API BOAMP officielle : https://www.boamp.fr/api-console/explore/v2.1/
- Page de données ouvertes et API BOAMP : https://www.boamp.fr/pages/donnees-ouvertes-et-api/
- Jeu de données BOAMP et exemples de résultats : https://boamp-datadila.opendatasoft.com/explore/dataset/boamp/
- API du jeu de données : https://boamp-datadila.opendatasoft.com/explore/dataset/boamp/api/

La documentation officielle indique que l'API Explore v2.1 accepte des requêtes GET et renvoie du JSON. Elle distingue l'endpoint `records`, plafonné en nombre de résultats retournés, de l'endpoint `exports`, qui permet d'exporter les données sans cette même limite de résultats. Le connecteur actuel utilise `records` avec `limit=50` : sa couverture est donc limitée à ce qu'il demande effectivement.

## 2. Champs et valeurs observés dans le jeu de données

La page du jeu de données expose les champs utilisés par la route MajestiOS, notamment :

- `idweb`, `objet`, `nomacheteur` ;
- `code_departement`, `code_departement_prestation` ;
- `dateparution`, `datelimitereponse` ;
- `etat`, `type_procedure`, `nature_libelle`, `type_marche`, `url_avis`.

Un exemple publiquement visible au 27 octobre 2026 présente un avis rectificatif pour la Ville de Saint-Paul :
- identifiant : `26-103764` ;
- `etat` : `RECTIFICATIF` ;
- `type_procedure` : `OUVERT` ;
- `type_marche` : `SERVICES` ;
- échéance affichée dans les données indexées : 17 novembre 2026, avec heure et fuseau dans le contenu structuré ;
- lien d'avis : https://www.boamp.fr/pages/avis/?q=idweb:26-103764.

Cet exemple confirme que `etat` et `type_procedure` sont deux notions distinctes. Il confirme également que les valeurs de `type_marche` peuvent être des codes en majuscules. Il ne prouve pas que toutes les réponses de l'API ont la même forme ni que le connecteur fonctionne de bout en bout.

## 3. Conséquences pour le connecteur actuel

Fichier inspecté : `src/app/api/opportunities/route.ts`.

### Points cohérents à ce stade
- Les noms des champs demandés correspondent aux champs exposés dans le jeu de données.
- La normalisation de `SERVICES`, `TRAVAUX` et `FOURNITURES` vers les libellés d'affichage est cohérente avec les valeurs visibles.
- La date limite avec fuseau doit être conservée et interprétée comme une date-heure réelle.
- Le lien officiel observé suit le format de repli déjà prévu par le connecteur.

### Points à tester avant toute modification
1. Exécuter une requête sur l'endpoint exact utilisé par la route et conserver la réponse brute, avec date et paramètres.
2. Vérifier les filtres combinés département + type et le filtre textuel.
3. Tester les valeurs de département, y compris l'absence de département de prestation.
4. Vérifier plusieurs avis officiels et leurs liens.
5. Tester les dates avec fuseau, les dates sans heure, les valeurs absentes et invalides.
6. Vérifier séparément les états `INITIAL`, `RECTIFICATIF`, `MODIFICATION`, `ANNULATION`, et la distinction avec les avis d'attribution.
7. Mesurer l'effet du plafond `limit=50` et décider si la pagination ou l'endpoint d'export est adapté au besoin de veille.
8. Tester les réponses d'erreur, délais dépassés et résultats vides.

## 4. Règles de prudence

- Ne pas déclarer BIO-001 opérationnel sur la seule base du schéma visible.
- Ne pas traiter l'absence d'un avis dans une collecte comme une suppression confirmée.
- Ne pas assimiler automatiquement un avis rectificatif à un avis fermé : comparer les champs et lire l'état de l'avis.
- Conserver la valeur source brute séparément de toute interprétation MajestiOS.
- Signaler clairement les plafonds, les erreurs et la couverture partielle.
- Aucune modification du connecteur n'est autorisée par ce document.

## 5. État et prochaine action

**Établi :** cohérence initiale des noms de champs, existence de valeurs de statut distinctes et exemple réel de date limite avec fuseau ; documentation officielle de l'API et de ses mécanismes de consultation/export.

**Non établi :** disponibilité de l'endpoint exact depuis l'environnement de l'application, réussite du connecteur de bout en bout, précision de tous les filtres, exhaustivité de la collecte, robustesse des dates et validité de l'ensemble des liens.

**Prochaine action :** réaliser des requêtes contrôlées sur l'endpoint exact, consigner des exemples bruts anonymisés si nécessaire, puis établir les tests d'acceptation avant d'envisager tout changement de code.
