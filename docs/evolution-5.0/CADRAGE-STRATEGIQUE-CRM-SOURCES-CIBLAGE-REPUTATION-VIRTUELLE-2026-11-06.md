# Cadrage stratégique — CRM, sources, ciblage commercial et Réputation virtuelle

**Date :** 6 novembre 2026  
**Branche de travail :** `evolution-5.0-admin-cockpit`  
**Statut :** décisions d'orientation exprimées par le porteur du projet, complétées par des propositions à soumettre à revue indépendante.  
**Objet :** document de consultation destiné à plusieurs IA et relecteurs, afin de confronter la cohérence, la faisabilité, les risques et les priorités avant toute évolution technique.

> Ce document décrit une cible fonctionnelle. Il ne prétend pas que les connecteurs, collectes, traitements, campagnes ou parcours décrits sont déjà développés ou opérationnels.

## 1. Décision stratégique : élargir le champ des sources

Le CRM MajestiOS ne doit pas dépendre uniquement de BODACC et BOAMP. Ces deux sources restent importantes, mais elles ne constituent que deux fournisseurs parmi un écosystème de sources généralistes et spécialisées.

La cible est un système extensible capable d'accueillir plusieurs familles de sources :

- **Référentiels d'entreprises et d'établissements :** INSEE/SIRENE, Annuaire des Entreprises, Registre national des entreprises et données publiques pertinentes.
- **Annonces et événements économiques :** BODACC, annonces légales, créations, cessations, procédures collectives, cessions et transmissions.
- **Commande publique :** BOAMP, profils acheteurs, données essentielles de la commande publique, avis, attributions et titulaires.
- **Marchés privés et projets :** plateformes professionnelles, annonces de sous-traitance, projets de construction, d'aménagement, d'investissement et appels à projets.
- **Territoires et urbanisme :** données ouvertes des collectivités, permis et autorisations accessibles, projets d'aménagement et infrastructures.
- **Emploi et compétences :** offres d'emploi et signaux de recrutement permettant d'identifier une activité, une croissance ou un besoin.
- **Immobilier professionnel :** locaux, implantations, transactions et signaux d'ouverture ou de déménagement.
- **Référentiels sectoriels :** certifications, qualifications et annuaires professionnels, selon les métiers visés.
- **Présence numérique :** informations publiques accessibles sur les moteurs, cartes, annuaires, sites et réseaux professionnels, dans le respect des conditions d'accès et d'utilisation de chaque service.

Cette liste est un catalogue de familles à instruire, pas une décision de connecter immédiatement toutes les plateformes.

### 1.1 Principe d'extensibilité

Chaque source doit être traitée comme un connecteur identifiable, documenté et gouvernable. Pour chaque source, prévoir au minimum :

- identité et organisme éditeur ;
- périmètre géographique et sectoriel ;
- catégories d'informations disponibles ;
- mode d'accès (API, flux, téléchargement, consultation autorisée ou saisie) ;
- conditions d'utilisation, licence et éventuelles restrictions ;
- fréquence de mise à jour et date réelle des données ;
- champs fournis, qualité et limites connues ;
- coût, quotas, authentification et dépendances éventuelles ;
- statut opérationnel : étudiée, autorisée, intégrée, testée, active, suspendue ou retirée ;
- date de dernière collecte et indicateurs d'erreur.

Une source ne doit jamais être déclarée intégrée sur la seule base de son inscription dans une liste documentaire.

## 2. Premier circuit stratégique : transformer un appel d'offres en ciblage d'entreprises

Le CRM doit pouvoir partir du contenu d'un appel d'offres et identifier des entreprises susceptibles de posséder les activités et compétences nécessaires pour y répondre ou intervenir en sous-traitance.

### 2.1 Chaîne fonctionnelle cible

1. **Lire et analyser l'appel d'offres** : objet, lots, prestations, compétences, qualifications, contraintes techniques, lieu d'exécution, calendrier et éventuelles conditions d'accès.
2. **Décomposer les besoins métier** : métiers principaux, métiers complémentaires, spécialités et compétences attendues.
3. **Proposer une correspondance NAF/APE** : suggérer un ou plusieurs codes d'activité pertinents, avec justification, degré de correspondance et limites.
4. **Déterminer le territoire** : département d'exécution, départements explicitement visés et éventuel périmètre élargi paramétrable.
5. **Interroger les annuaires et référentiels d'entreprises** : rechercher les entreprises et établissements correspondant aux activités et territoires.
6. **Enrichir et contrôler** : raison sociale, SIREN/SIRET, établissement actif, adresse professionnelle, activité déclarée, effectif disponible, statut et autres informations autorisées.
7. **Qualifier les résultats** : pertinence métier, adéquation géographique, taille, fraîcheur des informations, fiabilité et éventuelles exclusions.
8. **Préparer un fichier de campagne** : sélectionner les entreprises, expliquer pourquoi elles ont été retenues, identifier les coordonnées professionnelles disponibles et signaler les champs manquants.
9. **Faire valider la sélection** par un responsable habilité avant toute campagne.
10. **Préparer la campagne d'e-mails** : segment, message, objet, source, motif de sollicitation, règles de désinscription et suivi des réponses.

