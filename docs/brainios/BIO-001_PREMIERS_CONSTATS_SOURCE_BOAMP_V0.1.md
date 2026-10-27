# BIO-001 — Premiers constats sur la source BOAMP

- **Version :** 0.1
- **Date du contrôle :** 27 octobre 2026
- **Branche :** `architecture-v0-1`
- **Nature du contrôle :** inspection du code et consultation de la documentation / de l’aperçu public de la source. Ce n’est pas un test de bout en bout de l’application.
- **Statut :** constats partiels, certains points restent non vérifiés.

## 1. Champs confirmés dans l’aperçu du jeu de données

L’aperçu public du jeu de données BOAMP présente notamment les champs suivants :
- `idweb`, `id`, `objet`, `nomacheteur` ;
- `code_departement`, `code_departement_prestation` ;
- `famille_libelle`, `dateparution`, `datelimitereponse` ;
- `etat`, `type_procedure`, `nature_libelle`, `type_marche`, `url_avis`.

Ces noms concordent avec les champs sélectionnés dans `src/app/api/opportunities/route.ts`. Cela confirme la cohérence initiale du mapping, mais pas que chaque réponse de l’API ni chaque ancien avis contiendra toutes ces valeurs.

## 2. Dates et statuts : point d’attention

Un exemple visible dans l’aperçu de la source affiche une publication au 27 octobre 2026 et une date limite sous forme de date-heure avec fuseau. Le champ peut donc fournir une échéance précise.

La route actuelle utilise `new Date(datelimitereponse)` puis compare l’horodatage à l’heure courante. Cette logique doit être testée avec :
- une date-heure avec fuseau ;
- une date seule, sans heure ;
- une valeur absente ou invalide ;
- une échéance passée et une échéance future ;
- les différents statuts, dont rectificatif, annulation et attribution.

Il ne faut pas déduire le statut ouvert/fermé à partir du seul libellé de statut sans vérifier les règles métier de la source. Un avis rectificatif, par exemple, n’est pas nécessairement fermé.

## 3. Éléments restant non vérifiés

- réponse brute de l’endpoint exact appelé par la route ;
- syntaxe et résultat des filtres combinés (département + type) ;
- comportement de la recherche textuelle ;
- traitement des avis sans département de prestation ;
- validité effective des liens officiels sur un échantillon ;
- exhaustivité des résultats, car la route fixe actuellement `limit=50` et ne met pas en œuvre de pagination ;
- test de bout en bout dans l’application.

L’outil de consultation web utilisé lors de ce contrôle n’a pas pu ouvrir directement l’URL exacte de l’endpoint. Aucune conclusion n’est donc tirée de cette tentative concernant la disponibilité réelle de l’API.

## 4. Conclusion provisoire

**Constat positif :** les noms de champs utilisés par le connecteur concordent avec le schéma visible de la source BOAMP.

**Conclusion non permise à ce stade :** affirmer que le connecteur fonctionne correctement dans tous les cas ou que la collecte couvre tous les avis pertinents.

**Suite recommandée :** effectuer des requêtes de test contrôlées sur l’API réelle, vérifier les filtres et les dates, puis consigner les réponses attendues et obtenues avant toute modification du code.
