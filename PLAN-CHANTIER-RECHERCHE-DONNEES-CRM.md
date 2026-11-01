# Chantier — recherche, données, dossiers et garde-fous MajestiOS

Version : 2026-11-01

**Priorité de pilotage actualisée :** avancer d’abord sur le cahier des charges maître (`CAHIER-DES-CHARGES-MAITRE-MAJESTIOS.md`) et les décisions produit. L’audit technique ne doit plus bloquer la clarification du produit ; les vérifications restantes seront ciblées sur les lots à implémenter. Aucun développement fonctionnel supplémentaire ne commence avant validation du périmètre concerné.
Branche de travail : `chantier-recherche-donnees-gardes-fous-2026-11-01`
Référence de départ : commit validé de la zone `d21d4d8f7e72c70688d72b0e180d56a5bf59c0df`
Statut : audit initial réalisé ; corrections progressives à valider. Aucune publication en production n'est autorisée par ce document.

## 1. Principes de conduite

1. Travailler par lots limités, isolés et réversibles.
2. Une branche de chantier part de la version de référence validée ; la zone industrielle ne doit pas être refondue dans ce chantier.
3. Aucune fusion vers `main`, aucun déploiement de production et aucune activation de collecte ou de campagne externe sans autorisation distincte.
4. Une fonctionnalité n'est déclarée opérationnelle qu'après test réel adapté. La présence d'un formulaire ou d'un script n'est pas une preuve.
5. Ne jamais présenter une donnée d'exemple comme une annonce réelle ; toute donnée publiée conserve sa provenance.
6. Ne jamais confondre un fait de la source, une transformation automatique, une hypothèse commerciale et une décision humaine.
7. Toute modification doit passer les contrôles de syntaxe, de build, de liens et les tests fonctionnels concernés.

## 2. Audit initial — constats vérifiables

- Le dépôt possède un moteur partagé `opportunity-search.js`, une page générale `resultats-recherche.html`, huit pages de catégories, un catalogue de rubriques et un schéma JSON d'opportunité.
- Les tests existants prévoient une vérification statique, des tests de disponibilité des sources BOAMP/BODACC et un test navigateur avec réponses simulées.
- La recherche publique interroge BOAMP ; la recherche privée interroge le jeu OpenDataSoft des annonces commerciales BODACC. Ces résultats ne doivent jamais être fusionnés sans indiquer clairement leur nature et leur source.
- Le filtre de région est déjà envoyé par le formulaire public, mais le chemin BOAMP ne l'appliquait pas à la requête ni aux résultats. Les valeurs de zones « Nord/Ouest/Sud — exemple » ne correspondent pas à des régions administratives réelles.
- Plusieurs rubriques métiers décrivent encore des parcours envisagés sans moteur de recherche local intégré. BrainOS et le CRM affichent explicitement un périmètre futur, pas un service connecté.
- Le modèle prévoit provenance, identifiants, dates et statuts ; il reste à construire la persistance serveur, le contrôle qualité, la déduplication et la file interne de qualification.

## 3. Segmentation des lots

### Lot 0 — sécurité et gouvernance
- Référence de code et branche de chantier.
- Checklist anti-régression, critères d'acceptation et limites de déploiement.
- Inventaire des tests et des fonctions réellement connectées.

### Lot 1 — moteurs de recherche
- Accueil : recherche transversale, critères compatibles avec les sources.
- Marchés publics : recherche BOAMP, filtres cohérents, échéances et lien officiel.
- Marchés privés / veille BODACC : recherche de signaux légaux, distincte des appels d'offres.
- Pages de catégories : critères transmis, source réellement interrogée, états chargement/résultats/vide/erreur.
- Développement commercial, prospection inversée et veille : définir pour chacune si elle recherche des opportunités, des entreprises, des dossiers documentaires ou des données CRM. Ne pas dupliquer le même formulaire sans sémantique claire.
- Salon virtuel : recherche d'exposants et d'activités uniquement lorsque le catalogue d'exposants existe.

