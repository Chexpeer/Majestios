# Enrichissement du CRM à partir des marchés attribués — MajestiOS

- **Version :** 0.1
- **Date :** 27 octobre 2026
- **Statut :** exigence fonctionnelle à intégrer à la feuille de route ; conception à valider
- **Périmètre actuel :** cadrage documentaire uniquement. Aucune collecte automatique ni connexion à une base de données n'est mise en place par ce document.

## 1. Besoin métier

MajestiOS doit pouvoir récupérer les avis de marchés attribués et identifier, lorsque l'information est publiée et suffisamment fiable, l'entreprise attributaire ainsi que le marché remporté. Ces informations doivent contribuer à enrichir progressivement la base de connaissances commerciales et, après validation et rapprochement, la base des entreprises/clients du CRM.

L'objectif n'est pas de considérer automatiquement toute entreprise attributaire comme un client de MajestiOS. Un marché gagné constitue un **signal commercial vérifiable** : il peut indiquer une activité, une référence, une présence sur un territoire, une expertise ou une relation avec un acheteur public. Le statut de client, prospect ou partenaire reste distinct et doit dépendre du contexte CRM.

## 2. Parcours cible

1. **Collecter** les avis d'attribution depuis une source autorisée et documentée.
2. **Conserver la provenance** : source, identifiant de l'avis, URL officielle, dates de publication et de collecte, champs d'origine.
3. **Extraire l'attributaire** et les informations disponibles sur le marché : objet, acheteur, catégorie, localisation, montant si publié, date et statut.
4. **Normaliser** les noms, identifiants légaux, adresses et autres champs disponibles sans effacer les valeurs originales.
5. **Rapprocher** l'attributaire d'une entreprise déjà connue dans le CRM.
6. **Détecter les doublons et ambiguïtés** : ne pas fusionner automatiquement deux entreprises sur le seul nom ou domaine web. Utiliser un identifiant légal fiable lorsqu'il est disponible ; sinon proposer une vérification humaine.
7. **Créer un signal de marché attribué** et le relier à l'entreprise identifiée ou à confirmer.
8. **Enrichir la fiche entreprise** uniquement avec les données justifiées par la source et selon des règles explicites.
9. **Permettre une revue humaine** des correspondances incertaines, corrections et éventuelles fusions.
10. **Tracer les changements** : valeur précédente/nouvelle, source, date, méthode de rapprochement et validation éventuelle.

## 3. Informations à prévoir

### Avis / marché attribué
- identifiant stable de la source et URL de l'avis ;
- objet du marché et acheteur public ;
- date de publication et, si disponible, date d'attribution ;
- type/nature du marché et localisation ;
- attributaire(s) explicitement publiés ;
- identifiant légal, adresse et autres coordonnées de l'attributaire lorsqu'ils sont présents dans la source ;
- montant attribué lorsqu'il est publié, avec devise et précision de la donnée ;
- état du traitement : détecté, normalisé, rapproché, à vérifier, validé, rejeté, erreur ;
- horodatage de collecte, version de la règle d'extraction et historique des mises à jour.

### Entreprise CRM
- lien vers un ou plusieurs avis attribués ;
- niveau de confiance et justification du rapprochement ;
- statut de la relation commerciale, géré séparément : inconnu, prospect, client, partenaire, autre ;
- champs enrichis, source et date de dernière vérification.

Ces champs sont une proposition fonctionnelle, pas un schéma de base de données validé.

## 4. Règles de qualité indispensables

- Un avis d'attribution ne prouve pas à lui seul qu'une entreprise est cliente de MajestiOS.
- Distinguer l'acheteur public, le titulaire/attributaire, les cotraitants et les sous-traitants lorsqu'ils sont explicitement identifiés. Ne pas les confondre.
- Un marché attribué peut comporter plusieurs attributaires ou lots : conserver cette structure si la source la fournit.
- Ne pas inventer les montants, dates, identifiants légaux ou attributaires manquants.
- Préserver les valeurs brutes et la référence officielle pour permettre une correction ultérieure.
- Dédupliquer les avis de façon idempotente : une même annonce récupérée plusieurs fois ne doit pas créer plusieurs signaux identiques.
- Actualiser un avis existant lorsque la source change, tout en conservant l'historique utile.
- Signaler les conflits entre sources au lieu d'écraser silencieusement une donnée fiable.
- Séparer les faits publiés, les rapprochements automatiques et les hypothèses commerciales générées.
- Prévoir des contrôles d'accès et des limites d'utilisation des données avant toute exploitation commerciale.

## 5. Architecture fonctionnelle proposée

Le traitement doit être un module réutilisable, distinct de l'écran de recherche BOAMP :

**Source → collecte → normalisation → dédoublonnage des avis → extraction des attributaires → rapprochement entreprise → revue si nécessaire → signal CRM sourcé → historique/audit.**

Le module devra pouvoir accueillir d'autres sources publiques ultérieurement sans coupler le modèle CRM à un fournisseur unique. Le connecteur BOAMP existant sert aujourd'hui à la recherche d'avis ; il ne faut pas présumer qu'il récupère déjà les données d'attribution ou les attributaires de façon complète.

Aucune base de données ni aucun service Supabase n'est à configurer à ce stade. La conception de persistance sera traitée lorsque le modèle de données et le périmètre MVP seront validés.

## 6. Tests d'acceptation à prévoir

- Un avis d'attribution avec un attributaire clairement identifié crée un signal sourcé.
- Une même annonce importée plusieurs fois ne crée pas de doublons.
- Un attributaire déjà connu est rapproché sans dupliquer l'entreprise.
- Deux entreprises homonymes ne sont pas fusionnées automatiquement sans preuve suffisante.
- Un avis avec plusieurs lots/attributaires conserve les liens corrects.
- Une donnée absente reste inconnue ; elle n'est pas remplacée par une estimation.
- Une modification de l'avis source est détectée et historisée.
- Une erreur source ou réseau est visible et ne génère pas de fausses données.
- L'entreprise peut être qualifiée comme prospect ou client uniquement via le processus CRM approprié.
- Chaque champ enrichi peut être relié à sa provenance et à sa date de vérification.

## 7. Décisions encore ouvertes

- Quelles sources officielles couvrent le mieux les avis d'attribution et quels champs exposent-elles réellement ?
- Quelle fréquence de collecte est adaptée et autorisée ?
- Quels critères de rapprochement sont acceptables, et quand une validation humaine est-elle obligatoire ?
- Quelles données peuvent être conservées et réutilisées à des fins de prospection, selon les conditions des sources et les règles applicables ?
- Quelles données enrichissent la fiche entreprise et lesquelles restent uniquement dans l'historique des marchés ?
- Quel périmètre appartient au MVP et quel volume doit être traité au démarrage ?

Ces points doivent être validés avant toute collecte automatisée à grande échelle.

## 8. Priorité et traçabilité

**Priorité proposée : élevée**, à planifier après la vérification du connecteur et la validation du modèle de données CRM. Le besoin fait partie de la chaîne d'intelligence commerciale et doit être suivi comme une exigence dédiée.

- **ID de traçabilité proposé :** CRM-ATTR-001
- **Exigence :** récupérer les marchés attribués et leurs attributaires, puis enrichir le référentiel d'entreprises CRM avec des données sourcées et dédoublonnées.
- **Preuve attendue :** tests d'acceptation ci-dessus réussis et exemples vérifiables liés aux avis officiels.
- **État :** cadré au niveau fonctionnel ; non implémenté et non testé.
