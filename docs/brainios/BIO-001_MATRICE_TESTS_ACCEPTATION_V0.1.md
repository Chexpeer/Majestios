# BIO-001 — Matrice de tests d'acceptation du connecteur BOAMP

- **Version :** 0.1
- **Date :** 27 octobre 2026
- **Branche :** `architecture-v0-1`
- **Statut :** plan de tests à exécuter ; résultats non encore observés
- **Périmètre :** validation de `GET /api/opportunities` et de la source BOAMP, sans modification du code

## 1. Règle de lecture

Cette matrice décrit les vérifications à réaliser. Une ligne marquée « À exécuter » n'est pas un résultat de test. BIO-001 ne doit pas être déclaré opérationnel tant que les cas bloquants ne disposent pas d'une preuve observable (requête, réponse, résultat attendu/obtenu et date).

## 2. Tests prioritaires

| ID | Cas | Entrée / scénario | Résultat attendu | Criticité | État |
|---|---|---|---|---|---|
| BOAMP-T01 | Requête sans filtre | GET `/api/opportunities` | Réponse JSON valide, source identifiée, pas de données de démonstration présentées comme réelles | Bloquant | À exécuter |
| BOAMP-T02 | Recherche textuelle | `q=infogérance` | Résultats liés au terme ou liste vide justifiée ; aucune erreur silencieuse | Haute | À exécuter |
| BOAMP-T03 | Département valide | `location=68` | Avis correspondant au département selon les champs et règles de source | Bloquant | À exécuter |
| BOAMP-T04 | Département invalide | `location=XX` | HTTP 400, message explicite, aucune recherche nationale de remplacement | Bloquant | À exécuter |
| BOAMP-T05 | Type de marché valide | `type=Services` | Résultats de services, cohérents entre filtre source et normalisation locale | Bloquant | À exécuter |
| BOAMP-T06 | Type inconnu | `type=Autre` | HTTP 400 | Haute | À exécuter |
| BOAMP-T07 | Filtres combinés | département + type + recherche | Les filtres sont appliqués ensemble selon les règles documentées | Bloquant | À exécuter |
| BOAMP-T08 | Date-heure avec fuseau | échéance comme `2026-11-30T10:00:00.000+01:00` | Affichage lisible en Europe/Paris et comparaison temporelle cohérente | Bloquant | À exécuter |
| BOAMP-T09 | Date seule | `datelimitereponse=2026-11-30` | Règle métier explicite ; ne pas supposer arbitrairement que l'avis ferme à minuit si la source ne le précise pas | Bloquant | À exécuter |
| BOAMP-T10 | Date absente ou invalide | échéance vide / chaîne invalide | Mention « à vérifier », pas de fausse date ni de statut ouvert affirmé | Bloquant | À exécuter |
| BOAMP-T11 | Statut rectificatif | `etat=RECTIFICATIF` | Le statut source est conservé ; la procédure et l'échéance restent évaluées séparément | Bloquant | À exécuter |
| BOAMP-T12 | Annulation | `etat=ANNULATION` | L'avis n'est pas présenté comme un marché actif | Bloquant | À exécuter |
| BOAMP-T13 | Attribution | avis de résultat / attribution | Ne pas présenter une attribution comme une consultation à laquelle répondre | Bloquant | À exécuter |
| BOAMP-T14 | Lien officiel | échantillon d'avis | URL accessible et correspondant à l'identifiant de l'avis | Haute | À exécuter |
| BOAMP-T15 | Champs absents | acheteur, département ou objet manquant | Valeur absente explicitement signalée, pas de donnée inventée | Haute | À exécuter |
| BOAMP-T16 | Identifiant manquant | avis sans identifiant stable | Enregistrement signalé ; aucun identifiant dérivé de l'index utilisé comme identité durable d'archive | Bloquant pour l'archivage | À exécuter |
| BOAMP-T17 | Plafond de résultats | requête produisant plus de 50 avis | Limite de couverture explicitement visible ; aucune prétention à l'exhaustivité | Bloquant pour veille exhaustive | À exécuter |
| BOAMP-T18 | API indisponible / délai dépassé | erreur HTTP ou timeout | HTTP 502 ou erreur explicite ; pas de résultats fictifs | Bloquant | À exécuter |
| BOAMP-T19 | Doublons dans la source | mêmes identifiants dans le jeu retourné | Doublons détectés avant le comptage des nouveautés | Haute pour comparaison | À exécuter |
| BOAMP-T20 | Comparaison de deux scans | un avis identique puis un avis modifié | Nouveauté, changement et absence sont distingués ; une absence seule ne prouve pas une suppression | Bloquant pour alertes | À exécuter |

## 3. Échantillon de référence à constituer

Pour chaque test qui utilise un avis réel, enregistrer :
- l'identifiant BOAMP et l'URL de l'avis ;
- l'horodatage de consultation ;
- les paramètres exacts envoyés ;
- les champs bruts nécessaires, sans copier de données personnelles inutiles ;
- le résultat attendu, le résultat obtenu et l'écart éventuel ;
- la version du code testée et l'environnement, lorsqu'ils sont connus.

Ne pas archiver plus de données personnelles que nécessaire. Les avis peuvent contenir des coordonnées de contact ; le périmètre de conservation et les usages ultérieurs doivent être justifiés.

## 4. Point technique à traiter en premier

La route actuelle appelle l'endpoint `records` avec `limit=50`. La documentation officielle OpenDataSoft indique que l'endpoint `records` est plafonné et que l'endpoint `exports` permet l'export des données sans la même limite. Cela ne signifie pas que l'export doit être choisi immédiatement : il faut d'abord définir le volume, les filtres, la fréquence et le mode de traitement attendus.

La route utilise également `new Date(datelimitereponse)` et compare l'horodatage à l'heure actuelle. Une valeur de date sans heure peut être interprétée à minuit ; la règle métier doit être confirmée avant de changer ce comportement.

## 5. Décision après les tests

Après exécution, classer chaque écart comme :
1. défaut confirmé du connecteur ;
2. limite documentée de la source ;
3. ambiguïté métier nécessitant une règle ;
4. résultat normal ;
5. test non concluant faute de preuve.

Aucune correction ne doit être faite uniquement pour rendre un test « vert » sans comprendre la cause. Toute correction ultérieure devra être minimale, testée et accompagnée d'une note de changement.

## 6. Critère de sortie

Le lot est validé quand les tests bloquants ont une preuve enregistrée, les écarts sont traités ou explicitement acceptés, et les limites de couverture sont visibles. Tant que cette condition n'est pas satisfaite, BIO-001 reste « en vérification ».
