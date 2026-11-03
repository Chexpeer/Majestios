# MajestiOS — Cartographie fonctionnelle des flux

**Version :** 0.1 — conception cible à valider  
**Date :** 3 novembre 2026  
**Branche :** `evolution-2.0`

> Cette cartographie décrit une cible fonctionnelle. Elle ne signifie pas que les flux sont déjà développés ou opérationnels.

## 1. Principe

Chaque information doit avoir une provenance connue, être qualifiée avant exploitation et ne circuler que vers les fonctions autorisées. Publication, CRM, Veille et prospection ont des responsabilités distinctes. Le CRM constitue le référentiel commercial central ; il n'est pas pour autant accessible à tous les utilisateurs.

## 2. Vue synthétique

```text
SOURCES
  ├─ BOAMP : marchés publics
  ├─ BODACC : créations, ventes/cessions, modifications
  ├─ Annonces utilisateurs : emploi, sous-traitance, demande, offre, autres
  └─ Annonces de l'équipe MajestiOS : notamment emploi
             |
             v
       RÉCEPTION / COLLECTE
             |
             v
       CONTRÔLE / QUALIFICATION
       provenance • doublons • pertinence
       droits • finalités • complétude
             |
       +-----+------+------+
       |            |      |
       v            v      v
  PUBLICATION      CRM   VEILLE
  champs publics  référentiel analyse
  validés          central   et rapprochements
       |            |      |
       +------------+------+
                    |
                    v
             PROSPECTION ACTIVE
             si usage autorisé
                    |
                    v
             ACTIONS / RÉSULTATS
                    |
                    v
               HISTORIQUE CRM

  ESPACES CLIENTS : accès séparé aux seules données autorisées.
```

Les flèches représentent des possibilités de circulation, pas des transferts automatiques systématiques.

## 3. Rôle des espaces

| Espace | Responsabilité cible | Entrées | Sorties possibles |
|---|---|---|---|
| Marchés publics | Détecter des consultations pouvant ouvrir des marchés, des relations clients ou de la sous-traitance | BOAMP, puis sources autorisées | Signaux qualifiés vers CRM, Veille et prospection |
| Marchés privés | Présenter des signaux privés sélectionnés | BODACC et annonces internes validées | Signaux qualifiés vers CRM et Veille |
| Emploi | Publier exclusivement les offres des utilisateurs et de l'équipe MajestiOS | Annonces internes | Offres contrôlées et publiées |
| Je publie mon annonce | Recevoir les annonces professionnelles | Emploi, sous-traitance, demande, offre, autres | Modération, publication éventuelle, CRM/Veille selon règles |
| CRM | Référentiel commercial central | Entreprises, contacts, marchés, annonces, interactions | Historique, segmentation, données utiles aux autres fonctions |
| Veille | Détecter, rapprocher et qualifier des signaux | Sources autorisées et données accessibles | Analyses, alertes, cibles qualifiées |
| Prospection active | Transformer les signaux autorisés en actions | Cibles et opportunités qualifiées | Campagnes, relances, retours et résultats |
| Espaces clients | Fournir un espace de travail isolé | Données explicitement sélectionnées | Dossiers et suivi propres au client |
| BrainOS | Organiser la connaissance documentaire | Documentation validée et ressources autorisées | Synthèses et réponses traçables ; aucun accès implicite au CRM |

## 4. Flux par source

### 4.1 Marchés publics — BOAMP

Les cinq catégories seront choisies après mesure des volumes réels et validation du porteur du projet.

1. Collecter les avis dans le respect des règles de la source.
2. Conserver identifiant, URL, dates et provenance.
3. Qualifier la nature et l'intérêt commercial du marché.
4. Identifier des entreprises potentiellement concernées avec plusieurs critères ; un code NAF/APE ne prouve pas une capacité.
5. Relier les entreprises à l'avis déclencheur.
6. Alimenter CRM et Veille selon les règles définies ; préparer une prospection uniquement si l'usage est autorisé.

### 4.2 Marchés privés — BODACC