### Lot 2 — chaîne de données
Collecter → conserver la provenance → normaliser → valider les champs → dédupliquer → classer le statut → qualifier → rapprocher avec un profil d'entreprise autorisé → soumettre à validation humaine → publier / retirer → historiser les changements.

Chaque source doit exposer un état distinct : opérationnelle, retardée, en erreur ou non configurée. Les données incomplètes ou à échéance inconnue ne doivent pas être présentées comme pleinement vérifiées.

### Lot 3 — contenu des dossiers
Chaque dossier doit contenir, selon son objet : présentation utile, moteur pertinent, critères, résultats ou état d'indisponibilité, explication de la provenance, méthode de qualification, actions disponibles avec leur état réel, ressources et liens internes cohérents.

### Lot 4 — fondations futures
- Personnalisation des pages : préférences de l'utilisateur, configuration versionnée, valeurs par défaut sûres, validation des entrées et possibilité de revenir à une configuration standard.
- Formulaires : validation client ET serveur, champs minimaux, états de soumission explicites, protection anti-abus, consentements pertinents et aucun faux message de confirmation.
- Outils d'analyse : indicateurs calculés sur des données traçables, définition documentée des métriques, date de calcul, limites et possibilité d'audit.
- CRM : entreprises, contacts, opportunités, tâches, interactions et pipeline ; isolation par compte, rôles et autorisations côté serveur ; journal d'audit ; politique de conservation et gestion des demandes d'opposition/suppression selon les règles applicables.
- Backend et base : décider à partir de l'architecture validée ; ne pas ajouter de stockage persistant au navigateur pour des données client sensibles ou partagées.

## 4. Garde-fous anti-régression

Avant chaque lot :
- relever la branche, le commit de départ et la liste exacte des fichiers touchés ;
- vérifier que la zone et son fichier de configuration restent inchangés sauf nécessité explicitement validée ;
- préciser les critères d'acceptation et les scénarios de test.

À chaque lot :
- `node --check` pour chaque script modifié ;
- `node build.js` ;
- `node verify-site.js` ;
- tests navigateur des parcours concernés ;
- tests de réponse vide, erreur HTTP, données malformées, doublons, échéance passée/manquante, filtre combiné et liens officiels ;
- vérifier qu'aucune action externe (email, candidature, campagne) n'est déclenchée automatiquement.

Avant fusion :
- comparer le diff avec la branche cible réelle ;
- confirmer les checks verts et examiner les fichiers générés/manifestes ;
- vérifier les parcours mobiles et l'accessibilité des libellés/états ;
- demander validation explicite pour toute fusion et, séparément, pour la production.

## 5. Échéances de pilotage

Les échéances sont des jalons de chantier, pas des promesses de livraison irréalistes :
- J0 — audit initial, segmentation, branche et garde-fous.
- J1 — correction des écarts critiques des moteurs existants et tests de régression.
- J2 — matrice des moteurs par rubrique et harmonisation des formulaires.
- J3 — contrat de données, qualité, statuts, déduplication et file de qualification spécifiés.
- J4 — priorisation des contenus de dossiers et maquettes fonctionnelles.
- J5 — architecture cible des formulaires, de la personnalisation, des analyses et du CRM.
- À chaque jalon : bilan, écarts, risques, fichiers modifiés, tests exécutés et décision de poursuivre / corriger / revenir en arrière.

Ne pas annoncer un lot « terminé » tant que les tests prévus n'ont pas été exécutés et que les fonctions dépendantes ne sont pas vérifiées.

## 6. Ordre de priorité fonctionnel

P0 : fiabilité de la recherche BOAMP/BODACC, provenance, filtres annoncés, états d'erreur, absence de résultats fictifs.
P1 : recherche présente et cohérente dans les principales rubriques qui disposent réellement d'un corpus.
P2 : traitement serveur, normalisation, déduplication, statuts, journalisation et persistance.
P3 : dossiers métier enrichis et processus interne de qualification.
P4 : personnalisation, formulaires robustes, analyses et CRM.
P5 : enrichissements immersifs de la zone industrielle, après stabilisation du reste du site.