### 2.2 NAF/APE : une correspondance assistée, jamais une vérité automatique

Un code APE/NAF décrit l'activité principale déclarée d'une unité. Il ne prouve pas à lui seul qu'une entreprise possède toutes les compétences, qualifications, assurances, moyens ou disponibilités nécessaires pour répondre à un marché.

Le moteur doit donc :
- proposer plusieurs codes possibles lorsque le besoin est transversal ;
- distinguer correspondance forte, complémentaire et incertaine ;
- conserver les mots-clés et extraits du marché ayant motivé la correspondance ;
- signaler les lots qui exigent une qualification particulière ;
- permettre une correction humaine du mapping ;
- éviter d'exclure une entreprise uniquement parce que son code principal ne reflète pas une activité secondaire pertinente.

La taille d'entreprise, notamment le ciblage envisagé de structures de 5 à 15 salariés et l'exclusion des structures de plus de 15 salariés lorsqu'elle est demandée, doit rester un critère configurable et dépendre de données réellement disponibles et datées. Ne pas présenter un effectif estimé ou absent comme un fait vérifié.

### 2.3 Résultat attendu

Le livrable n'est pas une simple liste brute. C'est un **dossier de ciblage traçable** contenant :
- l'appel d'offres source et ses lots ;
- les métiers et codes NAF/APE proposés ;
- les départements et règles géographiques ;
- les entreprises retenues et leur justification ;
- la source et la date de chaque donnée ;
- les niveaux de confiance et champs à vérifier ;
- les exclusions et leur motif ;
- les coordonnées professionnelles utilisables, si elles sont disponibles légalement ;
- le statut de validation et la version du fichier.

Le fichier est préparé pour une campagne ; il ne déclenche pas automatiquement un envoi.

## 3. Deuxième circuit stratégique : détecter les créations d'entreprises et proposer la Réputation virtuelle

Les entreprises récemment créées constituent un autre gisement de besoins. Une ouverture récente peut révéler une présence numérique incomplète : fiche cartographique absente ou inexacte, coordonnées incohérentes, horaires non publiés, absence de site, présence sociale insuffisante ou informations dispersées.

### 3.1 Exemple fondateur formulé par le porteur du projet

> « Ex monsieur vieuchnoc vient d'ouvrir un restaurant non répertorié sur Google maap..  
> Celle ci est contacté pour un coup de maquillage sur sa présence sur internet....  
> si monsieur vieuchnoc est intéressé ...on publie une annonce dans la rubrique réputation virtuelle pour lui trouver une maquilleuse.. »

La graphie originale est conservée comme expression du porteur du projet. La formulation normalisée de travail peut employer « Google Maps » et « professionnel de la visibilité numérique », sans effacer la métaphore du « coup de maquillage ».

### 3.2 Parcours fonctionnel cible

