# BIO-001 — Spécification du scan de veille des appels d’offres

- **Version :** 0.1
- **Date :** 27 octobre 2026
- **Branche :** `architecture-v0-1`
- **Statut :** spécification préparatoire — aucun scan planifié ni stockage d’archives n’est implémenté par ce document.
- **Dépendance existante :** `GET /api/opportunities` dans `src/app/api/opportunities/route.ts`.

## 1. Objectif

Définir un premier scan de veille reproductible, en lecture seule, qui collecte des avis BOAMP, conserve une trace datée de la collecte, permet de comparer des résultats entre deux exécutions et prépare des synthèses et alertes sans déclencher d’action externe.

## 2. État initial constaté

La route existante interroge le jeu de données BOAMP exposé par OpenDataSoft. Elle accepte une recherche textuelle, un département et un type de marché. Elle transforme les enregistrements en fiches de résultat et retourne des métadonnées de source.

Limites à traiter avant d’annoncer BIO-001 comme opérationnel :
- le fonctionnement réel de bout en bout n’est pas confirmé par cette inspection ;
- la route limite les résultats à 50 et ne fournit pas de pagination explicite ;
- le comportement des filtres combinés et les noms de champs doivent être confirmés sur la source réelle ;
- la validité des liens officiels doit être testée ;
- les règles de statut et de date limite doivent être vérifiées, notamment pour une date sans heure ;
- aucun mécanisme d’archive persistante ni de comparaison entre deux collectes n’est identifié dans la route examinée ;
- aucun planificateur de scan n’est décrit ici comme existant.

## 3. Périmètre de la première version

### Inclus
- exécution manuelle d’une collecte contrôlée ;
- conservation des paramètres utilisés et de l’heure de collecte ;
- conservation de la source et de l’identifiant officiel de chaque avis ;
- enregistrement du résultat de collecte : succès, échec, durée et nombre de résultats ;
- validation du format de sortie et signalement des données manquantes ;
- production ultérieure d’un rapport de comparaison entre collectes.

### Exclus au départ
- envoi de courriels ou de notifications externes ;
- création ou modification automatique de données CRM ;
- sélection définitive d’entreprises à prospecter ;
- candidature ou action sur une plateforme acheteur ;
- déduction non vérifiée présentée comme un fait ;
- modification du connecteur existant avant les vérifications ciblées.

## 4. Données minimales à conserver par avis

| Champ logique | Règle |
|---|---|
| Identifiant source | Identifiant officiel stable, si fourni par la source ; ne pas utiliser l’index du résultat comme identité durable |
| Source | Nom de la source et jeu de données |
| URL source | Lien officiel de l’avis, vérifié ou marqué à vérifier |
| Objet | Texte tel que retourné par la source |
| Acheteur | Valeur source ou indication explicite d’absence |
| Catégorie | Valeur source et, si nécessaire, catégorie normalisée séparée |
| Département | Valeur source et règle de sélection appliquée |
| Publication | Valeur source brute et valeur d’affichage séparées si transformation |
| Date limite | Valeur source brute ; interprétation et fuseau documentés |
| Statut | Valeur source brute ; interprétation MajestiOS distincte |
| Collecté le | Horodatage de la collecte |
| Paramètres du scan | Recherche, catégorie, département et autres filtres utilisés |
| Qualité | Champs manquants, lien non vérifié, anomalie ou avertissement |
| Empreinte de comparaison | Valeurs normalisées utilisées pour détecter les changements, à définir dans l’implémentation |

La structure exacte devra être adaptée au format réel de la source. Ne pas inventer une valeur manquante ni écraser la valeur source par une interprétation.

## 5. Règles d’identité et de comparaison

