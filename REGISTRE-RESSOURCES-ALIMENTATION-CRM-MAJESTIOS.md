# Registre des ressources d’alimentation du CRM MajestiOS

**Version :** 1.0 — 1er novembre 2026  
**Statut :** inventaire initial de sources candidates et de sources déjà utilisées dans le prototype. Ce document ne certifie ni l’activation d’un connecteur, ni un droit général de republication, ni la conformité d’une campagne.

## 1. Objectif

Le CRM MajestiOS doit être alimenté par des ressources traçables afin de constituer et maintenir les fiches entreprises/établissements, repérer des opportunités, qualifier des signaux, gérer les contacts professionnels et suivre les actions autorisées. Il ne doit pas être réduit à un import massif de contacts.

Chaque ressource doit être enregistrée dans un registre technique et métier avec : propriétaire/producteur, URL officielle, catégorie de données, mode d’accès (API, téléchargement, flux, saisie humaine), identifiants et champs, fréquence, date de dernière vérification, licence/conditions, données personnelles éventuelles, limites, statut du connecteur et responsable de validation.

## 2. Ressources candidates prioritaires

| Priorité | Ressource | Données et valeur pour le CRM | Accès / limites à retenir | Statut MajestiOS |
|---|---|---|---|---|
| P0 | [API Recherche d’Entreprises — Annuaire des Entreprises](https://annuaire-entreprises.data.gouv.fr/donnees/api-entreprises) | Recherche et enrichissement de fiches, dénomination, SIREN/SIRET, code NAF/APE, localisation et informations administratives disponibles | API ouverte, mais couverture limitée à certaines données ; ne remplace pas toute la base Sirene. Limite officielle indiquée : 7 appels/s ; le prototype limite les requêtes en séquence et plafonne la pagination | Adaptateur prototype dans `company-targeting.js` ; accès navigateur réel, couverture et usage opérationnel non validés |
| P0 | [API Sirene — INSEE](https://www.insee.fr/fr/information/3591226) | Référentiel de base des unités légales et établissements, activité, identifiants, états et historique disponible | Accès via API après création/configuration ; vérifier quotas, diffusion partielle et conditions de prospection. Les données personnelles des personnes en diffusion partielle ne doivent pas être réutilisées à des fins de prospection | Candidate prioritaire, accès à configurer et conformité à vérifier |
| P0 | [BODACC — API officielle](https://www.data.gouv.fr/dataservices/api-bulletin-officiel-des-annonces-civiles-et-commerciales-bodacc) | Créations, ventes/cessions, procédures collectives et autres événements publiés ; détection de signaux à qualifier | Un événement est un fait publié, pas une preuve d’intention commerciale, de solvabilité ou de disponibilité d’un local | Connecteur navigateur présent dans le prototype ; fonctionnement réel et réutilisation à valider |
| P0 | [BOAMP — données ouvertes et API](https://www.boamp.fr/pages/donnees-ouvertes-et-api/) | Avis de marchés publics, lots, échéances, acheteurs et résultats publiés | Respecter l’attribution DILA, les règles de réutilisation et les données de source ; distinguer avis, résultats et marchés expirés | Connecteur présent dans le prototype ; tests réels à confirmer |
| P1 | [API RNE / Data INPI](https://data.inpi.fr/content/editorial/Acces_API_Entreprises) | Formalités de création, modification, cessation ; documents et informations publiques disponibles selon les jeux | Création de compte et sélection des accès/données selon le service ; licence et périmètre à vérifier avant intégration | Candidate d’enrichissement et de contrôle |
| P1 | [API Marché du travail — France Travail](https://www.data.gouv.fr/dataservices/api-marche-du-travail) | Tendances territoriales et sectorielles, métiers en tension, statistiques d’emploi | Données statistiques, pas nécessairement des fiches individuelles de prospects ; accès et fréquence à vérifier | Candidate pour analyses et signaux agrégés |
| P1 | [API Offres d’emploi — France Travail](https://www.data.gouv.fr/dataservices/api-offres-demploi) | Offres actives et compétences recherchées, pour veille emploi interne | **Attention : au 1er novembre 2026, la fiche officielle indique que l’API n’est plus exposée publiquement pendant une analyse des modalités de distribution et de réutilisation.** Ne pas bâtir le connecteur en supposant un accès disponible ; demander confirmation officielle | Bloquée / à revalider avant développement |
| P1 | [ROME 4.0 — France Travail](https://www.data.gouv.fr/organizations/france-travail/dataservices) | Référentiel métiers/compétences pour normaliser les signaux emploi et relier des compétences à des secteurs | Vérifier la version, la licence et le mode de diffusion | Candidate pour référentiel |
| P1 | [API Données foncières / DVF — data.gouv.fr](https://www.data.gouv.fr/dataservices/api-donnees-foncieres) | Transactions foncières et immobilières et indicateurs de territoire ; contextualisation immobilière | Les données ouvertes de transactions ne prouvent ni la disponibilité actuelle d’un local, ni la volonté de vendre/louer, ni l’identité d’un propriétaire utilisable à des fins commerciales | Candidate pour analyse territoriale, pas un flux d’annonces immobilières |
| P2 | Sites d’entreprises, annuaires professionnels, fédérations et réseaux sectoriels | Activités, prestations, spécialités, implantations, certifications et coordonnées professionnelles publiées | Source par source : conditions d’utilisation, droits de collecte/réutilisation, robots, licence, données personnelles et fréquence. Ne pas scraper par défaut | À inventorier et autoriser individuellement |
| P2 | Portails d’offres d’emploi privés : APEC, Cadremploi, agentCo, HelloWork, Indeed, Welcome to the Jungle, LinkedIn, Meteojob, APECITA, Choisir le service public, La Bonne Alternance et sources sectorielles | Signaux de recrutement, compétences, métiers, zones et évolutions sectorielles | Candidats à étudier, pas des connecteurs présumés disponibles. Privilégier API/flux/partenariat autorisés ; pas de collecte automatisée sans vérification contractuelle | À instruire source par source |
| P2 | Portails immobiliers professionnels et réseaux de mandats | Locaux, bureaux, commerces, entrepôts, fonds et cessions réellement proposés | Examiner les conditions contractuelles et la possibilité d’intégration ou de partenariat ; ne pas extraire les bases de portails sans autorisation | À instruire ; aucune source d’annonces déclarée connectée |
| P0 | Formulaires et interactions MajestiOS | Demandes d’accompagnement, inscriptions, préférences, oppositions, réponses, rendez-vous et historique | Le stockage, les droits d’accès, la durée de conservation et les mécanismes de suppression doivent être conçus avant mise en service | Formulaires du prototype non connectés au backend |

## 3. Sources internes qui doivent alimenter le CRM

Le CRM doit aussi recevoir, une fois le backend développé :
- les demandes de création d’espace et de contact ;
- les demandes d’accompagnement aux appels d’offres et les pièces de dossier associées ;
- les entreprises ciblées, la justification du ciblage et la source d’origine ;
- les interactions validées : envoi, livraison/échec, réponse, demande d’information, rendez-vous et résultat ;
- les préférences de communication, demandes de retrait et oppositions ;
- les changements de statut, corrections humaines et historique d’audit ;
- les liens entre entreprise, établissement, personne de contact, opportunité, marché, signal, campagne et action commerciale.

Aucune donnée de formulaire ne doit être annoncée comme reçue ou enregistrée tant que l’envoi et le stockage réels ne sont pas vérifiés.

## 4. Pipeline de données cible

1. **Découverte de la source** — enregistrer le producteur, l’URL officielle et le cas d’usage.
2. **Validation d’accès et de droits** — licence, CGU, quotas, données personnelles, réutilisation commerciale et attribution.
3. **Collecte limitée et planifiée** — uniquement par API, export, flux ou accord autorisé.
4. **Conservation de la provenance** — source, URL source, date de publication, date de collecte, identifiant source et version de schéma.
5. **Normalisation** — SIREN/SIRET quand disponibles, dénomination, adresse, code APE/NAF, territoire, dates et catégories.
6. **Résolution d’identité / dédoublonnage** — SIREN pour l’unité légale et SIRET pour l’établissement ; ne pas fusionner uniquement sur un nom ressemblant.
7. **Qualification** — séparer faits observés, inférences algorithmiques et validation humaine ; afficher le niveau de confiance et les raisons.
8. **Enrichissement contrôlé** — compléter les champs uniquement avec une source traçable et compatible.
9. **Action CRM** — créer une tâche ou proposer une action ; pas de campagne externe automatique sans autorisation explicite.
10. **Actualisation et retrait** — vérifier fraîcheur, fermeture/transfert, demandes d’opposition, conservation et suppression.
11. **Supervision** — journaliser erreurs, quotas, champs absents, retards, doublons et changements d’API.

## 5. Modèle de données minimum

Chaque donnée importée doit permettre de distinguer au minimum :

- **Source** : identifiant, producteur, URL, type, conditions, statut, date de vérification.
- **Enregistrement source** : identifiant externe, URL de l’élément, date de publication/collecte, contenu utile autorisé, empreinte ou clé de dédoublonnage.
- **Entreprise** : SIREN, nom légal, forme/statut, activité, code APE/NAF et dates de vérification.
- **Établissement** : SIRET, adresse, commune, département/région, état et dates.
- **Contact professionnel** : rôle/fonction, coordonnées nécessaires, source, finalité, base légale à documenter, préférences et oppositions ; minimisation stricte.
- **Signal/opportunité** : type, fait publié, hypothèse, pertinence, territoire, échéance, statut de vérification et responsable.
- **Campagne/action** : cible, justification, canal, version du message, autorisation, date, résultat et historique des oppositions.
- **Demande d’accompagnement** : besoin, opportunité liée, échéances, documents, responsable et statut.
- **Événement d’audit** : acteur, action, date, ancienne/nouvelle valeur et motif lorsque nécessaire.

Ce modèle est fonctionnel ; il ne préjuge pas du schéma physique ou de la technologie backend à retenir.

## 6. Règles de ciblage et de conformité

- Le code APE/NAF aide à présélectionner des entreprises ; il ne prouve pas qu’elles disposent des compétences, assurances, capacités ou disponibilités nécessaires à un marché.
- Pour une opportunité d’appel d’offres, rapprocher l’objet, les lots, les compétences, le territoire et les exigences explicites ; documenter les raisons de chaque classement.
- Viser environ dix entreprises pertinentes par département lorsque le volume et les critères le permettent ; ne jamais compléter artificiellement une liste insuffisante.
- Vérifier l’état actif de l’établissement et la fraîcheur des données avant toute action.
- Ne pas confondre coordonnées d’une personne physique, coordonnées professionnelles publiées et autorisation de prospection. Documenter finalité, base légale, information et droit d’opposition avec validation conformité.
- Les demandes de retrait/opposition doivent être propagées aux listes et campagnes concernées et conservées de manière appropriée pour éviter une réintroduction indue.
- Ne pas inférer qu’une procédure collective ou une cessation rend un local disponible. Confirmer séparément l’offre, le mandat et la disponibilité.
- Toute diffusion externe doit rester soumise à une validation humaine, aux règles de la source, aux exigences légales applicables et à l’autorisation explicite du responsable du projet.

## 7. Statuts normalisés d’une ressource

- **Candidate** : repérée, pas encore évaluée.
- **À vérifier** : accès, licence, champs ou qualité en cours de contrôle.
- **Bloquée** : accès ou droits insuffisants / non confirmés.
- **Autorisée, non intégrée** : périmètre et droits validés, développement à faire.
- **Intégrée, tests simulés** : logique vérifiée avec données simulées uniquement.
- **Connectée, tests réels réussis** : tests en conditions réelles documentés sur un commit donné.
- **Dégradée / indisponible** : source en erreur, retard ou changement d’API.
- **Retirée** : intégration désactivée, motif et date conservés.

Un nom de source dans ce document ne vaut jamais preuve d’accès, de connexion, de licence ou de fonctionnement opérationnel.

## 8. Ordre de réalisation recommandé

1. Fiabiliser et documenter BOAMP/BODACC déjà présents dans le prototype.
2. Ajouter le registre de sources et un schéma commun de provenance.
3. Évaluer l’API Recherche d’Entreprises et l’API Sirene pour les fiches entreprise/établissement et le dédoublonnage.
4. Définir le rapprochement APE/NAF ↔ exigences d’un marché et le classement explicable.
5. Préparer les sources statistiques emploi ; ne pas supposer l’API Offres d’emploi France Travail disponible.
6. Étudier les sources immobilières et les annuaires professionnels via des accès contractuellement autorisés.
7. Concevoir le backend CRM, les permissions, les formulaires, les oppositions et l’audit.
8. Exécuter les tests sur l’environnement et le commit exacts avant toute annonce de fonctionnement.

## 9. Références de cadrage

- CAHIER-DES-CHARGES-MAITRE-MAJESTIOS.md
- CAHIER-DES-CHARGES-VEILLE-STRATEGIQUE.md
- MODELE-DONNEES-APPELS-OFFRES.md
- BODACC-TRAITEMENT-SIGNAUX-COMMERCIAUX.md
- TRAITEMENT-OPPORTUNITES-MAJESTIOS.md
- MATRICE-TRAÇABILITE-EXIGENCES-MAJESTIOS.md
- SPECIFICATION-FONCTIONNELLE-DETAILLEE-MAJESTIOS.md

**Limite de cette version :** premier inventaire documentaire basé sur les sources officielles identifiées au 1er novembre 2026. Il reste à contrôler les champs précis, les accès effectifs, les licences applicables au cas d’usage MajestiOS et les tests en direct avant intégration.