1. **Détecter une création ou une ouverture** à partir d'une source autorisée : création d'entreprise, établissement, annonce, signal local ou autre source fiable.
2. **Identifier l'établissement** : raison sociale, enseigne, activité, adresse, date ou période de création, SIREN/SIRET et source.
3. **Vérifier la présence numérique publique** : moteurs de recherche, cartes, annuaires, site Internet et réseaux pertinents, dans les limites des accès autorisés.
4. **Établir un diagnostic prudent** : présence trouvée, présence non trouvée, informations incohérentes, informations non vérifiables. Une absence de résultat sur une plateforme ne prouve pas à elle seule une absence totale de présence numérique.
5. **Détecter un besoin potentiel** : visibilité locale, création ou correction de fiche, cohérence des coordonnées, présence web, réputation, contenus ou accompagnement.
6. **Préparer une proposition commerciale** adaptée au métier et au territoire.
7. **Contacter l'entreprise** selon les règles applicables et enregistrer la démarche dans le CRM.
8. **Qualifier l'intérêt et le besoin**. Aucune annonce de mission n'est publiée simplement parce qu'une entreprise a été détectée.
9. **Obtenir l'accord explicite du prospect/client** sur le besoin, le périmètre et les informations à publier.
10. **Créer une demande dans la rubrique Réputation virtuelle** afin de rechercher un professionnel adapté (la « maquilleuse » de l'exemple).
11. **Recevoir et qualifier les candidatures ou propositions**, puis organiser la mise en relation.
12. **Suivre la prestation et son résultat** dans le CRM, avec les autorisations et éléments de preuve nécessaires.

### 3.3 Frontière essentielle

La détection d'une entreprise et l'observation de ses informations publiques ne valent ni consentement commercial illimité, ni autorisation de publier une demande en son nom.

La publication dans Réputation virtuelle intervient seulement après validation du besoin et accord explicite du professionnel concerné sur les éléments qui seront rendus visibles. Le client doit pouvoir corriger ou retirer les informations publiées selon les conditions du service.

## 4. Un référentiel d'entreprise commun, plusieurs rôles possibles

Une même entreprise peut être :
- une cible de prospection ;
- un candidat potentiel à un marché ;
- un sous-traitant ;
- un donneur d'ordre ;
- un fournisseur ;
- un client potentiel ou existant ;
- un bénéficiaire d'une prestation de Réputation virtuelle ;
- un partenaire ou un prescripteur.

Le CRM ne doit donc pas enfermer une entreprise dans une catégorie définitive. Il doit conserver une fiche entreprise de référence et rattacher à celle-ci des rôles, relations et opportunités contextualisés, datés et réversibles.

Les rapprochements doivent s'appuyer en priorité sur des identifiants fiables (SIREN/SIRET lorsqu'ils existent), puis sur des règles contrôlées pour les cas ambigus. Une enseigne, une adresse ou un nom commercial ne suffisent pas toujours à fusionner deux enregistrements.

## 5. Architecture fonctionnelle proposée

Le système peut être structuré en capacités logiques, sans présumer de nouvelles tables ou de nouvelles fonctions Supabase :

1. **Registre des sources et connecteurs** : catalogue, statut, conditions, qualité et suivi.
2. **Collecte** : récupération ponctuelle ou planifiée, selon les droits et limites de chaque source.
3. **Zone de données brutes** : conservation contrôlée de la réponse source et de sa provenance.
4. **Normalisation et rapprochement** : identifiants, adresses, nomenclatures, doublons et liens entre établissements et entreprises.
5. **Interprétation métier** : extraction des besoins d'un marché, correspondance NAF/APE, détection de signaux.
6. **Qualification** : pertinence, fraîcheur, confiance, critères de ciblage et validation humaine.
7. **CRM opérationnel** : entreprises, contacts, opportunités, activités, relances et historique.
8. **Préparation des campagnes** : segments, fichiers, modèles de messages, validation, envoi via un service autorisé et suivi.
9. **Services transversaux** : création d'une demande ou d'un dossier pour les rubriques autorisées, dont Réputation virtuelle.
10. **Journalisation et gouvernance** : accès, décisions, corrections, validations, exports, publications et diffusions.

Cette architecture est une proposition logique. Elle doit être rapprochée du modèle Supabase déjà existant avant toute décision de persistance. Le principe est de préserver le CRM et son socle actuels, pas de créer un deuxième CRM.

## 6. Gouvernance des données, campagnes et publications

Les exigences suivantes sont structurantes :

- conserver la source, la date de collecte et la date de mise à jour de chaque donnée ;
- distinguer fait source, déduction algorithmique, enrichissement externe et validation humaine ;
- gérer les données manquantes, périmées ou contradictoires sans les transformer en certitudes ;
- respecter les conditions d'accès et de réutilisation des sources ;
- limiter les données collectées à ce qui est nécessaire à la finalité ;
- contrôler les coordonnées professionnelles et la base juridique de leur utilisation ;
- prévoir l'identification de l'émetteur, la pertinence de la sollicitation, l'information du destinataire et un moyen simple d'opposition/désinscription lorsque requis ;
- tenir une liste d'opposition et éviter de recontacter une personne ou entreprise qui s'y est opposée ;
- imposer une validation avant diffusion d'un fichier ou lancement d'une campagne ;
- ne jamais publier un besoin client dans Réputation virtuelle sans accord explicite ;
- journaliser qui a recherché, qualifié, validé, exporté, envoyé ou publié quoi, quand et pour quelle finalité ;
- définir des durées de conservation et des procédures de correction/suppression adaptées.

Les modalités exactes doivent faire l'objet d'une revue juridique et conformité (notamment RGPD, règles CNIL relatives à la prospection électronique, conditions contractuelles et licences des fournisseurs de données). Ce document n'est pas un avis juridique.

## 7. Pilotage par l'administration