1. Utiliser en priorité l’identifiant officiel stable fourni par BOAMP.
2. Si aucun identifiant stable n’est disponible, marquer l’avis comme non résolu et ne pas le dédupliquer automatiquement sur une simple ressemblance de titre.
3. Séparer la valeur brute de la source de sa représentation normalisée.
4. Comparer les champs pertinents entre deux collectes : objet, acheteur, dates, statut, catégorie, localisation et URL.
5. Distinguer les nouveaux avis, avis modifiés, avis inchangés et avis absents d’une collecte ultérieure.
6. L’absence d’un avis dans une collecte ne prouve pas à elle seule sa suppression ou sa clôture : elle peut résulter d’un filtre, d’une pagination, d’une erreur ou d’une modification de la source.
7. Conserver assez de contexte pour expliquer pourquoi une différence a été détectée.
8. Dédupliquer les résultats d’une même collecte avant de compter les nouveaux avis.

## 6. Rapport de chaque scan

Chaque exécution doit produire un rapport contenant :
- identifiant d’exécution et horodatage ;
- source, paramètres et périmètre du scan ;
- état final : réussi, partiel ou échoué ;
- durée, nombre reçu, nombre valide, doublons et enregistrements écartés ;
- champs absents et anomalies observées ;
- erreur technique éventuelle, sans exposer de secret ;
- nombre de nouveautés et de changements lorsque la comparaison sera disponible ;
- limites de couverture, notamment lorsque la collecte est plafonnée.

Une collecte partielle ne doit jamais être présentée comme une couverture exhaustive.

## 7. Cas de test d’acceptation

- Une requête valide retourne une réponse conforme au format attendu.
- Un département valide, par exemple `68`, est traité comme un filtre territorial et ne déclenche pas une recherche nationale silencieuse.
- Un département invalide produit une erreur explicite.
- Chaque avis exploitable dispose d’un identifiant stable ou d’un avertissement visible.
- Les liens source sont contrôlés sur un échantillon et les échecs sont signalés.
- Les valeurs de date avec heure et sans heure sont testées séparément.
- Les avis annulés, attribués, échus et sans date limite sont distingués correctement ou marqués « à vérifier ».
- Une erreur ou un délai dépassé est enregistré sans fabriquer de résultat de remplacement.
- Deux collectes identiques n’entraînent pas de nouveaux avis artificiels.
- Une modification d’un champ pertinent est détectée et expliquée.
- Une collecte filtrée ou incomplète ne marque pas abusivement tous les avis absents comme supprimés.
- Le nombre retourné par la route est distingué du total annoncé par la source et du nombre réellement parcouru.

## 8. Séquence de réalisation

1. Tester la source BOAMP et les champs avec des requêtes représentatives.
2. Documenter les résultats réels et les anomalies observées.
3. Définir le contrat de données de l’archive.
4. Choisir un mécanisme de conservation après avoir évalué les besoins de persistance, de volume, d’accès et de coût. Aucune technologie n’est imposée dans cette spécification.
5. Implémenter une première collecte manuelle en lecture seule.
6. Ajouter la comparaison entre deux collectes et les tests d’acceptation.
7. Produire une synthèse datée et un rapport d’erreurs.
8. Tester les alertes sans notification externe.
9. Seulement après validation, choisir une fréquence de scan et un mécanisme de planification adaptés.

## 9. Critères de sortie

BIO-001 ne peut être marqué « Actif » qu’après :
- validation des champs et filtres sur la source réelle ;
- tests des dates, statuts, liens et erreurs ;
- définition et test de l’archive ;
- exécution observable documentée ;
- vérification qu’une collecte partielle ou échouée n’est pas présentée comme complète ;
- absence d’action externe non autorisée.

## 10. Risques et limites

- Les données publiques peuvent avoir des conditions de réutilisation qu’il faut vérifier avant une exploitation commerciale.
- Les dates, statuts et champs peuvent évoluer côté source.
- Le plafond de résultats et l’absence de pagination peuvent créer une couverture incomplète.
- Une synthèse IA doit conserver des liens vers les sources et distinguer faits, interprétations et incertitudes.
- Les données archivées doivent avoir une politique de conservation et des contrôles d’accès définis avant un usage opérationnel.