## 7. Critère de réussite

MajestiOS doit permettre de rechercher, comprendre, qualifier et suivre des informations dont la provenance et l'état sont explicites. L'interface ne doit jamais laisser croire qu'une recherche est connectée, qu'une donnée est vérifiée, qu'un formulaire est enregistré ou qu'un CRM fonctionne si cela n'a pas été réellement implémenté et testé.


## 8. Extension stratégique — veille économique, emploi et immobilier professionnel

Cette extension prépare l'architecture sans déclarer les modules développés ni connectés. Elle ne remplace pas la priorité immédiate de fiabilisation BOAMP/BODACC.

### 8.1 Principes communs

- Chaîne cible : Sources → collecte → normalisation → contrôles qualité → détection de signaux → qualification humaine → action commerciale/CRM → analyse.
- Distinguer explicitement le fait publié, la transformation, l'hypothèse commerciale et la validation humaine.
- Conserver provenance, identifiant source, dates de publication/collecte/vérification, conditions de réutilisation et lien original.
- Prévoir dédoublonnage, fraîcheur, statut, historique, expiration et retrait.
- Ne jamais présenter un signal comme une opportunité confirmée sans vérification.
- Vérifier droits de réutilisation, qualité et limites de chaque source avant automatisation.

### 8.2 Familles de signaux à préparer

1. Commande publique (BOAMP et sources compatibles) : consultations et résultats/attributions lorsque disponibles et vérifiés; pistes de sous-traitance à confirmer.
2. Événements d'entreprises (BODACC) : créations/immatriculations publiées, ventes et cessions, procédures collectives, modifications et radiations. Le BODACC n'est pas assimilé à un moteur d'appels d'offres.
3. Référentiel d'entreprises et établissements (ex. Sirene/INSEE) : créations, transferts et fermetures selon les champs disponibles.
4. Construction et aménagement : données publiques d'urbanisme lorsque jeux de données et conditions d'accès sont vérifiés.
5. Implantation/déménagement : transferts et créations pouvant signaler des besoins en locaux, travaux, équipements, informatique, télécommunications ou services.
6. Démarrage d'activité : besoins possibles de nouvelles entreprises, sans présumer d'une intention d'achat.
7. Transmission : fonds de commerce, cessions de titres et ventes d'actifs à qualifier séparément.
8. Veille emploi : offres autorisées pouvant signaler compétences recherchées ou évolutions sectorielles; pas de moteur public de recherche d'emploi.
9. Immobilier professionnel : cessations, transferts, cessions et annonces immobilières autorisées à croiser pour repérer des biens potentiellement libérés ou mis en vente/location.
10. Tendances territoriales/sectorielles : agrégations datées, avec méthode et limites.
11. Suivi CRM : changements publics concernant une entreprise connue, proposés comme tâches de vérification, jamais comme certitudes automatiques.
12. Sous-traitance : rapprochement d'un marché attribué avec les activités et capacités locales; le besoin de sous-traitance reste une hypothèse tant qu'il n'est pas confirmé.

### 8.3 Module Emploi — périmètre futur

- Dossier autonome; ne pas ajouter Emploi aux filtres du moteur d'opportunités commerciales.
- Dépôt d'offres par un employeur : poste, missions, compétences, secteur, localisation, contrat, dates, employeur, provenance et lien officiel.
- Veille d'offres uniquement auprès de sources dont l'accès et la réutilisation sont vérifiés.
- Cycle de vie : brouillon → à vérifier → validée → publiée → expirée ou retirée.
- Seules les offres approuvées, sourcées et non expirées peuvent alimenter le flux horizontal.
- Les offres peuvent nourrir des analyses sectorielles; toute inférence est étiquetée comme hypothèse.
- Formulaire Nous rejoindre avec candidature et CV : collecte minimale, validation serveur, format/taille contrôlés, stockage privé, accès restreint, durée de conservation et procédure de suppression. Pas de faux succès; dépôt désactivé jusqu'à la mise en place d'un backend sécurisé.