L'administration générale pilote les objectifs et garde le contrôle :
- choisir les sources à utiliser ;
- sélectionner les zones géographiques, secteurs, mots-clés et codes NAF/APE ;
- définir les critères d'effectif ou autres filtres ;
- lancer des recherches ponctuelles au départ ;
- observer les résultats et adapter les critères ;
- décider ensuite si une automatisation récurrente est pertinente ;
- valider les segments et les fichiers ;
- autoriser les campagnes et les publications ;
- désigner les équipes et destinataires habilités ;
- suivre les coûts, volumes, erreurs, doublons, taux de qualification et résultats.

**Décision de méthode :** les recherches seront ponctuelles, ciblées et mesurées dans un premier temps ; les automatisations seront envisagées après observation des résultats et validation des besoins.

## 8. Indicateurs à étudier

Les indicateurs doivent aider à mesurer la valeur réelle, pas seulement le volume collecté :

- taux de correspondance entre appel d'offres et codes NAF/APE ;
- proportion d'entreprises vérifiables et réellement pertinentes ;
- taux de doublons et d'informations périmées ;
- coût et délai par entreprise qualifiée ;
- taux de validation humaine des suggestions ;
- taux de délivrabilité et de réponse des campagnes, lorsque l'envoi est autorisé ;
- nombre de besoins de Réputation virtuelle détectés, confirmés et acceptés ;
- taux de mise en relation aboutie ;
- taux de transformation en prestation ;
- valeur commerciale générée et temps humain mobilisé.

## 9. Métaphores et formulations à conserver

Les formulations du porteur du projet sont des éléments de doctrine et doivent rester conservées dans le patrimoine documentaire :

- « Le CRM n'est pas seulement le moteur de traitement... c'est l'aspirateur de compétition... le composteur industriel, le malaxeur de l'intelligence artificielle, la bétonnière chinoise... l'imprimante 3D !!! »
- « On a une Rolls avec un moteur de F1... on va pas se plaindre !!! »
- « Si tu commets une erreur, regarde le rétroviseur avant de faire marche arrière. »
- « Il y aussi celle du septième ciel !! Des couleurs !! »
- « Ex monsieur vieuchnoc vient d'ouvrir un restaurant non répertorié sur Google maap.. Celle ci est contacté pour un coup de maquillage sur sa présence sur internet....si monsieur vieuchnoc est intéressé ...on publie une annonce dans la rubrique réputation virtuelle pour lui trouver une maquilleuse.. »

Les métaphores sont des aides à la conception, pas des spécifications techniques littérales. Leur interprétation opérationnelle doit être explicitée sans effacer leur formulation d'origine.

## 10. Questions à soumettre aux autres IA — revue indépendante

Les IA consultées doivent examiner ce cadrage sans présumer que les choix proposés sont tous pertinents. Elles doivent distinguer leurs constats, recommandations, hypothèses et questions.

### A. Cohérence produit et valeur commerciale
1. Les deux circuits (appel d'offres → entreprises à cibler ; création d'entreprise → Réputation virtuelle) forment-ils une architecture cohérente ?
2. Quels autres cas d'usage concrets découlent naturellement du même référentiel d'entreprises ?
3. Quelles fonctions apportent une valeur différenciante et lesquelles risquent de créer une complexité disproportionnée ?
4. Le CRM doit-il porter directement certains parcours ou les exposer comme services à d'autres rubriques ?

### B. Sources et données
5. Quelles sources généralistes et spécialisées françaises seraient réellement utiles, avec quelles données, licences, API, coûts et limites ?
6. Comment concevoir un registre de connecteurs extensible sans multiplier les intégrations fragiles ?
7. Comment fiabiliser les correspondances entre besoins d'un appel d'offres et nomenclatures NAF/APE ?
8. Quelles sources permettent de vérifier les effectifs, l'activité réelle, les établissements actifs et les coordonnées professionnelles ?
9. Comment gérer les données contradictoires, les doublons et les changements d'établissement ?

### C. Faisabilité technique et intégration au socle existant
10. Comment raccorder ces capacités au CRM Supabase existant sans créer un CRM parallèle ?
11. Quelles responsabilités doivent relever du CRM, de l'administration, des connecteurs, de l'IA et des rubriques métier ?
12. Quel modèle logique minimal recommander avant de créer des tables ou des migrations ?
13. Quels traitements doivent être synchrones, asynchrones, relançables et idempotents ?
14. Quels journaux, métriques et mécanismes de reprise sont indispensables ?

### D. Prospection et conformité
15. Quelles règles françaises et européennes s'appliquent aux campagnes d'e-mails B2B fondées sur des données publiques ou enrichies ?
16. Quelles conditions faut-il vérifier avant d'utiliser ou de diffuser des coordonnées provenant d'un annuaire ou d'une plateforme ?
17. Quels contrôles, preuves, mécanismes d'opposition et durées de conservation faut-il prévoir ?
18. Où placer la validation humaine et quels actes ne doivent jamais être automatisés sans autorisation ?

