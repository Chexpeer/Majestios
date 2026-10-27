# Base de connaissances MajestiOS — Veille des marchés publics
Version : 0.1
Statut : référentiel de conception ; aucun collecteur automatique n'est encore activé.

## 1. Objectif
Construire une mémoire métier fiable et traçable qui aide MajestiOS à découvrir, normaliser, dédupliquer, qualifier et suivre les opportunités de commande publique. La base ne doit jamais confondre une donnée officielle, une analyse produite par MajestiOS et une hypothèse.

## 2. Sources initiales à privilégier
### Source A — BOAMP / DILA
- Portail officiel : https://www.boamp.fr/
- Page officielle données ouvertes et API : https://www.boamp.fr/pages/donnees-ouvertes-et-api/
- API Explore : https://www.boamp.fr/api-console/explore/v2.1/
- Référence API sur data.gouv.fr : https://www.data.gouv.fr/dataservices/api-bulletin-officiel-des-annonces-des-marches-publics-boamp
- Usage : recherche des avis de publicité et de consultation, avis de concession, avis d'attribution et certains MAPA.
- Accès : l'API est annoncée comme gratuite. Vérifier la documentation et les conditions en vigueur avant la mise en production.
- Attribution : conserver l'URL source, la date de collecte et les mentions d'attribution demandées par la DILA.

### Source B — Données essentielles de la commande publique (DECP)
- Jeu de données/API : https://www.data.gouv.fr/datasets/api-decp
- Guide : https://guides.data.gouv.fr/donnees-specifiques/donnees-de-la-commande-publique/publier-les-donnees-essentielles-des-marches-publics
- Usage : enrichissement et analyse des marchés attribués, des acheteurs et des historiques disponibles. Ce n'est pas un substitut direct aux avis de consultation ouverts : ces données peuvent être publiées après notification et leur couverture dépend des déclarations.
- Utiliser les données DECP pour comprendre l'activité d'achat et les acheteurs, pas pour présenter un marché attribué comme une opportunité encore ouverte.

### Source C — PLACE et autres profils acheteurs
- À étudier ensuite : sources officielles et flux réellement accessibles, conditions de réutilisation, fréquence et couverture. Ne pas annoncer de couverture exhaustive avant audit des sources.

## 3. Principes de qualité et de sécurité
1. Chaque enregistrement doit garder une source originale consultable.
2. Séparer date de publication, date limite de réponse, date de collecte et date de dernière vérification.
3. Détecter les doublons avec l'identifiant officiel quand il existe ; sinon utiliser une empreinte basée sur source, acheteur, objet et dates.
4. Ne jamais inventer un lien, une échéance, un montant, un acheteur ou un statut.
5. Afficher clairement « source indisponible », « date non renseignée » ou « vérification nécessaire » plutôt que de déduire une valeur.
6. Détecter les avis modifiés, annulés, attribués ou expirés. Un avis expiré peut rester dans l'historique mais ne doit pas être proposé comme ouvert.
7. Respecter les conditions d'utilisation, licences, limites d'accès, règles de conservation et obligations relatives aux données personnelles.
8. Ne pas contourner une connexion, un CAPTCHA, une restriction technique ou des conditions d'accès.
9. Prévoir des délais de requête raisonnables, une mise en cache, des reprises limitées et des journaux d'erreur.
10. Les résumés IA et les scores de pertinence sont des analyses MajestiOS : ils doivent rester distincts du contenu officiel.

## 4. Modèle logique initial
### Source
- source_id ; name ; source_type (API, flux, portail, fichier) ; base_url ; publisher ; license_or_terms_url ; expected_refresh ; last_success_at ; last_error_at ; status

### Opportunity
- opportunity_id (identifiant interne) ; source_id ; source_record_id (identifiant officiel si fourni) ; title ; description_excerpt ; buyer_name ; buyer_identifier ; procedure_type ; category ; cpv_codes ; location_label ; publication_date ; deadline_at ; estimated_value ; currency ; official_status ; source_url ; first_seen_at ; last_seen_at ; last_verified_at ; content_hash ; quality_flags

### KnowledgeNote
- note_id ; subject_type (source, acheteur, catégorie, opportunité, règle métier) ; subject_id ; note_type (fact, summary, classification, question, correction) ; content ; evidence_urls ; created_at ; updated_at ; confidence ; generated_by (source officielle, humain, IA) ; review_status

## 5. Pipeline de veille cible
1. Interroger les sources autorisées selon un calendrier configurable.
2. Valider le format et conserver la provenance.
3. Convertir les champs vers un modèle MajestiOS commun sans supprimer les données d'origine utiles.
4. Dédupliquer et comparer la nouvelle version à la version précédente.
5. Marquer les nouvelles opportunités, changements de dates, annulations et disparitions.
6. Appliquer les filtres de qualité et écarter les entrées insuffisamment fiables de la recherche utilisateur.
7. Calculer des critères explicables de pertinence : métier, mots-clés, zone, CPV, échéance et type de procédure.
8. Mettre à jour les fiches de connaissance liées à l'acheteur et au secteur, en citant les preuves.
9. Publier les résultats avec un lien direct vers la source originale et la date de dernière vérification.
10. Produire un rapport de veille : nouvelles annonces, changements, erreurs de collecte, sources silencieuses et avis à vérifier.

## 6. Recherche et ergonomie
- Recherche textuelle : titre, description disponible, acheteur, catégorie et codes CPV.
- Filtres : région/département si les données le permettent, type de marché, statut, publication et échéance.
- Tri : pertinence, publication la plus récente, échéance la plus proche.
- Chaque carte indique la source, la date de publication, la date limite lorsqu'elle existe et l'état de vérification.
- Le bouton principal ouvre la fiche officielle dans un nouvel onglet ; la page MajestiOS reste la couche de qualification et d'analyse.
- Les exemples de démonstration ne doivent jamais être mélangés avec des résultats en direct.

## 7. Veille continue — exigences avant activation
La veille ne sera considérée comme active qu'après : un collecteur serveur réel ; un calendrier de mise à jour explicite ; un stockage durable ; des tests sur des réponses réelles ; la gestion des limites, erreurs, doublons et changements ; un tableau de suivi de la fraîcheur des données ; des tests de liens sortants et de filtres ; une indication visible de la dernière mise à jour.

Tant que ces éléments ne sont pas implémentés et vérifiés, l'interface doit afficher que le raccordement est en préparation.