### 8.4 Immobilier professionnel — périmètre futur

- Dossier autonome de veille immobilière professionnelle et foncière d'entreprise.
- Signaux possibles : cessation/transfert, vente de fonds, cession, procédure collective, projet d'aménagement et annonce immobilière explicite.
- Distinguer murs, fonds de commerce, droit au bail, vente/location du bien, cession d'actifs et simple fermeture.
- États possibles : signal détecté, informations à compléter, disponibilité vérifiée, opportunité publiée, écartée/expirée.
- Une cessation ou liquidation ne prouve pas que les locaux sont disponibles. Vérifier séparément propriété/mandat, bail, disponibilité et annonce explicite avant toute présentation comme bien disponible.
- Publics potentiels : agents immobiliers d'entreprise, gestionnaires de locaux, investisseurs et professionnels de la transmission, selon les autorisations applicables.

### 8.5 Arborescence fonctionnelle cible

- Développement commercial : Marchés publics (BOAMP); événements d'entreprises et annonces commerciales (BODACC); prospection inversée; sous-traitance et partenaires; veille économique et sectorielle; analyse territoriale; transmission et cession; suivi commercial.
- Emploi (dossier autonome, sans moteur de recherche public) : déposer une offre; veille des offres autorisées; qualification/validation; analyse des compétences et signaux sectoriels.
- Immobilier professionnel (dossier autonome futur) : signaux de locaux potentiellement libérés; transactions et cessions à qualifier; projets de construction/aménagement; vérification de disponibilité.
- Nous rejoindre : candidature; dépôt sécurisé de CV; collaboration et partenariat.
- Socle commun : sources/provenance; qualification; CRM; analyses; historique et gouvernance.

Cette arborescence est fonctionnelle et n'impose pas de déplacer physiquement les fichiers HTML. Toute nouvelle page doit être déclarée dans le build, contrôlée par verify-site et testée avant d'être annoncée comme active.

### 8.6 Jalons

- E0 : inventaire des sources, risques, contrats de données et critères d'acceptation.
- E1 : stabilisation des recherches BOAMP/BODACC.
- E2 : contrat commun des signaux (provenance, typologie, qualité, statuts, déduplication, fraîcheur).
- E3 : dossier Emploi et formulaire Nous rejoindre; CV inactif tant que le stockage sécurisé n'est pas configuré.
- E4 : veille immobilière et matrice signal → vérifications, sans présenter les signaux comme des biens disponibles.
- E5 : connecteurs source par source après validation des conditions d'accès et de réutilisation.
- E6 : CRM, flux et analyses alimentés uniquement par des données validées.

Aucun lot futur ne doit détourner le chantier P0 de stabilisation BOAMP/BODACC. Aucun merge ni déploiement de production n'est autorisé par cette spécification.

### 8.7 Critères d'acceptation des signaux

Pour chaque signal, documenter : source, fait publié, transformation, hypothèse éventuelle, niveau de vérification, accès autorisé, action permise et date d'expiration ou de réexamen.


## Lot Emploi — veille discrète multisource

**Priorité :** après stabilisation et validation des parcours de recherche BOAMP/BODACC ; préparer le cadrage sans détourner le lot prioritaire.