### E. Réputation virtuelle et mise en relation
19. Comment vérifier de façon fiable la présence numérique d'une nouvelle entreprise sans interpréter une absence de résultat comme une preuve ?
20. Comment présenter un diagnostic utile et non intrusif au dirigeant ?
21. Quel consentement et quel niveau de détail obtenir avant de publier une demande dans Réputation virtuelle ?
22. Comment qualifier les professionnels qui répondent, prévenir les faux profils et assurer une mise en relation de qualité ?
23. Quels modèles économiques ou niveaux de service seraient cohérents ?

### F. Priorisation et expérimentation
24. Quel MVP mesurable recommander pour tester ces deux circuits sans refonte générale ?
25. Quels territoires, secteurs et sources choisir pour un premier pilote ?
26. Quels critères de réussite ou d'arrêt fixer avant d'automatiser ?
27. Quels risques majeurs ou angles morts le porteur du projet n'a-t-il pas encore identifiés ?

### Format de réponse demandé aux IA consultées

Pour chaque recommandation importante, préciser :
- **Constat** : ce qui est cohérent ou problématique ;
- **Preuve ou référence** : source, documentation ou raisonnement vérifiable ;
- **Proposition** : solution recommandée ;
- **Priorité** : indispensable, utile ou secondaire ;
- **Risque / dépendance** : ce qui peut bloquer ;
- **Confiance** : élevée, moyenne ou faible.

Les IA doivent terminer par :
1. les cinq décisions à prendre en premier ;
2. un MVP réaliste et mesurable ;
3. les risques juridiques et techniques à traiter avant expérimentation ;
4. les éléments qu'elles déconseillent de construire maintenant.

## 11. Garde-fous de réalisation

- Préserver le CRM Supabase existant et auditer ses capacités avant toute évolution de schéma.
- Ne créer aucune base ou CRM parallèle.
- Aucune migration, modification RLS, fonction SQL/Edge, donnée, compte ou rôle sans autorisation explicite.
- Aucun envoi de campagne réel sans validation explicite, contrôle de conformité et destinataires approuvés.
- Aucune publication de demande Réputation virtuelle sans accord explicite du client.
- Ne pas confondre données publiques, données librement réutilisables et données utilisables pour toute finalité.
- Ne pas automatiser immédiatement : commencer par des recherches ponctuelles et ciblées, mesurer, corriger, puis décider.
- Aucun déploiement, merge vers `main` ou promotion en production sans autorisation explicite.
- L'immeuble interactif, ses images, son architecture, ses libellés, ses étages, ses zones cliquables, ses liens et son intégration restent intouchables.
- Toute évolution doit être documentée, testée et réalisée par lots réversibles.

## 12. Synthèse de la vision

Le CRM MajestiOS doit être capable de partir d'un signal économique, de l'interpréter, de retrouver les entreprises concernées, de les qualifier, de préparer une action commerciale et, lorsque le besoin est confirmé, d'alimenter une rubrique métier par une demande structurée.

Il ne s'agit pas seulement de collecter des annonces. Il s'agit de relier les marchés, les entreprises, les territoires, les compétences, les besoins et les professionnels, tout en gardant la traçabilité et le contrôle humain.

**Une entreprise peut être une cible, un client, un donneur d'ordre, un fournisseur ou un bénéficiaire de service selon le contexte. Le CRM doit savoir gérer ces relations sans enfermer l'entreprise dans une seule case.**


## 13. Première revue documentaire indépendante — sources officielles consultées le 6 novembre 2026

Cette annexe apporte des éléments vérifiables à la consultation. Elle ne remplace pas les avis d'autres IA, qui restent à recueillir. Les sources ci-dessous sont officielles ou institutionnelles ; les conditions et versions doivent être recontrôlées avant intégration technique.

### 13.1 Référentiels d'entreprises : commencer par les API publiques adaptées

