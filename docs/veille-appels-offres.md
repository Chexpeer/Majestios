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
## 8. LinkedIn — veille professionnelle et signaux commerciaux

LinkedIn doit faire partie de la connaissance interne de MajestiOS, mais comme une source complémentaire de signaux professionnels, pas comme un substitut aux avis officiels de marchés publics.

### Usages métier envisagés
- Repérer les actualités publiques d'organisations : nouveaux projets, implantations, investissements, recrutements, partenariats et changements de direction.
- Comprendre les secteurs, fonctions et intitulés de postes utilisés par les acheteurs et décideurs.
- Détecter des signaux pouvant justifier une recherche complémentaire : croissance d'une entreprise, lancement d'activité, besoin de sous-traitance ou projet annoncé.
- Préparer des hypothèses de prospection à vérifier à partir d'une source publique ou d'une prise de contact légitime.
- Enrichir la cartographie Entreprise → Interlocuteur → Décideur uniquement avec des données pertinentes, sourcées et obtenues de manière autorisée.

### Règles impératives
1. Un signal LinkedIn n'est pas une preuve qu'un marché est ouvert. Il doit être qualifié comme « signal commercial » et relié à une preuve distincte si une opportunité est confirmée.
2. Prioriser les intégrations officielles et les fonctionnalités autorisées par LinkedIn. Vérifier les conditions d'accès, les autorisations et les usages permis avant toute automatisation.
3. Ne pas contourner les protections de la plateforme ni aspirer massivement des profils, des pages ou des données personnelles.
4. Ne pas collecter de données sensibles. Limiter les données personnelles à ce qui est nécessaire à un usage professionnel légitime, avec une provenance, une date de vérification et une durée de conservation adaptées.
5. Séparer les informations publiques publiées par une organisation, les déclarations d'une personne et les inférences produites par l'IA.
6. Toute inférence (par exemple « pourrait être décideur ») doit être explicitement marquée comme hypothèse, accompagnée de ses indices et vérifiée avant d'être utilisée pour une décision importante.
7. Conserver l'URL du contenu d'origine quand son accès et sa conservation sont autorisés. Si le contenu n'est plus accessible, marquer la référence comme non vérifiable plutôt que de reproduire une information non confirmée.
8. Ne pas utiliser d'envoi automatisé massif de messages. Toute prospection doit respecter les règles de la plateforme, le droit applicable et les préférences des personnes contactées.

### Champs de connaissance pour un signal professionnel
- signal_id, source_id, source_url, organization_id
- signal_type (actualité, recrutement, projet annoncé, partenariat, changement organisationnel, autre)
- published_at, collected_at, last_verified_at
- summary, evidence_excerpt, confidence, review_status
- related_opportunity_id (facultatif)
- personal_data_minimized (indicateur de minimisation)
- retention_until (si nécessaire selon la politique de conservation)

### Place de LinkedIn dans le pipeline
1. Suivre les contenus publics ou les données accessibles par des moyens officiellement autorisés.
2. Détecter les signaux potentiellement pertinents, sans conclure automatiquement qu'ils correspondent à un besoin d'achat.
3. Relier le signal à l'organisation concernée avec un niveau de confiance explicite.
4. Chercher une confirmation dans une source officielle, un site d'entreprise, un avis public ou une autre source autorisée.
5. Proposer à l'utilisateur une piste argumentée, avec les preuves et les incertitudes, plutôt qu'une certitude artificielle.

### Références de conformité à examiner avant intégration
- LinkedIn — conditions d'utilisation : https://www.linkedin.com/legal/user-agreement
- LinkedIn — politique de confidentialité : https://www.linkedin.com/legal/privacy-policy
- LinkedIn — portail développeurs : https://developer.linkedin.com/

L'intégration technique de LinkedIn reste à étudier : l'existence d'un portail développeur ne signifie pas qu'une API donnée autorise la recherche générale de contenus ou l'accès aux profils souhaités.