Les trois catégories retenues sont : **créations, ventes et cessions, modifications**. Les procédures collectives et radiations sont exclues du périmètre initial décidé. Un signal BODACC doit être qualifié : il ne prouve pas à lui seul l'existence d'un besoin commercial.

### 4.3 Annonces des utilisateurs

« Je publie mon annonce » remplace l'entrée Immobilier. Types prévus : emploi, sous-traitance, demande, offre et autres annonces professionnelles pertinentes.

Flux cible :
1. dépôt et identification de l'auteur selon un parcours à définir ;
2. réception et contrôle ;
3. vérification de la complétude, des doublons, des abus et des données personnelles ;
4. décision : publication, refus ou correction demandée ;
5. publication des seuls champs autorisés ;
6. création ou rapprochement CRM si la finalité et les droits le permettent ;
7. transmission éventuelle à la Veille ;
8. prospection éventuelle si autorisée ;
9. expiration, archivage ou retrait selon une politique à définir.

La publication ne vaut pas autorisation générale de réutiliser les coordonnées ou toutes les données de l'auteur. Les données publiques, internes et confidentielles doivent être séparées.

### 4.4 Emploi

Les offres d'emploi visibles dans MajestiOS proviennent exclusivement des utilisateurs ou de l'équipe MajestiOS. Cadremploi, France Travail et APEC ne sont pas des sources du catalogue d'emploi dans la phase actuelle. Leur éventuelle consultation, mise en cache et transmission à la Veille est différée.

## 5. Frontières et traçabilité

- **Publication :** n'expose que les champs validés.
- **CRM :** conserve les entités, relations, sources, interactions et résultats selon les droits définis.
- **Veille :** analyse les signaux ; elle ne publie pas automatiquement les données collectées.
- **Prospection :** utilise uniquement les informations dont l'usage commercial est autorisé et adapté à la finalité.
- **Espaces clients :** chaque client ne voit que ses données et les informations explicitement partagées avec lui.

Toute transmission doit pouvoir être expliquée : source, date, motif, règle appliquée, statut, destination et résultat éventuel.

## 6. Statuts à définir

Proposition de statuts à valider : reçu, à contrôler, incomplet/correction demandée, en qualification, accepté pour publication, publié, refusé, expiré/retiré, transmis au CRM, transmis à la Veille, exploitable/non exploitable en prospection, archivé.

Il faudra décider si les statuts de publication, CRM et Veille sont indépendants.

## 7. Sécurité et conformité

Avant toute automatisation, préciser les conditions d'utilisation des sources, les finalités, les champs publics/privés, les rôles, les durées de conservation, les droits de retrait, les journaux de transmission, la gestion des erreurs et les contrôles humains. Cette cartographie ne prescrit aucune base de données ni technologie.

## 8. État réel du prototype

Selon l'audit de phase 1, le prototype est statique, sans base de données, authentification ni persistance. CRM, Veille et prospection sont des pages de présentation. Le dépôt et la modération d'annonces ainsi que les flux intermodules ne sont pas implémentés. Les appels aux sources externes n'ont pas tous pu être vérifiés en direct.

## 9. Étapes documentaires suivantes

1. Valider les responsabilités et frontières des espaces.
2. Définir dépôt, modération, statuts et cycle de vie des annonces.
3. Définir les règles d'alimentation du CRM, de la Veille et de la prospection.
4. Formaliser le modèle conceptuel des données.
5. Définir rôles, droits et cloisonnements.
6. Établir un scénario de bout en bout et ses critères d'acceptation.
7. Traduire seulement ensuite cette cible en architecture technique.

## 10. Arbitrages encore nécessaires

- Les cinq catégories BOAMP après mesure.
- Qui peut déposer une annonce et comment l'auteur est vérifié.
- Quels champs sont publics, privés ou réservés à MajestiOS.
- Quelles annonces alimentent CRM, Veille et prospection, et à quelles conditions.
- Durées de conservation, expiration, retrait et signalement.
- Rôles internes de modération et qualification.
- Données et outils accessibles à chaque client.