- **API Recherche d'Entreprises (DINUM)** : API ouverte, synthèse notamment de données RNE et Sirene ; la documentation institutionnelle indique une limite de 400 appels/minute/IP. Elle est utile pour la recherche et la synthèse, mais ne donne pas accès à l'intégralité des données Sirene. Les entreprises non diffusibles ne sont pas accessibles par cette API.  
  Références : [présentation des API Entreprises](https://annuaire-entreprises.data.gouv.fr/donnees/api-entreprises) ; [documentation API Recherche d'Entreprises](https://recherche-entreprises.api.gouv.fr/docs/).
- **API Sirene (INSEE)** : accès aux données d'identité des entreprises et établissements ; l'INSEE décrit des données mises à jour quotidiennement et des possibilités de recherche ou de téléchargement. C'est une source centrale pour l'identification, les établissements, les dates, activités et effectifs lorsqu'ils sont disponibles.  
  Référence : [Consulter et télécharger la base Sirene](https://www.insee.fr/fr/information/3591226).
- **RNE / INPI** : données publiques du Registre national des entreprises, formalités, actes et comptes annuels selon les droits et disponibilités. L'accès API/SFTP nécessite un compte et des conditions d'accès propres aux ressources.  
  Références : [Accès aux API Entreprises INPI](https://data.inpi.fr/content/editorial/Acces_API_Entreprises) ; [présentation du RNE](https://www.inpi.fr/ressources/formalites-dentreprises/registre-national-entreprises).
- **API Entreprise** : ne pas la considérer comme un connecteur public librement disponible. L'accès est réservé aux acteurs et démarches habilités ; vérifier l'éligibilité de MajestiOS avant de la retenir.  
  Référence : [API Entreprise — conditions d'accès](https://www.data.gouv.fr/dataservices/api-entreprise).

**Conséquence de conception :** pour un premier prototype, étudier l'API Recherche d'Entreprises et l'API Sirene avant de développer des connecteurs multiples. Utiliser RNE/INPI comme source complémentaire lorsque les données et conditions le justifient. Distinguer l'entreprise (SIREN) de ses établissements (SIRET).

### 13.2 Commande publique : ne pas s'arrêter aux avis de consultation

Les données essentielles de la commande publique consolidées constituent un complément utile aux avis BOAMP : elles peuvent aider à identifier les marchés attribués, les acheteurs, les titulaires et les historiques disponibles. Le jeu consulté sur data.gouv.fr est publié sous Licence Ouverte et comporte des fichiers consolidés volumineux ; il faudra mesurer les coûts d'ingestion, la granularité, les mises à jour et les correspondances avec les avis initiaux avant de choisir entre API, fichiers complets ou extractions ciblées.

Référence : [Données essentielles de la commande publique — fichiers consolidés](https://www.data.gouv.fr/datasets/donnees-essentielles-de-la-commande-publique-fichiers-consolides).

### 13.3 Prospection électronique B2B : distinguer l'adresse générique et la personne physique

La CNIL rappelle qu'en B2B, la prospection électronique peut reposer sur l'intérêt légitime lorsque la sollicitation est en rapport avec la profession de la personne contactée. La personne doit être informée de l'utilisation de ses coordonnées et pouvoir s'opposer simplement et gratuitement. Les adresses génériques de personnes morales (par exemple contact@ ou info@) relèvent d'un traitement distinct des adresses nominatives de personnes physiques. Chaque message doit identifier l'émetteur et offrir un moyen simple de ne plus recevoir de sollicitations.

Références : [CNIL — prospection commerciale par courrier électronique, SMS-MMS et automate d'appel (10 juin 2026)](https://www.cnil.fr/fr/la-prospection-commerciale-par-courrier-electronique-sms-mms-et-automate-dappel) ; [CNIL — communication électronique aux prospects et clients](https://www.cnil.fr/fr/communication-electronique-quelles-regles).

**Conséquence de conception :** le CRM ne doit pas considérer qu'une adresse trouvée dans un annuaire équivaut automatiquement à une adresse utilisable. Il faut conserver la source, le caractère générique ou nominatif, la date et le contexte de collecte, l'information délivrée, le statut d'opposition et la justification de la pertinence professionnelle. La validation de conformité précède l'envoi.

### 13.4 Google Maps : point de vigilance majeur pour le cas « restaurant absent »

Les conditions Google Maps Platform interdisent notamment l'extraction ou le scraping de contenus Maps pour les réutiliser en dehors des services, y compris la copie et la sauvegarde de noms d'entreprises, adresses ou avis. Les politiques Places API rappellent également des restrictions de stockage, de redistribution et d'utilisation des contenus.

Références : [Google Maps Platform Terms of Service](https://cloud.google.com/maps-platform/terms) ; [Places API — policies and attributions](https://developers.google.com/maps/documentation/places/web-service/policies).

**Conséquence de conception :** ne pas bâtir le détecteur de « restaurant absent de Google Maps » sur du scraping, de l'aspiration ou la constitution d'une base locale à partir des contenus Google Maps. Le diagnostic de présence numérique doit privilégier des sources et API dont les conditions autorisent explicitement l'usage envisagé, des liens de vérification manuelle, des informations fournies par le commerçant ou des services contractuellement autorisés. Une absence de résultat ne doit jamais être présentée comme une preuve certaine.

### 13.5 Décisions de prudence à retenir dès le cadrage

1. Construire d'abord un premier parcours autour de données d'identité d'entreprises officielles et documentées.
2. Séparer les données d'entreprise (personne morale) des données personnelles de contacts professionnels.
3. Séparer la détection d'une opportunité, la qualification d'un contact, la préparation d'une campagne et l'envoi effectif.
4. Ne pas confondre données accessibles, données ouvertes, données réutilisables et données autorisées pour une finalité commerciale déterminée.
5. Pour Réputation virtuelle, ne pas s'appuyer sur l'extraction de Google Maps ; concevoir une vérification licite, traçable et confirmée par le professionnel.
6. Faire valider les traitements et les messages par une revue juridique/conformité avant le premier envoi réel.

### 13.6 Statut de la consultation inter-IA

Cette annexe est une première vérification documentaire fondée sur des références institutionnelles et les conditions officielles de fournisseurs. **Elle ne constitue pas un avis d'une autre IA.** Les 27 questions de la section 10 restent le questionnaire à transmettre à des relecteurs indépendants. Leurs retours devront être ajoutés séparément, avec leur date, leur périmètre, les sources qu'ils citent et les points de désaccord. Aucun avis ne sera présenté comme un consensus avant confrontation.


### Métaphore ajoutée — transformer la moutarde en mayonnaise

Formulation originale du porteur du projet : « MajestiOS le CRM qui transforme la moutarde en Mayonnaise ! »

**Interprétation fonctionnelle :** le CRM doit être capable de partir d'informations disparates, brutes, parfois peu exploitables ou contradictoires, puis de les transformer en un résultat structuré, cohérent et directement utile au développement commercial. La valeur ne réside pas dans l'accumulation des données, mais dans leur transformation maîtrisée : collecte, tri, nettoyage, rapprochement, qualification, enrichissement, mise en forme et production d'un livrable ou d'une action exploitable.

**Conséquences de conception :**
- conserver la provenance et la date de chaque information ;
- distinguer les faits sources des déductions et enrichissements ;
- rendre visibles les données manquantes, contradictions et niveaux de confiance ;
- appliquer des règles de transformation explicites et révisables ;
- prévoir une validation humaine avant toute action engageante ou diffusion ;
- mesurer la qualité du résultat obtenu, pas seulement le volume traité.

Cette image complète les métaphores de l'aspirateur, du composteur, du malaxeur, de la bétonnière et de l'imprimante 3D : elle résume, avec humour, la promesse de transformation du CRM. Elle ne signifie pas que le système peut inventer les ingrédients manquants ou garantir un résultat sans contrôle.


### Métaphore ajoutée — l'ascenseur qui fait monter la moutarde au nez

Formulation originale du porteur du projet : « MajestiOS l'ascenseur qui fait monter la moutarde au nez »

**Interprétation fonctionnelle :** cette formule joue sur deux images complémentaires. L'ascenseur relie les étages et fait circuler les informations, les demandes et les services entre les rubriques de MajestiOS. « Faire monter la moutarde au nez » évoque, avec humour, la capacité du CRM à faire remonter ce qui coince : irritants clients, retards, anomalies, opportunités négligées, incohérences ou signaux faibles qui nécessitent une décision.

**Conséquences de conception :**
- organiser la remontée d'informations pertinentes entre les rubriques et le poste de commandement ;
- distinguer les alertes urgentes, les simples notifications et les informations à consulter ;
- rattacher chaque signal à son origine, son contexte, son responsable et son état de traitement ;
- éviter les alertes répétitives ou inutiles : priorité, seuils et fréquence doivent être configurables ;
- permettre de suivre une alerte jusqu'à sa résolution et de conserver son historique.

L'ascenseur ne remplace pas les espaces ni leur organisation : il assure la circulation verticale de l'information. La moutarde qui monte doit attirer l'attention sur un sujet réel, pas provoquer artificiellement de l'agacement.


## 13. État d'avancement — analyse du descriptif de marché

Le prototype de préqualification permet maintenant de fournir un intitulé et un descriptif libre du marché ou du lot. Les suggestions APE/NAF exploitent conjointement le texte saisi et affichent les indices lexicaux à l'origine de chaque proposition.

Cette avancée reste une aide à l'analyse, pas un moteur d'extraction documentaire : elle ne lit pas encore directement un avis BOAMP, ses lots structurés ou les pièces du dossier de consultation. Les correspondances sont lexicales, non sémantiques, et exigent une validation humaine. Le prototype n'est pas encore intégré au poste CRM authentifié et ne persiste aucun résultat dans Supabase.


## 11. Troisième circuit stratégique — publipostage intelligent par QR Code et badge MajestiOS

Le porteur du projet souhaite instruire un canal complémentaire à l'emailing : un **publipostage physique (carte, courrier ou invitation) intégrant un QR Code**, accompagné du slogan original « Ouvrez vous les portes du succès 😂😂 ». La graphie marketing proposée est « Ouvrez-vous les portes du succès ! ». L'intention est de transformer le support postal en invitation vers une expérience numérique MajestiOS, mesurable et adaptée à la campagne.

Le concept comprend également un badge virtuel avec QR Code, susceptible d'être partagé sur les réseaux sociaux. Trois niveaux doivent rester distincts : badge public de découverte (contenus publics), badge invité (parcours sélectionné et éventuellement temporaire), badge VIP nominatif (espace personnel après authentification et contrôle des habilitations). La porte peut porter le libellé « Accès VIP », mais le statut VIP ne donne jamais automatiquement des droits d'administration ou d'accès au CRM.

Le parcours cible est : ciblage CRM → qualification et validation du segment → choix d'une destination → génération d'un QR Code de campagne ou individuel → composition du support → validation humaine du contenu et du BAT → impression/expédition → scan → page de destination → action volontaire du destinataire → mesure proportionnée → qualification des retours dans le CRM. Le publipostage QR est complémentaire à l'emailing ; son intérêt doit être comparé par un pilote limité et mesuré, sans présumer qu'il le remplace.

**Garde-fous :** un QR Code public est transférable et ne doit ouvrir que des contenus publics ou invités limités. Il n'est jamais une preuve d'identité ni une clé d'accès privé. Aucun mot de passe ou renseignement confidentiel dans le code ; références opaques, révocables et éventuellement expirables ; authentification distincte pour les espaces personnels/VIP ; habilitations minimales ; collecte et conservation des mesures limitées ; revue juridique/RGPD avant toute campagne réelle. Aucun envoi, publication ou automatisation n'est autorisé par le seul cadrage.

Le concept détaillé, son MVP, ses indicateurs, ses risques et les questions destinées aux autres IA figurent dans [Concept — Publipostage intelligent par QR Code et badge MajestiOS](CONCEPT-PUBLIPOSTAGE-QR-CODE-BADGE-VIP-2026-11-06.md).


## 10. Clarification stratégique — MajestiOS comme aspirateur à leads

### 10.1 Le produit ne se réduit pas à une source d'opportunités

Le porteur du projet résume cette dimension par l'expression : **« C'est un aspirateur à leads. »** MajestiOS doit capter des signaux, des entreprises, des contacts et des occasions commerciales provenant de sources multiples. Les appels d'offres ne sont qu'un appât, une porte d'entrée ou un prétexte possible à la découverte de l'écosystème ; ils ne constituent ni la finalité du produit ni sa définition stratégique.

En conséquence, aucun audit, prototype ou plan de réalisation ne doit ramener MajestiOS à un simple outil de rapprochement appels d'offres / sous-traitants. Les flux BOAMP et BODACC sont des canaux parmi d'autres dans un dispositif d'acquisition, de qualification et de développement commercial plus large.

### 10.2 La confiance comme point d'entrée dans l'univers commercial du client

Le porteur du projet décrit également un mécanisme relationnel : le client perçoit MajestiOS comme une puissance technologique considérable et lui fait confiance. Cette confiance ouvre la possibilité de comprendre plus largement son activité, de repérer des besoins exprimés ou latents et de faire émerger des opportunités qui dépassent le motif initial de sa venue.

Cette idée est une orientation de conception et de relation commerciale, pas une autorisation d'exploiter abusivement la confiance du client. Les opportunités proposées doivent rester pertinentes, transparentes, utiles au client et soumises aux consentements, mandats et validations requis. La confiance doit être convertie en valeur réciproque et en relation durable.

### 10.3 Conséquence pour le CRM

Le CRM est le système de capitalisation qui reçoit et organise les leads captés par les différentes portes d'entrée. Il doit permettre de conserver le contexte d'origine, la provenance, la date, le motif de détection, les enrichissements, les hypothèses, le niveau de confiance, les interactions et les suites données. Il ne doit pas supposer que chaque lead provient d'un appel d'offres ni imposer un parcours unique à toutes les sources.

La métaphore « aspirateur à leads » exprime le rôle d'acquisition transversal de MajestiOS ; elle ne signifie pas aspiration indiscriminée de données. Chaque connecteur et chaque traitement restent soumis aux conditions d'accès, aux finalités, à la minimisation, à la conformité et à la validation humaine adaptées.

**Statut :** clarification stratégique exprimée par le porteur du projet le 6 novembre 2026. À prendre en compte dans les prochains audits indépendants et dans l'évolution de la doctrine CRM. Elle ne déclare aucune nouvelle source connectée ni aucune fonctionnalité déjà opérationnelle.