1. **Inventorier les ressources** : France Travail (offres, marché du travail, ROME 4.0, événements), La Bonne Alternance, APEC, Cadremploi, agentCo, HelloWork, Indeed, Welcome to the Jungle, LinkedIn, Choisir le service public et sources sectorielles pertinentes.
2. **Qualifier l'accès** : API ou flux officiel, habilitation, licence, conditions d'extraction/réutilisation, fréquence, couverture et coûts éventuels. Aucun scraping ou republication ne doit être présumé autorisé.
3. **Construire des adaptateurs isolés** par source, sans dépendance dure à un fournisseur unique ; prévoir délais d'attente, limitation de débit, reprises et journalisation.
4. **Normaliser et fiabiliser** : identifiant source, URL, dates, entreprise, métier, compétences, localisation, contrat, statut et date d'expiration ; dédoublonnage et retrait des annonces périmées.
5. **Planifier une collecte en arrière-plan** seulement après validation des accès et de la politique de fréquence ; mesurer succès, erreurs, fraîcheur et volumes par source.
6. **Qualifier les signaux** et séparer les faits des hypothèses de développement commercial. L'analyse doit pouvoir rapprocher métier/compétences/territoire de signaux autorisés sur les entreprises, sans conclusion automatique non démontrée.
7. **Diffusion optionnelle** : le bandeau horizontal de l’accueil reste exclusivement fictif et ne reçoit aucune annonce réelle. La veille emploi reste interne ; pas de moteur de recherche d'emploi sur l'accueil et pas de mélange avec le moteur principal d'opportunités commerciales.

**Critère de sortie :** matrice des sources validée, au moins un adaptateur autorisé testé, contrôles de fraîcheur/doublons documentés, erreurs traçables, et tests anti-régression réussis. Ce lot n'autorise ni fusion dans main ni déploiement en production.


## Lot métier transversal — ciblage APE/NAF, diffusion et accompagnement aux appels d'offres

Ce lot documente une fonction déjà prévue dans la vision produit : mettre en relation un marché qualifié, les entreprises susceptibles d'y répondre et le service d'accompagnement MajestiOS.

### Préparation requise
1. Définir les champs de qualification d'un marché et de ses lots.
2. Définir une table de correspondance APE/NAF ↔ activités/exigences, avec source, version et justification, en prévoyant des correspondances multiples et des limites explicites.
3. Inventorier les sources d'entreprises et documenter accès, licence, fréquence, champs, qualité, fraîcheur et réutilisation autorisée.
4. Définir le score explicable de pertinence et la déduplication (identifiants d'entreprise, établissement, coordonnées professionnelles lorsque licites).
5. Paramétrer une cible indicative d'environ dix entreprises pertinentes par département et par opportunité ; conserver une liste plus courte si elle est plus exacte.
6. Préparer un modèle de diffusion présentant l'opportunité et l'offre d'accompagnement à la réponse.
7. Définir les statuts CRM : identifiée, à vérifier, sélectionnée, validée, prête à contacter, envoyée, échec d'envoi, réponse reçue, intéressée, opposition/désinscription, accompagnement demandé, clôturée.
8. Définir les garde-fous de conformité, la validation humaine et l'interdiction d'activer une campagne sans autorisation explicite.

### Critères de sortie
- Le choix des codes APE/NAF et des entreprises est explicable et traçable.
- Le quota indicatif n'entraîne jamais de sélection artificielle.
- L'offre d'accompagnement est associée à la diffusion sans promesse de résultat.
- Les sources et coordonnées ont un statut d'autorisation documenté.
- Les événements d'envoi et les oppositions sont suivis et testables.
- Le parcours est spécifié avant le développement ; aucun déploiement ou envoi réel n'est autorisé par ce document.


## Ressources d’alimentation du CRM — référence commune

Le registre `REGISTRE-RESSOURCES-ALIMENTATION-CRM-MAJESTIOS.md` centralise l’inventaire initial des ressources externes et internes. Le lot CRM doit intégrer progressivement la provenance des données, les identifiants source, les dates de collecte et de publication, les règles de dédoublonnage SIREN/SIRET, les droits de réutilisation, la fraîcheur, les oppositions et la journalisation. L’API Offres d’emploi France Travail est à revalider avant tout développement car sa fiche officielle signale une suspension de son exposition publique. Aucune source candidate n’est réputée connectée sur la seule base de son inscription dans le registre.
